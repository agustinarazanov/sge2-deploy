/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import type { Adapter, AdapterAccount } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import KeycloakProvider, { type KeycloakProfile } from "next-auth/providers/keycloak";

import { env } from "@/env";
import { db } from "@/server/db";
import Credentials from "next-auth/providers/credentials";
import { api } from "@/trpc/server";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

const prismaAdapter = PrismaAdapter(db);

const CustomAdapter = {
  ...prismaAdapter,
  linkAccount: (account: AdapterAccount) => {
    delete account["not-before-policy"];
    // @ts-expect-error string not assignable to Lowecase<string>
    return prismaAdapter.linkAccount?.(account);
  },
} as Adapter;

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      const existingAccount = await db.account.findFirst({ where: { userId: user.id, provider: account?.provider } });
      if (!account || existingAccount) return true;
      const existingUser = await db.user.findUnique({ where: { email: user.email ?? undefined } });
      if (existingUser && profile) {
        delete account["not-before-policy"];
        await db.account.create({ data: { ...account, userId: existingUser.id } });
      }
      return true;
    },
    session: ({ session, token }) => {
      return { ...session, user: { ...session.user, id: token.sub } };
    },
  },
  adapter: CustomAdapter,
  providers: [
    Credentials({
      name: "domain email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "juanperez@frba.utn.edu.ar" },
      },
      async authorize(credentials) {
        if (credentials && credentials.email.split("@")[1] === "frba.utn.edu.ar") {
          const user = await db.user.findUnique({ where: { email: credentials.email } });
          return user;
        }
        return null;
      },
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
      issuer: process.env.KEYCLOAK_ISSUER,
      async profile(profile: KeycloakProfile) {
        const documentoTipo = await db.documentoTipo.findFirst({ where: { nombre: profile.documento_tipo } });
        const provincia = await db.provincia.findFirst({ where: { nombre: profile.address.region } });
        const pais = await db.pais.findFirst({ where: { nombreEspanol: profile.address.country } });
        return {
          id: profile.sub,
          name: profile.preferred_username,
          email: profile.email,
          emailVerified: profile.email_verified,
          image: profile.picture,
          nombre: profile.given_name,
          apellido: profile.family_name,
          fechaNacimiento: new Date(profile.birthdate.split("/").reverse().join("-")),
          legajo: profile.legajo?.replace("-", ""),
          direccion: profile.address.street_address,
          ciudad: profile.address.locality,
          codigoPostal: profile.address.postal_code,
          telefonoCelular: profile.phone_number,
          documentoNumero: profile.documento,
          esDocente: profile.es_docente === "Docente",
          documentoTipo: documentoTipo ? { connect: { id: documentoTipo.id } } : undefined,
          pais: pais ? { connect: { iso: pais.iso } } : undefined,
          provincia:
            provincia && pais
              ? {
                  connect: {
                    iso_paisIso: {
                      iso: provincia.iso,
                      paisIso: pais.iso,
                    },
                  },
                }
              : undefined,
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

export const tienePermiso = async (permisos: string[]) => {
  const tienePermiso = await api.permisos.usuarioTienePermisos({ permisos: permisos });
  return tienePermiso;
};

export const tienePermisoYEstaLogueado = (permisos: string[]) => {
  const session = getServerAuthSession();
  const loTiene = tienePermiso(permisos);
  const results = Promise.all([session, loTiene]);
  return results;
};
