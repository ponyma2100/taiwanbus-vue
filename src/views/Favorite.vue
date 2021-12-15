<template>
  <FavoriteList />
</template>

<script>
import FavoriteList from "../components/FavoriteList.vue";
export default {
  components: { FavoriteList },
};
</script>

<style scoped>
.favorite {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 50px;
}
</style>