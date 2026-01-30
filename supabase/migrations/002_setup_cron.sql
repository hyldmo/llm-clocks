-- Set up cron job to generate clocks every minute
-- NOTE: You need to replace <project-ref> with your actual Supabase project reference
-- and <service-role-key> with your service role key

-- This should be run manually in the Supabase SQL editor after deploying the edge function
-- because it requires the actual project URL and service role key

/*
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
*/

-- To check scheduled jobs:
-- SELECT * FROM cron.job;

-- To unschedule:
-- SELECT cron.unschedule('generate-clocks-every-minute');
