<template>
  <Tippy
   tag="a"
   href="javascript:;"
   class="tooltip"
   content="Add New Item"
 >
 <a
   href="javascript:;"
   @click="buttonClick()"
   class="mr-2 btn btn-primary shadow-md text-xs  mt-1"

    
 >
   {{ buttonName }}
   <span class="ml-2">
     <PlusIcon  class="lg:w-6 lg:h-6 w-4 h-4 ml-2 mr-2 " />
   </span>
 </a> </Tippy>
</template>
<script>
export default {
 props: { buttonName: "" },
 name: "AddItem",
 methods: {
   buttonClick() {
     this.$emit("parentMethod");
   },
 },
};
</script>
