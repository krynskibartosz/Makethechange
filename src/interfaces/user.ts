import { Image } from "@/interfaces/common";

export type UserData = {
	firstName: string;
	lastName: string;
	email: string;
	adress: string;
	phoneNumber: string;
	uid: string;
	photoURL: string | Image;
	pseudo?: string;
	company?: string;
	isAdmin?: boolean;
};
