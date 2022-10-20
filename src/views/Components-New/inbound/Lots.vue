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
          <!-- <a
            href="javascript:;"
            @click="showModal()"
            class="btn btn-primary shadow-md lg:w-auto w-1/2 text-xs lg:text-sm"
          >
            Add New Receival
          </a> -->
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
              <th>Exp Date</th>
              <th>Qty</th>
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
                {{
                  item.expirationDate != null ||
                  item.expirationDate != undefined
                    ? momentLocal(item.expirationDate)
                    : "Nil"
                }}
              </td>
              <td>
                {{
                  item.quantity != null || item.quantity != undefined
                    ? item.quantity
                    : "Nil"
                }}
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
    store.dispatch("menuTitle/setSubMenuTitle", "LOTS");
  },
  components: {
    Loading,
    paginate: Paginate,
    QrcodeVue,
  },

  data() {
    return {
      isLoading: false,

      searchData: "",
      searchActive: false,

      formDataLOTS: {
        warehouse: "",
        lots: [],
      },
      formDataLOTSDefault: {
        warehouse: "",
        lots: [],
      },

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
        // sortColumnName: "movementId",
        // sortDirection: "desc",
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

      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,
    };
  },
  computed: {
    // formTitle() {
    //     return this.titleChange === -1 ? "Add New Receival" : "Edit Receival";
    //   },
  },
  created() {
    this.getDataFromApi();
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
          { title: "LOT", dataKey: "lot" },
          { title: "Warehouse", dataKey: "warehouse" },
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
      this.docs.save(`${"Lots " + generateDate}.pdf`);
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
        var csvTitle = "Lots " + generateDate;
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

    getAllDataFromApi() {
      this.isLoading = true;
      var totalCount = this.itemsData.totalCount;
      var pagination = { pageNumber: 1, pageSize: totalCount };
      axios
        .post("Movements/Pagination", pagination)
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

    loadMoreData() {
      this.pagination.pageSize = parseInt(this.pagination.pageSize) + 10;
      this.getDataFromApi();
    },

    pageSizeChange() {
      this.pagination.pageSize = this.pageSize;
      this.getDataFromApi();
    },
    changePage(pageNum) {
      this.pagination.pageNumber = pageNum;
      this.pagination.pageSize = this.pageSize;
      this.getDataFromApi();
    },

    setDefault() {
      this.formDataLOTS = Object.assign({}, this.formDataLOTSDefault);
    },

    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("Movements/Pagination", this.pagination)
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
  },
};
</script>
