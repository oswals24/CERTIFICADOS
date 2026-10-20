import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CertificateData } from '../types/certificate';
import { gradeToWords } from '../utils/numberToWords';
import { GuillocheSecurityBorder } from './GuillocheSecurityBorder';
import { OfficialMexicanColorEmblem } from './OfficialMexicanColorEmblem';
import { DynamicCertificateQR } from './DynamicCertificateQR';
import { buildVerificationUrl, getVerificationRecord } from '../utils/verificationHelper';

interface Props {
  data: CertificateData;
  scale?: number;
  id?: string;
  generalGpaOverride?: string;
  onOpenVerify?: () => void;
}

const PREPA_ABIERTA_MODULES = [
  { id: 'I', name: 'De la información al conocimiento', defaultGrade: 9.0, hours: 140, credits: 26 },
  { id: 'II', name: 'El lenguaje en la relación del hombre con el mundo', defaultGrade: 8.5, hours: 140, credits: 26 },
  { id: 'III', name: 'Textos y visiones del mundo', defaultGrade: 9.2, hours: 140, credits: 26 },
  { id: 'IV', name: 'Argumentación y expresión', defaultGrade: 8.8, hours: 140, credits: 26 },
  { id: 'V', name: 'Representaciones simbólicas y algoritmos', defaultGrade: 7.5, hours: 140, credits: 26 },
  { id: 'VI', name: 'Matemáticas y representaciones del sistema natural', defaultGrade: 8.0, hours: 140, credits: 26 },
  { id: 'VII', name: 'Sociedad mexicana contemporánea y mundo', defaultGrade: 9.5, hours: 140, credits: 26 },
  { id: 'VIII', name: 'Optimización en sistemas naturales y sociales', defaultGrade: 8.9, hours: 140, credits: 26 },
];

export const PrepaAbiertaCertificate: React.FC<Props> = ({
  data,
  scale = 1,
  id = 'certificate-render-target',
  generalGpaOverride,
  onOpenVerify,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const record = getVerificationRecord(data);
  const verifyUrl = buildVerificationUrl(data.folio);

  const calculatedGpa = React.useMemo(() => {
    if (generalGpaOverride && generalGpaOverride.trim() !== '') {
      return generalGpaOverride;
    }
    return record.average.toFixed(1);
  }, [generalGpaOverride, record.average]);

  const avgNum = parseFloat(calculatedGpa) || 8.1;
  const avgText = gradeToWords(calculatedGpa).toUpperCase();

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generando QR:', err));
  }, [verifyUrl]);

  const modules = React.useMemo(() => {
    return PREPA_ABIERTA_MODULES.map((m, idx) => {
      let grade = m.defaultGrade;
      if (data.subjects && data.subjects[idx]) {
        grade = data.subjects[idx].grade;
      } else {
        const diff = avgNum - 8.6;
        grade = Math.max(6.0, Math.min(10.0, Math.round((m.defaultGrade + diff * 0.7) * 10) / 10));
      }
      return {
        ...m,
        grade,
      };
    });
  }, [data.subjects, avgNum]);

  return (
    <div
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
      className="print-wrapper"
    >
      <div
        id={id}
        className="certificate-page relative bg-[#fdfbf7] shadow-2xl mx-auto overflow-hidden print:shadow-none select-text"
        style={{
          width: '215.9mm',
          height: '279.4mm',
          minWidth: '215.9mm',
          minHeight: '279.4mm',
          maxWidth: '215.9mm',
          maxHeight: '279.4mm',
          boxSizing: 'border-box',
          padding: '0',
          backgroundColor: '#fdfbf7',
          color: '#000000',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* MARCO PERIMETRAL GUILLOCHÉ VERDE ESMERALDA CON REMATE PRECOLOMBINO */}
        <GuillocheSecurityBorder backgroundColor="#fdfbf7" />

        {/* MARCA DE AGUA INSTITUCIONAL DE FONDO */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div style={{ opacity: 0.08 }} className="w-[125mm] h-[125mm] flex items-center justify-center">
            <OfficialMexicanColorEmblem className="w-full h-full object-contain" />
          </div>
        </div>

        {/* CONTENIDO INTERNO */}
        <div className="relative z-10 h-full flex flex-col justify-between px-[13mm] pt-[11mm] pb-[9mm]">
          {/* ENCABEZADO */}
          <div>
            {/* LOGOTIPOS SEP + PREPARATORIA ABIERTA */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 flex items-center justify-center">
                  <OfficialMexicanColorEmblem className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-[14px] font-black text-[#691c32] tracking-wider uppercase font-serif leading-none">
                    SEP
                  </div>
                  <div className="text-[6.2px] font-semibold text-slate-500 uppercase tracking-wider">
                    SECRETARÍA DE EDUCACIÓN PÚBLICA
                  </div>
                </div>
              </div>

              <div className="h-6 w-[1px] bg-slate-300" />

              <div className="flex items-center gap-1.5 text-right">
                <div>
                  <div className="text-[11px] font-black text-[#1b4332] uppercase tracking-wide leading-none">
                    PREPARATORIA ABIERTA
                  </div>
                  <div className="text-[6.2px] text-slate-500 uppercase tracking-wider">
                    DIRECCIÓN GENERAL DEL BACHILLERATO
                  </div>
                </div>
              </div>
            </div>

            {/* TÍTULOS DE GOBIERNO */}
            <div className="text-center space-y-0.5">
              <h1 className="text-[11.5px] font-black tracking-widest uppercase text-slate-900 font-sans">
                SISTEMA EDUCATIVO NACIONAL
              </h1>
              <p className="text-[7.8px] font-semibold uppercase text-slate-700 tracking-wide">
                SUBSECRETARÍA DE EDUCACIÓN MEDIA SUPERIOR
              </p>
              <p className="text-[7.8px] font-semibold uppercase text-slate-700 tracking-wide">
                DIRECCIÓN GENERAL DEL BACHILLERATO
              </p>
              <p className="text-[7.2px] font-medium uppercase text-slate-600">
                PREPARATORIA ABIERTA • CERTIFICACIÓN OFICIAL
              </p>
            </div>
          </div>

          {/* SECCIÓN DE DATOS DEL ESTUDIANTE */}
          <div className="space-y-2 my-auto">
            <div className="text-[8.5px] font-semibold text-slate-800">
              Se expide a:
            </div>

            {/* NOMBRE DEL EGRESADO */}
            <div className="text-center pb-0.5">
              <div className="text-[14px] font-black tracking-wider text-slate-900 font-serif uppercase">
                {data.studentName}
              </div>
              <div className="text-[6.5px] text-slate-500 uppercase mt-0.5">
                Nombre(s) Primer apellido Segundo apellido
              </div>
            </div>

            {/* CURP Y MATRÍCULA EN LÍNEA */}
            <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-200 pt-1 pb-1">
              <div>
                <div className="text-[9.5px] font-bold font-mono text-slate-800">
                  {data.curp}
                </div>
                <div className="text-[6px] text-slate-500 uppercase mt-0.5">
                  CURP
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider">
                  Datos del estudiante
                </span>
              </div>
              <div>
                <div className="text-[9.5px] font-bold font-mono text-slate-800">
                  {data.controlNumber}
                </div>
                <div className="text-[6px] text-slate-500 uppercase mt-0.5">
                  Número de control o matrícula
                </div>
              </div>
            </div>

            {/* BANNER DORADO: DATOS DEL PLANTEL */}
            <div>
              <div className="bg-[#b38e5d] text-white text-[7.8px] font-bold py-0.5 px-3 rounded-xs uppercase tracking-wider text-center">
                Datos del plantel o servicio educativo e información
              </div>

              <div className="text-center pt-1.5 pb-0.5">
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  {data.schoolName}
                </div>
                <div className="text-[6px] text-slate-500 uppercase">
                  Tipo, nombre y/o número de plantel • {data.schoolLocation}
                </div>
              </div>

              {/* CCT Y ACUERDO */}
              <div className="grid grid-cols-2 gap-2 text-center border-t border-slate-200 py-1 text-[8px]">
                <div>
                  <span className="font-bold text-slate-900 font-mono">{data.cct}</span>
                  <div className="text-[6px] text-slate-500 uppercase">Clave de Centro de Trabajo</div>
                </div>
                <div>
                  <span className="font-bold text-slate-900">ACUERDO SECRETARIAL NÚMERO 71</span>
                  <div className="text-[6px] text-slate-500 uppercase">
                    Reconocimiento de Validez Oficial de Estudios
                  </div>
                </div>
              </div>

              {/* FORMACIÓN Y PERIODO */}
              <div className="grid grid-cols-2 gap-2 text-center border-t border-slate-200 py-1 text-[8px]">
                <div>
                  <span className="font-bold text-slate-900">BACHILLERATO INTENSIVO GENERAL</span>
                  <div className="text-[6px] text-slate-500 uppercase">Plan y/o formación educativa ({data.specialty})</div>
                </div>
                <div>
                  <span className="font-medium text-slate-800">{data.period}</span>
                  <div className="text-[6px] text-slate-500 uppercase">Período de acreditación</div>
                </div>
              </div>

              {/* 3 MÉTRICAS: CRÉDITOS Y PROMEDIO */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 border border-slate-200 py-1.5 rounded-xs mt-1">
                <div>
                  <div className="text-[10px] font-bold font-mono text-slate-800">
                    {data.totalCredits || 344}
                  </div>
                  <div className="text-[6px] text-slate-500 uppercase">Créditos obtenidos</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold font-mono text-slate-800">
                    {data.maxCredits || 344}
                  </div>
                  <div className="text-[6px] text-slate-500 uppercase">Total créditos</div>
                </div>
                <div>
                  <div className="text-[10.5px] font-black text-[#1b4332] font-mono">
                    {avgNum.toFixed(1)} <span className="text-[7.5px] font-sans font-bold text-slate-800">{avgText}</span>
                  </div>
                  <div className="text-[6px] text-slate-500 uppercase">Promedio de aprovechamiento</div>
                </div>
              </div>
            </div>

            {/* TABLA DE MÓDULOS DE FORMACIÓN */}
            <div className="border border-slate-200 rounded-xs overflow-hidden mt-1 bg-white">
              <div className="bg-slate-100 px-2 py-0.5 text-[6.5px] font-bold text-slate-700 uppercase flex justify-between">
                <span>Módulos acreditados de formación para el trabajo</span>
                <span>CALIF. | HORAS | CRÉDITOS</span>
              </div>
              <div className="divide-y divide-slate-100 text-[6.5px]">
                {modules.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between px-2 py-[1.5px]">
                    <div className="flex items-center gap-1.5 flex-1 pr-2 truncate">
                      <span className="font-bold text-slate-500 font-serif w-4 shrink-0">
                        {sub.id}
                      </span>
                      <span className="text-slate-800 uppercase font-medium truncate">
                        {sub.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-center font-mono shrink-0">
                      <span className="font-bold text-slate-900 w-5">{sub.grade.toFixed(1)}</span>
                      <span className="text-slate-600 w-6">{sub.hours}</span>
                      <span className="text-slate-600 w-6">{sub.credits}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PIE DE SEGURIDAD: SELLO DIGITAL + FIRMA + SELLO CIRCULAR SEP */}
          <div className="space-y-1 pt-1 border-t border-slate-200">
            <div className="flex items-end justify-between gap-3">
              {/* SELLOS DIGITALES CRIPTOGRÁFICOS */}
              <div className="flex-1 text-[5.8px] text-slate-600 font-mono space-y-0.5">
                <div>
                  <span className="font-bold">Autoridad educativa: </span>
                  {data.directorName} - {data.directorTitle}
                </div>
                <div>
                  <span className="font-bold">No. certificado: </span>
                  {record.authorityCertificateNo}
                </div>
                <div>
                  <span className="font-bold">Sello digital autoridad educativa: </span>
                  <span className="break-all text-slate-500">{record.digitalSealAuthority.substring(0, 110)}...</span>
                </div>
                <div>
                  <span className="font-bold">Fecha y hora de timbrado: </span>
                  {record.timestamp}
                </div>
                <div>
                  <span className="font-bold">Sello digital SEP: </span>
                  <span className="break-all text-slate-500">{record.digitalSealSep.substring(0, 110)}...</span>
                </div>
              </div>

              {/* SELLO OFICIAL CIRCULAR DE GOBIERNO DE MÉXICO + FIRMA */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center text-center px-1">
                {/* SELLO CIRCULAR SEP */}
                <div className="relative w-14 h-14 rounded-full border-2 border-black flex flex-col items-center justify-center p-0.5 text-black bg-white">
                  <div className="absolute inset-0.5 rounded-full border border-dashed border-black/60 pointer-events-none" />
                  <div className="text-[4px] font-bold uppercase tracking-tight leading-none text-center">
                    ESTADOS UNIDOS MEXICANOS
                  </div>
                  <div className="w-5 h-5 my-0.5 flex items-center justify-center">
                    <OfficialMexicanColorEmblem className="w-full h-full object-contain grayscale" />
                  </div>
                  <div className="text-[4px] font-bold uppercase tracking-tight leading-none text-center">
                    SECRETARÍA DE EDUCACIÓN PÚBLICA
                  </div>
                </div>

                {/* RÚBRICA Y NOMBRE */}
                <div className="mt-0.5 text-center">
                  <svg className="w-20 h-5 text-slate-800" viewBox="0 0 100 25" fill="none">
                    <path
                      d="M 10 18 Q 30 5, 50 15 T 85 8 Q 95 20, 60 22 Q 40 24, 75 14"
                      stroke="#1e293b"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-[6.5px] font-bold text-slate-800 uppercase leading-none">
                    {data.directorName}
                  </div>
                  <div className="text-[5px] text-slate-500 uppercase">{data.directorTitle}</div>
                </div>
              </div>
            </div>

            {/* QR CODE Y TEXTO LEGAL */}
            <div className="flex items-end gap-2.5 pt-1 border-t border-slate-200">
              <div className="flex-shrink-0 text-center">
                <DynamicCertificateQR
                  data={data}
                  onOpenVerify={onOpenVerify}
                  variant="prepaAbierta"
                  sizePx={68}
                  showCaption={true}
                  captionText="🔍 Cotejar"
                />
              </div>

              <div className="flex-1 text-[5.5px] text-slate-600 leading-normal certificate-para">
                El presente documento ha sido firmado mediante el uso de la firma electrónica avanzada del servidor público competente, amparada por un certificado digital vigente a la fecha de su elaboración; y es válido de conformidad con lo dispuesto en los artículos 1, 2, fracciones IV, V, XIII y XIV de la Ley de Firma Electrónica Avanzada. Su integridad y autoría se podrán comprobar por medio del código QR o en:{' '}
                <span className="font-mono text-blue-700 underline">{verifyUrl}</span>. Con fundamento en el artículo 141 de la Ley General de Educación, los certificados expedidos por instituciones del Sistema Educativo Nacional tienen validez plena en toda la República Mexicana.
              </div>
            </div>

            {/* FOLIO */}
            <div className="flex items-center justify-between text-[6.5px] font-mono font-semibold text-slate-800 pt-0.5">
              <div>
                Folio: <span className="font-bold text-slate-900">{data.folio}</span>
              </div>
              <div>Certificado Electrónico Oficial • 1 de 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
