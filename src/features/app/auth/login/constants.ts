import { getFirestore } from "firebase/firestore";
import { app } from "../../../../pages/_app";

export const firestoreDB = getFirestore(app);

export const userDisabledCode = "auth/user-disabled";
export const wrongPasswordCode = "auth/wrong-password";
export const userNotFoundCode = "auth/user-not-found";
export const tooManyRequestsCode = "auth/too-many-requests";
