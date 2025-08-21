
import React from 'react';

// A simple parser for our specific markdown-like syntax
const parseAndRender = (text: string) => {
  // Split by newlines to handle paragraphs and list items
  const lines = text.split('\n');

  const elements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc space-y-1 my-2 ml-5">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Handle list items
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      const content = trimmedLine.substring(2);
      // Process bolding within the list item
      const parts = content.split(/\*\*(.*?)\*\*/g);
      const renderedContent = parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      );
      currentListItems.push(<li key={index}>{renderedContent}</li>);
      return; // Continue to next line
    }

    // If we were in a list and this line is not a list item, flush the list
    flushList();

    // Handle paragraphs (non-empty lines)
    if (trimmedLine) {
      // Process bolding within the paragraph
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const renderedContent = parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      );
      elements.push(<p key={index}>{renderedContent}</p>);
    }
    // Empty lines act as paragraph breaks, which is handled by splitting by '\n'
  });

  // Flush any remaining list items at the end of the text
  flushList();

  return elements;
};


interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;
  const renderedElements = parseAndRender(content);
  return <div className="text-sm space-y-2">{renderedElements}</div>;
};

export default MarkdownRenderer;
