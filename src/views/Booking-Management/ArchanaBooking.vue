<template>
  <LoadingScreen :isLoading="isLoading" />

  <!-- BEGIN: Add  Modal -->

  <!-- <AddPoojaBooking
    @modalClose="closeForm($event)"
    @getData="getDataFromApi($event)"
    :modalStatus="addForm"
    :titleChange="titleChange"
    :formData="formData"
    :kovilArchanaTypes="kovilArchanaTypes"
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
            <th>ID</th>
            <th>Customer</th>
            <th>Archana Name</th>
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
            <td>{{ item.archanaBookingId }}</td>
            <td
              :style="
                opened.includes(item.archanaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              {{ item.firstName }} {{ item.lastName }}
            </td>
            <td
              :style="
                opened.includes(item.archanaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              {{ getKovilArchanaById(item.kovilArchanaTypeId) }}
            </td>
            <td
              :style="
                opened.includes(item.archanaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              {{ getKovilPoojaTimeById(item.kovilPoojaTimeId) }}
            </td>
            <td
              :style="
                opened.includes(item.archanaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              {{ dateFormat(item.date) }}
            </td>
            <td
              :style="
                opened.includes(item.archanaBookingId)
                  ? getSelectedColor()
                  : 'color: black'
              "
            >
              {{ getKovilById(item.kovilId) }}
            </td>
            <td
              :style="
                opened.includes(item.archanaBookingId)
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
                :style="{
                  'background-color': getBookingStatusColor(item.status),
                }"
              >
                {{ getBookingStatus(item.status) }}
              </div>
            </td>

            <td class="table-report__action">
              <div class="flex justify-end items-end">
                <ArrowDownCircleIcon
                  v-if="!opened.includes(item.archanaBookingId)"
                  class="text-blue-900 text-bold mr-4 lg:w-6 lg:h-6 md:w-4 md:h-4 w-4 h-4 cursor-pointer"
                  @click="toggle(item)"
                />
                <ArrowUpCircleIcon
                  v-if="opened.includes(item.archanaBookingId)"
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

          <tr v-if="opened.includes(item.archanaBookingId)">
            <td colspan="12" :style="getSelectedItemColor()">
              <table class="table table-report">
                <thead>
                  <tr class="uppercase whitespace-nowrap">
                    <th>ID</th>    <th>Archana Name</th>
                    <th>Raasi</th>
                    <th>Natchathiram</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in archanaInfo" :key="i" class="intro-x">
                    <td>
                      {{ item.archanaPersonId }}
                    </td>
                    <td>
                      {{ item.archanaName }}
                    </td>
                    <td>
                      {{ getRaasiById(item.raasiId) }}
                    </td>
                    <td>
                      {{ getNatchaththiramyId(item.natchaththiramId) }}
                    </td>
                    <td>
                      <div
                        class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center whitespace-nowrap"
                        :style="{
                          'background-color': getStatusColor(item.status),
                        }"
                      >
                        {{ getAliveStatus(item.status) }}
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
  getStatusColor,
  getAliveStatus,
  getSelectedColor,
  getSelectedItemColor,
  getBookingStatusColor,
  getBookingStatus,
} from "@/global-functions/functions";
import moment from "moment";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Archana Bookings");
  },
  components: {},
  data() {
    return {
      cName: "ArchanaBooking",
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
      formData: {},
      formDataDefault: {},

      headers: [
        { text: "ID", value: "archanaBookingId" },
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
        { text: "Phone ", value: "phoneNo" },
        { text: "email ", value: "email" },
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

      kovilArchanaTypes: [],
      kovilPoojaTimes: [],
      kovils: [],
      natchaththirams: [],
      raasis: [],
    };
  },
  computed: {},
  created() {
   this.getDataFromApi();
    this.getKovils();
    this.getKovilArchanaTypes();
    this.getKovilPoojaTimes();
    this.getNatchaththiram();
    this.getRaasi();
  },
  methods: {
    getBookingStatus(val) {
      return getBookingStatus(val);
    },
    getBookingStatusColor(val) {
      return getBookingStatusColor(val);
    },

    getAliveStatus(val) {
      return getAliveStatus(val);
    },
    getStatusColor(val) {
      return getStatusColor(val);
    },

    getSelectedColor() {
      return getSelectedColor();
    },
    getSelectedItemColor() {
      return getSelectedItemColor();
    },

    toggle(item) {
      this.opened.splice(this.indexToggle, 1);
      this.indexToggle = this.opened.indexOf(item.archanaBookingId);
      if (this.indexToggle > -1) {
        this.opened.splice(this.indexToggle, 1);
      } else {
        this.viewCustomerInfo(item.archanaBookingId);
        this.opened.push(item.archanaBookingId);
      }
    },
    closeToggle(item) {
      this.archanaInfo = [];
      this.indexToggle = this.opened.indexOf(item.archanaBookingId);
      if (this.indexToggle > -1) {
        this.opened.splice(this.indexToggle, 1);
      } else {
        this.viewCustomerInfo(item.archanaBookingId);
        this.opened.push(item.archanaBookingId);
      }
    },
    viewCustomerInfo(archanaBookingId) {
      try {
        var newArray = [];
        newArray = this.itemsLocal.find(
          (x) => x.archanaBookingId === archanaBookingId
        );
        this.archanaInfo = newArray.archanaPersons;
        console.log(this.archanaInfo);
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
        return this.kovils.find((x) => x.kovilId === value).kovilName;
      } catch {
        return "Null";
      }
    },
    getKovilArchanaTypes() {
      axios
        .post("KovilArchnaType/findAll")
        .then((response) => {
          if (response.data.success) {
            this.kovilArchanaTypes = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          failedToast(statusMessage(error.response.status));
        });
    },
    getKovilArchanaById(value) {
      try {
        console.log("KovilArchnaType", this.kovilArchanaTypes);
        var result = this.kovilArchanaTypes.find(
          (x) => x.kovilArchanaTypeId === value
        );
        var name = result.archanaType.name;
        return name;
      } catch {
        return "Null";
      }
    },
    getKovilPoojaTimes() {
      axios
        .post("KovilPoojaTime/findAll")
        .then((response) => {
          if (response.data.success) {
            // console.log(response.data.data);
            this.kovilPoojaTimes = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          failedToast(statusMessage(error.response.status));
        });
    },
    getKovilPoojaTimeById(value) {
      try {
        var result = this.kovilPoojaTimes.find(
          (x) => x.kovilPoojaTimeId === value
        );
        var poojaTime = result.poojaTime.name + "\n" + result.poojaTime.time;

        return poojaTime;
      } catch {
        return "Null";
      }
    },

    getNatchaththiram() {
      axios
        .post("Natchaththiram/findAll")
        .then((response) => {
          if (response.data.success) {
            this.natchaththirams = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          failedToast(statusMessage(error.response.status));
        });
    },
    getNatchaththiramyId(value) {
      try {
        return this.natchaththirams.find((x) => x.natchaththiramId === value)
          .name;
      } catch {
        return "Null";
      }
    },

    getRaasi() {
      axios
        .post("Raasi/findAll")
        .then((response) => {
          if (response.data.success) {
            this.raasis = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          failedToast(statusMessage(error.response.status));
        });
    },
    getRaasiById(value) {
      try {
        return this.raasis.find((x) => x.raasiId === value).name;
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
            failedToast(statusMessage(error.response.status));
            this.isLoading = false;
          });
      } else {
        axios
          .post(`${this.cName}/findAll`)
          .then((response) => {
            if (response.data.success) {
              this.items = response.data.data;
              this.itemsCount = this.items.length;
              console.log("this.cName", this.items);
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
      var itemId = this.formData.archanaBookingId;
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
          failedToast(statusMessage(error.response.status));
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
      var itemId = this.formData.archanaBookingId;
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
      var itemId = this.formData.archanaBookingId;
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
