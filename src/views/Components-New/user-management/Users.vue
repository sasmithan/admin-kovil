<template>
  <Loading
    opacity="0.5"
    background-color="white"
    :can-cancel="true"
    v-model:active="isLoading"
    color="#164e63"
    loader="dots"
    :width="50"
    :height="50"
    :is-full-page="loadingFullPage"
    z-index="100000"
  />

  <div class="mt-5 w-full">
    <div
      class="intro-y lg:flex lg:flex-row lg:items-center lg:space-x-2 lg:justify-between md:flex md:flex-row md:items-center md:space-x-1 md:justify-between flex flex-wrap flex-col justify-end items-end mt-2 w-full"
    >
      <div class="flex space-x-1">
        <a
          v-if="canCreate"
          href="javascript:;"
          @click="showModal()"
          class="btn btn-primary shadow-md lg:w-auto w-1/2 text-xs lg:text-sm"
        >
          Add New User
        </a>
        <Dropdown>
          <DropdownToggle class="btn px-2 box">
            <span class="w-5 h-5 flex items-center justify-center">
              <ArrowDownIcon class="lg:w-6 lg:h-6 w-4 h-4" />
            </span>
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem @click="printExport">
                <PrinterIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" /> Print
              </DropdownItem>
              <DropdownItem @click="csvExport">
                <FileTextIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" /> Export to
                Excel
              </DropdownItem>
              <DropdownItem @click="pdfExport">
                <FileTextIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" /> Export to
                PDF
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>

        <div class="w-56">
          <div class="relative text-slate-500">
            <input
              type="text"
              class="form-control box pr-10"
              placeholder="Search..."
              v-model="searchData"
              @change="searchOnchange"
              autocomplete="off"
            />
            <SearchIcon
              @click="searchItem"
              v-if="!searchActive"
              class="lg:w-6 lg:h-6 w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
            />
            <XIcon
              @click="clearSearch"
              v-if="searchActive"
              class="lg:w-6 lg:h-6 w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
            />
          </div>
        </div>
        <div class="hidden md:block mx-auto text-slate-500"></div>
      </div>
      <!-- <a
        href="javascript:;"
        @click="viewArchives()"
        class="btn btn-primary shadow-md text-xs lg:text-sm mt-2 lg:mt-0 md:mt-0"
      >
        {{ const_txt.ARCHIVE_BTN }}
        <span
          class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
        >
          <ArchiveIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
        </span>
      </a> -->
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto">
      <table class="table table-report -mt-2 table-auto">
        <thead>
          <tr class="uppercase whitespace-nowrap">
            <th
              class="whitespace-nowrap"
              v-for="(header, i) in headers"
              :key="i"
            >
              {{ header.text }}
            </th>
            <th>Active/Deactive</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i" class="intro-x">
            <td v-for="(header, index) in headers" :key="index">
              {{ item[header.value] }}
            </td>
            <td>
              <div class="form-switch ml-3">
                <input
                  @click="lockout(item)"
                  id="booleanSwitch"
                  type="checkbox"
                  v-model="item.lockoutEnabled"
                  class="form-check-input"
                />
              </div>
            </td>
            <td class="table-report__action w-56">
              <div class="flex justify-center items-center">
                <!-- <a
                  @Click="editItem(item)"
                  class="flex items-center mr-3"
                  href="javascript:;"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="Edit"
                  >
                    <EditIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                  </Tippy>
                </a> -->
                <a
                  class="flex items-center text-danger"
                  href="javascript:;"
                  @click="deleteItem(item)"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="Delete"
                  >
                    <Trash2Icon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                  </Tippy>
                </a>
                <a
                  @Click="editItem(item)"
                  class="flex items-center mr-3"
                  href="javascript:; "
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="Edit"
                  >
                    <EditIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                  </Tippy>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- END: Data List -->
    <LoadMoreData :itemsData="itemsData" :loadMoreData="loadMoreData" />
    <NoData :itemsData="itemsData" />
    <!-- BEGIN: Pagination -->

    <div
      v-if="itemsData.totalCount > 0 && itemsData.totalPages > 1"
      class="intro-y lg:flex lg:flex-row lg:flex-wrap lg:items-center md:flex md:flex-row md:flex-wrap md:items-center flex flex-col items-center justify-center p-2"
      style="background-color: #164e63; border-radius: 10px"
    >
      <div
        class="w-full sm:w-auto sm:mr-auto"
        style="
          background-color: #e1e7ef;
          border: 2px solid #164e63;
          border-radius: 10px;
        "
      >
        <paginate
          class="text-white"
          :page-count="pageCount"
          :page-range="5"
          :margin-pages="2"
          :click-handler="changePage"
          :container-class="'pagination'"
          :page-class="'page-item'"
          :first-last-button="true"
          :initial-page="initialPage"
          :prev-text="'<'"
          :next-text="'>'"
          :first-button-text="'<<'"
          :last-button-text="'>>'"
        >
        </paginate>
      </div>
      <div class="mr-2 text-white">Page Rows :</div>
      <select
        v-model="pageSize"
        class="w-20 form-select box cursor-pointer"
        @change="pageSizeChange"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option :value="pageSize">{{ pageSize }}</option>
      </select>
    </div>

    <!-- END: Pagination -->
  </div>

  <!-- BEGIN: Add  Modal -->

  <MoveableModal
    :show="addUser"
    @hidden="addUser = false"
    backdrop="static"
    size="modal-lg"
    :title="formTitle"
    @close="addUser = false"
  >
    <ModalBody class="grid grid-cols-2 lg:gap-4 md:gap-4 gap-2">
      <div class="w-full">
        <label for="regular-form-1" class="form-label">First Name</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataUser.firstName"
            type="text"
            class="form-control"
            name="firstName"
            placeholder="First Name"
            autocomplete="off"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Last Name</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataUser.lastName"
            type="text"
            class="form-control"
            name="lastName"
            placeholder="Last Name"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="w-full">
        <label for="regular-form-1" class="form-label">Email</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataUser.email"
            type="text"
            class="form-control"
            name="email"
            placeholder="Email"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="w-full">
        <label for="regular-form-1" class="form-label">User Name</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataUser.username"
            type="text"
            class="form-control"
            name="username"
            placeholder="User Name"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="w-full">
        <label for="regular-form-1" class="form-label">Password</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataUser.password"
            type="password"
            class="form-control"
            name="password"
            placeholder="password Name"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="w-full">
        <label for="regular-form-1" class="form-label">Confirm Password</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataUser.conformPassword"
            type="password"
            class="form-control"
            name="conformPassword"
            placeholder="Confirm Password"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="w-full">
        <label for="regular-form-1" class="form-label">Phone Number</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataUser.phoneNumber"
            type="text"
            class="form-control"
            name="phoneNumber"
            placeholder="Phone Number"
            autocomplete="off"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">User Role</label>

        <TomSelect v-model="formDataUser.role" class="w-full">
          <option
            :value="formDataUser.role"
            v-if="titleChange != -1 && formDataUser.role != ''"
          >
            {{ formDataUser.role }}
          </option>

          <option v-if="formDataUser.role == ''">SELECT</option>

          <option :value="item.name" v-for="(item, i) in userRoles" :key="i">
            {{ item.name }}
          </option>
        </TomSelect>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="closeForm()"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        {{ const_txt.CANCEL_BTN }}
      </button>
      <button @click="saveForm()" type="submit" class="btn btn-primary w-24">
        {{ btnName }}
      </button>
    </ModalFooter>
  </MoveableModal>
  <!-- END: Add Modal -->

  <!-- BEGIN: Archive Modal -->
  <!-- not used -->
  <Modal
    :show="archiveModal"
    @hidden="archiveModal = false"
    size="modal-sl-80"
    backdrop="static"
  >
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="archiveModal = false"
        />
      </div>

      <div class="p-5 text-center lg:text-lg text-base uppercase font-semibold">
        Archived user
      </div>
      <hr />
      <!-- SEARCH -->
      <div class="w-full sm:w-auto mt-3 sm:mt-0">
        <div class="w-full relative text-slate-500">
          <input
            type="text"
            class="form-control w-full box pr-10"
            placeholder="Search..."
            v-model="searchDataArchive"
            @change="searchOnchangeArchive"
            clearable
          />
          <SearchIcon
            @click="searchItemArchive"
            v-if="searchActiveArchive == false"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
          <XIcon
            @click="clearSearchArchive"
            v-if="searchActiveArchive == true"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
        </div>
      </div>
      <!-- SEARCH END-->
      <!-- BEGIN: Archive Data List -->
      <div
        class="p-5 text-center text-lg"
        v-if="this.archiveData.totalCount == 0"
      >
        No data
      </div>
      <div
        class="intro-y col-span-12 overflow-auto p-4"
        v-if="this.archiveData.totalCount > 0"
      >
        <table class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in headers"
                :key="i"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in archiveItems" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>

              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <a
                    @click="restoreItem(item)"
                    class="flex items-center mr-3 text-blue-900"
                    href="javascript:;"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Restore"
                      :options="{
                        zIndex: 99999,
                      }"
                    >
                      <RotateCcwIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                      />
                    </Tippy>
                  </a>

                  <a
                    class="flex items-center text-danger"
                    href="javascript:;"
                    @click="deleteItem(item)"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Delete"
                      :options="{
                        zIndex: 99999,
                      }"
                    >
                      <Trash2Icon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                      />
                    </Tippy>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- END: Archive Data List -->

      <!-- BEGIN: Pagination -->

      <div
        class="intro-y lg:flex lg:flex-row lg:flex-wrap lg:items-center md:flex md:flex-row md:flex-wrap md:items-center flex flex-col items-center justify-center p-2"
        style="background-color: #164e63"
        v-if="this.archiveData.totalCount > 0"
      >
        <div
          class="w-full sm:w-auto sm:mr-auto"
          style="
            background-color: #e1e7ef;
            border: 2px solid #164e63;
            border-radius: 10px;
          "
        >
          <paginate
            class="text-white"
            :page-count="pageCountArchive"
            :page-range="5"
            :margin-pages="2"
            :click-handler="changePageArchive"
            :container-class="'pagination'"
            :page-class="'page-item'"
            :first-last-button="true"
            :initial-page="1"
            :prev-text="'<'"
            :next-text="'>'"
            :first-button-text="'<<'"
            :last-button-text="'>>'"
          >
          </paginate>
        </div>
        <div class="mr-2 text-white">Page Rows :</div>
        <select
          v-model="pageSize"
          class="w-20 form-select box cursor-pointer"
          @change="pageSizeChange"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <!-- END: Pagination -->
    </ModalBody>
  </Modal>
  <!-- END: Archive Modal -->

  <!-- BEGIN: Confirmation Modals -->
  <ArchiveConfirmModal
    :name="formDataUser.userName"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formDataUser.userName"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formDataUser.userName"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete"
  />
  <DeactiveConfirmModal
    :name="formDataUser.userName"
    :modalStatus="deactiveConfirmationModal"
    :modalConfirm="deactiveItemConfirm"
    :modalClose="closeDeactive"
  />
  <ActiveConfirmModal
    :name="formDataUser.userName"
    :modalStatus="activeConfirmationModal"
    :modalConfirm="activeItemConfirm"
    :modalClose="closeActive"
  />
  <!-- END: Confirmation Modals -->
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";
import { required, minLength, maxLength, integer } from "@vuelidate/validators";
import axios from "../../../services/http-common";
import Paginate from "vuejs-paginate-next";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import router from "../../../router";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { const_txt } from "../../../global-functions/const";

import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../../global-functions/functions";

import {
  exportCSVFile,
  removeNullValue,
} from "../../../global-functions/functions";

import store from "../../../store";

export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Users");
  },
  components: {
    Loading,
    paginate: Paginate,
  },
  data() {
    return {
      const_txt: const_txt,
      userRoles: [],

      isLoading: false,
      searchData: "",
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,
      addUser: false,
      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,
      deactiveConfirmationModal: false,
      activeConfirmationModal: false,
      titleChange: -1,
      formDataUser: {
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        conformPassword: "",
        phoneNumber: "",
        role: "",
        lockoutEnabled: false,
      },
      formDataUserDefault: {
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        conformPassword: "",
        phoneNumber: "",
        role: "",
        lockoutEnabled: false,
      },

      headers: [
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
        { text: "Email", value: "email" },
        { text: "Username", value: "userName" },
        { text: "Phone Number", value: "phoneNumber" },
        { text: "User Role", value: "role" },
      ],
      pagination: {
        pageNumber: 1,
        pageSize: 10,
        search: "",
      },
      defaultPagination: {
        pageNumber: 1,
        pageSize: 10,
        search: "",
      },
      pageCount: 0,
      initialPage: 1,
      pageSize: 10,

      items: [],
      itemsData: [],
      archiveItems: [],
      archiveData: [],
      paginationArchive: {
        pageNumber: 1,
        pageSize: 5,
      },

      pageCountArchive: 20,

      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,
    };
  },
  computed: {
    btnName() {
      return this.titleChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },
    formTitle() {
      return this.titleChange === -1 ? "Add New User" : "Edit User";
    },
    canCreate() {
      return store.getters["authUser/getPermission"](
        "Permissions.Users.Create"
      );
    },
  },
  created() {
    this.getDataFromApi();
    this.getUserRoles();
  },
  methods: {
    userActivate(item) {
      console.log(item.id);
      this.isLoading = true;
      axios
        .get(`/api/Users/${item.id}/Activate`)
        .then((response) => {
          if (response.data.success === true) {
            successToast(response.data.message);

            this.isLoading = false;
          } else {
            item.lockoutEnabled = true;
            warningToast(response.data.message);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          item.lockoutEnabled = true;
          warningToast(statusMessage(error.response.status));
          this.isLoading = false;
        });
    },
    userDeactivate(item) {
      console.log(item.id);
      this.isLoading = true;
      axios
        .get(`/api/Users/${item.id}/Deactivate`)
        .then((response) => {
          if (response.data.success === true) {
            successToast(response.data.message);

            this.isLoading = false;
          } else {
            item.lockoutEnabled = false;
            warningToast(response.data.message);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          item.lockoutEnabled = false;
          warningToast(statusMessage(error.response.status));
          this.isLoading = false;
        });
    },
    lockout(item) {
      console.log(item);
      if (item.lockoutEnabled == true) {
        //item.lockoutEnabled = false;
        //this.userActivate(item);
        this.deactiveItem(item);
      } else {
        //item.lockoutEnabled = true;
        //this.userDeactivate(item);
        this.activeItem(item);
      }
    },

    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("Users/Paginated", this.pagination)

        .then((response) => {
          if (response.status === 200) {
            this.itemsData = response.data.data;
            console.log(this.itemsData);
            this.items = response.data.data.items;
            this.pageCount = this.itemsData.totalPages;

            this.isLoading = false;
          } else {

              warningToast(response.status);
              this.isLoading = false;
          }
        })
        .catch((error) => { 
          console.log(error)
          router.push("/login")
          this.isLoading = false;
           //warningToast(error.status);
          //warningToast(statusMessage(error.response.status));
        });
    },

    getUserRoles() {
      // this.userRoles = [
      //   { role: "Admin" },
      //   { role: "Supervisor" },
      //   { role: "Sales Rep" },
      //   { role: "User" },
      // ];
      this.isLoading = true;
      axios
        .get("Roles")
        .then((response) => {
          if (response.data.success === true) {
            this.userRoles = response.data.data;
          } else {
          }
        })
        .catch((error) => {});
    },

    setReports() {
      if (this.allItems <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        const columns = [
          { title: "Name", dataKey: "name" },
          { title: "Code", dataKey: "code" },
          { title: "Available", dataKey: "available" },
        ];
        this.docs = new jsPDF({
          orientation: "landscape",
          unit: "in",
          format: "a4",
        });

        let data = [];
        let i = 0;
        let obj;

        this.allItems.forEach((el) => {
          obj = {
            name: el.name,
            code: el.code,
            available: el.available,
          };
          //i++;
          data.push(obj);
          //   console.log(obj);
        });
        //console.log("DATA", data);

        // var imgData = "/src/assets/images/pl_logo2.png";
        // this.docs.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
        // this.docs
        //   .setFontSize(16)
        //   .text("Storage Bin", 5, 1.2);

        autoTable(this.docs, {
          theme: "grid",
          columns,
          body: data,
          headerStyles: {
            fontSize: 7,
            fillColor: [22, 78, 99],
            lineWidth: 0.01,
            lineColor: [22, 78, 99],
          },
          styles: {
            fontSize: 7,
            lineWidth: 0.01,
            lineColor: [0, 0, 0],
          },
          showHead: "firstPage",
          margin: { left: 0.5, top: 0.5 },
        });
      }
    },

    printExport() {
      this.getAllDataFromApi();
      this.isActive = 1;
    },

    pdfPrint() {
      this.setReports();
      this.docs.autoPrint();
      this.docs.output("dataurlnewwindow");
    },

    pdfExport() {
      this.getAllDataFromApi();
      this.isActive = 3;
    },

    pdfDownload() {
      this.setReports();
      var generateDate = new Date().toLocaleString();
      this.docs.save(`${"Users " + generateDate}.pdf`);
    },

    csvExport() {
      this.getAllDataFromApi();
      this.isActive = 2;
    },
    csvDownload() {
      if (this.allItems <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        var generateDate = new Date().toLocaleString();
        var csvTitle = "Users " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "Name",
          2: "Code",
          3: "Available",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.name,
            2: item.code,
            3: item.available,
          });
        });
        exportCSVFile(csvHeaders, csvItems, csvTitle);
      }
    },
    getAllDataFromApi() {
      var totalCount = this.itemsData.totalCount;
      var pagination = { pageNumber: 1, pageSize: totalCount };
      this.isLoading = true;
      axios
        .post("Users/Paginated", pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.allItemsData = response.data.data;
            this.allItems = response.data.data.items;
            if (this.isActive == 1) {
              this.pdfPrint();
            } else if (this.isActive == 2) {
              this.csvDownload();
            } else if (this.isActive == 3) {
              this.pdfDownload();
            }
            this.isLoading = false;
          } else {
            warningToast(response.data.message);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
          this.isLoading = false;
        });
    },

    searchOnchange() {
      if (this.searchData != "") {
        this.searchActive = true;
        this.searchItem();
      } else {
        this.clearSearch();
      }
    },
    clearSearch() {
      this.searchData = "";
      this.pagination.search = this.searchData;
      this.getDataFromApi();
      this.searchActive = false;
    },
    searchItem() {
      if (this.searchData != "") {
        this.searchActive = true;
        this.pagination.search = this.searchData;
        this.getDataFromApi();
      }
    },

    searchOnchangeArchive() {
      if (this.searchDataArchive != "") {
        this.searchActiveArchive = true;
        this.searchItemArchive();
      } else {
        this.clearSearchArchive();
      }
    },
    clearSearchArchive() {
      this.searchDataArchive = "";
      this.paginationArchive.search = this.searchDataArchive;
      this.viewArchives();
      this.searchActiveArchive = false;
    },
    searchItemArchive() {
      if (this.searchDataArchive != "") {
        this.searchActiveArchive = true;
        this.paginationArchive.search = this.searchDataArchive;
        this.viewArchives();
      }
    },
    loadMoreData() {
      this.pagination.pageSize = parseInt(this.pagination.pageSize) + 10;
      this.pageSize = this.pagination.pageSize;
      this.getDataFromApi();
    },
    pageSizeChange() {
      this.pagination.pageSize = this.pageSize;
      this.getDataFromApi();
    },
    changePage(pageNum) {
      this.pagination.pageNumber = pageNum;

      this.getDataFromApi();
    },
    setDefault() {
      this.formDataUser = Object.assign({}, this.formDataUserDefault);
    },

    showModal() {
      this.setDefault();
      this.titleChange = -1;
      this.addUser = true;
    },
    closeForm() {
      this.addUser = false;
    },
    editItem(item) {
      this.titleChange = 0;
      this.formDataUser = Object.assign({}, item);
      this.addUser = true;
    },

    saveForm() {
      if (
        this.formDataUser.username == "" ||
        this.formDataUser.password == "" ||
        this.formDataUser.conformPassword == "" ||
        this.formDataUser.role == "" ||
        this.formDataUser.role == "SELECT" ||
        this.formDataUser.password != this.formDataUser.conformPassword
      ) {
        if (this.formDataUser.username == "") {
          warningToast("user Name Required");
        }
        if (
          this.formDataUser.role == "" ||
          this.formDataUser.role == "SELECT"
        ) {
          warningToast("User Role Required");
        }
        if (this.formDataUser.password == "") {
          warningToast("Password Required");
        }
        if (this.formDataUser.conformPassword == "") {
          warningToast("Confirm Password Required");
        }
        if (
          this.formDataUser.password != "" &&
          this.formDataUser.conformPassword != "" &&
          this.formDataUser.password != this.formDataUser.conformPassword
        ) {
          warningToast("Password Mismatch");
        }
      } else {
        if (this.titleChange === -1) {
          this.isLoading = true;
          axios
            .post("Users", this.formDataUser)
            .then((response) => {
              if (response.data.success === true) {
                this.addUser = false;
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
        } else {
          var itemId = this.formDataUser.userId;
          this.isLoading = true;
          axios
            .put("Users/" + itemId, this.formDataUser)
            .then((response) => {
              if (response.data.success === true) {
                this.addUser = false;
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
        }
      }
    },
    archiveItem(item) {
      this.formDataUser = Object.assign({}, item);
      this.archiveConfirmationModal = true;
    },
    closeRestore() {
      this.restoreConfirmationModal = false;
      this.setDefault();
    },

    closeDelete() {
      this.deleteConfirmationModal = false;
      this.setDefault();
    },
    closeArchive() {
      this.archiveConfirmationModal = false;
      this.setDefault();
    },
    closeDeactive() {
      this.deactiveConfirmationModal = false;
      this.setDefault();
    },
    closeActive() {
      this.activeConfirmationModal = false;
      this.setDefault();
    },
    archiveItemConfirm() {
      var itemId = this.formDataUser.userId;
      this.isLoading = true;
      axios
        .get("Users/" + itemId + "/Archive")
        .then((response) => {
          if (response.data.success === true) {
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
    viewArchives() {
      this.isLoading = true;
      axios
        .post("Users/Archived", this.paginationArchive)
        .then((response) => {
          if (response.data.success === true) {
            this.archiveData = response.data.data;
            this.archiveItems = response.data.data.items;
            this.pageCountArchive = this.archiveData.totalPages;
            this.isLoading = false;
            this.archiveModal = true;
          } else {
            this.isLoading = false;
            warningToast(statusMessage(error.response.status));
          }

          this.archiveModal = true;
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },

    changePageArchive(pageNum) {
      this.paginationArchive.pageNumber = pageNum;
      this.viewArchives();
    },

    deactiveItem(item) {
      this.formDataUser = Object.assign({}, item);
      this.deactiveConfirmationModal = true;
    },
    deactiveItemConfirm(item) {
      this.isLoading = true;
      var item = this.formDataUser;
      axios
        .get(`/api/Users/${item.id}/Deactivate`)
        .then((response) => {
          if (response.data.success === true) {
            this.deactiveConfirmationModal = false;
            successToast(response.data.message);

            this.isLoading = false;
          } else {
            item.lockoutEnabled = true;
            this.deactiveConfirmationModal = true;
            warningToast(response.data.message);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          item.lockoutEnabled = true;
          warningToast(statusMessage(error.response.status));
          this.isLoading = false;
        });
    },
    activeItem(item) {
      this.formDataUser = Object.assign({}, item);
      this.activeConfirmationModal = true;
    },
    activeItemConfirm() {
      this.isLoading = true;
      var item = this.formDataUser;
      axios
        .get(`/api/Users/${item.id}/Activate`)
        .then((response) => {
          if (response.data.success === true) {
            this.activeConfirmationModal = false;
            successToast(response.data.message);

            this.isLoading = false;
          } else {
            item.lockoutEnabled = true;
            this.activeConfirmationModal = false;
            warningToast(response.data.message);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          item.lockoutEnabled = true;
          warningToast(statusMessage(error.response.status));
          this.isLoading = false;
        });
    },

    restoreItem(item) {
      this.formDataUser = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },

    restoreItemConfirm() {
      var itemId = this.formDataUser.userId;
      this.isLoading = true;
      axios
        .get("Users/" + itemId + "/Restore")
        .then((response) => {
          if (response.data.success === true) {
            this.restoreConfirmationModal = false;
            this.viewArchives();
            this.getDataFromApi();
            successToast(response.data.message);
            if (this.archiveData.totalCount == 0) {
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
    deleteItem(item) {
      removeNullValue(item);
      this.formDataUser = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataUser.id;
      axios
        .delete("Users/" + itemId)
        .then((response) => {
          if (response.data.success === true) {
            this.deleteConfirmationModal = false;
            successToast(response.data.message);
            this.getDataFromApi();
          } else {
            this.isLoading = false;
            this.deleteConfirmationModal = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },
  },
};
</script>
