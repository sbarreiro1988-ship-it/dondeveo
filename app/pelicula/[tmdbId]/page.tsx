/**
 * Redirect page: /pelicula/[tmdbId] → /pelicula/movie/[tmdbId]
 *
 * Google indexó URLs con el formato viejo (sin /type/).
 * Esta página las redirige con 301 al nuevo formato correcto.
 * Si el ID pertenece a una serie, el fetch en /pelicula/movie/[id] falla
 * y el usuario ve 404, pero eso es correcto — las series usan /tv/.
 */
import { redirect } from 'next/navigation';

interface Props {
  params: { tmdbId: string };
}

export default function PeliculaRedirect({ params }: Props) {
  // Redirect 301 permanente al nuevo formato
  redirect(`/pelicula/movie/${params.tmdbId}`);
}
