import React from 'react';

interface OfficialMexicanSealSeekProps {
  className?: string;
  size?: number | string;
  opacity?: number;
  color?: string;
}

/**
 * Escudo Oficial de México (Vector Seeklogo con arco "ESTADOS UNIDOS MEXICANOS")
 * Basado exactamente en la imagen 2 de muestra proporcionada por el usuario.
 */
export const OfficialMexicanSealSeek: React.FC<OfficialMexicanSealSeekProps> = ({
  className = '',
  size = 400,
  opacity = 1,
  color = '#1e293b',
}) => {
  const uniqueId = React.useId().replace(/:/g, '_');

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
      <defs>
        {/* Arco semicircular superior para el texto ESTADOS UNIDOS MEXICANOS */}
        <path
          id={`arcEstados_${uniqueId}`}
          d="M 65 260 A 185 185 0 0 1 435 260"
          fill="none"
        />
      </defs>

      {/* LEYENDA SUPERIOR OFICIAL: ESTADOS UNIDOS MEXICANOS */}
      <text
        fill={color}
        fontSize="25"
        fontWeight="800"
        fontFamily="'Times New Roman', 'Cinzel', serif"
        letterSpacing="6px"
      >
        <textPath href={`#arcEstados_${uniqueId}`} startOffset="50%" textAnchor="middle">
          ESTADOS UNIDOS MEXICANOS
        </textPath>
      </text>

      {/* DETALLES DE LINEWORK GRABADO OFICIAL DEL ÁGUILA (ESTILO VECTOR CDR) */}
      <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* ========================================================= */}
        {/* GUIRNALDA INFERIOR DE RAMAS DE ENCINO Y LAUREL CON LISTÓN */}
        {/* ========================================================= */}
        {/* Tallo rama izquierda (encino con hojas lobuladas y bellotas) */}
        <path d="M 250 445 C 175 435, 105 385, 78 275" strokeWidth="4.5" />
        {/* Hojas de encino izquierda */}
        <path d="M 85 290 C 70 280, 75 265, 92 275" fill={color} fillOpacity="0.85" />
        <path d="M 98 320 C 82 310, 88 295, 106 306" fill={color} fillOpacity="0.85" />
        <path d="M 118 350 C 100 340, 108 322, 128 335" fill={color} fillOpacity="0.85" />
        <path d="M 148 380 C 130 370, 138 352, 160 365" fill={color} fillOpacity="0.85" />
        <path d="M 185 410 C 168 402, 178 385, 200 396" fill={color} fillOpacity="0.85" />
        {/* Bellotas de encino */}
        <ellipse cx="80" cy="285" rx="5" ry="8" fill={color} transform="rotate(-30 80 285)" />
        <ellipse cx="110" cy="340" rx="5" ry="8" fill={color} transform="rotate(-20 110 340)" />
        <ellipse cx="160" cy="395" rx="5" ry="8" fill={color} transform="rotate(-10 160 395)" />

        {/* Tallo rama derecha (laurel con hojas lanceoladas y bayas) */}
        <path d="M 250 445 C 325 435, 395 385, 422 275" strokeWidth="4.5" />
        {/* Hojas de laurel derecha */}
        <path d="M 415 290 C 430 280, 425 265, 408 275" fill={color} fillOpacity="0.85" />
        <path d="M 402 320 C 418 310, 412 295, 394 306" fill={color} fillOpacity="0.85" />
        <path d="M 382 350 C 400 340, 392 322, 372 335" fill={color} fillOpacity="0.85" />
        <path d="M 352 380 C 370 370, 362 352, 340 365" fill={color} fillOpacity="0.85" />
        <path d="M 315 410 C 332 402, 322 385, 300 396" fill={color} fillOpacity="0.85" />
        {/* Bayas de laurel */}
        <circle cx="420" cy="280" r="5" fill={color} />
        <circle cx="390" cy="335" r="5" fill={color} />
        <circle cx="335" cy="390" r="5" fill={color} />

        {/* Moño / Listón tricolor atado al centro */}
        <path
          d="M 230 440 C 242 432, 258 432, 270 440 C 278 452, 268 460, 250 455 C 232 460, 222 452, 230 440 Z"
          fill={color}
        />
        <path d="M 242 454 Q 236 478, 226 492" strokeWidth="3.5" />
        <path d="M 258 454 Q 264 478, 274 492" strokeWidth="3.5" />

        {/* ========================================================= */}
        {/* BASE: ONDAS DEL LAGO, ROCA Y NOPAL CON ESPINAS Y TUNAS */}
        {/* ========================================================= */}
        {/* Ondas del agua de Texcoco */}
        <path d="M 180 432 Q 215 425, 250 432 Q 285 439, 320 432" strokeWidth="3" />
        <path d="M 200 442 Q 230 436, 250 442 Q 270 448, 300 442" strokeWidth="2.5" />

        {/* Piedra o peñón */}
        <path
          d="M 195 398 Q 250 388, 305 398 L 318 424 Q 250 432, 182 424 Z"
          fill={color}
          fillOpacity="0.2"
          strokeWidth="3.2"
        />

        {/* Pencas de nopal (cactus) */}
        <ellipse cx="250" cy="365" rx="34" ry="20" fill={color} fillOpacity="0.2" strokeWidth="2.8" />
        <ellipse cx="218" cy="374" rx="26" ry="17" fill={color} fillOpacity="0.15" strokeWidth="2.6" transform="rotate(-22 218 374)" />
        <ellipse cx="282" cy="374" rx="26" ry="17" fill={color} fillOpacity="0.15" strokeWidth="2.6" transform="rotate(22 282 374)" />
        <ellipse cx="198" cy="352" rx="24" ry="15" fill={color} fillOpacity="0.15" strokeWidth="2.6" transform="rotate(-38 198 352)" />
        <ellipse cx="302" cy="352" rx="24" ry="15" fill={color} fillOpacity="0.15" strokeWidth="2.6" transform="rotate(38 302 352)" />

        {/* Tunas (frutos) */}
        <circle cx="178" cy="346" r="5" fill={color} />
        <circle cx="198" cy="336" r="5" fill={color} />
        <circle cx="298" cy="336" r="5" fill={color} />
        <circle cx="320" cy="346" r="5" fill={color} />
        <circle cx="250" cy="342" r="5.5" fill={color} />

        {/* Espinas del nopal */}
        <line x1="236" y1="360" x2="232" y2="354" strokeWidth="2" />
        <line x1="250" y1="355" x2="250" y2="349" strokeWidth="2" />
        <line x1="264" y1="360" x2="268" y2="354" strokeWidth="2" />
        <line x1="210" y1="370" x2="204" y2="366" strokeWidth="2" />
        <line x1="290" y1="370" x2="296" y2="366" strokeWidth="2" />

        {/* ========================================================= */}
        {/* SERPIENTE DE CASCABEL EN ONDAS DEVORADA POR EL ÁGUILA */}
        {/* ========================================================= */}
        <path
          d="M 182 170 C 160 188, 158 222, 180 238 C 205 252, 230 232, 246 252 C 262 270, 246 304, 226 312 C 210 320, 202 338, 214 355"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Escamas de la serpiente */}
        <path
          d="M 182 170 C 160 188, 158 222, 180 238 C 205 252, 230 232, 246 252 C 262 270, 246 304, 226 312 C 210 320, 202 338, 214 355"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeDasharray="4 4"
        />
        {/* Cabeza de la serpiente atrapada en el pico */}
        <circle cx="170" cy="180" r="6" fill={color} />
        {/* Cascabel de la serpiente */}
        <circle cx="216" cy="358" r="4.5" fill={color} />
        <circle cx="218" cy="365" r="3.5" fill={color} />

        {/* ========================================================= */}
        {/* GARRAS DEL ÁGUILA REAL */}
        {/* ========================================================= */}
        {/* Garra izquierda apoyada en el nopal */}
        <g strokeWidth="3.5" strokeLinecap="round">
          <line x1="240" y1="338" x2="228" y2="350" />
          <line x1="242" y1="338" x2="238" y2="354" />
          <line x1="248" y1="338" x2="252" y2="353" />
        </g>
        {/* Garra derecha apresando a la serpiente */}
        <g strokeWidth="3.5" strokeLinecap="round">
          <line x1="214" y1="294" x2="200" y2="304" />
          <line x1="216" y1="294" x2="212" y2="310" />
          <line x1="222" y1="294" x2="228" y2="308" />
        </g>

        {/* ========================================================= */}
        {/* CUERPO Y COLA DEL ÁGUILA REAL MEXICANA */}
        {/* ========================================================= */}
        {/* Pecho y plumaje del torso */}
        <path
          d="M 225 205 C 214 238, 218 282, 230 318 C 238 335, 256 335, 265 318 C 275 282, 278 238, 268 205 Z"
          fill={color}
          fillOpacity="0.2"
          strokeWidth="3"
        />
        {/* Filas de plumas en U sobre el pecho */}
        <path d="M 235 228 Q 246 238, 258 228" strokeWidth="2.5" />
        <path d="M 232 250 Q 246 262, 260 250" strokeWidth="2.5" />
        <path d="M 230 272 Q 246 284, 262 272" strokeWidth="2.5" />
        <path d="M 232 295 Q 247 305, 262 295" strokeWidth="2.5" />

        {/* Cola plumada descendente */}
        <path
          d="M 238 318 L 225 372 L 248 380 L 268 372 L 258 318 Z"
          fill={color}
          fillOpacity="0.3"
          strokeWidth="2.8"
        />
        <line x1="234" y1="326" x2="230" y2="370" strokeWidth="2" />
        <line x1="245" y1="326" x2="245" y2="378" strokeWidth="2" />
        <line x1="256" y1="326" x2="260" y2="370" strokeWidth="2" />

        {/* ========================================================= */}
        {/* ALA PRINCIPAL DESPLEGADA EN ARCO CON PLUMAJE GRABADO */}
        {/* ========================================================= */}
        <path
          d="M 248 155 C 224 105, 172 88, 114 108 C 146 138, 176 178, 200 220 C 218 252, 232 284, 240 315 C 246 284, 248 220, 248 155 Z"
          fill={color}
          fillOpacity="0.18"
          strokeWidth="3.2"
        />

        {/* Remeras (plumas primarias y secundarias delineadas) */}
        <g strokeWidth="2.6">
          <path d="M 116 110 C 136 142, 156 178, 174 218 L 164 214 C 146 176, 128 140, 108 114 Z" fill={color} fillOpacity="0.8" />
          <path d="M 134 104 C 154 142, 174 182, 192 226 L 182 222 C 164 180, 146 142, 126 108 Z" fill={color} fillOpacity="0.8" />
          <path d="M 154 102 C 172 144, 192 190, 210 236 L 200 232 C 182 188, 164 144, 146 106 Z" fill={color} fillOpacity="0.8" />
          <path d="M 176 104 C 192 148, 210 196, 226 246 L 218 244 C 202 196, 184 150, 170 110 Z" fill={color} fillOpacity="0.8" />
          <path d="M 200 112 C 212 154, 226 200, 238 254 L 230 252 C 218 200, 206 156, 194 118 Z" fill={color} fillOpacity="0.8" />
          <path d="M 224 125 C 232 160, 240 205, 246 256 L 240 254 C 234 205, 226 162, 218 130 Z" fill={color} fillOpacity="0.8" />
        </g>

        {/* Ala derecha (posterior visible) */}
        <path
          d="M 252 155 C 276 110, 326 98, 374 116 C 345 142, 316 180, 295 220 C 278 248, 268 280, 260 306 C 256 270, 254 205, 252 155 Z"
          fill={color}
          fillOpacity="0.12"
          strokeWidth="2.8"
        />
        <path d="M 370 118 C 345 152, 316 190, 296 230" strokeWidth="2.2" />
        <path d="M 350 110 C 328 148, 302 190, 284 235" strokeWidth="2.2" />
        <path d="M 324 104 C 304 144, 286 190, 274 238" strokeWidth="2.2" />

        {/* ========================================================= */}
        {/* CABEZA DEL ÁGUILA EN PERFIL */}
        {/* ========================================================= */}
        {/* Cuello y cabeza con plumaje de nuca erizado */}
        <path
          d="M 248 160 C 238 148, 228 135, 212 138 C 198 140, 188 150, 178 152 C 170 155, 162 160, 168 168 C 172 172, 182 172, 190 170 C 200 180, 215 192, 228 198 Z"
          fill={color}
          fillOpacity="0.3"
          strokeWidth="3"
        />
        {/* Pico ganchudo con colmillo apresando la serpiente */}
        <path
          d="M 178 153 Q 160 156 162 172 Q 176 168 184 167 Z"
          fill={color}
          strokeWidth="2.2"
        />
        {/* Cresta plumada de la nuca */}
        <path
          d="M 212 138 L 206 128 L 218 135 L 215 125 L 225 135 L 228 125 L 232 138"
          strokeWidth="2.8"
          fill={color}
        />
        {/* Ojo del águila */}
        <circle cx="198" cy="152" r="4.2" fill="#ffffff" strokeWidth="2" />
        <circle cx="197" cy="152" r="2.2" fill={color} />
      </g>
    </svg>
  );
};
