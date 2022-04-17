// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCVm6Y7EFYapoKdunoz23Fny7t6iBcgE3Q',
  authDomain: 'insta-clone-a54f2.firebaseapp.com',
  projectId: 'insta-clone-a54f2',
  storageBucket: 'insta-clone-a54f2.appspot.com',
  messagingSenderId: '966728571221',
  appId: '1:966728571221:web:2d7cb2062d12ab68d037dc',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
