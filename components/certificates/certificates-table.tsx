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
import { Badge } from '@/components/ui/badge'
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
import { MoreHorizontal, Search, Eye, Edit, FileDown, Printer } from 'lucide-react'
import Link from 'next/link'
import type { Certificate, Worker } from '@/lib/types'
import { CERTIFICATE_TYPE_LABELS, CERTIFICATE_RESULT_LABELS } from '@/lib/types'

interface CertificatesTableProps {
  certificates: (Certificate & { 
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

export function CertificatesTable({ certificates, workers }: CertificatesTableProps) {
  const [search, setSearch] = useState('')
  const [selectedWorker, setSelectedWorker] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedResult, setSelectedResult] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredCertificates = certificates.filter((cert) => {
    const searchLower = search.toLowerCase()
    const matchesSearch = 
      cert.worker?.first_name.toLowerCase().includes(searchLower) ||
      cert.worker?.last_name.toLowerCase().includes(searchLower) ||
      cert.worker?.employee_code.toLowerCase().includes(searchLower)
    
    const matchesWorker = !selectedWorker || selectedWorker === 'all' || cert.worker_id === selectedWorker
    const matchesType = !selectedType || selectedType === 'all' || cert.certificate_type === selectedType
    const matchesResult = !selectedResult || selectedResult === 'all' || cert.result === selectedResult

    return matchesSearch && matchesWorker && matchesType && matchesResult
  })

  const getResultBadge = (result: Certificate['result']) => {
    switch (result) {
      case 'apto':
        return <Badge className="bg-accent text-accent-foreground">Apto</Badge>
      case 'apto_con_restricciones':
        return <Badge className="bg-warning text-warning-foreground">Con Restricciones</Badge>
      case 'no_apto':
        return <Badge variant="destructive">No Apto</Badge>
      case 'pendiente':
        return <Badge variant="secondary">Pendiente</Badge>
      default:
        return null
    }
  }

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return new Date(expiryDate) <= thirtyDaysFromNow && new Date(expiryDate) >= new Date()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="ingreso">Ingreso</SelectItem>
            <SelectItem value="periodico">Periódico</SelectItem>
            <SelectItem value="egreso">Egreso</SelectItem>
            <SelectItem value="especial">Especial</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedResult} onValueChange={setSelectedResult}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Resultado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="apto">Apto</SelectItem>
            <SelectItem value="apto_con_restricciones">Con Restricciones</SelectItem>
            <SelectItem value="no_apto">No Apto</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredCertificates.length} constancia(s)
        </span>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trabajador</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha Emisión</TableHead>
              <TableHead>Vigencia</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead>Médico</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCertificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <p className="text-muted-foreground">
                    {search || selectedType || selectedResult ? 'No se encontraron constancias' : 'No hay constancias registradas'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredCertificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {cert.worker?.first_name.charAt(0)}{cert.worker?.last_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{cert.worker?.first_name} {cert.worker?.last_name}</p>
                        <p className="text-sm text-muted-foreground">{cert.worker?.employee_code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {CERTIFICATE_TYPE_LABELS[cert.certificate_type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(cert.issue_date).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>
                    {cert.expiry_date ? (
                      <span className={
                        isExpired(cert.expiry_date) 
                          ? 'text-destructive font-medium' 
                          : isExpiringSoon(cert.expiry_date)
                            ? 'text-warning font-medium'
                            : ''
                      }>
                        {new Date(cert.expiry_date).toLocaleDateString('es-MX')}
                        {isExpired(cert.expiry_date) && ' (Vencida)'}
                        {isExpiringSoon(cert.expiry_date) && ' (Por vencer)'}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Sin vigencia</span>
                    )}
                  </TableCell>
                  <TableCell>{getResultBadge(cert.result)}</TableCell>
                  <TableCell>
                    {cert.doctor_name || '-'}
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
                          <Link href={`/dashboard/constancias/${cert.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/constancias/${cert.id}/editar`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/constancias/${cert.id}/pdf`}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Descargar PDF
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/constancias/${cert.id}/imprimir`}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
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
