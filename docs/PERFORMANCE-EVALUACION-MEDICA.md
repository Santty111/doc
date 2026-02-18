# Plan de performance – Evaluación médica (formulario masivo)

## Auditoría realizada

### 1. Renderizado innecesario

- **Estado inicial:** El wizard ya usaba renderizado condicional estricto: `{ step === 0 && <FichaPaso1... /> }`, etc. Los pasos 2, 3 y 4 **no** estaban en el DOM cuando el usuario estaba en el paso 1.
- **Mejora aplicada:** Se añadió **`React.lazy`** y **`<Suspense>`** para los pasos 2, 3 y 4. Así:
  - El **bundle inicial** no incluye el código de Riesgos, Historia/Diagnóstico ni Certificado.
  - Esos chunks solo se descargan cuando el usuario navega a ese paso.
  - La **carga inicial** mejora (menos JS parseado/ejecutado al abrir la evaluación).

### 2. Re-renders en cascada

- **Problemas detectados:**
  - En el wizard, `updateFicha` se recreaba en cada render → nuevos handlers cada vez.
  - Los steps recibían `onChange` como función inline → referencia nueva en cada render → imposible que `React.memo` evitara re-renders.
  - En **Paso 2 (Matriz de riesgos)**, cada tecla en cualquiera de los ~49 inputs llamaba `onChange` → `setFicha` en el wizard → re-render de todo el árbol.
- **Mejoras aplicadas:**
  - **`useCallback`** para `updateFicha` y para cada handler por paso (`onChangePag1`, `onChangePag2`, etc.) en el wizard.
  - **`React.memo`** en los cuatro steps (`FichaPaso1Identificacion`, `FichaPaso2Riesgos`, `FichaPaso3HistoriaDiagnostico`, `FichaPaso4CertificadoInterno`) para no re-renderizar si `data` y `onChange` no cambian.
  - **Paso 2:** estado local + **debounce (250 ms)** igual que en Paso 1: se actualiza la UI al instante con estado local y se propaga al padre solo cada 250 ms tras dejar de escribir. Reduce drásticamente la propagación al wizard y la latencia percibida al escribir.

### 3. Estado gigante

- **Estado actual:** Un solo `useState<FichaMedicaMSP>(ficha)` en el wizard. Cualquier cambio en cualquier página hace `setFicha` y re-render del wizard; el step actual recibe nueva `data` y se re-renderiza (con memo solo se evita re-render si las props no cambian; al cambiar `ficha`, la prop `data` del paso activo sí cambia).
- **Mitigación actual:** Con **debounce** en Pasos 1 y 2 y **handlers estables** + **memo** en los steps, se reducen las actualizaciones al estado global y se evitan re-renders de los otros pasos (que no están montados). El paso activo sigue re-renderizando cuando llega nueva `data`, pero es el comportamiento esperado para mostrar lo que escribe el usuario.

---

## Plan de refactorización – Fase 2 (opcional)

Si en el futuro se necesita más fluidez (sobre todo en Paso 1, con cientos de campos), se puede avanzar con **estado fragmentado**:

### Opción A: Estado por página en el wizard

- En lugar de un solo `useState(ficha)`, usar un estado por página, por ejemplo:
  - `useState(pagina_1)`, `useState(pagina_2)`, etc.
- Al actualizar solo la página del paso actual, el wizard puede seguir re-renderizando, pero conceptualmente cada “slice” es más pequeño y se podría combinar con **selectores** o **Context por página** para que solo el step que usa esa página lea ese trozo de estado.

### Opción B: Context fragmentado por paso

- Crear, por ejemplo, `Pagina1Context`, `Pagina2Context`, etc., cada uno con:
  - `value={{ data, setData }}` solo para esa página.
- El wizard mantiene el estado por página (o un reducer por página) y provee cada context solo cuando ese paso está montado.
- Ventaja: un step solo se suscribe a su propio context; al actualizar la página 1, los consumidores de la página 2 (si existieran en el mismo árbol) no se re-renderizan. En el diseño actual (un paso visible a la vez) el beneficio extra es limitado, pero mantiene el estado bien acotado.

### Opción C: useReducer por página

- Un `useReducer` por página (o un reducer único con acciones `UPDATE_PAGINA_1`, etc.) para centralizar lógica y facilitar batched updates.
- Sigue siendo un estado global por página, pero con transiciones más predecibles y posibilidad de optimizar con `useMemo`/selectores si se lee solo una parte del estado.

### Opción D: Subdividir Paso 1 en subcomponentes memoizados

- Paso 1 es el más pesado (muchos inputs). Se puede dividir en bloques:
  - Sección A (establecimiento y usuario), Sección B (motivo de consulta), Sección C (antecedentes), Revisión por órganos, Signos vitales.
- Cada bloque recibe solo su slice de `data` y un `onChange` estable (por ejemplo `useCallback` que actualice solo ese slice).
- Envolver cada bloque en **`React.memo`** para que, al escribir en “Sección A”, no se re-rendericen “Sección C” ni “Revisión por órganos”.

Recomendación práctica: aplicar primero **Opción D** (subdividir Paso 1 y memoizar bloques) antes de introducir Context o múltiples estados en el wizard; suele dar el mayor beneficio con menos cambio arquitectónico.

---

## Resumen de cambios ya aplicados

| Área | Cambio |
|------|--------|
| Carga inicial | `React.lazy` + `Suspense` para pasos 2, 3 y 4; fallbacks de “Cargando…” |
| Handlers | `useCallback` para `updateFicha` y para `onChangePag1`…`onChangePag4` |
| Steps | Los cuatro pasos envueltos en `React.memo` |
| Paso 2 (matriz) | Estado local + debounce 250 ms antes de propagar al wizard |
| Documentación | Este plan (estado fragmentado y subdivisión de Paso 1) como guía para Fase 2 |

Con esto se mejora la **velocidad de carga inicial** (menos JS en el primer load) y la **respuesta al escribir** (menos propagación al estado global y menos re-renders innecesarios gracias a memo y debounce).
