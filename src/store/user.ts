import produce from "immer";
import { StoreSlice } from "./useRoot";
import { UserData } from "@/interfaces/user";
import { Image } from "@/interfaces/common";

type USER = {
	auth: { isAuthenticated: boolean; accessToken: string; refreshToken: string };
	data: any;
	language: any;
	country: any;
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
				photoURL: string | Image;
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
