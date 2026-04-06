import sanitizeHtml from "sanitize-html";

const allowedTags = [
  ...sanitizeHtml.defaults.allowedTags,
  "figure",
  "figcaption",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "hr",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

const allowedAttributes: sanitizeHtml.IOptions["allowedAttributes"] = {
  ...sanitizeHtml.defaults.allowedAttributes,
  "*": ["class"],
  a: [...(sanitizeHtml.defaults.allowedAttributes.a ?? []), "target", "rel", "title"],
  img: ["src", "srcset", "sizes", "alt", "title", "width", "height", "loading"],
  figure: ["class"],
  figcaption: ["class"],
  th: ["colspan", "rowspan", "scope"],
  td: ["colspan", "rowspan"],
};

export const sanitizeArticleHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https", "mailto", "tel", "data"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const target = attribs.target === "_blank" ? "_blank" : undefined;

        return {
          tagName,
          attribs: {
            ...attribs,
            ...(target
              ? {
                  target,
                  rel: "noopener noreferrer",
                }
              : {}),
          },
        };
      },
    },
  });
