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
  <div>
    <!-- BEGIN: Success Notification Content -->
    <!-- <div v-for="(item, i) in state.allMessages" :key="i">
      <div
        id="success-notification-content"
        class="toastify-content w-1/4 flex fixed z-50 right-0 -mt-20"
        style="z-index: 99999"
      >
        <CheckCircleIcon class="text-success" />
        <div class="ml-4 mr-4">
          <div class="font-medium">{{ item }}</div>
          <div class="text-slate-500 mt-1"></div>
        </div>
      </div>
    </div> -->

    <!-- END: Success Notification Content -->

    <div class="mt-5 w-full">
      <div
        class="
          intro-y
          lg:flex lg:flex-row lg:items-center lg:space-x-2 lg:justify-between
          md:flex md:flex-row md:items-center md:space-x-1 md:justify-between
          flex flex-wrap flex-col
          justify-end
          items-end
          mt-2
          w-full
        "
      >
        <div class="flex space-x-1">
          <a
            href="javascript:;"
            @click="showModal()"
            class="btn btn-primary shadow-md lg:w-auto w-1/2 text-xs lg:text-sm"
          >
            Add New Warehouse
          </a>
          <Dropdown>
            <DropdownToggle class="btn px-2 box">
              <span class="w-5 h-5 flex items-center justify-center">
                <ArrowDownIcon class="lg:w-6 lg:h-6 w-4 h-4" />
              </span>
            </DropdownToggle>
            <DropdownMenu class="w-40">
              <DropdownContent>
                <DropdownItem>
                  <PrinterIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" /> Print
                </DropdownItem>
                <DropdownItem>
                  <FileTextIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" /> Export to
                  Excel
                </DropdownItem>
                <DropdownItem>
                  <FileTextIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" /> Export to
                  PDF
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>

          <!-- SEARCH -->
          <div class="w-56">
            <div class="relative text-slate-500">
              <input
                type="text"
                class="form-control box pr-10"
                placeholder="Search..."
                v-model="state.searchData"
                @change="searchOnchange"
                clearable
              />
              <SearchIcon
                @click="searchItem"
                v-if="!searchActive"
                class="
                  lg:w-6 lg:h-6
                  w-4
                  h-4
                  absolute
                  my-auto
                  inset-y-0
                  mr-3
                  right-0
                  cursor-pointer
                "
              />
              <XIcon
                @click="clearSearch"
                v-if="searchActive"
                class="
                  lg:w-6 lg:h-6
                  w-4
                  h-4
                  absolute
                  my-auto
                  inset-y-0
                  mr-3
                  right-0
                  cursor-pointer
                "
              />
            </div>
          </div>
          <!-- SEARCH END-->
          <div class="hidden md:block mx-auto text-slate-500">
            <!-- Showing 1 to 10 of 150 entries -->
          </div>
        </div>
        <a
          href="javascript:;"
          @click="viewArchives()"
          class="
            btn btn-primary
            shadow-md
            text-xs
            lg:text-sm
            mt-2
            lg:mt-0
            md:mt-0
          "
        >
          ARCHIVE
          <span
            class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
          >
            <ArchiveIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
          </span>
        </a>
      </div>

      <!-- BEGIN: HTML Table Data -->
      <div class="intro-y box p-5 mt-5">
        <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
          <form id="tabulator-html-filter-form" class="xl:flex sm:mr-auto">
            <div class="sm:flex items-center sm:mr-4">
              <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2"
                >Field</label
              >
              <select
                id="tabulator-html-filter-field"
                v-model="filter.field"
                class="
                  form-select
                  w-full
                  sm:w-32
                  2xl:w-full
                  mt-2
                  sm:mt-0 sm:w-auto
                "
              >
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="remaining_stock">Remaining Stock</option>
              </select>
            </div>
            <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
              <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2"
                >Type</label
              >
              <select
                id="tabulator-html-filter-type"
                v-model="filter.type"
                class="form-select w-full mt-2 sm:mt-0 sm:w-auto"
              >
                <option value="like" selected>like</option>
                <option value="=">=</option>
                <option value="<">&lt;</option>
                <option value="<=">&lt;=</option>
                <option value=">">></option>
                <option value=">=">>=</option>
                <option value="!=">!=</option>
              </select>
            </div>
            <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
              <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2"
                >Value</label
              >
              <input
                id="tabulator-html-filter-value"
                v-model="filter.value"
                type="text"
                class="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0"
                placeholder="Search..."
              />
            </div>
            <div class="mt-2 xl:mt-0">
              <button
                id="tabulator-html-filter-go"
                type="button"
                class="btn btn-primary w-full sm:w-16"
                @click="onFilter"
              >
                Go
              </button>
              <button
                id="tabulator-html-filter-reset"
                type="button"
                class="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 sm:ml-1"
                @click="onResetFilter"
              >
                Reset
              </button>
            </div>
          </form>
          <div class="flex mt-5 sm:mt-0">
            <button
              id="tabulator-print"
              class="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
              @click="onPrint"
            >
              <PrinterIcon class="w-4 h-4 mr-2" /> Print
            </button>
            <Dropdown class="w-1/2 sm:w-auto">
              <DropdownToggle
                class="btn btn-outline-secondary w-full sm:w-auto"
              >
                <FileTextIcon class="w-4 h-4 mr-2" /> Export
                <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
              </DropdownToggle>
              <DropdownMenu class="w-40">
                <DropdownContent>
                  <DropdownItem @click="onExportCsv">
                    <FileTextIcon class="w-4 h-4 mr-2" /> Export CSV
                  </DropdownItem>
                  <DropdownItem @click="onExportJson">
                    <FileTextIcon class="w-4 h-4 mr-2" /> Export JSON
                  </DropdownItem>
                  <DropdownItem @click="onExportXlsx">
                    <FileTextIcon class="w-4 h-4 mr-2" /> Export XLSX
                  </DropdownItem>
                  <DropdownItem @click="onExportHtml">
                    <FileTextIcon class="w-4 h-4 mr-2" /> Export HTML
                  </DropdownItem>
                </DropdownContent>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div class="overflow-x-auto scrollbar-hidden">
          <div
            id="tabulator"
            ref="tableRef"
            class="mt-5 table-report table-report--tabulator"
          ></div>
        </div>
      </div>
      <!-- END: HTML Table Data -->

      <!-- BEGIN: Data List -->
      <div class="intro-y col-span-12 overflow-auto">
        <table class="table table-report -mt-2 table-auto">
          <thead>
            <tr>
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in state.headers"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>DESC</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, i) in state.items" :key="i" class="intro-x">
              <td v-for="(header, index) in state.headers" :key="index">
                {{ item[header.value] }}
              </td>

              <td class="w-24">
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

      <!-- BEGIN: Pagination -->

      <div
        v-if="state.itemsData.totalCount > 0"
        class="
          intro-y
          lg:flex lg:flex-row lg:flex-wrap lg:items-center
          md:flex md:flex-row md:flex-wrap md:items-center
          flex flex-col
          items-center
          justify-center
          p-2
        "
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
    </div>
  </div>
  <!-- BEGIN: Add  Modal -->

  <Modal :show="addWarehouse" @hidden="addWarehouse = false" backdrop="static">
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">{{ formTitle }}</h2>
    </ModalHeader>
    <ModalBody class="flex justify-center space-y-4">
      <div class="flex flex-col space-y-4 w-full">
        <div>
          <label for="regular-form-1" class="form-label">Warehouse Name</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="state.formDataWarehouse.name"
              type="text"
              class="form-control"
              name="name"
              placeholder="Warehouse Name"
            />
          </div>
        </div>
        <div>
          <label for="regular-form-1" class="form-label"
            >Warehouse Abbreviation</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="state.formDataWarehouse.abbreviation"
              type="text"
              class="form-control"
              name="abbreviation"
              placeholder="Warehouse Abbreviation"
            />
          </div>
        </div>

        <div>
          <label for="regular-form-1" class="form-label"
            >Warehouse Description</label
          >

          <div class="flex flex-col space-y-1">
            <textarea
              id="vertical-form-1"
              v-model="state.formDataWarehouse.description"
              type="text"
              class="form-control"
              name="description"
              placeholder="Type here about Warehouse..."
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

  <!-- BEGIN: Archive Confirmation Modal -->
  <Modal
    :show="archiveConfirmationModal"
    @hidden="archiveConfirmationModal = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <ArchiveIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-xl font-bold mt-5">
          {{ state.formDataWarehouse.name }}
        </div>
        <div class="text-slate-500 mt-2">
          Do you really want to delete these records? <br />This process cannot
          be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="closeArchive()"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-danger w-24"
          @click="archiveItemConfirm()"
        >
          Archive
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Archive Confirmation Modal -->

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
          class="
            text-danger
            float-right
            lg:w-8 lg:h-8
            md:w-7 md:h-7
            w-6
            h-6
            cursor-pointer
          "
          @click="archiveModal = false"
        />
      </div>

      <div class="p-5 text-center lg:text-lg text-base uppercase font-semibold">
        Archived Warehouses
      </div>
      <hr />
      <!-- SEARCH -->
      <div class="w-full sm:w-auto mt-3 sm:mt-0">
        <div class="w-full relative text-slate-500">
          <input
            type="text"
            class="form-control w-full box pr-10"
            placeholder="Search..."
            v-model="state.searchDataArchive"
            @change="searchOnchangeArchive"
            clearable
          />
          <SearchIcon
            @click="searchItemArchive"
            v-if="searchActiveArchive == false"
            class="
              w-6
              h-6
              absolute
              my-auto
              inset-y-0
              mr-3
              right-0
              cursor-pointer
            "
          />
          <XIcon
            @click="clearSearchArchive"
            v-if="searchActiveArchive == true"
            class="
              w-6
              h-6
              absolute
              my-auto
              inset-y-0
              mr-3
              right-0
              cursor-pointer
            "
          />
        </div>
      </div>
      <!-- SEARCH END-->
      <hr />
      <!-- BEGIN: Archive Data List -->
      <div
        class="p-5 text-center text-lg"
        v-if="state.archiveData.totalCount == 0"
      >
        No data
      </div>
      <div
        class="intro-y col-span-12 overflow-auto p-4"
        v-if="state.archiveData.totalCount > 0"
      >
        <table class="table table-report -mt-2 table-auto">
          <thead>
            <tr>
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in state.headers"
                :key="i"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in state.archiveItems"
              :key="i"
              class="intro-x"
            >
              <td v-for="(header, index) in state.headers" :key="index">
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
        class="
          intro-y
          lg:flex lg:flex-row lg:flex-wrap lg:items-center
          md:flex md:flex-row md:flex-wrap md:items-center
          flex flex-col
          items-center
          justify-center
          p-2
        "
        style="background-color: #164e63"
        v-if="state.archiveData.totalCount > 0"
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
          v-model="pageSizeArchive"
          class="w-20 form-select box cursor-pointer"
          @change="pageSizeChangeArchive"
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

  <!-- BEGIN: Archive Confirmation Modal -->
  <Modal
    :show="restoreConfirmationModal"
    @hidden="restoreConfirmationModal = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <RotateCcwIcon class="w-16 h-16 text-green-600 mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-xl font-bold mt-5">
          {{ state.formDataWarehouse.name }}
        </div>
        <div class="text-slate-500 mt-2">
          Do you really want to delete these records? <br />This process cannot
          be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="restoreConfirmationModal = false"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn text-white bg-green-600 w-24"
          @click="restoreItemConfirm()"
        >
          Restore
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Archive Confirmation Modal -->

  <!-- BEGIN: Delete Confirmation Modal -->
  <Modal
    :show="deleteConfirmationModal"
    @hidden="deleteConfirmationModal = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <Trash2Icon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-xl font-bold mt-5">
          {{ state.formDataWarehouse.name }}
        </div>
        <div class="text-slate-500 mt-2">
          Do you really want to delete these records? <br />This process cannot
          be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="deleteConfirmationModal = false"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-danger w-24"
          @click="deleteItemConfirm()"
        >
          Delete
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Delete Confirmation Modal -->

  <!-- <ToastNotification :responseMessage="apiMessage" /> -->
  <!-- BEGIN: Success Notification Content -->

  <!-- END: Success Notification Content -->
</template>

<script setup>
import { onMounted, reactive, ref, toRefs, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";

import { required, minLength, maxLength, integer } from "@vuelidate/validators";
import axios from "../../../services/http-common";
import Paginate from "vuejs-paginate-next";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import router from "../../../router";

import xlsx from "xlsx";
import { createIcons, icons } from "lucide";
import Tabulator from "tabulator-tables";

const tableRef = ref();
const tabulator = ref();
const filter = reactive({
  field: "name",
  type: "like",
  value: "",
});

const imageAssets = require.context(`/src/assets/images/*.{jpg,jpeg,png,svg}`);

const initTabulator = () => {
  var dataTable = (tabulator.value = new Tabulator(tableRef.value, {
    data: state.items, //set initial table data
    layout: "fitColumns",
    responsiveLayout: "collapse",
    placeholder: "No matching records found",
    // selectable:true,
    columns: [
      //     {
      //   formatter: "responsiveCollapse",
      //   width: 40,
      //   minWidth: 30,
      //   hozAlign: "center",
      //   resizable: false,
      //   headerSort: false,
      // },

      {
        title: "ID",
        minWidth: 200,
        responsive: 0,
        field: "warehouseId",
        vertAlign: "middle",
        print: false,
        download: false,
      },
      {
        title: "Name",
        minWidth: 200,
        responsive: 0,
        field: "name",
        vertAlign: "middle",
        print: false,
        download: false,
      },
      {
        title: "Abbreviation",
        minWidth: 200,
        responsive: 0,
        field: "abbreviation",
        vertAlign: "middle",
        print: false,
        download: false,
      },
      {
        title: "Description",
        minWidth: 200,
        responsive: 0,
        field: "description",
        vertAlign: "middle",
        print: false,
        download: false,
      },

      {
        title: "ACTIONS",
        minWidth: 200,
        field: "actions",
        responsive: 1,
        hozAlign: "center",
        vertAlign: "middle",
        print: false,
        download: false,
        formatter() {
          const a = dom(`<div class="flex lg:justify-center items-center">
                <a class="flex items-center mr-3" href="javascript:;">
                  <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Edit
                </a>
              
              </div>`);
          dom(a).on("click", function () {
            // On click actions
          });

          return a[0];
        },
      },
    ],
    renderComplete() {
      createIcons({
        icons,
        "stroke-width": 1.5,
        nameAttr: "data-lucide",
      });
    },
  }));
};

// Redraw table onresize
const reInitOnResizeWindow = () => {
  window.addEventListener("resize", () => {
    tabulator.value.redraw();
    createIcons({
      icons,
      "stroke-width": 1.5,
      nameAttr: "data-lucide",
    });
  });
};

// Filter function
const onFilter = () => {
  tabulator.value.setFilter(filter.field, filter.type, filter.value);
};

// On reset filter
const onResetFilter = () => {
  filter.field = "name";
  filter.type = "like";
  filter.value = "";
  onFilter();
};

// Export
const onExportCsv = () => {
  tabulator.value.download("csv", "data.csv");
};

const onExportJson = () => {
  tabulator.value.download("json", "data.json");
};

const onExportXlsx = () => {
  const win = window;
  win.XLSX = xlsx;
  tabulator.value.download("xlsx", "data.xlsx", {
    sheetName: "Products",
  });
};

const onExportHtml = () => {
  tabulator.value.download("html", "data.html", {
    style: true,
  });
};

// Print
const onPrint = () => {
  tabulator.value.print();
};

onMounted(() => {});

// export default {
//   components: {
//     Loading,
//     paginate: Paginate,
//     ToastNotification,
//   },
//   data() {
//     return {
//       apiMessage: null,
//       isLoading: false,
//       searchData: "",
//       searchActive: false,
//       searchDataArchive: "",
//       searchActiveArchive: false,

//       addWarehouse: false,
//       archiveConfirmationModal: false,
//       archiveModal: false,
//       restoreConfirmationModal: false,
//       deleteConfirmationModal: false,
//       titleChange: -1,
//       formDataWarehouse: {
//         name: "",
//         description: "",
//         abbreviation: "",
//       },
//       formDataWarehouseDefault: {
//         name: "",
//         description: "",
//         abbreviation: "",
//       },

//       rules: {
//         name: {
//           required,
//           minLength: minLength(2),
//         },
//         description: {
//           required,
//           minLength: minLength(2),
//         },
//         abbreviation: {
//           required,
//           maxLength: maxLength(10),
//         },
//       },

//       headers: [
//         { text: "ID", value: "warehouseId" },
//         { text: "Name", value: "name" },
//         { text: "Abbreviation", value: "abbreviation" },
//         // { text: "Description", value: "description" },
//       ],
//       pagination: {
//         pageNumber: 1,
//         pageSize: 10,
//         search: "",
//       },
//       defaultPagination: {
//         pageNumber: 1,
//         pageSize: 10,
//         search: "",
//       },
//       pageCount: 0,
//       initialPage: 1,
//       pageSize: 10,

//       items: [],
//       itemsData: [],
//       archiveItems: [],
//       archiveData: [],
//       paginationArchive: {
//         pageNumber: 1,
//         pageSize: 5,
//       },
//       paginationArchiveDefault: {
//         pageNumber: 1,
//         pageSize: 5,
//       },

//       pageCountArchive: 20,
//       pageSizeArchive: 5,
//     };
//   },
//   computed: {
//     formTitle() {
//       return this.titleChange === -1 ? "Add New Warehouse" : "Edit Warehouse";
//     },
//   },
//   created() {
//     this.getDataFromApi();
//   },

//   methods: {
//     searchOnchange() {
//       if (this.searchData != "") {
//         this.searchActive = true;
//         this.searchItem();
//       } else {
//         this.clearSearch();
//       }
//     },
//     clearSearch() {
//       this.searchData = "";
//       this.pagination.search = this.searchData;
//       this.getDataFromApi();
//       this.searchActive = false;
//     },
//     searchItem() {
//       if (this.searchData != "") {
//         this.searchActive = true;
//         this.pagination.search = this.searchData;
//         this.getDataFromApi();
//       }
//     },

//     searchOnchangeArchive() {
//       if (this.searchDataArchive != "") {
//         this.searchActiveArchive = true;
//         this.searchItemArchive();
//       } else {
//         this.clearSearchArchive();
//       }
//     },
//     clearSearchArchive() {
//       this.searchDataArchive = "";
//       this.paginationArchive.search = this.searchDataArchive;
//       this.viewArchives();
//       this.searchActiveArchive = false;
//     },
//     searchItemArchive() {
//       if (this.searchDataArchive != "") {
//         this.searchActiveArchive = true;
//         this.paginationArchive.search = this.searchDataArchive;
//         this.viewArchives();
//       }
//     },

//     loadMoreData() {
//       this.pagination.pageSize = parseInt(this.pagination.pageSize) + 10;
//       this.getDataFromApi();
//     },
//     pageSizeChange() {
//       this.pagination.pageSize = this.pageSize;
//       this.getDataFromApi();
//     },
//     changePage(pageNum) {
//       this.pagination.pageNumber = pageNum;
//       this.pagination.pageSize = this.pageSize;
//       this.getDataFromApi();
//     },
//     setDefault() {
//       this.formDataWarehouse = Object.assign({}, this.formDataWarehouseDefault);
//     },
//     getDataFromApi() {
//       this.isLoading = true;
//       axios
//         .post("Warehouses/Paginated", this.pagination)
//         .then((response) => {
//           if (response.data.success === true) {
//             this.itemsData = response.data.data;
//             this.items = response.data.data.items;
//             this.pageCount = this.itemsData.totalPages;
//             this.isLoading = false;
//           } else {
//             alert(response.data.message);
//             this.isLoading = false;
//           }
//         })
//         .catch((error) => {
//           localStorage.setItem("errorMessage", error);
//           router.push("/page-down");
//         });
//     },
//     showModal() {
//       this.setDefault();
//       this.titleChange = -1;
//       this.addWarehouse = true;
//     },
//     closeForm() {
//       this.addWarehouse = false;
//     },
//     editItem(item) {
//       this.titleChange = 0;
//       this.formDataWarehouse = Object.assign({}, item);
//       this.addWarehouse = true;
//     },

//     saveForm() {
//       if (this.titleChange === -1) {
//         this.isLoading = true;
//         axios
//           .post("Warehouses", this.formDataWarehouse)
//           .then((response) => {
//             if (response.data.success === true) {
//               this.addWarehouse = false;
//               this.getDataFromApi();
//               this.apiMessage = response.data.message;
//               this.successToast();
//             } else {
//               this.isLoading = false;
//               this.apiMessage = response.data.message;
//               this.failedToast();
//             }
//           })
//           .catch((error) => {
//             this.isLoading = false;
//             alert(error);
//           });
//       } else {
//         var itemId = this.formDataWarehouse.warehouseId;
//         this.isLoading = true;
//         axios
//           .put("Warehouses/" + itemId, this.formDataWarehouse)
//           .then((response) => {
//             if (response.data.success === true) {
//               this.addWarehouse = false;
//               this.getDataFromApi();
//               this.apiMessage = response.data.message;
//               this.successToast();
//             } else {
//               this.isLoading = false;
//               this.apiMessage = response.data.message;
//               this.failedToast();
//             }
//           })
//           .catch((error) => {
//             this.isLoading = false;
//             alert(error);
//           });
//       }
//     },
//     archiveItem(item) {
//       this.formDataWarehouse = Object.assign({}, item);
//       this.archiveConfirmationModal = true;
//     },

//     closeArchive() {
//       this.archiveConfirmationModal = false;
//       this.setDefault();
//     },
//     archiveItemConfirm() {
//       var itemId = this.formDataWarehouse.warehouseId;
//       this.isLoading = true;
//       axios
//         .get("Warehouses/" + itemId + "/Archive")
//         .then((response) => {
//           if (response.data.success === true) {
//             this.archiveConfirmationModal = false;
//             this.getDataFromApi();
//             this.apiMessage = response.data.message;
//             this.successToast();
//           } else {
//             this.isLoading = false;
//             this.apiMessage = response.data.message;
//             this.failedToast();
//           }
//         })
//         .catch((error) => {
//           this.isLoading = false;
//           alert(error);
//         });
//     },
//     viewArchives() {
//       this.isLoading = true;
//       axios
//         .post("Warehouses/Archived", this.paginationArchive)
//         .then((response) => {
//           if (response.data.success === true) {
//             this.archiveData = response.data.data;
//             this.archiveItems = response.data.data.items;
//             this.pageCountArchive = this.archiveData.totalPages;
//             this.isLoading = false;
//             this.archiveModal = true;
//           } else {
//             this.isLoading = false;
//             alert(error);
//           }
//         })
//         .catch((error) => {
//           this.isLoading = false;
//           alert(error);
//         });
//     },

//     changePageArchive(pageNum) {
//       this.paginationArchive.pageNumber = pageNum;
//       this.viewArchives();
//     },
//     pageSizeChangeArchive() {
//       this.paginationArchive.pageSize = this.pageSizeArchive;
//       this.viewArchives();
//     },
//     restoreItem(item) {
//       this.formDataWarehouse = Object.assign({}, item);
//       this.restoreConfirmationModal = true;
//     },
//     restoreItemConfirm() {
//       var itemId = this.formDataWarehouse.warehouseId;
//       this.isLoading = true;
//       axios
//         .get("Warehouses/" + itemId + "/Restore")
//         .then((response) => {
//           if (response.data.success === true) {
//             this.restoreConfirmationModal = false;
//             this.viewArchives();
//             this.getDataFromApi();
//             this.apiMessage = response.data.message;
//             this.successToast();
//             if (this.archiveData.totalCount == 0) {
//               this.archiveModal = false;
//             }
//           } else {
//             this.isLoading = false;
//             this.apiMessage = response.data.message;
//             this.failedToast();
//           }
//         })
//         .catch((error) => {
//           this.isLoading = false;
//           alert(error);
//         });
//     },
//     deleteItem(item) {
//       this.formDataWarehouse = Object.assign({}, item);
//       this.deleteConfirmationModal = true;
//     },
//     deleteItemConfirm() {
//       this.isLoading = true;
//       var itemId = this.formDataWarehouse.warehouseId;
//       axios
//         .delete("Warehouses/" + itemId)
//         .then((response) => {
//           if (response.data.success === true) {
//             this.deleteConfirmationModal = false;
//             this.viewArchives();
//             this.apiMessage = response.data.message;
//             this.successToast();
//           } else {
//             this.isLoading = false;
//             this.apiMessage = response.data.message;
//             this.failedToast();
//           }
//         })
//         .catch((error) => {
//           this.isLoading = false;
//           alert(error);
//         });
//     },

//     successToast() {
//       Toastify({
//         text: this.apiMessage,

//         style: {
//           background: "#a4f4ab",
//           padding: "20px",
//           fontSize: "15px",
//           color: "black",
//           textTransform: "uppercase",
//           borderRadius: "5px",
//           width: "30%",
//         },
//         duration: 3000,
//         newWindow: true,
//         close: true,
//         gravity: "top",
//         position: "right",
//         stopOnFocus: true,
//       }).showToast();
//     },

//     failedToast() {
//       Toastify({
//         text: this.apiMessage,

//         style: {
//           background: "#f1a7ab",
//           padding: "20px",
//           fontSize: "15px",
//           color: "black",
//           textTransform: "uppercase",
//           borderRadius: "5px",
//           width: "30%",
//         },
//         duration: 3000,
//         newWindow: true,
//         close: true,
//         gravity: "top",
//         position: "right",
//         stopOnFocus: true,
//       }).showToast();
//     },
//   },
// };

const formTitle = computed(() => {
  return state.titleChange === -1 ? "Add New Warehouse" : "Edit Warehouse";
});

onMounted(() => {
  getDataFromApi();
});

const searchOnchange = () => {
  if (state.searchData != "") {
    searchActive.value = true;
    searchItem();
  } else {
    clearSearch();
  }
};

const clearSearch = () => {
  state.searchData = "";
  state.pagination.search = state.searchData;

  getDataFromApi();
  searchActive.value = false;
};
const searchItem = () => {
  if (state.searchData != "") {
    searchActive.value = true;
    state.pagination.search = state.searchData;
    getDataFromApi();
  }
};

const searchOnchangeArchive = () => {
  if (state.searchDataArchive != "") {
    searchActiveArchive.value = true;
    searchItemArchive();
  } else {
    clearSearchArchive();
  }
};
const clearSearchArchive = () => {
  state.searchDataArchive = "";
  state.paginationArchive.search = state.searchDataArchive;
  viewArchives();
  searchActiveArchive.value = false;
};
const searchItemArchive = () => {
  if (state.searchDataArchive != "") {
    searchActiveArchive.value = true;
    state.paginationArchive.search = state.searchDataArchive;
    viewArchives();
  }
};

const loadMoreData = () => {
  state.pagination.pageSize = parseInt(state.pagination.pageSize) + 10;
  getDataFromApi();
};
const pageSizeChange = () => {
  state.pagination.pageSize = pageSize;
  getDataFromApi();
};
const changePage = (pageNum) => {
  state.pagination.pageNumber = pageNum;
  state.pagination.pageSize = pageSize;
  getDataFromApi();
};
const setDefault = () => {
  state.formDataWarehouse = Object.assign({}, state.formDataWarehouseDefault);
};
const getDataFromApi = () => {
  isLoading.value = true;
  axios
    .post("Warehouses/Paginated", state.pagination)
    .then((response) => {
      if (response.data.success === true) {
        state.itemsData = response.data.data;
        state.items = response.data.data.items;
        pageCount.value = state.itemsData.totalPages;
        isLoading.value = false;
        initTabulator();
        reInitOnResizeWindow();
      } else {
        alert(response.data.message);
        isLoading.value = false;
      }
    })
    .catch((error) => {
      localStorage.setItem("errorMessage", error);
      router.push("/page-down");
    });
};
const showModal = () => {
  setDefault();
  state.titleChange = -1;
  addWarehouse.value = true;
};
const closeForm = () => {
  addWarehouse.value = false;
};
const editItem = (item) => {
  state.titleChange = 0;
  state.formDataWarehouse = Object.assign({}, item);
  addWarehouse.value = true;
};

const saveForm = () => {
  if (state.titleChange === -1) {
    isLoading.value = true;
    axios
      .post("Warehouses", state.formDataWarehouse)
      .then((response) => {
        if (response.data.success === true) {
          addWarehouse.value = false;
          getDataFromApi();
          state.apiMessage = response.data.message;
          state.allMessages.push(state.apiMessage);
          console.log(state.allMessages);
          successToast();
        } else {
          isLoading.value = false;
          state.apiMessage = response.data.message;
          failedToast();
        }
      })
      .catch((error) => {
        isLoading.value = false;
        alert(error);
      });
  } else {
    var itemId = state.formDataWarehouse.warehouseId;
    isLoading.value = true;
    axios
      .put("Warehouses/" + itemId, state.formDataWarehouse)
      .then((response) => {
        if (response.data.success === true) {
          addWarehouse.value = false;
          getDataFromApi();
          state.apiMessage = response.data.message;
          state.allMessages.push(state.apiMessage);
          console.log(state.allMessages);
          successToast();
        } else {
          isLoading.value = false;
          state.apiMessage = response.data.message;
          failedToast();
        }
      })
      .catch((error) => {
        isLoading.value = false;
        alert(error);
      });
  }
};
const archiveItem = (item) => {
  state.formDataWarehouse = Object.assign({}, item);
  archiveConfirmationModal.value = true;
};

const closeArchive = () => {
  archiveConfirmationModal.value = false;
  setDefault();
};
const archiveItemConfirm = () => {
  var itemId = state.formDataWarehouse.warehouseId;
  isLoading.value = true;
  axios
    .get("Warehouses/" + itemId + "/Archive")
    .then((response) => {
      if (response.data.success === true) {
        archiveConfirmationModal.value = false;
        getDataFromApi();
        state.apiMessage = response.data.message;
        successToast();
      } else {
        isLoading.value = false;
        state.apiMessage = response.data.message;
        failedToast();
      }
    })
    .catch((error) => {
      isLoading.value = false;
      alert(error);
    });
};
const viewArchives = () => {
  isLoading.value = true;
  axios
    .post("Warehouses/Archived", state.paginationArchive)
    .then((response) => {
      if (response.data.success === true) {
        state.archiveData = response.data.data;
        state.archiveItems = response.data.data.items;
        pageCountArchive.value = state.archiveData.totalPages;
        isLoading.value = false;
        archiveModal.value = true;
      } else {
        isLoading.value = false;
        alert(error);
      }
    })
    .catch((error) => {
      isLoading.value = false;
      alert(error);
    });
};

const changePageArchive = (pageNum) => {
  state.paginationArchive.pageNumber = pageNum;
  viewArchives();
};
const pageSizeChangeArchive = () => {
  state.paginationArchive.pageSize = pageSizeArchive;
  viewArchives();
};
const restoreItem = (item) => {
  state.formDataWarehouse = Object.assign({}, item);
  restoreConfirmationModal.value = true;
};
const restoreItemConfirm = () => {
  var itemId = state.formDataWarehouse.warehouseId;
  isLoading.value = true;
  axios
    .get("Warehouses/" + itemId + "/Restore")
    .then((response) => {
      if (response.data.success === true) {
        restoreConfirmationModal.value = false;
        viewArchives();
        getDataFromApi();
        state.apiMessage = response.data.message;
        successToast();
        if (state.archiveData.totalCount == 0) {
          archiveModal.value = false;
        }
      } else {
        isLoading.value = false;
        state.apiMessage = response.data.message;
        failedToast();
      }
    })
    .catch((error) => {
      isLoading.value = false;
      alert(error);
    });
};
const deleteItem = (item) => {
  state.formDataWarehouse = Object.assign({}, item);
  deleteConfirmationModal.value = true;
};
const deleteItemConfirm = () => {
  isLoading.value = true;
  var itemId = state.formDataWarehouse.warehouseId;
  axios
    .delete("Warehouses/" + itemId)
    .then((response) => {
      if (response.data.success === true) {
        deleteConfirmationModal.value = false;
        viewArchives();
        state.apiMessage = response.data.message;
        successToast();
      } else {
        isLoading.value = false;
        state.apiMessage = response.data.message;
        failedToast();
      }
    })
    .catch((error) => {
      isLoading.value = false;
      alert(error);
    });
};

const successToast = () => {
  Toastify({
    text: state.apiMessage,
    style: {
      background: "white",
      padding: "20px",
      fontSize: "15px",
      color: "green",
      textTransform: "uppercase",
      borderRadius: "5px",
      width: "30%",
    },
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
  }).showToast();
};
const failedToast = () => {
  Toastify({
    text: state.apiMessage,

    style: {
      background: "white",
      padding: "20px",
      fontSize: "15px",
      color: "red",
      textTransform: "uppercase",
      borderRadius: "5px",
      width: "30%",
    },
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
  }).showToast();
};

const addWarehouse = ref(false);
const isLoading = ref(false);
const searchActive = ref(false);
const searchActiveArchive = ref(false);
const archiveConfirmationModal = ref(false);
const archiveModal = ref(false);
const restoreConfirmationModal = ref(false);
const deleteConfirmationModal = ref(false);
const pageCount = ref(0);
const pageSize = ref(10);
const pageCountArchive = ref(0);
const pageSizeArchive = ref(5);

const state = reactive({
  apiMessage: null,
  allMessages: [],
  // isLoading: false,
  searchData: "",
  // searchActive: false,
  searchDataArchive: "",
  //  searchActiveArchive: false,

  // addWarehouse: false,
  //  archiveConfirmationModal: false,
  //  archiveModal: false,
  // restoreConfirmationModal: false,
  //  deleteConfirmationModal: false,
  titleChange: -1,
  formDataWarehouse: {
    name: "",
    description: "",
    abbreviation: "",
  },
  formDataWarehouseDefault: {
    name: "",
    description: "",
    abbreviation: "",
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
  },

  headers: [
    { text: "ID", value: "warehouseId" },
    { text: "Name", value: "name" },
    { text: "Abbreviation", value: "abbreviation" },
    // { text: "Description", value: "description" },
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
  // pageCount: 5,
  //initialPage: 1,
  //pageSize: 10,

  items: [],
  itemsData: [],
  archiveItems: [],
  archiveData: [],
  paginationArchive: {
    pageNumber: 1,
    pageSize: 5,
    search: "",
  },
  paginationArchiveDefault: {
    pageNumber: 1,
    pageSize: 5,
    search: "",
  },

  // pageCountArchive: 20,
  // pageSizeArchive: 5,
});
</script>

<style>
.textBreak {
  white-space: nowrap;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  color: black;
}
</style>
