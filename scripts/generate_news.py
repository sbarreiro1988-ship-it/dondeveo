#!/usr/bin/env python3
"""
DondeVeo — Generador automático de noticias con Gemini
=======================================================
Lee RSS de fuentes de cine/streaming, reescribe con Gemini en español
rioplatense y guarda los artículos como JSON en una carpeta pública del servidor.

Uso:
    python3 generate_news.py

Cron (cada hora):
    0 * * * * /usr/bin/python3 /home/surastre/scripts/generate_news.py >> /home/surastre/logs/noticias.log 2>&1
"""

import os
import json
import hashlib
import time
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import feedparser
import requests

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN — editar antes de subir al servidor
# ═══════════════════════════════════════════════════════════════════════════════

GROQ_API_KEY = "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"

# Carpeta en cPanel donde se guardan los JSON (debe ser pública, dentro de public_html)
# Ejemplo: /home/sbarreiro/public_html/dondeveo-news
OUTPUT_DIR = Path("/home/surastre/public_html/dondeveo-news")

# Máximo de artículos a mantener en el índice (los más nuevos)
MAX_ARTICLES = 100000  # Acumular para SEO — prácticamente ilimitado (15GB libres en hosting)

# Artículos nuevos máximos por ejecución (para no agotar la cuota de Gemini)
MAX_NEW_PER_RUN = 8

# Fuentes RSS — cine y streaming en español
RSS_FEEDS = [
    # ── Fuentes en inglés primero — actores, directores, plataformas mundiales
    "https://variety.com/feed/",
    "https://deadline.com/feed/",
    "https://www.hollywoodreporter.com/feed/",
    "https://collider.com/feed/",
    "https://screenrant.com/feed/",

    # ── Cine y streaming en español ──────────────────────────────────────────
    "https://www.sensacine.com/rss/noticias-cine.xml",
    "https://www.espinof.com/rss",
    "https://www.fotogramas.es/feed/",
    "https://www.20minutos.es/rss/cine/",
    "https://www.clarin.com/rss/espectaculos/",
]

# ═══════════════════════════════════════════════════════════════════════════════

def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


def make_slug(text: str, uid: str) -> str:
    """Convierte un título en slug URL-amigable."""
    t = text.lower().strip()
    for a, b in [("á","a"),("à","a"),("ä","a"),("é","e"),("è","e"),("ë","e"),
                 ("í","i"),("ì","i"),("ï","i"),("ó","o"),("ò","o"),("ö","o"),
                 ("ú","u"),("ù","u"),("ü","u"),("ñ","n"),("ç","c")]:
        t = t.replace(a, b)
    t = re.sub(r"[^a-z0-9\s-]", "", t)
    t = re.sub(r"[\s_-]+", "-", t).strip("-")
    return f"{t[:70].rstrip('-')}-{uid}"


def article_uid(url: str) -> str:
    """ID único basado en la URL original."""
    return hashlib.md5(url.encode()).hexdigest()[:8]


def clean_html(text: str) -> str:
    """Elimina etiquetas HTML y entidades básicas."""
    text = re.sub(r"<[^>]+>", " ", text)
    for ent, char in [("&amp;","&"),("&lt;","<"),("&gt;",">"),
                      ("&nbsp;"," "),("&quot;",'"'),("&#39;","'")]:
        text = text.replace(ent, char)
    return re.sub(r"\s+", " ", text).strip()


def is_relevant(title: str) -> bool:
    """Filtra noticias que no son de cine/streaming/actores."""
    title_lower = title.lower()
    # Excluir política, deportes, economía, música
    blocklist = [
        # Política y economía
        "gobierno", "política", "economía", "banco", "inflación", "dolar",
        "peso", "elecciones", "ministerio", "presidente", "senado",
        # Deportes
        "fútbol", "futbol", "tenis", "basket", "rugby", "cricket", "golf",
        "formula 1", "nfl", "nba", "mlb", "fifa", "mundial",
        # Música (no es el foco del sitio)
        "canción", "cancion", "álbum", "album", "tour ", " gira", "concierto",
        "spotify", "grammy", "billboard", "banda ", "cantante", "singer",
        "música", "musica", "reggaeton", "trap", "rapper", "dj ",
        "taylor swift", "bad bunny", "shakira", "ed sheeran", "beyonce",
        # Reality / farándula sin interés cinematográfico
        "gran hermano", "rating del", "bachelor",
    ]
    return not any(b in title_lower for b in blocklist)


# ─── Gemini ───────────────────────────────────────────────────────────────────

def rewrite_with_groq(title: str, summary: str, source: str) -> dict:
    """Llama a Groq API para reescribir el artículo de forma original y extensa."""
    prompt = (
        "Sos redactor senior de DondeVeo, una guia de streaming y cine independiente de Uruguay.\n\n"
        "REGLAS ESTRICTAS — OBLIGATORIO CUMPLIR:\n"
        "1. NUNCA inventes datos, fechas, nacionalidades, nombres o hechos que no esten en el resumen.\n"
        "2. NUNCA cambies la nacionalidad de personas.\n"
        "3. Si el articulo esta en ingles, TRADUCILO completamente al espanol rioplatense.\n"
        "4. Usa tuteo rioplatense (vos, tenes, mira) — informal pero profesional.\n"
        "5. Da OPINION editorial: que significa esta noticia para el espectador uruguayo, contexto de la industria.\n"
        "6. NO repitas ideas. Cada parrafo debe agregar informacion NUEVA y especifica.\n\n"
        "TAREA: Articulo periodistico con voz editorial en espanol rioplatense. MINIMO 700 palabras.\n"
        "El body debe tener 5-7 parrafos DISTINTOS:\n"
        "  P1: contexto del tema (quien es, por que importa en la industria)\n"
        "  P2: desarrollo de la noticia con todos los detalles disponibles\n"
        "  P3: impacto en el mercado de streaming o cine\n"
        "  P4: perspectiva especifica para el espectador de Uruguay/Argentina\n"
        "  P5+: antecedentes, trabajos anteriores, opinion editorial, que esperar\n\n"
        "Titulo original: " + title + "\n"
        "Resumen: " + summary[:1500] + "\n"
        "Fuente: " + source + "\n\n"
        "Devolvé UNICAMENTE un objeto JSON valido (sin markdown, sin bloques de codigo) con esta estructura:\n"
        '{"title":"titulo periodistico atractivo en espanol maximo 90 chars",'
        '"intro":"parrafo introductorio con contexto y datos clave (100-120 palabras)",'
        '"body":"5-7 parrafos extensos y DISTINTOS separados por \\n\\n. Minimo 80 palabras por parrafo. Total MINIMO 500 palabras.",'
        '"conclusion":"reflexion editorial o pregunta que invita al lector (40-60 palabras)",'
        '"tags":["tag1","tag2","tag3","tag4","tag5"],'
        '"category":"Streaming o Cine o Estrenos segun corresponda"}'
    )

    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": "Bearer " + GROQ_API_KEY,
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.4,
                "max_tokens": 2048,
            },
            timeout=45,
        )
        resp.raise_for_status()
        text = resp.json()["choices"][0]["message"]["content"].strip()
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
        # Eliminar caracteres de control que rompen el parser JSON
        text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", text)
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            # Segundo intento: reemplazar saltos de línea dentro de strings
            text2 = re.sub(r':\s*"(.*?)"(?=[,}])', lambda m: ': "' + m.group(1).replace('\n', ' ').replace('\r', '') + '"', text, flags=re.DOTALL)
            data = json.loads(text2)
        if not all(k in data for k in ("title", "intro", "body", "conclusion")):
            log("  WARNING: respuesta JSON incompleta")
            return None
        return data
    except json.JSONDecodeError as e:
        log("  WARNING: JSON invalido: " + str(e))
        return None
    except Exception as e:
        log("  ERROR Groq: " + str(e))
        return None


# ─── Persistencia ─────────────────────────────────────────────────────────────

def load_index(output_dir: Path) -> dict:
    idx_file = output_dir / "index.json"
    if idx_file.exists():
        try:
            return json.loads(idx_file.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {"articles": [], "updatedAt": ""}


def save_index(output_dir: Path, data: dict):
    data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    (output_dir / "index.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def save_article(articles_dir: Path, article: dict):
    path = articles_dir / f"{article['slug']}.json"
    path.write_text(json.dumps(article, ensure_ascii=False, indent=2), encoding="utf-8")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    log("=" * 60)
    log("DondeVeo — Generador de noticias iniciado")

    # Preparar carpetas
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    articles_dir = OUTPUT_DIR / "articles"
    articles_dir.mkdir(exist_ok=True)

    # Cargar índice existente
    index = load_index(OUTPUT_DIR)
    existing_uids = {a["uid"] for a in index["articles"]}
    log(f"Artículos existentes: {len(index['articles'])}")

    new_articles = []
    processed = 0

    for feed_url in RSS_FEEDS:
        if processed >= MAX_NEW_PER_RUN:
            break
        try:
            log(f"\n📡 Leyendo: {feed_url}")
            feed = feedparser.parse(feed_url, request_headers={"User-Agent": "DondeVeoBot/1.0"})
            log(f"   {len(feed.entries)} entradas encontradas")

            for entry in feed.entries[:6]:
                if processed >= MAX_NEW_PER_RUN:
                    break

                url = entry.get("link", "").strip()
                title_raw = clean_html(entry.get("title", ""))
                if not url or not title_raw:
                    continue
                if not is_relevant(title_raw):
                    continue

                # Filtrar artículos viejos (más de 30 días)
                pub_raw = entry.get("published", "")
                if pub_raw:
                    try:
                        import email.utils
                        pub_ts = email.utils.parsedate_to_datetime(pub_raw)
                        age_days = (datetime.now(timezone.utc) - pub_ts).days
                        if age_days > 30:
                            log(f"   ⏭  Muy viejo ({age_days}d): {title_raw[:40]}")
                            continue
                    except Exception:
                        pass

                uid = article_uid(url)
                if uid in existing_uids:
                    log(f"   ⏭  Ya existe: {title_raw[:55]}")
                    continue

                # Obtener summary
                summary = clean_html(
                    entry.get("summary", entry.get("description", ""))
                )
                if len(summary) < 30:
                    summary = title_raw

                # Nombre corto de la fuente — siempre usar el dominio del feed (más confiable)
                source_name = feed_url.split("/")[2].replace("www.", "").split(".")[0].capitalize()
                # Mapeo manual de dominios conocidos a nombres legibles
                domain_map = {
                    "20minutos": "20minutos.es",
                    "espinof": "Espinof",
                    "fotogramas": "Fotogramas",
                    "sensacine": "SensaCine",
                    "infobae": "Infobae",
                    "clarin": "Clarín",
                    "lanacion": "La Nación",
                    "elobservador": "El Observador",
                    "variety": "Variety",
                    "deadline": "Deadline",
                    "hollywoodreporter": "Hollywood Reporter",
                    "collider": "Collider",
                    "screenrant": "Screen Rant",
                }
                domain_key = feed_url.split("/")[2].replace("www.", "").split(".")[0]
                source_name = domain_map.get(domain_key, domain_key.capitalize())

                # Obtener thumbnail
                thumbnail = None
                if "media_thumbnail" in entry and entry.media_thumbnail:
                    thumbnail = entry.media_thumbnail[0].get("url")
                elif "media_content" in entry and entry.media_content:
                    thumbnail = entry.media_content[0].get("url")
                elif hasattr(entry, "enclosures") and entry.enclosures:
                    enc = entry.enclosures[0]
                    if enc.get("type", "").startswith("image"):
                        thumbnail = enc.get("url")

                log(f"   ✍  Reescribiendo: {title_raw[:60]}")
                rewritten = rewrite_with_groq(title_raw, summary, source_name)
                if not rewritten:
                    time.sleep(5)
                    continue

                slug = make_slug(rewritten["title"], uid)
                pub_date = entry.get("published", datetime.now(timezone.utc).isoformat())

                # Artículo completo (guardado en su propio archivo)
                full_article = {
                    "uid":         uid,
                    "slug":        slug,
                    "title":       rewritten["title"],
                    "intro":       rewritten["intro"],
                    "body":        rewritten["body"],
                    "conclusion":  rewritten["conclusion"],
                    "tags":        rewritten.get("tags", []),
                    "category":    rewritten.get("category", "Streaming"),
                    "thumbnail":   thumbnail,
                    "source":      source_name,
                    "originalUrl": url,
                    "publishedAt": pub_date,
                    "createdAt":   datetime.now(timezone.utc).isoformat(),
                }

                save_article(articles_dir, full_article)

                # Resumen para el índice (sin body completo)
                new_articles.append({
                    "uid":        uid,
                    "slug":       slug,
                    "title":      rewritten["title"],
                    "intro":      rewritten["intro"],       # excerpt para la card
                    "category":   rewritten.get("category", "Streaming"),
                    "tags":       rewritten.get("tags", []),
                    "thumbnail":  thumbnail,
                    "source":     source_name,
                    "publishedAt": pub_date,
                })

                existing_uids.add(uid)
                processed += 1
                log(f"   ✅ Guardado: {rewritten['title'][:60]}")
                time.sleep(5)     # Pausa entre llamadas a Groq (free tier: 30 req/min)

        except Exception as e:
            log(f"   ✗ Error en feed {feed_url}: {e}")
            continue

    # Actualizar índice
    if new_articles:
        index["articles"] = new_articles + index["articles"]
        index["articles"] = index["articles"][:MAX_ARTICLES]
        save_index(OUTPUT_DIR, index)
        log(f"\n🎉 {len(new_articles)} artículos nuevos. Total índice: {len(index['articles'])}")
    else:
        log("\n⏭  Sin artículos nuevos en esta ejecución.")

    log("Fin del proceso.\n")


if __name__ == "__main__":
    main()
