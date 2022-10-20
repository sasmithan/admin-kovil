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
          <a
            href="javascript:;"
            @click="showModal()"
            class="btn btn-primary shadow-md lg:w-auto w-1/2 text-xs lg:text-sm"
          >
            Add New Order
          </a>
          <a
            href="javascript:;"
            @click="chooseFiles()"
            class="btn btn-primary shadow-md lg:w-auto w-1/2 text-xs lg:text-sm"
          >
            <UploadIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" />
            Upload File
          </a>
          <!-- <input ref="file" type="file" hidden>   -->

          <input
            id="fileInput"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            type="file"
            ref="fileInput"
            @change="onFilePicked"
            hidden
          />

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
              <!-- <th
                class="whitespace-nowrap"
                v-for="(header, i) in headers"
                :key="i"
              >
                {{ header.text }}
              </th> -->
              <!-- <th>S</th> -->

              <th>Order Number</th>
              <th>Currency</th>
              <th>Amount</th>
              <th>Order Created</th>
              <th>Company</th>
              <th>Customer</th>
              <th>Note</th>
              <th>Status</th>
              <th>Booking No</th>
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
                {{ item.currency }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{ currencyFormat(item.amount) }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{ item.time != null ? momentLocal(item.time) : "Nil" }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{
                  item.customer.company != null ? item.customer.company : "Nil"
                }}
              </td>

              <td :style="item.selected ? getSelectedColor() : ''">
                {{
                  item.customer.firstName != null
                    ? item.customer.firstName
                    : "Nil"
                }}
                {{
                  item.customer.lastName != null
                    ? item.customer.lastName
                    : "Nil"
                }}
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
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                  :style="{ 'background-color': getStatusColor(item.status) }"
                >
                  {{ item.status != null ? getStatus(item.status) : "Nil" }}
                </div>
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

  <!-- BEGIN: Add Product Modal -->

  <MoveableModal
    :show="addCustomerOrder"
    @hidden="addCustomerOrder = false"
    backdrop="static"
    size="modal-xl"
    :title="formTitle"
    @close="addCustomerOrder = false"
  >
    <ModalBody
      class="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 lg:gap-4 md:gap-4 gap-2"
    >
      <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label">Order Number</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataOrder.orderNumber"
            type="text"
            class="form-control"
            name="orderNumber"
            placeholder="Order Number"
          />
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label"
          >Order Created Date/Time</label
        >

        <PreviewComponent class="intro-y">
          <div class="">
            <Litepicker
              v-model="formDataOrder.time"
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
          </div>
        </PreviewComponent>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label">Delivery Date</label>
        <PreviewComponent class="intro-y">
          <div class="">
            <Preview>
              <Litepicker
                v-model="formDataOrder.deliveryDate"
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

      <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label">Customer</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataOrder.customerId"
            :options="{
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full mr-32"
          >
            <option v-if="titleChange != -1">
              {{ formDataOrder.firstName }} {{ formDataOrder.lastName }}
            </option>
            <option v-if="titleChange == -1">SELECT</option>
            <option
              :value="item.customerId"
              v-for="(item, i) in customers"
              :key="i"
            >
              {{ item.firstName }} {{ item.lastName }}
            </option>
          </TomSelect>
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label">Warehouse</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataOrder.warehouseId"
            :options="{
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full mr-32"
          >
            <option v-if="titleChange != -1">
              {{ formDataOrder.warehouseId }}
            </option>
            <option v-if="titleChange == -1">SELECT</option>
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

      <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label">Order Type</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataOrder.type"
            :options="{
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full"
          >
            <option v-if="titleChange != -1">
              {{ formDataOrder.type }}
            </option>
            <option v-if="titleChange == -1">SELECT</option>
            <option
              :value="item.number"
              v-for="(item, i) in typeItems"
              :key="i"
            >
              {{ item.name }}
            </option>
          </TomSelect>
          <!-- 
          <input
            id="vertical-form-1"
            v-model="formDataOrder.type"
            type="number"
            class="form-control"
            name="type"
            placeholder="Type"
          /> -->
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label">Status</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataOrder.status"
            :options="{
              placeholder: 'Search..',
              allowEmptyOption: true,
            }"
            class="w-full"
          >
            <option v-if="titleChange != -1" :value="formDataOrder.status">
              <div v-for="(item, i) in statusItems" :key="i">
                {{ item.name }}
              </div>
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
      <!-- <Selection
       :labelname="Status"
    :vmodel="formDataOrder.status"
    :title="titleChange"
    :id="number"
    :list="statusItems"
    :name="name"

      /> -->

      <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label"
          >Discount Percentage</label
        >

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataOrder.discountPercentage"
            type="number"
            class="form-control"
            name="discountPercentage"
            placeholder="Discount Percentage"
          />
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label">Discount Total</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataOrder.discountTotal"
            type="number"
            class="form-control"
            name="discountTotal"
            placeholder="Discount Total"
          />
        </div>
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Currency</label>
        <TomSelect
          v-model="formDataOrder.currency"
          :options="{
            placeholder: 'Search...',
            allowEmptyOption: true,
          }"
          class="w-full"
        >
          <option v-if="titleChange != -1">
            {{ formDataOrder.country || "Nil" }}
          </option>
          <option v-if="titleChange == -1" value="FJD">FJD</option>
          <option
            :value="countries.currencyCode"
            v-for="(countries, i) in countryList"
            :key="i"
          >
            {{ countries.currencyCode }}
          </option>
        </TomSelect>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <label for="regular-form-1" class="form-label">Amount</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataOrder.amount"
            type="number"
            class="form-control"
            name="amount"
            placeholder="Amount"
          />
        </div>
      </div>

      <div
        class="flex flex-col w-full space-y-1 lg:col-span-3 md:col-span-3 col-span-0"
      >
        <label for="regular-form-1" class="form-label">Note</label>

        <div class="flex flex-col space-y-1">
          <textarea
            id="vertical-form-1"
            v-model="formDataOrder.note"
            type="text"
            class="form-control lg:h-auto mg:h-auto h-10"
            name="note"
            placeholder="Type here..."
          ></textarea>
        </div>
      </div>

      <div class="relative col-span-3 pt-2">
        <h3 class="absolute -top-2.5 left-4 pt-2 bg-white">Delivery Address</h3>
        <div
          class="border rounded-md border-slate-200 border-solid p-4 h-full grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 lg:gap-4 md:gap-4 gap-2"
        >
          <div
            class="flex flex-col w-full space-y-1 col-span-3"
            v-if="formDataOrder.deliveryAddress != null"
          >
            <label for="regular-form-1" class="form-label">Address</label>

            <div class="flex flex-col space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataOrder.deliveryAddress.addressLine"
                type="text"
                class="form-control"
                placeholder="Address"
              />
            </div>
          </div>

          <div
            class="flex flex-col w-full space-y-1"
            v-if="formDataOrder.deliveryAddress != null"
          >
            <label for="regular-form-1" class="form-label">Postcode</label>

            <div class="flex flex-col space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataOrder.deliveryAddress.postcode"
                type="text"
                class="form-control"
                placeholder="Postcode"
              />
            </div>
          </div>

          <div
            class="flex flex-col w-full space-y-1"
            v-if="formDataOrder.deliveryAddress != null"
          >
            <label for="regular-form-1" class="form-label">State</label>

            <div class="flex flex-col space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataOrder.deliveryAddress.state"
                type="text"
                class="form-control"
                placeholder="State"
              />
            </div>
          </div>

          <div
            class="flex flex-col w-full space-y-1"
            v-if="formDataOrder.deliveryAddress != null"
          >
            <label for="regular-form-1" class="form-label">City</label>

            <div class="flex flex-col space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataOrder.deliveryAddress.city"
                type="text"
                class="form-control"
                placeholder="City"
              />
            </div>
          </div>

          <div
            class="flex flex-col w-full space-y-1 col-span-2"
            v-if="formDataOrder.deliveryAddress != null"
          >
            <label for="regular-form-1" class="form-label">Country</label>

            <div class="flex flex-col space-y-1">
              <!-- <input
            id="vertical-form-1"
            v-model="formDataOrder.deliveryAddress.country"
            type="text"
            class="form-control"
            placeholder="Country"
          /> -->

              <TomSelect
                v-model="formDataOrder.deliveryAddress.country"
                :options="{
                  placeholder: 'Search..',
                  allowEmptyOption: true,
                }"
                class="w-full mr-32"
              >
                <option v-if="titleChange != -1">
                  {{ formDataOrder.deliveryAddress.country }}
                </option>
                <option v-if="titleChange == -1" value="fiji">Fiji</option>
                <option
                  :value="countries.countryName"
                  v-for="(countries, i) in countryList"
                  :key="i"
                >
                  {{ countries.countryName }}
                </option>
              </TomSelect>
            </div>
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
  <!-- END: Add Product Modal -->

  <!-- BEGIN: Add  Modal For Product-->

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
              class="lg:text-3xl md:text-2xl text-lg font-medium leading-none mt-3"
            >
              Order Number #{{
                formDataOrder.orderNumber != null ||
                formDataOrder.orderNumber != undefined
                  ? formDataOrder.orderNumber
                  : "Nil"
              }}
            </h2>
            <!-- <div class="flex flex-col space-y-1">
              <h6
                class="text-black font-medium leading-none mt-1 lg:text-2xl md:text-xl text-base"
              >
               
              </h6>
            </div> -->
            <div class="flex flex-col justify-center items-end">
              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                Time :
                {{
                  formDataOrder.time != null || formDataOrder.time != undefined
                    ? momentLocal(formDataOrder.time)
                    : "Nil"
                }}
              </h6>

              <h6
                vif=""
                class="text-sm text-slate-500 font-medium leading-none mt-3"
              >
                {{
                  formDataOrder.customer.firstName != null ||
                  formDataOrder.customer.firstName != undefined
                    ? formDataOrder.customer.firstName
                    : "Nil"
                }}
                {{
                  formDataOrder.customer.lastName != null ||
                  formDataOrder.customer.lastName != undefined
                    ? formDataOrder.customer.lastName
                    : "Nil"
                }}
              </h6>
              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                {{
                  formDataOrder.customer.company != null ||
                  formDataOrder.customer.company != undefined
                    ? formDataOrder.customer.company
                    : "Nil"
                }}
              </h6>

              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                Mobile :
                {{
                  formDataOrder.customer.mobile != null ||
                  formDataOrder.customer.mobile != undefined
                    ? formDataOrder.customer.mobile
                    : "Nil"
                }}
              </h6>
              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                Email :
                {{
                  formDataOrder.customer.email != null ||
                  formDataOrder.customer.email != undefined
                    ? formDataOrder.customer.email
                    : "Nil"
                }}
              </h6>

              <div class="flex flex-col justify-center items-end space-y-2">
                <h6
                  class="text-sm text-slate-500 font-medium leading-none mt-3"
                >
                  Delivery Address :
                </h6>

                <h6
                  class="text-sm text-slate-500 font-medium leading-none mt-3"
                >
                  {{ line != null || line != undefined ? line : "Nil" }},
                </h6>

                <h6
                  class="text-sm text-slate-500 font-medium leading-none mt-3"
                >
                  {{ state != null || state != undefined ? state : "Nil" }},
                </h6>

                <h6
                  class="text-sm text-slate-500 font-medium leading-none mt-3"
                >
                  {{ city != null || city != undefined ? city : "Nil" }},
                </h6>

                <h6
                  class="text-sm text-slate-500 font-medium leading-none mt-3"
                >
                  {{
                    country != null || country != undefined ? country : "Nil"
                  }}
                </h6>
              </div>

              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                Date : {{ date != null || date != undefined ? date : "Nil" }}
              </h6>

              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                Time : {{ time != null || time != undefined ? time : "Nil" }}
              </h6>

              <h6 class="text-sm text-slate-500 font-medium leading-none mt-3">
                Booking# :
                {{
                  bookingNom != null || bookingNom != undefined
                    ? bookingNom
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
                  class="text-white rounded-2xl font-medium p-1 pl-2 pr-2 flex items-end justify-center w-full float-right"
                  :style="{
                    'background-color': getStatusColor(formDataOrder.status),
                  }"
                >
                  {{ getStatus(formDataOrder.status) }}
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
          <a
            v-if="!addProductModalForm && formDataOrder.status == 1"
            href="javascript:;"
            @click="showModalProduct()"
            class="btn btn-primary shadow-md mr-2"
          >
            Add New Product
          </a>

          <div class="flex items-center" v-if="!addProductModalForm">
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

        <div
          v-if="addProductModalForm"
          class="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 lg:gap-4 md:gap-4 gap-2"
        >
          <!-- <div class="">
                  <label for="regular-form-1" class="form-label font-semibold">
                    Order Number
                  </label>

                  <div class="flex flex-col w-full space-y-1">
                    <input
                      id="vertical-form-1"
                      v-model="formDataOrdeLine.orderNumber"
                      type="text"
                      class="form-control"
                      name="orderNumber"
                      placeholder="Order Number"
                    />
                  </div>
                </div> -->
          <div class="">
            <label for="regular-form-1" class="form-label font-semibold">
              PLU/SKU
            </label>

            <div class="flex flex-col w-full space-y-1">
              <TomSelect
                v-model="formDataOrdeLine.skuId"
                :options="{
                  placeholder: 'Search..',
                }"
                class="w-full lg:text-base md:text-base text-xs"
              >
                <option v-if="orderChange != -1">
                  {{ formDataOrdeLine.skuName }}
                </option>
                <option v-if="orderChange == -1" value=""></option>

                <option :value="item.skuId" v-for="(item, i) in skus" :key="i">
                  {{ item.skuName }}
                </option>
              </TomSelect>
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
              Status
            </label>

            <div class="flex flex-col w-full space-y-1">
              <TomSelect
                v-model="formDataOrdeLine.status"
                :options="{
                  placeholder: 'Search..',
                  allowEmptyOption: true,
                }"
                class="w-full"
              >
                <option v-if="titleChange != -1">
                  {{ formDataOrdeLine.status }}
                </option>
                <option v-if="titleChange == -1">SELECT</option>
                <option
                  :value="item.number"
                  v-for="(item, i) in orderLineStatusItem"
                  :key="i"
                >
                  {{ item.name }}
                </option>
              </TomSelect>
            </div>
          </div>

          <div
            class="flex justify-end items-end lg:col-span-3 md:col-span-3 col-span-0"
          >
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
              class="btn btn-primary mr-1"
            >
              Add Product
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
                v-for="(header, i) in productHeaders"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>Retail Price</th>
              <th>Discount Price</th>
              <th>Status</th>
              <!-- <th>Address</th>
              <th>Date</th>
              <th>Time</th>
              <th>Booking#</th> -->
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
                {{ currencyFormat(item.retailPrice) }}
              </td>
              <td>
                {{ currencyFormat(item.discountedPrice) }}
              </td>

              <td>
                <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                  :style="{
                    'background-color': getOrderLineStatusColors(item.status),
                  }"
                >
                  {{
                    item.status != null
                      ? getOrderLineStatus(item.status)
                      : "Nil"
                  }}
                </div>
              </td>

              <!-- <td class="table-report__action w-20">
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

               
                </div>
              </td> -->
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
        Archived Customer Orders
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
              <th>Order Number</th>
              <th>Amount</th>
              <th>Order Created</th>
              <th>Customer</th>
              <th>Note</th>
              <th>Status</th>
              <th>Booking No</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in archiveItems" :key="i" class="intro-x">
              <td>
                {{ item.orderNumber }}
              </td>

              <td>
                {{ currencyFormat(item.amount) }}
              </td>

              <td>
                {{ momentLocalWithTime(item.time) }}
              </td>

              <td>
                {{ item.customer.firstName }} {{ item.customer.lastName }}
              </td>

              <td class="w-24">
                <div class="text-left line-clamp-2">
                  {{ item.note }}
                </div>
              </td>

              <td>
                <div
                  class="text-white rounded-2xl p-1 pl-2 pr-2 flex items-center justify-center"
                  :style="{ 'background-color': getStatusColor(item.status) }"
                >
                  {{ getStatus(item.status) }}
                </div>
              </td>
              <td>
                <div class="text-left line-clamp-2">
                  {{ item.despatchBookingNumber }}
                </div>
              </td>

              <td class="table-report__action hidden">
                <div class="flex justify-center items-center">
                  <!-- <a
                    class="flex items-center mr-3 font-bold"
                    href="javascript:;"
                    @click="viewItemInfo(item)"
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
    :name="formDataOrder.orderNumber"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formDataOrder.orderNumber"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formDataOrder.orderNumber"
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
          {{ formDataOrdeLine.description }}
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
            ORDER# : {{ formDataOrder.orderNumber }}
          </div>
        </div>
        <div class="intro-y box p-5 mt-12 sm:mt-5">
          <div
            class="pt-4 intro-y box grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 lg:gap-4 md:gap-4 gap-2"
          >
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Amount</div>
              </div>
              <div>
                {{
                  formDataOrder.amount != null
                    ? currencyFormat(formDataOrder.amount)
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Order Created</div>
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
              <div class="flex items-center font-bold uppercase">
                <div>Company</div>
              </div>
              <div>
                {{
                  formDataOrder.customer.company != null
                    ? formDataOrder.customer.company
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Customer</div>
              </div>
              <div>
                {{
                  formDataOrder.customer.firstName != null
                    ? formDataOrder.customer.firstName
                    : "Nil"
                }}

                {{
                  formDataOrder.customer.lastName != null
                    ? formDataOrder.customer.lastName
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Note</div>
              </div>
              <div>
                {{ formDataOrder.note != null ? formDataOrder.note : "Nil" }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Status</div>
              </div>
              <div>
                {{
                  formDataOrder.status != null
                    ? getStatus(formDataOrder.status)
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Order Type</div>
              </div>
              <div>
                {{
                  formDataOrder.type != null
                    ? getType(formDataOrder.type)
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Discount Percentage</div>
              </div>
              <div>
                {{
                  formDataOrder.discountPercentage != null
                    ? percentageFormat(formDataOrder.discountPercentage)
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Discount Total</div>
              </div>
              <div>
                {{
                  formDataOrder.discountTotal != null
                    ? currencyFormat(formDataOrder.discountTotal)
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

  <MoveableModal
    :show="addDespatchModal"
    @hidden="addDespatchModal = false"
    backdrop="static"
    size="modal-sl-30"
    :title="desTitle"
    @close="addDespatchModal = false"
  >
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

import countryJson from "@/assets/json/countryAllData.json";

import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Customer Orders");
  },
  components: {
    paginate: Paginate,
    Loading,
    autoTable,
  },
  data() {
    return {
      countryList: countryJson,
      doc: null,
      const_txt: const_txt,
      searchData: "",
      isLoading: false,
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,

      viewInfoModal: false,

      addCustomerOrder: false,
      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,

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
        currency: "FJD",
        discountPercentage: "",
        discountTotal: "",
        status: "",
        deliveryDate: "",
        customerId: "",
        warehouseId: "0",
        deliveryAddress: {
          addressLine: "",
          postcode: "",
          state: "",
          city: "",
          country: "fiji",
        },
        customer: {
          address: "",
          city: "",
          company: "",
          country: "",
          customerId: "",
          email: "",
          firstName: "",
          isBlackListed: "",
          isIndividualPersonal: "",
          lastName: "",
          mobile: "",
          postcode: "",
          state: "",
          telephone: "",
        },
        despatch: {
          despatchId: 0,
          bookingNumber: "",
          courier: "",
          date: "",
          vehicleNumber: "",
          driverName: "",
          driverPhoneNumber: "",
          lpns: [],
        },

        products: [],
      },
      formDataOrderDefault: {
        orderNumber: "",
        note: "",
        type: "",
        time: "",
        amount: "",
        currency: "FJD",
        discountPercentage: "",
        discountTotal: "",
        status: "",
        deliveryDate: "",
        customerId: "",
        warehouseId: "0",
        deliveryAddress: {
          addressLine: "",
          postcode: "",
          state: "",
          city: "",
          country: "fiji",
        },
        customer: {
          address: "",
          city: "",
          company: "",
          country: "",
          customerId: "",
          email: "",
          firstName: "",
          isBlackListed: "",
          isIndividualPersonal: "",
          lastName: "",
          mobile: "",
          postcode: "",
          state: "",
          telephone: "",
        },
        products: [],
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
        skuId: "",
        quantity: "",
        status: "",
        orderNumber: "",
      },
      formDataOrdeLineDefault: {
        skuId: "",
        quantity: "",
        status: "",
        orderNumber: "",
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
        // { text: "ID", value: "orderLineId" },
        { text: "SKU", value: "skuName" },
        { text: "Description", value: "description" },
        { text: "QTY", value: "quantity" },
        //    { text: "Retail Price", value: "retailPrice" },
        //   { text: "Discounted ", value: "discountedPrice" },
        //  { text: "Reason", value: "discountedReason" },
        //    { text: "Status", value: "status" },
      ],
      productItems: [],
      productItemsData: [],

      products: [],
      orderNumber: "",
      orderLines: [],
      customers: [],
      warehouses: [],
      countries: [],

      uploadedfile: null,
      fileName: " ",

      status: [
        { value: 0, name: "DRFT" },
        { value: 1, name: "NEW" },
        { value: 2, name: "ACPT" },
        { value: 3, name: "PIKD" },
        { value: 4, name: "PRCS" },
        { value: 5, name: "COMP" },
        { value: 6, name: "DISP" },
        { value: 7, name: "DELV" },
        { value: 8, name: "RETN" },
      ],
      orderLineStatus: [
        { value: 1, name: "WAIT " },
        { value: 2, name: "PPKD " },
        { value: 3, name: "PIKD " },
        { value: 4, name: "PRCS" },
        { value: 5, name: "COMP" },
      ],

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
      orderLinesLocal: [],

      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,

      statusItems: [],
      typeItems: [],
      orderLineStatusItem: [],

      line: "",
      postcode: "",
      state: "",
      city: "",
      country: "",
      date: "",
      time: "",
      bookingNom: "",
    };
  },
  computed: {
    formTitle() {
      return this.titleChange === -1
        ? "Add New Customer Order"
        : "Edit Customer Order";
    },
    desTitle() {
      return this.desTitleChange === -1 ? "Add Despatch " : "Edit Despatch ";
    },

    btnName() {
      return this.titleChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },
  },
  watch: {
    addProductModal(val) {
      val || this.addProductModalClose();
    },
  },
  created() {
    this.getDataFromApi();
    this.getDataFromStatus();
    this.getDataFromTypes();
    this.getDataFromOrderLineStatus();
  },
  methods: {
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
    getType(value) {
      try {
        return this.typeItems.find((type) => type.number === value).name;
      } catch (e) {
        console.log(e);
        return "Nil";
      }
    },
    getDataFromOrderLineStatus() {
      axios
        .get("Enums/OrderLineStatuses")
        .then((response) => {
          this.orderLineStatusItem = response.data;
        })
        .catch((error) => {
          warningToast("Status Not Found");
        });
    },
    getOrderLineStatus(value) {
      try {
        return this.orderLineStatusItem.find((x) => x.number === value).name;
      } catch (e) {
        console.log(e);
        return "Nil";
      }
    },
    getOrderLineStatusColors(value) {
      try {
        return this.orderLineStatusItem.find((x) => x.number === value).color;
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
          { title: "Order Number", dataKey: "orderNumber" },
          { title: "Amount", dataKey: "amount" },
          { title: "Order Created", dataKey: "time" },
          { title: "Company", dataKey: "company" },
          { title: "Customer", dataKey: "customer" },
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
            company: el.customer.company,
            customer: el.customer.firstName + " " + el.customer.lastName,
            note: el.note,
            status: this.getStatus(el.status),
            type: this.getType(el.type),
            discountPercentage: el.discountPercentage,
            discountTotal: el.discountTotal,
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
      this.docs.save(`${"Customer Sales " + generateDate}.pdf`);
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
        var csvTitle = "Customer Sales " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "Order Number",
          2: "Amount",
          3: "Order Created",
          4: "Company",
          5: "Customer",
          6: "Note",
          7: "Status",
          8: "Type",
          9: "Discount Percentage",
          10: "Discount Total",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.orderNumber,
            2: item.amount,
            3: item.time,
            4: item.customer.company,
            5: item.customer.firstName + " " + item.customer.lastName,
            6: item.note,
            7: this.getStatus(item.status),
            8: this.getType(item.type),
            9: item.discountPercentage,
            10: item.discountTotal,
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
        .post("CustomerOrders/Paginated", pagination)
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
        { title: "Retail Price", dataKey: "retailPrice" },
        { title: "Discount Price", dataKey: "discountedPrice" },
        { title: "Reason", dataKey: "discountedReason" },
        { title: "Status", dataKey: "status" },
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
          discountedPrice: el.discountedPrice,
          discountedReason: el.discountedReason,
          status: this.getOrderLineStatus(el.status),
        };
        //i++;
        data.push(obj);
        //   console.log(obj);
      });
      //console.log("DATA", data);

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

      var fname = this.formDataOrder.customer.firstName;
      var mobile = this.formDataOrder.customer.mobile;

      var lname = this.formDataOrder.customer.lastName;
      var company = this.formDataOrder.customer.company;
      var email = this.formDataOrder.customer.email;
      var time = this.momentLocal(this.formDataOrder.time);
      var amount = this.currencyFormat(this.formDataOrder.amount);
      var despatchBookingNumber = this.formDataOrder.despatchBookingNumber;

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

      this.doc.setFontSize(12).text(fname + " " + lname, 5.2, 2.7);
      this.doc.setFontSize(12).text(company, 5.2, 2.9);
      this.doc.setFontSize(12).text(mobile, 5.2, 3.1);

      this.doc.setFontSize(12).text(email, 5.2, 3.3);

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
        .post("CustomerOrders/Paginated", this.pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsData = response.data.data;
            this.items = response.data.data.items;
            this.supplierItems = response.data.data.items.supplier;
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
          localStorage.setItem("errorMessage", error);
          router.push("/page-down");
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
      this.getDataFromTypes();
      this.getDataFromStatus();
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
      this.formDataOrdeLine.orderNumber = this.formDataOrder.orderNumber;
    },

    showModalProduct() {
      this.setDefaultProduct();
      this.activateModalProduct();
      this.orderChange = 0;
      this.getDataFromOrderLineStatus();
    },
    activateModalProduct() {
      this.getSkus();
      //  this.addProductModalForm = true;
    },

    closeFormProduct() {
      this.addProductModalForm = false;
    },
    saveFormProduct() {
      if (
        this.formDataOrdeLine.skuId == "" ||
        this.formDataOrdeLine.status == ""
      ) {
        if (this.formDataOrdeLine.skuId == "") {
          warningToast("PLU/SKU Required");
        }
        if (this.formDataOrdeLine.status == "") {
          warningToast("Status Required");
        }
      } else {
        this.isLoading = true;
        axios
          .post("CustomerOrders/OrderLine", this.formDataOrdeLine)
          .then((response) => {
            this.itemsData = response.data.data;
            this.items = response.data.data.items;
            this.addProductModal = false;
            this.getOrderLines();
            this.getDataFromApi();
            successToast(response.data.message);
            this.addProductModal = true;
          });
      }
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
      console.log(this.formDataDespatch);
      this.isLoading = true;
      axios
        .post("Despatches/Orders/Add", this.formDataDespatch)
        .then((response) => {
          console.log(response);
          successToast(response.data.message);
          this.addDespatchModal = false;
          this.getDataFromApi();
        });
    },
    //create orderLine
    addItem(item) {
      this.formDataOrdeLine.customerOrderId = item.customerOrderId;
      this.formDataOrder = Object.assign({}, item);
      this.addProductModal = true;
      this.orderNumber = item.orderNumber;

      this.line = item.deliveryAddress.line;
      this.postcode = item.deliveryAddress.postcode;
      this.state = item.deliveryAddress.state;
      this.city = item.deliveryAddress.city;
      this.country = item.deliveryAddress.country;

      var dateAndTime = item.time;
      this.date = moment.utc(dateAndTime).local().format("DD MMMM, YYYY");
      this.time = moment.utc(dateAndTime).local().format("h:mm:ss a");

      this.bookingNom = item.despatchBookingNumber;

      this.getOrderLines();
      this.setDefaultProduct();
    },
    getOrderLines() {
      this.isLoading = true;
      axios
        .get("CustomerOrders/" + this.orderNumber)
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


          this.isLoading = false;
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
          this.isLoading = false;
        });
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
      var pagination = { pageNumber: 1, pageSize: 10000 };
      axios
        .post("Sku/Paginated", pagination)
        .then((response) => {
          this.skus = response.data.data.items;
          this.addProductModalForm = true;

          // if (this.skus.length > 0) {
          //   this.formDataOrdeLine.skuId = this.skus[0].skuId;
          // } else

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
