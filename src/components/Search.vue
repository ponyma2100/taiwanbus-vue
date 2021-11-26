<template>
  <div class="search">
    <form>
      <label for="exampleDataList">搜尋路線</label>
      <div class="search-bar">
        <input
          class="form-control"
          id="exampleDataList"
          placeholder="輸入公車路線 / 起迄方向名或關鍵字..."
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
  width: 25vw;
  height: 87%;
  background: #ffffff;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.15);
  z-index: 999;
}
.search-bar {
  width: 20vw;
}
.clearbtn {
  position: absolute;
  top: 59px;
  right: 60px;
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