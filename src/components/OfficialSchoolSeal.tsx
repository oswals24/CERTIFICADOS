import React from 'react';

interface OfficialSchoolSealProps {
  schoolName: string;
  cct: string;
  schoolLocation: string;
  className?: string;
  color?: string;
}

/**
 * Sello Oficial auténtico del Plantel Preparatoria Federal por Cooperación
 * "Lic. César Linton Rodríguez" basado exactamente en la fotografía oficial de muestra.
 */
export const OfficialSchoolSeal: React.FC<OfficialSchoolSealProps> = ({
  schoolName,
  cct,
  schoolLocation,
  className = '',
  color = '#334155',
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center text-center ${className}`}>
      {/* ESCUDO HERALDICO OFICIAL DEL PLANTEL */}
      <svg
        className="w-16 h-16 opacity-85"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Listón superior en arco */}
        <path
          d="M 30 55 C 65 30, 135 30, 170 55 L 160 68 C 130 48, 70 48, 40 68 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.6"
        />
        {/* Terminales del listón */}
        <path d="M 30 55 L 20 62 L 32 70 L 40 68 Z" fill="none" stroke={color} strokeWidth="1.4" />
        <path d="M 170 55 L 180 62 L 168 70 L 160 68 Z" fill="none" stroke={color} strokeWidth="1.4" />

        {/* Texto diminuto en el listón */}
        <path id="sealBannerArc" d="M 40 60 C 75 40, 125 40, 160 60" fill="none" />
        <text fill={color} fontSize="5" fontWeight="bold" letterSpacing="0.8">
          <textPath href="#sealBannerArc" startOffset="50%" textAnchor="middle">
            PREPARATORIA FEDERAL
          </textPath>
        </text>

        {/* Contorno exterior del escudo heráldico */}
        <path
          d="M 60 65 L 140 65 C 145 85, 148 115, 100 148 C 52 115, 55 85, 60 65 Z"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        {/* Línea interior del escudo */}
        <path
          d="M 66 70 L 134 70 C 138 88, 140 112, 100 140 C 60 112, 62 88, 66 70 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.2"
        />

        {/* División en 4 cuarteles del escudo */}
        <line x1="100" y1="70" x2="100" y2="138" stroke={color} strokeWidth="1.2" />
        <line x1="66" y1="102" x2="134" y2="102" stroke={color} strokeWidth="1.2" />

        {/* Cuartel 1 (Sup. Izq.): Antorcha del saber */}
        <path d="M 80 80 L 86 94 M 78 77 Q 83 72 88 77 Z" stroke={color} strokeWidth="1" fill="none" />

        {/* Cuartel 2 (Sup. Der.): Balanza / Ciencia */}
        <path d="M 112 78 L 124 78 M 118 78 L 118 94 M 112 85 Q 115 90 118 85 M 118 85 Q 121 90 124 85" stroke={color} strokeWidth="0.9" fill="none" />

        {/* Cuartel 3 (Inf. Izq.): Libro abierto */}
        <path d="M 76 112 Q 83 110 88 112 M 76 122 Q 83 120 88 122 M 76 112 L 76 122 M 88 112 L 88 122 M 82 111 L 82 121" stroke={color} strokeWidth="0.9" fill="none" />

        {/* Cuartel 4 (Inf. Der.): Átomo / Engrane de la técnica */}
        <ellipse cx="118" cy="118" rx="6" ry="3" stroke={color} strokeWidth="0.8" transform="rotate(30 118 118)" />
        <ellipse cx="118" cy="118" rx="6" ry="3" stroke={color} strokeWidth="0.8" transform="rotate(-30 118 118)" />
        <circle cx="118" cy="118" r="1.5" fill={color} />

        {/* Círculo central con monograma "CLR" (César Linton Rodríguez) */}
        <circle cx="100" cy="102" r="10" fill="#ffffff" stroke={color} strokeWidth="1.4" />
        <text x="100" y="104.5" fill={color} fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          CLR
        </text>

        {/* Guirnalda de laurel en la base y año 1968 */}
        <path d="M 80 148 Q 100 156 120 148" stroke={color} strokeWidth="1.5" fill="none" />
        <text x="100" y="156" fill={color} fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          1968
        </text>

        {/* Pequeño listón base */}
        <rect x="85" y="158" width="30" height="5" stroke={color} strokeWidth="0.8" fill="none" />
        <text x="100" y="162" fill={color} fontSize="3.5" fontWeight="bold" textAnchor="middle">
          SALINA CRUZ
        </text>
      </svg>

      {/* LEYENDA INSTITUCIONAL OFICIAL BAJO EL SELLO */}
      <div className="text-[4px] text-slate-700 uppercase leading-[4.5px] mt-0.5 space-y-[0.2px] font-semibold tracking-wider">
        <p>SECRETARIA DE EDUCACION PUBLICA</p>
        <p>SUBSECRETARIA DE EDUCACION MEDIA SUPERIOR</p>
        <p>DIRECCION GENERAL DEL BACHILLERATO</p>
        <p>PREPARATORIA FEDERAL POR COOPERACION</p>
        <p>{schoolName}</p>
        <p>C.C.T. {cct}</p>
        <p>{schoolLocation}</p>
      </div>

      {/* CORCHETES Y RÓTULO 'Sello' */}
      <div className="flex items-center justify-between w-20 mt-1 px-1 text-slate-700">
        <div className="w-1.5 h-1.5 border-b border-l border-slate-700"></div>
        <span className="text-[5.5px] font-sans font-medium">Sello</span>
        <div className="w-1.5 h-1.5 border-b border-r border-slate-700"></div>
      </div>
    </div>
  );
};
