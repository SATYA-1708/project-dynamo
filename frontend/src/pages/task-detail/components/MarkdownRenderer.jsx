import React from 'react';


const MarkdownRenderer = ({ content }) => {
  // Very simple markdown parser for demonstration
  // In a real app, you would use a library like react-markdown
  
  const renderMarkdown = (text) => {
    if (!text) return null;

    // Process code blocks
    let processedText = text.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, language, code) => {
      return `<pre class="bg-secondary-800 text-white p-4 rounded-lg overflow-x-auto my-4"><code class="language-${language}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });

    // Process headers
    processedText = processedText.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>');
    processedText = processedText.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-5 mb-3">$1</h2>');
    processedText = processedText.replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-4 mb-2">$1</h3>');

    // Process lists
    processedText = processedText.replace(/^\- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>');
    processedText = processedText.replace(/<\/li>\n<li/g, '</li><li');
    processedText = processedText.replace(/(<li.*<\/li>)/g, '<ul class="my-3">$1</ul>');

    // Process bold and italic
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processedText = processedText.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Process paragraphs
    processedText = processedText.replace(/^(?!<[uh]|<li|<pre)(.+$)/gm, '<p class="my-3 text-text-secondary leading-relaxed">$1</p>');

    return <div dangerouslySetInnerHTML={{ __html: processedText }} />;
  };

  return (
    <div className="prose prose-slate max-w-none">
      {renderMarkdown(content)}
    </div>
  );
};

export default MarkdownRenderer;