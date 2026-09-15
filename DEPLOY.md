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

## GitHub Pages (cuando el repo tenga remote)

1. `vite.config.js`: `base: process.env.VITE_BASE ?? '/'`, y en la Action
   `VITE_BASE=/calculadora/`.
2. `.github/workflows/pages.yml`: checkout → `npm ci` → `npm run build` →
   `actions/upload-pages-artifact` (`dist`) → `actions/deploy-pages`.
3. En el repo: Settings → Pages → Source: *GitHub Actions*.
