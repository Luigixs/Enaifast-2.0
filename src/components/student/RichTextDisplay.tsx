import "react-quill/dist/quill.snow.css";

interface RichTextDisplayProps {
  content: string;
}

export function RichTextDisplay({ content }: RichTextDisplayProps) {
  return (
    <div 
      className="ql-editor prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
