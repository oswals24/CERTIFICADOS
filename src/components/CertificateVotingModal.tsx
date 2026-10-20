import React, { useState, useEffect } from 'react';
import { CertificateTemplateType } from '../types/certificate';

interface VotingOption {
  id: CertificateTemplateType;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  features: string[];
  color: string;
  bgGradient: string;
}

const TEMPLATE_OPTIONS: VotingOption[] = [
  {
    id: 'dgb_tradicional',
    title: 'Modelo 1: Oficial DGB - PREFECO',
    badge: 'Tradicional Escolar',
    subtitle: 'El formato clásico por excelencia con tabla de asignaturas y sello de goma',
    description:
      'Diseño formal con marco perimetral verde y dorado, desglose completo de materias, rúbrica de director y sello circular oficial.',
    features: [
      'Encabezado SEP - Escudo Nacional - DGB',
      'Tabla completa de materias con calificaciones',
      'Borde perimetral verde olivo con grecas doradas',
      'Código QR dinámico con folio y URL del alumno para cotejo',
    ],
    color: '#1b4332',
    bgGradient: 'from-emerald-900/10 to-emerald-800/5',
  },
  {
    id: 'sep_centenario',
    title: 'Modelo 2: SEP Centenario Digital',
    badge: 'Digital Moderno',
    subtitle: 'Diseño centenario oficial de Prepa en Línea con 23 módulos y remate alado',
    description:
      'Formato digital contemporáneo con promedio general destacado en doble recuadro, orla guilloché verde jade y remate azteca.',
    features: [
      'Cresta superior prehispánica con águila mexicana',
      'Promedio general destacado en doble caja',
      'Cenefa de seguridad guilloché digital',
      'Código QR dinámico vinculado a la validación oficial',
    ],
    color: '#047857',
    bgGradient: 'from-teal-900/10 to-teal-800/5',
  },
  {
    id: 'solemne_gala',
    title: 'Modelo 3: Gala y Excelencia Académica',
    badge: 'Edición Honorífica',
    subtitle: 'Diploma formal de gala con doble orla dorada y esmeralda conmemorativa',
    description:
      'Estilo solemne de alta distinción para ceremonias de graduación y entrega de reconocimientos de excelencia académica.',
    features: [
      'Doble marco perimetral dorado bruñido y verde bosque',
      'Marca de agua central del Águila Mexicana en oro',
      'Medallón de honor y promedio en relieve',
      'Código QR con timbrado digital y cadena criptográfica',
    ],
    color: '#b45309',
    bgGradient: 'from-amber-900/10 to-amber-800/5',
  },
  {
    id: 'acuerdo_286',
    title: 'Modelo 4: Acuerdo 286 / DGB Federal',
    badge: 'Digital Federal (Img 1)',
    subtitle: 'Idéntico al formato oficial federal con barras doradas y 3 columnas limpias',
    description:
      'Diseño sobrio y elegante idéntico al emitido por la federación: barras doradas para datos personales y de acreditación, columnas CCT/Fecha/Resultado y sello digital extendido.',
    features: [
      'Barras doradas institucionales para datos personales',
      'Columnas limpias: CCT | Fecha | Resultado obtenido',
      'Firma electrónica avanzada y bloque criptográfico',
      'Código QR dinámico oficial para verificación federal',
    ],
    color: '#854d0e',
    bgGradient: 'from-yellow-900/10 to-amber-800/5',
  },
  {
    id: 'prepa_abierta',
    title: 'Modelo 5: Preparatoria Abierta / SEMS',
    badge: 'Oficial SEMS (Img 2)',
    subtitle: 'Idéntico al modelo con sello circular mexicano, rúbrica y módulos laborales',
    description:
      'Estructura exacta de Preparatoria Abierta SEMS con sello circular oficial de los Estados Unidos Mexicanos, módulos laborales en números romanos y métricas de créditos.',
    features: [
      'Logotipos oficiales SEP y Preparatoria Abierta',
      'Sello oficial circular ministerial con el Águila Nacional',
      'Módulos de formación laboral con horas y créditos',
      'Código QR dinámico al pie para autenticidad inmediata',
    ],
    color: '#1e3a8a',
    bgGradient: 'from-blue-900/10 to-indigo-800/5',
  },
];

interface CertificateVotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: CertificateTemplateType;
  onSelectTemplate: (template: CertificateTemplateType) => void;
  onDownloadTemplate: (template: CertificateTemplateType) => void;
  onDownloadAll: () => void;
  isDownloading?: boolean;
}

export const CertificateVotingModal: React.FC<CertificateVotingModalProps> = ({
  isOpen,
  onClose,
  currentTemplate,
  onSelectTemplate,
  onDownloadTemplate,
  onDownloadAll,
  isDownloading = false,
}) => {
  const [votes, setVotes] = useState<Record<CertificateTemplateType, number>>({
    dgb_tradicional: 0,
    sep_centenario: 0,
    solemne_gala: 0,
    acuerdo_286: 0,
    prepa_abierta: 0,
  });

  const [hasVotedFor, setHasVotedFor] = useState<CertificateTemplateType | null>(null);

  // Cargar votos desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cert_template_votes');
      if (saved) {
        setVotes(JSON.parse(saved));
      } else {
        // Inicializar con unos votos de demostración equilibrados
        setVotes({
          dgb_tradicional: 5,
          sep_centenario: 8,
          solemne_gala: 6,
          acuerdo_286: 7,
          prepa_abierta: 4,
        });
      }
      const myVote = localStorage.getItem('cert_template_my_vote');
      if (myVote) {
        setHasVotedFor(myVote as CertificateTemplateType);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!isOpen) return null;

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = (id: CertificateTemplateType) => {
    const newVotes = { ...votes, [id]: (votes[id] || 0) + 1 };
    setVotes(newVotes);
    setHasVotedFor(id);
    try {
      localStorage.setItem('cert_template_votes', JSON.stringify(newVotes));
      localStorage.setItem('cert_template_my_vote', id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetVotes = () => {
    if (window.confirm('¿Reiniciar el conteo de votos a cero para iniciar una nueva votación?')) {
      const zeroVotes: Record<CertificateTemplateType, number> = {
        dgb_tradicional: 0,
        sep_centenario: 0,
        solemne_gala: 0,
        acuerdo_286: 0,
        prepa_abierta: 0,
      };
      setVotes(zeroVotes);
      setHasVotedFor(null);
      localStorage.removeItem('cert_template_votes');
      localStorage.removeItem('cert_template_my_vote');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* ENCABEZADO */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase tracking-widest">
                Sesión de Votación y Elección
              </span>
              <span className="text-xs text-slate-400">• Total de votos registrados: <strong className="text-white font-mono">{totalVotes}</strong></span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              🗳️ Presentación de los 5 Modelos de Certificado
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Compara las 5 propuestas oficiales con los datos de prueba del alumno. Vota por el diseño preferido o descárgalos todos en PDF de alta resolución.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onDownloadAll}
              disabled={isDownloading}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
            >
              <span>📥 Descargar los 5 Modelos (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              title="Cerrar ventana"
            >
              ✕
            </button>
          </div>
        </div>

        {/* LISTA DE LOS 5 MODELOS */}
        <div className="p-5 sm:p-6 max-h-[72vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATE_OPTIONS.map((opt) => {
              const count = votes[opt.id] || 0;
              const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const isSelected = currentTemplate === opt.id;
              const hasVotedThis = hasVotedFor === opt.id;

              return (
                <div
                  key={opt.id}
                  className={`relative rounded-xl p-4 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-400 shadow-xl ring-2 ring-amber-400/30'
                      : 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  {/* BADGES */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-amber-300 border border-slate-600">
                      {opt.badge}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        ✓ Activo en Vista
                      </span>
                    )}
                  </div>

                  {/* VISTA MINIATURA DEL DISEÑO OFICIAL */}
                  <div
                    onClick={() => onSelectTemplate(opt.id)}
                    className="w-full h-36 rounded-lg mb-3 border border-slate-700/80 overflow-hidden relative cursor-pointer hover:border-amber-400/70 transition-all flex items-center justify-center shadow-inner group"
                    style={{
                      backgroundColor:
                        opt.id === 'acuerdo_286'
                          ? '#faf8f5'
                          : opt.id === 'prepa_abierta'
                          ? '#fdfbf7'
                          : opt.id === 'solemne_gala'
                          ? '#fcfbf7'
                          : '#ffffff',
                    }}
                  >
                    {/* Borde perimetral característico en miniatura */}
                    <div
                      className={`absolute inset-1.5 rounded-xs pointer-events-none ${
                        opt.id === 'solemne_gala'
                          ? 'border-[1.5px] border-amber-600'
                          : 'border-[1.5px] border-[#1b4332]'
                      }`}
                    >
                      {/* Cresta superior azteca en modelos 2, 4 y 5 */}
                      {(opt.id === 'sep_centenario' ||
                        opt.id === 'acuerdo_286' ||
                        opt.id === 'prepa_abierta') && (
                        <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 bg-inherit px-1 flex items-center justify-center">
                          <div className="w-8 h-2 bg-[#1b4332] rounded-xs opacity-90" />
                        </div>
                      )}
                    </div>

                    {/* Marca de agua tenue en miniatura */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
                      <div className="w-16 h-16 rounded-full border border-slate-900 flex items-center justify-center font-serif text-[8px] font-black text-slate-800">
                        MEX
                      </div>
                    </div>

                    {/* Estructura miniatura representativa */}
                    <div className="relative z-10 w-full h-full p-3 flex flex-col justify-between text-slate-900 pointer-events-none select-none">
                      {/* Encabezado */}
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-1">
                        <div className="flex items-center gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#691c32]" />
                          <span className="text-[7.5px] font-black text-[#691c32] tracking-tighter">
                            {opt.id === 'acuerdo_286' || opt.id === 'sep_centenario'
                              ? 'EDUCACIÓN'
                              : 'SEP'}
                          </span>
                        </div>
                        <span className="text-[7px] font-bold text-[#1b4332]">
                          {opt.id === 'acuerdo_286'
                            ? 'DGB'
                            : opt.id === 'prepa_abierta'
                            ? 'PREPA ABIERTA'
                            : opt.id === 'sep_centenario'
                            ? 'CENTENARIO'
                            : 'OFICIAL'}
                        </span>
                      </div>

                      {/* Cuerpo medio */}
                      <div className="space-y-1 text-center py-0.5">
                        <div className="text-[6.5px] font-extrabold uppercase tracking-wide text-slate-800">
                          {opt.id === 'acuerdo_286'
                            ? 'Acuerdo 286 / DGB Federal'
                            : opt.id === 'prepa_abierta'
                            ? 'Preparatoria Abierta SEMS'
                            : opt.id === 'sep_centenario'
                            ? 'Prepa en Línea SEP'
                            : 'Certificado de Estudios'}
                        </div>

                        {/* Franjas doradas características de Acuerdo 286 y Prepa Abierta */}
                        {(opt.id === 'acuerdo_286' || opt.id === 'prepa_abierta') && (
                          <div className="w-full bg-[#b89758]/25 border-y border-[#b89758]/40 py-[1.5px] text-[5.5px] font-bold text-[#634812]">
                            Datos del Estudiante Acreditado
                          </div>
                        )}

                        <div className="text-[8px] font-black text-slate-950 uppercase tracking-tight">
                          [ Alumno de Prueba ]
                        </div>

                        {/* Módulos o materias en miniatura */}
                        {opt.id === 'sep_centenario' && (
                          <div className="text-[5.5px] text-slate-600 font-mono">
                            23 Módulos • Promedio 8.9 OCHO PUNTO NUEVE
                          </div>
                        )}
                        {opt.id === 'acuerdo_286' && (
                          <div className="text-[5.5px] text-slate-600 font-mono">
                            CCT 09DEX0001S • Resultado 7.1 SIETE PUNTO UNO
                          </div>
                        )}
                        {opt.id === 'prepa_abierta' && (
                          <div className="text-[5.5px] text-slate-600 font-mono">
                            8 Módulos Laborales • Promedio 9.0 NUEVE PUNTO CERO
                          </div>
                        )}
                        {opt.id === 'dgb_tradicional' && (
                          <div className="text-[5.5px] text-slate-600 font-mono">
                            Kardex Completo • Promedio Oficial 8.1
                          </div>
                        )}
                        {opt.id === 'solemne_gala' && (
                          <div className="text-[5.5px] text-amber-900 font-serif">
                            Diploma de Honor y Excelencia Académica
                          </div>
                        )}
                      </div>

                      {/* Pie con QR y sello */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <div className="w-4 h-4 bg-slate-900/90 rounded-[1px] flex items-center justify-center text-[5px] text-white font-mono">
                          QR
                        </div>
                        <div className="text-[5.5px] text-slate-500 font-mono">
                          Folio: {opt.id.slice(0, 8)}...
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-800 flex items-center justify-center text-[4.5px] text-slate-800">
                          SELLO
                        </div>
                      </div>
                    </div>

                    {/* Overlay al pasar el ratón */}
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="text-[11px] font-bold text-amber-300 bg-slate-900 px-2.5 py-1 rounded-md border border-amber-400/50 shadow">
                        Ver diseño en pantalla →
                      </span>
                    </div>
                  </div>

                  {/* TÍTULO Y DESCRIPCIÓN */}
                  <div className="space-y-1.5 mb-3 flex-1">
                    <h3 className="text-sm font-bold text-white tracking-wide">{opt.title}</h3>
                    <p className="text-[11px] text-slate-300 font-medium leading-snug">{opt.subtitle}</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed pt-1">{opt.description}</p>

                    {/* CARACTERÍSTICAS */}
                    <div className="pt-2 border-t border-slate-700/60 space-y-1">
                      {opt.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[9.5px] text-slate-300">
                          <span className="text-amber-400">▪</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BARRA DE VOTOS */}
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60 space-y-1.5 my-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Votos recibidos:</span>
                      <span className="font-mono font-bold text-amber-300">
                        {count} {count === 1 ? 'voto' : 'votos'} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* ACCIONES: VOTAR, PREVISUALIZAR, DESCARGAR */}
                  <div className="space-y-1.5 pt-1">
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleVote(opt.id)}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          hasVotedThis
                            ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      >
                        <span>{hasVotedThis ? '✓ Mi Voto' : '👍 Votar'}</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectTemplate(opt.id);
                          onClose();
                        }}
                        className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-700/80 hover:bg-slate-600 text-slate-200 transition-colors"
                      >
                        👁️ Ver en Pantalla
                      </button>
                    </div>

                    <button
                      onClick={() => onDownloadTemplate(opt.id)}
                      disabled={isDownloading}
                      className="w-full py-1.5 px-2 rounded-lg text-[11px] font-medium bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 border border-emerald-700/50 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>📄 Descargar este PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PIE DE PÁGINA */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={handleResetVotes}
            className="text-slate-400 hover:text-rose-400 text-[11px] underline transition-colors"
          >
            Reiniciar conteo de votos a cero
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
            >
              Cerrar Galería
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
