import * as React from "react";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "~/lib/utils";

type JsonViewerProps = {
  data: unknown;
  indent?: number;
};

const JsonViewer: React.FC<JsonViewerProps> = ({ data, indent = 0 }) => {
  const [expanded, setExpanded] = React.useState(!indent);

  switch (typeof data) {
    case "string":
      return `"${data}"`;
    case "number":
    case "bigint":
      return data;
    case "boolean":
      return data ? "true" : "false";
    case "symbol":
    case "undefined":
    case "function":
      return "";
    case "object":
      if (data === null) return "null";
      return (
        <div
          style={{ marginLeft: indent * 16 }}
          className={cn(!expanded && "flex items-center gap-1")}
        >
          <div className="flex items-center">
            <button onClick={() => setExpanded((expanded) => !expanded)}>
              <ChevronRightIcon
                className={cn(
                  "size-3 transition-transform",
                  expanded && "rotate-90",
                )}
              />
            </button>
            <span>{"{"}</span>
          </div>
          {expanded ? (
            <div style={{ paddingLeft: indent * 16 }}>
              {Array.isArray(data)
                ? data.map((item: unknown, i) => (
                    <div key={i} className="ms-2">
                      <span style={{ color: "#a71d5d" }} className="ms-2">
                        {i}
                      </span>
                      : <JsonViewer data={item} indent={indent + 1} />
                    </div>
                  ))
                : Object.entries(data).map(
                    ([key, value]: [string, unknown]) => (
                      <div key={key} className="ms-2">
                        <span style={{ color: "#a71d5d" }}>{key}</span>:{" "}
                        <JsonViewer data={value} indent={indent + 1} />
                      </div>
                    ),
                  )}
            </div>
          ) : (
            <span>...</span>
          )}
          <span>{"}"}</span>
        </div>
      );
  }
};

export { JsonViewer, type JsonViewerProps };
