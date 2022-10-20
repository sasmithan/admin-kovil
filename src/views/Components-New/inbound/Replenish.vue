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
        class="intro-y lg:flex lg:flex-row lg:items-center lg:space-x-2 lg:justify-between md:flex md:flex-row md:items-center md:space-x-1 md:justify-between flex flex-wrap flex-col justify-end items-end mt-2 w-full"
      >
        <div class="flex space-x-1">
          <a
            href="javascript:;"
            @click="showModal()"
            class="btn btn-primary shadow-md lg:w-auto w-1/2 text-xs lg:text-sm"
          >
            Add New Replenish
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
                <DropdownItem @click="csvExport(SelectedWarehouse)">
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
              <TomSelect
                v-model="SelectedWarehouse"
                :options="{
                  placeholder: 'Search..',
                  allowEmptyOption: true,
                }"
                class="w-full mr-32"
                @change="getDataFromApi(SelectedWarehouse)"
              >
                <option>SELECT</option>
                <option
                  :value="item.abbreviation"
                  v-for="(item, i) in warehouseList"
                  :key="i"
                >
                  {{ item.abbreviation }}
                </option>
              </TomSelect>
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
            <tr class="uppercase whitespace-nowrap">
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in headers"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>Expiration Date</th>
              <th>Qty</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, i) in items" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>
              <td>
                {{ momentLocal(item.expirationDate) }}
              </td>
              <td>
                item.quantity != null || item.quantity != undefined
                ?item.quantity : "Nil"
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
      <LoadMoreData :itemsData="itemsData" :loadMoreData="loadMoreData" />
      <NoData :itemsData="itemsData" />
      <!-- BEGIN: Pagination -->

      <div
        v-if="itemsData.totalCount > 0"
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
        </select>
      </div>

      <!-- END: Pagination -->
    </div>
  </div>
  <!-- BEGIN: Add  Modal -->

  <Modal
    :show="addReplenish"
    @hidden="addReplenish = false"
    backdrop="static"
    size="modal-sl-80"
  >
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">{{ formTitle }}</h2>
    </ModalHeader>
    <ModalBody class="flex justify-center space-y-4">
      <div class="flex flex-col space-y-4 w-full">
        <div>
          <label for="regular-form-1" class="form-label">Warehouse</label>

          <TomSelect
            v-model="formDataMovement.abbreviation"
            :options="{
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full mr-32"
            @change="getDataFromReplenish(formDataMovement.abbreviation)"
          >
            <option v-if="titleChange != -1">
              {{ formDataMovement.abbreviation }}
            </option>
            <option v-if="titleChange == -1">SELECT</option>
            <option
              :value="item.abbreviation"
              v-for="(item, i) in warehouseList"
              :key="i"
            >
              {{ item.abbreviation }}
            </option>
          </TomSelect>
        </div>

        <div v-if="formDataMovement.abbreviation != ''">
          <label for="regular-form-1" class="form-label">Number of LPN</label>

          <div class="flex flex space-x-2 justify-center items-center pt-2">
            <input
              id="vertical-form-1"
              v-model="count"
              type="number"
              class="form-control"
              placeholder="Number"
            />

            <svg
              v-if="count != '' && !countSelected"
              @click="countField(qrGenerate, count)"
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
              v-show="qrGenerate.length >= 1 && count > 0"
              @click="removeCountField(index, qrGenerate, count)"
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
              v-for="(input, index) in qrGenerate"
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
                  type="number"
                  class="form-control"
                  name="orderNumber"
                  placeholder="Number"
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
                    @Click="print(input)"
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
                    @click="generate(input)"
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
              @click="onPrint(qrGenerate)"
            >
              <PrinterIcon class="w-4 h-4 mr-2" /> Print
            </button>

            <button
              id="tabulator-print"
              class="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
              @click="generateReport(qrGenerate)"
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

import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../../global-functions/functions";

import { exportCSVFile } from "../../../global-functions/functions";

import moment from "moment";

import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Replenish");
  },
  components: {
    Loading,
    paginate: Paginate,
    QrcodeVue,
  },

  name: "AddRemove",

  data() {
    return {
      count: "",
      countSelected: false,
      qrGenerate: [],
      const_txt: const_txt,
      warehouseList: [],
      addReplenish: false,
      isLoading: false,

      searchData: "",
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,

      titleChange: -1,
      formDataMovement: {
        abbreviation: "",
      },
      formDataMovementDefault: {
        abbreviation: "",
      },

      rules: {
        abbreviation: {
          required,
          maxLength: maxLength(10),
        },
      },

      itemsReplenish: [],

      doc: null,
      pdf: null,
      checkedData: [],
      selectedItemsData: [],

      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,

      headers: [
        { text: "LOT", value: "lot" },
        { text: "W House", value: "warehouse" },
        { text: "Stor Section", value: "storageSection" },
        { text: "Stor Type", value: "storageType" },
        { text: "Bin", value: "bin" },
        { text: "Inv No", value: "invoiceNumber" },
        { text: "Purch Ord No", value: "orderNumber" },
        { text: "PLU/SKU", value: "sku" },
        { text: "Supp Prod No", value: "supplierProductNumber" },
        { text: "Barcode", value: "barcode" },
        // { text: "QTY", value: "quantity" },
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
      pageCount: 20,
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
      paginationArchiveDefault: {
        pageNumber: 1,
        pageSize: 5,
      },

      pageCountArchive: 20,
      pageSizeArchive: 5,

      SelectedWarehouse: "",

      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,
    };
  },
  computed: {
    formTitle() {
      return this.titleChange === -1 ? "Add New Replenish" : "Edit Replenish";
    },
    btnName() {
      return this.titleChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },
  },
  created() {
    this.getDataFromApi("DFLT");
    this.getWarehouseData();
  },
  methods: {
    momentLocal(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY");
    },
    setReports() {
      if (this.allItems <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        const columns = [
          { title: "Warehouse", dataKey: "warehouse" },
          { title: "LOT", dataKey: "lot" },
          { title: "Storage Type", dataKey: "storageType" },
          { title: "Storage Section", dataKey: "storageSection" },
          { title: "Bin", dataKey: "bin" },
          { title: "Invoice No", dataKey: "invoiceNumber" },
          { title: "Purchase Order No", dataKey: "orderNumber" },
          { title: "Quantity", dataKey: "quantity" },
          { title: "PLU/SKU", dataKey: "sku" },
          { title: "Expiration Date", dataKey: "expirationDate" },
          { title: "Barcode", dataKey: "barcode" },
          { title: "Supplier Product No", dataKey: "supplierProductNumber" },
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
            warehouse: el.warehouse,
            lot: el.lot,
            storageType: el.storageType,
            storageSection: el.storageSection,
            bin: el.bin,
            invoiceNumber: el.invoiceNumber,
            orderNumber: el.orderNumber,
            quantity: el.quantity,
            sku: el.sku,
            expirationDate: this.momentLocal(el.expirationDate),
            barcode: el.barcode,
            supplierProductNumber: el.supplierProductNumber,
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
      this.docs.save(`${"Replenish " + generateDate}.pdf`);
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
        var csvTitle = "Replenish " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "Warehouse",
          2: "LOT",
          3: "Storage Type",
          4: "Storage Section",
          5: "Bin",
          6: "Invoice No",
          7: "Quantity",
          8: "PLU/SKU",
          9: "Barcode",
          10: "Supplier Product No",
          11: "Purchase Order No",
          12: "Expiration Date",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.warehouse,
            2: item.lot,
            3: item.storageType,
            4: item.storageSection,
            5: item.bin,
            6: item.invoiceNumber,
            7: item.quantity,
            8: item.sku,
            9: item.barcode,
            10: item.supplierProductNumber,
            11: item.orderNumber,
            12: this.momentLocal(item.expirationDate),
          });
        });
        exportCSVFile(csvHeaders, csvItems, csvTitle);
      }
    },

    getAllDataFromApi(SelectedWarehouse) {
      var totalCount = this.itemsData.totalCount;
      var pagination = { pageNumber: 1, pageSize: totalCount };
      this.isLoading = true;
      axios
        .post(
          "Movements/Replenishments/Pagination/" + SelectedWarehouse,
          pagination
        )
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
    getDataFromApi(SelectedWarehouse) {
      this.isLoading = true;
      axios
        .post(
          "Movements/Replenishments/Pagination/" + SelectedWarehouse,
          this.pagination
        )
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

    getWarehouseData() {
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("Warehouses/Paginated", pagination)
        .then((response) => {
          this.warehouseList = response.data.data.items;

          if (this.warehouseList.length == 0) {
            warningToast("Please Add Items in Warehouse");
            this.addMovement = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
  },
};
</script>
