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
            @click="showModal()"
            class="btn btn-primary shadow-md lg:w-auto w-1/2 text-xs lg:text-sm"
          >
            Create Lot Numbers
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
                <option value="DFLT">DFLT</option>
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
                {{ item[header.value] }}
              </td>
              <td>
                {{ momentLocal(item.expirationDate) }}
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

  <MoveableModal
    :show="addMovement"
    @hidden="addMovement = false"
    backdrop="static"
    size="modal-sl-80"
    :title="formTitle"
    @close="closeForm()"
  >
    <ModalBody class="flex justify-center space-y-4">
      <div class="flex flex-col space-y-4 w-full">
        <div>
          <label for="regular-form-1" class="form-label">Warehouse</label>

          <TomSelect
            v-model="formDataMovement.warehouse"
            :options="{
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full mr-32"
            @change="getDataFromMovement(formDataMovement.warehouse)"
          >
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

        <div v-if="formDataMovement.warehouse != ''">
          <div class="pb-4">
            Last Created LOT :
            <span class="bg-slate-200 text-success px-2 py-2">{{
              itemsMovement || "Nil"
            }}</span>
          </div>
          <label for="regular-form-1" class="form-label">Number of LOT</label>

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
              @click="countField(formDataMovement.lots, count)"
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
              v-show="formDataMovement.lots.length >= 1 && count > 0"
              @click="removeCountField(index, formDataMovement.lots, count)"
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
                <th>LOT</th>
              </tr>
            </thead>
            <tr
              class="intro-x"
              v-for="(input, index) in formDataMovement.lots"
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
                  placeholder="LOT Number"
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
              @click="onPrint(formDataMovement.lots)"
            >
              <PrinterIcon class="w-4 h-4 mr-2" /> Print
            </button>

            <button
              id="tabulator-print"
              class="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
              @click="generateReport(formDataMovement.lots)"
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
        {{ const_txt.CANCEL_BTN }}
      </button>
      <button @click="saveForm()" type="submit" class="btn btn-primary w-24">
        {{ btnName }}
      </button>
    </ModalFooter>
  </MoveableModal>
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
    store.dispatch("menuTitle/setSubMenuTitle", "Receival");
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
      const_txt: const_txt,
      warehouseList: [],
      addMovement: false,
      isLoading: false,

      titleChange: -1,
      formDataMovement: {
        warehouse: "",
        lots: [],
      },
      formDataMovementDefault: {
        warehouse: "",
        lots: [],
      },

      itemsMovement: [],

      doc: null,
      pdf: null,
      checkedData: [],
      selectedItemsData: [],

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

      SelectedWarehouse: "",

      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,
    };
  },
  computed: {
    formTitle() {
      return this.titleChange === -1 ? "Add New Receival" : "Edit Receival";
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
      this.docs.save(`${"Receival " + generateDate}.pdf`);
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
        var csvTitle = "Receival " + generateDate;
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
      this.isLoading = true;
      var totalCount = this.itemsData.totalCount;
      var pagination = { pageNumber: 1, pageSize: totalCount };
      axios
        .post("Movements/Pagination/" + SelectedWarehouse, pagination)
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

    countField(fieldType, count) {
      var str = parseInt(this.itemsMovement.substring(1));
      var str_c = this.itemsMovement.charAt(0);
      console.log(str);
      console.log(str_c);
      console.log("RR", fieldType, count);
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

    getDataFromMovement(abbreviation) {
      this.isLoading = true;
      axios
        .post("Movements/Lots/LastCreated/" + abbreviation)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsMovement = response.data.data;
            console.log("data movement", response);
            this.isLoading = false;
          } else {
            warningToast(response.data.message);
            this.isLoading = false;
          }
        });
      this.isLoading = false;
    },

    setSelectReport(qrGenerate) {
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

    setReport(qrGenerate) {
      if (this.checkedData.length > 0) {
        this.setSelectReport(qrGenerate);

        var qrGenerate = this.selectedItemsData;
      } else {
        var qrGenerate = qrGenerate;
      }

      this.doc = new jsPDF({
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

        data.push(obj);
      });

      for (var j = 0; j < data.length; j++) {
        var imgData = "/src/assets/images/pl_logo2.png";
        this.doc.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
        // this.doc
        //   .setFontSize(16)
        //   .text("Order Number : ", 5, 1.2);

        this.doc.setLineWidth(0.01).line(0.5, 2.2, 8.0, 2.2);

        this.doc.setFontSize(14).text("Deliver To :", 0.5, 2.5);

        this.doc.setFontSize(12).text("PHARMATEC PTE LTD", 0.7, 2.7);
        this.doc.setFontSize(12).text("62 Bank St,", 0.7, 2.9);
        this.doc.setFontSize(12).text("P.O.Box 450,Ba,", 0.7, 3.1);
        this.doc.setFontSize(12).text("Fiji Islands", 0.7, 3.3);
        this.doc.setFontSize(12).text("Ph: 6674933", 0.7, 3.5);
        this.doc.setFontSize(12).text("Fax: 6670118", 0.7, 3.7);
        this.doc
          .setFontSize(12)
          .text("Email: admin@pharmatec.com.fj", 0.7, 3.9);

        //trading partner
        this.doc.setFontSize(14).text("Trading Partner :", 5, 2.5);

        // this.doc
        //   .setFontSize(12)
        //   .text(

        //       " fname" ,
        //     5.2,
        //     2.7
        //   );
        // this.doc
        //   .setFontSize(12)
        //   .text("this.formDataOrder.customer.company", 5.2, 2.9);
        // this.doc
        //   .setFontSize(12)
        //   .text("this.formDataOrder.customer.mobile", 5.2, 3.1);
        // this.doc
        //   .setFontSize(12)
        //   .text("this.formDataOrder.customer.email", 5.2, 3.3);
        // this.doc
        //   .setFontSize(12)
        //   .text("Date: " + "this.momentLocal(this.formDataOrder.time)", 5.2, 3.5);
        // this.doc
        //   .setFontSize(12)
        //   .text(
        //     "Total : " + 'this.currencyFormat(this.formDataOrder.amount)',
        //     5.2,
        //     3.7
        //   );
        // this.doc
        //   .setFontSize(12)
        //   .text(
        //     "Booking No: ",
        //     5.2,
        //     3.9
        //   );
        var qrCanvas = document.getElementById(`fieldNoQR-${data[j].fieldNo}`);
        this.doc.setFontSize(12).text("QR Code", 0.7, 4.5);
        if (qrCanvas) {
          this.doc.addImage(qrCanvas.toDataURL(), "JPEG", 0.7, 4.7, 0.75, 0.75);
        }

        this.doc.setFontSize(12).text("Number: " + data[j].fieldNo, 4.0, 4.5);
        if (j < data.length - 1) {
          this.doc.addPage();
        }
      }
    },

    onPrint(qrGenerate) {
      this.setReport(qrGenerate);
      this.doc.autoPrint();
      this.doc.output("dataurlnewwindow");
    },

    generateReport(qrGenerate) {
      this.setReport(qrGenerate);
      var generateDate = new Date().toLocaleString();
      this.doc.save(`${"QRCode" + "_" + generateDate}.pdf`);
    },

    report(input) {
      const qrCanvas = document.getElementById(`fieldNoQR-${input.fieldNo}`);
      this.pdf = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: "a4",
      });

      var imgData = "/src/assets/images/pl_logo2.png";
      this.pdf.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
      // this.pdf
      //   .setFontSize(16)
      //   .text("Order Number : ", 5, 1.2);

      this.pdf.setLineWidth(0.01).line(0.5, 2.2, 8.0, 2.2);

      this.pdf.setFontSize(14).text("Deliver To :", 0.5, 2.5);

      this.pdf.setFontSize(12).text("PHARMATEC PTE LTD", 0.7, 2.7);
      this.pdf.setFontSize(12).text("62 Bank St,", 0.7, 2.9);
      this.pdf.setFontSize(12).text("P.O.Box 450,Ba,", 0.7, 3.1);
      this.pdf.setFontSize(12).text("Fiji Islands", 0.7, 3.3);
      this.pdf.setFontSize(12).text("Ph: 6674933", 0.7, 3.5);
      this.pdf.setFontSize(12).text("Fax: 6670118", 0.7, 3.7);
      this.pdf.setFontSize(12).text("Email: admin@pharmatec.com.fj", 0.7, 3.9);

      //trading partner
      this.pdf.setFontSize(14).text("Trading Partner :", 5, 2.5);

      // this.doc
      //   .setFontSize(12)
      //   .text(

      //       " fname" ,
      //     5.2,
      //     2.7
      //   );
      // this.doc
      //   .setFontSize(12)
      //   .text("this.formDataOrder.customer.company", 5.2, 2.9);
      // this.doc
      //   .setFontSize(12)
      //   .text("this.formDataOrder.customer.mobile", 5.2, 3.1);
      // this.doc
      //   .setFontSize(12)
      //   .text("this.formDataOrder.customer.email", 5.2, 3.3);
      // this.doc
      //   .setFontSize(12)
      //   .text("Date: " + "this.momentLocal(this.formDataOrder.time)", 5.2, 3.5);
      // this.doc
      //   .setFontSize(12)
      //   .text(
      //     "Total : " + 'this.currencyFormat(this.formDataOrder.amount)',
      //     5.2,
      //     3.7
      //   );
      // this.doc
      //   .setFontSize(12)
      //   .text(
      //     "Booking No: ",
      //     5.2,
      //     3.9
      //   );

      this.pdf.setFontSize(12).text("QR Code: ", 0.7, 4.5);
      if (qrCanvas) {
        this.pdf.addImage(qrCanvas.toDataURL(), "JPEG", 0.7, 4.7, 0.75, 0.75);
      }

      this.pdf.setFontSize(12).text("Number: " + input.fieldNo, 4.0, 4.5);
    },

    print(input) {
      this.report(input);
      this.pdf.autoPrint();
      this.pdf.output("dataurlnewwindow");
    },

    generate(input) {
      this.report(input);
      var generateDate = new Date().toLocaleString();
      this.pdf.save(`${"Number" + input.fieldNo + "_" + generateDate}.pdf`);
    },

    showModal() {
      this.setDefault();
      this.titleChange = -1;
      this.getWarehouseData();
      this.addMovement = true;
    },
    closeForm() {
      this.addMovement = false;
      this.setDefault();
    },

    saveForm() {
      if (this.titleChange === -1) {
        var lotsArray = [];
        for (var i = 0; i < this.formDataMovement.lots.length; i++) {
          var lotNo = this.formDataMovement.lots[i].fieldNo;
          lotsArray.push(lotNo);
        }

        var formDataMovement = {};
        formDataMovement.warehouse = this.formDataMovement.warehouse;
        formDataMovement.lots = lotsArray;

        this.isLoading = true;
        axios
          .post("Movements/Lots/Create", formDataMovement)
          .then((response) => {
            if (response.data.success === true) {
              this.addMovement = false;
              this.getDataFromApi(this.SelectedWarehouse);
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
      }
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

    loadMoreData() {
      this.pagination.pageSize = parseInt(this.pagination.pageSize) + 10;
      this.getDataFromApi(this.SelectedWarehouse);
    },
    pageSizeChange() {
      this.pagination.pageSize = this.pageSize;
      this.getDataFromApi(this.SelectedWarehouse);
    },
    changePage(pageNum) {
      this.pagination.pageNumber = pageNum;
      this.pagination.pageSize = this.pageSize;
      this.getDataFromApi(this.SelectedWarehouse);
    },
    setDefault() {
      this.formDataMovement = Object.assign({}, this.formDataMovementDefault);
    },
    getDataFromApi(SelectedWarehouse) {
      this.isLoading = true;
      this.SelectedWarehouse = SelectedWarehouse;
      axios
        .post("Movements/Pagination/" + SelectedWarehouse, this.pagination)
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
