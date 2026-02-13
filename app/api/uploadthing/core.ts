import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const f = createUploadthing()

export const ourFileRouter = {
  /** Archivos de exámenes médicos (PDF e imágenes). Usado en formulario de exámenes. */
  examDocument: f({
    pdf: { maxFileSize: '8MB', maxFileCount: 1 },
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) throw new Error('No autorizado')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, name: file.name }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
