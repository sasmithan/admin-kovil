<template>
  <div class="mt-5 w-full">
    <div
      class="intro-y lg:flex lg:flex-row lg:items-end lg:space-x-2 lg:justify-between md:flex md:flex-row md:items-end md:space-x-1 md:justify-between flex flex-wrap flex-col justify-end items-end mt-2 w-full"
    >
      <div class="flex space-x-1">
        <div>
          <label for="regular-form-1" class="form-label">Select Year</label>
          <TomSelect
            v-model="reportData.year"
            :options="{
              placeholder: 'Select..',
            }"
            class="w-60"
            @change="showReports()"
          >
            <option>SELECT</option>
            <option :value="item.year" v-for="(item, i) in yearsList" :key="i">
              {{ item.year }}
            </option>
          </TomSelect>
        </div>
        <div class="hidden">
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
            v-if="reportData.year != ''"
            href="javascript:;"
            @click="showReports()"
            class="hidden btn btn-primary shadow-md lg:w-auto w-full text-xs lg:text-sm mt-7"
          >
            GET REPORT
          </a>
        </div>
        <div>
          <a
            v-if="reportData.year != ''"
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in reportsLocal" :key="i" class="intro-x">
            <td v-for="(header, index) in headers" :key="index">
              {{ item[header.value] }}
            </td>
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
import { exportCSVFile } from "../../../global-functions/functions";
import monthsJSON from "@/assets/json/months.json";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { const_txt } from "../../../global-functions/const";

import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../../global-functions/functions";

import yearsJSON from "@/assets/json/years.json";

import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Revenue Reports");
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
          text: "Frequency",
          value: "frequency",
        },
        { text: "Total Sales", value: "totalSales" },

        { text: "Sales Return", value: "salesReturn" },
        { text: "Revenue", value: "revenue" },
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
        //    customerId: "",
        year: "",
      },
      yearsList: yearsJSON,
      reportsInfo: "",
      reports: [],
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
    // this.getCurrentMonth();
    //  this.getCurrentYear();
  },
  methods: {
    setReports() {
      if (this.reports <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        const columns = [
          { title: "Frequency", dataKey: "frequency" },
          { title: "Total Sales", dataKey: "totalSales" },
          { title: "Sales Return", dataKey: "salesReturn" },
          { title: "Revenue", dataKey: "revenue" },
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
            frequency: el.frequency,
            totalSales: el.totalSales,
            salesReturn: el.salesReturn,
            revenue: el.revenue,
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
      this.docs.save(`${"Revenue Report " + generateDate}.pdf`);
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
        var csvTitle = "Revenue Report " + generateDate;
        var items = this.reports;
        var csvItems = [];

        var csvHeaders = {
          1: "Frequency",
          2: "Total Sales",
          3: "Sales Return",
          4: "Revenue",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.frequency,
            2: item.totalSales,
            3: item.salesReturn,
            4: item.revenue,
          });
        });
        exportCSVFile(csvHeaders, csvItems, csvTitle);
      }
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

    getCurrentYear() {
      const today = new Date();
      this.reportData.year = today.getFullYear();
      this.getReports();
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
      //this.getReports();
    },
    getCustomers() {
      this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("Customers/Paginated", pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.customers = response.data.data.items;

            // if (this.customers.length == 0) {
            //   alert("Please Add Customers First");

            // }
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
          //
        })
        .catch((error) => {
          alert("Get Customers :" + error);
        });
    },

    clearReports() {
      this.reportData.year = "";
      //    this.getCurrentYear();
      this.reports = [];
      this.reportsLocal = [];
    },
    showReports() {
      this.getReports();
    },

    getReports() {
      var item = Object.assign({}, this.reportData);

      axios
        .get(`ReportFinal/RevenueReport?year=${item.year}`)
        .then((response) => {
          //console.log(response);
          this.reportsInfo = response;
          this.reports = response.data.data;
          if (this.isActive == 1) {
            this.pdfPrint();
          } else if (this.isActive == 2) {
            this.csvDownload();
          } else if (this.isActive == 3) {
            this.pdfDownload();
          }
          this.setLocalReport();
          if (this.reports.length == 0) {
            successToast("NO DATA ", response.data.message);
          } else {
            // successToast("Reports Updated Successfully");
          }
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
