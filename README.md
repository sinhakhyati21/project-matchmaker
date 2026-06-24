# Project Matchmaker

> Find your perfect hackathon team — built for builders, by builders.

## Live Demo

https://project-matchmaker-sand.vercel.app

## Problem Statement

Students struggle to find the right teammates for hackathons, college projects, startup ideas, and open-source contributions. Project Matchmaker solves this by providing a platform to create projects, get AI-matched with teammates based on GitHub activity and skills, and collaborate in a private team workspace.

## Features

### GitHub Integration
- Sign in with GitHub OAuth — no separate account needed
- Auto-sync username, bio, and public repositories
- GitHub contribution graph embedded on every profile
- AI recommendations factor in GitHub activity and repository analysis

### Project Management
- Create projects with title, description, category, required skills, roles, and team size
- Browse and search projects by title, category, and skills
- Apply to projects or invite candidates directly
- Update project status: Recruiting to Active to Completed to Archived
- Edit and delete your own projects

### AI Team Recommendations
Candidates ranked by a composite score:
- Skill match — 80 points
- GitHub activity — 20 points
- Repository analysis — 20 points
- Previous projects — 10 points
- Status bonus — 5 points

### Team Hub
Auto-created when 2 or more members join a project:
- Real-time chat powered by Server-Sent Events — no page refresh
- Typing indicator with animated dots
- Image sharing in chat
- Drag-and-drop Kanban board (To Do, In Progress, Review, Done)
- Discussion boards with threaded replies
- Resource Vault for important links
- Expense tracker with total spending and history
- Peer reviews unlocked when project is marked Completed
- Project Analytics Dashboard
- Auto GitHub Setup — creates shared repo and invites all members

### Trust and Reputation
- Rate teammates on Communication, Technical Skills, Reliability, and Teamwork
- Trust Score shown on every profile and recommendation card
- Reviews only available after project is marked Completed

### UI/UX
- Light and dark mode toggle with localStorage persistence
- Fully responsive with mobile hamburger menu

## Tech Stack

- Framework: Next.js 14 App Router
- Language: TypeScript
- Database: MongoDB + Mongoose
- Auth: NextAuth.js v5 GitHub OAuth
- Styling: Tailwind CSS + CSS Variables
- Real-time: Server-Sent Events SSE
- Drag and Drop: @hello-pangea/dnd
- Deployment: Vercel

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/your-username/project-matchmaker.git
cd project-matchmaker

### 2. Install dependencies

npm install

### 3. Create environment variables

Copy .env.example to .env.local and fill in:

MONGODB_URI=your_mongodb_connection_string
GITHUB_ID=your_github_oauth_app_client_id
GITHUB_SECRET=your_github_oauth_app_client_secret
AUTH_SECRET=run_openssl_rand_base64_32
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true

### 4. Create GitHub OAuth App

1. Go to GitHub Settings Developer Settings OAuth Apps New OAuth App
2. Set Homepage URL: http://localhost:3000
3. Set Callback URL: http://localhost:3000/api/auth/callback/github
4. Copy Client ID and Client Secret to .env.local

### 5. Run the development server

npm run dev

Open http://localhost:3000

## Security

- All API routes require authentication
- Ownership checks on all mutations
- Hub access restricted to team members only
- Visitors can browse but cannot apply, create, or access Hubs

## License

MIT