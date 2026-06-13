# Shevet — setup & deploy

## 1. Supabase (database + auth)

1. Create a free project at [supabase.com](https://supabase.com).
2. **Project Settings → API**: copy the **Project URL** and the **anon public** key.
3. **SQL Editor → New query**: paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it.
4. **Authentication → Providers → Email**: for fast testing, turn **off** "Confirm email"
   (re-enable later once a real email sender is configured). Google sign-in can be added later.

## 2. Environment variables

Set these locally in `.env.local` and in Vercel (Project → Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

The anon key is public/safe for the browser. **Never** put the `service_role` key here.

## 3. Run locally

```
npm install
npm run dev
```

## 4. Deploy (Vercel, free)

1. Push this folder to a new GitHub repo.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the two environment variables above, then Deploy.
