<template>
  <div class="w-full sm:w-auto mr-2 mt-1">
    <div class="relative text-slate-500 border-2 border-primary rounded-md">
      <input
        type="text"
        class="form-control box pr-10 lg:h-10 h-8"
        placeholder="Search..."
        v-model="searchData"
        @change="searchOnchange"
      />
      <SearchIcon
        @click="searchItem"
        v-if="!searchActive"
        class=" lg:w-6 lg:h-6 w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
      />
      <XIcon
        @click="clearSearch"
        v-if="searchActive"
        class="lg:w-6 lg:h-6 w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: { searchActive: false },
  name: "SearchBar",
  data: () => ({
    searchData: "",
  }),
  methods: {
    searchOnchange() {
      let result = this.searchData.trim();
      console.log(result);
      this.$emit("searchOnchange", result);
    
    },
    searchItem() {
      this.$emit("searchItem");
    },
    clearSearch() {
      this.searchData = "";
      this.$emit("clearSearch");
    },
  },
};
</script>
