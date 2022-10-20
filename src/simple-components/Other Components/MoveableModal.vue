<template>
  <TransparentModal
    :show="show"
    :size="size"
    :backdrop="backdrop"
    :slideOver="slideOver"
    :refKey="refKey"
  >
    <div
      ref="movable-container"
      style="position: absolute; background: white; border-radius: 7.5px"
    >
      <div
        class="modal-header flex items-center justify-between"
        @mousedown="dragMouseDown"
      >
        <h2 class="font-medium text-base mr-auto">
          {{ title }}
        </h2>

        <div class="p-2">
          <XCircleIcon
            class="
              text-danger
              float-right
              lg:w-8 lg:h-8
              md:w-7 md:h-7
              w-6
              h-6
              cursor-pointer
            "
            @click="close"
          />
        </div>
      </div>
      <slot />
    </div>
  </TransparentModal>
</template>
<script>
export default {
  name: "MoveableModal",
  props: {
    title: {},
    show: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "",
    },
    backdrop: {
      type: String,
      default: "",
    },
    slideOver: {
      type: Boolean,
      default: false,
    },
    refKey: {
      type: String,
      default: null,
    },
  },
  data: () => ({ pointer: {} }),
  methods: {
    close() {
      this.$emit("close");
    },
    dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();

      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;

      document.onmouseup = this.closeDragElement;
      document.onmousemove = this.elementDrag;
    },

    elementDrag(e) {
      e = e || window.event;
      e.preventDefault();

      let x = e.clientX - this.pointer.x;
      let y = e.clientY - this.pointer.y;

      let elmt = this.$refs["movable-container"];
      elmt.style.transform = `translate(${x}px, ${y}px)`;
    },

    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    },
  },
};
</script>