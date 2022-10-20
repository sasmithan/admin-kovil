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
  <!-- <div class="flex justify-center items-center">

    <Alert
      v-slot="{ dismiss }"
      v-if="apiMessage"
      class="md:w-1/2 sm:w-full alert-success flex items-center mt-2"
    >
      <button
        type="button"
        class="btn-close text-white"
        aria-label="Close"
        @click="dismiss"
      >
        <XIcon class="w-4 h-4" />
      </button>
      <AlertOctagonIcon class="w-6 h-6 mr-2" />{{ apiMessage }}
    </Alert>

  </div> -->

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
          Add New Purchase Order
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
      <a
        href="javascript:;"
        @click="viewArchives()"
        class="btn btn-primary shadow-md text-xs lg:text-sm mt-2 lg:mt-0 md:mt-0"
      >
        {{ const_txt.ARCHIVE_BTN }}
        <span
          class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
        >
          <ArchiveIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
        </span>
      </a>
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto">
      <table class="table table-report -mt-2 table-auto">
        <thead>
          <tr class="uppercase whitespace-nowrap">
            <th>Order Number</th>
            <th
              class="whitespace-nowrap"
              v-for="(header, i) in headers"
              :key="i"
            >
              {{ header.text }}
            </th>
            <th>Requested Date</th>
            <th>REQUIRED DATE</th>
            <th>Supplier</th>
            <th>Warehouse</th>
            <!-- <th>Picking Type</th> -->
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i" class="intro-x">
            <td
              @click="
                addItem(item);
                item.selected = true;
              "
              class="cursor-pointer"
              :style="item.selected ? getSelectedColor() : 'color: #1a73e8'"
            >
              {{ item.orderNumber }}
            </td>

            <td :style="item.selected ? getSelectedColor() : ''">
              {{ momentLocal(item.requestedDate) }}
            </td>
            <td :style="item.selected ? getSelectedColor() : ''">
              {{ momentLocal(item.neededDate) }}
            </td>

            <td :style="item.selected ? getSelectedColor() : ''">
              {{ item.supplier.company }}
            </td>

            <td :style="item.selected ? getSelectedColor() : ''">
              {{ item.warehouseId }}
            </td>

            <!-- <td :style="item.selected ? getSelectedColor() : ''" class="w-36">
              <div
                class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                :style="getPickingTypeColor(item.pickingType)"
              >
                {{ getPickingType(item.pickingType) }}
              </div>
            </td> -->

            <td :style="item.selected ? getSelectedColor() : ''" class="w-36">
              <div
                class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                :style="{ 'background-color': getStatusColor(item.status) }"
              >
                {{ getStatus(item.status) }}
              </div>
            </td>

            <td class="table-report__action">
              <div class="flex justify-center items-center">
                <!-- <a
                  class="flex items-center mr-3 font-bold"
                  href="javascript:;"
                  @click="viewOrderInfo(item)"
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
                </a> -->
                <!-- <a
                  @Click="viewOrderInfo(item)"
                  class="flex items-center mr-3 font-semibold"
                  href="javascript:;"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="Order Product"
                  >
                    <PlusSquareIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                  </Tippy>
                </a> -->
                <a
                  class="flex items-center mr-3 text-danger"
                  href="javascript:;"
                  @click="archiveItem(item)"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="Archive"
                    ><ArchiveIcon
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

  <!-- BEGIN: Add Product Modal -->

  <MoveableModal
    :show="addPurchaseOrder"
    @hidden="addPurchaseOrder = false"
    backdrop="static"
    size="modal-lg"
    :title="formTitle"
    @close="addPurchaseOrder = false"
  >
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
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full"
          >
            <option v-if="titleChange != -1">
              {{ formDataPurchaseOrder.status }}
            </option>
            <option v-if="titleChange == -1">SELECT</option>
            <option
              :value="item.number"
              v-for="(item, i) in statusItems"
              :key="i"
            >
              {{ item.name }}
            </option>
          </TomSelect>
        </div>
      </div>

      <!-- <div>
        <label for="regular-form-1" class="form-label">Picking Type</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataPurchaseOrder.pickingType"
            :options="{
              placeholder: 'Select..',
            }"
            class="w-full"
          >
            <option v-if="titleChange == -1">SELECT</option>
            <option value="0">Regular Pick</option>
            <option value="1">Pallet Pick</option>
            <option value="2">Cross Stock</option>
          </TomSelect>
        </div>
      </div> -->

      <div>
        <label for="regular-form-1" class="form-label">Requested Date</label>

        <PreviewComponent class="intro-y">
          <div class="">
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
        <label for="regular-form-1" class="form-label capitalize"
          >Required Date</label
        >

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
          <TomSelect
            v-model="formDataPurchaseOrder.supplierId"
            :options="{
              placeholder: 'Search..',
            }"
            class="w-full mr-32"
          >
            <option v-if="titleChange != -1">
              {{ formDataPurchaseOrder.name }}
            </option>
            <option v-if="titleChange == -1">SELECT</option>
            <option
              :value="item.supplierId"
              v-for="(item, i) in supplierList"
              :key="i"
            >
              {{ item.company }}
            </option>
          </TomSelect>
        </div>
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Warehouse</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataPurchaseOrder.warehouseId"
            :options="{
              placeholder: 'Search..',
            }"
            class="w-full mr-32"
          >
            <option v-if="titleChange != -1">
              {{ formDataPurchaseOrder.name }}
            </option>
            <option v-if="titleChange == -1">SELECT</option>
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

      <!-- <button @click="showModalProduct()" type="submit" class="btn btn-primary w-full">
        Add Products
      </button> -->

      <!-- <div>
          <label for="regular-form-1" class="form-label">Order Lines</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataPurchaseOrder.orderLines"
              type="text"
              class="form-control"
              name="orderLines"
              placeholder="Order Lines"
            />
          </div>
        </div> -->
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
  <!-- END: Add Product Modal -->

  <!-- BEGIN: Add  Modal For Product-->

  <MoveableModal
    :show="purchaseOrderInvoiceModal"
    @hidden="purchaseOrderInvoiceModal = false"
    backdrop="static"
    size="modal-sl-85"
    @close="purchaseOrderInvoiceModal = false"
  >
    <ModalBody class="p-0">
      <div class="flex flex-col space-y-4 w-full p-10 md:p-6 p-4">
        <div class="flex justify-between items-start">
          <div class="flex flex-col justify-center items-start">
            <img
              src="/src/assets/images/pl_logo2.png"
              alt="logo"
              class="lg:w-52 lg:h-24 md:w-36 md:h-16 w-28 h-12"
            />

            <h5 class="text-lg text-danger font-medium leading-none mt-3">
              PHARMATEC PTE LTD
            </h5>
            <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
              62 Bank St,
            </h6>
            <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
              P.O.Box 450,Ba,
            </h6>
            <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
              Fiji Islands
            </h6>
            <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
              Ph: 6674933
            </h6>
            <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
              Fax: 6670118
            </h6>
            <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
              Email: admin@pharmatec.com.fj
            </h6>
          </div>
          <div class="flex flex-col justify-center text-right">
            <h2
              class="lg:text-3xl md:text-2xl text-lg font-medium leading-none mt-3"
            >
              Order Number
            </h2>
            <div class="flex flex-col space-y-1">
              <h6
                class="text-black font-medium leading-none mt-1 lg:text-2xl md:text-xl text-base"
              >
                #{{ formDataPurchaseOrder.orderNumber }}
              </h6>
            </div>

            <div class="grid gap-2 mt-5">
              <div class="flex justify-end items-center lg:text-base text-sm">
                <h6
                  class="text-sm text-slate-500 font-medium leading-none mt-3"
                >
                  Requested Date :
                  <span>
                    {{ momentLocal(formDataPurchaseOrder.requestedDate) }}
                  </span>
                </h6>

                <!-- <label for="regular-form-1" class="form-label"
                  >Requested Date :
                  <span>
                    {{ momentLocal(formDataPurchaseOrder.requestedDate) }}
                  </span>
                </label> -->
              </div>

              <div class="flex justify-end items-center lg:text-base text-sm">
                <h6
                  class="text-sm text-slate-500 font-medium leading-none mt-3"
                >
                  Require Date :
                  <span>{{
                    momentLocal(formDataPurchaseOrder.neededDate)
                  }}</span>
                </h6>
                <!-- <label for="regular-form-1" class="form-label"
                  >Needed Date :
                  <span>{{
                    momentLocal(formDataPurchaseOrder.neededDate)
                  }}</span></label
                > -->
              </div>
            </div>

            <h4
              class="lg:text-xl md:text-sm text-sm font-medium leading-none mt-3 text-left"
            >
              To
            </h4>
            <div class="flex flex-col justify-center text-left">
              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                {{ formDataPurchaseOrder.supplier.firstName }}
                {{ formDataPurchaseOrder.supplier.lastName }}
              </h6>
              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                {{ formDataPurchaseOrder.supplier.company }}
              </h6>

              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                Mobile : {{ formDataPurchaseOrder.supplier.mobile }}
              </h6>
              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                Email : {{ formDataPurchaseOrder.supplier.email }}
              </h6>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-start w-full hidden">
          <div class="flex justify-center items-center space-x-2"></div>

          <div class="space-y-2 justify-center items-center hidden">
            <div class="grid gap-2"></div>
          </div>
        </div>
      </div>

      <!-- <div class="p-5 text-center text-lg uppercase font-semibold">
        Purchase Order - {{ formDataPurchaseOrder.orderNumber }}
      </div> -->
      <div class="flex pl-6 justify-between items-center">
        <a
          v-if="
            !addOrderlineModal &&
            !addSupplierProductModal &&
            formDataPurchaseOrder.status == 1
          "
          href="javascript:;"
          @click="showModalProduct()"
          class="btn btn-primary shadow-md mr-2"
        >
          Add New Product
        </a>

        <div class="flex items-center mb-4">
          <button
            id="tabulator-print"
            class="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
            @click="onPrint"
          >
            <PrinterIcon class="w-4 h-4 mr-2" /> Print
          </button>

          <button
            id="tabulator-print"
            class="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
            @click="generateReport"
          >
            <FileTextIcon class="w-4 h-4 mr-2" /> Download PDF
          </button>
        </div>
      </div>

      <div class="w-full sm:w-auto mt-3 sm:mt-0 pl-6 pr-6">
        <div
          v-if="addOrderlineModal"
          class="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-4 lg:gap-4 md:gap-4 gap-2"
        >
          <div class="w-full lg:text-sm md:text-sm text-xs">
            <label for="regular-form-1" class="form-label font-semibold">
              Product Description
            </label>

            <div class="flex flex-col w-full space-y-1">
              <TomSelect
                v-model="formDataOrderLine.description"
                :options="{
                  placeholder: 'Search..',
                }"
                class="w-full lg:text-sm md:text-sm text-xs"
              >
                <option>SELECT</option>

                <option
                  :value="item.skuDescription"
                  v-for="(item, i) in supplierProducts"
                  :key="i"
                >
                  {{ item.skuDescription }}
                </option>
              </TomSelect>
            </div>
          </div>
          <div class="w-full lg:text-sm md:text-sm text-xs">
            <label for="regular-form-1" class="form-label font-semibold">
              Quantity
            </label>

            <div class="flex flex-col w-full space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataOrderLine.quantity"
                type="number"
                class="form-control"
                name="quantity"
                placeholder="0"
              />
            </div>
          </div>
          <div class="w-full lg:text-sm md:text-sm text-xs">
            <label for="regular-form-1" class="form-label font-semibold">
              PLU/SKU
            </label>

            <div class="flex flex-col w-full space-y-1">
              <div class="flex flex-col w-full space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="formDataOrderLine.skuId"
                  type="number"
                  class="form-control"
                  name="PLU/SKU"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div class="w-full lg:text-sm md:text-sm text-xs">
            <label for="regular-form-1" class="form-label font-semibold">
              Supplier Product Number
            </label>

            <div class="flex flex-col w-full space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataOrderLine.supplierProductNumber"
                type="text"
                class="form-control"
                name="description"
                placeholder="Supplier Product Number"
              />
            </div>
          </div>

          <div class="flex justify-end items-end col-span-4">
            <button
              type="button"
              @click="addOrderlineModal = false"
              class="btn btn-outline-secondary w-24 mr-1"
            >
              {{ const_txt.CANCEL_BTN }}
            </button>
            <button
              @click="saveFormProduct()"
              type="submit"
              class="btn btn-primary mr-1 px-8"
            >
              {{ productTitle }}
            </button>
          </div>
        </div>
        <!-- <div
          v-if="addSupplierProductModal"
          class="
            grid
            lg:grid-cols-3
            md:grid-cols-3
            grid-cols-3
            lg:gap-4
            md:gap-4
            gap-2
          "
        >
          <div class="w-full lg:text-sm md:text-sm text-xs">
            <label for="regular-form-1" class="form-label font-semibold">
              Supplier Product Number
            </label>

            <div class="flex flex-col w-full space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataSupplierProduct.productNumber"
                type="text"
                class="form-control"
                name="productNumber"
                placeholder="Product Number"
              />
            </div>
          </div>

          <div class="w-full lg:text-sm md:text-sm text-xs">
            <label for="regular-form-1" class="form-label font-semibold">
              Quantity
            </label>

            <div class="flex flex-col w-full space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataOrderLine.quantity"
                type="number"
                class="form-control"
                name="quantity"
                placeholder="0"
              />
            </div>
          </div>

          <div class="w-full lg:text-sm md:text-sm text-xs">
            <label for="regular-form-1" class="form-label font-semibold">
              SKU
            </label>

            <div class="flex flex-col space-y-1">
              <TomSelect
                v-model="formDataSupplierProduct.skuId"
                :options="{
                  placeholder: 'Select..',
                }"
                class="w-full"
                :onChange="addSupplierProductInfo()"
              >
                <option>SELECT</option>
             

                <option :value="item.skuId" v-for="(item, i) in skus" :key="i">
                  {{ item.description }}
                </option>
              </TomSelect>
            </div>
          </div>
 
          <div class="flex justify-end items-end col-span-4">
            <button
              type="button"
              @click="closeAddSupplierProductModal()"
              class="btn btn-outline-secondary w-24 mr-1"
            >
              {{ const_txt.CANCEL_BTN }}
            </button>
            <button
              @click="saveSupplierProducts()"
              type="submit"
              class="btn btn-primary mr-1 px-8"
            >
              Add Supplier Product
            </button>
          </div>
        </div> -->
      </div>
      <hr class="mt-2" />
      <!-- SEARCH -->
      <!-- <div class="w-full sm:w-auto mt-3 sm:mt-0">
        <div class="w-full relative text-slate-500">
          <input
            type="text"
            class="form-control w-full box pr-10"
            placeholder="Search..."
            v-model="searchDataProduct"
            @change="searchOnchangeProduct"
          />
          <SearchIcon
            @click="searchItemProduct"
            v-if="!searchActiveProduct"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
          <XIcon
            @click="clearSearchProduct"
            v-if="searchActiveProduct"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
        </div>
      </div> -->
      <!-- SEARCH END-->
      <!-- BEGIN: Archive Data List -->
      <!-- <div
        class="p-5 text-center text-lg"
        v-if="this.archiveData.totalCount == 0"
      >
        No data
      </div> -->
      <div class="intro-y col-span-12 overflow-auto p-4">
        <table class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>NO</th>
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in productHeaders"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>DESC</th>
              <th>QTY</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in orderLinesLocal" :key="i" class="intro-x">
              <td>
                {{ item.no }}
              </td>
              <td v-for="(header, index) in productHeaders" :key="index">
                {{ item[header.value] }}
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
                    {{ item.description }}
                  </Tippy>
                </div>
              </td>
              <td>
                {{ item.quantity }}
              </td>

              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <a
                    @click="deleteOrdeLine(item)"
                    class="flex items-center mr-3 text-danger"
                    href="javascript:;"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Delete"
                      :options="{
                        zIndex: 99999,
                      }"
                      ><Trash2Icon class="w-6 h-6 mr-1" />
                    </Tippy>
                  </a>

                  <!-- <a
                    class="flex items-center text-danger"
                    href="javascript:;"
                    @click="archiveItemOption(item)"
                  >
                    <ArchiveIcon class="w-4 h-4 mr-1" /> Archive
                  </a> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- BEGIN: Pagination -->

        <div
          v-if="this.orderLines.length > 0"
          class="intro-y rounded-lg lg:flex lg:flex-row lg:flex-wrap lg:items-center md:flex md:flex-row md:flex-wrap md:items-center flex flex-col items-center justify-center p-2"
          style="background-color: #164e63"
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
              :initial-page="1"
              :prev-text="'<'"
              :next-text="'>'"
              :first-button-text="'<<'"
              :last-button-text="'>>'"
            >
            </paginate>
          </div>
          <!-- <div class="mr-2 text-white">Page Rows :</div>
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
        </select> -->
        </div>

        <!-- END: Pagination -->
      </div>
      <!-- END: Archive Data List -->
      <div v-if="orderLines.length == 0" class="p-5 text-center text-lg">
        No Products Added
      </div>

      <!-- BEGIN: Pagination -->

      <!-- <div
        class="intro-y lg:flex lg:flex-row lg:flex-wrap lg:items-center md:flex md:flex-row md:flex-wrap md:items-center flex flex-col items-center justify-center p-2"
        style="background-color: #164e63"
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
      </div> -->

      <!-- END: Pagination -->
    </ModalBody>
  </MoveableModal>
  <!-- END: Add Modal For Product-->

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
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="archiveModal = false"
        />
      </div>

      <div class="p-5 text-center lg:text-lg text-base uppercase font-semibold">
        Archived Purchase Orders
      </div>
      <hr />
      <!-- SEARCH -->
      <div class="w-full sm:w-auto mt-3 sm:mt-0">
        <div class="w-full relative text-slate-500">
          <input
            type="text"
            class="form-control w-full box pr-10"
            placeholder="Search..."
            v-model="searchDataArchive"
            @change="searchOnchangeArchive"
            clearable
          />
          <SearchIcon
            @click="searchItemArchive"
            v-if="searchActiveArchive == false"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
          <XIcon
            @click="clearSearchArchive"
            v-if="searchActiveArchive == true"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
        </div>
      </div>
      <!-- SEARCH END-->
      <hr />
      <!-- BEGIN: Archive Data List -->
      <div
        class="mb-5 p-5 text-center text-lg"
        v-if="this.archiveData.totalCount == 0"
      >
        No data
      </div>
      <div
        class="intro-y col-span-12 overflow-auto p-4"
        v-if="this.archiveData.totalCount > 0"
      >
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
              <th>Order Number</th>
              <th>Requested Date</th>
              <th>REQUIRED DATE</th>
              <th>Supplier</th>
              <!-- <th>Picking Type</th> -->
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in archiveItems" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>
              <td class="cursor-pointer">
                {{ item.orderNumber }}
              </td>

              <td>
                {{ momentLocal(item.requestedDate) }}
              </td>
              <td>
                {{ momentLocal(item.neededDate) }}
              </td>

              <td>
                {{ item.supplier.firstName }} {{ item.supplier.lastName }}
              </td>
              <!-- <td>
                <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                  :style="getPickingTypeColor(item.pickingType)"
                >
                  {{ getPickingType(item.pickingType) }}
                </div>
              </td> -->

              <td>
                <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                  :style="{ 'background-color': getStatusColor(item.status) }"
                >
                  {{ getStatus(item.status) }}
                </div>
              </td>

              <td class="table-report__action hidden">
                <div class="flex justify-center items-center">
                  <!-- <a
                    class="flex items-center mr-3 font-bold"
                    href="javascript:;"
                    @click="viewOrderInfo(item)"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="INFO"
                      :options="{
                        zIndex: 99999,
                      }"
                    >
                      <InfoIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                      />
                    </Tippy>
                  </a> -->
                  <!-- <a
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
                      <RotateCcwIcon class="w-6 h-6 mr-1" />
                    </Tippy>
                  </a> -->

                  <!-- <a
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
                      <Trash2Icon class="w-6 h-6 mr-1" />
                    </Tippy>
                  </a> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- END: Archive Data List -->

      <!-- BEGIN: Pagination -->

      <div
        class="intro-y lg:flex lg:flex-row lg:flex-wrap lg:items-center md:flex md:flex-row md:flex-wrap md:items-center flex flex-col items-center justify-center p-2"
        style="background-color: #164e63"
        v-if="this.archiveData.totalCount > 0"
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

  <!-- BEGIN: Confirmation Modals -->
  <ArchiveConfirmModal
    :name="formDataPurchaseOrder.orderNumber"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formDataPurchaseOrder.orderNumber"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formDataPurchaseOrder.orderNumber"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete"
  />
  <!-- END: Confirmation Modals -->

  <!-- BEGIN: Delete Confirmation Modal -->
  <Modal :show="deleteOrderLineModel" @hidden="deleteOrderLineModel = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <Trash2Icon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-xl font-bold mt-5">
          ID : {{ formDataOrderLine.purchaseOrderId }}
        </div>
        <div class="text-slate-500 mt-2">
          Do you really want to delete these records? <br />This process cannot
          be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="deleteOrderLineModel = false"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          {{ const_txt.CANCEL_BTN }}
        </button>
        <button
          type="button"
          class="btn btn-danger w-24"
          @click="deleteOrderLineConfirm()"
        >
          Delete
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Delete Confirmation Modal -->

  <!-- BEGIN: View Info Modal -->

  <MoveableModal
    :show="orderInfoModal"
    @hidden="orderInfoModal = false"
    backdrop="static"
    size="modal-lg"
    title="INFO"
    @close="orderInfoModal = false"
  >
    <ModalBody class="p-0">
      <!-- BEGIN: INFO -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4 mt-6">
        <div class="p-5 text-center">
          <BoxIcon class="w-8 h-8 text-danger mx-auto mt-2" />

          <div class="text-xl font-bold mt-5">
            {{ formDataPurchaseOrder.orderNumber }}
          </div>
        </div>
        <div class="intro-y box p-5 mt-12 sm:mt-5">
          <div
            class="flex text-slate-500 border-b border-slate-200 dark:border-darkmode-300 border-dashed pb-3 mb-3"
          >
            <div>Parameters</div>
            <div class="ml-auto">Order Values</div>
          </div>

          <div class="flex items-center mb-5">
            <div class="flex items-center">
              <div>Picking Type</div>
            </div>
            <div class="ml-auto">{{ formDataPurchaseOrder.pickingType }}</div>
          </div>

          <div class="flex items-center mb-5">
            <div class="flex items-center">
              <div>Warehouse</div>
            </div>
            <div class="ml-auto">{{ formDataPurchaseOrder.warehouseId }}</div>
          </div>
          <div class="flex items-center mb-5">
            <div class="flex items-center">
              <div>Status</div>
            </div>
            <div class="ml-auto">{{ formDataPurchaseOrder.status }}</div>
          </div>

          <!-- <button
              class="btn btn-outline-secondary w-full border-slate-300 dark:border-darkmode-300 border-dashed relative justify-start mb-2"
            >
              <span class="truncate mr-5">View Full Report</span>
              <span
                class="w-8 h-8 absolute flex justify-center items-center right-0 top-0 bottom-0 my-auto ml-auto mr-0.5"
              >
                <ArrowRightIcon class="w-4 h-4" />
              </span>
            </button> -->
        </div>
      </div>
      <!-- END: INFO -->
    </ModalBody>
  </MoveableModal>
  <!-- END: View Info Modal-->

  <!-- <AddSkuModal addSku="true"/> -->
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

//import AddSkuModal from "../modals/Add Sku.vue"
import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../../global-functions/functions";
import {
  customerOrderStatus,
  customerOrderStatusColor,
  getPickingType,
  getPickingTypeColor,
} from "../../../global-functions/status";

import { exportCSVFile } from "../../../global-functions/functions";

import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Purchase Orders");
  },
  components: {
    Loading,
    paginate: Paginate,
    autoTable,
    // AddSkuModal
  },
  data() {
    return {
      const_txt: const_txt,
      doc: null,

      const_txt: const_txt,

      isLoading: false,
      searchData: "",

      orderInfoModal: false,

      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,
      addPurchaseOrder: false,
      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,

      deleteOrderLineModel: false,

      titleChange: -1,
      onePurchaseOrder: {
        orderNumber: "",
        requestedDate: "",
        neededDate: "",
        supplier: { name: "", address: "" },
      },
      formDataPurchaseOrder: {
        orderNumber: "",
        requestedDate: "",
        neededDate: "",
        warehouseId: "",
        status: "",
        pickingType: 0,
        supplierId: "",
        supplier: { name: "", address: "" },
      },
      formDataPurchaseOrderDefault: {
        orderNumber: "",
        requestedDate: "",
        neededDate: "",
        warehouseId: "",
        status: "",
        pickingType: 0,
        supplierId: "",
        supplier: { name: "", address: "" },
      },

      headers: [
        // { text: "ID", value: "purchaseOrderId" },
        // { text: "Order Number", value: "orderNumber" },
        // { text: "Requested Date", value: "requestedDate" },
        // { text: "Needed Date", value: "neededDate" },
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
      supplierItems: [],
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

      //supplier

      supplierList: [],

      //Warehouse
      warehouseList: [],

      //Product
      poId: "",
      productChange: -1,
      searchDataProduct: "",
      purchaseOrderInvoiceModal: false,
      addOrderlineModal: false,
      formDataOrderLine: {
        supplierProductNumber: "",
        description: "",
        skuId: "",
        quantity: "",
        purchaseOrderId: "",
      },
      formDataOrderLineDefault: {
        supplierProductNumber: "",
        description: "",
        skuId: "",
        quantity: "",
        purchaseOrderId: "",
      },
      paginationProduct: {
        pageNumberProduct: 1,
        pageSizeProduct: this.pageSize,
        searchProduct: "",
      },
      defaultPaginationProduct: {
        pageNumberProduct: 1,
        pageSizeProduct: this.pageSize,
        searchProduct: "",
      },
      pageCount: 0,
      initialPage: 1,
      pageSize: 10,

      productHeaders: [
        // { text: "OL ID", value: "purchaseOrderLineId" },
        // { text: "PO ID", value: "purchaseOrderId" },

        // { text: "Product Id", value: "productId" },
        // { text: "SKU", value: "skuId" },
        { text: "PLU/SKU", value: "skuId" },
        { text: "Supplier Product Number", value: "supplierProductNumber" },
        // { text: "QTY", value: "quantity" },
        // { text: "Description", value: "description" },
      ],
      productItems: [],
      productItemsData: [],

      skus: [],
      supplierProducts: [],
      products: [],
      purchaseOrders: [],
      orderNumber: "",
      orderLines: [],
      serverError: false,

      pageCountProduct: 0,
      pageRowCountProduct: 5,
      productStart: 0,
      productEnd: 5,
      orderLinesLocal: [],

      addSupplierProductModal: false,
      formDataSupplierProduct: {
        productNumber: "",
        supplierId: "",
        skuId: "",
        productDescription: "",
      },

      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,

      statusItems: [],
    };
  },
  filters: {
    moment: function (date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
  },
  computed: {
    formTitle() {
      return this.titleChange === -1
        ? "Add New Purchase Order"
        : "Edit Purchase Order";
    },
    productTitle() {
      return this.productChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },

    btnName() {
      return this.titleChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },

    formDataOrderLineDescription() {
      return this.formDataOrderLine.description;
    },
  },
  watch: {
    purchaseOrderInvoiceModal(val) {
      val || this.purchaseOrderInvoiceModalClose();
      this.orderLinesLocal = [];
      this.formDataOrderLine = Object.assign({}, this.formDataOrderLineDefault);
    },
    formDataOrderLineDescription() {
      this.getSupplierProductInfo();
    },
  },
  created() {
    this.getDataFromApi();
    this.getDataFromStatus();
  },
  methods: {
    getStatusColor(value) {
      try {
        return this.statusItems.find((status) => status.number === value).color;
      } catch {
        return "Nil";
      }
    },
    getStatus(value) {
      try {
        return this.statusItems.find((status) => status.number === value)
          .displayName;
      } catch {
        return "Nil";
      }
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
    setReports() {
      if (this.allItems <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        const columns = [
          { title: "Order Number", dataKey: "orderNumber" },
          { title: "Requested Date", dataKey: "requestedDate" },
          { title: "Require Date", dataKey: "neededDate" },
          { title: "Supplier", dataKey: "company" },
          { title: "Picking Type", dataKey: "pickingType" },
          { title: "Status", dataKey: "status" },
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
            requestedDate: el.requestedDate,
            neededDate: el.neededDate,
            company: el.supplier.company,
            pickingType: el.pickingType,
            status: el.status,
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
      this.docs.save(`${"Purchase Orders " + generateDate}.pdf`);
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
        var csvTitle = "Purchase Orders " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "Order Number",
          2: "Requested Date",
          3: "Require Data",
          4: "Supplier",
          5: "Picking Type",
          6: "Status",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.orderNumber,
            2: item.requestedDate,
            3: item.neededDate,
            4: item.supplier.company,
            5: item.pickingType,
            6: item.status,
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
        .post("PurchaseOrders/Paginated", pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.allItemsData = response.data.data;
            this.allItems = response.data.data.items;
            this.supplierItems = response.data.data.items.supplier;
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

          // this.isLoading = false;
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
          this.isLoading = false;
        });
    },
    getPickingType(status) {
      return getPickingType(status);
    },
    getPickingTypeColor(status) {
      return getPickingTypeColor(status);
    },
    customerOrderStatus(status) {
      return customerOrderStatus(status);
    },
    customerOrderStatusColor(status) {
      return customerOrderStatusColor(status);
    },
    setReport() {
      const columns = [
        { title: "PLU/SKU", dataKey: "skuId" },
        { title: "SUPPLIER PRODUCT NO", dataKey: "supplierProductNumber" },
        { title: "QTY", dataKey: "quantity" },
        { title: "DESC", dataKey: "description" },
      ];
      this.doc = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: "a4",
      });

      let data = [];
      let i = 0;
      let obj;

      this.orderLinesLocal.forEach((el) => {
        obj = {
          sku: el.sku,
          supplierProductNumber: el.supplierProductNumber,
          quantity: el.quantity,
          description: el.description,
        };
        //i++;
        data.push(obj);
        //   console.log(obj);
      });
      //console.log("DATA", data);

      var orderNumber = this.formDataPurchaseOrder.orderNumber;
      var fname = this.formDataPurchaseOrder.supplier.firstName;
      var mobile = this.formDataPurchaseOrder.supplier.mobile;
      var lname = this.formDataPurchaseOrder.supplier.lastName;
      var company = this.formDataPurchaseOrder.supplier.company;
      var email = this.formDataPurchaseOrder.supplier.email;
      var neededDate = this.momentLocal(this.formDataPurchaseOrder.neededDate);
      var requestedDate = this.momentLocal(
        this.formDataPurchaseOrder.requestedDate
      );

      if (!fname) {
        fname = "Nil";
      }
      if (!lname) {
        lname = "Nil";
      }
      if (!company) {
        company = "Nil";
      }
      if (!mobile) {
        mobile = "Nil";
      }
      if (!email) {
        email = "Nil";
      }
      if (!neededDate) {
        neededDate = "Nil";
      }
      if (!requestedDate) {
        requestedDate = "Nil";
      }

      var imgData = "/src/assets/images/pl_logo2.png";
      this.doc.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
      this.doc.setFontSize(16).text("Order Number : " + orderNumber, 5, 1.2);

      this.doc.setLineWidth(0.01).line(0.5, 2.2, 8.0, 2.2);

      this.doc.setFontSize(14).text("Deliver To :", 0.5, 2.5);

      this.doc.setFontSize(12).text("PHARMATEC PTE LTD", 0.7, 2.7);
      this.doc.setFontSize(12).text("62 Bank St,", 0.7, 2.9);
      this.doc.setFontSize(12).text("P.O.Box 450,Ba,", 0.7, 3.1);
      this.doc.setFontSize(12).text("Fiji Islands", 0.7, 3.3);
      this.doc.setFontSize(12).text("Ph: 6674933", 0.7, 3.5);
      this.doc.setFontSize(12).text("Fax: 6670118", 0.7, 3.7);
      this.doc.setFontSize(12).text("Email: admin@pharmatec.com.fj", 0.7, 3.9);

      //trading partner
      this.doc.setFontSize(14).text("To :", 5, 2.5);

      this.doc.setFontSize(12).text(fname + " " + lname, 5.2, 2.7);
      this.doc.setFontSize(12).text(company, 5.2, 2.9);
      this.doc.setFontSize(12).text(mobile, 5.2, 3.1);
      this.doc.setFontSize(12).text(email, 5.2, 3.3);

      this.doc
        .setFontSize(12)
        .text("Requested Date: " + this.momentLocal(requestedDate), 5, 3.7);
      this.doc
        .setFontSize(12)
        .text("Require Date: " + this.momentLocal(neededDate), 5, 3.9);

      autoTable(this.doc, {
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
        margin: { left: 0.5, top: 4.4 },
      });
    },

    onPrint() {
      this.setReport();
      this.doc.autoPrint();
      this.doc.output("dataurlnewwindow");
    },

    generateReport() {
      this.setReport();
      var generateDate = new Date().toLocaleString();
      this.doc.save(
        `${this.formDataPurchaseOrder.orderNumber + "_" + generateDate}.pdf`
      );
    },

    closeAddSupplierProductModal() {
      this.addSupplierProductModal = false;
    },

    saveSupplierProducts() {
      this.isLoading = true;

      axios
        .post("SupplierProducts", this.formDataSupplierProduct)
        .then((response) => {
          if (response.data.success === true) {
            this.formDataOrderLine.supplierProductNumber =
              response.data.data.productNumber;
            this.formDataOrderLine.description =
              response.data.data.productDescription;
            this.formDataOrderLine.skuId = response.data.data.skuId;

            console.log("response", response);
            console.log("formDataOrderLine", this.formDataOrderLine);

            this.saveFormProduct();
            this.addSupplierProductModal = false;

            this.isLoading = false;
            successToast(response.data.message);
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
    addSupplierProduct() {
      var supplierProductNumber = this.formDataOrderLine.supplierProductNumber;

      if (supplierProductNumber === "ADD NEW") {
        var supplierId = this.formDataPurchaseOrder.supplier.supplierId;
        this.formDataSupplierProduct.supplierId = supplierId;
        this.addOrderlineModal = false;
        this.addSupplierProductModal = true;
      }
    },
    addSupplierProductInfo() {
      var skuId = this.formDataSupplierProduct.skuId;
      var skuInfo = this.skus.find((x) => x.skuId == skuId);
      if (skuInfo != undefined) {
        this.formDataSupplierProduct.productDescription = skuInfo.description;
      } else {
        this.formDataSupplierProduct.productDescription = "";
      }
    },

    getSupplierProductInfo() {
      console.log("Worked", this.supplierProducts);

      var description = this.formDataOrderLine.description;

      var supplierProductInfo = this.supplierProducts.find(
        (x) => x.skuDescription == description
      );

      if (supplierProductInfo != undefined) {
        // this.formDataOrderLine.description =
        //   supplierProductInfo.productDescription;

        this.formDataOrderLine.supplierProductNumber =
          supplierProductInfo.productNumber;
        this.formDataOrderLine.skuId = supplierProductInfo.skuId;
        // this.formDataOrderLine.skuId = supplierProductInfo.skuId;
      } else {
        this.formDataOrderLine.supplierProductNumber = "";
        this.formDataOrderLine.skuId = "";
        // this.formDataOrderLine.skuName = "";
      }

      //this.supplierProducts
    },
    changePageProduct(pageNum) {
      this.productEnd = this.pageRowCountProduct * pageNum;
      this.productStart = this.productEnd - this.pageRowCountProduct;
      this.orderLinesLocal = this.orderLines.slice(
        this.productStart,
        this.productEnd
      );
    },

    getSelectedColor() {
      return "background-color:rgb(22,78,99);color: white";
    },

    purchaseOrderInvoiceModalClose() {
      // this.isLoading = true;

      for (var i = 0; i < this.items.length; i++) {
        this.items[i].selected = false;
        // this.isLoading = false;

        this.purchaseOrderInvoiceModal = false;
      }
    },
    viewOrderInfo(item) {
      this.formDataPurchaseOrder = Object.assign({}, item);
      this.orderInfoModal = true;
    },
    momentLocal(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY");
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
      this.formDataPurchaseOrder = Object.assign(
        {},
        this.formDataPurchaseOrderDefault
      );
    },
    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("PurchaseOrders/Paginated", this.pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsData = response.data.data;
            this.items = response.data.data.items;
            this.supplierItems = response.data.data.items.supplier;
            this.pageCount = this.itemsData.totalPages;

            for (var i = 0; i < this.items.length; i++) {
              this.items[i].selected = false;

              // this.isLoading = false;
            }
            this.isLoading = false;
          } else {
            warningToast(response.data.message);
            this.isLoading = false;
          }

          // this.isLoading = false;
        })
        .catch((error) => {
          localStorage.setItem("errorMessage", error);
          router.push("/page-down");
        });
    },
    // getDataFromApiProduct() {
    //   axios
    //     .post("PurchaseOrders/Paginated", this.pagination)
    //     .then((response) => {
    //       this.productItemsData = response.data.data;
    //       var purchaseOrderId = this.formDataOrderLine.purchaseOrderId;
    //       this.productItems = response.data.data.items.filter(
    //         (a) => a.purchaseOrderId === purchaseOrderId
    //       );
    //       console.log("productItems", this.productItems);
    //       this.pageCountProduct = this.itemsData.totalPages;
    //     });
    // },
    showModal() {
      this.setDefault();
      this.titleChange = -1;
      this.activateModal();
      this.getDataFromStatus();
    },
    activateModal() {
      this.getSupplierData();
      this.getWarehouseData();
      this.addPurchaseOrder = true;
    },
    closeForm() {
      this.addPurchaseOrder = false;
    },
    editItem(item) {
      this.titleChange = 0;
      this.formDataPurchaseOrder = Object.assign({}, item);
      this.activateModal();
    },

    connectTimetoDate() {
      var newDate = moment(this.formDataPurchaseOrder.requestedDate).format(
        "YYYY-MM-DD"
      );
      var currentTime = moment(new Date()).format();
      var splitTime = currentTime.split("T");
      newDate = newDate.concat("T").concat(splitTime[1]);
      this.formDataPurchaseOrder.requestedDate = newDate;
    },

    saveForm() {
      if (
        this.formDataPurchaseOrder.orderNumber == "" ||
        this.formDataPurchaseOrder.supplierId == "" ||
        this.formDataPurchaseOrder.warehouseId == "" ||
        this.formDataPurchaseOrder.status == ""
      ) {
        if (this.formDataPurchaseOrder.orderNumber == "") {
          warningToast("order Number Required");
        }
        if (this.formDataPurchaseOrder.supplierId == "") {
          warningToast("Supplier Required");
        }
        if (this.formDataPurchaseOrder.warehouseId == "") {
          warningToast("Warehouse Required");
        }

        if (this.formDataPurchaseOrder.status == "") {
          warningToast("Status Required");
        }
      } else {
        if (this.titleChange === -1) {
          this.isLoading = true;
          this.connectTimetoDate();
          axios
            .post("PurchaseOrders", this.formDataPurchaseOrder)
            .then((response) => {
              console.log(response);
              if (response.data.success === true) {
                this.formDataPurchaseOrder = response.data.data;
                console.log("response");
                console.log(response);
                this.formDataPurchaseOrder.purchaseOrderId =
                  response.data.data.purchaseOrderId;

                this.formDataOrderLine.purchaseOrderId =
                  response.data.data.purchaseOrderId;

                this.addPurchaseOrder = false;
                this.purchaseOrderInvoiceModal = true;

                this.orderNumber = response.data.data.orderNumber;
                this.getDataFromApi();
                successToast(response.data.message);
              } else {
                this.isLoading = false;
                failedToast(response.data.message);
              }
            })
            .catch((error) => {
              this.isLoading = false;
              warningToast(statusMessage(error.response.status));
            });
        } else {
          this.connectTimetoDate();
          var itemId = this.formDataPurchaseOrder.purchaseOrderId;
          this.isLoading = true;
          axios
            .put("PurchaseOrders/" + itemId, this.formDataPurchaseOrder)
            .then((response) => {
              if (response.data.success === true) {
                this.itemsData = response.data.data;
                this.items = response.data.data.items;
                this.addPurchaseOrder = false;
                this.getDataFromApi();
                successToast(response.data.message);
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
      }
    },
    archiveItem(item) {
      this.formDataPurchaseOrder = Object.assign({}, item);
      this.archiveConfirmationModal = true;
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
      var itemId = this.formDataPurchaseOrder.purchaseOrderId;
      this.isLoading = true;
      axios
        .get("PurchaseOrders/" + itemId + "/Archive")
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
          warningToast(statusMessage(error.response.status));
        });
    },
    viewArchives() {
      this.isLoading = true;
      axios
        .post("PurchaseOrders/Archived", this.paginationArchive)
        .then((response) => {
          if (response.data.success === true) {
            this.archiveData = response.data.data;
            this.archiveItems = response.data.data.items;
            this.pageCountArchive = this.archiveData.totalPages;
            this.isLoading = false;
            this.archiveModal = true;
          } else {
            this.isLoading = false;
            warningToast(statusMessage(error.response.status));
          }
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
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
      this.formDataPurchaseOrder = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.formDataPurchaseOrder.purchaseOrderId;
      this.isLoading = true;
      axios
        .get("PurchaseOrders/" + itemId + "/Restore")
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
          warningToast(statusMessage(error.response.status));
        });
    },
    deleteItem(item) {
      this.formDataPurchaseOrder = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      var itemId = this.formDataPurchaseOrder.purchaseOrderId;
      this.isLoading = true;
      axios
        .delete("PurchaseOrders/" + itemId)
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
          warningToast(statusMessage(error.response.status));
        });
    },

    //Product
    pageSizeChangeProduct() {
      this.pagination.pageSize = this.pageSize;
      // this.getDataFromApiProduct();
    },
    // changePageProduct(pageNum) {
    // this.pagination.pageNumber = pageNum;
    // this.getDataFromApiProduct();
    //  },
    searchOnchangeProduct() {
      if (this.searchDataProduct != "") {
        this.searchActiveProduct = true;
        this.searchItemProduct();
      } else {
        this.clearSearchProduct();
      }
    },
    clearSearchProduct() {
      this.searchDataProduct = "";
      this.pagination.searchProduct = this.searchDataProduct;
      //    this.getDataFromApiProduct();
      this.searchActiveProduct = false;
    },
    searchItemProduct() {
      if (this.searchDataProduct != "") {
        this.searchActiveProduct = true;
        this.pagination.searchProduct = this.searchDataProduct;
        //      this.getDataFromApiProduct();
      }
    },

    setDefaultProduct() {
      this.formDataOrderLine = Object.assign({}, this.formDataOrderLineDefault);
      this.formDataOrderLine.purchaseOrderId =
        this.formDataPurchaseOrder.purchaseOrderId;
    },

    showModalProduct() {
      this.productChange = -1;
      this.setDefaultProduct();
      this.activateModalProduct();
    },
    activateModalProduct() {
      this.getSkus();
      this.getSupplierProducts();

      this.addOrderlineModal = true;
    },

    closeFormProduct() {
      this.purchaseOrderInvoiceModal = false;
    },
    saveFormProduct() {
      if (
        this.formDataOrderLine.description == "" ||
        this.formDataOrderLine.description == "SELECT" ||
        this.formDataOrderLine.quantity == ""
      ) {
        if (
          this.formDataOrderLine.description == "" ||
          this.formDataOrderLine.description == "SELECT"
        ) {
          warningToast("Select Product");
        }
        if (this.formDataOrderLine.quantity == "") {
          warningToast("Quantity Required");
        }
      } else {
        this.isLoading = true;
        axios
          .post("PurchaseOrders/OrderLine", this.formDataOrderLine)
          .then((response) => {
            if (response.data.success === true) {
              this.itemsData = response.data.data;
              this.items = response.data.data.items;
              this.addOrderlineModal = false;
              this.getOrderLines();
              this.getDataFromApi();
              successToast(response.data.message);
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
    },
    //create ordeline
    addItem(item) {
      this.formDataOrderLine.purchaseOrderId = item.purchaseOrderId;
      this.formDataPurchaseOrder = Object.assign({}, item);
      this.purchaseOrderInvoiceModal = true;
      this.addOrderlineModal = false;
      this.orderNumber = item.orderNumber;
      this.getOrderLines();
      //  this.getSkus();
    },
    getOrderLines() {
      axios
        .get("PurchaseOrders/" + this.orderNumber)
        .then((response) => {
          this.orderLines = response.data.data.orderLines;

          for (var i = 0; i < this.orderLines.length; i++) {
            this.orderLines[i].no = i + 1;

            this.isLoading = false;
          }
          var pageCount = this.orderLines.length / this.pageRowCountProduct;
          let pageCountRound = Math.round(pageCount);
          if (pageCount > pageCountRound) {
            pageCountRound += 1;
            this.pageCountProduct = pageCountRound;
          } else {
            this.pageCountProduct = pageCountRound;
          }

          //pageCountProduct
          this.orderLinesLocal = this.orderLines.slice(
            this.productStart,
            this.productEnd
          );
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },
    //delete orderline
    deleteOrdeLine(item) {
      this.formDataOrderLine = Object.assign({}, item);
      this.deleteOrderLineModel = true;
      this.getOrderLines();
    },
    deleteOrderLineConfirm() {
      var itemId = this.formDataOrderLine.purchaseOrderLineId;
      this.isLoading = true;
      axios
        .delete("PurchaseOrders/OrderLine/" + itemId)
        .then((response) => {
          if (response.data.success === true) {
            this.deleteOrderLineModel = false;
            this.getOrderLines();
            successToast(response.data.message);
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

    //supplier
    getSupplierData() {
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("suppliers/Paginated", pagination)
        .then((response) => {
          this.supplierList = response.data.data.items;
          // if (this.supplierList.length > 0) {
          //   this.formDataPurchaseOrder.supplierId =
          //     this.supplierList[0].supplierId;
          // } else
          if (this.supplierList.length == 0) {
            warningToast("Please Add Items in Supplier");
            this.addPurchaseOrder = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
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
            this.addPurchaseOrder = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    getSkus() {
      this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 10000 };
      axios
        .post("Sku/Paginated", pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.isLoading = false;
            this.skus = response.data.data.items;

            if (this.skus.length == 0) {
              warningToast("Please Add Items in SKU");
              this.purchaseOrderInvoiceModal = false;
            }
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
          this.serverError = true;
        });
    },
    // getProducts() {
    //   var pagination = { pageNumber: 1, pageSize: 100 };
    //   axios
    //     .post("Products/Paginated", pagination)
    //     .then((response) => {
    //       this.products = response.data.data.items;

    //       // if (this.skus.length > 0) {
    //       //   this.formDataOrderLine.skuId = this.skus[0].skuId;
    //       // } else
    //       if (this.products.length == 0) {
    //         this.apiMessage = "Please Add Items in Product";
    //         this.warningToast();
    //         this.purchaseOrderInvoiceModal = false;
    //       }
    //     })
    //     .catch((error) => {
    //       this.apiMessage = error;
    //       this.warningToast();
    //       this.serverError = true;
    //     });
    // },

    getSupplierProducts() {
      this.isLoading = true;
      var supplierid = this.formDataPurchaseOrder.supplier.supplierId;
      var pagination = { pageNumber: 1, pageSize: 100 };

      axios
        .post(`SupplierProducts/${supplierid}/Paginated`, pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.isLoading = false;
            this.supplierProducts = response.data.data.items;

            if (this.supplierProducts.length == 0) {
              warningToast("Please Add Items in Supplier Product");
              // this.purchaseOrderInvoiceModal = false;
            }
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
          this.serverError = true;
        });
    },
  },
};
</script>
