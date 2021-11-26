<template>
  <header>
    <p>首頁/</p>
  </header>
  <div id="map"></div>
  <Search :busData="busData" />
</template>

<script>
import L from "leaflet";
import Search from "../components/Search.vue";
import getCityBus from "../composables/getCityBus";
import { onMounted } from "@vue/runtime-core";
export default {
  components: { Search },
  setup() {
    const { loadBus, busData } = getCityBus();
    loadBus();

    onMounted(() => {
      let mymap;
      mymap = L.map("map").setView([25.03, 121.56], 13);
      console.log(
        "🚀 ~ file: CityBus.vue ~ line 25 ~ onMounted ~ mymap",
        mymap
      );

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

    return { busData };
  },
};
</script>

<style scoped>
#map {
  height: 87vh;
  z-index: 10;
}

.search {
  position: absolute;
  top: 120px;
  left: 0px;
}
</style>