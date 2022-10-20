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
          Add New Variant
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
      <!-- <a
        href="javascript:;"
        @click="viewArchives()"
       class="btn btn-primary shadow-md text-xs lg:text-sm mt-2 lg:mt-0 md:mt-0"
      >
        ARCHIVE
        <span class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center">
          <ArchiveIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
        </span>
      </a> -->
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
          <tr v-for="(item, i) in items" :key="i" class="intro-x">
            <td v-for="(header, index) in headers" :key="index">
              {{ item[header.value] }}
            </td>

            <td class="table-report__action w-56">
              <div class="flex justify-center items-center">
                <a
                  class="flex items-center mr-3 font-bold"
                  href="javascript:;"
                  @click="viewOption(item)"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="Variant Option"
                  >
                    <LayersIcon
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
                    content="Edit Type"
                  >
                    <EditIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                  </Tippy>
                </a>
                <a
                  @click="deleteItem(item)"
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

  <!-- BEGIN: Add  Modal -->

  <Modal
    :show="addVariantType"
    @hidden="addVariantType = false"
    backdrop="static"
  >
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">{{ formTitle }}</h2>
    </ModalHeader>
    <ModalBody class="flex justify-center space-y-4">
      <div class="flex flex-col space-y-4 w-full">
        <div>
          <label for="regular-form-1" class="form-label"
            >Variant Type Name</label
          >

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataVariantType.typeName"
              type="text"
              class="form-control"
              name="typeName"
              placeholder="Variant Type Name"
            />
          </div>
        </div>

        <div>
          <label for="regular-form-1" class="form-label">PLU/SKU Order</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataVariantType.skuOrder"
              type="number"
              class="form-control"
              name="skuOrder"
              placeholder="PLU/SKU Order"
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
        Cancel
      </button>
      <button @click="saveForm()" type="submit" class="btn btn-primary w-24">
        Done
      </button>
    </ModalFooter>
  </Modal>
  <!-- END: Add Modal -->

  <!-- BEGIN: View VariantsOptions Modal -->
  <Modal
    :show="viewOptionsModal"
    @hidden="viewOptionsModal = false"
    size="modal-sl-85"
    slideOver="true"
  >
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="viewOptionsModal = false"
        />
      </div>

      <div class="p-5 text-center lg:text-lg text-base uppercase font-semibold">
        {{ formDataVariantType.typeName }}
      </div>
      <hr />
      <div class="w-full sm:w-auto mt-3 sm:mt-0 p-3">
        <div class="flex">
          <a
            v-if="!addVariantOptionModal"
            href="javascript:;"
            @click="addVariantOption()"
            class="btn btn-primary shadow-md mr-2"
          >
            Add New Option
          </a>
          <div v-if="addVariantOptionModal" class="flex justify-end items-end">
            <div>
              <label for="regular-form-1" class="form-label font-semibold">
                Option Name
              </label>

              <div class="flex flex-col w-4/5 space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="formDataVariantOption.optionName"
                  type="text"
                  class="form-control"
                  name="optionName"
                  placeholder="Variant Option"
                />
              </div>
            </div>

            <div>
              <label for="regular-form-1" class="form-label font-semibold">
                Abbreviation
              </label>

              <div class="flex flex-col w-4/5 space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="formDataVariantOption.abbreviation"
                  type="text"
                  class="form-control"
                  name="name"
                  placeholder="Abbreviation"
                />
              </div>
            </div>

            <!-- <div>
              <label for="regular-form-1" class="form-label font-semibold">
                Variant Type Id
              </label>

              <div class="flex flex-col w-4/5 space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="formDataVariantOption.variantTypeId"
                  type="text"
                  class="form-control"
                  name="variantTypeId"
                  placeholder="Variant Type Id"
                />
              </div>
            </div> -->

            <button
              @click="saveVariantOption()"
              type="submit"
              class="btn btn-primary w-24 mr-1"
            >
              {{ optionTitle }}
            </button>
            <button
              type="button"
              @click="addVariantOptionModal = false"
              class="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
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
            v-model="searchDataOption"
            @change="searchOnchangeOption"
          />
          <SearchIcon
            @click="searchItemOption"
            v-if="!searchActiveOption"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
          <XIcon
            @click="clearSearchOption"
            v-if="searchActiveOption"
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
            <tr v-for="(item, i) in optionItems" :key="i" class="intro-x">
              <td v-for="(header, index) in variantOptionsHeaders" :key="index">
                {{ item[header.value] }}
              </td>

              <td class="table-report__action w-56">
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
                    @click="deleteOptionItem(item)"
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
        class="intro-y relative bottom-0 lg:flex lg:flex-row lg:flex-wrap lg:items-center md:flex md:flex-row md:flex-wrap md:items-center flex flex-col items-center justify-center p-2"
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
    size="modal-sl-85"
    backdrop="static"
  >
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="archiveModal = false"
        />
      </div>

      <div class="p-5 text-center text-lg uppercase font-semibold">
        Archived Variant Type
      </div>
      <hr />
      <!-- SEARCH -->
      <div class="w-full sm:w-auto mt-3 sm:mt-0">
        <div class="w-full relative text-slate-500">
          <input
            type="text"
            class="form-control w-full box pr-10"
            placeholder="Search..."
            v-model="searchDataOption"
            @change="searchOnchangeOption"
            clearable
          />
          <SearchIcon
            @click="searchItemOption"
            v-if="searchActiveOption == false"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
          <XIcon
            @click="clearSearchOption"
            v-if="searchActiveOption == true"
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
                    <RotateCcwIcon class="w-4 h-4 mr-1" /> Restore
                  </a>

                  <a
                    class="flex items-center text-danger"
                    href="javascript:;"
                    @click="deleteItem(item)"
                  >
                    <Trash2Icon class="w-4 h-4 mr-1" /> Delete
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

  <!-- END: View VariantsOptions Modal -->

  <!-- BEGIN: Archive Modal -->
  <Modal
    :show="archiveModal"
    @hidden="archiveModal = false"
    size="modal-sl-85"
    backdrop="static"
  >
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="archiveModal = false"
        />
      </div>

      <div class="p-5 text-center text-lg uppercase font-semibold">
        Archived Variant Type
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
            <tr v-for="(item, i) in items" :key="i" class="intro-x">
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
                    <RotateCcwIcon class="w-4 h-4 mr-1" /> Restore
                  </a>

                  <a
                    class="flex items-center text-danger"
                    href="javascript:;"
                    @click="deleteItem(item)"
                  >
                    <Trash2Icon class="w-4 h-4 mr-1" /> Delete
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

  <!-- BEGIN: Archive Modal For Option-->
  <Modal
    :show="archiveModalOption"
    @hidden="archiveModalOption = false"
    size="modal-sl-85"
    backdrop="static"
  >
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="archiveModalOption = false"
        />
      </div>

      <div class="p-5 text-center text-lg uppercase font-semibold">
        Archived Variant Option
      </div>
      <hr />
      <!-- SEARCH -->
      <div class="w-full sm:w-auto mt-3 sm:mt-0">
        <div class="w-full relative text-slate-500">
          <input
            type="text"
            class="form-control w-full box pr-10"
            placeholder="Search..."
            v-model="searchDataArchiveOption"
            @change="searchOnchangeArchiveOption"
            clearable
          />
          <SearchIcon
            @click="searchItemArchiveOption"
            v-if="searchActiveArchiveOption == false"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
          <XIcon
            @click="clearSearchArchiveOption"
            v-if="searchActiveArchiveOption == true"
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
            <tr v-for="(item, i) in items" :key="i" class="intro-x">
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
                    <RotateCcwIcon class="w-4 h-4 mr-1" /> Restore
                  </a>

                  <a
                    class="flex items-center text-danger"
                    href="javascript:;"
                    @click="deleteItem(item)"
                  >
                    <Trash2Icon class="w-4 h-4 mr-1" /> Delete
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
  <!-- END: Archive Modal For Option-->

  <!-- BEGIN: Delete Confirmation Modal For option -->
  <Modal
    :show="deleteOptionConfirmationModal"
    @hidden="deleteOptionConfirmationModal = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <Trash2Icon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-xl font-bold mt-5">
          {{ formDataVariantOption.optionName }}
        </div>
        <div class="text-slate-500 mt-2">
          Do you really want to delete these records? <br />This process cannot
          be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="deleteOptionConfirmationModal = false"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-danger w-24"
          @click="deleteOptionItemConfirm()"
        >
          Delete
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Delete Confirmation Modal -->

  <!-- BEGIN: Confirmation Modals -->
  <ArchiveConfirmModal
    :name="formDataVariantType.typeName"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formDataVariantType.typeName"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formDataVariantType.typeName"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete"
  />
  <!-- END: Confirmation Modals -->
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";

import { required, minLength, maxLength, integer } from "@vuelidate/validators";
import axios from "../../../services/http-common";
import Paginate from "vuejs-paginate-next";

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

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { const_txt } from "../../../global-functions/const";

export default {
  components: {
    paginate: Paginate,
    Loading,
  },
  data() {
    return {
      isLoading: false,
      searchData: "",
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,
      addVariantType: false,

      addVariantOptionModal: false,
      viewOptionsModal: false,

      archiveConfirmationModal: false,
      archiveModal: false,

      restoreConfirmationModal: false,
      deleteConfirmationModal: false,
      deleteOptionConfirmationModal: false,

      titleChange: -1,
      formDataVariantType: {
        typeName: "",
        skuOrder: "",
      },
      formDataVariantTypeDefault: {
        typeName: "",
        skuOrder: "",
      },

      rules: {
        typeName: {
          required,
          minLength: minLength(2),
        },
        skuOrder: {
          required,
          minLength: minLength(2),
        },
      },

      headers: [
        // { text: "ID", value: "variantTypeId" },
        { text: "Type Name", value: "typeName" },
        { text: "PLU/SKU Order", value: "skuOrder" },
      ],

      pagination: {
        pageNumber: 1,
        pageSize: this.pageSize,
        search: "",
        // sortColumnName: "typeName",
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

      pageCountOption: 20,
      pageSizeOption: 5,
      paginationOption: {
        pageNumber: 1,
        pageSize: 5,
        search: "",
      },
      defaultPaginationOption: {
        pageNumber: 1,
        pageSize: 5,
        search: "",
      },

      items: [],
      itemsData: [],
      archiveItems: [],
      archiveData: [],
      paginationArchive: {
        pageNumber: 1,
        pageSize: 5,
      },

      pageCountArchive: 20,

      //variantOption
      searchOption: "",
      searchActiveOption: false,
      optionChange: -1,
      archiveConfirmationModalOption: false,
      archiveModalOption: false,
      formDataVariantOption: {
        optionName: "",
        abbreviation: "",
        variantTypeId: "",
      },
      formDataVariantOptionDefault: {
        optionName: "",
        abbreviation: "",
        variantTypeId: "",
      },
      variantOptionsHeaders: [
        // { text: "ID", value: "variantOptionId" },
        { text: "Abbreviation", value: "abbreviation" },
        { text: "Option Name", value: "optionName" },
        { text: "Variant Type Id", value: "variantTypeId" },
      ],
      optionItems: [],
      optionItemsData: [],

      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,
    };
  },
  computed: {
    formTitle() {
      return this.titleChange === -1
        ? "Add New Variant Type"
        : "Edit Variant Type";
    },
    optionTitle() {
      return this.optionChange === -1 ? "Add" : "Edit Option";
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
          { title: "Type Name", dataKey: "typeName" },
          { title: "PLU/SKU Order", dataKey: "skuOrder" },
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
            typeName: el.typeName,
            skuOrder: el.skuOrder,
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
      this.docs.save(`${"Variants Types " + generateDate}.pdf`);
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
        var csvTitle = "Variants Types " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "Type Name",
          2: "PLU/SKU Order",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.typeName,
            2: item.skuOrder,
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
        .post("VariantType/Paginated", pagination)
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

    pageSizeChangeOption() {
      this.paginationOption.pageSize = this.pageSizeOption;
      this.getVariantOptions();
    },
    changePageOption(pageNum) {
      this.paginationOption.pageNumber = pageNum;

      this.getVariantOptions();
    },

    setDefault() {
      this.formDataVariantType = Object.assign(
        {},
        this.formDataVariantTypeDefault
      );
    },
    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("VariantType/Paginated", this.pagination)
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
    showModal() {
      this.setDefault();
      this.titleChange = -1;
      this.addVariantType = true;
    },
    closeForm() {
      this.addVariantType = false;
    },
    editItem(item) {
      this.titleChange = 0;
      this.formDataVariantType = Object.assign({}, item);
      this.addVariantType = true;
    },

    saveForm() {
      if (this.formDataVariantType.typeName == "") {
        if (this.formDataVariantType.typeName == "") {
          warningToast("Variant Type Name Required");
        }
      } else {
        if (this.titleChange === -1) {
          this.isLoading = true;
          axios
            .post("VariantType", this.formDataVariantType)
            .then((response) => {
              if (response.data.success === true) {
                this.itemsData = response.data.data;
                this.items = response.data.data.items;
                this.addVariantType = false;
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
          //(this.formDataVariantType);
          var itemId = this.formDataVariantType.variantTypeId;
          this.isLoading = true;
          axios
            .put("VariantType/" + itemId, this.formDataVariantType)
            .then((response) => {
              if (response.data.success === true) {
                this.itemsData = response.data.data;
                this.items = response.data.data.items;
                this.addVariantType = false;
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
      this.formDataVariantType = Object.assign({}, item);
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
      var itemId = this.formDataVariantType.variantTypeId;
      this.isLoading = true;
      axios
        .get("VariantType/" + itemId + "/Archive")
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
      // axios
      //   .post("VariantType/Archived", this.paginationArchive)
      //   .then((response) => {
      //     this.archiveData = response.data.data;
      //     this.archiveItems = response.data.data.items;
      //     this.pageCountArchive = this.archiveData.totalPages;

      this.archiveModal = true;
      //   // if (this.archiveData.totalCount > 0) {
      //   //   this.archiveModal = true;
      //   // } else {
      //   //    this.archiveModal = false;
      //   //   alert("No Data in Archive");
      //   // }
      // });
    },

    changePageArchive(pageNum) {
      this.paginationArchive.pageNumber = pageNum;
      this.viewArchives();
    },
    restoreItem(item) {
      this.formDataVariantType = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.formDataVariantType.variantTypeId;
      this.isLoading = true;
      axios
        .get("VariantType/" + itemId + "/Restore")
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
      this.formDataVariantType = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      var itemId = this.formDataVariantType.variantTypeId;
      this.isLoading = true;
      axios
        .delete("VariantType/" + itemId)
        .then((response) => {
          if (response.data.success === true) {
            this.deleteConfirmationModal = false;
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

    //Variant Option

    searchOnchangeOption() {
      if (this.searchDataOption != "") {
        this.searchActiveOption = true;
        this.searchItemOption();
      } else {
        this.clearSearchOption();
      }
    },
    clearSearchOption() {
      this.searchDataOption = "";
      this.paginationOption.search = this.searchDataOption;
      this.getVariantOptions();
      this.searchActiveOption = false;
    },
    searchItemOption() {
      if (this.searchDataOption != "") {
        this.searchActiveOption = true;
        this.paginationOption.search = this.searchDataOption;
        this.getVariantOptions();
      }
    },

    viewOption(item) {
      this.formDataVariantOption = Object.assign(
        {},
        this.formDataVariantOptionDefault
      );

      this.formDataVariantType = Object.assign({}, item);

      // this.formDataVariantOption.variantId = item.variantId;
      this.getVariantOptions();
      this.viewOptionsModal = true;
      this.addVariantOptionModal = false;
      this.optionChange = -1;
    },
    setDefaultOption() {
      this.formDataVariantOption = Object.assign(
        {},
        this.formDataVariantOptionDefault
      );
      this.formDataVariantOption.variantTypeId =
        this.formDataVariantType.variantTypeId;
    },
    getVariantOptions() {
      this.isLoading = true;
      var variantTypeId = this.formDataVariantType.variantTypeId;
      axios
        .post(
          "VariantOption/" + variantTypeId + "/Paginated",
          this.paginationOption
        )
        .then((response) => {
          if (response.data.success === true) {
            this.optionItemsData = response.data.data;
            this.optionItems = response.data.data.items;

            this.pageCountOption = this.optionItemsData.totalPages;
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

    addVariantOption() {
      this.setDefaultOption();
      this.addVariantOptionModal = true;
      this.optionChange = -1;
    },
    saveVariantOption() {
      // console.log(this.formDataVariantOption);
      if (this.optionChange === -1) {
        this.isLoading = true;
        axios
          .post("VariantOption", this.formDataVariantOption)
          .then((response) => {
            if (response.data.success === true) {
              this.getVariantOptions();
              this.addVariantOptionModal = false;
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
        var itemId = this.formDataVariantOption.variantOptionId;
        this.isLoading = true;
        axios
          .put("VariantOption/" + itemId, this.formDataVariantOption)
          .then((response) => {
            if (response.data.success === true) {
              this.addVariantOptionModal = false;
              this.getVariantOptions();
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

    editItemOption(item) {
      this.optionChange = 0;
      this.formDataVariantOption = Object.assign({}, item);
      this.addVariantOptionModal = true;
    },

    deleteOptionItem(item) {
      this.formDataVariantOption = Object.assign({}, item);
      this.deleteOptionConfirmationModal = true;
    },
    deleteOptionItemConfirm() {
      var itemId = this.formDataVariantOption.variantOptionId;
      this.isLoading = true;
      axios
        .delete("VariantOption/" + itemId)
        .then((response) => {
          if (response.data.success === true) {
            this.deleteOptionConfirmationModal = false;
            this.getVariantOptions();
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

    archiveItemOption(item) {
      this.formDataVariantOption = Object.assign({}, item);
      this.archiveConfirmationModalOption = true;
    },

    closeArchiveOption() {
      this.archiveConfirmationModalOption = false;
      this.setDefaultOption();
    },
    archiveItemConfirmOption() {
      var itemId = this.formDataVariantOption.variantOptionId;
      this.isLoading = true;
      axios
        .get("VariantOption/" + itemId + "/Archive")
        .then((response) => {
          if (response.data.success === true) {
            this.archiveConfirmationModalOption = false;
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
    viewArchivesOption() {
      // axios
      //   .post("VariantType/Archived", this.paginationArchive)
      //   .then((response) => {
      //     this.archiveData = response.data.data;
      //     this.archiveItems = response.data.data.items;
      //     this.pageCountArchive = this.archiveData.totalPages;

      this.archiveModalOption = true;
      //   // if (this.archiveData.totalCount > 0) {
      //   //   this.archiveModal = true;
      //   // } else {
      //   //    this.archiveModal = false;
      //   //   alert("No Data in Archive");
      //   // }
      // });
    },
  },
};
</script>
