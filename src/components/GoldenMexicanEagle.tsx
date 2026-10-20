import React from 'react';

interface GoldenMexicanEagleProps {
  className?: string;
  size?: number | string;
  opacity?: number;
  grayscale?: boolean;
}

/**
 * Escudo Nacional Mexicano en Oro (Águila Real Dorada)
 * Reproducción vectorizada con degradados de oro repujado,
 * águila real devorando la serpiente sobre nopal y guirnalda de laurel y encino.
 */
export const GoldenMexicanEagle: React.FC<GoldenMexicanEagleProps> = ({
  className = '',
  size = 50,
  opacity = 1,
  grayscale = false,
}) => {
  const uniqueId = React.useId().replace(/:/g, '_');

  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      style={{ opacity, filter: grayscale ? 'grayscale(100%)' : undefined }}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Degradados dorados metálicos para efecto de relieve en oro */}
        <linearGradient id={`goldPrimary_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#eab308" />
          <stop offset="50%" stopColor="#ca8a04" />
          <stop offset="75%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>

        <linearGradient id={`goldWing_${uniqueId}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="30%" stopColor="#eab308" />
          <stop offset="70%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>

        <linearGradient id={`goldDark_${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>

        <linearGradient id={`goldHighlight_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        <filter id={`goldShine_${uniqueId}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#713f12" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter={`url(#goldShine_${uniqueId})`}>
        {/* ========================================== */}
        {/* 1. GUIRNALDA INFERIOR DE LAUREL Y ENCINO EN ORO */}
        {/* ========================================== */}
        {/* Tallos de la guirnalda */}
        <path
          d="M 200 348 C 145 342, 95 305, 82 225"
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 200 348 C 255 342, 305 305, 318 225"
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Hojas y bellotas de encino (izquierda) */}
        <g fill={`url(#goldPrimary_${uniqueId})`} stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1">
          <path d="M 86 240 Q 72 230 84 220 Q 95 230 86 240 Z" />
          <path d="M 96 265 Q 82 255 94 245 Q 105 255 96 265 Z" />
          <path d="M 112 288 Q 98 278 110 268 Q 122 278 112 288 Z" />
          <path d="M 132 310 Q 118 302 128 290 Q 140 300 132 310 Z" />
          <path d="M 158 328 Q 144 322 152 310 Q 166 318 158 328 Z" />
          <path d="M 184 340 Q 172 336 178 324 Q 190 330 184 340 Z" />
          {/* Bellotas doradas */}
          <ellipse cx="78" cy="235" rx="4" ry="6" fill={`url(#goldWing_${uniqueId})`} transform="rotate(-30 78 235)" />
          <ellipse cx="104" cy="280" rx="4" ry="6" fill={`url(#goldWing_${uniqueId})`} transform="rotate(-20 104 280)" />
          <ellipse cx="145" cy="320" rx="4" ry="6" fill={`url(#goldWing_${uniqueId})`} transform="rotate(-10 145 320)" />
        </g>

        {/* Hojas y frutos de laurel (derecha) */}
        <g fill={`url(#goldPrimary_${uniqueId})`} stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1">
          <path d="M 314 240 Q 328 230 316 220 Q 305 230 314 240 Z" />
          <path d="M 304 265 Q 318 255 306 245 Q 295 255 304 265 Z" />
          <path d="M 288 288 Q 302 278 290 268 Q 278 278 288 288 Z" />
          <path d="M 268 310 Q 282 302 272 290 Q 260 300 268 310 Z" />
          <path d="M 242 328 Q 256 322 248 310 Q 234 318 242 328 Z" />
          <path d="M 216 340 Q 228 336 222 324 Q 210 330 216 340 Z" />
          {/* Bayas de laurel */}
          <circle cx="320" cy="230" r="3.5" fill={`url(#goldWing_${uniqueId})`} />
          <circle cx="295" cy="275" r="3.5" fill={`url(#goldWing_${uniqueId})`} />
          <circle cx="255" cy="316" r="3.5" fill={`url(#goldWing_${uniqueId})`} />
        </g>

        {/* Listón tricolor atado al centro en oro */}
        <path
          d="M 186 345 C 195 340, 205 340, 214 345 C 220 354, 212 360, 200 357 C 188 360, 180 354, 186 345 Z"
          fill={`url(#goldHighlight_${uniqueId})`}
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.2"
        />
        <path
          d="M 194 356 Q 190 375 182 385 L 190 384 Q 197 372 198 357 Z"
          fill={`url(#goldPrimary_${uniqueId})`}
        />
        <path
          d="M 206 356 Q 210 375 218 385 L 210 384 Q 203 372 202 357 Z"
          fill={`url(#goldPrimary_${uniqueId})`}
        />

        {/* ========================================== */}
        {/* 2. BASE: LAGO, ROCA Y NOPAL CON TUNAS EN ORO */}
        {/* ========================================== */}
        {/* Ondas del lago en la base */}
        <path
          d="M 140 335 Q 170 330 200 335 Q 230 340 260 335"
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 155 342 Q 180 338 200 342 Q 220 346 245 342"
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Peña o islote sobre el agua */}
        <path
          d="M 160 310 Q 200 302 240 310 L 250 330 Q 200 336 150 330 Z"
          fill={`url(#goldPrimary_${uniqueId})`}
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.5"
        />

        {/* Pencas de nopal (cactus) */}
        <ellipse
          cx="200"
          cy="285"
          rx="25"
          ry="15"
          fill={`url(#goldWing_${uniqueId})`}
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.4"
        />
        <ellipse
          cx="175"
          cy="292"
          rx="20"
          ry="13"
          fill={`url(#goldPrimary_${uniqueId})`}
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.4"
          transform="rotate(-20 175 292)"
        />
        <ellipse
          cx="225"
          cy="292"
          rx="20"
          ry="13"
          fill={`url(#goldPrimary_${uniqueId})`}
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.4"
          transform="rotate(20 225 292)"
        />
        <ellipse
          cx="160"
          cy="275"
          rx="18"
          ry="11"
          fill={`url(#goldPrimary_${uniqueId})`}
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.4"
          transform="rotate(-35 160 275)"
        />
        <ellipse
          cx="240"
          cy="275"
          rx="18"
          ry="11"
          fill={`url(#goldPrimary_${uniqueId})`}
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.4"
          transform="rotate(35 240 275)"
        />

        {/* Tunas rojas/doradas en las pencas */}
        <ellipse cx="145" cy="270" rx="4.5" ry="3" fill={`url(#goldHighlight_${uniqueId})`} />
        <ellipse cx="160" cy="262" rx="4.5" ry="3" fill={`url(#goldHighlight_${uniqueId})`} />
        <ellipse cx="238" cy="262" rx="4.5" ry="3" fill={`url(#goldHighlight_${uniqueId})`} />
        <ellipse cx="254" cy="270" rx="4.5" ry="3" fill={`url(#goldHighlight_${uniqueId})`} />
        <ellipse cx="200" cy="268" rx="5" ry="3.5" fill={`url(#goldHighlight_${uniqueId})`} />

        {/* ========================================== */}
        {/* 3. SERPIENTE DE CASCABEL EN ORO */}
        {/* ========================================== */}
        <path
          d="M 148 135 C 130 148, 128 175, 145 188 C 165 198, 185 182, 198 198 C 210 212, 198 238, 182 245 C 170 250, 162 265, 172 278"
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 148 135 C 130 148, 128 175, 145 188 C 165 198, 185 182, 198 198 C 210 212, 198 238, 182 245 C 170 250, 162 265, 172 278"
          stroke={`url(#goldHighlight_${uniqueId})`}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Cabeza de la serpiente cerca del pico del águila */}
        <ellipse cx="138" cy="144" rx="5" ry="4" fill={`url(#goldDark_${uniqueId})`} />
        {/* Cascabel en la cola de la serpiente */}
        <circle cx="173" cy="280" r="3.5" fill={`url(#goldPrimary_${uniqueId})`} stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1" />
        <circle cx="175" cy="285" r="2.8" fill={`url(#goldPrimary_${uniqueId})`} stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1" />

        {/* ========================================== */}
        {/* 4. GARRAS DEL ÁGUILA EN ORO */}
        {/* ========================================== */}
        {/* Garra izquierda posada firme sobre la penca de nopal */}
        <g stroke={`url(#goldDark_${uniqueId})`} strokeWidth="2.5" strokeLinecap="round">
          <line x1="192" y1="264" x2="182" y2="274" />
          <line x1="194" y1="264" x2="190" y2="277" />
          <line x1="198" y1="264" x2="202" y2="276" />
        </g>
        {/* Garra derecha en alto aprisionando a la serpiente */}
        <g stroke={`url(#goldDark_${uniqueId})`} strokeWidth="2.5" strokeLinecap="round">
          <line x1="172" y1="230" x2="162" y2="238" />
          <line x1="174" y1="230" x2="170" y2="242" />
          <line x1="178" y1="230" x2="182" y2="241" />
        </g>

        {/* ========================================== */}
        {/* 5. CUERPO Y COLA DEL ÁGUILA REAL */}
        {/* ========================================== */}
        {/* Pecho y plumaje del cuerpo */}
        <path
          d="M 180 160 C 172 185, 175 220, 185 248 C 190 262, 205 262, 212 248 C 220 220, 222 185, 215 160 Z"
          fill={`url(#goldPrimary_${uniqueId})`}
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.6"
        />

        {/* Cola en abanico descendente */}
        <path
          d="M 190 248 L 180 290 L 198 296 L 214 290 L 206 248 Z"
          fill={`url(#goldWing_${uniqueId})`}
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.5"
        />
        <line x1="188" y1="255" x2="185" y2="290" stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1.2" />
        <line x1="196" y1="255" x2="196" y2="294" stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1.2" />
        <line x1="204" y1="255" x2="207" y2="290" stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1.2" />

        {/* Texturas de plumas en el pecho */}
        <path d="M 188 178 Q 196 186 204 178" stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1.2" fill="none" />
        <path d="M 186 195 Q 196 204 206 195" stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1.2" fill="none" />
        <path d="M 185 212 Q 196 222 208 212" stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1.2" fill="none" />
        <path d="M 186 230 Q 197 238 207 230" stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1.2" fill="none" />

        {/* ========================================== */}
        {/* 6. ALA IZQUIERDA DESPLEGADA EN ARCO DORADO */}
        {/* ========================================== */}
        {/* Silueta principal del ala izquierda extendida */}
        <path
          d="M 198 120 C 180 82, 138 68, 92 84 C 118 108, 142 138, 160 170 C 174 195, 185 220, 192 245 C 196 220, 198 170, 198 120 Z"
          fill={`url(#goldWing_${uniqueId})`}
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.6"
        />

        {/* Plumas primarias y secundarias del ala */}
        <g stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1.4" fill={`url(#goldPrimary_${uniqueId})`}>
          <path d="M 94 85 C 110 110, 126 138, 140 168 L 132 165 C 118 135, 104 108, 88 88 Z" />
          <path d="M 108 81 C 124 110, 140 142, 154 176 L 146 173 C 132 140, 118 110, 102 84 Z" />
          <path d="M 124 80 C 138 112, 154 148, 168 184 L 160 181 C 146 148, 132 114, 118 84 Z" />
          <path d="M 142 82 C 154 116, 168 152, 180 192 L 174 190 C 162 152, 148 118, 136 86 Z" />
          <path d="M 160 88 C 170 120, 180 156, 190 198 L 184 196 C 174 156, 164 122, 154 92 Z" />
          <path d="M 178 98 C 185 125, 192 160, 196 200 L 192 198 C 188 160, 182 126, 174 102 Z" />
        </g>

        {/* Borde superior resplandeciente del ala */}
        <path
          d="M 92 84 C 138 68, 180 82, 198 120"
          stroke={`url(#goldHighlight_${uniqueId})`}
          strokeWidth="2.5"
          fill="none"
        />

        {/* Ala derecha (parcialmente visible detrás) */}
        <path
          d="M 200 120 C 220 85, 260 76, 298 90 C 275 110, 252 140, 235 170 C 222 192, 214 216, 208 238 C 205 210, 202 160, 200 120 Z"
          fill={`url(#goldDark_${uniqueId})`}
          opacity="0.9"
          stroke={`url(#goldPrimary_${uniqueId})`}
          strokeWidth="1.2"
        />
        {/* Plumas del ala posterior */}
        <path d="M 295 92 C 275 118, 252 148, 236 178" stroke={`url(#goldPrimary_${uniqueId})`} strokeWidth="1.3" />
        <path d="M 278 86 C 260 115, 240 148, 226 182" stroke={`url(#goldPrimary_${uniqueId})`} strokeWidth="1.3" />
        <path d="M 258 82 C 242 112, 228 148, 218 185" stroke={`url(#goldPrimary_${uniqueId})`} strokeWidth="1.3" />

        {/* ========================================== */}
        {/* 7. CABEZA DEL ÁGUILA EN PERFIL */}
        {/* ========================================== */}
        {/* Cabeza y cuello */}
        <path
          d="M 198 124 C 190 114, 182 104, 170 106 C 158 108, 150 116, 142 118 C 136 120, 130 124, 134 130 C 138 134, 146 134, 152 132 C 160 140, 172 150, 182 155 Z"
          fill={`url(#goldHighlight_${uniqueId})`}
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.5"
        />

        {/* Pico ganchudo fuerte aprisionando la serpiente */}
        <path
          d="M 142 119 Q 128 122 130 134 Q 140 131 146 130 Z"
          fill={`url(#goldDark_${uniqueId})`}
          stroke={`url(#goldHighlight_${uniqueId})`}
          strokeWidth="1"
        />

        {/* Cresta de plumas erizadas en la nuca */}
        <path
          d="M 170 106 L 165 98 L 175 104 L 172 96 L 180 104 L 182 96 L 186 106"
          stroke={`url(#goldDark_${uniqueId})`}
          strokeWidth="1.6"
          fill={`url(#goldHighlight_${uniqueId})`}
        />

        {/* Ojo del águila */}
        <circle cx="156" cy="118" r="3.2" fill="#ffffff" stroke={`url(#goldDark_${uniqueId})`} strokeWidth="1" />
        <circle cx="155.5" cy="118" r="1.8" fill={`url(#goldDark_${uniqueId})`} />
        <circle cx="155" cy="117.5" r="0.8" fill="#ffffff" />
      </g>
    </svg>
  );
};
