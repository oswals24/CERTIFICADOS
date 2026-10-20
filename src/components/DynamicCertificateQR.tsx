import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CertificateData } from '../types/certificate';
import { buildVerificationUrl } from '../utils/verificationHelper';
import { ShieldCheck } from 'lucide-react';

export interface DynamicCertificateQRProps {
  data: CertificateData;
  onOpenVerify?: () => void;
  sizePx?: number;
  variant?: 'traditional' | 'centenario' | 'gala' | 'acuerdo286' | 'prepaAbierta';
  showCaption?: boolean;
  captionText?: string;
  showCadenaOriginal?: boolean;
  cadenaCustom?: string;
  darkColor?: string;
  lightColor?: string;
  className?: string;
}

export const DynamicCertificateQR: React.FC<DynamicCertificateQRProps> = ({
  data,
  onOpenVerify,
  sizePx = 72, // ~19mm a 96dpi
  variant = 'traditional',
  showCaption = true,
  captionText,
  showCadenaOriginal = false,
  cadenaCustom,
  darkColor,
  lightColor = '#ffffff',
  className = '',
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  // Determinar la URL oficial dinámica que codifica tanto el folio como la URL/identificador del alumno
  const targetVerificationUrl = React.useMemo(() => {
    if (data.studentUrl && data.studentUrl.trim()) {
      return data.studentUrl.trim();
    }
    if (data.qrUrl && data.qrUrl.trim()) {
      return data.qrUrl.trim();
    }
    return buildVerificationUrl(data.folio, data.curp, data.studentName);
  }, [data.folio, data.curp, data.studentName, data.studentUrl, data.qrUrl]);

  // Selección de color según la variante
  const effectiveDarkColor = React.useMemo(() => {
    if (darkColor) return darkColor;
    switch (variant) {
      case 'gala':
        return '#0f172a';
      case 'centenario':
      case 'acuerdo286':
        return '#000000';
      case 'prepaAbierta':
        return '#111827';
      case 'traditional':
      default:
        return '#1e293b';
    }
  }, [darkColor, variant]);

  // Generación reactiva del código QR en alta resolución
  useEffect(() => {
    let isMounted = true;
    setHasError(false);

    QRCode.toDataURL(targetVerificationUrl, {
      width: 280, // Alta resolución para garantizar nitidez en impresión y exportación PDF
      margin: 1,
      color: {
        dark: effectiveDarkColor,
        light: lightColor,
      },
      errorCorrectionLevel: data.qrErrorCorrection || 'M',
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('Error generando QR dinámico:', err);
        if (isMounted) {
          setHasError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [targetVerificationUrl, effectiveDarkColor, lightColor, data.qrErrorCorrection]);

  const defaultCaption = React.useMemo(() => {
    if (captionText) return captionText;
    switch (variant) {
      case 'centenario':
        return '🔍 Verificar Certificado';
      case 'acuerdo286':
        return '🔍 Clic p/ Cotejo';
      case 'prepaAbierta':
        return '🔍 Cotejar';
      case 'gala':
        return 'Validación Oficial';
      case 'traditional':
      default:
        return 'Verificación Oficial';
    }
  }, [captionText, variant]);

  const defaultCadena =
    cadenaCustom ||
    `||${data.cct || '20SBC2017V'}|${data.folio || 'CBG18073056'}|${data.curp || 'RAMC000124HOCMRHA1'}|${data.directorName || 'CARLOS SOTO KAT'}|${data.controlNumber || '15520090170185'}|SEP-DGB||`;

  return (
    <div className={`dynamic-certificate-qr-container inline-flex flex-col items-start ${className}`}>
      <div
        onClick={onOpenVerify}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onOpenVerify?.();
          }
        }}
        title={`Código QR Oficial Dinámico SEP-DGB\nFolio: ${data.folio}\nAlumno: ${data.studentName}\nCURP: ${data.curp}\nURL: ${targetVerificationUrl}\n(Haz clic para abrir cotejo digital en vivo)`}
        className="group relative cursor-pointer inline-block bg-white p-0.5 border border-slate-300 rounded-xs shadow-2xs hover:border-emerald-600 hover:ring-1 hover:ring-emerald-500 transition-all select-none print:shadow-none print:ring-0 print:border-slate-400"
      >
        {/* IMAGEN DEL CÓDIGO QR */}
        {qrDataUrl && !hasError ? (
          <img
            src={qrDataUrl}
            alt={`Código QR dinámico de autenticidad para folio ${data.folio}`}
            style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
            className="object-contain block transition-transform duration-150 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
            className="bg-slate-50 flex flex-col items-center justify-center p-1 text-slate-400 border border-dashed border-slate-200"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span className="text-[6px] font-mono mt-0.5 font-bold text-slate-600">QR DINÁMICO</span>
          </div>
        )}

        {/* INSIGNIA INTERACTIVA SOLO EN PANTALLA (OCULTA AL IMPRIMIR) */}
        <div className="no-print absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-600 text-white rounded-full p-0.5 shadow-sm">
          <ShieldCheck className="w-2.5 h-2.5" />
        </div>
      </div>

      {/* SUBTÍTULO O TEXTO DE ACCIÓN */}
      {showCaption && (
        <span
          onClick={onOpenVerify}
          className="text-[5.5px] font-semibold text-emerald-800 tracking-tight block mt-0.5 cursor-pointer hover:underline select-none print:text-slate-700 print:no-underline"
        >
          {defaultCaption}
        </span>
      )}

      {/* CADENA DIGITAL ORIGINAL (EN MODELOS TRADICIONAL / GALA) */}
      {showCadenaOriginal && (
        <div className="mt-0.5 text-[4px] font-mono text-slate-600 leading-tight tracking-tighter max-w-[135px] break-all select-all">
          {defaultCadena}
        </div>
      )}
    </div>
  );
};
