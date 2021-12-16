<template>
  <div class="citymenu">
    <div class="citybtn" v-for="city in cityName" :key="city.CityID">
      <router-link :to="{ name: 'CityBus', params: { city: city.City } }">
        <button class="btn" :class="city.City">
          {{ city.CityName }}
          <p>{{ city.City }}</p>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
import cityName from "../data/cityName";

export default {
  setup() {
    return { cityName };
  },
};
</script>

<style>
.citymenu {
  display: flex;
  padding: 30px;
  overflow-x: scroll;
  white-space: nowrap;
}
.btn {
  height: 18vh;
  width: 217px;
  margin: 20px 20px;
}
.btn.NewTaipei {
  color: #52797c;
}

.btn.Taoyuan {
  color: #3591c5;
}
.btn.Taoyuan {
  color: #3591c5;
}
.btn.Taichung {
  color: #d08181;
}
.btn.Tainan {
  color: #7fc0c5;
}
</style>