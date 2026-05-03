import { fetchAsesoresActuales } from '@/lib/api/consejo.server'
import AsesoresNacionalesClient from './AsesoresNacionalesClient'

export default async function AsesoresNacionales() {
  const asesores = await fetchAsesoresActuales()
  return <AsesoresNacionalesClient asesores={asesores} />
}
