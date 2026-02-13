# Car Nation - Car Dealer MVP

A modern, mobile-first car dealership website built with Next.js, featuring a clean UI and WhatsApp integration.

## Features

- 🚗 40 pre-loaded quality used cars
- 📱 Mobile-first responsive design
- 🔍 Advanced filtering system (make, body type, fuel type, price, mileage)
- 💬 WhatsApp integration for instant enquiries
- ⭐ Trust badges and social proof
- 🎨 Modern UI with shadcn/ui components
- ⚡ Fast performance with Next.js App Router
- 🎯 Clean data abstraction layer

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure WhatsApp:**
   - Open the following files and replace `YOUR_PHONE_NUMBER` with your WhatsApp business number (format: country code + number, e.g., 447123456789):
     - `components/Hero.tsx`
     - `components/Navigation.tsx`
     - `app/page.tsx`
     - `app/cars/[id]/page.tsx`

3. **Add your logo:**
   - Replace the car icon in `components/Navigation.tsx` with your logo image

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Netlify

This project is configured and ready for Netlify deployment. See `DEPLOYMENT.md` for detailed deployment instructions.

**Quick deploy:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

Or connect your Git repository to Netlify for automatic deployments.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── cars/[id]/         # Car detail page
│   ├── inventory/         # Inventory listing page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── CarCard.tsx       # Car card component
│   ├── CarFilters.tsx    # Filtering system
│   ├── Hero.tsx          # Hero section
│   ├── Navigation.tsx    # Header navigation
│   └── TrustBadges.tsx   # Trust indicators
├── data/
│   └── cars.ts           # Hard-coded car data (Phase 1)
├── services/
│   └── cars.service.ts   # Data access layer
└── lib/
    └── utils.ts          # Utility functions
```

## Data Architecture

All car data access goes through `services/cars.service.ts`. UI components never import `data/cars.ts` directly. This abstraction layer makes it easy to swap to an API in Phase 2.

### Available Service Functions

- `getCars(filters?, sort?)` - Get all cars with filtering and sorting
- `getCarById(id)` - Get single car by ID
- `getFeaturedCars(limit)` - Get featured cars
- `getAllMakes()` - Get all unique car makes
- `getAllBodyTypes()` - Get all body types
- `getAllFuelTypes()` - Get all fuel types
- `getPriceRange()` - Get min/max price range
- `searchCars(query)` - Text search across cars

## Customization

### Update Trust Badges

Edit `components/TrustBadges.tsx` to update:
- Years in business
- Number of customers
- Trust statements

### Modify Car Data

Edit `data/cars.ts` to:
- Add/remove cars
- Update prices
- Change features

### Styling

The project uses Tailwind CSS with a custom color scheme. Update `app/globals.css` to change colors.

## Future Enhancements (Phase 2)

- Connect to real API/database
- Add admin panel for managing cars
- Implement image uploads
- Add customer testimonials
- Finance calculator
- Contact form with email notifications

## License

© 2026 Car Nation. All rights reserved.
