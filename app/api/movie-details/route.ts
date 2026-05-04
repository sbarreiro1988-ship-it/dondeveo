import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE  = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id   = searchParams.get('id');
  const type = searchParams.get('type') ?? 'movie';

  if (!id) return NextResponse.json({});

  try {
    const res = await fetch(
      `${TMDB_BASE}/${type}/${id}?language=es-419&append_to_response=credits,keywords`,
      {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return NextResponse.json({});

    const d = await res.json() as {
      tagline?: string;
      status?: string;
      original_language?: string;
      origin_country?: string[];
      budget?: number;
      revenue?: number;
      production_countries?: { name: string }[];
      spoken_languages?: { name: string }[];
      keywords?: { keywords?: { name: string }[]; results?: { name: string }[] };
      credits?: {
        crew?: { job: string; name: string; department: string }[];
        cast?: { name: string; character: string; order: number }[];
      };
      // TV specific
      created_by?: { name: string }[];
      number_of_episodes?: number;
      number_of_seasons?: number;
      networks?: { name: string }[];
      in_production?: boolean;
    };

    // Director / Creator
    const director = type === 'movie'
      ? (d.credits?.crew ?? []).find((c) => c.job === 'Director')?.name ?? null
      : (d.created_by ?? []).map((c) => c.name).join(', ') || null;

    const writers = type === 'movie'
      ? (d.credits?.crew ?? [])
          .filter((c) => c.job === 'Screenplay' || c.job === 'Writer' || c.job === 'Story')
          .slice(0, 2)
          .map((c) => c.name)
      : [];

    const keywords = [
      ...(d.keywords?.keywords ?? []),
      ...(d.keywords?.results  ?? []),
    ].slice(0, 8).map((k) => k.name);

    const country = (d.production_countries ?? d.origin_country?.map((c) => ({ name: c })) ?? [])
      .map((c) => c.name).slice(0, 2).join(', ');

    const language = (d.spoken_languages ?? []).map((l) => l.name).slice(0, 2).join(', ');

    const STATUS_MAP: Record<string, string> = {
      'Released':          'Estrenada',
      'In Production':     'En producción',
      'Post Production':   'Pos-producción',
      'Planned':           'Planeada',
      'Canceled':          'Cancelada',
      'Returning Series':  'En emisión',
      'Ended':             'Finalizada',
    };

    return NextResponse.json({
      tagline:  d.tagline || null,
      status:   STATUS_MAP[d.status ?? ''] ?? d.status ?? null,
      director,
      writers,
      country,
      language,
      budget:   d.budget && d.budget > 0 ? d.budget : null,
      revenue:  d.revenue && d.revenue > 0 ? d.revenue : null,
      networks: (d.networks ?? []).map((n) => n.name).slice(0, 3),
      keywords,
    });
  } catch {
    return NextResponse.json({});
  }
}
