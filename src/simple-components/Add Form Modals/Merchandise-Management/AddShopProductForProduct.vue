<template>
  <LoadingScreen :isLoading="isLoading" />
  <Modal
    :show="modalStatus"
    @hidden="modalStatus = false"
    backdrop="static"
    size="modal-sl-70"
  >
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">
        {{ formTitle }}
      </h2>
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="modalClose()"
        />
      </div>
    </ModalHeader>

    <ModalBody class="" >
      <div class="grid grid-cols-3 lg:gap-4 md:gap-4 gap-2">
        <div class="w-full">
          <label for="regular-form-1" class="form-label">Shop</label>
          <div class="flex flex-col space-y-1">
            <v-select v-model="formData.shopId" placeholder="SELECT" class="style-chooser cursor-pointer"
              :options="shopList" :reduce="(shopName) => shopName.shopId" label="shopName" />
          </div>
        </div>
        <!-- <div class="w-full">
          <label for="regular-form-1" class="form-label">Product</label>
          <div class="flex flex-col space-y-1">
            <v-select v-model="formData.productId" disabled placeholder="SELECT" class="style-chooser cursor-pointer"
              :options="productList" :reduce="(name) => name.productId" label="name" />
          </div>
        </div> -->
       
        <div class="w-full">
          <label for="regular-form-1" class="form-label">Product Price</label>
          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formData.price"
              @keypress="onlyNumber"
              type="text"
              class="form-control"
              placeholder="Product Price"
            />
          </div>
        </div>
        <div class="flex justify-start items-start space-x-2">
          <div class="w-full whitespace-nowrap">
          <label for="regular-form-1" class="form-label">Active Status</label>

          <div class="flex flex-col space-y-1">
            <div class="form-switch">
              <input type="checkbox" v-model="formData.status" class="form-check-input" />
            </div>
          </div>
        </div>
          <div class="w-full">
          <label for="regular-form-1" class="form-label">Visible</label>

          <div class="flex flex-col space-y-1">
            <div class="form-switch">
              <input type="checkbox" v-model="formData.isVisible" class="form-check-input" />
            </div>
          </div>
        </div>
       
        <div class="w-full">
          <label for="regular-form-1" class="form-label">Discount</label>

          <div class="flex flex-col space-y-1">
            <div class="form-switch">
              <input type="checkbox" v-model="formData.isDiscount" class="form-check-input" @change="activateDiscount()" />
            </div>
          </div>
        </div>
        </div>
       
        <div class="w-full" v-if="formData.isDiscount == true">
          <label for="regular-form-1" class="form-label">Discount Price</label>
          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formData.discountPrice"
              @keypress="onlyNumber"
              type="text"
              class="form-control"
              placeholder="Discount Price"
            />
          </div>
        </div>
        <div class="w-full" v-if="formData.isDiscount == true">
          <label for="regular-form-1" class="form-label">Discount Reason</label>
          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formData.discountReason"
              type="text"
              class="form-control"
              name="description"
              placeholder="Discount Reason"
            />
          </div>
        </div>
        
        
        
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="modalClose()"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        {{ const_txt.CANCEL_BTN }}
      </button>
      <button
        v-if="!titleChange"
        @click="saveForm()"
        type="submit"
        class="btn btn-primary w-24"
      >
        {{ const_txt.SAVE_BTN }}

        <SaveIcon
          v-if="!saving"
          icon="oval"
          color="white"
          class="w-4 h-4 ml-2"
        />
        <LoadingIcon
          v-if="saving"
          icon="oval"
          color="white"
          class="w-4 h-4 ml-2"
        />
      </button>
      <button
        v-if="titleChange"
        @click="updateForm()"
        type="submit"
        class="btn btn-primary w-24"
      >
        {{ const_txt.UPDATE_BTN }}
        <UploadCloudIcon
          v-if="!updating"
          icon="oval"
          color="white"
          class="w-4 h-4 ml-2"
        />
        <LoadingIcon
          v-if="updating"
          icon="oval"
          color="white"
          class="w-4 h-4 ml-2"
        />
      </button>
    </ModalFooter>
  </Modal>
</template>

<script>
import { const_txt } from "@/global-functions/const";
import axios from "@/services/http-common";
import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "@/global-functions/functions";

export default {
  props: {
    modalStatus: false,
    titleChange: false,
    formData: {},
    productId: 0,
    isLoading: false,
  },
  data: () => ({
    const_txt: const_txt,
    saving: false,
    updating: false,
    shopList:[],
  }),
  watch: {
    modalStatus(val) {
      val || this.modalClose();
    },
   
  },
  computed: {
    formTitle() {
      return this.titleChange === false ? "Add Shop Product" : "Edit Shop Product";
    },
    
  },

  created() {
    this.getShops();
  },
  mounted() {},
  methods: {
    async saveForm() {
      this.saving = true;
      this.formData.productId = this.productId;
      await axios
        .post("ShopProduct/Create", this.formData)
        .then((response) => {
          if (response.data.success) {
            this.modalClose();
            this.getDataFromApi();
            successToast(response.data.message);
          } else {
            failedToast(response.data.message);
          }
          this.saving = false;
        })
        .catch((error) => {
          this.saving = false;
          warningToast(statusMessage(error.response.status));
        });
    },
    async updateForm() {
      var id = this.formData.shopProductId;
      this.updating = true;
      await axios
        .put("ShopProduct/Edit/" + id, this.formData)
        .then((response) => {
          if (response.data.success) {
            this.modalClose();
            this.getDataFromApi();
            successToast(response.data.message);
          } else {
            failedToast(response.data.message);
          }
          this.updating = false;
        })
        .catch((error) => {
          this.updating = false;
          warningToast(statusMessage(error.response.status));
        });
    },

    modalClose() {

      this.$emit("modalClose", false);
    },
    getDataFromApi() {
      this.$emit("refreshData");
    },
    async getShops() {
      await axios
        .post("Shop/findAll")
        .then((response) => {
          this.shopList = response.data.data;
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },

  
    activateDiscount() {
      if(this.formData.isDiscount == false){
        this.formData.discountPrice = "0";
        this.formData.discountReason = "";
      }else{
        this.formData.discountPrice;
        this.formData.discountReason;
      }
    },
    onlyNumber ($event) {
   let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
   if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
      $event.preventDefault();
   }
}
  },
};
</script>
