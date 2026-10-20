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

export const Acuerdo286DigitalCertificate: React.FC<Props> = ({
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
  const avgText = gradeToWords(calculatedGpa).toLowerCase();

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
      .catch((err) => console.error('Error generating QR:', err));
  }, [verifyUrl]);

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
        className="certificate-page relative bg-[#faf8f5] shadow-2xl mx-auto overflow-hidden print:shadow-none select-text"
        style={{
          width: '215.9mm',
          height: '279.4mm',
          minWidth: '215.9mm',
          minHeight: '279.4mm',
          maxWidth: '215.9mm',
          maxHeight: '279.4mm',
          boxSizing: 'border-box',
          padding: '0',
          backgroundColor: '#faf8f5',
          color: '#000000',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* MARCO PERIMETRAL GUILLOCHÉ DE ALTA SEGURIDAD */}
        <GuillocheSecurityBorder backgroundColor="#faf8f5" />

        {/* MARCA DE AGUA DEL ESCUDO NACIONAL AL CENTRO */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div style={{ opacity: 0.08 }} className="w-[125mm] h-[125mm] flex items-center justify-center">
            <OfficialMexicanColorEmblem className="w-full h-full object-contain" />
          </div>
        </div>

        {/* CONTENIDO INTERIOR */}
        <div className="relative z-10 h-full flex flex-col justify-between px-[14mm] pt-[12mm] pb-[10mm]">
          {/* ENCABEZADO INSTITUCIONAL */}
          <div>
            {/* LOGOTIPOS GOBIERNO DE MÉXICO - EDUCACIÓN - DGB */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center">
                    <OfficialMexicanColorEmblem className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-[14px] font-black tracking-wider text-[#691c32] uppercase leading-none font-serif">
                      EDUCACIÓN
                    </div>
                    <div className="text-[6.5px] font-semibold text-slate-500 tracking-wider uppercase">
                      SECRETARÍA DE EDUCACIÓN PÚBLICA
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-6 w-[1px] bg-slate-300" />

              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-black text-[#1b4332] font-serif tracking-tighter">
                  DGB
                </span>
              </div>
            </div>

            {/* TÍTULOS OFICIALES */}
            <div className="text-center space-y-0.5">
              <h1 className="text-[12px] font-black tracking-widest uppercase text-black font-sans">
                SISTEMA EDUCATIVO NACIONAL
              </h1>
              <p className="text-[8px] font-semibold uppercase text-slate-700 tracking-wide">
                SUBSECRETARÍA DE EDUCACIÓN MEDIA SUPERIOR
              </p>
              <p className="text-[8px] font-semibold uppercase text-slate-700 tracking-wide">
                DIRECCIÓN GENERAL DEL BACHILLERATO
              </p>
              <p className="text-[7.5px] font-medium uppercase text-slate-600">
                INSTITUCIÓN PÚBLICA CENTRALIZADA FEDERAL
              </p>
              <p className="text-[7.5px] font-medium text-slate-600">
                Certificación por examen
              </p>
              <h2 className="text-[13px] font-black tracking-wide uppercase text-slate-900 pt-0.5 font-serif">
                Certificado de Estudios
              </h2>
            </div>
          </div>

          {/* CUERPO DEL CERTIFICADO */}
          <div className="space-y-3.5 my-auto">
            <div className="text-[9px] font-semibold text-slate-800">
              Se expide a:
            </div>

            {/* BARRA DORADA: DATOS DE LA PERSONA */}
            <div>
              <div className="bg-[#b38e5d] text-white text-[8px] font-bold py-0.5 px-3 rounded-xs uppercase tracking-wider">
                Datos de la persona
              </div>

              {/* NOMBRE DEL EGRESADO */}
              <div className="text-center pt-3 pb-1 border-b border-slate-300">
                <div className="text-[14px] font-black tracking-widest text-slate-900 font-serif uppercase">
                  {data.studentName}
                </div>
                <div className="text-[6.5px] text-slate-500 uppercase mt-0.5">
                  Nombre(s) Primer apellido Segundo apellido
                </div>
              </div>

              {/* CURP */}
              <div className="text-center pt-2 pb-1 border-b border-slate-300">
                <div className="text-[10.5px] font-bold tracking-widest font-mono text-slate-800">
                  {data.curp}
                </div>
                <div className="text-[6.5px] text-slate-500 uppercase mt-0.5">
                  Clave Única de Registro de Población (CURP)
                </div>
              </div>
            </div>

            {/* BARRA DORADA: DATOS DE LA ACREDITACIÓN */}
            <div>
              <div className="bg-[#b38e5d] text-white text-[8px] font-bold py-0.5 px-3 rounded-xs uppercase tracking-wider">
                Datos de la acreditación
              </div>

              <div className="text-center py-2.5">
                <p className="certificate-para text-[9px] text-slate-800 font-sans leading-relaxed">
                  Acreditó el Bachillerato General de conformidad con el Acuerdo número 286 en el plantel{' '}
                  <strong className="font-semibold text-slate-900">{data.schoolName}</strong> ({data.schoolLocation}), con número de control <span className="font-mono">{data.controlNumber}</span>.
                </p>
              </div>

              {/* 3 COLUMNAS LIMPIAS: CCT - FECHA - RESULTADO OBTENIDO */}
              <div className="grid grid-cols-3 gap-3 text-center border-t border-b border-slate-200 py-2.5">
                <div>
                  <div className="text-[9.5px] font-bold font-mono text-slate-800">
                    {data.cct}
                  </div>
                  <div className="text-[6.5px] text-slate-500 uppercase mt-0.5">
                    Clave de Centro de Trabajo
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-semibold text-slate-800">
                    {data.issueDay} de {data.issueMonth?.toLowerCase()} de {data.issueYear}
                  </div>
                  <div className="text-[6.5px] text-slate-500 uppercase mt-0.5">
                    Fecha de evaluación
                  </div>
                </div>
                <div>
                  <div className="text-[9.5px] font-bold text-slate-900">
                    {avgNum.toFixed(1)} <span className="capitalize font-normal text-slate-700">({avgText})</span>
                  </div>
                  <div className="text-[6.5px] text-slate-500 uppercase mt-0.5">
                    Resultado obtenido
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PIE DE SEGURIDAD Y SELLOS DIGITALES */}
          <div className="space-y-1.5 pt-2">
            {/* DATOS DE LA AUTORIDAD Y SELLO DIGITAL */}
            <div className="text-[6.5px] text-slate-700 leading-tight space-y-0.5 font-mono">
              <div>
                <span className="font-bold">Autoridad educativa: </span>
                {data.directorName} - {data.directorTitle}
              </div>
              <div>
                <span className="font-bold">No. del certificado de la autoridad educativa: </span>
                {record.authorityCertificateNo}
              </div>
              <div>
                <span className="font-bold">Sello digital autoridad educativa: </span>
                <span className="break-all text-slate-500">{record.digitalSealAuthority}</span>
              </div>
              <div>
                <span className="font-bold">Fecha y hora de timbrado: </span>
                {record.timestamp}
              </div>
              <div>
                <span className="font-bold">Sello digital SEP: </span>
                <span className="break-all text-slate-500">{record.digitalSealSep}</span>
              </div>
            </div>

            {/* QR CODE Y TEXTO LEGAL */}
            <div className="flex items-end gap-3 pt-1 border-t border-slate-200">
              {/* QR CODE CON BOTÓN INTERACTIVO PARA VERIFICAR */}
              <div className="flex-shrink-0 text-center">
                <DynamicCertificateQR
                  data={data}
                  onOpenVerify={onOpenVerify}
                  variant="acuerdo286"
                  sizePx={74}
                  showCaption={true}
                  captionText="🔍 Clic p/ Cotejo"
                />
              </div>

              {/* PÁRRAFO LEGAL DE VALIDEZ */}
              <div className="flex-1 text-[5.8px] text-slate-600 leading-normal certificate-para">
                <p className="mb-0.5">
                  El presente documento ha sido firmado mediante el uso de la firma electrónica avanzada del servidor público competente, amparada por un certificado digital vigente a la fecha de su elaboración; y es válido de conformidad con lo dispuesto en los artículos 1, 2, fracciones IV, V, XIII y XIV, 3, fracciones I y II, 7, 8, 9, 12, 14, 16 y 25 de la Ley de Firma Electrónica Avanzada; 7 y 12 del Reglamento de la Ley de Firma Electrónica Avanzada. Su integridad y autoría se podrán comprobar por medio del código QR o en:{' '}
                  <span className="font-mono text-blue-700 underline">{verifyUrl}</span>
                </p>
                <p>
                  Con fundamento en lo dispuesto en el artículo 141 de la Ley General de Educación, los certificados de estudios expedidos por instituciones del Sistema Educativo Nacional, tienen validez en la República Mexicana sin necesidad de trámites adicionales de autenticación o legalización, lo cual permite el tránsito de la persona por el Sistema Educativo Nacional. El presente documento se expide formalmente.
                </p>
              </div>
            </div>

            {/* FOLIO Y NÚMERO DE PÁGINA */}
            <div className="flex items-center justify-between text-[7px] font-mono font-semibold text-slate-800 pt-1 border-t border-slate-200">
              <div>
                FOLIO: <span className="font-bold text-slate-900">{data.folio}</span>
              </div>
              <div>1 de 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
