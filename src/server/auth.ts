/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import KeycloakProvider, { type KeycloakProfile } from "next-auth/providers/keycloak";

import { env } from "@/env";
import { db } from "@/server/db";
import Credentials from "next-auth/providers/credentials";

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
  linkAccount: (account) => {
    delete account["not-before-policy"];
    if (prismaAdapter.linkAccount) {
      return prismaAdapter.linkAccount(account as Parameters<typeof prismaAdapter.linkAccount>[0]);
    }
    throw new Error("linkAccount method is undefined in prismaAdapter");
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

      const existingUser = await db.user.findUnique({
        where: { email: user.email ?? undefined },
      });

      if (existingUser) {
        delete account["not-before-policy"];
        await db.account.create({
          data: { ...account, userId: existingUser.id },
        });
        if (profile?.image) {
          await db.user.update({
            where: { id: existingUser.id },
            data: { image: profile.image },
          });
        }
      }
      return true;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: { ...session.user, id: token.sub },
      };
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
        return {
          id: profile.sub,
          name: profile.preferred_username,
          email: profile.email,
          emailVerified: profile.email_verified,
          image: profile.picture,
          nombre: profile.given_name,
          apellido: profile.family_name,
          fechaNacimiento: new Date(profile.birthdate),
          legajo: profile.legajo,
          direccion: profile.address.street_address,
          ciudad: profile.address.locality,
          codigoPostal: profile.address.postal_code,
          telefonoCelular: profile.phone_number,
          documentoNumero: profile.documento,
          esDocente: profile.es_docente,
          documentoTipo: {
            connect: {
              id: (await db.documentoTipo.findFirst({ where: { nombre: profile.documento_tipo } }))?.id,
            },
          },
          provincia: {
            connect: {
              iso_paisIso: {
                iso: (await db.provincia.findFirst({ where: { nombre: profile.address.region } }))?.iso,
                paisIso: profile.address.country,
              },
            },
          },
          pais: {
            connect: {
              iso: profile.address.country,
            },
          },
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
