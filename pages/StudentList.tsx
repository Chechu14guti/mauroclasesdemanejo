import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Car, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { StudentStatus, ExamReadiness, ClassStatus } from '../types';
import StudentModal from '../components/StudentModal';

const StudentList: React.FC = () => {
  const { students, classes, deleteStudent } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStudents = students.filter(s =>
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClassesCount = (studentId: string) => {
    // Count realized classes
    return classes.filter(c => c.studentId === studentId && c.status === ClassStatus.REALIZADA).length;
  };

  // New helper to count ALL scheduled or realized classes to show "Total" engagement
  const getTotalClassesCount = (studentId: string) => {
    return classes.filter(c => c.studentId === studentId && c.status !== ClassStatus.CANCELADA).length;
  };

  const getStatusColor = (status: StudentStatus) => {
    switch (status) {
      case StudentStatus.ACTIVO: return 'bg-green-100 text-green-700';
      case StudentStatus.PAUSADO: return 'bg-yellow-100 text-yellow-700';
      case StudentStatus.FINALIZADO: return 'bg-gray-100 text-gray-700';
    }
  };

  const getReadinessColor = (readiness: ExamReadiness) => {
    if (readiness === ExamReadiness.SI) return 'text-green-600 font-bold';
    if (readiness === ExamReadiness.CASI_LISTO) return 'text-blue-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alumnos</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestión de expedientes y progresos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
        >
          <Plus size={18} /> Nuevo Alumno
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-colors"
          placeholder="Buscar por nombre o apellido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table (Desktop) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Clases</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nivel Examen</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => navigate(`/students/${student.id}`)}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900 dark:text-white text-base">{student.firstName} {student.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-gray-300"><Phone size={14} /> {student.phone}</div>
                    {student.email && <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg font-bold text-sm">
                      <Car size={14} />
                      {getTotalClassesCount(student.id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getReadinessColor(student.examReadiness)}>{student.examReadiness}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100 dark:divide-slate-700">
          {filteredStudents.map(student => (
            <div key={student.id} onClick={() => navigate(`/students/${student.id}`)} className="p-4 active:bg-gray-50 dark:active:bg-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{student.firstName} {student.lastName}</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{student.phone}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                  <div className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-bold">
                    <Car size={12} /> {getTotalClassesCount(student.id)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-sm ${getReadinessColor(student.examReadiness)}`}>{student.examReadiness}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default StudentList;