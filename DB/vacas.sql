-- =========================
-- MODULO: VACAS
-- =========================

CREATE TABLE vacas (
  vaca_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ganaderia_id uuid NOT NULL REFERENCES ganaderias(ganaderia_id),
  codigo text NOT NULL,
  nombre text,
  raza text,
  fecha_nacimiento date,
  estado text DEFAULT 'ACTIVA',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vacas ENABLE ROW LEVEL SECURITY;

-- Ver vacas solo de su ganadería
CREATE POLICY vacas_select
ON vacas
FOR SELECT
USING (
  ganaderia_id IN (
    SELECT ganaderia_id
    FROM ganaderias
    WHERE propietario_user_id = current_setting('jwt.claims.user_id', true)::uuid
  )
);

-- Crear vacas solo en su ganadería
CREATE POLICY vacas_insert
ON vacas
FOR INSERT
WITH CHECK (
  ganaderia_id IN (
    SELECT ganaderia_id
    FROM ganaderias
    WHERE propietario_user_id = current_setting('jwt.claims.user_id', true)::uuid
  )
);

-- Editar vacas solo de su ganadería
CREATE POLICY vacas_update
ON vacas
FOR UPDATE
USING (
  ganaderia_id IN (
    SELECT ganaderia_id
    FROM ganaderias
    WHERE propietario_user_id = current_setting('jwt.claims.user_id', true)::uuid
  )
);
