import PocketBase from "pocketbase";

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL;

export const pocketbase = new PocketBase(POCKETBASE_URL);
