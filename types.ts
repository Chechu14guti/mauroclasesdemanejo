// Enums
export enum ClassType {
  PRACTICA = 'Práctica',
  SIMULACION = 'Simulación Examen',
  TEORICA = 'Teórica',
  REPASO = 'Maniobras / Repaso'
}

export enum ClassStatus {
  PROGRAMADA = 'Programada',
  REALIZADA = 'Realizada',
  CANCELADA = 'Cancelada',
  NO_PRESENTADO = 'No presentado'
}

export enum PaymentStatus {
  PENDIENTE = 'Pendiente',
  FACTURADO = 'Facturado',
  PAGADO = 'Pagado'
}

export enum ExamReadiness {
  NO = 'No',
  EN_PROCESO = 'En proceso',
  CASI_LISTO = 'Casi listo',
  SI = 'Sí, preparado'
}

export enum StudentStatus {
  ACTIVO = 'Activo',
  PAUSADO = 'Pausado',
  FINALIZADO = 'Finalizado/Aprobado'
}

// Interfaces
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dni?: string; // Optional
  phone: string;
  email?: string; // Optional
  status: StudentStatus;
  examReadiness: ExamReadiness;
  registrationDate: string;
  pricePerClass: number; // Precio personalizado
  notes: string; // Observaciones generales
  strengths: string[];
  weaknesses: string[];
  avatarUrl?: string;
  promoPacks?: number; // Cantidad de promos (10x9) adquiridas
}

export interface DrivingClass {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  type: ClassType;
  status: ClassStatus;
  paymentStatus: PaymentStatus;
  price: number;
  notes: string; // Notas de la sesión
  location?: string;
  paymentMethod?: 'Efectivo' | 'Transferencia';
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  concept: string;
}

export interface AppState {
  students: Student[];
  classes: DrivingClass[];
  payments: Payment[];
}