import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import ORCIDProvider from 'next-auth/providers/orcid';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorizationUrl: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      redirectUrl: 'http://localhost:3000/api/auth/callback/linkedin',
      
      scope: 'r_liteprofile%20r_emailaddress',
    

    }),
    // OAuthProvider({
    //     id: 'orcid',
    //     name: 'ORCID',
    //     authorization: 'https://orcid.org/oauth/authorize',
    //     token: 'https://orcid.org/oauth/token',
    //     clientId: process.env.ORCID_CLIENT_ID,
    //     clientSecret: process.env.ORCID_CLIENT_SECRET,
    //     scope: 'read-public',
    //     async profile(profile) {
    //       return {
    //         id: profile.orcid,
    //         name: profile.name,
    //         email: profile.email,
    //       };
    //     },
    //   }),
    // ],
    ORCIDProvider({
      clientId: process.env.ORCID_CLIENT_ID,
      clientSecret: process.env.ORCID_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      return baseUrl + '/dashboard';
    },
  },
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);
