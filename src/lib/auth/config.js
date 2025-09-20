// Temporary NextAuth config without database - you can implement API routes later
export const authOptions = {
  providers: [
    // Temporarily disabled until you implement the API routes
    // You can uncomment and implement these later
    /*
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // TODO: Implement your authentication logic here
        // This will connect to your API routes when you create them
        return null
      }
    })
    */
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.emailVerified = token.emailVerified
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development'
}
