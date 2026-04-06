-- Faculdade module tables

create table if not exists faculdade_materias (
  id text primary key default gen_random_uuid()::text,
  product text not null default 'faculdade',
  nome text not null,
  professor text,
  horario text,
  sala text,
  cor text not null default '#8B5CF6',
  notas text,
  created_at timestamptz default now()
);

create table if not exists faculdade_atividades (
  id text primary key default gen_random_uuid()::text,
  product text not null default 'faculdade',
  materia_id text references faculdade_materias(id) on delete cascade,
  titulo text not null,
  tipo text not null default 'trabalho' check (tipo in ('prova','trabalho','lista','seminario','outro')),
  descricao text,
  data_entrega text not null,
  concluida boolean not null default false,
  concluida_em timestamptz,
  nota numeric,
  peso numeric,
  alerta_dias_antes integer,
  created_at timestamptz default now()
);

-- Enable RLS with open policies
alter table faculdade_materias enable row level security;
create policy "allow_all_faculdade_materias" on faculdade_materias for all using (true) with check (true);

alter table faculdade_atividades enable row level security;
create policy "allow_all_faculdade_atividades" on faculdade_atividades for all using (true) with check (true);

-- Update product check constraints on existing tables to allow 'padrao' and 'faculdade'
-- (Drop and recreate the constraints)
DO $$
DECLARE
  t text;
  c text;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name IN (
        'kanban_cards','kanban_columns','goals','routines','tasks',
        'planning_goals','clients','deals','contacts','transactions',
        'payroll','financial_okrs','documents','notifications','org_nodes'
      )
  LOOP
    -- Find the constraint name for the product column
    SELECT cc.constraint_name INTO c
    FROM information_schema.check_constraints cc
    JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name AND cc.constraint_schema = ccu.constraint_schema
    WHERE ccu.table_name = t AND ccu.column_name = 'product' AND ccu.table_schema = 'public'
    LIMIT 1;

    IF c IS NOT NULL THEN
      EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', t, c);
    END IF;

    EXECUTE format('ALTER TABLE %I ADD CONSTRAINT %I CHECK (product IN (''construdata'',''iris'',''padrao'',''faculdade''))', t, t || '_product_check');
  END LOOP;
END
$$;

create index if not exists idx_faculdade_materias_product on faculdade_materias(product);
create index if not exists idx_faculdade_atividades_product on faculdade_atividades(product);
create index if not exists idx_faculdade_atividades_materia on faculdade_atividades(materia_id);
