import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAveVmWALPV-TMFTjmST02AyUCEYj1yazs",
  authDomain: "nextfire-bacbf.firebaseapp.com",
  projectId: "nextfire-bacbf",
  storageBucket: "nextfire-bacbf.appspot.com",
  messagingSenderId: "483419379953",
  appId: "1:483419379953:web:31bf320cee5dbcd65bf150"
};

//* Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const firestore = getFirestore()
export const storage = getStorage()