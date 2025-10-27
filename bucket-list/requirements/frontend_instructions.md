# Project overview
A web app for Duke students to explore, track, and rate Duke campus traditions.
Built with Next.js, it lets users check off classic experiences, add custom ones, and see which moments are most loved across the community.

# Feature requirements
- View Traditions: List of Duke traditions with names, descriptions, and photos; show community average rating (1–10)
- Check Off Experiences: Users can mark traditions as completed; progress bar showing % of traditions completed
- Rate Traditions: Rate each tradition from 1 to 10; show total number of ratings and average
- Add Custom Items: Users can create personal bucket list items
- Community Insights: "Top Rated" and "Most Completed" lists
- Individual Tracking: Sign in required to allow for individual tracking of bucket list completion

# Relevant docs
Frontend: Next.js + Tailwind CSS
Backend: Supabase (auth + database)

# Current file structure
```
bucket-list/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── components.json
├── lib/
│   └── utils.ts
├── node_modules/
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── requirements/
│   └── frontend_instructions.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

# Rules
- All new components should go in /components and be named like example-component.tsx
- All new pages should go in /app