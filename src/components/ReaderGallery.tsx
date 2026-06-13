/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Camera, Eye, Heart, MapPin, Upload, X, ShieldAlert, Check, Calendar, ArrowRight } from "lucide-react";

interface GalleryPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  location: string;
  likes: number;
  createdAt: string;
  isUserSubmitted?: boolean;
}

interface ReaderGalleryProps {
  isDark: boolean;
}

export default function ReaderGallery({ isDark }: ReaderGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<string[]>([]);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // Submission Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Base 3 images uploaded by user
  const initialPhotos: GalleryPhoto[] = [
    {
      id: "photo-user-1",
      title: "EXCLUSIVE: Digital News Room Analytics Console",
      description: "Sub-bureau telemetry interface displaying audience traffic spikes, real-time feedback loops, and live coverage engagement maps across national sectors.",
      imageUrl: "/images/capture.png",
      author: "Conain Hassan",
      location: "Federal Tech Bureau, Pakistan",
      likes: 124,
      createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString() // 1.5 hours ago
    },
    {
      id: "photo-user-2",
      title: "Behind the Scenes: High-Production Documentary Set",
      description: "On-site capture showcasing high-intensity lighting, professional cameras, and cinematographic setups for an upcoming Lollywood feature release.",
      imageUrl: "/images/gallery-1.jpeg",
      author: "Faisal Bilal",
      location: "Media District, Lahore",
      likes: 98,
      createdAt: new Date(Date.now() - 3600000 * 3.2).toISOString() // 3.2 hours ago
    },
    {
      id: "photo-user-3",
      title: "Constitution Avenue: Urban Refresh Infrastructure",
      description: "Real-time look at local microclimate lattices and urban cooling sprinklers designed to mitigate peak summer temperatures in Islamabad.",
      imageUrl: "/images/gallery-2.jpeg",
      author: "Kamran Khan",
      location: "G-6 Corridor, Islamabad",
      likes: 156,
      createdAt: new Date(Date.now() - 3600000 * 5.8).toISOString() // 5.8 hours ago
    }
  ];

  useEffect(() => {
    // Sync with localStorage to load any previously user-submitted photos
    const saved = localStorage.getItem("newsverse-reader-gallery");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GalleryPhoto[];
        // Merge initial 3 default images with user-submitted ones
        setPhotos([...initialPhotos, ...parsed]);
      } catch (e) {
        setPhotos(initialPhotos);
      }
    } else {
      setPhotos(initialPhotos);
    }

    // Load liked states
    const savedLikes = localStorage.getItem("newsverse-liked-photos");
    if (savedLikes) {
      setLikedPhotos(JSON.parse(savedLikes));
    }
  }, []);

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    let updatedLikes = [...likedPhotos];
    let isLiked = false;

    if (likedPhotos.includes(id)) {
      updatedLikes = updatedLikes.filter((x) => x !== id);
      isLiked = false;
    } else {
      updatedLikes.push(id);
      isLiked = true;
    }

    setLikedPhotos(updatedLikes);
    localStorage.setItem("newsverse-liked-photos", JSON.stringify(updatedLikes));

    // Update state of photos list
    const updatedPhotos = photos.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          likes: isLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    });

    setPhotos(updatedPhotos);

    // If selected photo is currently open, sync it
    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto({
        ...selectedPhoto,
        likes: isLiked ? selectedPhoto.likes + 1 : selectedPhoto.likes - 1
      });
    }

    // Capture the custom user submissions so it persists
    const userSubmits = updatedPhotos.filter((p) => p.isUserSubmitted);
    localStorage.setItem("newsverse-reader-gallery", JSON.stringify(userSubmits));
  };

  // Drag and Drop files upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setSubmitError("Please select a valid image file (.png, .jpg, .jpeg, .webp, .gif).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setSubmitError("Image file is too large. Maintain size list under 8MB.");
      return;
    }

    setSubmitError("");
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !author.trim()) {
      setSubmitError("Please fill out all required fields.");
      return;
    }
    if (!imagePreview) {
      setSubmitError("Please select or drop an image file first.");
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: `photo-user-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      imageUrl: imagePreview,
      author: author.trim(),
      location: location.trim() || "Unverified Location",
      likes: 0,
      createdAt: new Date().toISOString(),
      isUserSubmitted: true
    };

    const updatedList = [newPhoto, ...photos];
    setPhotos(updatedList);

    // Save only user-submitted to local storage to avoid duplicating initial list
    const userSubmits = updatedList.filter((p) => p.isUserSubmitted);
    localStorage.setItem("newsverse-reader-gallery", JSON.stringify(userSubmits));

    setSubmitSuccess(true);
    setTimeout(() => {
      // Reset forms
      setTitle("");
      setDescription("");
      setAuthor("");
      setLocation("");
      setImageFile(null);
      setImagePreview(null);
      setSubmitSuccess(false);
      setIsSubmitOpen(false);
    }, 2000);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div 
      className={`p-6 md:p-8 rounded-xl border transition-all ${
        isDark ? "bg-[#18181A] border-slate-800 text-white" : "bg-white border-slate-200 text-[#111111]"
      }`}
      id="on-ground-photojournalism-station"
    >
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-rose-900/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#B80000] rounded-lg flex items-center justify-center text-white shrink-0 shadow-md">
            <Camera size={18} />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">On-Ground Reports: Exclusive Visuals</h3>
            <p className="text-xs opacity-60">Verified live snapshots and documentation uploaded directly from our bureaus and readers.</p>
          </div>
        </div>

        <button
          onClick={() => setIsSubmitOpen(!isSubmitOpen)}
          id="submit-photo-trigger"
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
            isSubmitOpen 
              ? "bg-[#111111] dark:bg-white dark:text-black text-white hover:opacity-90" 
              : "bg-[#B80000] hover:bg-red-800 text-white shadow-sm"
          }`}
        >
          {isSubmitOpen ? <X size={14} /> : <Upload size={14} />}
          <span>{isSubmitOpen ? "Close Panel" : "Submit Photo"}</span>
        </button>
      </div>

      {/* SECTION EXPLANATION DECK: FILE UPLOAD PORTAL (Drag and Drop / Multi Input select support) */}
      {isSubmitOpen && (
        <div 
          className={`p-6 rounded-lg mb-8 border-2 border-dashed transition-all ${
            isDark ? "bg-[#212123] border-slate-700" : "bg-slate-50 border-slate-300"
          } animate-fade-in`}
          id="visual-submission-wizard"
        >
          <h4 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Upload size={16} className="text-[#B80000]" />
            Submit Your On-Ground Coverage Snapshot
          </h4>
          <p className="text-xs opacity-70 mb-5 leading-relaxed">
            Have you captured a breaking story, Lollywood red carpet insight, or verified local infrastructure snapshots? Add your details below to submit them live to the feed.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {submitSuccess ? (
              <div className="bg-emerald-600 text-white p-5 rounded font-bold text-center text-xs space-y-2">
                <Check size={20} className="mx-auto" />
                <p className="uppercase tracking-wider">Upload Approved & Published Live!</p>
                <p className="opacity-90 font-mono font-normal">Your submission has been cataloged and injected successfully.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Image Drop Zone container */}
                <div className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative min-h-[190px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all ${
                      isDragging 
                        ? "border-[#B80000] bg-[#B80000]/5 scale-[0.99]" 
                        : imagePreview ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-300 dark:border-slate-700 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {imagePreview ? (
                      <div className="relative text-center w-full">
                        <img 
                          src={imagePreview} 
                          alt="Selected preview" 
                          className="max-h-40 mx-auto object-cover rounded shadow border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full shadow hover:bg-red-700"
                          title="Remove Image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center space-y-2 select-none">
                        <Camera size={28} className="mx-auto text-[#B80000] opacity-80" />
                        <p className="text-xs font-bold uppercase">Drag and Drop Image Here</p>
                        <p className="text-[10px] opacity-60">or click the picker below</p>
                      </div>
                    )}

                    {/* Hidden default file picker */}
                    <input
                      type="file"
                      id="newsverse-gallery-file-picker"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title=""
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="newsverse-gallery-file-picker" 
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors"
                    >
                      Choose Local Photo
                    </label>
                    <span className="text-[10px] opacity-50">Max size: 8MB (JPEG, PNG, WEBP)</span>
                  </div>
                </div>

                {/* Meta details inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1">Photo Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="Give it a journalistic, professional heading"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                        isDark ? "bg-[#2C2C2E] border-slate-700 text-white" : "bg-white border-slate-300 text-[#111111]"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1">Details & Context Check *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Add 2-3 sentences of core descriptive report context..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`w-full text-xs px-3 py-2 border rounded resize-none focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                        isDark ? "bg-[#2C2C2E] border-slate-700 text-white" : "bg-white border-slate-300 text-[#111111]"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Reporter Name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className={`w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                          isDark ? "bg-[#2C2C2E] border-slate-700 text-white" : "bg-white border-slate-300 text-[#111111]"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase mb-1">City / Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Islamabad"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={`w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                          isDark ? "bg-[#2C2C2E] border-slate-700 text-white" : "bg-white border-slate-300 text-[#111111]"
                        }`}
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="bg-red-500/10 text-red-500 text-xs p-2 rounded flex items-center gap-1.5 font-semibold">
                      <ShieldAlert size={14} className="shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full h-10 bg-[#B80000] hover:bg-red-800 text-white text-xs font-black uppercase tracking-wider rounded transition-colors cursor-pointer"
                  >
                    Validate & Publish Live Photo
                  </button>
                </div>

              </div>
            )}
          </form>
        </div>
      )}

      {/* PHOTO COLLECTION DISPLAY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {photos.map((item) => {
          const isLiked = likedPhotos.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className={`group cursor-pointer rounded-xl overflow-hidden border flex flex-col justify-between transition-all hover:shadow-lg ${
                isDark ? "bg-[#212123] border-slate-800" : "bg-slate-50 border-slate-200"
              }`}
              id={`gallery-photo-card-${item.id}`}
            >
              {/* Image Frame with hover details */}
              <div className="relative aspect-video w-full overflow-hidden bg-black select-none">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Submitter Ribbon Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-350">
                  <p className="text-[11px] font-black text-[#B80000] uppercase tracking-wider">
                    {item.location}
                  </p>
                  <p className="text-white text-[10px] opacity-75">
                    Filed by {item.author}
                  </p>
                </div>

                {/* Source Label Badge */}
                <span className="absolute top-2 left-2 bg-[#B80000] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-[1px] shadow">
                  Live Feed
                </span>

                {item.isUserSubmitted && (
                  <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-[1px] shadow">
                    Verified Submit
                  </span>
                )}
              </div>

              {/* Text Description Block */}
              <div className="p-4 flex-grow flex flex-col justify-between space-y-3.5 text-left">
                <div className="space-y-1.5">
                  <h4 className="text-xs md:text-sm font-sans font-black leading-snug group-hover:text-[#B80000] transition-all line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs opacity-85 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[10px] opacity-60 font-mono select-none">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} className="text-[#B80000]" />
                    {item.location.split(",")[0]}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className={`flex items-center gap-1 group/like hover:scale-105 transition-all ${
                        isLiked ? "text-red-500 font-bold" : ""
                      }`}
                      title={isLiked ? "Unlike" : "Like this image"}
                    >
                      <Heart size={12} className={isLiked ? "fill-red-500 text-red-500" : "group-hover/like:text-red-500"} />
                      <span>{item.likes}</span>
                    </button>
                    <span className="opacity-40">|</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIGHTBOX OVERLAY ELEMENT */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none animate-fade-in"
          id="gallery-lightbox-modal"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] ${
              isDark ? "bg-[#1E1E20] text-white" : "bg-white text-black"
            }`}
          >
            {/* Close handler floating icon */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              aria-label="Close Lightbox"
            >
              <X size={20} />
            </button>

            {/* Left Column: Extensive Zoomable Image Preview */}
            <div className="flex-grow aspect-video md:aspect-auto md:w-[60%] bg-black flex items-center justify-center p-2">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[50vh] md:max-h-[80vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right Column: Factual Editorial Meta Analysis */}
            <div className={`p-6 md:p-8 flex flex-col justify-between md:w-[40%] border-t md:border-t-0 md:border-l ${
              isDark ? "border-slate-800 bg-[#1E1E20]" : "border-slate-200 bg-white"
            } text-left overflow-y-auto`}>
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-mono opacity-60">
                  <Calendar size={12} />
                  <span>Filed {formatDate(selectedPhoto.createdAt)}</span>
                </div>

                <h3 className="text-base md:text-xl font-sans font-black leading-tight">
                  {selectedPhoto.title}
                </h3>
                
                <p className="text-xs md:text-sm opacity-85 leading-relaxed font-serif">
                  {selectedPhoto.description}
                </p>

                <div className={`p-3.5 rounded-lg border text-xs leading-relaxed space-y-2 ${
                  isDark ? "bg-[#252528] border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <p className="font-semibold flex items-center gap-1.5">
                    <Camera size={13} className="text-[#B80000]" />
                    Reporter Identity Verified
                  </p>
                  <p className="opacity-75">
                    <strong>Filed By:</strong> {selectedPhoto.author}
                  </p>
                  <p className="opacity-75">
                    <strong>Registered Location:</strong> {selectedPhoto.location}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-black/5 dark:border-white/5 flex gap-4 mt-6 select-none">
                <button
                  onClick={() => handleLike(selectedPhoto.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded text-xs font-bold uppercase transition-all ${
                    likedPhotos.includes(selectedPhoto.id)
                      ? "bg-red-500/15 text-red-500 border border-red-500"
                      : "bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-200 border border-transparent"
                  }`}
                >
                  <Heart size={14} className={likedPhotos.includes(selectedPhoto.id) ? "fill-red-500 text-red-500" : ""} />
                  <span>{likedPhotos.includes(selectedPhoto.id) ? "Liked Sub" : "Like Photo"} ({selectedPhoto.likes})</span>
                </button>

                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-5 py-3 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded hover:bg-black/5 transition-colors uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
