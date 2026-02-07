import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const MarkdownEditor = ({ value, onChange }) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = React.useRef(null);

  const handleTextareaChange = (e) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const insertMarkdown = (markdownBefore, markdownAfter = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = 
      value.substring(0, start) + 
      markdownBefore + 
      selectedText + 
      markdownAfter + 
      value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + markdownBefore.length + selectedText.length + markdownAfter.length,
        start + markdownBefore.length + selectedText.length + markdownAfter.length
      );
    }, 0);
  };

  const handleBold = () => insertMarkdown('**', '**');
  const handleItalic = () => insertMarkdown('*', '*');
  const handleHeading = () => insertMarkdown('# ');
  const handleSubheading = () => insertMarkdown('## ');
  const handleList = () => insertMarkdown('- ');
  const handleCode = () => insertMarkdown('```javascript\n', '\n```');
  const handleLink = () => insertMarkdown('[Link text](', ')');
  
  const handleFigmaEmbed = () => {
    insertMarkdown('\n\n[Figma Embed](https://www.figma.com/file/example)\n\n');
  };
  
  const handleLoomEmbed = () => {
    insertMarkdown('\n\n[Loom Video](https://www.loom.com/share/example)\n\n');
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-secondary-50 border-b border-border">
        <button 
          onClick={handleBold}
          className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
          title="Bold"
        >
          <Icon name="Bold" size={16} />
        </button>
        <button 
          onClick={handleItalic}
          className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
          title="Italic"
        >
          <Icon name="Italic" size={16} />
        </button>
        <div className="h-6 w-px bg-border mx-1"></div>
        <button 
          onClick={handleHeading}
          className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
          title="Heading"
        >
          <Icon name="Heading1" size={16} />
        </button>
        <button 
          onClick={handleSubheading}
          className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
          title="Subheading"
        >
          <Icon name="Heading2" size={16} />
        </button>
        <div className="h-6 w-px bg-border mx-1"></div>
        <button 
          onClick={handleList}
          className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
          title="Bullet List"
        >
          <Icon name="List" size={16} />
        </button>
        <button 
          onClick={handleCode}
          className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
          title="Code Block"
        >
          <Icon name="Code" size={16} />
        </button>
        <button 
          onClick={handleLink}
          className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
          title="Link"
        >
          <Icon name="Link" size={16} />
        </button>
        <div className="h-6 w-px bg-border mx-1"></div>
        <button 
          onClick={handleFigmaEmbed}
          className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
          title="Figma Embed"
        >
          <Icon name="Figma" size={16} />
        </button>
        <button 
          onClick={handleLoomEmbed}
          className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
          title="Loom Video"
        >
          <Icon name="Video" size={16} />
        </button>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextareaChange}
        className="w-full p-4 min-h-[300px] font-mono text-sm text-text-primary bg-surface focus:outline-none resize-y"
        placeholder="Write your task description using Markdown..."
      />

      {/* Status Bar */}
      <div className="flex justify-between items-center px-3 py-1 bg-secondary-50 border-t border-border text-xs text-text-secondary">
        <div>
          <span>Markdown</span>
        </div>
        <div>
          <span>{value.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;