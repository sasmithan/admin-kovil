<template>
  <a
    class="flex items-center text-danger"
    href="javascript:;"
    @click="buttonClick()"
  >
    <Tippy tag="a" href="javascript:;" class="tooltip" :content="name">
      <Trash2Icon class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1" />
    </Tippy>
  </a>
</template>
<script>
export default {
 props: { item: {} , name:""},
  name: "ArchiveItem",
  methods: {
    buttonClick() {
      this.$emit("parentMethod", this.item);
    },
  },
};
</script>
