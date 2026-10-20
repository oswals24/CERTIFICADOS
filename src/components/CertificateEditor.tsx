import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  User,
  Building,
  BookOpen,
  Calendar,
  Plus,
  Trash2,
  RotateCcw,
  Printer,
  Download,
  Settings,
  Sparkles,
  CheckCircle,
  FileCheck,
  Check,
  QrCode,
  ShieldCheck,
  Copy,
  ExternalLink,
} from 'lucide-react';

import { CertificateData, Subject, CertificateTemplateType } from '../types/certificate';
import { buildVerificationUrl } from '../utils/verificationHelper';
import {
  inferDatesFromPeriodText,
  formatPeriodRange,
  generateLegalIssueDateText,
  SCHOOL_CYCLE_PRESETS,
  PeriodFormatStyle,
  SPANISH_MONTHS_UPPER,
} from '../utils/dateHelper';

interface CertificateEditorProps {
  data: CertificateData;
  onChange: (data: CertificateData) => void;
  selectedTemplate: CertificateTemplateType;
  onSelectTemplate: (template: CertificateTemplateType) => void;
  onRestoreDefaults: () => void;
  onLoadGenesisModel?: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onDownloadAllPdf?: () => void;
  onOpenVoting?: () => void;
  onOpenVerify?: () => void;
  onOpenQRManager?: () => void;
  isDownloadingPdf?: boolean;
  onCreateTaskForStudent?: (studentName: string, folio: string) => void;
  generalGpaOverride: string;
  setGeneralGpaOverride: (val: string) => void;
}

export const CertificateEditor: React.FC<CertificateEditorProps> = ({
  data,
  onChange,
  selectedTemplate,
  onSelectTemplate,
  onRestoreDefaults,
  onLoadGenesisModel,
  onPrint,
  onDownloadPdf,
  onDownloadAllPdf,
  onOpenVoting,
  onOpenVerify,
  onOpenQRManager,
  isDownloadingPdf,
  onCreateTaskForStudent,
  generalGpaOverride,
  setGeneralGpaOverride,
}) => {
  const [activeTab, setActiveTab] = useState<'alumno' | 'institucion' | 'materias' | 'ajustes' | 'qr'>('alumno');
  const [showManualPeriodText, setShowManualPeriodText] = useState(false);
  const [qrEditorPreview, setQrEditorPreview] = useState<string>('');
  const [qrCopied, setQrCopied] = useState(false);

  // Derivar fechas de inicio y término para el selector interactivo
  const inferred = inferDatesFromPeriodText(data.period);
  const currentStartDate = data.periodStartDate || inferred.startDate;
  const currentEndDate = data.periodEndDate || inferred.endDate;
  const currentFormatStyle: PeriodFormatStyle = data.periodFormatStyle || 'full_legal';

  // Derivar fecha ISO de emisión para el selector
  const monthIdx = SPANISH_MONTHS_UPPER.indexOf((data.issueMonth || 'JULIO').toUpperCase());
  const safeMonthNum = monthIdx >= 0 ? monthIdx + 1 : 7;
  const currentIssueDate =
    data.issueDate ||
    `${data.issueYear || 2018}-${safeMonthNum.toString().padStart(2, '0')}-${(data.issueDay || 13)
      .toString()
      .padStart(2, '0')}`;

  const handlePeriodChange = (start: string, end: string, style: PeriodFormatStyle = currentFormatStyle) => {
    const formatted = formatPeriodRange(start, end, style);
    onChange({
      ...data,
      periodStartDate: start,
      periodEndDate: end,
      periodFormatStyle: style,
      period: formatted,
    });
  };

  const effectiveVerificationUrl =
    data.studentUrl ||
    data.qrUrl ||
    buildVerificationUrl(data.folio, data.curp, data.studentName);

  useEffect(() => {
    QRCode.toDataURL(effectiveVerificationUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
      errorCorrectionLevel: data.qrErrorCorrection || 'M',
    })
      .then((url) => setQrEditorPreview(url))
      .catch((err) => console.error('Error generando QR para el editor', err));
  }, [effectiveVerificationUrl, data.qrErrorCorrection]);

  const handleCopyQrUrl = () => {
    navigator.clipboard.writeText(effectiveVerificationUrl);
    setQrCopied(true);
    setTimeout(() => setQrCopied(false), 2200);
  };

  const handleDownloadQrPng = () => {
    if (!qrEditorPreview) return;
    const a = document.createElement('a');
    a.href = qrEditorPreview;
    a.download = `QR_${data.folio || 'DGB'}_${data.studentName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFormatStyleChange = (style: PeriodFormatStyle) => {
    handlePeriodChange(currentStartDate, currentEndDate, style);
  };

  const handleIssueDateChange = (dateStr: string) => {
    const legal = generateLegalIssueDateText(dateStr);
    onChange({
      ...data,
      issueDate: dateStr,
      issueDay: legal.day,
      issueMonth: legal.monthNameUpper,
      issueYear: legal.year,
      customIssueDateText: legal.legalText,
    });
  };

  const handleUpdate = <K extends keyof CertificateData>(key: K, value: CertificateData[K]) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  const handleAddSubject = () => {
    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      name: 'NUEVA ASIGNATURA TÉCNICA',
      hours: 64,
      credits: 8,
      grade: 10.0,
    };
    handleUpdate('subjects', [...data.subjects, newSubject]);
  };

  const handleUpdateSubject = (index: number, field: keyof Subject, val: any) => {
    const updated = [...data.subjects];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    handleUpdate('subjects', updated);
  };

  const handleRemoveSubject = (index: number) => {
    const updated = data.subjects.filter((_, i) => i !== index);
    handleUpdate('subjects', updated);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 flex flex-col h-full shadow-lg">
      {/* ACCIONES PRINCIPALES DE DESCARGA E IMPRESIÓN */}
      <div className="flex flex-wrap items-center gap-2 pb-3 mb-3 border-b border-slate-800">
        <button
          onClick={onPrint}
          className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-500 text-white shadow transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Imprimir / PDF
        </button>

        <button
          onClick={onDownloadPdf}
          disabled={isDownloadingPdf}
          className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white shadow transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          {isDownloadingPdf ? 'Generando...' : 'Descargar .PDF'}
        </button>

        <button
          onClick={onRestoreDefaults}
          title="Restaurar al modelo de prueba oficial (Christian Ramírez)"
          className="p-2 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* SELECTOR DE LOS 5 MODELOS DE DISEÑO OFICIAL */}
      <div className="mb-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Modelos de Certificado (5 Opciones)
          </span>
          <div className="flex items-center gap-2">
            {onOpenVoting && (
              <button
                type="button"
                onClick={onOpenVoting}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-amber-950/60 border border-amber-600/50 px-2 py-0.5 rounded cursor-pointer"
              >
                🗳️ Votar
              </button>
            )}
            {onDownloadAllPdf && (
              <button
                type="button"
                onClick={onDownloadAllPdf}
                disabled={isDownloadingPdf}
                className="text-[10px] text-teal-400 hover:text-teal-300 font-semibold underline cursor-pointer"
              >
                Descargar 5 en PDF
              </button>
            )}
          </div>
        </div>

        {/* 5 BOTONES EN GRID ELEGANTE */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onSelectTemplate('dgb_tradicional')}
            className={`p-1.5 rounded-lg text-left border transition-all cursor-pointer ${
              selectedTemplate === 'dgb_tradicional'
                ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-xs ring-1 ring-teal-500/50 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] truncate">1. DGB Oficial</div>
            <div className="text-[8px] opacity-75 truncate">Tradicional PREFECO</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectTemplate('sep_centenario')}
            className={`p-1.5 rounded-lg text-left border transition-all cursor-pointer ${
              selectedTemplate === 'sep_centenario'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-xs ring-1 ring-emerald-500/50 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] truncate">2. SEP Centenario</div>
            <div className="text-[8px] opacity-75 truncate">Digital Guilloché</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectTemplate('solemne_gala')}
            className={`p-1.5 rounded-lg text-left border transition-all cursor-pointer ${
              selectedTemplate === 'solemne_gala'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-xs ring-1 ring-amber-500/50 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] truncate">3. Gala Solemne</div>
            <div className="text-[8px] opacity-75 truncate">Orla Dorada Honor</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectTemplate('acuerdo_286')}
            className={`p-1.5 rounded-lg text-left border transition-all cursor-pointer ${
              selectedTemplate === 'acuerdo_286'
                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-xs ring-1 ring-yellow-500/50 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] truncate">4. Acuerdo 286</div>
            <div className="text-[8px] opacity-75 truncate">Digital Federal (Img 1)</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectTemplate('prepa_abierta')}
            className={`p-1.5 rounded-lg text-left border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
              selectedTemplate === 'prepa_abierta'
                ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-xs ring-1 ring-blue-500/50 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] truncate">5. Prepa Abierta</div>
            <div className="text-[8px] opacity-75 truncate">Sello Oficial (Img 2)</div>
          </button>
        </div>

        {/* ACCIÓN RÁPIDA DE VERIFICACIÓN / COTEJO */}
        {onOpenVerify && (
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              QR de Verificación Activo
            </span>
            <button
              type="button"
              onClick={onOpenVerify}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
            >
              🔍 Probar Portal de Cotejo
            </button>
          </div>
        )}
      </div>

      {/* TABS DE SECCIONES */}
      <div className="flex rounded-lg bg-slate-950 p-1 mb-3 text-xs gap-1">
        <button
          onClick={() => setActiveTab('alumno')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'alumno'
              ? 'bg-slate-800 text-teal-400 font-semibold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Alumno
        </button>
        <button
          onClick={() => setActiveTab('institucion')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'institucion'
              ? 'bg-slate-800 text-teal-400 font-semibold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          Plantel
        </button>
        <button
          onClick={() => setActiveTab('materias')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'materias'
              ? 'bg-slate-800 text-teal-400 font-semibold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Materias ({data.subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('ajustes')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'ajustes'
              ? 'bg-slate-800 text-teal-400 font-semibold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          Ajustes
        </button>
        <button
          onClick={() => setActiveTab('qr')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'qr'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-semibold shadow-xs'
              : 'text-slate-400 hover:text-emerald-400'
          }`}
        >
          <QrCode className="w-3.5 h-3.5 text-emerald-400" />
          Código QR
        </button>
      </div>

      {/* CONTENIDO DEL FORMULARIO */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {/* TAB 1: DATOS DEL ALUMNO */}
        {activeTab === 'alumno' && (
          <div className="space-y-2.5">
            {/* CARGA RÁPIDA DE MODELOS DE MUESTRA */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5">
              <span className="block text-[10.5px] font-semibold text-slate-300">
                Cargar Modelos de Prueba Registrados:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onRestoreDefaults}
                  className="flex-1 py-1.5 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10.5px] text-teal-300 font-medium text-center cursor-pointer transition-colors"
                >
                  Muestra 1 (Christian R. 8.1)
                </button>
                {onLoadGenesisModel && (
                  <button
                    type="button"
                    onClick={onLoadGenesisModel}
                    className="flex-1 py-1.5 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10.5px] text-cyan-300 font-medium text-center cursor-pointer transition-colors"
                  >
                    Muestra 2 (Genesis V. 9.6)
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Nombre Completo del Alumno
              </label>
              <input
                type="text"
                value={data.studentName}
                onChange={(e) => handleUpdate('studentName', e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 uppercase font-semibold text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  CURP (18 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={18}
                  value={data.curp}
                  onChange={(e) => handleUpdate('curp', e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono text-xs uppercase focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  No. de Control
                </label>
                <input
                  type="text"
                  value={data.controlNumber}
                  onChange={(e) => handleUpdate('controlNumber', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Folio Oficial
                </label>
                <input
                  type="text"
                  value={data.folio}
                  onChange={(e) => handleUpdate('folio', e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-400 font-mono font-bold text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Especialidad / Capacitación
                </label>
                <input
                  type="text"
                  value={data.specialty}
                  onChange={(e) => handleUpdate('specialty', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-teal-300 font-medium text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* SELECTOR DE FECHAS EN VEZ DE INGRESAR EN TEXTO EL RANGO */}
            <div className="bg-slate-950 p-3 rounded-xl border border-teal-500/30 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-teal-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  Periodo Escolar (Selector de Fechas)
                </label>
                <button
                  type="button"
                  onClick={() => setShowManualPeriodText(!showManualPeriodText)}
                  className="text-[10px] text-teal-400 hover:text-teal-300 underline font-medium cursor-pointer"
                >
                  {showManualPeriodText ? '📅 Usar selector de fechas' : '✏️ Ajuste texto manual'}
                </button>
              </div>

              {!showManualPeriodText ? (
                <div className="space-y-2.5">
                  {/* SELECTORES DE FECHA INICIO Y FIN (INPUT DATE) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[10px] font-medium text-slate-400 mb-1">
                        Fecha de Inicio:
                      </span>
                      <input
                        type="date"
                        value={currentStartDate}
                        onChange={(e) =>
                          handlePeriodChange(e.target.value, currentEndDate, currentFormatStyle)
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-medium text-slate-400 mb-1">
                        Fecha de Término / Fin:
                      </span>
                      <input
                        type="date"
                        value={currentEndDate}
                        onChange={(e) =>
                          handlePeriodChange(currentStartDate, e.target.value, currentFormatStyle)
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* PRESETS RÁPIDOS DE CICLOS ESCOLARES / GENERACIONES */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider">
                        Generaciones Oficiales:
                      </span>
                      <span className="text-[9px] text-slate-500">Auto-llenar fechas</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {SCHOOL_CYCLE_PRESETS.map((preset) => {
                        const isSelected =
                          currentStartDate === preset.startDate && currentEndDate === preset.endDate;
                        return (
                          <button
                            key={preset.cycle}
                            type="button"
                            onClick={() =>
                              handlePeriodChange(preset.startDate, preset.endDate, currentFormatStyle)
                            }
                            className={`py-1 px-1.5 rounded text-[10px] font-mono font-medium transition-all cursor-pointer text-center truncate ${
                              isSelected
                                ? 'bg-teal-600 text-white font-bold ring-1 ring-teal-400 shadow-xs'
                                : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300'
                            }`}
                            title={`${preset.label} (${preset.startDate} al ${preset.endDate})`}
                          >
                            {preset.cycle}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* FORMATO DEL TEXTO EN CERTIFICADO */}
                  <div>
                    <span className="block text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Formato de Redacción en Certificado:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => handleFormatStyleChange('full_legal')}
                        className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                          currentFormatStyle === 'full_legal'
                            ? 'bg-teal-500/20 border-teal-500 text-teal-200 font-semibold ring-1 ring-teal-500/40'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>🏛️ Legal SEP Formal</span>
                          {currentFormatStyle === 'full_legal' && <Check className="w-3 h-3 text-teal-400" />}
                        </div>
                        <div className="text-[8px] opacity-75 truncate">24 de agosto de 2015 al...</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFormatStyleChange('full_legal_upper')}
                        className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                          currentFormatStyle === 'full_legal_upper'
                            ? 'bg-teal-500/20 border-teal-500 text-teal-200 font-semibold ring-1 ring-teal-500/40'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>🔠 Legal MAYÚSCULAS</span>
                          {currentFormatStyle === 'full_legal_upper' && <Check className="w-3 h-3 text-teal-400" />}
                        </div>
                        <div className="text-[8px] opacity-75 truncate">24 DE AGOSTO DE 2015 AL...</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFormatStyleChange('month_year')}
                        className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                          currentFormatStyle === 'month_year'
                            ? 'bg-teal-500/20 border-teal-500 text-teal-200 font-semibold ring-1 ring-teal-500/40'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>📅 Mensual Oficial</span>
                          {currentFormatStyle === 'month_year' && <Check className="w-3 h-3 text-teal-400" />}
                        </div>
                        <div className="text-[8px] opacity-75 truncate">Agosto de 2015 a Junio de 2018</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFormatStyleChange('years_only')}
                        className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                          currentFormatStyle === 'years_only'
                            ? 'bg-teal-500/20 border-teal-500 text-teal-200 font-semibold ring-1 ring-teal-500/40'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>🎓 Solo Ciclo Años</span>
                          {currentFormatStyle === 'years_only' && <Check className="w-3 h-3 text-teal-400" />}
                        </div>
                        <div className="text-[8px] opacity-75 truncate">2015 - 2018</div>
                      </button>
                    </div>
                  </div>

                  {/* VISTA PREVIA DEL TEXTO RESULTANTE EN TIEMPO REAL */}
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-teal-500/20 text-[10.5px]">
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wide font-medium">
                      📌 Texto reflejado en el certificado:
                    </span>
                    <span className="text-teal-300 font-medium block mt-0.5">
                      "{data.period}"
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={data.period}
                    onChange={(e) => handleUpdate('period', e.target.value)}
                    placeholder="24 de agosto de 2015 al 25 de junio de 2018"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Modo manual: ingresa el texto del periodo escolar con el formato que desees.
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Créditos Acreditados
                </label>
                <input
                  type="number"
                  value={data.totalCredits}
                  onChange={(e) => handleUpdate('totalCredits', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Total de Créditos Plan
                </label>
                <input
                  type="number"
                  value={data.maxCredits}
                  onChange={(e) => handleUpdate('maxCredits', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {onCreateTaskForStudent && (
              <button
                type="button"
                onClick={() => onCreateTaskForStudent(data.studentName, data.folio)}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                Crear Tarea de Trámite para este Alumno
              </button>
            )}
          </div>
        )}

        {/* TAB 2: DATOS DE LA INSTITUCIÓN */}
        {activeTab === 'institucion' && (
          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Nombre de la Preparatoria / Plantel
              </label>
              <input
                type="text"
                value={data.schoolName}
                onChange={(e) => handleUpdate('schoolName', e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-medium text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Clave de C.C.T.
                </label>
                <input
                  type="text"
                  value={data.cct}
                  onChange={(e) => handleUpdate('cct', e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono text-xs uppercase focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Ubicación (Municipio, Estado)
                </label>
                <input
                  type="text"
                  value={data.schoolLocation}
                  onChange={(e) => handleUpdate('schoolLocation', e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 uppercase text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Director del Plantel
                </label>
                <input
                  type="text"
                  value={data.directorName}
                  onChange={(e) => handleUpdate('directorName', e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 uppercase text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Cargo Institucional
                </label>
                <input
                  type="text"
                  value={data.directorTitle}
                  onChange={(e) => handleUpdate('directorTitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* SELECTOR DE FECHA DE EMISIÓN */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2">
              <label className="text-[11px] font-semibold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-teal-300">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  Fecha Oficial de Emisión (Selector)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {data.issueDay} de {data.issueMonth} de {data.issueYear}
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="block text-[10px] font-medium text-slate-400 mb-1">
                    Seleccionar Fecha en Calendario:
                  </span>
                  <input
                    type="date"
                    value={currentIssueDate}
                    onChange={(e) => handleIssueDateChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="block text-[10px] font-medium text-slate-400 mb-1">
                    Atajos Rápidos:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleIssueDateChange('2018-07-13')}
                      className="flex-1 py-1 px-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-mono transition-colors cursor-pointer"
                    >
                      13 Jul 2018
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        const pad = (n: number) => n.toString().padStart(2, '0');
                        const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
                        handleIssueDateChange(todayIso);
                      }}
                      className="flex-1 py-1 px-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-[10px] text-teal-300 font-mono font-medium transition-colors cursor-pointer"
                    >
                      Hoy
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">
                  Texto Legal Generado para Pie Institucional:
                </label>
                <textarea
                  rows={2}
                  value={data.customIssueDateText || ''}
                  onChange={(e) => handleUpdate('customIssueDateText', e.target.value.toUpperCase())}
                  placeholder="A LOS TRECE DÍAS DEL MES DE JULIO DE DOS MIL DIECIOCHO."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 uppercase text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MATERIAS */}
        {activeTab === 'materias' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] text-slate-400 font-medium">
                Asignaturas de Formación Básica
              </span>
              <button
                type="button"
                onClick={handleAddSubject}
                className="px-2 py-1 bg-teal-600/30 text-teal-300 hover:bg-teal-600/40 border border-teal-500/40 rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                Agregar Asignatura
              </button>
            </div>

            <div className="space-y-2">
              {data.subjects.map((sub, idx) => (
                <div
                  key={sub.id || idx}
                  className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) =>
                        handleUpdateSubject(idx, 'name', e.target.value.toUpperCase())
                      }
                      placeholder="Nombre de la materia"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-100 uppercase focus:border-teal-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                      title="Eliminar materia"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Calificación:</span>
                      <input
                        type="number"
                        step="0.1"
                        min="5"
                        max="10"
                        value={sub.grade}
                        onChange={(e) =>
                          handleUpdateSubject(idx, 'grade', parseFloat(e.target.value) || 0)
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-400 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Total de Horas:</span>
                      <input
                        type="number"
                        min="1"
                        value={sub.hours}
                        onChange={(e) =>
                          handleUpdateSubject(idx, 'hours', parseInt(e.target.value) || 0)
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Créditos:</span>
                      <input
                        type="number"
                        min="1"
                        value={sub.credits}
                        onChange={(e) =>
                          handleUpdateSubject(idx, 'credits', parseInt(e.target.value) || 0)
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AJUSTES Y PROMEDIO OFICIAL */}
        {activeTab === 'ajustes' && (
          <div className="space-y-3">
            {/* Promedio General */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <label className="block text-[11px] font-semibold text-slate-200">
                Promedio de Aprovechamiento Oficial
              </label>
              <p className="text-[10.5px] text-slate-400 leading-relaxed">
                En el modelo DGB oficial el promedio general de bachillerato es independiente
                del promedio específico de las materias del componente laboral (en el modelo de prueba es{' '}
                <strong className="text-teal-300">8.1 / OCHO PUNTO UNO</strong>).
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={generalGpaOverride}
                  onChange={(e) => setGeneralGpaOverride(e.target.value)}
                  placeholder="8.1"
                  className="w-24 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-amber-400 font-mono font-bold text-center text-xs"
                />
                <button
                  type="button"
                  onClick={() => setGeneralGpaOverride('8.1')}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] cursor-pointer"
                >
                  Restablecer a 8.1
                </button>
              </div>
            </div>

            {/* Opciones de Firma y Sello */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2.5">
              <label className="block text-[11px] font-semibold text-slate-200">
                Elementos Gráficos Oficiales
              </label>

              <label className="flex items-center justify-between text-[11px] text-slate-300 cursor-pointer">
                <span>Mostrar Firma Digital de Dirección</span>
                <input
                  type="checkbox"
                  checked={data.showSignature}
                  onChange={(e) => handleUpdate('showSignature', e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between text-[11px] text-slate-300 cursor-pointer">
                <span>Mostrar Sello Oficial del Plantel</span>
                <input
                  type="checkbox"
                  checked={data.showStamp}
                  onChange={(e) => handleUpdate('showStamp', e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              {/* OPCIONES DE MARCA DE AGUA DEL ÁGUILA */}
              <div className="pt-1 border-t border-slate-800/80 space-y-2">
                <label className="flex items-center justify-between text-[11px] text-slate-300 cursor-pointer">
                  <span className="font-medium text-teal-300 flex items-center gap-1.5">
                    🦅 Marca de Agua del Águila de Fondo
                  </span>
                  <input
                    type="checkbox"
                    checked={data.showWatermark !== false}
                    onChange={(e) => handleUpdate('showWatermark', e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                </label>

                {data.showWatermark !== false && (
                  <div className="space-y-1.5">
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1">
                        Estilo de Imagen de Fondo / Encabezado:
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdate('watermarkType', 'seek_vector')}
                          className={`py-1.5 px-1 rounded text-[9.5px] border cursor-pointer ${
                            (data.watermarkType || 'seek_vector') === 'seek_vector'
                              ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                          title="Sello Oficial grabado con leyenda ESTADOS UNIDOS MEXICANOS"
                        >
                          Sello Oficial (Img 2)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdate('watermarkType', 'color_emblem')}
                          className={`py-1.5 px-1 rounded text-[9.5px] border cursor-pointer ${
                            data.watermarkType === 'color_emblem'
                              ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                          title="Escudo Nacional Patrio a todo color"
                        >
                          A Color (Img 1)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdate('watermarkType', 'golden')}
                          className={`py-1.5 px-1 rounded text-[9.5px] border cursor-pointer ${
                            data.watermarkType === 'golden'
                              ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                          title="Águila Real en Oro metálico"
                        >
                          Oro Metálico
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1">
                        Intensidad de la Marca de Agua:
                      </span>
                      <div className="flex gap-1.5">
                        {[0.06, 0.09, 0.14, 0.20].map((op) => (
                          <button
                            key={op}
                            type="button"
                            onClick={() => handleUpdate('watermarkOpacity', op)}
                            className={`flex-1 py-1 rounded text-[10px] font-mono border cursor-pointer ${
                              (data.watermarkOpacity ?? 0.09) === op
                                ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            {Math.round(op * 100)}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* OPCIONES DE MARCO DE BORDES VERDES Y DORADOS */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <label className="flex items-center justify-between text-[11px] text-slate-300 cursor-pointer">
                  <span className="font-medium text-emerald-400 flex items-center gap-1.5">
                    🏛️ Marco Perimetral Verde y Dorado
                  </span>
                  <input
                    type="checkbox"
                    checked={data.showGreenGoldBorder !== false}
                    onChange={(e) => handleUpdate('showGreenGoldBorder', e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                </label>

                {data.showGreenGoldBorder !== false && (
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdate('borderStyle', 'green_gold')}
                      className={`flex-1 py-1 rounded text-[10px] border cursor-pointer ${
                        (data.borderStyle || 'green_gold') === 'green_gold'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Verde y Dorado Oficial
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdate('borderStyle', 'minimal')}
                      className={`flex-1 py-1 rounded text-[10px] border cursor-pointer ${
                        data.borderStyle === 'minimal'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Verde Clásico
                    </button>
                  </div>
                )}
              </div>

              <div>
                <span className="block text-[10.5px] text-slate-400 mb-1">
                  Color de Tinta de Firma:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate('signatureColor', 'darkblue')}
                    className={`flex-1 py-1 px-2 rounded text-[10.5px] border cursor-pointer ${
                      data.signatureColor === 'darkblue'
                        ? 'bg-blue-950/60 border-blue-500 text-blue-300 font-semibold'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Azul Real (Bolígrafo)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdate('signatureColor', 'black')}
                    className={`flex-1 py-1 px-2 rounded text-[10.5px] border cursor-pointer ${
                      data.signatureColor === 'black'
                        ? 'bg-slate-800 border-slate-500 text-white font-semibold'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Tinta Negra
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GENERADOR Y COTEJO QR DINÁMICO */}
        {activeTab === 'qr' && (
          <div className="space-y-3.5">
            {/* VISTA PREVIA DEL QR DINÁMICO */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center flex flex-col items-center">
              <div className="text-[11px] font-semibold text-emerald-400 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                Código QR Dinámico en Tiempo Real
              </div>

              <div className="p-2.5 bg-white rounded-xl shadow-md border border-slate-300 inline-block">
                {qrEditorPreview ? (
                  <img
                    src={qrEditorPreview}
                    alt="QR Preview"
                    className="w-36 h-36 object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                    Generando QR...
                  </div>
                )}
                <div className="mt-1 text-[7.5px] font-mono text-slate-600 font-bold uppercase tracking-tight">
                  {data.folio} • {data.studentName.split(' ')[0]}
                </div>
              </div>

              {/* ACCIONES RÁPIDAS DEL QR */}
              <div className="mt-3 flex flex-wrap gap-2 justify-center w-full">
                <button
                  type="button"
                  onClick={handleDownloadQrPng}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-teal-400" />
                  Descargar PNG
                </button>

                {onOpenVerify && (
                  <button
                    type="button"
                    onClick={onOpenVerify}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Probar Validación
                  </button>
                )}
              </div>
            </div>

            {/* METADATOS Y URL CODIFICADA */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300">
                  URL Dinámica Codificada en el QR:
                </span>
                <button
                  type="button"
                  onClick={handleCopyQrUrl}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-medium"
                >
                  {qrCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {qrCopied ? '¡Copiado!' : 'Copiar URL'}
                </button>
              </div>

              <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono text-[10px] text-slate-300 break-all leading-normal select-all">
                {effectiveVerificationUrl}
              </div>

              <div className="text-[10px] text-slate-400 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span>Folio codificado:</span>
                  <span className="font-mono font-bold text-amber-300">{data.folio}</span>
                </div>
                <div className="flex justify-between">
                  <span>Alumno codificado:</span>
                  <span className="font-semibold text-slate-200">{data.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span>CURP vinculada:</span>
                  <span className="font-mono text-slate-300">{data.curp}</span>
                </div>
              </div>
            </div>

            {/* URL DE CONSULTA DEL ESTUDIANTE PERSONALIZADA */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold text-slate-200">
                  URL del Expediente / Portal del Alumno:
                </label>
                {data.studentUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdate('studentUrl', undefined);
                      handleUpdate('qrUrl', undefined);
                    }}
                    className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Restablecer automática
                  </button>
                )}
              </div>
              <input
                type="url"
                value={data.studentUrl || ''}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  handleUpdate('studentUrl', val || undefined);
                  handleUpdate('qrUrl', val || undefined);
                }}
                placeholder="Por defecto genera la URL oficial de validación SEP-DGB"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-teal-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Si tu plantel dispone de un enlace directo al expediente o sistema de control escolar (ej.{' '}
                <span className="font-mono text-slate-300">https://mi-plantel.edu.mx/alumnos/{data.controlNumber}</span>), escríbelo aquí para que el QR dirija al portal.
              </p>
            </div>

            {/* NIVEL DE CORRECCIÓN DE ERROR */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <label className="block text-[11px] font-semibold text-slate-200">
                Nivel de Corrección de Error del QR (ECC)
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-mono font-bold">
                {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleUpdate('qrErrorCorrection', lvl)}
                    className={`py-1.5 rounded border cursor-pointer transition-colors ${
                      (data.qrErrorCorrection || 'M') === lvl
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400">
                M (15% recuperación estándar para certificados impresos) o Q (25% recomendado para credenciales).
              </p>
            </div>

            {/* BOTÓN GESTOR COMPLETO */}
            {onOpenQRManager && (
              <button
                type="button"
                onClick={onOpenQRManager}
                className="w-full py-2 px-3 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-emerald-300" />
                Abrir Centro Avanzado de Códigos QR
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
