# Limly Creators Challenge

Web del reto: landing, brief descargable, inscripción, generador de pasaporte
y panel de organizadores. Todo vive en `index.html` — un solo archivo, sin
build, sin dependencias que instalar.

Español, inglés y portugués, con conmutador en la barra superior.

---

## Qué hay aquí

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | La web entera. Es lo único imprescindible. |
| `og-image.png` | La imagen que se ve al pegar el enlace en WhatsApp o LinkedIn. |
| `favicon.png`, `apple-touch-icon.png` | El icono de la pestaña y de la pantalla de inicio. |
| `google-apps-script.gs` | El código que recibe las inscripciones y las escribe en tu Google Sheet. **No se sube a Vercel**, se pega en Google. |
| `vercel.json` | Configuración de caché. No hay que tocarlo. |

---

## Puesta en marcha, en orden

### 1. El buzón de inscripciones ya está conectado

`endpoint` en el bloque `CONFIG` ya apunta al Apps Script publicado. Las
inscripciones caen en la hoja de cálculo asociada.

Si algún día tienes que volver a publicarlo (por ejemplo tras cambiar el
código del script), acuérdate de generar una **nueva versión** al implementar,
no solo guardar. Y si cambia la URL, actualízala en `CONFIG.endpoint`.

Las instrucciones completas están en `google-apps-script.gs`.

**Comprueba que funciona antes de anunciar nada:** inscríbete tú mismo con
datos de prueba y mira que aparezca la fila en la hoja. Si no aparece, casi
siempre es porque al publicar el script dejaste "Quién tiene acceso" en
"Solo yo" en vez de "Cualquier usuario".

### 2. Sube el repositorio a GitHub

```bash
git init
git add .
git commit -m "Limly Creators Challenge"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/limly-creators-challenge.git
git push -u origin main
```

### 3. Publica en Vercel

1. Entra a [vercel.com/new](https://vercel.com/new) e importa el repositorio.
2. En **Framework Preset** elige **Other**. No hay build.
3. Deja "Build Command" y "Output Directory" vacíos.
4. Deploy.

Vercel te dará una URL tipo `limly-creators-challenge.vercel.app`.

### 4. Pon tu dominio

En el proyecto de Vercel: **Settings → Domains → Add**, y añade algo como
`reto.limly.io`. Vercel te dice qué registro CNAME crear en tu proveedor de
dominio.

Un subdominio propio convierte bastante mejor que una URL de vercel.app
cuando lo pegas en los grupos de WhatsApp de las universidades.

### 5. La vista previa del enlace

En `index.html`, las etiquetas `og:url`, `og:image` y `twitter:image` apuntan
a `https://limly-creators-reto.vercel.app/`, el dominio actual en producción.
**Si añades un dominio propio, cámbialas por él.** Tienen que ser URLs
absolutas: si dejas una ruta relativa, WhatsApp no muestra la imagen.

Después de cambiarlo, prueba el enlace en
[developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)
para forzar que se refresque la caché de la vista previa.

---

## Cosas que querrás cambiar

Todo lo configurable está junto, en el bloque `CONFIG` al principio del primer
`<script>` de `index.html`:

| Ajuste | Qué controla |
| --- | --- |
| `challenge` | El nombre del reto. Cambia la web entera, el pasaporte, el brief y los certificados. |
| `deadline` | Cierre de inscripciones. Alimenta la barra negra y la cuenta atrás. |
| `promoCode` | El código del mes gratis. Hoy `Limly100`. |
| `whatsappGroup` | El enlace del grupo de la comunidad. |
| `meetingUrl` | El calendario para responsables universitarios. |
| `endpoint` | Dónde llegan las inscripciones. |

**Las fechas del brief** (producción, entrega, publicación, ganadores) están en
el objeto `BRIEF`, que tiene una versión por idioma. Si cambias una fecha,
cámbiala en las tres.

**Las universidades del mapa** están en el array `UNIS` dentro del módulo
`Map3`. Cada una es una línea: `['Nombre','ISO2', latitud, longitud]`. Añadir
una es añadir una línea.

---

## El panel de organizadores

Está en `/#organizadores`. No tiene contraseña: la ruta simplemente no está
enlazada de forma visible, salvo en el pie. Sirve para emitir los certificados
al cierre del reto y para exportar en CSV o JSON las inscripciones guardadas
**en ese navegador**.

Con el endpoint conectado, la lista buena es tu Google Sheet, no este panel.

Si te importa que nadie más entre ahí, la ruta se puede proteger o eliminar
antes de publicar.

---

## Detalles que conviene saber

- El mark de Limly va incrustado en base64 dentro del HTML. No depende de
  ninguna ruta, así que el archivo funciona igual abierto en local que servido
  desde Vercel.
- Las tipografías (Satoshi, Geist, JetBrains Mono) y la librería que genera los
  PDF se cargan desde CDN. Hace falta conexión.
- Los nombres de los países se traducen solos con `Intl.DisplayNames` según el
  idioma activo. No hay listas de nombres que mantener.
- El certificado se emite en inglés a propósito, pensando en LinkedIn, aunque
  la web sea trilingüe.
