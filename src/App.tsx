import React, { useState, useEffect } from 'react';
import { OfficialCertificate } from './components/OfficialCertificate';
import { CentenarioDigitalCertificate } from './components/CentenarioDigitalCertificate';
import { SolemneGalaCertificate } from './components/SolemneGalaCertificate';
import { Acuerdo286DigitalCertificate } from './components/Acuerdo286DigitalCertificate';
import { PrepaAbiertaCertificate } from './components/PrepaAbiertaCertificate';
import { CertificateVerificationModal } from './components/CertificateVerificationModal';
import { CertificateVotingModal } from './components/CertificateVotingModal';
import { CertificateEditor } from './components/CertificateEditor';
import { DynamicQRManagerModal } from './components/DynamicQRManagerModal';
import { TaskManager } from './components/TaskManager';
import { OriginalModelModal } from './components/OriginalModelModal';
import { DEFAULT_CERTIFICATE, GENESIS_CERTIFICATE, INITIAL_TASKS } from './data/initialData';
import { CertificateData, Task, CertificateTemplateType } from './types/certificate';
import { downloadCertificatePDF } from './utils/pdfExport';
import {
  FileText,
  CheckSquare,
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Info,
  Layers,
  Award,
  ShieldCheck,
  Vote,
  QrCode,
} from 'lucide-react';

export default function App() {
  // Estado del certificado
  const [certificateData, setCertificateData] = useState<CertificateData>(() => {
    const saved = localStorage.getItem('dgb_certificate_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando datos guardados', e);
      }
    }
    return DEFAULT_CERTIFICATE;
  });

  // Estado del modelo / estilo seleccionado para impresión y descarga (5 opciones)
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplateType>(() => {
    return certificateData.templateModel || 'dgb_tradicional';
  });

  // Estado del promedio manual oficial
  const [generalGpaOverride, setGeneralGpaOverride] = useState<string>('8.1');

  // Estado de las tareas pendientes
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('dgb_pending_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando tareas guardadas', e);
      }
    }
    return INITIAL_TASKS;
  });

  // Pestaña principal de la aplicación: 'certificado' | 'tareas' | 'dividida'
  const [viewMode, setViewMode] = useState<'certificado' | 'tareas' | 'dividida'>('certificado');

  // Nivel de zoom de la vista previa del certificado
  const [zoomLevel, setZoomLevel] = useState<number>(0.82);

  // Estados de carga y modales
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [isOriginalModelModalOpen, setIsOriginalModelModalOpen] = useState<boolean>(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState<boolean>(false);
  const [isQRManagerModalOpen, setIsQRManagerModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Detección automática de verificación desde QR por URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const folioParam = params.get('folio');
      const verifyParam = params.get('verify');
      const studentParam = params.get('student');
      const curpParam = params.get('curp');

      if (verifyParam === 'true' || folioParam) {
        setIsVerificationModalOpen(true);
        if (folioParam) {
          showToast(`QR Escaneado: Verificando autenticidad del folio ${folioParam}`);
        }
      }
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('dgb_certificate_data', JSON.stringify(certificateData));
  }, [certificateData]);

  useEffect(() => {
    localStorage.setItem('dgb_pending_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleSelectTemplate = (template: CertificateTemplateType) => {
    setSelectedTemplate(template);
    setCertificateData((prev) => ({
      ...prev,
      templateModel: template,
    }));
    const names: Record<CertificateTemplateType, string> = {
      dgb_tradicional: 'Modelo 1: Oficial DGB - PREFECO (Tradicional)',
      sep_centenario: 'Modelo 2: SEP Centenario Digital Moderno',
      solemne_gala: 'Modelo 3: Gala Solemne y Excelencia Académica',
      acuerdo_286: 'Modelo 4: Acuerdo 286 / DGB Digital Federal (Img 1)',
      prepa_abierta: 'Modelo 5: Preparatoria Abierta / SEMS Oficial (Img 2)',
    };
    showToast(`Cambiado a: ${names[template]}`);
  };

  // Restaurar al modelo original de prueba (Christian Ramírez)
  const handleRestoreDefaults = () => {
    setCertificateData(DEFAULT_CERTIFICATE);
    setGeneralGpaOverride('8.1');
    showToast('Se ha cargado el modelo oficial (Christian Ramírez - 8.1)');
  };

  // Cargar modelo de prueba Muestra 2 (Genesis Jared Velasco Garcia - 9.6)
  const handleLoadGenesisModel = () => {
    setCertificateData(GENESIS_CERTIFICATE);
    setGeneralGpaOverride('9.6');
    showToast('Se ha cargado el modelo oficial (Genesis Jared Velasco - 9.6)');
  };

  // Imprimir usando la ventana nativa del navegador con las reglas @media print de hoja carta
  const handlePrint = () => {
    window.print();
  };

  // Descargar archivo .PDF directo con html2canvas-pro y jsPDF
  const handleDownloadPdf = async (targetTemplate?: CertificateTemplateType) => {
    setIsDownloadingPdf(true);
    const templateToUse = targetTemplate || selectedTemplate;
    const original = selectedTemplate;
    if (targetTemplate && targetTemplate !== selectedTemplate) {
      setSelectedTemplate(targetTemplate);
      await new Promise((r) => setTimeout(r, 600));
    }

    const templateLabels: Record<CertificateTemplateType, string> = {
      dgb_tradicional: '1_Oficial_DGB_Tradicional',
      sep_centenario: '2_SEP_Centenario_Digital',
      solemne_gala: '3_Gala_Academica_Solemne',
      acuerdo_286: '4_Acuerdo_286_Federal',
      prepa_abierta: '5_Prepa_Abierta_SEMS',
    };

    const label = templateLabels[templateToUse] || 'Certificado';
    showToast(`Generando ${label} en PDF tamaño Carta...`);
    try {
      const cleanName = certificateData.studentName.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `Certificado_${label}_${certificateData.folio}_${cleanName}.pdf`;
      await downloadCertificatePDF('certificate-render-target', fileName);
      showToast('¡Certificado PDF descargado con éxito!');
    } catch (err) {
      console.error('Error al generar PDF', err);
      showToast('Error al generar PDF directo. Puedes usar el botón Imprimir > Guardar como PDF.');
    } finally {
      if (targetTemplate && targetTemplate !== original) {
        setSelectedTemplate(original);
      }
      setIsDownloadingPdf(false);
    }
  };

  // Descargar los 5 modelos oficiales en serie
  const handleDownloadAllTemplates = async () => {
    setIsDownloadingPdf(true);
    showToast('Iniciando descarga sucesiva de los 5 modelos en PDF...');
    const original = selectedTemplate;
    try {
      const cleanName = certificateData.studentName.replace(/[^a-zA-Z0-9]/g, '_');
      const templatesToDownload: { key: CertificateTemplateType; label: string }[] = [
        { key: 'dgb_tradicional', label: '1_Oficial_DGB_Tradicional' },
        { key: 'sep_centenario', label: '2_SEP_Centenario_Digital' },
        { key: 'solemne_gala', label: '3_Gala_Academica_Solemne' },
        { key: 'acuerdo_286', label: '4_Acuerdo_286_Digital_Federal' },
        { key: 'prepa_abierta', label: '5_Prepa_Abierta_SEMS_Oficial' },
      ];

      for (const t of templatesToDownload) {
        setSelectedTemplate(t.key);
        showToast(`Generando y descargando: ${t.label}...`);
        // Dar tiempo a React para montar el componente y a QRCode para generar el DataURL
        await new Promise((r) => setTimeout(r, 650));
        const fileName = `Certificado_${t.label}_${certificateData.folio}_${cleanName}.pdf`;
        await downloadCertificatePDF('certificate-render-target', fileName);
        await new Promise((r) => setTimeout(r, 200));
      }
      showToast('¡Se han descargado con éxito los 5 modelos de certificados en PDF!');
    } catch (err) {
      console.error('Error en descarga múltiple', err);
      showToast('Hubo un inconveniente al generar los archivos PDF.');
    } finally {
      setSelectedTemplate(original);
      setIsDownloadingPdf(false);
    }
  };

  // Renderizador del certificado según la plantilla activa
  const renderActiveCertificate = (scale: number) => {
    switch (selectedTemplate) {
      case 'sep_centenario':
        return (
          <CentenarioDigitalCertificate
            data={certificateData}
            scale={scale}
            generalGpaOverride={generalGpaOverride}
            onOpenVerify={() => setIsVerificationModalOpen(true)}
          />
        );
      case 'solemne_gala':
        return (
          <SolemneGalaCertificate
            data={certificateData}
            scale={scale}
            generalGpaOverride={generalGpaOverride}
            onOpenVerify={() => setIsVerificationModalOpen(true)}
          />
        );
      case 'acuerdo_286':
        return (
          <Acuerdo286DigitalCertificate
            data={certificateData}
            scale={scale}
            generalGpaOverride={generalGpaOverride}
            onOpenVerify={() => setIsVerificationModalOpen(true)}
          />
        );
      case 'prepa_abierta':
        return (
          <PrepaAbiertaCertificate
            data={certificateData}
            scale={scale}
            generalGpaOverride={generalGpaOverride}
            onOpenVerify={() => setIsVerificationModalOpen(true)}
          />
        );
      case 'dgb_tradicional':
      default:
        return (
          <OfficialCertificate
            data={certificateData}
            scale={scale}
            generalGpaOverride={generalGpaOverride}
            onOpenVerify={() => setIsVerificationModalOpen(true)}
          />
        );
    }
  };

  // Gestión de Tareas
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Tarea pendiente registrada con éxito');
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    showToast('Tarea actualizada');
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Tarea eliminada');
  };

  const handleCreateTaskForStudent = (studentName: string, folio: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: `Trámite y entrega de certificado - ${studentName}`,
      description: `Revisión de actas, cotejo de 344 créditos y entrega al egresado (Folio: ${folio}).`,
      studentName,
      folio,
      status: 'pendiente',
      priority: 'alta',
      category: 'emision_certificado',
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      assignedTo: 'Servicios Escolares',
      certificateSnapshot: certificateData,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Se ha creado una tarea pendiente para ${studentName}`);
    setViewMode('tareas');
  };

  const handleSelectTaskCertificate = (snapshot: CertificateData) => {
    setCertificateData(snapshot);
    if (snapshot.templateModel) {
      setSelectedTemplate(snapshot.templateModel);
    }
    setViewMode('certificado');
    showToast(`Datos del alumno ${snapshot.studentName} cargados en el certificado`);
  };

  const pendingCount = tasks.filter((t) => t.status === 'pendiente' || t.status === 'en_proceso').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* NOTIFICACIÓN TOAST */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-teal-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-teal-400 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          {notification}
        </div>
      )}

      {/* BARRA SUPERIOR DE LA APLICACIÓN (NO-PRINT) */}
      <header className="no-print bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* LOGO E IDENTIFICACIÓN */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white font-black">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">
                Emisión de Certificados DGB PREFECO
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                5 Modelos para Votación y Elección
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>Plantel Lic. César Linton Rodríguez</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-slate-400 font-medium">C.C.T. 20SBC2017V</span>
            </p>
          </div>
        </div>

        {/* SELECTOR DE VISTAS */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('certificado')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              viewMode === 'certificado'
                ? 'bg-slate-800 text-teal-400 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Certificado
          </button>

          <button
            onClick={() => setViewMode('tareas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors relative cursor-pointer ${
              viewMode === 'tareas'
                ? 'bg-slate-800 text-teal-400 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Tareas Pendientes
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[9.5px] flex items-center justify-center ml-0.5">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setViewMode('dividida')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              viewMode === 'dividida'
                ? 'bg-slate-800 text-teal-400 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Vista Dividida
          </button>
        </div>

        {/* BOTONES DE VOTACIÓN, COTEJO Y DESCARGA */}
        <div className="flex items-center gap-2">
          {/* BOTÓN PRESENTACIÓN Y VOTACIÓN DE LOS 5 MODELOS */}
          <button
            onClick={() => setIsVotingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 shadow-md transition-all cursor-pointer"
            title="Presentar los 5 modelos de certificados y realizar votación"
          >
            <Vote className="w-4 h-4" />
            <span>Votación (5 Diseños)</span>
          </button>

          {/* BOTÓN GENERADOR Y GESTOR DE QR DINÁMICO */}
          <button
            onClick={() => setIsQRManagerModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-950/70 hover:bg-teal-900 text-teal-300 border border-teal-600/50 transition-colors cursor-pointer"
            title="Abrir generador y configurador de códigos QR dinámicos"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Generador QR</span>
          </button>

          {/* BOTÓN VERIFICACIÓN OFICIAL / COTEJO QR */}
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60 transition-colors cursor-pointer"
            title="Abrir portal oficial de verificación y cotejo del certificado"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Verificar Autenticidad</span>
          </button>

          <button
            onClick={() => setIsOriginalModelModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Ver cotejo con modelo de prueba"
          >
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Muestra</span>
          </button>

          <button
            onClick={() => handleDownloadPdf()}
            disabled={isDownloadingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white shadow transition-all cursor-pointer"
            title="Descargar este estilo en tamaño carta"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isDownloadingPdf ? 'Generando...' : 'Descargar PDF'}</span>
            <span className="sm:hidden">PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-500 text-white shadow transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL SEGÚN EL MODO DE VISTA */}
      <main className="flex-1 flex overflow-hidden">
        {/* MODO 1: CERTIFICADO (PANEL DE EDICIÓN + VISTA PREVIA) */}
        {viewMode === 'certificado' && (
          <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-57px)] overflow-hidden">
            {/* Panel de Control y Edición */}
            <aside className="no-print w-full lg:w-[420px] shrink-0 border-r border-slate-800 bg-slate-950/80 p-3 overflow-y-auto">
              <CertificateEditor
                data={certificateData}
                onChange={setCertificateData}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleSelectTemplate}
                onRestoreDefaults={handleRestoreDefaults}
                onLoadGenesisModel={handleLoadGenesisModel}
                onPrint={handlePrint}
                onDownloadPdf={() => handleDownloadPdf()}
                onDownloadAllPdf={handleDownloadAllTemplates}
                onOpenVoting={() => setIsVotingModalOpen(true)}
                onOpenVerify={() => setIsVerificationModalOpen(true)}
                onOpenQRManager={() => setIsQRManagerModalOpen(true)}
                isDownloadingPdf={isDownloadingPdf}
                onCreateTaskForStudent={handleCreateTaskForStudent}
                generalGpaOverride={generalGpaOverride}
                setGeneralGpaOverride={setGeneralGpaOverride}
              />
            </aside>

            {/* Vista Previa de la Hoja de Certificado */}
            <section className="flex-1 bg-slate-900/50 p-3 sm:p-5 flex flex-col items-center justify-start overflow-auto">
              {/* SELECTOR RÁPIDO Y CONTROLES SUPERIORES */}
              <div className="no-print w-full max-w-5xl flex flex-wrap items-center justify-between pb-3 text-xs text-slate-400 gap-2">
                {/* BOTONES DIRECTOS PARA CAMBIAR ENTRE LOS 5 DISEÑOS */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-xs overflow-x-auto max-w-full">
                  <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Modelo:
                  </span>
                  <button
                    onClick={() => handleSelectTemplate('dgb_tradicional')}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      selectedTemplate === 'dgb_tradicional'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    1. DGB Oficial
                  </button>
                  <button
                    onClick={() => handleSelectTemplate('sep_centenario')}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      selectedTemplate === 'sep_centenario'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    2. SEP Centenario
                  </button>
                  <button
                    onClick={() => handleSelectTemplate('solemne_gala')}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      selectedTemplate === 'solemne_gala'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    3. Gala Solemne
                  </button>
                  <button
                    onClick={() => handleSelectTemplate('acuerdo_286')}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      selectedTemplate === 'acuerdo_286'
                        ? 'bg-yellow-600 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    4. Acuerdo 286 (Img 1)
                  </button>
                  <button
                    onClick={() => handleSelectTemplate('prepa_abierta')}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      selectedTemplate === 'prepa_abierta'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    5. Prepa Abierta (Img 2)
                  </button>
                </div>

                {/* BOTÓN DESCARGAR LOS 5 MODELOS + CONTROLES ZOOM */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadAllTemplates}
                    disabled={isDownloadingPdf}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                    title="Descargar automáticamente los 5 modelos en PDF con los datos actuales"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descargar los 5 Modelos (.PDF)
                  </button>

                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
                      className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                      title="Reducir zoom"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[11px] px-1 text-slate-300">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
                      className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                      title="Aumentar zoom"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(0.82)}
                      className="px-1.5 py-0.5 text-[10px] rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      100%
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenedor del Certificado Activo */}
              <div className="flex justify-center items-start w-full pb-10">
                {renderActiveCertificate(zoomLevel)}
              </div>
            </section>
          </div>
        )}

        {/* MODO 2: GESTOR DE TAREAS PENDIENTES */}
        {viewMode === 'tareas' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-5xl mx-auto w-full space-y-4">
            <TaskManager
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onSelectTaskCertificate={handleSelectTaskCertificate}
              currentCertificateData={certificateData}
            />
          </div>
        )}

        {/* MODO 3: VISTA DIVIDIDA (TAREAS + CERTIFICADO) */}
        {viewMode === 'dividida' && (
          <div className="flex-1 flex flex-col xl:flex-row h-[calc(100vh-57px)] overflow-hidden">
            {/* Columna Izquierda: Tareas */}
            <div className="w-full xl:w-[460px] shrink-0 border-r border-slate-800 p-4 overflow-y-auto bg-slate-950/70">
              <TaskManager
                tasks={tasks}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onSelectTaskCertificate={handleSelectTaskCertificate}
                currentCertificateData={certificateData}
              />
            </div>

            {/* Columna Derecha: Vista Previa y Edición Rápida */}
            <div className="flex-1 bg-slate-900/50 p-4 overflow-auto flex flex-col items-center">
              <div className="w-full flex flex-wrap items-center justify-between pb-3 text-xs text-slate-400 max-w-4xl gap-2">
                {/* SELECTOR EN MODO DIVIDIDO CON LOS 5 MODELOS */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto">
                  <button
                    onClick={() => handleSelectTemplate('dgb_tradicional')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                      selectedTemplate === 'dgb_tradicional'
                        ? 'bg-teal-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1. DGB
                  </button>
                  <button
                    onClick={() => handleSelectTemplate('sep_centenario')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                      selectedTemplate === 'sep_centenario'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2. Centenario
                  </button>
                  <button
                    onClick={() => handleSelectTemplate('solemne_gala')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                      selectedTemplate === 'solemne_gala'
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3. Gala
                  </button>
                  <button
                    onClick={() => handleSelectTemplate('acuerdo_286')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                      selectedTemplate === 'acuerdo_286'
                        ? 'bg-yellow-600 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    4. Ac. 286
                  </button>
                  <button
                    onClick={() => handleSelectTemplate('prepa_abierta')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                      selectedTemplate === 'prepa_abierta'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    5. Prepa Abierta
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVotingModalOpen(true)}
                    className="px-2.5 py-1 text-xs rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold cursor-pointer"
                  >
                    🗳️ Votar
                  </button>
                  <button
                    onClick={() => handleDownloadPdf()}
                    className="px-2.5 py-1 text-xs rounded bg-sky-600 hover:bg-sky-500 text-white font-medium cursor-pointer"
                  >
                    Descargar PDF
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-2.5 py-1 text-xs rounded bg-teal-600 hover:bg-teal-500 text-white font-medium cursor-pointer"
                  >
                    Imprimir
                  </button>
                </div>
              </div>

              <div className="flex justify-center items-start w-full pb-10">
                {renderActiveCertificate(0.75)}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE COTEJO CON EL MODELO OFICIAL */}
      <OriginalModelModal
        isOpen={isOriginalModelModalOpen}
        onClose={() => setIsOriginalModelModalOpen(false)}
      />

      {/* MODAL OFICIAL DE VERIFICACIÓN Y AUTENTICIDAD DE CERTIFICADOS */}
      <CertificateVerificationModal
        data={certificateData}
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />

      {/* MODAL DE PRESENTACIÓN Y VOTACIÓN DE LOS 5 MODELOS */}
      <CertificateVotingModal
        isOpen={isVotingModalOpen}
        onClose={() => setIsVotingModalOpen(false)}
        currentTemplate={selectedTemplate}
        onSelectTemplate={handleSelectTemplate}
        onDownloadTemplate={(tpl) => handleDownloadPdf(tpl)}
        onDownloadAll={handleDownloadAllTemplates}
        isDownloading={isDownloadingPdf}
      />

      {/* MODAL DEL GENERADOR DE CÓDIGO QR DINÁMICO & COTEJO */}
      <DynamicQRManagerModal
        isOpen={isQRManagerModalOpen}
        onClose={() => setIsQRManagerModalOpen(false)}
        data={certificateData}
        onChange={setCertificateData}
        onOpenVerify={() => setIsVerificationModalOpen(true)}
      />
    </div>
  );
}
