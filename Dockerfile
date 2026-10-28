# Polski Szlak — statische App im Container (für Coolify / Docker), übernommen aus GeoQuest.
# Coolify-Proxy (Traefik) routet z. B. polski.arndt-software.de -> diesen Container:80 und macht HTTPS.
FROM nginx:alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx-container.conf /etc/nginx/conf.d/polski.conf
WORKDIR /usr/share/nginx/html
COPY index.html data-polacy.json data-szlak.json impressum.html datenschutz.html sw.js manifest.json icon.svg icon-192.png icon-512.png icon-maskable-512.png apple-touch-icon.png robots.txt sitemap.xml ./
COPY audio ./audio
COPY fonts ./fonts
EXPOSE 80
