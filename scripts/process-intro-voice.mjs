import { readFile, writeFile } from 'node:fs/promises';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath)
  throw new Error('Usage: node scripts/process-intro-voice.mjs input.wav output.wav');
const input = await readFile(inputPath);
if (input.toString('ascii', 0, 4) !== 'RIFF' || input.toString('ascii', 8, 12) !== 'WAVE')
  throw new Error('Expected a WAV recording.');

let sampleRate;
let samples;
for (let offset = 12; offset + 8 <= input.length;) {
  const kind = input.toString('ascii', offset, offset + 4);
  const size = input.readUInt32LE(offset + 4);
  const start = offset + 8;
  if (start + size > input.length) throw new Error('Truncated WAV recording.');
  if (kind === 'fmt ') {
    if (input.readUInt16LE(start) !== 1 || input.readUInt16LE(start + 2) !== 1 || input.readUInt16LE(start + 14) !== 16)
      throw new Error('Expected mono, 16-bit PCM audio.');
    sampleRate = input.readUInt32LE(start + 4);
  }
  if (kind === 'data') samples = input.subarray(start, start + size);
  offset = start + size + (size % 2);
}
if (!sampleRate || !samples?.length) throw new Error('The recording contains no speech.');

const count = Math.floor(samples.length / 2);
const dry = new Float32Array(count);
const highpass = 1 / (1 + 2 * Math.PI * 180 / sampleRate);
const lowpass = 1 - Math.exp(-2 * Math.PI * 5800 / sampleRate);
let previousInput = 0;
let high = 0;
let low = 0;
for (let index = 0; index < count; index++) {
  const sample = samples.readInt16LE(index * 2) / 32768;
  high = highpass * (high + sample - previousInput);
  previousInput = sample;
  low += lowpass * (high - low);
  // Mix intelligible speech with a metallic ring and slight digital grain.
  const modulated = low * (0.8 + 0.2 * Math.sin(2 * Math.PI * 72 * index / sampleRate));
  dry[index] = modulated * 0.84 + Math.round(modulated * 2047) / 2047 * 0.16;
}

const delays = [Math.round(sampleRate * 0.038), Math.round(sampleRate * 0.073)];
const output = new Float32Array(count + Math.ceil(sampleRate * 0.1));
let peak = 0;
for (let index = 0; index < output.length; index++) {
  output[index] = (dry[index] || 0) + (dry[index - delays[0]] || 0) * 0.18 + (dry[index - delays[1]] || 0) * 0.08;
  peak = Math.max(peak, Math.abs(output[index]));
}
if (peak < 0.001) throw new Error('The recording is silent.');

const wav = Buffer.alloc(44 + output.length * 2);
wav.write('RIFF', 0);
wav.writeUInt32LE(wav.length - 8, 4);
wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(output.length * 2, 40);
for (let index = 0; index < output.length; index++) {
  const fade = Math.min(1, index / (sampleRate * 0.01), (output.length - 1 - index) / (sampleRate * 0.03));
  wav.writeInt16LE(Math.round(output[index] / peak * 0.85 * fade * 32767), 44 + index * 2);
}
await writeFile(outputPath, wav);
console.log(`Robot voice: ${(output.length / sampleRate).toFixed(2)}s, ${sampleRate}Hz, ${wav.length} bytes`);
