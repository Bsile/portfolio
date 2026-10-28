# Migration Vidstack → Video.js v10 — inventaire des players

> But : remplacer TOUS les players Vidstack du site par Video.js v10 (`@videojs/html` 10.0.0-beta.25, auto-hébergé) + streaming **HLS auto-hébergé** (abandon de Vimeo). Même disposition/taille dans la page, seuls la méthode de stream + l'UX du player changent.
>
> ⚠️ **Vidstack et v10 ne peuvent PAS coexister** (mêmes custom elements media-chrome : `media-controls`, `media-poster`, `media-play-button`, `media-time-slider`, `media-mute-button`, `media-volume-slider`, `media-menu`, `media-gesture`). Un custom element se définit une seule fois → charger les deux casse le 2e. **Donc migration tout-ou-rien** : une fois Vidstack retiré, il l'est partout.
>
> Stratégie : **1) valider sur le reel de l'index** (pilote), puis **2) migrer tous les autres players** avec les learnings du reel.

## 1. Players `<media-player>` Vidstack (HTML statique)

| Fichier | Ligne | Source actuelle | Type stream | Statut |
|---|---|---|---|---|
| index.html | 252 | `vimeo/1052677818` | Vimeo → **HLS** | 🔵 PILOTE (en cours) |
| drime.html | 175 | `vimeo/998298032` | Vimeo → **HLS** | ⬜ à migrer |
| drime.html | 381 | `vimeo/999850389` | Vimeo → **HLS** | ⬜ à migrer |
| drime.html | (2 autres) | `assets/videos/*.mp4/webm` local | local → **HLS ou mp4** | ⬜ à migrer |
| makebetter.html | 176 | `vimeo/918254532` | Vimeo → **HLS** | ⬜ à migrer |
| upreview.html | 176 | `vimeo.com/1021430005` | Vimeo → **HLS** | ⬜ à migrer |
| upreview.html | 518 | `vimeo/1042342774` | Vimeo → **HLS** | ⬜ à migrer |
| upreview.html | (2 autres) | `assets/videos/*.mp4/webm` local | local → **HLS ou mp4** | ⬜ à migrer |

**Total : 10 media-player statiques** — 6 en streaming Vimeo (encodage HLS requis), 4 en source locale mp4/webm (drime ×2 + upreview ×2). Identifier les 4 sources locales exactes au moment de migrer (media-player vs `<video>` natif de galerie).

## 2. Player `<media-player>` dynamique (JS)

- **ads.html** (modale preview) : `document.createElement('media-player')` dans `assets/script/script.js:1049` (`initAds`/`adsOpenModal`). Créé à la volée pour la créa vidéo sélectionnée. ⬜ à migrer.

## 3. Chargement Vidstack (à retirer)

Vidstack chargé (CDN) sur : **index, drime, makebetter, upreview, ads** (5 réfs chacun : script `cdn.vidstack.io/player@1.15.5` + `theme.css` + `video.css` + ...).
- Préconnexions Vimeo (`<link rel=preconnect>`) dans ces `<head>`.
- Importmap `fscreen` (dépendance Vidstack) dans les `<head>`.

## 4. JS Vidstack (`assets/script/script.js`)

| Fonction | Ligne ~ | Rôle | Action migration |
|---|---|---|---|
| `reloadVidstackResources()` | 1741 | ré-injecte script/CSS Vidstack après nav Barba | supprimer |
| `loadPlayerScripts()` | 1754 | crée le `<script>`/`<link>` Vidstack si absent | supprimer |
| `setupAllPlayersLoading` / spinner | — | spinner de loading Vidstack | remplacer par équivalent v10 |
| handler clic play/pause | ~2093 | clic = play/pause hors contrôles | adapter à l'API v10 |
| `setupReelCursorText()` | ~1950 | label curseur sur `#reel media-player` | adapter au sélecteur v10 |
| création media-player ads | 1049 | modale ads | remplacer par v10 |

## 5. JS Vidstack (`assets/barba/barba-transition.js`)

- Appels `reloadVidstackResources()` dans les hooks `beforeEnter`/`after` des namespaces **home, drime, makebetter, upreview** (+ ads via `initAds`). À remplacer par l'init/cleanup v10 par namespace.

## 6. Assets à produire (par vidéo migrée)

Pour chaque vidéo Vimeo migrée : encoder en **HLS 3 renditions** (1080/720/480) + master.m3u8, un **poster** (.jpg) et, si souhaité, un **storyboard** (sprite JPEG + WebVTT) pour les previews timeline. Convention de dossier : `assets/videos/hls/<nom>/` (cf. `assets/videos/hls/showreel/` déjà produit pour le pilote).

## 7. CSS (`assets/css/style.css`)

- Variables `--media-*` Vidstack (`--media-button-hover-bg`, `--media-poster-bg`) et règles ciblant `media-player`/`[data-media-player]`/`.vds-*` : à nettoyer une fois la migration finie.
- Le skin v10 se tweake par **injection CSS shadow-DOM** (le CSS de page ne traverse pas le shadow root du player).

---

*Généré le 2026-07-19 après audit. Sources : audit grep du repo. Le POC v10 validé est dans `_videojs-test/` (local, gitignoré).*
