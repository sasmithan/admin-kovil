<template>
  <LoadingScreen :isLoading="isLoading" />
  <!-- BEGIN: Add  Modal -->

  <AddKovil
    @modalClose="closeForm($event)"
    @getData="getDataFromApi($event)"
    :modalStatus="addForm"
    :titleChange="titleChange"
    :formData="formData"
  />
  <AddKovilInfo
    @modalClose="closeAddInfo($event)"
    @getData="getDataFromApi($event)"
    :modalStatus="addInfoModal"
    :formData="formDataSingle"
    :gods="gods"
    :poojaTypes="poojaTypes"
    :specialPoojaTypes="specialPoojaTypes"
    :archanaTypes="archanaTypes"
    :poojaTimes="poojaTimes"
  />
  <!-- <ViewKovilInfo
    @modalClose="closeViewInfo($event)"
    @getData="getDataFromApi($event)"
    :modalStatus="viewInfoModal"
    :oldFormData="formDataSingle"
  /> -->

  <!-- END: Add Modal -->
  <div class="md:-mt-11 w-full">
    <div
      class="md:fixed z-50 bg-slate-100 pt-2 pb-1 lg:flex lg:flex-row lg:items-center lg:space-x-2 lg:justify-between md:flex md:flex-row md:items-center md:space-x-1 md:justify-between flex flex-wrap flex-col justify-end items-end mt-2 w-full"
    >
      <div class="flex space-x-1">
        <AddItem @parentMethod="showModal($event)" buttonName="Add Kovil" />
      
        <SearchBar
          :searchActive="searchActive"
          @searchOnchange="searchOnchange($event)"
          @searchItem="searchItem($event)"
          @clearSearch="clearSearch($event)"
        />
      </div>
    </div>

    <!-- BEGIN: Data List -->
    <div
      class="intro-y col-span-12 block overflow-y-auto"
      style="height: 500px"
    >
      <table class="table table-report md:mt-12 table-auto">
        <thead class="sticky top-14 z-50 bg-white">
          <tr class="uppercase whitespace-nowrap">
            <th
              class="whitespace-nowrap"
              v-for="(header, i) in headers"
              :key="i"
            >
              {{ header.text }}
            </th>
            <th>Address</th>
            <th>Status</th>
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
              <div class="flex flex-col space-y-0.5 justify-start items-start">
                <div>{{ item.addressLine }},</div>
                <div>{{ item.city }},</div>
                <div>{{ item.state }},</div>
                <div>{{ item.country }}</div>
              </div>
            </td>
            <td>
              <div
                class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center whitespace-nowrap"
                :style="{ 'background-color': getStatusColor(item.status) }"
              >
                {{ getStatus(item.status) }}
              </div>
            </td>

            <td class="table-report__action w-24">
              <div class="flex justify-end items-end">
                <!-- <InfoItem
                  @parentMethod="viewInfo($event)"
                  :item="item"
                  name="Info"
                /> -->
                <AddSubItem
                  @parentMethod="addInfo($event)"
                  :item="item"
                  name="Add Info"
                />
                <EditItem
                  @parentMethod="editItem($event)"
                  :item="item"
                  name="Edit"
                />
                <ArchiveItem
                  @parentMethod="archiveItem($event)"
                  :item="item"
                  name="Archive"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- BEGIN: Pagination -->
    <div class="absolute z-50 mt-4 right-6">
      <ViewArchiveItem @parentMethod="getArchiveData($event)" />
    </div>

    <PaginationBarLocal
      @changePage="changePage($event)"
      :itemsCount="itemsCount"
      :pageCount="pageCount"
    />

    <!-- END: Pagination -->
  </div>

  <!-- BEGIN: Archive Modal -->
  <Modal :show="archiveModal" @hidden="archiveModal = false" size="modal-sl-80">
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="archiveModal = false"
        />
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
        @clearSearch="clearSearchArchive($event)"
      />
      <!-- SEARCH END-->
      <!-- BEGIN: Archive Data List -->
      <div class="intro-y col-span-12 overflow-auto px-4">
        <table class="table table-report table-auto">
          <thead class="sticky top-0 z-50 bg-white">
            <tr class="uppercase whitespace-nowrap">
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in headers"
                :key="i"
              >
                {{ header.text }}
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

              <td class="table-report__action w-24">
                <div class="flex justify-center items-center">
                  <RestoreItem
                    @parentMethod="restoreItem($event)"
                    :item="item"
                    name="Restore"
                  />
                  <DeleteItem
                    @parentMethod="deleteItem($event)"
                    :item="item"
                    name="Delete"
                  />
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
  <ArchiveConfirmModal
    :name="formData.kovilName"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formData.kovilName"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formData.kovilName"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete"
  />
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
    store.dispatch("menuTitle/setSubMenuTitle", "கோவில்கள்");
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
        kovilName: "",
        description: "",
        addressLine: "",
        city: "",
        state: "",
        country: "Sri Lanka",
        postCode:"",
        mobile: "",
        telephone: "",
        status: true,
        theertham: "",
        thalam: "",
        moolavar: "",
        url: "",
        kovilCategoryId: "",
      },
      formDataDefault: {
        kovilName: "",
        description: "",
        addressLine: "",
        city: "",
        state: "",
        country: "Sri Lanka",
        postCode:"",
        mobile: "",
        telephone: "",
        status: true,
        theertham: "",
        thalam: "",
        moolavar: "",
        url: "",
        kovilCategoryId: "",
      },

      headers: [
        { text: "Id", value: "kovilId" },
        { text: "Name", value: "kovilName" },
        { text: "description ", value: "description" },
        // { text: "address ", value: "address" },
        // { text: "city ", value: "city" },
        // { text: "state ", value: "state" },
        // { text: "country ", value: "country" },
        { text: "mobile  ", value: "mobile" },
        { text: "telephone  ", value: "telephone" },
        // { text: "status  ", value: "status" },
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

      addInfoModal: false,
      viewInfoModal: false,
      formDataSingle: {},

      gods: [],
      poojaTypes: [],
      specialPoojaTypes: [],
      archanaTypes: [],
      poojaTimes:[]
    };
  },
  computed: {},
  created() {
    this.getDataFromApi();
    this.getGods();
    this.getPoojaTypes();
    this.getSpecialPoojaTypes();
    this.getArchanaTypes();
    this.getPoojaTimes();
  },
  methods: {
  

    getGods() {
      axios
        .post("Gods/findAll")
        .then((response) => {
          if (response.data.success) {
            this.gods = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getPoojaTypes() {
      axios
        .post("PoojaType/findAll")
        .then((response) => {
          if (response.data.success) {
            this.poojaTypes = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSpecialPoojaTypes() {
      axios
        .post("SpecialPooja/findAll")
        .then((response) => {
          if (response.data.success) {
            this.specialPoojaTypes = response.data.data;
            console.log("specialPoojaTypes",this.specialPoojaTypes)
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getArchanaTypes() {
      axios
        .post("ArchanaType/findAll")
        .then((response) => {
          if (response.data.success) {
            this.archanaTypes = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getPoojaTimes() {
      axios
        .post("PoojaTime/findAll")
        .then((response) => {
          if (response.data.success) {
            this.poojaTimes = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getStatusColor(val) {
      return getStatusColor(val);
    },
    getStatus(val) {
      return getStatus(val);
    },
    // get items
    getDataFromApi() {
      this.isLoading = true;
      if (this.searchActive) {
        axios
          .get("Kovil/search/" + this.searchData)
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
          .post("Kovil/findAll")
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
          .get("Kovil/archiveSearch/" + this.searchDataArchive)
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
          .post("Kovil/findAllArchive")
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
      var itemId = this.formData.kovilId;
      this.isLoading = true;
      axios
        .post("Kovil/archive/" + itemId)
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
      var itemId = this.formData.kovilId;
      this.isLoading = true;
      axios
        .post("Kovil/restore/" + itemId)
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
      var itemId = this.formData.kovilId;
      this.isLoading = true;

      axios
        .delete("Kovil/delete/" + itemId)
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

    //Add Info
    addInfo(item) {
      var id = item.kovilId;
      console.log(item);
      this.formDataSingle = Object.assign({}, item);
      // this.getSingleData(id);
      this.addInfoModal = true;
    },

    viewInfo(item) {
      var id = item.kovilId;
      console.log(item);
      this.formDataSingle = Object.assign({}, item);
      // this.getSingleData(id);
      this.viewInfoModal = true;
    },
    async getSingleData(id) {
      this.isLoading = true;
      await axios
        .post("Kovil/find/" + id)
        .then((response) => {
          console.log(response);
          this.formDataSingle = response.data;
          this.isLoading = false;

          // if (response.data.success) {
          //   successToast(response.data.message);
          // } else {
          //   this.isLoading = false;
          //   failedToast(response.data.message);
          // }
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },
    closeAddInfo(status) {
      this.addInfoModal = status;
    },
    closeViewInfo(status) {
      this.viewInfoModal = status;
    },
  },
};
</script>
