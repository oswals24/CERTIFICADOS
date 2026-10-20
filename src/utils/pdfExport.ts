import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Genera y descarga un archivo PDF tamaño Carta (Letter: 215.9 mm x 279.4 mm)
 * con resolución nítida y fidelidad 100% idéntica a la vista oficial,
 * preservando marcos de seguridad, marcas de agua, códigos QR, colores y tipografía.
 *
 * Funciona de manera aislada en un contenedor sandbox off-screen, eliminando
 * distorsiones producidas por zoom, resoluciones de celulares o transformadas CSS.
 */
export async function downloadCertificatePDF(
  elementId: string,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const sourceElement = document.getElementById(elementId);
  if (!sourceElement) {
    throw new Error(`Elemento de certificado con ID #${elementId} no encontrado`);
  }

  onProgress?.(10);

  // Dimensiones exactas de hoja Carta (Letter) a 96 DPI: 8.5" x 11" = 816px x 1056px
  const LETTER_WIDTH_PX = 816;
  const LETTER_HEIGHT_PX = 1056;

  // 1. Contenedor sandbox temporal aislado fuera de la vista pero en coordenadas (0,0)
  const sandbox = document.createElement('div');
  sandbox.id = `export-sandbox-${Date.now()}`;
  sandbox.style.position = 'fixed';
  sandbox.style.left = '0px';
  sandbox.style.top = '0px';
  sandbox.style.width = `${LETTER_WIDTH_PX}px`;
  sandbox.style.height = `${LETTER_HEIGHT_PX}px`;
  sandbox.style.overflow = 'hidden';
  sandbox.style.zIndex = '-99999';
  sandbox.style.transform = 'none';
  sandbox.style.margin = '0';
  sandbox.style.padding = '0';
  sandbox.style.pointerEvents = 'none';

  // Si sourceElement es el wrapper con transform, buscamos la página interna .certificate-page
  const targetToClone = sourceElement.classList.contains('print-wrapper')
    ? (sourceElement.querySelector('.certificate-page') as HTMLElement) || sourceElement
    : sourceElement;

  // 2. Clonación profunda del certificado
  const clone = targetToClone.cloneNode(true) as HTMLElement;
  clone.id = `${elementId}-offscreen-clone`;

  // Normalización de estilos en el clon para rendering 1:1 Carta
  clone.style.transform = 'none';
  clone.style.transformOrigin = 'top left';
  clone.style.width = `${LETTER_WIDTH_PX}px`;
  clone.style.height = `${LETTER_HEIGHT_PX}px`;
  clone.style.minWidth = `${LETTER_WIDTH_PX}px`;
  clone.style.minHeight = `${LETTER_HEIGHT_PX}px`;
  clone.style.maxWidth = `${LETTER_WIDTH_PX}px`;
  clone.style.maxHeight = `${LETTER_HEIGHT_PX}px`;
  clone.style.boxSizing = 'border-box';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.position = 'relative';

  // Eliminar botones interactivos o elementos no-print en la exportación
  clone.querySelectorAll('.no-print, button').forEach((el) => el.remove());

  // Copiar el estado de los elementos canvas (como el código QR si se generó en canvas)
  const sourceCanvases = targetToClone.querySelectorAll('canvas');
  const cloneCanvases = clone.querySelectorAll('canvas');
  sourceCanvases.forEach((srcCanvas, idx) => {
    const dstCanvas = cloneCanvases[idx];
    if (dstCanvas) {
      dstCanvas.width = srcCanvas.width;
      dstCanvas.height = srcCanvas.height;
      const ctx = dstCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(srcCanvas, 0, 0);
      }
    }
  });

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  onProgress?.(30);

  try {
    // Breve pausa para asegurar cálculo de layout y renderizado de fuentes en el sandbox
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Asegurar que las imágenes del clon (ej. QR code en DataURL) estén listas
    const images = Array.from(clone.querySelectorAll('img'));
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve(true);
            } else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            }
          })
      )
    );

    onProgress?.(50);

    // Detectar color de fondo explícito del modelo (blanco, marfil, pergamino)
    const compStyle = window.getComputedStyle(targetToClone);
    const resolvedBgColor =
      clone.style.backgroundColor ||
      (compStyle.backgroundColor && compStyle.backgroundColor !== 'rgba(0, 0, 0, 0)'
        ? compStyle.backgroundColor
        : '#ffffff');

    // 3. Captura con html2canvas-pro en alta resolución (scale: 2.5 = 2040 x 2640 px)
    const canvas = await html2canvas(clone, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      width: LETTER_WIDTH_PX,
      height: LETTER_HEIGHT_PX,
      windowWidth: LETTER_WIDTH_PX,
      windowHeight: LETTER_HEIGHT_PX,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      backgroundColor: resolvedBgColor,
      ignoreElements: (el) => {
        return (
          el.classList?.contains('no-print') ||
          el.tagName === 'BUTTON' ||
          el.tagName === 'NAV'
        );
      },
    });

    onProgress?.(75);

    // 4. Crear PDF tamaño Carta Oficial (215.9 x 279.4 mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      compress: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // 5. Dimensiones exactas de hoja carta en mm (sin márgenes ni recortes)
    const pdfWidth = 215.9;
    const pdfHeight = 279.4;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    onProgress?.(95);

    // 6. Descargar el archivo
    pdf.save(fileName);

    onProgress?.(100);
  } finally {
    // Limpieza del contenedor sandbox
    if (document.body.contains(sandbox)) {
      document.body.removeChild(sandbox);
    }
  }
}
