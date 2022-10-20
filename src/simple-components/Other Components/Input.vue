<template>
  <input
    v-model="inputData"
    type="text"
    class="intro-x login__input form-control py-3 px-4 block"
    placeholder="Username"
  />
</template>

<script>
export default {
  name: "Input",
  props: { inputData: null },
  created() {},
  methods: {
    checkValidation() {
      if (inputData == "") {
        console.log("null");
      } else {
        console.log("dada");
      }
    },
  },
  watch: {
    inputData() {
      val || this.checkValidation();
    },
  },
};
</script>
