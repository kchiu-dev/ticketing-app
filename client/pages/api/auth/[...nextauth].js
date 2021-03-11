import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
    }),
  ],
  jwt: {
    secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  },
  session: {
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
});
