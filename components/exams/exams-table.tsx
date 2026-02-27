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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MoreHorizontal, Search, Eye, Edit, FileDown, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { MedicalExam, Worker } from '@/lib/types'
import { EXAM_TYPES } from '@/lib/types'

interface ExamsTableProps {
  exams: (MedicalExam & { 
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

export function ExamsTable({ exams, workers }: ExamsTableProps) {
  const [search, setSearch] = useState('')
  const [selectedWorker, setSelectedWorker] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')

  const filteredExams = exams.filter((exam) => {
    const searchLower = search.toLowerCase()
    const matchesSearch = 
      exam.worker?.first_name.toLowerCase().includes(searchLower) ||
      exam.worker?.last_name.toLowerCase().includes(searchLower) ||
      exam.worker?.employee_code.toLowerCase().includes(searchLower) ||
      exam.exam_type.toLowerCase().includes(searchLower)
    
    const matchesWorker = !selectedWorker || selectedWorker === 'all' || exam.worker_id === selectedWorker
    const matchesType = !selectedType || selectedType === 'all' || exam.exam_type === selectedType

    return matchesSearch && matchesWorker && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, código o tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Tipo de examen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {EXAM_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredExams.length} examen(es)
        </span>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trabajador</TableHead>
              <TableHead>Tipo de Examen</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Laboratorio</TableHead>
              <TableHead>Archivo</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <p className="text-muted-foreground">
                    {search || selectedType ? 'No se encontraron exámenes' : 'No hay exámenes registrados'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-3/20 text-xs font-medium text-chart-3">
                        {exam.worker?.first_name.charAt(0)}{exam.worker?.last_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{exam.worker?.first_name} {exam.worker?.last_name}</p>
                        <p className="text-sm text-muted-foreground">{exam.worker?.employee_code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{exam.exam_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(exam.exam_date).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>{exam.lab_name || '-'}</TableCell>
                  <TableCell>
                    {exam.file_url ? (
                      <a 
                        href={exam.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {exam.file_name || 'Ver archivo'}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin archivo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/examenes/${exam.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/examenes/${exam.id}/editar`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        {exam.file_url && (
                          <DropdownMenuItem asChild>
                            <a href={exam.file_url} download>
                              <FileDown className="mr-2 h-4 w-4" />
                              Descargar archivo
                            </a>
                          </DropdownMenuItem>
                        )}
                        {exam.consentimiento_informado_url && (
                          <DropdownMenuItem asChild>
                            <a href={exam.consentimiento_informado_url} download>
                              <FileDown className="mr-2 h-4 w-4" />
                              Descargar consentimiento
                            </a>
                          </DropdownMenuItem>
                        )}
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
