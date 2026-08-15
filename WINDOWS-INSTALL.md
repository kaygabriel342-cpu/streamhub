# 🪟 Windows Installation Guide

## ⚡ Quick Start (Easiest Method)

### Method 1: Install as Web App (Recommended)

**No installation needed!** Just visit the website and install it as a PWA:

1. Open **Chrome** or **Edge** browser
2. Go to **http://localhost:3000** (or your deployed URL)
3. Click the **install icon** in the address bar (⊕)
4. Click **"Install"**
5. StreamHub will appear in your Start Menu!

**Benefits:**
- ✅ Works on 32-bit and 64-bit Windows
- ✅ Automatic updates
- ✅ No extra software needed
- ✅ Runs like a native app

---

## 📦 Full Installation Options

### Method 2: Run Locally with Node.js

#### Step 1: Install Node.js

1. Download from: **https://nodejs.org/**
2. Choose **Windows Installer (.msi)**
3. Select **LTS version** (recommended)
4. Run the installer
5. Restart your computer

#### Step 2: Install PostgreSQL

**Option A: PostgreSQL Installer**
1. Download from: **https://www.postgresql.org/download/windows/**
2. Run the installer
3. Set password to: `postgres`
4. Keep default port: `5432`

**Option B: Docker (Easier)**
```powershell
docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15
```

#### Step 3: Setup StreamHub

1. **Download** the StreamHub folder
2. **Open PowerShell** in the folder
3. Run the installer:
   ```powershell
   .\install-streamhub.ps1
   ```
4. **Start the app:**
   ```powershell
   npm run dev
   ```
5. Open **http://localhost:3000**

---

### Method 3: Desktop App with Electron (64-bit Only)

⚠️ **Note:** Electron no longer supports 32-bit Windows (since 2022). This method requires 64-bit Windows 10/11.

#### Install Electron Dependencies

```powershell
npm install --save-dev electron electron-builder concurrently wait-on
```

#### Build Windows Executable

```powershell
npm run electron:build:win
```

This creates:
- `dist-electron/StreamHub-1.0.0-Setup.exe` - Installer
- `dist-electron/win-unpacked/` - Portable version

#### Run Without Building (Development)

```powershell
npm run electron:dev
```

---

## 🎯 Quick Launch Options

### Option A: Double-click Batch File

Simply double-click: **`start-streamhub.bat`**

This will:
1. Check for Node.js
2. Install dependencies if needed
3. Build the app
4. Start the server
5. Open in your browser

### Option B: Create Desktop Shortcut

1. Right-click on Desktop → **New** → **Shortcut**
2. Enter: `http://localhost:3000`
3. Name: **StreamHub**
4. Click **Finish**
5. (Optional) Right-click → **Properties** → **Change Icon**

### Option C: Pin to Taskbar

1. Open StreamHub in Chrome/Edge
2. Click **three dots** (⋮) → **More tools** → **Create shortcut**
3. Check **"Open as window"**
4. Click **Create**
5. Right-click the shortcut → **Pin to taskbar**

---

## 🔧 Troubleshooting

### "Node.js is not installed"
- Download from: https://nodejs.org/
- Install the **LTS version**
- Restart your computer
- Try again

### "PostgreSQL connection error"
- Ensure PostgreSQL is running
- Check Windows Services for "postgresql"
- Or use Docker: `docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15`

### "npm not recognized"
- Node.js not installed correctly
- Reinstall Node.js
- Restart computer
- Open **new** PowerShell window

### App won't start
```powershell
# Delete and reinstall
rm -r node_modules
rm package-lock.json
npm install
npm run dev
```

### Port 3000 already in use
```powershell
# Kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

---

## 📊 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **OS** | Windows 7 | Windows 10/11 |
| **Architecture** | 32-bit or 64-bit | 64-bit |
| **RAM** | 4 GB | 8 GB+ |
| **Storage** | 500 MB | 1 GB+ |
| **Internet** | 5 Mbps | 25 Mbps+ |
| **Browser** | Chrome 90+ | Latest Chrome/Edge |

---

## 🚀 Performance Tips

1. **Use Chrome or Edge** - Best performance
2. **Enable Hardware Acceleration** - Browser settings
3. **Close unused tabs** - Free up RAM
4. **Use Ethernet** - Better than WiFi for streaming
5. **Clear cache regularly** - Settings → Privacy

---

## 📱 Mobile Installation

### Android
1. Open Chrome
2. Visit site
3. Tap **⋮** → **Add to Home screen**
4. Tap **Add**

### iPhone/iPad
1. Open Safari
2. Visit site
3. Tap **Share** button
4. **Add to Home Screen**
5. Tap **Add**

---

## 🎮 Features Available

- ✅ **4 Streaming Sources** - Switch if one fails
- ✅ **Watch Parties** - Sync with friends
- ✅ **Theater Mode** - Fullscreen player
- ✅ **No Ads** - Clean experience
- ✅ **4K Support** - Where available
- ✅ **Subtitles** - Multiple languages
- ✅ **Chrome Extensions** - Full compatibility
- ✅ **PWA Support** - Install as app

---

## 📞 Need Help?

1. Check **README.md** for detailed docs
2. Press **F12** in browser for console errors
3. Verify PostgreSQL is running
4. Ensure `.env` file exists with correct values

---

**Enjoy streaming! 🎬🍿**
