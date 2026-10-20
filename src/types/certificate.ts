export interface Subject {
  id: string;
  name: string;
  hours: number;
  credits: number;
  grade: number;
}

export interface CertificateData {
  // Datos del alumno
  studentName: string;
  curp: string;
  controlNumber: string;
  specialty: string;
  period: string;
  periodStartDate?: string; // YYYY-MM-DD
  periodEndDate?: string; // YYYY-MM-DD
  periodFormatStyle?: 'full_legal' | 'full_legal_upper' | 'month_year' | 'years_only' | 'custom';
  totalCredits: number;
  maxCredits: number;

  // Datos institucionales
  schoolName: string;
  schoolLocation: string; // ej: SALINA CRUZ, OAXACA
  cct: string; // ej: 20SBC2017V
  directorName: string;
  directorTitle: string; // ej: Director del plantel

  // Certificación y folio
  folio: string;
  issueDate?: string; // YYYY-MM-DD
  issueDay: number;
  issueMonth: string; // ej: JULIO
  issueYear: number; // ej: 2018
  customIssueDateText?: string; // ej: "A LOS TRECE DÍAS DEL MES DE JULIO DE DOS MIL DIECIOCHO"

  // Materias
  subjects: Subject[];

  // Opciones visuales
  signatureColor: 'blue' | 'black' | 'darkblue';
  showStamp: boolean;
  showSignature: boolean;
  showWatermark?: boolean;
  watermarkOpacity?: number;
  watermarkType?: 'seek_vector' | 'color_emblem' | 'golden';
  showGreenGoldBorder?: boolean;
  borderStyle?: 'green_gold' | 'minimal' | 'none';
  templateModel?: CertificateTemplateType;
  qrUrl?: string;
  studentUrl?: string; // URL específica del expediente del alumno para verificación
  qrErrorCorrection?: 'L' | 'M' | 'Q' | 'H';
  qrCaptionText?: string;
}

export type CertificateTemplateType = 'dgb_tradicional' | 'sep_centenario' | 'solemne_gala' | 'acuerdo_286' | 'prepa_abierta';

export type TaskStatus = 'pendiente' | 'en_proceso' | 'por_revisar' | 'completada';
export type TaskPriority = 'alta' | 'media' | 'baja';
export type TaskCategory =
  | 'emision_certificado'
  | 'revision_calificaciones'
  | 'firma_sello'
  | 'tramite_sep'
  | 'entrega_alumno'
  | 'archivo_escolar';

export interface Task {
  id: string;
  title: string;
  description?: string;
  studentName?: string;
  curp?: string;
  folio?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string; // YYYY-MM-DD
  createdAt: string;
  completedAt?: string;
  assignedTo?: string;
  certificateSnapshot?: CertificateData;
}
