// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDXY4CdylavLYsUIx9tzWraM11__15h1_s",
    authDomain: "mauroclasesdemanejo.firebaseapp.com",
    projectId: "mauroclasesdemanejo",
    storageBucket: "mauroclasesdemanejo.firebasestorage.app",
    messagingSenderId: "527350055876",
    appId: "1:527350055876:web:8dfbc37e57942f7ba05a91"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

