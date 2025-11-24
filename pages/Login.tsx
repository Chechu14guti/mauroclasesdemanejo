import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            console.error('Error en login Firebase:', err);

            // Mostrar mensaje según el código de error
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Correo electrónico o contraseña incorrectos.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Formato de correo electrónico no válido.');
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('El método Email/Contraseña no está habilitado en Firebase Auth.');
            } else {
                setError(`Error inesperado: ${err.code || ''}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4 transition-colors">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 text-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-full p-2 mb-4">
                        <BrandLogo className="w-full h-full" showText={false} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bienvenido</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Inicia sesión para gestionar tus clases</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
                        {!isSubmitting && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
                    &copy; {new Date().getFullYear()} Mauro Clases de Manejo
                </div>
            </div>
        </div>
    );
};

export default Login;