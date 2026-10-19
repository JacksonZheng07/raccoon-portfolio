import type { ReactNode } from "react";

/*
 * The Markdown subset the class notes are written in: headings, paragraphs,
 * lists, fenced code, **bold**, *italic* and `code`. Builds React elements
 * directly, so nothing in a note is ever parsed as HTML.
 */

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const out: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;
    if (line.startsWith("```")) {
      const body: string[] = [];
      for (i++; i < lines.length && !lines[i]!.startsWith("```"); i++) body.push(lines[i]!);
      i++;
      out.push(<pre key={out.length}>{body.join("\n")}</pre>);
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1]!.length;
      const content = inline(heading[2]!);
      out.push(level === 1 ? <h3 key={out.length}>{content}</h3> : level === 2 ? <h4 key={out.length}>{content}</h4> : <h5 key={out.length}>{content}</h5>);
      i++;
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i]!)) {
        items.push(lines[i]!.replace(/^\s*([-*]|\d+\.)\s+/, ""));
        i++;
      }
      const children = items.map((item, k) => <li key={k}>{inline(item)}</li>);
      out.push(ordered ? <ol key={out.length}>{children}</ol> : <ul key={out.length}>{children}</ul>);
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i]!.trim() !== "" && !/^(#{1,3}\s|```|\s*([-*]|\d+\.)\s)/.test(lines[i]!)) {
      para.push(lines[i]!);
      i++;
    }
    out.push(<p key={out.length}>{inline(para.join(" "))}</p>);
  }
  return <>{out}</>;
}
