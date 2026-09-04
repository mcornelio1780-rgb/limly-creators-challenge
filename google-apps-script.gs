/**
 * LIMLY CREATORS CHALLENGE — recepción de inscripciones
 *
 * Escribe cada inscripción como una fila en la pestaña "inscripciones".
 * Si algo falla, deja el rastro en la pestaña "errores" en vez de perderlo.
 *
 * ─────────────────────────────────────────────────────────────
 * SI YA TENÍAS LA VERSIÓN ANTERIOR INSTALADA
 * ─────────────────────────────────────────────────────────────
 * 1. Abre tu hoja → Extensiones → Apps Script.
 * 2. Borra TODO el código que haya y pega este archivo completo.
 * 3. Guarda (Ctrl+S).
 * 4. Implementar → Gestionar implementaciones → el lápiz (editar) →
 *    Versión: "Nueva versión" → Implementar.
 *
 *    ⚠️ Este paso 4 es obligatorio. Si solo guardas, la URL sigue
 *    entregando el código viejo y nada cambia.
 *
 * 5. La URL NO cambia. No hay que tocar la web por este lado.
 *
 * ─────────────────────────────────────────────────────────────
 * INSTALACIÓN DESDE CERO
 * ─────────────────────────────────────────────────────────────
 * 1. Crea una hoja en sheets.new y ponle nombre.
 * 2. Extensiones → Apps Script. Borra lo que haya y pega esto.
 * 3. Guardar → Implementar → Nueva implementación → engranaje →
 *    "Aplicación web".
 *      · Ejecutar como:      Yo
 *      · Quién tiene acceso: CUALQUIER USUARIO   ← imprescindible
 * 4. Autoriza. Si sale "Google no ha verificado esta aplicación",
 *    entra en "Configuración avanzada" → "Ir a (proyecto)".
 * 5. Copia la URL que termina en /exec y ponla en CONFIG.endpoint
 *    dentro de index.html.
 */

var HOJA_DATOS   = 'inscripciones';
var HOJA_ERRORES = 'errores';

/* Orden de las columnas. Cambiar aquí cambia la hoja. */
var COLUMNAS = [
  'at',           // fecha y hora ISO de la inscripción
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
  'lang',
  'challenge'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var crudo = extraerPayload(e);
    if (!crudo) throw new Error('Peticion sin datos. Nada que guardar.');

    var datos = JSON.parse(crudo);
    hojaDatos().appendRow(COLUMNAS.map(function (c) {
      return datos[c] === undefined || datos[c] === null ? '' : String(datos[c]);
    }));

    return json({ ok: true });

  } catch (err) {
    registrarError(err, e);
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Los datos pueden llegar de tres formas distintas segun como envie el
 * navegador. Las probamos todas en vez de asumir una sola, que es
 * exactamente lo que fallaba en la version anterior.
 */
function extraerPayload(e) {
  if (!e) return null;
  if (e.parameter && e.parameter.payload) return e.parameter.payload;
  if (e.postData && e.postData.contents) return e.postData.contents;
  if (e.parameters && e.parameters.payload && e.parameters.payload.length) {
    return e.parameters.payload[0];
  }
  return null;
}

/* La pestana de datos, creada con cabeceras la primera vez. */
function hojaDatos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var h = ss.getSheetByName(HOJA_DATOS);
  if (!h) h = ss.insertSheet(HOJA_DATOS, 0);
  if (h.getLastRow() === 0) {
    h.appendRow(COLUMNAS);
    h.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold');
    h.setFrozenRows(1);
  }
  return h;
}

function registrarError(err, e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var h = ss.getSheetByName(HOJA_ERRORES) || ss.insertSheet(HOJA_ERRORES);
    h.appendRow([
      new Date(),
      String(err),
      e ? JSON.stringify({ parameter: e.parameter, postData: e.postData }) : 'sin evento'
    ]);
  } catch (e2) {}
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
                       .setMimeType(ContentService.MimeType.JSON);
}

/* Abrir la URL en el navegador debe mostrar este texto. */
function doGet() {
  return ContentService.createTextOutput('Limly Creators Challenge - endpoint activo');
}

/**
 * PRUEBA SIN LA WEB
 * Elige "probar" en el desplegable de funciones del editor y pulsa Ejecutar.
 * Debe aparecer una fila de prueba en la pestana "inscripciones".
 * Sirve para confirmar que el script y la hoja estan bien conectados,
 * sin depender del navegador ni de la web.
 */
function probar() {
  doPost({ parameter: { payload: JSON.stringify({
    at: new Date().toISOString(),
    code: 'TEST-CC26-0001',
    type: 'estudiante',
    name: 'Prueba desde el editor',
    email: 'prueba@limly.io',
    whatsapp: '+51999999999',
    uni: 'Universidad de prueba',
    countryName: 'Peru',
    city: 'Lima',
    career: 'Comunicaciones',
    role: '',
    team: '',
    teamStatus: 'solo',
    lang: 'es',
    challenge: 'Limly Creators Challenge'
  }) } });
}
