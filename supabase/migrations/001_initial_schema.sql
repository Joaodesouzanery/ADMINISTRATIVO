-- ============================================================================
-- Atlântico Platform — Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================

-- ─── Kanban Columns ─────────────────────────────────────────────────────────
create table if not exists kanban_columns (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  title text not null,
  color text not null default '#64D4E8',
  "order" integer not null default 0,
  created_at timestamptz default now()
);

-- ─── Kanban Cards ───────────────────────────────────────────────────────────
create table if not exists kanban_cards (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  title text not null,
  description text,
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  status text not null default 'todo',
  column_id text references kanban_columns(id) on delete set null,
  due_date text,
  tags text[] default '{}',
  assignee text,
  subtasks jsonb default '[]',
  contact_id text,
  created_at timestamptz default now()
);

-- ─── Goals ──────────────────────────────────────────────────────────────────
create table if not exists goals (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  title text not null,
  description text,
  target numeric not null default 0,
  current numeric not null default 0,
  unit text not null default '',
  due_date text not null,
  status text not null default 'on_track' check (status in ('on_track','at_risk','completed','delayed')),
  created_at timestamptz default now()
);

-- ─── Routines ───────────────────────────────────────────────────────────────
create table if not exists routines (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  title text not null,
  description text,
  frequency text not null default 'weekly' check (frequency in ('daily','weekly','monthly')),
  assignee text,
  priority text check (priority in ('low','medium','high','urgent')),
  due_date text,
  notes text,
  items jsonb default '[]',
  created_at timestamptz default now()
);

-- ─── Tasks (standalone) ────────────────────────────────────────────────────
create table if not exists tasks (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  title text not null,
  description text,
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  date text not null,
  completion_date text,
  tags text[] default '{}',
  completed boolean not null default false,
  completed_at timestamptz,
  alert_days_before integer,
  contact_id text,
  created_at timestamptz default now()
);

-- ─── Planning Goals ─────────────────────────────────────────────────────────
create table if not exists planning_goals (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  title text not null,
  description text,
  category text not null default '',
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed','cancelled')),
  horizon text not null default 'short' check (horizon in ('short','medium','long')),
  start_date text not null,
  end_date text not null,
  okr text,
  related_project text,
  created_at timestamptz default now()
);

-- ─── Documents ──────────────────────────────────────────────────────────────
create table if not exists documents (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  title text not null,
  type text not null default 'document' check (type in ('document','contract','report','prompt')),
  category text not null default '',
  content text,
  file_url text,
  version text not null default '1.0',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── CRM Clients ────────────────────────────────────────────────────────────
create table if not exists clients (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  name text not null,
  company text,
  email text not null,
  phone text,
  status text not null default 'prospect' check (status in ('prospect','active','inactive','partner')),
  segment text,
  value numeric,
  notes text,
  created_at timestamptz default now()
);

-- ─── CRM Deals ──────────────────────────────────────────────────────────────
create table if not exists deals (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  title text not null,
  client_id text references clients(id) on delete set null,
  client_name text not null,
  stage text not null default 'lead' check (stage in ('lead','qualified','proposal','negotiation','won','lost')),
  value numeric not null default 0,
  probability integer not null default 50,
  expected_close text not null,
  created_at timestamptz default now()
);

-- ─── CRM Contacts / Partners ────────────────────────────────────────────────
create table if not exists contacts (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  type text not null default 'contact' check (type in ('contact','partner')),
  name text not null,
  email text,
  phone text,
  company text,
  project text,
  pipeline_stage text not null default 'new' check (pipeline_stage in ('new','contacted','engaged','proposal','closed')),
  observations text,
  linked_task_ids text[] default '{}',
  created_at timestamptz default now()
);

-- ─── Financial Transactions ─────────────────────────────────────────────────
create table if not exists transactions (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  description text not null,
  type text not null check (type in ('income','expense')),
  amount numeric not null default 0,
  category text not null default '',
  date text not null,
  due_date text,
  paid boolean not null default false,
  recurrence text not null default 'once' check (recurrence in ('once','daily','weekly','monthly','quarterly','annual')),
  notes text,
  created_at timestamptz default now()
);

-- ─── Financial Payroll ──────────────────────────────────────────────────────
create table if not exists payroll (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  employee text not null,
  role text not null,
  base_salary numeric not null default 0,
  bonuses numeric not null default 0,
  deductions numeric not null default 0,
  net_salary numeric not null default 0,
  month text not null,
  status text not null default 'pending' check (status in ('pending','paid')),
  created_at timestamptz default now()
);

-- ─── Financial OKRs ─────────────────────────────────────────────────────────
create table if not exists financial_okrs (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  objective text not null,
  key_results jsonb default '[]',
  period text not null,
  status text not null default 'on_track' check (status in ('on_track','at_risk','completed')),
  created_at timestamptz default now()
);

-- ─── Org Chart Nodes ────────────────────────────────────────────────────────
create table if not exists org_nodes (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  parent_id text references org_nodes(id) on delete cascade,
  label text not null,
  type text not null default 'person' check (type in ('company','department','person','client','associate')),
  role text,
  email text,
  phone text,
  created_at timestamptz default now()
);

-- ─── Notifications ──────────────────────────────────────────────────────────
create table if not exists notifications (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata', 'iris')),
  type text not null default 'general',
  title text not null,
  message text not null,
  reference_id text,
  read boolean not null default false,
  created_at timestamptz default now()
);

-- ─── Indexes for performance ────────────────────────────────────────────────
create index if not exists idx_kanban_cards_product on kanban_cards(product);
create index if not exists idx_kanban_columns_product on kanban_columns(product);
create index if not exists idx_goals_product on goals(product);
create index if not exists idx_routines_product on routines(product);
create index if not exists idx_tasks_product on tasks(product);
create index if not exists idx_planning_goals_product on planning_goals(product);
create index if not exists idx_documents_product on documents(product);
create index if not exists idx_clients_product on clients(product);
create index if not exists idx_deals_product on deals(product);
create index if not exists idx_contacts_product on contacts(product);
create index if not exists idx_transactions_product on transactions(product);
create index if not exists idx_org_nodes_product on org_nodes(product);
create index if not exists idx_notifications_product on notifications(product);

-- ─── Enable RLS (Row Level Security) — disabled for now ─────────────────────
-- You can enable RLS later when you add authentication:
-- alter table tasks enable row level security;
-- create policy "allow all" on tasks for all using (true);
