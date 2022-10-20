<template>
  <a @Click="buttonClick()" class="flex items-center text-blue-900 mr-3" href="javascript:;">
    <Tippy tag="a" href="javascript:;" class="tooltip" :content="name">
    <InfoIcon class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1" />
    </Tippy>
  </a>
</template>
<script>
export default {
  props: { item: {}, name: "" },
  name: "InfoItem",
  methods: {
    buttonClick() {
      this.$emit("parentMethod", this.item);
    },
  },
};
</script>
