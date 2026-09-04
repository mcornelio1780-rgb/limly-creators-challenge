/**
 * ⚠️ ESTA COPIA ESTÁ DESACTUALIZADA — NO LA PEGUES EN APPS SCRIPT.
 *
 * Lee la inscripción de e.postData.contents, pero la web ya la manda
 * como formulario y llega en e.parameter.payload. Si pegas este
 * archivo en Google, las inscripciones dejan de guardarse.
 * La versión buena es la que está publicada en Apps Script.
 *
 * ─────────────────────────────────────────────────────────────
 *
 * LIMLY CREATORS CHALLENGE — recepción de inscripciones
 *
 * Qué hace: recibe cada inscripción de la web y la escribe como
 * una fila en tu Google Sheet. Nada más. No guarda nada aparte,
 * no depende de ningún servicio de pago.
 *
 * ─────────────────────────────────────────────────────────────
 * CÓMO INSTALARLO (una sola vez, ~10 minutos)
 * ─────────────────────────────────────────────────────────────
 * 1. Crea una hoja de cálculo nueva en sheets.new
 *    Llámala, por ejemplo, "Limly Creators Challenge — Inscripciones".
 *
 * 2. En esa hoja: menú Extensiones → Apps Script.
 *
 * 3. Borra todo lo que haya en el editor y pega ESTE archivo completo.
 *
 * 4. Guarda (icono del disquete).
 *
 * 5. Botón azul "Implementar" (arriba a la derecha) →
 *    "Nueva implementación" → engranaje → tipo: "Aplicación web".
 *      · Descripción:        Inscripciones reto
 *      · Ejecutar como:      Yo (tu cuenta)
 *      · Quién tiene acceso: CUALQUIER USUARIO   ← importante
 *    → Implementar.
 *
 * 6. Google te pedirá autorizar. Acepta. Si sale la pantalla
 *    "Google no ha verificado esta aplicación", pulsa
 *    "Configuración avanzada" → "Ir a (nombre del proyecto)".
 *    Es tu propio script: es seguro.
 *
 * 7. Copia la "URL de la aplicación web". Termina en /exec
 *    Se ve así:
 *    https://script.google.com/macros/s/AKfycb..................../exec
 *
 * 8. Abre el HTML del reto, busca CONFIG (está en la primera
 *    línea del primer <script>) y cambia:
 *
 *        endpoint: null
 *
 *    por:
 *
 *        endpoint: 'https://script.google.com/macros/s/TU_URL/exec'
 *
 *    Guarda. Ya está: cada inscripción cae en tu hoja.
 *
 * ─────────────────────────────────────────────────────────────
 * SI CAMBIAS ESTE ARCHIVO DESPUÉS
 * ─────────────────────────────────────────────────────────────
 * Tienes que volver a "Implementar" → "Gestionar implementaciones"
 * → editar (lápiz) → Versión: "Nueva versión" → Implementar.
 * Si solo guardas, la URL sigue sirviendo la versión antigua.
 */

/* Orden de las columnas en la hoja. Cambiar aquí cambia la hoja. */
var COLUMNAS = [
  'at',           // fecha y hora ISO en que se inscribió
  'code',         // código de participante
  'type',         // estudiante | universidad
  'name',
  'email',
  'whatsapp',     // número completo con prefijo, ej. +51995422760
  'uni',
  'countryName',
  'city',
  'career',
  'role',         // solo para responsables universitarios
  'team',
  'teamStatus',   // si | solo | busco
  'lang',         // idioma en el que se inscribió
  'challenge'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // evita que dos inscripciones simultáneas se pisen
  try {
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Cabeceras, solo la primera vez
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(COLUMNAS);
      hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold');
      hoja.setFrozenRows(1);
    }

    var datos = JSON.parse(e.postData.contents);

    hoja.appendRow(COLUMNAS.map(function (c) {
      return datos[c] === undefined || datos[c] === null ? '' : String(datos[c]);
    }));

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Deja rastro del fallo en una pestaña aparte en vez de perderlo
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var log = ss.getSheetByName('errores') || ss.insertSheet('errores');
      log.appendRow([new Date(), String(err), e && e.postData ? e.postData.contents : '']);
    } catch (e2) {}

    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/* Permite abrir la URL en el navegador para comprobar que vive. */
function doGet() {
  return ContentService.createTextOutput('Limly Creators Challenge — endpoint activo');
}
