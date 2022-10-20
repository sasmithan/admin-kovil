<template>
  <Loading
    :opacity="0.5"
    background-color="white"
    :can-cancel="true"
    v-model:active="isLoading"
    color="#164e63"
    loader="dots"
    :width="50"
    :height="50"
    :z-index="100000"
  />
  <div>
    <div class=" ">
      <div
        class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2"
      >
        <a
          href="javascript:;"
          @click="showModal()"
          class="btn btn-primary shadow-md mr-2"
        >
          Select PLU/SKU
        </a>
        <Dropdown>
          <DropdownToggle class="btn px-2 box mr-2 hidden">
            <span class="w-5 h-5 flex items-center justify-center">
              <ArrowDownIcon class="w-4 h-4" />
            </span>
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem>
                <PrinterIcon class="w-4 h-4 mr-2" /> Print
              </DropdownItem>
              <DropdownItem>
                <FileTextIcon class="w-4 h-4 mr-2" /> Export to Excel
              </DropdownItem>
              <DropdownItem>
                <FileTextIcon class="w-4 h-4 mr-2" /> Export to PDF
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>

        <!-- <div class="flex">
          <Tippy
            tag="a"
            href="javascript:;"
            class="tooltip"
            content="SELECT SUPPLIER"
          >
            <TomSelect
              v-model="supplierId"
              :options="{
                placeholder: 'Select..',
              }"
              class="w-60 cursor-pointer"
              @change="selectSupplier()"
            >
              <option>SELECT</option>
              <option
                :value="item.supplierId"
                v-for="(item, i) in suppliers"
                :key="i"
              >
                <div class="">
                  {{ item.company }}
                </div>
              </option>
            </TomSelect>
          </Tippy>
        </div> -->

        <div class="hidden md:block mx-auto text-slate-500">
          <!-- Showing 1 to 10 of 150 entries -->
        </div>
        <a
          v-if="supplierSelected"
          href="javascript:;"
          @click="clearSupplier()"
          class="btn btn-primary shadow-md"
        >
          View Cart
        </a>

        <a
          v-if="cartProductsLocal.length > 0 && checkedData.length > 0"
          href="javascript:;"
          @click="addToPurchase()"
          class="btn btn-primary shadow-md ml-2"
        >
          Create Purchase Order
        </a>

        <!-- <div
          v-if="cartProductsLocal.length > 0 && checkedData.length > 0"
          class="w-full col-span-12 text-right mr-2 mt-2"
        >
          <a @click="addToPurchase()" class="btn btn-primary shadow-md">
            Create Purchase Order
          </a>
        </div> -->
      </div>

      <!-- BEGIN: Tab  -->
      <div
        v-if="cartProducts.length > 0"
        class="flex mt-4"
        :class="supplierSelected ? 'bg-gray-200 border-gray-200 border-2 ' : ''"
      >
        <!-- <div @click="previousTab()">
          <ChevronsLeftIcon class="w-6 h-6 mt-4 mr-2 cursor-pointer" />
        </div> -->
        <TabList
          v-if="cartProducts.length > 0"
          class="nav-boxed-tabs overflow-x-scroll"
          id="tabList"
        >
          <div
            class="w-full bg-slate-100"
            tag="button"
            v-for="(item, i) in filteredSuppliers"
            :key="i"
            @click="selectedTab(item)"
          >
            <div
              class="noBreak p-2 cursor-pointer hover:bg-primary hover:text-white border-2"
              :class="item.selected ? 'bg-gray-200 ' : ''"
            >
              {{ item.company }}
            </div>
          </div>
        </TabList>
        <!-- <div @click="nextTab()">
          <ChevronsRightIcon class="w-6 h-6 mt-4 ml-2 cursor-pointer" />
        </div> -->
      </div>

      <!-- End: Tab  -->

      <!-- BEGIN: Data List -->
      <div
        class="intro-y col-span-12 overflow-auto p-2 rounded-b-lg"
        :class="supplierSelected ? ' bg-gray-200' : ''"
        v-if="cartProducts.length > 0"
      >
        <table class="table table-report table-fixed">
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
          <tbody v-if="!supplierSelected">
            <tr v-for="(item, i) in cartProducts" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>

              <td class="table-report__action">
                <div class="flex justify-center items-center">
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="EDIT QTY"
                  >
                    <a
                      @Click="editCartItem(item)"
                      class="flex items-center"
                      href="javascript:;"
                    >
                      <EditIcon class="w-6 h-6 mr-4" /> </a
                  ></Tippy>
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="DELETE"
                  >
                    <a
                      @Click="deleteCartItem(item)"
                      class="flex items-center text-danger"
                      href="javascript:;"
                    >
                      <Trash2Icon class="w-6 h-6 mr-1" /> </a
                  ></Tippy>
                </div>
              </td>
            </tr>
          </tbody>

          <tbody v-if="supplierSelected">
            <tr v-for="(item, i) in cartProductsLocal" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>

              <td class="table-report__action">
                <div class="flex justify-center items-center">
                  <div class="form-check">
                    <input
                      v-model="checkedData"
                      id="vertical-form-3"
                      class="form-check-input w-6 h-6 mr-1"
                      type="checkbox"
                      :value="item.skuId"
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- END: Data List -->
      <div
        v-if="cartProducts.length == 0"
        class="mt-5 mb-5 border-2 shadow-md p-2 font-semibold w-full col-span-12 text-center"
      >
        Cart is Empty! Please Select PLU/SKU
      </div>
    </div>
  </div>
  <!-- BEGIN: Add  Modal -->

  <Modal :show="addStock" @hidden="addStock = false" size="modal-sl-90">
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">
        ADD NEEDED QUANTITY OF PLU/SKU
      </h2>
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="closeForm"
        />
      </div>
    </ModalHeader>
    <ModalBody class="flex flex-col justify-end items-end space-y-4 w-full">
      <div
        class="intro-y lg:flex lg:flex-row md:flex md:flex-row flex flex-col items-end justify-end"
      >
        <div class="relative lg:ml-4 lg:ml-4 ml-0 mt-3 lg:mt-0 md:mt-0 mt-2">
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

        <div class="relative lg:ml-4 lg:ml-4 ml-0 mt-3 lg:mt-0 md:mt-0 mt-2">
          <div class="relative text-slate-500">
            <RulerIcon
              class="w-5 h-5 absolute my-auto inset-y-0 ml-3 left-0 z-10 text-slate-500"
            />

            <input
              type="number"
              v-model="filterQuantity"
              class="form-control box px-10"
              placeholder="Change Min Stock.."
              @change="lowStockFilterOnChange"
            />

            <!-- <input
              type="text"
              class="form-control box pr-10"
              placeholder="Search..."
              v-model="filterQuantity"
              @change="lowStockFilterOnChange"
            /> -->
            <SearchIcon
              @click="searchLowStock"
              v-if="!filterActive"
              class="lg:w-6 lg:h-6 w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
            />
            <XIcon
              @click="clearLowStock"
              v-if="filterActive"
              class="lg:w-6 lg:h-6 w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
            />
          </div>
        </div>

        <!-- <div class="relative lg:ml-4 lg:ml-4 ml-0 mt-3 lg:mt-0 md:mt-0 mt-2">
          <RulerIcon
            class="w-5 h-5 absolute my-auto inset-y-0 ml-3 left-0 z-10 text-slate-500"
          />

          <input
            type="number"
            v-model="filterQuantity"
            class="form-control box px-10 w-full"
            placeholder="Quantity"
            @change="lowStockFilter"
          />
        </div> -->
      </div>
      <!-- BEGIN: Data List -->
      <div class="intro-y col-span-12 overflow-auto w-full">
        <table class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in ProductHeaders"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>REQUEST DATE</th>
              <th>QTY</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in itemsProduct"
              :key="i"
              class="intro-x cursor-pointer"
            >
              <td
                v-for="(header, index) in ProductHeaders"
                :key="index"
                class="cursor-pointer"
                :style="
                  item.quantity != '' ? 'background-color:palegreen;' : ''
                "
              >
                {{ item[header.value] }}
              </td>

              <td
                class="cursor-pointer"
                :style="
                  item.quantity != '' ? 'background-color:palegreen;' : ''
                "
              >
                {{ momentLocal(item.lastRequestedDate) }}
              </td>

              <td
                :style="
                  item.quantity != '' ? 'background-color:palegreen;' : ''
                "
              >
                <div class="flex flex-col space-y-1 w-24">
                  <input
                    @change="addQuantity(item)"
                    v-model="item.quantity"
                    id="vertical-form-1"
                    type="number"
                    class="form-control w-full"
                    placeholder="100"
                    min="1"
                  />
                </div>
              </td>
              <!-- 
              <td class="table-report__action w-20">
                <div class="form-check">
                  <input
                    v-if="item.quantity != ''"
                    v-model="checkedData"
                    id="vertical-form-3"
                    class="form-check-input"
                    type="checkbox"
                    :value="item.productId"
                    @click="addQuantity(item)"
                  />
                </div>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
      <!-- END: Data List -->
      <div
        v-if="itemsData.totalCount == 0"
        class="mb-5 border-2 shadow-md p-2 font-semibold w-full col-span-12 text-center"
      >
        No Data
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="closeForm()"
        class="btn btn-outline-secondary w-24 mr-2 uppercase"
      >
        Cancel
      </button>
      <button
        @click="saveForm()"
        type="submit"
        class="btn btn-primary uppercase"
      >
        Add to cart
      </button>
      <!-- BEGIN: Pagination -->

      <div
        class="mt-5 p-2 w-full intro-y lg:flex lg:flex-row lg:flex-wrap lg:items-center md:flex md:flex-row md:flex-wrap md:items-center flex flex-col items-center justify-center"
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
            :page-count="pageCountProduct"
            :page-range="5"
            :margin-pages="2"
            :click-handler="changePageProduct"
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
          v-model="pageSizeProduct"
          class="w-20 form-select box cursor-pointer"
          @change="pageSizeChangeProduct"
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
    </ModalFooter>
  </Modal>
  <!-- END: Add Modal -->

  <!-- <Modal :show="quantityAddModal" @hidden="quantityAddModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <div class="text-slate-500 mt-2">
          <label for="regular-form-1" class="form-label">QTY</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="number"
              class="form-control"
              placeholder="Add Quantity"
            />
          </div>
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="cancelAdd()"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-success w-24"
          @click="ConfirmAdd()"
        >
          Confirm
        </button>
      </div>
    </ModalBody>
  </Modal> -->

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
          {{ formDataCart.purchaseIStockId }}
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

  <!-- BEGIN: Delete Confirmation Modal -->
  <DeleteConfirmModal
    :name="formDataCart.description"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="deleteCartItemConfirm"
    :modalClose="closeDelete"
  />

  <!-- <Modal
    :show="deleteConfirmationModal"
    @hidden="deleteConfirmationModal = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <Trash2Icon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-xl font-bold mt-5">{{ formDataCart.description }}</div>
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
          @click="deleteCartItemConfirm()"
        >
          Delete
        </button>
      </div>
    </ModalBody>
  </Modal> -->
  <!-- END: Delete Confirmation Modal -->

  <!-- BEGIN: Add Product Modal -->

  <Modal
    :show="addPurchaseOrder"
    @hidden="addPurchaseOrder = false"
    backdrop="static"
    size="modal-sl-40"
  >
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">Place The Order</h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-2 lg:gap-4 md:gap-4 gap-2">
      <div class="col-span-2">
        <label for="regular-form-1" class="form-label">Order Number</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataPurchaseOrder.orderNumber"
            type="text"
            class="form-control"
            name="orderNumber"
            placeholder="Order Number"
          />
        </div>
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Status</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataPurchaseOrder.status"
            :options="{
              placeholder: 'Select..',
            }"
            class="w-full"
          >
            <option value=""></option>
            <option value="1">NEW</option>
            <option value="2">ACPT</option>
            <option value="3">PIKD</option>
            <option value="4">PRCS</option>
            <option value="5">COMP</option>
            <option value="6">DISP</option>
            <option value="7">DELV</option>
            <option value="8">RETN</option>
          </TomSelect>
        </div>
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Picking Type</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataPurchaseOrder.pickingType"
            :options="{
              placeholder: 'Search..',
            }"
            class="w-full"
          >
            <option value=""></option>
            <option value="0">Regular Pick</option>
            <option value="1">Pallet Pick</option>
            <option value="2">Cross Stock</option>
          </TomSelect>
        </div>
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Requested Date</label>

        <PreviewComponent class="intro-y">
          <div class="cursor-pointer">
            <Preview>
              <Litepicker
                v-model="formDataPurchaseOrder.requestedDate"
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
        <label for="regular-form-1" class="form-label">Require Date</label>

        <PreviewComponent class="intro-y">
          <div class="">
            <Preview>
              <Litepicker
                v-model="formDataPurchaseOrder.neededDate"
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
        <label for="regular-form-1" class="form-label">Supplier</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="supplierName"
            type="text"
            class="form-control"
            disabled
          />

          <!-- <TomSelect
            v-model="formDataPurchaseOrder.supplierId"
            :options="{
              placeholder: 'Select..',
            }"
            class="w-full mr-32"
          >
            <option
              :value="item.supplierId"
              v-for="(item, i) in suppliers"
              :key="i"
            >
              {{ item.company }}
            </option>
          </TomSelect> -->
        </div>
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Warehouse</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataPurchaseOrder.warehouseId"
            :options="{
              placeholder: 'Select..',
            }"
            class="w-full mr-32"
          >
            <option v-if="titleChange != -1">
              {{ formDataPurchaseOrder.name }}
            </option>
            <option v-if="titleChange == -1" value=""></option>
            <option
              :value="item.warehouseId"
              v-for="(item, i) in warehouseList"
              :key="i"
            >
              {{ item.name }}
            </option>
          </TomSelect>
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="closePurchaseOrder()"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        Cancel
      </button>
      <button
        @click="savePurchaseOrder()"
        type="submit"
        class="btn btn-primary w-24"
      >
        Done
      </button>
    </ModalFooter>
  </Modal>
  <!-- END: Add Product Modal -->
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
//import axios from "../services/http-common";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";

import { required, minLength, maxLength, integer } from "@vuelidate/validators";
import axios from "../../../services/http-common";
import Paginate from "vuejs-paginate-next";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import moment from "moment";
import router from "../../../router";

import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../../global-functions/functions";
import { removeDuplicate } from "../../../global-functions/functions";
export default {
  components: {
    paginate: Paginate,
    Loading,
  },
  data() {
    return {
      isLoading: false,
      quantityAddModal: false,
      selectdItem: [],
      quantity: "",
      searchData: "",
      addStock: false,
      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,
      titleChange: -1,
      formDataCart: {
        description: "",
      },
      formDataCartDefault: {
        description: "",
      },

      rules: {
        productId: {
          required,
          minLength: minLength(2),
        },
        // productVariantId: {
        //   required,
        //   minLength: minLength(2),
        // },
        // qty: {
        //   required,
        //   maxLength: maxLength(10),
        // },
        //  utilizedQty: {
        //   required,
        //   minLength: minLength(2),
        // },
        // expiryDate: {
        //   required,
        //   minLength: minLength(2),
        // },
        // adjustedQty: {
        //   required,
        //   maxLength: maxLength(10),
        // },
        // lastStockTakeId: {
        //   required,
        //   minLength: minLength(2),
        // },
        // supplierProductCode: {
        //   required,
        //   maxLength: maxLength(10),
        // },
      },
      ProductHeaders: [
        { text: "PLU/SKU", value: "skuName" },
        { text: "DESC", value: "description" },
        { text: "BARCODE/EAN", value: "ean" },
        { text: "TOTAL", value: "total" },
        { text: "PENDING", value: "pendingQuantity" },
        // { text: "Requested Date", value: "lastRequestedDate" },
      ],

      headers: [
        { text: "PLU/SKU", value: "skuName" },
        { text: "DESC", value: "description" },
        { text: "QTY", value: "quantity" },
        { text: "BARCODE/EAN", value: "ean" },
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
      products: [],

      //product
      checkedData: [],
      paginationProduct: {
        pageNumber: 1,
        pageSize: 5,
        search: "",
      },
      defaultPaginationProduct: {
        pageNumber: 1,
        pageSize: 5,
        search: "",
      },
      addPurchaseOrder: false,
      formDataPurchaseOrder: {
        orderNumber: "",
        requestedDate: "",
        neededDate: "",
        pickingType: "",
        status: "",
        supplierId: "",
        warehouseId: "",
        products: [
          {
            supplierProductNumber: "",
            description: "",
            quantity: "",
            skuId: "",
          },
        ],
      },
      formDataPurchaseOrderDefault: {
        orderNumber: "",
        requestedDate: "",
        neededDate: "",
        pickingType: "",
        status: "",
        supplierId: "",
        warehouseId: "",
        products: [
          {
            supplierProductNumber: "",
            description: "",
            quantity: "",
            skuId: "",
          },
        ],
      },

      pageCountProduct: 20,
      pageSizeProduct: 5,
      itemsProduct: [],
      itemsDataProduct: [],
      cartProducts: [],
      cartProductsLocal: [],

      selectedProducts: [],
      warehouseList: [],
      suppliers: [],
      filteredSuppliers: [],
      selectedSkuId: "",
      selectedSkuIds: [],
      finalCartProduct: [],
      supplierId: "",
      supplierName: "",
      supplierSelected: false,
      filterQuantity: "",
      supplierIds: [],
    };
  },
  computed: {
    formTitle() {
      return this.titleChange === -1
        ? "Add New Reorder Stock"
        : "Edit Reorder Stock";
    },
  },
  watch: {},
  created() {
    this.getCartProducts();
  },
  methods: {
    closeDelete() {
      this.deleteConfirmationModal = false;
    },
    selectedTab(item) {
      this.checkedData = [];
      for (var i = 0; i < this.suppliers.length; i++) {
        this.suppliers[i].selected = false;
      }
      item.selected = true;
      this.supplierId = item.supplierId;

      this.selectSupplier();
    },
    previousTab() {
      this.checkedData = [];
      const index = this.filteredSuppliers.findIndex((object) => {
        return object.supplierId === this.supplierId;
      });

      if (index > 0) {
        document.getElementById("tabList").scrollLeft -= 60;
        for (var i = 0; i < this.filteredSuppliers.length; i++) {
          this.filteredSuppliers[i].selected = false;
        }
        const found = this.filteredSuppliers[index - 1];
        this.filteredSuppliers[index - 1].selected = true;
        this.supplierId = found.supplierId;
        this.selectSupplier();
      }
    },
    nextTab() {
      this.checkedData = [];
      const index = this.filteredSuppliers.findIndex((object) => {
        return object.supplierId === this.supplierId;
      });
      if (index < this.filteredSuppliers.length - 1) {
        document.getElementById("tabList").scrollLeft += 60;
        for (var i = 0; i < this.filteredSuppliers.length; i++) {
          this.filteredSuppliers[i].selected = false;
        }
        const found = this.filteredSuppliers[index + 1];
        this.filteredSuppliers[index + 1].selected = true;
        this.supplierId = found.supplierId;
        this.selectSupplier();
      }
    },
    clearSupplier() {
      this.supplierId = "";
      for (var i = 0; i < this.suppliers.length; i++) {
        this.suppliers[i].selected = false;
      }
      this.selectSupplier();
      this.checkedData = [];
      this.filterSupplier();
    },
    filterSupplier() {
      console.log(this.cartProducts);
      this.filteredSuppliers = [];

      if (this.cartProducts.length > 0) {
        for (var i = 0; i < this.cartProducts.length; i++) {
          var skuId = this.cartProducts[i].skuId;

          this.isLoading = true;

          axios
            .get("SupplierProducts/Products/" + skuId)
            .then((response) => {
              if (response.data.success === true) {
                if (response.data.data[0].supplierId) {
                  var supplierId = response.data.data[0].supplierId;
                  var filteredSupplier = this.suppliers.filter((obj) => {
                    return obj.supplierId == supplierId;
                  });

                  this.filteredSuppliers.push(filteredSupplier);

                  this.filteredSuppliers = [].concat.apply(
                    [],
                    this.filteredSuppliers
                  );

                  var dataArr = this.filteredSuppliers.map((item) => {
                    return [item.supplierId, item];
                  });
                  var maparr = new Map(dataArr);

                  this.filteredSuppliers = [...maparr.values()];
                  console.log(
                    " this.filteredSuppliers",
                    this.filteredSuppliers
                  );
                  this.isLoading = false;
                }
              } else {
                this.isLoading = false;
              }
            })
            .catch((error) => {
              this.isLoading = false;
              //  warningToast(statusMessage(error.response.status));
            });
        }
      }
    },

    selectSupplier() {
      this.supplierSelected = true;
      var supplierId = this.supplierId;

      if (supplierId != "") {
        this.cartProductsLocal = [];
        if (this.cartProducts.length > 0) {
          for (var i = 0; i < this.cartProducts.length; i++) {
            var skuId = this.cartProducts[i].skuId;

            this.isLoading = true;
            axios
              .get("SupplierProducts/Products/" + skuId)
              .then((response) => {
                if (response.data.success === true) {
                  if (supplierId == response.data.data[0].supplierId) {
                    this.selectedSkuId = response.data.data[0].skuId;
                    this.updateCart();
                  }

                  this.isLoading = false;
                } else {
                  this.cartProductsLocal = [];
                  this.isLoading = false;
                }
              })
              .catch((error) => {
                this.isLoading = false;
                //  warningToast(statusMessage(error.response.status));
              });
          }
        }
      } else {
        warningToast("PLEASE SELECT A SUPPLIER");
        this.cartProductsLocal = this.cartProducts;
        this.supplierSelected = false;
      }
    },
    updateCart() {
      //console.log(this.selectedSkuId);

      var selectItem = this.cartProducts.filter((obj) => {
        return obj.skuId == this.selectedSkuId;
      });
      console.log(selectItem);
      this.cartProductsLocal.push(selectItem[0]);
      //      this.cartProductsLocal = [];
    },

    lowStockFilterOnChange() {
      if (this.filterQuantity != "") {
        this.filterActive = true;
        this.searchLowStock();
      } else {
        this.clearLowStock();
      }
    },
    clearLowStock() {
      this.filterQuantity = "";
      this.getProducts();
      this.filterActive = false;
    },

    searchLowStock() {
      if (this.filterQuantity != "") {
        this.filterActive = true;

        this.quantitySearch();
      }
    },

    lowStockFilter() {
      if (this.filterQuantity == "") {
        this.getProducts();
      } else {
        this.quantitySearch();
      }
    },

    quantitySearch() {
      console.log(this.filterQuantity);

      this.isLoading = true;
      axios
        .post(
          "Sku/Stocks/LowStock/" + this.filterQuantity,
          this.paginationProduct
        )
        .then((response) => {
          if (response.data.success === true) {
            console.log(response);
            this.itemsDataProduct = response.data.data;
            this.itemsProduct = response.data.data.items;
            this.pageCountProduct = this.itemsDataProduct.totalPages;
            for (var i = 0; i < this.itemsProduct.length; i++) {
              this.itemsProduct[i].quantity = "";

              this.isLoading = false;
            }

            // this.isLoading = false;
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
    momentLocal(date) {
      if (date != null) {
        return moment.utc(date).local().format("DD MMMM, YYYY");
      } else {
        return "Nil";
      }
    },
    addQuantity(item) {
      // item.addQuantity = true
      this.selectdItem = Object.assign({}, item);

      this.quantityAddModal = true;
      // console.log(item);
      // console.log(this.quantity);

      //this.quantityAddModal = true;
    },
    cancelAdd() {
      //this.quantityAddModal = false;
    },
    confirmAdd() {
      // this.quantityAddModal = false;
    },
    //product
    getProducts() {
      this.isLoading = true;
      axios
        .post("Sku/Stocks", this.paginationProduct)
        .then((response) => {
          console.log(response);
          if (response.data.success === true) {
            this.itemsDataProduct = response.data.data;
            this.itemsProduct = response.data.data.items;
            this.pageCountProduct = this.itemsDataProduct.totalPages;
            for (var i = 0; i < this.itemsProduct.length; i++) {
              this.itemsProduct[i].quantity = "";

              this.isLoading = false;
            }
          } else {
            // this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          //this.isLoading = false;
          warningToast(statusMessage(error.response.status));
          //localStorage.setItem("errorMessage", error);
          //router.push("/page-down");
        });
    },
    pageSizeChangeProduct() {
      this.paginationProduct.pageSizeProduct = this.pageSizeProduct;
      this.getProducts();
    },
    saveSeleted() {
      var selectedQty = [];
      for (var i = 0; i < this.itemsProduct.length; i++) {
        console.log(this.itemsProduct[i].quantity);
        if (this.itemsProduct[i].quantity != "") {
          selectedQty.push(this.itemsProduct[i].quantity);
        }
      }

      if (selectedQty.length > 0) {
        this.saveForm();
      }
    },
    changePageProduct(pageNum) {
      this.saveSeleted();
      this.paginationProduct.pageNumber = pageNum;
      this.getProducts();
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
      this.paginationProduct.search = this.searchData;
      this.getProducts();
      this.searchActive = false;
    },

    searchItem() {
      if (this.searchData != "") {
        this.searchActive = true;
        this.paginationProduct.search = this.searchData;
        this.getProducts();
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
      this.formDataCart = Object.assign({}, this.formDataCartDefault);
    },
    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("PurchaseStocks/Paginated", this.pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsData = response.data.data;
            this.items = response.data.data.items;
            this.pageCount = this.itemsData.totalPages;
          } else {
            warningToast(response.data.message);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
      // getProducts;
    },

    activateModal() {
      this.addStock = true;
    },
    showModal() {
      this.setDefault();
      this.titleChange = -1;
      this.activateModal();
      this.getProducts();
    },
    closeForm() {
      this.addStock = false;
    },

    editItem(item) {
      this.titleChange = 0;
      this.formDataCart = Object.assign({}, item);
      this.addStock = true;
    },

    saveForm() {
      var addedItems = this.itemsProduct.filter((a) => a.quantity > 0);

      var addedItemsFinal = [];
      var newItems = [];

      if (localStorage.getItem("stockLocal") != null) {
        addedItemsFinal = JSON.parse(window.localStorage.getItem("stockLocal"));
      }

      for (var i = 0; i < addedItems.length; i++) {
        var newObj = new Object();
        newObj.skuId = addedItems[i].skuId;
        newObj.skuName = addedItems[i].skuName;
        newObj.quantity = addedItems[i].quantity;
        newObj.description = addedItems[i].description;
        newObj.ean = addedItems[i].ean;
        newObj.supplierProductNumber = "";
        newItems.push(newObj);
      }

      const mergeArray = (first, second) => {
        return [...first, ...second].reduce((acc, val, i, arr) => {
          const {
            skuId,
            skuName,
            quantity,
            description,
            ean,
            supplierProductNumber,
          } = val;
          const ind = acc.findIndex((el) => el.skuId === skuId);
          if (ind !== -1) {
            acc[ind].quantity += quantity;
          } else {
            acc.push({
              skuId,
              skuName,
              quantity,
              description,
              ean,
              supplierProductNumber,
            });
          }
          return acc;
        }, []);
      };

      var finalItems = mergeArray(addedItemsFinal, newItems);
      console.log(mergeArray(addedItemsFinal, newItems));

      window.localStorage.setItem("stockLocal", JSON.stringify(finalItems));

      //this.addStock = false;
      successToast("Added to cart suuessfully");

      //this.clearAdded();
      this.getProducts();
      this.getCartProducts();
    },
    editCartItem(item) {},
    deleteCartItem(item) {
      this.formDataCart = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteCartItemConfirm() {
      for (var i = this.cartProducts.length - 1; i >= 0; --i) {
        if (this.cartProducts[i].skuId == this.formDataCart.skuId) {
          this.cartProducts.splice(i, 1);
        }
      }

      window.localStorage.setItem(
        "stockLocal",
        JSON.stringify(this.cartProducts)
      );

      this.deleteConfirmationModal = false;
      successToast("Deleted from Cart suuessfully");

      this.filterSupplier();
    },
    getCartProducts() {
      //  window.localStorage.clear()
      if (window.localStorage.getItem("stockLocal") != null) {
        this.cartProducts = JSON.parse(
          window.localStorage.getItem("stockLocal")
        );
        this.cartProductsLocal = this.cartProducts;
      }
      this.getSupplierData();
    },

    addToPurchase() {
      var supplier = this.suppliers.filter((obj) => {
        return obj.supplierId == this.supplierId;
      });

      this.supplierName = supplier[0].company;

      console.log(this.supplierName);
      var finalSelected = [];
      for (var i = 0; i < this.checkedData.length; i++) {
        this.checkedData[i].skuId;

        var selectItem = this.cartProducts.filter((obj) => {
          return obj.skuId == this.checkedData[i];
        });

        finalSelected.push(selectItem[0]);
      }

      this.selectedProducts = finalSelected;

      this.showModalPurchaseorder();
    },

    showModalPurchaseorder() {
      this.setDefaultPurchaseorder();

      if (this.selectedProducts.length > 0) {
        this.activateModalPurchaseorder();
      } else alert("SELECT ITEMS");
    },
    setDefaultPurchaseorder() {
      this.formDataPurchaseOrder = Object.assign(
        {},
        this.formDataPurchaseOrderDefault
      );
      this.formDataPurchaseOrder.supplierId = this.supplierId;
      this.formDataPurchaseOrder.products = this.selectedProducts;
      console.log(this.formDataPurchaseOrder);
    },
    activateModalPurchaseorder() {
      this.getWarehouseData();
      this.addPurchaseOrder = true;
    },

    savePurchaseOrder() {
      console.log(this.formDataPurchaseOrder);

      this.connectTimetoDate();
      axios
        .post("PurchaseOrders", this.formDataPurchaseOrder)
        .then((response) => {
          console.log(response);
          if (response.data.success === true) {
            this.deleteOrderedItems();
            this.closePurchaseOrder();
            this.clearSupplier();
            // router.push("/purchase-orders");
          } else {
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error));
        });
    },

    deleteOrderedItems() {
      for (var j = this.checkedData.length - 1; j >= 0; --j) {
        var skuId = this.checkedData[j];

        for (var i = this.cartProducts.length - 1; i >= 0; --i) {
          if (this.cartProducts[i].skuId == skuId) {
            this.cartProducts.splice(i, 1);
          }
        }
      }

      this.checkedData = [];
      window.localStorage.setItem(
        "stockLocal",
        JSON.stringify(this.cartProducts)
      );
    },
    closePurchaseOrder() {
      this.addPurchaseOrder = false;
    },

    connectTimetoDate() {
      var currentTime = moment(new Date()).format();
      var splitTime = currentTime.split("T");

      var requestedDate = moment(
        this.formDataPurchaseOrder.requestedDate
      ).format("YYYY-MM-DD");
      requestedDate = requestedDate.concat("T").concat(splitTime[1]);
      this.formDataPurchaseOrder.requestedDate = requestedDate;

      var neededDate = moment(this.formDataPurchaseOrder.neededDate).format(
        "YYYY-MM-DD"
      );
      neededDate = neededDate.concat("T").concat(splitTime[1]);
      this.formDataPurchaseOrder.neededDate = neededDate;
    },

    //supplier
    getSupplierData() {
      this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 1000 };
      axios
        .post("Suppliers/Paginated", pagination)
        .then((response) => {
          this.suppliers = response.data.data.items;
          for (var i = 0; i < this.suppliers.length; i++) {
            this.suppliers[i].selected = false;
          }

          this.filterSupplier();

          if (this.suppliers.length == 0) {
            warningToast("Please Add Items in Supplier");
            this.addPurchaseOrder = false;
          }
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },
    getWarehouseData() {
      this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("Warehouses/Paginated", pagination)
        .then((response) => {
          this.warehouseList = response.data.data.items;

          if (this.warehouseList.length == 0) {
            warningToast("Please Add Items in Warehouse");
            this.addPurchaseOrder = false;
          }
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error));
        });
    },

    archiveItem(item) {
      this.formDataCart = Object.assign({}, item);
      this.archiveConfirmationModal = true;
    },

    closeArchive() {
      this.archiveConfirmationModal = false;
      this.setDefault();
    },
    archiveItemConfirm() {
      var itemId = this.formDataCart.purchaseIStockId;
      this.isLoading = true;
      axios
        .get("PurchaseStocks/" + itemId + "/Archive")
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
          warningToast(statusMessage(error));
        });
    },
    viewArchives() {
      axios
        .post("PurchaseStocks/Archived", this.paginationArchive)
        .then((response) => {
          this.archiveData = response.data.data;
          this.archiveItems = response.data.data.items;
          this.pageCountArchive = this.archiveData.totalPages;
          this.archiveModal = true;
        });
    },

    changePageArchive(pageNum) {
      this.paginationArchive.pageNumber = pageNum;
      this.viewArchives();
    },
    restoreItem(item) {
      this.formDataCart = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.formDataCart.purchaseIStockId;
      this.isLoading = true;
      axios
        .get("PurchaseStocks/" + itemId + "/Restore")
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
          warningToast(statusMessage(error));
        });
    },
    deleteItem(item) {
      this.formDataCart = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataCart.purchaseIStockId;
      axios
        .delete("PurchaseStocks/" + itemId)
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
          warningToast(statusMessage(error));
        });
    },
  },
};
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.nav-boxed-tabs::-webkit-scrollbar {
  /* display: none; */
  width: 10px;
}
/* Track */
.nav-boxed-tabs::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* Handle */
.nav-boxed-tabs::-webkit-scrollbar-thumb {
  background: lightgray;
  border-radius: 10px;
}

/* Handle on hover */

.noBreak {
  white-space: nowrap;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
