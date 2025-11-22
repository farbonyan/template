import { mergeAttributes } from "@tiptap/core";
import __Image from "@tiptap/extension-image";

export const Image = __Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      style: {
        default: "width: 100%; height: auto; cursor: pointer;",
        parseHTML: (element) => {
          const width = element.getAttribute("width");
          return width
            ? `width: ${width}px; height: auto; cursor: pointer;`
            : `${element.style.cssText}`;
        },
      },
      title: {
        default: null,
      },
      loading: {
        default: null,
      },
      srcset: {
        default: null,
      },
      sizes: {
        default: null,
      },
      crossorigin: {
        default: null,
      },
      usemap: {
        default: null,
      },
      ismap: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      referrerpolicy: {
        default: null,
      },
      longdesc: {
        default: null,
      },
      decoding: {
        default: null,
      },
      class: {
        default: null,
      },
      id: {
        default: null,
      },
      name: {
        default: null,
      },
      draggable: {
        default: true,
      },
      tabindex: {
        default: null,
      },
      "aria-label": {
        default: null,
      },
      "aria-labelledby": {
        default: null,
      },
      "aria-describedby": {
        default: null,
      },
    };
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const {
        view,
        options: { editable },
      } = editor;
      const { style } = node.attrs;
      const $wrapper = document.createElement("div");
      const $container = document.createElement("div");
      const $img = document.createElement("img");
      const iconStyle = "width: 12px; height: 12px; cursor: pointer;";

      const dispatchNodeView = () => {
        if (typeof getPos === "function") {
          const newAttrs = {
            ...node.attrs,
            style: `${$img.style.cssText}`,
          };
          view.dispatch(
            view.state.tr.setNodeMarkup(getPos() ?? 0, null, newAttrs),
          );
        }
      };
      const paintPositionController = () => {
        const $positionController = document.createElement("div");

        const $leftController = document.createElement("img");
        const $centerController = document.createElement("img");
        const $rightController = document.createElement("img");

        const controllerMouseOver = (e: MouseEvent) => {
          (e.target as HTMLElement).style.opacity = "0.3";
        };

        const controllerMouseOut = (e: MouseEvent) => {
          (e.target as HTMLElement).style.opacity = "1";
        };

        $positionController.setAttribute(
          "style",
          "position: absolute; top: 0%; left: 50%; width: 100px; height: 25px; z-index: 999; background-color: rgba(255, 255, 255, 0.7); border-radius: 4px; border: 2px solid #6C6C6C; cursor: pointer; transform: translate(-50%, -50%); display: flex; justify-content: space-between; align-items: center; padding: 0 10px;",
        );

        $leftController.setAttribute(
          "src",
          "https://unpkg.com/lucide-static@0.460.0/icons/align-horizontal-distribute-end.svg",
        );
        $leftController.setAttribute("style", iconStyle);
        $leftController.classList.add("rtl:rotate-180");
        $leftController.addEventListener("mouseover", controllerMouseOver);
        $leftController.addEventListener("mouseout", controllerMouseOut);

        $centerController.setAttribute(
          "src",
          "https://unpkg.com/lucide-static@0.460.0/icons/align-horizontal-distribute-center.svg",
        );
        $centerController.setAttribute("style", iconStyle);
        $centerController.addEventListener("mouseover", controllerMouseOver);
        $centerController.addEventListener("mouseout", controllerMouseOut);

        $rightController.setAttribute(
          "src",
          "https://unpkg.com/lucide-static@0.460.0/icons/align-horizontal-distribute-start.svg",
        );
        $rightController.setAttribute("style", iconStyle);
        $rightController.classList.add("rtl:rotate-180");
        $rightController.addEventListener("mouseover", controllerMouseOver);
        $rightController.addEventListener("mouseout", controllerMouseOut);

        $leftController.addEventListener("click", () => {
          $img.setAttribute(
            "style",
            `${$img.style.cssText} margin-inline-start: 0; margin-inline-end: auto;`,
          );
          dispatchNodeView();
        });
        $centerController.addEventListener("click", () => {
          $img.setAttribute(
            "style",
            `${$img.style.cssText} margin-inline: auto;`,
          );
          dispatchNodeView();
        });
        $rightController.addEventListener("click", () => {
          $img.setAttribute(
            "style",
            `${$img.style.cssText} margin-inline-start: auto; margin-inline-end: 0;`,
          );
          dispatchNodeView();
        });

        $positionController.appendChild($leftController);
        $positionController.appendChild($centerController);
        $positionController.appendChild($rightController);

        $container.appendChild($positionController);
      };

      $wrapper.setAttribute("style", `display: flex;`);
      $wrapper.appendChild($container);

      $container.setAttribute("style", `${style}`);
      $container.appendChild($img);

      Object.entries(node.attrs).forEach(([key, value]) => {
        if (typeof value === "string") {
          $img.setAttribute(key, value);
        }
      });

      if (!editable) return { dom: $img };

      const dotsPosition = [
        "top: -4px; left: -4px; cursor: nwse-resize;",
        "top: -4px; right: -4px; cursor: nesw-resize;",
        "bottom: -4px; left: -4px; cursor: nesw-resize;",
        "bottom: -4px; right: -4px; cursor: nwse-resize;",
      ];

      let isResizing = false;
      let startX: number, startWidth: number;

      $container.addEventListener("click", () => {
        //remove remaining dots and position controller
        if ($container.childElementCount > 3) {
          for (let i = 0; i < 5; i++) {
            $container.removeChild($container.lastChild as Node);
          }
        }

        paintPositionController();

        $container.setAttribute(
          "style",
          `position: relative; border: 1px dashed #6C6C6C; ${style} cursor: pointer;`,
        );

        Array.from({ length: 4 }, (_, index) => {
          const $dot = document.createElement("div");
          $dot.setAttribute(
            "style",
            `position: absolute; width: 9px; height: 9px; border: 1.5px solid #6C6C6C; border-radius: 50%; ${dotsPosition[index]}`,
          );

          $dot.addEventListener("mousedown", (e) => {
            e.preventDefault();
            isResizing = true;
            startX = e.clientX;
            startWidth = $container.offsetWidth;

            const onMouseMove = (e: MouseEvent) => {
              if (!isResizing) return;
              const deltaX =
                index % 2 === 0 ? -(e.clientX - startX) : e.clientX - startX;

              const newWidth = startWidth + deltaX;

              $container.style.width = newWidth + "px";

              $img.style.width = newWidth + "px";
            };

            const onMouseUp = () => {
              if (isResizing) {
                isResizing = false;
              }
              dispatchNodeView();

              document.removeEventListener("mousemove", onMouseMove);
              document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
          });
          $container.appendChild($dot);
        });
      });

      document.addEventListener("click", (e: MouseEvent) => {
        const $target = e.target as HTMLElement;
        const isClickInside =
          $container.contains($target) || $target.style.cssText === iconStyle;

        if (!isClickInside) {
          const containerStyle = $container.getAttribute("style");
          const newStyle = containerStyle?.replace(
            "border: 1px dashed #6C6C6C;",
            "",
          );
          $container.setAttribute("style", newStyle!);

          if ($container.childElementCount > 3) {
            for (let i = 0; i < 5; i++) {
              $container.removeChild($container.lastChild as Node);
            }
          }
        }
      });

      return {
        dom: $wrapper,
      };
    };
  },
  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },
});

export default Image;
