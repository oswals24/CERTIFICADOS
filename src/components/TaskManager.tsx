import React, { useState } from 'react';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskCategory,
  CertificateData,
} from '../types/certificate';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  User,
  FileText,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onSelectTaskCertificate?: (cert: CertificateData) => void;
  currentCertificateData?: CertificateData;
}

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  emision_certificado: 'Emisión de Certificado',
  revision_calificaciones: 'Revisión de Calificaciones',
  firma_sello: 'Firma y Sello',
  tramite_sep: 'Trámite SEP (PACE)',
  entrega_alumno: 'Entrega a Alumno',
  archivo_escolar: 'Archivo Escolar',
};

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  emision_certificado: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  revision_calificaciones: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  firma_sello: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  tramite_sep: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  entrega_alumno: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  archivo_escolar: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  por_revisar: 'Por Revisar',
  completada: 'Completada',
};

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onSelectTaskCertificate,
  currentCertificateData,
}) => {
  const [activeTab, setActiveTab] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Formulario de nueva tarea
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [studentName, setStudentName] = useState('');
  const [curp, setCurp] = useState('');
  const [folio, setFolio] = useState('');
  const [category, setCategory] = useState<TaskCategory>('emision_certificado');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [assignedTo, setAssignedTo] = useState('Servicios Escolares');
  const [linkCurrentCert, setLinkCurrentCert] = useState(false);

  // Estadísticas
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'pendiente').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'en_proceso').length;
  const reviewTasks = tasks.filter((t) => t.status === 'por_revisar').length;
  const completedTasks = tasks.filter((t) => t.status === 'completada').length;
  const highPriority = tasks.filter((t) => t.priority === 'alta' && t.status !== 'completada').length;

  // Filtrado
  const filteredTasks = tasks.filter((task) => {
    // Filtro por tab de estado
    if (activeTab === 'pendientes' && task.status !== 'pendiente') return false;
    if (activeTab === 'en_proceso' && task.status !== 'en_proceso') return false;
    if (activeTab === 'por_revisar' && task.status !== 'por_revisar') return false;
    if (activeTab === 'completadas' && task.status !== 'completada') return false;
    if (activeTab === 'alta' && task.priority !== 'alta') return false;

    // Filtro por prioridad
    if (priorityFilter !== 'todas' && task.priority !== priorityFilter) return false;

    // Filtro por texto
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchStudent = task.studentName?.toLowerCase().includes(q);
      const matchCurp = task.curp?.toLowerCase().includes(q);
      const matchFolio = task.folio?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchStudent && !matchCurp && !matchFolio) {
        return false;
      }
    }

    return true;
  });

  const handleToggleComplete = (task: Task) => {
    const isCompleted = task.status === 'completada';
    onUpdateTask({
      ...task,
      status: isCompleted ? 'en_proceso' : 'completada',
      completedAt: isCompleted ? undefined : new Date().toISOString(),
    });
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    onUpdateTask({
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completada' ? new Date().toISOString() : undefined,
    });
  };

  const handleSubmitNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      studentName: studentName.trim() || undefined,
      curp: curp.trim() || undefined,
      folio: folio.trim() || undefined,
      status: 'pendiente',
      priority,
      category,
      dueDate,
      assignedTo: assignedTo.trim() || undefined,
      certificateSnapshot: linkCurrentCert && currentCertificateData ? currentCertificateData : undefined,
    });

    // Reset
    setTitle('');
    setDescription('');
    setStudentName('');
    setCurp('');
    setFolio('');
    setIsModalOpen(false);
  };

  const handlePrefillWithCurrentStudent = () => {
    if (currentCertificateData) {
      setStudentName(currentCertificateData.studentName);
      setCurp(currentCertificateData.curp);
      setFolio(currentCertificateData.folio);
      setTitle(`Revisión y emisión de certificado - ${currentCertificateData.studentName}`);
      setLinkCurrentCert(true);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 text-slate-100 shadow-xl space-y-4">
      {/* CABECERA Y ESTADÍSTICAS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Gestión de Tareas & Trámites Pendientes
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {pendingTasks + inProgressTasks} pendientes
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Control escolar de expedientes, firmas, sellado y folios DGB
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            handlePrefillWithCurrentStudent();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition-colors shadow-md hover:shadow-teal-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nueva Tarea
        </button>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div
          onClick={() => setActiveTab('todos')}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            activeTab === 'todos'
              ? 'bg-slate-800 border-teal-500/50 shadow-sm'
              : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-[10px] text-slate-400 block font-medium">Total Tareas</span>
          <span className="text-lg font-bold text-slate-100">{totalTasks}</span>
        </div>

        <div
          onClick={() => setActiveTab('pendientes')}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            activeTab === 'pendientes'
              ? 'bg-slate-800 border-amber-500/50 shadow-sm'
              : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-[10px] text-amber-400/90 block font-medium">Pendientes</span>
          <span className="text-lg font-bold text-amber-400">{pendingTasks}</span>
        </div>

        <div
          onClick={() => setActiveTab('en_proceso')}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            activeTab === 'en_proceso'
              ? 'bg-slate-800 border-blue-500/50 shadow-sm'
              : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-[10px] text-blue-400/90 block font-medium">En Proceso</span>
          <span className="text-lg font-bold text-blue-400">{inProgressTasks}</span>
        </div>

        <div
          onClick={() => setActiveTab('alta')}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            activeTab === 'alta'
              ? 'bg-slate-800 border-rose-500/50 shadow-sm'
              : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-[10px] text-rose-400/90 block font-medium">Prioridad Alta</span>
          <span className="text-lg font-bold text-rose-400">{highPriority}</span>
        </div>

        <div
          onClick={() => setActiveTab('completadas')}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            activeTab === 'completadas'
              ? 'bg-slate-800 border-emerald-500/50 shadow-sm'
              : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-[10px] text-emerald-400/90 block font-medium">Completadas</span>
          <span className="text-lg font-bold text-emerald-400">{completedTasks}</span>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por alumno, folio, tarea..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="todas">Todas las prioridades</option>
            <option value="alta">Prioridad Alta</option>
            <option value="media">Prioridad Media</option>
            <option value="baja">Prioridad Baja</option>
          </select>
        </div>
      </div>

      {/* LISTA DE TAREAS */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-slate-800/60">
            <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-slate-400 font-medium">No se encontraron tareas</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Cambia los filtros o añade una nueva tarea con el botón superior.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'completada';
            const isDueSoon =
              task.dueDate &&
              new Date(task.dueDate).getTime() - Date.now() < 86400000 * 2 &&
              !isDone;

            return (
              <div
                key={task.id}
                className={`p-3 rounded-lg border transition-all ${
                  isDone
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox rápido */}
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-600 hover:border-teal-500 text-transparent'
                    }`}
                    title={isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Contenido principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span
                        className={`text-[9.5px] px-2 py-0.5 rounded-full border font-medium ${
                          CATEGORY_COLORS[task.category]
                        }`}
                      >
                        {CATEGORY_LABELS[task.category]}
                      </span>

                      <span
                        className={`text-[9.5px] px-1.5 py-0.2 rounded font-semibold ${
                          task.priority === 'alta'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : task.priority === 'media'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-700/50 text-slate-300'
                        }`}
                      >
                        {task.priority === 'alta'
                          ? 'Alta'
                          : task.priority === 'media'
                          ? 'Media'
                          : 'Baja'}
                      </span>

                      {isDueSoon && (
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-rose-900/40 text-rose-300 border border-rose-700/50 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Próxima a vencer
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-xs font-semibold ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Metadatos asociados: Alumno, Folio, Asignado, Fecha */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-slate-400">
                      {task.studentName && (
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <User className="w-3 h-3 text-slate-500" />
                          {task.studentName}
                        </span>
                      )}

                      {task.folio && (
                        <span className="font-mono text-amber-400/90 font-medium">
                          Folio: {task.folio}
                        </span>
                      )}

                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          Límite: {task.dueDate}
                        </span>
                      )}

                      {task.assignedTo && (
                        <span className="text-slate-500">
                          Asignado: {task.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selector de estado y acciones */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task, e.target.value as TaskStatus)
                      }
                      className={`text-[10px] font-medium rounded px-2 py-0.5 border bg-slate-900 ${
                        task.status === 'completada'
                          ? 'text-emerald-400 border-emerald-500/40'
                          : task.status === 'en_proceso'
                          ? 'text-blue-400 border-blue-500/40'
                          : task.status === 'por_revisar'
                          ? 'text-purple-400 border-purple-500/40'
                          : 'text-amber-400 border-amber-500/40'
                      }`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="por_revisar">Por Revisar</option>
                      <option value="completada">Completada</option>
                    </select>

                    <div className="flex items-center gap-1">
                      {/* Botón para cargar en certificado si tiene datos vinculados */}
                      {task.certificateSnapshot && onSelectTaskCertificate && (
                        <button
                          onClick={() =>
                            onSelectTaskCertificate(task.certificateSnapshot!)
                          }
                          className="px-2 py-0.5 text-[10px] rounded bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Cargar estos datos en el generador de certificados"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          Cargar Datos
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Eliminar tarea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL NUEVA TAREA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" />
                Registrar Nueva Tarea / Trámite
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Título de la Tarea *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej: Revisión de kardex y emisión de certificado"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Descripción o Notas del Trámite
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre validación de materias, créditos o entrega física..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="emision_certificado">Emisión de Certificado</option>
                    <option value="revision_calificaciones">Revisión de Calificaciones</option>
                    <option value="firma_sello">Firma y Sello</option>
                    <option value="tramite_sep">Trámite SEP (PACE)</option>
                    <option value="entrega_alumno">Entrega a Alumno</option>
                    <option value="archivo_escolar">Archivo Escolar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="alta">Alta (Urgente)</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Nombre del Alumno (Opcional)
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="CHRISTIAN RAMIREZ..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Folio DGB
                  </label>
                  <input
                    type="text"
                    value={folio}
                    onChange={(e) => setFolio(e.target.value)}
                    placeholder="CBG18073056"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Fecha Límite
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Asignado a
                  </label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Servicios Escolares / Dirección"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
                  />
                </div>
              </div>

              {currentCertificateData && (
                <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkCurrentCert}
                    onChange={(e) => setLinkCurrentCert(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>
                    Vincular datos completos del certificado actual ({currentCertificateData.studentName})
                  </span>
                </label>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white cursor-pointer shadow-md"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
