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
            @click="showLPNModal()"
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
            <span
              class="
                mr-2
                lg:w-5 lg:h-5
                w-4
                h-4
                flex
                items-center
                justify-center
              "
            >
              <PlusIcon class="lg:w-6 lg:h-6 w-4 h-4" />
            </span>
            Add LPN
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

          <!-- SEARCH -->
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
      </div>

      <!-- BEGIN: Data List -->
      <div class="intro-y col-span-12 overflow-auto">
        <table class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="whitespace-nowrap uppercase">
              <th
                class="whitespace-nowrap uppercase"
                v-for="(header, i) in headers"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>Order</th>
              <th>Date</th>
              <th>Despatched</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, i) in items" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index">
                {{
                  item[header.value] != null || item[header.value] != undefined
                    ? item[header.value]
                    : "Nil"
                }}
              </td>
              <td>
                {{ item.order != null ? item.order.orderNumber : "" }}
              </td>
              <td>
                {{
                  item.date != null || item.date != undefined
                    ? momentLocal(item.date)
                    : "Nil"
                }}
              </td>

              <td>
                <div class="form-switch ml-3">
                  <input
                    id="booleanSwitch"
                    type="checkbox"
                    v-model="item.isDespatched"
                    class="form-check-input"
                    disabled
                  />
                </div>
              </td>

              <td class="table-report__action w-24">
                <div class="flex justify-end items-end">
                  <a
                    @Click="viewProduct(item)"
                    class="flex items-center mr-3"
                    href="javascript:;"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="View Product"
                    >
                      <PackageIcon
                        class="
                          w-4
                          h-4
                          md:w-5 md:h-5
                          lg:w-6 lg:h-6
                          mr-1
                          text-yellow-600
                        "
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
        v-if="itemsData.totalCount > 0"
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
        </select>
      </div>

      <!-- END: Pagination -->
    </div>
  </div>
  <!-- BEGIN: Add  Modal -->

  <!-- END: Add Modal -->

  <MoveableModal
    :show="addLPN"
    @hidden="addLPN = false"
    backdrop="static"
    size="modal-sl-80"
    :title="formLPNTitle"
    @close="closeLPNForm()"
  >
    <ModalBody class="flex justify-center space-y-4">
      <div class="flex flex-col space-y-4 w-full">
        <div>
          <label for="regular-form-1" class="form-label">Warehouse</label>

          <TomSelect
            v-model="formDataLPNGen.warehouse"
            :options="{
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full mr-32"
            ref="selectRef"
            @change="getDataFromLPNS(formDataLPNGen.warehouse)"
          >
            <option v-if="titleLPNChange == -1">SELECT</option>
            <option
              :value="item.abbreviation"
              v-for="(item, i) in warehouseList"
              :key="i"
            >
              {{ item.abbreviation }}
            </option>
          </TomSelect>
        </div>

        <div v-if="formDataLPNGen.warehouse != ''">
          <div class="pb-4">
            Last Created LPN :
            <span class="bg-slate-200 text-success px-2 py-2">{{
              itemsLPNS || "Nil"
            }}</span>
          </div>

          <label for="regular-form-1" class="form-label">Number of LPN</label>

          <div class="flex flex space-x-2 justify-center items-center pt-2">
            <input
              id="vertical-form-1"
              v-model="count"
              type="number"
              class="form-control"
              placeholder="Number"
              autocomplete="off"
            />

            <svg
              v-if="count != '' && !countSelected"
              @click="countField(formDataLPNGen.lpns, count)"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="bi bi-plus-circle w-8 h-8 text-success"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <path
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
              />
            </svg>

            <svg
              v-show="formDataLPNGen.lpns.length >= 1 && count > 0"
              @click="removeCountField(index, formDataLPNGen.lpns, count)"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="bi bi-x-circle w-8 h-8 text-red-400"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </div>
        </div>

        <div
          class="intro-y col-span-12 overflow-auto"
          v-if="count > 0 && countSelected == true"
        >
          <table class="table table-report -mt-2 table-auto">
            <thead>
              <tr class="uppercase whitespace-nowrap">
                <th>QR Code</th>
                <th>LPN</th>
              </tr>
            </thead>
            <tr
              class="intro-x"
              v-for="(input, index) in formDataLPNGen.lpns"
              :key="`phoneInput-${index}`"
            >
              <td>
                <qrcode-vue
                  render-as="canvas"
                  :value="input.fieldNo"
                  size="45"
                  level="H"
                  :id="`fieldNoQR-${input.fieldNo}`"
                />
              </td>

              <td>
                <input
                  id="vertical-form-1"
                  v-model="input.fieldNo"
                  type="text"
                  class="form-control"
                  placeholder="LPN"
                  autocomplete="off"
                />
              </td>
              <td class="table-report__action w-auto">
                <div class="flex justify-center items-center">
                  <a class="flex items-center mr-3" href="javascript:;">
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Select LPN"
                      :options="{
                        zIndex: 99999,
                      }"
                    >
                      <input
                        id="vertical-form-3"
                        class="form-check-input w-6 h-6 mr-1 bg-slate-100"
                        type="checkbox"
                        :value="input.fieldNo"
                        v-model="checkedData"
                      />
                    </Tippy>
                  </a>
                  <a
                    @Click="printLPN(input)"
                    class="flex items-center mr-3"
                    href="javascript:;"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Print"
                      :options="{
                        zIndex: 99999,
                      }"
                      ><PrinterIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                      />
                    </Tippy>
                  </a>
                  <a
                    class="flex items-center text-blue-900"
                    href="javascript:;"
                    @click="generateLPN(input)"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Download"
                      :options="{
                        zIndex: 99999,
                      }"
                      ><FileTextIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                      />
                    </Tippy>
                  </a>
                </div>
              </td>
            </tr>
          </table>

          <div class="flex items-center justify-center">
            <button
              id="tabulator-print"
              class="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
              @click="onPrintLPN(formDataLPNGen.lpns)"
            >
              <PrinterIcon class="w-4 h-4 mr-2" /> Print
            </button>

            <button
              id="tabulator-print"
              class="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
              @click="generateReportLPN(formDataLPNGen.lpns)"
            >
              <FileTextIcon class="w-4 h-4 mr-2" /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="closeLPNForm()"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        {{ const_txt.CANCEL_BTN }}
      </button>
      <button @click="saveLPNForm()" type="submit" class="btn btn-primary w-24">
        {{ btnName }}
      </button>
    </ModalFooter>
  </MoveableModal>

  <MoveableModal
    :show="pickedProductsModal"
    @hidden="pickedProductsModal = false"
    backdrop="static"
    size="modal-sl-75"
    :title="'LPN : ' + getLpn"
    @close="pickedProductsModal = false"
  >
    <ModalBody class="p-0">
      <!-- BEGIN: INFO -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4 mt-6">
        <!-- BEGIN: Data List -->

        <div class="intro-y col-span-12 overflow-auto md:mt-4 mt-2">
          <table class="table table-report -mt-2 table-auto">
            <thead>
              <tr class="uppercase whitespace-nowrap">
                <th
                  class="whitespace-nowrap"
                  v-for="(header, i) in pickedProductsHeaders"
                  :key="i"
                >
                  {{ header.text }}
                </th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-show="pickedProductsItems.length <= 0">
                <td colspan="12">
                  <span
                    class="
                      flex
                      justify-center
                      items-center
                      text-success
                      font-bold
                    "
                    >{{ const_txt.NO_DATA_TABLE }}</span
                  >
                </td>
              </tr>
              <tr
                v-for="(item, i) in pickedProductsItems"
                :key="i"
                class="intro-x"
              >
                <td
                  v-for="(header, index) in pickedProductsHeaders"
                  :key="index"
                  class="cursor-pointer"
                >
                  {{
                    item[header.value] != null ||
                    item[header.value] != undefined
                      ? item[header.value]
                      : "Nil"
                  }}
                </td>
                <td>
                  <div class="text-left line-clamp-2">
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      :content="item.description"
                      :options="{
                        zIndex: 99999,
                      }"
                    >
                      {{
                        item.description != null ||
                        item.description != undefined
                          ? item.description
                          : "Nil"
                      }}
                    </Tippy>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- END: INFO -->
    </ModalBody>
  </MoveableModal>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";

import dom from "@left4code/tw-starter/dist/js/dom";

import { required, minLength, maxLength, integer } from "@vuelidate/validators";
import axios from "../../../services/http-common";
import Paginate from "vuejs-paginate-next";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import router from "../../../router";
import QrcodeVue from "qrcode.vue";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { const_txt } from "../../../global-functions/const";
import moment from "moment";
import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../../global-functions/functions";

import { exportCSVFile } from "../../../global-functions/functions";

import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "LPNS");
  },
  components: {
    Loading,
    paginate: Paginate,
    QrcodeVue,
  },

  name: "AddRemove",

  data() {
    return {
      isLoading: false,
      const_txt: const_txt,
      searchData: "",
      searchActive: false,

      // formDataLPNS: {
      //   warehouse: "",
      //   lots: [],
      // },
      // formDataLPNSDefault: {
      //   warehouse: "",
      //   lots: [],
      // },

      headers: [
        { text: "LPN", value: "lpn" },
        // { text: "Date", value: "date" },
        // { text: "Order", value: "order" },
        { text: "User Name", value: "addedBy" },
        { text: "Verified By", value: "verifiedBy" },
        { text: "Verified At", value: "verifiedAt" },
      ],
      pickedProductsHeaders: [
        { text: "Order Number", value: "orderNumber" },
        { text: "PLU/SKU", value: "sku" },
        { text: "BARCODE/EAN", value: "ean" },
        { text: "Warehouse", value: "warehouse" },
        { text: "Storage Section", value: "storageSection" },
        { text: "Storage Bin", value: "storageBin" },
        { text: "Storage Type", value: "storageType" },
        { text: "QTY", value: "quantity" },
        { text: "Expiry Date", value: "expiryDate" },
        { text: "Picked", value: "picked" },
        { text: "Not Picked", value: "notPicked" },
        // { text: "Description", value: "description" },
      ],

      pagination: {
        pageNumber: 1,
        pageSize: 10,
        search: "",
        // sortColumnName: "lpn",
        // sortDirection: "desc",
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

      //lpn generate
      count: "",
      countSelected: false,

      warehouseList: [],
      addLPN: false,

      titleLPNChange: -1,
      formDataLPNGen: {
        warehouse: "",
        lpns: [],
      },
      formDataLPNGenDefault: {
        warehouse: "",
        lpns: [],
      },

      itemsLPNS: [],

      docLPN: null,
      pdfLPN: null,
      checkedData: [],
      selectedItemsData: [],

      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,
      getLpn: "",
      pickedProductsModal: false,
      pickedProductsItems: [],
    };
  },
  computed: {
    formLPNTitle() {
      return this.titleLPNChange === -1 ? "Generate LPN" : "Edit LPN";
    },
    btnName() {
      return this.titleLPNChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },
  },
  created() {
    this.getDataFromApi();
  },
  watch: {},
  methods: {
    viewProduct(item) {
      this.isLoading = true;
      this.getLpn = item.lpn;
      console.log(item.lpn);
      this.pickedProductsModal = true;
      axios
        .post("Despatches/Lpns/" + this.getLpn)
        .then((response) => {
          if (response.data.success === true) {
            this.pickedProductsItems = response.data.data.pickedProducts;

            // this.pageCount = this.itemsData.totalPages;
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
    setReports() {
      if (this.allItems <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        const columns = [
          { title: "LPN", dataKey: "lpn" },
          { title: "Order", dataKey: "order" },
          { title: "Added By", dataKey: "addedBy" },
          { title: "Verified By", dataKey: "verifiedBy" },
          { title: "Verified At", dataKey: "verifiedAt" },
          { title: "Date", dataKey: "date" },
          { title: "Despatched", dataKey: "isDespatched" },
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
            lpn: el.lpn,
            order: el.order,
            addedBy: el.addedBy,
            verifiedBy: el.verifiedBy,
            verifiedAt: el.verifiedAt,
            date: el.date,
            isDespatched: el.isDespatched,
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
      this.docs.save(`${"Lpns " + generateDate}.pdf`);
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
        var csvTitle = "Lpns " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "LPN",
          2: "Order",
          3: "Added By",
          4: "Verified By",
          5: "Verified At",
          6: "Date",
          7: "Despatched",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.lpn,
            2: item.order,
            3: item.addedBy,
            4: item.verifiedBy,
            5: item.verifiedAt,
            6: item.date,
            7: item.isDespatched,
          });
        });
        exportCSVFile(csvHeaders, csvItems, csvTitle);
      }
    },

    getAllDataFromApi() {
      this.isLoading = true;
      var totalCount = this.itemsData.totalCount;
      var pagination = { pageNumber: 1, pageSize: totalCount };
      axios
        .post("Lpns/Paginated", pagination)
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

    //lpn generate
    countField(fieldType, count) {
      var str = parseInt(this.itemsLPNS.substring(1));
      var str_c = this.itemsLPNS.charAt(0);

      for (val = 1; val <= count; val++) {
        fieldType.push({ fieldNo: str_c + parseInt(val + str) });

        fieldType.splice(count, count);
      }
      this.countSelected = true;
    },
    removeCountField(index, fieldType, count) {
      this.countSelected = false;
      this.count = "";
      fieldType.splice(index, count);
    },
    addField(value, fieldType) {
      fieldType.push({ value: "" });
    },
    removeField(index, fieldType) {
      fieldType.splice(index, 1);
    },

    getWarehouseData() {
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("Warehouses/Paginated", pagination)
        .then((response) => {
          this.warehouseList = response.data.data.items;
          // if (this.warehouseList.length > 0) {
          //   this.formDataPurchaseOrder.warehouseId =
          //     this.warehouseList[0].warehouseId;
          // } else

          if (this.warehouseList.length == 0) {
            warningToast("Please Add Items in Warehouse");
            this.addLPN = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },

    getDataFromLPNS(abbreviation) {
      this.isLoading = true;
      axios
        .post("Lpns/LastCreated/" + abbreviation)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsLPNS = response.data.data;
          }
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },

    setSelectReportLPN(qrGenerate) {
      var newArray = [];
      for (var x = 0; x < this.checkedData.length; x++) {
        for (var y = 0; y < qrGenerate.length; y++) {
          var result = qrGenerate.filter((obj) => {
            return obj.fieldNo === this.checkedData[x];
          });

          newArray.push(result[0]);
        }
      }

      newArray = newArray.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.fieldNo == value.fieldNo)
      );
      this.selectedItemsData = newArray;
    },

    setReportLPN(qrGenerate) {
      if (this.checkedData.length > 0) {
        this.setSelectReportLPN(qrGenerate);
        var qrGenerate = this.selectedItemsData;
      } else {
        var qrGenerate = qrGenerate;
      }

      this.docLPN = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: "a4",
      });

      let data = [];
      let i = 0;
      let obj;

      qrGenerate.forEach((el) => {
        obj = {
          fieldNo: el.fieldNo,
        };
        //i++;
        data.push(obj);
        //   console.log(obj);
      });
      //console.log("DATA", data);

      for (var j = 0; j < data.length; j++) {
        var imgData = "/src/assets/images/pl_logo2.png";
        this.docLPN.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
        // this.docLPN
        //   .setFontSize(16)
        //   .text("Order Number : ", 5, 1.2);

        this.docLPN.setLineWidth(0.01).line(0.5, 2.2, 8.0, 2.2);

        this.docLPN.setFontSize(14).text("Deliver To :", 0.5, 2.5);

        this.docLPN.setFontSize(12).text("PHARMATEC PTE LTD", 0.7, 2.7);
        this.docLPN.setFontSize(12).text("62 Bank St,", 0.7, 2.9);
        this.docLPN.setFontSize(12).text("P.O.Box 450,Ba,", 0.7, 3.1);
        this.docLPN.setFontSize(12).text("Fiji Islands", 0.7, 3.3);
        this.docLPN.setFontSize(12).text("Ph: 6674933", 0.7, 3.5);
        this.docLPN.setFontSize(12).text("Fax: 6670118", 0.7, 3.7);
        this.docLPN
          .setFontSize(12)
          .text("Email: admin@pharmatec.com.fj", 0.7, 3.9);

        //trading partner
        this.docLPN.setFontSize(14).text("Trading Partner :", 5, 2.5);

        // this.docLPN
        //   .setFontSize(12)
        //   .text(

        //       " fname" ,
        //     5.2,
        //     2.7
        //   );
        // this.docLPN
        //   .setFontSize(12)
        //   .text("this.formDataOrder.customer.company", 5.2, 2.9);
        // this.docLPN
        //   .setFontSize(12)
        //   .text("this.formDataOrder.customer.mobile", 5.2, 3.1);
        // this.docLPN
        //   .setFontSize(12)
        //   .text("this.formDataOrder.customer.email", 5.2, 3.3);
        // this.docLPN
        //   .setFontSize(12)
        //   .text("Date: " + "this.momentLocal(this.formDataOrder.time)", 5.2, 3.5);
        // this.docLPN
        //   .setFontSize(12)
        //   .text(
        //     "Total : " + 'this.currencyFormat(this.formDataOrder.amount)',
        //     5.2,
        //     3.7
        //   );
        // this.docLPN
        //   .setFontSize(12)
        //   .text(
        //     "Booking No: ",
        //     5.2,
        //     3.9
        //   );
        var qrCanvas = document.getElementById(`fieldNoQR-${data[j].fieldNo}`);
        this.docLPN.setFontSize(12).text("QR Code", 0.7, 4.5);
        if (qrCanvas) {
          this.docLPN.addImage(
            qrCanvas.toDataURL(),
            "JPEG",
            0.7,
            4.7,
            0.75,
            0.75
          );
        }

        this.docLPN
          .setFontSize(12)
          .text("Number: " + data[j].fieldNo, 4.0, 4.5);
        if (j < data.length - 1) {
          this.docLPN.addPage();
        }
      }
    },

    onPrintLPN(qrGenerate) {
      this.setReportLPN(qrGenerate);
      this.docLPN.autoPrint();
      this.docLPN.output("dataurlnewwindow");
    },

    generateReportLPN(qrGenerate) {
      this.setReportLPN(qrGenerate);
      var generateDate = new Date().toLocaleString();
      this.docLPN.save(`${"QRCode" + "_" + generateDate}.pdf`);
    },

    reportLPN(input) {
      const qrCanvas = document.getElementById(`fieldNoQR-${input.fieldNo}`);
      this.pdfLPN = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: "a4",
      });

      var imgData = "/src/assets/images/pl_logo2.png";
      this.pdfLPN.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
      // this.pdfLPN
      //   .setFontSize(16)
      //   .text("Order Number : ", 5, 1.2);

      this.pdfLPN.setLineWidth(0.01).line(0.5, 2.2, 8.0, 2.2);

      this.pdfLPN.setFontSize(14).text("Deliver To :", 0.5, 2.5);

      this.pdfLPN.setFontSize(12).text("PHARMATEC PTE LTD", 0.7, 2.7);
      this.pdfLPN.setFontSize(12).text("62 Bank St,", 0.7, 2.9);
      this.pdfLPN.setFontSize(12).text("P.O.Box 450,Ba,", 0.7, 3.1);
      this.pdfLPN.setFontSize(12).text("Fiji Islands", 0.7, 3.3);
      this.pdfLPN.setFontSize(12).text("Ph: 6674933", 0.7, 3.5);
      this.pdfLPN.setFontSize(12).text("Fax: 6670118", 0.7, 3.7);
      this.pdfLPN
        .setFontSize(12)
        .text("Email: admin@pharmatec.com.fj", 0.7, 3.9);

      //trading partner
      this.pdfLPN.setFontSize(14).text("Trading Partner :", 5, 2.5);

      // this.docLPN
      //   .setFontSize(12)
      //   .text(

      //       " fname" ,
      //     5.2,
      //     2.7
      //   );
      // this.docLPN
      //   .setFontSize(12)
      //   .text("this.formDataOrder.customer.company", 5.2, 2.9);
      // this.docLPN
      //   .setFontSize(12)
      //   .text("this.formDataOrder.customer.mobile", 5.2, 3.1);
      // this.docLPN
      //   .setFontSize(12)
      //   .text("this.formDataOrder.customer.email", 5.2, 3.3);
      // this.docLPN
      //   .setFontSize(12)
      //   .text("Date: " + "this.momentLocal(this.formDataOrder.time)", 5.2, 3.5);
      // this.docLPN
      //   .setFontSize(12)
      //   .text(
      //     "Total : " + 'this.currencyFormat(this.formDataOrder.amount)',
      //     5.2,
      //     3.7
      //   );
      // this.docLPN
      //   .setFontSize(12)
      //   .text(
      //     "Booking No: ",
      //     5.2,
      //     3.9
      //   );

      this.pdfLPN.setFontSize(12).text("QR Code", 0.7, 4.5);
      if (qrCanvas) {
        this.pdfLPN.addImage(
          qrCanvas.toDataURL(),
          "JPEG",
          0.7,
          4.7,
          0.75,
          0.75
        );
      }

      this.pdfLPN.setFontSize(12).text("Number: " + input.fieldNo, 4.0, 4.5);
    },

    printLPN(input) {
      this.reportLPN(input);
      this.pdfLPN.autoPrint();
      this.pdfLPN.output("dataurlnewwindow");
    },

    generateLPN(input) {
      this.reportLPN(input);
      var generateDate = new Date().toLocaleString();
      this.pdfLPN.save(`${"Number" + input.fieldNo + "_" + generateDate}.pdf`);
    },

    // searchOnchange() {
    //   if (this.searchData != "") {
    //     this.searchActive = true;
    //     this.searchItem();
    //   } else {
    //     this.clearSearch();
    //   }
    // },
    // clearSearch() {
    //   this.searchData = "";
    //   this.pagination.search = this.searchData;
    //   this.getDataFromApi();
    //   this.searchActive = false;
    // },
    // searchItem() {
    //   if (this.searchData != "") {
    //     this.searchActive = true;
    //     this.pagination.search = this.searchData;
    //     this.getDataFromApi();
    //   }
    // },

    // searchOnchangeArchive() {
    //   if (this.searchDataArchive != "") {
    //     this.searchActiveArchive = true;
    //     this.searchItemArchive();
    //   } else {
    //     this.clearSearchArchive();
    //   }
    // },
    // clearSearchArchive() {
    //   this.searchDataArchive = "";
    //   this.paginationArchive.search = this.searchDataArchive;
    //   this.viewArchives();
    //   this.searchActiveArchive = false;
    // },
    // searchItemArchive() {
    //   if (this.searchDataArchive != "") {
    //     this.searchActiveArchive = true;
    //     this.paginationArchive.search = this.searchDataArchive;
    //     this.viewArchives();
    //   }
    // },

    // loadMoreData() {
    //   this.pagination.pageSize = parseInt(this.pagination.pageSize) + 10;
    //   this.getDataFromApi();
    // },
    // pageSizeChange() {
    //   this.pagination.pageSize = this.pageSize;
    //   this.getDataFromApi();
    // },
    // changePage(pageNum) {
    //   this.pagination.pageNumber = pageNum;
    //   this.pagination.pageSize = this.pageSize;
    //   this.getDataFromApi();
    // },
    // setDefault() {
    //   this.formDataMovement = Object.assign({}, this.formDataMovementDefault);
    // },
    // getDataFromApi() {
    //   this.isLoading = true;
    //   axios
    //     .post("Warehouses/Paginated", this.pagination)
    //     .then((response) => {
    //       if (response.data.success === true) {
    //         this.itemsData = response.data.data;
    //         this.items = response.data.data.items;
    //         this.pageCount = this.itemsData.totalPages;
    //         this.isLoading = false;
    //       } else {
    //         warningToast(response.data.message);
    //         this.isLoading = false;
    //       }
    //     })
    //     .catch((error) => {
    //       localStorage.setItem("errorMessage", error);
    //       router.push("/page-down");
    //     });
    // },
    showLPNModal() {
      this.setGenDefault();
      this.titleLPNChange = -1;
      this.getWarehouseData();
      this.addLPN = true;
    },
    closeLPNForm() {
      this.addLPN = false;
      this.setGenDefault();
    },
    momentLocal(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY");
    },
    saveLPNForm() {
      // if (this.titleChange === -1) {

      var lpnsArray = [];
      for (var i = 0; i < this.formDataLPNGen.lpns.length; i++) {
        var lpnNo = this.formDataLPNGen.lpns[i].fieldNo;
        lpnsArray.push(lpnNo);
      }

      var formDataLPNGen = {};
      formDataLPNGen.warehouse = this.formDataLPNGen.warehouse;
      formDataLPNGen.lpns = lpnsArray;

      this.isLoading = true;

      axios
        .post("Lpns/Create", formDataLPNGen)
        .then((response) => {
          if (response.data.success === true) {
            this.addLPN = false;
            this.getDataFromApi();
            successToast(response.data.message);
            this.isLoading = false;
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
      // }
      // else {
      // var itemId = this.formDataMovement.warehouseId;
      // this.isLoading = true;
      // axios
      //   .put("Warehouses/" + itemId, this.formDataMovement)
      //   .then((response) => {
      //     if (response.data.success === true) {
      //       this.addMovement = false;
      //       this.getDataFromApi();
      //       this.apiMessage = response.data.message;
      //       successToast(this.apiMessage);
      //     } else {
      //       this.isLoading = false;
      //       failedToast(response.data.message);
      //     }
      //   })
      //   .catch((error) => {
      //     this.isLoading = false;
      //     warningToast(statusMessage(error.response.status));
      //   });
      // }
    },

    //
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
      // this.pagination.pageSize = this.pageSize;
      this.getDataFromApi();
    },

    setGenDefault() {
      this.formDataLPNGen = Object.assign({}, this.formDataLPNGenDefault);
    },

    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("Lpns/Paginated", this.pagination)
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
          //  this.isLoading = false;
          //     warningToast(statusMessage(error.response.status));

          localStorage.setItem("errorMessage", error);
          router.push("/page-down");
        });
    },
  },
};
</script>
