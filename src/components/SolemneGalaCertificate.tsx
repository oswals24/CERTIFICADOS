import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CertificateData } from '../types/certificate';
import { gradeToWords } from '../utils/numberToWords';
import { GoldenMexicanEagle } from './GoldenMexicanEagle';
import { OfficialMexicanColorEmblem } from './OfficialMexicanColorEmblem';
import { OfficialSchoolSeal } from './OfficialSchoolSeal';
import { DynamicCertificateQR } from './DynamicCertificateQR';
import { buildVerificationUrl } from '../utils/verificationHelper';

interface SolemneGalaCertificateProps {
  data: CertificateData;
  scale?: number;
  id?: string;
  generalGpaOverride?: string;
  onOpenVerify?: () => void;
}

export const SolemneGalaCertificate: React.FC<SolemneGalaCertificateProps> = ({
  data,
  scale = 1,
  id = 'certificate-render-target',
  generalGpaOverride,
  onOpenVerify,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const calculatedGpa = React.useMemo(() => {
    if (generalGpaOverride && generalGpaOverride.trim() !== '') {
      return generalGpaOverride;
    }
    return '8.1';
  }, [generalGpaOverride]);

  const gpaWords = React.useMemo(() => {
    return gradeToWords(calculatedGpa);
  }, [calculatedGpa]);

  useEffect(() => {
    const verificationUrl = data.qrUrl || buildVerificationUrl(data.folio);

    QRCode.toDataURL(verificationUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generando QR', err));
  }, [data.folio, data.qrUrl]);

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
          fontFamily: "'Inter', sans-serif",
          width: '215.9mm',
          height: '279.4mm',
          minWidth: '215.9mm',
          minHeight: '279.4mm',
          maxWidth: '215.9mm',
          maxHeight: '279.4mm',
          padding: '11mm 13mm 10mm 13mm',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
        }}
      >
        {/* MARCO PERIMETRAL DE GALA Y HONOR: DOBLE FILETE VERDE ESMERALDA Y ORO PULIDO CON ESQUINEROS DE FILIGRANA */}
        <div className="absolute inset-[3mm] pointer-events-none z-20">
          <div className="w-full h-full border-[3px] border-[#064e3b] relative">
            <div className="absolute inset-[1.8mm] border-[1.2px] border-[#d97706]">
              {/* Esquineros ornamentales de filigrana dorada */}
              {/* Superior Izquierdo */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-[2.5px] border-l-[2.5px] border-[#b45309]" />
              <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#d97706]" />
              
              {/* Superior Derecho */}
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-[2.5px] border-r-[2.5px] border-[#b45309]" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#d97706]" />
              
              {/* Inferior Izquierdo */}
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-[2.5px] border-l-[2.5px] border-[#b45309]" />
              <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#d97706]" />
              
              {/* Inferior Derecho */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-[2.5px] border-r-[2.5px] border-[#b45309]" />
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#d97706]" />

              {/* Detalle central superior e inferior */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 bg-white">
                <span className="text-[#b45309] text-[7px] font-serif">❖</span>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 bg-white">
                <span className="text-[#b45309] text-[7px] font-serif">❖</span>
              </div>
            </div>
          </div>
        </div>

        {/* MARCA DE AGUA SOLEMNE: ÁGUILA MEXICANA DORADA */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <GoldenMexicanEagle size={430} opacity={0.08} />
        </div>

        {/* CONTENIDO DEL CERTIFICADO */}
        <div className="relative z-10 flex flex-col h-full justify-between pt-1 pb-1">
          {/* ENCABEZADO SOLEMNE */}
          <header className="w-full">
            <div className="flex items-center justify-between pb-1 px-1">
              {/* LOGOS SEP Y ESCUDO A COLOR */}
              <div className="flex items-center gap-2.5">
                <div className="flex flex-col items-center">
                  <span
                    className="font-serif font-black text-slate-800 text-[13px] leading-none tracking-wider"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    SEP
                  </span>
                  <div className="w-12 h-[1px] bg-slate-500 my-0.5"></div>
                  <span className="text-[5.2px] font-sans font-semibold text-slate-700 text-center leading-[6.5px] uppercase">
                    SECRETARÍA DE<br />EDUCACIÓN PÚBLICA
                  </span>
                </div>

                <div className="w-10 h-10 flex items-center justify-center">
                  <OfficialMexicanColorEmblem size={38} opacity={1} />
                </div>
              </div>

              {/* TÍTULO CENTRAL ENCABEZADO */}
              <div className="text-center font-sans">
                <h2 className="text-[11px] font-bold text-slate-900 tracking-tight leading-tight">
                  SISTEMA EDUCATIVO NACIONAL
                </h2>
                <h3 className="text-[9px] font-bold text-slate-800 leading-tight">
                  SUBSECRETARÍA DE EDUCACIÓN MEDIA SUPERIOR
                </h3>
                <p className="text-[7.5px] font-semibold text-[#064e3b] uppercase">
                  DIRECCIÓN GENERAL DEL BACHILLERATO
                </p>
              </div>

              {/* LOGOTIPO DGB */}
              <div className="flex justify-end">
                <svg className="h-7 w-20" viewBox="0 0 120 54" fill="none">
                  <path
                    d="M6,6 L22,6 C33,6 36,16 36,27 C36,38 33,48 22,48 L6,48 Z M15,14 L15,40 L21,40 C27,40 27,14 21,14 Z"
                    fill="#064e3b"
                  />
                  <path
                    d="M63,14 C59,8 51,6 44,6 C34,6 30,16 30,27 C30,37 34,48 44,48 C53,48 60,43 63,36 L54,36 C51,40 48,41 44,41 C37,41 37,32 37,27 C37,23 37,13 44,13 C48,13 51,15 53,19 Z M52,24 L64,24 L64,47 L57,47 L57,31 L52,31 Z"
                    fill="#064e3b"
                  />
                  <path
                    d="M68,6 L85,6 C93,6 95,15 95,22 C95,27 93,29 88,30 C94,31 97,36 97,42 C97,49 91,48 83,48 L68,48 Z M76,13 L76,24 L83,24 C87,24 87,13 83,13 Z M76,29 L76,41 L84,41 C89,41 89,29 84,29 Z"
                    fill="#064e3b"
                  />
                </svg>
              </div>
            </div>

            {/* SEPARADOR DUAL DORADO Y VERDE */}
            <div className="w-full flex items-center justify-center my-1">
              <div className="flex-1 h-[1.2px] bg-[#064e3b]" />
              <div className="w-20 h-[1.5px] bg-[#d97706]" />
              <div className="flex-1 h-[1.2px] bg-[#064e3b]" />
            </div>

            <div className="text-center font-sans">
              <p className="text-[8px] font-bold text-slate-800 uppercase tracking-wider">
                CERTIFICADO DE TERMINACIÓN DE ESTUDIOS
              </p>
              <p className="text-[6.8px] font-medium text-slate-600 uppercase tracking-wide">
                BACHILLERATO GENERAL • MODALIDAD ESCOLARIZADA
              </p>
            </div>
          </header>

          {/* CUERPO DEL CERTIFICADO CON TIPOGRAFÍA UNIFORME */}
          <section className="w-full mt-2 space-y-2 px-1">
            <p className="certificate-para text-[8.5px] text-slate-900 uppercase font-normal font-sans">
              LA PREPARATORIA FEDERAL POR COOPERACIÓN {data.schoolName}, UBICADA EN {data.schoolLocation}, CON CLAVE DE CENTRO DE TRABAJO {data.cct}, CERTIFICA QUE
            </p>

            {/* NOMBRE DEL ALUMNO EN NEGRITA CENTRADO */}
            <div className="text-center py-0.5">
              <span
                className="block text-[14px] font-bold text-slate-950 uppercase tracking-[0.03em]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {data.studentName}
              </span>
            </div>

            <p className="certificate-para text-[8.5px] text-slate-900 font-normal font-sans">
              con Clave Única de Registro de Población {data.curp} y número de control {data.controlNumber}, concluyó y acreditó los estudios correspondientes de bachillerato general, con capacitación para el trabajo en {data.specialty}, durante el periodo {data.period}, habiendo cubierto {data.totalCredits} créditos de los {data.maxCredits} que integran el plan oficial de estudios.
            </p>

            {/* CAJA DE PROMEDIO DE APROVECHAMIENTO */}
            <div className="flex items-center justify-center gap-3 pt-1 pb-1">
              <span className="font-bold text-[8.5px] uppercase text-slate-900 tracking-[0.02em]">
                PROMEDIO DE APROVECHAMIENTO:
              </span>
              <div className="border border-[#064e3b] bg-white px-3.5 py-0.5 text-[9.5px] font-bold font-mono text-slate-950 text-center min-w-[40px]">
                {calculatedGpa}
              </div>
              <div className="border border-[#064e3b] bg-white px-5 py-0.5 text-[8px] font-bold uppercase text-slate-950 text-center min-w-[130px] tracking-[0.03em]">
                {gpaWords}
              </div>
            </div>

            {/* TABLA DE MATERIAS ACREDITADAS */}
            <div className="w-full pt-0.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[7.8px] font-semibold text-slate-800">
                  Asignaturas acreditadas de formación para el trabajo:
                </span>
                <span className="text-[7px] font-medium text-slate-600">
                  Total de asignaturas: {data.subjects.length}
                </span>
              </div>

              <table className="w-full border-collapse text-[7.5px] font-sans">
                <thead>
                  <tr className="text-slate-900 font-bold text-center border-b border-t border-slate-400 bg-slate-50/60">
                    <th className="py-1 px-2 text-left w-8 font-bold">#</th>
                    <th className="py-1 px-2 text-left font-bold tracking-[0.02em]">Asignatura</th>
                    <th className="py-1 px-3 w-16 text-center font-bold">Calif.</th>
                    <th className="py-1 px-3 w-20 text-center font-bold">Horas</th>
                    <th className="py-1 px-3 w-18 text-center font-bold">Créditos</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subjects.map((sub, idx) => (
                    <tr key={sub.id || idx} className="border-b border-slate-100 hover:bg-slate-50/40">
                      <td className="py-1 px-2 text-slate-700 font-mono text-[7.2px] align-middle">
                        {idx + 1}.
                      </td>
                      <td className="certificate-subject py-1 px-2 uppercase text-slate-900 font-normal align-middle">
                        {sub.name}
                      </td>
                      <td className="py-1 px-3 text-center font-mono text-slate-950 font-semibold align-middle">
                        {Number(sub.grade).toFixed(1)}
                      </td>
                      <td className="py-1 px-3 text-center font-mono text-slate-800 align-middle">
                        {sub.hours}
                      </td>
                      <td className="py-1 px-3 text-center font-mono text-slate-800 align-middle">
                        {sub.credits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="w-full h-[1px] bg-slate-400 mt-0.5"></div>
            </div>
          </section>

          {/* ESPACIO EN BLANCO NATURAL */}
          <div className="flex-1 min-h-[25px] pointer-events-none" />

          {/* SECCIÓN INFERIOR: QR, FIRMAS Y SELLO OFICIAL */}
          <footer className="w-full pt-1 px-1">
            <div className="grid grid-cols-12 gap-3 items-end">
              {/* QR Y CADENA DE SEGURIDAD DINÁMICA */}
              <div className="col-span-4 flex flex-col items-start justify-end pb-0.5">
                <DynamicCertificateQR
                  data={data}
                  onOpenVerify={onOpenVerify}
                  variant="gala"
                  sizePx={70}
                  showCaption={false}
                  showCadenaOriginal={true}
                />
              </div>

              {/* FIRMA Y SELLO OFICIAL */}
              <div className="col-span-8 grid grid-cols-2 gap-3 items-end pb-1">
                {/* FIRMA DEL DIRECTOR */}
                <div className="flex flex-col items-center justify-center text-center">
                  {data.showSignature && (
                    <div className="h-16 w-44 relative flex items-center justify-center -mb-1">
                      <svg viewBox="0 0 280 140" className="w-full h-full">
                        <path
                          d="M30 115 C70 85, 120 40, 160 25 C190 15, 230 45, 240 75 C245 95, 220 115, 180 110 C130 105, 80 70, 70 50 C60 30, 90 20, 130 30 C170 40, 220 80, 250 90"
                          fill="none"
                          stroke={data.signatureColor === 'black' ? '#0f172a' : '#1e40af'}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                        <ellipse cx="140" cy="65" rx="75" ry="30" fill="none" stroke={data.signatureColor === 'black' ? '#0f172a' : '#1d4ed8'} strokeWidth="1.8" transform="rotate(-10 140 65)" />
                        <ellipse cx="135" cy="70" rx="68" ry="25" fill="none" stroke={data.signatureColor === 'black' ? '#0f172a' : '#1e40af'} strokeWidth="1.6" transform="rotate(10 135 70)" />
                        <line x1="25" y1="115" x2="235" y2="32" stroke={data.signatureColor === 'black' ? '#0f172a' : '#1e40af'} strokeWidth="2.4" strokeLinecap="round" />
                        <text x="135" y="66" fontFamily="'Inter', sans-serif" fontSize="10" fontWeight="600" fill={data.signatureColor === 'black' ? '#0f172a' : '#1e40af'} textAnchor="middle">
                          Firma
                        </text>
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-[8.5px] text-slate-900 uppercase">
                      {data.directorName}
                    </p>
                    <p className="text-[7.2px] text-slate-600 font-medium">
                      {data.directorTitle}
                    </p>
                  </div>
                </div>

                {/* SELLO OFICIAL DEL PLANTEL */}
                <div className="flex flex-col items-center justify-center text-center">
                  {data.showStamp && (
                    <OfficialSchoolSeal
                      schoolName={data.schoolName}
                      cct={data.cct}
                      schoolLocation={data.schoolLocation}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* FUNDAMENTO LEGAL Y FOLIO */}
            <div className="mt-2 text-[5.2px] text-slate-700 font-sans leading-[1.3] text-justify border-t border-slate-300 pt-1">
              <p>
                Con fundamento en lo dispuesto en el artículo 60 de la Ley General de Educación, los certificados de estudios expedidos por instituciones del Sistema Educativo Nacional, tienen validez en toda la República Mexicana sin necesidad de trámites adicionales de autenticación o legalización.
              </p>
              <div className="mt-1 flex items-baseline justify-between font-mono text-[5.5px] text-slate-900">
                <p>
                  Folio: <span className="font-bold">{data.folio}</span>
                </p>
                <p className="font-sans text-[5.2px] text-slate-800 uppercase">
                  EXPEDIDO EN {data.schoolLocation},{' '}
                  {data.customIssueDateText ||
                    `A LOS ${data.issueDay} DÍAS DEL MES DE ${data.issueMonth} DE ${data.issueYear}.`}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
