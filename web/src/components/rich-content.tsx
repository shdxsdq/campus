"use client";

import { BlocksRenderer, type BlocksContent } from "@strapi/blocks-react-renderer";

import type { RichContentNode } from "@/lib/types";

export function RichContent({ content }: { content: RichContentNode[] }) {
  return (
    <BlocksRenderer
      content={content as BlocksContent}
      blocks={{
        paragraph: ({ children }) => <p>{children}</p>,
        heading: ({ children, level }) => {
          switch (level) {
            case 1:
              return <h1>{children}</h1>;
            case 2:
              return <h2>{children}</h2>;
            case 3:
              return <h3>{children}</h3>;
            case 4:
              return <h4>{children}</h4>;
            case 5:
              return <h5>{children}</h5>;
            case 6:
              return <h6>{children}</h6>;
            default:
              return <h2>{children}</h2>;
          }
        },
        list: ({ children, format }) => {
          const Tag = format === "ordered" ? "ol" : "ul";
          return <Tag>{children}</Tag>;
        },
        quote: ({ children }) => <blockquote>{children}</blockquote>,
        code: ({ plainText }) => (
          <pre>
            <code>{plainText}</code>
          </pre>
        ),
        link: ({ children, url }) => (
          <a href={url} target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
        image: ({ image }) => (
          <figure className="article-body-figure">
            <img
              className="article-body-image"
              src={image.url}
              alt={image.alternativeText ?? image.name ?? ""}
            />
            {image.caption ? <figcaption>{image.caption}</figcaption> : null}
          </figure>
        ),
      }}
      modifiers={{
        bold: ({ children }) => <strong>{children}</strong>,
        italic: ({ children }) => <em>{children}</em>,
        underline: ({ children }) => <u>{children}</u>,
        strikethrough: ({ children }) => <s>{children}</s>,
        code: ({ children }) => <code>{children}</code>,
      }}
    />
  );
}
