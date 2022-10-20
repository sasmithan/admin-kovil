<template>
  <div>
    <img
      alt="Kovil"
      class="" 
      src="@/assets/images/kovil-home.jpg"
    />
 
    <img />
  </div>
</template>
<script>
import store from "@/store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Admin Dashboard");
  },
};
</script>
