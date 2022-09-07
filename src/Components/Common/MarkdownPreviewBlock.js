import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import './MarkdownPreviewBlock.css';

const { deltaToMarkdown } = require('quill-delta-to-markdown');

const MarkdownPreviewBlock = ({ value, className, onClick }) => {
  const adjustSource = (source) => {
    if (source.includes('"ops":[')) {
      const { ops } = JSON.parse(source);
      return deltaToMarkdown(ops);
    }
    return source || 'Click to add details';
  };
  return (
    <div
      className={`${className} clickable-container`}
      tabIndex="-3"
      role="button"
      onKeyPress={() => {}}
      onClick={onClick}
    >
      <MarkdownPreview
        className="markdown-preview-container"
        source={adjustSource(value)}
      />
    </div>
  );
};

export default MarkdownPreviewBlock;