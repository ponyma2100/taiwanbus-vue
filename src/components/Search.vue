<template>
  <div class="search">
    <form>
      <label for="exampleDataList">搜尋路線</label>
      <div class="search-bar">
        <input
          class="form-control"
          id="exampleDataList"
          placeholder="請輸入公車路線"
          v-model="searchBus"
        />
        <div class="clearbtn" @click="handleClear">
          <img src="../assets/delete.png" alt="" />
        </div>
      </div>
    </form>

    <ul v-show="searchBus" class="list-group">
      <li
        class="list-group-item list-group-item-action"
        v-for="bus in matchingBus"
        :key="bus"
        @click="handleClickSearch(matchingBus)"
      >
        <router-link
          :to="{
            name: 'BusRoute',
            params: { routeName: bus.RouteName.Zh_tw, routeUID: bus.RouteUID },
          }"
        >
          <p>{{ bus.RouteName.Zh_tw }}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
export default {
  props: ["busData"],
  setup(props, { emit }) {
    const searchBus = ref("");

    const matchingBus = computed(() => {
      return props.busData.filter((bus) =>
        bus.RouteName.Zh_tw.includes(searchBus.value)
      );
    });

    const handleClear = () => {
      searchBus.value = "";
    };

    const handleClickSearch = (matchingBus) => {
      emit("getRouteName", matchingBus);
    };

    return { searchBus, matchingBus, handleClear, handleClickSearch };
  },
};
</script>

<style scoped>
.search {
  width: 25vw;
  height: 85vh;
  min-width: 300px;
  height: 87%;
  background: #ffffff;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.15);
  z-index: 999;
  position: absolute;
  top: 60px;
}
.search-bar {
  width: 18vw;
  min-width: 200px;
  position: relative;
}
.clearbtn {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

.match {
  width: 464px;
}
.list-group {
  overflow-y: scroll;
  max-height: 60vh;
}
.list-group .list-group-item {
  font-weight: bold;
  font-size: 20px;
}
.list-group .list-group-item p {
  margin-left: 10px;
}

.list-group .list-group-item:hover {
  cursor: pointer;
}
</style>