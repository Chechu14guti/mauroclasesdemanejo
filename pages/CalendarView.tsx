import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, DollarSign, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ClassStatus, DrivingClass, PaymentStatus } from '../types';
import ClassModal from '../components/ClassModal';

type ViewMode = 'week' | 'month';

const CalendarView: React.FC = () => {
  const { classes, students } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string, time: string } | null>(null);

  // Filters
  const [filterStudent, setFilterStudent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Helper Functions
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const addDays = (d: Date, days: number) => {
    const date = new Date(d);
    date.setDate(date.getDate() + days);
    return date;
  };

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  // Derived Data
  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = useMemo(() => {
    const days = [];
    // Pad start
    const startDay = startOfMonth.getDay() || 7; // 1 (Mon) - 7 (Sun)
    for (let i = 1; i < startDay; i++) days.push(null);
    // Days
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    return days;
  }, [currentDate]);

  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      if (filterStudent && c.studentId !== filterStudent) return false;
      if (filterStatus && c.status !== filterStatus) return false;
      return true;
    });
  }, [classes, filterStudent, filterStatus]);

  const getClassesForDate = (dateStr: string) => filteredClasses.filter(c => c.date === dateStr);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleClassClick = (id: string) => {
    setSelectedClassId(id);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleSlotClick = (dateStr: string, time: string) => {
    setSelectedClassId(null);
    setSelectedSlot({ date: dateStr, time });
    setIsModalOpen(true);
  };

  // Render Helpers
  const renderClassCard = (cls: DrivingClass, isCompact = false) => {
    const student = students.find(s => s.id === cls.studentId);

    // Logic: Calculate class number for this student
    // We sort all classes for this student chronologically to find the index
    const studentClasses = classes.filter(c => c.studentId === cls.studentId);
    studentClasses.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });
    const classNumber = studentClasses.findIndex(c => c.id === cls.id) + 1;

    // Logic changed: Color depends on Payment Status ONLY
    const isPaid = cls.paymentStatus === PaymentStatus.PAGADO;

    const cardColorClass = isPaid
      ? 'bg-green-100 border-green-300 text-green-900 shadow-sm' // Pagado
      : 'bg-orange-100 border-orange-300 text-orange-900 shadow-sm'; // Pendiente / Facturado / Etc

    // Promo Logic
    const promoLimit = (student?.promoPacks || 0) * 10;
    const isPromo = classNumber <= promoLimit;

    return (
      <div
        key={cls.id}
        onClick={(e) => { e.stopPropagation(); handleClassClick(cls.id); }}
        className={`rounded border p-1 mb-1 text-xs cursor-pointer hover:shadow-md transition-shadow truncate relative group ${cardColorClass}`}
        title={`Clase #${classNumber} - ${cls.startTime} - ${student?.firstName} ${student?.lastName} (${cls.paymentStatus})`}
      >
        {isPromo && (
          <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 border border-yellow-700 z-10 shadow-sm" title="Clase Promocional (10x9)"></div>
        )}
        <div className="flex justify-between items-start">
          <div className="flex flex-col w-full">
            <div className="flex justify-between w-full font-bold">
              <span>{cls.startTime}</span>
              <span>#{classNumber}</span>
            </div>
            <span className="truncate">{student?.firstName} {student?.lastName?.charAt(0)}.</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Mes
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
            <h2 className="text-lg font-bold w-40 text-center">
              {currentDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={handleNext} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
          >
            <option value="">Todos los alumnos</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
          </select>
          <button
            onClick={() => { setSelectedClassId(null); setSelectedSlot(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Nueva Clase</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs text-gray-600 px-2 bg-white p-2 rounded-lg border border-gray-100 w-fit">
        <span className="font-semibold">Estado de Pago:</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-green-200 border border-green-300"></span>
          <span>Pagada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-orange-200 border border-orange-300"></span>
          <span>Pendiente / No Pagada</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {viewMode === 'week' ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Week Header */}
            <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
              <div className="p-4 text-center text-xs font-semibold text-gray-400 border-r">HORA</div>
              {weekDays.map((day, i) => {
                const dateStr = formatDate(day);
                const dayClasses = getClassesForDate(dateStr);
                const isToday = formatDate(new Date()) === dateStr;
                return (
                  <div key={i} className={`p-2 text-center border-r last:border-r-0 ${isToday ? 'bg-blue-50/50' : ''}`}>
                    <div className={`text-xs uppercase font-bold ${isToday ? 'text-blue-600' : 'text-gray-500'}`}>
                      {day.toLocaleDateString('es-AR', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg font-bold ${isToday ? 'text-blue-700' : 'text-gray-800'}`}>
                      {day.getDate()}
                    </div>
                    {dayClasses.length > 0 && (
                      <div className="mt-1 inline-block bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {dayClasses.length} clases
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {/* Week Body (Scrollable) */}
            <div className="overflow-y-auto flex-1 h-[600px]">
              <div className="grid grid-cols-8">
                {/* Time Column */}
                <div className="col-span-1 border-r border-gray-200">
                  {Array.from({ length: 15 }).map((_, i) => {
                    const hour = i + 7; // Start at 7 AM
                    return (
                      <div key={hour} className="h-20 border-b border-gray-100 text-xs text-gray-400 p-2 text-center">
                        {hour}:00
                      </div>
                    )
                  })}
                </div>
                {/* Days Columns */}
                {weekDays.map((day, dIndex) => {
                  const dateStr = formatDate(day);
                  return (
                    <div key={dIndex} className="col-span-1 border-r border-gray-200 last:border-r-0 relative">
                      {Array.from({ length: 15 }).map((_, hIndex) => {
                        const hour = hIndex + 7;
                        const timeStr = `${String(hour).padStart(2, '0')}:00`;

                        // Find classes starting in this hour (simplified for grid)
                        const slotClasses = filteredClasses.filter(c => c.date === dateStr && c.startTime.startsWith(String(hour).padStart(2, '0')));

                        return (
                          <div
                            key={`${dIndex}-${hIndex}`}
                            className="h-20 border-b border-gray-100 hover:bg-gray-50 transition-colors p-1 relative group"
                            onClick={() => handleSlotClick(dateStr, timeStr)}
                          >
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-blue-500 z-10">
                              <Plus size={14} />
                            </div>
                            {slotClasses.map(cls => renderClassCard(cls))}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                <div key={d} className="p-3 text-center text-sm font-semibold text-gray-500 border-r last:border-r-0">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1 auto-rows-fr">
              {daysInMonth.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} className="bg-gray-50/30 border-b border-r border-gray-100" />;

                const dateStr = formatDate(day);
                const dayClasses = getClassesForDate(dateStr);
                const isToday = formatDate(new Date()) === dateStr;

                return (
                  <div
                    key={dateStr}
                    className={`min-h-[100px] border-b border-r border-gray-100 p-2 transition-colors hover:bg-gray-50 cursor-pointer flex flex-col ${isToday ? 'bg-blue-50/30' : ''}`}
                    onClick={() => handleSlotClick(dateStr, '09:00')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                        {day.getDate()}
                      </span>
                      {dayClasses.length > 0 && (
                        <span className="text-[10px] font-bold text-gray-400">{dayClasses.length} clases</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1 overflow-y-auto max-h-[80px]">
                      {dayClasses.map(cls => renderClassCard(cls, true))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDate={selectedSlot?.date}
        initialTime={selectedSlot?.time}
        existingClassId={selectedClassId}
      />
    </div>
  );
};

export default CalendarView;