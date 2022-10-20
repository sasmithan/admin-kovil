<template>
  <div
    v-if="itemsData.totalCount > 0"
    class="intro-y bg-primary lg:flex lg:flex-row lg:flex-wrap lg:items-center md:flex md:flex-row md:flex-wrap md:items-center flex flex-col items-center justify-center p-2"
  
  >
    <div
      class="w-full sm:w-auto sm:mr-auto bg-slate-200"
    
    >
      <paginate
        class="text-white"
        :page-count="pageCount"
        :page-range="5"
        :margin-pages="2"
        :click-handler="changePage"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :first-last-button="true"
        :initial-page="1"
        :prev-text="'<'"
        :next-text="'>'"
        :first-button-text="'<<'"
        :last-button-text="'>>'"
      >
      </paginate>
    </div>
    <div class="mr-2 text-white">Page Rows :</div>
    <select
      v-model="pageSize"
      class="w-20 form-select box cursor-pointer rounded-none"
      @change="pageSizeChange"
    >
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="15">15</option>
      <option value="20">20</option>
      <option value="25">25</option>
      <option value="30">30</option>
      <option value="40">40</option>
      <option value="50">50</option>
      <option value="100">100</option>
      <option :value="pageSize">{{ pageSize }}</option>
    </select>
  </div>
</template>
<script>
import Paginate from "vuejs-paginate-next";

export default {
  props: { itemsData: {}, pageSize: 0, pageCount: 0 },
  name: "SearchBar",
  components: {
    paginate: Paginate,
  },
  data: () => ({
    pageCount: 0,
  }),
  methods: {
    changePage(pageNum) {
      this.$emit("changePage", pageNum);
    },
    pageSizeChange() {
      this.$emit("pageSizeChange", this.pageSize);
    },
  },
};
</script>
