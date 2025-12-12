"use client";

import * as React from "react";
import { renderAsync } from "docx-preview";
import { ArrowDownIcon, ArrowUpIcon, XIcon } from "lucide-react";
import { useFormatter } from "next-intl";

import { Button } from "~/components/ui/button";
import { DebouncedTextInput } from "~/components/ui/debounced-text-input";
import { Loadable } from "~/components/ui/loadable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

export type DocxPreviewProps = {
  link: string;
};

export const DocxPreview = ({ link }: DocxPreviewProps) => {
  const formatter = useFormatter();
  const ref = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [matches, setMatches] = React.useState<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(link);
        if (!res.ok) throw new Error("Failed to fetch document");
        const arrayBuffer = await res.arrayBuffer();
        if (cancelled) return;
        container.innerHTML = "";
        await renderAsync(arrayBuffer, container);
      } catch {
        container.innerHTML = "<p>Failed to load document preview.</p>";
      } finally {
        setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [link]);

  const onSearch = React.useCallback((query: string) => {
    const container = ref.current;
    if (!container) return;

    // 1️⃣ Clear previous highlights
    container.querySelectorAll("mark[data-search]").forEach((el) => {
      const parent = el.parentNode!;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });

    setQuery(query);

    if (!query.trim()) {
      setMatches([]);
      return;
    }

    const regex = new RegExp(query, "gi");
    const textNodes: Text[] = [];

    // 2️⃣ First pass — collect all text nodes (no modification yet)
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (node.nodeValue && regex.test(node.nodeValue)) {
        textNodes.push(node);
      }
    }

    const found: HTMLElement[] = [];

    // 3️⃣ Second pass — mutate nodes safely
    for (const node of textNodes) {
      const frag = document.createDocumentFragment();
      let lastIdx = 0;
      const text = node.nodeValue!;
      text.replace(regex, (match, idx: number) => {
        frag.appendChild(document.createTextNode(text.slice(lastIdx, idx)));
        const mark = document.createElement("mark");
        mark.textContent = match;
        mark.dataset.search = "true";
        frag.appendChild(mark);
        found.push(mark);
        lastIdx = idx + match.length;
        return match;
      });
      frag.appendChild(document.createTextNode(text.slice(lastIdx)));
      node.parentNode?.replaceChild(frag, node);
    }

    setMatches(found);
    setCurrentIndex(0);

    if (found.length > 0) {
      found[0]!.scrollIntoView({ behavior: "smooth", block: "center" });
      found[0]!.classList.add("bg-yellow-300");
    }
  }, []);

  const goToMatch = React.useCallback(
    (direction: "next" | "prev") => {
      if (matches.length === 0) return;
      setCurrentIndex((currentIndex) => {
        matches[currentIndex]?.classList.remove("bg-yellow-300");

        const nextIndex =
          direction === "next"
            ? (currentIndex + 1) % matches.length
            : (currentIndex - 1 + matches.length) % matches.length;

        const next = matches[nextIndex];
        next?.scrollIntoView({ behavior: "smooth", block: "center" });
        next?.classList.add("bg-yellow-300");
        return nextIndex;
      });
    },
    [matches],
  );

  const clearSearch = () => {
    setMatches([]);
    setCurrentIndex(0);
    onSearch("");
  };

  return (
    <div className="relative h-full">
      <div className="absolute end-4 top-4 z-20 flex items-center gap-1 rounded border bg-input p-1">
        <DebouncedTextInput
          autoFocus
          value={query}
          onChange={onSearch}
          cancelable={false}
          className="border-none bg-transparent shadow-none focus-visible:ring-transparent"
        />
        {query && (
          <p className="text-center text-xs">
            {formatter.number(currentIndex + 1)} /{" "}
            {formatter.number(matches.length)}
          </p>
        )}
        <Separator orientation="vertical" className="h-6 bg-muted-foreground" />
        <Button
          disabled={currentIndex <= 0}
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            goToMatch("prev");
          }}
          className="size-6"
        >
          <ArrowUpIcon className="size-4" />
        </Button>
        <Button
          disabled={currentIndex >= matches.length - 1}
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            goToMatch("next");
          }}
          className="size-6"
        >
          <ArrowDownIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clearSearch}
          className="size-6"
        >
          <XIcon className="size-4" />
        </Button>
      </div>
      <ScrollArea className="h-full">
        <Loadable loading={loading}>
          <div
            ref={ref}
            className="w-full [&>div>section]:!w-auto [&>div]:w-full"
          />
        </Loadable>
      </ScrollArea>
    </div>
  );
};
