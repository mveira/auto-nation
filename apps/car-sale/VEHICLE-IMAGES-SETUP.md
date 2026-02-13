# Vehicle Images Setup Guide

## Overview
Your car inventory is now configured to use local images from the `/public/images/vehicles/` directory. According to your CSV, you have between 2-42 photos per vehicle that need to be uploaded.

## Directory Structure

Create this folder in your project:
```
public/
  images/
    vehicles/
      bmw-m2-1.jpg
      bmw-m2-2.jpg
      range-rover-sport-svr-1.jpg
      range-rover-sport-svr-2.jpg
      ... (and so on)
```

## Required Images for Each Vehicle

Based on your `cars.ts` file, you need the following images:

### ⭐ FEATURED: Porsche 911 Carrera S (2021) - Showroom Centerpiece
- `porsche-911-1.jpg` (main hero image - make this STUNNING!)
- `porsche-911-2.jpg` (3/4 rear angle)
- `porsche-911-3.jpg` (interior/cockpit)
- `porsche-911-4.jpg` (engine bay or detail shot)

### 1. BMW M2 (2017)
- `bmw-m2-1.jpg` (main image)
- `bmw-m2-2.jpg` (gallery image)

### 2. Range Rover Sport SVR (2018)
- `range-rover-sport-svr-1.jpg`
- `range-rover-sport-svr-2.jpg`

### 3. BMW 5 Series (2015)
- `bmw-5-series-1.jpg`
- `bmw-5-series-2.jpg`

### 4. BMW 1 Series M Sport (2012)
- `bmw-1-series-1.jpg`
- `bmw-1-series-2.jpg`

### 5. Audi A3 Sportback (2018)
- `audi-a3-1.jpg`
- `audi-a3-2.jpg`

### 6. Mercedes-Benz A Class Sport (2014)
- `mercedes-a-class-1.jpg`
- `mercedes-a-class-2.jpg`

### 7. Land Rover Discovery Sport (2017)
- `discovery-sport-1.jpg`
- `discovery-sport-2.jpg`

### 8. Volkswagen Polo (2019)
- `vw-polo-1.jpg`
- `vw-polo-2.jpg`

### 9. Peugeot 5008 GT Line (2018)
- `peugeot-5008-1.jpg`
- `peugeot-5008-2.jpg`

### 10. MINI Countryman Cooper (2012)
- `mini-countryman-1.jpg`
- `mini-countryman-2.jpg`

### 11. Mazda6 Tourer (2016)
- `mazda6-tourer-1.jpg`
- `mazda6-tourer-2.jpg`

### 12. Nissan Qashqai Tekna (2014)
- `nissan-qashqai-1.jpg`
- `nissan-qashqai-2.jpg`

### 13. Ford Fiesta Zetec (2013)
- `ford-fiesta-1.jpg`
- `ford-fiesta-2.jpg`

### 14. Volkswagen Polo Match (2014)
- `vw-polo-match-1.jpg`
- `vw-polo-match-2.jpg`

### 15. Volvo V40 R-Design (2015)
- `volvo-v40-1.jpg`
- `volvo-v40-2.jpg`

## Image Best Practices

### Resolution & Format
- **Main image (image 1)**: 1200x800px minimum, landscape orientation
- **Gallery images**: 1200x800px minimum
- **Format**: JPG (compressed to 200-300KB for web performance)
- **Quality**: 80-85% JPEG quality is optimal

### Photography Tips
1. **Main photo** should be:
   - 3/4 front angle showing the best side of the vehicle
   - Clean background (preferably your dealership lot)
   - Good lighting (overcast days work best)
   - Vehicle clean and polished

2. **Gallery image** should show:
   - Interior/dashboard
   - Rear view
   - Side profile
   - Engine bay (for performance cars)
   - Any special features

### Quick Setup Steps

1. **Create the directory:**
   ```bash
   mkdir -p public/images/vehicles
   ```

2. **Copy your vehicle photos** from the CSV source to this directory

3. **Rename the files** to match the naming convention above

4. **Optimize images** (optional but recommended):
   ```bash
   # Using ImageMagick (if installed)
   mogrify -resize 1200x800 -quality 85 *.jpg
   ```

5. **Test the site** to ensure images load correctly

## Adding More Images

To add more gallery images for any vehicle, simply:

1. Add more image files with the same naming pattern:
   - `bmw-m2-3.jpg`
   - `bmw-m2-4.jpg`
   - etc.

2. Update the `images` array in `data/cars.ts`:
   ```typescript
   images: [
     "/images/vehicles/bmw-m2-1.jpg",
     "/images/vehicles/bmw-m2-2.jpg",
     "/images/vehicles/bmw-m2-3.jpg", // Add new images here
     "/images/vehicles/bmw-m2-4.jpg",
   ],
   ```

## Temporary Solution (While Gathering Photos)

If you don't have all photos ready yet, you can use placeholder images temporarily:

```typescript
image: "https://placehold.co/1200x800/333/fff?text=BMW+M2",
images: [
  "https://placehold.co/1200x800/333/fff?text=BMW+M2+Main",
  "https://placehold.co/1200x800/333/fff?text=BMW+M2+Interior",
],
```

## Need Help?

If you need assistance:
- Optimizing images
- Bulk renaming files
- Setting up automated image processing
- Creating image variants for different screen sizes

Just ask!
