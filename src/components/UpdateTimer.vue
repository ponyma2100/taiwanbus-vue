<template>
  <div class="timer">
    <div class="progress-container">
      <div class="progress" :style="{ width: `${width}%` }"></div>
    </div>
    <div class="showtimer">
      <div class="timer-info">
        <span>{{ display }}秒後更新</span>
      </div>
      <div class="timer-btn" @click="handleUpdate()">
        <img src="../assets/refresh.png" alt="refresh" />
        <button>立即更新</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import {
  onMounted,
  onUnmounted,
  onUpdated,
  watch,
  watchEffect,
} from "@vue/runtime-core";
export default {
  props: ["busStatus", "toggleShowBus"],
  setup(props, { emit }) {
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
      emit("update", props.busStatus);
      clearInterval(countdownActive);
      startTimer();
      clearInterval(progressActive);
      setProgress();
    };

    const startTimer = () => {
      const second = 1000;
      const now = Date.now();
      const countdownValue = now + 30 * second;
      display.value = 30;

      countdownActive = setInterval(() => {
        const remaining = Math.round((countdownValue - Date.now()) / 1000);
        if (remaining < 0) {
          clearInterval(countdownActive);
          startTimer();
          clearInterval(progressActive);
          setProgress();
          emit("update", props.busStatus);
        } else {
          display.value = remaining;
        }
      }, 1000);
    };

    const setProgress = () => {
      width.value = 0;
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
    onUnmounted(() => {
      console.log("unmounted");
      clearInterval(countdownActive);
      clearInterval(progressActive);
    });

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
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background: white;
  padding: 10px;
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