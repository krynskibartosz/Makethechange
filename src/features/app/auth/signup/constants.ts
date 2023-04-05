import { getFirestore } from "firebase/firestore";
import { app } from "../../../../pages/_app";

//* Define firestoreDB constant for database connection
export const firestoreDB = getFirestore(app);
export const minPasswordLength = 8;

//* Define constants for Firebase error codes
export const emailAlreadyInUseCode = "auth/email-already-in-use";
export const invalidEmailCode = "auth/invalid-email";
export const weakPasswordCode = "auth/weak-password";
