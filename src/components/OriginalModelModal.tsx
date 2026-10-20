import React from 'react';
import { X, CheckCircle, Info, Sparkles } from 'lucide-react';

interface OriginalModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalModelModal: React.FC<OriginalModelModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white">
              Cotejo con el Modelo Oficial de Prueba (DGB - PREFECO)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            Hemos calibrado cada elemento del certificado digital para que coincida con exactitud
            al formato físico oficial del modelo de prueba presentado:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Encabezado Oficial</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Logotipo SEP con línea divisoria y Escudo Nacional a la izquierda; títulos
                centrados en jerarquía oficial; logotipo DGB en verde azulado a la derecha.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Alineación y Texto Justificado</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Texto justificado a caja completa sin cortes abruptos; nombre del estudiante en
                mayúsculas negrita destacado al centro con número de control y CURP.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Caja de Promedio 8.1</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Recuadros con borde sólido delgado para el promedio numérico [ 8.1 ] y la leyenda
                en letras [ OCHO PUNTO UNO ] alineados horizontalmente.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Tabla de Asignaturas</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Columnas exactas: número de orden, nombre de asignatura, calificación, total de horas
                y créditos, con espaciado limpio e interlineado idéntico al kardex oficial.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>QR, Firma y Sello</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Código QR verificable en la esquina izquierda; firma rúbrica con palabra "Firma" y
                nombre del Director Carlos Soto Kat al centro; sello institucional con leyenda C.C.T. y
                corchetes [ Sello ] a la derecha.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Ajuste Carta (1 Hoja)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Dimensiones fijas de 215.9mm x 279.4mm (Letter) con regla de no desbordamiento en
                impresión para garantizar que nunca se genere una segunda página en blanco.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-md"
          >
            Entendido, volver a la aplicación
          </button>
        </div>
      </div>
    </div>
  );
};
