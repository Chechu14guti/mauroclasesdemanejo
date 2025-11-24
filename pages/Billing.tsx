import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useStore } from '../context/StoreContext';
import { ClassStatus, PaymentStatus } from '../types';
import { TrendingUp, AlertCircle, CheckCircle, FileText, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Billing: React.FC = () => {
    const { students, classes } = useStore();

    // State for month filter. Default to current month. "all" for everything.
    const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);

    // Available months from classes
    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        classes.forEach(c => months.add(c.date.slice(0, 7)));
        // Add current month just in case
        months.add(currentMonthStr);
        return Array.from(months).sort().reverse();
    }, [classes, currentMonthStr]);

    const filteredClasses = useMemo(() => {
        if (selectedMonth === 'all') return classes;
        return classes.filter(c => c.date.startsWith(selectedMonth));
    }, [classes, selectedMonth]);

    const summary = useMemo(() => {
        let globalPending = 0;
        let globalPaid = 0;

        // Calculate per student based on FILTERED classes
        const studentData = students.map(s => {
            const sClasses = filteredClasses.filter(c => c.studentId === s.id);

            const pending = sClasses.reduce((acc, c) =>
                (c.status === ClassStatus.REALIZADA && c.paymentStatus !== PaymentStatus.PAGADO) ? acc + c.price : acc, 0);

            const paid = sClasses.reduce((acc, c) =>
                c.paymentStatus === PaymentStatus.PAGADO ? acc + c.price : acc, 0);

            globalPending += pending;
            globalPaid += paid;

            return {
                name: `${s.firstName} ${s.lastName.charAt(0)}.`,
                pending,
                paid,
                total: pending + paid
            };
        })
            .filter(s => s.total > 0) // Only show students with activity in this period
            .sort((a, b) => b.total - a.total).slice(0, 10); // Top 10

        return { studentData, globalPending, globalPaid };
    }, [students, filteredClasses]);

    // Monthly breakdown (useful only when 'all' is selected, or to show daily progress if month is selected)
    const chartData = useMemo(() => {
        const data: Record<string, { label: string, total: number }> = {};

        if (selectedMonth === 'all') {
            // Group by Month
            filteredClasses.forEach(c => {
                if (c.status === ClassStatus.REALIZADA || c.paymentStatus === PaymentStatus.PAGADO) {
                    const key = c.date.slice(0, 7); // YYYY-MM
                    if (!data[key]) data[key] = { label: key, total: 0 };
                    data[key].total += c.price;
                }
            });
        } else {
            // Group by Day (since we are in a specific month)
            filteredClasses.forEach(c => {
                if (c.status === ClassStatus.REALIZADA || c.paymentStatus === PaymentStatus.PAGADO) {
                    const key = c.date; // YYYY-MM-DD
                    if (!data[key]) data[key] = { label: key.slice(8), total: 0 }; // Just Day label
                    data[key].total += c.price;
                }
            });
        }

        return Object.values(data).sort((a, b) => a.label.localeCompare(b.label));
    }, [filteredClasses, selectedMonth]);


    const generatePDF = () => {
        const doc = new jsPDF();
        const periodLabel = selectedMonth === 'all' ? 'Histórico Completo' : `Mes: ${selectedMonth}`;

        // Title
        doc.setFontSize(20);
        doc.text("Mauro Clases de Manejo - Reporte Financiero", 14, 22);

        doc.setFontSize(11);
        doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-AR')}`, 14, 30);
        doc.text(`Período Reportado: ${periodLabel}`, 14, 36);

        // Summary Section
        doc.setFillColor(240, 240, 240);
        doc.rect(14, 42, 182, 30, 'F');
        doc.setFontSize(12);
        doc.text(`Total Generado: $${summary.globalPaid + summary.globalPending}`, 20, 52);
        doc.text(`Total Cobrado: $${summary.globalPaid}`, 20, 62);
        doc.text(`Pendiente de Cobro: $${summary.globalPending}`, 100, 62);

        // Main Chart Data Table
        doc.setFontSize(14);
        doc.text(selectedMonth === 'all' ? "Evolución Mensual" : "Evolución Diaria", 14, 85);

        autoTable(doc, {
            startY: 90,
            head: [[selectedMonth === 'all' ? 'Mes' : 'Día', 'Facturado ($)']],
            body: chartData.map(m => [m.label, `$${m.total}`]),
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235] }
        });

        // Student Debts Table
        const finalY = (doc as any).lastAutoTable.finalY || 100;
        doc.setFontSize(14);
        doc.text("Detalle por Alumno (Top 10 en período)", 14, finalY + 15);

        autoTable(doc, {
            startY: finalY + 20,
            head: [['Alumno', 'Pagado', 'Pendiente', 'Total']],
            body: summary.studentData.map(s => [
                s.name,
                `$${s.paid}`,
                `$${s.pending}`,
                `$${s.total}`
            ]),
            theme: 'grid',
        });

        doc.save(`reporte_financiero_${selectedMonth}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Facturación</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Control de ingresos y cuentas pendientes</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Month Selector */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
                        >
                            <option value="all">Todo el Histórico</option>
                            {availableMonths.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={generatePDF}
                        className="flex justify-center items-center gap-2 bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600 shadow-md transition-all"
                    >
                        <FileText size={18} /> <span className="hidden sm:inline">PDF</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards (Filtered) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Generado ({selectedMonth === 'all' ? 'Histórico' : selectedMonth})</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$ {summary.globalPaid + summary.globalPending}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pendiente de Cobro</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$ {summary.globalPending}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Cobrado</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$ {summary.globalPaid}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Charts: Student Breakdown */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 h-80 transition-colors">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Ingresos por Alumno (Top 10 en selección)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={summary.studentData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-slate-700" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                            <Bar dataKey="paid" name="Pagado" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={30} />
                            <Bar dataKey="pending" name="Pendiente" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Charts: Time Breakdown */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 h-80 transition-colors">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">{selectedMonth === 'all' ? 'Evolución Mensual' : 'Evolución Diaria'}</h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-slate-700" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="total" name="Facturado" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">Sin datos para este período</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Billing;