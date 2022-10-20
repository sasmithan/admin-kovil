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
          Add New Product
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
            <th>Abbreviation</th>
            <th>Name</th>
            <th>Price</th>
            <th
              class="whitespace-nowrap"
              v-for="(header, i) in headers"
              :key="i"
            >
              {{ header.text }}
            </th>
            <th>DESC</th>
            <th>Visible</th>
            <th>In Stock</th>
            <th>Discount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in items"
            :key="i"
            class="intro-x cursor-pointer"
          >
            <td :style="item.selected ? getSelectedColor() : ''">
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
                  v-if="item.productId"
                  render-as="svg"
                  :value="JSON.stringify(item)"
                  size="50"
                  level="H"
              /></Tippy>
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
            <td :style="item.selected ? getSelectedColor() : ''">
              {{ item.abbreviation }}
            </td>
            <td
              @click="
                viewItemInfo(item);
                item.selected = true;
              "
              class="cursor-pointer"
              :style="item.selected ? getSelectedColor() : 'color: #1a73e8'"
            >
              {{ item.name }}
            </td>
            <td :style="item.selected ? getSelectedColor() : ''">
              {{ currencyFormat(item.price) }}
            </td>
            <td
              :style="item.selected ? getSelectedColor() : ''"
              v-for="(header, index) in headers"
              :key="index"
            >
              {{ item[header.value] }}
            </td>

            <td :style="item.selected ? getSelectedColor() : ''">
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
            <td :style="item.selected ? getSelectedColor() : ''">
              <div class="form-switch ml-3">
                <input
                  id="booleanSwitch"
                  type="checkbox"
                  v-model="item.visible"
                  class="form-check-input"
                  disabled
                />
              </div>
            </td>
            <td :style="item.selected ? getSelectedColor() : ''">
              <div class="form-switch ml-3">
                <input
                  id="booleanSwitch"
                  type="checkbox"
                  v-model="item.inStock"
                  class="form-check-input"
                  disabled
                />
              </div>
            </td>
            <td :style="item.selected ? getSelectedColor() : ''">
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
                    ><InfoIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                  </Tippy>
                </a>

                <a
                  class="flex items-center mr-3 font-bold"
                  href="javascript:;"
                  @click="viewVariants(item)"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="Product Variants"
                    ><PlusSquareIcon
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
                <!-- <a class="flex items-center mr-3" href="javascript:;">
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
                </a> -->
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
    size="modal-xl"
    :show="addProduct"
    @hidden="addProduct = false"
    backdrop="static"
  >
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">{{ formTitle }}</h2>
    </ModalHeader>
    <ModalBody class="flex justify-center space-y-4">
      <div class="flex flex-col space-y-4 w-full">
        <div class="flex justify-center space-x-4">
          <!-- Product Name field -->
          <div class="flex flex-col w-3/5">
            <label for="regular-form-1" class="form-label">Product Name</label>

            <div class="flex flex-col">
              <input
                id="vertical-form-1"
                v-model="formDataProduct.name"
                type="text"
                class="form-control"
                name="name"
                placeholder="Product Name"
              />
            </div>
          </div>
          <!-- Product ABB field -->
          <div class="flex flex-col w-3/5">
            <label for="regular-form-1" class="form-label">Abbreviation</label>

            <div class="flex flex-col">
              <input
                id="vertical-form-1"
                v-model="formDataProduct.abbreviation"
                type="text"
                class="form-control"
                name="name"
                placeholder="Abbreviation"
              />
            </div>
          </div>

          <!-- Product price field -->
          <div class="flex flex-col w-3/5">
            <label for="regular-form-1" class="form-label">Product Type</label>

            <input
              id="vertical-form-1"
              v-model="formDataProduct.productType"
              type="text"
              class="form-control"
              name="productType"
              placeholder="Product Type"
            />
          </div>
        </div>

        <!-- Product Description field -->
        <div>
          <label for="regular-form-1" class="form-label">Description</label>

          <div class="flex flex-col">
            <textarea
              id="vertical-form-1"
              v-model="formDataProduct.description"
              type="text"
              class="form-control"
              name="description"
              placeholder="Type here about product..."
            ></textarea>
          </div>
        </div>

        <!-- unit, Category, brand ids -->
        <div>
          <div class="flex justify-center space-x-4">
            <div class="flex flex-col w-full space-y-1">
              <label for="regular-form-1" class="form-label">Unit</label>

              <div class="flex flex-col space-y-1">
                <TomSelect
                  v-model="formDataProduct.unitId"
                  :options="{
                    placeholder: 'Search..',
                  }"
                  class="w-full"
                >
                  <!-- CHANGES -->
                  <option v-if="titleChange != -1">
                    {{ formDataProduct.unit }}
                  </option>
                  <option v-if="titleChange == -1" value=""></option>
                  <option
                    :value="item.unitId"
                    v-for="(item, i) in units"
                    :key="i"
                  >
                    {{ item.unitName }}
                  </option>
                </TomSelect>
              </div>
            </div>

            <div class="flex flex-col w-full space-y-1">
              <label for="regular-form-1" class="form-label">Category</label>
              <div class="flex flex-col space-y-1">
                <TomSelect
                  v-model="formDataProduct.categoryId"
                  :options="{
                    placeholder: 'Select..',
                  }"
                  class="w-full"
                >
                  <!-- CHANGES -->
                  <option v-if="titleChange != -1">
                    {{ formDataProduct.category }}
                  </option>
                  <option v-if="titleChange == -1" value=""></option>
                  <option
                    :value="item.categoryId"
                    v-for="(item, i) in categories"
                    :key="i"
                  >
                    {{ item.name }}
                  </option>
                </TomSelect>
              </div>
            </div>
            <div class="flex flex-col w-full space-y-1">
              <label for="regular-form-1" class="form-label">Brand</label>
              <TomSelect
                v-model="formDataProduct.brandId"
                :options="{
                  placeholder: 'Select..',
                }"
                class="w-full"
              >
                <option v-if="titleChange != -1">
                  {{ formDataProduct.brand }}
                </option>
                <option v-if="titleChange == -1" value=""></option>
                <option
                  :value="item.brandId"
                  v-for="(item, i) in brands"
                  :key="i"
                >
                  {{ item.name }}
                </option>
              </TomSelect>
            </div>
          </div>
        </div>
        <div>
          <div class="flex justify-center space-x-4">
            <div class="flex flex-col w-3/5">
              <label for="regular-form-1" class="form-label">In Stock ?</label>
              <div class="form-switch ml-3">
                <input
                  type="checkbox"
                  v-model="formDataProduct.inStock"
                  class="form-check-input"
                />
              </div>
            </div>

            <!-- Product vat field -->

            <div class="flex flex-col w-3/5">
              <label for="regular-form-1" class="form-label">Visible ?</label>
              <div class="form-switch ml-3">
                <input
                  type="checkbox"
                  v-model="formDataProduct.visible"
                  class="form-check-input"
                />
              </div>
            </div>

            <!-- BEGIN: Basic Select -->
            <div class="flex flex-col w-3/5 space-y-1">
              <label for="regular-form-1" class="form-label">Discount ?</label>
              <div class="form-switch ml-3">
                <input
                  type="checkbox"
                  v-model="formDataProduct.isDiscount"
                  class="form-check-input"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="flex justify-center space-x-4">
            <!-- Product Price field -->

            <div class="flex flex-col w-full">
              <label for="regular-form-1" class="form-label">Price</label>
              <input
                id="vertical-form-1"
                v-model="formDataProduct.price"
                type="number"
                class="form-control"
                name="price"
                placeholder="Price"
              />
            </div>

            <!-- Product vat field -->

            <div class="flex flex-col w-full">
              <label for="regular-form-1" class="form-label">VAT</label>
              <input
                id="vertical-form-1"
                v-model="formDataProduct.vatPercentage"
                type="number"
                class="form-control"
                name="vatPercentage"
                placeholder="Vat Percentage"
              />
            </div>

            <div v-if="formDataProduct.isDiscount" class="flex flex-col w-full">
              <label for="regular-form-1" class="form-label"
                >Discounted Price</label
              >

              <div class="flex flex-col">
                <input
                  isDiscountid="vertical-form-1"
                  v-model="formDataProduct.discountedPrice"
                  type="text"
                  class="form-control"
                  name="discountedPrice"
                  placeholder="Discounted Price"
                />
              </div>
            </div>

            <div v-if="formDataProduct.isDiscount" class="flex flex-col w-full">
              <label for="regular-form-1" class="form-label"
                >Discount Reason</label
              >

              <input
                id="vertical-form-1"
                v-model="formDataProduct.discountReason"
                type="text"
                class="form-control"
                name="discountReason"
                placeholder="Discount Reason"
              />
            </div>
          </div>
          <div class="w-full pt-4">
            <Dropzone
              ref-key="dropzoneValidationRef"
              :options="{
                url: 'http://https://mywarehouse.myweb.net.au//products',
                thumbnailWidth: 150,
                maxFilesize: 0.5,
                acceptedFiles: 'image/jpeg|image/png|image/jpg',
                headers: { 'My-Awesome-Header': 'header value' },
              }"
              v-model="formDataProduct.image"
              class="dropzone"
            >
              <div class="text-lg font-medium">
                Drop files here or click to upload.
              </div>
              <div class="text-gray-600">
                This is image upload section, Selected images are actually
                uploaded.
              </div>
            </Dropzone>
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
  <!-- BEGIN: Add ProductsVariants Modal -->
  <Modal
    :show="viewVariantsModal"
    @hidden="viewVariantsModal = false"
    size="modal-sl-85"
    slideOver="true"
  >
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="viewVariantsModal = false"
        />
      </div>

      <div class="p-5 text-center lg:text-lg text-base uppercase font-semibold">
        {{ formDataProduct.name }} - Variant
      </div>
      <hr />
      <div class="w-full sm:w-auto mt-3 sm:mt-0 p-3">
        <div
          class="lg:flex lg:flex-row md:flex md:flex-row flex flex-col justify-end items-start"
        >
          <a
            v-if="!addVariantModal"
            href="javascript:;"
            @click="addVariantOption()"
            class="btn btn-primary shadow-md text-xs lg:text-sm"
          >
            Add New Variant
          </a>
          <div
            v-if="addVariantModal"
            class="lg:flex lg:flex-row lg:justify-end lg:items-end md:flex md:flex-row md:justify-end md:items-end flex flex-col justify-center items-start"
          >
            <div class="flex space-x-2 w-full">
              <div class="w-72">
                <label for="regular-form-1" class="form-label font-semibold"
                  >Variant
                </label>

                <div class="flex flex-col w-full space-y-1">
                  <TomSelect
                    v-model="formDataVariant.variantTypeId"
                    :options="{
                      placeholder: 'Select..',
                    }"
                    class="w-full"
                  >
                    <option v-if="optionChange != -1">
                      {{ formDataVariant.variantTypeId }}
                    </option>
                    <option v-if="optionChange == -1" value=""></option>
                    <option
                      :value="item.variantTypeId"
                      v-for="(item, i) in variantTypes"
                      :key="i"
                    >
                      {{ item.typeName }}
                    </option>
                  </TomSelect>
                </div>
              </div>
            </div>
            <div class="mt-2 lg:ml-2 md:ml-2 flex">
              <button
                @click="saveVariantType()"
                type="submit"
                class="btn btn-primary w-24 mr-1"
              >
                {{ variantTitle }}
              </button>
              <button
                type="button"
                @click="addVariantModal = false"
                class="btn btn-outline-secondary w-24"
              >
                Cancel
              </button>
            </div>
          </div>
          <div class="hidden md:block mx-auto text-slate-500">
            <!-- Showing 1 to 10 of 150 entries -->
          </div>
          <div class="justify-end">
            <a
              href="javascript:;"
              @click="viewArchivesOption()"
              class="btn btn-primary shadow-md text-xs lg:text-sm mt-2 lg:mt-0 md:mt-0"
            >
              ARCHIVE
              <span
                class="ml-2 lg:w-5 lg:h-5 w-4 h-4 flex items-center justify-center"
              >
                <ArchiveIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
              </span>
            </a>
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
        <table class="table table-report -mt-2">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in variantsHeader"
                :key="i"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in variants" :key="i" class="intro-x">
              <td v-for="(header, index) in variantsHeader" :key="index">
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
  <!-- END: Add ProductsVariants Modal -->

  <!-- BEGIN: Archive Confirmation Modal For Option -->
  <Modal
    :show="archiveConfirmationModalOption"
    @hidden="archiveConfirmationModalOption = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <ArchiveIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-xl font-bold mt-5">{{ formDataProduct.name }}</div>
        <div class="text-slate-500 mt-2">
          Do you really want to delete these records? <br />This process cannot
          be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="closeArchiveOption()"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-danger w-24"
          @click="archiveItemConfirmOption()"
        >
          Archive
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Archive Confirmation Modal For Option-->

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
        Archived Product
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
        class="intro-y col-span-12 overflow-auto"
        v-if="this.archiveData.totalCount > 0"
      >
        <table class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>Name</th>
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
            <tr v-for="(item, i) in archiveItems" :key="i" class="intro-x">
              <td>
                {{ item.name }}
              </td>
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>
              <td class="w-24">
                <div class="text-left line-clamp-2">
                  {{ item.description }}
                </div>
              </td>

              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <a
                    class="flex items-center mr-3 font-semibold"
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
                      ><InfoIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    /></Tippy>
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
                      ><RotateCcwIcon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    /></Tippy>
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
                      ><Trash2Icon
                        class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    /></Tippy>
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
  <!-- BEGIN: Archive Modal For Option-->
  <Modal
    :show="archiveModalOption"
    @hidden="archiveModalOption = false"
    size="modal-sl-80"
    backdrop="static"
  >
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="archiveModalOption = false"
        />
      </div>

      <div class="p-5 text-center lg:text-lg text-sm uppercase font-semibold">
        {{ formDataProduct.name }} Archive
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
            <tr v-for="(item, i) in archiveItems" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
              </td>

              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <a
                    @click="restoreItemOption(item)"
                    class="flex items-center mr-3 text-blue-900"
                    href="javascript:;"
                  >
                    <RotateCcwIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                    Restore
                  </a>

                  <a
                    class="flex items-center text-danger"
                    href="javascript:;"
                    @click="deleteItemOption(item)"
                  >
                    <Trash2Icon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                    Delete
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- END: Archive Data List For Option-->

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

  <!-- BEGIN: Delete Confirmation Modal For Option-->
  <Modal
    :show="deleteConfirmationModalOption"
    @hidden="deleteConfirmationModalOption = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <Trash2Icon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-xl font-bold mt-5">{{ formDataProduct.name }}</div>
        <div class="text-slate-500 mt-2">
          Do you really want to delete these records? <br />This process cannot
          be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="deleteConfirmationModalOption = false"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-danger w-24"
          @click="deleteItemConfirmOption()"
        >
          showQrModal Delete
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Delete Confirmation Modal For Option-->

  <!-- BEGIN: View Product Modal -->
  <Modal
    :show="viewItemModal"
    @hidden="viewItemModal = false"
    size="modal-sl-60"
  >
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="viewItemModalClose()"
        />
      </div>
      <!-- BEGIN: INFO -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4 mt-6">
        <div
          class="flex flex-col text-center items-center justify-between space-y-2"
        >
          <qrcode-vue
            render-as="svg"
            :value="JSON.stringify(formDataProduct)"
            size="80"
            level="H"
          />
          <div class="text-xl font-bold mt-5">{{ formDataProduct.name }}</div>
        </div>
        <div class="intro-y box p-5 mt-12 sm:mt-5">
          <div
            class="flex text-slate-500 border-b border-slate-200 dark:border-darkmode-300 border-dashed pb-3 mb-3"
          >
            <div>Parameters</div>
            <div class="ml-auto">Product Values</div>
          </div>
          <div class="flex items-center mb-5">
            <div class="flex items-center">
              <div>Unit</div>
            </div>
            <div class="ml-auto">{{ formDataProduct.unit || "Nil" }}</div>
          </div>
          <div class="flex items-center mb-5">
            <div class="flex items-center">
              <div>Brand</div>
            </div>
            <div class="ml-auto">{{ formDataProduct.brand || "Nil" }}</div>
          </div>
          <div class="flex items-center mb-5">
            <div class="flex items-center">
              <div>Category</div>
            </div>
            <div class="ml-auto">{{ formDataProduct.category || "Nil" }}</div>
          </div>
          <div class="flex items-center mb-5">
            <div class="flex items-center">
              <div>Product Type</div>
            </div>
            <div class="ml-auto">
              {{ formDataProduct.productType || "Nil" }}
            </div>
          </div>
          <div class="flex items-center mb-5">
            <div class="flex items-center">
              <div>VAT Percentage</div>
            </div>
            <div class="ml-auto text-success">
              {{ percentageFormat(formDataProduct.vatPercentage) }}
            </div>
          </div>

          <div v-if="formDataProduct.isDiscount" class="flex items-center mb-5">
            <div class="flex items-center">
              <div>Discounted Price</div>
            </div>
            <div class="ml-auto text-success">
              ${{ currencyFormat(formDataProduct.discountedPrice) }}
            </div>
          </div>

          <div v-if="formDataProduct.isDiscount" class="flex items-center mb-5">
            <div class="flex items-center">
              <div>Discount Reason</div>
            </div>
            <div class="ml-auto">
              {{ formDataProduct.discountReason || "Nil" }}
            </div>
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
  </Modal>
  <!-- END: View Product Modal-->
  <!-- <QrLarge :qrModal="qrModal" :formData="formDataProduct" /> -->

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
        Cancel
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

  <Modal size="modal-sm" :show="qrModal" @hidden="qrModal = false">
    <ModalBody
      class="flex flex-col justify-center items-center space-y-2 w-full"
    >
      <div class="w-full">
        <qrcode-vue
          v-if="formDataProduct.productId"
          render-as="svg"
          :value="JSON.stringify(formDataProduct)"
          size="250"
          level="H"
        />
      </div>

      <div>
        <span
          class="lg:text-lg md:text-base text-base text-black-900 font-medium leading-none"
          >{{ formDataProduct }}</span
        >
      </div>
    </ModalBody>
  </Modal>

  <!-- BEGIN: Confirmation Modals -->
  <ArchiveConfirmModal
    :name="formDataProduct.name"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formDataProduct.name"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formDataProduct.name"
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
import router from "../../../router";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import {
  booleanStatus,
  booleanStatusColor,
} from "../../../global-functions/status";
//import Multiselect from "@vueform/multiselect";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { const_txt } from "../../../global-functions/const";
import QRCode from "qrcode";

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

export default {
  components: {
    Loading,
    paginate: Paginate,
  },
  // components: {
  //   Multiselect,
  // },
  data() {
    return {
      isLoading: false,
      qrModal: false,
      addVariantModal: false,
      viewVariantsModal: false,
      searchData: "",
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,
      addProduct: false,
      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,

      archiveConfirmationModalOption: false,
      archiveModalOption: false,
      restoreConfirmationModalOption: false,
      deleteConfirmationModalOption: false,

      viewItemModal: false,

      titleChange: -1,
      formDataProduct: {
        name: "",
        abbreviation: "",
        description: "",
        productType: "",
        image: "",
        visible: true,
        inStock: true,
        price: 0,
        vatPercentage: 0,
        isDiscount: false,
        discountedPrice: 0,
        discountReason: "",
        categoryId: "",
        brandId: "",
        unitId: "",
        image: "",
      },
      formDataProductDefault: {
        name: "",
        abbreviation: "",
        description: "",
        productType: "",
        image: "",
        visible: true,
        inStock: true,
        price: 0,
        vatPercentage: 0,
        isDiscount: false,
        discountedPrice: 0,
        discountReason: "",
        categoryId: "",
        brandId: "",
        unitId: "",
        image: "",
      },

      optionChange: -1,
      formDataVariant: {
        variantTypeId: "",
        productId: "",
      },
      formDataVariantDefault: {
        variantTypeId: "",
        productId: "",
      },

      value: null,

      headers: [
        // { text: "ID", value: "productId" },
        // { text: "Name", value: "name" },
        // { text: "Abbreviation", value: "abbreviation" },
        // { text: "Price", value: "price" },
        // { text: "Unit", value: "unit" },
        // { text: "Category", value: "category" },
        // { text: "Brand", value: "brand" },
      ],
      variantsHeader: [
        { text: "Product", value: "name" },
        { text: "Variant", value: "type" },
        { text: "Option", value: "option" },
      ],
      variants: [],
      pagination: {
        pageNumber: 1,
        pageSize: 10,
        search: "",
        // sortColumnName: "name",
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
      itemstest: [{ productId: "1", name: "pro" }],
      itemsData: [],

      testValue: "",

      archiveItems: [],
      archiveData: [],
      paginationArchive: {
        pageNumber: 1,
        pageSize: 5,
        // sortColumnName: "name",
        // sortDirection: "asc",
      },

      pageCountArchive: 20,
      pageSizeArchive: 5,

      units: [],
      categories: [],
      brands: [],
      variantTypes: [],

      //product variant pagination
      pageCountVariant: 20,
      pageSizeVariant: 10,
      paginationVariant: {
        pageNumber: 1,
        pageSize: 10,
        search: "",
      },
      defaultPaginationVariant: {
        pageNumber: 1,
        pageSize: this.pageSize,
        search: "",
      },

      checkedData: [],

      addCheckedPrintModal: false,
      formDataPrint: {
        products: [],
        ip: "192.0.0.0",
        port: "9100",
        nbrOfCopies: "",
      },
      allSelected: false,

      allItems: [],
      allItemsData: [],
      isActive: 0,
      docs: null,
    };
  },
  computed: {
    slideSet() {
      return this.titleChange === -1 ? "false" : "false";
    },
    formTitle() {
      return this.titleChange === -1 ? "Add New Product" : "Edit Product";
    },
    variantTitle() {
      return this.optionChange === -1 ? "Add" : "Edit Variant";
    },
  },
  created() {
    this.getDataFromApi();
    this.getDefaultIP();
  },
  watch: {
    viewItemModal(val) {
      val || this.viewItemModalClose();
    },
  },
  methods: {
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
              { title: "Price", dataKey: "price" },
              { title: "Visible", dataKey: "visible" },
              { title: "In Stock", dataKey: "inStock" },
              { title: "Discount", dataKey: "isDiscount" },
              { title: "Unit", dataKey: "unit" },
              { title: "Category", dataKey: "category" },
              { title: "Brand", dataKey: "brand" },
              { title: "Product Type", dataKey: "productType" },
              { title: "VAT Percentage", dataKey: "vatPercentage" },
              { title: "Description", dataKey: "description" },
            ];
            this.docs = new jsPDF({
              orientation: "landscape",
              unit: "in",
              format: "a4",
            });

            let data = await this.getItemsWithQR(this.allItems);

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
          console.log("set Report", error);
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
              price: el.price,
              visible: el.visible,
              inStock: el.inStock,
              isDiscount: el.isDiscount,
              unit: el.unit,
              category: el.category,
              brand: el.brand,
              productType: el.productType,
              vatPercentage: el.vatPercentage,
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
        this.docs.save(`${"Products " + generateDate}.pdf`);
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
        var csvTitle = "Products " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "Abbreviation",
          2: "Name",
          3: "Price",
          4: "Visible",
          5: "In Stock",
          6: "Discount",
          7: "Unit",
          8: "Category",
          9: "Brand",
          10: "Product Type",
          11: "VAT Percentage",
          12: "Description",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.abbreviation,
            2: item.name,
            3: item.price,
            4: item.visible,
            5: item.inStock,
            6: item.isDiscount,
            7: item.unit,
            8: item.category,
            9: item.brand,
            10: item.productType,
            11: item.vatPercentage,
            12: item.description,
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
        .post("Products/Paginated", pagination)
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
      // axios
      //   .post("StorageBins/PrintBins ", this.formDataPrint)
      //   .then((response) => {
      //     console.log(response);
      //   });
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
        warningToast("Please Select Storage Bin");
      }
    },

    getDefaultIP() {
      axios.get("https://api.ipify.org/").then((response) => {
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

    booleanStatus(status) {
      return booleanStatus(status);
    },
    booleanStatusColor(status) {
      return booleanStatusColor(status);
    },

    getSelectedColor() {
      return "background-color:rgb(22,78,99);color: white";
    },

    showQrModal(item) {
      removeNullValue(item);
      this.formDataProduct = Object.assign({}, item);
      this.qrModal = true;
    },
    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("Products/Paginated", this.pagination)
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
          failedToast(error);
          // localStorage.setItem("errorMessage", error);
          // router.push("/page-down");
        });
    },
    getCategories() {
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("Categories/IdAndNamePaginated", pagination)
        .then((response) => {
          this.categories = response.data.data.items;
          //CHANGES
          // if (this.categories.length > 0) {
          //   if (this.titleChange === -1) {
          //     this.formDataProduct.categoryId = this.categories[0].categoryId;
          //   }
          // } else

          if (this.categories.length == 0) {
            warningToast("Please Add Items in categories");
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    getBrands() {
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("Brands/IdAndNamePaginated", pagination)
        .then((response) => {
          this.brands = response.data.data.items;
          // if (this.brands.length > 0) {
          //   if (this.titleChange === -1) {
          //     this.formDataProduct.brandId = this.brands[0].brandId;
          //   }
          // } else
          if (this.brands.length == 0) {
            warningToast("Please Add Items in Warehouse");
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },
    getUnits() {
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("Units/Paginated", pagination)
        .then((response) => {
          this.units = response.data.data.items;
          // if (this.units.length > 0) {
          //   if (this.titleChange === -1) {
          //     this.formDataProduct.unitId = this.units[0].unitId;
          //   }
          // } else
          if (this.units.length == 0) {
            warningToast("Please Add Items in Units");
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
        });
    },

    viewVariants(item) {
      // this.formDataProduct = Object.assign({}, item);
      // this.formDataVariant.productId = this.formDataProduct.productId;
      // this.getVariantTypes();
      // this.getProductVariants();
      // this.viewVariantsModal = true;
      // this.addVariantModal = false;
      // this.optionChange = -1;
    },

    getProductVariants() {
      var productId = this.formDataVariant.productId;
      this.isLoading = true;
      axios
        .post("ProductVariant/Product/" + productId, this.paginationOption)
        .then((response) => {
          if (response.data.success === true) {
            this.variantItemsData = response.data.data;
            this.variantItems = response.data.data.items;
            this.isLoading = false;
          } else {
            warningToast(response.data.message);
            this.isLoading = false;
          }

          // this.pageCountVariant = this.variantItemsData.totalPages;
        })
        .catch((error) => {
          failedToast;
          // localStorage.setItem("errorMessage", error);
          //   router.push("/page-down");
        });
    },
    addVariantOption() {
      this.addVariantModal = true;
      this.optionChange = -1;
    },

    getVariantTypes() {
      var pagination = { pageNumber: 1, pageSize: 10 };
      axios
        .post("VariantType/Paginated", pagination)
        .then((response) => {
          this.variantTypes = response.data.data.items;

          // CHANGES
          // if (this.variantTypes.length > 0) {
          //   this.formDataVariant.variantTypeId =
          //     this.variantTypes[0].variantTypeId;
          // } else
          if (this.storageTypes.length == 0) {
            warningToast("Please Add Items in Variant Type");
            this.addVariantModal = false;
          }
        })
        .catch((error) => {
          warningToast(statusMessage(error.response.status));
          this.addVariantModal = false;
        });
    },

    saveVariantType() {
      if (this.optionChange === -1) {
        this.isLoading = true;
        axios
          .post("ProductVariant", this.formDataVariant)
          .then((response) => {
            if (response.data.success === true) {
              console.log(response);
              // this.getProductVariants();
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
            // this.itemsData = response.data.data;
            // this.items = response.data.data.items;

            if (response.data.success === true) {
              this.addVariantOptionModal = false;
              this.getDataFromApiOption();
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

    unitChange() {
      console.log(this.testValue);
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
      this.formDataProduct = Object.assign({}, this.formDataProductDefault);
    },

    showModal() {
      this.setDefault();

      this.titleChange = -1;
      this.activateModal();
    },

    activateModal() {
      //CHANGES
      this.getCategories();
      this.getBrands();
      this.getUnits();
      this.addProduct = true;
    },
    closeForm() {
      this.addProduct = false;
    },
    closeVariantForm() {
      this.viewVariantsModal = false;
    },
    editItem(item) {
      removeNullValue(item);
      this.titleChange = 0;
      this.formDataProduct = Object.assign({}, item);
      this.activateModal();
    },

    saveForm() {
      if (
        this.formDataProduct.name == "" ||
        this.formDataProduct.abbreviation == ""
      ) {
        if (this.formDataProduct.name == "") {
          warningToast("Name Required");
        }
        if (this.formDataProduct.abbreviation == "") {
          warningToast("Abbreviation Required");
        }
      } else {
        if (this.titleChange === -1) {
          this.isLoading = true;
          axios
            .post("Products", this.formDataProduct)
            .then((response) => {
              if (response.data.success === true) {
                this.addProduct = false;
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
          var itemId = this.formDataProduct.productId;
          this.isLoading = true;
          axios
            .put("Products/Id?Id=" + itemId, this.formDataProduct)
            .then((response) => {
              if (response.data.success === true) {
                this.addProduct = false;
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
    saveVariantForm() {
      this.isLoading = true;
      axios
        .post("Variants", this.formDataProduct)
        .then((response) => {
          if (response.data.success === true) {
            this.viewVariantsModal = false;
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
      this.formDataProduct = Object.assign({}, item);
      this.archiveConfirmationModal = true;
    },

    viewItemInfo(item) {
      removeNullValue(item);
      this.formDataProduct = Object.assign({}, item);
      this.viewItemModal = true;
    },
    viewItemModalClose() {
      this.isLoading = true;

      for (var i = 0; i < this.items.length; i++) {
        this.items[i].selected = false;
        this.isLoading = false;

        this.viewItemModal = false;
      }
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
      var itemId = this.formDataProduct.productId;
      this.isLoading = true;
      axios
        .get("Products/" + itemId + "/Archive")
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
        .post("Products/Archived", this.paginationArchive)
        .then((response) => {
          if (response.data.success === true) {
            this.archiveData = response.data.data;
            this.archiveItems = response.data.data.items;
            this.pageCountArchive = this.archiveData.totalPages;
            this.archiveModal = true;
            this.isLoading = false;
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
      this.formDataProduct = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.formDataProduct.productId;
      this.isLoading = true;
      axios
        .get("Products/" + itemId + "/Restore")
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
      this.formDataProduct = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataProduct.productId;
      axios
        .delete("Products/" + itemId)
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

    //Option
    searchOnchangeArchiveOption() {
      if (this.searchDataArchiveOption != "") {
        this.searchActiveArchiveOption = true;
        this.searchItemArchiveOption();
      } else {
        this.clearSearchArchiveOption();
      }
    },
    clearSearchArchiveOption() {
      this.searchDataArchiveOption = "";
      this.paginationArchive.search = this.searchDataArchiveOption;
      this.viewArchivesOption();
      this.searchActiveArchiveOption = false;
    },
    searchItemArchiveOption() {
      if (this.searchDataArchiveOption != "") {
        this.searchActiveArchiveOption = true;
        this.paginationArchive.search = this.searchDataArchiveOption;
        this.viewArchivesOption();
      }
    },
    archiveItemOption(item) {
      this.formDataProduct = Object.assign({}, item);
      this.archiveConfirmationModalOption = true;
    },

    closeArchiveOption() {
      this.archiveConfirmationModalOption = false;
      this.setDefault();
    },
    archiveItemConfirmOption() {
      var itemId = this.formDataProduct.productId;
      this.isLoading = true;
      axios
        .get("VariantTypes/" + itemId + "/Archive")
        .then((response) => {
          if (response.data.success === true) {
            this.archiveConfirmationModalOption = false;
            this.getDataFromApiOption();
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
      //   .post("Variant/Archived", this.paginationArchive)
      //   .then((response) => {
      //     this.archiveData = response.data.data;
      //     this.archiveItems = response.data.data.items;
      //     this.pageCountArchiveOption = this.archiveData.totalPages;

      this.archiveModalOption = true;
      //     // if (this.archiveData.totalCount > 0) {
      //     //   this.archiveModal = true;
      //     // } else {
      //     //    this.archiveModal = false;
      //     //   alert("No Data in Archive");
      //     // }
      //   });
    },

    changePageArchiveOption(pageNum) {
      this.paginationArchive.pageNumber = pageNum;
      this.viewArchivesOption();
    },
    restoreItemOption(item) {
      this.formDataProduct = Object.assign({}, item);
      this.restoreConfirmationModalOption = true;
    },
    restoreItemConfirmOption() {
      var itemId = this.formDataProduct.productId;
      this.isLoading = true;
      axios
        .get("VariantTypes/" + itemId + "/Restore")
        .then((response) => {
          if (response.data.success === true) {
            this.restoreConfirmationModalOption = false;
            this.viewArchivesOption();
            this.getDataFromApiOption();
            successToast(response.data.message);
            if (this.archiveData.totalCount == 0) {
              this.archiveModalOption = false;
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
    deleteItemOption(item) {
      this.formDataProduct = Object.assign({}, item);
      this.deleteConfirmationModalOption = true;
    },
    deleteItemConfirmOption() {
      this.isLoading = true;
      var itemId = this.formDataProduct.productId;
      axios
        .delete("VariantTypes/" + itemId)
        .then((response) => {
          if (response.data.success === true) {
            this.deleteConfirmationModalOption = false;
            this.viewArchivesOption();
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
