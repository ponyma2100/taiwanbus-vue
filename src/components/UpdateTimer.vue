<template>
  <div class="timer">
    <div class="progress-container">
      <div class="progress" :style="{ width: `${width}%` }"></div>
    </div>
    <div class="showtimer">
      <div class="timer-info">
        <span>{{ display }}秒後更新</span>
      </div>
      <div class="timer-btn" @click="handleUpdate">
        <img src="../assets/refresh.png" alt="refresh" />
        <button>立即更新</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  setup() {
    const display = ref("");
    const width = ref(0);
    const perSec = ref(0);
    let countdownActive;
    let progressActive;
    onMounted(() => {
      startTimer();
      setProgress();
    });

    const handleUpdate = () => {
      console.log("update");
      clearInterval(countdownActive);
      startTimer();
    };

    const startTimer = () => {
      const second = 1000;
      const now = Date.now();
      const countdownValue = now + 30 * second;

      countdownActive = setInterval(() => {
        const remaining = Math.round((countdownValue - Date.now()) / 1000);
        if (remaining < 0) {
          clearInterval(countdownActive);
          startTimer();
          setProgress();
        } else {
          display.value = remaining;
        }
      }, 1000);
    };

    const setProgress = () => {
      perSec.value = 100 / 30;

      progressActive = setInterval(() => {
        if (width.value >= 100) {
          clearInterval(progressActive);
          width.value = 0;
        } else {
          width.value += perSec.value;
        }
      }, 1000);
    };

    return { handleUpdate, display, setProgress, width };
  },
};
</script>

<style scoped>
.timer {
  height: 60px;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.showtimer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.progress-container {
  background-color: rgba(0, 0, 0, 0.1);
  height: 0.4rem;
  max-width: 600px;
  width: 98%;
}

.progress {
  height: 0.4rem;
  background-color: #355f8b;
  transition: width 0.1s ease;
}
</style>