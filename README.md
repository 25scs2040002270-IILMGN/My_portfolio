# MD Amaan Sahzada — Personal Portfolio

A production-quality personal portfolio website built with **React + Vite + TypeScript + Tailwind CSS**.  
Designed with a **dark theme and neon cyan/purple accents**, this portfolio presents my skills, projects, education, and contact information in a clean, modern single-page layout.

---

## Live Preview

> Deploy to Vercel in under 2 minutes — see [Deployment](#deployment) below.

---

## Features

- **Dark neon theme** — deep black background with cyan (`#00f5ff`) and purple (`#9333ea`) accents
- **Typing animation** — hero section cycles through role titles (React Developer, Full Stack Developer, etc.)
- **Scroll-triggered animations** — every section fades and slides in using Framer Motion
- **Active nav tracking** — the navbar highlights the link for the section currently in view
- **Fully responsive** — works on mobile, tablet, and desktop screens
- **Sections**: Hero, About, Skills, Projects, Education Timeline, Contact Form, Footer
- **Space Mono font** — terminal/monospace aesthetic throughout
- **Vercel-ready** — includes `vercel.json` for proper SPA routing

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev/) | UI component library |
| [Vite 6](https://vitejs.dev/) | Build tool & dev server |
| [TypeScript 5.7](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Lucide React](https://lucide.dev/) | SVG icon components |
| [React Icons](https://react-icons.github.io/react-icons/) | Tech stack logos (Simple Icons + Font Awesome) |
| [Radix UI](https://www.radix-ui.com/) | Accessible headless UI primitives |
| [@tanstack/react-query](https://tanstack.com/query) | Data fetching & caching infrastructure |

---

## Folder Structure

```
portfolio-deploy/
├── index.html                  # HTML entry point — loads the app + Google Fonts
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite configuration (alias, plugins, build output)
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel SPA routing — redirects all paths to index.html
├── .gitignore                  # Ignores node_modules, dist, .env files
└── src/
    ├── main.tsx                # React entry — mounts <App /> into #root
    ├── App.tsx                 # Root component — sets up QueryClient + TooltipProvider
    ├── index.css               # Global styles: Tailwind imports, CSS variables, utilities
    ├── components/
    │   ├── PortfolioApp.tsx    # Main portfolio — Navbar, Hero, About, Skills, Projects,
    │   │                       # Education, Contact, Footer (all sections)
    │   └── ui/
    │       ├── toast.tsx       # Toast notification card component (Radix UI based)
    │       ├── toaster.tsx     # Renders all active toasts into the viewport
    │       └── tooltip.tsx     # Hover tooltip component (Radix UI based)
    ├── hooks/
    │   └── use-toast.ts        # Global toast state manager (reducer + React hook)
    └── lib/
        └── utils.ts            # cn() helper — merges Tailwind classes safely
```

---

## Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/25scs2040002270-IILMGN/<your-repo-name>.git

# 2. Go into the portfolio folder
cd <your-repo-name>/portfolio-deploy

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will open at **http://localhost:5173** (or the next available port).

### Build for Production

```bash
# Compile and bundle the app into the dist/ folder
npm run build

# Preview the production build locally
npm run preview
```

---

## Deployment

### Vercel (Recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. In **Root Directory**, type: `portfolio-deploy`
5. Leave the rest as defaults:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**.

Vercel will build and deploy automatically. Every push to `main` triggers a new deployment.

> The `vercel.json` file ensures all routes (like `/`, `/about`) redirect to `index.html` so React Router handles navigation client-side.

### GitHub Pages (Alternative)

1. Set `base: "/your-repo-name/"` in `vite.config.ts`
2. Run `npm run build`
3. Push the `dist/` folder to the `gh-pages` branch using the `gh-pages` npm package

---

## Customization Guide

### Change Your Name or Info

Open `src/components/PortfolioApp.tsx` and search for:
- `"MD Amaan Sahzada"` — update your name everywhere
- `"asahjada786@gmail.com"` — update your email
- `"+91-9241813099"` — update your phone
- `"https://github.com/25scs2040002270-IILMGN"` — update your GitHub URL

### Add a New Skill

Find the `skillCategories` array inside `PortfolioApp.tsx`:

```tsx
{ name: "Docker", icon: <SiDocker /> }
```

Import the icon at the top from `react-icons/si` and add the entry to the relevant category.

### Add a New Project

Find the `Projects` section in `PortfolioApp.tsx` and copy the project card JSX block. Update the title, description, and tech stack list.

### Change the Color Scheme

Open `src/index.css` and update the CSS variables inside `:root`:

```css
--primary: 183 100% 50%;   /* Neon Cyan — change hue (183) to shift color */
--secondary: 271 76% 53%;  /* Purple — change hue (271) to shift color */
```

Use the [HSL color picker](https://hslpicker.com/) to find the right values.

---

## About Me

**MD Amaan Sahzada**  
MCA Student — IILM University, Greater Noida  
Full Stack Developer | Problem Solver  
Ramgarh, Jharkhand, India

- GitHub: [@25scs2040002270-IILMGN](https://github.com/25scs2040002270-IILMGN)
- Email: [asahjada786@gmail.com](mailto:asahjada786@gmail.com)
- Phone: +91-9241813099

---

## License

This project is open source and available under the [MIT License](LICENSE).  
Feel free to fork, modify, and use it as your own portfolio — just give credit where due.
