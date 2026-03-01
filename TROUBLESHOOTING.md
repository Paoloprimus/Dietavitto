# 🔧 DietaVitto - Troubleshooting Guide

## Common Setup Issues

### 1. SQL Error: "ORDER BY expressions must appear in argument list"

**Error Message:**
```
ERROR: 42P10: in an aggregate with DISTINCT, ORDER BY expressions must appear in argument list
LINE 51: CASE day_of_week
```

**Cause:** PostgreSQL doesn't allow `ORDER BY` on expressions not in the aggregate when using `ARRAY_AGG(DISTINCT ...)`.

**Solution:**

**Option A: Use the fixed schema.sql (recommended)**

The current `supabase/schema.sql` file has been fixed. Just run it normally:

```sql
-- In Supabase SQL Editor
-- Copy and paste the entire supabase/schema.sql file
```

**Option B: Run the quick fix**

If you already ran the old schema and got the error:

```sql
-- In Supabase SQL Editor
-- Copy and paste supabase/fix-view.sql
```

**Option C: Manual fix**

1. In Supabase SQL Editor, run:

```sql
-- Drop the problematic view
DROP MATERIALIZED VIEW IF EXISTS weekly_aggregated;

-- Create the fixed version
CREATE MATERIALIZED VIEW weekly_aggregated AS
SELECT 
  food_name,
  COUNT(*) as occurrences,
  ARRAY_AGG(DISTINCT day_of_week) as days
FROM daily_foods
GROUP BY food_name
ORDER BY occurrences DESC, food_name ASC;

-- Create indexes
CREATE INDEX idx_weekly_aggregated_food ON weekly_aggregated(food_name);
CREATE INDEX idx_weekly_aggregated_occurrences ON weekly_aggregated(occurrences);

-- Refresh the view
REFRESH MATERIALIZED VIEW weekly_aggregated;
```

2. Verify it works:

```sql
SELECT * FROM weekly_aggregated LIMIT 5;
```

**Note:** The days array won't be in week order (Lunedì, Martedì, etc.), but this is fine since we sort them in the frontend component.

---

### 2. npm install Fails

**Error:** Module not found or dependency issues

**Solution:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# If still fails, try with legacy peer deps
npm install --legacy-peer-deps
```

---

### 3. Environment Variables Not Working

**Error:** `Missing Supabase environment variables` or connection fails

**Solution:**

1. Verify `.env.local` exists and has correct format:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. Restart the dev server after changing env vars:

```bash
# Stop server (Ctrl+C)
npm run dev
```

3. Verify variables are loaded:

```bash
# In browser console
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
```

---

### 4. Service Worker Not Registering

**Error:** PWA not installable or offline mode doesn't work

**Solution:**

1. **HTTPS Required:** Service Workers only work on HTTPS (or localhost)
   - Development: localhost works fine
   - Production: Vercel provides HTTPS automatically

2. **Clear browser cache:**
   - Chrome: DevTools → Application → Clear storage
   - Safari: Develop → Empty Caches

3. **Verify sw.js exists:**

```bash
# File should be at /public/sw.js
ls -la public/sw.js
```

4. **Check registration in console:**

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('SW registrations:', registrations);
});
```

5. **Re-register manually:**

```javascript
// In browser console
navigator.serviceWorker.register('/sw.js').then(
  reg => console.log('SW registered:', reg),
  err => console.error('SW registration failed:', err)
);
```

---

### 5. Supabase Connection Issues

**Error:** Network errors, timeout, or "Failed to fetch"

**Solution:**

1. **Verify Supabase project is running:**
   - Go to Supabase dashboard
   - Check project status (should be green)
   - Restart project if paused

2. **Check API keys:**
   - Supabase Dashboard → Settings → API
   - Copy the **anon public** key (not service_role)
   - Verify URL format: `https://project-id.supabase.co`

3. **Test connection:**

```javascript
// In browser console or Node
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'YOUR_URL',
  'YOUR_ANON_KEY'
);

supabase.from('daily_foods').select('count', { count: 'exact' })
  .then(({ count, error }) => {
    if (error) console.error('Error:', error);
    else console.log('Row count:', count);
  });
```

4. **Check RLS policies:**
   - If you enabled Row Level Security
   - Make sure policies allow public access for development:

```sql
-- In Supabase SQL Editor
ALTER TABLE daily_foods DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;
```

---

### 6. Tailwind Styles Not Applying

**Error:** Components appear unstyled or CSS not loading

**Solution:**

1. **Verify globals.css import:**

```typescript
// src/app/[locale]/layout.tsx
import "../globals.css";  // Should be present
```

2. **Check Tailwind config:**

```typescript
// tailwind.config.ts
content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",  // Should match your structure
],
```

3. **Rebuild:**

```bash
rm -rf .next
npm run dev
```

4. **Verify PostCSS:**

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

### 7. Framer Motion Animations Not Working

**Error:** No animations or console errors about Framer Motion

**Solution:**

1. **Add "use client" directive:**

```typescript
// All components using Framer Motion must have:
"use client";

import { motion } from "framer-motion";
```

2. **Verify installation:**

```bash
npm list framer-motion
# Should show: framer-motion@11.x.x
```

3. **Check for naming conflicts:**

```typescript
// Correct usage
import { motion } from "framer-motion";

// NOT this (common mistake)
import motion from "framer-motion";  // ❌ Wrong
```

---

### 8. TypeScript Errors

**Error:** Type errors in development

**Solution:**

1. **Regenerate types:**

```bash
npm run build
# This generates .next/types
```

2. **Install missing @types:**

```bash
npm install -D @types/node @types/react @types/react-dom
```

3. **Check tsconfig.json paths:**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  // Should match your structure
    }
  }
}
```

---

### 9. Icons Not Loading (PWA)

**Error:** Broken icon images or manifest errors

**Solution:**

1. **Icons are missing:** The project includes a guide but not actual icon files

```bash
# Read the guide
cat public/icons/README.md
```

2. **Quick temporary fix:**

```bash
# Create a simple placeholder icon
# This requires ImageMagick installed
convert -size 512x512 xc:'#BEFF00' \
  -pointsize 200 -font Arial-Bold \
  -gravity center -annotate +0+0 'DV' \
  public/icons/icon-512x512.png

# Resize to other sizes
for size in 72 96 128 144 152 192 384; do
  convert public/icons/icon-512x512.png -resize ${size}x${size} \
    public/icons/icon-${size}x${size}.png
done
```

3. **Online generator (recommended):**
   - Go to https://realfavicongenerator.net/
   - Upload a 512x512 base image
   - Download and extract to `/public/icons/`

---

### 10. "Cannot find module 'next-intl/server'"

**Error:** Import errors with next-intl

**Solution:**

1. **Verify installation:**

```bash
npm list next-intl
# Should show: next-intl@3.x.x or 4.x.x
```

2. **Reinstall if needed:**

```bash
npm install next-intl@latest
```

3. **Check import paths:**

```typescript
// Correct for next-intl v4+
import { getMessages } from 'next-intl/server';
import { useTranslations } from 'next-intl';
```

---

## Getting Help

### 1. Check Logs

**Browser Console:**
```
F12 → Console tab
Look for errors (red) and warnings (yellow)
```

**Server Terminal:**
```
Check the terminal where npm run dev is running
Errors appear in red
```

### 2. Verify Basics

```bash
# Node version (should be 20+)
node --version

# npm version (should be 9+)
npm --version

# All dependencies installed
npm list --depth=0
```

### 3. Clean Install

```bash
# Nuclear option - complete clean install
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### 4. Check Browser Compatibility

Minimum requirements:
- Chrome 90+
- Safari 15.4+ (for PWA)
- Firefox 88+
- Edge 90+

### 5. Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion/

---

## Still Having Issues?

If none of these solutions work:

1. **Check versions match:**
   ```json
   "next": "^15.1.0",
   "react": "^19.0.0",
   "typescript": "^5.6.3"
   ```

2. **Try the GitHub discussions:** Create an issue with:
   - Error message (full text)
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)
   - What you've already tried

3. **Minimal reproduction:**
   ```bash
   # Start fresh to isolate the issue
   npx create-next-app@latest test-app
   # Copy over problematic files one by one
   ```

---

**Last Updated:** February 27, 2026  
**Version:** 1.0.0
