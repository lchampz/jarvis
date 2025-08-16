import type { IVisitor, IVisitorStore } from "@/types/visitors.types";
import { create } from "zustand";

export const useVisitorsStore = create<IVisitorStore>((set) => ({
    visitors: [],
    setVisitors: (visitors) => set({ visitors }),
    addVisitor: (visitor) => set((state) => ({ visitors: [...state.visitors, visitor] })),
    updateVisitor: (visitor) => set((state) => ({ visitors: state.visitors.map((v) => v.id === visitor.id ? visitor : v) })),
}));