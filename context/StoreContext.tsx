// context/StoreContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { Student, DrivingClass, Payment, AppState } from '../types';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';

interface StoreContextType extends AppState {
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addClass: (cls: Omit<DrivingClass, 'id'>) => Promise<void>;
  updateClass: (id: string, data: Partial<DrivingClass>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  getStudentById: (id: string) => Student | undefined;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<DrivingClass[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Suscripciones en tiempo real a Firestore
  useEffect(() => {
    const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => {
      const data: Student[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Student, 'id'>),
      }));
      setStudents(data);
    });

    const unsubClasses = onSnapshot(collection(db, 'classes'), (snap) => {
      const data: DrivingClass[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<DrivingClass, 'id'>),
      }));
      setClasses(data);
    });

    const unsubPayments = onSnapshot(collection(db, 'payments'), (snap) => {
      const data: Payment[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Payment, 'id'>),
      }));
      setPayments(data);
    });

    return () => {
      unsubStudents();
      unsubClasses();
      unsubPayments();
    };
  }, []);

  // CRUD STUDENTS
  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    await addDoc(collection(db, 'students'), studentData);
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    await updateDoc(doc(db, 'students', id), data);
  };

  const deleteStudent = async (id: string) => {
    await deleteDoc(doc(db, 'students', id));
  };

  // CRUD CLASSES
  const addClass = async (cls: Omit<DrivingClass, 'id'>) => {
    await addDoc(collection(db, 'classes'), cls);
  };

  const updateClass = async (id: string, data: Partial<DrivingClass>) => {
    await updateDoc(doc(db, 'classes', id), data);
  };

  const deleteClass = async (id: string) => {
    await deleteDoc(doc(db, 'classes', id));
  };

  const getStudentById = (id: string) => {
    return students.find((s) => s.id === id);
  };

  const value = {
    students,
    classes,
    payments,
    addStudent,
    updateStudent,
    deleteStudent,
    addClass,
    updateClass,
    deleteClass,
    getStudentById,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

