import { initializeApp } from "firebase/app";
import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where 
} from "firebase/firestore";
 import {getStorage} from 'firebase/storage'; 

 const firebaseConfig = {
    apiKey: process.env.NEXT_APP_apiKey,
    authDomain: process.env.NEXT_APP_authDomain,
    projectId: process.env.NEXT_APP_projectId,
    storageBucket: process.env.NEXT_APP_storageBucket,
    messagingSenderId: process.env.NEXT_APP_messagingSenderId,
    appId: process.env.NEXT_APP_appId,
    measurementId: process.env.NEXT_APP_measurementId
};
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); 

export { collection, addDoc, getDocs, db, updateDoc, doc, deleteDoc, query, where, storage };