<template>
  <Loading
    opacity="0.5"
    background-color="white"
    :can-cancel="false"
    v-model:active="isLoading"
    color="#164e63"
    loader="dots"
    :width="50"
    :height="50"
    z-index="100000"
  />
</template>
<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "LoadingScreen",
  components: {
    Loading,
  },
  props: { isLoading: Boolean },
};
</script>
