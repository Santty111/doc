'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Search, Eye, Edit, ClipboardList, FileCheck } from 'lucide-react'
import Link from 'next/link'
import type { Worker } from '@/lib/types'

interface WorkersTableProps {
  workers: (Worker & { company?: { name: string } })[]
}

export function WorkersTable({ workers }: WorkersTableProps) {
  const [search, setSearch] = useState('')

  const filteredWorkers = workers.filter((worker) => {
    const searchLower = search.toLowerCase()
    return (
      worker.first_name.toLowerCase().includes(searchLower) ||
      worker.last_name.toLowerCase().includes(searchLower) ||
      worker.employee_code.toLowerCase().includes(searchLower) ||
      worker.department?.toLowerCase().includes(searchLower) ||
      worker.position?.toLowerCase().includes(searchLower)
    )
  })

  const getStatusBadge = (status: Worker['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-accent text-accent-foreground">Activo</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactivo</Badge>
      case 'terminated':
        return <Badge variant="destructive">Baja</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, código, departamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredWorkers.length} trabajador(es)
        </span>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Puesto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <p className="text-muted-foreground">
                    {search ? 'No se encontraron trabajadores' : 'No hay trabajadores registrados'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredWorkers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell className="font-mono text-sm">
                    {worker.employee_code}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {worker.first_name.charAt(0)}{worker.last_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{worker.first_name} {worker.last_name}</p>
                        {worker.email && (
                          <p className="text-sm text-muted-foreground">{worker.email}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{worker.company?.name || '-'}</TableCell>
                  <TableCell>{worker.department || '-'}</TableCell>
                  <TableCell>{worker.position || '-'}</TableCell>
                  <TableCell>{getStatusBadge(worker.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/trabajadores/${worker.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/trabajadores/${worker.id}/editar`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/fichas-medicas/evaluacion-1-3/nuevo?trabajador=${worker.id}`}>
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Nueva ficha 1-3
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/certificado-aptitud-oficial/nuevo?trabajador=${worker.id}`}>
                            <FileCheck className="mr-2 h-4 w-4" />
                            Nuevo cert. aptitud
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
