<template>
  <div class="navbar">
    <nav>
      <div class="logo">
        <router-link to="/"
          ><img src="../assets/logo.png" alt=""
        /></router-link>
      </div>
      <div class="links">
        <router-link :to="{ name: 'Home' }">站點查詢</router-link>
        <router-link :to="{ name: 'Home' }">路線規劃</router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
nav {
  display: flex;
  align-items: center;
  padding: 20px;
  width: 100%;
  margin: 0 auto;
}
.navbar {
  height: 80px;
  border: 1px solid black;
}

/* a.router-link-active {
  color: #ffffff;
  border-radius: 4px;
} */
.links {
  display: flex;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
}
nav a {
  padding: 5px;
  margin-right: 50px;
}
</style>