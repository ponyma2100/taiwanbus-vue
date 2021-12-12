<template>
  <div id="map"></div>
  <BusStop
    :busStopData="busStopData"
    @showGo="showGoBus"
    @showBack="showBackBus"
    @showStop="showStopInfo"
    @update="updateMap"
  />
</template>

<script>
import L from "leaflet";
import { useRoute } from "vue-router";
import { onMounted } from "@vue/runtime-core";
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
    const myLayer = null;
    let mymap = {};

    let busIcon = L.icon({
      iconUrl: busUrl,
      iconSize: [48, 48], // size of the icon
    });
    let stopIcon = L.icon({
      iconUrl: stopIconUrl,
      iconSize: [36, 36], // size of the icon
    });

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

      // let mymap;
      mymap = L.map("map").setView(
        [
          busStopData.value[0].Stops[0].StopPosition.PositionLat,
          busStopData.value[0].Stops[0].StopPosition.PositionLon,
        ],
        13
      );
      // initialize map
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

      setStopMarker(goBusData);

      setBusMarker(goBusData);

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
      clearMarkers();
      setStopMarker(goBusData);
      setBusMarker(goBusData);
    };

    const showBackBus = () => {
      clearMarkers();
      setStopMarker(backBusData);
      setBusMarker(backBusData);
    };

    // Set stop marker to map
    const setStopMarker = (data) => {
      data.value.Stops.forEach((stop) => {
        const busTime = stop.EstimateTime;
        let popupContent = "";
        let popupOptions = {};

        if (stop.StopStatus === 0) {
          popupContent = `<span>${stop.StopSequence}-${stop.StopName.Zh_tw}</span><span>${busTime}</span>`;
        } else {
          popupContent = `<span>${stop.StopSequence}-${stop.StopName.Zh_tw}</span><span>${stop.StopStatus}</span>`;
        }

        if (
          stop.EstimateTime === "進站中" ||
          stop.EstimateTime === "即將進站"
        ) {
          popupOptions = {
            maxWidth: "500",
            className: "stop-popup-ongoing",
          };
        } else {
          popupOptions = {
            maxWidth: "500",
            className: "stop-popup",
          };
        }

        L.marker(
          [stop.StopPosition.PositionLat, stop.StopPosition.PositionLon],
          { icon: stopIcon }
        )
          .addTo(mymap)
          .bindPopup(popupContent, popupOptions)
          .openPopup();
      });
    };

    // Set bus marker to map
    const setBusMarker = (data) => {
      data.value.Stops.forEach((stop) => {
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

    const clearMarkers = () => {
      mymap.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mymap.removeLayer(layer);
        }
      });
    };

    const showStopInfo = (payload) => {
      if (payload.busStatus === 0) {
        goBusData.value.Stops.filter((stop) => {
          if (stop.StopUID === payload.id) {
            if (
              stop.EstimateTime === "進站中" ||
              stop.EstimateTime === "即將進站"
            ) {
              activePopup(stop, "custom-popup-ongoing");
            } else activePopup(stop, "custom-popup");
          }
        });
      } else {
        backBusData.value.Stops.filter((stop) => {
          if (stop.StopUID === payload.id) {
            if (
              stop.EstimateTime === "進站中" ||
              stop.EstimateTime === "即將進站"
            ) {
              activePopup(stop, "custom-popup-ongoing");
            } else activePopup(stop, "custom-popup");
          }
        });
      }
    };

    const activePopup = (data, classname) => {
      const busTime = data.EstimateTime;
      // const busTime = ` ${Math.floor(data.EstimateTime / 60)}分`;

      let popupContent = "";

      if (data.StopStatus === 0) {
        popupContent = `<span>${data.StopSequence}-${data.StopName.Zh_tw}</span><span>${busTime}</span>`;
      } else {
        popupContent = `<span>${data.StopSequence}-${data.StopName.Zh_tw}</span><span>${data.StopStatus}</span>`;
      }

      mymap.setView(
        [data.StopPosition.PositionLat, data.StopPosition.PositionLon],
        20
      );
      L.popup({
        closeButton: true,
        autoClose: true,
        className: classname,
      })
        .setLatLng([
          data.StopPosition.PositionLat,
          data.StopPosition.PositionLon,
        ])
        .setContent(popupContent)
        .openOn(mymap);
    };

    const updateMap = async (busStatus) => {
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
      clearMarkers();
      if (busStatus === "go") {
        setStopMarker(goBusData);
        setBusMarker(goBusData);
      } else {
        setStopMarker(backBusData);
        setBusMarker(backBusData);
      }
    };
    return {
      busStopData,
      goBusData,
      backBusData,
      showGoBus,
      showBackBus,
      showStopInfo,
      updateMap,
    };
  },
};
</script>

<style>
#map {
  height: 87vh;
  z-index: 10;
}

.busstop {
  position: fixed;
  top: 120px;
  left: 0px;
  height: 85vh;
}

.custom-popup .leaflet-popup-content-wrapper,
.stop-popup .leaflet-popup-content-wrapper {
  background: #355f8b;
  border: 2px solid #ffffff;
}
.custom-popup-ongoing .leaflet-popup-content-wrapper,
.stop-popup-ongoing .leaflet-popup-content-wrapper {
  background: #d08181;
  border: 2px solid #ffffff;
}

.custom-popup .leaflet-popup-content,
.custom-popup-ongoing .leaflet-popup-content,
.stop-popup .leaflet-popup-content,
.stop-popup-ongoing .leaflet-popup-content {
  display: flex;
  flex-direction: column;
  margin: 5px 10px;
  text-align: center;
}
.custom-popup .leaflet-popup-content span,
.custom-popup-ongoing .leaflet-popup-content span,
.stop-popup .leaflet-popup-content span,
.stop-popup-ongoing .leaflet-popup-content span {
  color: #ffffff;
}
</style>