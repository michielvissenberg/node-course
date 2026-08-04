import { NotFoundException } from "@nestjs/common";

import { UserBody } from "../../../contracts/user.body";
import { UserStore } from "./user.store";

export const update = (idString: string, body: UserBody) => {
	const id = Number(idString);
	const user = UserStore.get(id);
	if (!user) {
		throw new NotFoundException("User not found");
	}
	const updated = UserStore.update(id, { ...user, ...body });
	return updated;
};