import React from 'react';

interface OfficialMexicanColorEmblemProps {
  className?: string;
  size?: number | string;
  opacity?: number;
}

/**
 * Escudo Nacional Mexicano a Todo Color
 * Basado en la imagen 1 de muestra proporcionada por el usuario
 * (Águila real café dorada, nopal verde con tunas rojas, serpiente y guirnalda patrio verde/rojo/blanco).
 */
export const OfficialMexicanColorEmblem: React.FC<OfficialMexicanColorEmblemProps> = ({
  className = '',
  size = 400,
  opacity = 1,
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      width={size}
      height={size}
      style={{ opacity }}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ========================================================= */}
      {/* 1. GUIRNALDA INFERIOR DE ENCINO Y LAUREL (VERDES) */}
      {/* ========================================================= */}
      {/* Ramas verde olivo */}
      <path
        d="M 250 435 C 180 425, 115 375, 90 270"
        stroke="#2e7d32"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 250 435 C 320 425, 385 375, 410 270"
        stroke="#2e7d32"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Hojas verdes de encino (izquierda) */}
      <g fill="#43a047" stroke="#1b5e20" strokeWidth="1">
        <path d="M 96 285 C 80 275, 85 260, 104 270 Z" />
        <path d="M 110 315 C 92 305, 98 290, 118 300 Z" />
        <path d="M 130 345 C 112 335, 120 318, 140 330 Z" />
        <path d="M 160 375 C 142 365, 150 348, 172 360 Z" />
        <path d="M 195 405 C 178 396, 188 380, 210 392 Z" />
        {/* Bellotas doradas */}
        <ellipse cx="90" cy="280" rx="4" ry="7" fill="#c0ca33" transform="rotate(-30 90 280)" />
        <ellipse cx="120" cy="335" rx="4" ry="7" fill="#c0ca33" transform="rotate(-20 120 335)" />
        <ellipse cx="170" cy="390" rx="4" ry="7" fill="#c0ca33" transform="rotate(-10 170 390)" />
      </g>

      {/* Hojas verdes de laurel (derecha) */}
      <g fill="#43a047" stroke="#1b5e20" strokeWidth="1">
        <path d="M 404 285 C 420 275, 415 260, 396 270 Z" />
        <path d="M 390 315 C 408 305, 402 290, 382 300 Z" />
        <path d="M 370 345 C 388 335, 380 318, 360 330 Z" />
        <path d="M 340 375 C 358 365, 350 348, 328 360 Z" />
        <path d="M 305 405 C 322 396, 312 380, 290 392 Z" />
        {/* Frutos de laurel rojos */}
        <circle cx="410" cy="275" r="4.5" fill="#c62828" />
        <circle cx="380" cy="330" r="4.5" fill="#c62828" />
        <circle cx="325" cy="385" r="4.5" fill="#c62828" />
      </g>

      {/* Listón tricolor patrio (Verde, Blanco, Rojo) */}
      <g>
        <path d="M 235 432 Q 250 422 265 432 L 260 442 Q 250 435 240 442 Z" fill="#2e7d32" />
        <path d="M 242 435 Q 250 428 258 435 L 255 444 Q 250 438 245 444 Z" fill="#ffffff" stroke="#ccc" strokeWidth="0.5" />
        <path d="M 248 436 Q 250 430 252 436 L 250 445 Z" fill="#c62828" />

        {/* Cintas colgantes */}
        <path d="M 242 444 Q 235 468 224 485 L 230 484 Q 240 466 244 445 Z" fill="#2e7d32" />
        <path d="M 258 444 Q 265 468 276 485 L 270 484 Q 260 466 256 445 Z" fill="#c62828" />
      </g>

      {/* ========================================================= */}
      {/* 2. BASE: AGUA AZUL, GLIFO / ISLOTE DORADO Y NOPAL VERDE */}
      {/* ========================================================= */}
      {/* Ondas del agua azul celeste */}
      <path d="M 170 415 Q 210 405 250 415 Q 290 425 330 415" stroke="#0288d1" strokeWidth="3.5" fill="none" />
      <path d="M 190 424 Q 220 416 250 424 Q 280 432 310 424" stroke="#0288d1" strokeWidth="2.5" fill="none" />

      {/* Islote / Peña dorada */}
      <path
        d="M 195 385 Q 250 375 305 385 L 318 412 Q 250 420 182 412 Z"
        fill="#fbc02d"
        stroke="#f57f17"
        strokeWidth="2"
      />

      {/* Pencas de nopal verdes con espinas */}
      <ellipse cx="250" cy="350" rx="34" ry="19" fill="#388e3c" stroke="#1b5e20" strokeWidth="1.5" />
      <ellipse cx="218" cy="360" rx="26" ry="16" fill="#43a047" stroke="#1b5e20" strokeWidth="1.5" transform="rotate(-20 218 360)" />
      <ellipse cx="282" cy="360" rx="26" ry="16" fill="#43a047" stroke="#1b5e20" strokeWidth="1.5" transform="rotate(20 282 360)" />
      <ellipse cx="198" cy="338" rx="24" ry="14" fill="#4caf50" stroke="#1b5e20" strokeWidth="1.5" transform="rotate(-35 198 338)" />
      <ellipse cx="302" cy="338" rx="24" ry="14" fill="#4caf50" stroke="#1b5e20" strokeWidth="1.5" transform="rotate(35 302 338)" />

      {/* Tunas rojas en las pencas */}
      <circle cx="178" cy="332" r="5" fill="#d32f2f" stroke="#b71c1c" strokeWidth="1" />
      <circle cx="198" cy="322" r="5" fill="#d32f2f" stroke="#b71c1c" strokeWidth="1" />
      <circle cx="298" cy="322" r="5" fill="#d32f2f" stroke="#b71c1c" strokeWidth="1" />
      <circle cx="320" cy="332" r="5" fill="#d32f2f" stroke="#b71c1c" strokeWidth="1" />
      <circle cx="250" cy="328" r="5.5" fill="#d32f2f" stroke="#b71c1c" strokeWidth="1" />

      {/* ========================================================= */}
      {/* 3. SERPIENTE VERDE CLARO DEVORADA */}
      {/* ========================================================= */}
      <path
        d="M 182 155 C 160 172, 158 208, 180 224 C 205 238, 230 218, 246 238 C 262 256, 246 290, 226 298 C 210 306, 202 324, 214 340"
        stroke="#7cb342"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Vientre amarillo claro de la serpiente */}
      <path
        d="M 182 155 C 160 172, 158 208, 180 224 C 205 238, 230 218, 246 238 C 262 256, 246 290, 226 298 C 210 306, 202 324, 214 340"
        stroke="#fff59d"
        strokeWidth="2"
        strokeDasharray="4 3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="170" cy="165" r="5" fill="#689f38" />

      {/* ========================================================= */}
      {/* 4. ÁGUILA REAL MEXICANA (CAFÉ / DORADA) */}
      {/* ========================================================= */}
      {/* Garras amarillas */}
      <g stroke="#f57f17" strokeWidth="3" strokeLinecap="round">
        <line x1="240" y1="324" x2="228" y2="336" />
        <line x1="242" y1="324" x2="238" y2="340" />
        <line x1="248" y1="324" x2="252" y2="339" />
        <line x1="214" y1="280" x2="200" y2="290" />
        <line x1="216" y1="280" x2="212" y2="296" />
        <line x1="222" y1="280" x2="228" y2="294" />
      </g>

      {/* Cuerpo café / ocre */}
      <path
        d="M 225 190 C 214 225, 218 268, 230 304 C 238 320, 256 320, 265 304 C 275 268, 278 225, 268 190 Z"
        fill="#6d4c41"
        stroke="#4e342e"
        strokeWidth="2"
      />

      {/* Cola plumada café */}
      <path
        d="M 238 304 L 225 358 L 248 366 L 268 358 L 258 304 Z"
        fill="#5d4037"
        stroke="#3e2723"
        strokeWidth="2"
      />

      {/* Ala izquierda desplegada en arco (café y plumas doradas) */}
      <path
        d="M 248 140 C 224 90, 172 72, 114 92 C 146 122, 176 162, 200 204 C 218 236, 232 268, 240 300 C 246 268, 248 204, 248 140 Z"
        fill="#8d6e63"
        stroke="#4e342e"
        strokeWidth="2"
      />
      {/* Plumas primarias marrón oscuro */}
      <g stroke="#3e2723" strokeWidth="2" fill="#5d4037">
        <path d="M 116 94 C 136 126, 156 162, 174 202 L 164 198 C 146 160, 128 124, 108 98 Z" />
        <path d="M 134 88 C 154 126, 174 166, 192 210 L 182 206 C 164 164, 146 126, 126 92 Z" />
        <path d="M 154 86 C 172 128, 192 174, 210 220 L 200 216 C 182 172, 164 128, 146 90 Z" />
        <path d="M 176 88 C 192 132, 210 180, 226 230 L 218 228 C 202 180, 184 134, 170 94 Z" />
        <path d="M 200 96 C 212 138, 226 184, 238 238 L 230 236 C 218 184, 206 140, 194 102 Z" />
      </g>

      {/* Ala derecha detrás */}
      <path
        d="M 252 140 C 276 95, 326 82, 374 100 C 345 126, 316 164, 295 204 C 278 232, 268 264, 260 290 C 256 254, 254 190, 252 140 Z"
        fill="#4e342e"
        stroke="#3e2723"
        strokeWidth="2"
      />

      {/* Cabeza del águila dorada/café */}
      <path
        d="M 248 145 C 238 132, 228 120, 212 122 C 198 124, 188 134, 178 136 C 170 140, 162 144, 168 152 C 172 156, 182 156, 190 154 C 200 164, 215 176, 228 182 Z"
        fill="#d7ccc8"
        stroke="#4e342e"
        strokeWidth="2"
      />
      {/* Pico amarillo ganchudo */}
      <path
        d="M 178 137 Q 160 140 162 156 Q 176 152 184 151 Z"
        fill="#fbc02d"
        stroke="#f57f17"
        strokeWidth="1.5"
      />
      {/* Ojo del águila */}
      <circle cx="198" cy="136" r="3.5" fill="#ffffff" />
      <circle cx="197" cy="136" r="1.8" fill="#212121" />
    </svg>
  );
};
