# Assets Needed for Portfolio

## Images Required

### 1. Profile Headshot

- **File**: `public/headshot.jpg`
- **Size**: Square or close to square (e.g., 400x400px or 500x500px)
- **Format**: JPG or PNG
- **Style**: Professional headshot, similar to MacBrennan's (square, centered on page)
- **Placement**: Will be displayed centered below the top navigation bar

### 2. Experience/Job Icons (for "Jobs" section)

You'll need small icons (24x24px to 32x32px) for each company/project. These should be:

- **Format**: PNG or SVG (transparent background preferred)
- **Size**: 24-32px square
- **Style**: Simple, recognizable logos or icons

**Companies/Projects from your resume that need icons:**

1. **Nebula Academy** - Could be a rocket, star, or nebula icon
2. **Stellar-Learn LMS** - Star icon or education symbol
3. **Wallenpaupack Cleaning** - Cleaning/service icon
4. **Aleah's Art Portfolio** - Art/palette icon
5. **T-Mobile** - You can use their actual logo (24x24px)
6. **Mountain Valley Builders** - Construction/building icon

You can either:

- **Option A**: Upload these icons to Cloudinary and use the URLs in the admin form
- **Option B**: Place icon files in `public/icons/` and reference them as `/icons/filename.png`
- **Option C**: Use emoji as placeholders temporarily (⚡ for Nebula, ⭐ for Stellar-Learn, etc.)

## Database Schema Update Required

Run this SQL in Supabase to add the new fields:

```sql
alter table public.experience
add column if not exists icon_url text,
add column if not exists domain text;
```

## Content Needed

### Condensed Job Blurbs (1-2 sentences max per job)

Based on your resume, here are suggested blurbs. You can edit these in the admin:

1. **Nebula Academy** (Current)

   - "Lead engineer on full-scale LMS, teaching 100+ students while building backend systems with Next.js, Azure, and Stripe."

2. **Stellar-Learn LMS** (Key Project)

   - "Production LMS serving multiple campuses with Next.js, PostgreSQL, Mux video, and Stripe billing."

3. **Wallenpaupack Cleaning** (Key Project)

   - "Commercial booking platform with automated Stripe payments and Google Calendar sync for daily operations."

4. **Aleah's Art Portfolio** (Key Project)

   - "High-performance artist portfolio with dynamic image optimization using Next.js and Cloudinary."

5. **T-Mobile** (Past)

   - "Technical troubleshooting and customer experience optimization with network configurations."

6. **Mountain Valley Builders** (Past)
   - "Residential construction projects with focus on safety and precision craftsmanship."

### Status Tags

- **Current**: For Nebula Academy
- **Exited**: For completed positions
- Leave blank for past jobs without special status

## Quick Setup Steps

1. **Add headshot**: Place your photo at `public/headshot.jpg`
2. **Run SQL**: Execute the ALTER TABLE statement above in Supabase
3. **Create experience rows** in `/admin`:
   - Fill in name, role, years, blurb, link, domain
   - For icons: Either upload to Cloudinary and paste URL, or use `/icons/name.png` if hosting locally
4. **Test the layout**: Visit `/` to see how it looks

## Icon Suggestions (if you want to create custom ones)

For a MacBrennan-style look, the icons are usually:

- Simple geometric shapes with single letters or symbols
- Colorful but not overwhelming
- Consistent size (24-32px)

You could create simple colored squares/circles with initials:

- **NA** for Nebula Academy (purple background)
- **SL** for Stellar-Learn (blue background)
- **WC** for Wallenpaupack Cleaning (green background)
- etc.

Or use free icon libraries like:

- [Simple Icons](https://simpleicons.org/) for brand logos
- [Heroicons](https://heroicons.com/) for generic icons
- Create custom ones in Figma/Canva
