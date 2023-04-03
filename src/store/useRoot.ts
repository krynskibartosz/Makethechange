import { create, StoreApi } from "zustand";
import { persist, devtools } from "zustand/middleware";

import { userSlice } from "./user";

export type StoreSlice<T extends object, E extends object = T> = (
	set: StoreApi<E extends T ? E : E & T>["setState"],
	get: StoreApi<E extends T ? E : E & T>["getState"]
) => T;

const createRootSlice = (
	set: StoreApi<any>["setState"],
	get: StoreApi<any>["getState"]
) => ({
	...userSlice(set, get),
});

const useRootStore = create(
	devtools(persist(createRootSlice, { name: "root" }))
);

export default useRootStore;
