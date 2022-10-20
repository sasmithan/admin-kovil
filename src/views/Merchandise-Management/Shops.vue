<template>
  <LoadingScreen :isLoading="isLoading" />
  <!-- BEGIN: Add  Modal -->

  <AddShop @modalClose="closeForm($event)" 
    @getData="getDataFromApi($event)" 
    :modalStatus="addForm"
    :titleChange="titleChange" 
    :formData="formData" />

    <AddShopInfo
    @modalClose="closeAddInfo($event)"
    @getData="getDataFromApi($event)"
    :modalStatus="addInfoModal"
    :formData="formDataSingle"
  />

  <!-- END: Add Modal -->
  <div class="md:-mt-11 w-full">
    <div
      class="md:fixed z-50 bg-slate-100 pt-2 pb-1 lg:flex lg:flex-row lg:items-center lg:space-x-2 lg:justify-between md:flex md:flex-row md:items-center md:space-x-1 md:justify-between flex flex-wrap flex-col justify-end items-end mt-2 w-full">
      <div class="flex space-x-1">
        <AddItem @parentMethod="showModal($event)" buttonName="Add Shop" />

        <SearchBar 
        :searchActive="searchActive" 
        @searchOnchange="searchOnchange($event)"
        @searchItem="searchItem($event)" 
        @clearSearch="clearSearch($event)" />

       
      </div>
     
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 block overflow-y-auto" style="height: 500px;">
      <table class="table table-report md:mt-12 table-auto">
        <thead class="sticky top-14 z-50 bg-slate-100">
          <tr class="uppercase whitespace-nowrap">
            <th class="whitespace-nowrap" v-for="(header, i) in headers" :key="i">
              {{ header.text }}
            </th>
            <th>
              Shop Category
            </th>
            <th>
              Shop Type
            </th>
            <th>
              Active Status
            </th>
            <th>
              Address
            </th>
          <th></th>
          </tr>
        </thead>

        <tbody>
          <NoData :items="items" />
          <tr v-for="(item, i) in itemsLocal" :key="i" class="intro-x">
            <td v-for="(header, index) in headers" :key="index">
              {{ item[header.value] }}
            </td>
            <td>
              {{ item.shopCategory.name || ""}}
            </td>
            <td>
              {{ item.shopType.name || ""}}
            </td>
            <td>
              <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center whitespace-nowrap"
                  :style="{ 'background-color': getActiveStatusColorById(item.status) }"
                >
                  {{ getActiveStatusById(item.status) }}
                </div>
            </td>
            <td>
              <div class="flex flex-col space-y-0.5 justify-start items-start">
                <div>{{item.address}},</div>
                <div>{{item.city}},</div>
                <div>{{item.state}},</div>
                <div>{{item.country}}</div>
              </div>
            </td>
            <td class="table-report__action w-24">
              <div class="flex justify-end items-end">
                <InfoItem @parentMethod="viewItemInfo($event)" :item="item" name="Info" />
                <AddSubItem @parentMethod="addInfo($event)" :item="item" name="Add Info" />
                <EditItem @parentMethod="editItem($event)" :item="item" name="Edit" />
                <ArchiveItem @parentMethod="archiveItem($event)" :item="item" name="Archive" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- END: Data List -->


    <!-- BEGIN: Pagination -->
    <div class=" absolute z-50 mt-4 right-6">
      <ViewArchiveItem  @parentMethod="getArchiveData($event)" />
    </div>

      <PaginationBarLocal
      @changePage="changePage($event)"
      :itemsCount="itemsCount"
      :pageCount="pageCount"
    />
    <!-- END: Pagination -->
  </div>

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

      <SearchBar 
      :searchActive="searchDataArchive" 
      @searchOnchange="searchOnchangeArchive($event)"
      @searchItem="searchItemArchive($event)" 
      @clearSearch="clearSearchArchive($event)" />
      <!-- SEARCH END-->
      <!-- BEGIN: Archive Data List -->
      <div
        class="intro-y col-span-12 block overflow-y-auto px-4"
        style="height: 470px;"
      >
        <table class="table table-report table-auto">
          <thead class="sticky top-0 z-50 bg-white">
            <tr class="uppercase whitespace-nowrap">
              <th class="whitespace-nowrap" v-for="(header, i) in headers" :key="i">
                {{ header.text }}
              </th>
              <th>
              Shop Category
            </th>
            <th>
              Shop Type
            </th>
            <th>
              Status
            </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <NoData :items="archiveItems" />
            <tr v-for="(item, i) in archiveItemsLocal" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>
              <td>
              {{ item.shopCategory.name || ""}}
            </td>
            <td>
              {{ item.shopType.name || ""}}
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

      <!-- BEGIN: Pagination -->

      <PaginationBarLocal
        @changePage="changePageArchive($event)"
        :itemsCount="archiveItemsCount"
        :pageCount="pageCountArchive"
      />
      <!-- END: Pagination -->
    </ModalBody>
  </Modal>
  <!-- END: Archive Modal -->

  <!-- BEGIN: Confirmation Modals -->
  <ArchiveConfirmModal :name="formData.shopName" :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm" :modalClose="closeArchive" />
  <RestoreConfirmModal :name="formData.shopName" :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm" :modalClose="closeRestore" />
  <DeleteConfirmModal :name="formData.shopName" :modalStatus="deleteConfirmationModal" :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete" />
  <!-- END: Confirmation Modals -->
</template>

<script>
import axios from "@/services/http-common";
import router from "@/router";
import store from "@/store";
import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
  getStatusColor,
  getStatus,
} from "@/global-functions/functions";

export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Shops");
  },
  components: {},
  data() {
    return {
      isLoading: false,
      searchData: "",
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,

      addForm: false,
      archiveModal: false,

      archiveConfirmationModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,

      titleChange: false,
      formData: {
        shopName: "",
        description: "",
        addressLine: "",
        city: "",
        state: "",
        country: "",
        postCode: "",
        mobile: "",
        telephone: "",
        status: true,
        shopCategoryId: "",
        shopTypeId: "",
      },
      formDataDefault: {
        shopName: "",
        description: "",
        addressLine: "",
        city: "",
        state: "",
        country: "",
        postCode: "",
        mobile: "",
        telephone: "",
        status: true,
        shopCategoryId: "",
        shopTypeId: "",
      },

      headers: [
        { text: "Shop Name", value: "shopName" },
        { text: "description ", value: "description" },
        { text: "Telephone ", value: "telephone" },
        { text: "Mobile ", value: "mobile" },
      ],

      pageRows: 10,

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

      shopCategoryList: [],
      shopTypeList: [],

      formDataSingle: {},
      addInfoModal: false,
      activateStatusList:[]
    };
  },
  computed: {},
  created() {
    this.getDataFromApi();
    this.getActiveStatus();
  },
  methods: {
    // get items
    getDataFromApi() {
      this.isLoading = true;
      if (this.searchActive) {
        axios
          .get("Shop/search/" + this.searchData)
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
        axios
          .post("Shop/findAll")
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

    //get archive items
    getArchiveData() {
      this.isLoading = true;
      if (this.searchActiveArchive) {
        axios
          .get("Shop/archiveSearch/" + this.searchDataArchive)
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
          .post("Shop/findAllArchive")
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
        this.getDataFromApi();
      }
    },
    clearSearch() {
      this.searchData = "";
      this.searchActive = false;
      this.getDataFromApi();
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

    //Normal Pagination
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

    // Add items
    showModal() {
      this.setDefault();
      this.titleChange = false;
      this.addForm = true;
    },
    setDefault() {
      this.formData = Object.assign({}, this.formDataDefault);
    },

    closeForm(status) {
      this.addForm = status;
    },

    //Edit added items
    editItem(item) {
      this.titleChange = true;
      this.formData = Object.assign({}, item);
      this.addForm = true;
    },

    //Archive added items
    archiveItem(item) {
      this.formData = Object.assign({}, item);
      this.archiveConfirmationModal = true;
    },

    archiveItemConfirm() {
      var itemId = this.formData.shopId;
      this.isLoading = true;
      axios
        .post("Shop/archive/" + itemId)
        .then((response) => {
          if (response.data.success) {
            this.archiveConfirmationModal = false;
            this.getDataFromApi();
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
      this.formData = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.formData.shopId;
      this.isLoading = true;
      axios
        .post("Shop/restore/" + itemId)
        .then((response) => {
          if (response.data.success) {
            this.restoreConfirmationModal = false;
            this.getArchiveData();
            this.getDataFromApi();
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
      this.formData = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      var itemId = this.formData.shopId;
      this.isLoading = true;

      axios
        .delete("Shop/delete/" + itemId)
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
   
    addInfo(item) {
      var id = item.shopId;
      this.formDataSingle = Object.assign({}, item);
      this.addInfoModal = true;
    },
    closeAddInfo(status) {
      this.addInfoModal = status;
    },
  },
  
};
</script>
