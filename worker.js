onmessage = (e) => {
  if (e.data === 'start') {
    const max = 1_000_000;
    for (let i = 1; i <= max; i++) {
      if (i % 10_000 === 0) {
        postMessage({ type: 'progress', value: (i / max * 100).toFixed(2) });
      }
    }
    postMessage({ type: 'done', value: 'Computation finished!' });
  }
}
