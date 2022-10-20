<template>
  <Loading
    opacity="0.5"
    background-color="white"
    v-model:active="isLoading"
    color="#164e63"
    loader="dots"
    :width="50"
    :height="50"
    :is-full-page="loadingFullPage"
    z-index="100000"
  />
  <div>
    <div class="mt-5 w-full">
      <div
        class="intro-y lg:flex lg:flex-row lg:items-center lg:space-x-2 lg:justify-between md:flex md:flex-row md:items-center md:space-x-1 md:justify-between flex flex-wrap flex-col justify-end items-end mt-2 w-full"
      >
        <div class="flex space-x-1">
          <a
            href="javascript:;"
            @click="showModal()"
            class="btn btn-primary shadow-md lg:w-auto w-1/2 text-xs lg:text-sm"
          >
            Add New Section
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
                  <PrinterIcon class="lg:w-6 lg:h-6 w-4 h-4" /> Print
                </DropdownItem>
                <DropdownItem @click="csvExport">
                  <FileTextIcon class="lg:w-6 lg:h-6 w-4 h-4" /> Export to Excel
                </DropdownItem>
                <DropdownItem @click="pdfExport">
                  <FileTextIcon class="lg:w-6 lg:h-6 w-4 h-4" /> Export to PDF
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
          <div class="hidden md:block mx-auto text-slate-500">
            <!-- Showing 1 to 10 of 150 entries -->
          </div>
        </div>
        <a
          href="javascript:;"
          @click="viewArchives()"
          class="btn btn-primary shadow-md text-xs lg:text-sm mt-2 lg:mt-0 md:mt-0"
        >
          ARCHIVE
          <span
            class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
          >
            <ArchiveIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
          </span>
        </a>
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
              <th>DESC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>

              <td class="">
                <div class="text-left line-clamp-2">
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    :content="item.description"
                  >
                    {{ item.description }}
                  </Tippy>
                </div>
              </td>

              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <a
                    @Click="editItem(item)"
                    class="flex items-center mr-3"
                    href="javascript:;"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Edit"
                      ><EditIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                      />
                    </Tippy>
                  </a>
                  <a
                    class="flex items-center text-danger"
                    href="javascript:;"
                    @click="archiveItem(item)"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Archive"
                    >
                      <ArchiveIcon
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
        class="intro-y w-full lg:flex lg:flex-row lg:flex-wrap lg:items-center md:flex md:flex-row md:flex-wrap md:items-center flex flex-col items-center justify-center p-2"
        style="z-index: 99999; background-color: #164e63; border-radius: 10px"
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
    </div>
    <!-- END: Pagination -->
  </div>
  <!-- BEGIN: Add  Modal -->

  <Modal :show="addSection" @hidden="addSection = false" backdrop="static">
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">{{ formTitle }}</h2>
    </ModalHeader>
    <ModalBody class="flex justify-center space-y-4">
      <div class="flex flex-col space-y-4 w-full">
        <div>
          <label for="regular-form-1" class="form-label">Name</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSection.name"
              type="text"
              class="form-control"
              name="SectionName"
              placeholder="Storage Section Name"
            />
          </div>
        </div>
        <div>
          <label for="regular-form-1" class="form-label">Abbreviation</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSection.abbreviation"
              type="text"
              class="form-control"
              name="SectionAbbreviation"
              placeholder="Storage Section Abbreviation"
            />
          </div>
        </div>

        <div class="flex space-x-2 w-full">
          <div class="flex flex-col space-y-1 w-full">
            <label for="regular-form-1" class="form-label">Warehouse</label>
            <!-- <input
              id="vertical-form-1"
              v-model="formDataSection.warehouseId"
              type="text"
              class="form-control"
              @click="inputWarehouse == false"
            /> -->
            <TomSelect
              v-model="formDataSection.warehouseId"
              :options="{
                placeholder: 'Search..',
              }"
              class="w-full"
            >
              <!-- <option class="hidden">SELECT</option> -->
              <!-- CHANGES -->
              <option v-if="titleChange != -1">
                {{ formDataSection.warehouseName }}
              </option>
              <option v-if="titleChange == -1">SELECT</option>
              <option
                :value="item.warehouseId"
                v-for="(item, i) in warehouses"
                :key="i"
              >
                {{ item.name }}
              </option>
            </TomSelect>
          </div>

          <div class="flex flex-col space-y-1 w-full">
            <label for="regular-form-1" class="form-label">Storage Type</label>

            <TomSelect
              v-model="formDataSection.storageTypeId"
              :options="{
                placeholder: 'Search..',
              }"
              class="w-full"
            >
              <!-- CHANGES -->
              <option v-if="titleChange != -1">
                {{ formDataSection.storageTypeName }}
              </option>
              <option v-if="titleChange == -1">SELECT</option>
              <option
                :value="item.storageTypeId"
                v-for="(item, i) in storageTypes"
                :key="i"
              >
                {{ item.name }}
              </option>
            </TomSelect>
          </div>
        </div>

        <div>
          <label for="regular-form-1" class="form-label">Description</label>

          <div class="flex flex-col space-y-1">
            <textarea
              id="vertical-form-1"
              v-model="formDataSection.description"
              type="text"
              class="form-control"
              name="SectionDescription"
              placeholder="Type here about Storage Section..."
            ></textarea>
          </div>
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
  <!-- END: Add Modal -->

  <!-- BEGIN: Archive Modal -->
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
        Archived Storage Sections
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
    :name="formDataSection.name"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formDataSection.name"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formDataSection.name"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete"
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

import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../../global-functions/functions";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { const_txt } from "../../../global-functions/const";

import { exportCSVFile } from "../../../global-functions/functions";

export default {
  components: {
    Loading,
    paginate: Paginate,
  },
  data() {
    return {
      isLoading: false,
      searchData: "",
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,

      addSection: false,
      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,
      titleChange: -1,
      formDataSection: {
        name: "",
        description: "",
        abbreviation: "",
        storageTypeId: "",
        warehouseId: "",
      },
      formDataSectionDefault: {
        name: "",
        description: "",
        abbreviation: "",
        storageTypeId: "",
        warehouseId: "",
      },

      rules: {
        name: {
          required,
          minLength: minLength(2),
        },
        description: {
          required,
          minLength: minLength(2),
        },
        abbreviation: {
          required,
          maxLength: maxLength(10),
        },
        storageTypeId: {
          required,
          maxLength: maxLength(10),
        },
        warehouseId: {
          required,
          maxLength: maxLength(10),
        },

        isActive: 0,
        docs: null,
      },

      headers: [
        { text: "Abbreviation", value: "abbreviation" },
        // { text: "ID", value: "storageSectionId" },
        { text: "Name", value: "name" },
        // { text: "Description", value: "description" },

        { text: "Storage Type", value: "storageTypeName" },
        { text: "Warehouse", value: "warehouseName" },
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

      storageTypes: [],
      warehouses: [],

      allItems: [],
      allItemsData: [],
    };
  },
  computed: {
    formTitle() {
      return this.titleChange === -1
        ? "Add New Storage Section"
        : "Edit Storage Section";
    },
  },
  created() {
    this.getDataFromApi();
  },
  methods: {
    setReports() {
      if (this.allItems <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        const columns = [
          { title: "Abbreviation", dataKey: "abbreviation" },
          { title: "Name", dataKey: "name" },
          { title: "Storage Type", dataKey: "storageTypeName" },
          { title: "Warehouse", dataKey: "warehouseName" },
          { title: "Description", dataKey: "description" },
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
            abbreviation: el.abbreviation,
            name: el.name,
            storageTypeName: el.storageTypeName,
            warehouseName: el.warehouseName,
            description: el.description,
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
      this.docs.save(`${"Storage Section " + generateDate}.pdf`);
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
        var csvTitle = "Storage Section " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "Abbreviation",
          2: "Name",
          3: "Storage Type",
          4: "Warehouse",
          5: "Description",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.abbreviation,
            2: item.name,
            3: item.storageTypeName,
            4: item.warehouseName,
            5: item.description,
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
        .post("StorageSections/Paginated", pagination)
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

    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("StorageSections/Paginated", this.pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsData = response.data.data;
            this.items = response.data.data.items;
            this.pageCount = this.itemsData.totalPages;
            this.isLoading = false;
          } else {
            warningToast(response.data.message);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          localStorage.setItem("errorMessage", error);
          router.push("/page-down");
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
      this.formDataSection = Object.assign({}, this.formDataSectionDefault);
    },

    showModal() {
      //CHANGES
      this.titleChange = -1;
      this.setDefault();
      this.activateModal();
    },

    activateModal() {
      //CHANGES
      this.getStorageTypes();
      this.getWarehouses();
      this.addSection = true;
    },

    closeForm() {
      this.addSection = false;
    },

    editItem(item) {
      //CHANGES

      this.titleChange = 0;
      this.formDataSection = Object.assign({}, item);
      this.activateModal();
    },
    getStorageTypes() {
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("StorageTypes/Paginated", pagination)
        .then((response) => {
          this.storageTypes = response.data.data.items;

          //CHANGES
          // if (this.storageTypes.length > 0) {
          //   this.formDataSection.storageTypeId =
          //     this.storageTypes[0].storageTypeId;
          // } else
          if (this.storageTypes.length == 0) {
            warningToast("Please Add Items in Storage Type");
            this.addSection = false;
          }
          //
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    getWarehouses() {
      var pagination = { pageNumber: 1, pageSize: 1000 };
      axios
        .post("Warehouses/Paginated", pagination)
        .then((response) => {
          this.warehouses = response.data.data.items;
          //CHANGES
          // if (this.warehouses.length > 0) {
          //   if (this.titleChange === -1) {
          //     this.formDataSection.warehouseId = this.warehouses[0].warehouseId;
          //   }
          // } else
          if (this.warehouses.length == 0) {
            warningToast("Please Add Items in Warehouse");
            this.addSection = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    saveForm() {
      if (
        this.formDataSection.name == "" ||
        this.formDataSection.abbreviation == "" ||
        this.formDataSection.storageTypeId == "" ||
        this.formDataSection.warehouseId == "" ||
        this.formDataSection.storageTypeId == "SELECT" ||
        this.formDataSection.warehouseId == "SELECT"
      ) {
        if (this.formDataSection.name == "") {
          warningToast("Name Required");
        }
        if (this.formDataSection.abbreviation == "") {
          warningToast("Abbreviation Required");
        }
        if (
          this.formDataSection.storageTypeId == "" ||
          this.formDataSection.storageTypeId == "SELECT"
        ) {
          warningToast("Storage Type Required");
        }
        if (
          this.formDataSection.warehouseId == "" ||
          this.formDataSection.warehouseId == "SELECT"
        ) {
          warningToast("Warehouse Required");
        }
      } else {
        if (this.titleChange === -1) {
          this.isLoading = true;
          axios
            .post("StorageSections", this.formDataSection)
            .then((response) => {
              if (response.data.success === true) {
                this.addSection = false;
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
          var itemId = this.formDataSection.storageSectionId;
          this.isLoading = true;
          axios
            .put("StorageSections/" + itemId, this.formDataSection)
            .then((response) => {
              if (response.data.success === true) {
                this.addSection = false;
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
      this.formDataSection = Object.assign({}, item);
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
    archiveItemConfirm() {
      var itemId = this.formDataSection.storageSectionId;
      this.isLoading = true;
      axios
        .get("StorageSections/" + itemId + "/Archive")
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
        .post("StorageSections/Archived", this.paginationArchive)
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
    restoreItem(item) {
      this.formDataSection = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.formDataSection.storageSectionId;
      this.isLoading = true;
      axios
        .get("StorageSections/" + itemId + "/Restore")
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
      this.formDataSection = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataSection.storageSectionId;
      axios
        .delete("StorageSections/" + itemId)
        .then((response) => {
          if (response.data.success === true) {
            this.deleteConfirmationModal = false;
            this.viewArchives();
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
  },
};
</script>
