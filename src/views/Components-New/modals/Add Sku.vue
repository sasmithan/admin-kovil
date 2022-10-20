<template>
  <Modal
    :show="addSku"
    @hidden="addSku = false"
    backdrop="static"
    size="modal-lg"
  >
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">{{ formTitle }}</h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-3 lg:gap-4 md:gap-4 gap-2">
      <div class="w-full">
        <label for="regular-form-1" class="form-label">PLU/SKU</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataSku.skuName"
            type="text"
            class="form-control"
            name="skuName"
            placeholder="PLU/SKU"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">BARCODE/EAN</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataSku.ean"
            type="text"
            class="form-control"
            name="ean"
            placeholder="BARCODE/EAN"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Product</label>

        <TomSelect
          v-model="formDataSku.productId"
          :options="{
            placeholder: 'Search...',
            allowEmptyOption: true,
          }"
          class="w-full"
        >
          <option v-if="titleChange != -1">
            {{ formDataSku.name }}
          </option>

          <option v-if="titleChange == -1">SELECT</option>

          <option
            :value="item.productId"
            v-for="(item, i) in productList"
            :key="i"
          >
            {{ item.name }}
          </option>
        </TomSelect>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Price</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataSku.price"
            type="text"
            class="form-control"
            name="price"
            placeholder="Price"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">VAT Percentage</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataSku.vatPercentage"
            type="text"
            class="form-control"
            name="vatPercentage"
            placeholder="VAT Percentage"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Minimum Margin</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataSku.minMargin"
            type="number"
            class="form-control"
            name="minMargin"
            placeholder="Minimum Margin"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Temperature</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataSku.temperature"
            type="text"
            class="form-control"
            placeholder="Temperature"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Dimension</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataSku.dimension"
            type="text"
            class="form-control"
            placeholder="Dimension"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Weight</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataSku.weight"
            type="text"
            class="form-control"
            placeholder="Weight"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Department</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataSku.department"
            type="text"
            class="form-control"
            placeholder="Department"
          />
        </div>
      </div>

      <div class="w-full col-span-2">
        <label for="regular-form-1" class="form-label">Description</label>

        <div class="flex flex-col space-y-1">
          <textarea
            id="vertical-form-1"
            v-model="formDataSku.description"
            type="text"
            class="form-control h-10"
            name="BrandDescription"
            placeholder="Type here about brand..."
          ></textarea>
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Discount</label>

        <div class="flex flex-col space-y-1">
          <div class="form-switch ml-3">
            <input
              type="checkbox"
              v-model="formDataSku.isDiscount"
              class="form-check-input"
            />
          </div>
        </div>
      </div>

      <div class="w-full" v-if="formDataSku.isDiscount">
        <label for="regular-form-1" class="form-label">Discounted Price</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataSku.discountedPrice"
            type="text"
            class="form-control"
            name="discountedPrice"
            placeholder="Discounted Price"
          />
        </div>
      </div>

      <div class="w-full" v-if="formDataSku.isDiscount">
        <label for="regular-form-1" class="form-label">Discount Reason</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataSku.discountReason"
            type="text"
            class="form-control"
            name="discountReason"
            placeholder="Discount Reason"
          />
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="closeForm()"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        Cancel
      </button>
      <button @click="saveForm()" type="submit" class="btn btn-primary w-24">
        Done
      </button>
    </ModalFooter>
  </Modal>
</template>

<script>
export default {
  props: { productList: [], addSku: false },

  data() {
    return {
      // addSku: false,
      formDataSku: {
        skuName: "",
        ean: "",
        description: "",
        productId: "",
        price: "",
        vatPercentage: "",
        isDiscount: false,
        discountedPrice: "",
        minMargin: "",
        discountReason: "",
        temperature: "",
        dimension: "",
        weight: "",
        department: "",
      },
    };
  },
  create() {
    console.log("addSkuProps", addSku);
    this.addSku = addSku;
  },
  computed: {
    formTitle() {
      return this.titleChange === -1 ? "Add New SKU" : "Edit SKU";
    },
  },
  methods: {
    closeForm() {
      this.addSku = false;
    },
    saveForm() {
      this.addSku = false;
    },
  },
};
</script>
