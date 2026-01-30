# AI World Clocks

A clone of [clocks.brianmoore.com](https://clocks.brianmoore.com) - displays the current time as rendered by 9 different AI models.

## Architecture

- **Frontend**: React + Vite + Tailwind, hosted on GitHub Pages
- **Backend**: Supabase (PostgreSQL + Edge Functions + pg_cron)
- **AI Models**: GPT-3.5, GPT-4o, GPT-5, Claude Haiku 3.5, Gemini 2.5, DeepSeek V3.1, Grok 4, Qwen 2.5, Kimi K2

## Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Supabase Project

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Link your project:
   ```bash
   yarn supabase link --project-ref <your-project-ref>
   ```
3. Push the database migrations:
   ```bash
   yarn supabase:db:push
   ```

### 3. Edge Function

1. Set secrets for all AI providers:
   ```bash
   yarn supabase secrets set OPENAI_API_KEY=sk-...
   yarn supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   yarn supabase secrets set GOOGLE_API_KEY=...
   yarn supabase secrets set DEEPSEEK_API_KEY=...
   yarn supabase secrets set XAI_API_KEY=...
   yarn supabase secrets set DASHSCOPE_API_KEY=...
   yarn supabase secrets set MOONSHOT_API_KEY=...
   ```
2. Deploy the function:
   ```bash
   yarn supabase:functions:deploy
   ```

### 4. Cron Job

In the Supabase SQL editor, run:
```sql
SELECT cron.schedule(
  'generate-clocks-every-minute',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://<project-ref>.supabase.co/functions/v1/generate-clocks',
    body := '{}'::jsonb,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <service-role-key>'
    )
  );
  $$
);
```

### 5. Frontend

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Supabase URL and anon key
3. Run locally:
   ```bash
   yarn dev
   ```

### 6. GitHub Pages Deployment

1. Add repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Push to main branch - GitHub Actions will deploy automatically

## Development

```bash
yarn dev
```

The app includes mock data when Supabase is not configured, so you can develop the UI without a backend.

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn supabase:start` | Start local Supabase |
| `yarn supabase:stop` | Stop local Supabase |
| `yarn supabase:db:push` | Push migrations to remote |
| `yarn supabase:db:reset` | Reset local database |
| `yarn supabase:functions:deploy` | Deploy edge function |

## License

MIT
