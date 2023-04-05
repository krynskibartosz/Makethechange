import { setDoc, doc } from "firebase/firestore";

import { updateProfile, User } from "firebase/auth";

import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

import {
	emailAlreadyInUseCode,
	invalidEmailCode,
	weakPasswordCode,
	firestoreDB,
} from "@/features/app/auth/signup/constants";
import { UserData } from "@/interfaces/user";
import { Image } from "@/interfaces/common";

//* Define function to map Firebase error codes to error messages
export const getFirebaseErrorMessage = (errorCode: string) => {
	switch (errorCode) {
		case emailAlreadyInUseCode:
			return "The email address you entered is already associated with an account. Please use a different email address or login instead.";
		case invalidEmailCode:
			return "The email address you entered is not valid. Please check your email address and try again.";
		case weakPasswordCode:
			return "The password you entered is weak. Please use a stronger password.";
		default:
			return "An error occurred while processing your request. Please try again later.";
	}
};

export const saveUserSignupDataToFirestore = async (
	user: User,
	userSignupData: UserData
) => {
	await setDoc(doc(firestoreDB, "users", user.uid), userSignupData);
};

export const uploadImageToFirebaseStorage = async (photoURL: Image) => {
	if (!photoURL?.file) return "";

	const storage = getStorage();
	const fileRef = ref(storage, `images/${photoURL.file.name}`);
	await uploadBytes(fileRef, photoURL.file);
	return getDownloadURL(fileRef);
};

export const updateUserProfileInFirebase = async (
	user: User,
	firstName: string,
	lastName: string,
	downloadURL: string
) => {
	await updateProfile(user, {
		displayName: `${firstName} ${lastName}`,
		photoURL: downloadURL ?? "",
	});
};
