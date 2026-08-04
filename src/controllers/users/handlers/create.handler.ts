import { UserStore } from "./user.store";
import { UserBody } from "../../../contracts/user.body";

export const create = async (body: UserBody) => {
	const user = UserStore.add(body);
	return user;
};
