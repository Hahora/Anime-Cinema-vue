<template>
  <div class="animated-bg">
    <div class="bg-gradient gradient-1"></div>
    <div class="bg-gradient gradient-2"></div>
    <div class="bg-gradient gradient-3"></div>
  </div>
</template>

<script>
export default {
  name: 'AnimatedBackground',
}
</script>

<style scoped>
.animated-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  animation: float 20s infinite ease-in-out;
}

.gradient-1 {
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, #ff416c, transparent);
  top: -250px;
  left: -150px;
  animation-delay: 0s;
}

.gradient-2 {
  width: 750px;
  height: 750px;
  background: radial-gradient(circle, #ff4b2b, transparent);
  bottom: -350px;
  right: -250px;
  animation-delay: 7s;
}

.gradient-3 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #9c27b0, transparent);
  top: 40%;
  left: 50%;
  animation-delay: 14s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-50px, 50px) scale(0.9);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

/* Адаптив для мобильных */
@media (max-width: 768px) {
  .gradient-1 {
    width: 350px;
    height: 350px;
  }

  .gradient-2 {
    width: 450px;
    height: 450px;
  }

  .gradient-3 {
    width: 250px;
    height: 250px;
  }
}
</style>
