# PEHOREM PRIME

**Luxury Properties & Premium Vehicles Marketplace**

AI-powered global marketplace for luxury real estate and premium automobiles. Built with Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, and Prisma ORM.

## Tech Stack

- **Framework:** Next.js 16 (Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma 6
- **Icons:** Lucide React

## Getting Started

```bash
npm install
npm run dev
```

## Features

- Cinematic luxury homepage with video backgrounds
- Property marketplace with filters, comparison, mortgage calculator
- Vehicle marketplace with specs and test-drive booking
- AI-powered chatbot with WhatsApp fallback
- Floating WhatsApp support (draggable)
- AI Advertisement Boosting system
- User dashboard with analytics
- Admin panel with CMS
- Agent & Dealer profiles
- Mortgage calculator
- Map integration
- Property comparison tool

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma db push` | Sync database schema |
| `npx prisma generate` | Generate Prisma client |

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp support number |

## Project Structure

```
src/
├── app/           # Pages and API routes
├── components/    # React components
│   ├── ui/        # Reusable UI
│   ├── layout/    # Navbar, Footer, WhatsApp
│   ├── home/      # Homepage sections
│   ├── properties/# Property components
│   ├── vehicles/  # Vehicle components
│   ├── chatbot/   # AI Chatbot
│   └── ads/       # Ad components
├── lib/           # Utilities and Prisma client
├── types/         # TypeScript types
└── hooks/         # Custom hooks
```
