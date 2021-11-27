<template>
  <div class="busstop">
    <div class="businfo">
      <div class="bus-name">
        <p>{{ $route.params.routeName }}</p>
      </div>
      <ul class="nav nav-pills">
        <li class="nav-item" @click="handleShowBus">
          <router-link class="nav-link active" to="#">去程{{}}</router-link>
        </li>
        <li class="nav-item" @click="handleShowBus">
          <router-link class="nav-link" to="#">返程{{}}</router-link>
        </li>
      </ul>
    </div>

    <ul class="list-group" v-show="toggleShowBus">
      <li
        class="list-group-item list-group-item-action"
        v-for="bus in goBus"
        :key="bus.RouteID"
      >
        <div class="direction-go" v-if="bus.Direction === 0">
          <li v-for="stop in bus.Stops" :key="stop.StopID">
            <p>{{ stop.StopName.Zh_tw }}</p>
          </li>
        </div>
      </li>
    </ul>
    <ul class="list-group" v-show="!toggleShowBus">
      <li
        class="list-group-item list-group-item-action"
        v-for="bus in backBus"
        :key="bus.RouteID"
      >
        <div class="direction-back" v-if="bus.Direction === 1">
          <li v-for="stop in bus.Stops" :key="stop.StopID">
            <p>{{ stop.StopName.Zh_tw }}</p>
          </li>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { useRoute } from "vue-router";
export default {
  props: ["busStopData"],
  setup(props) {
    const route = useRoute();
    const toggleShowBus = ref(true);

    const goBus = computed(() => {
      return props.busStopData.filter((bus) => bus.Direction === 0);
    });
    const backBus = computed(() => {
      return props.busStopData.filter((bus) => bus.Direction === 1);
    });

    const handleShowBus = () => {
      toggleShowBus.value = !toggleShowBus.value;
      console.log(
        "🚀 ~ file: BusStop.vue ~ line 60 ~ handleShowBus ~ toggleShowBus.value",
        toggleShowBus.value
      );
    };
    return { goBus, backBus, handleShowBus, toggleShowBus };
  },
};
</script>

<style scoped>
.busstop {
  width: 25vw;
  min-width: 300px;
  height: 87%;
  background: #ffffff;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.15);
  z-index: 999;
}
.search-bar {
  width: 20vw;
  min-width: 200px;
}

.bus-name {
  height: 10vh;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.bus-name p {
  font-weight: bold;
  font-size: 35px;
  line-height: 41px;
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
.nav-item {
  width: 50%;
}
.nav-link.active {
  width: 100%;
  height: 37px;

  background: #355f8b;
  border-radius: 5px 5px 0px 0px;
}

.nav-link {
  width: 100%;
  height: 37px;
  background: #e0e0e0;
  border-radius: 5px 5px 0px 0px;
}
</style>