# Familiequiz – prosjektnotater for Claude Code

Svar alltid på norsk (bokmål). Eieren, Stein Arne, skriver norsk og er ikke utvikler: forklar enkelt og gi korte steg.

## Hva appen er
PWA-quiz for venner og familie. Vert starter en quiz og får en 4-sifret kode; spillerne åpner lenken på sin egen mobil, skriver kode og navn og svarer. Poeng: riktig = 500 + opptil 500 for fart.
Repo: `madmoose56/Familiequiz` → GitHub Pages (gren `main`, rot).

## Filer
- `index.html` – hele appen (HTML+CSS+JS, ES5-stil med `var`/function, ingen byggesteg).
- `sw.js` – service worker, nettverk-først. **Øk cache-navnet `familiequiz-vNN` ved hver utgivelse.**
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.

## Teknikk
- PeerJS 1.5.4 (unpkg), gratis offentlig signalserver. Vertens telefon er «server» med peer-id `familiequiz-<kode>`; spillere kobler direkte (WebRTC). Verten må la appen stå åpen.
- Vert har all tilstand (`H`), sender full tilstand til hver spiller med `stateFor()`. Spillere (`P`) sender bare `{t:'join'}` og `{t:'ans'}`.
- Spørsmålsbank `BANK` i index.html (6 kategorier × 8). Egne spørsmål (med valgfritt bilde, forminsket) lagres i localStorage `fq-egne` på vertens telefon.
- Spillere som mister forbindelsen kobler seg på igjen med samme navn og beholder poengene.

## Admin (kun PC/nettbrett; ?admin i adressen slår det på også på smal skjerm, ?admin=0 av)
- Mobil (<700 px) viser bare «Bli med»; vert/admin skjules (`isPhone()`). Admin har tre faner: Start quiz, Temaer, Egne spørsmål.
- Faste billedtemaer ligger i `temaer.js` (skuespillere, byer; laget av et engangsskript mot Wikipedia, bilder fra Commons).
- Tema-bygger har kildevalg (`#tsrc`): Wikidata, SNL (`snl.no/api/v1/search`, 10 treff per kall + offset, ingress som ledetråd, bilde fra `first_image_url`), Nasjonalbiblioteket (`api.nb.no/catalog/v1/items`, `mediatype:bilder`, år fra `dateCreated`, tommel via `www.nb.no/services/image/resolver`) og DigitaltMuseum (`api.dimu.org/api/solr/select`, krever API-nøkkel; «demo» er stengt; bilde `ems.dimu.org/image/<id>?dimension=800x800`; UTESTET). Temaelementer har `k`: `n` (navn fra bilde), `c` (ledetråd→navn), `y` («Hvilket år?»).
- Tema-bygger Wikidata: søker Wikidata (SPARQL, ett søk per land, 4 samtidig, 70 s timeout) med filtre yrke/kjønn/fødselsår/land/«hvor kjente». Resultatet kan trimmes og lagres som eget tema i localStorage `fq-temaer`. Bilder via Commons `Special:FilePath?width=500`.
- Wikidata er hovedkilden for mange treff (SNL/NB er norske og gir få). `WDCATS` i index.html er kategorilisten (flagg, byer, fjell, innsjøer, øyer, vulkaner, fossefall, slott, broer, kirker, museer, skyskrapere, statuer, malerier, bil- og fotballogoer, musikkgrupper). Dyr/planter (taxon) gir tidsavbrudd i Wikidata. MCP-servere kan ikke kalles fra selve appen (kun fra Claude-økten); appen kan bare bruke åpne nett-API-er.
- Bilmerker: logoer på Wikidata/Commons har nesten alltid navnet i selve bildet (OCR med Tesseract.js fanger bare ~halvparten), derfor brukes bilder av bilmodeller (P176 produsent, maks 3 per merke) i stedet for logoer. Fotball-logoer kjøres gjennom OCR-filter (`ocrFilter`, to leseformer), men er ikke 100 % trygge – admin må se over med ✕.
- Egne spørsmål: bare riktig svar (ingen A–D), svares muntlig, vert trykker Godkjent/Feil svar (approve/wrong); alltid buzzer (q.own), felt info (tekst) og imgs (opptil 4 bilder) vises på en svarside (infoPage) i fasit; liste «Svarte» (queueResultHtml) oppe til høyre.
- Spørsmålslister: alle `sporsmal/*.csv` (+ `sporsmal/bilder/`, se LES-MEG.txt) listes i `sporsmal/lister.json` (lages med `node sporsmal/lag-liste.js` – kjør før hver opplasting). Vises som avkrysning under «Våre egne» i Start quiz (loadLists/fillLists/buildQs).
- Quizmester-panel (mobil): hjem → «Quizmester» + romkode → view `ctl` (vCtl/ctlState/hostCmd). Peer sender {t:'ctl'}, kommandoer {t:'cmd',a,v}. Viser riktig svar privat, Godkjent/Feil/Hopp over, Neste, modus, «Oppdater lister».
- Lister finnes via GitHub-API (sporsmal/) + lister.json som reserve (listFiles/loadLists). Seksjoner i Temaer er `<details class="dt">` (sect/updCounts).
- Oppdater-pil (↻) øverst til høyre tømmer cache og laster på nytt.

## Arbeidsmåte
- Mappen ligger på `D:\iPhone\Familiequizz` (kan gis nytt navn Familiequiz når ingenting bruker den). Appen og listen ligger i samme repo.
- Rediger `index.html`, bump `sw.js`, commit og push til `main`.
- Si fra tydelig hva som er testet og hva som bare kan bekreftes på iPhone.
