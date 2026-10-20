import React from 'react';

interface OfficialCertificateBorderProps {
  styleType?: 'green_gold' | 'minimal' | 'none';
}

/**
 * Marco perimetral oficial con bordes verdes institucionales y dorados,
 * con esquineros ornamentales tradicionales para documentos y títulos oficiales.
 */
export const OfficialCertificateBorder: React.FC<OfficialCertificateBorderProps> = ({
  styleType = 'green_gold',
}) => {
  if (styleType === 'none') return null;

  if (styleType === 'minimal') {
    return (
      <div className="absolute inset-[3.5mm] pointer-events-none z-20">
        <div className="w-full h-full border-[2.5px] border-[#0f4d34]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-[3.5mm] pointer-events-none z-20">
      {/* LÍNEA EXTERIOR VERDE INSTITUCIONAL (VERDE BANDERA / BOSQUE) */}
      <div className="w-full h-full border-[2.8px] border-[#0f4d34] relative">
        {/* LÍNEA INTERIOR DORADA METÁLICA */}
        <div className="absolute inset-[2mm] border-[1.4px] border-[#ca8a04]">
          {/* ESQUINEROS ORNAMENTALES DORADOS */}
          {/* Superior Izquierda */}
          <div className="absolute -top-[1px] -left-[1px] w-3.5 h-3.5 border-t-2 border-l-2 border-[#ca8a04]" />
          <div className="absolute top-[2px] left-[2px] w-1.5 h-1.5 bg-[#ca8a04]" />

          {/* Superior Derecha */}
          <div className="absolute -top-[1px] -right-[1px] w-3.5 h-3.5 border-t-2 border-r-2 border-[#ca8a04]" />
          <div className="absolute top-[2px] right-[2px] w-1.5 h-1.5 bg-[#ca8a04]" />

          {/* Inferior Izquierda */}
          <div className="absolute -bottom-[1px] -left-[1px] w-3.5 h-3.5 border-b-2 border-l-2 border-[#ca8a04]" />
          <div className="absolute bottom-[2px] left-[2px] w-1.5 h-1.5 bg-[#ca8a04]" />

          {/* Inferior Derecha */}
          <div className="absolute -bottom-[1px] -right-[1px] w-3.5 h-3.5 border-b-2 border-r-2 border-[#ca8a04]" />
          <div className="absolute bottom-[2px] right-[2px] w-1.5 h-1.5 bg-[#ca8a04]" />
        </div>

        {/* DETALLES DE FILETE DE ESQUINA EXTERIOR */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-[#0f4d34]" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-[#0f4d34]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#0f4d34]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#0f4d34]" />
      </div>
    </div>
  );
};
