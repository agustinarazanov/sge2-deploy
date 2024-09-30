/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false, // TODO: Enable this once all components are updated
  swcMinify: true,
  // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
  // i18n: {
  //   locales: ["es"],
  //   defaultLocale: "es",
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/admin",
        destination: "/admin/roles",
        permanent: true,
      },
      {
        source: "/laboratorios",
        destination: "/laboratorios/mis_cursos",
        permanent: true,
      },
      {
        source: "/laboratorio_abierto",
        destination: "/laboratorio_abierto/reservar",
        permanent: true,
      },
    ];
  },
  output: "standalone",
};

export default config;
