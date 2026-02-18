import { withAuth } from 'next-auth/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname
    const token = req.nextauth.token

    // Si está logueado y visita /auth/login, redirigir al dashboard
    if (path === '/auth/login' && token) {
      const url = req.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  },
  {
    pages: { signIn: '/auth/login' },
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname
        if (path.startsWith('/auth/login')) return true
        if (path.startsWith('/dashboard')) return !!token
        return false
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/login',
  ],
}
