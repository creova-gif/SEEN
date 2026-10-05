import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * One playback engine for the whole app, so narration keeps playing while
 * the user browses (Figma "Media Player Bar" mini + expanded variants).
 *
 * Source order:
 *  1. recorded narration (`src`) through an <audio> element;
 *  2. if there is no recording or it fails to load, the chapter text read
 *     aloud with the device's speech voice (Web Speech API) — always labelled
 *     "Device voice" in the UI so nobody mistakes it for a recorded narrator;
 *  3. if neither is possible, an explicit "unavailable" state (never a button
 *     that silently does nothing).
 */

export type PlaybackSource = "recording" | "voice";
export type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "ended" | "unavailable";

export interface Track {
  storyId: string;
  chapterId: string;
  title: string;
  artist?: string;
  src?: string;
  /** Text used for the device-voice fallback. */
  text: string;
  lang: "en" | "fr" | "es";
  coverImage?: string;
}

interface PlaybackState {
  track: Track | null;
  status: PlaybackStatus;
  source: PlaybackSource | null;
  /** 0–1 */
  progress: number;
  elapsed: number; // seconds (estimated for the device voice)
  duration: number; // seconds (estimated for the device voice)
  expanded: boolean;
}

interface PlaybackApi extends PlaybackState {
  load: (track: Track) => void;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  seek: (fraction: number) => void;
  skip: (seconds: number) => void;
  stop: () => void;
  setExpanded: (v: boolean) => void;
  voiceSupported: boolean;
}

const WORDS_PER_SECOND = 2.5; // ~150 wpm, used only to estimate device-voice progress
const LANG_TAG = { en: "en-CA", fr: "fr-CA", es: "es-ES" } as const;

const Ctx = createContext<PlaybackApi | null>(null);

export function usePlayback(): PlaybackApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayback must be used inside <PlaybackProvider>");
  return ctx;
}

function speechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
}

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlaybackState>({
    track: null,
    status: "idle",
    source: null,
    progress: 0,
    elapsed: 0,
    duration: 0,
    expanded: false,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceOffset = useRef(0); // char index where the current utterance started
  const voiceChar = useRef(0);
  const voiceSupported = speechAvailable();
  const trackRef = useRef<Track | null>(null);

  const patch = useCallback((p: Partial<PlaybackState>) => setState(s => ({ ...s, ...p })), []);
  const stateRef = useRef(state);
  stateRef.current = state;

  // ------------------------------------------------------------ device voice
  const voiceDuration = (text: string) => Math.max(1, text.split(/\s+/).length / WORDS_PER_SECOND);

  const speakFrom = useCallback(
    (charIndex: number) => {
      const t = trackRef.current;
      if (!t || !voiceSupported) return;
      window.speechSynthesis.cancel();
      const start = Math.max(0, Math.min(charIndex, t.text.length - 1));
      voiceOffset.current = start;
      voiceChar.current = start;
      const u = new SpeechSynthesisUtterance(t.text.slice(start));
      u.lang = LANG_TAG[t.lang];
      const voice = window.speechSynthesis.getVoices().find(v => v.lang?.toLowerCase().startsWith(t.lang));
      if (voice) u.voice = voice;
      const total = voiceDuration(t.text);
      u.onboundary = e => {
        voiceChar.current = voiceOffset.current + e.charIndex;
        const progress = voiceChar.current / t.text.length;
        patch({ progress, elapsed: progress * total });
      };
      u.onend = () => {
        if (trackRef.current === t && voiceChar.current >= t.text.length - 40) patch({ status: "ended", progress: 1, elapsed: total });
      };
      u.onerror = e => {
        if (e.error !== "interrupted" && e.error !== "canceled") patch({ status: "unavailable" });
      };
      window.speechSynthesis.speak(u);
      patch({ status: "playing", source: "voice", duration: total });
    },
    [patch, voiceSupported],
  );

  const fallBackToVoice = useCallback(
    (autoplay: boolean) => {
      const t = trackRef.current;
      if (!t) return;
      if (!voiceSupported || !t.text.trim()) {
        patch({ status: "unavailable", source: null });
        return;
      }
      patch({ source: "voice", duration: voiceDuration(t.text), status: autoplay ? "playing" : "paused" });
      if (autoplay) speakFrom(0);
    },
    [patch, speakFrom, voiceSupported],
  );

  // ------------------------------------------------------------ lifecycle
  const teardown = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.src = "";
    audioRef.current = null;
    if (voiceSupported) window.speechSynthesis.cancel();
  };

  useEffect(() => () => teardown(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(
    (track: Track) => {
      const cur = trackRef.current;
      if (cur && cur.storyId === track.storyId && cur.chapterId === track.chapterId && cur.lang === track.lang) return;
      teardown();
      trackRef.current = track;
      setState(s => ({ ...s, track, status: "loading", source: null, progress: 0, elapsed: 0, duration: 0 }));

      if (!track.src) {
        fallBackToVoice(false);
        return;
      }
      const audio = new Audio();
      audio.preload = "metadata";
      audioRef.current = audio;
      audio.addEventListener("loadedmetadata", () => patch({ duration: audio.duration, source: "recording", status: "paused" }));
      audio.addEventListener("timeupdate", () =>
        patch({ elapsed: audio.currentTime, progress: audio.duration ? audio.currentTime / audio.duration : 0 }),
      );
      audio.addEventListener("ended", () => patch({ status: "ended", progress: 1 }));
      audio.addEventListener("error", () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
          fallBackToVoice(false);
        }
      });
      audio.src = track.src;
    },
    [fallBackToVoice, patch], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const play = useCallback(() => {
    const t = trackRef.current;
    const s = stateRef.current;
    if (!t) return;
    if (s.source === "recording" && audioRef.current) {
      audioRef.current.play().then(
        () => patch({ status: "playing" }),
        () => fallBackToVoice(true),
      );
      return;
    }
    if (s.source === "voice") {
      if (s.status === "paused" && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        patch({ status: "playing" });
        return;
      }
      speakFrom(s.status === "ended" ? 0 : Math.round(s.progress * t.text.length));
    }
  }, [fallBackToVoice, patch, speakFrom]);

  const pause = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== "playing") return;
    if (s.source === "recording") audioRef.current?.pause();
    if (s.source === "voice" && voiceSupported) window.speechSynthesis.pause();
    patch({ status: "paused" });
  }, [patch, voiceSupported]);

  const toggle = useCallback(() => {
    if (state.status === "playing") pause();
    else play();
  }, [pause, play, state.status]);

  const seek = useCallback(
    (fraction: number) => {
      const f = Math.max(0, Math.min(1, fraction));
      const t = trackRef.current;
      if (!t) return;
      if (state.source === "recording" && audioRef.current && state.duration) {
        audioRef.current.currentTime = f * state.duration;
        patch({ progress: f, elapsed: f * state.duration });
      } else if (state.source === "voice") {
        patch({ progress: f, elapsed: f * state.duration });
        if (state.status === "playing") speakFrom(Math.round(f * t.text.length));
      }
    },
    [patch, speakFrom, state.duration, state.source, state.status],
  );

  const skip = useCallback(
    (seconds: number) => {
      if (!state.duration) return;
      seek((state.elapsed + seconds) / state.duration);
    },
    [seek, state.duration, state.elapsed],
  );

  const stop = useCallback(() => {
    teardown();
    trackRef.current = null;
    setState({ track: null, status: "idle", source: null, progress: 0, elapsed: 0, duration: 0, expanded: false });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setExpanded = useCallback((expanded: boolean) => patch({ expanded }), [patch]);

  const api = useMemo<PlaybackApi>(
    () => ({ ...state, load, toggle, play, pause, seek, skip, stop, setExpanded, voiceSupported }),
    [state, load, toggle, play, pause, seek, skip, stop, setExpanded, voiceSupported],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
