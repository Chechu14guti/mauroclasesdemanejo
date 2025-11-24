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
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden z-10">
                {/* Header */}
                <div className="bg-slate-950 p-8 flex flex-col items-center justify-center border-b-4 border-orange-500">
                    <div className="bg-white/10 p-4 rounded-full mb-2">
                        <BrandLogo className="w-20 h-20" showText={false} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">MAURO</h1>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-[0.3em]">Clases de Manejo</p>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Acceso Administrativo</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="admin@mauroclases.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? 'Iniciando...' : 'Ingresar al Sistema'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            Panel de gestión exclusivo para personal autorizado.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;