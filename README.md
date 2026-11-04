# Topkapı Palace — Sultanato de Osamu

Archivo web estático del universo de Topkapı. La página conserva la identidad visual, los textos y los registros originales, con una reorganización de navegación, jerarquías y vínculos entre personajes e instituciones.

## Cómo abrir el sitio

Los archivos JavaScript utilizan módulos ES. Para evitar restricciones del navegador al abrir `index.html` directamente, inicia un servidor local desde esta carpeta:

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000` en el navegador. También puedes utilizar la extensión **Live Server** de Visual Studio Code.

## Organización del código

- `index.html`: estructura y textos de las secciones.
- `styles.css`: identidad visual y componentes de la interfaz.
- `js/app.js`: renderizado, organigramas, buscador y fichas.
- `js/data.js`: catálogo único que reúne los registros.
- `js/data/`: datos de dinastía, harén, gobierno, administración y nobleza.
- `images/`: retratos y recursos gráficos.

Cada personaje tiene un único registro e identificador. Puede aparecer como referencia en más de una institución sin duplicar su ficha. Los nodos con retrato abren la ficha correspondiente.

## Criterio de clasificación

- La dinastía reúne a la familia imperial por nacimiento, la Haseki Sultan y la descendencia de la rama imperial materna registrada.
- Las demás consortes se presentan en el harén según su rango, desde Baş Kadın e İkbal.
- Los cargos administrativos enlazan con el personaje que los desempeña cuando existe un titular registrado.

Si un retrato no está incluido en `images/`, se muestra un marcador de imagen pendiente; no se elimina el registro del personaje.


## Ajustes de jerarquía dinástica y harén

- Atsumu y Otoha se muestran en un bloque propio como hermanos del sultán y miembros de la rama colateral de la casa reinante. No se mezclan con los hijos de Osamu.
- Otoha aparece en la parte superior del organigrama del harén como Valide de facto, por las funciones delegadas por Osamu. La ficha conserva que es hermana del sultán y no su madre biológica.
- Tarae figura debajo de esa autoridad como Haseki Sultan.
- Shizuka queda registrada como Cariye personal de Otoha; Natsu conserva su asignación personal a Tarae.
- Akiko vuelve a estar incluida en el catálogo y en el apartado de İkbal. Su ficha conserva vacíos los datos personales que no estaban documentados en el proyecto original.


## Actualización: Crónica de la Corte

Se añadió el apartado **Crónica de la Corte**, con dos registros independientes:

- **Contienda por el trono:** los Şehzades Arata, Osman, Osome y Shizuku parten de cero méritos. Cada anotación suma puntos al total y actualiza el podio y la clasificación. Los empates comparten posición.
- **Sucesos y rumores:** permite registrar acontecimientos por mes y año del sultanato, categoría y condición del relato: Oficial o Chisme de pasillo. Los rumores se muestran diferenciados y no se presentan como hechos confirmados.

Los registros se guardan mediante `localStorage` en el navegador y dispositivo desde el que se utiliza la página. No se sincronizan automáticamente entre equipos ni navegadores; conviene conservar el almacenamiento del sitio o realizar una copia antes de limpiar los datos del navegador.

## Registro de personajes

Se actualizaron los resúmenes breves de los 40 personajes y se dejaron vacías todas las biografías (`bio`) para que las fichas públicas funcionen como descripciones concisas. Se mantuvieron los datos de relación, rango, casta, aroma e imagen.

## Gobierno imperial

Se añadieron los cargos de Reisülküttab, Kaptan-ı Derya, Yeniçeri Ağası y Şeyhülislam. Este último se presenta como autoridad religiosa y jurídica vinculada al gobierno, pero no como miembro ordinario del Diván.


## Crónica de la Corte: edición de méritos, sucesos y rumores

La sección es de solo lectura para los visitantes. Ya no utiliza `localStorage` ni muestra formularios de edición.

Para modificar lo que ve todo el mundo, abre:

`js/data/cronica.js`

- `merits`: agrega los méritos de los Şehzades. Los identificadores válidos son `arata`, `osman`, `osome` y `shizuku`.
- `events`: agrega acontecimientos oficiales o rumores de pasillo. Usa `status: "Oficial"` o `status: "Pasillo"`.
- Cada registro debe incluir mes y año del sultanato.
- Los registros se muestran del último añadido al primero.

Después de guardar los cambios, vuelve a publicar/subir los archivos del sitio. Todos los visitantes verán la misma información cuando carguen la versión actualizada. No hace falta editar `app.js` ni `index.html` para añadir entradas.

**Importante:** esta modalidad no ofrece edición en vivo desde la web. Los cambios se hacen en el archivo del proyecto y requieren volver a desplegar el sitio.


## Organigramas y fichas de personajes

Los organigramas del Harén, Gobierno, Administración y Nobleza se generan a partir del catálogo de fichas. No se mantienen listas duplicadas de personajes.

### Cambiar a una persona de cargo

1. Abre el archivo de datos correspondiente dentro de `js/data/`.
2. Busca la ficha por su `id`.
3. Cambia únicamente el valor de `rank`.
4. Guarda y vuelve a publicar el sitio.

El organigrama buscará automáticamente a las personas cuyo `rank` coincida con el cargo configurado. La comparación no distingue mayúsculas, tildes ni espacios sobrantes.

### Dónde se define la estructura

Abre `js/data/organigramas.js`. Allí se configuran los títulos, descripciones, jerarquías y cargos disponibles, pero no se escriben nombres de personajes.

- `harem`: jerarquía del harén. El cargo de la ficha determina quién aparece en cada nivel.
- `government`: cargos del gobierno. Si ninguna ficha tiene ese `rank`, el puesto se muestra como vacante.
- `administration`: oficios y servicios del palacio. Los ocupantes se obtienen por `rank`.
- `nobility`: casas nobles. La ficha de cada integrante contiene una propiedad `house` que determina su casa.

Las fichas se abren pulsando el retrato o el nombre dentro del organigrama. No hay un directorio repetido debajo de cada esquema.

### Excepción: Dinastía Imperial

El árbol de la dinastía conserva sus vínculos familiares explícitos porque representa parentescos y descendencia, no una jerarquía de cargos. Sus retratos también abren las fichas del catálogo.


**Nota sobre rangos nuevos:** si cambias a una persona a un cargo que ya existe en el organigrama, basta con cambiar `rank` en su ficha. Si inventas un cargo que todavía no aparece en la estructura, primero debes añadir ese cargo una sola vez en `js/data/organigramas.js`; después, cualquier ficha con ese mismo `rank` aparecerá allí automáticamente.
