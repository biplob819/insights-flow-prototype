'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Reply, 
  AtSign, 
  MoreVertical, 
  Pin, 
  Trash2,
  Edit3,
  Heart,
  MessageCircle,
  Users,
  Search,
  // Filter,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin
} from 'lucide-react';

// Types for the chat system
interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
  isOnline: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: User;
  timestamp: Date;
  widgetId?: string;
  widgetTitle?: string;
  parentId?: string; // For threading
  replies?: Comment[];
  mentions: string[]; // User IDs mentioned in the comment
  reactions: { [emoji: string]: string[] }; // emoji -> array of user IDs
  isEdited: boolean;
  isPinned: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWidgetId?: string;
  selectedWidgetTitle?: string;
  onCommentOnWidget?: (widgetId: string, comment: string) => void;
}

// Mock team members data
const teamMembers: User[] = [
  {
    id: '1',
    name: 'Biplob Chakraborty',
    avatar: 'BC',
    email: 'biplob@company.com',
    role: 'Admin',
    isOnline: true
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    email: 'sarah@company.com',
    role: 'Analyst',
    isOnline: true
  },
  {
    id: '3',
    name: 'Mike Chen',
    avatar: 'MC',
    email: 'mike@company.com',
    role: 'Manager',
    isOnline: false
  },
  {
    id: '4',
    name: 'Emily Davis',
    avatar: 'ED',
    email: 'emily@company.com',
    role: 'Designer',
    isOnline: true
  }
];

// Mock comments data
const initialComments: Comment[] = [
  {
    id: '1',
    content: 'The Q3 revenue numbers look great! 📈 We\'re exceeding our targets.',
    author: teamMembers[1],
    timestamp: new Date('2024-01-15T10:30:00'),
    widgetId: 'widget-1',
    widgetTitle: 'Revenue Chart',
    parentId: undefined,
    replies: [
      {
        id: '1-1',
        content: 'Agreed! The growth trajectory is impressive. @SarahJohnson what factors do you think contributed most to this growth?',
        author: teamMembers[0],
        timestamp: new Date('2024-01-15T10:35:00'),
        parentId: '1',
        mentions: ['2'],
        reactions: { '👍': ['1', '3'] },
        isEdited: false,
        isPinned: false
      }
    ],
    mentions: [],
    reactions: { '🎉': ['1', '2', '4'], '👍': ['1', '2', '3'] },
    isEdited: false,
    isPinned: true
  },
  {
    id: '2',
    content: 'Can we add a filter for regional breakdown? It would help identify which regions are performing best.',
    author: teamMembers[2],
    timestamp: new Date('2024-01-15T14:20:00'),
    widgetId: 'widget-2',
    widgetTitle: 'Sales Performance',
    parentId: undefined,
    mentions: ['1'],
    reactions: { '💡': ['1', '2'] },
    isEdited: false,
    isPinned: false
  },
  {
    id: '3',
    content: 'Great dashboard overall! The visualizations are very clear and actionable. 🚀',
    author: teamMembers[3],
    timestamp: new Date('2024-01-15T16:45:00'),
    parentId: undefined,
    mentions: [],
    reactions: { '❤️': ['1', '2'] },
    isEdited: false,
    isPinned: false
  }
];

export default function ChatPanel({ 
  isOpen, 
  onClose, 
  selectedWidgetId, 
  selectedWidgetTitle,
  onCommentOnWidget 
}: ChatPanelProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [_editingComment, _setEditingComment] = useState<string | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'widget' | 'mentions' | 'pinned'>('all');
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set(['1']));
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentUser = teamMembers[0]; // Current user is Biplob

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newComment]);

  // Handle mention detection
  useEffect(() => {
    const lastAtIndex = newComment.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const query = newComment.slice(lastAtIndex + 1);
      if (query.length === 0 || /^[a-zA-Z0-9]*$/.test(query)) {
        setMentionQuery(query);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  }, [newComment]);

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Filter comments based on search and filter criteria
  const filteredComments = comments.filter(comment => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      if (!comment.content.toLowerCase().includes(searchLower) &&
          !comment.author.name.toLowerCase().includes(searchLower) &&
          !comment.widgetTitle?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Category filter
    switch (filterBy) {
      case 'widget':
        return comment.widgetId === selectedWidgetId;
      case 'mentions':
        return comment.mentions.includes(currentUser.id);
      case 'pinned':
        return comment.isPinned;
      default:
        return true;
    }
  });

  // Handle sending a comment
  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const mentions = extractMentions(newComment);
    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: currentUser,
      timestamp: new Date(),
      widgetId: selectedWidgetId,
      widgetTitle: selectedWidgetTitle,
      parentId: replyingTo || undefined,
      mentions,
      reactions: {},
      isEdited: false,
      isPinned: false
    };

    if (replyingTo) {
      // Add as reply to existing comment
      setComments(prev => prev.map(c => {
        if (c.id === replyingTo) {
          return {
            ...c,
            replies: [...(c.replies || []), comment]
          };
        }
        return c;
      }));
    } else {
      // Add as new top-level comment
      setComments(prev => [comment, ...prev]);
    }

    // Notify parent component if commenting on a widget
    if (selectedWidgetId && onCommentOnWidget) {
      onCommentOnWidget(selectedWidgetId, newComment);
    }

    setNewComment('');
    setReplyingTo(null);
    setShowMentions(false);
  };

  // Extract mentions from comment text
  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match: RegExpExecArray | null;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionedUser = teamMembers.find(user => 
        user.name.toLowerCase().replace(/\s+/g, '').includes(match![1].toLowerCase())
      );
      if (mentionedUser && !mentions.includes(mentionedUser.id)) {
        mentions.push(mentionedUser.id);
      }
    }
    
    return mentions;
  };

  // Handle mention selection
  const handleMentionSelect = (user: User) => {
    const lastAtIndex = newComment.lastIndexOf('@');
    const beforeMention = newComment.slice(0, lastAtIndex);
    const afterMention = newComment.slice(lastAtIndex + mentionQuery.length + 1);
    setNewComment(`${beforeMention}@${user.name.replace(/\s+/g, '')} ${afterMention}`);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  // Toggle thread expansion
  const toggleThread = (commentId: string) => {
    setExpandedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Add reaction to comment
  const addReaction = (commentId: string, emoji: string, isReply = false, parentId?: string) => {
    setComments(prev => prev.map(comment => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies?.map(reply => {
            if (reply.id === commentId) {
              const reactions = { ...reply.reactions };
              if (reactions[emoji]) {
                if (reactions[emoji].includes(currentUser.id)) {
                  reactions[emoji] = reactions[emoji].filter(id => id !== currentUser.id);
                  if (reactions[emoji].length === 0) {
                    delete reactions[emoji];
                  }
                } else {
                  reactions[emoji].push(currentUser.id);
                }
              } else {
                reactions[emoji] = [currentUser.id];
              }
              return { ...reply, reactions };
            }
            return reply;
          })
        };
      } else if (comment.id === commentId) {
        const reactions = { ...comment.reactions };
        if (reactions[emoji]) {
          if (reactions[emoji].includes(currentUser.id)) {
            reactions[emoji] = reactions[emoji].filter(id => id !== currentUser.id);
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          } else {
            reactions[emoji].push(currentUser.id);
          }
        } else {
          reactions[emoji] = [currentUser.id];
        }
        return { ...comment, reactions };
      }
      return comment;
    }));
  };

  // Render a single comment
  const renderComment = (comment: Comment, isReply = false, parentId?: string) => {
    const isExpanded = expandedThreads.has(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''} max-w-full`}>
        <div className="flex space-x-3 group min-w-0">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              comment.author.isOnline ? 'bg-cyan-500 text-white' : 'bg-gray-400 text-white'
            }`}>
              {comment.author.avatar}
            </div>
            {comment.author.isOnline && (
              <div className="w-2 h-2 bg-green-400 rounded-full -mt-2 ml-6 border border-white"></div>
            )}
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
              <span className="text-xs text-gray-500">{comment.author.role}</span>
              {comment.widgetId && (
                <>
                  <span className="text-xs text-gray-400">•</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{comment.widgetTitle}</span>
                  </div>
                </>
              )}
              <span className="text-xs text-gray-400">•</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
              </div>
              {comment.isPinned && (
                <Pin className="w-3 h-3 text-amber-500" />
              )}
              {comment.isEdited && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>

            {/* Comment Text */}
            <div className="text-sm text-gray-800 mb-2 whitespace-pre-wrap break-words">
              {comment.content}
            </div>

            {/* Reactions */}
            {Object.keys(comment.reactions).length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {Object.entries(comment.reactions).map(([emoji, userIds]) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(comment.id, emoji, isReply, parentId)}
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
                      userIds.includes(currentUser.id)
                        ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{userIds.length}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
              >
                <Reply className="w-3 h-3" />
                <span>Reply</span>
              </button>
              
              <button
                onClick={() => addReaction(comment.id, '👍', isReply, parentId)}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
              >
                <Heart className="w-3 h-3" />
                <span>React</span>
              </button>

              {comment.author.id === currentUser.id && (
                <>
                  <button
                    onClick={() => _setEditingComment(comment.id)}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600">
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </>
              )}

              <button className="text-xs text-gray-500 hover:text-gray-700">
                <MoreVertical className="w-3 h-3" />
              </button>
            </div>

            {/* Replies */}
            {hasReplies && (
              <div className="mt-3">
                <button
                  onClick={() => toggleThread(comment.id)}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 mb-2"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  <span>{comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}</span>
                </button>

                {isExpanded && (
                  <div className="space-y-3">
                    {comment.replies!.map(reply => renderComment(reply, true, comment.id))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
            {filteredComments.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Filters and Search */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All', icon: MessageCircle },
            { key: 'widget', label: 'This Widget', icon: MapPin },
            { key: 'mentions', label: 'Mentions', icon: AtSign },
            { key: 'pinned', label: 'Pinned', icon: Pin }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilterBy(key as 'all' | 'widget' | 'mentions' | 'pinned')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filterBy === key
                  ? 'bg-cyan-100 text-cyan-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Selected Widget Indicator */}
        {selectedWidgetId && (
          <div className="flex items-center space-x-2 p-2 bg-cyan-50 rounded-lg">
            <MapPin className="w-4 h-4 text-cyan-600" />
            <span className="text-sm text-cyan-800">
              Commenting on: <strong>{selectedWidgetTitle}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin"
      >
        {filteredComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No comments yet</p>
            <p className="text-gray-400 text-xs mt-1">
              {selectedWidgetId ? 'Be the first to comment on this widget' : 'Start a conversation'}
            </p>
          </div>
        ) : (
          filteredComments.map(comment => renderComment(comment))
        )}
      </div>

      {/* Reply Indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Reply className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Replying to {comments.find(c => c.id === replyingTo)?.author.name}
              </span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mention Suggestions */}
      {showMentions && (
        <div className="mx-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto overflow-x-hidden">
          {teamMembers
            .filter(user => 
              user.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(mentionQuery.toLowerCase())
            )
            .map(user => (
              <button
                key={user.id}
                onClick={() => handleMentionSelect(user)}
                className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 text-left min-w-0"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                  user.isOnline ? 'bg-cyan-500 text-white' : 'bg-gray-400 text-white'
                }`}>
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
                {user.isOnline && (
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                )}
              </button>
            ))
          }
        </div>
      )}

      {/* Comment Input */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex space-x-2">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-sm font-medium text-white">
              {currentUser.avatar}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                selectedWidgetId 
                  ? `Comment on ${selectedWidgetTitle}...` 
                  : 'Add a comment...'
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none text-sm"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendComment();
                }
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <AtSign className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Users className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleSendComment}
                disabled={!newComment.trim()}
                className="flex items-center space-x-1 px-3 py-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                <span className="text-sm">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
