# LEGIE 1918 — Netlify / Android / iOS

Originální vzdělávací **PWA** aplikace v češtině o československých legiích. Je vytvořena bez build procesu a bez závislosti na CDN. Lze ji používat v mobilním prohlížeči Android/iOS a přidat na plochu telefonu.

## Hotové funkce

- **30 faktografických otázek** ve třech úrovních, vyhodnocení, vysvětlení a zdroj u každé otázky; nejlepší skóre se ukládá do lokálního úložiště.
- **Interaktivní časová osa** s devíti událostmi 1914–1918 a odkazy na odborné podklady.
- **3D atelier uniforem**: tři autorské prostorové WebGL modely inspirované ruskou, francouzskou a italskou legionářskou výstrojí, otočení tahem, přiblížení, výběr detailu. Jedná se o stylizované výukové rekonstrukce, **ne přesné historické 3D skeny**.
- **Chat s fiktivním legionářem Františkem**: fungující místní průvodce pro vybraná ověřená témata; po nastavení Netlify Function a OpenAI API klíče funguje konverzační AI. Postava nepředstírá autentické svědectví.
- **Voice chat**: hlasový vstup využívá `SpeechRecognition` / `webkitSpeechRecognition` podle podpory prohlížeče; české čtení odpovědí využívá `speechSynthesis`. Kompatibilita rozpoznávání řeči na iOS není zaručena, proto je vždy k dispozici text.
- **PWA**: instalace na domovskou obrazovku, service worker pro offline statické rozhraní, česká mobilní navigace.

## Nasazení na Netlify s AI (doporučeno)

1. Rozbal ZIP a vlož **celou kořenovou složku projektu** do GitHub/GitLab repozitáře.
2. V Netlify zvol **Add new project → Import an existing project** a vyber repozitář. V projektu je soubor `netlify.toml`, který nastavuje `publish = "public"` a `functions = "netlify/functions"`. Build příkaz nech prázdný.
3. Netlify → **Project configuration → Environment variables** → přidej `OPENAI_API_KEY` (tajný klíč k OpenAI API). Volitelně přidej `OPENAI_MODEL` a `CHAT_ACCESS_CODE` (kód pro omezení přístupu k placenému chatu). Proměnné musí být dostupné také pro **Functions**.
4. Proveď nové nasazení (**Deploys → Trigger deploy**). Zkontroluj na mobilu adresu `https://<tvuj-web>.netlify.app`.
5. Otevři stránku v Safari/Chrome a zvol **Přidat na plochu** (Android z menu prohlížeče, iOS z nabídky Sdílet v Safari).

> **Důležité:** Netlify účet ani API klíč nejsou součástí projektu. Bez nich nemůže nikdo aplikaci nasadit na tvůj vlastní účet ani aktivovat skutečnou konverzační AI. API klíč **nikdy nevkládej** do souborů v `public/`, do historie Gitu ani do nastavení chatu v prohlížeči. Chat používá serverový endpoint `/api/chat`. Pro veřejnou aplikaci doporučujeme nastavit ochranný `CHAT_ACCESS_CODE` a sledovat spotřebu API.

### Rychlé zveřejnění statické ukázky bez AI

Zpřístupni obsah složky `public/` přes **Netlify Drop** (ruční nahrání stránky). Kvíz, časová osa, 3D atelier a offline historický průvodce budou fungovat; pro AI je nutné nasadit celý projekt přes Git/CLI včetně funkce. Hlasový režim je nezávislý na OpenAI, ale závisí na podpoře telefonu/prohlížeče.

## Lokální spuštění

V kořeni projektu spusť například `python3 -m http.server 8080 -d public` a otevři `http://localhost:8080` (statické funkce). Alternativně s Netlify CLI `netlify dev` (vyžaduje jeho samostatnou instalaci, přihlášení a proměnné prostředí pro chat).

## Technické poznámky

- `public/` — HTML, CSS, JS, WebGL, SVG, ikony a PWA.
- `netlify/functions/chat.mjs` — serverový OpenAI Responses API proxy, minimální vstupní validace a volitelný přístupový kód; žádné výstupy AI se neukládají na server.
- `public/data.js` — otázky, zdroje, události, přehled uniforem a lokální historické odpovědi.
- Místní průvodce není generativní AI. Pokud se serverová AI nezdaří, aplikace poskytne místní tematickou odpověď místo simulování AI.
- Úplná offline funkčnost hlasu a AI není zaručena; v režimu offline jsou dostupné statické části po prvním načtení.
- **Datum ověření zdrojů: 18. 11. 2026.** Dějiny mohou obsahovat historické interpretační rozdíly; při výuce ověřuj konkrétní tvrzení v odkazovaných dokumentech.

## Autorská práva

Grafika vlakové scenérie a WebGL modely byly vytvořeny pro tento projekt. Nejsou do nich vloženy cizí fotografie ani naskenované muzejní exponáty. Historické zdroje jsou odkazovány, nikoli kopírovány.
