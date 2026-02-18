'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MoreHorizontal, Search, Eye, Edit, FileText } from 'lucide-react'
import Link from 'next/link'
import type { MedicalRecord, Worker } from '@/lib/types'

interface MedicalRecordsTableProps {
  records: (MedicalRecord & { 
    worker: { 
      id: string
      first_name: string
      last_name: string
      employee_code: string
      company: { name: string } | null
    } | null 
  })[]
  workers: Pick<Worker, 'id' | 'first_name' | 'last_name' | 'employee_code'>[]
}

export function MedicalRecordsTable({ records, workers }: MedicalRecordsTableProps) {
  const [search, setSearch] = useState('')
  const [selectedWorker, setSelectedWorker] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredRecords = records.filter((record) => {
    const searchLower = search.toLowerCase()
    const matchesSearch = 
      record.worker?.first_name.toLowerCase().includes(searchLower) ||
      record.worker?.last_name.toLowerCase().includes(searchLower) ||
      record.worker?.employee_code.toLowerCase().includes(searchLower)
    
    const matchesWorker = !selectedWorker || selectedWorker === 'all' || record.worker_id === selectedWorker

    return matchesSearch && matchesWorker
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedWorker} onValueChange={setSelectedWorker}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrar por trabajador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los trabajadores</SelectItem>
            {workers.map((worker) => (
              <SelectItem key={worker.id} value={worker.id}>
                {worker.first_name} {worker.last_name} ({worker.employee_code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredRecords.length} expediente(s)
        </span>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trabajador</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Fecha Registro</TableHead>
              <TableHead>Tipo Sangre</TableHead>
              <TableHead>Alergias</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <p className="text-muted-foreground">
                    {search || selectedWorker ? 'No se encontraron expedientes' : 'No hay expedientes registrados'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                        {record.worker?.first_name.charAt(0)}{record.worker?.last_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{record.worker?.first_name} {record.worker?.last_name}</p>
                        <p className="text-sm text-muted-foreground">{record.worker?.employee_code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{record.worker?.company?.name || '-'}</TableCell>
                  <TableCell>
                    {new Date(record.record_date).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>{record.blood_type || '-'}</TableCell>
                  <TableCell>
                    <span className="max-w-32 truncate block">
                      {record.allergies || 'Sin alergias conocidas'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {mounted ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/expedientes/${record.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/expedientes/${record.id}/editar`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/trabajadores/${record.worker_id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver trabajador
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-hidden>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    )}
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
