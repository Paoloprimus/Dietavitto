# PWA Icons Setup Guide

## Required Icons

DietaVitto needs the following icon sizes in `/public/icons/`:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Design Guidelines

### Icon Style
- **Background:** Lime gradient (#BEFF00 → #00FF94)
- **Symbol:** White fork & knife or "DV" monogram
- **Shape:** Rounded square (20% border radius)
- **Safe area:** Keep important elements 10% from edges

### Quick Generation Options

#### Option 1: Online Tool
1. Go to https://realfavicongenerator.net/
2. Upload a 512x512 base image
3. Select "iOS" and "Android" platforms
4. Download and extract to `/public/icons/`

#### Option 2: Figma/Design Tool
1. Create 512x512 artboard
2. Add lime gradient background
3. Add white icon symbol centered
4. Export as PNG at various sizes

#### Option 3: Simple SVG → PNG Conversion
Use the provided SVG as base:

```svg
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#BEFF00;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00FF94;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="102" fill="url(#gradient)"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="200" font-weight="900" fill="white" text-anchor="middle">DV</text>
</svg>
```

Convert this SVG to PNG at different sizes using:
- **ImageMagick:** `convert icon.svg -resize 192x192 icon-192x192.png`
- **GIMP:** Import SVG → Export as PNG
- **Online:** https://svgtopng.com/

## Temporary Placeholder

For development, you can use a simple colored square:

```bash
# Create a temporary placeholder (requires ImageMagick)
convert -size 512x512 xc:'#BEFF00' -pointsize 200 -gravity center -annotate +0+0 'DV' public/icons/icon-512x512.png

# Resize to other sizes
for size in 72 96 128 144 152 192 384; do
  convert public/icons/icon-512x512.png -resize ${size}x${size} public/icons/icon-${size}x${size}.png
done
```

## Testing

After adding icons, test the PWA:

1. **Chrome DevTools:**
   - Open DevTools → Application → Manifest
   - Verify all icons are loaded correctly

2. **Lighthouse:**
   - Run Lighthouse audit
   - Check PWA section passes

3. **Real Device:**
   - Open on mobile browser
   - Click "Add to Home Screen"
   - Verify icon appears correctly

## Notes

- Icons should be **square** (1:1 ratio)
- Use **PNG** format for best compatibility
- **Maskable icons:** Can be same as regular icons, but keep safe area
- iOS uses 180x180 for app icon (use icon-192x192.png as fallback)
