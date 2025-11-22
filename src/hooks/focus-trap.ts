import * as React from "react";

const focusableElementsSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Get a ref that traps focus within
 *
 * @returns Ref object
 */
export const useFocusTrap = <T extends HTMLElement>() => {
  const containerRef = React.useRef<T>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") {
        return;
      }
      const focusableElements = [
        ...container.querySelectorAll<HTMLElement>(focusableElementsSelector),
      ].filter(
        (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"),
      );

      if (focusableElements.length === 0) return;
      const activeElementIndex = document.activeElement
        ? focusableElements.indexOf(document.activeElement as HTMLElement)
        : -1;

      if (e.shiftKey) {
        if (activeElementIndex === 0) {
          return;
        }
        e.preventDefault();
        focusableElements[activeElementIndex - 1]?.focus();
      } else {
        if (activeElementIndex === focusableElements.length - 1) {
          return;
        }
        e.preventDefault();
        focusableElements[activeElementIndex + 1]?.focus();
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.focus();
      }
    };
    container.addEventListener("keydown", handleKeyDown);
    container.addEventListener("mousedown", handleMouseDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("mousedown", handleMouseDown);
    };
  }, [containerRef]);

  return containerRef;
};
