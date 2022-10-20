<template>
  <LoadingScreen :isLoading="isLoading" />

  <!-- BEGIN: Add  Modal -->

  <!-- <AddPoojaBooking
    @modalClose="closeForm($event)"
    @getData="getDataFromApi($event)"
    :modalStatus="addForm"
    :titleChange="titleChange"
    :formData="formData"
    :kovilPoojaTypes="kovilPoojaTypes"
    :kovilPoojaTimes="kovilPoojaTimes"
    :kovils="kovils"
  /> -->

  <!-- END: Add Modal -->

  <div class="md:-mt-11 w-full">
    <div
      class="md:fixed z-50 bg-slate-100 pt-2 pb-1 lg:flex lg:flex-row lg:items-center lg:space-x-2 lg:justify-between md:flex md:flex-row md:items-center md:space-x-1 md:justify-between flex flex-wrap flex-col justify-end items-end mt-2 w-full"
    >
      <div class="flex space-x-1">
        <!-- <AddItem @parentMethod="showModal($event)" buttonName="Booka Pooja" /> -->

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
            <th>Customer</th>
            <th>Pooja Name</th>
            <th>Time</th>
            <th>Date</th>
            <th>Kovil</th>
            <th>Description</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
 <NoData :items="items" />
        <tbody v-for="(item, i) in itemsLocal" :key="i">
         
          <tr class="intro-x">
            <td
              :style="
                opened.includes(item.poojaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              {{ item.firstName }}
            </td>
            <td
              :style="
                opened.includes(item.poojaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              {{ getKovilPoojaById(item.kovilPoojaTypeId) }}
            </td>
            <td
              :style="
                opened.includes(item.poojaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              {{ getKovilPoojaTimeById(item.kovilPoojaTimeId) }}
            </td>
            <td
              :style="
                opened.includes(item.poojaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              {{ dateFormat(item.date) }}
            </td>
            <td
              :style="
                opened.includes(item.poojaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              {{ getKovilById(item.kovilId) }}
            </td>
            <td
              :style="
                opened.includes(item.poojaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              {{ item.description }}
            </td>
            <td
              :style="
                opened.includes(item.archanaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              <div
                class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center whitespace-nowrap"
                :style="{ 'background-color': getBookingStatusColor(item.status) }"
              >
                {{ getBookingStatus(item.status) }}
              </div>
            </td>
            <td class="table-report__action">
              <div class="flex justify-end items-end">
                <ArrowDownCircleIcon
                  v-if="!opened.includes(item.poojaBookingId)"
                  class="text-blue-900 text-bold mr-4 lg:w-6 lg:h-6 md:w-4 md:h-4 w-4 h-4 cursor-pointer"
                  @click="toggle(item)"
                />
                <ArrowUpCircleIcon
                  v-if="opened.includes(item.poojaBookingId)"
                  class="text-blue-900 text-bold mr-4 lg:w-6 lg:h-6 md:w-4 md:h-4 w-4 h-4 cursor-pointer"
                  @click="closeToggle(item)"
                />

                <EditItem
                  @parentMethod="editItem($event)"
                  :item="item"
                  name="Update Status"
                />
                <ArchiveItem
                  @parentMethod="archiveItem($event)"
                  :item="item"
                  name="Archive"
                />
              </div>
            </td>
          </tr>

          <tr v-if="opened.includes(item.poojaBookingId)">
            <td colspan="12" :style="getSelectedItemColor()">
              <table class="table table-report">
                <thead>
                  <tr class="uppercase whitespace-nowrap">
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="intro-x">
                    <!-- <td>
                      {{ customerInfo }}
                    </td> -->
                    <td v-for="(header, index) in headers" :key="index">
                      {{ customerInfo[header.value] }}
                    </td>
                    <td>
                      <div
                        class="flex flex-col space-y-0.5 justify-start items-start"
                      >
                        <div>{{ customerInfo.addressLine }},</div>
                        <div>{{ customerInfo.city }},</div>
                        <div>{{ customerInfo.state }},</div>
                        <div>{{ customerInfo.country }}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- END: Data List -->

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

              <td class="table-report__action">
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
      <!-- END: Archive Data List -->

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
    :name="formData.name"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formData.name"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formData.name"
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
  getSelectedColor,
  getSelectedItemColor,
  getBookingStatusColor,
  getBookingStatus,
} from "@/global-functions/functions";
import moment from "moment";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Pooja Bookings");
  },
  components: {},
  data() {
    return {
      cName: "PoojaBooking",
      opened: [],
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
        kovilId: "",
        kovilPoojaTypeId: "",
        kovilPoojaTimeId: "",
        date: "",
        firstName: "",
        lastName:"",
        status: "",
        phoneNo: "",
        email: "",
        description: "",
        addressLine: "",
        city: "",
        country: "",
        postCode: "",
        state: "",
      },
      formDataDefault: {
        kovilId: "",
        kovilPoojaTypeId: "",
        kovilPoojaTimeId: "",
        date: "",
        firstName: "",
        lastName:"",
        status: "",
        phoneNo: "",
        email: "",
        description: "",
        addressLine: "",
        city: "",
        country: "",
        postCode: "",
        state: "",
      },

      headers: [
        // { text: "Id", value: "poojaBookingId" },
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
        { text: "Phone ", value: "phoneNo" },
        { text: "email ", value: "email" },
        // { text: "description ", value: "description" },
        // { text: "addressLine ", value: "addressLine" },
        // { text: "city ", value: "city" },
        // { text: "state ", value: "state" },
        // { text: "country ", value: "country" },
        // { text: "postCode ", value: "postCode" },
        // { text: "created On ", value: "createdOn" },
        // { text: "updated On ", value: "updatedOn" },
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

      kovilPoojaTypes: [],
      kovilPoojaTimes: [],
      kovils: [],
    };
  },
  computed: {},
  created() {
    this.getDataFromApi();
    this.getKovils();
    this.getKovilPoojaTypes();
    this.getKovilPoojaTimes();
  },
  methods: {
    getBookingStatus(val) {
      return getBookingStatus(val);
    },
    getBookingStatusColor(val) {
      return getBookingStatusColor(val);
    },
    getSelectedColor() {
      return getSelectedColor();
    },
    getSelectedItemColor() {
      return getSelectedItemColor();
    },
    toggle(item) {
      this.opened.splice(this.indexToggle, 1);
      this.indexToggle = this.opened.indexOf(item.poojaBookingId);
      if (this.indexToggle > -1) {
        this.opened.splice(this.indexToggle, 1);
      } else {
        this.viewCustomerInfo(item.poojaBookingId);
        this.opened.push(item.poojaBookingId);
      }
    },
    closeToggle(item) {
      this.customerInfo = [];
      this.indexToggle = this.opened.indexOf(item.poojaBookingId);
      if (this.indexToggle > -1) {
        this.opened.splice(this.indexToggle, 1);
      } else {
        this.viewCustomerInfo(item.poojaBookingId);
        this.opened.push(item.poojaBookingId);
      }
    },
    viewCustomerInfo(poojaBookingId) {
      try {
        var newArray = [];
        newArray = this.itemsLocal.find(
          (x) => x.poojaBookingId === poojaBookingId
        );
        this.customerInfo = newArray;
        console.log(this.customerInfo);
      } catch {}
    },

    dateFormat(date) {
      return moment(date).format("DD MMMM, YYYY");
    },
    // get For Select
    getKovils() {
      axios
        .post("Kovil/findAll")
        .then((response) => {
          if (response.data.success) {
            this.kovils = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getKovilById(value) {
      try {
        return this.kovils.find((x) => x.kovilId === (value)).kovilName;
      } catch {
        return "Null";
      }
    },
    getKovilPoojaTypes() {
      axios
        .post("kovilPoojaType/findAll")
        .then((response) => {
          if (response.data.success) {
            this.kovilPoojaTypes = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getKovilPoojaById(value) {
      try {
        var result = this.kovilPoojaTypes.find(
          (x) => x.kovilPoojaTypeId === (value)
        );
        var poojaName = result.poojaType.name;
        return poojaName;
      } catch {
        return "Null";
      }
    },
    getKovilPoojaTimes() {
      axios
        .post("KovilPoojaTime/findAll")
        .then((response) => {
          if (response.data.success) {
            console.log(response.data.data);
            this.kovilPoojaTimes = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getKovilPoojaTimeById(value) {
      try {
        var result = this.kovilPoojaTimes.find(
          (x) => x.kovilPoojaTimeId === (value)
        );
        var poojaTime = result.poojaTime.time;

        return poojaTime;
      } catch {
        return "Null";
      }
    },

    // get items
    getDataFromApi() {
      this.isLoading = true;
      if (this.searchActive) {
        axios
          .get(`${this.cName}/search/` + this.searchData)
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
          .post(`${this.cName}/findAll`)
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
          .get(`${this.cName}/archiveSearch/` + this.searchDataArchive)
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
          .post(`${this.cName}/findAllArchive`)
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
      var itemId = this.formData.poojaBookingId;
      this.isLoading = true;
      axios
        .post(`${this.cName}/archive/` + itemId)
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
      var itemId = this.formData.poojaBookingId;
      this.isLoading = true;
      axios
        .post(`${this.cName}/restore/` + itemId)
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
      var itemId = this.formData.poojaBookingId;
      this.isLoading = true;

      axios
        .delete(`${this.cName}/delete/` + itemId)
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

  
  },
};
</script>
