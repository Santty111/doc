import { redirect } from 'next/navigation'

export default async function ConstanciaImprimirPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/dashboard/constancias/${id}/pdf?print=1`)
}
