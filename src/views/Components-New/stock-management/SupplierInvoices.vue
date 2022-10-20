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
        <a
          href="javascript:;"
          @click="showModal()"
          class="btn btn-primary shadow-md lg:w-auto w-1/2 text-xs lg:text-sm"
        >
          Add New Invoice
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
            <th>Invoice Number</th>
            <th
              class="whitespace-nowrap"
              v-for="(header, i) in headers"
              :key="i"
            >
              {{ header.text }}
            </th>
            <th>Invoice Date</th>
            <th>Received Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i" class="intro-x">
            <td
              @click="
                viewInvoice(item);
                item.selected = true;
              "
              class="cursor-pointer"
              :style="item.selected ? getSelectedColor() : 'color: #1a73e8'"
            >
              {{ item.invoiceNumber }}
            </td>
            <td
              v-for="(header, index) in headers"
              :key="index"
              :style="item.selected ? getSelectedColor() : ''"
            >
              {{ item[header.value] }}
            </td>
            <td
              class="cursor-pointer"
              :style="item.selected ? getSelectedColor() : ''"
            >
              {{ momentLocal(item.invoiceDate) }}
            </td>
            <td
              class="cursor-pointer"
              :style="item.selected ? getSelectedColor() : ''"
            >
              {{ momentLocal(item.receivedDate) }}
            </td>
            <td :style="item.selected ? getSelectedColor() : ''">
              <div
                class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                :style="{ 'background-color': getStatusColor(item.status) }"
              >
                {{ getStatus(item.status) }}
              </div>
            </td>

            <td class="table-report__action w-56">
              <div class="flex justify-center items-center">
                <a
                  class="flex items-center mr-3 font-bold"
                  href="javascript:;"
                  @click="viewInvoiceInfo(item)"
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
                <!-- <a
                  @Click="viewInvoice(item)"
                  class="flex items-center mr-3 font-semibold"
                  href="javascript:;"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="Invoice Products"
                    ><PlusSquareIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                  /></Tippy>
                </a> -->

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

  <!-- BEGIN: Add  Modal -->
  <MoveableModal
    :show="addInvoice"
    @hidden="addInvoice = false"
    backdrop="static"
    size="modal-lg"
    :title="formTitle"
    @close="addInvoice = false"
  >
    <ModalBody
      class="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 lg:gap-4 md:gap-4 gap-2"
    >
      <div class="w-full">
        <label for="regular-form-1" class="form-label">Invoice Number</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataInvoice.invoiceNumber"
            type="text"
            class="form-control"
            name="invoiceNumber"
            placeholder="Invoice Number"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Order Number</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataInvoice.orderNumber"
            :options="{
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full"
          >
            <option v-if="titleChange != -1">
              {{ formDataInvoice.orderNumber }}
            </option>
            <option v-if="titleChange == -1" value="">SELECT</option>
            <option
              :value="item.orderNumber"
              v-for="(item, i) in purchaseOrders"
              :key="i"
            >
              {{ item.orderNumber }}
            </option>
          </TomSelect>
        </div>
      </div>

      <div class="w-full" v-if="titleChange === -1">
        <label for="regular-form-1" class="form-label">Supplier</label>
        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataInvoice.supplierId"
            :options="{
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full"
          >
            <option v-if="titleChange != -1">
              {{ formDataInvoice.supplierName }}
            </option>
            <option v-if="titleChange == -1" value="">SELECT</option>
            <option
              :value="item.supplierId"
              v-for="(item, i) in suppliers"
              :key="i"
            >
              {{ item.company }}
            </option>
          </TomSelect>
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Invoice Date</label>

        <PreviewComponent class="intro-y">
          <div class="">
            <Preview>
              <Litepicker
                v-model="formDataInvoice.invoiceDate"
                :options="{
                  autoApply: true,
                  showWeekNumbers: true,
                  dropdowns: {
                    // format: 'YYYY-MM-DD\T00:00:00',
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

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Received Date</label>

        <PreviewComponent class="intro-y">
          <div class="">
            <Preview>
              <Litepicker
                v-model="formDataInvoice.receivedDate"
                :options="{
                  autoApply: true,
                  showWeekNumbers: true,
                  dropdowns: {
                    // format: 'YYYY-MM-DD\T00:00:00',
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

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Sales Rep</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataInvoice.salesRep"
            type="text"
            class="form-control"
            name="salesRep"
            placeholder="Sales Rep"
          />
        </div>
      </div>

      <div class="w-full lg:col-span-2 md:col-span-2 col-span-0">
        <label for="regular-form-1" class="form-label">Location</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataInvoice.location"
            type="text"
            class="form-control"
            name="location"
            placeholder="Location"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Status</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataInvoice.status"
            :options="{
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full"
          >
            <optgroup label="Selected" v-if="titleChange != -1">
              <option :value="formDataInvoice.status">
                {{ getStatus(formDataInvoice.status) }}
              </option>
            </optgroup>

            <optgroup label="Editable">
              <option v-if="titleChange == -1">SELECT</option>
              <option
                :value="item.number"
                v-for="(item, i) in statusItems"
                :key="i"
              >
                {{ item.name }}
              </option>
            </optgroup>
          </TomSelect>
        </div>
      </div>

      <div class="w-full lg:col-span-2 md:col-span-2 col-span-0">
        <label for="regular-form-1" class="form-label">Ship Via</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataInvoice.shipVia"
            type="text"
            class="form-control"
            name="shipVia"
            placeholder="Ship Via"
          />
        </div>
      </div>

      <!-- <div class="w-full">
        <label for="regular-form-1" class="form-label">Currency</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataInvoice.currency"
            type="text"
            class="form-control"
            name="currency"
            placeholder="Currency"
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
  <!-- END: Add Modal -->

  <!-- BEGIN: Add Product Modal -->

  <MoveableModal
    :show="addProductModal"
    @hidden="addProductModal = false"
    backdrop="static"
    size="modal-xl"
    title="Add Product"
    @close="addProductModal = false"
  >
    <ModalBody class="grid grid-cols-2 lg:gap-4 md:gap-4 gap-2">
      <!-- <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label">Invoice</label>

        <div class="flex flex-col space-y-1">
          <input
            disabled
            id="vertical-form-1"
            v-model="formDataProduct.invoiceId"
            type="number"
            class="form-control lg:text-base md:text-sm text-xs"
            name="invoiceId"
            placeholder="Invoice"
          />
        </div>
      </div> -->

      <div class="">
        <label for="regular-form-1" class="form-label">Warehouse</label>
        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataProduct.warehouseId"
            :options="{
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full lg:text-base md:text-sm text-xs"
          >
            <option v-if="productChange != -1">
              {{ formDataProduct.name }}
            </option>
            <option v-if="productChange == -1" value="">SELECT</option>
            <option
              :value="item.warehouseId"
              v-for="(item, i) in warehouses"
              :key="i"
            >
              {{ item.name }}
            </option>
          </TomSelect>
        </div>
      </div>

      <!-- <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label">Product</label>
        <TomSelect
          v-model="formDataProduct.productId"
          :options="{
            placeholder: 'Select..',
            allowEmptyOption: true,
          }"
          class="w-full lg:text-base md:text-sm text-xs"
        >
          <option v-if="productChange != -1">
            {{ formDataProduct.name }}
          </option>
          <option :value="item.name" v-for="(item, i) in products" :key="i">
            {{ item.name }}
          </option>
        </TomSelect>
      </div> -->

      <div class="">
        <label for="regular-form-1" class="form-label"> Unit Price</label>

        <input
          id="vertical-form-1"
          v-model="formDataProduct.unitPrice"
          type="number"
          class="form-control lg:text-base md:text-sm text-xs"
          name="unitPrice"
          placeholder="Unit Price"
        />
      </div>

      <div class="">
        <label for="regular-form-1" class="form-label">Quantity</label>

        <input
          id="vertical-form-1"
          v-model="formDataProduct.quantity"
          type="number"
          class="form-control lg:text-base md:text-sm text-xs"
          name="quantity"
          placeholder="Quantity"
        />
      </div>
      <div class="">
        <label for="regular-form-1" class="form-label">VAT</label>

        <input
          id="vertical-form-1"
          v-model="formDataProduct.vat"
          type="number"
          class="form-control lg:text-base md:text-sm text-xs"
          name="vat"
          placeholder="Vat"
        />
      </div>
      <div class="">
        <label for="regular-form-1" class="form-label"
          >Discount Percentage</label
        >

        <input
          id="vertical-form-1"
          v-model="formDataProduct.discountPercentage"
          type="number"
          class="form-control lg:text-base md:text-sm text-xs"
          name="discountPercentage"
          placeholder="Discount Percentage"
        />
      </div>

      <div class="">
        <label for="regular-form-1" class="form-label"
          >Supplier Product No</label
        >

        <TomSelect
          v-model="formDataProduct.supplierProductNumber"
          :options="{
            placeholder: 'Select..',
          }"
          class="w-full lg:text-sm md:text-sm text-xs"
        >
          <option>SELECT</option>

          <option
            :value="item.supplierProductNumber"
            v-for="(item, i) in supplierProducts"
            :key="i"
          >
            {{ item.productNumber }}
          </option>
        </TomSelect>
      </div>

      <div class="col-span-2">
        <label for="regular-form-1" class="form-label">Description</label>

        <div class="flex flex-col">
          <textarea
            id="vertical-form-1"
            v-model="formDataProduct.description"
            type="text"
            class="form-control lg:text-base md:text-sm text-xs"
            name="description"
            placeholder="Type here about description..."
          ></textarea>
        </div>
      </div>

      <div class="">
        <label for="regular-form-1" class="form-label"
          >Manufacturing Date</label
        >

        <PreviewComponent class="intro-y lg:mt-0 md:mt-0 mt-5">
          <div>
            <Preview>
              <Litepicker
                v-model="formDataProduct.productionDate"
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
                class="form-control lg:text-base md:text-sm text-xs"
              />
            </Preview>
          </div>
        </PreviewComponent>
      </div>

      <div class="">
        <label for="regular-form-1" class="form-label">Expiry Date</label>
        <PreviewComponent class="intro-y lg:mt-0 md:mt-0 mt-5">
          <div>
            <Preview>
              <Litepicker
                v-model="formDataProduct.expirationDate"
                :options="{
                  autoApply: true,
                  showWeekNumbers: true,
                  dropdowns: {
                    minYear: 1990,
                    maxYear: 2500,
                    months: true,
                    years: true,
                  },
                }"
                class="form-control lg:text-base md:text-sm text-xs"
              />
            </Preview>
          </div>
        </PreviewComponent>
      </div>

      <div class="col-span-2">
        <label for="regular-form-1" class="form-label"
          >Product Description</label
        >

        <div class="flex flex-col">
          <textarea
            id="vertical-form-1"
            v-model="formDataProduct.productDescription"
            type="text"
            class="form-control lg:text-base md:text-sm text-xs"
            name="productDescription"
            placeholder="Type here about product description..."
          ></textarea>
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="closeFormProduct()"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        {{ const_txt.CANCEL_BTN }}
      </button>
      <button
        @click="saveFormProduct()"
        type="submit"
        class="btn btn-primary w-24"
      >
        {{ productTitle }}
      </button>
    </ModalFooter>
  </MoveableModal>
  <!-- END: Add Product Modal -->

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
        Archived invoice
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
      <!-- BEGIN: Archive Data List -->
      <div
        class="p-5 text-center text-lg"
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
              <th>Invoice Number</th>
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in headers"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>Invoice Date</th>
              <th>Received Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in archiveItems" :key="i" class="intro-x">
              <td>
                {{ item.invoiceNumber }}
              </td>
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>
              <td>
                {{ momentLocal(item.invoiceDate) }}
              </td>
              <td>
                {{ momentLocal(item.receivedDate) }}
              </td>
              <td>
                <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                  :style="{ 'background-color': getStatusColor(item.status) }"
                >
                  {{ getStatus(item.status) }}
                </div>
              </td>

              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <a
                    class="flex items-center mr-3 font-bold"
                    href="javascript:;"
                    @click="viewInvoiceInfo(item)"
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
                  </a>
                  <a
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
                      <RotateCcwIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                      />
                    </Tippy>
                  </a>

                  <a
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
                  </a>
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
    </ModalBody>
  </Modal>
  <!-- END: Archive Modal -->

  <!-- BEGIN: Confirmation Modals -->
  <ArchiveConfirmModal
    :name="formDataInvoice.invoiceNumber"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formDataInvoice.invoiceNumber"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formDataInvoice.invoiceNumber"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete"
  />
  <!-- END: Confirmation Modals -->

  <!-- BEGIN: Add  Modal For Product-->

  <MoveableModal
    :show="invoiceModel"
    @hidden="invoiceModel = false"
    backdrop="static"
    size="modal-sl-85"
    @close="invoiceModel = false"
  >
    <ModalBody class="p-0">
      <div class="flex flex-col space-y-4 w-full lg:p-10 md:p-6 p-4">
        <div class="flex justify-between items-start">
          <div class="flex flex-col justify-center items-start">
            <img
              src="/src/assets/images/pl_logo2.png"
              alt="logo"
              class="lg:w-52 lg:h-24 md:w-36 md:h-16 w-28 h-12"
            />

            <h5
              class="lg:text-lg md:text-base text-sm text-black-900 font-medium leading-none mt-3"
            >
              Supplier : {{ formDataInvoice.supplierName }}
            </h5>

            <h6
              class="lg:text-base md:text-base text-sm text-slate-500 font-medium leading-none mt-3"
            >
              Location : {{ formDataInvoice.location }}
            </h6>
            <h6
              class="lg:text-base md:text-base text-sm text-slate-500 font-medium leading-none mt-3"
            >
              Ship Via : {{ formDataInvoice.shipVia }}
            </h6>
            <h6
              class="lg:text-base md:text-base text-sm text-slate-500 font-medium leading-none mt-3"
            >
              Sales Rep : {{ formDataInvoice.salesRep }}
            </h6>
            <h6
              class="lg:text-base md:text-base text-sm text-slate-500 font-medium leading-none mt-3"
            >
              Currency : {{ formDataInvoice.currency }}
            </h6>
          </div>
          <div class="flex flex-col justify-center text-right">
            <h2
              class="lg:text-3xl md:text-xl text-lg font-medium leading-none mt-3"
            >
              Invoice Number
            </h2>
            <div class="flex flex-col space-y-1">
              <h6
                class="text-black leading-none mt-1 lg:text-2xl md:text-xl text-base"
              >
                #{{ formDataInvoice.invoiceNumber }}
              </h6>
            </div>
            <h2
              class="lg:text-2xl md:text-lg text-base font-medium leading-none mt-3"
            >
              Order Number
            </h2>
            <div class="flex flex-col space-y-1">
              <h6
                class="text-black leading-none mt-1 lg:text-xl md:text-lg text-base"
              >
                #{{ formDataInvoice.orderNumber }}
              </h6>
            </div>

            <div class="grid gap-2 mt-5">
              <div class="flex items-center lg:text-base md:text-base text-sm">
                <label for="regular-form-1" class="form-label"
                  >Invoice Date :
                  <span> {{ momentLocal(formDataInvoice.invoiceDate) }} </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <a
            href="javascript:;"
            @click="showModalProduct()"
            class="btn btn-primary"
            v-if="formDataInvoice.status == 1"
          >
            Add Invoice Product
          </a>

          <div class="flex items-center">
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
      </div>

      <hr />

      <div class="intro-y col-span-12 overflow-auto p-4">
        <table class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>NO</th>
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in invoiceProductHeaders"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>UNIT PRICE</th>
              <th>DISC%</th>
              <th class="text-right">GROSS</th>
              <th class="text-right">VAT</th>
              <th class="text-right">VIP AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in invoiceProductLocal"
              :key="i"
              class="intro-x"
            >
              <td>
                {{ item.no }}
              </td>
              <td v-for="(header, index) in invoiceProductHeaders" :key="index">
                {{ item[header.value] }}
              </td>
              <td>
                {{ currencyFormat(item.unitPrice) }}
              </td>
              <td>
                {{ percentageFormat(item.discountPercentage) }}
              </td>
              <td class="text-right">
                {{ currencyFormat(item.grossValue) }}
              </td>
              <td class="text-right">
                {{ currencyFormat(item.vat) }}
              </td>
              <td class="text-right">
                {{ currencyFormat(item.vipAmount) }}
              </td>

              <td class="table-report__action w-16 hidden">
                <div class="flex justify-center items-center">
                  <a
                    @click="viewProductInfo(item)"
                    class="flex items-center mr-3 text-blue-900"
                    href="javascript:;"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="INFO"
                      :options="{
                        zIndex: 99999,
                      }"
                      ><InfoIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    /></Tippy>
                  </a>
                </div>
              </td>
            </tr>
            <tr class="font-bold text-right">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>SUB TOTAL</td>

              <td>
                {{ currencyFormat(grossTotal) }}
              </td>
              <td>
                {{ currencyFormat(vatTotal) }}
              </td>
              <td>
                {{ currencyFormat(vipTotal) }}
              </td>
            </tr>
          </tbody>
        </table>
        <!-- BEGIN: Pagination -->

        <div
          v-if="this.invoiceProducts.length > 0"
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
        <hr />
        <div class="flex items-end justify-end mt-4">
          <div class="text-right mr-4">
            <div class="text-base text-slate-500">Total Amount</div>
            <div class="text-xl text-primary font-medium mt-2">
              {{ currencyFormat(vipTotal) }}
            </div>
            <!-- <div class="mt-1">Taxes included</div> -->
          </div>
        </div>
      </div>
      <!-- END: Archive Data List -->
      <div v-if="invoiceProducts == null" class="p-5 text-center text-lg">
        <!-- {{invoiceProducts.length}} -->
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

  <!-- BEGIN: View Info Modal -->

  <MoveableModal
    :show="invoiceInfoModal"
    @hidden="invoiceInfoModal = false"
    backdrop="static"
    size="modal-sl-60"
    title="INFO"
    @close="invoiceInfoModal = false"
  >
    <ModalBody class="p-0">
      <!-- BEGIN: INFO -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4 mt-6">
        <div class="p-5 text-center">
          <BoxIcon class="w-8 h-8 text-danger mx-auto mt-2" />

          <div class="text-xl font-bold mt-5">
            Invoice# : {{ formDataInvoice.invoiceNumber }}
          </div>
        </div>
        <div class="intro-y box p-5 mt-12 sm:mt-5">
          <div
            class="pt-4 intro-y box grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 lg:gap-4 md:gap-4 gap-2"
          >
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Supplier</div>
              </div>
              <div>
                {{
                  formDataInvoice.supplierName != null
                    ? formDataInvoice.supplierName
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Invoice Date</div>
              </div>
              <div>
                {{
                  formDataInvoice.invoiceDate != null
                    ? momentLocal(formDataInvoice.invoiceDate)
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Received Date</div>
              </div>
              <div>
                {{
                  formDataInvoice.receivedDate != null
                    ? momentLocal(formDataInvoice.receivedDate)
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Received Date</div>
              </div>
              <div>
                {{
                  formDataInvoice.receivedDate != null
                    ? momentLocal(formDataInvoice.receivedDate)
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Status</div>
              </div>
              <div>
                {{
                  formDataInvoice.status != null
                    ? getStatus(formDataInvoice.status)
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Ship Via</div>
              </div>
              <div>
                {{
                  formDataInvoice.shipVia != null
                    ? formDataInvoice.shipVia
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Sales Rep</div>
              </div>
              <div>
                {{
                  formDataInvoice.salesRep != null
                    ? formDataInvoice.salesRep
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Currency</div>
              </div>
              <div>
                {{
                  formDataInvoice.currency != null
                    ? currencyFormat(formDataInvoice.currency)
                    : "Nil"
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: INFO -->
    </ModalBody>
  </MoveableModal>

  <!-- END: View Info Modal-->
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

import Moveable from "vue3-moveable";

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

import {
  supplierInvoiceStatus,
  supplierInvoiceStatusColor,
} from "../../../global-functions/status";

import { exportCSVFile } from "../../../global-functions/functions";

import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Supplier Invoices");
  },
  components: {
    Moveable,
    Loading,
    paginate: Paginate,
    autoTable,
  },
  data() {
    return {
      doc: null,
      const_txt: const_txt,
      isLoading: false,
      invoiceInfoModal: false,
      searchData: "",
      addInvoice: false,
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,
      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,
      titleChange: -1,
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
        supplierId: "",
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
        pageSize: 10,
        search: "",
        // sortColumnName: "invoiceNumber",
        // sortDirection: "asc",
      },
      defaultPagination: {
        pageNumber: 1,
        pageSize: 10,
        search: "",
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

      items: [],
      itemsData: [],
      archiveItems: [],
      archiveData: [],
      paginationArchive: {
        pageNumber: 1,
        pageSize: 5,
      },

      pageCountArchive: 20,

      //product
      productChange: -1,
      addProductModal: false,
      formDataProduct: {
        description: "",
        quantity: "",
        unitPrice: "",
        discountPercentage: 0,
        vat: 0,
        productionDate: "",
        expirationDate: "",
        supplierProductNumber: "",
        productDescription: "",
        invoiceId: "",
        warehouseId: "",
      },
      formDataProductDefault: {
        description: "",
        quantity: "",
        unitPrice: "",
        discountPercentage: 0,
        vat: 0,
        productionDate: "",
        expirationDate: "",
        supplierProductNumber: "",
        productDescription: "",
        invoiceId: "",
        warehouseId: "",
      },
      invoices: [],
      warehouses: [],
      suppliers: [],

      invoiceModel: false, //invoice modal
      invoiceProductHeaders: [
        { text: "PLU/SKU", value: "supplierProductNumber" },
        { text: "DESC", value: "productDescription" },
        { text: "QTY", value: "quantity" },
      ],

      invoiceProducts: [],

      pageCountProduct: 0,
      pageRowCountProduct: 5,
      productStart: 0,
      productEnd: 5,
      invoiceProductLocal: [],
      supplierProducts: [],

      grossTotal: 0,
      vatTotal: 0,
      vipTotal: 0,

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
      return this.titleChange === -1 ? "Add New Invoice" : "Edit Invoice";
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

    formDataProductSupplierProductNumber() {
      return this.formDataProduct.supplierProductNumber;
    },
  },
  created() {
    this.getDataFromApi();
    this.getDataFromStatus();
    this.getPurchaseOrders();
    this.getSuppliers();
  },

  watch: {
    invoiceModel(val) {
      val || this.invoiceModalClose();
    },
    formDataProductSupplierProductNumber() {
      this.formDataProduct.description = "";
      this.formDataProduct.productDescription = "";
      this.getSupplierProductInfo();
    },
  },
  methods: {
    getSupplierProductInfo() {
      let item = this.formDataProduct.supplierProductNumber;

      if (item != "SELECT") {
        var result = this.supplierProducts.filter((obj) => {
          return obj.productNumber === item;
        });

        if (result.length > 0) {
          this.formDataProduct.description = result[0].skuDescription;
          this.formDataProduct.productDescription =
            result[0].productDescription;
        }
      } else {
        warningToast("Please Select Product");
      }

      // var result = this.supplierProducts.filter((obj) => {
      //   return obj.description === item;
      // });
      // console.log("item", result);
      // this.formDataAddSku.supplierProductNumber =
      //   result[0].supplierProductNumber;
      //    this.formDataAddSku.expirationDate = result[0].expirationDate;
      // this.formDataAddSku.expirationDate = moment(result[0].expirationDate).format("MMMM Do YYYY");

      // }
    },

    getStatusColor(value) {
      try {
        return this.statusItems.find((status) => status.number === value).color;
      } catch {
        return "Nil";
      }
    },

    getDataFromStatus() {
      axios
        .get("Enums/InvoiceStatuses")
        .then((response) => {
          this.statusItems = response.data;
        })
        .catch((error) => {
          warningToast("Status Not Found");
        });
    },
    getStatus(value) {
      try {
        return this.statusItems.find((status) => status.number === value).name;
      } catch {
        return "Nil";
      }
    },
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
            status: this.getStatus(el.status),
            location: el.location,
            shipVia: el.shipVia,
            salesRep: el.salesRep,
            currency: currencyFormat(el.currency),
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
      this.docs.save(`${"Supplier Invoices " + generateDate}.pdf`);
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
        var csvTitle = "Supplier Invoices " + generateDate;
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
            6: this.getStatus(item.status),
            7: item.location,
            8: item.shipVia,
            9: item.salesRep,
            10: currencyFormat(item.currency),
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
        .post("PurchaseInvoices/Paginated", pagination)
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

    setReport() {
      const columns = [
        { title: "SKU", dataKey: "supplierProductNumber" },
        { title: "DESC", dataKey: "productDescription" },
        { title: "PRICE", dataKey: "unitPrice" },
        { title: "GROSS", dataKey: "grossValue" },
      ];
      this.doc = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: "a4",
      });

      let data = [];
      let i = 0;
      let obj;

      this.invoiceProductLocal.forEach((el) => {
        obj = {
          supplierProductNumber: el.supplierProductNumber,
          productDescription: el.productDescription,
          unitPrice: el.unitPrice,
          grossValue: el.grossValue,
        };
        //i++;
        data.push(obj);
        //   console.log(obj);
      });
      //console.log("DATA", data);

      var orderNumber = this.formDataInvoice.orderNumber;
      var invoiceDate = this.momentLocal(this.formDataInvoice.invoiceDate);
      var invoiceNumber = this.formDataInvoice.invoiceNumber;

      if (!orderNumber) {
        orderNumber = "Nil";
      }
      if (!invoiceDate) {
        invoiceDate = "Nil";
      }
      if (!invoiceNumber) {
        invoiceNumber = "Nil";
      }

      var imgData = "/src/assets/images/pl_logo2.png";
      this.doc.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
      this.doc
        .setFontSize(16)
        .text("Invoice Number : " + invoiceNumber, 5, 1.2);

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
      // this.doc.setFontSize(14).text("To :", 5, 2.5);

      // this.doc.setFontSize(12).text(this.formDataOrder.customer.firstName +" "+this.formDataOrder.customer.lastName, 5.2, 2.7);
      // this.doc.setFontSize(12).text(this.formDataOrder.customer.company, 5.2, 2.9);
      // this.doc.setFontSize(12).text(this.formDataOrder.customer.mobile, 5.2, 3.1);
      // this.doc.setFontSize(12).text(this.formDataOrder.customer.email, 5.2, 3.3);
      this.doc.setFontSize(12).text("Order Number: " + orderNumber, 5.2, 3.7);
      this.doc.setFontSize(12).text("Invoice Date : " + invoiceDate, 5.2, 3.9);
      // this.doc.setFontSize(12).text("Booking No: "+ this.formDataOrder.despatchBookingNumber, 5.2, 3.9);

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
        `${this.formDataInvoice.invoiceNumber + "_" + generateDate}.pdf`
      );
    },

    changePageProduct(pageNum) {
      this.productEnd = this.pageRowCountProduct * pageNum;
      this.productStart = this.productEnd - this.pageRowCountProduct;
      this.invoiceProductLocal = this.invoiceProducts.slice(
        this.productStart,
        this.productEnd
      );
      console.log("this.invoiceProductLocal", this.invoiceProductLocal);
    },

    getSelectedColor() {
      return "background-color:rgb(22,78,99);color: white";
    },
    invoiceModalClose() {
      // this.isLoading = true;

      for (var i = 0; i < this.items.length; i++) {
        this.items[i].selected = false;
        // this.isLoading = false;

        this.invoiceModel = false;
      }
    },
    viewInvoiceInfo(item) {
      removeNullValue(item);
      this.formDataInvoice = Object.assign({}, item);
      this.invoiceInfoModal = true;
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
        .post("PurchaseInvoices/Paginated", this.pagination)
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
    showModal() {
      this.titleChange = -1;
      this.setDefault();
      this.activateModal();
    },

    activateModal() {
      this.addInvoice = true;
    },

    closeForm() {
      this.addInvoice = false;
    },
    editItem(item) {
      this.titleChange = 0;
      this.formDataInvoice = Object.assign({}, item);
      this.activateModal();
      this.formDataInvoice.invoiceDate = this.momentLocal(
        this.formDataInvoice.invoiceDate
      );
      this.formDataInvoice.receivedDate = this.momentLocal(
        this.formDataInvoice.receivedDate
      );
      this.addInvoice = true;
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

    saveForm() {
      if (
        this.formDataInvoice.invoiceNumber == "" ||
        this.formDataInvoice.orderNumber == "" ||
        this.formDataInvoice.supplierId == "" ||
        this.formDataInvoice.location == ""
      ) {
        if (this.formDataInvoice.invoiceNumber == "") {
          warningToast("Invoice Number Required");
        }
        if (this.formDataInvoice.orderNumber == "") {
          warningToast("Order Number Required");
        }
        if (this.formDataInvoice.supplierId == "") {
          warningToast("Supplier Required");
        }
        if (this.formDataInvoice.location == "") {
          warningToast("Location Required");
        }
      } else {
        if (this.titleChange === -1) {
          this.isLoading = true;
          this.connectTimetoDate();

          axios
            .post("PurchaseInvoices/", this.formDataInvoice)
            .then((response) => {
              if (response.data.success === true) {
                this.addInvoice = false;
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
          this.isLoading = true;
          this.connectTimetoDate();
          var itemId = this.formDataInvoice.invoiceId;

          axios
            .put("PurchaseInvoices/" + itemId, this.formDataInvoice)
            .then((response) => {
              if (response.data.success === true) {
                this.addInvoice = false;
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
      this.formDataInvoice = Object.assign({}, item);
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
      var itemId = this.formDataInvoice.invoiceId;
      this.isLoading = true;
      axios
        .get("PurchaseInvoices/" + itemId + "/Archive")
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
        .post("PurchaseInvoices/Archived", this.paginationArchive)
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
    restoreItem(item) {
      this.formDataInvoice = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.formDataInvoice.invoiceId;
      this.isLoading = true;
      axios
        .get("PurchaseInvoices/" + itemId + "/Restore")
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
      this.formDataInvoice = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      var itemId = this.formDataInvoice.invoiceId;
      this.isLoading = true;
      axios
        .delete("PurchaseInvoices/" + itemId)
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

    //product
    pageSizeChangeProduct() {
      this.pagination.pageSize = this.pageSize;
      // this.getDataFromApiProduct();
    },

    viewInvoice(item) {
      this.formDataInvoice = Object.assign({}, item);
      this.invoiceModel = true;
      this.getInvoiceProducts();
      console.log(item);
    },
    getInvoiceProducts() {
      this.isLoading = true;
      axios
        .get("PurchaseInvoices/" + this.formDataInvoice.invoiceId)
        .then((response) => {
          if (response.data.success === true) {
            if (response.data.data.products != null) {
              this.invoiceProducts = response.data.data.products;
              for (var i = 0; i < this.invoiceProducts.length; i++) {
                this.invoiceProducts[i].no = i + 1;

                this.grossTotal =
                  this.grossTotal +
                  parseInt(this.invoiceProducts[i].grossValue);
                this.vatTotal =
                  this.vatTotal + parseInt(this.invoiceProducts[i].vat);
                this.vipTotal =
                  this.vipTotal + parseInt(this.invoiceProducts[i].vipAmount);

                this.isLoading = false;
              }
              var pageCount =
                this.invoiceProducts.length / this.pageRowCountProduct;
              let pageCountRound = Math.round(pageCount);
              if (pageCount > pageCountRound) {
                pageCountRound += 1;
                this.pageCountProduct = pageCountRound;
              } else {
                this.pageCountProduct = pageCountRound;
              }
              //pageCountProduct
              this.invoiceProductLocal = this.invoiceProducts.slice(
                this.productStart,
                this.productEnd
              );
            } else {
              this.isLoading = false;
            }
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
    showModalProduct() {
      this.productChange = -1;
      this.activateModalProduct();
      this.setDefaultProduct();
    },
    activateModalProduct() {
      //this.getProducts();
      this.getWarehouses();
      this.getSupplierProducts();
      this.addProductModal = true;
    },
    setDefaultProduct() {
      this.formDataProduct = Object.assign({}, this.formDataProductDefault);
      this.formDataProduct.invoiceId = this.formDataInvoice.invoiceId;
    },
    saveFormProduct() {
      this.isLoading = true;

      this.formDataProduct.productionDate = moment(
        this.formDataProduct.productionDate
      ).format("YYYY-MM-DDTh:mm:ss");
      this.formDataProduct.expirationDate = moment(
        this.formDataProduct.expirationDate
      ).format("YYYY-MM-DDTh:mm:ss");
      axios
        .post("PurchaseInvoices/Product", this.formDataProduct)
        .then((response) => {
          if (response.data.success === true) {
            this.addProductModal = false;
            this.getInvoiceProducts();
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

    getWarehouses() {
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("Warehouses/Paginated", pagination)
        .then((response) => {
          this.warehouses = response.data.data.items;

          // if (this.warehouses.length > 0) {
          //   //console.log(this.warehouses[0].warehouseId)
          //   this.formDataProduct.warehouseId = this.warehouses[0].warehouseId;
          // } else
          if (this.warehouses.length == 0) {
            warningToast("Please Add Items in Warehouse");
            this.addInvoice = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    getProducts() {
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("Products/Paginated", pagination)
        .then((response) => {
          this.products = response.data.data.items;

          // if (this.products.length > 0) {
          //   this.formDataInvoice.productId = this.products[0].productId;
          // } else
          if (this.products.length == 0) {
            warningToast("Please Add Items in Product");
            this.addInvoice = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },

    //supplier
    getSuppliers() {
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("Suppliers/Paginated", pagination)
        .then((response) => {
          this.suppliers = response.data.data.items;

          // if (this.suppliers.length > 0) {
          //   this.formDataInvoice.supplierId = this.suppliers[0].supplierId;
          // } else
          if (this.suppliers.length == 0) {
            warningToast("Please Add Items in Supplier");
            this.addInvoice = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    getPurchaseOrders() {
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("PurchaseOrders/Paginated", pagination)
        .then((response) => {
          this.purchaseOrders = response.data.data.items;
          console.log("purchaseOrders", this.purchaseOrders);
          // if (this.purchaseOrders.length > 0) {
          //   this.formDataInvoice.orderNumber =
          //     this.purchaseOrders[0].orderNumber;
          // } else
          if (this.purchaseOrders.length == 0) {
            warningToast("Please Add Items in Purchase Order");
            this.addInvoice = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    closeFormProduct() {
      this.addProductModal = false;
    },

    getSupplierProducts() {
      this.isLoading = true;
      var supplierid = this.formDataInvoice.supplierId;
      var pagination = { pageNumber: 1, pageSize: 10000 };

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
