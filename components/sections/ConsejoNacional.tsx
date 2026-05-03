import { fetchConsejoActual } from '@/lib/api/consejo.server'
import ConsejoNacionalClient from './ConsejoNacionalClient'

export default async function ConsejoNacional() {
  const period = await fetchConsejoActual()
  return <ConsejoNacionalClient period={period} />
}
