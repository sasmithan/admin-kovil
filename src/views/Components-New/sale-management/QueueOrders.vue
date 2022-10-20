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
            <tr class="uppercase whitespace-nowrap">
              <th>ORDER#</th>
              <th>Amount</th>
              <th>Order Created</th>
              <th>Customer</th>
              <th>WHOUSE</th>
              <th>Note</th>
              <th>Status</th>
              <th>Order Type</th>
              <th>Booking#</th>
              <th>PRIORITY</th>
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
                {{ item.orderNumber != null ? item.orderNumber : "Nil" }}
              </td>
              <td :style="item.selected ? getSelectedColor() : ''">
                {{ currencyFormat(item.amount) }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{ item.time != null ? momentLocal(item.time) : "Nil" }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{ item.customer != null ? item.customer.firstName : "Nil" }}
                {{ item.customer != null ? item.customer.lastName : "Nil" }}
              </td>
              <td :style="item.selected ? getSelectedColor() : ''">
                {{ item.warehouse != null ? item.warehouse : "Nil" }}
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

              <td :style="item.selected ? getSelectedColor() : ''">
                <div
                  class="
                    text-white
                    rounded-2xl
                    p-1
                    pl-2
                    pr-2
                    flex
                    items-center
                    justify-center
                  "
                  :style="{ 'background-color': getStatusColor(item.status) }"
                >
                  {{ item.status != null ? getStatus(item.status) : "Nil" }}
                </div>
              </td>
              <td :style="item.selected ? getSelectedColor() : ''">
                {{ item.type != null ? getType(item.type) : "Nil" }}
              </td>

              <td class="" :style="item.selected ? getSelectedColor() : ''">
                <div class="flex">
                  {{ item.despatchBookingNumber }}
                  <span
                    @Click="editDespatch(item)"
                    class="flex"
                    v-if="item.despatchBookingNumber != null"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Edit Despatch"
                    >
                      <EditIcon class="w-4 h-4 ml-2" /> </Tippy
                  ></span>
                </div>
                <a
                  v-if="item.despatchBookingNumber == null"
                  @Click="addDespatch(item)"
                  class="flex items-center mr-3 font-semibold"
                  href="javascript:;"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="Add Despatch"
                  >
                    <PlusSquareIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                  </Tippy>
                </a>
              </td>

              <td class="" :style="item.selected ? getSelectedColor() : ''">
                <div class="flex justify-center items-center space-x-2">
                  <div class="w-32">
                    <TomSelect
                      v-model="priority"
                      :options="{
                        placeholder: 'Search..',
                      }"
                      class="w-full"
                    >
                      <!-- <option>SELECT</option> -->
                      <option value="1">Low</option>
                      <option value="2">Medium</option>
                      <option value="3">High</option>
                    </TomSelect>
                  </div>
                  <!-- <span class="flex">
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Add Priority"
                    >
                      <CheckCircleIcon class="w-5 h-5 mr-1" /> </Tippy
                  ></span> -->
                </div>
              </td>

              <td class="table-report__action">
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
          <option :value="pageSize">{{ pageSize }}</option>
        </select>
      </div>

      <!-- END: Pagination -->
    </div>
  </div>

  <!-- BEGIN: Add Product Modal -->
  <MoveableModal
    :show="addProductModal"
    @hidden="addProductModal = false"
    backdrop="static"
    size="modal-sl-85"
    @close="addProductModal = false"
  >
    <ModalBody class="p-0">
      <div class="flex flex-col space-y-4 w-full pl-6 pr-6 pb-2">
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
              class="
                lg:text-3xl
                md:text-2xl
                text-lg
                font-medium
                leading-none
                mt-3
              "
            >
              Order Number #{{ formDataOrder.orderNumber }}
            </h2>
            <!-- <div class="flex flex-col space-y-1">
              <h6
                class="text-black font-medium leading-none mt-1 lg:text-2xl md:text-xl text-base"
              >
               
              </h6>
            </div> -->
            <div class="flex flex-col justify-center items-end">
              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                Time : {{ momentLocal(formDataOrder.time) }}
              </h6>

              <h6
                vif=""
                class="text-sm text-slate-500 font-medium leading-none mt-3"
              >
                {{
                  formDataOrder.customer != null
                    ? formDataOrder.customer.firstName
                    : "Nil"
                }}
                {{
                  formDataOrder.customer != null
                    ? formDataOrder.customer.lastName
                    : "Nil"
                }}
              </h6>

              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                Mobile :
                {{
                  formDataOrder.customer != null
                    ? formDataOrder.customer.mobile
                    : "Nil"
                }}
              </h6>
              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                Email :
                {{
                  formDataOrder.customer != null
                    ? formDataOrder.customer.email
                    : "Nil"
                }}
              </h6>
            </div>
            <div class="flex items-end mt-4">
              <div class="text-center sm:text-right sm:ml-auto">
                <div class="text-base text-slate-500 font-medium">
                  Total Amount
                </div>
                <div
                  v-if="formDataOrder.amount != null"
                  class="text-xl text-primary font-medium mt-2"
                >
                  {{ currencyFormat(formDataOrder.amount) }}
                </div>
                <div
                  v-if="formDataOrder.despatchBookingNumber != null"
                  class="text-base text-slate-500 font-medium"
                >
                  BN: {{ formDataOrder.despatchBookingNumber }}
                </div>
                <div
                  class="
                    text-white
                    rounded-2xl
                    font-medium
                    p-1
                    pl-2
                    pr-2
                    flex
                    items-end
                    justify-center
                    w-full
                    float-right
                  "
                  :style="customerOrderStatusColor(formDataOrder.status)"
                >
                  {{ customerOrderStatus(formDataOrder.status) }}
                </div>
              </div>
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
        Purchase Order - {{ formDataOrder.orderNumber }}
      </div> -->
      <hr />
      <div class="w-full sm:w-auto mt-3 sm:mt-0 p-3">
        <div class="flex justify-between items-center">
          <!-- <a
            v-if="!addProductModalForm"
            href="javascript:;"
            @click="showModalProduct()"
            class="btn btn-primary shadow-md mr-2"
          >
            Add New OrderLine
          </a> -->

          <div class="flex items-center" v-if="!addProductModalForm">
            <!-- <button
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
            </button> -->
          </div>
        </div>

        <div
          v-if="addProductModalForm"
          class="
            grid
            lg:grid-cols-3
            md:grid-cols-3
            grid-cols-1
            lg:gap-4
            md:gap-4
            gap-2
          "
        >
          <div class="col-span-2">
            <label for="regular-form-1" class="form-label font-semibold">
              PLU/SKU
            </label>

            <!-- <div class="flex flex-col w-full space-y-1">
              <TomSelect
                v-model="formDataOrdeLine.skuName"
                :options="{
                  placeholder: 'Search..',
                  allowEmptyOption: true,
                }"
                class="w-full lg:text-base md:text-base text-xs"
              >
                <optgroup label="Selected" v-if="titleChange != -1">
                  <option :value="formDataOrdeLine.skuName">
                    {{ formDataOrdeLine.skuName }}
                  </option>
                </optgroup>

                <optgroup label="Editable">
                  <option v-if="titleChange == -1" value="">SELECT</option>
                  <option
                    :value="item.skuName"
                    v-for="(item, i) in skus"
                    :key="i"
                  >
                    {{ item.description }} - ({{ item.skuName }})
                  </option>
                </optgroup>
              </TomSelect>
            </div> -->

            <div class="flex flex-col w-full space-y-1">
              <input
                id="vertical-form-1"
                readonly
                v-model="formDataOrdeLine.skuName"
                type="text"
                class="form-control"
                placeholder="PLU/SKU"
              />
            </div>
          </div>

          <div class="">
            <label for="regular-form-1" class="form-label font-semibold">
              Quantity
            </label>

            <div class="flex flex-col w-full space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataOrdeLine.quantity"
                type="number"
                class="form-control"
                name="quantity"
                placeholder="0"
              />
            </div>
          </div>

          <div class="">
            <label for="regular-form-1" class="form-label font-semibold">
              PickType
            </label>

            <div class="flex flex-col w-full space-y-1">
              <TomSelect
                v-model="formDataOrdeLine.blockType"
                :options="{
                  placeholder: 'Search..',
                  allowEmptyOption: true,
                }"
                class="w-full lg:text-base md:text-base text-xs"
              >
                <option value="">SELECT</option>

                <option
                  :value="item.name"
                  v-for="(item, i) in blockTypeItems"
                  :key="i"
                >
                  {{ item.name }}
                </option>
              </TomSelect>
            </div>
          </div>

          <div class="">
            <label for="regular-form-1" class="form-label font-semibold">
              Priority
            </label>

            <div class="flex flex-col w-full space-y-1">
              <TomSelect
                v-model="formDataOrdeLine.priority"
                :options="{
                  placeholder: 'Search..',
                  allowEmptyOption: true,
                }"
                class="w-full"
              >
                <option value="">SELECT</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
              </TomSelect>
            </div>
          </div>

          <div class="">
            <label for="regular-form-1" class="form-label font-semibold">
              User
            </label>

            <div class="flex flex-col w-full space-y-1">
              <TomSelect
                v-model="formDataOrdeLine.userId"
                :options="{
                  placeholder: 'Search..',
                  allowEmptyOption: true,
                }"
                class="w-full"
              >
                <option>SELECT</option>
                <option
                  :value="item.userName"
                  v-for="(item, i) in pickersItems"
                  :key="i"
                >
                  {{ item.userName }}
                </option>
              </TomSelect>
            </div>
          </div>

          <div
            class="
              flex
              justify-end
              items-end
              lg:col-span-3
              md:col-span-3
              col-span-0
            "
          >
            <button
              type="button"
              @click="closeFormProduct()"
              class="btn btn-outline-secondary w-24 mr-1"
            >
              {{ const_txt.CANCEL_BTN }}
            </button>
            <button
              @click="updateFormProduct()"
              type="submit"
              class="btn btn-primary mr-1"
            >
              Update OrderLine
            </button>
          </div>
        </div>
      </div>

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
                v-for="(header, i) in orderLinesHeaders"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr v-show="orderLinesLocal.length <= 0">
              <td colspan="6">
                <span
                  class="
                    flex
                    justify-center
                    items-center
                    text-success
                    font-bold
                  "
                  >{{ const_txt.NO_ORDER_LINE }}</span
                >
              </td>
            </tr>
            <tr v-for="(item, i) in orderLinesLocal" :key="i" class="intro-x">
              <td>
                {{ i + 1 }}
              </td>
              <td v-for="(header, index) in orderLinesHeaders" :key="index">
                {{ item[header.value] }}
              </td>
              <td>
                {{ item.priority != null ? getPriority(item.priority) : "Nil" }}
              </td>

              <td class="table-report__action w-20">
                <div class="flex justify-center items-center">
                  <a
                    @Click="editOrdeLinesLocal(item, i)"
                    class="flex items-center mr-3"
                    href="javascript:;"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Edit"
                    >
                      <EditIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                      />
                    </Tippy>
                  </a>
                  <!-- <a
                    @click="deleteOrdeLinesLocal(i)"
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
                  </a> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- BEGIN: Pagination -->

        <div
          v-if="this.orderLines.length > 0"
          class="
            intro-y
            rounded-lg
            lg:flex lg:flex-row lg:flex-wrap lg:items-center
            md:flex md:flex-row md:flex-wrap md:items-center
            flex flex-col
            items-center
            justify-center
            p-2
          "
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
        <div class="flex items-end mt-4">
          <div class="text-center sm:text-right sm:ml-auto">
            <div class="text-base text-slate-500 font-medium">Total Amount</div>
            <div
              v-if="formDataOrder.amount != null"
              class="text-xl text-primary font-medium mt-2"
            >
              {{ currencyFormat(formDataOrder.amount) }}
            </div>
            <!-- <div class="mt-1">Taxes included</div> -->
          </div>
        </div>
        <!-- <div class="flex items-end mt-4">
          <div class="text-center sm:text-right sm:ml-auto">
            <a
              ref=""
              href="javascript:;"
              @click="submitOrder()"
              class="btn btn-primary shadow-md"
            >
              Submit Order
            </a>
          </div>
        </div> -->
      </div>

      <!-- END: Archive Data List -->
    </ModalBody>
  </MoveableModal>
  <!-- END: Add Modal For Product-->

  <!-- BEGIN: View Order Info Modal -->

  <MoveableModal
    :show="viewInfoModal"
    @hidden="viewInfoModal = false"
    backdrop="static"
    size="modal-sl-60"
    title="INFO"
    @close="viewInfoModal = false"
  >
    <ModalBody class="p-0">
      <!-- BEGIN: INFO -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4 mt-6">
        <div class="p-5 text-center">
          <BoxIcon class="w-8 h-8 text-danger mx-auto mt-2" />

          <div class="text-xl font-bold mt-5">
            ORDER# {{ formDataOrder.orderNumber }}
          </div>
        </div>
        <div
          class="
            pt-4
            intro-y
            box
            grid
            lg:grid-cols-3
            md:grid-cols-3
            grid-cols-1
            lg:gap-4
            md:gap-4
            gap-2
          "
        >
          <div class="flex flex-col items-center mb-5">
            <div class="flex items-center font-bold">
              <div>AMOUNT</div>
            </div>
            <div>
              {{ currencyFormat(formDataOrder.amount) }}
            </div>
          </div>
          <div class="flex flex-col items-center mb-5">
            <div class="flex items-center font-bold">
              <div>ORDER CREATED</div>
            </div>
            <div>
              {{
                formDataOrder.time != null
                  ? momentLocal(formDataOrder.time)
                  : "Nil"
              }}
            </div>
          </div>

          <div class="flex flex-col items-center mb-5">
            <div class="flex items-center font-bold">
              <div>WAREHOUSE</div>
            </div>
            <div>
              {{
                formDataOrder.warehouse != null
                  ? formDataOrder.warehouse
                  : "Nil"
              }}
            </div>
          </div>

          <div class="flex flex-col items-center mb-5">
            <div class="flex items-center font-bold">
              <div>BOOKING#</div>
            </div>
            <div>
              {{
                formDataOrder.despatchBookingNumber != null
                  ? formDataOrder.despatchBookingNumber
                  : "Nil"
              }}
            </div>
          </div>

          <div class="flex flex-col items-center mb-5">
            <div class="flex items-center font-bold">
              <div>NOTE</div>
            </div>
            <div>
              {{ formDataOrder.note != null ? formDataOrder.note : "Nil" }}
            </div>
          </div>
          <div class="flex flex-col items-center mb-5">
            <div class="flex items-center font-bold">
              <div>STATUS</div>
            </div>
            <div>
              {{ customerOrderStatus(formDataOrder.status) }}
            </div>
          </div>

          <div class="flex flex-col items-center mb-5">
            <div class="flex items-center font-bold">
              <div>ORDER TYPE</div>
            </div>
            <div>
              {{
                formDataOrder.type != null ? getType(formDataOrder.type) : "Nil"
              }}
            </div>
          </div>
          <div class="flex flex-col items-center mb-5">
            <div class="flex items-center font-bold">
              <div>Discount Percentage</div>
            </div>
            <div>
              {{ percentageFormat(formDataOrder.discountPercentage) }}
            </div>
          </div>
          <div class="flex flex-col items-center mb-5">
            <div class="flex items-center font-bold">
              <div>Discount Total</div>
            </div>
            <div>
              {{ currencyFormat(formDataOrder.discountTotal) }}
            </div>
          </div>
          <div class="flex flex-col items-center mb-5">
            <div class="flex items-center font-bold">
              <div>CUSTOMER</div>
            </div>
            <div>
              {{
                formDataOrder.customer != null
                  ? formDataOrder.customer.firstName
                  : "Nil"
              }}
              {{
                formDataOrder.customer != null
                  ? formDataOrder.customer.lastName
                  : "Nil"
              }}
            </div>
          </div>
          <div class="flex flex-col items-center mb-5">
            <div class="flex items-center font-bold">
              <div>DELIVERY ADDRESS</div>
            </div>
            <div class="flex flex-col space-y-2 justify-center items-center">
              <div>
                {{
                  formDataOrder.deliveryAddress != null
                    ? formDataOrder.deliveryAddress.addressLine
                    : "Nil"
                }}
              </div>
              <div>
                {{
                  formDataOrder.deliveryAddress != null
                    ? formDataOrder.deliveryAddress.postcode
                    : "Nil"
                }}
              </div>
              <div>
                {{
                  formDataOrder.deliveryAddress != null
                    ? formDataOrder.deliveryAddress.state
                    : "Nil"
                }}
              </div>
              <div>
                {{
                  formDataOrder.deliveryAddress != null
                    ? formDataOrder.deliveryAddress.city
                    : "Nil"
                }}
              </div>
              <div>
                {{
                  formDataOrder.deliveryAddress != null
                    ? formDataOrder.deliveryAddress.country
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
  <!-- END: View Order Modal-->

  <!-- BEGIN: Add  Modal -->

  <Modal
    :show="addDespatchModal"
    @hidden="addDespatchModal = false"
    backdrop="static"
    size="modal-sl-30"
  >
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">{{ desTitle }}</h2>
    </ModalHeader>
    <ModalBody class="grid">
      <div>
        <label for="regular-form-1" class="form-label">Booking Number</label>

        <div class="flex flex-col space-y-1 w-full">
          <TomSelect
            v-model="formDataDespatch.bookingNumber"
            :options="{
              placeholder: 'Select..',
            }"
            class="w-full"
          >
            <option v-if="desTitleChange != -1">
              {{ formDataDespatch.despatchBookingNumber }}
            </option>
            <option v-if="desTitleChange == -1" value=""></option>

            <option
              :value="item.bookingNumber"
              v-for="(item, i) in bookingNumbs"
              :key="i"
            >
              {{ item.bookingNumber }}
            </option>
          </TomSelect>
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="addDespatchModal = false"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        {{ const_txt.CANCEL_BTN }}
      </button>
      <button
        @click="saveDespatch()"
        type="submit"
        class="btn btn-primary w-24"
      >
        {{ const_txt.SAVE_BTN }}
      </button>
    </ModalFooter>
  </Modal>
  <!-- END: Add Modal -->

  <MoveableModal
    :show="pickingCon"
    @hidden="pickingCon = false"
    backdrop="static"
    size="modal-sl-60"
    :title="'ORDER# : ' + on"
    @close="pickingCon = false"
  >
    <ModalBody class="flex flex-col justify-center items-center space-y-2">
      <div class="p-5 text-center">
        <ClipboardListIcon class="w-16 h-16 text-success mx-auto mt-3" />
        <div class="text-3xl mt-2">Do you confirm these Picking?</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="pickingCon = false"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          {{ const_txt.CANCEL_BTN }}
        </button>
        <button
          type="button"
          class="btn text-white bg-green-600 w-24"
          @click="submitPicking()"
        >
          Pick
        </button>
      </div>

      <div v-if="orderLinesLocal.length <= 0" class="text-center">
        <span class="text-lg text-center text-success">{{
          const_txt.DEFAULT_PICKING
        }}</span>
        <div class="intro-y col-span-12 overflow-auto p-4">
          <table class="table table-report -mt-2 table-auto">
            <thead>
              <tr class="uppercase whitespace-nowrap">
                <th>NO</th>
                <th
                  class="whitespace-nowrap"
                  v-for="(header, i) in orderLinesHeaders"
                  :key="i"
                >
                  {{ header.text }}
                </th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr v-show="defaultOrderLinesLocal.length == 0">
                <td colspan="6">
                  <span
                    class="
                      flex
                      justify-center
                      items-center
                      text-success
                      font-bold
                    "
                    >{{ const_txt.NO_ORDER_LINE }}</span
                  >
                </td>
              </tr>
              <tr
                v-for="(item, i) in defaultOrderLinesLocal"
                :key="i"
                class="intro-x"
              >
                <td>
                  {{ i + 1 }}
                </td>
                <td v-for="(header, index) in orderLinesHeaders" :key="index">
                  {{ item[header.value] }}
                </td>
                <td>
                  {{
                    item.priority != null ? getPriority(item.priority) : "Nil"
                  }}
                </td>
              </tr>
            </tbody>
          </table>
          <!-- BEGIN: Pagination -->

          <div
            v-if="defaultOrderLinesLocal.length > 4"
            class="
              intro-y
              rounded-lg
              lg:flex lg:flex-row lg:flex-wrap lg:items-center
              md:flex md:flex-row md:flex-wrap md:items-center
              flex flex-col
              items-center
              justify-center
              p-2
            "
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
      </div>

      <div v-if="orderLinesLocal.length > 0" class="text-center">
        <span class="text-lg text-success text-success">{{
          const_txt.CONFIRM_PICKING
        }}</span>
        <div class="intro-y col-span-12 overflow-auto p-4">
          <table class="table table-report -mt-2 table-auto">
            <thead>
              <tr class="uppercase whitespace-nowrap">
                <th>NO</th>
                <th
                  class="whitespace-nowrap"
                  v-for="(header, i) in orderLinesHeaders"
                  :key="i"
                >
                  {{ header.text }}
                </th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr v-show="orderLinesLocal.length == 0">
                <td colspan="6">
                  <span
                    class="
                      flex
                      justify-center
                      items-center
                      text-success
                      font-bold
                    "
                    >{{ const_txt.NO_ORDER_LINE }}</span
                  >
                </td>
              </tr>
              <tr v-for="(item, i) in orderLinesLocal" :key="i" class="intro-x">
                <td>
                  {{ i + 1 }}
                </td>
                <td v-for="(header, index) in orderLinesHeaders" :key="index">
                  {{ item[header.value] }}
                </td>
                <td>
                  {{
                    item.priority != null ? getPriority(item.priority) : "Nil"
                  }}
                </td>

                <!-- <td class="table-report__action w-20">
                  <div class="flex justify-center items-center">
                    <a
                      @click="deleteOrdeLinesLocal(i)"
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
                  </div>
                </td> -->
              </tr>
            </tbody>
          </table>
          <!-- BEGIN: Pagination -->

          <div
            v-if="orderLinesLocal.length > 4"
            class="
              intro-y
              rounded-lg
              lg:flex lg:flex-row lg:flex-wrap lg:items-center
              md:flex md:flex-row md:flex-wrap md:items-center
              flex flex-col
              items-center
              justify-center
              p-2
            "
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
    store.dispatch("menuTitle/setSubMenuTitle", "Queue Orders");
  },
  components: {
    Moveable,
    paginate: Paginate,
    Loading,
    autoTable,
  },
  data() {
    return {
      on: "",
      pri: "",
      pickingCon: false,
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

      viewInfoModal: false,

      deleteOrderLineModel: false,

      titleChange: -1,
      orderChange: -1,
      desTitleChange: -1,

      formDataOrder: {
        orderNumber: "",
        note: "",
        type: "",
        time: "",
        amount: "",
        discountPercentage: "",
        discountTotal: "",
        status: "",
        despatchBookingNumber: "",
        currency: "",
        warehouse: "",
        warehouseId: "",
        customer: [],
        deliveryAddress: [],
        despatch: "",
        orderLines: [],
      },
      formDataOrderDefault: {
        orderNumber: "",
        note: "",
        type: "",
        time: "",
        amount: "",
        discountPercentage: "",
        discountTotal: "",
        status: "",
        despatchBookingNumber: "",
        currency: "",
        warehouse: "",
        warehouseId: "",
        customer: [],
        deliveryAddress: [],
        despatch: "",
        orderLines: [],
      },

      headers: [
        { text: "Order Number", value: "orderNumber" },

        { text: "Status", value: "status" },

        { text: "Amount", value: "amount" },
        // { text: "Type", value: "type" },
        // { text: "Time", value: "time" },
        // { text: "Amount", value: "amount" },
        // { text: "Discount Percentage", value: "discountPercentage" },
        // { text: "Discount Total", value: "discountTotal" },
        // { text: "Status", value: "Status" },
      ],
      pagination: {
        pageNumber: 1,
        pageSize: 10,
        search: "",
        // sortColumnName: "status",
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

      skuList: [],

      //Product

      searchDataProduct: "",
      addProductModal: false,
      addProductModalForm: false,
      formDataOrdeLine: {
        skuName: "",
        quantity: "",
        blockType: "",
        priority: "",
        userId: "",
      },
      formDataOrdeLineDefault: {
        skuName: "",
        quantity: "",
        blockType: "",
        priority: "",
        userId: "",
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

      orderLinesHeaders: [
        { text: "PLU/SKU", value: "skuName" },
        { text: "Quantity", value: "quantity" },
        { text: "Block Type", value: "blockType" },
        // { text: "Priority", value: "priority" },
        { text: "User", value: "userId" },
      ],
      productItems: [],
      productItemsData: [],

      products: [],
      orderNumber: "",
      orderLines: [],
      customers: [],
      warehouses: [],
      countries: [],

      addDespatchModal: false,
      formDataDespatch: {
        orderNumber: "",
        bookingNumber: "",
      },
      bookingNumbs: [],

      pageCountProduct: 0,
      pageRowCountProduct: 5,
      productStart: 0,
      productEnd: 5,

      defaultOrderLinesLocal: [],
      orderLinesLocal: [],

      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,

      blockTypeItems: [],
      pickersItems: [],
      storeIndex: "",
      isAddData: false,
      typeItems: [],
      statusItems: [],
      priorityItems: [],
    };
  },
  computed: {
    formTitle() {
      return this.titleChange === -1
        ? "Add New Queue Order"
        : "Edit Queue Order";
    },
    desTitle() {
      return this.desTitleChange === -1 ? "Add Despatch " : "Edit Despatch ";
    },
  },
  watch: {
    addProductModal(val) {
      val || this.addProductModalClose();
    },
  },
  created() {
    this.getDataFromApi();
    this.getDataFromTypes();
    this.getDataFromStatus();
    this.getPickers();
  },
  methods: {
    submitPicking() {
      this.saveFormPicking();
      this.saveFormProduct();
      this.getDataFromApi();
    },
    saveFormPicking() {
      this.isLoading = true;
      var formDataOrderPicking = {
        orderNumber: this.on,
        priority: this.pri,
      };
      axios
        .post("OrderPickingQueue", formDataOrderPicking)
        .then((response) => {
          if (response.status === 200) {
            this.orderPickingItems = response.data.data.items;
            successToast(this.const_txt.ADDED_ORDER_PICKING);
          }
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(this.const_txt.FAILED_ORDER_PICKING);
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
    editOrdeLinesLocal(item, index) {
      this.storeIndex = index;
      this.titleChange = 0;
      this.formDataOrdeLine = Object.assign({}, item);
      removeNullValue(item);
      this.addProductModalForm = true;
      this.activateModalProduct();
    },

    deleteOrdeLinesLocal(index) {
      this.orderLinesLocal.splice(index, 1);
      // for (var i = 0; i < this.orderLinesLocal.length; i++) {
      //   this.orderLinesLocal[i].no = i + 1;
      // }
      // successToast(const_txt.REMOVED_ORDER_LINE);
    },

    getBlockType() {
      axios
        .get("BlockTypes")
        .then((response) => {
          this.blockTypeItems = response.data.data;
        })
        .catch((error) => {
          warningToast("No Block Type Available");
        });
    },
    getPickers() {
      axios
        .get("Pickers")
        .then((response) => {
          this.pickersItems = response.data.data;
        })
        .catch((error) => {
          warningToast("No User Available");
        });
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
      this.docs.save(`${"Queue Orders " + generateDate}.pdf`);
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
        var csvTitle = "Queue Orders " + generateDate;
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
        .post("OrderPickingQueue/NewOrders", pagination)
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

      this.formDataOrder.time = moment(today).format("DD MMMM, YYYY");
    },
    setReport() {
      const columns = [
        { title: "PLU/SKU", dataKey: "skuName" },
        { title: "QTY", dataKey: "quantity" },
        { title: "BLOCK TYPE", dataKey: "blockType" },
        { title: "PRIORITY", dataKey: "priority" },
        { title: "USER", dataKey: "user" },
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
          skuName: el.skuName,
          quantity: el.quantity,
          retailPrice: el.retailPrice,
          blockType: el.blockType,
          priority: this.getPriority(el.priority),
          user: el.user,
        };

        data.push(obj);
      });

      var imgData = "/src/assets/images/pl_logo2.png";
      this.doc.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
      this.doc
        .setFontSize(16)
        .text("Order Number : " + this.formDataOrder.orderNumber, 5, 1.2);

      this.doc.setLineWidth(0.01).line(0.5, 2.2, 8.0, 2.2);

      this.doc.setFontSize(14).text("Deliver To :", 0.5, 2.5);

      this.doc.setFontSize(12).text("PHARMATEC PTE LTD", 0.7, 2.7);
      this.doc.setFontSize(12).text("62 Bank St,", 0.7, 2.9);
      this.doc.setFontSize(12).text("P.O.Box 450,Ba,", 0.7, 3.1);
      this.doc.setFontSize(12).text("Fiji Islands", 0.7, 3.3);
      this.doc.setFontSize(12).text("Ph: 6674933", 0.7, 3.5);
      this.doc.setFontSize(12).text("Fax: 6670118", 0.7, 3.7);
      this.doc.setFontSize(12).text("Email: admin@pharmatec.com.fj", 0.7, 3.9);

      // var fname = this.formDataOrder.customer.firstName;
      // var mobile = this.formDataOrder.customer.mobile;

      // var lname = this.formDataOrder.customer.lastName;
      // var company = this.formDataOrder.customer.company;
      // var email = this.formDataOrder.customer.email;
      var time = this.momentLocal(this.formDataOrder.time);
      var amount = this.currencyFormat(this.formDataOrder.amount);
      var despatchBookingNumber = this.formDataOrder.despatchBookingNumber;

      // if (!fname) {
      //   fname = "Nil";
      // }
      // if (!lname) {
      //   lname = "Nil";
      // }
      // if (!company) {
      //   company = "Nil";
      // }
      // if (!mobile) {
      //   mobile = "Nil";
      // }
      // if (!email) {
      //   email = "Nil";
      // }
      if (!time) {
        time = "Nil";
      }
      if (!amount) {
        amount = "Nil";
      }
      if (!despatchBookingNumber) {
        despatchBookingNumber = "Nil";
      }

      //trading partner
      this.doc.setFontSize(14).text("Trading Partner :", 5, 2.5);

      // this.doc.setFontSize(12).text(fname + " " + lname, 5.2, 2.7);
      // this.doc.setFontSize(12).text(company, 5.2, 2.9);
      // this.doc.setFontSize(12).text(mobile, 5.2, 3.1);

      // this.doc.setFontSize(12).text(email, 5.2, 3.3);

      this.doc.setFontSize(12).text("Date: " + time, 5.2, 3.5);

      this.doc.setFontSize(12).text("Total : " + amount, 5.2, 3.7);

      this.doc
        .setFontSize(12)
        .text("Booking No: " + despatchBookingNumber, 5.2, 3.9);

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
      this.doc.save(`${generateDate}.pdf`);
    },

    addProductModalClose() {
      this.isLoading = true;

      for (var i = 0; i < this.items.length; i++) {
        this.items[i].selected = false;
        this.isLoading = false;

        this.addProductModal = false;
      }
    },
    chooseFiles() {
      this.$refs.fileInput.click();
      console.log("file upload");
    },
    onFilePicked() {
      this.uploadedfile = document.getElementById("fileInput").files[0];
      this.fileName = this.uploadedfile.name;
      let formData = new FormData();

      formData.append("file", this.uploadedfile);

      this.isLoading = true;
      axios
        .post("CustomerOrders/Upload/Excel", formData)
        .then((response) => {
          if (response.data.success === true) {
            this.getDataFromApi();
            successToast(response.data.message);
          } else {
            this.isLoading = false;

            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
          this.isLoading = false;
        });
    },
    currencyFormat(val) {
      return val ? "$" + parseFloat(val).toFixed(2) : "$0.00";
    },
    momentLocal(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY");
    },
    momentLocalWithTime(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY, hh:mm a");
    },
    viewItemInfo(item) {
      removeNullValue(item);
      this.formDataOrder = Object.assign({}, item);
      this.viewInfoModal = true;
    },
    getProducts() {
      this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("Products/Paginated", pagination)
        .then((response) => {
          this.products = response.data.data.items;

          // if (this.products.length > 0) {
          //   this.formDataOrder.productId = this.products[0].productId;
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
    getWarehouses() {
      this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("Warehouses/Paginated", pagination)
        .then((response) => {
          this.warehouses = response.data.data.items;

          // if (this.products.length > 0) {
          //   this.formDataOrder.productId = this.products[0].productId;
          // } else
          if (this.warehouses.length == 0) {
            this.addSection = false;

            warningToast("Please Add Items in Warehouse");
          }
          this.isLoading = false;
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
      this.formDataOrder = Object.assign({}, this.formDataOrderDefault);
      this.getToday();
    },
    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("OrderPickingQueue/NewOrders", this.pagination)
        .then((response) => {
          console.log(response);
          this.itemsData = response.data.data;
          this.items = response.data.data.items;
          this.supplierItems = response.data.data.items.supplier;

          this.pageCount = this.itemsData.totalPages;
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
    // getDataFromApiProduct() {
    //   axios
    //     .post("CustomerOrders/Paginated", this.pagination)
    //     .then((response) => {
    //       this.productItemsData = response.data.data;
    //       var customerOrderId = this.formDataOrdeLine.customerOrderId;
    //       this.productItems = response.data.data.items.filter(
    //         (a) => a.customerOrderId === customerOrderId
    //       );
    //       console.log("productItems", this.productItems);
    //       this.pageCountProduct = this.itemsData.totalPages;
    //     });
    // },
    showModal() {
      this.setDefault();
      this.titleChange = -1;
      this.activateModal();
    },
    activateModal() {
      // this.getProducts();
      this.getCustomers();
      this.getWarehouses();
      this.getCountries();
      this.addCustomerOrder = true;
    },
    getCountries() {
      this.countries = countriesJSON;
    },
    getCustomers() {
      this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("Customers/Paginated", pagination)
        .then((response) => {
          this.customers = response.data.data.items;

          if (this.customers.length == 0) {
            warningToast("Please Add Customers First");
            this.addSection = false;
          }
          //
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    closeForm() {
      this.addCustomerOrder = false;
    },
    editItem(item) {
      this.titleChange = 0;
      this.formDataOrder = Object.assign({}, item);
      this.activateModal();
    },

    saveForm() {
      if (this.formDataOrder.orderNumber == "") {
        if (this.formDataOrder.orderNumber == "") {
          warningToast("Order Number Required");
        }
      } else {
        this.isLoading = true;
        this.connectTimetoDate();
        // console.log("Time", this.formDataOrder.time)
        if (this.titleChange === -1) {
          axios.post("CustomerOrders", this.formDataOrder).then((response) => {
            console.log("response", response);
            if (response.data.success === true) {
              this.addCustomerOrder = false;

              this.getDataFromApi();
            } else {
              warningToast(response.data.message);
            }
          });
        } else {
          var itemId = this.formDataOrder.customerOrderId;

          axios
            .put("CustomerOrders/" + itemId, this.formDataOrder)
            .then((response) => {
              this.itemsData = response.data.data;
              this.items = response.data.data.items;
              this.addCustomerOrder = false;
              this.getDataFromApi();
            });
        }
      }
    },
    connectTimetoDate() {
      var currentTime = moment(new Date()).format();
      var splitTime = currentTime.split("T");

      var time = moment(this.formDataOrder.time).format("YYYY-MM-DD");
      time = time.concat("T").concat(splitTime[1]);
      this.formDataOrder.time = time;

      var deliveryDate = moment(this.formDataOrder.deliveryDate).format(
        "YYYY-MM-DD"
      );
      deliveryDate = deliveryDate.concat("T").concat(splitTime[1]);
      this.formDataOrder.deliveryDate = deliveryDate;
    },
    archiveItem(item) {
      this.formDataOrder = Object.assign({}, item);
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
      var itemId = this.formDataOrder.orderId;

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
      this.formDataOrder = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataOrder.orderId;

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
      this.formDataOrder = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataOrder.customerOrderId;
      axios.delete("CustomerOrders/" + itemId).then((response) => {
        this.deleteConfirmationModal = false;
        this.viewArchives();
      });
    },

    //Product
    pageSizeChangeProduct() {
      // this.pagination.pageSize = this.pageSize;
      // this.getDataFromApiProduct();
    },
    changePageProduct(pageNum) {
      // this.pagination.pageNumber = pageNum;
      console.log(pageNum);

      this.productEnd = this.pageRowCountProduct * pageNum;

      this.productStart = this.productEnd - this.pageRowCountProduct;

      this.orderLinesLocal = this.orderLines.slice(
        this.productStart,
        this.productEnd
      );
      console.log(this.orderLinesLocal);
      // this.getDataFromApiProduct();
    },
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
      this.formDataOrdeLine = Object.assign({}, this.formDataOrdeLineDefault);
      // this.formDataOrdeLine.orderNumber = this.formDataOrder.orderNumber;
    },

    showModalProduct() {
      this.setDefaultProduct();
      this.activateModalProduct();
      this.orderChange = 0;
    },
    activateModalProduct() {
      this.getSkus();
      this.getBlockType();
      //  this.addProductModalForm = true;
    },

    closeFormProduct() {
      this.addProductModalForm = false;
    },
    defaultOrderLinesFromApi() {
      var orderNumber = this.formDataOrder.orderNumber;
      var skus;
      var arrayData = [];
      axios.get("CustomerOrders/" + orderNumber).then((response) => {
        skus = response.data.data.orderLines;

        for (var i = 0; i < skus.length; i++) {
          var formData = {
            skuName: skus[i].skuName,
            quantity: skus[i].quantity,
            blockType: "",
            priority: 1,
            userId: "",
          };

          arrayData.push(formData);
        }

        this.orderLinesLocal = arrayData;
        console.log(this.orderLinesLocal);
        // for (var i = 0; i < this.orderLinesLocal.length; i++) {
        //   this.orderLinesLocal[i].no = i + 1;
        // }
      });
    },

    saveFormProduct() {
      this.isLoading = true;
      var orderLineArray;
      if (this.orderLinesLocal.length <= 0) {
        orderLineArray = this.defaultOrderLinesLocal;
      } else {
        orderLineArray = this.orderLinesLocal;
      }

      axios
        .post("Picking/" + this.on + "/AddOrderLines", orderLineArray)
        .then((response) => {
          if (response.status === 200) {
            successToast(const_txt.ADDED_ORDER_LINE);
            this.isLoading = false;
          } else {
            failedToast(const_txt.FAILED_ORDER_LINE);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },

    updateFormProduct() {
      if (
        this.formDataOrdeLine.blockType == "" ||
        this.formDataOrdeLine.quantity == ""
      ) {
        if (this.formDataOrdeLine.blockType == "") {
          warningToast("Pick Type Required");
        }
        if (this.formDataOrdeLine.quantity == "") {
          warningToast("Quantity Required");
        }
      } else {
        if (this.formDataOrdeLine != null) {
          this.isLoading = true;
          this.orderLinesLocal.push(this.formDataOrdeLine);
          successToast(const_txt.ADDED_ORDER_LINE);
          this.deleteOrdeLinesLocal(this.storeIndex);
          this.addProductModalForm = false;
          this.isAddData = true;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          warningToast(statusMessage(const_txt.FAILED_ORDER_LINE));
        }
      }
    },

    pickingConfirm(orderNumber, priority) {
      if (priority == undefined) {
        this.pri = 1;
      } else {
        this.pri = priority;
      }

      this.on = orderNumber;

      this.pickingCon = true;
      var skus;
      var arrayData = [];
      axios.get("CustomerOrders/" + orderNumber).then((response) => {
        skus = response.data.data.orderLines;

        for (var i = 0; i < skus.length; i++) {
          var formData = {
            skuName: skus[i].skuName,
            quantity: skus[i].quantity,
            blockType: "Stock Removal Block",
            priority: 1,
            userId: "null",
          };
          if (this.orderLinesLocal.length <= 0) {
            arrayData.push(formData);
          }
        }

        this.defaultOrderLinesLocal = arrayData;
        // for (var i = 0; i < this.defaultOrderLinesLocal.length; i++) {
        //   this.defaultOrderLinesLocal[i].no = i + 1;
        // }
      });
    },

    //create dispatch
    addDespatch(item) {
      this.desTitleChange = -1;
      this.formDataDespatch.orderNumber = item.orderNumber;
      this.formDataDespatch.bookingNumber = "";
      this.getBookingNum();
    },

    editDespatch(item) {
      this.desTitleChange = 0;
      this.formDataDespatch.orderNumber = item.orderNumber;
      this.formDataDespatch.bookingNumber = item.despatchBookingNumber;
      this.getBookingNum();
    },

    getBookingNum() {
      this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("Despatches/Paginated", pagination)
        .then((response) => {
          console.log(response);
          this.bookingNumbs = response.data.data.items;

          if (this.bookingNumbs.length == 0) {
            warningToast("Please Add Despatches");
            this.addDespatchModal = false;
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.addDespatchModal = true;
          }
        })
        .catch((error) => {
          this.isLoading = false;

          warningToast(statusMessage(error.response.status));
        });
    },

    saveDespatch() {
      // console.log(this.formDataDespatch);
      // this.isLoading = true;
      // axios
      //   .post("Despatches/Orders/Add", this.formDataDespatch)
      //   .then((response) => {
      //     console.log(response);
      //     successToast(response.data.message);
      //     this.addDespatchModal = false;
      //     this.getDataFromApi();
      //   });
    },
    //create orderLine
    addItem(item) {
      this.formDataOrdeLine.customerOrderId = item.customerOrderId;
      this.formDataOrder = Object.assign({}, item);
      if (this.isAddData == false) {
        this.defaultOrderLinesFromApi();
      }

      this.addProductModal = true;
      this.orderNumber = item.orderNumber;
      // this.getOrderLines();
      this.setDefaultProduct();
    },
    getOrderLines() {
      // this.isLoading = true;
      // axios
      //   .get("CustomerOrders/" + this.orderNumber)
      //   .then((response) => {
      //     this.orderLines = response.data.data.orderLines;
      //     for (var i = 0; i < this.orderLines.length; i++) {
      //       this.orderLines[i].no = i + 1;
      //       this.isLoading = false;
      //     }
      //     var pageCount = this.orderLines.length / this.pageRowCountProduct;
      //     let pageCountRound = Math.round(pageCount);
      //     if (pageCount > pageCountRound) {
      //       pageCountRound += 1;
      //       this.pageCountProduct = pageCountRound;
      //     } else {
      //       this.pageCountProduct = pageCountRound;
      //     }
      //     //pageCountProduct
      //     this.orderLinesLocal = this.orderLines.slice(
      //       this.productStart,
      //       this.productEnd
      //     );
      //     this.isLoading = false;
      //   })
      //   .catch((error) => {
      //     warningToast(statusMessage(error.response.status));
      //     this.isLoading = false;
      //   });
    },
    //delete orderline
    deleteOrdeLine(item) {
      this.formDataOrdeLine = Object.assign({}, item);
      this.deleteOrderLineModel = true;

      // this.getOrderLines();
    },
    deleteOrderLineConfirm() {
      this.isLoading = true;
      console.log(this.formDataOrdeLine);
      var itemId = this.formDataOrdeLine.orderLineId;

      axios.delete("CustomerOrders/OrderLine/" + itemId).then((response) => {
        console.log("response", response);

        this.deleteOrderLineModel = false;
        successToast(response.data.message);
        this.getOrderLines();
      });
    },

    //SKU
    getSkus() {
      this.isLoading = true;
      var orderNumber = this.formDataOrder.orderNumber;
      axios
        .get("CustomerOrders/" + orderNumber)
        .then((response) => {
          this.skus = response.data.data.orderLines;
          this.addProductModalForm = true;

          if (this.skus.length == 0) {
            warningToast("Please Add Items in SKU");
            this.addProductModal = false;
          }
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          this.isLoading = false;
        });
    },

    getSelectedColor() {
      return "background-color:rgb(22,78,99);color: white";
    },
  },
};
</script>
