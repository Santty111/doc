import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User, Company } from '@/lib/models'
import type { Profile, Company as CompanyType } from '@/lib/types'

export async function getSession() {
  return getServerSession(authOptions)
}

export async function getProfile(): Promise<(Profile & { company: CompanyType | null }) | null> {
  const session = await getSession()
  if (!session?.user?.id) return null
  await connectDB()
  const user = await User.findById(session.user.id)
    .populate<{ company_id: CompanyType | null }>('company_id')
    .lean()
  if (!user) return null
  const u = user as {
    _id: unknown
    email: string
    full_name: string | null
    role: string
    company_id: { _id: unknown; name: string; code?: string } | null
    createdAt: Date
    updatedAt: Date
  }
  return {
    id: String(u._id),
    email: u.email,
    full_name: u.full_name,
    role: u.role as Profile['role'],
    company_id: u.company_id ? String(u.company_id._id) : null,
    created_at: u.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updated_at: u.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    company: u.company_id
      ? {
          id: String(u.company_id._id),
          name: u.company_id.name,
          code: u.company_id.code ?? '',
          created_at: '',
        }
      : null,
  }
}
