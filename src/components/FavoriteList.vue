<template>
  <div class="favorite">
    <ul class="list-group">
      <li
        class="list-group-item list-group-item-action"
        v-for="bus in favBusRoute"
        :key="bus.RouteUID"
      >
        <router-link
          :to="{
            path: `/citybus/${bus.city}/${bus.RouteName}&${bus.RouteUID}`,
          }"
        >
          <p>{{ bus.RouteName }}</p>
          <div class="bus-fav">
            <div class="addfav" @click="addFav($route.params.routeUID)">
              <div v-show="!bus.isFav">
                <img src="../assets/favorite.png" alt="" />
              </div>
            </div>
            <div class="removefav" @click="removeFav($route.params.routeUID)">
              <div v-show="bus.isFav">
                <img src="../assets/favoritesaved.png" alt="" />
              </div>
            </div>
            <span>{{ bus.city }}</span>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import getCityBus from "../composables/getCityBus";

export default {
  setup() {
    const { goBusData } = getCityBus();

    const favBusRoute = JSON.parse(localStorage.getItem("favBusRoute"));
    console.log(
      "🚀 ~ file: FavoriteList.vue ~ line 19 ~ setup ~ favBus",
      favBusRoute
    );

    return { favBusRoute };
  },
};
</script>

<style scoped>
.bus-fav {
  width: 20%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bus-fav span {
  font-size: 14px;
  line-height: 19px;
  color: #888888;
}

.list-group {
  overflow-y: scroll;
  height: 80vh;
  max-height: 80vh;
  margin-right: 10px;
  width: 50vw;
  padding: 20px 50px;
  background: #ffffff;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0px 0px 5px 5px;
}
.list-group .list-group-item {
  display: flex;
  font-weight: bold;
  font-size: 20px;
}
.list-group .list-group-item p {
  margin-left: 5px;
}

.list-group .list-group-item a {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>