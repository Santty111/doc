import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'exams')

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const workerId = formData.get('workerId') as string | null
    if (!file) {
      return NextResponse.json(
        { error: 'No se envió ningún archivo' },
        { status: 400 }
      )
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = path.extname(file.name) || '.pdf'
    const safeName = `${Date.now()}${ext}`
    const dir = workerId
      ? path.join(UPLOAD_DIR, workerId)
      : UPLOAD_DIR
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true })
    }
    const filePath = path.join(dir, safeName)
    await writeFile(filePath, buffer)
    const url = workerId
      ? `/uploads/exams/${workerId}/${safeName}`
      : `/uploads/exams/${safeName}`
    return NextResponse.json({ url, fileName: file.name })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json(
      { error: 'Error al subir el archivo' },
      { status: 500 }
    )
  }
}
