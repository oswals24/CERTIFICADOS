import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CertificateData } from '../types/certificate';
import { gradeToWords } from '../utils/numberToWords';
import { GuillocheSecurityBorder } from './GuillocheSecurityBorder';
import { OfficialMexicanColorEmblem } from './OfficialMexicanColorEmblem';
import { DynamicCertificateQR } from './DynamicCertificateQR';
import { buildVerificationUrl, getVerificationRecord } from '../utils/verificationHelper';

interface CentenarioDigitalCertificateProps {
  data: CertificateData;
  scale?: number;
  id?: string;
  generalGpaOverride?: string;
  onOpenVerify?: () => void;
}

// 23 Módulos oficiales de Prepa en Línea SEP correspondientes al modelo Centenario
const PREPA_EN_LINEA_MODULES = [
  { id: 1, name: 'Tecnologías de información y comunicación', hours: 120, credits: 12, defaultGrade: 9.3 },
  { id: 2, name: 'De la información al conocimiento', hours: 120, credits: 12, defaultGrade: 9.7 },
  { id: 3, name: 'El lenguaje en la relación del hombre con el mundo', hours: 120, credits: 12, defaultGrade: 9.1 },
  { id: 4, name: 'Textos y visiones del mundo', hours: 120, credits: 12, defaultGrade: 8.8 },
  { id: 5, name: 'Argumentación', hours: 120, credits: 12, defaultGrade: 9.0 },
  { id: 6, name: 'Mi mundo en otra lengua', hours: 120, credits: 12, defaultGrade: 9.2 },
  { id: 7, name: 'Mi vida en otra lengua', hours: 120, credits: 12, defaultGrade: 8.7 },
  { id: 8, name: 'Ser social y sociedad', hours: 120, credits: 12, defaultGrade: 7.8 },
  { id: 9, name: 'Sociedad mexicana contemporánea', hours: 120, credits: 12, defaultGrade: 8.9 },
  { id: 10, name: 'Transformaciones en el mundo contemporáneo', hours: 120, credits: 12, defaultGrade: 8.8 },
  { id: 11, name: 'Representaciones simbólicas y algoritmos', hours: 120, credits: 12, defaultGrade: 7.3 },
  { id: 12, name: 'Matemáticas y representaciones del sistema natural', hours: 120, credits: 12, defaultGrade: 7.6 },
  { id: 13, name: 'Variación en procesos sociales', hours: 120, credits: 12, defaultGrade: 8.9 },
  { id: 14, name: 'Universo natural', hours: 120, credits: 12, defaultGrade: 8.0 },
  { id: 15, name: 'Hacia un desarrollo sustentable', hours: 120, credits: 12, defaultGrade: 8.9 },
  { id: 16, name: 'Evolución y sus repercusiones sociales', hours: 120, credits: 12, defaultGrade: 8.8 },
  { id: 17, name: 'Estadística en fenómenos naturales y procesos sociales', hours: 120, credits: 12, defaultGrade: 8.2 },
  { id: 18, name: 'Cálculo en fenómenos naturales y procesos sociales', hours: 120, credits: 12, defaultGrade: 8.5 },
  { id: 19, name: 'Dinámica en la naturaleza: El movimiento', hours: 120, credits: 12, defaultGrade: 7.3 },
  { id: 20, name: 'Optimización en sistemas naturales y sociales', hours: 120, credits: 12, defaultGrade: 7.3 },
  { id: 21, name: 'Impacto de la ciencia y la tecnología', hours: 120, credits: 12, defaultGrade: 8.7 },
  { id: 22, name: 'Tecnologías emergentes en la resolución de problemas', hours: 120, credits: 12, defaultGrade: 7.3 },
  { id: 23, name: 'Tecnologías emergentes para la administración y gestión', hours: 120, credits: 12, defaultGrade: 8.7 },
];

export const CentenarioDigitalCertificate: React.FC<CentenarioDigitalCertificateProps> = ({
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

  const gpaWords = React.useMemo(() => {
    return gradeToWords(calculatedGpa).toUpperCase();
  }, [calculatedGpa]);

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
      .catch((err) => console.error('Error generando QR', err));
  }, [verifyUrl]);

  // Si hay materias en los datos del alumno, mapeamos proporcionalmente sus notas
  const modulesList = React.useMemo(() => {
    const targetAvg = parseFloat(calculatedGpa) || 8.1;
    // Si los datos tienen materias y corresponden al promedio, ajustamos notas
    return PREPA_EN_LINEA_MODULES.map((m, idx) => {
      let grade = m.defaultGrade;
      if (data.subjects && data.subjects[idx]) {
        grade = data.subjects[idx].grade;
      } else {
        // Escalar ligeramente hacia el promedio del alumno
        const diff = targetAvg - 8.5;
        grade = Math.max(6.0, Math.min(10.0, Math.round((m.defaultGrade + diff * 0.7) * 10) / 10));
      }
      return {
        ...m,
        grade,
      };
    });
  }, [data.subjects, calculatedGpa]);

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
        className="certificate-page select-none text-slate-900 bg-white relative overflow-hidden"
        style={{
          width: '215.9mm',
          height: '279.4mm',
          minWidth: '215.9mm',
          minHeight: '279.4mm',
          maxWidth: '215.9mm',
          maxHeight: '279.4mm',
          boxSizing: 'border-box',
          padding: '8mm 11mm 7mm 11mm',
          fontFamily: "'Inter', sans-serif",
          backgroundColor: '#ffffff',
        }}
      >
        {/* MARCO PERIMETRAL GUILLOCHÉ VERDE CON REMATE PRECOLOMBINO */}
        <GuillocheSecurityBorder backgroundColor="#ffffff" />

        {/* MARCA DE AGUA DEL ESCUDO NACIONAL AL CENTRO */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div style={{ opacity: 0.08 }} className="w-[125mm] h-[125mm] flex items-center justify-center">
            <OfficialMexicanColorEmblem className="w-full h-full object-contain" />
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* ENCABEZADO: TRES LOGOS OFICIALES (EDUCACIÓN + CENTENARIO + PREPA EN LÍNEA) */}
          <header className="w-full">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 pt-1">
              {/* LOGO 1: GOBIERNO DE MÉXICO - EDUCACIÓN */}
              <div className="flex items-center gap-1.5 w-1/3">
                <div className="w-7 h-7 flex items-center justify-center">
                  <OfficialMexicanColorEmblem className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-black text-[#691c32] text-[12px] leading-tight tracking-wider">
                    EDUCACIÓN
                  </span>
                  <span className="text-[5px] font-sans font-semibold text-slate-500 uppercase leading-[6px]">
                    SECRETARÍA DE EDUCACIÓN PÚBLICA
                  </span>
                </div>
              </div>

              {/* LOGO 2: CENTENARIO SEP (PÓRTICO MONUMENTAL) */}
              <div className="flex items-center justify-center gap-1.5 w-1/3">
                <svg className="w-6 h-6 shrink-0 text-[#1b4332]" viewBox="0 0 60 60" fill="none">
                  <rect x="10" y="10" width="40" height="3.5" fill="#1b4332" />
                  <rect x="12" y="13.5" width="3.5" height="26" fill="#1b4332" />
                  <rect x="20" y="13.5" width="3.5" height="26" fill="#1b4332" />
                  <rect x="28" y="13.5" width="3.5" height="26" fill="#1b4332" />
                  <rect x="36" y="13.5" width="3.5" height="26" fill="#1b4332" />
                  <rect x="44" y="13.5" width="3.5" height="26" fill="#1b4332" />
                  <path d="M 22 26 C 22 19, 38 19, 38 26 L 38 39.5 L 22 39.5 Z" fill="#b38e5d" opacity="0.4" />
                  <path d="M 24 26 C 24 20, 36 20, 36 26" stroke="#b38e5d" strokeWidth="1.2" />
                  <rect x="8" y="39.5" width="44" height="3.5" fill="#1b4332" />
                </svg>
                <div className="flex flex-col text-left">
                  <span className="font-serif font-black text-[#b38e5d] text-[11px] leading-tight tracking-widest">
                    CENTENARIO
                  </span>
                  <span className="text-[4.5px] font-sans font-semibold text-slate-600 uppercase leading-[5.5px]">
                    SECRETARÍA DE EDUCACIÓN PÚBLICA
                  </span>
                </div>
              </div>

              {/* LOGO 3: PREPA EN LÍNEA SEP */}
              <div className="flex justify-end items-center gap-1.5 w-1/3">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-black text-[#831843] uppercase tracking-tight leading-none">
                    prepa en línea
                  </span>
                  <span className="text-[6.5px] font-bold text-slate-600 uppercase tracking-wider">
                    SEP
                  </span>
                </div>
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-pink-600 to-purple-800 flex items-center justify-center text-white font-bold text-[8px] shadow-xs">
                  PL
                </div>
              </div>
            </div>

            {/* TÍTULOS OFICIALES */}
            <div className="text-center font-sans space-y-[1px] pt-1 pb-1">
              <h1 className="text-[9.5px] font-black text-slate-900 tracking-wider leading-tight uppercase">
                SISTEMA EDUCATIVO NACIONAL
              </h1>
              <h2 className="text-[8px] font-bold text-slate-800 leading-tight uppercase">
                SUBSECRETARÍA DE EDUCACIÓN MEDIA SUPERIOR
              </h2>
              <p className="text-[7.5px] font-semibold text-slate-700 uppercase">
                SERVICIO NACIONAL DE BACHILLERATO EN LÍNEA «PREPA EN LÍNEA - SEP»
              </p>
              <p className="text-[7.5px] font-bold text-slate-900 uppercase tracking-wide">
                CERTIFICADO DE TERMINACIÓN DE ESTUDIOS
              </p>
              <p className="text-[7px] font-medium text-slate-600 uppercase">
                EDUCACIÓN VIRTUAL
              </p>
            </div>
          </header>

          {/* CUERPO DEL CERTIFICADO: TEXTO LEGAL DE RECONOCIMIENTO */}
          <section className="w-full space-y-1 px-2">
            <p className="certificate-para text-[7.5px] text-slate-800 text-center font-sans leading-tight">
              Prepa en Línea - SEP, con Clave de Centro de Trabajo <span className="font-mono font-bold">{data.cct}</span>, certifica que:
            </p>

            {/* NOMBRE DEL ALUMNO DESTACADO */}
            <div className="text-center py-0.5">
              <span className="block text-[13px] font-black text-slate-950 uppercase tracking-[0.04em] font-serif">
                {data.studentName}
              </span>
            </div>

            {/* PÁRRAFO DE CURP, MATRÍCULA Y PLAN DE ESTUDIOS */}
            <p className="certificate-para text-[7.2px] text-slate-800 text-justify font-sans leading-normal">
              Con Clave Única de Registro de Población <span className="font-mono font-bold">{data.curp}</span> y número de matrícula <span className="font-mono font-bold">{data.controlNumber}</span>, acreditó totalmente el plan de estudios de Bachillerato, en el periodo del <span className="font-medium">{data.period}</span>, con un total de <span className="font-bold">{data.totalCredits || 344}</span> créditos de un total de {data.maxCredits || 344}.
            </p>

            {/* PROMEDIO GENERAL DE APROVECHAMIENTO: 2 RECUADROS EXACTOS COMO EN LA IMAGEN */}
            <div className="flex items-center justify-center gap-2 pt-1 pb-1">
              <span className="text-[7.5px] font-bold text-slate-800 uppercase tracking-tight">
                PROMEDIO GENERAL DE APROVECHAMIENTO:
              </span>
              {/* Caja 1: Promedio Numérico */}
              <div className="border border-slate-700 bg-white px-2 py-0.5 min-w-[28px] text-center shadow-2xs">
                <span className="font-mono font-black text-[9.5px] text-slate-950">
                  {calculatedGpa}
                </span>
              </div>
              {/* Caja 2: Promedio en Letras */}
              <div className="border border-slate-700 bg-white px-2.5 py-0.5 min-w-[110px] text-center shadow-2xs">
                <span className="font-sans font-bold text-[8px] text-slate-900 tracking-wide">
                  {gpaWords}
                </span>
              </div>
            </div>

            {/* TÍTULO DE LA TABLA DE COMPETENCIAS / MÓDULOS */}
            <div className="text-[6.8px] font-bold text-slate-800 text-left pt-0.5 border-t border-slate-300">
              Competencias profesionales básicas. Conjunto de los módulos acreditados del componente de formación para el trabajo:
            </div>

            {/* TABLA DE 23 MÓDULOS EN 2 SUB-COLUMNAS O LISTA COMPACTA */}
            <div className="border border-slate-300 rounded-xs overflow-hidden bg-white/90">
              <div className="grid grid-cols-12 bg-slate-100 text-[6px] font-bold text-slate-700 py-0.5 px-1 border-b border-slate-200">
                <div className="col-span-8">Módulo / Asignatura</div>
                <div className="col-span-1 text-center">Calf.</div>
                <div className="col-span-1.5 text-center">Total horas</div>
                <div className="col-span-1.5 text-center">Créditos</div>
              </div>
              <div className="divide-y divide-slate-100 text-[5.8px] max-h-[75mm] overflow-hidden">
                {modulesList.map((m) => (
                  <div key={m.id} className="grid grid-cols-12 py-[1px] px-1 hover:bg-slate-50 items-center">
                    <div className="col-span-8 truncate font-medium text-slate-800">
                      <span className="text-slate-500 font-mono text-[5.2px] mr-1">{m.id}.</span>
                      {m.name}
                    </div>
                    <div className="col-span-1 text-center font-mono font-bold text-slate-900">
                      {m.grade.toFixed(1)}
                    </div>
                    <div className="col-span-1.5 text-center font-mono text-slate-600">
                      {m.hours}
                    </div>
                    <div className="col-span-1.5 text-center font-mono text-slate-600">
                      {m.credits}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PIE DE SEGURIDAD: QR + SELLOS DIGITALES + FOLIO */}
          <footer className="w-full pt-1 px-1 border-t border-slate-300">
            <div className="grid grid-cols-12 gap-2.5 items-center">
              {/* QR CODE INTERACTIVO DINÁMICO */}
              <div className="col-span-3 flex flex-col items-center justify-center">
                <DynamicCertificateQR
                  data={data}
                  onOpenVerify={onOpenVerify}
                  variant="centenario"
                  sizePx={74}
                  showCaption={true}
                  captionText="🔍 Verificar Certificado"
                />
              </div>

              {/* CADENAS CRIPTOGRÁFICAS Y TEXTO LEGAL */}
              <div className="col-span-9 text-[5px] text-slate-700 font-mono leading-tight space-y-0.5">
                <div>
                  <span className="font-bold">Autoridad educativa: </span>
                  {data.directorName} - {data.directorTitle}
                </div>
                <div>
                  <span className="font-bold">Sello digital autoridad educativa: </span>
                  <span className="break-all text-slate-500">{record.digitalSealAuthority.substring(0, 120)}...</span>
                </div>
                <div>
                  <span className="font-bold">Fecha y hora de timbrado: </span>
                  {record.timestamp}
                </div>
                <div>
                  <span className="font-bold">Sello digital SEP: </span>
                  <span className="break-all text-slate-500">{record.digitalSealSep.substring(0, 120)}...</span>
                </div>
                <p className="text-[4.8px] font-sans text-slate-600 leading-tight pt-0.5 text-justify">
                  El presente documento ha sido firmado mediante el uso de la firma electrónica avanzada del servidor público competente, y es válido en toda la República Mexicana sin necesidad de trámites adicionales de legalización, de conformidad con el Art. 141 de la Ley General de Educación.
                </p>
              </div>
            </div>

            {/* PIE CON FOLIO FORMAL Y FECHA DE IMPRESIÓN */}
            <div className="pt-1 mt-0.5 flex items-center justify-between text-[6.5px] font-mono font-bold text-slate-800 border-t border-slate-200">
              <span>Folio {data.folio}</span>
              <span className="text-[5.8px] font-sans font-normal text-slate-600">
                El presente documento se imprime en {data.schoolLocation}, a los {data.issueDay} días del mes de {data.issueMonth.toLowerCase()} de {data.issueYear}.
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
