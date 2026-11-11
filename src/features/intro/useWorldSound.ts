import { useCallback, useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { worldDurations, type WorldVariant } from './useWorldSequence';

interface WorldSoundOptions {
  progress: MotionValue<number>;
  active: boolean;
  reducedMotion: boolean;
  variant: WorldVariant;
}

interface SoundEngine {
  context: AudioContext;
  master: GainNode;
  sources: Set<AudioScheduledSourceNode>;
  nodes: Set<AudioNode>;
  ambient: boolean;
  voiceRequest: AbortController;
  voiceBuffer?: AudioBuffer;
  voicePlayed: boolean;
  suspendTimer?: number;
}

function audioConstructor() {
  if (typeof window === 'undefined') return undefined;
  return (
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  );
}

function clearSuspendTimer(engine: SoundEngine) {
  if (engine.suspendTimer !== undefined)
    window.clearTimeout(engine.suspendTimer);
  engine.suspendTimer = undefined;
}

function stopSources(engine: SoundEngine) {
  engine.sources.forEach((source) => {
    source.onended = null;
    try {
      source.stop();
    } catch {
      /* An already-ended source is harmless. */
    }
    source.disconnect();
  });
  engine.sources.clear();
  engine.nodes.forEach((node) => node.disconnect());
  engine.nodes.clear();
  engine.ambient = false;
}

function dispose(engine: SoundEngine | null) {
  if (!engine) return;
  engine.voiceRequest.abort();
  clearSuspendTimer(engine);
  engine.master.gain.cancelScheduledValues(engine.context.currentTime);
  engine.master.gain.value = 0;
  stopSources(engine);
  engine.master.disconnect();
  if (engine.context.state !== 'closed')
    void engine.context.close().catch(() => {});
}

function startAmbience(engine: SoundEngine) {
  clearSuspendTimer(engine);
  if (!engine.ambient) {
    engine.ambient = true;
    const { context } = engine;
    const level = context.createGain();
    level.gain.value = 0.026;
    level.connect(engine.master);
    engine.nodes.add(level);

    // Two quiet, nearly related tones suggest electrical scale without a melody.
    for (const frequency of [48, 72.15]) {
      const tone = context.createOscillator();
      tone.type = 'sine';
      tone.frequency.value = frequency;
      tone.connect(level);
      engine.sources.add(tone);
      tone.start();
    }

    // A short procedural brown-noise loop supplies a soft low-frequency texture.
    const buffer = context.createBuffer(
      1,
      context.sampleRate,
      context.sampleRate
    );
    const samples = buffer.getChannelData(0);
    let seed = 173;
    let previous = 0;
    for (let index = 0; index < samples.length; index++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const white = (seed / 4294967296) * 2 - 1;
      previous = (previous + white * 0.02) / 1.02;
      samples[index] = previous * 2.8;
    }
    const noise = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const noiseLevel = context.createGain();
    noise.buffer = buffer;
    noise.loop = true;
    filter.type = 'lowpass';
    filter.frequency.value = 210;
    noiseLevel.gain.value = 0.035;
    noise.connect(filter).connect(noiseLevel).connect(engine.master);
    engine.sources.add(noise);
    engine.nodes.add(filter);
    engine.nodes.add(noiseLevel);
    noise.start();
  }
  const now = engine.context.currentTime;
  engine.master.gain.cancelScheduledValues(now);
  engine.master.gain.setTargetAtTime(0.18, now, 0.12);
}

function hush(engine: SoundEngine, immediately = false) {
  clearSuspendTimer(engine);
  const now = engine.context.currentTime;
  engine.master.gain.cancelScheduledValues(now);
  if (immediately) engine.master.gain.value = 0;
  else engine.master.gain.setTargetAtTime(0, now, 0.05);
  const suspend = () => {
    engine.suspendTimer = undefined;
    stopSources(engine);
    if (engine.context.state === 'running')
      void engine.context.suspend().catch(() => {});
  };
  if (immediately) suspend();
  else engine.suspendTimer = window.setTimeout(suspend, 240);
}

function pulse(
  engine: SoundEngine,
  start: number,
  end: number,
  duration: number,
  volume: number
) {
  const { context } = engine;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const level = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(start, now);
  oscillator.frequency.exponentialRampToValueAtTime(end, now + duration);
  level.gain.setValueAtTime(0.0001, now);
  level.gain.exponentialRampToValueAtTime(volume, now + 0.025);
  level.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(level).connect(engine.master);
  engine.sources.add(oscillator);
  engine.nodes.add(level);
  oscillator.onended = () => {
    oscillator.disconnect();
    level.disconnect();
    engine.sources.delete(oscillator);
    engine.nodes.delete(level);
  };
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function playConnectionVoice(
  engine: SoundEngine,
  progress: number,
  variant: WorldVariant
) {
  const { context, voiceBuffer } = engine;
  // The short return animation has no time for a complete spoken greeting.
  if (
    variant !== 'full' ||
    !voiceBuffer ||
    engine.voicePlayed ||
    context.state !== 'running' ||
    progress < 0.18 ||
    (1 - progress) * worldDurations.full < (voiceBuffer.duration + 0.2) * 1000
  )
    return;
  engine.voicePlayed = true;
  const source = context.createBufferSource();
  const level = context.createGain();
  source.buffer = voiceBuffer;
  // Keep the greeting clear above the very quiet procedural ambience.
  level.gain.value = 3.5;
  source.connect(level).connect(engine.master);
  engine.sources.add(source);
  engine.nodes.add(level);
  source.onended = () => {
    source.disconnect();
    level.disconnect();
    engine.sources.delete(source);
    engine.nodes.delete(level);
  };
  source.start();
}

function startSound(engine: SoundEngine, progress: number, variant: WorldVariant) {
  startAmbience(engine);
  playConnectionVoice(engine, progress, variant);
}

/** Local ambience and a self-hosted voice stay silent until an explicit toggle. */
export function useWorldSound({
  progress,
  active,
  reducedMotion,
  variant,
}: WorldSoundOptions) {
  const [enabled, setEnabled] = useState(false);
  const [available, setAvailable] = useState(() => Boolean(audioConstructor()));
  const engine = useRef<SoundEngine | null>(null);
  const wanted = useRef(false);
  const mounted = useRef(true);
  const generation = useRef(0);
  const activeRef = useRef(active);
  const reducedRef = useRef(reducedMotion);
  activeRef.current = active;
  reducedRef.current = reducedMotion;

  const fail = useCallback(() => {
    wanted.current = false;
    generation.current++;
    dispose(engine.current);
    engine.current = null;
    if (mounted.current) {
      setAvailable(false);
      setEnabled(false);
    }
  }, []);

  const resetSound = useCallback(() => {
    wanted.current = false;
    generation.current++;
    dispose(engine.current);
    engine.current = null;
    setEnabled(false);
  }, []);

  const toggleSound = useCallback(() => {
    if (wanted.current) {
      resetSound();
      return;
    }
    const Constructor = audioConstructor();
    if (!Constructor || !available) return;
    const token = ++generation.current;
    wanted.current = true;
    try {
      // Construction and resume are deliberately inside the user gesture handler.
      const context = new Constructor({ latencyHint: 'interactive' });
      const master = context.createGain();
      master.gain.value = 0;
      master.connect(context.destination);
      const next: SoundEngine = {
        context,
        master,
        sources: new Set(),
        nodes: new Set(),
        ambient: false,
        voiceRequest: new AbortController(),
        voicePlayed: false,
      };
      engine.current = next;
      if (variant === 'full') {
        void fetch(`${import.meta.env.BASE_URL}audio/connection-voice.wav`, {
          signal: next.voiceRequest.signal,
        })
          .then((response) => {
            if (!response.ok) throw new Error('Intro voice is unavailable.');
            return response.arrayBuffer();
          })
          .then((data) => context.decodeAudioData(data))
          .then((buffer) => {
            if (engine.current !== next || token !== generation.current) return;
            next.voiceBuffer = buffer;
            if (activeRef.current && !document.hidden)
              playConnectionVoice(next, progress.get(), variant);
          })
          .catch(() => {
            // A missing clip or cancelled download leaves the ambience usable.
          });
      }
      void context
        .resume()
        .then(() => {
          if (
            !mounted.current ||
            token !== generation.current ||
            engine.current !== next
          )
            return;
          setEnabled(true);
          if (activeRef.current && !document.hidden)
            startSound(next, progress.get(), variant);
          else hush(next, true);
        })
        .catch(() => {
          if (token === generation.current) fail();
        });
    } catch {
      fail();
    }
  }, [available, fail, progress, variant, resetSound]);

  useEffect(() => {
    const current = engine.current;
    if (!current || !wanted.current) return;
    if (!active || document.hidden) {
      hush(current);
      return;
    }
    void current.context
      .resume()
      .then(() => {
        if (
          engine.current === current &&
          wanted.current &&
          activeRef.current &&
          !document.hidden
        )
          startSound(current, progress.get(), variant);
      })
      .catch(() => {
        if (engine.current === current && wanted.current) fail();
      });
  }, [active, enabled, fail, progress, variant]);

  useEffect(() => {
    let previous = progress.get();
    return progress.on('change', (value) => {
      const before = previous;
      previous = value;
      const current = engine.current;
      // Do not queue impacts after a hidden-tab catch-up, replay reset, or skip.
      if (
        !current ||
        !wanted.current ||
        !activeRef.current ||
        reducedRef.current ||
        document.hidden ||
        current.context.state !== 'running' ||
        value - before > 0.15 ||
        value < before
      )
        return;
      playConnectionVoice(current, value, variant);
      const cues = [
        { at: 0.18, from: 58, to: 25, duration: 0.65, volume: 0.13 },
        { at: 0.35, from: 230, to: 900, duration: 0.36, volume: 0.035 },
        { at: 0.6, from: 360, to: 1400, duration: 0.24, volume: 0.028 },
        { at: 0.85, from: 170, to: 700, duration: 0.48, volume: 0.04 },
      ];
      cues.forEach((cue) => {
        if (before < cue.at && value >= cue.at)
          pulse(current, cue.from, cue.to, cue.duration, cue.volume);
      });
    });
  }, [progress, variant]);

  useEffect(() => {
    mounted.current = true;
    const onVisibility = () => {
      const current = engine.current;
      if (!current || !wanted.current) return;
      if (document.hidden || !activeRef.current) hush(current, true);
      else
        void current.context
          .resume()
          .then(() => {
            if (
              engine.current === current &&
              wanted.current &&
              activeRef.current &&
              !document.hidden
            )
              startSound(current, progress.get(), variant);
          })
          .catch(() => {
            if (engine.current === current && wanted.current) fail();
          });
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      mounted.current = false;
      wanted.current = false;
      generation.current++;
      document.removeEventListener('visibilitychange', onVisibility);
      dispose(engine.current);
      engine.current = null;
    };
  }, [fail, progress, variant]);

  return { enabled, available, toggleSound, resetSound };
}
