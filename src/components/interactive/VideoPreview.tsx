// VideoPreview.tsx — lista de todos los videos detectados

import { Icon } from "@iconify/react";
import type { DetectedVideo } from "@/hooks/useVideoDetectation";
import { supportsEmbed } from "@/hooks/useVideoDetectation";

const ICONS: Record<string, string> = {
    youtube_video: "logos:youtube-icon",
    youtube_short: "logos:youtube-icon",
    youtube_playlist: "logos:youtube-icon",
    youtube_channel: "logos:youtube-icon",
    tiktok: "logos:tiktok-icon",
    facebook_video: "logos:facebook",
    vimeo: "logos:vimeo-icon",
    twitch_clip: "logos:twitch",
    twitch_channel: "logos:twitch",
};

interface VideoPreviewItemProps {
    video: DetectedVideo;
    index: number;
    total: number;
}

const VideoPreviewItem = ({ video, index, total }: VideoPreviewItemProps) => {
    const canEmbed = supportsEmbed(video.type);
    const icon = ICONS[video.type] ?? "mingcute:video-line";

    return (
        <div
            className="rounded-xl overflow-hidden border border-brand-cyan/20 bg-brand-dark/60"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-brand-cyan/5 border-b border-brand-cyan/10">
                <div className="flex items-center gap-2 min-w-0">
                    <Icon icon={icon} className="text-base shrink-0" />
                    <span className="text-xs font-semibold text-brand-cyan shrink-0">{video.label}</span>
                    {total > 1 && (
                        <span className="text-gray-600 text-xs">
                            {index + 1}/{total}
                        </span>
                    )}
                    <span className="text-gray-600 text-xs truncate hidden sm:block">{video.url}</span>
                </div>
                <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors shrink-0 ml-2"
                >
                    <Icon icon="mingcute:external-link-line" className="text-sm" />
                    <span className="hidden sm:inline">Abrir</span>
                </a>
            </div>

            {canEmbed ? (
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                    <iframe
                        src={video.embedUrl}
                        title={`${video.label} - ${video.id}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="absolute inset-0 w-full h-full border-0"
                    />
                </div>
            ) : (
                <div className="flex items-center gap-3 px-4 py-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center shrink-0">
                        <Icon icon={icon} className="text-xl" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-white text-xs font-semibold truncate">
                            {video.type === "youtube_channel"
                                ? `Canal: @${video.id}`
                                : "Video de Facebook"}
                        </p>
                        <p className="text-gray-500 text-xs truncate">{video.url}</p>
                    </div>
                    <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-3 py-1.5 bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan text-xs font-semibold rounded-lg transition-colors"
                    >
                        Ver
                    </a>
                </div>
            )}
        </div>
    );
};

interface VideoPreviewListProps {
    videos: DetectedVideo[];
}

export const VideoPreviewList = ({ videos }: VideoPreviewListProps) => {
    if (videos.length === 0) return null;

    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {videos.length > 1 && (
                <div className="flex items-center gap-2">
                    <Icon icon="mingcute:video-line" className="text-brand-cyan text-sm" />
                    <span className="text-xs text-gray-400 font-medium">
                        {videos.length} videos detectados
                    </span>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {videos.map((video, i) => (
                    <VideoPreviewItem
                        key={video.url}
                        video={video}
                        index={i}
                        total={videos.length}
                    />
                ))}
            </div>
        </div>
    );
};