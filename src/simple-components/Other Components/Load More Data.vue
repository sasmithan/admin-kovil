<template>
  <div
    v-if="itemsData.totalCount > 0 && itemsData.totalPages > 1"
    class="w-full col-span-12 lg:mb-2 mb-1"
  >
    <a @click="loadMoreData()" class="btn w-full shadow-md"> Load More Data </a>
  </div>
</template>
<script>
export default {
  name: "LoadMoreData",
  props: { itemsData: {}, loadMoreData: Function },
  created() {},
  methods: {},
};
</script>
