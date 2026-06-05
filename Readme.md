# Movie Tracker

A modern, beautiful movie and TV series watchlist tracker built with React, TypeScript, Tailwind CSS, and Supabase.

Drag and drop IMDB links to instantly add movies or series to your personal watchlist. Track your progress, manage seasons and episodes, and get notified about new episodes.

## ✨ Features

- **Drag & Drop IMDB Integration**: Simply drag any IMDB movie/series link into the app
- **TMDB Metadata**: Automatically fetches posters, overviews, and details
- **Progress Tracking**: For series, track current season and episode
- **New Episodes Checker**: Built-in Supabase Edge Function to detect new episodes
- **Responsive Design**: Beautiful dark UI optimized for desktop and mobile
- **Supabase Backend**: Real-time database with authentication ready
- **Persian UI**: Fully localized in Persian (Farsi)

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **API**: TMDB (The Movie Database)
- **Deployment**: Ready for Vercel / Netlify / Supabase Hosting

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- Supabase account
- TMDB API key (optional but recommended)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/alireza5522/Movie-tracker.git
   cd Movie-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_TMDB_API_KEY=your_tmdb_api_key
   ```

4. **Setup Supabase**
   - Create a new Supabase project
   - Run the SQL in `supabase/migrations/` to create the `watchlist` table
   - Deploy the Edge Function for new episode checking

5. **Run the development server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   run.vbs
   ```

## 📁 Project Structure

```
Movie-tracker/
├── src/
│   ├── components/     # React components (MovieCard, AddModal, etc.)
│   ├── lib/           # Utilities, Supabase client, TMDB helpers
│   ├── types/         # TypeScript definitions
│   ├── App.tsx
│   └── main.tsx
├── supabase/          # Supabase migrations and functions
├── public/
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 🎮 How to Use

1. Open the app
2. Go to any movie or TV series page on IMDB
3. Drag the URL from the address bar and drop it into the dashed area
4. The movie/series will be automatically added with poster and details
5. Click on any card to update progress, status, or delete

## 📋 Database Schema

The main table `watchlist` includes:
- `id`, `created_at`
- `tmdb_id`, `imdb_id`
- `title`, `year`, `poster`, `overview`
- `type` (movie/tv)
- `current_season`, `current_episode`, `total_seasons`
- `status` (watching, completed, planned, etc.)
- `has_new_episodes`

## 🔧 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
made with: bolt.new
by: https://t.me/sefrooyekk