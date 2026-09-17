# ThreatLens Official Website (Deployable Package)

This directory (`website/`) contains the standalone, zero-dependency official product showcase and advertising website for **ThreatLens** — Next-Gen Cyber Transparency & Endpoint Telemetry.

---

## ⚡ Architecture & Features

- **Pure Zero-Dependency Stack**: Built using standard HTML5, Vanilla CSS3 (high-tech Cyber-HUD design system, glassmorphism, responsive grid), and modular JavaScript.
- **Interactive Cyber Simulator**: In-browser interactive sandbox allowing prospective users to simulate attack vectors (Encoded PowerShell Stager, Canary Ransomware Decoy, Registry Persistence, Crypto Clipper Hijack) with live gauge reaction and 5-point Explainability modals.
- **Cryptic Windows Log Decoder**: Interactive demo translating Event IDs `4625`, `7045`, `1102`, and `4104` from raw XML into human language.
- **Responsive**: Fully optimized for mobile screens, tablets, laptops, and ultra-wide displays.
- **Fast**: Zero build steps, zero node_modules, instantaneous asset loading, and SEO optimized with complete OpenGraph & Twitter metadata.

---

## 🚀 One-Click Deployment Options

Because this is a completely static, self-contained directory with bundled assets, you can deploy it anywhere in seconds:

### 1. GitHub Pages
1. Push this repository to GitHub.
2. In your repository settings on GitHub, navigate to **Settings ➔ Pages**.
3. Under **Build and deployment ➔ Source**, select **Deploy from a branch**.
4. Choose your branch (e.g. `main`) and set the folder path to `/website`.
5. Click **Save**. Your site will be live at `https://<username>.github.io/<repo>/`!

### 2. Vercel
- If using the Vercel CLI:
  ```bash
  cd website
  npx vercel
  ```
- Or link the repository on [Vercel Dashboard](https://vercel.com/) and set the **Root Directory** to `website`.

### 3. Netlify
- Drag and drop the `website/` folder directly onto [Netlify Drop](https://app.netlify.com/drop).
- Or in the Netlify dashboard, configure:
  - **Base directory**: `website`
  - **Publish directory**: `.` (or leave empty)

### 4. Cloudflare Pages
- Connect your GitHub repository on the Cloudflare Dashboard.
- Set **Build output directory** to `website`.
- Framework preset: `None`. Click **Save and Deploy**.

### 5. Docker / Nginx
A simple single-stage Dockerfile to serve via Alpine Nginx:

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Run with:
```bash
docker build -t threatlens-site website/
docker run -d -p 8080:80 threatlens-site
```

---

## 🧪 Local Preview

To test or preview the website locally without installing any tools:

### Using Python (built-in):
```powershell
python -m http.server 8000 --directory website
```
Then open your browser at: `http://localhost:8000`

### Using Node / npx:
```powershell
npx serve website
```

---

## 📁 Directory Structure

```text
website/
├── index.html           # Main landing page (SEO, OpenGraph, Cyber-HUD design)
├── robots.txt           # Crawler instructions
├── sitemap.xml          # Search engine sitemap
├── README.md            # Deployment documentation (this file)
├── css/
│   └── styles.css       # Complete dark-mode design system & animations
├── js/
│   ├── simulator.js     # Live threat simulator & Why? Explainability modal
│   └── main.js          # Navigation, AI assistant demo, gallery switcher, decoder
└── assets/              # 100% self-contained offline media
    ├── threatlens.png
    ├── threatlens.ico
    ├── shield_emblem.png
    ├── threatlens_*.png # Multi-resolution icons (16px to 512px)
    └── screenshots/
        ├── hud_overview.png
        ├── telemetry_why.png
        └── forensics_lineage.png
```

