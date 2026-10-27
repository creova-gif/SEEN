import { act, render } from '@testing-library/react-native';
import * as Speech from 'expo-speech';
import { PlayerProvider, formatTime, usePlayer, type Track } from '../player';

const track: Track = { storyId: 's', chapterId: 'c', title: 'The First Note', artist: 'Kira Chen', text: 'One two three four five. Six seven eight nine ten.', lang: 'en' };
let p: ReturnType<typeof usePlayer>;
const Probe = () => ((p = usePlayer()), null);
const mount = async () => { await render(<PlayerProvider><Probe /></PlayerProvider>); };
const run = async (fn: () => void) => { await act(async () => { fn(); }); };

beforeEach(() => { jest.useFakeTimers(); (Speech.speak as jest.Mock).mockClear(); (Speech.stop as jest.Mock).mockClear(); });
afterEach(() => jest.useRealTimers());

describe('native player (device voice)', () => {
  it('loads paused with an estimated length, and reads the text aloud on play', async () => {
    await mount();
    await run(() => p.load(track));
    expect(p.status).toBe('paused');
    expect(p.source).toBe('voice');
    expect(p.duration).toBeGreaterThan(0);
    await run(() => p.play());
    expect(p.status).toBe('playing');
    expect(Speech.speak).toHaveBeenCalledWith(track.text, expect.objectContaining({ language: 'en-CA', rate: 1 }));
  });

  it('moves progress forward while playing and stops speaking on pause', async () => {
    await mount();
    await run(() => p.load(track));
    await run(() => p.play());
    await run(() => { jest.advanceTimersByTime(1000); });
    expect(p.elapsed).toBeGreaterThan(0.9);
    expect(p.progress).toBeGreaterThan(0);
    await run(() => p.pause());
    expect(p.status).toBe('paused');
    expect(Speech.stop).toHaveBeenCalled();
    const at = p.elapsed;
    await run(() => { jest.advanceTimersByTime(1000); });
    expect(p.elapsed).toBe(at);
  });

  it('finishes when the voice is done, and plays again from the start', async () => {
    await mount();
    await run(() => p.load(track));
    await run(() => p.play());
    const { onDone } = (Speech.speak as jest.Mock).mock.calls[0][1];
    await run(() => onDone());
    expect(p.status).toBe('ended');
    expect(p.progress).toBe(1);
    await run(() => p.play());
    expect(p.status).toBe('playing');
    expect(p.elapsed).toBeLessThan(1);
  });

  it('seeks, skips within bounds, changes speed, and stops', async () => {
    await mount();
    await run(() => p.load(track));
    await run(() => p.seek(0.5));
    expect(p.progress).toBeCloseTo(0.5, 1);
    await run(() => p.skip(-1000));
    expect(p.elapsed).toBe(0);
    await run(() => p.skip(1000));
    expect(p.progress).toBe(1);
    await run(() => p.setRate(1.5));
    expect(p.rate).toBe(1.5);
    await run(() => p.stop());
    expect(p.status).toBe('idle');
    expect(p.track).toBeNull();
  });

  it('formats times', async () => {
    expect(formatTime(75)).toBe('1:15');
    expect(formatTime(-1)).toBe('0:00');
    expect(formatTime(NaN)).toBe('0:00');
  });
});
