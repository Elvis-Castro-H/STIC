import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import * as firebaseui from "firebaseui";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
    apiKey: "AIzaSyDYDVxJ9T1geAh1hHy2ynG_eZVuIM4dM1U",
    authDomain: "stic-ae008.firebaseapp.com",
    projectId: "stic-ae008",
    storageBucket: "stic-ae008.firebasestorage.app",
    messagingSenderId: "181878429356",
    appId: "1:181878429356:web:60586a294e0e03d0d17109",
    measurementId: "G-0TN9XGBJEY"
  };

// Initialize Firebase

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
export const firebaseUi = new firebaseui.auth.AuthUI(firebaseAuth);
firebaseAuth.useDeviceLanguage();
export { firebaseAuth };