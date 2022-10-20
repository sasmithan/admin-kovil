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
          Add New Dispatch
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
        <div class="hidden md:block mx-auto text-slate-500">
          <!-- Showing 1 to 10 of 150 entries -->
        </div>
      </div>

      <div class="flex justify-center items-center space-x-2">
        <a
          href="javascript:;"
          @click="viewArchives()"
          class="
            btn btn-primary
            shadow-md
            text-xs
            lg:text-sm
            mt-2
            lg:mt-0
            md:mt-0
          "
        >
          {{ const_txt.ARCHIVE_BTN }}
          <span
            class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
          >
            <ArchiveIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
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
            <th>Booking No</th>
            <th
              class="whitespace-nowrap"
              v-for="(header, i) in headers"
              :key="i"
            >
              {{ header.text }}
            </th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i" class="intro-x">
            <td
              class="cursor-pointer"
              :style="item.selected ? getSelectedColor() : ''"
            >
              <Tippy
                tag="a"
                href="javascript:;"
                class="tooltip w-full"
                :content="item.bookingNumber"
              >
                <qrcode-vue
                  @click="showQrModal(item)"
                  style="float: center"
                  :style="
                    item.selected
                      ? 'border:2px solid; border-color: white;'
                      : ''
                  "
                  render-as="svg"
                  :value="JSON.stringify(item)"
                  size="50"
                  level="H"
              /></Tippy>
            </td>
            <td
              @click="
                viewItem(item);
                item.selected = true;
              "
              class="cursor-pointer"
              :style="item.selected ? getSelectedColor() : 'color: #1a73e8'"
            >
              {{
                item.bookingNumber != null || item.bookingNumber != undefined
                  ? item.bookingNumber
                  : "Nil"
              }}
            </td>
            <td
              v-for="(header, index) in headers"
              :key="index"
              :style="item.selected ? getSelectedColor() : ''"
            >
              {{
                item[header.value] != null || item[header.value] != undefined
                  ? item[header.value]
                  : "Nil"
              }}
            </td>
            <td :style="item.selected ? getSelectedColor() : ''">
              {{
                item.date != null || item.date != undefined
                  ? momentLocal(item.date)
                  : "Nil"
              }}
            </td>

            <td class="table-report__action w-56">
              <div class="flex justify-center items-center">
                <a
                  @Click="addOrder(item)"
                  class="flex items-center mr-3"
                  href="javascript:;"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="Select Orders"
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

  <!-- BEGIN: Add  Modal -->

  <MoveableModal
    :show="addDespatch"
    @hidden="addDespatch = false"
    backdrop="static"
    size="modal-lg"
    :title="formTitle"
    @close="addDespatch = false"
  >
    <ModalBody
      class="
        grid
        lg:grid-cols-2
        md:grid-cols-2
        grid-cols-1
        lg:gap-4
        md:gap-4
        gap-2
      "
    >
      <div>
        <label for="regular-form-1" class="form-label">Booking Number</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataDespatch.bookingNumber"
            type="text"
            class="form-control"
            placeholder="Booking Number"
          />
        </div>
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Courier</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataDespatch.courier"
            type="text"
            class="form-control"
            placeholder="Courier"
          />
        </div>
      </div>

      <div class="w-full">
        <label for="regular-form-1" class="form-label">Date</label>

        <PreviewComponent class="intro-y">
          <div class="">
            <Preview>
              <Litepicker
                v-model="formDataDespatch.date"
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

      <div v-if="titleChange === -1">
        <label for="regular-form-1" class="form-label">Vehicle Number</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataDespatch.vehicleNumber"
            type="text"
            class="form-control"
            placeholder="Vehicle Number"
          />
        </div>
      </div>

      <div v-if="titleChange === -1">
        <label for="regular-form-1" class="form-label">Driver Name</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataDespatch.driverName"
            type="text"
            class="form-control"
            placeholder="Driver Name"
          />
        </div>
      </div>

      <div v-if="titleChange === -1">
        <label for="regular-form-1" class="form-label"
          >Driver Phone Number</label
        >

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataDespatch.driverPhoneNumber"
            type="number"
            class="form-control"
            placeholder="Driver Phone Number"
          />
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

  <!-- BEGIN: Archive Modal -->
  <Modal
    :show="archiveModal"
    @hidden="archiveModal = false"
    size="modal-xl"
    backdrop="static"
  >
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="
            text-danger
            float-right
            lg:w-8 lg:h-8
            md:w-7 md:h-7
            w-6
            h-6
            cursor-pointer
          "
          @click="archiveModal = false"
        />
      </div>

      <div class="p-5 text-center lg:text-lg text-base uppercase font-semibold">
        Archived Despatch
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
            class="
              w-6
              h-6
              absolute
              my-auto
              inset-y-0
              mr-3
              right-0
              cursor-pointer
            "
          />
          <XIcon
            @click="clearSearchArchive"
            v-if="searchActiveArchive == true"
            class="
              w-6
              h-6
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
        class="
          intro-y
          lg:flex lg:flex-row lg:flex-wrap lg:items-center
          md:flex md:flex-row md:flex-wrap md:items-center
          flex flex-col
          items-center
          justify-center
          p-2
        "
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
          <option :value="pageSize">{{ pageSize }}</option>
        </select>
      </div>

      <!-- END: Pagination -->
    </ModalBody>
  </Modal>
  <!-- END: Archive Modal -->

  <!-- BEGIN: Confirmation Modals -->
  <ArchiveConfirmModal
    :name="formDataDespatch.bookingNumber"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formDataDespatch.bookingNumber"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formDataDespatch.bookingNumber"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete"
  />
  <!-- END: Confirmation Modals -->

  <!-- BEGIN: Delete Confirmation Modal -->

  <MoveableModal
    :show="qrModal"
    @hidden="qrModal = false"
    backdrop="static"
    size="modal-sm"
    title="QR Code"
    @close="qrModal = false"
  >
    <ModalBody
      class="flex flex-col justify-center items-center space-y-2 w-full"
    >
      <div class="">
        <qrcode-vue
          v-if="formDataDespatch.bookingNumber"
          render-as="svg"
          :value="JSON.stringify(formDataDespatch)"
          size="250"
          level="H"
        />
      </div>

      <div>
        <span
          class="
            lg:text-lg
            md:text-base
            text-base text-black-900
            font-medium
            leading-none
          "
          >{{ formDataDespatch }}</span
        >
      </div>
    </ModalBody>
  </MoveableModal>

  <!-- BEGIN: View Info Modal -->

  <MoveableModal
    :show="despatchInfoModal"
    @hidden="despatchInfoModal = false"
    backdrop="static"
    size="modal-sl-85"
    @close="despatchInfoModal = false"
  >
    <ModalBody class="p-0">
      <!-- BEGIN: INFO -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4 mt-6">
        <div class="p-2">
          <div class="flex">
            <qrcode-vue
              class=""
              v-if="lpnsArrayQR != ''"
              render-as="svg"
              :value="lpnsArrayQR"
              size="50"
              level="H"
              @click="showDetails"
            />
            <div v-if="showLpn" class="fixed bg-white mt-20">
              {{ lpnsArrayQR }}
            </div>
          </div>

          <!-- <BoxIcon class="w-8 h-8 text-danger mx-auto mt-2" /> -->

          <div class="flex justify-between">
            <div>
              <div class="text-xl font-bold mt-5">
                Booking No : {{ formDataDespatch.bookingNumber }}
              </div>
            </div>
            <div>
              <div class="flex mt-5 justify-end items-end space-x-2 mr-4">
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

                <!-- <Dropdown class="w-1/2 sm:w-auto">
            <DropdownToggle class="btn btn-outline-secondary w-full sm:w-auto" @click="generateReport">
             <FileTextIcon class="w-4 h-4 mr-2" /> Download PDF
              <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
            </DropdownToggle>
            <DropdownMenu class="w-40">
              <DropdownContent>
                <DropdownItem @click="generateReport">
                  <FileTextIcon class="w-4 h-4 mr-2" /> Download PDF
                </DropdownItem>
                <DropdownItem @click="onExportCsv">
                  <FileTextIcon class="w-4 h-4 mr-2" /> Download CSV
                </DropdownItem>
                <DropdownItem @click="onExportJson">
                  <FileTextIcon class="w-4 h-4 mr-2" /> Download JSON
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown> -->
              </div>
            </div>
          </div>
        </div>

        <hr />
        <!-- BEGIN: Data List -->

        <div class="intro-y col-span-12 overflow-auto lg:mt-4 md:mt-4 mt-2">
          <table class="table table-report -mt-2 table-auto p-1">
            <thead>
              <tr class="uppercase whitespace-nowrap">
                <th>LPN</th>
                <th
                  class="whitespace-nowrap"
                  v-for="(header, i) in LpnHeaders"
                  :key="i"
                >
                  {{ header.text }}
                </th>
                <th>Date</th>
                <th>Despatched</th>
              </tr>
            </thead>
            <tbody>
              <tr v-show="itemsLpn.length <= 0">
                <td colspan="8">
                  <span
                    class="
                      flex
                      justify-center
                      items-center
                      text-success
                      font-bold
                    "
                    >{{ const_txt.NO_DATA_TABLE }}</span
                  >
                </td>
              </tr>
              <tr v-for="(item, i) in itemsLpn" :key="i" class="intro-x">
                <td
                  @click="
                    viewItemLpnProduct(item);
                    item.clicked = true;
                  "
                  class="cursor-pointer text-indigo-400 font-semibold w-24"
                  :style="item.clicked ? getSelectedColor() : ''"
                >
                  {{
                    item.lpn != null || item.lpn != undefined ? item.lpn : "Nil"
                  }}
                </td>
                <td
                  v-for="(header, index) in LpnHeaders"
                  :key="index"
                  :style="item.clicked ? getSelectedColor() : ''"
                >
                  {{
                    item[header.value] != null ||
                    item[header.value] != undefined
                      ? item[header.value]
                      : "Nil"
                  }}
                </td>
                <td :style="item.clicked ? getSelectedColor() : ''">
                  {{
                    item.date != null || item.date != undefined
                      ? momentLocal(item.date)
                      : "Nil"
                  }}
                </td>
                <td :style="item.clicked ? getSelectedColor() : ''">
                  <div
                    class="flex justify-center space-x-1 rounded-2xl p-1"
                    :class="
                      item.isDespatched
                        ? 'bg-green-700 text-white'
                        : 'bg-red-700 text-white'
                    "
                  >
                    {{
                      item.isDespatched != null ||
                      item.isDespatched != undefined
                        ? getBooleanStatus(item.isDespatched)
                        : "Nil"
                    }}
                  </div>
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
                          :value="item.lpn"
                          v-model="checkedLpns"
                        />
                      </Tippy>
                    </a>
                    <a
                      @Click="print(item)"
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
                      @click="generate(item)"
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
            </tbody>
          </table>
        </div>

        <!-- END: Data List -->

        <!-- <div
          v-if="itemsDataLpn.totalCount == 0"
          class="mb-5 border-2 shadow-md p-2 font-semibold w-full col-span-12 text-center"
        >
          No Data
        </div> -->
      </div>
      <!-- END: INFO -->
    </ModalBody>
  </MoveableModal>
  <!-- END: View Info Modal-->

  <!-- BEGIN: View Lpn Product Info Modal -->

  <MoveableModal
    :show="lpnProductInfoModal"
    @hidden="lpnProductInfoModal = false"
    backdrop="static"
    size="modal-sl-75"
    :title="'LPN : ' + this.formDataLpn.lpn"
    @close="lpnProductInfoModal = false"
  >
    <ModalBody class="p-0">
      <!-- BEGIN: INFO -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4 mt-6">
        <!-- BEGIN: Data List -->

        <div class="intro-y col-span-12 overflow-auto md:mt-4 mt-2">
          <table class="table table-report -mt-2 table-auto">
            <thead>
              <tr class="uppercase whitespace-nowrap">
                <th
                  class="whitespace-nowrap"
                  v-for="(header, i) in lpnProductHeaders"
                  :key="i"
                >
                  {{ header.text }}
                </th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-show="itemsLpn.length <= 0">
                <td colspan="12">
                  <span
                    class="
                      flex
                      justify-center
                      items-center
                      text-success
                      font-bold
                    "
                    >{{ const_txt.NO_DATA_TABLE }}</span
                  >
                </td>
              </tr>
              <tr v-for="(item, i) in itemsLpnProduct" :key="i" class="intro-x">
                <td
                  v-for="(header, index) in lpnProductHeaders"
                  :key="index"
                  class="cursor-pointer"
                >
                  {{
                    item[header.value] != null ||
                    item[header.value] != undefined
                      ? item[header.value]
                      : "Nil"
                  }}
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
                      {{
                        item.description != null ||
                        item.description != undefined
                          ? item.description
                          : "Nil"
                      }}
                    </Tippy>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- END: Data List -->

        <!-- <div
          v-if="itemsDataLpn.totalCount == 0"
          class="mb-5 border-2 shadow-md p-2 font-semibold w-full col-span-12 text-center"
        >
          No Data
        </div> -->
      </div>
      <!-- END: INFO -->
    </ModalBody>
  </MoveableModal>
  <!-- END: View Lpn Product Info Modal-->

  <!-- BEGIN: Add order Modal -->

  <MoveableModal
    :show="viewOrderModal"
    @hidden="viewOrderModal = false"
    backdrop="static"
    size="modal-sl-80"
    @close="viewOrderModal = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center lg:text-lg text-base uppercase font-semibold">
        Booking Number - {{ formDataDespatch.bookingNumber }}
      </div>
      <hr />
      <div class="w-full sm:w-auto mt-3 sm:mt-0 p-3">
        <div
          class="
            lg:flex lg:flex-row
            md:flex md:flex-row
            flex flex-col
            justify-end
            items-start
          "
        >
          <a
            v-if="!addOrderModal"
            href="javascript:;"
            @click="addOrderOption()"
            class="btn btn-primary shadow-md text-xs lg:text-sm"
          >
            Select Orders
          </a>
          <div
            v-if="addOrderModal"
            class="
              lg:flex lg:flex-row lg:justify-end lg:items-end
              md:flex md:flex-row md:justify-end md:items-end
              flex flex-col
              justify-center
              items-start
              w-full
            "
          >
            <div class="flex flex-col w-full space-y-1">
              <label for="regular-form-1" class="form-label"
                >Order Number</label
              >
              <TomSelect
                v-model="formDataOrder.orderNumber"
                :options="{
                  placeholder: 'Search..',
                }"
                class="w-full"
              >
                <option v-if="orderChange != -1">
                  {{ formDataOrder.orderNumber }}
                </option>
                <option v-if="orderChange == -1" value=""></option>
                <option
                  :value="item.customerOrderId"
                  v-for="(item, i) in customerOrders"
                  :key="i"
                >
                  {{ item.orderNumber }}
                </option>
              </TomSelect>
            </div>

            <div class="mt-2 lg:ml-2 md:ml-2 flex">
              <button
                type="button"
                @click="addOrderModal = false"
                class="btn btn-outline-secondary w-24 mr-1"
              >
                {{ const_txt.CANCEL_BTN }}
              </button>
              <button
                @click="saveOrder()"
                type="submit"
                class="btn btn-primary w-24 mr-1"
              >
                {{ formOrderTitle }}
              </button>
            </div>
          </div>
          <div class="hidden md:block mx-auto text-slate-500">
            <!-- Showing 1 to 10 of 150 entries -->
          </div>
        </div>
      </div>
      <!-- SEARCH -->
      <div class="w-full sm:w-auto mt-3 sm:mt-0">
        <div class="w-full relative text-slate-500">
          <input
            type="text"
            class="form-control w-full box pr-10"
            placeholder="Search..."
            v-model="searchDataOrder"
            @change="searchOnchangeOrder"
          />
          <SearchIcon
            @click="searchItemOrder"
            v-if="!searchActiveOrder"
            class="
              w-6
              h-6
              absolute
              my-auto
              inset-y-0
              mr-3
              right-0
              cursor-pointer
            "
          />
          <XIcon
            @click="clearSearchOrder"
            v-if="searchActiveOrder"
            class="
              w-6
              h-6
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
      <!-- BEGIN: Archive Data List -->
      <!-- <div
        class="p-5 text-center text-lg"
        v-if="this.archiveData.totalCount == 0"
      >
        No data
      </div> -->
      <div class="intro-y col-span-12 overflow-auto p-4">
        <table class="table table-report -mt-2">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in orderHeaders"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>Type</th>
              <th>Status</th>
              <th>Time</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in orderLocal" :key="i" class="intro-x">
              <td v-for="(header, index) in orderHeaders" :key="index">
                {{ item[header.value] }}
              </td>
              <td>
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
                    w-20
                  "
                  :style="getTypeColor(item.type)"
                >
                  {{ getType(item.type) }}
                </div>
              </td>
              <td>
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
                    w-24
                  "
                  :style="getStatusColor(item.status)"
                >
                  {{ getStatus(item.status) }}
                </div>
              </td>
              <td>
                {{ momentLocal(item.time) }}
              </td>
              <td class="w-24">
                <div class="text-left line-clamp-2">
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    :content="item.note"
                    :options="{
                      zIndex: 99999,
                    }"
                  >
                    {{ item.note }}
                  </Tippy>
                </div>
              </td>

              <!-- <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <a
                    @click="editItemOption(item)"
                    class="flex items-center mr-3 text-blue-900"
                    href="javascript:;"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Edit"
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
                    class="flex items-center text-danger"
                    href="javascript:;"
                    @click="archiveItemOption(item)"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="Archive"
                      :options="{
                        zIndex: 99999,
                      }"
                    >
                      <ArchiveIcon
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
      <!-- BEGIN: Pagination -->

      <div
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
            margin-bottom: 10px;
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
      <!-- END: Archive Data List -->
    </ModalBody>
  </MoveableModal>
  <!-- END: Add order Modal -->
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
import QrcodeVue from "qrcode.vue";
import Tabulator from "tabulator-tables";
import VueHtml2pdf from "vue-html2pdf";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { const_txt } from "../../../global-functions/const";
//import Vue from "vue";
//Vue.component("qrcode-vue", QrcodeVue);

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import router from "../../../router";

import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../../global-functions/functions";

import { exportCSVFile } from "../../../global-functions/functions";

import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Dispatch");
  },
  components: {
    paginate: Paginate,
    QrcodeVue,
    VueHtml2pdf,
    Loading,
    autoTable,
  },
  data() {
    return {
      const_txt: const_txt,
      isLoading: false,
      printStatus: 0,
      despatchInfoModal: false,
      lpnProductInfoModal: false,
      qrModal: false,
      searchData: "",
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,
      addDespatch: false,
      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,
      titleChange: -1,
      formDataDespatch: {
        bookingNumber: "",
        courier: "",
        date: "",
        vehicleNumber: "",
        driverName: "",
        driverPhoneNumber: "",
        // lpns: { lpn: "", date: "",addedBy: "",isDespatched: "",verifiedBy: "",verifiedAt: "",orderId: "",despatch: "" },
      },
      formDataDespatchDefault: {
        bookingNumber: "",
        courier: "",
        date: "",
        vehicleNumber: "",
        driverName: "",
        driverPhoneNumber: "",
        //  lpns: { lpn: "", date: "",addedBy: "",isDespatched: "",verifiedBy: "",verifiedAt: "",orderId: "",despatch: "" },
      },

      rules: {
        bookingNumber: {
          required,
          minLength: minLength(2),
        },
        courier: {
          required,
          minLength: minLength(2),
        },
        date: {
          required,
          maxLength: maxLength(10),
        },
        vehicleNumber: {
          required,
          maxLength: maxLength(10),
        },
        driverName: {
          required,
          maxLength: maxLength(10),
        },
        driverPhoneNumber: {
          required,
          maxLength: maxLength(10),
        },
      },

      headers: [
        // { text: "Booking Number", value: "bookingNumber" },
        { text: "Driver Name", value: "driverName" },
        { text: "Vehicle No", value: "vehicleNumber" },
        { text: "Driver Phone No", value: "driverPhoneNumber" },
        { text: "Courier", value: "courier" },
        // { text: "Date", value: "date" },
      ],
      LpnHeaders: [
        // { text: "LPN", value: "lpn" },
        { text: "Order", value: "orderId" },
        { text: "Despatch", value: "despatch" },
        { text: "Added By", value: "addedBy" },
        // { text: "Is Despatched", value: "isDespatched" },
        { text: "Verified By", value: "verifiedBy" },
        { text: "Verified At", value: "verifiedAt" },
      ],

      lpnProductHeaders: [
        { text: "Order Number", value: "orderNumber" },
        { text: "PLU/SKU", value: "sku" },
        { text: "BARCODE/EAN", value: "ean" },
        { text: "Warehouse", value: "warehouse" },
        { text: "Storage Section", value: "storageSection" },
        { text: "Storage Bin", value: "storageBin" },
        { text: "Storage Type", value: "storageType" },
        { text: "QTY", value: "quantity" },
        { text: "Expiry Date", value: "expiryDate" },
        { text: "Picked", value: "picked" },
        { text: "Not Picked", value: "notPicked" },
        // { text: "Description", value: "description" },
      ],

      addOrderModal: false,
      viewOrderModal: false,

      orderHeaders: [
        { text: "Order Number", value: "orderNumber" },
        // { text: "despatchBookingNumber", value: "despatchBookingNumber" },
        // { text: "despatch", value: "despatch" },
        { text: "Customer", value: "customer" },
        { text: "Delivery Address", value: "deliveryAddress" },
        { text: "Amount", value: "amount" },

        { text: "Discount Percentage", value: "discountPercentage" },
        { text: "Discount Total", value: "discountTotal" },
        // { text: "Note", value: "note" },
        // { text: "Time", value: "time" },
        // { text: "Type", value: "type" },
        // { text: "Status", value: "status" },
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

      itemsLpn: [],
      itemsDataLpn: [],
      doc: null,
      pdf: null,
      lpnsArrayQR: [],
      showLpn: false,

      itemsLpnProduct: [],
      itemsDataLpnProduct: [],

      formDataLpn: {
        lpn: "",
      },

      formDataOrder: {
        bookingNumber: "",
        orderNumber: "",
      },
      formDataOrderDefault: {
        bookingNumber: "",
        orderNumber: "",
      },
      orderTitle: -1,
      itemOrder: [],
      itemDataOrder: [],

      pageCountOrder: 20,
      pageSizeOrder: 5,
      paginationOrder: {
        pageNumber: 1,
        pageSize: 5,
        search: "",
      },
      defaultPaginationOrder: {
        pageNumber: 1,
        pageSize: 5,
        search: "",
      },
      customerOrders: [],
      checkedLpns: [],
      selectedItemsLpn: [],
      despatchId: "",

      pageCountProduct: 0,
      pageRowCountProduct: 5,
      productStart: 0,
      productEnd: 5,
      orderLocal: [],

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

      type: [
        { value: 0, name: "Type 0" },
        { value: 1, name: "Type 1" },
      ],
      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,
    };
  },
  setup() {
    const tabulator = ref();
    // const filter = reactive({
    //   username: "",
    //   password: "",
    // });

    // const login = () => {
    //   // login method
    // };
    // return {
    //   login,
    //   state,
    // };
  },
  filters: {
    moment: function (date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
  },
  computed: {
    formTitle() {
      return this.titleChange === -1 ? "Add New Despatch" : "Edit Despatch";
    },
    formOrderTitle() {
      return this.orderTitle === -1 ? const_txt.SAVE_BTN : const_txt.UPDATE_BTN;
    },
    formLPNTitle() {
      return this.titleLPNChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },
    btnName() {
      return this.titleChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },
  },
  watch: {
    despatchInfoModal(val) {
      val || this.despatchInfoModalClose();
    },
    lpnProductInfoModal(val) {
      val || this.closeFormProduct();
    },
  },
  created() {
    this.getDataFromApi();
  },
  methods: {
    setReports() {
      if (this.allItems <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        const columns = [
          { title: "Booking No", dataKey: "bookingNumber" },
          { title: "Driver Name", dataKey: "driverName" },
          { title: "Vehicle No", dataKey: "vehicleNumber" },
          { title: "Driver Phone No", dataKey: "driverPhoneNumber" },
          { title: "Courier", dataKey: "courier" },
          { title: "Date", dataKey: "date" },
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
            bookingNumber: el.bookingNumber,
            driverName: el.driverName,
            vehicleNumber: el.vehicleNumber,
            driverPhoneNumber: el.driverPhoneNumber,
            courier: el.courier,
            date: el.date,
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
      this.docs.save(`${"Despatch " + generateDate}.pdf`);
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
        var csvTitle = "Despatch " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "Booking No",
          2: "Driver Name",
          3: "Vehicle No",
          4: "Driver Phone No",
          5: "Courier",
          6: "Date",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.bookingNumber,
            2: item.driverName,
            3: item.vehicleNumber,
            4: item.driverPhoneNumber,
            5: item.courier,
            6: item.date,
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
        .post("Despatches/Paginated", pagination)
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
    getStatus(status) {
      switch (status) {
        case 0:
          return "DRAFT";

        case 1:
          return "NEW";

        case 2:
          return "ACCEPTED";

        case 3:
          return "PICKED";

        case 4:
          return "PROCESS";

        case 5:
          return "COMPLETE";

        case 6:
          return "DESPATCH";
      }
    },

    getStatusColor(status) {
      switch (status) {
        case 0:
          return "background-color: blue; ";

        case 1:
          return "background-color: chocolate;";

        case 2:
          return "background-color: green;";

        case 3:
          return "background-color: purple";

        case 4:
          return "background-color: orange";

        case 5:
          return "background-color: lime";

        case 6:
          return "background-color: maroon";
      }
    },

    getType(type) {
      switch (type) {
        case 0:
          return "Type 0";

        case 1:
          return "Type 1";
      }
    },

    getTypeColor(type) {
      switch (type) {
        case 0:
          return "background-color: blue; ";

        case 1:
          return "background-color: chocolate;";
      }
    },
    changePageProduct(pageNum) {
      this.productEnd = this.pageRowCountProduct * pageNum;
      this.productStart = this.productEnd - this.pageRowCountProduct;
      this.orderLocal = this.itemOrder.slice(
        this.productStart,
        this.productEnd
      );
    },
    viewLpnProducts() {
      this.viewLpnProductsModal = true;
    },
    showDetails() {
      if (this.showLpn) {
        this.showLpn = false;
      } else {
        this.showLpn = true;
        //  console.log(this.lpnsArrayQR);
      }
    },

    setSelectReport() {
      var newArray = [];
      for (var x = 0; x < this.checkedLpns.length; x++) {
        for (var y = 0; y < this.itemsLpn.length; y++) {
          var result = this.itemsLpn.filter((obj) => {
            return obj.lpn === this.checkedLpns[x];
          });

          newArray.push(result[0]);
        }
      }

      newArray = newArray.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.lpn == value.lpn)
      );
      this.selectedItemsLpn = newArray;
    },
    setReport() {
      if (this.checkedLpns.length > 0) {
        this.setSelectReport();
        var itemsLpn = this.selectedItemsLpn;
      } else {
        var itemsLpn = this.itemsLpn;
      }

      // const columns = [
      //   { title: "LPN", dataKey: "lpn" },
      //   { title: "Order", dataKey: "orderId" },
      //   { title: "Despatch", dataKey: "despatch" },
      //   { title: "Added By", dataKey: "addedBy" },
      //   { title: "Is Despatched", dataKey: "isDespatched" },
      //   { title: "Verified By", dataKey: "verifiedBy" },
      //   { title: "Verified At", dataKey: "verifiedAt" },
      //   { title: "Date", dataKey: "date" },
      // ];

      this.doc = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: "a4",
      });

      let data = [];
      let i = 0;
      let obj;

      itemsLpn.forEach((el) => {
        obj = {
          lpn: el.lpn,
          orderId: el.orderId,
          despatch: el.despatch,
          addedBy: el.addedBy,
          isDespatched: el.isDespatched,
          verifiedBy: el.verifiedBy,
          verifiedAt: el.verifiedAt,
          date: this.momentLocal(el.date),
        };
        //i++;
        data.push(obj);
        //   console.log(obj);
      });
      //console.log("DATA", data);

      for (var j = 0; j < data.length; j++) {
        var imgData = "/src/assets/images/pl_logo2.png";
        this.doc.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
        this.doc
          .setFontSize(16)
          .text(
            "Booking Number : " + this.formDataDespatch.bookingNumber,
            5,
            1.2
          );

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

        this.doc.setFontSize(12).text("WAREHOUSE PTE LTD", 5.2, 2.7);
        this.doc.setFontSize(12).text("63 Bank St,", 5.2, 2.9);
        this.doc.setFontSize(12).text("P.O.Box 451,Ba,", 5.2, 3.1);
        this.doc.setFontSize(12).text("Fiji Islands", 5.2, 3.3);
        this.doc.setFontSize(12).text("Ph: 6674923", 5.2, 3.5);
        this.doc.setFontSize(12).text("Fax: 6670128", 5.2, 3.7);
        this.doc.setFontSize(12).text("Email: clint.com.fj", 5.2, 3.9);

        var j_lpn = data[j].lpn;
        var j_orderId = data[j].orderId.toString();
        var j_despatch = data[j].despatch;
        var j_isDespatched = data[j].isDespatched.toString();
        var j_addedBy = data[j].addedBy;
        var j_verifiedBy = data[j].verifiedBy;
        var j_verifiedAt = data[j].verifiedAt;
        var j_date = this.momentLocal(data[j].date).toString();

        if (!j_lpn) {
          j_lpn = "Nil";
        }
        if (!j_orderId) {
          j_orderId = "Nil";
        }
        if (!j_despatch) {
          j_despatch = "Nil";
        }
        if (!j_isDespatched) {
          j_isDespatched = "Nil";
        }
        if (!j_addedBy) {
          j_addedBy = "Nil";
        }
        if (!j_verifiedBy) {
          j_verifiedBy = "Nil";
        }
        if (!j_verifiedAt) {
          j_verifiedAt = "Nil";
        }
        if (!j_date) {
          j_date = "Nil";
        }

        //lpn heading
        this.doc.setLineWidth(0.01).line(0.5, 4.1, 8.0, 4.1);
        this.doc.setFontSize(14).text("LPN Info", 0.5, 4.3);

        this.doc.setFontSize(12).text("LPN", 0.5, 4.5);
        this.doc.setFontSize(12).text(j_lpn, 1.6, 4.5);

        this.doc.setFontSize(12).text("Order", 0.5, 4.7);
        this.doc.setFontSize(12).text(j_orderId, 1.6, 4.7);

        this.doc.setFontSize(12).text("Despatch", 0.5, 4.9);
        this.doc.setFontSize(12).text(j_despatch, 1.6, 4.9);

        this.doc.setFontSize(12).text("Despatched", 0.5, 5.1);
        this.doc.setFontSize(12).text(j_isDespatched, 1.6, 5.1);

        this.doc.setFontSize(12).text("Added By", 5, 4.5);
        this.doc.setFontSize(12).text(j_addedBy, 6.1, 4.5);

        this.doc.setFontSize(12).text("Verified By", 5, 4.7);
        this.doc.setFontSize(12).text(j_verifiedBy, 6.1, 4.7);

        this.doc.setFontSize(12).text("Verified At", 5, 4.9);
        this.doc.setFontSize(12).text(j_verifiedAt, 6.1, 4.9);

        this.doc.setFontSize(12).text("Date", 5, 5.1);
        this.doc.setFontSize(12).text(j_date, 6.1, 5.1);

        // autoTable(this.doc, {
        //   // columns,
        //   // body: data[i],

        //   head: [
        //     [
        //       "LPN",
        //       "Order",
        //       "Despatch",
        //       "Added By",
        //       "Is Despatched",
        //       "Verified By",
        //       "Verified At",
        //       "Date",
        //     ],
        //   ],
        //   body: [
        //     [
        //       data[j].lpn,
        //       data[j].orderId,
        //       data[j].despatch,
        //       data[j].addedBy,
        //       data[j].isDespatched,
        //       data[j].verifiedBy,
        //       data[j].verifiedAt,
        //       data[j].date,
        //     ],
        //   ],

        //   margin: { left: 0.5, top: 4.4 },
        //   headStyles: { fillColor: [22, 78, 99] },
        // });

        //Product heading
        this.doc.setLineWidth(0.01).line(0.5, 5.5, 8.0, 5.5);
        this.doc.setFontSize(14).text("PRODUCT", 0.5, 5.8);

        // const columns = [
        //   { title: "Order Number", dataKey: "orderNumber" },
        //   { title: "PLU/SKU", dataKey: "sku" },
        //   { title: "BARCODE/EAN", dataKey: "ean" },
        //   { title: "Warehouse", dataKey: "warehouse" },
        //   { title: "Storage Section", dataKey: "storageSection" },
        //   { title: "Storage Bin", dataKey: "storageBin" },
        //   { title: "Storage Type", dataKey: "storageType" },
        //   { title: "QTY", dataKey: "quantity" },
        //   { title: "Expiry Date", dataKey: "expiryDate" },
        //   { title: "Picked", dataKey: "picked" },
        //   { title: "Not Picked", dataKey: "notPicked" },
        //   { title: "Description", dataKey: "description" },
        // ];

        // var getlpn = this.formDataLpn.lpn;
        // var itemsLpnProducts;
        // axios.post("Despatches/Lpns/" + getlpn).then((response) => {
        //   if (response.data.success === true) {
        //     this.itemsLpnProducts = response.data.data.pickedProducts;
        //   } else {
        //     warningToast(response.data.message);
        //     this.isLoading = false;
        //   }
        // });

        // let data2 = [];
        // let obj2;

        // itemsLpnProducts.forEach((el) => {
        //   obj2 = {
        //     orderNumber: el.orderNumber,
        //     sku: el.sku,
        //     ean: el.ean,
        //     warehouse: el.warehouse,
        //     storageSection: el.storageSection,
        //     storageBin: el.storageBin,
        //     storageType: el.storageType,
        //     quantity: el.quantity,
        //     expiryDate: this.momentLocal(el.expiryDate),
        //     picked: el.picked,
        //     notPicked: el.notPicked,
        //     description: el.description,
        //   };

        //   data2.push(obj2);
        // });

        // for (var k = 0; k < data2.length; k++) {
        //   autoTable(this.doc, {
        //     columns,
        //     body: data2[k],

        //     margin: { left: 0.5, top: 6.0 },
        //     headStyles: { fillColor: [22, 78, 99] },
        //   });
        // }

        if (j < data.length - 1) {
          this.doc.addPage();
        }
      }
    },
    setReportChecked() {
      var bookingNo = this.formDataDespatch.bookingNumber;
      //  console.log("bn", bookingNo);
      axios.get("Despatches/" + bookingNo).then((response) => {
        this.itemsDataLpn = response.data.data;
        this.itemsLpn = response.data.data.lpns;

        // this.pageCount = this.itemsData.totalPages;
      });

      const columns = [
        { title: "LPN", dataKey: "lpn" },
        { title: "Order", dataKey: "orderId" },
        { title: "Despatch", dataKey: "despatch" },
        { title: "Added By", dataKey: "addedBy" },
        { title: "Is Despatched", dataKey: "isDespatched" },
        { title: "Verified By", dataKey: "verifiedBy" },
        { title: "Verified At", dataKey: "verifiedAt" },
        { title: "Date", dataKey: "date" },
      ];
      this.doc = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: "a4",
      });

      let data = [];
      let i = 0;
      let obj;

      this.itemsLpn.forEach((el) => {
        obj = {
          lpn: el.lpn,
          orderId: el.orderId,
          despatch: el.despatch,
          addedBy: el.addedBy,
          isDespatched: el.isDespatched,
          verifiedBy: el.verifiedBy,
          verifiedAt: el.verifiedAt,
          date: this.momentLocal(el.date),
        };
        //i++;
        data.push(obj);
        //   console.log(obj);
      });
      //console.log("DATA", data);
      var j_lpn = data[j].lpn;
      var j_orderId = data[j].orderId.toString();
      var j_despatch = data[j].despatch;
      var j_isDespatched = data[j].isDespatched.toString();
      var j_addedBy = data[j].addedBy;
      var j_verifiedBy = data[j].verifiedBy;
      var j_verifiedAt = data[j].verifiedAt;
      var j_date = this.momentLocal(data[j].date).toString();

      if (!j_lpn) {
        j_lpn = "Nil";
      }
      if (!j_orderId) {
        j_orderId = "Nil";
      }
      if (!j_despatch) {
        j_despatch = "Nil";
      }
      if (!j_isDespatched) {
        j_isDespatched = "Nil";
      }
      if (!j_addedBy) {
        j_addedBy = "Nil";
      }
      if (!j_verifiedBy) {
        j_verifiedBy = "Nil";
      }
      if (!j_verifiedAt) {
        j_verifiedAt = "Nil";
      }
      if (!j_date) {
        j_date = "Nil";
      }

      for (var j = 0; j < data.length; j++) {
        var imgData = "/src/assets/images/pl_logo2.png";
        this.doc.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
        this.doc
          .setFontSize(16)
          .text(
            "Booking Number : " + this.formDataDespatch.bookingNumber,
            5,
            1.2
          );

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

        this.doc.setFontSize(12).text("WAREHOUSE PTE LTD", 5.2, 2.7);
        this.doc.setFontSize(12).text("63 Bank St,", 5.2, 2.9);
        this.doc.setFontSize(12).text("P.O.Box 451,Ba,", 5.2, 3.1);
        this.doc.setFontSize(12).text("Fiji Islands", 5.2, 3.3);
        this.doc.setFontSize(12).text("Ph: 6674923", 5.2, 3.5);
        this.doc.setFontSize(12).text("Fax: 6670128", 5.2, 3.7);
        this.doc.setFontSize(12).text("Email: clint.com.fj", 5.2, 3.9);

        //lpn heading
        this.doc.setLineWidth(0.01).line(0.5, 4.1, 8.0, 4.1);
        // this.doc.setFontSize(14).text("LPN Info", 0.5, 4.3);

        this.doc.setFontSize(12).text("LPN", 0.5, 4.5);
        this.doc.setFontSize(12).text(j_lpn, 1.6, 4.5);

        this.doc.setFontSize(12).text("Order", 0.5, 4.7);
        this.doc.setFontSize(12).text(j_orderId.toString(), 1.6, 4.7);

        this.doc.setFontSize(12).text("Despatch", 0.5, 4.9);
        this.doc.setFontSize(12).text(j_despatch, 1.6, 4.9);

        this.doc.setFontSize(12).text("Despatched", 0.5, 5.1);
        this.doc.setFontSize(12).text(j_isDespatched.toString(), 1.6, 5.1);

        this.doc.setFontSize(12).text("Added By", 5, 4.5);
        this.doc.setFontSize(12).text(j_addedBy, 6.1, 4.5);

        this.doc.setFontSize(12).text("Verified By", 5, 4.7);
        this.doc.setFontSize(12).text(j_verifiedBy, 6.1, 4.7);

        this.doc.setFontSize(12).text("Verified At", 5, 4.9);
        this.doc.setFontSize(12).text(j_verifiedAt, 6.1, 4.9);

        this.doc.setFontSize(12).text("Date", 5, 5.1);
        this.doc
          .setFontSize(12)
          .text(this.momentLocal(j_date).toString(), 6.1, 5.1);

        // autoTable(this.doc, {
        //   // columns,
        //   // body: data[i],

        //   head: [
        //     [
        //       "LPN",
        //       "Order",
        //       "Despatch",
        //       "Added By",
        //       "Is Despatched",
        //       "Verified By",
        //       "Verified At",
        //       "Date",
        //     ],
        //   ],
        //   body: [
        //     [
        //       data[j].lpn,
        //       data[j].orderId,
        //       data[j].despatch,
        //       data[j].addedBy,
        //       data[j].isDespatched,
        //       data[j].verifiedBy,
        //       data[j].verifiedAt,
        //       data[j].date,
        //     ],
        //   ],

        //   margin: { left: 0.5, top: 4.4 },
        //   headStyles: { fillColor: [22, 78, 99] },
        // });

        //Product heading
        this.doc.setLineWidth(0.01).line(0.5, 5.5, 8.0, 5.5);
        this.doc.setFontSize(14).text("PRODUCT", 0.5, 5.8);

        // autoTable(this.doc, {
        //   // columns,
        //   // body: data[i],

        //   head: [["Item", "Product Name", "Description", "Quantity"]],
        //   body: [
        //     ["1", "Product-1", "ABHTFD", "100"],
        //     ["2", "Product-2", "GGRVD", "120"],
        //     ["3", "Product-2", "OOFRGS", "400"],
        //   ],

        //   margin: { left: 0.5, top: 6.0 },
        //   headStyles: { fillColor: [22, 78, 99] },
        // });

        if (j < data.length - 1) {
          this.doc.addPage();
        }
      }
    },
    //multi-page download
    generateReport() {
      this.setReport();
      var generateDate = new Date().toLocaleString();
      this.doc.save(
        `${this.formDataDespatch.bookingNumber + "_" + generateDate}.pdf`
      );
    },

    report(item) {
      this.pdf = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: "a4",
      });

      var imgData = "/src/assets/images/pl_logo2.png";
      this.pdf.addImage(imgData, "JPEG", 0.5, 0.5, 2.5, 1.5);
      this.pdf
        .setFontSize(16)
        .text(
          "Booking Number : " + this.formDataDespatch.bookingNumber,
          5,
          1.2
        );

      var j_lpn = item.lpn;
      var j_orderId = item.orderId.toString();
      var j_despatch = item.despatch;
      var j_isDespatched = item.isDespatched.toString();
      var j_addedBy = item.addedBy;
      var j_verifiedBy = item.verifiedBy;
      var j_verifiedAt = item.verifiedAt;
      var j_date = this.momentLocal(item.date).toString();

      if (!j_lpn) {
        j_lpn = "Nil";
      }
      if (!j_orderId) {
        j_orderId = "Nil";
      }
      if (!j_despatch) {
        j_despatch = "Nil";
      }
      if (!j_isDespatched) {
        j_isDespatched = "Nil";
      }
      if (!j_addedBy) {
        j_addedBy = "Nil";
      }
      if (!j_verifiedBy) {
        j_verifiedBy = "Nil";
      }
      if (!j_verifiedAt) {
        j_verifiedAt = "Nil";
      }
      if (!j_date) {
        j_date = "Nil";
      }

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

      this.pdf.setFontSize(12).text("WAREHOUSE PTE LTD", 5.2, 2.7);
      this.pdf.setFontSize(12).text("63 Bank St,", 5.2, 2.9);
      this.pdf.setFontSize(12).text("P.O.Box 451,Ba,", 5.2, 3.1);
      this.pdf.setFontSize(12).text("Fiji Islands", 5.2, 3.3);
      this.pdf.setFontSize(12).text("Ph: 6674923", 5.2, 3.5);
      this.pdf.setFontSize(12).text("Fax: 6670128", 5.2, 3.7);
      this.pdf.setFontSize(12).text("Email: clint.com.fj", 5.2, 3.9);

      //lpn heading
      this.pdf.setLineWidth(0.01).line(0.5, 4.1, 8.0, 4.1);
      this.pdf.setFontSize(14).text("LPN Info", 0.5, 4.3);

      this.pdf.setFontSize(12).text("LPN", 0.5, 4.5);
      this.pdf.setFontSize(12).text(j_lpn, 1.6, 4.5);

      this.pdf.setFontSize(12).text("Order", 0.5, 4.7);
      this.pdf.setFontSize(12).text(j_orderId.toString(), 1.6, 4.7);

      this.pdf.setFontSize(12).text("Despatch", 0.5, 4.9);
      this.pdf.setFontSize(12).text(j_despatch, 1.6, 4.9);

      this.pdf.setFontSize(12).text("Despatched", 0.5, 5.1);
      this.pdf.setFontSize(12).text(j_isDespatched.toString(), 1.6, 5.1);

      this.pdf.setFontSize(12).text("Added By", 5, 4.5);
      this.pdf.setFontSize(12).text(j_addedBy, 6.1, 4.5);

      this.pdf.setFontSize(12).text("Verified By", 5, 4.7);
      this.pdf.setFontSize(12).text(j_verifiedBy, 6.1, 4.7);

      this.pdf.setFontSize(12).text("Verified At", 5, 4.9);
      this.pdf.setFontSize(12).text(j_verifiedAt, 6.1, 4.9);

      this.pdf.setFontSize(12).text("Date", 5, 5.1);
      this.pdf
        .setFontSize(12)
        .text(this.momentLocal(j_date).toString(), 6.1, 5.1);

      //Product heading
      this.pdf.setLineWidth(0.01).line(0.5, 5.5, 8.0, 5.5);
      this.pdf.setFontSize(14).text("PRODUCT", 0.5, 5.8);

      // autoTable(this.pdf, {
      //   // columns,
      //   // body: data[i],

      //   head: [["Item", "Product Name", "Description", "Quantity"]],
      //   body: [
      //     ["1", "Product-1", "ABHTFD", "100"],
      //     ["2", "Product-2", "GGRVD", "120"],
      //     ["3", "Product-2", "OOFRGS", "400"],
      //   ],

      //   margin: { left: 0.5, top: 6.0 },
      //   headStyles: { fillColor: [22, 78, 99] },
      // });

      // autoTable(this.pdf, {
      //   head: [
      //     [
      //       "LPN",
      //       "Order",
      //       "Despatch",
      //       "Added By",
      //       "Is Despatched",
      //       "Verified By",
      //       "Verified At",
      //       "Date",
      //     ],
      //   ],
      //   body: [
      //     [
      //       item.lpn,
      //       item.orderId,
      //       item.despatch,
      //       item.addedBy,
      //       item.isDespatched,
      //       item.verifiedBy,
      //       item.verifiedAt,
      //       this.momentLocal(item.date),
      //     ],
      //   ],
      //   margin: { left: 0.5, top: 4.4 },
      //   headStyles: { fillColor: [22, 78, 99] },
      // });
    },
    //multi-page download
    // generateReport() {
    //   this.setReport();
    //   var generateDate = new Date().toLocaleString();
    //   this.doc.save(
    //     `${this.formDataDespatch.bookingNumber + "_" + generateDate}.pdf`
    //   );
    // },

    //single-page download
    generate(item) {
      this.report(item);
      var generateDate = new Date().toLocaleString();
      this.pdf.save(
        `${
          this.formDataDespatch.bookingNumber +
          "_" +
          item.lpn +
          "_" +
          generateDate
        }.pdf`
      );
    },

    //multi-page print
    onPrint() {
      this.setReport();
      this.doc.autoPrint();
      this.doc.output("dataurlnewwindow");
    },
    //single-page print
    print(item) {
      this.report(item);
      this.pdf.autoPrint();
      this.pdf.output("dataurlnewwindow");
    },
    // printChecked() {
    //   this.setReportChecked();
    //   this.doc.autoPrint();
    //   this.doc.output("dataurlnewwindow");
    // },
    viewItem(item) {
      this.formDataDespatch = Object.assign({}, item);
      this.despatchInfoModal = true;
      this.getLpn();
    },
    showQrModal(item) {
      this.formDataDespatch = Object.assign({}, item);
      this.qrModal = true;
    },
    momentLocal(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY");
    },
    connectTimetoDate() {
      var currentTime = moment(new Date()).format();
      var splitTime = currentTime.split("T");

      var date = moment(this.formDataDespatch.date).format("YYYY-MM-DD");
      date = date.concat("T").concat(splitTime[1]);
      this.formDataDespatch.date = date;
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
      this.formDataDespatch = Object.assign({}, this.formDataDespatchDefault);
    },
    getLpn() {
      var bookingNo = this.formDataDespatch.bookingNumber;
      this.despatchId = this.formDataDespatch.despatchId;
      this.isLoading = true;
      axios
        .get("Despatches/" + bookingNo)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsDataLpn = response.data.data;
            this.itemsLpn = response.data.data.lpns;

            for (var i = 0; i < this.itemsLpn.length; i++) {
              this.items[i].clicked = false;

              // this.isLoading = false;
            }

            var lpnsArray = [];
            for (var i = 0; i < this.itemsLpn.length; i++) {
              lpnsArray.push(this.itemsLpn[i].lpn);
            }
            this.lpnsArrayQR = lpnsArray.toString();
            this.showLpn = false;
            this.isLoading = false;

            // this.pageCount = this.itemsData.totalPages;
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
    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("Despatches/Paginated", this.pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsData = response.data.data;
            this.items = response.data.data.items;
            this.pageCount = this.itemsData.totalPages;

            for (var i = 0; i < this.items.length; i++) {
              this.items[i].selected = false;

              // this.isLoading = false;
            }

            var items = [
              {
                despatchId: 15,
                bookingNumber: "BN010",
                courier: "land",
                date: "2022-05-05T03:55:26",
                vehicleNumber: "NP ABC 1221",
                driverName: "Nijam",
                driverPhoneNumber: "771234467",
                lpns: [1, 2, 3, 4, 5],
              },
              {
                despatchId: 13,
                bookingNumber: "BN009",
                courier: "Master",
                date: "2022-05-29T17:07:18.712",
                vehicleNumber: "NP BHM 1010",
                driverName: "rahul",
                driverPhoneNumber: "0761234551",
                lpns: [1, 2, 3, 4, 5],
              },
              {
                despatchId: 12,
                bookingNumber: "BN0072",
                courier: "C0072",
                date: "2022-05-22T10:46:22",
                vehicleNumber: "ABC-123",
                driverName: "Driver 7",
                driverPhoneNumber: "752068675",
                lpns: [1, 2, 3, 4, 5],
              },
              {
                despatchId: 9,
                bookingNumber: "BN006",
                courier: "C006",
                date: "2022-05-21T10:37:05",
                vehicleNumber: "EP AER-1238",
                driverName: "Driver 6",
                driverPhoneNumber: "752068691",
                lpns: [1, 2, 3, 4, 5],
              },
              {
                despatchId: 8,
                bookingNumber: "BN005",
                courier: "C005",
                date: "2022-05-20T10:36:27",
                vehicleNumber: "WP WPC-7584",
                driverName: "Driver 5",
                driverPhoneNumber: "752068642",
                lpns: [1, 2, 3, 4, 5],
              },
              {
                despatchId: 7,
                bookingNumber: "BN004",
                courier: "C004",
                date: "2022-05-21T10:35:45",
                vehicleNumber: "UP-WE-1234",
                driverName: "Driver 4",
                driverPhoneNumber: "752067671",
                lpns: [1, 2, 3, 4, 5],
              },
              {
                despatchId: 6,
                bookingNumber: "BN003",
                courier: "C003",
                date: "2022-05-07T10:26:18",
                vehicleNumber: "WP-AC-1234",
                driverName: "Driver 3",
                driverPhoneNumber: "752068672",
                lpns: [1, 2, 3, 4, 5],
              },
              {
                despatchId: 5,
                bookingNumber: "BN002",
                courier: "C002",
                date: "2022-05-06T10:25:34",
                vehicleNumber: "EP-CDE-1234",
                driverName: "Driver 2",
                driverPhoneNumber: "752068679",
                lpns: [1, 2, 3, 4, 5],
              },
              {
                despatchId: 4,
                bookingNumber: "BN001",
                courier: "C001",
                date: "2022-05-21T10:27:41",
                vehicleNumber: "EP-ABC-1234",
                driverName: "Driver 1",
                driverPhoneNumber: "752068671",
                lpns: [1, 2, 3, 4, 5],
              },
            ];

            var lpnsArray = [];
            for (var i = 0; i < this.items.length; i++) {
              console.log(this.items[i].lpns);
              //lpnsArray.push(this.items[i].lpn);
            }

            this.lpnsArrayQR = lpnsArray.toString();
            console.log(this.lpnsArrayQR);
            console.log(lpnsArray);
            this.showLpn = false;
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
      this.addDespatch = true;
    },
    closeForm() {
      this.addDespatch = false;
    },

    despatchInfoModalClose() {
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].selected = false;
        // this.isLoading = false;
        this.despatchInfoModal = false;
      }
    },
    editItem(item) {
      this.titleChange = 0;
      this.formDataDespatch = Object.assign({}, item);
      this.formDataDespatch.date = this.momentLocal(this.formDataDespatch.date);
      this.addDespatch = true;
    },

    saveForm() {
      bookingNumber;
      if (this.formDataDespatch.bookingNumber == "") {
        if (this.formDataDespatch.bookingNumber == "") {
          warningToast("Booking Number Required");
        }
      } else {
        if (this.titleChange === -1) {
          this.isLoading = true;
          this.connectTimetoDate();
          axios
            .post("Despatches", this.formDataDespatch)
            .then((response) => {
              if (response.data.success === true) {
                this.itemsData = response.data.data;
                this.items = response.data.data.items;
                this.addDespatch = false;
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
          var itemId = this.formDataDespatch.despatchId;
          this.isLoading = true;
          axios
            .put("Despatches/" + itemId, this.formDataDespatch)
            .then((response) => {
              if (response.data.success === true) {
                this.itemsData = response.data.data;
                this.items = response.data.data.items;
                this.addDespatch = false;
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
      this.formDataDespatch = Object.assign({}, item);
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
      var itemId = this.formDataDespatch.despatchId;
      this.isLoading = true;
      axios
        .get("Despatches/" + itemId + "/Archive")
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
        .post("Despatches/Archived", this.paginationArchive)
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
      this.formDataDespatch = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.formDataDespatch.despatchId;
      this.isLoading = true;
      axios
        .get("Despatches/" + itemId + "/Restore")
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
      this.formDataDespatch = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataDespatch.despatchId;
      // lpnProductInfoModal;
      axios
        .delete("Despatches/" + itemId)
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

    //product lpn
    viewItemLpnProduct(item) {
      this.formDataLpn = Object.assign({}, item);
      this.lpnProductInfoModal = true;
      this.getLpnProduct();
    },
    closeFormProduct() {
      for (var i = 0; i < this.itemsLpn.length; i++) {
        this.itemsLpn[i].clicked = false;
        // this.isLoading = false;

        this.lpnProductInfoModal = false;
      }
    },
    getLpnProduct() {
      this.isLoading = true;
      var lpn = this.formDataLpn.lpn;
      console.log("this.formDataLpn " + this.formDataLpn);
      console.log("lpn " + lpn);
      axios
        .post("Despatches/Lpns/" + lpn)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsDataLpnProduct = response.data.data;
            this.itemsLpnProduct = response.data.data.pickedProducts;

            // this.pageCount = this.itemsData.totalPages;
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

    //order
    addOrder(item) {
      this.formDataDespatch = Object.assign({}, item);
      this.formDataOrder.bookingNumber = this.formDataDespatch.bookingNumber;
      this.viewOrderModal = true;
      this.addOrderModal = false;
      this.orderTitle = -1;
      this.getOrder();
    },

    closeFormOrder() {
      this.viewOrderModal = false;
    },
    addOrderOption() {
      this.activateModal();
      this.orderTitle = -1;
    },

    searchOnchangeOrder() {
      if (this.searchDataOrder != "") {
        this.searchActiveOrder = true;
        this.searchItemOrder();
      } else {
        this.clearSearchOrder();
      }
    },
    clearSearchOrder() {
      this.searchDataOrder = "";
      this.paginationOrder.search = this.searchDataOrder;
      this.getOrder();
      this.searchActiveOrder = false;
    },
    searchItemOrder() {
      if (this.searchDataOrder != "") {
        this.searchActiveOrder = true;
        this.paginationOrder.search = this.searchDataOrder;
        this.getOrder();
      }
    },

    pageSizeChangeOrder() {
      this.paginationOrder.pageSize = this.pageSizeOrder;
      this.getOrder();
    },
    changePageOrder(pageNum) {
      this.paginationOrder.pageNumber = pageNum;
      this.getOrder();
    },

    activateModal() {
      this.getCustomerOrder();
      this.addOrderModal = true;
    },

    getCustomerOrder() {
      // this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 100 };
      axios
        .post("CustomerOrders/Paginated", pagination)
        .then((response) => {
          this.customerOrders = response.data.data.items;

          if (this.customerOrders.length == 0) {
            this.warningToast("Please Add Customer Order First");
            this.addOrderModal = false;
          }
          //
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },

    getOrder() {
      var despatchId = this.formDataDespatch.despatchId;
      this.isLoading = true;
      axios
        .get("CustomerOrders/Despatch/" + despatchId)
        .then((response) => {
          this.itemDataOrder = response.data.data;
          this.itemOrder = response.data.data;

          var pageCount = this.itemOrder.length / this.pageRowCountProduct;
          let pageCountRound = Math.round(pageCount);
          if (pageCount > pageCountRound) {
            pageCountRound += 1;
            this.pageCountProduct = pageCountRound;
          } else {
            this.pageCountProduct = pageCountRound;
          }

          //pageCountProduct
          this.orderLocal = this.itemOrder.slice(
            this.productStart,
            this.productEnd
          );

          this.isLoading = false;

          // this.pageCountOrder = this.itemOrder.totalPages;
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
          this.isLoading = false;
        });
    },

    setDefaultOrder() {
      this.formDataOrder = Object.assign({}, this.formDataOrderDefault);
      this.formDataDespatch.bookingNumber = this.formDataOrder.bookingNumber;
    },

    saveOrder() {
      this.isLoading = true;
      axios
        .post("Despatches/Orders/Add", this.formDataOrder)
        .then((response) => {
          if (response.data.success === true) {
            this.getOrder();
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
    getSelectedColor() {
      return "background-color:rgb(22,78,99);color: white";
    },

    getBooleanStatus(status) {
      switch (status) {
        case true:
          return "YES";

        case false:
          return "NO";
      }
    },
  },
};
</script>
