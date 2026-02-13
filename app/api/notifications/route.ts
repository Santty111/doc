import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/auth-server'
import { connectDB } from '@/lib/db'
import { Certificate, Worker } from '@/lib/models'

/** GET: constancias que vencen en los próximos 30 días (respeta filtro de empresa del usuario). */
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
    const certFilter =
      workerIds !== null
        ? {
            worker_id: { $in: workerIds },
            expiry_date: {
              $gte: new Date(),
              $lte: (() => {
                const d = new Date()
                d.setDate(d.getDate() + 30)
                return d
              })(),
            },
          }
        : {
            expiry_date: {
              $gte: new Date(),
              $lte: (() => {
                const d = new Date()
                d.setDate(d.getDate() + 30)
                return d
              })(),
            },
          }

    const certs = await Certificate.find(certFilter)
      .sort({ expiry_date: 1 })
      .limit(10)
      .populate('worker_id', 'first_name last_name employee_code')
      .lean()

    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const now = new Date()
    const count = await Certificate.countDocuments(
      workerIds !== null
        ? {
            worker_id: { $in: workerIds },
            expiry_date: { $gte: now, $lte: thirtyDaysFromNow },
          }
        : { expiry_date: { $gte: now, $lte: thirtyDaysFromNow } }
    )

    const expiringCertificates = (certs as { _id: unknown; expiry_date: Date; worker_id?: { first_name?: string; last_name?: string; employee_code?: string } }[]).map(
      (c) => ({
        id: String(c._id),
        workerName: c.worker_id
          ? `${c.worker_id.first_name ?? ''} ${c.worker_id.last_name ?? ''}`.trim()
          : '',
        employeeCode: c.worker_id?.employee_code ?? '',
        expiry_date: c.expiry_date instanceof Date ? c.expiry_date.toISOString() : String(c.expiry_date),
      })
    )

    return NextResponse.json({
      expiringCertificates,
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
