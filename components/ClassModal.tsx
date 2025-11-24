import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Trash2, User, Calendar, Clock, FileText, DollarSign, CreditCard, Hash } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ClassStatus, ClassType, DrivingClass, PaymentStatus } from '../types';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  initialTime?: string;
  existingClassId?: string | null;
}

const ClassModal: React.FC<ClassModalProps> = ({ isOpen, onClose, initialDate, initialTime, existingClassId }) => {
  const { students, addClass, updateClass, classes, deleteClass, getStudentById } = useStore();
  
  const [formData, setFormData] = useState<Partial<DrivingClass>>({
    studentId: '',
    date: initialDate || new Date().toISOString().split('T')[0],
    startTime: initialTime || '09:00',
    durationMinutes: 60,
    type: ClassType.PRACTICA,
    status: ClassStatus.PROGRAMADA,
    paymentStatus: PaymentStatus.PENDIENTE,
    price: 15000,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (existingClassId) {
        const cls = classes.find(c => c.id === existingClassId);
        if (cls) setFormData(cls);
      } else {
        setFormData({
            studentId: '',
            date: initialDate || new Date().toISOString().split('T')[0],
            startTime: initialTime || '09:00',
            durationMinutes: 60,
            type: ClassType.PRACTICA,
            status: ClassStatus.PROGRAMADA,
            paymentStatus: PaymentStatus.PENDIENTE,
            price: 15000,
            notes: ''
        });
      }
    }
  }, [isOpen, existingClassId, initialDate, initialTime, classes]);

  // Calculate class statistics for selected student
  const studentStats = useMemo(() => {
    if (!formData.studentId) return null;
    
    // Get all classes for this student
    const studentClasses = classes.filter(c => c.studentId === formData.studentId);
    
    // If editing, find the number of THIS class
    if (existingClassId) {
        // Sort chronologically
        const sorted = [...studentClasses].sort((a, b) => 
            new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime()
        );
        const index = sorted.findIndex(c => c.id === existingClassId);
        return { count: studentClasses.length, currentNumber: index + 1 };
    }

    // If new, it will be count + 1
    return { count: studentClasses.length, currentNumber: studentClasses.length + 1 };
  }, [formData.studentId, classes, existingClassId]);


  // Update price when student changes if not editing an existing locked price
  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    const student = getStudentById(studentId);
    setFormData(prev => ({
        ...prev,
        studentId,
        price: student ? student.pricePerClass : 15000
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.date || !formData.startTime) return;

    // Calculate End Time simple logic
    const [hours, minutes] = (formData.startTime as string).split(':').map(Number);
    const dateObj = new Date();
    dateObj.setHours(hours, minutes + (formData.durationMinutes || 60));
    const endTime = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    const dataToSave = { ...formData, endTime } as DrivingClass;

    if (existingClassId) {
      updateClass(existingClassId, dataToSave);
    } else {
      addClass(dataToSave);
    }
    onClose();
  };

  const handleDelete = () => {
    if (existingClassId && window.confirm('¿Seguro que quieres eliminar esta clase?')) {
      deleteClass(existingClassId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">
            {existingClassId ? 'Editar Clase' : 'Nueva Clase'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Student Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <User size={16} /> Alumno
            </label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.studentId}
              onChange={handleStudentChange}
            >
              <option value="">Seleccionar alumno...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
            {formData.studentId && studentStats && (
                <div className="mt-2 text-sm bg-blue-50 text-blue-800 px-3 py-2 rounded-lg flex items-center gap-2 border border-blue-100">
                    <Hash size={14} />
                    <span className="font-semibold">
                        {existingClassId 
                            ? `Esta es la clase #${studentStats.currentNumber} del alumno.` 
                            : `Esta será la clase #${studentStats.currentNumber} (Historial: ${studentStats.count})`
                        }
                    </span>
                </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Calendar size={16} /> Fecha
              </label>
              <input
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Clock size={16} /> Hora Inicio
              </label>
              <input
                type="time"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
                <select 
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                    value={formData.durationMinutes}
                    onChange={e => setFormData({...formData, durationMinutes: Number(e.target.value)})}
                >
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <DollarSign size={16} /> Precio ($)
                </label>
                <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Clase</label>
                <select 
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as ClassStatus})}
                >
                    {Object.values(ClassStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <CreditCard size={16} /> Estado Pago
                </label>
                <select 
                    className={`w-full border border-gray-300 rounded-lg p-2.5 outline-none font-medium ${
                        formData.paymentStatus === PaymentStatus.PAGADO ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
                    }`}
                    value={formData.paymentStatus}
                    onChange={e => setFormData({...formData, paymentStatus: e.target.value as PaymentStatus})}
                >
                    {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
          </div>

          <div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Clase</label>
                <select 
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as ClassType})}
                >
                    {Object.values(ClassType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FileText size={16} /> Notas
            </label>
            <textarea
                rows={2}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500"
                placeholder="Notas sobre la clase..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
            {existingClassId && (
                <button 
                    type="button" 
                    onClick={handleDelete}
                    className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Trash2 size={18} /> Eliminar
                </button>
            )}
            <div className="flex-1"></div>
            <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
                Cancelar
            </button>
            <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
            >
                <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassModal;