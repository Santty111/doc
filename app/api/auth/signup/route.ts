import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User, hashPassword } from '@/lib/models'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, full_name, role } = body as {
      email: string
      password: string
      full_name?: string
      role?: string
    }
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }
    await connectDB()
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con ese correo' },
        { status: 400 }
      )
    }
    const hashed = await hashPassword(password)
    await User.create({
      email,
      password: hashed,
      full_name: full_name || null,
      role: role || 'viewer',
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Signup error:', e)
    return NextResponse.json(
      { error: 'Error al crear la cuenta' },
      { status: 500 }
    )
  }
}
