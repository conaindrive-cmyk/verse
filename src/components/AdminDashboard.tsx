/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { NewsArticle, NewsCategory } from "../types";
import { Wrench, Sparkles, Plus, Trash2, Globe, FileText, Check, AlertCircle, RefreshCw } from "lucide-react";

interface AdminDashboardProps {
  onAddArticle: (article: Partial<NewsArticle>) => void;
  onDeleteArticle: (id: string) => void;
  articles: NewsArticle[];
  isDark?: boolean;
}

export default function AdminDashboard({ onAddArticle, onDeleteArticle, articles, isDark = false }: AdminDashboardProps) {
  // Manual post fields
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NewsCategory>(NewsCategory.ENTERTAINMENT);
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  // AI assistant states
  const [aiTopic, setAiTopic] = useState("");
  const [aiPreset, setAiPreset] = useState("BBC Style (Objective, sophisticated & balanced)");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [draftedArticle, setDraftedArticle] = useState<any | null>(null);

  // Success indicator states
  const [successMsg, setSuccessMsg] = useState("");

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // Standard high-quality fallback image if empty
    const finalImg = imageUrl.trim() || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800";

    const newPost: Partial<NewsArticle> = {
      title,
      summary: summary || title.slice(0, 100) + "...",
      content,
      category,
      author: author || "Staff Reporter, News Verse",
      imageUrl: finalImg,
      isBreaking,
      isFeatured,
      isTrending,
      readTime: `${Math.max(2, Math.ceil(content.split(" ").length / 200))} min read`
    };

    onAddArticle(newPost);
    setSuccessMsg("Manual article published immediately to the News Verse live feed!");
    setTimeout(() => setSuccessMsg(""), 4000);

    // Reset manual form fields
    setTitle("");
    setSummary("");
    setContent("");
    setAuthor("");
    setImageUrl("");
    setIsBreaking(false);
    setIsFeatured(false);
    setIsTrending(false);
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      setAiError("Please type a news event or entertainment story topic first.");
      return;
    }

    setAiError("");
    setIsGenerating(true);
    setDraftedArticle(null);

    try {
      const response = await fetch("/api/news/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          category,
          instructions: `Write in style: ${aiPreset}. Ensure there are rich markdown subheadings with ###.`
        })
      });

      if (!response.ok) {
        throw new Error("Server failed to generate contents. Verify server limits.");
      }

      const resData = await response.json();
      if (resData.error) {
        throw new Error(resData.error);
      }

      const articleDraft = resData.article;
      // Pre-assign a realistic stock photo from Unsplash matching keyword
      const keyword = articleDraft.imageUrlKeyword || "magazine";
      articleDraft.imageUrl = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800`;
      
      // Use different curated high-resolution pictures for typical keyword mappings
      const keyLow = keyword.toLowerCase();
      if (keyLow.includes("dress") || keyLow.includes("fashion") || keyLow.includes("style")) {
        articleDraft.imageUrl = "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800";
      } else if (keyLow.includes("music") || keyLow.includes("song") || keyLow.includes("synth") || keyLow.includes("band")) {
        articleDraft.imageUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800";
      } else if (keyLow.includes("movie") || keyLow.includes("film") || keyLow.includes("actor") || keyLow.includes("lollywood") || keyLow.includes("cinema")) {
        articleDraft.imageUrl = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800";
      } else if (keyLow.includes("green") || keyLow.includes("tree") || keyLow.includes("heat") || keyLow.includes("climate") || keyLow.includes("islamabad")) {
        articleDraft.imageUrl = "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800";
      } else if (keyLow.includes("cricket") || keyLow.includes("match") || keyLow.includes("sports")) {
        articleDraft.imageUrl = "https://images.unsplash.com/photo-1531415080294-4404b53e511a?auto=format&fit=crop&q=80&w=800";
      } else if (keyLow.includes("cyber") || keyLow.includes("tech") || keyLow.includes("quantum") || keyLow.includes("chip") || keyLow.includes("superconductor")) {
        articleDraft.imageUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800";
      } else if (keyLow.includes("space") || keyLow.includes("star") || keyLow.includes("satellite") || keyLow.includes("debris")) {
        articleDraft.imageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800";
      } else if (keyLow.includes("business") || keyLow.includes("trade") || keyLow.includes("container") || keyLow.includes("ship")) {
        articleDraft.imageUrl = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";
      }

      setDraftedArticle(articleDraft);
    } catch (err: any) {
      setAiError(err.message || "An unexpected error occurred during AI drafting.");
    } finally {
      setIsGenerating(false);
    }
  };

  const publishAiDraft = () => {
    if (!draftedArticle) return;
    onAddArticle({
      title: draftedArticle.title,
      summary: draftedArticle.summary,
      content: draftedArticle.content,
      category: draftedArticle.category as NewsCategory,
      author: draftedArticle.author,
      imageUrl: draftedArticle.imageUrl,
      readTime: draftedArticle.readTime,
      isBreaking: isBreaking,
      isFeatured: isFeatured,
      isTrending: isTrending
    });

    setSuccessMsg(`AI Article titled "${draftedArticle.title.slice(0, 30)}..." published live!`);
    setTimeout(() => setSuccessMsg(""), 4000);
    setDraftedArticle(null);
    setAiTopic("");
  };

  return (
    <div 
      className={`p-6 md:p-8 rounded-xl border transition-all ${
        isDark ? "bg-[#18181A] border-slate-800" : "bg-white border-slate-200"
      }`}
      id="admin-dashboard-panel"
    >
      {/* Title Header with Admin mode */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-900/10 pb-6 mb-8 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#B80000] rounded-lg flex items-center justify-center text-white shrink-0 shadow-md">
            <Wrench size={22} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Editorial Control Room</h2>
            <p className="text-xs opacity-60">Manage breaking feeds & deploy Gemini generative journalism.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono opacity-80 uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-[1px]">
            CMS Server Live
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500 text-white p-4 rounded-md mb-6 text-sm font-semibold flex items-center gap-2 animate-bounce">
          <Check size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: AI Assist on Left / Manual Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* News Verse AI Column */}
        <div className="space-y-6">
          <div className={`p-5 rounded-lg border-2 border-dashed ${
            isDark ? "bg-[#1F1F21] border-slate-700" : "bg-slate-50 border-slate-300"
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-[#B80000]" />
              <h3 className="text-base font-extrabold uppercase tracking-tight">Gemini AI Editorial Assistant</h3>
            </div>
            <p className="text-xs opacity-70 mb-4 leading-relaxed">
              Generate factually dense and typographically-structured news or entertainment reports instantly using server-side Gemini 3.5. Select the primary slot and input your core topic.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5">Article Topic or Alert Idea</label>
                <input
                  type="text"
                  placeholder="e.g. Lollywood actor sets record in sci-fi trilogy or Islamabad urban spray grids"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  disabled={isGenerating}
                  className={`w-full text-xs px-3 py-2.5 rounded border focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                    isDark ? "bg-[#28282A] border-slate-700 text-white" : "bg-white border-slate-300 text-[#111111]"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5">Primary Category Slot</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NewsCategory)}
                    className={`w-full text-xs px-3 py-2.5 rounded border focus:outline-none ${
                      isDark ? "bg-[#28282A] border-slate-700 text-white" : "bg-white border-slate-300"
                    }`}
                  >
                    {Object.values(NewsCategory).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5">Style / Editorial Voice</label>
                  <select
                    value={aiPreset}
                    onChange={(e) => setAiPreset(e.target.value)}
                    className={`w-full text-xs px-3 py-2.5 rounded border focus:outline-none ${
                      isDark ? "bg-[#28282A] border-slate-700 text-white" : "bg-white border-slate-300"
                    }`}
                  >
                    <option value="BBC Factual (Highly objective, clinical, detailed, serious)">BBC Editorial Style</option>
                    <option value="Visual Column (High emphasis on red carpet details, Lollywood fashion, colorful adjectives)">Visual Entertainment Column</option>
                    <option value="Urgent Breaking (Shorter paragraphs, bold headers, sensational live updates vibe)">Urgent Breaking Alert</option>
                  </select>
                </div>
              </div>

              {/* Toggles for tags */}
              <div className="flex flex-wrap gap-4 items-center bg-black/5 dark:bg-white/5 p-3 rounded text-xs select-none">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="accent-[#B80000]"
                  />
                  <span>Mark Breaking</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#B80000]"
                  />
                  <span>Hero Highlight</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="accent-[#B80000]"
                  />
                  <span>Trend Alert</span>
                </label>
              </div>

              {aiError && (
                <div className="bg-red-500/10 text-red-500 text-xs p-3 rounded flex items-center gap-1.5 font-medium">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center gap-2 py-3 bg-[#B80000] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer ${
                  isGenerating ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} />
                    Gemini Reporting Live...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Draft with Gemini AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Draft Display Section */}
          {draftedArticle && (
            <div className={`p-5 rounded-lg border border-emerald-500/30 ${
              isDark ? "bg-[#1E2522]" : "bg-emerald-50/50"
            } animate-fade-in`}>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/10 mb-4 select-none">
                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded">
                  Gemini Draft Ready
                </span>
                <span className="text-xs opacity-60 font-mono">{draftedArticle.readTime}</span>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base md:text-lg">{draftedArticle.title}</h4>
                <p className="text-xs italic opacity-75">{draftedArticle.summary}</p>
                <div className="h-28 overflow-y-auto text-xs font-mono opacity-80 bg-black/10 dark:bg-black/30 p-2.5 rounded whitespace-pre-wrap">
                  {draftedArticle.content}
                </div>
                
                <div className="flex items-center gap-2 justify-between pt-2">
                  <span className="text-xs opacity-60">By <strong>{draftedArticle.author}</strong></span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDraftedArticle(null)}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-xs rounded hover:bg-black/5"
                    >
                      Discard
                    </button>
                    <button
                      onClick={publishAiDraft}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded"
                    >
                      Publish live!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Manual Editorial Column */}
        <div className={`p-5 rounded-lg border ${isDark ? "bg-[#1F1F21] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center gap-2 mb-4 select-none">
            <Plus size={20} className="text-[#B80000]" />
            <h3 className="text-base font-extrabold uppercase tracking-tight">Compose Manual News Post</h3>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4" id="manual-article-cms-form">
            <div>
              <label className="block text-xs font-bold uppercase mb-1.5">Article Headline</label>
              <input
                type="text"
                required
                placeholder="Type descriptive official headline"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                  isDark ? "bg-[#28282A] border-slate-700 text-white" : "bg-white border-slate-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1.5">Short Lead Summary</label>
              <textarea
                rows={2}
                placeholder="Give a brief summary sentence of the report"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className={`w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#B80000] resize-none ${
                  isDark ? "bg-[#28282A] border-slate-700 text-white" : "bg-white border-slate-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1.5">Full Journalistic Content</label>
              <textarea
                rows={5}
                required
                placeholder="Construct paragraphs. Use ### for subheadings."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                  isDark ? "bg-[#28282A] border-slate-700 text-white" : "bg-white border-slate-300"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5">Byline / Author Name</label>
                <input
                  type="text"
                  placeholder="e.g. Faisal Bilal, Reporter"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className={`w-full text-xs px-3 py-2 border rounded focus:outline-none ${
                    isDark ? "bg-[#28282A] border-slate-700 text-white" : "bg-white border-slate-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5">Category Slot</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NewsCategory)}
                  className={`w-full text-xs px-3 py-2 border rounded focus:outline-none ${
                    isDark ? "bg-[#28282A] border-slate-700 text-white" : "bg-white border-slate-300"
                  }`}
                >
                  {Object.values(NewsCategory).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1.5">Cover Image URL (Optional)</label>
              <input
                type="url"
                placeholder="Provide absolute https://unsplash.com/... or keep blank for default"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                  isDark ? "bg-[#28282A] border-slate-700 text-white" : "bg-white border-slate-300"
                }`}
              />
            </div>

            {/* Manual check tags */}
            <div className="flex flex-wrap gap-4 items-center bg-black/5 dark:bg-white/5 p-3 rounded text-xs select-none">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="accent-[#B80000]"
                />
                <span>Breaking</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-[#B80000]"
                />
                <span>Hero Headline</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="accent-[#B80000]"
                />
                <span>Trending Badge</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#111111] hover:bg-[#222222] dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-[#111111] text-white font-bold text-xs uppercase tracking-wider rounded cursor-pointer"
            >
              <Globe size={14} />
              Publish Article
            </button>
          </form>
        </div>
      </div>

      {/* Delete/Manage active postings (Filtered down to non-defaults or all articles that have a customizable delete context) */}
      <div className="mt-10 pt-8 border-t border-rose-900/10">
        <h3 className="text-base font-extrabold uppercase tracking-tight mb-4 select-none">Active Articles Catalog ({articles.length})</h3>
        <div className="max-h-64 overflow-y-auto border border-black/10 dark:border-white/10 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className={`font-bold select-none border-b ${
              isDark ? "bg-[#232325] text-slate-400 border-slate-800" : "bg-slate-150 text-slate-700 border-slate-200"
            }`}>
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Author</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {articles.map((item) => (
                <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="p-3 font-semibold truncate max-w-xs">{item.title}</td>
                  <td className="p-3 font-semibold text-[#B80000]">{item.category}</td>
                  <td className="p-3 opacity-70">{item.author}</td>
                  <td className="p-3 select-none">
                    <div className="flex gap-1">
                      {item.isBreaking && <span className="bg-red-500/10 text-red-500 px-1.5 py-0.5 font-mono text-[9px] uppercase">Break</span>}
                      {item.isFeatured && <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 font-mono text-[9px] uppercase">Hero</span>}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDeleteArticle(item.id)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete this article"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
