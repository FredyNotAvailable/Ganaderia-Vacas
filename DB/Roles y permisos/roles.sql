-- =========================
-- MODULO: ROLES
-- Roles definidos por ganadería (multi-tenant)
-- =========================

CREATE TABLE IF NOT EXISTS roles (
  rol_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- La ganadería a la que pertenece el rol
  ganaderia_id uuid NOT NULL REFERENCES ganaderias(ganaderia_id),

  codigo text NOT NULL,        -- Identificador técnico (ADMIN, EDITOR, LECTOR)
  nombre text NOT NULL,        -- Nombre visible en UI

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Un rol es único por ganadería
  UNIQUE (ganaderia_id, codigo)
);

-- =========================
-- ROW LEVEL SECURITY
-- =========================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- El dueño de la ganadería puede ver los roles
CREATE POLICY roles_select
ON roles
FOR SELECT
USING (
  ganaderia_id IN (
    SELECT g.ganaderia_id
    FROM ganaderias g
    WHERE g.propietario_user_id = auth.uid()
  )
);
