<template>
  <div class="busstop">
    <div class="goback">
      <button @click="handleClick">&lt;返回搜尋</button>
    </div>
    <div class="businfo">
      <div class="bus-name">
        <p>{{ $route.params.routeName }}</p>
      </div>
      <ul class="nav nav-pills">
        <li class="nav-item" @click="handleShowGo">
          <router-link class="nav-link active" to="#">去程{{}}</router-link>
          <!-- busStopData[0].Stops[0].StopName.Zh_tw -->
        </li>
        <li class="nav-item" @click="handleShowBack">
          <router-link class="nav-link" to="#">返程{{}}</router-link>
        </li>
      </ul>
    </div>

    <ul class="list-group" v-show="toggleShowBus">
      <li
        class="list-group-item list-group-item-action"
        v-for="stop in goBusData.Stops"
        :key="stop.StopUID"
      >
        <div class="stop-info">
          <div class="stop-estimatetime">
            <p class="status" v-show="stop.StopStatus !== 0">
              {{ stop.StopStatus }}
            </p>
            <p class="estimatetime" v-if="stop.StopStatus === 0">
              {{ Math.floor(stop.EstimateTime / 60) }}分
            </p>
          </div>
          <div class="stop-name">
            <p>{{ stop.StopName.Zh_tw }}</p>
          </div>
          <div class="stop-busnumb">
            {{ stop.PlateNumb }}
          </div>
        </div>
      </li>
    </ul>
    <ul class="list-group" v-show="!toggleShowBus">
      <li
        class="list-group-item list-group-item-action"
        v-for="stop in backBusData.Stops"
        :key="stop.StopUID"
      >
        <div class="stop-info">
          <div class="stop-estimatetime">
            <p class="status" v-show="stop.StopStatus !== 0">
              {{ stop.StopStatus }}
            </p>
            <p class="estimatetime" v-if="stop.StopStatus === 0">
              {{ Math.floor(stop.EstimateTime / 60) }}分
            </p>
          </div>
          <div class="stop-name">
            <p>{{ stop.StopName.Zh_tw }}</p>
          </div>
          <div class="stop-busnumb">
            {{ stop.PlateNumb }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import getCityBus from "../composables/getCityBus";
import { onMounted } from "@vue/runtime-core";

export default {
  setup(props, { emit }) {
    const {
      loadBusStop,
      loadBusTime,
      goBusData,
      backBusData,
      loadPlateNumb,
      loadBusPosition,
    } = getCityBus();
    const router = useRouter();
    const route = useRoute();
    const toggleShowBus = ref(true);

    const handleShowGo = () => {
      toggleShowBus.value = true;
      emit("showGo");
    };
    const handleShowBack = () => {
      toggleShowBus.value = false;
      emit("showBack");
    };

    onMounted(async () => {
      await loadBusStop(
        route.params.city,
        route.params.routeName,
        route.params.routeUID
      );
      await loadBusTime(
        route.params.city,
        route.params.routeName,
        route.params.routeUID
      );
      await loadPlateNumb(
        route.params.city,
        route.params.routeName,
        route.params.routeUID
      );
      await loadBusPosition(
        route.params.city,
        route.params.routeName,
        route.params.routeUID
      );
    });

    const handleClick = () => {
      router.push({ name: "CityBus", params: { city: route.params.city } });
    };

    return {
      handleShowGo,
      handleShowBack,
      toggleShowBus,
      handleClick,
      goBusData,
      backBusData,
    };
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
.stop-info {
  display: flex;
  font-size: 16px;
  width: 100%;
  justify-content: space-between;
}
.stop-estimatetime {
  width: 77px;
  height: 26px;
  background: #355f8b;
  border-radius: 10px;
}

.stop-estimatetime > .estimatetime,
.status {
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
}
.stop-estimatetime > .status {
  font-size: 12px;
}
.stop-busnumb {
  margin-left: auto;
  font-size: 14px;
  color: #d08181;
}
</style>