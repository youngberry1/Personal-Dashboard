// worker.js
self.onmessage = function (e) {
  if (e.data === 'start') {
    let progress = 0;
    const total = 10000000;
    const chunk = total / 100;

    for (let i = 0; i < total; i++) {
      Math.sqrt(i) * Math.sqrt(i);
      if (i % chunk === 0) {
        progress++;
        self.postMessage({ type: 'progress', value: progress });
      }
    }

    self.postMessage({ type: 'done', value: 'Calculation completed successfully!' });
  }
};
