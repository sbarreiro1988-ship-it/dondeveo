import { redirect } from 'next/navigation';

// /novedades/ sin plataforma → redirige al hub de estrenos
export default function NovedadesIndex() {
  redirect('/estrenos');
}
