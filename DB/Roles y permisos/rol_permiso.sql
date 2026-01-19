-- =========================
-- MODULO: ROL_PERMISO
-- Relación muchos-a-muchos entre roles y permisos
-- =========================

CREATE TABLE IF NOT EXISTS rol_permiso (
  rol_permiso_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rol_id uuid NOT NULL REFERENCES roles(rol_id) ON DELETE CASCADE,
  permiso_id uuid NOT NULL REFERENCES permisos(permiso_id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Evita duplicar el mismo permiso en un rol
  UNIQUE (rol_id, permiso_id)
);

-- =========================
-- ROW LEVEL SECURITY
-- =========================

ALTER TABLE rol_permiso ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede leer la relación rol-permiso
CREATE POLICY rol_permiso_select
ON rol_permiso
FOR SELECT
USING (auth.uid() IS NOT NULL);
