import 'next-auth'

declare module 'next-auth' {
  interface User {
    id?: string
    role?: string
    company_id?: string | null
  }

  interface Session {
    user: {
      id?: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string
      company_id?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
    company_id?: string | null
  }
}
