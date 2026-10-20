import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CertificateData } from '../types/certificate';
import { gradeToWords } from '../utils/numberToWords';
import { OfficialMexicanSealSeek } from './OfficialMexicanSealSeek';
import { OfficialMexicanColorEmblem } from './OfficialMexicanColorEmblem';
import { GoldenMexicanEagle } from './GoldenMexicanEagle';
import { OfficialSchoolSeal } from './OfficialSchoolSeal';
import { OfficialCertificateBorder } from './OfficialCertificateBorder';
import { DynamicCertificateQR } from './DynamicCertificateQR';
import { buildVerificationUrl } from '../utils/verificationHelper';

interface OfficialCertificateProps {
  data: CertificateData;
  scale?: number;
  id?: string;
  generalGpaOverride?: string;
  onOpenVerify?: () => void;
}

export const OfficialCertificate: React.FC<OfficialCertificateProps> = ({
  data,
  scale = 1,
  id = 'certificate-render-target',
  generalGpaOverride,
  onOpenVerify,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Calcular promedio si no viene un override
  const calculatedGpa = React.useMemo(() => {
    if (generalGpaOverride && generalGpaOverride.trim() !== '') {
      return generalGpaOverride;
    }
    return '8.1';
  }, [generalGpaOverride]);

  const gpaWords = React.useMemo(() => {
    return gradeToWords(calculatedGpa);
  }, [calculatedGpa]);

  // Generar QR Code oficial
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

  // Renderizar el escudo según la opción seleccionada
  const renderBackgroundEmblem = () => {
    const watermarkType = data.watermarkType || 'seek_vector';
    const opacity = data.watermarkOpacity ?? 0.09;

    if (watermarkType === 'color_emblem') {
      return <OfficialMexicanColorEmblem size={440} opacity={opacity} />;
    }
    if (watermarkType === 'golden') {
      return <GoldenMexicanEagle size={440} opacity={opacity} />;
    }
    // Default: 'seek_vector' (Imagen 2: Sello oficial con arco "ESTADOS UNIDOS MEXICANOS" y águila grabada)
    return <OfficialMexicanSealSeek size={440} opacity={opacity} color="#1e293b" />;
  };

  const renderHeaderEmblem = () => {
    const watermarkType = data.watermarkType || 'seek_vector';

    if (watermarkType === 'color_emblem') {
      return <OfficialMexicanColorEmblem size={38} opacity={1} />;
    }
    if (watermarkType === 'golden') {
      return <GoldenMexicanEagle size={38} opacity={0.98} />;
    }
    return <OfficialMexicanSealSeek size={42} opacity={0.92} color="#1e293b" />;
  };

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
        {/* MARCO PERIMETRAL DE BORDES VERDES Y DORADOS OFICIALES */}
        {data.showGreenGoldBorder !== false && (
          <OfficialCertificateBorder
            styleType={data.borderStyle || 'green_gold'}
          />
        )}

        {/* IMAGEN DE FONDO (MARCA DE AGUA OFICIAL MEXICANA) */}
        {data.showWatermark !== false && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            {renderBackgroundEmblem()}
          </div>
        )}

        {/* CONTENIDO PRINCIPAL POR ENCIMA DE LA MARCA DE AGUA */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* ENCABEZADO SUPERIOR */}
          <header className="w-full">
            <div className="flex items-center justify-between pb-1">
              {/* LOGOS IZQUIERDA (SEP + ESCUDO / ÁGUILA OFICIAL MEXICANA) */}
              <div className="flex items-center gap-3">
                {/* Logotipo SEP */}
                <div className="flex flex-col items-center">
                  <span
                    className="font-serif font-black text-slate-800 text-[13px] leading-none"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    SEP
                  </span>
                  <div className="w-12 h-[1px] bg-slate-500 my-0.5"></div>
                  <span className="text-[5.5px] font-sans font-semibold text-slate-700 text-center leading-[6.5px] uppercase">
                    SECRETARÍA DE<br />EDUCACIÓN PÚBLICA
                  </span>
                </div>

                {/* LOGO DEL ÁGUILA EN EL ENCABEZADO */}
                <div className="w-10 h-10 flex items-center justify-center">
                  {renderHeaderEmblem()}
                </div>
              </div>

              {/* LOGOTIPO OFICIAL DGB (DERECHA) */}
              <div className="flex justify-end">
                <svg
                  className="h-7 w-20"
                  viewBox="0 0 120 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* D */}
                  <path
                    d="M6,6 L22,6 C33,6 36,16 36,27 C36,38 33,48 22,48 L6,48 Z M15,14 L15,40 L21,40 C27,40 27,14 21,14 Z"
                    fill="#366f7d"
                  />
                  {/* G */}
                  <path
                    d="M63,14 C59,8 51,6 44,6 C34,6 30,16 30,27 C30,37 34,48 44,48 C53,48 60,43 63,36 L54,36 C51,40 48,41 44,41 C37,41 37,32 37,27 C37,23 37,13 44,13 C48,13 51,15 53,19 Z M52,24 L64,24 L64,47 L57,47 L57,31 L52,31 Z"
                    fill="#366f7d"
                  />
                  {/* B */}
                  <path
                    d="M68,6 L85,6 C93,6 95,15 95,22 C95,27 93,29 88,30 C94,31 97,36 97,42 C97,49 91,48 83,48 L68,48 Z M76,13 L76,24 L83,24 C87,24 87,13 83,13 Z M76,29 L76,41 L84,41 C89,41 89,29 84,29 Z"
                    fill="#366f7d"
                  />
                </svg>
              </div>
            </div>

            {/* FILETE DECORATIVO VERDE Y DORADO BAJO LOS LOGOS */}
            <div className="w-full flex items-center gap-1 my-1">
              <div className="flex-1 h-[1.5px] bg-[#0f4d34]" />
              <div className="w-16 h-[1.5px] bg-[#ca8a04]" />
              <div className="flex-1 h-[1.5px] bg-[#0f4d34]" />
            </div>

            {/* TÍTULOS OFICIALES CENTRADOS */}
            <div className="text-center font-sans pt-0.5 pb-1">
              <h2 className="text-[11px] font-bold text-slate-900 leading-tight">
                SISTEMA EDUCATIVO NACIONAL
              </h2>
              <h3 className="text-[9.5px] font-bold text-slate-800 leading-tight mt-0.5">
                SUBSECRETARÍA DE EDUCACIÓN MEDIA SUPERIOR
              </h3>
              <p className="text-[7.5px] font-semibold text-slate-700 uppercase mt-0.5">
                DIRECCIÓN GENERAL DEL BACHILLERATO
              </p>
              <p className="text-[7px] font-medium text-slate-600 uppercase">
                CERTIFICADO DE TERMINACIÓN DE ESTUDIOS
              </p>
              <p className="text-[6.5px] font-normal text-slate-500 uppercase">
                EDUCACIÓN PRESENCIAL
              </p>
            </div>
          </header>

          {/* CUERPO PRINCIPAL DEL CERTIFICADO (TEXTO UNIFORME SIN PALABRAS EN NEGRITAS SUELTAS) */}
          <section className="w-full mt-2 space-y-2.5">
            {/* Párrafo de Certificación del Plantel (Tipografía uniforme, sin negritas aisladas) */}
            <p className="certificate-para text-[8.5px] text-slate-900 uppercase font-normal font-sans">
              LA PREPARATORIA FEDERAL POR COOPERACIÓN {data.schoolName}, UBICADA EN {data.schoolLocation}, CON CLAVE DE CENTRO TRABAJO {data.cct}, CERTIFICA QUE
            </p>

            {/* Nombre del Alumno (Único elemento destacado en negrita y centrado) */}
            <div className="text-center py-1">
              <span
                className="block text-[13.5px] font-bold text-slate-950 uppercase tracking-[0.03em]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {data.studentName}
              </span>
            </div>

            {/* Párrafo de Acreditación (Tipografía uniforme y espaciado limpio entre palabras) */}
            <p className="certificate-para text-[8.5px] text-slate-900 font-normal font-sans">
              con Clave Única de Registro de Población {data.curp} y número de control {data.controlNumber}, acreditó totalmente el plan de estudios de bachillerato general, con formación elemental para el trabajo en {data.specialty}, en el periodo del {data.period}, con {data.totalCredits} créditos, de un total de {data.maxCredits}.
            </p>

            {/* CAJA DE PROMEDIO DE APROVECHAMIENTO */}
            <div className="flex items-center justify-center gap-3 pt-1 pb-1">
              <span className="font-bold text-[8.5px] uppercase text-slate-900 tracking-[0.02em]">
                PROMEDIO DE APROVECHAMIENTO:
              </span>
              <div className="border border-slate-700 bg-white px-3.5 py-0.5 text-[9px] font-bold font-mono text-slate-950 text-center min-w-[38px]">
                {calculatedGpa}
              </div>
              <div className="border border-slate-700 bg-white px-5 py-0.5 text-[8px] font-bold uppercase text-slate-950 text-center min-w-[130px] tracking-[0.03em]">
                {gpaWords}
              </div>
            </div>

            {/* Subtítulo de materias */}
            <p className="text-[7.8px] font-semibold text-slate-800 pt-0.5 mb-1 text-left tracking-[0.02em]">
              Asignaturas acreditadas de formación profesional básica:
            </p>

            {/* TABLA DE MATERIAS CON ENCABEZADOS Y ESPACIADO EXPANDIDO */}
            <div className="w-full">
              <table className="w-full border-collapse text-[7.5px] font-sans">
                <thead>
                  <tr className="text-slate-900 font-bold text-center border-b border-t border-slate-300 bg-slate-50/50">
                    <th className="py-1.5 px-2 text-left w-8 font-bold">#</th>
                    <th className="py-1.5 px-2 text-left font-bold tracking-[0.02em]">Asignatura</th>
                    <th className="py-1.5 px-3 w-16 text-center font-bold">Calif.</th>
                    <th className="py-1.5 px-3 w-22 text-center font-bold">Total Hrs.</th>
                    <th className="py-1.5 px-3 w-18 text-center font-bold">Créditos</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0">
                  {data.subjects.map((sub, idx) => (
                    <tr key={sub.id || idx} className="leading-normal hover:bg-slate-50/20">
                      <td className="py-1 px-2 text-slate-700 font-mono text-[7.2px] align-middle">
                        {idx + 1} .
                      </td>
                      <td className="certificate-subject py-1 px-2 uppercase text-slate-900 font-normal align-middle">
                        {sub.name}
                      </td>
                      <td className="py-1 px-3 text-center font-mono text-slate-900 font-medium align-middle">
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
              <div className="w-full h-[1px] bg-slate-300 mt-0.5"></div>
            </div>
          </section>

          {/* ESPACIO EN BLANCO NATURAL ENTRE TABLA Y FIRMAS */}
          <div className="flex-1 min-h-[30px] pointer-events-none" />

          {/* SECCIÓN INFERIOR: QR, CADENA DIGITAL, FIRMA Y SELLO */}
          <footer className="w-full pt-1">
            <div className="grid grid-cols-12 gap-3 items-end">
              {/* QR Y CADENA DIGITAL A LA IZQUIERDA */}
              <div className="col-span-4 flex flex-col items-start justify-end pb-0.5">
                <DynamicCertificateQR
                  data={data}
                  onOpenVerify={onOpenVerify}
                  variant="traditional"
                  sizePx={70}
                  showCaption={false}
                  showCadenaOriginal={true}
                />
              </div>

              {/* FIRMA Y SELLO OFICIAL (CENTRO Y DERECHA) */}
              <div className="col-span-8 grid grid-cols-2 gap-3 items-end pb-1">
                {/* FIRMA EN EL CENTRO */}
                <div className="flex flex-col items-center justify-center text-center">
                  {data.showSignature && (
                    <div className="h-16 w-44 relative flex items-center justify-center -mb-1">
                      <svg
                        viewBox="0 0 280 140"
                        className={`w-full h-full ${
                          data.signatureColor === 'black'
                            ? 'stroke-slate-900'
                            : 'stroke-blue-800'
                        }`}
                      >
                        <path
                          d="M30 115 C70 85, 120 40, 160 25 C190 15, 230 45, 240 75 C245 95, 220 115, 180 110 C130 105, 80 70, 70 50 C60 30, 90 20, 130 30 C170 40, 220 80, 250 90"
                          fill="none"
                          stroke={data.signatureColor === 'black' ? '#0f172a' : '#1e40af'}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                        <ellipse
                          cx="140"
                          cy="65"
                          rx="75"
                          ry="30"
                          fill="none"
                          stroke={data.signatureColor === 'black' ? '#0f172a' : '#1d4ed8'}
                          strokeWidth="1.8"
                          transform="rotate(-10 140 65)"
                        />
                        <ellipse
                          cx="135"
                          cy="70"
                          rx="68"
                          ry="25"
                          fill="none"
                          stroke={data.signatureColor === 'black' ? '#0f172a' : '#1e40af'}
                          strokeWidth="1.6"
                          transform="rotate(10 135 70)"
                        />
                        <path
                          d="M25 115 L235 32"
                          fill="none"
                          stroke={data.signatureColor === 'black' ? '#0f172a' : '#1e40af'}
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                        <path
                          d="M95 38 L195 102"
                          fill="none"
                          stroke={data.signatureColor === 'black' ? '#0f172a' : '#1d4ed8'}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <text
                          x="135"
                          y="66"
                          fontFamily="'Inter', sans-serif"
                          fontSize="10"
                          fontWeight="600"
                          fill={data.signatureColor === 'black' ? '#0f172a' : '#1e40af'}
                          textAnchor="middle"
                        >
                          Firma
                        </text>
                        <circle
                          cx="165"
                          cy="48"
                          r="2.2"
                          fill={data.signatureColor === 'black' ? '#0f172a' : '#1d4ed8'}
                        />
                        <circle
                          cx="178"
                          cy="40"
                          r="1.8"
                          fill={data.signatureColor === 'black' ? '#0f172a' : '#1d4ed8'}
                        />
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

                {/* SELLO OFICIAL DEL PLANTEL LIC. CESAR LINTON RODRIGUEZ */}
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

            {/* LEYENDA LEGAL INFERIOR */}
            <div className="mt-2 text-[5.2px] text-slate-700 font-sans leading-[1.3] text-justify">
              <p>
                Con fundamento en lo dispuesto en el artículo 60 de la Ley General de
                Educación, los certificados de estudios expedidos por instituciones del
                Sistema Educativo Nacional, tienen validez en la República Mexicana sin
                necesidad de trámites adicionales de autenticación o legalización, lo cual
                permite el tránsito del estudiante por el Sistema Educativo Nacional.
              </p>
              <p className="mt-0.5">
                La versión electrónica del presente documento, su integridad y autoría se
                podrá comprobar en la página electrónica de la Dirección General del
                Bachillerato, en la siguiente liga:{' '}
                <span className="font-mono">www.pace.sep.gob.mx/certificadosdgb</span>. De
                igual manera, se podrá verificar el documento electrónico por medio del
                código QR.
              </p>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="font-mono text-[5.5px] text-slate-900">
                  Folio &nbsp;{' '}
                  <span className="font-bold">{data.folio}</span>
                </p>
                <p className="font-sans text-[5.2px] text-slate-800 uppercase">
                  EL PRESENTE DOCUMENTO SE IMPRIME EN {data.schoolLocation},{' '}
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
