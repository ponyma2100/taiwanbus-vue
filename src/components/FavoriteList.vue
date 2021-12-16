<template>
  <div class="favorite">
    <ul class="list-group" v-if="favBusRoutes">
      <li
        class="list-group-item list-group-item-action"
        v-for="bus in favBusRoutes"
        :key="bus.RouteUID"
      >
        <router-link
          :to="{
            path: `/citybus/${bus.city}/${bus.RouteName}&${bus.RouteUID}`,
          }"
        >
          <p>{{ bus.RouteName }}</p>
        </router-link>
        <div class="bus-fav">
          <div class="addfav">
            <div v-show="!bus.isFav">
              <img src="../assets/favorite.png" alt="" />
            </div>
          </div>
          <div class="removefav" @click="removeFav(bus.RouteUID)">
            <div v-show="bus.isFav">
              <img src="../assets/favoritesaved.png" alt="" />
            </div>
          </div>
          <span>{{ bus.city }}</span>
        </div>
      </li>
      <div class="message" v-show="!favBusRoutes.length">
        <div class="logo">
          <img src="../assets/logo2.png" alt="" />
        </div>
        <h5>尚無收藏站點</h5>
        <router-link :to="{ name: 'Home' }"><p>返回首頁</p></router-link>
      </div>
    </ul>
  </div>
</template>

<script>
import { ref, watchEffect } from "@vue/runtime-core";

export default {
  setup() {
    let favBusRoutes = ref([]);
    favBusRoutes.value = JSON.parse(localStorage.getItem("favBusRoute"));

    watchEffect(() => {
      localStorage.setItem("favBusRoute", JSON.stringify(favBusRoutes.value));
    });

    const removeFav = (id) => {
      const removeIndex = favBusRoutes.value.findIndex(
        (bus) => bus.RouteUID === id
      );

      if (removeIndex === -1) return;
      favBusRoutes.value.splice(removeIndex, 1);

      localStorage.removeItem("favBusRoute");
      localStorage.setItem("favBusRoute", JSON.stringify(favBusRoutes.value));
    };

    return { favBusRoutes, removeFav };
  },
};
</script>

<style scoped>
.bus-fav {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 10%;
  padding: 0 10px;
  cursor: pointer;
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
  min-width: 300px;
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
  height: 110%;
  display: flex;
  justify-content: space-between;
}
.favorite {
  position: relative;
}
.logo {
  position: absolute;
  top: 40px;
}
.message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
  color: #888888;
}
.message a {
  position: absolute;
  top: 260px;
}
</style>