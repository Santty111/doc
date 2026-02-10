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
  if (companies.length === 0) {
    await CompanyModel.insertMany([
      { name: 'Ribel', code: 'RIB' },
      { name: 'Hiltexpoy', code: 'HIL' },
      { name: 'Interfibra', code: 'INT' },
      { name: 'Jaltextiles', code: 'JAL' },
    ])
    companies = await CompanyModel.find().sort({ name: 1 }).lean()
  }
  const companiesNormalized = (companies as { _id: string; name: string; code?: string }[]).map((c) => ({
    id: c._id,
    name: c.name,
    code: c.code ?? '',
    created_at: '',
  }))


  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar
        profile={profile as Profile & { company: Company | null }}
        companies={companiesNormalized}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          profile={profile as Profile & { company: Company | null }}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
