// useVideoDetection.ts
// Detecta TODOS los links de video en texto plano y retorna un array con metadata

export type VideoType =
    | "youtube_video"
    | "youtube_short"
    | "youtube_playlist"
    | "youtube_channel"
    | "tiktok"
    | "facebook_video"
    | "vimeo"
    | "twitch_clip"
    | "twitch_channel";

export interface DetectedVideo {
    type: VideoType;
    url: string;
    id: string;
    embedUrl: string;
    label: string;
}

interface Pattern {
    type: VideoType;
    regex: RegExp;
    getId: (m: RegExpMatchArray) => string;
    getEmbed: (id: string) => string;
    label: string;
    getUrl: (m: RegExpMatchArray) => string;
}

const PATTERNS: Pattern[] = [
    {
        type: "youtube_short",
        regex: /https?:\/\/(?:www\.)?youtube\.com\/shorts\/([\w-]{11})(?:[^\s]*)?/g,
        getId: (m) => m[1],
        getEmbed: (id) => `https://www.youtube.com/embed/${id}`,
        getUrl: (m) => m[0],
        label: "YouTube Short",
    },
    {
        type: "youtube_playlist",
        regex: /https?:\/\/(?:www\.)?youtube\.com\/[^\s]*[?&]list=([\w-]+)[^\s]*/g,
        getId: (m) => m[1],
        getEmbed: (id) => `https://www.youtube.com/embed/videoseries?list=${id}`,
        getUrl: (m) => m[0],
        label: "YouTube Playlist",
    },
    {
        type: "youtube_channel",
        regex: /https?:\/\/(?:www\.)?youtube\.com\/(?:channel\/([\w-]+)|@([\w.-]+)|c\/([\w-]+)|user\/([\w-]+))(?:[^\s]*)?/g,
        getId: (m) => m[1] || m[2] || m[3] || m[4],
        getEmbed: () => "",
        getUrl: (m) => m[0],
        label: "Canal de YouTube",
    },
    {
        type: "youtube_video",
        regex: /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?(?:[^\s&]*&)*v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})(?:[^\s]*)?/g,
        getId: (m) => m[1],
        getEmbed: (id) => `https://www.youtube.com/embed/${id}`,
        getUrl: (m) => m[0],
        label: "YouTube",
    },
    {
        type: "tiktok",
        regex: /https?:\/\/(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)(?:[^\s]*)?/g,
        getId: (m) => m[1],
        getEmbed: (id) => `https://www.tiktok.com/embed/v2/${id}`,
        getUrl: (m) => m[0],
        label: "TikTok",
    },
    {
        type: "facebook_video",
        regex: /https?:\/\/(?:www\.)?(?:facebook\.com\/(?:watch\/?\?v=(\d+)|[^/\s]+\/videos\/(\d+))|fb\.watch\/([\w-]+))(?:[^\s]*)?/g,
        getId: (m) => m[1] || m[2] || m[3],
        getEmbed: () => "",
        getUrl: (m) => m[0],
        label: "Facebook Video",
    },
    {
        type: "vimeo",
        regex: /https?:\/\/(?:www\.)?vimeo\.com\/(\d+)(?:[^\s]*)?/g,
        getId: (m) => m[1],
        getEmbed: (id) => `https://player.vimeo.com/video/${id}`,
        getUrl: (m) => m[0],
        label: "Vimeo",
    },
    {
        type: "twitch_clip",
        regex: /https?:\/\/(?:clips\.twitch\.tv\/([\w-]+)|(?:www\.)?twitch\.tv\/\w+\/clip\/([\w-]+)|(?:www\.)?twitch\.tv\/videos\/(\d+))(?:[^\s]*)?/g,
        getId: (m) => m[1] || m[2] || m[3],
        getEmbed: (id) =>
            /^\d+$/.test(id)
                ? `https://player.twitch.tv/?video=${id}&parent=${typeof window !== "undefined" ? window.location.hostname : "localhost"}&autoplay=false`
                : `https://clips.twitch.tv/embed?clip=${id}&parent=${typeof window !== "undefined" ? window.location.hostname : "localhost"}&autoplay=false`,
        getUrl: (m) => m[0],
        label: "Twitch Clip",
    },
    {
        type: "twitch_channel",
        regex: /https?:\/\/(?:www\.)?twitch\.tv\/([\w]+)\/?(?:\s|$)/g,
        getId: (m) => m[1],
        getEmbed: (id) =>
            `https://player.twitch.tv/?channel=${id}&parent=${typeof window !== "undefined" ? window.location.hostname : "localhost"}&autoplay=false`,
        getUrl: (m) => m[0].trim(),
        label: "Twitch",
    },
];

/**
 * Detecta TODOS los links de video en el texto.
 * Retorna un array (vacío si no hay ninguno).
 * Elimina duplicados por URL.
 */
export function detectAllVideos(text: string): DetectedVideo[] {
    const results: DetectedVideo[] = [];
    const seenUrls = new Set<string>();

    for (const pattern of PATTERNS) {
        pattern.regex.lastIndex = 0;
        const matches = [...text.matchAll(pattern.regex)];

        for (const match of matches) {
            const url = pattern.getUrl(match).replace(/[.,;!?]$/, "");
            if (seenUrls.has(url)) continue;
            seenUrls.add(url);

            const id = pattern.getId(match);
            if (!id) continue;

            results.push({
                type: pattern.type,
                url,
                id,
                embedUrl: pattern.getEmbed(id),
                label: pattern.label,
            });
        }
    }

    return results;
}

export function supportsEmbed(type: VideoType): boolean {
    return !["youtube_channel", "facebook_video"].includes(type);
}