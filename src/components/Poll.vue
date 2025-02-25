<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="poll-container">
    <div class="poll-header">
      <h1 class="poll-question">{{ question }}</h1>
      <Transition name="fade">
        <div v-if="hasVoted" class="thanks-message">Thanks for voting! 🎉</div>
      </Transition>
    </div>

    <TransitionGroup 
      name="staggered-fade"
      tag="div"
      class="options-container"
      @before-enter="beforeEnter"
      @enter="enter"
    >
      <div
        v-for="(option, index) in options"
        :key="option.text"
        class="option-wrapper"
        :data-index="index"
      >
        <button
          v-if="!hasVoted"
          @click="vote(index)"
          class="option-button"
          :class="{ hovered: hoveredIndex === index }"
          @mouseover="hoveredIndex = index"
          @mouseleave="hoveredIndex = -1"
        >
          <span class="option-text">{{ option.text }}</span>
          <ArrowRightCircleIcon
            v-if="hoveredIndex === index"
            class="option-icon"
          />
        </button>

        <div v-else class="result-bar">
          <div
            class="result-fill"
            :style="{ width: animateResults ? `${optionPercentage(index)}%` : '0%' }"
            :class="{ winner: isWinner(index) }"
          >
            <span class="percentage-text">
              {{ optionPercentage(index).toFixed(1) }}%
              <TrophyIcon v-if="isWinner(index)" class="trophy-icon" />
              <CheckCircleIcon
                v-if="selectedOption === index"
                class="check-icon"
              />
              <span class="vote-count">({{ votes[index] }} votes)</span>
            </span>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <Transition name="slide-up">
      <div v-if="hasVoted" class="total-votes">
        <BarChartIcon class="chart-icon" />
        {{ totalVotes }} total votes
        <button @click="resetVotes" class="reset-button">Vote Again</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps } from 'vue';
import confetti from 'canvas-confetti';
import { ArrowRightCircleIcon, TrophyIcon, CheckCircleIcon, BarChartIcon } from 'lucide-vue-next';
import gsap from 'gsap';

const props = defineProps({
  question: {
    type: String,
    required: true
  },
  options: {
    type: Array as () => { text: string }[],
    required: true
  }
});

// Initialize with fake data
const votes = ref<number[]>(props.options.map(() => Math.floor(Math.random() * 100) + 1));
const hasVoted = ref(false);
const selectedOption = ref(-1);
const hoveredIndex = ref(-1);
const animateResults = ref(false);

const totalVotes = computed(() => 
  votes.value.reduce((acc, curr) => acc + curr, 0)
);

const optionPercentage = computed(() => (index: number) => 
  totalVotes.value > 0 ? (votes.value[index] / totalVotes.value) * 100 : 0
);

const isWinner = (index: number) => {
  const maxVotes = Math.max(...votes.value);
  return votes.value[index] === maxVotes && totalVotes.value > 0;
};

const vote = (index: number) => {
  if (hasVoted.value) return;

  votes.value[index]++;
  selectedOption.value = index;
  hasVoted.value = true;

  // Confetti animation
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 },
    zIndex: 9999,
    colors: ['#6366f1', '#8b5cf6', '#ec4899']
  });
};

const resetVotes = () => {
  hasVoted.value = false;
  selectedOption.value = -1;
  animateResults.value = false;
};

// Animation hooks for staggered transitions
const beforeEnter = (el: any) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
};

const enter = (el: any, done: any) => {
  const delay = el.dataset.index * 100;
  setTimeout(() => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: done
    });
  }, delay);
};

watch(hasVoted, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      animateResults.value = true;
    }, 300);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.poll-container {
  max-width: 42rem;
  margin: 0 auto;
  padding: 2.5rem;
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.poll-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.poll-question {
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: 700;
  color: #1f2937;
}

.thanks-message {
  color: #10b981;
  font-weight: 600;
  margin-top: 1rem;
  font-size: 1.125rem;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.option-wrapper {
  position: relative;
}

.option-button {
  width: 100%;
  padding: 1.25rem;
  text-align: left;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.option-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #6366f1;
}

.option-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
}

.option-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #6366f1;
}

.result-bar {
  height: 3.5rem;
  background-color: #f3f4f6;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.result-fill {
  height: 100%;
  background-color: #6366f1;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  transition: width 0.8s ease-out;
}

.result-fill.winner {
  background: linear-gradient(to right, #6366f1, #8b5cf6);
}

.percentage-text {
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trophy-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #fbbf24;
}

.check-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #86efac;
}

.total-votes {
  margin-top: 2rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.125rem;
}

.chart-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.options-enter-active,
.options-leave-active {
  transition: all 0.5s ease;
}

.options-enter-from,
.options-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive Design */
@media (max-width: 640px) {
  .poll-question {
    font-size: 1.5rem;
  }

  .option-text {
    font-size: 1rem;
  }

  .result-bar {
    height: 3rem;
  }

  .thanks-message {
    font-size: 1rem;
  }

  .total-votes {
    font-size: 1rem;
  }
}

.poll-container {
  perspective: 1000px;
}

.result-fill {
  position: relative;
  overflow: hidden;
}

.result-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.staggered-fade-move,
.staggered-fade-enter-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.staggered-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.vote-count {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-left: 0.5rem;
}

.reset-button {
  margin-left: 1rem;
  padding: 0.25rem 0.75rem;
  background: #6366f1;
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background: #8b5cf6;
  transform: translateY(-1px);
}

.result-fill.winner {
  background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  animation: gradient-shift 4s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.option-button {
  transition: 
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s ease,
    border-color 0.2s ease;
}

.percentage-text {
  animation: text-pop 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes text-pop {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>