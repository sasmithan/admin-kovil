<template>
  <button
    v-if="active"
    @click="buttonClick()"
    type="submit"
    class="btn btn-primary w-24"
  >
    {{ buttonName }}

    <SaveIcon v-if="!status" icon="oval" color="white" class="w-4 h-4 ml-2" />
    <LoadingIcon v-if="status" icon="oval" color="white" class="w-4 h-4 ml-2" />
  </button>
</template>
<script>
export default {
  props: { buttonName: "", active: Boolean, status: Boolean },

  name: "saveBtn",
  methods: {
    buttonClick() {
      this.$emit("parentMethod");
    },
  },
};
</script>
