<template>
  <div class="mt-5 w-full">
    <div
      class="intro-y lg:flex lg:flex-row lg:items-end lg:space-x-2 lg:justify-between md:flex md:flex-row md:items-end md:space-x-1 md:justify-between flex flex-wrap flex-col mt-2 w-full"
    >
      <div class="lg:flex space-x-1 sm:grid-col-12">
        <div>
          <label for="regular-form-1" class="form-label">Customer</label>
          <TomSelect
            v-model="reportData.customerId"
            :options="{
              placeholder: 'Select..',
            }"
            class="w-60"
          >
            <option>SELECT</option>
            <option
              :value="item.customerId"
              v-for="(item, i) in customers"
              :key="i"
            >
              {{ item.company }}
            </option>
          </TomSelect>
        </div>

        <div>
          <label for="regular-form-1" class="form-label">From Date</label>
          <PreviewComponent class="intro-y">
            <div class="">
              <Preview>
                <Litepicker
                  v-model="reportData.fromdate"
                  :options="{
                    autoApply: true,
                    showWeekNumbers: true,
                    dropdowns: {
                      minYear: 1990,
                      maxYear: null,
                      months: true,
                      years: true,
                    },
                  }"
                  class="form-control"
                />
              </Preview>
            </div>
          </PreviewComponent>
        </div>
        <div>
          <label for="regular-form-1" class="form-label">To Date</label>
          <PreviewComponent class="intro-y">
            <div class="">
              <Preview>
                <Litepicker
                  v-model="reportData.todate"
                  :options="{
                    autoApply: true,
                    showWeekNumbers: true,
                    dropdowns: {
                      minYear: 1990,
                      maxYear: null,
                      months: true,
                      years: true,
                    },
                  }"
                  class="form-control"
                />
              </Preview>
            </div>
          </PreviewComponent>
        </div>
        <div>
          <label for="regular-form-1" class="form-label">Filter </label>

          <Dropdown>
            <DropdownToggle class="btn px-2 box">
              <span class="w-5 h-5 flex items-center justify-center">
                <CalendarIcon class="lg:w-6 lg:h-6 w-4 h-4" />
              </span>
            </DropdownToggle>
            <DropdownMenu class="w-40">
              <DropdownContent>
                <DropdownItem
                  @click="setMonth(item)"
                  v-for="(item, i) in monthsList"
                  :key="i"
                >
                  <CalendarIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" />
                  {{ item.name }}
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div>
          <a
            v-if="reportData.customerId != ''"
            href="javascript:;"
            @click="showReports()"
            class="btn btn-primary shadow-md lg:w-auto w-full text-xs lg:text-sm mt-7"
          >
            GET REPORT
          </a>
        </div>
        <div>
          <a
            v-if="reportData.customerId != ''"
            href="javascript:;"
            @click="clearReports()"
            class="btn btn-primary shadow-md lg:w-auto w-full text-xs lg:text-sm mt-7"
          >
            CLEAR
          </a>
        </div>

        <!-- <div class="w-56">
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
        </div> -->
        <div class="hidden md:block mx-auto text-slate-500">
          <!-- Showing 1 to 10 of 150 entries -->
        </div>
      </div>

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
            <DropdownItem @click="csvDownload">
              <FileTextIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" /> Export to
              Excel
            </DropdownItem>
            <DropdownItem @click="pdfExport">
              <FileTextIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" /> Export to PDF
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
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
            <th>Order Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in reportsLocal" :key="i" class="intro-x">
            <td v-for="(header, index) in headers" :key="index">
              {{ item[header.value] }}
            </td>

            <td>{{ momentLocal(item.orderDate) }}</td>
            <td>
              <div
                class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                :style="customerOrderStatusColor(item.status)"
              >
                {{ customerOrderStatus(item.status) }}
              </div>
            </td>
            <!-- <td class="table-report__action w-56">
              <div class="flex justify-center items-center">
                <a
                  class="flex items-center mr-3 font-bold"
                  href="javascript:;"
                  @click="viewItemInfo(item)"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="INFO"
                  >
                    <InfoIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                  </Tippy>
                </a>
                <a
                  class="flex items-center mr-3 font-bold"
                  href="javascript:;"
                  @click="viewItemInfo(item)"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="Sales Reports"
                  >
                    <FileTextIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                  </Tippy>
                </a>
              </div>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <!-- END: Data List -->

    <div
      v-if="reports.length == 0"
      class="mb-5 border-2 shadow-md p-2 font-semibold w-full col-span-12 text-center"
    >
      No Data
    </div>

    <!-- BEGIN: Pagination -->

    <div
      v-if="reports.length != 0"
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

import monthsJSON from "@/assets/json/months.json";

import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../../global-components/functions/functions";

import { exportCSVFile } from "../../../global-functions/functions";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { const_txt } from "../../../global-functions/const";

import {
  customerOrderStatus,
  customerOrderStatusColor,
} from "../../../global-functions/status";

import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Customer Sales Reports");
  },
  components: {
    paginate: Paginate,
  },
  data() {
    return {
      searchData: "",
      searchActive: false,

      headers: [
        {
          text: "OrderNumber",
          value: "orderNumber",
        },
        { text: "Name", value: "customerName" },
        { text: "Total Amount", value: "totalAmount" },
        { text: "Discount", value: "totalDiscount" },
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
      reportStart: 0,
      reportEnd: 5,
      pageCount: 0,
      pageRowCountReport: 5,
      reportsLocal: [],
      pageSize: 10,

      customers: [],
      reportData: {
        customerId: "",
        fromdate: "",
        todate: "",
      },
      reportsInfo: "",
      reports: [
        // {
        //   orderNumber: "CO001",
        //   orderDate: "0001-01-01T00:00:00",
        //   customerName: "reachel",
        //   totalAmount: 1.85,
        //   status: 1,
        //   totalDiscount: "0.000",
        // },
        // {
        //   orderNumber: "CO001",
        //   orderDate: "0001-01-01T00:00:00",
        //   customerName: "reachel",
        //   totalAmount: 1.85,
        //   status: 2,
        //   totalDiscount: "0.000",
        // },
        // {
        //   orderNumber: "CO001",
        //   orderDate: "0001-01-01T00:00:00",
        //   customerName: "reachel",
        //   totalAmount: 1.85,
        //   status: 3,
        //   totalDiscount: "0.000",
        // },
      ],
      monthsList: monthsJSON,

      selectedMonth: "",
      selectedCustomer: {
        firstName: "",
        lastName: "",
      },

      isActive: 0,
      docs: null,
    };
  },
  computed: {
    formTitle() {
      return this.titleChange === -1 ? "Add New Customer" : "Edit Customer";
    },
  },
  created() {
    this.getCurrentMonth();
    this.getCustomers();
    //this.test();
  },
  methods: {
    setReports() {
      if (this.reports <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        const columns = [
          { title: "Order Number", dataKey: "orderNumber" },
          { title: "Name", dataKey: "customerName" },
          { title: "Total Amount", dataKey: "totalAmount" },
          { title: "Discount", dataKey: "storageTypeName" },
        ];
        this.docs = new jsPDF({
          orientation: "landscape",
          unit: "in",
          format: "a4",
        });

        let data = [];
        let i = 0;
        let obj;

        this.reports.forEach((el) => {
          obj = {
            orderNumber: el.orderNumber,
            customerName: el.customerName,
            totalAmount: el.totalAmount,
            totalDiscount: el.totalDiscount,
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
      this.getReports();
      this.isActive = 1;
    },

    pdfPrint() {
      this.setReports();
      this.docs.autoPrint();
      this.docs.output("dataurlnewwindow");
    },

    pdfExport() {
      this.getReports();
      this.isActive = 3;
    },

    pdfDownload() {
      this.setReports();
      var generateDate = new Date().toLocaleString();
      this.docs.save(`${"Customer Sales Report " + generateDate}.pdf`);
    },

    csvExport() {
      this.getReports();
      this.isActive = 2;
    },

    csvDownload() {
      if (this.reports <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        var generateDate = new Date().toLocaleString();
        var csvTitle = "Customer Sales Report " + generateDate;
        var items = this.reports;
        var csvItems = [];

        var csvHeaders = {
          1: "Order Number",
          2: "Name",
          3: "Total Amount",
          4: "Discount",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.orderNumber,
            2: item.customerName,
            3: item.totalAmount,
            4: item.totalDiscount,
          });
        });
        exportCSVFile(csvHeaders, csvItems, csvTitle);
      }
    },

    customerOrderStatus(status) {
      return customerOrderStatus(status);
    },
    customerOrderStatusColor(status) {
      return customerOrderStatusColor(status);
    },

    momentLocal(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY");
    },
    momentLocalWithTime(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY, hh:mm a");
    },
    getCurrentMonth() {
      const today = new Date();
      this.selectedMonth = today.getMonth();
      this.getMonthRange();
    },

    setMonth(item) {
      this.selectedMonth = item.value - 1;
      this.getMonthRange();
    },
    getMonthRange() {
      var d = new Date();
      var start = new Date(d.getFullYear(), this.selectedMonth, 1);
      var end = new Date(d.getFullYear(), this.selectedMonth + 1, 0);

      var startdate =
        start.getFullYear() +
        "-" +
        (start.getMonth() + 1) +
        "-" +
        start.getDate();
      var enddate =
        end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate();

      this.reportData.fromdate = moment(startdate).format("DD MMMM, YYYY");
      this.reportData.todate = moment(enddate).format("DD MMMM, YYYY");
      if (this.reportData.customerId != "") {
        this.getReports();
      }
    },
    getCustomers() {
      this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("Customers/Paginated", pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.customers = response.data.data.items;
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          alert("Get Customers :" + error);
        });
    },

    clearReports() {
      this.reportData.customerId = "";
      this.reports = [];
      this.reportsLocal = [];
      this.getCurrentMonth();
    },
    showReports() {
      var customerId = this.reportData.customerId;
      if (customerId == "SELECT") {
        failedToast("Please Select Customer");
      } else {
        this.getReports();
      }
    },

    getReports() {
      var item = Object.assign({}, this.reportData);
      item.fromdate = moment(item.fromdate).format("YYYY-MM-DD");
      //    item.fromdate = item.fromdate.concat("T").concat("00:00:00.000Z");
      item.todate = moment(item.todate).format("YYYY-MM-DD");
      //   item.todate = item.todate.concat("T").concat("23:59:59.000Z");
      if (item.customerId != "") {
        axios
          .get(
            `ReportFinal/MonthlyCustomerSales?FromDate=${item.fromdate}&ToDate=${item.todate}&CustomerId=${item.customerId}`
          )
          .then((response) => {
            if (response.data.success === true) {
              if (response.data.data.length == 0) {
                successToast("NO DATA ", response.data.message);
              }
              if (this.isActive == 1) {
                this.pdfPrint();
              } else if (this.isActive == 2) {
                this.csvDownload();
              } else if (this.isActive == 3) {
                this.pdfDownload();
              }

              this.reportsInfo = response;
              this.reports = response.data.data;
              this.setLocalReport();
            } else {
              failedToast(response.data.message);
            }
          });
      } else {
        // axios
        //   .get(
        //     `Report/MonthlySalesReportwoCustomer?FromDate=${item.fromdate}&ToDate=${item.todate}`
        //   )
        //   .then((response) => {
        //     if (response.success == true) {
        //       this.reports = response.data.data;
        //     } else {
        //       failedToast(response.data.message);
        //     }
        //   });
      }
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
      this.pageSize = this.pagination.pageSize;
      this.getDataFromApi();
    },
    pageSizeChange() {
      this.pagination.pageSize = this.pageSize;
      this.getDataFromApi();
    },
    changePage(pageNum) {
      this.reportEnd = this.pageRowCountReport * pageNum;
      this.reportStart = this.reportEnd - this.pageRowCountReport;
      this.reportsLocal = this.reports.slice(this.reportStart, this.reportEnd);
      console.log("this.reportsLocal", this.reportsLocal);
    },
    setLocalReport() {
      var pageCount = this.reports.length / this.pageRowCountReport;
      let pageCountRound = Math.round(pageCount);
      if (pageCount > pageCountRound) {
        pageCountRound += 1;
        this.pageCount = pageCountRound;
      } else {
        this.pageCount = pageCountRound;
      }

      this.reportsLocal = this.reports.slice(this.reportStart, this.reportEnd);
    },
  },
};
</script>
