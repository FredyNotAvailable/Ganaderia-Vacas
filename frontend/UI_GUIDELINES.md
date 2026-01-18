# UI Design Guidelines - Mobile First Minimalist

## 1. Filosofía de Diseño
El objetivo es crear una interfaz **ultra limpia, calmada y moderna**, inspirada en aplicaciones de bienestar y productividad.
- **Mobile-First**: Todo se diseña pensando primero en la pantalla del teléfono.
- **Calma Visual**: Espacios amplios, colores suaves, sin ruido visual.
- **Funcionalidad Directa**: Elementos grandes y fáciles de tocar (dedo gordo).
- **Reduccionismo**: Si no es esencial, se elimina.

## 2. Mobile-First Rules
- **Touch Targets**: Botones e inputs de al menos 48px de altura.
- **Navegación Vertical**: Scroll infinito suave, sin tablas horizontales complejas.
- **Alcance**: Acciones principales en la mitad inferior de la pantalla siempre que sea posible.
- **Texto**: Nunca justificado, alineado a la izquierda o centro.

## 3. Tipografía
Fuente principal: **Inter**.
No mezclar fuentes.

| Elemento | Tamaño | Peso | Interlineado | Color |
|---|---|---|---|---|
| **H1 (Screen Title)** | 22px | Semibold (600) | 1.3 | Gray.800 |
| **H2 (Card Title)** | 18px | Medium (500) | 1.4 | Gray.700 |
| **Body (Default)** | 15px | Regular (400) | 1.5 | Gray.600 |
| **Label / Small** | 13px | Regular (400) | 1.5 | Gray.500 |

## 4. Colores (Soft Palette)
Evitar el negro puro (#000000).

- **Background Principal**: `gray.50` (#F9FAFB)
- **Superficies (Cards)**: `white` (#FFFFFF)
- **Texto Principal**: `gray.800` (#1F2937)
- **Texto Secundario**: `gray.500` (#6B7280)
- **Acento (Brand)**: `green.500` (#22C55E) - Usar con moderación.
- **Bordes**: `gray.100` (#F3F4F6)

## 5. Layout y Espaciado
- **Contenedor**: MaxWidth `md` o `lg` centrado en desktop, full width en móvil.
- **Padding Base**: `4` (16px) o `6` (24px).
- **Espacio entre Cards**: `4` (16px).
- **Márgenes**: Generosos, dejar respirar el contenido.

## 6. Cards y Componentes
- **Estilo de Card**:
  - `bg="white"`
  - `borderRadius="2xl"` (muy redondeados, 16px-24px)
  - `shadow="sm"` (sombra difusa y suave) o `border="1px solid gray.100"`
  - Padding interno: `5` o `6`.
- **Listas**: Items separados por espacio, no por líneas duras.

## 7. Botones e Inputs
- **Botones**:
  - `borderRadius="xl"`
  - Altura `12` (48px).
  - Variantes: Solid (Brand), Ghost (Secundario), Outline (Soft).
- **Inputs**:
  - `borderRadius="xl"`
  - `bg="gray.50"` o `white` con borde suave.
  - Altura `12`.
  - Placeholder color `gray.400`.

## 8. Animaciones Permitidas
Solo usar `framer-motion` para transiciones de estado y entrada. Sutiles.
- **Page Transition**: Fade In (`opacity: 0` -> `1`), leve Slide Up (`y: 10` -> `0`).
- **Estados**: Hove suave, Tap suave (scale 0.98).
- **Duración**: mx 0.2s - 0.3s.

## 9. Estados de Carga
- Usar **Skeletons** que imiten la forma del contenido (circular para avatares, rectangular para texto).
- Color del Skeleton: `gray.100` start, `gray.50` end.

## 10. Errores Comunes a Evitar ⛔
- ❌ Usar sombras negras duras.
- ❌ Usar bordes negros o muy oscuros.
- ❌ Tablas densas en móvil (usar Card List).
- ❌ Texto muy pequeño (< 12px).
- ❌ Sobrecargar de colores (mantener monocromático + 1 acento).
