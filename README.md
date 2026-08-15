# Auremont — Website

Faqe prezantuese premium në shqip për Auremont: infrastrukturë ujësjellësi, ujëra të zeza, prodhim rrjete armature dhe ndërtim i plotë.

Faqja ka dy versione të plota gjuhësore:

- `index.html` — shqip
- `en.html` — anglisht

Ndërruesi SQ/EN shfaqet në header-in desktop dhe në menunë mobile.

## Nisja lokale

```powershell
npm run dev
```

Pastaj hapni `http://localhost:4173`.

## Integrimi i videos Higgsfield

Seksioni `#procesi` është ndërtuar si një sekuencë sticky me katër etapa dhe sinkronizim sipas scroll-it.

1. Eksportoni videon si `public/assets/build-process.mp4`.
2. Te `index.html`, gjeni elementin me `id="build-film"`.
3. Shtoni `src="public/assets/build-process.mp4"` te elementi `<video>`.

JavaScript-i ekzistues do ta lidhë automatikisht kohën e videos me progresin e scroll-it. Poster-i, blueprint-i dhe teksti mbeten si fallback nëse videoja nuk është ngarkuar ende.

## Para publikimit

- Konfirmoni ose zëvendësoni adresën `info@auremont.al` në `index.html` dhe `script.js`.
- Lidhni formularin me backend-in/CRM-në tuaj nëse dëshironi dërgim pa aplikacion emaili.
- Zëvendësoni tekstet e projekteve me emra, vendndodhje dhe të dhëna reale kur ato të jenë gati.

## Vendndodhja

Harta përdor koordinatat `42.6490009, 20.3134418` për Fabrikën e Armaturës “Auremont”. Seksioni përfshin edhe linkun origjinal të Google Maps për navigim të drejtpërdrejtë.

## Asetet vizuale

Imazhet origjinale të faqes u krijuan me mjetin e integruar ImageGen dhe ruhen te `public/assets/` në format WebP të optimizuar. Promptet finale përshkruan: kantier infrastrukture ujore në Ballkan në agim; instalim tubacioni ujësjellësi; impiant trajtimi ujërash; prodhim rrjetash armature; dhe rezidencë bashkëkohore në peizazh malor. Të gjitha u kërkuan pa tekst, logo ose watermark.
