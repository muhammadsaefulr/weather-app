import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCexNX3B59i8zD1PDwhURcZ5FBRDZt_6g4",

  authDomain: "mainexample-ab306.firebaseapp.com",

  projectId: "mainexample-ab306",

  storageBucket: "mainexample-ab306.appspot.com",

  messagingSenderId: "136274650227",

  appId: "1:136274650227:web:c356a634b6d62d99803606",

  measurementId: "G-05GRV5GPRX",
};

export const firebaseAppClient = initializeApp(firebaseConfig);
