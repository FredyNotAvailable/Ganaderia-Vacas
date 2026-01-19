-- =========================
-- MODULO: GANADERIA_USUARIO
-- =========================

CREATE TABLE IF NOT EXISTS ganaderia_usuario (
  ganaderia_usuario_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ganaderia_id uuid NOT NULL REFERENCES ganaderias(ganaderia_id),
  user_id uuid NOT NULL REFERENCES perfiles(user_id),

  -- Rol asignado en la ganadería
  rol_id uuid NOT NULL REFERENCES roles(rol_id),

  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),

  -- Evita duplicar el mismo usuario en la misma ganadería
  UNIQUE (ganaderia_id, user_id)
);

-- =========================
-- ROW LEVEL SECURITY
-- =========================

ALTER TABLE ganaderia_usuario ENABLE ROW LEVEL SECURITY;

-- El dueño de la ganadería puede ver los accesos
CREATE POLICY ganaderia_usuario_select_dueno
ON ganaderia_usuario
FOR SELECT
USING (
  ganaderia_id IN (
    SELECT g.ganaderia_id
    FROM ganaderias g
    WHERE g.propietario_user_id = auth.uid()
  )
);

-- El usuario puede ver SU propio acceso
CREATE POLICY ganaderia_usuario_select_self
ON ganaderia_usuario
FOR SELECT
USING (
  user_id = auth.uid()
);

-- Solo el dueño puede crear accesos
CREATE POLICY ganaderia_usuario_insert
ON ganaderia_usuario
FOR INSERT
WITH CHECK (
  ganaderia_id IN (
    SELECT g.ganaderia_id
    FROM ganaderias g
    WHERE g.propietario_user_id = auth.uid()
  )
);

-- Solo el dueño puede editar o desactivar accesos
CREATE POLICY ganaderia_usuario_update
ON ganaderia_usuario
FOR UPDATE
USING (
  ganaderia_id IN (
    SELECT g.ganaderia_id
    FROM ganaderias g
    WHERE g.propietario_user_id = auth.uid()
  )
);
