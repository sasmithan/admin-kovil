<template>
  <LoadingScreen :isLoading="isLoading" />

  <AddShopProductForShop 
  @modalClose="closeForm($event)" 
  @refreshData="refreshData($event)"
  :modalStatus="addShopProductModal"
  :titleChange="titleChange" 
  :formData="subFormData" 
  :shopId="formData.shopId"
  />

 

  <Modal
    :show="modalStatus"
    @hidden="modalStatus = false"
    backdrop="static"
    slideOver="true"
    size="modal-sl-80"
  >
    <ModalHeader>
      <h2 class="font-medium text-2xl mr-auto uppercase">
        {{ formData.shopName }} - Add Info
      </h2>
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="modalClose()"
        />
      </div>
    </ModalHeader>
    <ModalBody class="flex flex-col gap-2">
      <h2 class="font-medium text-xl mr-auto uppercase">
        Shop Product Details
      </h2>
      <div class="flex justify-between items-center">
        <div class="flex justify-center items-center space-x-2">
          <AddItem @parentMethod="addShopProduct($event)" buttonName="Add Shop Product" />
          <ViewArchiveItem @parentMethod="getArchiveData($event)" />
        </div>
       
        
          <SearchBar :searchActive="searchData" @searchOnchange="searchOnchange($event)"
          @searchItem="searchItem($event)" @clearSearch="clearSearch($event)" />
      </div>
      <div class="intro-y col-span-12 block overflow-y-auto" style="height: 400px;">
       
          <table class="table table-report table-auto">
        <thead class="sticky top-0 z-50 bg-slate-100">
          <tr class="uppercase whitespace-nowrap">
            <th>
              Product
            </th>
            <th class="whitespace-nowrap" v-for="(header, i) in headers" :key="i">
              {{ header.text }}
            </th>
            <th>Discount</th>
            <th>Visible</th>
            <th>Active Status</th>
          <th></th>
          </tr>
        </thead>
        <tbody>
          <NoData :items="items" />
          <tr v-for="(item, i) in itemsLocal" :key="i" class="intro-x">
            <td>
              {{item.product.name || ""}}
            </td>
            <td v-for="(header, index) in headers" :key="index">
              {{ item[header.value] }}
            </td>
            <td>
              <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center whitespace-nowrap"
                  :style="{ 'background-color': getDiscountStatusColorById(item.isDiscount) }"
                >
                  {{ getDiscountStatusById(item.isDiscount) }}
                </div>
            </td>
            <td>
              <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center whitespace-nowrap"
                  :style="{ 'background-color': getDiscountStatusColorById(item.isVisible) }"
                >
                  {{ getDiscountStatusById(item.isVisible) }}
                </div>
            </td>
            <td>
              <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center whitespace-nowrap"
                  :style="{ 'background-color': getActiveStatusColorById(item.status) }"
                >
                  {{ getActiveStatusById(item.status) }}
                </div>
            </td>
            <td class="table-report__action w-24">
              <div class="flex justify-end items-end">
                <EditItem @parentMethod="editItem($event)" :item="item" name="Edit" />
                <ArchiveItem @parentMethod="archiveItem($event)" :item="item" name="Archive" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
   

    <PaginationBarLocal @changePage="changePage($event)" :itemsCount="itemsCount" :pageCount="pageCount" />
   
    </ModalBody>
  </Modal>
<!-- BEGIN: Archive Modal -->
<Modal :show="archiveModal" @hidden="archiveModal = false" size="modal-sl-80" slideOver="true">
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="archiveModal = false" />
      </div>

      <div class="p-5 text-center lg:text-lg text-base uppercase font-semibold">
        Archive
      </div>
      <hr />
      <!-- SEARCH -->

      <SearchBar :searchActive="searchDataArchive" @searchOnchange="searchOnchangeArchive($event)"
        @searchItem="searchItemArchive($event)" @clearSearch="clearSearchArchive($event)" />
      <!-- SEARCH END-->
      <!-- BEGIN: Archive Data List -->
      <div class="intro-y col-span-12 block overflow-y-auto px-4" style="height: 470px;">
        <table class="table table-report table-auto">
          <thead class="sticky top-0 z-50 bg-white">
            <tr class="uppercase whitespace-nowrap">
              <th>
              Product
            </th>
              <th class="whitespace-nowrap" v-for="(header, i) in headers" :key="i">
                {{ header.text }}
              </th>
              <th>Discount</th>
            <th>Visible</th>
            <th>Active Status</th>
            <th></th>
            </tr>
          </thead>
          <tbody>
            <NoData :items="archiveItems" />
            <tr v-for="(item, i) in archiveItemsLocal" :key="i" class="intro-x">
              <td>
              {{item.product.name || ""}}
            </td> 
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>
              <td>
              <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center whitespace-nowrap"
                  :style="{ 'background-color': getDiscountStatusColorById(item.isDiscount) }"
                >
                  {{ getDiscountStatusById(item.isDiscount) }}
                </div>
            </td>
            <td>
              <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center whitespace-nowrap"
                  :style="{ 'background-color': getDiscountStatusColorById(item.isVisible) }"
                >
                  {{ getDiscountStatusById(item.isVisible) }}
                </div>
            </td>
            <td>
              <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center whitespace-nowrap"
                  :style="{ 'background-color': getActiveStatusColorById(item.status) }"
                >
                  {{ getActiveStatusById(item.status) }}
                </div>
            </td>
              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <RestoreItem @parentMethod="restoreItem($event)" :item="item" name="Restore" />
                  <DeleteItem @parentMethod="deleteItem($event)" :item="item" name="Delete" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- END: Archive Data List -->


      <!-- BEGIN: Pagination -->

      <PaginationBarLocal @changePage="changePageArchive($event)" :itemsCount="archiveItemsCount"
        :pageCount="pageCountArchive" />

      <!-- END: Pagination -->
    </ModalBody>
  </Modal>
  <!-- END: Archive Modal -->
   <!-- BEGIN: Confirmation Modals -->
   <ArchiveConfirmModal :name="formData.name" :modalStatus="archiveConfirmationModal" :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive" />
  <RestoreConfirmModal :name="formData.name" :modalStatus="restoreConfirmationModal" :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore" />
  <DeleteConfirmModal :name="formData.name" :modalStatus="deleteConfirmationModal" :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete" />
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
    formData: {},
    isLoading: false,
  },
  data: () => ({
    const_txt: const_txt,

    subFormData: {
        price: "",
        isVisible: true,
        status: true,
        isDiscount: false,
        discountPrice: "",
        discountReason: "",
        productId: "",
        shopId: ""
      },
      subFormDataDefault: {
        price: "",
        isVisible: true,
        status: true,
        isDiscount: false,
        discountPrice: "",
        discountReason: "",
        productId: "",
        shopId: ""
      },

    isLoading: false,
    searchData: "",
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,

      archiveModal: false,

      archiveConfirmationModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,

    addShopProductModal: false,
    titleChange: false,

    pageRows: 10,

    headers: [
        { text: "Price", value: "price" },
        { text: "Discount Price ", value: "discountPrice" },
        { text: "Discount Reason ", value: "discountReason" },
      ],

      pageCount: 0,
      items: [],
      itemsCount: 0,
      itemsLocal: [],
      itemStart: 0,
      itemEnd: 10,

      pageCountArchive: 0,
      archiveItems: [],
      archiveItemsCount: 0,
      archiveItemsLocal: [],
      itemStartArchive: 0,
      itemEndArchive: 10,

      activateStatusList:[],
      discountStatusList: [],
  }),
  watch: {
    modalStatus(val) {
      val || this.modalClose();
    },
    formData() {
      this.refreshData();
    },
  },

  computed: {},

  created() {
   this.getDiscountStatus();
   this.getActiveStatus();
  },
  mounted() {
  },
  methods: {
    setDefault(){
      this.subFormData = Object.assign({}, this.subFormDataDefault);
    },
     getArchiveData() {
      this.isLoading = true;
      var id = this.formData.shopId;
      if (this.searchActiveArchive) {
        axios
        .get("ShopProduct/shopArchiveSearch/" + this.searchDataArchive+"/"+id)
          .then((response) => {
            if (response.data.success) {
              if (response.data.data != null) {
                this.archiveItems = response.data.data;
                this.archiveItemsCount = this.archiveItems.length;
                this.setPaginationArchive();
              } else {
                this.archiveItems = [];
                this.archiveItemsCount = this.archiveItems.length;
                this.setPaginationArchive();
              }
            } else {
              warningToast(response.data.message);
            }

            this.isLoading = false;
          })
          .catch((error) => {
            this.isLoading = false;
          });
      } else {
        axios
          .post("ShopProduct/findShopAllArchive/"+id)
          .then((response) => {
            if (response.data.success) {
              this.archiveItems = response.data.data;
              this.archiveItemsCount = this.archiveItems.length;
              this.setPaginationArchive();
            } else {
              warningToast(statusMessage(error.response.status));
            }
            this.isLoading = false;
          })
          .catch((error) => {
            this.isLoading = false;
            warningToast(statusMessage(error.response.status));
          });
      }

      this.archiveModal = true;
    },
 // Archive Pagination
 setPaginationArchive() {
      var pageCount = this.archiveItems.length / this.pageRows;
      let pageCountRound = Math.round(pageCount);
      if (pageCount > pageCountRound) {
        pageCountRound += 1;
        this.pageCountArchive = pageCountRound;
      } else {
        this.pageCountArchive = pageCountRound;
      }
      this.archiveItemsLocal = this.archiveItems.slice(
        this.itemStartArchive,
        this.itemEndArchive
      );
    },
    changePageArchive(pageNum) {
      this.itemEndArchive = this.pageRows * pageNum;
      this.itemStartArchive = this.itemEndArchive - this.pageRows;
      this.archiveItemsLocal = this.archiveItems.slice(
        this.itemStartArchive,
        this.itemEndArchive
      );
    },
    //Normal Search
    searchOnchange(searchData) {
      this.searchData = searchData;
      if (this.searchData != "") {
        this.searchActive = true;
        this.searchItem();
      } else {
        this.clearSearch();
      }
    },
    searchItem() {
      if (this.searchData != "") {
        this.searchActive = true;
        this.refreshData();
      }
    },
    clearSearch() {
      this.searchData = "";
      this.searchActive = false;
      this.refreshData();
    },

    // Archive Search
    searchOnchangeArchive(searchData) {
      this.searchDataArchive = searchData;
      if (this.searchDataArchive != "") {
        this.searchActiveArchive = true;
        this.searchItemArchive();
      } else {
        this.clearSearchArchive();
      }
    },
    searchItemArchive() {
      if (this.searchDataArchive != "") {
        this.searchActiveArchive = true;
        this.getArchiveData();
      }
    },
    clearSearchArchive() {
      this.searchDataArchive = "";
      this.searchActiveArchive = false;
      this.getArchiveData();
    },
    setPagination() {
      var pageCount = this.items.length / this.pageRows;
      let pageCountRound = Math.round(pageCount);
      if (pageCount > pageCountRound) {
        pageCountRound += 1;
        this.pageCount = pageCountRound;
      } else {
        this.pageCount = pageCountRound;
      }
      this.itemsLocal = this.items.slice(this.itemStart, this.itemEnd);
    },
    changePage(pageNum) {
      this.itemEnd = this.pageRows * pageNum;
      this.itemStart = this.itemEnd - this.pageRows;
      this.itemsLocal = this.items.slice(this.itemStart, this.itemEnd);
    },
    addShopProduct() {
      this.addShopProductModal = true;
    },
    closeForm(status) {
      this.addShopProductModal = status;
      this.setDefault()
    },
    modalClose() {
      this.$emit("modalClose", false);
    },

    getDataFromApi() {
      this.$emit("getData");
    },
    editItem(item) {
      this.titleChange = true;
      this.subFormData = Object.assign({}, item);
      this.addShopProductModal = true;
    },

    //Archive added items
    archiveItem(item) {
      this.subFormData = Object.assign({}, item);
      this.archiveConfirmationModal = true;
    },

    archiveItemConfirm() {
      var itemId = this.subFormData.shopProductId;
      this.isLoading = true;
      axios
        .post("ShopProduct/archive/" + itemId)
        .then((response) => {
          if (response.data.success) {
            this.archiveConfirmationModal = false;
            this.refreshData();
            successToast(response.data.message);
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },

    closeArchive() {
      this.archiveConfirmationModal = false;
      this.setDefault();
    },

    //Restore archived items

    restoreItem(item) {
      this.subFormData = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.subFormData.shopProductId;
      this.isLoading = true;
      axios
        .post("ShopProduct/restore/" + itemId)
        .then((response) => {
          if (response.data.success) {
            this.restoreConfirmationModal = false;
            this.getArchiveData();
            this.refreshData();
            successToast(response.data.message);
            if (this.archiveItemsCount == 0) {
              this.archiveModal = false;
            }
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },
    closeRestore() {
      this.restoreConfirmationModal = false;
      this.setDefault();
    },

    //Delete archived items
    deleteItem(item) {
      this.subFormData = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      var itemId = this.subFormData.shopProductId;
      this.isLoading = true;

      axios
        .delete("ShopProduct/delete/" + itemId)
        .then((response) => {
          if (response.data.success) {
            this.deleteConfirmationModal = false;
            this.getArchiveData();
            successToast(response.data.message);
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },
    closeDelete() {
      this.deleteConfirmationModal = false;
      this.setDefault();
    },
    async refreshData() {
      var id = this.formData.shopId;
      this.isLoading = true;
      if (this.searchActive) {
        axios
          .get("ShopProduct/shopSearch/" + this.searchData+"/"+id)
          .then((response) => {
            if (response.data.success) {
              if (response.data.data != null) {
                this.items = response.data.data;
                this.itemsCount = this.items.length;
                this.setPagination();
              } else {
                this.items = [];
                this.itemsCount = this.items.length;
                this.setPagination();
              }
            } else {
              warningToast(response.data.message);
            }

            this.isLoading = false;
          })
          .catch((error) => {
            this.isLoading = false;
          });
      } else {
      await axios
          .post("ShopProduct/find/shop/"+id)
          .then((response) => {
            if (response.data.success) {
              this.items = response.data.data;
              this.itemsCount = this.items.length;
              this.setPagination();
            } else {
              warningToast(response.data.message);
            }

            this.isLoading = false;
          })
          .catch((error) => {
            this.isLoading = false;
          });
        }
    },

    async getActiveStatus() {
      await axios
        .get("Enum/ActivateStatus")
        .then((response) => {
          this.activateStatusList = response.data.data;
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },

    getActiveStatusById(value) {
      try {
        return this.activateStatusList.find((x) => x.id === value).name;
      } catch {
        return "";
      }
    },
    getActiveStatusColorById(value) {
      try {
        return this.activateStatusList.find((x) => x.id === value).color;
      } catch {
        return "";
      }
    },

    async getDiscountStatus() {
      await axios
        .get("Enum/Status")
        .then((response) => {
          this.discountStatusList = response.data.data;
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },

    getDiscountStatusById(value) {
      try {
        return this.discountStatusList.find((x) => x.id === value).name;
      } catch {
        return "";
      }
    },
    getDiscountStatusColorById(value) {
      try {
        return this.discountStatusList.find((x) => x.id === value).color;
      } catch {
        return "";
      }
    },
    
  },
};
</script>
