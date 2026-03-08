// Web Worker for ringtone timing - not throttled in background tabs
let intervalId = null;
let beepCount = 0;
const MAX_BEEPS = 15;
const BEEP_INTERVAL = 1500;

self.onmessage = (e) => {
  if (e.data === 'start') {
    beepCount = 0;
    if (intervalId) clearInterval(intervalId);
    // Send first beep immediately
    self.postMessage('beep');
    beepCount = 1;
    intervalId = setInterval(() => {
      beepCount++;
      if (beepCount > MAX_BEEPS) {
        clearInterval(intervalId);
        intervalId = null;
        self.postMessage('done');
        return;
      }
      self.postMessage('beep');
    }, BEEP_INTERVAL);
  } else if (e.data === 'stop') {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    beepCount = 0;
  }
};
