# 🎬 StreamHub - Watch Movies & TV Shows Online

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-blue)](https://web.dev/progressive-web-apps/)

**Stream your favorite movies and TV shows with friends in real-time!**

![StreamHub Banner](https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=400&fit=crop)

## ✨ Features

- 🎬 **Multiple Streaming Sources** - VidSrc, VidCore, 2Embed, SuperEmbed
- 🎉 **Watch Parties** - Synchronized viewing with real-time chat
- 🎭 **Theater Mode** - Fullscreen player like YouTube
- 📱 **PWA Support** - Install as native app on any device
- 🚫 **No Ads** - Clean streaming experience
- 🎯 **TMDB Integration** - Complete movie/TV database
- 🔌 **Chrome Extension Compatible** - Works with all extensions
- 🌍 **Multi-language Subtitles** - Where available
- 📺 **4K Support** - Highest quality streams

## 🚀 Quick Start

### Deploy to Netlify (Recommended)

1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect GitHub and select this repo
4. Add environment variables (see below)
5. Deploy!

### ⚡ Automatic Updates on Netlify

**Yes! Updates appear automatically on https://marqueeflix.netlify.app/**

When you push to GitHub:
1. Netlify detects the push automatically
2. Triggers a new build
3. Deploys the updated site
4. Your live site updates in 2-5 minutes

**No manual action needed!** Just push to GitHub and Netlify handles the rest.

To check build status:
- Go to your Netlify dashboard
- Click on your site
- View "Deploys" tab
- See build progress and logs

### Run Locally

```bash
# Clone repository
git clone https://github.com/kaygabriel342-cpu/streamhub.git
cd streamhub

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Installation

### Windows

1. **Download Node.js**: https://nodejs.org/
2. **Clone repo**: `git clone https://github.com/kaygabriel342-cpu/streamhub.git`
3. **Install**: `npm install`
4. **Run**: `npm run dev`

Or use the included PowerShell script:
```powershell
.\install-streamhub.ps1
```

### Docker

```bash
docker-compose up -d
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time**: Socket.io
- **API**: TMDB API
- **Streaming**: VidSrc, VidCore, 2Embed, SuperEmbed

## 📱 PWA Features

- ✅ Installable on any device
- ✅ Offline support
- ✅ Auto-updates
- ✅ Native app experience
- ✅ App shortcuts (Movies, TV, Parties)

## 🎮 How to Use

1. **Browse** movies and TV shows on the homepage
2. **Click** any title to see details and streaming options
3. **Select** your preferred streaming source
4. **Enable** theater mode for fullscreen viewing
5. **Start Watch Party** to sync with friends

## 🔐 Environment Variables

### For Netlify Deployment

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```
TMDB_API_KEY=8cf03ecf0cacc0582ea33c57b5efd815
TMDB_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Y2YwM2VjZjBjYWNjMDU4MmVhMzNjNTdiNWVmZDgxNSIsIm5iZiI6MTc4NjE3MzI5OC45NzEsInN1YiI6IjZhNzZkNzcyN2Q4ZjE5NDVjOTRkNjQ4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1d6kNfrQOFoQkf5qFbOKOdHvfzwSL-DScbGz8ZQ3yVY
ADMIN_EMAIL=admin@marquee.com
ADMIN_PASSWORD=Kuya@254
```

### For Local Development

Create a `.env` file:

```env
TMDB_API_KEY=8cf03ecf0cacc0582ea33c57b5efd815
TMDB_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Y2YwM2VjZjBjYWNjMDU4MmVhMzNjNTdiNWVmZDgxNSIsIm5iZiI6MTc4NjE3MzI5OC45NzEsInN1YiI6IjZhNzZkNzcyN2Q4ZjE5NDVjOTRkNjQ4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1d6kNfrQOFoQkf5qFbOKOdHvfzwSL-DScbGz8ZQ3yVY
ADMIN_EMAIL=admin@marquee.com
ADMIN_PASSWORD=Kuya@254
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## ⚠️ Disclaimer

This project is for educational purposes. Streaming content may be subject to copyright laws in your region. Please use responsibly and comply with local laws.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie/TV data
- [VidSrc](https://vidsrc.sbs/) for streaming
- [VidCore](https://www.vidcore.org/) for 4K streaming
- [2Embed](https://www.2embed.online/) for backup sources

---

**Built with ❤️ by kaygabriel342-cpu**


## 🚀 Quick Start - Run Locally on Windows

### Prerequisites

1. **Node.js (v18 or higher)**
   - Download from: https://nodejs.org/
   - Choose **Windows Installer (.msi)** - 32-bit or 64-bit based on your system
   
2. **PostgreSQL Database**
   - Download from: https://www.postgresql.org/download/windows/
   - Or use Docker (see below)

### Installation Steps

#### 1. Download the Application

```powershell
# Clone or download this repository
git clone https://github.com/yourusername/streamhub.git
cd streamhub
```

#### 2. Install Dependencies

```powershell
npm install
```

#### 3. Configure Environment

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
TMDB_API_KEY=8cf03ecf0cacc0582ea33c57b5efd815
TMDB_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Y2YwM2VjZjBjYWNjMDU4MmVhMzNjNTdiNWVmZDgxNSIsIm5iZiI6MTc4NjE3MzI5OC45NzEsInN1YiI6IjZhNzZkNzcyN2Q4ZjE5NDVjOTRkNjQ4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1d6kNfrQOFoQkf5qFbOKOdHvfzwSL-DScbGz8ZQ3yVY
```

#### 4. Setup Database

```powershell
# Using Drizzle ORM
npx drizzle-kit push
```

#### 5. Run the Application

```powershell
# Development mode
npm run dev

# Production mode
npm run build
npm run start
```

Open **http://localhost:3000** in your browser.

---

## 📦 Alternative: Docker Setup (Recommended)

If you have Docker installed, this is the easiest way:

### 1. Create `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  streamhub:
    build: .
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/app_db
      TMDB_API_KEY: 8cf03ecf0cacc0582ea33c57b5efd815
      TMDB_ACCESS_TOKEN: eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Y2YwM2VjZjBjYWNjMDU4MmVhMzNjNTdiNWVmZDgxNSIsIm5iZiI6MTc4NjE3MzI5OC45NzEsInN1YiI6IjZhNzZkNzcyN2Q4ZjE5NDVjOTRkNjQ4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1d6kNfrQOFoQkf5qFbOKOdHvfzwSL-DScbGz8ZQ3yVY
    ports:
      - "3000:3000"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### 2. Create `Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 3. Run with Docker

```powershell
docker-compose up -d
```

Access at **http://localhost:3000**

---

## 🖥️ Install as Desktop App (PWA)

### Chrome/Edge

1. Open the app in Chrome or Edge
2. Click the **three dots** menu (⋮)
3. Select **"Install StreamHub"** or **"Create shortcut"**
4. Check **"Open as window"**
5. Click **Install**

The app will now appear in your Start Menu and run in its own window!

### Windows 10/11 PWA Installation

1. Visit the site in Chrome/Edge
2. Look for the **install icon** in the address bar
3. Click **Install**
4. App appears in Start Menu

---

## 🔧 Create Windows Shortcut

### Manual Shortcut

1. Right-click on Desktop → **New** → **Shortcut**
2. Enter location:
   ```
   http://localhost:3000
   ```
3. Name it: **StreamHub**
4. Right-click shortcut → **Properties**
5. Change icon to a custom .ico file
6. Click **OK**

### Batch File Launcher

Create `start-streamhub.bat`:

```batch
@echo off
echo Starting StreamHub...
cd /d "%~dp0"
npm run dev
pause
```

Double-click to start the app!

---

## 📱 Install on Mobile

### Android (Chrome)

1. Open site in Chrome
2. Tap **three dots** menu
3. Select **"Add to Home screen"**
4. Tap **Add**

### iOS (Safari)

1. Open site in Safari
2. Tap **Share** button
3. Select **"Add to Home Screen"**
4. Tap **Add**

---

## 🎮 Features

- ✅ **Multiple Streaming Sources** - VidSrc, VidCore, 2Embed, SuperEmbed
- ✅ **Watch Parties** - Synchronized viewing with friends
- ✅ **Theater Mode** - Fullscreen player like YouTube
- ✅ **TMDB Integration** - Complete movie/TV database
- ✅ **Real-time Chat** - During watch parties
- ✅ **No Sandbox** - Chrome extension compatible
- ✅ **No Ads** - Clean streaming experience
- ✅ **4K Support** - Where available
- ✅ **Subtitles** - Multi-language support

---

## 🛠️ Development Commands

```powershell
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run TypeScript check
npm run typecheck

# Database migrations
npx drizzle-kit push
```

---

## 📋 System Requirements

### Minimum
- **OS**: Windows 7/8/10/11 (32-bit or 64-bit)
- **RAM**: 4GB
- **Storage**: 500MB
- **Browser**: Chrome 90+, Edge 90+, Firefox 88+

### Recommended
- **OS**: Windows 10/11 (64-bit)
- **RAM**: 8GB+
- **Storage**: 1GB+
- **Internet**: 10 Mbps+ for HD streaming

---

## 🔐 Security Notes

- TMDB API keys are stored server-side only
- No user authentication required (anonymous watch parties)
- PostgreSQL connection uses local database
- All streaming is via embedded iframes (no direct video hosting)

---

## 📞 Support

For issues or questions:
1. Check the console for errors (F12)
2. Verify PostgreSQL is running
3. Ensure Node.js v18+ is installed
4. Check `.env` file configuration

---

## 📄 License

This project is for educational purposes. Streaming content may be subject to copyright laws in your region.

---

**Built with Next.js, React, PostgreSQL, Drizzle ORM, Socket.io, and TMDB API**
