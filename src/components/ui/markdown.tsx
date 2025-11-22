import * as React from "react";
import ReactMarkdown from "react-markdown";

import { useNumericFormatter } from "~/hooks/numeric-formatter";
import { cn } from "~/lib/utils";
import { HighlightText } from "./highlight-text";

type TextProps = {
  search?: string;
  children: React.ReactNode;
};

const Text = ({ children, search }: TextProps) => {
  const numericFormatter = useNumericFormatter();

  return (
    <>
      {React.Children.map(children, (child) =>
        typeof child === "string" ? (
          <HighlightText text={numericFormatter(child)} highlight={search} />
        ) : (
          child
        ),
      )}
    </>
  );
};

type MarkdownProps = {
  content: string;
  search?: string;
};

const Markdown = ({ content, search }: MarkdownProps) => {
  return (
    <div className="[&>h2]:text-xl [&>h2]:font-bold [&>h3]:font-semibold [&>ol>li]:ms-4 [&>ol]:list-decimal [&>ul>li]:ms-4 [&>ul]:list-disc">
      <ReactMarkdown
        components={{
          p: ({ children, className, ...props }) => {
            return (
              <p {...props} className={cn("mb-2", className)}>
                <Text children={children} search={search} />
              </p>
            );
          },
          span: ({ children, className, ...props }) => {
            return (
              <span {...props} className={cn("mb-2", className)}>
                <Text children={children} search={search} />
              </span>
            );
          },
          strong: ({ children, className, ...props }) => {
            return (
              <strong {...props} className={cn("mb-2", className)}>
                <Text children={children} search={search} />
              </strong>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export { Markdown, type MarkdownProps };
