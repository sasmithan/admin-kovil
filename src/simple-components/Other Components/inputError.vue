<template>
  <div @click="testMe" class="text-red-900">
  Required
    <!-- {{ errorMessgeFinal }} {{ errorMessge }} -->
  </div>
</template>

<script>
export default {
  name: "InputError",
  props: { errorMessge: "" },
  created() {},
  computed: {
    // errorMessgeFinal() {
    //   return errorMessge === "" ? "Required" : errorMessge;
    // },
  },
  methods: {
    testMe() {
      console.log(errorMessge, "afads");
    },
  },
  watch: {},
};
</script>
