import PocketBase from "pocketbase";

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL;

export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
};

const pocketbase = new PocketBase(POCKETBASE_URL);

export default pocketbase;
