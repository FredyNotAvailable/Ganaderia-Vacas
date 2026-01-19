-- =========================
-- MODULO: ORDENOS
-- =========================

CREATE TABLE IF NOT EXISTS ordenos (
  ordeno_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vaca_id uuid NOT NULL REFERENCES vacas(vaca_id),
  ganaderia_id uuid NOT NULL REFERENCES ganaderias(ganaderia_id),
  fecha_ordeno timestamptz NOT NULL,
  turno text CHECK (turno IN ('MANANA', 'TARDE')),
  litros numeric(6,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =========================
-- ROW LEVEL SECURITY
-- =========================

ALTER TABLE ordenos ENABLE ROW LEVEL SECURITY;

-- Ver ordeños solo de su ganadería
CREATE POLICY ordenos_select
ON ordenos
FOR SELECT
USING (
  ganaderia_id IN (
    SELECT g.ganaderia_id
    FROM ganaderias g
    WHERE g.propietario_user_id = auth.uid()
  )
);

-- Crear ordeños solo en su ganadería
CREATE POLICY ordenos_insert
ON ordenos
FOR INSERT
WITH CHECK (
  ganaderia_id IN (
    SELECT g.ganaderia_id
    FROM ganaderias g
    WHERE g.propietario_user_id = auth.uid()
  )
);

-- Editar ordeños solo de su ganadería
CREATE POLICY ordenos_update
ON ordenos
FOR UPDATE
USING (
  ganaderia_id IN (
    SELECT g.ganaderia_id
    FROM ganaderias g
    WHERE g.propietario_user_id = auth.uid()
  )
);
