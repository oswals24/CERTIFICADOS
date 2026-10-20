import React from 'react';

interface MexicanEmblemProps {
  className?: string;
  size?: number | string;
  opacity?: number;
  color?: string;
}

/**
 * Escudo Nacional de los Estados Unidos Mexicanos
 * Águila real posada sobre un nopal devorando una serpiente,
 * con guirnalda de encino y laurel y leyenda oficial.
 */
export const MexicanEmblem: React.FC<MexicanEmblemProps> = ({
  className = '',
  size = 40,
  opacity = 1,
  color = '#475569',
}) => {
  return (
    <svg
      viewBox="0 0 300 300"
      width={size}
      height={size}
      style={{ opacity }}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Arco para el texto ESTADOS UNIDOS MEXICANOS */}
        <path
          id="textArc"
          d="M 45,150 A 105,105 0 0,1 255,150"
          fill="none"
        />
      </defs>

      {/* Leyenda superior semicircular */}
      <text
        fill={color}
        fontSize="13.5"
        fontWeight="700"
        fontFamily="'Inter', sans-serif"
        letterSpacing="2.8"
      >
        <textPath href="#textArc" startOffset="50%" textAnchor="middle">
          ESTADOS UNIDOS MEXICANOS
        </textPath>
      </text>

      {/* Silueta y detalles del Águila Real */}
      <g stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Alas extendidas en arco */}
        <path
          d="M 150 95 C 135 70, 105 60, 75 75 C 95 90, 110 110, 125 130 C 135 145, 142 160, 148 180"
          fill={color}
          fillOpacity="0.85"
        />
        <path
          d="M 150 95 C 165 70, 195 60, 225 75 C 205 90, 190 110, 175 130 C 165 145, 158 160, 152 180"
          fill={color}
          fillOpacity="0.85"
        />

        {/* Plumas de las alas */}
        <path d="M 85 78 C 95 95, 108 115, 120 135" />
        <path d="M 100 75 C 110 95, 122 115, 130 140" />
        <path d="M 115 75 C 122 95, 132 118, 140 145" />

        <path d="M 215 78 C 205 95, 192 115, 180 135" />
        <path d="M 200 75 C 190 95, 178 115, 170 140" />
        <path d="M 185 75 C 178 95, 168 118, 160 145" />

        {/* Cabeza del águila de perfil mirando hacia la izquierda */}
        <path
          d="M 150 102 C 146 95, 138 88, 130 92 C 124 95, 122 100, 118 102 C 114 104, 111 106, 114 109 C 117 111, 122 111, 125 110 C 129 116, 136 122, 142 126"
          fill={color}
        />
        {/* Ojo del águila */}
        <circle cx="129" cy="99" r="2.2" fill="#ffffff" />
        <circle cx="128.5" cy="99" r="1.1" fill={color} />

        {/* Pico ganchudo */}
        <path
          d="M 122 102 Q 112 104 113 111 Q 120 109 124 108 Z"
          fill={color}
        />

        {/* Pecho y torso */}
        <path
          d="M 135 125 C 132 145, 135 168, 142 185 C 146 195, 154 195, 158 185 C 165 168, 168 145, 165 125"
          fill={color}
          fillOpacity="0.75"
        />

        {/* Cola plumada */}
        <path
          d="M 142 185 L 138 215 L 150 220 L 162 215 L 158 185 Z"
          fill={color}
          fillOpacity="0.8"
        />
        <line x1="145" y1="188" x2="143" y2="214" />
        <line x1="150" y1="188" x2="150" y2="218" />
        <line x1="155" y1="188" x2="157" y2="214" />

        {/* Serpiente de cascabel en pico y garra */}
        <path
          d="M 115 110 C 105 120, 105 135, 120 142 C 135 148, 145 140, 152 148 C 158 155, 152 168, 142 170"
          stroke={color}
          strokeWidth="3.2"
        />
        <circle cx="106" cy="122" r="3.2" fill={color} />

        {/* Nopal y pencas (tunas) */}
        <ellipse cx="150" cy="218" rx="20" ry="11" fill={color} fillOpacity="0.5" strokeWidth="1.8" />
        <ellipse cx="128" cy="225" rx="16" ry="10" fill={color} fillOpacity="0.45" strokeWidth="1.8" transform="rotate(-18 128 225)" />
        <ellipse cx="172" cy="225" rx="16" ry="10" fill={color} fillOpacity="0.45" strokeWidth="1.8" transform="rotate(18 172 225)" />
        <ellipse cx="150" cy="236" rx="24" ry="12" fill={color} fillOpacity="0.55" strokeWidth="1.8" />

        {/* Espinas del nopal */}
        <line x1="140" y1="214" x2="137" y2="210" />
        <line x1="150" y1="210" x2="150" y2="206" />
        <line x1="160" y1="214" x2="163" y2="210" />

        {/* Piedra o peña sobre el agua */}
        <path
          d="M 118 245 Q 150 236 182 245 L 190 262 Q 150 268 110 262 Z"
          fill={color}
          fillOpacity="0.75"
        />

        {/* Ondas del agua del lago */}
        <path d="M 95 266 Q 120 260 150 266 Q 180 272 205 266" strokeWidth="1.8" />
        <path d="M 105 272 Q 130 267 150 272 Q 170 277 195 272" strokeWidth="1.4" />

        {/* Ramas de laurel y encino unidas con listón tricolor */}
        {/* Rama izquierda (encino) */}
        <path
          d="M 150 282 C 105 278, 65 240, 52 180"
          strokeWidth="2.4"
        />
        <ellipse cx="58" cy="210" rx="7" ry="3.5" fill={color} fillOpacity="0.6" transform="rotate(-35 58 210)" />
        <ellipse cx="70" cy="235" rx="7" ry="3.5" fill={color} fillOpacity="0.6" transform="rotate(-25 70 235)" />
        <ellipse cx="90" cy="258" rx="7" ry="3.5" fill={color} fillOpacity="0.6" transform="rotate(-15 90 258)" />

        {/* Rama derecha (laurel) */}
        <path
          d="M 150 282 C 195 278, 235 240, 248 180"
          strokeWidth="2.4"
        />
        <ellipse cx="242" cy="210" rx="7" ry="3.5" fill={color} fillOpacity="0.6" transform="rotate(35 242 210)" />
        <ellipse cx="230" cy="235" rx="7" ry="3.5" fill={color} fillOpacity="0.6" transform="rotate(25 230 235)" />
        <ellipse cx="210" cy="258" rx="7" ry="3.5" fill={color} fillOpacity="0.6" transform="rotate(15 210 258)" />

        {/* Listón central de unión */}
        <path
          d="M 136 280 Q 150 288 164 280 Q 150 276 136 280 Z"
          fill={color}
        />
        <path d="M 142 284 L 138 295 L 146 292" strokeWidth="1.8" />
        <path d="M 158 284 L 162 295 L 154 292" strokeWidth="1.8" />
      </g>
    </svg>
  );
};
