import { ClassStatus, ClassType, ExamReadiness, PaymentStatus, Student, DrivingClass, StudentStatus } from "./types";

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    firstName: 'Lucía',
    lastName: 'García',
    dni: '12345678A',
    phone: '11 4123 4567',
    email: 'lucia.garcia@example.com',
    status: StudentStatus.ACTIVO,
    examReadiness: ExamReadiness.CASI_LISTO,
    registrationDate: '2023-09-01',
    pricePerClass: 15000,
    notes: 'Disponible solo tardes. Quiere carnet manual.',
    strengths: ['Atención', 'Respeto señales'],
    weaknesses: ['Aparcamiento en batería', 'Miedo en autovía'],
    avatarUrl: 'https://picsum.photos/200'
  },
  {
    id: '2',
    firstName: 'Marcos',
    lastName: 'Alonso',
    dni: '87654321B',
    phone: '11 6999 8888',
    email: 'marcos.alonso@example.com',
    status: StudentStatus.ACTIVO,
    examReadiness: ExamReadiness.EN_PROCESO,
    registrationDate: '2023-10-15',
    pricePerClass: 18000,
    notes: 'Prioridad mañanas. Carnet automático.',
    strengths: ['Control del volante'],
    weaknesses: ['Uso de espejos', 'Distancia de seguridad'],
    avatarUrl: 'https://picsum.photos/201'
  },
  {
    id: '3',
    firstName: 'Ana',
    lastName: 'Fernández',
    dni: '11223344C',
    phone: '11 2345 6789',
    email: 'ana.fdez@example.com',
    status: StudentStatus.FINALIZADO,
    examReadiness: ExamReadiness.SI,
    registrationDate: '2023-08-01',
    pricePerClass: 15000,
    notes: 'Ya aprobó el teórico a la primera.',
    strengths: ['Todo genial'],
    weaknesses: [],
    avatarUrl: 'https://picsum.photos/202'
  }
];

// Generate some classes for the current week and surrounding
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

export const MOCK_CLASSES: DrivingClass[] = [
  {
    id: '101',
    studentId: '1',
    date: formatDate(today),
    startTime: '10:00',
    endTime: '11:00',
    durationMinutes: 60,
    type: ClassType.PRACTICA,
    status: ClassStatus.PROGRAMADA,
    paymentStatus: PaymentStatus.PENDIENTE,
    price: 15000,
    notes: 'Practicar zona examen.'
  },
  {
    id: '102',
    studentId: '2',
    date: formatDate(today),
    startTime: '11:30',
    endTime: '12:30',
    durationMinutes: 60,
    type: ClassType.PRACTICA,
    status: ClassStatus.REALIZADA,
    paymentStatus: PaymentStatus.PAGADO,
    price: 18000,
    notes: 'Mejorando giros.'
  },
  {
    id: '103',
    studentId: '1',
    date: formatDate(new Date(today.getTime() + 86400000)), // Tomorrow
    startTime: '16:00',
    endTime: '17:00',
    durationMinutes: 60,
    type: ClassType.SIMULACION,
    status: ClassStatus.PROGRAMADA,
    paymentStatus: PaymentStatus.PENDIENTE,
    price: 15000,
    notes: ''
  },
  {
    id: '104',
    studentId: '2',
    date: formatDate(new Date(today.getTime() - 86400000)), // Yesterday
    startTime: '09:00',
    endTime: '10:00',
    durationMinutes: 60,
    type: ClassType.PRACTICA,
    status: ClassStatus.REALIZADA,
    paymentStatus: PaymentStatus.FACTURADO,
    price: 18000,
    notes: ''
  }
];

export const HOURS_START = 7; // 7 AM
export const HOURS_END = 21; // 9 PM
export const TIME_SLOT_MINUTES = 30;