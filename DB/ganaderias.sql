-- =========================
-- MODULO: GANADERIAS
-- =========================

CREATE TABLE IF NOT EXISTS ganaderias (
  ganaderia_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  ubicacion text,
  propietario_user_id uuid NOT NULL REFERENCES perfiles(user_id),
  created_at timestamptz DEFAULT now()
);

-- =========================
-- ROW LEVEL SECURITY
-- =========================

ALTER TABLE ganaderias ENABLE ROW LEVEL SECURITY;

-- El dueño ve su ganadería
CREATE POLICY ganaderias_select
ON ganaderias
FOR SELECT
USING (
  propietario_user_id = auth.uid()
);

-- El dueño edita su ganadería
CREATE POLICY ganaderias_update
ON ganaderias
FOR UPDATE
USING (
  propietario_user_id = auth.uid()
);
