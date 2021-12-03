<template>
  <header>
    <p>首頁/</p>
  </header>
  <div id="map"></div>
  <BusStop
    :busStopData="busStopData"
    @showGo="showGoBus"
    @showBack="showBackBus"
  />
</template>

<script>
import L from "leaflet";
import { useRoute } from "vue-router";
import { onMounted, ref } from "@vue/runtime-core";
import getCityBus from "../composables/getCityBus";
import BusStop from "../components/BusStop.vue";
import stopIconUrl from "../assets/stopicon.png";
import busUrl from "../assets/busicon.png";

export default {
  components: { BusStop },
  setup(props) {
    const {
      loadBusStop,
      busStopData,
      loadBusShape,
      loadBusTime,
      busShape,
      loadBusPosition,
      loadPlateNumb,
      goBusData,
      backBusData,
    } = getCityBus();
    const route = useRoute();

    onMounted(async () => {
      await loadBusStop(
        route.params.city,
        route.params.routeName,
        route.params.routeUID
      );
      await loadBusShape(
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
      await loadBusTime(
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
      let stopIcon = L.icon({
        iconUrl: stopIconUrl,
        iconSize: [36, 36], // size of the icon
      });

      const setStopMarker = () => {
        busStopData.value[0].Stops.forEach((stop) => {
          L.marker(
            [stop.StopPosition.PositionLat, stop.StopPosition.PositionLon],
            { icon: stopIcon }
          )
            .addTo(mymap)
            .bindPopup(stop.StopName.Zh_tw)
            .openPopup();
        });
      };
      setStopMarker();

      let busIcon = L.icon({
        iconUrl: busUrl,
        iconSize: [48, 48], // size of the icon
      });

      const setBusMarker = () => {
        goBusData.value.Stops.forEach((stop) => {
          if (stop.BusPosition) {
            L.marker(
              [stop.BusPosition.PositionLat, stop.BusPosition.PositionLon],
              { icon: busIcon }
            )
              .addTo(mymap)
              .bindPopup(stop.PlateNumb)
              .openPopup();
          }
        });
      };

      setBusMarker();

      const drawPolyLine = () => {
        // 建立一個 wkt 的實體
        const wicket = new Wkt.Wkt();
        const geojsonFeature = wicket.read(busShape.value[0].Geometry).toJson();

        const myStyle = {
          color: "#355F8B",
          weight: 5,
          opacity: 0.65,
        };
        const myLayer = L.geoJSON(geojsonFeature, {
          style: myStyle,
        }).addTo(mymap);

        myLayer.addData(geojsonFeature);
        // zoom the map to the layer
        mymap.fitBounds(myLayer.getBounds());
      };

      drawPolyLine();
    });

    const showGoBus = () => {
      console.log("showGo");
      // let busIcon = L.icon({
      //   iconUrl: busUrl,
      //   iconSize: [48, 48], // size of the icon
      // });
      // const setBusMarker = () => {
      //   goBusData.value.Stops.forEach((stop) => {
      //     if (stop.BusPosition) {
      //       L.marker(
      //         [stop.BusPosition.PositionLat, stop.BusPosition.PositionLon],
      //         { icon: busIcon }
      //       )
      //         .addTo(mymap)
      //         .bindPopup(stop.PlateNumb)
      //         .openPopup();
      //     }
      //     console.log(
      //       "🚀 ~ file: BusRoute.vue ~ line 162 ~ goBusData.value.Stops.forEach ~ mymap",
      //       mymap
      //     );
      //   });
      // };
      // setBusMarker();
    };

    const showBackBus = () => {
      console.log("showBack");
      // let busIcon = L.icon({
      //   iconUrl: busUrl,
      //   iconSize: [48, 48], // size of the icon
      // });
      // const setBusMarker = () => {
      //   backBusData.value.Stops.forEach((stop) => {
      //     if (stop.BusPosition) {
      //       L.marker(
      //         [stop.BusPosition.PositionLat, stop.BusPosition.PositionLon],
      //         { icon: busIcon }
      //       )
      //         .addTo(mymap)
      //         .bindPopup(stop.PlateNumb)
      //         .openPopup();
      //     }
      //   });
      // };
      // setBusMarker();
    };

    return {
      busStopData,
      goBusData,
      backBusData,
      showGoBus,
      showBackBus,
    };
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