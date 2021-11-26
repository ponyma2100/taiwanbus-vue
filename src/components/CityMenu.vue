<template>
  <div class="citymenu">
    <div class="citybtn" v-for="city in cityName" :key="city.CityID">
      <router-link :to="{ name: 'CityBus', params: { city: city.City } }">
        <button class="btn">
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
    console.log(cityName);
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
  height: 174px;
  width: 217px;
  margin: 20px 20px;
}
</style>