import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models'

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { company_id } = body as { company_id: string | null }
    await connectDB()
    await User.findByIdAndUpdate(session.user.id, {
      company_id: company_id || null,
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Profile company update error:', e)
    return NextResponse.json(
      { error: 'Error al actualizar la empresa' },
      { status: 500 }
    )
  }
}
