<template>
  <header>
    <p>首頁/</p>
  </header>
  <section>
    <Search :busData="busData" />
    <div class="map"></div>
  </section>
</template>

<script>
import Search from "../components/Search.vue";
import getCityBus from "../composables/getCityBus";
export default {
  components: { Search },
  setup() {
    const { loadBus, busData } = getCityBus();
    loadBus();

    return { busData };
  },
};
</script>

<style>
</style>