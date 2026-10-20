const digitMap: Record<number, string> = {
  0: 'CERO',
  1: 'UNO',
  2: 'DOS',
  3: 'TRES',
  4: 'CUATRO',
  5: 'CINCO',
  6: 'SEIS',
  7: 'SIETE',
  8: 'OCHO',
  9: 'NUEVE',
  10: 'DIEZ',
};

/**
 * Convierte un promedio numérico a texto formal (ej: 8.1 -> "OCHO PUNTO UNO")
 */
export function gradeToWords(val: number | string): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return 'N/P';

  const rounded = Math.round(num * 10) / 10;
  const intPart = Math.floor(rounded);
  const decPart = Math.round((rounded - intPart) * 10);

  const intText = digitMap[intPart] ?? intPart.toString();

  if (decPart === 0) {
    // Si es 10 o número entero, según el modelo oficial puede ser "DIEZ PUNTO CERO" o "OCHO PUNTO CERO"
    // En el modelo DGB: 8.1 -> OCHO PUNTO UNO. Si es entero 10: "DIEZ" o "DIEZ PUNTO CERO"
    if (intPart === 10) {
      return 'DIEZ';
    }
    return `${intText} PUNTO CERO`;
  }

  const decText = digitMap[decPart] ?? decPart.toString();
  return `${intText} PUNTO ${decText}`;
}

/**
 * Convierte un número de día a texto formal en español (ej: 13 -> "TRECE")
 */
export function dayToWords(day: number): string {
  const days: Record<number, string> = {
    1: 'PRIMERO',
    2: 'DOS',
    3: 'TRES',
    4: 'CUATRO',
    5: 'CINCO',
    6: 'SEIS',
    7: 'SIETE',
    8: 'OCHO',
    9: 'NUEVE',
    10: 'DIEZ',
    11: 'ONCE',
    12: 'DOCE',
    13: 'TRECE',
    14: 'CATORCE',
    15: 'QUINCE',
    16: 'DIECISÉIS',
    17: 'DIECISIETE',
    18: 'DIECIOCHO',
    19: 'DIECINUEVE',
    20: 'VEINTE',
    21: 'VEINTIÚN',
    22: 'VEINTIDÓS',
    23: 'VEINTITRÉS',
    24: 'VEINTICUATRO',
    25: 'VEINTICINCO',
    26: 'VEINTISÉIS',
    27: 'VEINTISIETE',
    28: 'VEINTIOCHO',
    29: 'VEINTINUEVE',
    30: 'TREINTA',
    31: 'TREINTA Y UN',
  };
  return days[day] || day.toString();
}

/**
 * Convierte un año a texto formal (ej: 2018 -> "DOS MIL DIECIOCHO")
 */
export function yearToWords(year: number): string {
  const years: Record<number, string> = {
    2018: 'DOS MIL DIECIOCHO',
    2019: 'DOS MIL DIECINUEVE',
    2020: 'DOS MIL VEINTE',
    2021: 'DOS MIL VEINTIUNO',
    2022: 'DOS MIL VEINTIDÓS',
    2023: 'DOS MIL VEINTITRÉS',
    2024: 'DOS MIL VEINTICUATRO',
    2025: 'DOS MIL VEINTICINCO',
    2026: 'DOS MIL VEINTISÉIS',
  };
  return years[year] || `AÑO ${year}`;
}
