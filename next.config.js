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
    domains: ["avatars.githubusercontent.com", "cdn.discordapp.com", "lh3.googleusercontent.com"],
  },
};

export default config;
