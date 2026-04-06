-- Enable RLS on all tables with open policies (no auth required)
-- This allows the anon key to read/write freely.
-- When you add authentication later, replace these with proper policies.

DO $$
DECLARE
  t text;
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
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "allow_all_%s" ON %I', t, t);
    EXECUTE format('CREATE POLICY "allow_all_%s" ON %I FOR ALL USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END
$$;
