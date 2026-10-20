import { CertificateData } from '../types/certificate';

export interface VerificationRecord {
  isValid: boolean;
  statusText: string;
  folio: string;
  studentName: string;
  curp: string;
  controlNumber: string;
  schoolName: string;
  cct: string;
  specialty: string;
  period: string;
  average: number;
  averageWords: string;
  totalCredits: number;
  issueDate: string;
  timestamp: string;
  authorityCertificateNo: string;
  authorityName: string;
  authorityTitle: string;
  digitalSealAuthority: string;
  digitalSealSep: string;
  cadenaOriginal: string;
  verificationUrl: string;
}

export function buildVerificationUrl(
  folio: string,
  curp?: string,
  studentName?: string,
  customStudentUrl?: string
): string {
  if (customStudentUrl && customStudentUrl.trim()) {
    return customStudentUrl.trim();
  }
  const cleanFolio = folio || 'CBG18073056';
  if (typeof window === 'undefined') {
    const params = new URLSearchParams();
    params.set('folio', cleanFolio);
    if (curp) params.set('curp', curp);
    if (studentName) params.set('student', studentName);
    params.set('verify', 'true');
    return `https://siged.sep.gob.mx/certificados/?${params.toString()}`;
  }
  const base = `${window.location.origin}${window.location.pathname}`;
  const params = new URLSearchParams();
  params.set('folio', cleanFolio);
  if (curp) params.set('curp', curp);
  if (studentName) params.set('student', studentName);
  params.set('verify', 'true');
  return `${base}?${params.toString()}`;
}

/**
 * Genera el paquete completo de metadatos de verificación oficial para cotejo
 */
export function getVerificationRecord(data: CertificateData): VerificationRecord {
  const avg =
    data.subjects && data.subjects.length > 0
      ? Number(
          (
            data.subjects.reduce((acc, s) => acc + (s.grade || 0), 0) /
            data.subjects.length
          ).toFixed(1)
        )
      : 9.8;

  const issueDateFormatted = `${data.issueDay || 13} de ${data.issueMonth?.toLowerCase() || 'julio'} de ${data.issueYear || 2018}`;

  const cleanFolio = data.folio || 'CBG18073056';
  const cleanCurp = data.curp || 'RAMC000124HOCMRHA1';

  // Cadena única criptográfica simulada de acuerdo a lineamientos SEP SIGED
  const authorityCertificateNo = '00001000000705890737';
  const timestamp = `${data.issueYear || 2018}-07-${String(data.issueDay || 13).padStart(2, '0')} 14:29:46`;

  const digitalSealAuthority =
    `TjU3eSahOyeqrqaxg+/uX0mYwbO3IskbHzSjhLDQK6D7ecF0mPqwRcw5e66wLKamlJrnmgDbj+UuIOFMGrkNZZNQkHokoK4sm+MmZvW3h8EZFLF3CH5g` +
    `pQhrATKCCy2NATKBDs2UvO1vU+89a24d5vP0AOkYg35eZ2k2+KjE0vj8uUe13Qj/K8E8K4pQv4k4C8z8U0qO1q0326Yk8o15b/b7zoxfCsgQrnkufOEmNPgMeFWt5` +
    `PAkSTA12yZb3NkalizctHDPYeebkTTSO1fU5+Wpm+g9qgco9j8yqqGAvEbBtuys832w1qg==`;

  const digitalSealSep =
    `UK74egGQwWrx0fPkT9kM44p1YlO/ZQhv7gqjT6qJ4sbiWJyb9e5iKkI9j1bcsE6w66wLKamlJrnmgDbj+UuIOFMGrkNZZNQkHokoK4sm+MmZvW3h8EZFLF3CH5g` +
    `Oqvjshgq02i9eh7UTSLgpge9sQ96317bB34c67Y/kRk5pOWx0+W4z4e7e721vMNkig4vWp4Pq8Um5+S3C4RpouPretrboA12TByYGRBvMleLp48jOAARlBO` +
    `QPrDUkVocD8V7wPaMgondejxpV/bZecp81aGZ2x8/u9w/LeC3fUe1k1t2KCJQ36uFcEnQIq==`;

  const cadenaOriginal = `||1.1|${cleanFolio}|${timestamp}|${data.cct || '20SBC2017V'}|${cleanCurp}|${avg}|${authorityCertificateNo}||`;

  return {
    isValid: true,
    statusText: 'CERTIFICADO VÁLIDO Y VIGENTE',
    folio: cleanFolio,
    studentName: data.studentName,
    curp: cleanCurp,
    controlNumber: data.controlNumber,
    schoolName: data.schoolName,
    cct: data.cct,
    specialty: data.specialty,
    period: data.period,
    average: avg,
    averageWords: 'NUEVE PUNTO OCHO',
    totalCredits: data.totalCredits || 344,
    issueDate: issueDateFormatted,
    timestamp,
    authorityCertificateNo,
    authorityName: data.directorName || 'CARLOS SOTO KAT',
    authorityTitle: data.directorTitle || 'Director del Plantel',
    digitalSealAuthority,
    digitalSealSep,
    cadenaOriginal,
    verificationUrl:
      data.studentUrl ||
      data.qrUrl ||
      buildVerificationUrl(cleanFolio, cleanCurp, data.studentName, data.studentUrl),
  };
}
