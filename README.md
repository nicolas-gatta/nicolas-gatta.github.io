# 🗡️ Dark Souls Portfolio - Linktree

A beautifully dark, **Dark Souls-themed** portfolio linktree built with **React + TypeScript** and hosted on GitHub Pages.

## ✨ Features

- ⚫ **Dark Souls Aesthetic** - Immersive dark theme with gold accents and gothic typography
- 🔗 **Linktree Links** - GitHub, LinkedIn, Email (Professional & Personal), Phone
- 📱 **Fully Responsive** - Beautiful on mobile, tablet, and desktop
- ✨ **Smooth Animations** - Elegant transitions and hover effects
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance
- 🎨 **Customizable** - Easy to modify links, colors, and content

## 🛠️ Technology Stack

- **React** 18+ - UI library
- **TypeScript** - Type-safe development
- **Vite** - Next-generation build tool
- **CSS3** - Custom animations and responsive design
- **Lucide React** - Beautiful icons

## 📦 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

Visit `http://localhost:5173` to see your portfolio in action!

## 🚀 Deployment to GitHub Pages

### Setup

1. **Update `vite.config.ts`** - If your repo isn't named `username.github.io`, change the `base` path:
   ```typescript
   export default defineConfig({
     base: '/repo-name/',
     // ...
   })
   ```

2. **Deploy using gh-pages**:
   ```bash
   npm run deploy
   ```

### Alternative: GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🎨 Customization

### Edit Links
Open [src/App.tsx](src/App.tsx) and modify the `links` array with your information:

```typescript
const links: LinkItem[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/yourusername',
    icon: <Github size={24} />,
    color: '#D4AF37',
  },
  // ... more links
]
```

### Customize Profile
- **Name**: Change "Undead Wanderer" in App.tsx
- **Title**: Change "Chosen One Portfolio" 
- **Icon**: Change the ⚔️ sword emoji (line: `<div className="profile-icon">⚔️</div>`)
- **Footer**: Update the footer text

### Style & Colors
Edit [src/App.css](src/App.css) to customize:
- Colors (change CSS variables in `:root`)
- Fonts (Google Fonts imports at top)
- Animations (keyframe definitions)
- Responsive breakpoints

## 📝 CSS Variables (Dark Souls Palette)

```css
--primary-dark: #0a0a0a;
--secondary-dark: #1a1a1a;
--accent-gold: #d4af37;
--accent-bronze: #a7795d;
--text-primary: #e8d4b4;
```

## 🔧 Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 File Structure

```
├── public/
│   └── index.html
├── src/
│   ├── App.tsx          # Main component with links
│   ├── App.css          # Styles & animations
│   ├── index.css        # Global styles
│   └── main.tsx         # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 Next Steps

1. Update all links with your actual URLs
2. Customize colors and fonts to match your personal brand
3. Add your own profile icon or image (replace emoji)
4. Deploy to GitHub Pages
5. Share your portfolio!

## 📧 Support

For questions or suggestions, feel free to reach out!

---

**Remember: You are the Chosen One. Your work speaks for itself.** ⚔️🗡️

_"In the age of Dark Souls, your portfolio shines like the Ashen One."_