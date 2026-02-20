'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Profile, Company } from '@/lib/types'
import {
  Users,
  FileText,
  Award,
  FileCheck,
  TestTube,
  BarChart3,
  Building2,
  Home,
  Settings,
  LogOut,
  Heart,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'

interface SidebarProps {
  profile: Profile & { company: Company | null }
  companies: Company[]
}

/** Valor usado en el Select para "Todas"; no puede ser '' por limitación de Radix. */
const COMPANY_FILTER_ALL = '__all__'

const navigation = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Trabajadores', href: '/dashboard/trabajadores', icon: Users },
  { name: 'Expedientes Médicos', href: '/dashboard/expedientes', icon: FileText },
  { name: 'Constancias', href: '/dashboard/constancias', icon: Award },
  {
    name: 'Cert. Aptitud Oficial',
    href: '/dashboard/certificado-aptitud-oficial',
    icon: FileCheck,
  },
  { name: 'Exámenes', href: '/dashboard/examenes', icon: TestTube },
  { name: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
]

export function DashboardSidebar({ profile, companies }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(
    profile.company_id ?? COMPANY_FILTER_ALL
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/auth/login')
    router.refresh()
  }

  const handleCompanyChange = async (companyId: string) => {
    setSelectedCompany(companyId)
    await fetch('/api/profile/company', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: companyId === COMPANY_FILTER_ALL ? null : companyId,
      }),
    })
    router.refresh()
  }

  return (
    <aside className="flex w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Heart className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">MediControl</span>
          <span className="text-xs text-sidebar-foreground/70">
            Salud Ocupacional
          </span>
        </div>
      </div>

      <div className="p-4">
        <label className="mb-2 block text-xs font-medium text-sidebar-foreground/70">
          Empresa
        </label>
        {!mounted ? (
          <div
            className="h-10 w-full rounded-md border border-sidebar-border bg-sidebar-accent px-3 py-2 text-sm text-sidebar-foreground/70"
            aria-hidden
          >
            {selectedCompany === COMPANY_FILTER_ALL
              ? 'Todas'
              : companies.find((c) => c.id === selectedCompany)?.name ?? 'Seleccionar empresa'}
          </div>
        ) : (
          <Select value={selectedCompany} onValueChange={handleCompanyChange}>
            <SelectTrigger className="w-full border-sidebar-border bg-sidebar-accent text-sidebar-foreground">
              <SelectValue placeholder="Seleccionar empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={COMPANY_FILTER_ALL}>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Todas
                </div>
              </SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {company.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="mb-3 flex items-center gap-3 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium">
            {profile.full_name?.charAt(0) ||
              profile.email?.charAt(0) ||
              'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {profile.full_name || 'Usuario'}
            </p>
            <p className="truncate text-xs capitalize text-sidebar-foreground/70">
              {profile.role}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <Link
            href="/dashboard/configuracion"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <Settings className="h-4 w-4" />
            Configuración
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  )
}
