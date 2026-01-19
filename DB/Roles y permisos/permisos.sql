-- =========================
-- MODULO: PERMISOS
-- Acciones atómicas del sistema (leer, crear, editar, etc.)
-- =========================

CREATE TABLE IF NOT EXISTS permisos (
  permiso_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,     -- Código técnico (ej: VACAS_LEER)
  nombre text NOT NULL UNIQUE,            -- Nombre amigable
  descripcion text,               -- Explicación del permiso
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =========================
-- ROW LEVEL SECURITY
-- =========================

ALTER TABLE permisos ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede leer permisos
CREATE POLICY permisos_select
ON permisos
FOR SELECT
USING (auth.uid() IS NOT NULL);
