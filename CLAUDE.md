# Familiequizz – prosjektnotater for Claude Code

Svar alltid på norsk (bokmål). Eieren, Stein Arne, skriver norsk og er ikke utvikler: forklar enkelt og gi korte steg.

## Hva appen er
PWA-quiz for venner og familie. Vert starter en quiz og får en 4-sifret kode; spillerne åpner lenken på sin egen mobil, skriver kode og navn og svarer. Poeng: riktig = 500 + opptil 500 for fart.
Repo: `madmoose56/familiequizz` → GitHub Pages (gren `main`, rot).

## Filer
- `index.html` – hele appen (HTML+CSS+JS, ES5-stil med `var`/function, ingen byggesteg).
- `sw.js` – service worker, nettverk-først. **Øk cache-navnet `familiequizz-vNN` ved hver utgivelse.**
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.

## Teknikk
- PeerJS 1.5.4 (unpkg), gratis offentlig signalserver. Vertens telefon er «server» med peer-id `familiequizz-<kode>`; spillere kobler direkte (WebRTC). Verten må la appen stå åpen.
- Vert har all tilstand (`H`), sender full tilstand til hver spiller med `stateFor()`. Spillere (`P`) sender bare `{t:'join'}` og `{t:'ans'}`.
- Spørsmålsbank `BANK` i index.html (6 kategorier × 8). Egne spørsmål (med valgfritt bilde, forminsket) lagres i localStorage `fq-egne` på vertens telefon.
- Spillere som mister forbindelsen kobler seg på igjen med samme navn og beholder poengene.

## Arbeidsmåte
- Rediger `index.html`, bump `sw.js`, commit og push til `main`.
- Si fra tydelig hva som er testet og hva som bare kan bekreftes på iPhone.
