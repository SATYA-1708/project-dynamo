import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TaskDetailComments = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onAddComment(newComment);
      setNewComment('');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="border border-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">JD</span>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center space-x-2">
                <button 
                  type="button"
                  className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
                  title="Attach file"
                >
                  <Icon name="Paperclip" size={16} />
                </button>
                <button 
                  type="button"
                  className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
                  title="Mention someone"
                >
                  <Icon name="AtSign" size={16} />
                </button>
                <button 
                  type="button"
                  className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
                  title="Add emoji"
                >
                  <Icon name="Smile" size={16} />
                </button>
              </div>
              <button 
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  !newComment.trim() || isSubmitting
                    ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed' :'bg-primary text-white hover:bg-primary-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader" size={16} className="inline-block mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : 'Add Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            className={`flex items-start space-x-3 p-4 border rounded-lg ${
              comment.isNew ? 'border-primary-100 bg-primary-50' : 'border-border'
            }`}
          >
            <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-secondary-700">{comment.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-text-primary">{comment.author}</span>
                  <span className="text-xs text-text-secondary">{comment.timestamp}</span>
                  {comment.isNew && (
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                      New
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-secondary-400 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200">
                    <Icon name="ThumbsUp" size={14} />
                  </button>
                  <button className="p-1 text-secondary-400 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200">
                    <Icon name="Reply" size={14} />
                  </button>
                  <button className="p-1 text-secondary-400 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200">
                    <Icon name="MoreHorizontal" size={14} />
                  </button>
                </div>
              </div>
              <p className="text-text-secondary">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDetailComments;