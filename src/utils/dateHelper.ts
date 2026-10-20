import { dayToWords, yearToWords } from './numberToWords';

export const SPANISH_MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export const SPANISH_MONTHS_UPPER = SPANISH_MONTHS.map((m) => m.toUpperCase());

export type PeriodFormatStyle =
  | 'full_legal' // 24 de agosto de 2015 al 25 de junio de 2018
  | 'full_legal_upper' // 24 DE AGOSTO DE 2015 AL 25 DE JUNIO DE 2018
  | 'month_year' // Agosto de 2015 a Junio de 2018
  | 'years_only' // 2015 - 2018
  | 'custom';

export interface DateRangePreset {
  label: string;
  cycle: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export const SCHOOL_CYCLE_PRESETS: DateRangePreset[] = [
  {
    label: 'Gen. 2015-2018 (Original)',
    cycle: '2015 - 2018',
    startDate: '2015-08-24',
    endDate: '2018-06-25',
  },
  {
    label: 'Gen. 2016-2019',
    cycle: '2016 - 2019',
    startDate: '2016-08-22',
    endDate: '2019-06-28',
  },
  {
    label: 'Gen. 2017-2020',
    cycle: '2017 - 2020',
    startDate: '2017-08-21',
    endDate: '2020-06-26',
  },
  {
    label: 'Gen. 2018-2021',
    cycle: '2018 - 2021',
    startDate: '2018-08-20',
    endDate: '2021-06-25',
  },
  {
    label: 'Gen. 2019-2022',
    cycle: '2019 - 2022',
    startDate: '2019-08-19',
    endDate: '2022-06-24',
  },
  {
    label: 'Gen. 2020-2023',
    cycle: '2020 - 2023',
    startDate: '2020-08-24',
    endDate: '2023-06-23',
  },
  {
    label: 'Gen. 2021-2024',
    cycle: '2021 - 2024',
    startDate: '2021-08-23',
    endDate: '2024-06-21',
  },
  {
    label: 'Gen. 2022-2025',
    cycle: '2022 - 2025',
    startDate: '2022-08-22',
    endDate: '2025-06-20',
  },
];

/**
 * Convierte fecha YYYY-MM-DD a objeto con dia, mes, anio
 */
export function parseIsoDate(isoString: string): { day: number; month: number; year: number } | null {
  if (!isoString) return null;
  const parts = isoString.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return { day, month, year };
}

/**
 * Formatea rango de fechas a texto según el estilo solicitado
 */
export function formatPeriodRange(
  startDateStr: string,
  endDateStr: string,
  style: PeriodFormatStyle = 'full_legal'
): string {
  const start = parseIsoDate(startDateStr);
  const end = parseIsoDate(endDateStr);

  if (!start || !end) {
    return `${startDateStr} al ${endDateStr}`;
  }

  const startMonthName = SPANISH_MONTHS[start.month - 1] || 'mes';
  const endMonthName = SPANISH_MONTHS[end.month - 1] || 'mes';

  switch (style) {
    case 'full_legal':
      return `${start.day} de ${startMonthName} de ${start.year} al ${end.day} de ${endMonthName} de ${end.year}`;

    case 'full_legal_upper':
      return `${start.day} DE ${startMonthName.toUpperCase()} DE ${start.year} AL ${end.day} DE ${endMonthName.toUpperCase()} DE ${end.year}`;

    case 'month_year': {
      const capStart = startMonthName.charAt(0).toUpperCase() + startMonthName.slice(1);
      const capEnd = endMonthName.charAt(0).toUpperCase() + endMonthName.slice(1);
      return `${capStart} de ${start.year} a ${capEnd} de ${end.year}`;
    }

    case 'years_only':
      return `${start.year} - ${end.year}`;

    case 'custom':
    default:
      return `${start.day} de ${startMonthName} de ${start.year} al ${end.day} de ${endMonthName} de ${end.year}`;
  }
}

/**
 * Genera texto legal formal de fecha de emisión (para el pie de página institucional)
 * Ej: "2018-07-13" -> "A LOS TRECE DÍAS DEL MES DE JULIO DE DOS MIL DIECIOCHO."
 */
export function generateLegalIssueDateText(isoDateStr: string): {
  day: number;
  monthNameUpper: string;
  year: number;
  legalText: string;
} {
  const parsed = parseIsoDate(isoDateStr);
  if (!parsed) {
    return {
      day: 13,
      monthNameUpper: 'JULIO',
      year: 2018,
      legalText: 'A LOS TRECE DÍAS DEL MES DE JULIO DE DOS MIL DIECIOCHO.',
    };
  }

  const dayWord = dayToWords(parsed.day);
  const monthName = (SPANISH_MONTHS[parsed.month - 1] || 'JULIO').toUpperCase();
  const yearWord = yearToWords(parsed.year);

  const legalText = `A LOS ${dayWord} DÍAS DEL MES DE ${monthName} DE ${yearWord}.`;

  return {
    day: parsed.day,
    monthNameUpper: monthName,
    year: parsed.year,
    legalText,
  };
}

/**
 * Intenta inferir fechas ISO desde un texto en español como:
 * "24 de agosto de 2015 al 25 de junio de 2018"
 */
export function inferDatesFromPeriodText(periodText: string): {
  startDate: string;
  endDate: string;
} {
  const defaultRes = { startDate: '2015-08-24', endDate: '2018-06-25' };
  if (!periodText) return defaultRes;

  // Busca patrones como "24 de agosto de 2015 al 25 de junio de 2018"
  const regex = /(\d{1,2})\s+de\s+([a-zA-ZáéíóúÁÉÍÓÚ]+)\s+de\s+(\d{4})\s+al?\s+(\d{1,2})\s+de\s+([a-zA-ZáéíóúÁÉÍÓÚ]+)\s+de\s+(\d{4})/i;
  const match = periodText.match(regex);

  if (match) {
    const day1 = match[1].padStart(2, '0');
    const month1Name = match[2].toLowerCase();
    const year1 = match[3];

    const day2 = match[4].padStart(2, '0');
    const month2Name = match[5].toLowerCase();
    const year2 = match[6];

    const month1Idx = SPANISH_MONTHS.indexOf(month1Name);
    const month2Idx = SPANISH_MONTHS.indexOf(month2Name);

    if (month1Idx >= 0 && month2Idx >= 0) {
      const m1 = (month1Idx + 1).toString().padStart(2, '0');
      const m2 = (month2Idx + 1).toString().padStart(2, '0');
      return {
        startDate: `${year1}-${m1}-${day1}`,
        endDate: `${year2}-${m2}-${day2}`,
      };
    }
  }

  // Busca años "2015 - 2018" o "2015-2018"
  const yearRegex = /(\d{4})\s*[-–a]\s*(\d{4})/;
  const yearMatch = periodText.match(yearRegex);
  if (yearMatch) {
    return {
      startDate: `${yearMatch[1]}-08-24`,
      endDate: `${yearMatch[2]}-06-25`,
    };
  }

  return defaultRes;
}
