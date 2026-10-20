interface GuillocheSecurityBorderProps {
  backgroundColor?: string;
}

/**
 * Marco perimetral de alta seguridad con cenefa guilloché verde olivo/jade
 * y escudo precolombino alado en el centro superior, idéntico al modelo de
 * Certificado Digital SEP - DGB Centenario.
 */
export const GuillocheSecurityBorder: React.FC<GuillocheSecurityBorderProps> = ({
  backgroundColor = '#ffffff',
}) => {
  return (
    <div className="absolute inset-[3mm] pointer-events-none z-20">
      {/* CONTENEDOR DEL MARCO ORLADO DE SEGURIDAD */}
      <div className="w-full h-full relative border-[3px] border-[#1b4332] rounded-xs">
        {/* LÍNEA INTERIOR FINA */}
        <div className="absolute inset-[1.5mm] border-[0.8px] border-[#2d6a4f]" />

        {/* CENEFA GEOMÉTRICA DE REPETICIÓN PERIMETRAL (GUILLOCHÉ DE SEGURIDAD) */}
        {/* Borde Superior */}
        <div className="absolute top-[0.5mm] left-[4mm] right-[4mm] h-[2mm] flex items-center justify-between overflow-hidden opacity-80">
          <svg className="w-full h-full" viewBox="0 0 1000 10" preserveAspectRatio="none">
            <path
              d="M0,5 Q25,0 50,5 T100,5 T150,5 T200,5 T250,5 T300,5 T350,5 T400,5 T450,5 T500,5 T550,5 T600,5 T650,5 T700,5 T750,5 T800,5 T850,5 T900,5 T950,5 T1000,5"
              fill="none"
              stroke="#2d6a4f"
              strokeWidth="1.5"
            />
            <path
              d="M0,5 Q25,10 50,5 T100,5 T150,5 T200,5 T250,5 T300,5 T350,5 T400,5 T450,5 T500,5 T550,5 T600,5 T650,5 T700,5 T750,5 T800,5 T850,5 T900,5 T950,5 T1000,5"
              fill="none"
              stroke="#1b4332"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* Borde Inferior */}
        <div className="absolute bottom-[0.5mm] left-[4mm] right-[4mm] h-[2mm] flex items-center justify-between overflow-hidden opacity-80">
          <svg className="w-full h-full" viewBox="0 0 1000 10" preserveAspectRatio="none">
            <path
              d="M0,5 Q25,0 50,5 T100,5 T150,5 T200,5 T250,5 T300,5 T350,5 T400,5 T450,5 T500,5 T550,5 T600,5 T650,5 T700,5 T750,5 T800,5 T850,5 T900,5 T950,5 T1000,5"
              fill="none"
              stroke="#2d6a4f"
              strokeWidth="1.5"
            />
            <path
              d="M0,5 Q25,10 50,5 T100,5 T150,5 T200,5 T250,5 T300,5 T350,5 T400,5 T450,5 T500,5 T550,5 T600,5 T650,5 T700,5 T750,5 T800,5 T850,5 T900,5 T950,5 T1000,5"
              fill="none"
              stroke="#1b4332"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* Borde Izquierdo */}
        <div className="absolute top-[4mm] bottom-[4mm] left-[0.5mm] w-[2mm] overflow-hidden opacity-80">
          <svg className="w-full h-full" viewBox="0 0 10 1000" preserveAspectRatio="none">
            <path
              d="M5,0 Q0,25 5,50 T5,100 T5,150 T5,200 T5,250 T5,300 T5,350 T5,400 T5,450 T5,500 T5,550 T5,600 T5,650 T5,700 T5,750 T5,800 T5,850 T5,900 T5,950 T5,1000"
              fill="none"
              stroke="#2d6a4f"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Borde Derecho */}
        <div className="absolute top-[4mm] bottom-[4mm] right-[0.5mm] w-[2mm] overflow-hidden opacity-80">
          <svg className="w-full h-full" viewBox="0 0 10 1000" preserveAspectRatio="none">
            <path
              d="M5,0 Q10,25 5,50 T5,100 T5,150 T5,200 T5,250 T5,300 T5,350 T5,400 T5,450 T5,500 T5,550 T5,600 T5,650 T5,700 T5,750 T5,800 T5,850 T5,900 T5,950 T5,1000"
              fill="none"
              stroke="#2d6a4f"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* ESQUINEROS ORNAMENTALES GRABADOS */}
        <div className="absolute top-[1mm] left-[1mm] w-3 h-3 border-t-2 border-l-2 border-[#1b4332]" />
        <div className="absolute top-[1mm] right-[1mm] w-3 h-3 border-t-2 border-r-2 border-[#1b4332]" />
        <div className="absolute bottom-[1mm] left-[1mm] w-3 h-3 border-b-2 border-l-2 border-[#1b4332]" />
        <div className="absolute bottom-[1mm] right-[1mm] w-3 h-3 border-b-2 border-r-2 border-[#1b4332]" />

        {/* CRESTA SUPERIOR ALADA PRECOLOMBINA CON ESCUDO NACIONAL EN VERDE */}
        <div
          style={{ backgroundColor }}
          className="absolute -top-[12px] left-1/2 -translate-x-1/2 px-2 flex items-center justify-center"
        >
          <svg className="w-24 h-7 text-[#1b4332]" viewBox="0 0 180 50" fill="none">
            {/* Volutas aladas precolombinas izquierda */}
            <path
              d="M 20 25 C 40 10, 60 15, 75 25 C 60 30, 40 32, 20 25 Z"
              fill="#2d6a4f"
              opacity="0.9"
            />
            <path d="M 10 18 Q 45 14 70 25" stroke="#1b4332" strokeWidth="1.5" />
            <path d="M 25 32 Q 50 30 72 26" stroke="#1b4332" strokeWidth="1.2" />

            {/* Medallón central con el Escudo Nacional en verde grabado */}
            <circle cx="90" cy="25" r="18" fill={backgroundColor} stroke="#1b4332" strokeWidth="1.8" />
            <circle cx="90" cy="25" r="15.5" stroke="#2d6a4f" strokeWidth="0.8" strokeDasharray="1 1" />
            {/* Silueta águila y nopal */}
            <path
              d="M 90 14 L 92 19 L 97 17 L 94 22 L 99 24 L 94 26 L 98 30 L 92 31 L 94 36 L 89 33 L 87 38 L 86 32 L 81 34 L 84 29 L 80 27 L 84 24 L 80 21 L 85 20 L 83 15 L 88 17 Z"
              fill="#1b4332"
            />
            <ellipse cx="90" cy="37" rx="6" ry="2" fill="#2d6a4f" />

            {/* Volutas aladas precolombinas derecha */}
            <path
              d="M 160 25 C 140 10, 120 15, 105 25 C 120 30, 140 32, 160 25 Z"
              fill="#2d6a4f"
              opacity="0.9"
            />
            <path d="M 170 18 Q 135 14 110 25" stroke="#1b4332" strokeWidth="1.5" />
            <path d="M 155 32 Q 130 30 108 26" stroke="#1b4332" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
};
