import { UserStore, User } from "./user.store";

export const getList = (search: string): User[] => {
    const users = UserStore.find(search);
    return users;
};
