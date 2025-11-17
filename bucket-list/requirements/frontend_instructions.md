# Project overview
A web app for Duke students to explore, track, and rate Duke campus traditions.
Built with Next.js, it lets users check off classic experiences, add custom ones, and see which moments are most loved across the community.

# Feature requirements

## Authentication & User Management
- **Login System**: Users must log in with a username/email to use the app
- **User Sessions**: Login state persists during the session
- **Logout**: Users can log out from the header (desktop and mobile views)
- **Individual Tracking**: All user data (completions, ratings) is tracked per user

## Tradition Management
- **View Traditions**: List of Duke traditions with names and descriptions
- **Add Custom Traditions**: Users can create personal bucket list items with custom names and descriptions

## Completion Tracking
- **Mark as Completed**: Users can mark traditions as completed (requires login)
- **Progress Tracking**: Progress bar showing % of traditions completed per user
- **Completion Counter**: Header displays user's completed count (e.g., "5 / 10")
- **Completion Requirement**: Users must complete a tradition before they can rate it

## Rating System
- **Quality Rating**: Rate each tradition from 1 to 10 stars
- **Difficulty Rating**: Rate each tradition's difficulty from 1 to 10 stars (separate from quality rating)
- **Submit Button**: After selecting stars, users must click "Submit Rating" to submit (not automatic)
- **One Rating Per User**: Each user can only rate each tradition once (both quality and difficulty)
- **Completion Requirement**: Users must complete a tradition before rating it
- **Community Averages**: Shows community average ratings and difficulty ratings with total count
- **User Ratings Display**: Shows user's submitted ratings with "(Already rated)" indicator

## Community Insights
- **Top Rated**: Sidebar card showing top 5 highest-rated traditions (sorted by average quality rating)
- **Most Completed**: Sidebar card showing top 5 most completed traditions (sorted by completion count)
- **Most Difficult**: Sidebar card showing top 5 most difficult traditions (sorted by average difficulty rating)

## UI/UX Features
- **Responsive Design**: Mobile-friendly with separate mobile/desktop header layouts
- **Progress Visualization**: Visual progress bar showing completion percentage
- **Real-time Updates**: All rankings and statistics update immediately when users interact
- **Visual Indicators**: Completed traditions show checkmark icons and highlighted borders
- **Loading States**: Interactive elements show appropriate loading and disabled states
- **Error Handling**: Clear error messages for failed operations

# Technical Stack
- **Frontend Framework**: Next.js 15.5.6 (App Router) with React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components built with Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React useState hooks (client-side only, no backend integration yet)
- **TypeScript**: Full TypeScript support

# Dependencies
- **Core**: next, react, react-dom
- **UI**: @radix-ui/react-slot, lucide-react, tailwind-merge, class-variance-authority
- **Utilities**: clsx

# Current file structure
```
bucket-list/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Main page with all traditions and features
├── components/
│   ├── add-custom-tradition.tsx   # Dialog for adding custom traditions
│   ├── login-dialog.tsx          # Login dialog component
│   ├── tradition-card.tsx        # Card component for each tradition
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── input.tsx
│   └── components.json
├── lib/
│   └── utils.ts
├── public/
│   └── (empty - can add logo files here)
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
