create table if not exists users (
  clerk_user_id text primary key,
  email text not null,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists subscriptions (
  stripe_subscription_id text primary key,
  clerk_user_id text not null references users(clerk_user_id) on delete cascade,
  stripe_customer_id text not null,
  status text not null,
  price_id text not null,
  last_stripe_event_id text,
  last_stripe_event_created_at timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subscriptions add column if not exists last_stripe_event_id text;
alter table subscriptions add column if not exists last_stripe_event_created_at timestamptz;

create index if not exists subscriptions_clerk_user_id_idx on subscriptions(clerk_user_id);
create index if not exists subscriptions_stripe_customer_id_idx on subscriptions(stripe_customer_id);
