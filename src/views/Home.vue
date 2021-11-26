<template>
  <div class="main">
    <section>
      <div class="background">
        <div class="content">
          <p>TAIWAN BUS+</p>
          <p>台灣公車動態</p>
          <p>時刻查詢系統</p>
        </div>
      </div>
    </section>
    <section>
      <CityMenu />
    </section>
  </div>
</template>

<script>
import getCityBus from "../composables/getCityBus";
import CityMenu from "../components/CityMenu";
export default {
  name: "Home",
  components: { CityMenu },
  setup() {
    const { loadBus } = getCityBus();
    loadBus();
  },
};
</script>

<style scoped>
.main {
  width: 100%;
  height: 90%;
}
.background {
  display: flex;
  align-items: center;
  height: 60vh;
  background-image: url("../assets/bg.png");
  background-size: cover;
}
.content {
  display: flex;
  align-items: flex-start;
  width: 100px;
}
.content > p {
  writing-mode: vertical-lr;
  position: relative;
  left: 165px;
  color: #ffffff;
  font-size: 26px;
  line-height: 35px;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  letter-spacing: 0.8rem;
  cursor: default;
}
</style>