# 🥗 DietaVitto

**PWA minimalista per la gestione della dieta settimanale**

![DietaVitto](https://img.shields.io/badge/version-1.0.0-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

---

## 📋 Panoramica

DietaVitto è una Progressive Web App (PWA) progettata per semplificare la gestione della dieta settimanale. Con un'interfaccia minimalista ispirata al design Gen Z di Fliqk, offre:

- **📱 Vista giornaliera** con scroll orizzontale tra i giorni della settimana
- **📊 Aggregazione settimanale** dei cibi con quantità e frequenze
- **🔔 Notifiche push personalizzate** per promemoria spesa e preparazione pasti
- **🎨 Dark-first design** con accenti neon lime/cyan
- **🌐 Multi-lingua** (IT, EN, DE)
- **⚡ Performance ottimale** con animazioni fluide

---

## 🚀 Quick Start

### Prerequisiti

- **Node.js** 20.x o superiore
- **npm** o **yarn**
- Account **Supabase** (gratuito)

### 1. Installazione

```bash
# Clone il repository (se applicabile)
git clone https://github.com/yourusername/dietavitto.git
cd dietavitto

# Installa dipendenze
npm install
```

### 2. Configurazione Supabase

1. Crea un nuovo progetto su [Supabase](https://supabase.com)
2. Vai su **SQL Editor** e esegui lo script `supabase/schema.sql`
3. Copia le credenziali del progetto:
   - Project URL
   - Anon/Public Key

### 3. Variabili d'Ambiente

```bash
# Crea file .env.local
cp .env.example .env.local

# Modifica .env.local con le tue credenziali
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Avvia il Server di Sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

---

## 🛠️ Stack Tecnologico

### Frontend
- **Next.js 15.1** - Framework React con App Router
- **React 19.0** - UI library
- **TypeScript 5.6** - Type safety
- **Tailwind CSS 3.4** - Utility-first styling
- **Framer Motion 11.x** - Animazioni fluide
- **Lucide React** - Icone moderne

### Backend & Database
- **Supabase** - PostgreSQL hosted + Authentication
- **@supabase/supabase-js** - Client library

### i18n & PWA
- **next-intl** - Internazionalizzazione
- **Service Worker** - Funzionalità offline
- **Web Push API** - Notifiche native

---

## 📁 Struttura del Progetto

```
dietavitto/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx           # Home con vista giornaliera
│   │   │   ├── weekly/page.tsx    # Vista settimanale
│   │   │   ├── settings/page.tsx  # Impostazioni notifiche
│   │   │   └── layout.tsx
│   │   └── globals.css            # Stili globali (Fliqk-inspired)
│   ├── components/
│   │   ├── DailyFoodList.tsx      # Scroll orizzontale giorni
│   │   ├── WeeklyAggregatedList.tsx
│   │   └── NotificationSettings.tsx
│   ├── lib/
│   │   ├── supabase.ts            # Client Supabase
│   │   ├── notifications.ts       # Logic push notifications
│   │   └── utils.ts               # Funzioni utility
│   ├── types/
│   │   └── index.ts               # TypeScript types
│   └── i18n/
│       └── request.ts             # Configurazione next-intl
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service Worker
│   ├── offline.html               # Pagina offline
│   └── icons/                     # PWA icons
├── messages/                      # Traduzioni i18n
│   ├── it.json
│   ├── en.json
│   └── de.json
├── supabase/
│   └── schema.sql                 # Database schema + seed data
└── package.json
```

---

## 🎨 Design System

### Color Palette

**Dark Theme (Default)**
```css
--background: #1e1e1e           /* Cursor-style dark gray */
--foreground: #e0e0e0           /* Testo principale */
--accent-primary: #BEFF00       /* Lime neon (CTA, highlights) */
--accent-secondary: #00FF94     /* Cyan neon (gradients) */
--card-bg: #2d2d2d              /* Background card */
```

**Light Theme**
```css
--background: #e5e5e5
--foreground: #1a1a1a
--accent-primary: #6ba800       /* Lime più scuro */
--accent-secondary: #0d9060     /* Cyan più scuro */
```

### Typography
- **Font:** Outfit (Google Fonts)
- **Pesi:** 400, 500, 600, 700, 800, 900

### Animazioni
- **Fade-in:** `translateY(10px)` con opacity
- **Stagger:** Delay `index * 0.05s` per liste
- **Gradient borders:** Intensità aumenta on hover

---

## 📱 Features

### ✅ Implementate (MVP)

#### 1. Vista Giornaliera
- Scroll orizzontale fluido tra 7 giorni
- Card per ogni giorno con header (giorno + data)
- Checkbox per spuntare cibi acquistati/preparati
- Animazioni smooth con Framer Motion
- Dots navigation per orientamento

#### 2. Gestione Cibi
- Database Supabase con tabella `daily_foods`
- CRUD operations via API
- Stato checked persistente
- Categorizzazione per pasto (Colazione, Pranzo, Cena)

#### 3. PWA
- Manifest.json configurato
- Service Worker per funzionalità offline
- Installabile come app nativa
- Icone per tutti i formati (72x72 → 512x512)

#### 4. Internazionalizzazione
- Supporto IT, EN, DE
- next-intl con traduzioni complete
- Switch lingua dinamico (da implementare in UI)

### 🚧 In Sviluppo

#### 5. Vista Settimanale Aggregata
- Aggregazione cibi con quantità
- Raggruppamento per categoria (Frutta, Verdure, Proteine, ecc.)
- Sorting alfabetico / per frequenza
- Export lista clipboard

#### 6. Notifiche Push
- Configurazione frequenza (giornaliera, a giorni alterni, settimanale)
- Selezione orario
- Tipi: Promemoria spesa, Prep cucina, Motivazionale
- Messaggi personalizzati
- Test notification

---

## 🗄️ Database Schema

### Tabella: `daily_foods`

```sql
CREATE TABLE daily_foods (
  id UUID PRIMARY KEY,
  day_of_week TEXT NOT NULL,    -- 'Lunedì', 'Martedì', ecc.
  category TEXT NOT NULL,        -- 'Colazione', 'Pranzo', 'Cena'
  food_name TEXT NOT NULL,
  quantity TEXT,                 -- Opzionale (es. "200g")
  checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabella: `user_preferences`

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY,
  user_id UUID,
  notification_frequency TEXT,  -- 'daily', 'alternate', 'weekly'
  notification_time TIME,
  notification_types TEXT[],    -- Array: ['shopping', 'prep', 'motivational']
  custom_message TEXT,
  theme TEXT,                   -- 'light', 'dark'
  locale TEXT,                  -- 'it', 'en', 'de'
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Vista: `weekly_aggregated`

```sql
CREATE MATERIALIZED VIEW weekly_aggregated AS
SELECT 
  food_name,
  COUNT(*) as occurrences,
  ARRAY_AGG(day_of_week) as days
FROM daily_foods
GROUP BY food_name;
```

---

## 🔧 Comandi Disponibili

```bash
# Sviluppo
npm run dev          # Avvia server dev (localhost:3000)
npm run build        # Build produzione
npm run start        # Avvia server produzione
npm run lint         # Linting con ESLint

# Database
# Esegui schema.sql nel Supabase SQL Editor per setup completo
```

---

## 🚀 Deployment

### Vercel (Consigliato)

1. **Connetti repository GitHub**
   ```bash
   git push origin main
   ```

2. **Importa progetto su Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Click "New Project"
   - Seleziona repository `dietavitto`

3. **Configura Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

4. **Deploy**
   - Vercel effettua auto-deploy su push

### Altre Piattaforme
- **Netlify:** Supporta Next.js con plugin
- **Railway:** Deploy con PostgreSQL integrato
- **Self-hosted:** Docker + Nginx

---

## 📊 Performance

### Lighthouse Score Target
- **Performance:** >90
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** >90
- **PWA:** ✅ Tutti i criteri

### Ottimizzazioni
- **Code Splitting:** Automatico con Next.js App Router
- **Image Optimization:** next/image per lazy loading
- **Font Optimization:** next/font per Outfit
- **Service Worker:** Cache strategico per assets
- **Animations:** GPU-accelerated con Framer Motion

---

## 🔐 Privacy & Sicurezza

- **No tracking:** Zero analytics invasivi
- **Local-first:** Dati sensibili mai esposti
- **HTTPS only:** Vercel forza HTTPS
- **Supabase RLS:** Row Level Security configurabile
- **No cookies:** Solo localStorage per preferenze

---

## 🤝 Contributing

1. Fork il progetto
2. Crea un branch (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

---

## 📝 TODO

- [ ] Implementare vista settimanale aggregata
- [ ] Completare sistema notifiche push
- [ ] Aggiungere autenticazione utenti
- [ ] Testing suite (Jest + Playwright)
- [ ] CI/CD pipeline automatizzata
- [ ] Integrazione AI per suggerimenti ricette (Anthropic Claude)
- [ ] Export PDF lista spesa
- [ ] Sync cross-device

---

## 📄 Licenza

Questo progetto è privato e proprietario.

---

## 👥 Autori

- **Claude** - Initial work & Documentation
- **Tuo Nome** - Project Owner

---

## 🙏 Acknowledgments

- Design ispirato a **Fliqk.to**
- UI/UX patterns da **Cursor.com**
- Icons by **Lucide**
- Hosting by **Vercel**
- Database by **Supabase**

---

## 📞 Supporto

Per domande o supporto:
- Email: your.email@example.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/dietavitto/issues)

---

**Made with 💚 for healthy eating habits**
