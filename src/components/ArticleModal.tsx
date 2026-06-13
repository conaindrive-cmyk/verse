/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { NewsArticle, Comment } from "../types";
import { MessageSquare, Share2, Printer, ThumbsUp, Bookmark, Send, X, User } from "lucide-react";

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  isDark?: boolean;
}

export default function ArticleModal({ article, onClose, isDark = false }: ArticleModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (article) {
      // Load comments from localStorage if they exist, or set default initial reviews
      const saved = localStorage.getItem(`comments-${article.id}`);
      if (saved) {
        setComments(JSON.parse(saved));
      } else {
        const initialComments: Comment[] = [
          {
            id: `init-comm-1`,
            articleId: article.id,
            authorName: "Ahsan Siddiqui",
            text: "This is a meticulously researched piece. The visual direction and depth of Lollywood and tech fusion is highly impressive.",
            createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
          },
          {
            id: `init-comm-2`,
            articleId: article.id,
            authorName: "Elena Rostova",
            text: "Excited to see how global audiences react to these sustainability frameworks. High production values indeed!",
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          }
        ];
        setComments(initialComments);
        localStorage.setItem(`comments-${article.id}`, JSON.stringify(initialComments));
      }

      setLikes(article.viewCount ? Math.floor(article.viewCount / 40) + 12 : 5);
      setHasLiked(false);
      setHasBookmarked(false);
      setCopiedLink(false);
    }
  }, [article]);

  if (!article) return null;

  // Handle comment submission
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !textInput.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      articleId: article.id,
      authorName: nameInput,
      text: textInput,
      createdAt: new Date().toISOString(),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`comments-${article.id}`, JSON.stringify(updated));
    
    setNameInput("");
    setTextInput("");
  };

  const toggleLike = () => {
    if (hasLiked) {
      setLikes((p) => p - 1);
    } else {
      setLikes((p) => p + 1);
    }
    setHasLiked(!hasLiked);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Split formatted content into paragraphs to render with real typography spacing
  const paragraphs = article.content.split("\n\n");

  return (
    <div 
      id="article-reading-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-4xl h-full sm:h-[90vh] sm:rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isDark ? "bg-[#1C1C1E] text-slate-100" : "bg-white text-[#111111]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating bar (Quick Controls) */}
        <div 
          className={`flex items-center justify-between px-6 py-4 border-b shrink-0 sticky top-0 z-10 ${
            isDark ? "bg-[#1C1C1E]/95 border-slate-800" : "bg-white/95 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#B80000] text-white rounded-[2px]" id="reader-category-pill">
              {article.category}
            </span>
            <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action tools */}
            <button 
              onClick={handleShare}
              className={`p-1.5 rounded-full hover:bg-slate-200 transition-all ${isDark ? "hover:bg-slate-800 text-slate-400" : "text-slate-600"}`}
              title="Copy link"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={() => setHasBookmarked(!hasBookmarked)}
              className={`p-1.5 rounded-full hover:bg-slate-200 transition-all ${
                hasBookmarked ? "text-amber-500 fill-amber-500" : isDark ? "hover:bg-slate-800 text-slate-400" : "text-slate-600"
              }`}
              title="Save article"
            >
              <Bookmark size={18} />
            </button>
            <button 
              onClick={() => window.print()}
              className={`p-1.5 rounded-full hover:bg-slate-200 transition-all ${isDark ? "hover:bg-slate-800 text-slate-400" : "text-slate-600"}`}
              title="Print article"
            >
              <Printer size={18} />
            </button>
            
            <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

            <button 
              onClick={onClose}
              id="close-reader-button"
              className={`p-1.5 rounded-full hover:bg-slate-200 transition-all ${isDark ? "hover:bg-slate-800 text-slate-200" : "text-slate-600"}`}
              aria-label="Close page"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic main scrolling body */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Headline Display Typography */}
          <h1 className="text-2xl md:text-4xl font-serif font-black tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Author Byline / Time */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
            isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-600"
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-white shrink-0 shadow-inner">
                <User size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#111111] dark:text-slate-100">{article.author}</p>
                <p className="text-xs">Published {formatDate(article.publishedAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleLike}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide border transition-all ${
                  hasLiked 
                    ? "bg-red-50 dark:bg-red-950/20 text-[#B80000] border-[#B80000]" 
                    : isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ThumbsUp size={14} className={hasLiked ? "fill-red-600" : ""} />
                <span>{likes} Recommended</span>
              </button>
            </div>
          </div>

          {/* Large Hero Graphic */}
          <div className="relative aspect-video sm:h-[400px] rounded-lg overflow-hidden shadow-md select-none bg-slate-800">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {article.isBreaking && (
              <span className="absolute top-4 left-4 bg-[#B80000] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-[1px] shadow-sm">
                Breaking Report
              </span>
            )}
          </div>

          {/* Premium Copy/Article Body Paragraphs */}
          <div className="max-w-2xl mx-auto font-serif text-base md:text-lg leading-relaxed space-y-5 select-text">
            {copiedLink && (
              <div className="bg-emerald-500 text-white text-xs font-semibold text-center py-2 px-4 rounded-md mb-4 animate-fade-in">
                Link copied to clipboard! Share Truth with friends.
              </div>
            )}

            {paragraphs.map((para, cellIdx) => {
              // Format standard headers
              if (para.startsWith("###")) {
                return (
                  <h3 
                    key={cellIdx} 
                    className="text-xl md:text-2xl font-sans font-bold text-[#111111] dark:text-slate-100 pt-5 pb-1 tracking-tight"
                  >
                    {para.replace("###", "").trim()}
                  </h3>
                );
              }
              // Render paragraph with elegant drop cap on first paragraph
              if (cellIdx === 0) {
                const firstLetter = para.charAt(0);
                const restOfPara = para.slice(1);
                return (
                  <p key={cellIdx} className={`first-letter:text-5xl md:first-letter:text-6xl first-letter:font-black first-letter:float-left first-letter:mr-2.5 first-letter:text-[#B80000] first-letter:leading-none ${
                    isDark ? "text-slate-300" : "text-slate-800"
                  }`}>
                    {restOfPara}
                  </p>
                );
              }
              // Format blockquotes for editorial flair
              if (para.startsWith('"') || para.startsWith('“')) {
                return (
                  <blockquote 
                    key={cellIdx} 
                    className="border-l-4 border-[#B80000] pl-4 py-1.5 my-6 italic text-lg md:text-xl font-medium tracking-tight bg-slate-50 dark:bg-slate-900/40 p-3 rounded-r-md text-slate-700 dark:text-slate-300"
                  >
                    {para}
                  </blockquote>
                );
              }
              return (
                <p key={cellIdx} className={isDark ? "text-slate-300" : "text-slate-800"}>
                  {para}
                </p>
              );
            })}
          </div>

          {/* Social and Printer Row bottom */}
          <div className="flex items-center justify-between py-6 border-y border-slate-200/65 dark:border-slate-800 max-w-2xl mx-auto text-xs shrink-0 select-none">
            <span className="opacity-70 font-mono">End of Report</span>
            <div className="flex gap-4">
              <span className="opacity-70">Category: <strong className="text-[#B80000]">{article.category}</strong></span>
              <span className="opacity-70">Views: <strong className="dark:text-slate-200">{(article.viewCount || 10).toLocaleString()}</strong></span>
            </div>
          </div>

          {/* Related/Comments Section Grid (Durable Local Storage Sync) */}
          <div className="max-w-2xl mx-auto space-y-6 pt-6">
            <div className="flex items-center gap-2 pb-2 border-b border-rose-900/10">
              <MessageSquare size={22} className="text-[#B80000]" />
              <h4 className="text-xl font-sans font-extrabold tracking-tight">
                Reader Discussions ({comments.length})
              </h4>
            </div>

            {/* Submit Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-4" id="comment-submission-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 tracking-wide opacity-80">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali Ahmed"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className={`w-full text-sm px-3.5 py-2.5 rounded border focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                      isDark ? "bg-[#2C2C2E] border-slate-700 text-white" : "bg-white border-slate-300 text-[#111111]"
                    }`}
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <span className="text-[11px] opacity-60 italic mb-1">
                    Your commentary will publish instantly. Be respectful.
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 tracking-wide opacity-80">Your Comment</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share your perspective on this news coverage..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className={`w-full text-sm px-3.5 py-2.5 rounded border focus:outline-none focus:ring-1 focus:ring-[#B80000] resize-none ${
                    isDark ? "bg-[#2C2C2E] border-slate-700 text-white" : "bg-white border-slate-300 text-[#111111]"
                  }`}
                />
              </div>
              <button 
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#B80000] text-white text-xs font-bold uppercase tracking-wider rounded h-10 hover:bg-red-800 transition-colors cursor-pointer"
              >
                <Send size={14} />
                Publish Comment
              </button>
            </form>

            {/* Comments Lists */}
            <div className="space-y-4 pt-4">
              {comments.length === 0 ? (
                <p className="text-sm opacity-60 italic text-center py-6">
                  No commentary posted yet. Start the conversation!
                </p>
              ) : (
                comments.map((comm) => (
                  <div 
                    key={comm.id}
                    className={`p-4 rounded border text-sm transition-all ${
                      isDark ? "bg-[#242426] border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-[#B80000]" id="commenter-name">
                        {comm.authorName}
                      </span>
                      <span className="text-xs opacity-50">
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`whitespace-pre-wrap leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {comm.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
