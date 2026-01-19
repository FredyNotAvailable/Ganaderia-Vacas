-- =========================
-- MODULO: PERFILES
-- =========================

CREATE TABLE perfiles (
  user_id uuid PRIMARY KEY
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  nombre text NOT NULL,
  email text UNIQUE NOT NULL,
  telefono text,

  -- Rol a nivel sistema (NO por ganadería)
  rol_sistema text NOT NULL
    CHECK (rol_sistema IN ('SUPERADMIN', 'SOPORTE', 'USUARIO'))
    DEFAULT 'USUARIO',

  created_at timestamptz DEFAULT now()
);

ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Solo el usuario ve su perfil
CREATE POLICY perfiles_select
ON perfiles
FOR SELECT
USING (
  user_id = auth.uid()
);

-- Solo el usuario edita su perfil
CREATE POLICY perfiles_update
ON perfiles
FOR UPDATE
USING (
  user_id = auth.uid()
);
