-- =========================
-- MODULO: VACAS
-- =========================

CREATE TABLE IF NOT EXISTS vacas (
  vaca_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ganaderia_id uuid NOT NULL REFERENCES ganaderias(ganaderia_id),
  codigo text NOT NULL,
  nombre text,
  raza text,
  fecha_nacimiento date,
  tipo text NOT NULL CHECK (tipo IN ('VACA', 'NOVILLA', 'TERNERA')),
  estado text DEFAULT 'ACTIVA',
  created_at timestamptz DEFAULT now()
);

-- =========================
-- ROW LEVEL SECURITY
-- =========================

ALTER TABLE vacas ENABLE ROW LEVEL SECURITY;

-- Ver vacas solo de su ganadería
CREATE POLICY vacas_select
ON vacas
FOR SELECT
USING (
  ganaderia_id IN (
    SELECT g.ganaderia_id
    FROM ganaderias g
    WHERE g.propietario_user_id = auth.uid()
  )
);

-- Crear vacas solo en su ganadería
CREATE POLICY vacas_insert
ON vacas
FOR INSERT
WITH CHECK (
  ganaderia_id IN (
    SELECT g.ganaderia_id
    FROM ganaderias g
    WHERE g.propietario_user_id = auth.uid()
  )
);

-- Editar vacas solo de su ganadería
CREATE POLICY vacas_update
ON vacas
FOR UPDATE
USING (
  ganaderia_id IN (
    SELECT g.ganaderia_id
    FROM ganaderias g
    WHERE g.propietario_user_id = auth.uid()
  )
);
