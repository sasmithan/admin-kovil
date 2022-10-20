 
<template>
  <a
    href="javascript:;"
    @click="buttonClick()"
    class="mr-2  btn bg-white  text-xs lg:text-sm lg:mt-0 md:mt-0 uppercase"
  >
      Archives
    
    <span class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center">
      <ArchiveIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
    </span>
  </a> 
</template>

<script>
export default {
  props: { buttonName: "" },
  name: "ViewArchiveItem",
  methods: {
    buttonClick() {
      this.$emit("parentMethod");
    },
  },
};
</script>
