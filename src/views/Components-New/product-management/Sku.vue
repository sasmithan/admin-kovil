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
      v-if="errorMessage"
      class="md:w-1/2 sm:w-full alert-danger flex items-center mt-2"
    >
      <button
        type="button"
        class="btn-close text-white"
        aria-label="Close"
        @click="dismiss"
      >
        <XIcon class="w-4 h-4" />
      </button>
      <AlertOctagonIcon class="w-6 h-6 mr-2" />{{ errorMessage }}
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
          Add New SKU
        </a>
        <a
          href="javascript:;"
          @click="chooseFiles()"
          class="btn btn-primary shadow-md lg:w-auto w-1/2 text-xs lg:text-sm"
        >
          <UploadIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" />
          Upload File
        </a>
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
      <div>
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
        <!-- <a
          v-if="!allSelected"
          @click="selectAll()"
          class="ml-2 btn shadow-md text-xs lg:text-sm mt-2 lg:mt-0 md:mt-0"
        >
          SELECT ALL
          <span
            class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
          >
            <CheckSquareIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
          </span>
        </a>
        <a
          v-if="allSelected"
          @click="unSelectAll()"
          class="ml-2 btn shadow-md text-xs lg:text-sm mt-2 lg:mt-0 md:mt-0"
        >
          UNSELECT ALL
          <span
            class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
          >
            <CheckSquareIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
          </span>
        </a> -->
        <a
          href="javascript:;"
          @click="printSelected()"
          class="ml-2 btn shadow-md text-xs lg:text-sm mt-2 lg:mt-0 md:mt-0"
        >
          {{ const_txt.PRINT_BTN }}
          <span
            class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
          >
            <PrinterIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
          </span>
        </a>
      </div>
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto">
      <table class="table table-report -mt-2 table-auto">
        <thead>
          <tr class="uppercase whitespace-nowrap">
            <th>QR</th>

            <th>
              <Tippy
                tag="a"
                href="javascript:;"
                class="tooltip w-full"
                content="Select All"
              >
                <a
                  v-if="!allSelected"
                  @click="selectAll()"
                  class="btn shadow-md text-xs lg:text-sm mt-2 lg:mt-0 md:mt-0"
                >
                  All
                  <span
                    class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
                  >
                    <SquareIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
                  </span>
                </a>
              </Tippy>
              <Tippy
                tag="a"
                href="javascript:;"
                class="tooltip w-full"
                content="Unselect All"
              >
                <a
                  v-if="allSelected"
                  @click="unSelectAll()"
                  class="btn shadow-md text-xs lg:text-sm mt-2 lg:mt-0 md:mt-0"
                >
                  All
                  <span
                    class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
                  >
                    <CheckSquareIcon
                      class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0"
                    />
                  </span> </a
              ></Tippy>
            </th>
            <th>PLU/SKU</th>

            <th
              class="whitespace-nowrap"
              v-for="(header, i) in headers"
              :key="i"
            >
              {{ header.text }}
            </th>
            <th>DESC</th>
            <th>Price</th>
            <th>SOH</th>
            <th>Discount</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, i) in items" :key="i" class="intro-x">
            <td class="cursor-pointer">
              <Tippy
                tag="a"
                href="javascript:;"
                class="tooltip w-full"
                :content="item.skuName + ' : ' + item.description"
              >
                <qrcode-vue
                  @click="showQrModal(item)"
                  v-if="item.skuId"
                  render-as="svg"
                  :value="JSON.stringify(item)"
                  size="50"
                  level="H"
                />
              </Tippy>
            </td>
            <td>
              <a class="flex items-center mr-3" href="javascript:;">
                <Tippy
                  tag="a"
                  href="javascript:;"
                  class="tooltip"
                  content="Select"
                  :options="{
                    zIndex: 99999,
                  }"
                >
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                    :value="item"
                    v-model="checkedData"
                  />
                </Tippy>
              </a>
            </td>
            <td
              @click="viewSkuInfo(item)"
              class="cursor-pointer"
              style="color: #1a73e8"
            >
              {{ item.skuName }}
            </td>

            <td v-for="(header, index) in headers" :key="index">
              {{ item[header.value] }}
            </td>

            <td>
              <div class="text-left line-clamp-2">
                <Tippy
                  tag="a"
                  href="javascript:;"
                  class="tooltip"
                  :content="item.description"
                >
                  {{ item.description }}
                </Tippy>
              </div>
            </td>
            <td>
              <div class="text-left">
                {{ currencyFormat(item.price) }}
              </div>
            </td>
            <td></td>

            <td>
              <div class="form-switch ml-3">
                <input
                  id="booleanSwitch"
                  type="checkbox"
                  v-model="item.isDiscount"
                  class="form-check-input"
                  disabled
                />
              </div>
            </td>

            <td class="table-report__action w-56">
              <div class="flex justify-center items-center">
                <!-- <a
                  class="flex items-center mr-3 font-bold"
                  href="javascript:;"
                  @click="viewSkuInfo(item)"
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
                <a
                  class="flex items-center mr-3 font-bold"
                  href="javascript:;"
                  @click="viewSkuVariant(item)"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="SKU Variant"
                  >
                    <PlusSquareIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                  </Tippy>
                </a>
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
                  >
                    <EditIcon
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
                  >
                    <ArchiveIcon
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
      v-if="itemsData.totalCount > 0"
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
    :show="addSku"
    @hidden="addSku = false"
    backdrop="static"
    size="modal-sl-90"
    :title="formTitle"
    @close="addSku = false"
  >
    <ModalBody class="">
      <div class="grid grid-cols-6 lg:gap-4 md:gap-4 gap-2">
        <div class="w-full">
          <label for="regular-form-1" class="form-label">PLU/SKU</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.skuName"
              type="text"
              class="form-control"
              name="skuName"
              placeholder="SKU"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Description</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.description"
              type="text"
              class="form-control h-10"
              placeholder="Description"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">BARCODE/EAN</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.ean"
              type="text"
              class="form-control"
              name="ean"
              placeholder="BARCODE/EAN"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Product</label>

          <TomSelect
            v-model="formDataSku.productId"
            :options="{
              placeholder: 'Search...',
              allowEmptyOption: true,
            }"
            class="w-full"
          >
            <option
              :value="formDataSku.productId"
              v-if="titleChange != -1 && formDataSku.productId != ''"
            >
              {{ getProduct(formDataSku.productId) }}
            </option>

            <option v-if="formDataSku.productId == ''">SELECT</option>

            <option
              :value="item.productId"
              v-for="(item, i) in productList"
              :key="i"
            >
              {{ item.name }}
            </option>
          </TomSelect>
        </div>
        <div class="w-full">
          <label for="regular-form-1" class="form-label">Department</label>

          <TomSelect
            v-model="formDataSku.department"
            :options="{
              placeholder: 'Search...',
              allowEmptyOption: true,
            }"
            class="w-full"
          >
            <option v-if="titleChange != -1 && formDataSku.department != ''">
              {{ formDataSku.department }}
            </option>

            <option v-if="formDataSku.department == ''">SELECT</option>

            <option
              :value="item.department"
              v-for="(item, i) in departmentList"
              :key="i"
            >
              {{ item.name }}
            </option>
          </TomSelect>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Unit</label>

          <TomSelect
            v-model="formDataSku.unitId"
            :options="{
              placeholder: 'Search...',
              allowEmptyOption: true,
            }"
            class="w-full"
          >
            <option
              :value="formDataSku.unitId"
              v-if="titleChange != -1 && formDataSku.unitId != ''"
            >
              {{ getUnit(formDataSku.unitId) }}
            </option>

            <option v-if="formDataSku.unitId == ''">SELECT</option>

            <option :value="item.unitId" v-for="(item, i) in unitList" :key="i">
              {{ item.unitName }}
            </option>
          </TomSelect>
        </div>
        <div class="w-full">
          <label for="regular-form-1" class="form-label">SOH</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control"
              name="discountReason"
              placeholder="SOH"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Min Stock</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.minStock"
              type="text"
              class="form-control"
              placeholder="Min Stock"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Price</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.price"
              type="text"
              class="form-control"
              name="price"
              placeholder="Price"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">VAT Percentage</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.vatPercentage"
              type="text"
              class="form-control"
              name="vatPercentage"
              placeholder="VAT Percentage"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Minimum Margin</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.minMargin"
              type="number"
              class="form-control"
              name="minMargin"
              placeholder="Minimum Margin"
            />
          </div>
        </div>

        <!-- <div class="w-full col-span-3 flex items-start justify-start pt-2">
        <label for="regular-form-1" class="form-label">Discount?</label>

        <div class="flex flex-col space-y-1">
          <div class="form-switch ml-3">
            <input
              type="checkbox"
              v-model="formDataSku.isDiscount"
              class="form-check-input"
            />
          </div>
        </div>
      </div> -->

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Discount</label>

          <div class="flex flex-col space-y-1">
            <div class="form-switch ml-3">
              <input
                type="checkbox"
                v-model="formDataSku.isDiscount"
                class="form-check-input"
              />
            </div>
          </div>
        </div>

        <div class="w-full" v-if="formDataSku.isDiscount">
          <label for="regular-form-1" class="form-label"
            >Discounted Price</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.discountedPrice"
              type="text"
              class="form-control"
              name="discountedPrice"
              placeholder="Discounted Price"
            />
          </div>
        </div>

        <div class="w-full" v-if="formDataSku.isDiscount">
          <label for="regular-form-1" class="form-label">Discount Reason</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.discountReason"
              type="text"
              class="form-control"
              name="discountReason"
              placeholder="Discount Reason"
            />
          </div>
        </div>

        <!-- newly added -->
        <div class="w-full">
          <label for="regular-form-1" class="form-label">PLU Code</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control"
              name="discountReason"
              placeholder="PLU Code"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Std cost</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Std cost"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Reprice markup</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Reprice markup"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Sell price</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Sell price"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Last cost</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Last cost"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >prev avg cost</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control"
              name="discountReason"
              placeholder="Prev avg cost"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Reprice method</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Reprice method"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Max.discount Reason</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Max.discount Reason"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Head office note</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Head office note"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Manufacturer</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control"
              name="discountReason"
              placeholder="Manufacturer"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Manf. product code</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Manf. product code"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Buying mult</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Buying mult"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">RRP</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control"
              name="discountReason"
              placeholder="RRP"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >RRP adjustment</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="RRP adjustment"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Note</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control"
              name="discountReason"
              placeholder="Note"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Std price list note</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Std price list note"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Shelf descr</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Shelf descr"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Shelf label</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              name="discountReason"
              placeholder="Shelf label"
            />
          </div>
        </div>
        <div class="w-full">
          <label for="regular-form-1" class="form-label">Temperature</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.temperature"
              type="text"
              class="form-control"
              placeholder="Temperature"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Dimension</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.dimension"
              type="text"
              class="form-control"
              placeholder="Dimension"
            />
          </div>
        </div>

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Weight</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataSku.weight"
              type="text"
              class="form-control"
              placeholder="Weight"
            />
          </div>
        </div>
      </div>
      <hr class="mt-2 border-1 border-gray-500" />

      <div v-if="titleChange == 0" class="p-2">
        <!-- BEGIN: Data List -->
        <div
          class="flex flex-nowrap cursor-pointer text-sm font-semiboldgit text-info"
          @click="viewBinProducts = !viewBinProducts"
        >
          {{ binViewTitle }}
          <ArrowDownIcon
            class="lg:w-5 lg:h-5 w-3 h-3 ml-4"
            v-if="!viewBinProducts"
          />
          <ArrowUpIcon class="lg:w-5 lg:h-5 w-3 h-3 ml-4" v-else />
        </div>
        <div
          v-if="viewBinProducts"
          id="labelsScroll"
          class="intro-y col-span-12 overflow-scroll h-36"
        >
          <table id="labelsScroll" class="table table-report -mt-2 table-auto">
            <thead>
              <tr class="uppercase whitespace-nowrap">
                <th>Supplier</th>
                <th>Supplier Product Code</th>
                <th>Supplier Product Description</th>
                <th>Price</th>
                <th>Max Delivery Days</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in binExistingProducts"
                :key="i"
                class="intro-x"
              >
                <td>{{ item.supplierId }}</td>
                <td>{{ item.productNumber }}</td>
                <td>{{ item.productDescription }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.maxDeliveryTimeInDays }}</td>
              </tr>
            </tbody>
          </table>
          <div
            class="mb-5 border-2 shadow-md p-2 font-semibold w-full col-span-12 text-center"
            v-if="!(binExistingProducts && binExistingProducts.length > 0)"
          >
            No Data
          </div>
        </div>

        <!-- END: Data List -->
      </div>
      <div class="font-semibold mt-2 mb-2 text-sm">Add Supplier</div>

      <div class="grid grid-cols-5 lg:gap-4 md:gap-4 gap-2">
        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Supplier</label
          >
          <TomSelect
            v-model="formDataSupplierProduct.supplierId"
            class="w-full"
          >
            <option>SELECT</option>

            <option
              :value="item.supplierId"
              v-for="(item, i) in suppliers"
              :key="i"
            >
              {{ item.company }}
            </option>
          </TomSelect>
        </div>
        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Supplier Product Code</label
          >

          <div class="flex flex-col space-y-1">
            <input
              v-model="formDataSupplierProduct.productNumber"
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              placeholder="Suplier Product Code"
            />
          </div>
        </div>
        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Supplier Product Description</label
          >

          <div class="flex flex-col space-y-1">
            <input
              v-model="formDataSupplierProduct.productDescription"
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              placeholder="Suplier Product Description"
            />
          </div>
        </div>
        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Price</label
          >

          <div class="flex flex-col space-y-1">
            <input
              v-model="formDataSupplierProduct.price"
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              placeholder="Suplier Product Price"
            />
          </div>
        </div>
        <div class="w-full">
          <label for="regular-form-1" class="form-label capitalize"
            >Max Delivery Days</label
          >

          <div class="flex flex-col space-y-1">
            <input
              v-model="formDataSupplierProduct.maxDeliveryTimeInDays"
              id="vertical-form-1"
              type="text"
              class="form-control capitalize"
              placeholder="Max Delivery Time In Days"
            />
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

  <!-- BEGIN: View Sku Variant Modal -->
  <Modal
    :show="viewSkuVariantModal"
    @hidden="viewSkuVariantModal = false"
    size="modal-xl"
    backdrop="static"
  >
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="viewSkuVariantClose()"
        />
      </div>

      <div class="p-5 text-center lg:text-lg text-base uppercase font-semibold">
        {{ formDataSku.skuName }} - SKU Variant
      </div>
      <hr />
      <div class="w-full sm:w-auto mt-3 sm:mt-0 p-3">
        <div class="flex">
          <a
            v-if="!addSkuVariantModal"
            href="javascript:;"
            @click="addSkuVariant()"
            class="btn btn-primary shadow-md mr-2"
          >
            Add New Variant
          </a>
          <div
            v-if="addSkuVariantModal"
            class="grid grid-cols-2 lg:gap-4 md:gap-4 gap-2"
          >
            <div class="flex flex-col space-y-1 w-full">
              <label for="regular-form-1" class="form-label"
                >Variant Option</label
              >
              <TomSelect
                v-model="formDataSkuVariant.variantOptionId"
                :options="{
                  placeholder: 'Select..',
                }"
                class="w-full"
              >
                <option v-if="skuChange != -1">
                  {{ formDataSkuVariant.optionName }}
                </option>
                <option v-if="skuChange == -1" value=""></option>
                <option
                  :value="item.variantOptionId"
                  v-for="(item, i) in variantOptions"
                  :key="i"
                >
                  {{ item.optionName }}
                </option>
              </TomSelect>
            </div>
            <div class="flex items-end">
              <button
                @click="saveSkuVariant()"
                type="submit"
                class="btn btn-primary w-24 mr-1"
              >
                Add
              </button>
              <button
                type="button"
                @click="addSkuVariantModal = false"
                class="btn btn-outline-secondary w-24 mr-1"
              >
                {{ const_txt.CANCEL_BTN }}
              </button>
            </div>
          </div>
          <div class="hidden md:block mx-auto text-slate-500">
            <!-- Showing 1 to 10 of 150 entries -->
          </div>
          <!-- <div class="justify-end">
            <a
              href="javascript:;"
              @click="viewArchivesOption()"
              class="btn btn-primary shadow-md"
            >
              ARCHIVE
              <span class="ml-2 w-5 h-5 flex items-center justify-center">
                <ArchiveIcon class="w-6 h-6 -mt-1" />
              </span>
            </a>
          </div> -->
        </div>
      </div>
      <!-- SEARCH -->
      <div class="w-full sm:w-auto mt-3 sm:mt-0">
        <div class="w-full relative text-slate-500">
          <input
            type="text"
            class="form-control w-full box pr-10"
            placeholder="Search..."
            v-model="searchData"
            @change="searchOnchange"
          />
          <SearchIcon
            @click="searchItem"
            v-if="!searchActive"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
          <XIcon
            @click="clearSearch"
            v-if="searchActive"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
        </div>
      </div>
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
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in variantOptionsHeaders"
                :key="i"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in skuVariantItems" :key="i" class="intro-x">
              <td v-for="(header, index) in skuVariantHeaders" :key="index">
                {{ item[header.value] }}
              </td>

              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <a
                    @click="editItemSkuVariant(item)"
                    class="flex items-center mr-3 text-blue-900"
                    href="javascript:;"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Edit Option"
                      :options="{
                        zIndex: 99999,
                      }"
                    >
                      <EditIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                      />
                    </Tippy>
                  </a>
                  <a
                    @click="deleteItemSkuVariant(item)"
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
                    >
                      <Trash2Icon
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
      <!-- END: Archive Data List -->

      <!-- BEGIN: Pagination -->

      <div
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
            :page-count="pageCountOption"
            :page-range="5"
            :margin-pages="2"
            :click-handler="changePageOption"
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
          v-model="pageSizeOption"
          class="w-20 form-select box cursor-pointer"
          @change="pageSizeChangeOption"
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
        Archived SKU
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
            <tr v-for="(item, i) in archiveItems" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>

              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <a
                    class="flex items-center mr-3 font-bold"
                    href="javascript:;"
                    @click="viewSkuInfo(item)"
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
                      <Trash2Icon
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
    :name="formDataSku.skuName"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formDataSku.skuName"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formDataSku.skuName"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete"
  />
  <!-- END: Confirmation Modals -->

  <!-- BEGIN:  Notification Content -->

  <!-- END:  Notification Content -->

  <!-- BEGIN: Delete Confirmation Modal -->
  <Modal
    :show="deleteSkuVariantConfirmationModal"
    @hidden="deleteSkuVariantConfirmationModal = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <Trash2Icon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-xl font-bold mt-5">
          {{ formDataSkuVariant.skuId }}
        </div>
        <div class="text-slate-500 mt-2">
          Do you really want to delete these records? <br />This process cannot
          be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="deleteSkuVariantConfirmationModal = false"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          {{ const_txt.CANCEL_BTN }}
        </button>
        <button
          type="button"
          class="btn btn-danger w-24"
          @click="deleteItemSkuVariantConfirm()"
        >
          Delete
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- BEGIN: View Bin Info Modal -->

  <MoveableModal
    :show="skuInfoModal"
    @hidden="skuInfoModal = false"
    backdrop="static"
    size="modal-sl-80"
    title="INFO"
    @close="skuInfoModal = false"
  >
    <ModalBody class="p-0">
      <!-- BEGIN: INFO -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4 mt-6">
        <div
          class="flex flex-col text-center items-center justify-between space-y-2"
        >
          <qrcode-vue
            render-as="svg"
            :value="JSON.stringify(formDataSku)"
            size="80"
            level="H"
          />
          <div class="text-xl font-bold mt-5">
            PLU/SKU : {{ formDataSku.skuName }}
          </div>
        </div>
        <div class="intro-y box p-5 mt-12 sm:mt-5">
          <div
            class="pt-4 intro-y box grid lg:grid-cols-6 md:grid-cols-6 grid-cols-2 lg:gap-4 md:gap-4 gap-2"
          >
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>PLU/SKU</div>
              </div>
              <div>
                {{ formDataSku.skuName != null ? formDataSku.skuName : "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>BARCODE/EAN</div>
              </div>
              <div>
                {{ formDataSku.ean != null ? formDataSku.ean : "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>SOH</div>
              </div>
              <div>
                {{ formDataSku.soh != null ? formDataSku.soh : "Nil" }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>
                  <TomSelect
                    v-model="formDataSkuLocation"
                    :options="{
                      placeholder: 'Search..',
                    }"
                    class="w-full"
                  >
                    <option>LOCATIONS</option>
                    <option
                      :value="item.supplierId"
                      v-for="(item, i) in formDataSkuLocations"
                      :key="i"
                    >
                      {{ item.bin }}
                    </option>
                  </TomSelect>
                </div>
              </div>
            </div>
            <div v-if="quantityExist" class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>QTY</div>
              </div>
              <div>
                {{
                  formDataSkuLocationQty != null
                    ? formDataSkuLocationQty
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Department</div>
              </div>
              <div>
                {{
                  formDataSku.department != null
                    ? formDataSku.department
                    : "Nil"
                }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Unit</div>
              </div>
              <div>
                {{
                  formDataSku.unitId != null
                    ? getUnit(formDataSku.unitId)
                    : "Nil"
                }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Description</div>
              </div>
              <div>
                {{
                  formDataSku.description != null
                    ? formDataSku.description
                    : "Nil"
                }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>PRICE</div>
              </div>
              <div>
                {{
                  formDataSku.price != null
                    ? currencyFormat(formDataSku.price)
                    : "Nil"
                }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>
                  <TomSelect
                    v-model="formDataSkuSupplier"
                    :options="{
                      placeholder: 'Search..',
                    }"
                    class="w-full"
                  >
                    <option>SUPPLIERS</option>
                    <option
                      :value="item.supplierId"
                      v-for="(item, i) in formDataSkuSuppliers"
                      :key="i"
                    >
                      {{ item.supplierCompany }}
                    </option>
                  </TomSelect>
                </div>
              </div>
            </div>

            <div
              v-if="supplierCodeExist"
              class="flex flex-col items-center mb-5"
            >
              <div class="flex items-center font-bold uppercase">
                <div>Supplier Code</div>
              </div>
              <div>
                {{
                  formDataSkuSupplierCode != null
                    ? formDataSkuSupplierCode
                    : "Nil"
                }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>DISCOUNT</div>
              </div>
              <div>
                <div class="form-switch ml-3">
                  <input
                    id="booleanSwitch"
                    type="checkbox"
                    v-model="formDataSku.isDiscount"
                    class="form-check-input"
                    disabled
                  />
                </div>
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>VAT Percentage</div>
              </div>
              <div>
                {{
                  formDataSku.vatPercentage != null
                    ? percentageFormat(formDataSku.vatPercentage)
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Discounted Price</div>
              </div>
              <div>
                {{
                  formDataSku.discountedPrice != null
                    ? currencyFormat(formDataSku.discountedPrice)
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Minimum Margin</div>
              </div>
              <div>
                {{
                  formDataSku.minMargin != null ? formDataSku.minMargin : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Discount Reason</div>
              </div>
              <div>
                {{
                  formDataSku.discountReason != null
                    ? formDataSku.discountReason
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Dimension</div>
              </div>
              <div>
                {{
                  formDataSku.dimension != null ? formDataSku.dimension : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Weight</div>
              </div>
              <div>
                {{
                  formDataSku.weight != null
                    ? weightFormat(formDataSku.weight)
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Temperature</div>
              </div>
              <div>
                {{
                  formDataSku.temperature != null
                    ? temperatureFormat(formDataSku.temperature)
                    : "Nil"
                }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Std cost</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Reprice markup</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Sell price</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Last cost</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Prev avg cost</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Reprice method</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Reprice method</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Max.discountReason</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Head office note</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Manufacturer</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Manf. product code</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Buying mult</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>RRP</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>RRP adjustment</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Note</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Std price list note</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Shelf descr</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Shelf label</div>
              </div>
              <div>
                <!-- {{
                      formDataBin.sectionName != null
                        ? formDataBin.sectionName
                        : "Nil"
                    }} -->
                {{ "Nil" }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: INFO -->
    </ModalBody>
  </MoveableModal>
  <!-- END: Delete Confirmation Modal -->

  <Modal size="modal-sm" :show="qrModal" @hidden="qrModal = false">
    <ModalBody
      class="flex flex-col justify-center items-center space-y-2 w-full"
    >
      <div class="w-full">
        <qrcode-vue
          v-if="formDataSku.skuId"
          render-as="svg"
          :value="JSON.stringify(formDataSku)"
          size="250"
          level="H"
        />
      </div>

      <div>
        <span
          class="lg:text-lg md:text-base text-base text-black-900 font-medium leading-none"
          >{{ formDataSku }}</span
        >
      </div>
    </ModalBody>
  </Modal>

  <!-- BEGIN: Add  Modal -->

  <Modal
    :show="addCheckedPrintModal"
    @hidden="addCheckedPrintModal = false"
    backdrop="static"
  >
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">
        Do you want to print the selected label(s) ?
      </h2>
    </ModalHeader>
    <ModalBody class="flex justify-center space-y-4">
      <div class="flex flex-col space-y-4 w-full">
        <div>
          <label for="regular-form-1" class="form-label">WAN IP</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataPrint.ip"
              type="text"
              class="form-control"
              placeholder="WAN IP"
            />
          </div>
        </div>
        <div>
          <label for="regular-form-1" class="form-label">Port</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataPrint.port"
              type="text"
              class="form-control"
              placeholder="Port.."
            />
          </div>
        </div>
        <div>
          <label for="regular-form-1" class="form-label"
            >Number of Copies</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataPrint.nbrOfCopies"
              type="text"
              class="form-control"
              placeholder="Number of copies.."
            />
          </div>
        </div>
        <div>
          <label for="regular-form-1" class="form-label"
            >Selected Label(s)</label
          >

          <div
            id="labelsScroll"
            class="flex flex-col space-y-1 overflow-scroll h-36"
          >
            <div v-for="(item, i) in formDataPrint.products" :key="i">
              {{ i + 1 }} : {{ item.skuName }} - {{ item.description }}
            </div>
          </div>
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="addCheckedPrintModal = false"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        {{ const_txt.CANCEL_BTN }}
      </button>
      <button
        @click="confirmPrint()"
        type="submit"
        class="btn btn-primary w-24"
      >
        Ok
      </button>
    </ModalFooter>
  </Modal>
  <!-- END: Add Modal -->
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";

import { required, minLength, maxLength, integer } from "@vuelidate/validators";
import axios from "../../../services/http-common";
import Paginate from "vuejs-paginate-next";
import QrcodeVue from "qrcode.vue";

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

import {
  currencyFormat,
  percentageFormat,
  temperatureFormat,
  weightFormat,
  removeNullValue,
} from "../../../global-functions/functions";

import { exportCSVFile } from "../../../global-functions/functions";
import axiosReal from "axios";
import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "PLU/SKU");
  },
  components: {
    paginate: Paginate,
    Loading,
  },
  data() {
    return {
      const_txt: const_txt,
      isLoading: false,
      skuInfoModal: false,

      qrModal: false,
      searchData: "",
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,

      addSkuVariantModal: false,
      viewSkuVariantModal: false,

      addSku: false,
      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,
      titleChange: -1,
      formDataSku: {
        skuName: "",
        ean: "",
        description: "",
        productId: 0,
        price: 0,
        vatPercentage: 0,
        isDiscount: true,
        discountedPrice: 0,
        discountReason: "",
        temperature: 0,
        dimension: "",
        weight: 0,
        department: "",
        unitId: 0,
        minStock: 0,
      },
      formDataSkuDefault: {
        skuName: "",
        ean: "",
        description: "",
        productId: 0,
        price: 0,
        vatPercentage: 0,
        isDiscount: true,
        discountedPrice: 0,
        discountReason: "",
        temperature: 0,
        dimension: "",
        weight: 0,
        department: "",
        unitId: 0,
        minStock: 0,
      },

      rules: {
        skuName: {
          required,
          minLength: minLength(2),
        },
        description: {
          required,
          minLength: minLength(2),
        },
        abbreviation: {
          required,
          maxLength: maxLength(10),
        },
      },

      headers: [
        // { text: "ID", value: "skuId" },
        // { text: "SKU", value: "skuName" },
        { text: "BARCODE/EAN", value: "ean" },
        // { text: "Product", value: "productId" },
        //   { text: "Price", value: "price" },
        // { text: "VAT Percentage", value: "vatPercentage" },
        // { text: "Discount", value: "isDiscount" },
        // { text: "Discounted Price", value: "discountedPrice" },
        // { text: "Discount Reason", value: "discountReason" },
      ],
      pagination: {
        pageNumber: 1,
        pageSize: 10,
        search: "",
        // searchColumn: "description",
        // sortColumnName: "description",
        // sortDirection: "asc",
      },
      defaultPagination: {
        pageNumber: 1,
        pageSize: 10,
        search: "",
      },
      productList: [],
      unitList: [],
      departmentList: [],
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
        // sortColumnName: "description",
        // sortDirection: "asc",
      },
      paginationArchiveDefault: {
        pageNumber: 1,
        pageSize: 5,
      },

      pageCountArchive: 20,
      pageSizeArchive: 5,
      serverError: false,
      errorMessage: "",

      //SkuVariant
      formDataSkuVariant: {
        skuId: "",
        variantOptionId: "",
      },
      formDataSkuVariantDefault: {
        skuId: "",
        variantOptionId: "",
      },

      skuVariantHeaders: [
        { text: "PLU/SKU", value: "skuId" },
        { text: "Variant Option", value: "variantOptionId" },
      ],
      skuVariantItems: [],
      skuVariantItemsData: [],

      variantOptions: [],
      skuChange: -1,

      checkedData: [],

      addCheckedPrintModal: false,
      formDataPrint: {
        products: [],
        ip: "192.0.0.0",
        port: "9100",
        nbrOfCopies: "",
      },
      allSelected: false,
      uploadedfile: null,
      fileName: " ",
      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,
      unitItems: [],
      formDataSkuSupplier: "",
      formDataSkuSupplierCode: "",
      formDataSkuSuppliers: [],
      supplierCodeExist: false,

      supplierProductList: [],
      supplierProducts: [],
      binExistingProducts: [],
      viewBinProducts: false,

      formDataSupplierProduct: {
        productNumber: "",
        supplierId: "",
        skuId: "",
        productDescription: "",
        maxDeliveryTimeInDays: "",
        price: "",
      },
      formDataSupplierProductDefault: {
        productNumber: "",
        supplierId: "",
        skuId: "",
        productDescription: "",
        maxDeliveryTimeInDays: "",
        price: "",
      },
      suppliers: [],

      formDataSkuLocation: "",
      formDataSkuLocationQty: "",
      formDataSkuLocations: [],
      quantityExist: false,
    };
  },
  computed: {
    binViewTitle() {
      return this.viewBinProducts == true
        ? "Existing Supplier"
        : "View Existing Supplier";
    },
    formTitle() {
      return this.titleChange === -1 ? "Add New SKU" : "Edit SKU";
    },
    skuTitle() {
      return this.skuChange === -1 ? const_txt.SAVE_BTN : const_txt.UPDATE_BTN;
    },
    btnName() {
      return this.titleChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },
  },
  created() {
    this.getDataFromApi();
    this.getDefaultIP();
    this.getUnitData();
    this.getProductData();
    this.getSuppliers();
  },
  watch: {
    viewSkuVariant(val) {
      val || this.viewSkuVariantClose();
    },
    formDataSkuSupplier() {
      this.viewSupplierCode();
    },
    formDataSkuLocation() {
      this.viewSkuLocationQty();
    },
  },
  methods: {
    getSuppliers() {
      this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 1000 };
      axios
        .post("Suppliers/Paginated", pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.suppliers = response.data.data.items;
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {});
    },

    viewSupplierCode() {
      let item = this.formDataSkuSupplier;
      console.log(item);
      if (item != "SUPPLIERS") {
        this.supplierCodeExist = true;
        var supplier = this.formDataSkuSuppliers.filter((obj) => {
          return obj.supplierId == item;
        });
        this.formDataSkuSupplierCode = supplier[0].productNumber;
        console.log(supplier);
      } else {
        this.supplierCodeExist = false;
      }
    },
    viewSkuLocationQty() {
      let item = this.formDataSkuLocation;

      if (item != "LOCATIONS") {
        this.quantityExist = true;
        var location = this.formDataSkuLocations.filter((obj) => {
          return obj.bin == item;
        });
        this.formDataSkuLocationQty = location[0].quantity;
        console.log(location);
      } else {
        this.quantityExist = false;
      }
    },

    getUnit(value) {
      try {
        return this.unitList.find((x) => x.unitId === value).unitName;
      } catch {
        return "Nil";
      }
    },

    getProduct(value) {
      try {
        return this.productList.find((x) => x.productId == value).name;
      } catch {
        return "Nil";
      }
    },

    setReports() {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.allItems <= 0) {
            warningToast(const_txt.NO_DATA);
            this.isLoading = false;
          } else {
            const columns = [
              { title: "QR", dataKey: "qr" },
              { title: "PLU/SKU", dataKey: "skuName" },
              { title: "BARCODE/EAN", dataKey: "ean" },
              { title: "Description", dataKey: "description" },
              { title: "Price", dataKey: "price" },
              { title: "Discount", dataKey: "isDiscount" },
              { title: "VAT Percentage", dataKey: "vatPercentage" },
              { title: "Discounted Price", dataKey: "discountedPrice" },
              { title: "Minimum Margin", dataKey: "minMargin" },
              { title: "Discount Reason", dataKey: "discountReason" },
              { title: "Temperature", dataKey: "temperature" },
              { title: "Dimension", dataKey: "dimension" },
              { title: "Weight", dataKey: "weight" },
            ];
            this.docs = new jsPDF({
              orientation: "landscape",
              unit: "in",
              format: "a4",
            });

            // var imgData = "/src/assets/images/pl_logo2.png";
            // this.docs.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
            // this.docs
            //   .setFontSize(16)
            //   .text("Storage Bin", 5, 1.2);

            let data = await this.getItemsWithQR(this.allItems);

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
              columnStyles: {
                0: {
                  rowHeight: 1,
                  cellWidth: 1,
                },
              },
              margin: { left: 0.5, top: 0.5 },
              didDrawCell: this.didDrawCell,
            });
          }
          resolve();
        } catch (error) {
          reject();
        }
      });
    },

    getItemsWithQR(list) {
      return new Promise((resolve, reject) => {
        try {
          var data = [];
          list.forEach(async (el) => {
            var obj = {
              skuName: el.skuName,
              ean: el.ean,
              description: el.description,
              price: el.price,
              isDiscount: el.isDiscount,
              vatPercentage: el.vatPercentage,
              discountedPrice: el.discountedPrice,
              minMargin: el.minMargin,
              discountReason: el.discountReason,
              temperature: el.temperature,
              dimension: el.dimension,
              weight: el.weight,
            };
            obj.qrData = await QRCode.toDataURL(JSON.stringify(el.skuName));
            data.push(obj);
          });
          resolve(data);
        } catch (error) {
          reject([]);
        }
      });
    },

    didDrawCell(data) {
      if (data.column.dataKey === "qr" && data.cell.section === "body") {
        var dim = data.cell.height - data.cell.padding("vertical");
        var textPos = data.cell;

        if (data.row && data.row.raw && data.row.raw.qrData) {
          this.docs.addImage(
            data.row.raw.qrData,
            textPos.x + 0.05,
            textPos.y + 0.04,
            dim,
            dim
          );
        }
      }
    },

    printExport() {
      this.getAllDataFromApi();
      this.isActive = 1;
    },

    pdfPrint() {
      this.setReports().then((res) => {
        this.docs.autoPrint();
        this.docs.output("dataurlnewwindow");
      });
    },

    pdfExport() {
      this.getAllDataFromApi();
      this.isActive = 3;
    },

    pdfDownload() {
      this.setReports().then((res) => {
        var generateDate = new Date().toLocaleString();
        this.docs.save(`${"SKU " + generateDate}.pdf`);
      });
    },

    csvExport() {
      this.getAllDataFromApi();
      this.isActive = 2;
    },

    getAllDataFromApi() {
      var totalCount = this.itemsData.totalCount;

      var pagination = { pageNumber: 1, pageSize: totalCount };
      this.isLoading = true;
      axios
        .post("Sku/Paginated", pagination)
        .then((response) => {
          if (response.status === 200) {
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

    csvDownload() {
      if (this.allItems <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        var generateDate = new Date().toLocaleString();
        var csvTitle = "SKU " + generateDate;

        var items = this.allItems;

        var csvItems = [];

        var csvHeaders = {
          1: "PLU/SKU",
          2: "BARCODE/EAN",
          3: "Description",
          4: "Price",
          5: "Discount",
          6: "VAT Percentage",
          7: "Discounted Price",
          8: "Minimum Margin",
          9: "Discount Reason",
          10: "Temperature",
          11: "Dimension",
          12: "Weight",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.skuName,
            2: item.ean,
            3: item.description,
            4: item.price,
            5: item.isDiscount,
            6: item.vatPercentage,
            7: item.discountedPrice,
            8: item.minMargin,
            9: item.discountReason,
            10: item.temperature,
            11: item.dimension,
            12: item.weight,
          });
        });
        exportCSVFile(csvHeaders, csvItems, csvTitle);
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
        .post("Sku/Upload/Excel", formData)
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

    checkForSelected() {
      this.unSelectAll();
    },

    unSelectAll() {
      this.allSelected = false;
      this.checkedData = [];
    },
    selectAll() {
      this.allSelected = true;
      for (var i = 0; i < this.items.length; i++) {
        this.checkedData[i] = this.items[i];
      }
    },

    confirmPrint() {
      axios.post("Sku/PrintSkus ", this.formDataPrint).then((response) => {
        console.log(response);
      });
      this.addCheckedPrintModal = false;
      this.checkedData = [];
    },

    printSelected() {
      if (this.checkedData.length > 0) {
        this.addCheckedPrintModal = true;
        for (var i = 0; i < this.checkedData.length; i++) {
          this.formDataPrint.products[i] = this.checkedData[i];
        }
      } else {
        warningToast("Please Select PLU/SKU");
      }
    },

    getDefaultIP() {
      axiosReal.get("https://api.ipify.org/").then((response) => {
        this.formDataPrint.ip = response.data;
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

    getSelectedColor() {
      // return "background-color:;color: white";
    },
    viewSkuVariantClose() {
      // this.isLoading = true;

      // for (var i = 0; i < this.items.length; i++) {
      //   this.items[i].selected = false;
      // this.isLoading = false;

      this.viewSkuVariantModal = false;
      // }
    },
    showQrModal(item) {
      removeNullValue(item);
      this.formDataSku = Object.assign({}, item);
      this.qrModal = true;
    },
    viewSkuInfo(item) {
      removeNullValue(item);
      this.formDataSku = Object.assign({}, item);

      console.log(this.formDataSku);
      this.getSupplierProducts();
      this.getSkuLocation();
      this.skuInfoModal = true;
    },
    async getSkuLocation() {
      var sku = this.formDataSku.skuName;
      var warehouse = "DFLT";
      await axios
        .get(`MemoryStocks/${warehouse}/Products/${sku}`)
        .then((response) => {
          if (response.status === 200) {
            this.formDataSkuLocations = response.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    async getSupplierProducts() {
      await axios
        .get("SupplierProducts/Products/" + this.formDataSku.skuId)
        .then((response) => {
          if (response.data.success === true) {
            this.formDataSkuSuppliers = response.data.data;
          } else {
            alert("ERROR");
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          alert("ERROR");
          warningToast(statusMessage(error.response.status));
        });
    },

    getProductData() {
      var pagination = { pageNumber: 1, pageSize: 10000 };
      axios
        .post("Products/Paginated", pagination)
        .then((response) => {
          this.productList = response.data.data.items;

          // if (this.productList.length == 0) {
          //   warningToast("Please Add Items in Product");
          //   this.addSku = false;
          // }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    getUnitData() {
      var pagination = { pageNumber: 1, pageSize: 10000 };
      axios
        .post("Units/Paginated", pagination)
        .then((response) => {
          this.unitList = response.data.data.items;

          // if (this.unitList.length == 0) {
          //   warningToast("Please Add Items in Unit");
          //   this.addSku = false;
          // }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    getDepartmentData() {
      var pagination = { pageNumber: 1, pageSize: 10000 };
      axios
        .post("Departments/Paginated", pagination)
        .then((response) => {
          this.departmentList = response.data.data.items;

          // if (this.departmentList.length == 0) {
          //   warningToast("Please Add Items in Unit");
          //   this.addSku = false;
          // }
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
      this.pagination = Object.assign({}, this.defaultPagination);
      this.pagination.search = this.searchData;
      this.getDataFromApi();
      this.searchActive = false;
    },
    searchItem() {
      if (this.searchData != "") {
        this.searchActive = true;
        this.pagination.search = this.searchData;
        this.pagination.sortColumnName = "";
        this.pagination.sortDirection = "";

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
      //console.log(this.itemData)

      this.getDataFromApi();
    },
    setRowSize() {
      if (this.itemsData.totalPages == 1) {
        this.pageSize = this.itemsData.totalCount;
      } else {
        this.pageSize = this.pagination.pageSize;
      }
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
      this.formDataSku = Object.assign({}, this.formDataSkuDefault);
    },
    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("Sku/Paginated", this.pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsData = response.data.data;
            this.items = response.data.data.items;
            this.pageCount = this.itemsData.totalPages;
            // for (var i = 0; i < this.items.length; i++) {
            //   this.items[i].number = i+1;
            // }
            this.setRowSize();
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
    showModal() {
      this.setDefault();
      this.titleChange = -1;
      this.activateModal();
    },

    activateModal() {
      this.getProductData();
      this.getUnitData();
      this.getDepartmentData();
      this.addSku = true;
    },

    //selection variant option
    getVariantOptions() {
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("VariantOption/Paginated", pagination)
        .then((response) => {
          this.variantOptions = response.data.data.items;

          if (this.variantOptions.length > 0) {
            if (this.titleChange === -1) {
              this.formDataSkuVariant.variantOptionId =
                this.variantOptions[0].variantOptionId;
            }
          } else if (this.variantOptions.length == 0) {
            warningToast("Please Add Items in Variant Options");
            this.addSku = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },

    closeForm() {
      this.addSku = false;
    },
    editItem(item) {
      this.titleChange = 0;
      this.setDefault();
      removeNullValue(item);

      this.formDataSku = Object.assign({}, item);
      console.log(this.formDataSku);

      if (this.titleChange == 0) {
        this.getSupplierProductsBySkuId(this.formDataSku.skuId);
      }
      this.activateModal();
    },
    getSupplierProductsBySkuId(skuId) {
      axios.get("SupplierProducts/Products/" + skuId).then((response) => {
        this.binExistingProducts = response.data.data;
        // this.binExistingProducts = [{}, {}, {}, {}, {}, {}, {}, {}];
      });
    },
    // removeNullValue(item) {
    //   Object.keys(item).forEach((key) => {
    //     if (item[key] === null) {
    //       item[key] = "";
    //     }
    //   });
    // },

    setNullValue(item) {
      this.submitItem = Object.assign({}, item);
      if (this.submitItem.productId == "") {
        this.submitItem.productId = null;
      }
      if (this.submitItem.unitId == "") {
        this.submitItem.unitId = null;
      }
    },
    saveForm() {
      this.setNullValue(this.formDataSku);
      console.log(this.submitItem);
      if (this.titleChange === -1) {
        this.isLoading = true;
        axios
          .post("Sku", this.submitItem)
          .then((response) => {
            if (response.data.success === true) {
              var supplierId = this.formDataSupplierProduct.supplierId;

              if (supplierId != "SELECT" && supplierId != "") {
                var response = response.data.data;
                this.saveSupProduct(response);
              } else {
                this.addSku = false;
                this.getDataFromApi();
                successToast(response.data.message);
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
      } else {
        var itemId = this.submitItem.skuId;
        this.isLoading = true;
        axios
          .put("Sku/" + itemId, this.submitItem)
          .then((response) => {
            if (response.data.success === true) {
              this.itemsData = response.data.data;
              this.items = response.data.data.items;
              this.addSku = false;
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

    saveSupProduct(response) {
      this.formDataSupplierProduct.skuId = response.skuId;
      if (this.formDataSupplierProduct.productDescription == "") {
        this.formDataSupplierProduct.productDescription = response.description;
      }
      if (this.formDataSupplierProduct.price == "") {
        this.formDataSupplierProduct.price = response.price;
      }

      console.log(this.formDataSupplierProduct);

      axios
        .post("SupplierProducts", this.formDataSupplierProduct)
        .then((response) => {
          if (response.data.success === true) {
            this.addSku = false;
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
    archiveItem(item) {
      removeNullValue(item);
      this.formDataSku = Object.assign({}, item);
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
      var itemId = this.formDataSku.skuId;
      this.isLoading = true;
      axios
        .get("Sku/" + itemId + "/Archive")
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
        .post("Sku/Archived", this.paginationArchive)
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
    pageSizeChangeArchive(pageSize) {
       
      this.paginationArchive.pageSize = pageSize;
      this.viewArchives();
    },
    restoreItem(item) {
      removeNullValue(item);
      this.formDataSku = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.formDataSku.skuId;
      this.isLoading = true;
      axios
        .get("Sku/" + itemId + "/Restore")
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
      this.formDataSku = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataSku.skuId;
      axios
        .delete("Sku/" + itemId)
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

    //Sku Variant
    viewSkuVariant(item) {
      // this.formDataSku = Object.assign({}, item);
      // this.viewSkuVariantModal = true;
      // this.addSkuVariantModal = false;
      // this.skuChange = -1;
      // this.titleChange = -1;
      // this.getSkuVariants();
    },
    addSkuVariant() {
      this.getVariantOptions();

      this.activateModalSkuVariant();
      this.skuChange = -1;
    },
    activateModalSkuVariant() {
      this.setDefaultSkuVariant();

      this.addSkuVariantModal = true;
    },

    setDefaultSkuVariant() {
      this.formDataSkuVariant = Object.assign(
        {},
        this.formDataSkuVariantDefault
      );

      this.formDataSkuVariant.skuId = this.formDataSku.skuId;
    },
    getSkuVariants() {
      var skuId = this.formDataSku.skuId;
      axios
        .post("SkuVariant/" + skuId + "/Paginated", this.paginationOption)
        .then((response) => {
          this.skuVariantItemsData = response.data.data;
          this.skuVariantItems = response.data.data.items;

          this.pageCountOption = this.skuVariantItemsData.totalPages;

          //   var variantTypeId = this.formDataSkuVariant.variantTypeId;
          //    this.skuVariantItems = response.data.data.items.filter(
          //    (a) => a.variantTypeId === variantTypeId
          //   );

          //this.formDataSkuVariant.variantTypeId
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },

    saveSkuVariant() {
      if (this.optionChange === -1) {
        this.isLoading = true;
        axios
          .post("SkuVariant", this.formDataSkuVariant)
          .then((response) => {
            if (response.data.success === true) {
              this.getSkuVariants();
              this.addSkuVariantModal = false;
              // this.getDataFromApi();
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
        var itemId = this.formDataSkuVariant.variantOptionId;
        this.isLoading = true;
        axios
          .put("SkuVariant/" + itemId, this.formDataSkuVariant)
          .then((response) => {
            if (response.data.success === true) {
              this.addSkuVariantModal = false;
              this.getSkuVariants();
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

    editItemSkuVariant(item) {
      this.skuChange = 0;
      this.formDataSkuVariant = Object.assign({}, item);
      this.addSkuVariantModal = true;
    },

    deleteItemSkuVariant(item) {
      this.formDataSkuVariant = Object.assign({}, item);
      this.deleteSkuVariantConfirmationModal = true;
    },
    deleteItemSkuVariantConfirm() {
      var itemId = this.formDataSkuVariant.SkuVariantId;
      this.isLoading = true;
      axios
        .delete("SkuVariant/" + itemId)
        .then((response) => {
          if (response.data.success === true) {
            this.deleteSkuVariantConfirmationModal = false;
            this.getSkuVariants();
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
  },
};
</script>
