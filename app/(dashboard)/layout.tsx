import React from 'react'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import type { Profile, Company } from '@/lib/types'
import { getSession, getProfile } from '@/lib/auth-server'
import { connectDB } from '@/lib/db'
import { Company as CompanyModel } from '@/lib/models'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const profile = await getProfile()
  if (!profile) {
    redirect('/auth/login')
  }

  await connectDB()
  let companies = await CompanyModel.find().sort({ name: 1 }).lean()
  const defaultCompanies = [
    { name: 'Hiltexpoy', code: 'HIL' },
    { name: 'Interfibra', code: 'INT' },
    { name: 'Jaltextiles', code: 'JAL' },
    { name: 'Ribel', code: 'RIB' },
    { name: 'Otros', code: 'OTR' },
  ]
  for (const c of defaultCompanies) {
    const exists = await CompanyModel.findOne({ name: c.name }).lean()
    if (!exists) await CompanyModel.create(c)
  }
  companies = await CompanyModel.find().sort({ name: 1 }).lean()
  const companiesNormalized: Company[] = (companies as { _id: unknown; name: string; code?: string }[]).map((c) => ({
    id: String(c._id),
    name: c.name,
    code: c.code ?? '',
    created_at: '',
  }))

  const profilePlain: Profile & { company: Company | null } = {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
    company_id: profile.company_id,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    company: profile.company,
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="print:hidden">
        <DashboardSidebar
          profile={profilePlain}
          companies={companiesNormalized}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="print:hidden">
          <DashboardHeader profile={profilePlain} />
        </div>
        <main className="flex-1 overflow-auto p-6 print:p-0">
          {children}
        </main>
      </div>
    </div>
  )
}
