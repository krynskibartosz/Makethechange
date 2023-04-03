import produce from "immer";
import { StoreSlice } from "./useRoot";

type USER = {
	auth: { isAuthenticated: boolean; accessToken: string; refreshToken: string };
	data: any;
	language: any;
	country: any;
};

export type UserData = {
	firstName: string;
	lastName: string;
	email: string;
	adress: string;
	phoneNumber: string;
	password: string;
	uid: string;
	photoURL?: {
		file: File;
		url: string;
	};
	pseudo?: string;
	company?: string;
};

type USER_STORE = {
	user: USER;
	login: (reponse: {
		user: {
			auth: {
				isAuth: boolean;
				accessToken: string;
				refreshToken: string;
			};
			data: UserData;
		};
	}) => void;
	signup: (reponse: {
		user: {
			auth: {
				isAuth: boolean;
				accessToken: string;
				refreshToken: string;
			};
			data: {
				firstName: string;
				lastName: string;
				email: string;
				adress: string;
				phoneNumber: string;
				photoURL: string;
				pseudo?: string;
				entreprise?: string;
			};
		};
	}) => void;
};

const initialUser = {
	auth: {
		isAuthenticated: false,
		accessToken: "",
		refreshToken: "",
	},
	data: null,
	language: "fr",
	country: "be",
};

export const userSlice: StoreSlice<USER_STORE> = (set) => ({
	user: initialUser,
	login: (response) => {
		set((state) =>
			produce(state, (draft) => {
				draft.user.auth = {
					isAuthenticated: response.user.auth.isAuth,
					accessToken: response.user.auth.accessToken,
					refreshToken: response.user.auth.refreshToken,
				};
				draft.user.data = response.user.data;
			})
		);
	},
	signup: (response) => {
		set((state) =>
			produce(state, (draft) => {
				draft.user.auth = {
					isAuthenticated: response.user.auth.isAuth,
					accessToken: response.user.auth.accessToken,
					refreshToken: response.user.auth.refreshToken,
				};
				draft.user.data = response.user.data;
			})
		);
	},
});
