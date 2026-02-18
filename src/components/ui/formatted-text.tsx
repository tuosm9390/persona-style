import { formatTextWithLineBreaks, cn } from "@/lib/utils";

interface FormattedTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
  as?: React.ElementType; // p, div, span, etc.
}

export function FormattedText({ text, className, as: Component = "p", ...props }: FormattedTextProps) {
  const lines = formatTextWithLineBreaks(text);

  if (!lines || lines.length === 0) return null;

  return (
    <Component className={cn("leading-relaxed", className)} {...props}>
      {lines.map((line, index) => (
        <span key={index} className="block mb-1 last:mb-0">
          {line}
        </span>
      ))}
    </Component>
  );
}
