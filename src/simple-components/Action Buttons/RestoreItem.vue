<template>
  <a @Click="buttonClick()"  class="flex items-center mr-3 text-blue-900" href="javascript:;">
    <Tippy tag="a" href="javascript:;" class="tooltip" :content="name"
      ><RotateCcwIcon class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1" />
    </Tippy>
  </a>
</template>
<script>
export default {
  props: { item: {}, name: "" },
  name: "RestoreItem",
  methods: {
    buttonClick() {
      this.$emit("parentMethod", this.item);
    },
  },
};
</script>
