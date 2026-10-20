import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { CertificateData } from '../types/certificate';
import { buildVerificationUrl } from '../utils/verificationHelper';
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Download,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface DynamicQRManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateData;
  onChange: (updated: CertificateData) => void;
  onOpenVerify: () => void;
}

export const DynamicQRManagerModal: React.FC<DynamicQRManagerModalProps> = ({
  isOpen,
  onClose,
  data,
  onChange,
  onOpenVerify,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [customInputUrl, setCustomInputUrl] = useState<string>(data.studentUrl || '');
  const [qrHighResUrl, setQrHighResUrl] = useState<string>('');
  const [selectedCorrection, setSelectedCorrection] = useState<'L' | 'M' | 'Q' | 'H'>(
    data.qrErrorCorrection || 'M'
  );
  const [qrColor, setQrColor] = useState<string>('#1e293b');

  // URL dinámica oficial generada por defecto
  const canonicalUrl = buildVerificationUrl(data.folio, data.curp, data.studentName);
  const effectiveUrl = data.studentUrl || data.qrUrl || canonicalUrl;

  useEffect(() => {
    setCustomInputUrl(data.studentUrl || '');
  }, [data.studentUrl]);

  // Generar QR de alta definición para el visor
  useEffect(() => {
    QRCode.toDataURL(effectiveUrl, {
      width: 480,
      margin: 1.5,
      color: {
        dark: qrColor,
        light: '#ffffff',
      },
      errorCorrectionLevel: selectedCorrection,
    })
      .then((url) => setQrHighResUrl(url))
      .catch((err) => console.error('Error generando QR de alta resolución', err));
  }, [effectiveUrl, selectedCorrection, qrColor]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(effectiveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleApplyCustomUrl = (urlToSet: string) => {
    onChange({
      ...data,
      studentUrl: urlToSet.trim() ? urlToSet.trim() : undefined,
      qrUrl: urlToSet.trim() ? urlToSet.trim() : undefined,
    });
  };

  const handleResetToCanonical = () => {
    setCustomInputUrl('');
    onChange({
      ...data,
      studentUrl: undefined,
      qrUrl: undefined,
    });
  };

  const handleDownloadQrImage = () => {
    if (!qrHighResUrl) return;
    const a = document.createElement('a');
    a.href = qrHighResUrl;
    a.download = `QR_Autenticidad_${data.folio || 'DGB'}_${data.studentName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCorrectionChange = (lvl: 'L' | 'M' | 'Q' | 'H') => {
    setSelectedCorrection(lvl);
    onChange({
      ...data,
      qrErrorCorrection: lvl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* CABECERA */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 px-6 py-4 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Módulo Oficial de Certificación Electrónica
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Generador de Código QR Dinámico
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* BANNER INFORMATIVO */}
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-emerald-300">Autenticidad en Tiempo Real:</strong> Este generador codifica dinámicamente el <strong className="text-white">Folio Oficial ({data.folio})</strong> y la <strong className="text-white">URL de validación del alumno</strong>. Cualquier teléfono móvil o lector de códigos que apunte al QR desplegado al pie de cualquiera de los 5 modelos abrirá instantáneamente la validación oficial con sello de tiempo.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* VISTA PREVIA DEL CÓDIGO QR */}
            <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center text-center">
              <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                Vista Previa del QR en Alta Resolución
              </div>

              <div className="relative p-2.5 bg-white rounded-xl shadow-lg border-2 border-slate-700/60 inline-block">
                {qrHighResUrl ? (
                  <img
                    src={qrHighResUrl}
                    alt="Código QR dinámico"
                    className="w-48 h-48 object-contain rounded"
                  />
                ) : (
                  <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                    Generando QR...
                  </div>
                )}
                <div className="mt-1 text-[8px] font-mono text-slate-500 uppercase tracking-tighter">
                  FOLIO: {data.folio} • DGB-SEP
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 justify-center w-full">
                <button
                  type="button"
                  onClick={handleDownloadQrImage}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Descargado
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Descargar PNG
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenVerify();
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  Simular Escaneo
                </button>
              </div>
            </div>

            {/* CONFIGURACIÓN Y METADATOS CODIFICADOS */}
            <div className="md:col-span-7 space-y-4 text-xs">
              {/* METADATOS CODIFICADOS */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Metadatos Vinculados en el QR
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Folio Oficial:</span>
                    <span className="font-mono font-bold text-amber-300">{data.folio}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CURP del Estudiante:</span>
                    <span className="font-mono font-bold text-slate-200">{data.curp}</span>
                  </div>
                  <div className="col-span-2 bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Alumno Acreditado:</span>
                    <span className="font-semibold text-slate-200">{data.studentName}</span>
                  </div>
                </div>
              </div>

              {/* URL CODIFICADA Y BOTÓN COPIAR */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">
                    URL Oficial Codificada en el QR:
                  </label>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copiar Enlace
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[10.5px] text-slate-300 break-all leading-relaxed select-all">
                  {effectiveUrl}
                </div>
              </div>

              {/* PERSONALIZACIÓN DE URL DE VERIFICACIÓN (OPCIONAL) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-teal-400" />
                    Personalizar URL de Verificación del Alumno:
                  </label>
                  {data.studentUrl && (
                    <button
                      type="button"
                      onClick={handleResetToCanonical}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      Restablecer dinámica
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customInputUrl}
                    onChange={(e) => setCustomInputUrl(e.target.value)}
                    placeholder={canonicalUrl}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono text-[11px] focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCustomUrl(customInputUrl)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Guardar
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Puedes ingresar una URL de tu propio portal escolar (ej.{' '}
                  <span className="font-mono text-slate-300">https://colegio.edu.mx/alumnos/{data.controlNumber}</span>) o dejar la URL dinámica estándar de autenticación directa SEP-DGB.
                </p>
              </div>

              {/* OPCIONES TÉCNICAS: CORRECCIÓN DE ERROR Y COLOR */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="block text-[10px] font-medium text-slate-400 mb-1.5">
                    Nivel Corrección de Error (ECC):
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleCorrectionChange(lvl)}
                        className={`py-1 rounded text-center text-xs font-mono font-bold border cursor-pointer transition-colors ${
                          selectedCorrection === lvl
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                        title={
                          lvl === 'L'
                            ? 'L (7% recuperación)'
                            : lvl === 'M'
                            ? 'M (15% recuperación estándar)'
                            : lvl === 'Q'
                            ? 'Q (25% alta fidelidad)'
                            : 'H (30% máxima resistencia a daños)'
                        }
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="block text-[10px] font-medium text-slate-400 mb-1.5">
                    Color del Trazado QR:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[
                      { col: '#1e293b', label: 'Grafito' },
                      { col: '#000000', label: 'Negro' },
                      { col: '#0c3823', label: 'Verde SEP' },
                      { col: '#0f2b48', label: 'Azul DGB' },
                    ].map((item) => (
                      <button
                        key={item.col}
                        type="button"
                        onClick={() => setQrColor(item.col)}
                        style={{ backgroundColor: item.col }}
                        className={`flex-1 h-7 rounded border cursor-pointer transition-transform ${
                          qrColor === item.col
                            ? 'ring-2 ring-emerald-400 scale-105 border-white'
                            : 'border-slate-700 opacity-80 hover:opacity-100'
                        }`}
                        title={item.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PIE DE ACCIONES */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-3 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vinculado activamente al pie de los 5 modelos de certificados</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Listo / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
