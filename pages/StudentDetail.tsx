import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Wallet, GraduationCap, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ClassStatus, PaymentStatus } from '../types';
import StudentModal from '../components/StudentModal';

const StudentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { students, classes, deleteStudent } = useStore();
    const [activeTab, setActiveTab] = useState<'info' | 'history' | 'billing'>('info');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const student = students.find(s => s.id === id);

    const studentClasses = useMemo(() =>
        classes.filter(c => c.studentId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [classes, id]);

    const billingStats = useMemo(() => {
        const totalClasses = studentClasses.filter(c => c.status === ClassStatus.REALIZADA).length;
        const totalAmount = studentClasses.reduce((acc, c) => c.status === ClassStatus.REALIZADA ? acc + c.price : acc, 0);
        const paidAmount = studentClasses.reduce((acc, c) => c.paymentStatus === PaymentStatus.PAGADO ? acc + c.price : acc, 0);
        const pendingAmount = studentClasses.reduce((acc, c) =>
            (c.status === ClassStatus.REALIZADA && c.paymentStatus !== PaymentStatus.PAGADO) ? acc + c.price : acc,
            0);

        return { totalClasses, totalAmount, paidAmount, pendingAmount };
    }, [studentClasses]);

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar a este alumno? Se eliminará todo su historial y clases asociadas. Esta acción no se puede deshacer.')) {
            if (id) {
                deleteStudent(id);
                navigate('/students');
            }
        }
    };

    if (!student) return <div className="p-8 text-center text-gray-500">Alumno no encontrado</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Volver
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center transition-colors">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</h1>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1 bg-gray-50 dark:bg-slate-700 px-3 py-1 rounded-lg border border-gray-100 dark:border-slate-600">
                            <Clock size={14} /> {billingStats.totalClasses} Clases
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 dark:bg-slate-700 px-3 py-1 rounded-lg border border-gray-100 dark:border-slate-600">
                            <Wallet size={14} /> ${billingStats.pendingAmount} Pendiente
                        </span>
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-800 font-bold">
                            {student.examReadiness}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button
                        onClick={handleDelete}
                        className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-5 py-2.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-800 transition-all font-medium flex-1 md:flex-none"
                    >
                        <Trash2 size={16} /> Eliminar
                    </button>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all font-medium flex-1 md:flex-none"
                    >
                        <Edit2 size={16} /> Editar Perfil
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-8">
                    {['info', 'history', 'billing'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600'
                                }`}
                        >
                            {tab === 'info' ? 'Progreso y Datos' : tab === 'history' ? 'Historial Clases' : 'Facturación'}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="animate-fade-in">
                {activeTab === 'info' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-lg"><CheckCircle size={20} className="text-green-500" /> Puntos Fuertes</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                {student.strengths.length > 0 ? student.strengths.map((s, i) => <li key={i}>{s}</li>) : <li className="text-gray-400 italic">Sin registros</li>}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-lg"><GraduationCap size={20} className="text-orange-500" /> A Mejorar</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                {student.weaknesses.length > 0 ? student.weaknesses.map((s, i) => <li key={i}>{s}</li>) : <li className="text-gray-400 italic">Sin registros</li>}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 col-span-1 md:col-span-2 transition-colors">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Notas Generales</h3>
                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-100 dark:border-slate-600">
                                {student.notes || 'No hay notas generales.'}
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                            <thead className="bg-gray-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Notas Clase</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                {studentClasses.map(cls => (
                                    <tr key={cls.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {cls.date} <span className="text-gray-400 text-xs ml-1">{cls.startTime}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{cls.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${cls.status === ClassStatus.REALIZADA ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                                    cls.status === ClassStatus.PROGRAMADA ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                }`}>
                                                {cls.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                            {cls.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 transition-colors">
                                <div className="text-sm text-green-600 dark:text-green-400 mb-1">Total Pagado</div>
                                <div className="text-2xl font-bold text-green-700 dark:text-green-300">$ {billingStats.paidAmount}</div>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800 transition-colors">
                                <div className="text-sm text-red-600 dark:text-red-400 mb-1">Pendiente</div>
                                <div className="text-2xl font-bold text-red-700 dark:text-red-300">$ {billingStats.pendingAmount}</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl border border-gray-100 dark:border-slate-600 transition-colors">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Precio / Clase</div>
                                <div className="text-2xl font-bold text-gray-700 dark:text-white">$ {student.pricePerClass}</div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
                            <div className="p-4 border-b border-gray-100 dark:border-slate-700 font-bold text-gray-700 dark:text-white">Desglose Económico</div>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead className="bg-gray-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Clase</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Estado Pago</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Importe</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {studentClasses.map(cls => (
                                        <tr key={cls.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                {cls.date} - {cls.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${cls.paymentStatus === PaymentStatus.PAGADO ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                                        cls.paymentStatus === PaymentStatus.FACTURADO ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                                                    }`}>
                                                    {cls.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                                                $ {cls.price}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <StudentModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                studentToEdit={student}
            />
        </div>
    );
};

export default StudentDetail;