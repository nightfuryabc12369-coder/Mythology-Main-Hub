import { playTone } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Minus, Plus, Volume1, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TRACK = "/audio/where-waves-collide.mp3";

/**
 * Plays the background track on a loop while sound is on, at the chosen volume.
 * Browsers only allow audio after a click or key press, so if the page opens with sound already
 * on, the track starts on the visitor's first interaction.
 */
export function MusicPlayer() {
  const hydrated = useArchiveStore((state) => state.hydrated);
  const sound = useArchiveStore((state) => state.sound);
  const volume = useArchiveStore((state) => state.volume);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!sound) {
      audioRef.current?.pause();
      return;
    }
    if (!audioRef.current) {
      const audio = new Audio(TRACK);
      audio.loop = true;
      audio.preload = "auto";
      audioRef.current = audio;
    }
    const audio = audioRef.current;
    audio.volume = useArchiveStore.getState().volume;

    let waiting = false;
    const retry = () => {
      void audio.play().then(release).catch(() => undefined);
    };
    function release() {
      if (!waiting) return;
      waiting = false;
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
    }
    audio.play().catch(() => {
      waiting = true;
      window.addEventListener("pointerdown", retry);
      window.addEventListener("keydown", retry);
    });
    return release;
  }, [hydrated, sound]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  return null;
}

/** The speaker button in the top bar. Opens a small panel with an on/off switch and a volume bar. */
export function SoundControl() {
  const sound = useArchiveStore((state) => state.sound);
  const volume = useArchiveStore((state) => state.volume);
  const toggleSound = useArchiveStore((state) => state.toggleSound);
  const setVolume = useArchiveStore((state) => state.setVolume);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (box.current && !box.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const percent = Math.round(volume * 100);
  const Icon = !sound || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  function step(delta: number) {
    setVolume(Math.round((volume + delta) * 10) / 10);
  }

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={sound ? "Sound and volume" : "Turn on the music"}
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          // First tap switches the music on so it starts straight away; the panel lets you adjust it.
          if (!sound) {
            toggleSound();
            playTone(494, 0.12, 0.04);
          }
          setOpen(true);
        }}
        className={cn("inline-flex size-11 items-center justify-center rounded-sm hover:text-fg", sound ? "text-primary" : "text-muted")}
      >
        <Icon className="size-5" />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Sound settings"
          className="fixed inset-x-4 top-16 z-50 rounded-md border border-border bg-surface p-4 shadow-glass sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-72"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-kicker text-gold uppercase">Music</p>
              <p className="text-sm text-muted">Where Waves Collide</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={sound}
              aria-label="Music on or off"
              onClick={toggleSound}
              className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", sound ? "bg-primary" : "bg-elevated")}
            >
              <span
                className={cn(
                  "absolute top-1 left-1 size-5 rounded-full bg-fg transition-transform duration-150",
                  sound ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
          </div>

          <div className={cn("mt-4 transition-opacity", sound ? "opacity-100" : "opacity-50")}>
            <div className="flex items-center justify-between text-xs tracking-kicker text-muted uppercase">
              <span>Volume</span>
              <span className="text-fg">{percent}%</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                aria-label="Volume down"
                onClick={() => step(-0.1)}
                disabled={volume <= 0}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm border border-border text-muted hover:text-fg disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={percent}
                onChange={(event) => setVolume(Number(event.target.value) / 100)}
                aria-label="Volume"
                className="h-2 w-full cursor-pointer accent-primary"
              />
              <button
                type="button"
                aria-label="Volume up"
                onClick={() => step(0.1)}
                disabled={volume >= 1}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm border border-border text-muted hover:text-fg disabled:opacity-40"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
