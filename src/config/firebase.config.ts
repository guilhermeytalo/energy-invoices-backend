import * as dotenv from 'dotenv';

dotenv.config();

export default {
    apiKey: "AIzaSyBhGhancyXz_f-G2okEkYmtSYTyhrc2wuk",
    authDomain: "lumi-44c50.firebaseapp.com",
    projectId: "lumi-44c50",
    databaseURL: process.env.DATABASE_URL,
    storageBucket: "lumi-44c50.appspot.com",
    messagingSenderId: "255812095898",
    appId: "1:255812095898:web:397f1239a35c30bcd0b423",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}