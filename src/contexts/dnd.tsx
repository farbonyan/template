"use client";

import { DndProvider as __DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

/** SSR friendly drag and drop provider */
export const DndProvider = ({ children }: { children: React.ReactNode }) => {
  return <__DndProvider backend={HTML5Backend}>{children}</__DndProvider>;
};
