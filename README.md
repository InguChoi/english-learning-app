# English Learning App

A full-stack personal English learning app built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- Save English words with meaning and notes
- View a list of saved words
- Open a word detail page
- Generate 3 example sentences with OpenAI
- Play sentence audio in multiple accents with ElevenLabs
- Keep API keys server-side through Next.js route handlers

## Project Structure

```text
.
|-- app
|   |-- api
|   |   |-- generate-example
|   |   |   `-- route.ts
|   |   |-- tts
|   |   |   `-- route.ts
|   |   `-- words
|   |       |-- [id]
|   |       |   `-- route.ts
|   |       `-- route.ts
|   |-- words
|   |   |-- [id]
|   |   |   |-- loading.tsx
|   |   |   `-- page.tsx
|   |   |-- new
|   |   |   `-- page.tsx
|   |   `-- page.tsx
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components
|   |-- generate-examples-button.tsx
|   |-- new-word-form.tsx
|   `-- tts-player.tsx
|-- lib
|   |-- openai.ts
|   |-- prisma.ts
|   |-- tts.ts
|   |-- utils.ts
|   `-- validators.ts
|-- prisma
|   `-- schema.prisma
|-- .env.example
|-- eslint.config.mjs
|-- next.config.ts
|-- package.json
|-- postcss.config.mjs
|-- README.md
`-- tsconfig.json
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Copy the environment template

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Update `.env` with:

- `DATABASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` such as `gpt-4.1-mini`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_MODEL_ID`
- `ELEVENLABS_VOICE_ID_US`
- `ELEVENLABS_VOICE_ID_UK`
- `ELEVENLABS_VOICE_ID_AU`

4. Generate Prisma client

```bash
npx prisma generate
```

5. Create and apply the database migration

```bash
npx prisma migrate dev --name init
```

6. Start the development server

```bash
npm run dev
```

7. Open:

```text
http://localhost:3000
```

## Notes

- `POST /api/generate-example` expects `word` and `wordId`
- `POST /api/tts` expects `sentence` and `accent`
- TTS voices are mapped by accent through environment variables
- Generating examples replaces the previously saved examples for that word
