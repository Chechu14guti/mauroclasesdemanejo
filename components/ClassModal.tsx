import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Trash2, User, Calendar, Clock, FileText, DollarSign, CreditCard, Hash } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ClassStatus, ClassType, DrivingClass, PaymentStatus } from '../types';
import ConfirmModal from './ConfirmModal';

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
    price: 10000,
    notes: '',
    paymentMethod: undefined
  });

  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
          price: 10000,
          notes: '',
          paymentMethod: undefined
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

    // Calculate if this new class would be a promo class
    let price = 10000;
    let paymentStatus = PaymentStatus.PENDIENTE;

    if (student) {
      const studentClasses = classes.filter(c => c.studentId === studentId);
      const nextClassNumber = studentClasses.length + 1;
      const promoLimit = (student.promoPacks || 0) * 10;

      if (nextClassNumber <= promoLimit) {
        price = 9000;
        paymentStatus = PaymentStatus.PAGADO;
      } else {
        price = student.pricePerClass;
      }
    }

    setFormData(prev => ({
      ...prev,
      studentId,
      price,
      paymentStatus
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.studentId || !formData.date || !formData.startTime) return;

    // Validation: If Paid, Payment Method is mandatory
    if (formData.paymentStatus === PaymentStatus.PAGADO && !formData.paymentMethod) {
      setError('⚠️ Debes indicar si el pago fue en Efectivo o Transferencia.');
      return;
    }

    // Validation: Price is mandatory
    if (!formData.price || formData.price <= 0) {
      setError('⚠️ El precio de la clase es obligatorio.');
      return;
    }

    // Calculate End Time simple logic
    const [hours, minutes] = (formData.startTime as string).split(':').map(Number);
    const dateObj = new Date();
    dateObj.setHours(hours, minutes + (formData.durationMinutes || 60));
    const endTime = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    // Sanitize data
    const dataToSave = { ...formData, endTime } as DrivingClass;

    // If not paid, remove payment method to avoid inconsistent state
    if (dataToSave.paymentStatus !== PaymentStatus.PAGADO) {
      delete dataToSave.paymentMethod;
    }

    if (existingClassId) {
      updateClass(existingClassId, dataToSave);
    } else {
      addClass(dataToSave);
    }
    onClose();
  };

  const handleDeleteClick = () => {
    if (existingClassId) {
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = () => {
    if (existingClassId) {
      deleteClass(existingClassId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in transition-colors">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {existingClassId ? 'Editar Clase' : 'Nueva Clase'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Student Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <User size={16} /> Alumno
            </label>
            <select
              required
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              value={formData.studentId}
              onChange={handleStudentChange}
            >
              <option value="">Seleccionar alumno...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
            {formData.studentId && studentStats && (
              <div className="mt-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg flex items-center gap-2 border border-blue-100 dark:border-blue-800 flex-wrap">
                <div className="flex items-center gap-2">
                  <Hash size={14} />
                  <span className="font-semibold">
                    {existingClassId
                      ? `Esta es la clase #${studentStats.currentNumber} del alumno.`
                      : `Esta será la clase #${studentStats.currentNumber} (Historial: ${studentStats.count})`
                    }
                  </span>
                </div>

                {/* Promo Indicator */}
                {(() => {
                  const student = students.find(s => s.id === formData.studentId);
                  if (student && student.promoPacks && student.promoPacks > 0) {
                    const promoLimit = student.promoPacks * 10;
                    if (studentStats.currentNumber <= promoLimit) {
                      const currentInPack = (studentStats.currentNumber - 1) % 10 + 1;
                      return (
                        <span className="font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-800 ml-auto">
                          Promo: {currentInPack}/10
                        </span>
                      );
                    }
                  }
                  return null;
                })()}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Calendar size={16} /> Fecha
              </label>
              <input
                type="date"
                required
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 outline-none focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Clock size={16} /> Hora Inicio
              </label>
              <input
                type="time"
                required
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 outline-none focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duración (min)</label>
              <select
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                value={formData.durationMinutes}
                onChange={e => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <DollarSign size={16} /> Precio ($)
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado Clase</label>
              <select
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as ClassStatus })}
              >
                {Object.values(ClassStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <CreditCard size={16} /> Estado Pago
              </label>
              <select
                className={`w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 outline-none font-medium ${formData.paymentStatus === PaymentStatus.PAGADO ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                  }`}
                value={formData.paymentStatus}
                onChange={e => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
              >
                {Object.values(PaymentStatus)
                  .filter(s => s !== PaymentStatus.FACTURADO)
                  .map(s => <option key={s} value={s} className="text-gray-900 dark:text-white bg-white dark:bg-slate-700">{s}</option>)}
              </select>
            </div>
          </div>

          {/* Payment Method Selector - Only visible when Paid */}
          {formData.paymentStatus === PaymentStatus.PAGADO && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <DollarSign size={16} /> Método de Pago
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Efectivo"
                    checked={formData.paymentMethod === 'Efectivo'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'Efectivo' })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-gray-900 dark:text-white">Efectivo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Transferencia"
                    checked={formData.paymentMethod === 'Transferencia'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'Transferencia' })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-gray-900 dark:text-white">Transferencia</span>
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Clase</label>
              <select
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as ClassType })}
              >
                {Object.values(ClassType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <FileText size={16} /> Notas
            </label>
            <textarea
              rows={2}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 outline-none focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              placeholder="Notas sobre la clase..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700 mt-2">
            {existingClassId && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Trash2 size={18} /> Eliminar
              </button>
            )}
            <div className="flex-1"></div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
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
      </div >

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Clase"
        message="¿Estás seguro que quieres eliminar esta clase? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div >
  );
};

export default ClassModal;