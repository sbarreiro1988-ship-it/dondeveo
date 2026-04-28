/**
 * staticArticles.ts
 * Artículos propios de DondeVeo con contenido completo.
 * Se usan como fallback cuando el script de Gemini aún no corrió o
 * como contenido siempre disponible en /noticias/[slug].
 */

export interface StaticArticle {
  uid:         string;
  slug:        string;
  title:       string;
  intro:       string;
  body:        string;
  conclusion:  string;
  tags:        string[];
  category:    string;
  thumbnail:   string | null;
  source:      string;
  originalUrl: string;
  publishedAt: string;
}

const now = Date.now();

export const STATIC_ARTICLES: StaticArticle[] = [
  {
    uid:        'dv-001',
    slug:       'netflix-nuevos-titulos-streaming-uruguay',
    title:      'Netflix: todo lo nuevo que llega al streaming este mes',
    intro:      'Netflix no para. Cada mes suma cientos de títulos al catálogo disponible en Uruguay, y este no es la excepción. Desde películas originales hasta documentales imperdibles, la plataforma sigue siendo la reina del streaming.',
    body:       `Netflix continúa apostando fuerte por el contenido original de habla hispana. Series producidas en España, México y Argentina están ganando cada vez más audiencia global, y Uruguay no se queda afuera de esa tendencia.

Entre las novedades más esperadas del mes se encuentran nuevas temporadas de series exitosas que ya tenían a los fans al borde de la silla. La plataforma confirmó fechas de estreno para varios títulos que venían siendo muy anticipados.

En cuanto a películas, Netflix trae una selección variada que incluye thrillers psicológicos, comedias románticas y dramas de autor. Los títulos internacionales —especialmente del cine coreano y europeo— siguen cosechando muy buenas críticas entre los suscriptores uruguayos.

Para quienes gustan del cine clásico, la plataforma también incorporó un paquete de títulos históricos que incluye joyas del cine de los 80 y 90. Una excusa perfecta para esas noches de lluvia con manta y pochoclo.`,
    conclusion: 'Si todavía no revisaste el catálogo actualizado, es el momento. En DondeVeo podés filtrar por plataforma para ver exactamente qué hay disponible en Netflix Uruguay ahora mismo.',
    tags:       ['Netflix', 'Streaming', 'Uruguay', 'Estrenos', 'Series'],
    category:   'Streaming',
    thumbnail:  null,
    source:     'DondeVeo',
    originalUrl: 'https://uru2.com',
    publishedAt: new Date(now).toISOString(),
  },
  {
    uid:        'dv-002',
    slug:       'disneyplus-catalogo-latinoamerica-hulu',
    title:      'Disney+ amplía su catálogo en Latinoamérica: lo que tenés que saber',
    intro:      'Disney+ sigue creciendo en la región. La plataforma que reúne el universo Marvel, Star Wars, National Geographic y los clásicos de Disney está sumando contenido nuevo cada semana para los suscriptores de Latinoamérica.',
    body:       `La estrategia de Disney+ para la región apunta a combinar grandes producciones de Hollywood con contenido local que conecte con las audiencias latinoamericanas. Las series originales en español están ganando terreno y ya acumulan millones de reproducciones.

El universo Marvel sigue siendo el gran motor de la plataforma. Las series de Disney+ conectadas con el MCU —que desarrollan historias de personajes secundarios o exploran líneas de tiempo alternativas— tienen una base de fans fidelísima que no falta a ningún estreno.

Star Wars, por su parte, mantiene su propio ecosistema dentro de la plataforma con contenido variado: desde series de acción hasta proyectos más contemplativos que exploran el lore del universo galáctico.

National Geographic es quizás el diferencial más subestimado de Disney+. Los documentales de naturaleza, ciencia y exploración son de primer nivel mundial y representan horas de contenido de altísima calidad para toda la familia.`,
    conclusion: 'Disney+ tiene una propuesta única que no se superpone tanto con otras plataformas. Si aún no la probaste, el catálogo disponible en Uruguay vale cada peso de la suscripción.',
    tags:       ['Disney+', 'Marvel', 'Star Wars', 'Streaming', 'Latinoamérica'],
    category:   'Streaming',
    thumbnail:  null,
    source:     'DondeVeo',
    originalUrl: 'https://uru2.com',
    publishedAt: new Date(now - 86400000).toISOString(),
  },
  {
    uid:        'dv-003',
    slug:       'max-hbo-series-temporadas-nuevas',
    title:      'Max (HBO): las series que no podés perderte este mes',
    intro:      'Max, la plataforma que fusionó HBO y Warner, consolida su posición como la casa de las series más aclamadas por la crítica. The Last of Us, House of the Dragon y una larga lista de producciones premium están disponibles en Uruguay.',
    body:       `HBO tiene una reputación ganada durante décadas: produce las series más ambiciosas, mejor escritas y más discutidas de la televisión global. Con Max, esa tradición se traslada al streaming con todo su peso.

The Last of Us marcó un antes y un después en la historia de las adaptaciones de videojuegos. La serie demostró que es posible hacer una adaptación que no solo respeta el material original sino que lo enriquece con nuevas capas dramáticas. La segunda temporada mantiene el nivel y ya genera debate en redes.

House of the Dragon continúa expandiendo el universo de Game of Thrones con una historia centrada en los Targaryen y sus dragones. La producción visual es impresionante y la política palaciana —con todas sus traiciones y alianzas— engancha desde el primer episodio.

Además de estos grandes títulos, Max tiene una biblioteca de películas de Warner Bros. que incluye estrenos recientes y clásicos del cine. La oferta de documentales también es notable, con producciones originales de HBO que exploran temas sociales con profundidad.`,
    conclusion: 'Si te gustan las series con presupuesto de película y guiones sin concesiones, Max es tu plataforma. Revisá la cartelera completa en DondeVeo para no perderte ningún estreno.',
    tags:       ['Max', 'HBO', 'The Last of Us', 'House of the Dragon', 'Series'],
    category:   'Series',
    thumbnail:  null,
    source:     'DondeVeo',
    originalUrl: 'https://uru2.com',
    publishedAt: new Date(now - 2 * 86400000).toISOString(),
  },
  {
    uid:        'dv-004',
    slug:       'prime-video-estrenos-series-peliculas',
    title:      'Prime Video: The Boys, Reacher y los estrenos más esperados',
    intro:      'Amazon Prime Video tiene una carta bajo la manga que muchos subestiman. Con series propias como The Boys y Reacher, y una biblioteca de películas que incluye estrenos recientes, la plataforma compite de igual a igual con Netflix y Max.',
    body:       `The Boys es, sin exageraciones, una de las series más originales y provocadoras de la última década. La historia de un grupo de ciudadanos comunes que se enfrenta a superhéroes corruptos funciona como una sátira brutal del capitalismo, las redes sociales y la cultura celebrity. Cada temporada sube la apuesta.

Reacher, por su parte, apuesta por el entretenimiento puro. El ex policía militar interpretado por Alan Ritchson —un hombre de acción de pocas palabras y mucho puño— protagoniza aventuras que son adictivas por su ritmo y su desparpajo. Ideal para ver en una noche sin pretensiones.

Prime Video también ha apostado por adaptaciones ambiciosas de libros populares. El señor de los anillos: Los anillos de poder representó una apuesta monumental en producción, con un presupuesto sin precedentes para una serie de televisión.

La oferta de películas de Prime Video incluye producciones originales que llegan directamente a la plataforma sin pasar por cines, lo que significa estrenos exclusivos que solo podés ver ahí.`,
    conclusion: 'Prime Video sorprende con una calidad que muchas veces pasa desapercibida. Si ya pagás Amazon Prime, estás dejando pasar contenido de primer nivel. Entrá a DondeVeo y buscá qué hay disponible en Uruguay.',
    tags:       ['Prime Video', 'The Boys', 'Reacher', 'Amazon', 'Series'],
    category:   'Streaming',
    thumbnail:  null,
    source:     'DondeVeo',
    originalUrl: 'https://uru2.com',
    publishedAt: new Date(now - 3 * 86400000).toISOString(),
  },
  {
    uid:        'dv-005',
    slug:       'paramount-plus-cine-streaming-uruguay',
    title:      'Paramount+: cine de estreno y series que no sabías que necesitabas',
    intro:      'Paramount+ es la plataforma más subestimada del mercado. Con acceso a las películas de Paramount Pictures poco después de su estreno en cines, más series originales de calidad, ofrece una propuesta que merece más atención de la que recibe.',
    body:       `El gran diferencial de Paramount+ frente a la competencia es su acceso temprano a las películas del estudio. Títulos que hace un tiempo habrían tardado meses en llegar al streaming ahora aparecen en la plataforma pocas semanas después del estreno en cines.

La saga de Misión Imposible, Transformers, y las películas del universo de Star Trek tienen un hogar natural en Paramount+. Pero más allá de las franquicias conocidas, el estudio produce películas de autor y thrillers que encuentran en la plataforma su mejor escaparate.

En cuanto a series originales, Yellowstone y su universo expandido es el gran éxito de Paramount+. La historia de la familia Dutton y su rancho en Montana conectó con millones de espectadores que quizás no se consideraban fanáticos de los westerns modernos.

1883 y 1923, las precuelas de Yellowstone, demuestran que el universo tiene profundidad narrativa para varios capítulos más. Harrison Ford protagonizando 1923 es, por sí solo, una razón para suscribirse.`,
    conclusion: 'Paramount+ tiene un catálogo más sólido de lo que la gente cree. Si te gustan el cine de acción, los westerns modernos y las series familiares con drama, esta plataforma tiene mucho para ofrecerte.',
    tags:       ['Paramount+', 'Yellowstone', 'Cine', 'Series', 'Streaming'],
    category:   'Cine',
    thumbnail:  null,
    source:     'DondeVeo',
    originalUrl: 'https://uru2.com',
    publishedAt: new Date(now - 4 * 86400000).toISOString(),
  },
  {
    uid:        'dv-006',
    slug:       'cines-uruguay-record-espectadores-2026',
    title:      'Los cines en Uruguay viven su mejor momento desde la pandemia',
    intro:      'Las salas de cine uruguayas reportan un primer trimestre de 2026 histórico. Los grandes estrenos de Hollywood combinados con una programación local más rica están devolviendo al público a las butacas en números que no se veían desde 2019.',
    body:       `El regreso del público a las salas fue gradual pero sostenido. Después de los años difíciles de la pandemia, en los que el streaming parecía haber ganado definitivamente la batalla, el cine demostró que la experiencia colectiva de ver una película en pantalla grande tiene un valor que ninguna plataforma puede reemplazar.

Los grandes tanques de Hollywood siguen siendo el principal imán del público. Franquicias como Marvel, Star Wars, Misión Imposible y Fast & Furious garantizan colas en las boleterías y salas llenas durante los primeros fines de semana. La experiencia IMAX y Dolby Atmos también contribuyen a justificar la salida.

Pero quizás el dato más interesante es el crecimiento del cine de autor y el cine latinoamericano en las salas uruguayas. Películas que antes habrían tenido una distribución marginal ahora encuentran un público más amplio, en parte gracias a la visibilidad que le dan los premios internacionales.

El cine nacional uruguayo también está viviendo un buen momento. Las producciones locales con apoyo del ICAU están ganando espacio en festivales internacionales y generando orgullo entre los espectadores uruguayos.`,
    conclusion: 'Si hace tiempo que no vas al cine, este es el momento ideal para volver. En DondeVeo te mostramos la cartelera actualizada de Uruguay para que no te pierdas ningún estreno.',
    tags:       ['Cines Uruguay', 'Cartelera', 'Estrenos', 'Montevideo', 'Cine Nacional'],
    category:   'Cine',
    thumbnail:  null,
    source:     'DondeVeo',
    originalUrl: 'https://uru2.com',
    publishedAt: new Date(now - 5 * 86400000).toISOString(),
  },
];

/** Devuelve un Map de slug → artículo para búsqueda rápida */
export function getStaticArticleBySlug(slug: string): StaticArticle | null {
  return STATIC_ARTICLES.find(a => a.slug === slug) ?? null;
}
