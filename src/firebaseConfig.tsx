// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCCQd6zPVdMQNnswMSTNwUd2Jc-o_eQMY",
  authDomain: "vitereactapp.firebaseapp.com",
  projectId: "vitereactapp",
  storageBucket: "vitereactapp.appspot.com",
  messagingSenderId: "918617416181",
  appId: "1:918617416181:web:78c358a33120e1816f80bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage