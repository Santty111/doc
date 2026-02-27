import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/auth-server'
import { connectDB } from '@/lib/db'
import { CertificadoAptitudOficial, Worker } from '@/lib/models'

/** GET: certificados de aptitud oficiales recientes (respeta filtro de empresa del usuario). */
export async function GET() {
  try {
    const profile = await getProfile()
    if (!profile?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    await connectDB()

    const workerFilter = profile.company_id ? { company_id: profile.company_id } : {}
    const workerIds = profile.company_id
      ? await Worker.find(workerFilter).distinct('_id')
      : null
    const workerIdStrings = workerIds?.map((id) => String(id)) ?? []
    const certFilter =
      workerIds !== null
        ? {
            $or: [
              { worker_id: { $in: workerIds } },
              { worker_id: { $in: workerIdStrings } },
              { 'worker_snapshot.worker_id': { $in: workerIdStrings } },
            ],
          }
        : {}

    const certs = await CertificadoAptitudOficial.find(certFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('worker_id', 'first_name last_name employee_code')
      .lean()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const count = await CertificadoAptitudOficial.countDocuments({
      ...certFilter,
      createdAt: { $gte: thirtyDaysAgo },
    })

    const recentCertificates = (certs as { _id: unknown; createdAt: Date; worker_id?: { first_name?: string; last_name?: string; employee_code?: string } }[]).map(
      (c) => ({
        id: String(c._id),
        workerName: c.worker_id
          ? `${c.worker_id.first_name ?? ''} ${c.worker_id.last_name ?? ''}`.trim()
          : '',
        employeeCode: c.worker_id?.employee_code ?? '',
        created_at: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
      })
    )

    return NextResponse.json({
      recentCertificates,
      count,
    })
  } catch (e) {
    console.error('Notifications API error:', e)
    return NextResponse.json(
      { error: 'Error al cargar notificaciones' },
      { status: 500 }
    )
  }
}
