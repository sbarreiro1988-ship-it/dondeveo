/**
 * sportsApi.ts
 * Primary: TheSportsDB (free, no key, real current data)
 * Fallback: API-Football v3 (requires key)
 */

import { PLATFORMS, SPORT_EVENTS } from './mockData';
import type { SportEvent, Platform } from '@/types';

// ─── TheSportsDB ──────────────────────────────────────────────────────────────
const SPORTSDB = 'https://www.thesportsdb.com/api/v1/json/3';

// League IDs in TheSportsDB
const SPORTSDB_LEAGUES: Array<{ id: number; name: string; isUY: boolean; platforms: Platform[] }> = [
  { id: 4792, name: 'Uruguay Primera División', isUY: true,  platforms: [PLATFORMS.vtv, PLATFORMS.tenfield] },
  { id: 4417, name: 'Copa Libertadores',         isUY: false, platforms: [PLATFORMS.espn, PLATFORMS.dgo] },
  { id: 4480, name: 'UEFA Champions League',     isUY: false, platforms: [PLATFORMS.max, PLATFORMS.espn] },
  { id: 4328, name: 'Premier League',            isUY: false, platforms: [PLATFORMS.espn, PLATFORMS.starplus] },
  { id: 4335, name: 'La Liga',                   isUY: false, platforms: [PLATFORMS.espn, PLATFORMS.dgo] },
  { id: 4332, name: 'Serie A',                   isUY: false, platforms: [PLATFORMS.espn, PLATFORMS.dgo] },
  { id: 4406, name: 'Argentina Liga Profesional',isUY: false, platforms: [PLATFORMS.espn, PLATFORMS.dgo] },
  { id: 4334, name: 'Ligue 1',                   isUY: false, platforms: [PLATFORMS.espn] },
  { id: 4331, name: 'Bundesliga',                isUY: false, platforms: [PLATFORMS.espn, PLATFORMS.dgo] },
];

interface SDBEvent {
  idEvent:          string;
  strEvent:         string;
  strLeague:        string;
  idLeague:         string;
  dateEvent:        string;
  strTime:          string;
  intHomeScore:     string | null;
  intAwayScore:     string | null;
  strHomeTeam:      string;
  strAwayTeam:      string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  strLeagueBadge?:  string;
  strStatus?:       string;
  strTimestamp?:    string;
}

interface SDBResponse {
  events: SDBEvent[] | null;
}

function toUYTime(dateStr: string, timeStr: string): string {
  // TheSportsDB returns UTC time — convert to UYT (UTC-3)
  if (!timeStr || timeStr === '00:00:00') return '';
  try {
    const dt = new Date(`${dateStr}T${timeStr}Z`);
    return dt.toLocaleTimeString('es-UY', {
      hour: '2-digit', minute: '2-digit',
      timeZone: 'America/Montevideo', hour12: false,
    });
  } catch { return timeStr.slice(0, 5); }
}

function toUYDate(dateStr: string, timeStr: string): string {
  // Correct date when converting from UTC to UYT (might shift a day)
  if (!timeStr || timeStr === '00:00:00') return dateStr;
  try {
    const dt = new Date(`${dateStr}T${timeStr}Z`);
    return dt.toLocaleDateString('en-CA', { timeZone: 'America/Montevideo' }); // YYYY-MM-DD
  } catch { return dateStr; }
}

function mapSDB(ev: SDBEvent, meta: typeof SPORTSDB_LEAGUES[number]): SportEvent {
  const dateUY  = toUYDate(ev.dateEvent, ev.strTime);
  const timeUY  = toUYTime(ev.dateEvent, ev.strTime);
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Montevideo' });
  const isToday  = dateUY === todayStr;

  const hasScore = ev.intHomeScore !== null && ev.intHomeScore !== '' &&
                   ev.intAwayScore !== null && ev.intAwayScore !== '';
  const score = hasScore ? `${ev.intHomeScore} - ${ev.intAwayScore}` : undefined;

  // Status: if today + has score → probably live or finished today
  const isLive = isToday && hasScore && (ev.strStatus === 'Match Finished' ? false : hasScore);

  return {
    id:          parseInt(ev.idEvent) || Math.random() * 100000,
    title:       ev.strEvent,
    sport:       'football',
    league:      meta.name,
    leagueLogo:  ev.strLeagueBadge,
    teamA:       ev.strHomeTeam,
    teamB:       ev.strAwayTeam,
    logoA:       ev.strHomeTeamBadge,
    logoB:       ev.strAwayTeamBadge,
    date:        dateUY,
    time:        timeUY,
    timezone:    'UYT',
    platforms:   meta.platforms,
    isLive,
    thumbnailPath: ev.strLeagueBadge ?? '',
    isUruguay:   meta.isUY,
    score,
    status:      ev.strStatus,
  };
}

async function fetchSDBLeague(league: typeof SPORTSDB_LEAGUES[number]): Promise<SportEvent[]> {
  try {
    // Fetch next 5 upcoming events
    const [nextRes, pastRes] = await Promise.all([
      fetch(`${SPORTSDB}/eventsnextleague.php?id=${league.id}`, { next: { revalidate: 900 } }),
      fetch(`${SPORTSDB}/eventspastleague.php?id=${league.id}`, { next: { revalidate: 900 } }),
    ]);

    const nextData: SDBResponse = nextRes.ok ? await nextRes.json() : { events: null };
    const pastData: SDBResponse = pastRes.ok ? await pastRes.json() : { events: null };

    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Montevideo' });

    const events: SportEvent[] = [];

    // Past events: only show TODAY's games (with scores)
    for (const ev of pastData.events ?? []) {
      const dateUY = toUYDate(ev.dateEvent, ev.strTime);
      if (dateUY === todayStr) {
        events.push(mapSDB(ev, league));
      }
    }

    // Next events: upcoming
    for (const ev of nextData.events ?? []) {
      events.push(mapSDB(ev, league));
    }

    return events;
  } catch { return []; }
}

// ─── API-Football fallback ────────────────────────────────────────────────────
const API_KEY   = process.env.API_FOOTBALL_KEY ?? '';
const AF_BASE   = 'https://v3.api-football.com';

const AF_LEAGUES = new Set([268, 307, 13, 14, 2, 3, 39, 140, 135, 128, 71]);
const LIVE_ST   = new Set(['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE']);
const SKIP_ST   = new Set(['FT', 'AET', 'PEN', 'AWD', 'WO', 'CANC', 'ABD', 'PST', 'INT']);

async function fetchAF(date: string): Promise<SportEvent[]> {
  if (!API_KEY) return [];
  try {
    const res = await fetch(
      `${AF_BASE}/fixtures?date=${date}&timezone=America%2FMontevideo`,
      { headers: { 'x-apisports-key': API_KEY }, next: { revalidate: 900 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (data.errors && Object.keys(data.errors).length > 0) return [];

    return (data.response ?? [])
      .filter((f: any) => AF_LEAGUES.has(f.league.id) && !SKIP_ST.has(f.fixture.status.short))
      .map((f: any): SportEvent => {
        const isLive = LIVE_ST.has(f.fixture.status.short);
        const isUY   = [268, 307].includes(f.league.id);
        return {
          id:          f.fixture.id,
          title:       `${f.teams.home.name} vs ${f.teams.away.name}`,
          sport:       'football',
          league:      f.league.name,
          leagueLogo:  f.league.logo,
          teamA:       f.teams.home.name,
          teamB:       f.teams.away.name,
          logoA:       f.teams.home.logo,
          logoB:       f.teams.away.logo,
          date:        new Date(f.fixture.date).toLocaleDateString('en-CA', { timeZone: 'America/Montevideo' }),
          time:        new Date(f.fixture.date).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Montevideo', hour12: false }),
          timezone:    'UYT',
          platforms:   isUY ? [PLATFORMS.vtv, PLATFORMS.tenfield] : [PLATFORMS.espn, PLATFORMS.dgo],
          isLive,
          thumbnailPath: f.league.logo,
          isUruguay:   isUY,
          score:       f.goals.home !== null ? `${f.goals.home} - ${f.goals.away}` : undefined,
          liveMinute:  f.fixture.status.elapsed ?? undefined,
          status:      f.fixture.status.short,
        };
      });
  } catch { return []; }
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function fetchSportEvents(): Promise<SportEvent[]> {
  // 1️⃣ Try TheSportsDB (free, no key needed)
  const sdbResults = await Promise.all(SPORTSDB_LEAGUES.map(fetchSDBLeague));
  const sdbEvents  = sdbResults.flat();

  if (sdbEvents.length > 0) {
    const seen = new Set<number>();
    const unique: SportEvent[] = [];
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Montevideo' });

    for (const e of sdbEvents) {
      if (!seen.has(e.id)) {
        seen.add(e.id);
        unique.push(e);
      }
    }

    // Sort: today first (with scores = live/finished today), then upcoming by date/time
    unique.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      if (a.date === todayStr && b.date !== todayStr) return -1;
      if (a.date !== todayStr && b.date === todayStr) return 1;
      if (a.isUruguay && !b.isUruguay) return -1;
      if (!a.isUruguay && b.isUruguay) return 1;
      return (a.date + a.time).localeCompare(b.date + b.time);
    });

    return unique.slice(0, 20);
  }

  // 2️⃣ Try API-Football
  const today    = new Date();
  const fmt      = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: 'America/Montevideo' });
  const afResults = await Promise.all([
    fetchAF(fmt(today)),
    fetchAF(fmt(new Date(today.getTime() + 86400000))),
    fetchAF(fmt(new Date(today.getTime() + 2 * 86400000))),
  ]);
  const afEvents = afResults.flat();
  if (afEvents.length > 0) return afEvents.slice(0, 20);

  // 3️⃣ Mock fallback
  return SPORT_EVENTS.filter(e => e.sport === 'football');
}
