-- Comercial module: pipeline de contatos B2B/B2G
create table if not exists comercial_contacts (
  id text primary key default gen_random_uuid()::text,
  product text not null check (product in ('construdata','iris','padrao','faculdade')),
  name text not null,
  email text,
  phone text,
  company text,
  role text,
  stage text not null default 'prospeccao' check (stage in ('prospeccao','apresentacao','negociacao','fechamento','pos_venda')),
  value numeric,
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_comercial_contacts_product on comercial_contacts(product);
create index if not exists idx_comercial_contacts_stage on comercial_contacts(stage);

alter table comercial_contacts enable row level security;
drop policy if exists "allow_all_comercial_contacts" on comercial_contacts;
create policy "allow_all_comercial_contacts" on comercial_contacts for all using (true) with check (true);
