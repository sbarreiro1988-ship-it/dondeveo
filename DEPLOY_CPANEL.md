# Deploy DondeVeo en cPanel

## Pre-requisitos
- Node.js 20.x en cPanel (Setup Node.js App)
- Dominio uru2.com apuntando a la IP del servidor cPanel

## Pasos

### 1. Configurar Node.js App en cPanel
1. Ir a "Setup Node.js App" en cPanel
2. Node.js Version: 20.x
3. Application mode: Production
4. Application root: /home/surastre/uru2
5. Application URL: uru2.com
6. Application startup file: server.js

### 2. Clonar/subir código
```bash
cd /home/surastre/uru2
git clone https://github.com/sbarreiro1988-ship-it/dondeveo.git .
# O hacer pull si ya existe
git pull origin main
```

### 3. Variables de entorno
Crear /home/surastre/uru2/.env.production con:
```
TMDB_ACCESS_TOKEN=tu_token
NEWS_DATA_URL=https://preview.uru2.com/api/dondeveo-news
NEWS_FILE_PATH=/home/surastre/public_html/dondeveo-news
NEXT_PUBLIC_SITE_URL=https://www.uru2.com
```

### 4. Instalar y buildear
```bash
npm install
npm run build
```

### 5. Configurar server.js para Passenger
El server.js ya existe en el proyecto.

### 6. DNS
Cambiar los NS/A records de uru2.com para que apunten a:
IP: 74.50.73.66 (IP del servidor NextVision)

### 7. SSL
En cPanel: SSL/TLS → Let's Encrypt para uru2.com y www.uru2.com
