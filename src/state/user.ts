import type { Project, User } from "@prisma/client";
import { create } from "zustand";

type UserWithProjects = User & { projects: Project[] };

interface UserStore {
  user: UserWithProjects | null;
  setUser: (user: any) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: any) => set({ user }),
}));

export default useUserStore;
