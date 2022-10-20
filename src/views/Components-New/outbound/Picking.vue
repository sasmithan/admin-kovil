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
                clearable
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
              <th></th>
              <th>Order#</th>
              <th>priority</th>
              <th>status</th>
              <th>type</th>
              <th>Order Created</th>
              <th>amount</th>
              <th>currency</th>
              <th>Booking#</th>
              <th>discount %</th>
              <th>discount Total</th>
              <th>note</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, i) in items" :key="i" class="intro-x">
              <td
                @click="
                  item.selected = true;
                  openToggle(item.orderNumber);
                "
                class="cursor-pointer"
                :style="item.selected ? getSelectedColor() : 'color: #1a73e8'"
              >
                <ChevronDownIcon
                  class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary pt-2"
                />
              </td>

              <td
                :style="item.selected ? getSelectedColor() : 'color: #1a73e8'"
              >
                {{ item.orderNumber != null ? item.orderNumber : "Nil" }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{ item.priority != null ? getPriority(item.priority) : "Nil" }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                  :style="{
                    'background-color': getStatusColor(item.status),
                  }"
                >
                  {{ item.status != null ? getStatus(item.status) : "Nil" }}
                </div>
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{ item.type != null ? getType(item.type) : "Nil" }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{ item.time != null ? momentLocal(item.time) : "Nil" }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{ currencyFormat(item.amount) }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{ item.currency != null ? item.currency : "Nil" }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{
                  item.despatchBookingNumber != null
                    ? item.despatchBookingNumber
                    : "Nil"
                }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{ percentageFormat(item.discountPercentage) }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{ currencyFormat(item.discountTotal) }}
              </td>

              <td class="w-24" :style="item.selected ? getSelectedColor() : ''">
                <div class="text-left line-clamp-2">
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    :content="item.note"
                  >
                    {{ item.note != null ? item.note : "Nil" }}
                  </Tippy>
                </div>
              </td>

              <!-- <td class="table-report__action">
                <div class="flex justify-end items-end">
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
                        class="
                          w-4
                          h-4
                          md:w-5 md:h-5
                          lg:w-6 lg:h-6
                          mr-1
                          text-primary
                        "
                      />
                    </Tippy>
                  </a>
                  <a class="flex items-center text-success" href="javascript:;">
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      @click="pickingConfirm(item.orderNumber, priority)"
                      content="Submit for picking"
                    >
                      <SendIcon
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
  </div>

  <MoveableModal
    :show="toggleModal"
    @hidden="toggleModal = false"
    backdrop="static"
    size="modal-sl-70"
    :title="'ORDER# : ' + orderNo"
    @close="toggleModal = false"
  >
    <ModalBody>
      <div class="intro-y col-span-12 overflow-auto">
        <table class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>PLU/SKU Name</th>
              <th>barcode/ean</th>
              <th>quantity</th>
              <th>price</th>
              <th>retail Price</th>
              <th>discounted Price</th>
              <th>discounted Reason</th>
              <th>status</th>
              <th>description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in orderLineArray" :key="i" class="intro-x">
              <td>
                {{ item.skuName != null ? item.skuName : "Nil" }}
              </td>

              <td>
                {{ item.ean != null ? item.ean : "Nil" }}
              </td>

              <td>
                {{ item.quantity != null ? item.quantity : "Nil" }}
              </td>

              <td>
                {{ currencyFormat(item.price) }}
              </td>

              <td>
                {{ currencyFormat(item.retailPrice) }}
              </td>

              <td>
                {{ currencyFormat(item.discountedPrice) }}
              </td>

              <td>
                {{
                  item.discountedReason != null ? item.discountedReason : "Nil"
                }}
              </td>

              <td>
                <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                  :style="{
                    'background-color': getStatusColor(item.status),
                  }"
                >
                  {{ item.status != null ? getStatus(item.status) : "Nil" }}
                </div>
              </td>
              <td class="w-24">
                <div class="text-left line-clamp-2">
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    :content="item.description"
                  >
                    {{ item.description != null ? item.description : "Nil" }}
                  </Tippy>
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

import countriesJSON from "@/assets/json/countries.json";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { const_txt } from "../../../global-functions/const";

import moment from "moment";
import {
  customerOrderStatus,
  customerOrderStatusColor,
} from "../../../global-functions/status";

import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../../global-functions/functions";

import {
  currencyFormat,
  percentageFormat,
  temperatureFormat,
  weightFormat,
  removeNullValue,
} from "../../../global-functions/functions";

import { exportCSVFile } from "../../../global-functions/functions";

import Moveable from "vue3-moveable";

import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Dropped Orders");
  },
  components: {
    Moveable,
    paginate: Paginate,
    Loading,
    autoTable,
  },
  data() {
    return {
      const_txt: const_txt,
      doc: null,

      searchData: "",
      isLoading: false,
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,

      titleChange: -1,

      formDataPicking: {
        orderNumber: "",
        note: "",
        type: "",
        time: "",
        amount: "",
        discountPercentage: "",
        discountTotal: "",
        status: "",
        statusList: "",
        despatchBookingNumber: "",
        currency: "",
        priority: "",
        customer: {},
        deliveryAddress: {},
        despatch: {},
        orderLines: [
          {
            quantity: 0,
            price: 0,
            retailPrice: 0,
            discountedPrice: 0,
            discountedReason: "",
            status: 1,
            skuName: "",
            ean: "",
            description: "",
            skuId: 0,
            sku: "",
            orderId: 0,
          },
        ],
      },
      formDataPickingDefault: {
        orderNumber: "",
        note: "",
        type: "",
        time: "",
        amount: "",
        discountPercentage: "",
        discountTotal: "",
        status: "",
        statusList: "",
        despatchBookingNumber: "",
        currency: "",
        priority: "",
        customer: {},
        deliveryAddress: {},
        despatch: {},
        orderLines: [
          {
            quantity: 0,
            price: 0,
            retailPrice: 0,
            discountedPrice: 0,
            discountedReason: "",
            status: 1,
            skuName: "",
            ean: "",
            description: "",
            skuId: 0,
            sku: "",
            orderId: 0,
          },
        ],
      },

      pagination: {
        pageNumber: 1,
        pageSize: 10,
        search: "",
        // sortColumnName: "name",
        // sortDirection: "asc",
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
      paginationArchiveDefault: {
        pageNumber: 1,
        pageSize: 5,
      },

      pageCountArchive: 20,
      pageSizeArchive: 5,

      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,

      typeItems: [],
      statusItems: [],
      priorityItems: [],

      orderLineArray: [],
      toggleModal: false,
      orderNo: "",
    };
  },
  computed: {
    formTitle() {
      return this.titleChange === -1 ? "Add New Picking" : "Edit Picking";
    },
  },
  watch: {
    toggleModal(val) {
      val || this.toggleModalClose();
    },
  },
  created() {
    this.getDataFromApi();
    this.getDataFromTypes();
    this.getDataFromStatus();
    // this.getDataFromPriority();
  },
  methods: {
    toggleModalClose() {
      this.isLoading = true;

      for (var i = 0; i < this.items.length; i++) {
        this.items[i].selected = false;
        this.isLoading = false;

        this.toggleModal = false;
      }
    },
    openToggle(orderNumber) {
      this.viewSubTable(orderNumber);
      this.orderNo = orderNumber;
      this.toggleModal = true;
    },
    viewSubTable(orderNumber) {
      this.isLoading = true;
      axios
        .get("OrderPickingQueue/" + orderNumber + "?warehouse=DFLT")
        .then((response) => {
          this.orderLineArray = response.data.data.orderLines;
          this.isLoading = false;
        })
        .catch((error) => {
          warningToast("No Order Available");
          this.isLoading = false;
        });
    },
    getDataFromTypes() {
      axios
        .get("Enums/OrderTypes")
        .then((response) => {
          this.typeItems = response.data;
        })
        .catch((error) => {
          warningToast("Type Not Found");
        });
    },
    getDataFromStatus() {
      axios
        .get("Enums/OrderStatuses")
        .then((response) => {
          this.statusItems = response.data;
        })
        .catch((error) => {
          warningToast("Status Not Found");
        });
    },
    getStatus(value) {
      try {
        return this.statusItems.find((x) => x.number === value).name;
      } catch (e) {
        console.log(e);
        return "Nil";
      }
    },
    getStatusColor(value) {
      try {
        return this.statusItems.find((x) => x.number === value).color;
      } catch (e) {
        console.log(e);
        return "Nil";
      }
    },
    getType(value) {
      try {
        return this.typeItems.find((type) => type.number === value).name;
      } catch (e) {
        console.log(e);
        return "Nil";
      }
    },

    getPriority(value) {
      try {
        if (value == 1) {
          return "Low";
        } else if (value == 2) {
          return "Medium";
        } else if (value == 3) {
          return "High";
        } else {
          return "Nil";
        }
        // return priorityData.find((x) => x.number === value).name;
      } catch (e) {
        console.log(e);
        return "Nil";
      }
    },

    setReports() {
      if (this.allItems <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        const columns = [
          { title: "Order#", dataKey: "orderNumber" },
          { title: "Amount", dataKey: "amount" },
          { title: "Order Created", dataKey: "time" },
          { title: "Booking#", dataKey: "despatchBookingNumber" },
          { title: "Customer", dataKey: "customer" },
          { title: "Address", dataKey: "deliveryAddress" },
          { title: "Note", dataKey: "note" },
          { title: "Status", dataKey: "status" },
          { title: "Type", dataKey: "type" },
          { title: "Discount Percentage", dataKey: "discountPercentage" },
          { title: "Discount Total", dataKey: "discountTotal" },
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
            orderNumber: el.orderNumber,
            amount: el.amount,
            time: el.time,
            despatchBookingNumber: el.despatchBookingNumber,
            customer:
              el.customer != null
                ? el.customer.firstName + " " + el.customer.lastName
                : "Nill",
            address:
              el.deliveryAddress != null
                ? el.deliveryAddress.addressLine +
                  "\n" +
                  el.deliveryAddress.postcode +
                  "\n" +
                  el.deliveryAddress.state +
                  "\n" +
                  el.deliveryAddress.city +
                  "\n" +
                  el.deliveryAddress.country
                : "Nill",
            note: el.note,
            status: this.getStatus(el.status),
            type: this.getType(el.type),
            discountPercentage: el.discountPercentage,
            discountTotal: el.discountTotal,
          };
          data.push(obj);
        });

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
      this.docs.save(`${"Picking " + generateDate}.pdf`);
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
        var csvTitle = "Picking " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "Order#",
          2: "Amount",
          3: "Order Created",
          4: "Booking#",
          5: "Customer",
          6: "Address",
          7: "Note",
          8: "Status",
          9: "Type",
          10: "Discount Percentage",
          11: "Discount Total",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.orderNumber,
            2: item.amount,
            3: item.time,
            4: item.despatchBookingNumber,
            5:
              item.customer != null
                ? item.customer.firstName + " " + item.customer.lastName
                : "Nil",
            6:
              item.deliveryAddress != null
                ? item.deliveryAddress.addressLine +
                  "\n" +
                  item.deliveryAddress.postcode +
                  "\n" +
                  item.deliveryAddress.state +
                  "\n" +
                  item.deliveryAddress.city +
                  "\n" +
                  item.deliveryAddress.country
                : "Nill",
            7: item.note,
            8: this.getStatus(item.status),
            9: this.getType(item.type),
            10: item.discountPercentage,
            11: item.discountTotal,
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
        .post("OrderPickingQueue?warehouse=DFLT", pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.allItemsData = response.data.data;
            this.allItems = response.data.data.items;
            console.log(this.allItems);
            // this.supplierItems = response.data.data.items.supplier;
            // console.log(this.supplierItems);
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
    customerOrderStatus(status) {
      return customerOrderStatus(status);
    },
    customerOrderStatusColor(status) {
      return customerOrderStatusColor(status);
    },

    getToday() {
      const today = new Date();

      this.formDataPicking.time = moment(today).format("DD MMMM, YYYY");
    },

    momentLocal(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY");
    },
    momentLocalWithTime(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY, hh:mm a");
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
      this.pagination.pageSize = this.pageSize;

      this.getDataFromApi();
    },
    setDefault() {
      this.formDataPicking = Object.assign({}, this.formDataPickingDefault);
      this.getToday();
    },
    getDataFromApi() {
      this.isLoading = true;
      axios
        .get("OrderPickingQueue?warehouse=DFLT")
        .then((response) => {
          // console.log(response);
          this.items = response.data.data;

          // var tempArray;
          // for (var j = 0; j < this.items.length; j++) {
          //   tempArray = response.data.data[j].orderLines;
          // }
          // this.orderLineArray = tempArray;
          // console.log(this.orderLineArray);

          // this.pageCount = this.itemsData.totalPages;
          for (var i = 0; i < this.items.length; i++) {
            this.items[i].selected = false;
          }
          this.isLoading = false;
        })
        .catch((error) => {
          warningToast("No Data Available");
          this.isLoading = false;
        });
    },

    connectTimetoDate() {
      var currentTime = moment(new Date()).format();
      var splitTime = currentTime.split("T");

      var time = moment(this.formDataPicking.time).format("YYYY-MM-DD");
      time = time.concat("T").concat(splitTime[1]);
      this.formDataPicking.time = time;

      var deliveryDate = moment(this.formDataPicking.deliveryDate).format(
        "YYYY-MM-DD"
      );
      deliveryDate = deliveryDate.concat("T").concat(splitTime[1]);
      this.formDataPicking.deliveryDate = deliveryDate;
    },
    archiveItem(item) {
      this.formDataPicking = Object.assign({}, item);
      this.archiveConfirmationModal = true;
      console.log(item);
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
      this.isLoading = true;
      var itemId = this.formDataPicking.orderId;

      axios.get("CustomerOrders/" + itemId + "/Archive").then((response) => {
        this.archiveConfirmationModal = false;
        this.getDataFromApi();
        successToast(response.data.message);
      });
    },
    viewArchives() {
      this.isLoading = true;
      axios
        .post("CustomerOrders/Archived", this.paginationArchive)
        .then((response) => {
          this.archiveData = response.data.data;
          this.archiveItems = response.data.data.items;
          this.pageCountArchive = this.archiveData.totalPages;

          this.archiveModal = true;
          this.isLoading = false;
        });
    },

    changePageArchive(pageNum) {
      this.paginationArchive.pageNumber = pageNum;
      this.viewArchives();
    },
    pageSizeChangeArchive() {
      this.paginationArchive.pageSize = this.pageSizeArchive;
      this.viewArchives();
    },
    restoreItem(item) {
      this.formDataPicking = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataPicking.orderId;

      axios.get("CustomerOrders/" + itemId + "/Restore").then((response) => {
        this.restoreConfirmationModal = false;
        this.viewArchives();
        this.getDataFromApi();
        if (this.archiveData.totalCount == 0) {
          this.archiveModal = false;
        }
      });
    },
    deleteItem(item) {
      this.formDataPicking = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataPicking.customerOrderId;
      axios.delete("CustomerOrders/" + itemId).then((response) => {
        this.deleteConfirmationModal = false;
        this.viewArchives();
      });
    },

    getSelectedColor() {
      return "background-color:rgb(22,78,99);color: white";
    },
  },
};
</script>
