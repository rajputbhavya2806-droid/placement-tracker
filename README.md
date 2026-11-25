# PlaceTrack — Campus Placement Tracker

A modern, responsive frontend-only placement management dashboard built with **React.js**, **Vite**, **Tailwind CSS**, **React Router DOM**, **Lucide React**, and **Recharts**.

> **Note:** All preloaded companies, applications, interviews, preparation tasks, and profile details are sample/mock data. Changes persist locally in the browser via `localStorage`.

## Features

- **Dashboard**: KPI overview cards (companies, applications, shortlisted, interviews, offers, success rate), monthly application activity chart, status distribution pie chart, upcoming interviews, recent activity, and top recruiting companies.
- **Companies Directory**: Grid and table views, search, industry & package filters, deadline/CTC sorting, company detail modal, Quick Apply, and Add Company form with validation.
- **My Applications**: Full CRUD for job applications, 7 pipeline statuses (`Interested`, `Applied`, `Online Assessment`, `Technical Interview`, `HR Interview`, `Selected`, `Rejected`), inline status updates, filtering, and delete confirmation.
- **Interview Tracker**: Upcoming & completed tabs, Online/Offline format badges, meeting links, preparation notes, and completion toggles.
- **Preparation Tracker**: Overall readiness progress bar, 6 preparation categories (`DSA`, `Aptitude`, `Core Subjects`, `Programming Languages`, `Projects`, `Resume Preparation`), task creation, and completion tracking.
- **Analytics**: Application-to-interview and interview-to-selection conversion metrics, monthly trend lines, status breakdown, and company-wise charts.
- **Profile & Settings**: Editable student academic profile, interactive skill tags, frontend-only resume upload UI, dark/light mode toggle, and sample data reset.

## Getting Started

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build
```
