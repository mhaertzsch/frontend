<script setup>
  import confetti from 'canvas-confetti';

  const theme = import.meta.env.VITE_SEASONAL || '';
  if (theme === 'christmas') {
    (function frame() {
      const duration = 120 * 1000;
      const animationEnd = Date.now() + duration;
      let skew = 1;

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      (function tick() {
        //const timeLeft = animationEnd - Date.now();
        // timeLeft = 1 um für immer laufen zu lassen.
        const timeLeft = 1;
        const ticks = Math.max(200, 500 * (timeLeft / duration));
        skew = Math.max(0.8, skew - 0.001);

        confetti({
          particleCount: 1,
          startVelocity: 0,
          ticks,
          origin: { x: Math.random(), y: Math.random() * skew - 0.2 },
          colors: ['#ffffff'],
          shapes: ['circle'],
          gravity: randomInRange(0.4, 0.6),
          scalar: randomInRange(0.4, 1),
          drift: randomInRange(-0.4, 0.4),
        });

        if (timeLeft > 0) requestAnimationFrame(tick);
      })();
    })();
  }
</script>

<template></template>

<style scoped></style>
