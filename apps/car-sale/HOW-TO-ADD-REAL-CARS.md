# 📸 How to Add Your Real Car Inventory

## Quick Guide to Adding Actual Vehicle Photos

---

## 📁 **Step 1: Prepare Your Photos**

### **For Each Car:**
Take **6-8 high-quality photos**:
1. Front 3/4 view (hero shot)
2. Rear 3/4 view
3. Side profile
4. Interior dashboard
5. Interior seats
6. Engine bay (if impressive)
7. Wheels/details
8. Additional angles

### **Photo Requirements:**
- **Format**: JPG or WebP
- **Size**: 1920x1080px recommended
- **Quality**: High resolution
- **Lighting**: Natural daylight or professional
- **Background**: Clean, minimal distractions

---

## 📂 **Step 2: Organize Files**

Create folders in `/public/cars/`:

```
/public/cars/
  ├── bmw-m4-competition/
  │   ├── front.jpg
  │   ├── rear.jpg
  │   ├── side.jpg
  │   ├── interior-1.jpg
  │   └── interior-2.jpg
  ├── porsche-911/
  │   ├── front.jpg
  │   ├── rear.jpg
  │   └── side.jpg
  └── range-rover-svr/
      ├── front.jpg
      └── side.jpg
```

---

## ✏️ **Step 3: Update data/cars.ts**

Replace placeholder URLs with your local paths:

### **Before** (Placeholder):
```typescript
{
  id: "1",
  make: "BMW",
  model: "M4 Competition",
  image: "https://images.unsplash.com/photo-xyz?w=800",
  images: [
    "https://images.unsplash.com/photo-xyz?w=800",
    "https://images.unsplash.com/photo-abc?w=800",
  ],
}
```

### **After** (Your Photos):
```typescript
{
  id: "1",
  make: "BMW",
  model: "M4 Competition",
  image: "/cars/bmw-m4-competition/front.jpg",
  images: [
    "/cars/bmw-m4-competition/front.jpg",
    "/cars/bmw-m4-competition/rear.jpg",
    "/cars/bmw-m4-competition/side.jpg",
    "/cars/bmw-m4-competition/interior-1.jpg",
  ],
}
```

---

## 🚀 **Step 4: Add New Cars**

Copy this template for each new car:

```typescript
{
  id: "7", // Increment ID
  make: "Ferrari",
  model: "F8 Tributo",
  year: 2021,
  price: 249995,
  mileage: 2500,
  fuelType: "Petrol",
  transmission: "Automatic",
  bodyType: "Coupe",
  color: "Rosso Corsa",
  doors: 2,
  seats: 2,
  image: "/cars/ferrari-f8/front.jpg",
  images: [
    "/cars/ferrari-f8/front.jpg",
    "/cars/ferrari-f8/rear.jpg",
    "/cars/ferrari-f8/side.jpg",
  ],
  description: "Your detailed description here...",
  features: [
    "Feature 1",
    "Feature 2",
    "Feature 3",
  ],
  condition: "Excellent",
},
```

---

## 🛠️ **Image Optimization Tips**

### **Before Uploading:**
1. **Resize** to max 2000px width
2. **Compress** to 80-90% quality
3. **Convert to WebP** for better performance
4. **Remove EXIF data** for privacy

### **Tools:**
- **Online**: TinyPNG, Squoosh.app
- **Mac**: ImageOptim
- **Command line**: `imagemagick`, `cwebp`

---

## 📊 **Bulk Upload Script**

Want me to create a script that:
- Reads images from a folder
- Optimizes them automatically
- Generates the cars.ts entries
- Renames files consistently

---

## 🎯 **Ready to Add Real Cars?**

**Tell me:**
1. **Do you have photos ready?**
2. **Want me to create bulk upload script?**
3. **Or should we scrape a site for reference data?**

Let me know and I'll help you get your real inventory loaded! 📷
