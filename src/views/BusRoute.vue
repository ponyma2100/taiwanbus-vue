<template>
  <header>
    <p>首頁/</p>
  </header>
  <div id="map"></div>
  <BusStop :busStopData="busStopData" />
</template>

<script>
import L from "leaflet";
import { useRoute } from "vue-router";
import { onMounted, ref } from "@vue/runtime-core";
import getCityBus from "../composables/getCityBus";
import BusStop from "../components/BusStop.vue";

export default {
  components: { BusStop },
  setup(props) {
    const { loadBusStop, busStopData } = getCityBus();
    const route = useRoute();

    onMounted(async () => {
      await loadBusStop(
        route.params.city,
        route.params.routeName,
        route.params.routeUID
      );
      let mymap;
      mymap = L.map("map").setView(
        [
          busStopData.value[0].Stops[0].StopPosition.PositionLat,
          busStopData.value[0].Stops[0].StopPosition.PositionLon,
        ],
        13
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

      const setMarker = () => {
        busStopData.value[0].Stops.forEach((stop) => {
          L.marker([
            stop.StopPosition.PositionLat,
            stop.StopPosition.PositionLon,
          ])
            .addTo(mymap)
            .bindPopup(stop.StopName.Zh_tw)
            .openPopup();
        });
      };
      setMarker();
    });

    return { busStopData };
  },
};
</script>

<style scoped>
#map {
  height: 87vh;
  z-index: 10;
}

.busstop {
  position: absolute;
  top: 120px;
  left: 0px;
}
</style>