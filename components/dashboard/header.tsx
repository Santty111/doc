'use client'

import { Bell, Search, FileCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Profile, Company } from '@/lib/types'

interface HeaderProps {
  profile: Profile & { company: Company | null }
}

interface NotificationItem {
  id: string
  workerName: string
  employeeCode: string
  created_at: string
}

export function DashboardHeader({ profile }: HeaderProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [notifications, setNotifications] = useState<{
    recentCertificates: NotificationItem[]
    count: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => (res.ok ? res.json() : { recentCertificates: [], count: 0 }))
      .then((data) => setNotifications(data))
      .catch(() => setNotifications({ recentCertificates: [], count: 0 }))
  }, [])

  const count = notifications?.count ?? 0
  const items = notifications?.recentCertificates ?? []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = search.trim()
    if (!q) return
    router.push(`/dashboard/busqueda?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <form className="relative" onSubmit={handleSearch}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar trabajadores, fichas, certificados..."
            className="w-80 pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        {profile.company && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {profile.company.name}
          </span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild id="dashboard-notifications-trigger">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Notificaciones
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {count === 0 ? (
              <div className="px-2 py-3 text-sm text-muted-foreground">
                No hay certificados recientes en los últimos 30 días
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <DropdownMenuItem key={item.id} asChild>
                    <Link
                      href={`/dashboard/certificado-aptitud-oficial/${item.id}/imprimir`}
                      className="flex flex-col items-start gap-0.5 py-2"
                    >
                      <span className="font-medium">{item.workerName || 'Sin nombre'}</span>
                      <span className="text-xs text-muted-foreground">
                        Creado: {new Date(item.created_at).toLocaleDateString('es-MX')}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Ver todas en el inicio</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
