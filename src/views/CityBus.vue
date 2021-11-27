<template>
  <header>
    <p>首頁/</p>
  </header>
  <div id="map"></div>
  <Search
    v-show="!toggleSearchResult"
    :busData="busData"
    @getRouteName="getBusStop"
  />
  <!-- <BusStop v-show="toggleSearchResult" /> -->
</template>

<script>
import L from "leaflet";
import getCityBus from "../composables/getCityBus";
import { useRoute } from "vue-router";
import { onMounted, ref } from "@vue/runtime-core";
import Search from "../components/Search.vue";
// import BusStop from "../components/BusStop.vue";

export default {
  components: { Search },
  setup(props) {
    const { loadBus, busData, loadBusStop, busStopData } = getCityBus();
    const route = useRoute();
    const toggleSearchResult = ref(false);

    loadBus();

    onMounted(() => {
      let mymap;
      mymap = L.map("map").setView([25.03, 121.56], 13);

      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken:
            "pk.eyJ1IjoicG9ueWF3ZXNvbWUiLCJhIjoiY2tscWd3djhwMHVwODJvcHM2dTJxcXByciJ9.EMsPVi7a-UV29InwyJ5m4g",
        }
      ).addTo(mymap);
    });

    // const getBusStop = (matchingBus) => {
    //   console.log(
    //     "🚀 ~ file: CityBus.vue ~ line 55 ~ getBusStop ~ matchingBus[0].RouteID",
    //     matchingBus
    //   );

    //   loadBusStop(
    //     route.params.city,
    //     matchingBus[0].RouteName.Zh_tw,
    //     matchingBus[0].RouteID
    //   );
    // };

    return { busData };
  },
};
</script>

<style scoped>
#map {
  height: 87vh;
  z-index: 10;
}

.search,
.busstop {
  position: absolute;
  top: 120px;
  left: 0px;
}
</style>