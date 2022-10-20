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
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto">
      <table class="table table-report -mt-2 table-auto">
        <thead>
          <tr class="uppercase whitespace-nowrap">
            <th>Invoice Number</th>
            <th
              class="whitespace-nowrap"
              v-for="(header, i) in headers"
              :key="i"
            >
              {{ header.text }}
            </th>
            <th>Invoice Date</th>
            <th>Dispatched Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i" class="intro-x">
            <td class="cursor-pointer">
              {{ item.invoiceNumber }}
            </td>
            <td v-for="(header, index) in headers" :key="index">
              {{ item[header.value] }}
            </td>
            <td class="cursor-pointer">
              {{ momentLocal(item.invoiceDate) }}
            </td>
            <td class="cursor-pointer">
              {{ momentLocal(item.receivedDate) }}
            </td>
            <td>
              <div
                class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                :style="supplierInvoiceStatusColor(item.status)"
              >
                {{ supplierInvoiceStatus(item.status) }}
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
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";

import { required, minLength, maxLength, integer } from "@vuelidate/validators";
import axios from "../../../services/http-common";
import Paginate from "vuejs-paginate-next";
import moment from "moment";

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

import { exportCSVFile } from "../../../global-functions/functions";

import {
  currencyFormat,
  percentageFormat,
  temperatureFormat,
  weightFormat,
  removeNullValue,
} from "../../../global-functions/functions";

import {
  supplierInvoiceStatus,
  supplierInvoiceStatusColor,
} from "../../../global-functions/status";

import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Cutsomer Invoices");
  },
  components: {
    Loading,
    paginate: Paginate,
    autoTable,
  },
  data() {
    return {
      doc: null,

      isLoading: false,

      searchData: "",

      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,

      formDataInvoice: {
        invoiceNumber: "",
        orderNumber: "",
        invoiceDate: "",
        receivedDate: "",
        location: "",
        status: "",
        shipVia: "",
        salesRep: "",
        currency: "",
        supplierId: 0,
      },
      formDataInvoiceDefault: {
        invoiceNumber: "",
        orderNumber: "",
        invoiceDate: "",
        receivedDate: "",
        location: "",
        status: "",
        shipVia: "",
        salesRep: "",
        currency: "",
        supplierId: 0,
      },

      rules: {
        invoiceNumber: {
          required,
          minLength: minLength(2),
        },
        supplierId: {
          required,
          minLength: minLength(2),
        },
        invoiceDate: {
          required,
          minLength: minLength(2),
        },
      },

      headers: [
        // { text: "ID", value: "invoiceId" },
        // { text: "Invoice Number", value: "invoiceNumber" },
        { text: "Supplier", value: "supplierName" },
        { text: "Order Number", value: "orderNumber" },
        // { text: "Invoice Date", value: "invoiceDate" },
        // { text: "Received Date", value: "receivedDate" },
      ],
      pagination: {
        pageNumber: 1,
        pageSize: this.pageSize,
        search: "",
      },
      defaultPagination: {
        pageNumber: 1,
        pageSize: this.pageSize,
        search: "",
      },

      pageCount: 0,
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
  filters: {
    moment: function (date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
  },
  computed: {},
  created() {
    this.getDataFromApi();
  },
  watch: {},

  setReports() {
    if (this.allItems <= 0) {
      warningToast(const_txt.NO_DATA);
      this.isLoading = false;
    } else {
      const columns = [
        { title: "Invoice Number", dataKey: "invoiceNumber" },
        { title: "Supplier", dataKey: "supplierName" },
        { title: "Order Number", dataKey: "orderNumber" },
        { title: "Invoice Date", dataKey: "invoiceDate" },
        { title: "Received Date", dataKey: "receivedDate" },
        { title: "Status", dataKey: "status" },
        { title: "Location", dataKey: "location" },
        { title: "Ship Via", dataKey: "shipVia" },
        { title: "Sales Rep", dataKey: "salesRep" },
        { title: "Currency", dataKey: "currency" },
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
          invoiceNumber: el.invoiceNumber,
          supplierName: el.supplierName,
          orderNumber: el.orderNumber,
          invoiceDate: el.invoiceDate,
          receivedDate: el.receivedDate,
          status: el.status,
          location: el.location,
          shipVia: el.shipVia,
          salesRep: el.salesRep,
          currency: el.currency,
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
    this.docs.save(`${"Customer Invoice " + generateDate}.pdf`);
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
      var csvTitle = "Customer Invoice " + generateDate;
      var items = this.allItems;
      var csvItems = [];

      var csvHeaders = {
        1: "Invoice Number",
        2: "Supplier",
        3: "Order Number",
        4: "Invoice Date",
        5: "Received Date",
        6: "Status",
        7: "Location",
        8: "Ship Via",
        9: "Sales Rep",
        10: "Currency",
      };

      items.forEach((item) => {
        csvItems.push({
          1: item.invoiceNumber,
          2: item.supplierName,
          3: item.orderNumber,
          4: item.invoiceDate,
          5: item.receivedDate,
          6: item.status,
          7: item.location,
          8: item.shipVia,
          9: item.salesRep,
          10: item.currency,
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
      .post("CustomerInvoices/Paginated", pagination)
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
  methods: {
    supplierInvoiceStatus(status) {
      return supplierInvoiceStatus(status);
    },
    supplierInvoiceStatusColor(status) {
      return supplierInvoiceStatusColor(status);
    },

    currencyFormat(price) {
      return currencyFormat(price);
    },
    percentageFormat(val) {
      return percentageFormat(val);
    },
    temperatureFormat(val) {
      return temperatureFormat(val);
    },
    weightFormat(val) {
      return weightFormat(val);
    },

    momentLocal(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY");
    },

    getSuppliers() {
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("Suppliers/Paginated", pagination)
        .then((response) => {
          this.suppliers = response.data.data.items;
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
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
      this.formDataInvoice = Object.assign({}, this.formDataInvoiceDefault);
    },
    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("CustomerInvoices/Paginated", this.pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsData = response.data.data;
            this.items = response.data.data.items;
            this.pageCount = this.itemsData.totalPages;

            for (var i = 0; i < this.items.length; i++) {
              this.items[i].selected = false;
            }
            this.isLoading = false;
          } else {
            warningToast(response.data.message);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
          // localStorage.setItem("errorMessage", error);
          // router.push("/page-down");
        });
    },

    connectTimetoDate() {
      var currentTime = moment(new Date()).format();
      var splitTime = currentTime.split("T");

      var invoiceDate = moment(this.formDataInvoice.invoiceDate).format(
        "YYYY-MM-DD"
      );
      invoiceDate = invoiceDate.concat("T").concat(splitTime[1]);
      this.formDataInvoice.invoiceDate = invoiceDate;

      var receivedDate = moment(this.formDataInvoice.receivedDate).format(
        "YYYY-MM-DD"
      );
      receivedDate = receivedDate.concat("T").concat(splitTime[1]);
      this.formDataInvoice.receivedDate = receivedDate;
    },
  },
};
</script>
