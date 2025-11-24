import React, { useState, useEffect } from 'react';
import { X, Save, User, Phone, Mail, FileText, DollarSign, Activity, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ExamReadiness, Student, StudentStatus } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student;
}

const StudentModal: React.FC<StudentModalProps> = ({ isOpen, onClose, studentToEdit }) => {
  const { addStudent, updateStudent } = useStore();

  // Helper to handle array <-> string for textareas
  const arrayToString = (arr: string[]) => arr ? arr.join('\n') : '';

  const [formData, setFormData] = useState<Partial<Student>>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    pricePerClass: 15000,
    status: StudentStatus.ACTIVO,
    examReadiness: ExamReadiness.NO,
    notes: '',
    registrationDate: new Date().toISOString().split('T')[0],
    strengths: [],
    weaknesses: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [strengthsText, setStrengthsText] = useState('');
  const [weaknessesText, setWeaknessesText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError(null); // Clear errors when opening
      if (studentToEdit) {
        setFormData(studentToEdit);
        setStrengthsText(arrayToString(studentToEdit.strengths));
        setWeaknessesText(arrayToString(studentToEdit.weaknesses));
      } else {
        // Reset for new student
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          pricePerClass: 15000,
          status: StudentStatus.ACTIVO,
          examReadiness: ExamReadiness.NO,
          notes: '',
          registrationDate: new Date().toISOString().split('T')[0],
          strengths: [],
          weaknesses: []
        });
        setStrengthsText('');
        setWeaknessesText('');
      }
    }
  }, [isOpen, studentToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) return;

    setLoading(true);
    setError(null);

    try {
      // Convert textareas back to arrays (non-empty lines)
      const strengths = strengthsText.split('\n').map(s => s.trim()).filter(s => s.length > 0);
      const weaknesses = weaknessesText.split('\n').map(s => s.trim()).filter(s => s.length > 0);

      const finalData = {
        ...formData,
        strengths,
        weaknesses,
        email: formData.email || '',
        dni: ''
      } as Student;

      if (studentToEdit) {
        await updateStudent(studentToEdit.id, finalData);
      } else {
        await addStudent(finalData);
      }

      onClose();
    } catch (err: any) {
      console.error("Error saving student:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      setError(`Hubo un error al guardar el alumno: ${err.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Changed bg-white to bg-gray-100 and added text-gray-900 for high visibility
  const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-gray-100 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-800">
            {studentToEdit ? 'Editar Alumno' : 'Nuevo Alumno'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <User size={16} /> Nombre
              </label>
              <input
                type="text"
                required
                className={inputClass}
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                required
                className={inputClass}
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Phone size={16} /> Teléfono
              </label>
              <input
                type="tel"
                required
                className={inputClass}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Mail size={16} /> Email <span className="text-gray-400 text-xs">(Opcional)</span>
              </label>
              <input
                type="email"
                className={inputClass}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <DollarSign size={16} /> Precio por Clase
              </label>
              <input
                type="number"
                required
                className={inputClass}
                value={formData.pricePerClass}
                onChange={e => setFormData({ ...formData, pricePerClass: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Activity size={16} /> Estado Alumno
              </label>
              <select
                className={inputClass}
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as StudentStatus })}
              >
                {Object.values(StudentStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel Examen</label>
            <select
              className={inputClass}
              value={formData.examReadiness}
              onChange={e => setFormData({ ...formData, examReadiness: e.target.value as ExamReadiness })}
            >
              {Object.values(ExamReadiness).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Text Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FileText size={16} /> Notas Generales
            </label>
            <textarea
              rows={2}
              className={inputClass}
              placeholder="Disponibilidad, preferencias, etc."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <ThumbsUp size={16} /> Puntos Fuertes
              </label>
              <textarea
                rows={3}
                className={`${inputClass} text-sm`}
                placeholder="Escribe cada punto en una línea nueva..."
                value={strengthsText}
                onChange={e => setStrengthsText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <ThumbsDown size={16} /> A Mejorar
              </label>
              <textarea
                rows={3}
                className={`${inputClass} text-sm`}
                placeholder="Escribe cada punto en una línea nueva..."
                value={weaknessesText}
                onChange={e => setWeaknessesText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2 sticky bottom-0 bg-white">
            <div className="flex-1"></div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} /> Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;