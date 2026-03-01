# 🚀 DietaVitto - Deployment Guide

## Pre-Deployment Checklist

- [ ] Database schema eseguito su Supabase
- [ ] Environment variables configurate
- [ ] Icons PWA generati (vedi `/public/icons/README.md`)
- [ ] Build test locale eseguito con successo
- [ ] Lighthouse score >90 su tutte le metriche

---

## 🗄️ Supabase Setup

### 1. Crea Progetto Supabase

1. Vai su [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Compila:
   - **Name:** DietaVitto
   - **Database Password:** (genera password sicura)
   - **Region:** Europe (o più vicina)
4. Attendi ~2 minuti per provisioning

### 2. Esegui Database Schema

1. Nella dashboard Supabase → **SQL Editor**
2. Click **"New Query"**
3. Copia contenuto di `/supabase/schema.sql`
4. Click **"Run"**
5. Verifica creazione tabelle:
   - `daily_foods` → 100+ righe (dati di esempio)
   - `user_preferences` → vuota
   - `weekly_aggregated` → view con aggregati

### 3. Ottieni Credenziali

1. Settings → **API**
2. Copia:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGci...`
3. Salva per deployment

### 4. (Opzionale) Configura Authentication

```sql
-- Se vuoi autenticazione multi-utente
ALTER TABLE daily_foods ADD COLUMN user_id UUID REFERENCES auth.users;
ALTER TABLE user_preferences ADD FOREIGN KEY (user_id) REFERENCES auth.users;

-- Update RLS policies
CREATE POLICY "Users see only own foods" ON daily_foods
  FOR SELECT USING (auth.uid() = user_id);
```

---

## ☁️ Vercel Deployment

### Metodo 1: Git Integration (Consigliato)

#### 1. Push su GitHub

```bash
# Inizializza git (se non già fatto)
git init
git add .
git commit -m "Initial commit: DietaVitto MVP"

# Crea repository GitHub
# Vai su github.com → New Repository → "dietavitto"

# Collega e push
git remote add origin https://github.com/yourusername/dietavitto.git
git branch -M main
git push -u origin main
```

#### 2. Importa su Vercel

1. Vai su [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Importa repository GitHub `dietavitto`
4. Configura:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

#### 3. Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NODE_ENV=production
```

#### 4. Deploy

- Click **"Deploy"**
- Attendi ~2 minuti
- Vercel genera URL: `https://dietavitto.vercel.app`

### Metodo 2: Vercel CLI

```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Segui prompts:
# - Scope: Personal account
# - Link to existing project? No
# - Project name: dietavitto
# - Directory: ./
# - Overwrite settings? No

# Aggiungi environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Incolla valore quando richiesto

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Incolla valore quando richiesto

# Deploy produzione
vercel --prod
```

---

## 🌐 Custom Domain (Opzionale)

### 1. Acquista Dominio

- **Namecheap:** ~$10/anno
- **Google Domains:** ~$12/anno
- **Vercel Domains:** integrazione diretta

### 2. Configura DNS

In Vercel Dashboard → Settings → Domains:

1. Click **"Add Domain"**
2. Inserisci dominio (es. `dietavitto.com`)
3. Vercel fornisce DNS records:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```
4. Aggiungi questi records nel pannello del tuo registrar
5. Attendi propagazione DNS (~1-24 ore)

### 3. SSL/TLS

- Vercel abilita automaticamente HTTPS
- Certificato Let's Encrypt rinnovato automaticamente

---

## 📱 PWA Testing

### Desktop (Chrome)

1. Apri `https://dietavitto.vercel.app`
2. DevTools → Application → Manifest
3. Verifica:
   - ✅ Manifest valido
   - ✅ Service Worker registrato
   - ✅ Icons caricati
4. Click **"Add to Home Screen"** (icona +)

### Mobile (iOS Safari)

1. Apri in Safari
2. Tap icona Share (quadrato con freccia)
3. Scroll → **"Add to Home Screen"**
4. Conferma nome e icona
5. Test app standalone

### Mobile (Android Chrome)

1. Apri in Chrome
2. Banner "Install App" appare automaticamente
3. Tap **"Install"**
4. Oppure: Menu → **"Add to Home Screen"**

---

## 🔍 Post-Deployment Verification

### 1. Lighthouse Audit

```bash
# Installa Lighthouse CLI
npm i -g lighthouse

# Run audit
lighthouse https://dietavitto.vercel.app --view

# Target scores:
# Performance: >90
# Accessibility: 100
# Best Practices: 100
# SEO: >90
# PWA: ✅
```

### 2. PWA Checklist

- [ ] **Installabile:** Add to Home Screen disponibile
- [ ] **Offline:** App carica senza rete
- [ ] **Responsive:** Design adattivo mobile/tablet/desktop
- [ ] **Fast:** FCP <1.8s, LCP <2.5s
- [ ] **Secure:** Solo HTTPS
- [ ] **Accessible:** ARIA labels, keyboard navigation

### 3. Browser Compatibility

Test su:
- [ ] Chrome/Edge (Windows)
- [ ] Chrome (Android)
- [ ] Safari (iOS 16+)
- [ ] Firefox (Latest)

### 4. Notifications Test

```javascript
// Nella console del browser:
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    new Notification('DietaVitto', {
      body: 'Test notifica!',
      icon: '/icons/icon-192x192.png'
    });
  }
});
```

---

## 🔄 Continuous Deployment

### Auto-Deploy su Git Push

Vercel auto-deploya su ogni push:

```bash
git add .
git commit -m "feat: add weekly view"
git push

# Vercel:
# 1. Detecta push
# 2. Builda progetto
# 3. Deploya su preview URL
# 4. Su merge in main → deploy produzione
```

### Preview Deployments

Ogni PR genera preview URL unico:
- **Branch:** feature/weekly-view
- **URL:** `https://dietavitto-git-feature-weekly-view-username.vercel.app`
- Share per testing prima del merge

### Deployment Protections

In Vercel → Settings → Git:
- **Protection:** Require approval for production deployments
- **Branch Protection:** Solo main può deployare in prod

---

## 📊 Monitoring & Analytics

### Vercel Analytics

```bash
# Installa analytics
npm install @vercel/analytics

# In layout.tsx:
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

Dashboard Vercel mostra:
- Pageviews
- Unique visitors
- Top pages
- Performance metrics

### Supabase Monitoring

Dashboard Supabase → Reports:
- Database usage
- API requests
- Auth activity
- Storage usage

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Error: Module not found
npm install  # Re-installa dipendenze

# Error: Type errors
npm run lint  # Verifica errori TypeScript

# Error: Environment variables missing
vercel env pull .env.local  # Scarica vars da Vercel
```

### Service Worker Not Registering

1. Verifica che `/public/sw.js` esista
2. Check DevTools → Application → Service Workers
3. Clear cache e ricarica pagina
4. Verifica HTTPS (required per SW)

### Icons Not Loading

1. Verifica path: `/public/icons/icon-192x192.png`
2. Check manifest.json `icons` array
3. Test URL direttamente: `https://your-site.com/icons/icon-192x192.png`
4. Rigenera icons se corrotte

### Database Connection Issues

```bash
# Test connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
supabase.from('daily_foods').select('*').then(console.log);
"
```

---

## 🎉 Success Criteria

✅ **MVP è live quando:**

1. App accessibile a URL pubblico
2. Database connesso e popolato
3. Vista giornaliera funzionante con scroll
4. Checkbox salvano stato
5. PWA installabile su mobile
6. Service Worker attivo
7. Lighthouse score >90
8. Zero errori in console

---

## 📞 Support

### Risorse Utili

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **PWA Guide:** https://web.dev/progressive-web-apps/

### Community

- **Discord Vercel:** https://vercel.com/discord
- **Supabase Discord:** https://discord.supabase.com
- **Stack Overflow:** Tag `next.js` + `supabase`

---

**🚀 Buon deployment! Se tutto va bene, la tua app sarà live in <5 minuti.**
