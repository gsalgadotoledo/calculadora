# Publicar la calculadora

Es un sitio estático: `npm run build` deja todo en `dist/`. Cualquier host
estático gratuito la sirve. De más fácil a más «formal»:

| Host | Cuenta | Comando | URL | Actualizar |
|---|---|---|---|---|
| **Netlify Drop** | no | arrastrar `dist/` a <https://app.netlify.com/drop> | `algo-aleatorio.netlify.app` | volver a arrastrar (o crear cuenta y queda con historial) |
| **Surge** | email + contraseña al vuelo | `npx surge dist calculadora-mario.surge.sh` | la que elijas `.surge.sh` | repetir el comando |
| **Vercel** | login (GitHub/email) | `npx vercel --prod` | `calculadora-xxx.vercel.app` | repetir; detecta Vite solo |
| **Cloudflare Pages** | login | `npx wrangler pages deploy dist --project-name calculadora` | `calculadora.pages.dev` | repetir |
| **GitHub Pages** | repo en GitHub | push a `main` → Action publica | `usuario.github.io/calculadora` | automático en cada push |

## Recomendación

- **Para verla ya, sin cuenta:** Netlify Drop o Surge (un minuto).
- **Para que se publique sola cada vez que se hace commit:** GitHub Pages con
  la Action de abajo. Es la única que necesita `base: '/calculadora/'` en
  `vite.config.js` (la app cuelga de una subruta); el resto sirven en raíz.

## Cómo está publicada hoy

**https://gsalgadotoledo.github.io/calculadora/** — GitHub Pages sirviendo la
rama `gh-pages` (repo <https://github.com/gsalgadotoledo/calculadora>).

Actualizar: `npm run deploy` — hace `vite build` con `VITE_BASE=/calculadora/`
y sube `dist/` a `gh-pages` (paquete `gh-pages`). Pages la publica en ~1 min.

## Para que se publique sola en cada push (pendiente)

`.github/workflows/pages.yml` ya está escrito, pero **no está subido**: el token
de `gh` (OAuth) no tiene el scope `workflow` y GitHub rechaza cualquier push o
llamada API que cree un archivo en `.github/workflows/`. Cuando se quiera:

1. `gh auth refresh -s workflow` (abre el navegador una vez).
2. Quitar `.github/workflows/` de `.gitignore`, `git add .github && git commit -m "Action de Pages" && git push`.
3. `gh api -X PUT repos/gsalgadotoledo/calculadora/pages -f build_type=workflow`.

Desde ahí cada push a `main` corre tests, build y publica; `npm run deploy`
deja de hacer falta.
