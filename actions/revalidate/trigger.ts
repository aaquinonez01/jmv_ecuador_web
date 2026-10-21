// La invalidación de caché la hace el backend (RevalidationService) tras cada
// cambio, llamando a /api/revalidate con el token secreto. Desde el navegador no
// se puede: REVALIDATE_TOKEN no existe en el cliente y la petición siempre daba 401.
// Se mantiene la función para no tocar a quienes la llaman.
export async function triggerRevalidate(_input: { tags?: string[]; paths?: string[] }) {
  return { ok: true };
}
