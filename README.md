# {{ PROJECT_NAME }}

> **Tip:** Keep the name short, memorable, and relevant.
> Avoid vague names like _“core-app”_ or _“new-project”_.
> Good examples: **Atlas CRM**, **Ledger Sync**, **Pulse Scheduler**, etc.

A brief description of what this project does and why it exists.

> **Tip:** One or two sentences max.
> State the problem, state the value.
> Example: “A lightweight CRM to track people, projects, and their interactions.”

---

## Overview

Use this section to explain the goal of the project and what it’s meant to solve.

> **Tip:**
>
> - Don’t list features here—save that for the next section.
> - Explain the _why_ behind the project.
> - Make it understandable to someone who isn’t you in 6 months.

---

## Features

List the core capabilities your project provides.

> **Tip:** Start broad, then go more specific as the project evolves.

Examples:

- Manage entities (e.g., projects, people, tasks, resources)
- Track interactions or records
- Provide clean relationships between data types
- Offer a simple, non-bloated workflow
- Expose an API for programmatic use

---

## Tech Stack

Document the technologies used.

> **Tip:** Keep this high-level. People don’t need a dependency list here.

Example (modify as needed):

- **Framework:** Next.js (App Router)
- **API Layer:** tRPC
- **Database:** SQLite (via Prisma ORM)
- **Frontend:** React + Tailwind

---

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repo-url>
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables:

   > **Tip:**
   >
   > - Add a `.env.example` file in the template repo.
   > - Keep it minimal—only required variables.

4. Run database migrations:

   ```bash
   pnpm db:migrate:dev
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

---

## Usage

Explain the general workflow or how this template is intended to be extended.

> **Tip:** Be generic here; this is a template.

Examples:

- Start by defining your domain models.
- Extend the API routers under `/server/api/`.
- Add new UI modules in `/app/`.
- Use the existing CRUD patterns as a reference.

---

## Project Structure

> **Tip:** Give a quick map so future-you (or colleagues) don’t waste time rediscovering layout choices.

Example:

```
/app             → UI routes & components
/server          → tRPC routers, server logic
/prisma          → Schema & migrations
/src/components  → Reusable UI components
```

---

## Customization Tips

A section dedicated to reminding yourself how to adjust this template for the _next_ project.

- Rename placeholder domains (e.g., Project, Person, Call) to match your new project.
- Update Prisma models first; let the schema drive the rest.
- Remove modules you don’t need.
- Add scripts early (lint, format, seed).
- Define key conventions at the beginning (file naming, API shape, folder structure).

---

## Contributing

Since this is a template, keep it open to improvements.

> **Tip:** Don’t overthink this section—just keep the door open.

---

## License

MIT (modify if needed)
