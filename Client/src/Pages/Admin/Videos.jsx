import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, GripVertical, ExternalLink } from "lucide-react";
import { Reorder } from "framer-motion";

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://founders-sangam.onrender.com/content/videos");
            if (res.data.success && res.data.content && Array.isArray(res.data.content)) {
                setVideos(res.data.content);
            }
        } catch (err) {
            console.error("Failed to fetch videos");
        } finally {
            setLoading(false);
        }
    };

    const saveVideos = async (updatedVideos) => {
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            await axios.post(
                "https://founders-sangam.onrender.com/content/videos",
                { content: updatedVideos },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error("Failed to save videos");
            alert("Failed to save videos");
        } finally {
            setSaving(false);
        }
    };

    const addVideo = () => {
        if (!newVideoUrl.trim()) {
            alert("Please enter a video URL");
            return;
        }

        const updatedVideos = [...videos, newVideoUrl.trim()];
        setVideos(updatedVideos);
        saveVideos(updatedVideos);
        setNewVideoUrl("");
    };

    const deleteVideo = (index) => {
        const updatedVideos = videos.filter((_, i) => i !== index);
        setVideos(updatedVideos);
        saveVideos(updatedVideos);
    };

    const handleReorder = (newOrder) => {
        setVideos(newOrder);
        saveVideos(newOrder);
    };

    const getVideoType = (url) => {
        if (url.includes("cloudinary.com")) return "Cloudinary";
        if (url.includes(".mp4") || url.includes(".webm") || url.includes(".mov")) return "Direct Video";
        if (url.includes("cdninstagram.com") || url.includes("fbcdn.net")) return "Instagram CDN";
        return "Unknown";
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 px-4">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Video Management</h2>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addVideo()}
                        placeholder="Paste Cloudinary URL or direct video URL"
                        className="flex-1 px-4 py-3 rounded-lg bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                    <button
                        onClick={addVideo}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        <Plus size={18} />
                        Add
                    </button>
                </div>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">📝 How to Get Cloudinary Video Link</h4>
                    <ol className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside">
                        <li>Go to <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">cloudinary.com</a> and sign in</li>
                        <li>Click "Media Library" → "Upload" button</li>
                        <li>Select your video file (MP4, MOV, etc.)</li>
                        <li>Once uploaded, click on the Assets tab</li>
                        <li>Select the video file and copy the URL from the "Link" section</li>
                        <li>Paste the URL in the input field above</li>
                    </ol>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-3 italic">
                        💡 Tip: You can use either the full Cloudinary URL!
                    </p>
                </div>
            </div>

            {/* Video List */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                        Current Videos ({videos.length})
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">Drag to reorder</p>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-neutral-500 text-sm">Loading videos...</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-neutral-500">No videos added yet. Add your first video above!</p>
                    </div>
                ) : (
                    <Reorder.Group axis="y" values={videos} onReorder={handleReorder} className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {videos.map((url, index) => (
                            <Reorder.Item
                                key={url}
                                value={url}
                                className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors cursor-move"
                            >
                                <div className="flex items-center gap-4">
                                    <GripVertical size={20} className="text-neutral-400 flex-shrink-0" />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getVideoType(url) === "Cloudinary" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400" :
                                                getVideoType(url) === "Direct Video" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" :
                                                    getVideoType(url) === "Instagram CDN" ? "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400" :
                                                        "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                                                }`}>
                                                {getVideoType(url)}
                                            </span>
                                            <span className="text-xs text-neutral-500">Video {index + 1}</span>
                                        </div>
                                        <p className="text-sm text-neutral-900 dark:text-white font-mono truncate">{url}</p>
                                    </div>

                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-600 dark:text-neutral-400"
                                    >
                                        <ExternalLink size={16} />
                                    </a>

                                    <button
                                        onClick={() => deleteVideo(index)}
                                        disabled={saving}
                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-500 disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}
            </div>

            {saving && (
                <div className="fixed bottom-4 right-4 bg-neutral-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Saving...</span>
                </div>
            )}
        </div>
    );
};

export default Videos;
