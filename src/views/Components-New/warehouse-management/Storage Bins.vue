<template>
  <LoadingScreen :isLoading="isLoading" />
   
  <div>
    <div class="flex">
      <div class="hidden md:block mx-auto text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>
      <div
        @click="view3D()"
        class="ml-2 btn btn-primary shadow-md text-xs lg:text-sm mt-2 lg:mt-0 md:mt-0"
      >
        View 3D Locations
        <span
          class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
        >
          <BoxIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
        </span>
      </div>
    </div>

    <div class="mt-5 w-full">
      <div
        class="intro-y lg:flex lg:flex-row lg:items-center lg:space-x-2 lg:justify-between md:flex md:flex-row md:items-center md:space-x-1 md:justify-between flex flex-wrap flex-col justify-end items-end mt-2 w-full"
      >
        <div class="flex space-x-2">
          <!-- Component Changes FYI:Priya-->
          <AddItem
            @parentMethod="showModal($event)"
            buttonName="Add New Location"
          />
          <!-- Not Needed Part Start -->
          <!-- <a
            href="javascript:;"
            @click="showModal()"
            class="btn btn-primary shadow-md lg:w-auto w-1/2 text-xs lg:text-sm"
          >
            Add New Location
          </a> -->
          <!-- Not Needed Part End -->

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

          <div class="w-96">
            <div
              class="flex justify-center items-center whitespace-nowrap space-x-4"
            >
              <div
                class="w-72 flex justify-center items-center space-x-1 bg-white bg-slate-200 rounded-md"
              >
                <FilterIcon class="lg:w-6 lg:h-6 w-4 h-4 ml-2" />
                <TomSelect
                  v-model="sortColumnName"
                  :options="{
                    placeholder: 'Search..',
                  }"
                  class="w-full"
                >
                  <option value="storageBinId">DEFAULT</option>
                  <option
                    :value="item.value"
                    v-for="(item, i) in headers"
                    :key="i"
                  >
                    {{ item.text }}
                  </option>
                </TomSelect>
              </div>
              <div class="font-medium">From</div>

              <Tippy
                tag="a"
                href="javascript:;"
                class="tooltip"
                content="ASC"
                :options="{
                  zIndex: 99999,
                }"
              >
                <SortAscIcon
                  class="lg:w-6 lg:h-6 w-4 h-4 hover:text-blue-600"
                  @click="sorting(sortColumnName, 'asc')"
                />
              </Tippy>

              <Tippy
                tag="a"
                href="javascript:;"
                class="tooltip"
                content="DESC"
                :options="{
                  zIndex: 99999,
                }"
              >
                <SortDescIcon
                  class="lg:w-6 lg:h-6 w-4 h-4 hover:text-blue-600"
                  @click="sorting(sortColumnName, 'desc')"
                />
              </Tippy>
            </div>
          </div>

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
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in headers"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>DESC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items" :key="i" class="intro-x">
              <td>
                <Tippy
                  tag="a"
                  href="javascript:;"
                  class="tooltip w-full"
                  :content="item.abbreviation + ' : ' + item.name"
                >
                  <qrcode-vue
                    @click="showQrModal(item)"
                    :style="
                      item.selected
                        ? 'border:2px solid; border-color: white;'
                        : ''
                    "
                    render-as="svg"
                    :value="
                      JSON.stringify({
                        name: item.name,
                        description: item.description,
                        abbreviation: item.abbreviation,
                        warehouseName: item.warehouseName,
                      })
                    "
                    size="60"
                    level="L"
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
              <td class="" v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>

              <td class="">
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

              <td class="table-report__action">
                <div class="flex justify-center items-center">
                  <!-- Component Changes FYI:Priya-->
                  <InfoItem
                    @parentMethod="viewItemInfo($event)"
                    :item="item"
                    name="INFO"
                  />
                  <AddSubItem
                    @parentMethod="addSku($event)"
                    :item="item"
                    name="ADD PLU/SKU"
                  />
                  <EditItem
                    @parentMethod="editItem($event)"
                    :item="item"
                    name="Edit"
                  />
                  <ArchiveItem
                    @parentMethod="archiveItem($event)"
                    :item="item"
                    name="Archive"
                  />

                  <!-- Not Needed Part Start -->
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
                    >
                      <InfoIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                      />
                    </Tippy>
                  </a> -->
                  <!-- <a
                    class="flex items-center mr-3 font-bold"
                    href="javascript:;"
                    @click="addSku(item)"
                  >
                    <Tippy
                      tag="a"
                      href="javascript:;"
                      class="tooltip"
                      content="ADD PLU/SKU"
                    >
                      <PlusSquareIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                      />
                    </Tippy>
                  </a> -->

                  <!-- <a
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
                  </a> -->
                  <!-- <a
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
                  </a> -->
                  <!-- Not Needed Part End -->
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
          class="w-20 form-select box sm:mt-0 cursor-pointer"
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

  <!-- BEGIN: Add  Modal -->

  <MoveableModal
    :show="addBin"
    @hidden="addBin = false"
    backdrop="static"
    size="modal-sl-60"
    :title="formTitle"
    @close="addBin = false"
  >
    <ModalBody
      class="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 lg:gap-4 md:gap-4 gap-2"
    >
      <div class="col-span-2">
        <label for="regular-form-1" class="form-label">Name</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataBin.name"
            type="text"
            class="form-control"
            name="BinName"
            placeholder="Storage Location Name"
          />
        </div>
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Abbreviation</label>

        <div>
          <input
            id="vertical-form-1"
            v-model="formDataBin.abbreviation"
            type="text"
            class="form-control"
            name="abbreviation"
            placeholder="Storage Location Abbreviation"
          />
        </div>
      </div>
      <div>
        <label for="regular-form-1" class="form-label">Warehouse</label>

        <TomSelect
          v-model="formDataBinWarehouse"
          :options="{
            placeholder: 'Search..',
          }"
          class="w-full"
        >
          <option v-if="titleChange != -1">
            {{ formDataBin.sectionName }}
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

      <div>
        <label for="regular-form-1" class="form-label">Storage Section</label>

        <TomSelect
          v-if="formDataBin.storageSectionId != null"
          v-model="formDataBin.storageSectionId"
          :options="{
            placeholder: 'Search..',
          }"
          class="w-full"
        >
          <option v-if="titleChange != -1">
            {{ formDataBin.sectionName }}
          </option>
          <option v-if="titleChange == -1">SELECT</option>
          <option
            :value="item.storageSectionId"
            v-for="(item, i) in storageSections"
            :key="i"
          >
            {{ item.name }}
          </option>
        </TomSelect>
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Storage Type</label>

        <TomSelect
          v-if="formDataBin.storageTypeId != null"
          v-model="formDataBin.storageTypeId"
          :options="{
            placeholder: 'Search..',
          }"
          class="w-full"
        >
          <option v-if="titleChange != -1">
            {{ formDataBin.storageTypeName }}
          </option>
          <option v-if="titleChange == -1">SELECT</option>
          <option
            :value="item.storageTypeId"
            v-for="(item, i) in storageTypes"
            :key="i"
          >
            {{ item.name }}
          </option>
        </TomSelect>
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Block Type</label>

        <TomSelect
          v-if="formDataBin.blockTypeId != null"
          v-model="formDataBin.blockTypeId"
          :options="{
            placeholder: 'Search..',
          }"
          class="w-full"
        >
          <option v-if="titleChange != -1">
            {{ formDataBin.blockTypeName }}
          </option>
          <option v-if="titleChange == -1">SELECT</option>
          <option
            :value="item.blockTypeId"
            v-for="(item, i) in blockTypeItems"
            :key="i"
          >
            {{ item.name }}
          </option>
        </TomSelect>
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Maximum Weight</label>

        <input
          id="vertical-form-1"
          v-model="formDataBin.maxWeight"
          type="text"
          class="form-control"
          name="maxWeight"
          placeholder="Maximum Weight"
        />
      </div>

      <div>
        <label for="regular-form-1" class="form-label">Maximum Dimension</label>
        <input
          id="vertical-form-1"
          v-model="formDataBin.maxDimension"
          type="text"
          class="form-control"
          name="maxDimension"
          placeholder="Maximum Dimension"
        />
      </div>

      <div class="col-span-3">
        <label for="regular-form-1" class="form-label">Description</label>

        <div class="flex flex-col space-y-1">
          <textarea
            id="vertical-form-1"
            v-model="formDataBin.description"
            type="text"
            class="form-control"
            name="BinDescription"
            placeholder="Type here about Storage Location..."
          ></textarea>
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
        Archived Storage Locations
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
              <th class="" v-for="(header, i) in headers" :key="i">
                {{ header.text }}
              </th>
              <th>DESC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in archiveItems" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index" class="w-20">
                {{ item[header.value] }}
              </td>
              <td class="w-24">
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

              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <!-- Component Changes FYI:Priya-->
                  <RestoreItem
                    @parentMethod="restoreItem($event)"
                    :item="item"
                    name="Restore"
                  />
                  <DeleteItem
                    @parentMethod="deleteItem($event)"
                    :item="item"
                    name="Delete"
                  />
                  <!-- Not Needed Part Start -->

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
                  </a> -->
                  <!-- Not Needed Part End -->
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
          class="w-20 form-select box sm:mt-0 cursor-pointer"
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

  <!-- BEGIN: View Bin Info Modal -->

  <MoveableModal
    :show="viewItemModal"
    @hidden="viewItemModal = false"
    backdrop="static"
    size="modal-sl-85"
    title="INFO"
    @close="viewItemModal = false"
  >
    <ModalBody class="p-0">
      <!-- BEGIN: INFO -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4 mt-6">
        <div
          class="flex flex-col text-center items-center justify-between space-y-2"
        >
          <qrcode-vue
            render-as="svg"
            :value="JSON.stringify(formDataBin)"
            size="80"
            level="H"
          />
          <div class="text-xl font-bold mt-5">{{ formDataBin.name }}</div>
        </div>
        <div class="intro-y box p-5 mt-12 sm:mt-5">
          <div
            class="pt-4 intro-y box grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 lg:gap-4 md:gap-4 gap-2"
          >
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>ABBREVIATION</div>
              </div>
              <div>
                {{
                  formDataBin.abbreviation != null
                    ? formDataBin.abbreviation
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>STORAGE SECTION</div>
              </div>
              <div>
                {{
                  formDataBin.sectionName != null
                    ? formDataBin.sectionName
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>STORAGE TYPE</div>
              </div>
              <div>
                {{
                  formDataBin.storageTypeName != null
                    ? formDataBin.storageTypeName
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Block TYPE</div>
              </div>
              <div>
                {{
                  formDataBin.blockTypeId != null
                    ? formDataBin.blockTypeName
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Maximum Weight</div>
              </div>
              <div>
                {{
                  formDataBin.maxWeight != null ? formDataBin.maxWeight : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Maximum Dimension</div>
              </div>
              <div>
                {{ formDataBin.maxDimension || "Nil" }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Description</div>
              </div>
              <div>
                {{
                  formDataBin.description != null
                    ? formDataBin.description
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
  <!-- END: View Bin Info Modal-->

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
              type="number"
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
            <div v-for="(item, i) in formDataPrint.bins" :key="i">
              {{ i + 1 }} : {{ item.abbreviation }} - {{ item.name }}
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

  <!-- BEGIN: Add  Modal -->

  <MoveableModal
    :show="addSkuModal"
    @hidden="addSkuModal = false"
    backdrop="static"
    size="modal-lg"
    :title="addSkuModalTitle"
    @close="addSkuModal = false"
  >
    <div class="p-2">
      <!-- BinExistingProducts Test- <br />
      {{ binExistingProducts.length }} -->

      <!-- BEGIN: Data List -->
      <div
        class="flex flex-nowrap cursor-pointer text-sm font-semibold pl-2 text-info"
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
        class="intro-y col-span-12 overflow-scroll max-h-72"
      >
        <table class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>PLU/SKU - Description</th>

              <th>Expiry Date</th>
              <th>QTY</th>
              <th>Invoice No</th>
              <th>Supplier</th>
              <th>Supplier Item Code</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in binExistingProducts"
              :key="i"
              class="intro-x"
            >
              <td>
                {{ item.skuDetail.skuName }} - {{ item.skuDetail.description }}
              </td>

              <td>{{ momentLocal(item.expiryDate) }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.invoiceNumber }}</td>
              <td>{{ item.supplierCompany }}</td>
              <td>{{ item.supplierProductNumber }}</td>
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

    <ModalBody
      class="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-2 lg:gap-4 md:gap-4 gap-2"
    >
      <div>
        <label for="regular-form-1" class="form-label"
          >Supplier Invoice Number</label
        >

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataAddSku.invoiceNumber"
            :options="{
              placeholder: 'Select..',
            }"
            class=""
          >
            <option>SELECT</option>
            <option
              :value="item.invoiceNumber"
              v-for="(item, i) in supInvoices"
              :key="i"
            >
              {{ item.invoiceNumber }}
            </option>
          </TomSelect>
        </div>
      </div>

      <div>
        <label for="regular-form-1" class="form-label"
          >PLU/SKU - Description</label
        >

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataAddSkuDescription"
            :options="{
              placeholder: 'Select..',
            }"
            class=""
          >
            <option>SELECT</option>
            <option
              :value="item.description"
              v-for="(item, i) in supplierProducts"
              :key="i"
            >
              {{ item.skuId }} - {{ item.description }}
            </option>
          </TomSelect>
        </div>
      </div>
      <div>
        <label for="regular-form-1" class="form-label"
          >Supplier Item Code
        </label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataAddSku.supplierProductNumber"
            type="text"
            class="form-control"
            placeholder="Supplier Item Code"
          />
        </div>
      </div>
      <div>
        <label for="regular-form-1" class="form-label">Expiry Date</label>
        <PreviewComponent class="intro-y">
          <div class="">
            <Preview>
              <Litepicker
                v-model="formDataAddSku.expirationDate"
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
        <label for="regular-form-1" class="form-label">QTY</label>
        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataAddSku.quantity"
            type="number"
            class="form-control"
            placeholder="Quantity"
            :max="100"
            :min="1"
          />
        </div>
      </div>
      <div>
        <label for="regular-form-1" class="form-label"
          >Previous LOT Number</label
        >
        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataAddSku.previousLot"
            type="text"
            class="form-control"
            placeholder="Previous LOT No"
          />
        </div>
        <!-- <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataAddSku.previousLot"
            :options="{
              placeholder: 'Select..',
            }"
            class=""
          >
            <option>SELECT</option>
            <option :value="item.lot" v-for="(item, i) in lots" :key="i">
              {{ item.lot }}
            </option>
          </TomSelect>
        </div> -->
      </div>
      <div>
        <label for="regular-form-1" class="form-label">LOT Number</label>

        <div class="flex flex-col space-y-1">
          <TomSelect
            v-model="formDataAddSku.lot"
            :options="{
              placeholder: 'Select..',
            }"
            class=""
          >
            <option>SELECT</option>
            <option :value="item.lot" v-for="(item, i) in lots" :key="i">
              {{ item.lot }}
            </option>
          </TomSelect>
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="closeSkuModal()"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        {{ const_txt.CANCEL_BTN }}
      </button>
      <button
        @click="confirmAddSku()"
        type="submit"
        class="btn btn-primary w-24"
      >
        {{ btnName }}
      </button>
    </ModalFooter>
  </MoveableModal>

  <!-- END: Add Modal -->

  <Modal size="modal-sm" :show="qrModal" @hidden="qrModal = false">
    <ModalBody
      class="flex flex-col justify-center items-center space-y-2 w-full"
    >
      <div class="w-full">
        <qrcode-vue
          v-if="formDataBin.storageBinId"
          render-as="svg"
          :value="JSON.stringify(formDataBin)"
          size="250"
          level="H"
        />
      </div>

      <div>
        <span
          class="lg:text-lg md:text-base text-base text-black-900 font-medium leading-none"
          >{{ formDataBin }}</span
        >
      </div>
    </ModalBody>
  </Modal>

  <!-- BEGIN: Confirmation Modals -->
  <ArchiveConfirmModal
    :name="formDataBin.name"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formDataBin.name"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formDataBin.name"
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
import axiosReal from "axios";
import Paginate from "vuejs-paginate-next";

// Component Changes FYI Priya
// import Loading from "vue-loading-overlay";
// import "vue-loading-overlay/dist/vue-loading.css";

import router from "../../../router";

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

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
// import QRCode from "qrcode";
import Moveable from "vue3-moveable";
import moment from "moment";

import store from "../../../store";

export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Locations");
  },

  components: {
    Moveable,
    //Loading,  Component Changes
    paginate: Paginate,
  },
  data() {
    return {
      const_txt: const_txt,
      isLoading: false,
      searchData: "",
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,

      qrModal: false,

      viewItemModal: false,

      addBin: false,
      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,
      titleChange: -1,
      formDataBin: {
        name: "",
        description: "",
        abbreviation: "",
        maxWeight: "",
        maxDimension: "",
        storageSectionId: "",
        storageTypeId: "",
        blockTypeId: "",
      },
      formDataBinDefault: {
        name: "",
        description: "",
        abbreviation: "",
        maxWeight: "",
        maxDimension: "",
        storageSectionId: "",
        storageTypeId: "",
        blockTypeId: "",
      },

      rules: {
        name: {
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
        storageSectionId: {
          required,
          maxLength: maxLength(10),
        },
        StorageTypeId: {
          required,
          maxLength: maxLength(10),
        },
        maxWeight: {
          required,
          maxLength: maxLength(10),
        },
        maxDimension: {
          required,
          maxLength: maxLength(10),
        },
      },

      headers: [
        { text: "ABBREVIATION", value: "abbreviation" },
        { text: "NAME", value: "name" },
        { text: "STORAGE SECTION", value: "sectionName" },
        { text: "STORAGE TYPE", value: "storageTypeName" },
        { text: "Block Type", value: "blockTypeName" },
      ],
      headersBinExistingProductsSku: [
        { text: "plu/sku", value: "skuName" },
        { text: "Description", value: "description" },
      ],

      headersBinExistingProducts: [
        { text: "QTY", value: "quantity" },
        { text: "Expiry Date", value: "expiryDate" },
        { text: "Supplier Code", value: "" },
        { text: "Invoice", value: "" },
      ],

      pagination: {
        pageNumber: 1,
        pageSize: 10,
        search: "",
        sortColumnName: "storageBinId",
        sortDirection: "desc",
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
      pageSizeArchive: 5,
      warehouses: [],
      storageSections: [],
      storageTypes: [],
      checkedData: [],

      addCheckedPrintModal: false,
      formDataPrint: {
        bins: [],
        ip: "192.0.0.0",
        port: "9100",
        nbrOfCopies: "",
      },
      allSelected: false,

      allItems: [],
      allItemsData: [],

      doc: null,
      isActive: 0,
      addSkuModal: false,
      // formDataAddSkuInvoiceNumber : '',
      formDataAddSkuDescription: "",
      formDataAddSku: {
        warehouse: "",
        storageType: "",
        storageSection: "",
        lot: "",
        invoiceNumber: "",
        supplierProductNumber: "",
        binAbbreviation: "",
        quantity: "",
        expirationDate: "",
        previousLot: "",
      },
      formDataAddSkuDef: {
        warehouse: "",
        storageType: "",
        storageSection: "",
        lot: "",
        invoiceNumber: "",
        supplierProductNumber: "",
        binAbbreviation: "",
        quantity: "",
        expirationDate: "",
        previousLot: "",
      },
      supplierProducts: [],
      supInvoices: [],
      selectedInvoice: {},
      maxQty: 100,
      lots: [],
      blockTypeItems: [],
      binExistingProducts: [],
      viewBinProducts: false,
      formDataBinWarehouse: "",
      addSkuModalTitle: "",
    };
  },
  computed: {
    binViewTitle() {
      return this.viewBinProducts == true
        ? "Existing PLU/SKU"
        : "View Existing PLU/SKU";
    },
    formTitle() {
      return this.titleChange === -1
        ? "Add New Storage Location"
        : "Edit Storage Location";
    },
    btnName() {
      return this.titleChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },
    formDataAddSkuInvoiceNumber() {
      return this.formDataAddSku.invoiceNumber;
    },
    // formDataAddSkuDescription() {
    //   return this.formDataAddSku.description;
    // },
  },

  created() {
    this.getDataFromApi();
    this.getDefaultIP();
    //  this.getSkus();
    this.getPurchaseOrders();
    this.getLots();
    this.getBlockType();
    this.getWarehouses();

    //  this.getStorageSections();
  },
  watch: {
    formDataBinWarehouse() {
      this.storageSections = [];
      this.formDataBin.storageSectionId = "";
      this.filterSections(this.formDataBinWarehouse);
    },
    addSkuModal() {
      this.viewBinProducts = false;
    },
    formDataAddSkuInvoiceNumber() {
      this.formDataAddSkuDescription = "";
      // this.formDataAddSku.previousLot = "";
      // this.formDataAddSku.lot = "";
      this.getSupplierInvoiceInfo();
    },
    formDataAddSkuDescription() {
      this.formDataAddSku.supplierProductNumber = "";
      this.formDataAddSku.expirationDate = "";
      this.getSupplierProductInfo();
    },
  },

  methods: {
    changeTitle(item) {
      console.log("ITEM", item);
    },

    sorting(sortColumnName, sortDirection) {
      this.pagination.sortColumnName = sortColumnName;
      this.pagination.sortDirection = sortDirection;
      this.getDataFromApi();
    },
    view3D() {
      router.push("locations");
    },
    filterSections(warehouseId) {
      if (warehouseId != "SELECT" && warehouseId != "") {
        this.getStorageSections(warehouseId);
      }
    },
    momentLocal(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY");
    },
    getSupplierProductInfo() {
      let item = this.formDataAddSkuDescription;

      if (item != "SELECT") {
        var result = this.supplierProducts.filter((obj) => {
          return obj.description === item;
        });
        console.log("result", result);

        if (result.length > 0) {
          this.formDataAddSku.supplierProductNumber =
            result[0].supplierProductNumber;
          // this.maxQty = result[0].quantity;
          this.formDataAddSku.quantity = result[0].quantity;

          this.formDataAddSku.expirationDate = moment(
            result[0].expirationDate
          ).format("YYYY-MM-DD");
        }
      } else {
        warningToast("Please Select Product");
      }
    },
    getSupplierInvoiceInfo() {
      let item = this.formDataAddSku.invoiceNumber;

      if (item != "SELECT" && item != "") {
        console.log("invoiceNumber", item);
        this.isLoading = true;
        axios
          .get(`PurchaseInvoices?invoiceNumber=${item}`)
          .then((response) => {
            if (response.data.success === true) {
              this.isLoading = false;
              this.supplierProducts = response.data.data.products;
              this.selectedInvoice = response.data;
              console.log("selectedInvoice", this.selectedInvoice);
            } else {
              this.isLoading = false;
              warningToast("No Products Available");
            }
          })
          .catch((error) => {});
      } else {
        // warningToast("Please Select Invoice");
      }
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

    onDragInfo({ transform }) {
      let targetInfo = this.$refs.targetInfo;
      targetInfo.style.transform = transform;
    },
    onDragAddBin({ transform }) {
      let targetAddBin = this.$refs.targetAddBin;
      targetAddBin.style.transform = transform;
    },
    onDragAddSku({ transform }) {
      let targetAddSku = this.$refs.targetAddSku;
      targetAddSku.style.transform = transform;
    },

    getLots() {
      this.isLoading = true;
      var pagination = {
        pageNumber: 1,
        pageSize: 10,
      };
      axios
        .post("Movements/Pagination", pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.isLoading = false;
            this.lots = response.data.data.items;
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    getPurchaseOrders() {
      this.isLoading = true;
      var pagination = {
        pageNumber: 1,
        pageSize: 10000,
      };
      axios
        .post("PurchaseInvoices/Paginated", pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.isLoading = false;
            this.supInvoices = response.data.data.items;
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    getSkus() {
      this.isLoading = true;
      var pagination = {
        pageNumber: 1,
        pageSize: 10000,
      };
      axios
        .post("SupplierProducts/Paginated", pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.isLoading = false;
            this.supplierProducts = response.data.data.items;
            //   console.log(" this.supplierProducts", this.supplierProducts);
          } else {
            this.isLoading = false;
            failedToast(response.data.message);
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
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
              { title: "Abbreviation", dataKey: "abbreviation" },
              { title: "Name", dataKey: "name" },
              { title: "Storage Section", dataKey: "sectionName" },
              { title: "Storage Type", dataKey: "storageTypeName" },
              { title: "Maximum Weight", dataKey: "maxWeight" },
              { title: "Maximum Dimension", dataKey: "maxDimension" },
              { title: "Description", dataKey: "description" },
            ];
            this.docs = new jsPDF({
              orientation: "landscape",
              unit: "in",
              format: "a4",
            });

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
              abbreviation: el.abbreviation,
              name: el.name,
              sectionName: el.sectionName,
              storageTypeName: el.storageTypeName,
              maxWeight: el.maxWeight,
              maxDimension: el.maxDimension,
              description: el.description,
            };
            obj.qrData = await QRCode.toDataURL(
              JSON.stringify(el.abbreviation)
            );
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
        this.docs.save(`${"Storage Bin " + generateDate}.pdf`);
      });
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
        var csvTitle = "Storage Bin " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "Abbreviation",
          2: "Name",
          3: "Storage Section",
          4: "Storage Type",
          5: "Maximum Weight",
          6: "Maximum Dimension",
          7: "Description",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.abbreviation,
            2: item.name,
            3: item.sectionName,
            4: item.storageTypeName,
            5: item.maxWeight,
            6: item.maxDimension,
            7: item.description,
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
        .post("StorageBins/Paginated", pagination)
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
            this.checkForSelected();
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

    showQrModal(item) {
      removeNullValue(item);
      this.formDataBin = Object.assign({}, item);
      this.qrModal = true;
    },

    viewItemInfo(item) {
      removeNullValue(item);
      this.formDataBin = Object.assign({}, item);
      this.viewItemModal = true;
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
      if (
        this.formDataPrint.ip == "" ||
        this.formDataPrint.port == "" ||
        this.formDataPrint.nbrOfCopies == ""
      ) {
        if (this.formDataPrint.ip == "") {
          warningToast("IP Required");
        }
        if (this.formDataPrint.port == "") {
          warningToast("Port Required");
        }
        if (this.formDataPrint.nbrOfCopies == "") {
          warningToast("Num of Copies Required");
        }
      } else {
        axios
          .post("StorageBins/PrintBins ", this.formDataPrint)
          .then((response) => {
            //   console.log(response);
          });
        this.addCheckedPrintModal = false;
        this.checkedData = [];
        this.allSelected = false;
      }
    },

    printSelected() {
      if (this.checkedData.length > 0) {
        this.addCheckedPrintModal = true;
        for (var i = 0; i < this.checkedData.length; i++) {
          this.formDataPrint.bins[i] = this.checkedData[i];
        }
      } else {
        warningToast("Please Select Storage Bin");
      }
    },

    getDefaultIP() {
      axiosReal.get("https://api.ipify.org/").then((response) => {
        this.formDataPrint.ip = response.data;
      });
    },

    selectRemove() {
      // console.log("Workeddd");
    },

    getStorageSections(warehouseId) {
      this.isLoading = true;
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("StorageSections/Paginated", pagination)
        .then((response) => {
          var storageSections = response.data.data.items;

          if (storageSections.length == 0) {
            this.isLoading = false;
            warningToast("Please Add Items in Storage Section");
            this.addBin = false;
          } else {
            var storageSectionsFiltered = storageSections.filter(function (
              section
            ) {
              return section.warehouseId == warehouseId;
            });
            this.storageSections = storageSectionsFiltered;
            this.isLoading = false;
          }
          //
        })
        .catch((error) => {
          this.addBin = false;
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },
    getWarehouses() {
      var pagination = { pageNumber: 1, pageSize: 1000 };
      axios
        .post("Warehouses/Paginated", pagination)
        .then((response) => {
          this.warehouses = response.data.data.items;
          //CHANGES
          // if (this.warehouses.length > 0) {
          //   if (this.titleChange === -1) {
          //     this.formDataSection.warehouseId = this.warehouses[0].warehouseId;
          //   }
          // } else
          if (this.warehouses.length == 0) {
            warningToast("Please Add Items in Warehouse");
            this.addSection = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },

    getStorageTypes() {
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("StorageTypes/Paginated", pagination)
        .then((response) => {
          this.storageTypes = response.data.data.items;

          //CHANGES
          // if (this.storageTypes.length > 0) {
          //   this.formDataBin.storageTypeId = this.storageTypes[0].storageTypeId;
          // } else
          if (this.storageTypes.length == 0) {
            warningToast("Please Add Items in Storage Type");
            this.addBin = false;
          }
          //
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
          this.addBin = false;
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
      this.formDataBin = Object.assign({}, this.formDataBinDefault);
    },
    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("StorageBins/Paginated", this.pagination)
        .then((response) => {
          if (response.data.success === true) {
            this.itemsData = response.data.data;
            this.items = response.data.data.items;

            this.pageCount = this.itemsData.totalPages;
            // successToast(response.data.message)
            this.isLoading = false;
            this.checkForSelected();
          } else {
            warningToast(response.data.message);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          failedToast(error);
          this.isLoading = false;
          //localStorage.setItem("errorMessage", error);
          // router.push("/page-down");
        });
    },
    showModal() {
      this.setDefault();
      this.titleChange = -1;
      this.activateModal();
    },
    activateModal() {
      this.getStorageTypes();

      this.addBin = true;
    },
    closeForm() {
      this.addBin = false;
    },
    closeSkuModal() {
      this.addSkuModal = false;
    },
    editItem(item) {
      this.titleChange = 0;
      this.formDataBin = Object.assign({}, item);
      this.activateModal();
    },

    addSku(item) {
      this.formDataBin = Object.assign({}, item);
      this.addSkuModalTitle = "Add PLU/SKU to " + this.formDataBin.abbreviation;
      this.formDataAddSku = Object.assign({}, this.formDataAddSkuDef);
      console.log("Selected Bin", this.formDataBin);

      axios
        .get("MemoryStocks/Bins/Products", {
          params: {
            warehouse: this.formDataBin.warehouseAbbreviation,
            section: this.formDataBin.sectionAbbreviation,
            bin: this.formDataBin.abbreviation,
          },
        })
        .then((response) => {
          this.binExistingProducts = response.data;

          for (var i = 0; i < this.binExistingProducts.length; i++) {
            this.binExistingProducts[i].invoiceNumber = "";
            this.binExistingProducts[i].supplierProductNumber = "";

            var movementId = this.binExistingProducts[i].movementId;

            axios
              .get("Movements/", {
                params: {
                  movementId: movementId,
                },
              })
              .then((response) => {
                var movement = response.data.data;

                let index = this.binExistingProducts.findIndex((obj) => {
                  return obj.movementId === movement.movementId;
                });
                this.binExistingProducts[index].invoiceNumber =
                  movement.invoiceNumber;
                this.binExistingProducts[index].supplierProductNumber =
                  movement.supplierProductNumber;

                var skuId = this.binExistingProducts[index].skuId;

                axios
                  .get("SupplierProducts/Products/" + skuId)
                  .then((response) => {
                    var supplierProducts = response.data.data;
                    let supplierProduct = supplierProducts.filter((obj) => {
                      return (
                        obj.productNumber === movement.supplierProductNumber
                      );
                    });

                    this.binExistingProducts[index].supplierCompany =
                      supplierProduct[0].supplierCompany;
                  });
              });
          }

          if (this.binExistingProducts && this.binExistingProducts.length > 0) {
            this.viewBinProducts = true;
          }
        });

      this.addSkuModal = true;
    },
    confirmAddSku() {
      this.formDataAddSku.warehouse = this.formDataBin.warehouseAbbreviation;
      this.formDataAddSku.storageType =
        this.formDataBin.storageTypeAbbreviation;
      this.formDataAddSku.storageSection = this.formDataBin.sectionAbbreviation;
      this.formDataAddSku.binAbbreviation = this.formDataBin.abbreviation;

      // console.log(this.formDataBin);
      // console.log(this.formDataAddSku);

      if (
        this.formDataAddSku.quantity == "" ||
        this.formDataAddSku.expirationDate == "" ||
        this.formDataAddSku.supplierProductNumber == "" ||
        this.formDataAddSku.lot == "" ||
        this.formDataAddSku.invoiceNumber == "" ||
        this.formDataAddSku.supplierProductNumber == "SELECT" ||
        this.formDataAddSku.lot == "SELECT" ||
        this.formDataAddSku.invoiceNumber == "SELECT"
      ) {
        if (this.formDataAddSku.quantity == "") {
          warningToast("Quantity Required");
        }
        if (this.formDataAddSku.expirationDate == "") {
          warningToast("Expiration Date Required");
        }
        if (
          this.formDataAddSku.supplierProductNumber == "" ||
          this.formDataAddSku.supplierProductNumber == "SELECT"
        ) {
          warningToast("PLU/SKU -Supplier Product Required");
        }
        if (
          this.formDataAddSku.lot == "" ||
          this.formDataAddSku.lot == "SELECT"
        ) {
          warningToast("LOT Number Required");
        }
        if (
          this.formDataAddSku.invoiceNumber == "" ||
          this.formDataAddSku.invoiceNumber == "SELECT"
        ) {
          warningToast("Invoice Number Required");
        }
      } else {
        //         var expirationDate = moment(this.formDataAddSku.expirationDate).format(
        //           "YYYY-MM-DD"
        //         );
        // console.log(expirationDate)
        //         this.formDataAddSku.expirationDate = expirationDate;

        this.isLoading = true;
        axios
          .post("Movements", this.formDataAddSku)
          .then((response) => {
            if (response.data.success === true) {
              this.isLoading = false;
              this.addSkuModal = false;
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

    saveForm() {
      if (
        this.formDataBin.name == "" ||
        this.formDataBin.abbreviation == "" ||
        this.formDataBin.storageTypeId == "" ||
        this.formDataBin.storageSectionId == "" ||
        this.formDataBin.storageTypeId == "SELECT" ||
        this.formDataBin.storageSectionId == "SELECT"
      ) {
        if (this.formDataBin.name == "") {
          warningToast("Name Required");
        }
        if (this.formDataBin.abbreviation == "") {
          warningToast("Abbreviation Required");
        }
        if (
          this.formDataBin.storageTypeId == "" ||
          this.formDataBin.storageTypeId == "SELECT"
        ) {
          warningToast("Storage Type Required");
        }
        if (
          this.formDataBin.storageSectionId == "" ||
          this.formDataBin.storageSectionId == "SELECT"
        ) {
          warningToast("Storage Section Required");
        }
      } else {
        if (this.titleChange === -1) {
          this.isLoading = true;
          axios
            .post("StorageBins", this.formDataBin)
            .then((response) => {
              if (response.data.success === true) {
                this.addBin = false;
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
          var itemId = this.formDataBin.storageBinId;
          this.isLoading = true;
          axios
            .put("StorageBins/" + itemId, this.formDataBin)
            .then((response) => {
              if (response.data.success === true) {
                this.addBin = false;
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
      this.formDataBin = Object.assign({}, item);
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
      var itemId = this.formDataBin.storageBinId;
      this.isLoading = true;
      axios
        .get("StorageBins/" + itemId + "/Archive")
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
        .post("StorageBins/Archived", this.paginationArchive)
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
      this.formDataBin = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.formDataBin.storageBinId;
      this.isLoading = true;
      axios
        .get("StorageBins/" + itemId + "/Restore")
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
          //this.isLoading = false;
          //warningToast(statusMessage(error.response.status));
        });
    },
    deleteItem(item) {
      this.formDataBin = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataBin.storageBinId;
      axios
        .delete("StorageBins/" + itemId)
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
          //  this.isLoading = false;
          //  warningToast(statusMessage(error.response.status));
        });
    },
  },
};
</script>
