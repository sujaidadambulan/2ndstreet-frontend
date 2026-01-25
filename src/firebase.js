import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA1ERBlOdR6GRwizV8elt_MyTbGOQCpuas",
    authDomain: "ndstreet-7ccd2.firebaseapp.com",
    projectId: "ndstreet-7ccd2",
    storageBucket: "ndstreet-7ccd2.firebasestorage.app",
    messagingSenderId: "40432415461",
    appId: "1:40432415461:web:a71aaec32cf57ee10c9a0c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
