import { doc, getDoc } from "firebase/firestore";

import { User } from "firebase/auth";

import { firestoreDB } from "@/features/app/auth/signup/constants";
import { UserData } from "@/interfaces/user";

import {
	userDisabledCode,
	wrongPasswordCode,
	userNotFoundCode,
	tooManyRequestsCode,
} from "./constants";

export const getFirebaseLoginErrorMessage = (errorCode: string) => {
	switch (errorCode) {
		case userDisabledCode:
			return "Your account has been disabled. Please contact support.";
		case wrongPasswordCode:
			return "The email or password you entered is incorrect. Please try again.";
		case userNotFoundCode:
			return "The email you entered is not associated with an account. Please check your email address or sign up for a new account.";
		case tooManyRequestsCode:
			return "Too many login attempts. Please try again later.";
		default:
			return "An error occurred while processing your request. Please try again later.";
	}
};

export const fetchUserData = async (user: User) => {
	const userDataDoc = await getDoc(doc(firestoreDB, "users", user.uid));
	return userDataDoc.data() as UserData;
};
