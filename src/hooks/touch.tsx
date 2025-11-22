"use client";

import * as React from "react";

import { useMediaQuery } from "./media-query";

const TouchContext = React.createContext<boolean | undefined>(undefined);

export const useTouch = () => React.useContext(TouchContext);

export const TouchProvider = (props: React.PropsWithChildren) => {
  const isTouch = useMediaQuery("(pointer: coarse)");

  return <TouchContext.Provider value={isTouch} {...props} />;
};
