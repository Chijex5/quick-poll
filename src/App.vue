<template>
  <div class="app-container">
    <Transition name="fade" appear>
      <main class="main-content">
        <Poll
          :question="pollQuestion"
          :options="pollOptions"
          class="poll-wrapper"
        />

        <footer class="footer">
          <div class="watermark">
            <span>Created with</span>
            <HeartIcon class="heart-icon" />
            <span>by Chijioke</span>
          </div>
        </footer>
      </main>
    </Transition>
  </div>
</template>

<script setup lang='ts'>
import { HeartIcon } from 'lucide-vue-next';
import Poll from './components/Poll.vue';

const pollQuestion = "What's your favorite frontend framework?";
const pollOptions = [
  { text: 'Vue.js' },
  { text: 'React' },
  { text: 'Svelte' },
  { text: 'Angular' }
];
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --gradient-start: #6366f1;
  --gradient-end: #8b5cf6;
}

body {
  margin: 0;
  background: linear-gradient(to bottom right, #eef2ff, #f3e8ff);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.main-content {
  width: 100%;
  max-width: 48rem;
}

.poll-wrapper {
  transform: scale(1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.poll-wrapper:hover {
  transform: scale(1.005);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.footer {
  margin-top: 2rem;
  text-align: center;
}

.watermark {
  color: #6b7280;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.heart-icon {
  width: 1rem;
  height: 1rem;
  color: #f87171;
  fill: #f87171;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 640px) {
  .poll-question {
    font-size: 1.5rem;
  }

  .option-text {
    font-size: 1rem; /* Equivalent to text-base */
  }
}
</style>