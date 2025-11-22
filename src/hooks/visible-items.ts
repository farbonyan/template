import * as React from "react";

import { useElementWidth } from "./element-width";

/**
 * Get a sub-list of items that will not make a container overflow
 *
 * @param props Contain items, minItems and disable
 * @returns References to container and items list elements and final items
 */
export const useVisibleItems = <
  TData,
  ContainerElement extends Element,
  ItemsElement extends Element,
>({
  items,
  minItems = 2,
  disabled = false,
}: {
  items: TData[];
  minItems: number;
  disabled?: boolean;
}) => {
  const [showItems, setShowItems] = React.useState(items.length);
  const [itemsRef, itemsWidth] = useElementWidth<ItemsElement>();
  const [containerRef, containerWidth] = useElementWidth<ContainerElement>();
  const iw = itemsWidth.scrollWidth;
  const cw = containerWidth.clientWidth;
  const [preCws, setPreCws] = React.useState<number[]>([]);

  const preCw = preCws[0];

  React.useLayoutEffect(() => {
    if (!itemsRef.current || !containerRef.current) return;
    const overflow = iw - cw;
    if (overflow > 0) {
      setPreCws((cws) => [cw, ...cws]);
      setShowItems((items) => Math.max(minItems, items - 1));
      return;
    }
  }, [itemsRef, containerRef, iw, cw, minItems]);

  React.useLayoutEffect(() => {
    if (!itemsRef.current || !containerRef.current) return;
    const overflow = iw - cw;
    if (overflow > 0) return;
    if (preCw && cw > preCw) {
      setPreCws((cws) => cws.slice(1));
      setShowItems((item) => Math.min(items.length, item + 1));
    }
  }, [itemsRef, containerRef, iw, cw, preCw, items.length]);

  React.useEffect(() => {
    setPreCws([]);
    setShowItems(items.length);
  }, [items.length]);

  React.useEffect(() => {
    if (!disabled) return;
    setShowItems(items.length);
  }, [items.length, disabled]);

  const visibleItems = React.useMemo(() => {
    return disabled ? items : items.slice(0, showItems);
  }, [disabled, showItems, items]);

  return [containerRef, itemsRef, visibleItems] as const;
};
