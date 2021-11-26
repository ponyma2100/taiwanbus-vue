<template>
  <div class="search">
    <form class="search-bar">
      <label for="exampleDataList">搜尋路線</label>
      <input
        class="form-control"
        id="exampleDataList"
        placeholder="輸入公車路線 / 起迄方向名或關鍵字..."
        v-model="searchBus"
      />
      <div class="clearbtn" @click="handleClear">
        <img src="../assets/delete.png" alt="" />
      </div>
    </form>

    <ul v-show="searchBus" class="list-group">
      <li
        class="list-group-item list-group-item-action"
        v-for="bus in matchingBus"
        :key="bus"
      >
        <p>{{ bus.RouteName.Zh_tw }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
export default {
  props: ["busData"],
  setup(props) {
    const searchBus = ref("");

    const matchingBus = computed(() => {
      return props.busData.filter((bus) =>
        bus.RouteName.Zh_tw.includes(searchBus.value)
      );
    });

    const handleClear = () => {
      searchBus.value = "";
    };

    return { searchBus, matchingBus, handleClear };
  },
};
</script>

<style scoped>
.search {
  width: 464px;
  height: 750px;
  background: #ffffff;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.15);
}
.search-bar {
  border: none;
}
.clearbtn {
  width: 50px;
  position: relative;
  top: -33px;
  left: 320px;
  cursor: pointer;
}

.match {
  width: 464px;
}
.list-group {
  overflow-y: scroll;
  height: 600px;
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