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
          Add New Customer
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
            <th
              class="whitespace-nowrap"
              v-for="(header, i) in headers"
              :key="i"
            >
              {{ header.text }}
            </th>
            <th>On Hold</th>
            <th>Individual</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i" class="intro-x">
            <td v-for="(header, index) in headers" :key="index">
              {{ item[header.value] }}
            </td>
            <td>
              <div class="form-switch ml-3">
                <input
                  id="booleanSwitch"
                  type="checkbox"
                  v-model="item.isBlackListed"
                  class="form-check-input"
                  disabled
                />
              </div>
            </td>
            <td>
              <div class="form-switch ml-3">
                <input
                  id="booleanSwitch"
                  type="checkbox"
                  v-model="item.isIndividualPersonal"
                  class="form-check-input"
                  disabled
                />
              </div>
            </td>

            <!-- <td class="w-24">
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
            </td> -->

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
                  >
                    <InfoIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1"
                    />
                  </Tippy>
                </a>
                <a
                  class="flex items-center mr-3 font-bold"
                  href="javascript:;"
                  @click="viewContactItemInfo(item)"
                >
                  <Tippy
                    tag="a"
                    href="javascript:;"
                    class="tooltip"
                    content="View Customer Contact"
                  >
                    <PhoneIcon
                      class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1 text-green-600"
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

  <!-- BEGIN: Details  Modal -->
  <MoveableModal
    :show="basicModalPreview"
    @hidden="basicModalPreview = false"
    backdrop="static"
    size="modal-xl"
    title="Add New Customer Contact"
    @close="basicModalPreview = false"
  >
    <ModalBody>
      <h2
        class="text-success py-4 text-xl w-full font-semibold bg-gray-200 text-center mb-5"
      >
        Customer Contact Person - {{ index + 1 }}
      </h2>
      <div
        v-for="(input, index) in formDataContact"
        :key="`phoneInput-${index}`"
        class="grid lg:grid-cols-5 md:grid-cols-5 grid-cols-2 lg:gap-4 md:gap-4 gap-2 pb-2"
      >
        <div class="lg:col-span-2 md:col-span-2 col-span-0">
          <label for="regular-form-1" class="form-label">First Name</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataCustomer.firstName"
              type="text"
              class="form-control"
              name="firstName"
              placeholder="First Name"
            />
          </div>
        </div>

        <div class="lg:col-span-2 md:col-span-2 col-span-0">
          <label for="regular-form-1" class="form-label">Telephone</label>

          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formDataCustomer.telephone"
              type="text"
              class="form-control"
              name="telephone"
              placeholder="telephone"
            />
          </div>
        </div>
        <div class="flex justify-center items-center space-x-4 mt-5">
          <PlusIcon
            class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-success"
            @click="addField(input, formDataContact)"
          />

          <XCircleIcon
            class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-danger"
            v-show="formDataContact.length > 1"
            @click="removeField(index, formDataContact)"
          />
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="basicModalPreview = false"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        Cancel
      </button>
      <button @click="saveForm()" type="submit" class="btn btn-primary w-24">
        Done
      </button>
    </ModalFooter>
  </MoveableModal>

  <!-- END: Details modal -->

  <!-- BEGIN: Add  Modal -->

  <MoveableModal
    :show="addCustomer"
    @hidden="addCustomer = false"
    backdrop="static"
    size="modal-xl"
    :title="formTitle"
    @close="addCustomer = false"
  >
    <ModalBody
      class="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 lg:gap-4 md:gap-4 gap-2"
    >
      <div class="">
        <label for="regular-form-1" class="form-label">First Name</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataCustomer.firstName"
            type="text"
            class="form-control"
            name="firstName"
            placeholder="First Name"
          />
        </div>
      </div>

      <div class="">
        <label for="regular-form-1" class="form-label">Last Name</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataCustomer.lastName"
            type="text"
            class="form-control"
            name="lastName"
            placeholder="Last Name"
          />
        </div>
      </div>

      <div class="">
        <label for="regular-form-1" class="form-label">Company</label>

        <div class="flex flex-col space-y-1">
          <input
            id="vertical-form-1"
            v-model="formDataCustomer.company"
            type="text"
            class="form-control"
            name="company"
            placeholder="Company"
          />
        </div>
      </div>

      <div class="relative col-span-3 pt-2">
        <h3 class="absolute -top-2.5 left-4 bg-white pt-2">
          Customer Contact Detail
        </h3>
        <div
          class="border rounded-md border-slate-200 border-solid p-4 h-full grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 lg:gap-4 md:gap-4 gap-2"
        >
          <div class="">
            <label for="regular-form-1" class="form-label">Email</label>

            <div class="flex flex-col space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataCustomer.email"
                type="text"
                class="form-control"
                name="email"
                placeholder="Email"
              />
            </div>
          </div>
          <div class="">
            <label for="regular-form-1" class="form-label">Telephone</label>

            <div class="flex flex-col space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataCustomer.telephone"
                type="number"
                class="form-control"
                name="telephone"
                placeholder="telephone"
              />
            </div>
          </div>

          <div class="">
            <label for="regular-form-1" class="form-label">Mobile</label>

            <div class="flex flex-col space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataCustomer.mobile"
                type="number"
                class="form-control"
                name="mobile"
                placeholder="Mobile"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-0">
        <label>On Hold</label>
        <div class="form-switch mt-3">
          <input
            type="checkbox"
            v-model="formDataCustomer.isBlackListed"
            class="form-check-input"
          />
        </div>
      </div>

      <div class="col-span-0">
        <label>Is Individual</label>
        <div class="form-switch mt-3">
          <input
            type="checkbox"
            v-model="formDataCustomer.isIndividualPersonal"
            class="form-check-input"
          />
        </div>
      </div>

      <div class="relative col-span-3 pt-2">
        <h3 class="absolute -top-2.5 left-4 bg-white pt-2">Delivery Address</h3>
        <div
          class="border rounded-md border-slate-200 border-solid p-4 h-full grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 lg:gap-4 md:gap-4 gap-2"
        >
          <div class="col-span-3">
            <label for="regular-form-1" class="form-label col-span-4"
              >Address</label
            >

            <div class="flex flex-col space-y-1">
              <textarea
                id="vertical-form-1"
                v-model="formDataCustomer.address"
                type="text"
                class="form-control h-10"
                name="address"
                placeholder="Address"
              ></textarea>
            </div>
          </div>

          <div>
            <label for="regular-form-1" class="form-label">Postcode</label>

            <div class="flex flex-col space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataCustomer.postcode"
                type="text"
                class="form-control"
                name="postcode"
                placeholder="Postcode"
              />
            </div>
          </div>

          <div>
            <label for="regular-form-1" class="form-label">State</label>

            <div class="flex flex-col space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataCustomer.state"
                type="text"
                class="form-control"
                name="state"
                placeholder="State"
              />
            </div>
          </div>

          <div>
            <label for="regular-form-1" class="form-label">City</label>

            <div class="flex flex-col space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataCustomer.city"
                type="text"
                class="form-control"
                name="city"
                placeholder="City"
              />
            </div>
          </div>

          <div class="col-span-2">
            <label for="regular-form-1" class="form-label">Country</label>

            <div class="flex flex-col space-y-1">
              <TomSelect
                v-model="formDataCustomer.country"
                :options="{
                  placeholder: 'Search...',
                  allowEmptyOption: true,
                }"
                class="w-full"
              >
                <option v-if="titleChange != -1">
                  {{ formDataCustomer.country }}
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
  <!-- END: Add Modal -->

  <!-- BEGIN: Confirmation Modals -->
  <ArchiveConfirmModal
    :name="formDataCustomer.firstName + ' ' + formDataCustomer.lastName"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="archiveItemConfirm"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="formDataCustomer.firstName + ' ' + formDataCustomer.lastName"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="restoreItemConfirm"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="formDataCustomer.firstName + ' ' + formDataCustomer.lastName"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete"
  />

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
        Archived Customers
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
            <tr v-for="(item, i) in archiveItems" :key="i" class="intro-x">
              <td v-for="(header, index) in headers" :key="index">
                {{ item[header.value] }}
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

  <!-- BEGIN: View Info Modal -->

  <MoveableModal
    :show="viewItemModal"
    @hidden="viewItemModal = false"
    backdrop="static"
    size="modal-sl-60"
    title="INFO"
    @close="viewItemModal = false"
  >
    <ModalBody class="p-0">
      <!-- BEGIN: INFO -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4 mt-6">
        <div class="p-5 text-center">
          <BoxIcon class="w-8 h-8 text-danger mx-auto mt-2" />

          <div class="text-xl font-bold mt-5">
            {{ formDataCustomer.firstName }} {{ formDataCustomer.lastName }}
          </div>
        </div>
        <div class="intro-y box p-5 mt-12 sm:mt-5">
          <div
            class="pt-4 intro-y box grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 lg:gap-4 md:gap-4 gap-2"
          >
            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Company</div>
              </div>
              <div>
                {{
                  formDataCustomer.company != null
                    ? formDataCustomer.company
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Address</div>
              </div>
              <div>
                {{
                  formDataCustomer.address != null
                    ? formDataCustomer.address
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>INDIVIDUAL</div>
              </div>
              <div class="form-switch ml-3">
                <input
                  id="booleanSwitch"
                  type="checkbox"
                  v-model="formDataCustomer.isIndividualPersonal"
                  class="form-check-input"
                  disabled
                />
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>On Hold</div>
              </div>
              <div class="form-switch ml-3">
                <input
                  id="booleanSwitch"
                  type="checkbox"
                  v-model="formDataCustomer.isBlackListed"
                  class="form-check-input"
                  disabled
                />
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Email</div>
              </div>
              <div>
                {{
                  formDataCustomer.email != null
                    ? formDataCustomer.email
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Telephone</div>
              </div>
              <div>
                {{
                  formDataCustomer.telephone != null
                    ? formDataCustomer.telephone
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Mobile</div>
              </div>
              <div>
                {{
                  formDataCustomer.mobile != null
                    ? formDataCustomer.mobile
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Postcode</div>
              </div>
              <div>
                {{
                  formDataCustomer.postcode != null
                    ? formDataCustomer.postcode
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>State</div>
              </div>
              <div>
                {{
                  formDataCustomer.state != null
                    ? formDataCustomer.state
                    : "Nil"
                }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>City</div>
              </div>
              <div>
                {{ formDataCustomer.city || "Nil" }}
              </div>
            </div>

            <div class="flex flex-col items-center mb-5">
              <div class="flex items-center font-bold uppercase">
                <div>Country</div>
              </div>
              <div>
                {{
                  formDataCustomer.country != null
                    ? formDataCustomer.country
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

  <ArchiveConfirmModal
    :name="
      this.formDataContact[0].firstName + ' ' + this.formDataContact[0].lastName
    "
    :modalStatus="archiveContactConfirmationModal"
    :modalConfirm="archiveContactItemConfirm"
    :modalClose="closeContactArchive"
  />
  <RestoreConfirmModal
    :name="
      this.formDataContact[0].firstName + ' ' + this.formDataContact[0].lastName
    "
    :modalStatus="restoreContactConfirmationModal"
    :modalConfirm="restoreItemContactConfirm"
    :modalClose="closeContactRestores"
  />
  <DeleteConfirmModal
    :name="
      this.formDataContact[0].firstName + ' ' + this.formDataContact[0].lastName
    "
    :modalStatus="deleteContactConfirmationModal"
    :modalConfirm="deleteItemContactConfirm"
    :modalClose="closeContactDeletes"
  />

  <DefaultContactConfirmModal
    :name="
      this.formDataContact[0].firstName + ' ' + this.formDataContact[0].lastName
    "
    :modalStatus="defaultContactConfirmationModal"
    :modalConfirm="defaultItemContactConfirm"
    :modalClose="closeContactDefault"
  />

  <MoveableModal
    :show="addContactModal"
    @hidden="addContactModal = false"
    backdrop="static"
    size="modal-sl-80"
    :title="formContactTitle"
    @close="closeContact()"
  >
    <ModalBody class="p-0">
      <div
        v-for="(input, index) in formDataContact"
        :key="`phoneInput-${index}`"
        class="flex flex-col justify-center items-center space-y-4"
      >
        <h2
          class="text-success py-4 text-xl w-full font-semibold bg-gray-200 text-center"
        >
          Customer Contact Person - {{ index + 1 }}
        </h2>
        <div class="flex justify-center items-center space-x-4 w-full p-6">
          <div
            class="grid lg:grid-cols-9 md:grid-cols-9 grid-cols-2 lg:gap-4 md:gap-4 gap-2 pb-2"
          >
            <div class="col-span-3">
              <label for="regular-form-1" class="form-label"
                >Customer First Name</label
              >

              <div class="flex flex-col space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="input.firstName"
                  type="text"
                  class="form-control"
                  placeholder="Customer First Name"
                />
              </div>
            </div>

            <div class="col-span-3">
              <label for="regular-form-1" class="form-label"
                >Customer Last Name
              </label>

              <div class="flex flex-col space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="input.lastName"
                  type="text"
                  class="form-control"
                  placeholder="Customer Last Name"
                />
              </div>
            </div>

            <div class="col-span-3">
              <label for="regular-form-1" class="form-label">Email </label>

              <div class="flex flex-col space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="input.email"
                  type="email"
                  class="form-control"
                  required
                  placeholder="Customer Email"
                />
              </div>
            </div>

            <div class="col-span-3">
              <label for="regular-form-1" class="form-label"
                >Telephone No
              </label>

              <div class="flex flex-col space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="input.telephone"
                  type="number"
                  required
                  class="form-control"
                  placeholder="Customer Telephone"
                />
              </div>
            </div>

            <div class="col-span-3">
              <label for="regular-form-1" class="form-label">Mobile No </label>

              <div class="flex flex-col space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="input.mobile"
                  type="number"
                  class="form-control"
                  placeholder="Customer Telephone"
                />
              </div>
            </div>

            <div class="col-span-3 flex flex-col justify-center items-center">
              <label>On Hold</label>
              <div class="form-switch mt-3">
                <input
                  type="checkbox"
                  v-model="input.isBlackListed"
                  class="form-check-input"
                />
              </div>
            </div>

            <div class="relative col-span-9 pt-2">
              <h3 class="absolute -top-2.5 left-4 bg-white pt-2">
                Customer Address
              </h3>
              <div
                class="border rounded-md border-slate-200 border-solid p-4 h-full grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 lg:gap-4 md:gap-4 gap-2"
              >
                <div class="col-span-3">
                  <label for="regular-form-1" class="form-label">Address</label>
                  <div class="flex flex-col space-y-1">
                    <input
                      id="vertical-form-1"
                      v-model="input.address"
                      type="text"
                      class="form-control"
                      placeholder="Address Line"
                    />
                  </div>
                </div>
                <div>
                  <label for="regular-form-1" class="form-label"
                    >Postcode</label
                  >
                  <div class="flex flex-col space-y-1">
                    <input
                      id="vertical-form-1"
                      v-model="input.postcode"
                      type="text"
                      class="form-control"
                      placeholder="Post Code"
                    />
                  </div>
                </div>
                <div>
                  <label for="regular-form-1" class="form-label">State</label>
                  <div class="flex flex-col space-y-1">
                    <input
                      id="vertical-form-1"
                      v-model="input.state"
                      type="text"
                      class="form-control"
                      placeholder="State"
                    />
                  </div>
                </div>
                <div>
                  <label for="regular-form-1" class="form-label">City</label>
                  <div class="flex flex-col space-y-1">
                    <input
                      id="vertical-form-1"
                      v-model="input.city"
                      type="text"
                      class="form-control"
                      placeholder="City"
                    />
                  </div>
                </div>
                <div class="col-span-2">
                  <label for="regular-form-1" class="form-label">Country</label>
                  <TomSelect
                    v-model="input.country"
                    :options="{
                      placeholder: 'Search...',
                      allowEmptyOption: true,
                    }"
                    class="w-full"
                  >
                    <option v-if="titleContactChange != -1">
                      {{ formDataContact.country || "Nil" }}
                    </option>
                    <option v-if="titleContactChange == -1" value="fiji">
                      Fiji
                    </option>
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
          <div
            class="flex justify-center items-center space-x-4"
            v-if="titleContactChange != 0"
          >
            <Tippy
              tag="a"
              href="javascript:;"
              class="tooltip"
              content="Add More"
              :options="{
                zIndex: 99999,
              }"
            >
              <PlusIcon
                class="w-12 h-12 text-success"
                @click="addField(input, formDataContact)"
              />
            </Tippy>

            <Tippy
              tag="a"
              href="javascript:;"
              class="tooltip"
              content="Remove"
              :options="{
                zIndex: 99999,
              }"
            >
              <XCircleIcon
                class="w-12 h-12 text-danger"
                v-show="formDataContact.length > 1"
                @click="removeField(index, formDataContact)"
              />
            </Tippy>
          </div>
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="closeContact()"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        {{ const_txt.CANCEL_BTN }}
      </button>
      <button @click="saveContact()" type="submit" class="btn btn-primary w-24">
        {{ btnContactName }}
      </button>
    </ModalFooter>
  </MoveableModal>

  <MoveableModal
    :show="addContactInfoModal"
    @hidden="addContactInfoModal = false"
    backdrop="static"
    size="modal-sl-60"
    :title="'Customer ' + formDataCustomer.company + ' Contacts'"
    @close="addContactInfoModal = false"
  >
    <ModalBody class="p-0">
      <!-- BEGIN: INFO -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4">
        <div class="intro-y col-span-12 overflow-auto p-4">
          <div class="flex items-center justify-between w-full space-x-4">
            <button @click="addContact()" class="btn btn-success h-10">
              <PhoneIcon
                class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white mr-2"
              />
              <span class="text-white uppercase">Add New Customer Contact</span>
            </button>
            <button
              @click="viewContactArchives()"
              class="btn btn-primary h-10 w-28"
            >
              <ArchiveIcon
                class="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white mr-2"
              />
              <span class="text-white uppercase"> ARCHIVE</span>
            </button>
          </div>
          <table class="table table-report -mt-2 table-auto">
            <thead>
              <tr class="uppercase whitespace-nowrap">
                <th>NO</th>
                <th>Customer Name</th>
                <th
                  class="whitespace-nowrap"
                  v-for="(header, i) in contactHeaders"
                  :key="i"
                >
                  {{ header.text }}
                </th>
                <th>On Hold</th>

                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in sortedContacts"
                :key="i"
                class="intro-x"
                style="height: 140px"
              >
                <td :style="item.default == true ? getSelectedColor() : ''">
                  <div
                    :class="
                      item.default == true ? 'ribbon ribbon-top-left' : ''
                    "
                  >
                    <span v-if="item.default == true" class="font-semi-bold"
                      >DFLT</span
                    >
                  </div>
                  {{ i + 1 }}
                </td>
                <td :style="item.default == true ? getSelectedColor() : ''">
                  {{ item.firstName || "Nil" }}
                  {{ item.lastName || "Nil" }}
                </td>
                <td
                  v-for="(header, index) in contactHeaders"
                  :key="index"
                  :style="item.default == true ? getSelectedColor() : ''"
                >
                  {{ item[header.value] || "Nil" }}
                </td>
                <td :style="item.default == true ? getSelectedColor() : ''">
                  <div class="form-switch ml-3">
                    <input
                      id="booleanSwitch"
                      type="checkbox"
                      v-model="item.isBlackListed"
                      class="form-check-input"
                      disabled
                    />
                  </div>
                </td>
                <td :style="item.default == true ? getSelectedColor() : ''">
                  <div class="flex flex-col space-y-1 w-64">
                    <div>{{ item.address || "Nil" }}</div>
                    <div>{{ item.postcode || "Nil" }}</div>
                    <div>{{ item.state || "Nil" }}</div>
                    <div>{{ item.city || "Nil" }}</div>
                    <div>{{ item.country || "Nil" }}</div>
                  </div>
                </td>

                <td class="table-report__action w-20">
                  <div class="flex justify-center items-center">
                    <a
                      @click="defaultContactItem(item)"
                      class="flex items-center mr-3"
                      href="javascript:;"
                      v-if="item.default == false"
                    >
                      <Tippy
                        tag="a"
                        href="javascript:;"
                        class="tooltip"
                        content="Set as Default Contact"
                        :options="{
                          zIndex: 99999,
                        }"
                        ><AlbumIcon class="w-6 h-6 mr-1 text-primary" />
                      </Tippy>
                    </a>

                    <a
                      class="flex items-center mr-3"
                      href="javascript:;"
                      v-if="item.default == true"
                    >
                      <Tippy
                        tag="a"
                        href="javascript:;"
                        class="tooltip"
                        content="Default Contact"
                        :options="{
                          zIndex: 99999,
                        }"
                        ><AlbumIcon class="w-6 h-6 mr-1 text-success" />
                      </Tippy>
                    </a>
                    <a
                      @click="editContact(item)"
                      class="flex items-center mr-3"
                      href="javascript:;"
                    >
                      <Tippy
                        tag="a"
                        href="javascript:;"
                        class="tooltip"
                        content="Edit Contact"
                        :options="{
                          zIndex: 99999,
                        }"
                        ><EditIcon class="w-6 h-6 mr-1" />
                      </Tippy>
                    </a>
                    <a
                      class="flex items-center text-danger"
                      href="javascript:;"
                      @click="archiveContactItem(item)"
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
          <!-- BEGIN: Pagination -->

          <!-- <div
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
        </select> -->
        </div>

        <!-- END: Pagination -->
      </div>

      <!-- END: INFO -->
    </ModalBody>
  </MoveableModal>
  <!-- END: View Bin Info Modal-->

  <MoveableModal
    :show="archiveContactModal"
    @hidden="archiveContactModal = false"
    backdrop="static"
    size="modal-sl-80"
    title="Archived Customer Contact Person"
    @close="archiveContactModal = false"
  >
    <ModalBody class="p-0">
      <div class="w-full sm:w-auto mt-3 sm:mt-0">
        <div class="w-full relative text-slate-500">
          <input
            type="text"
            class="form-control w-full box pr-10"
            placeholder="Search..."
            v-model="searchDataContactArchive"
            @change="searchOnchangeContactArchive"
            clearable
          />
          <SearchIcon
            @click="searchItemContactArchive"
            v-if="searchActiveContactArchive == false"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
          <XIcon
            @click="clearSearchContactArchive"
            v-if="searchActiveContactArchive == true"
            class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
          />
        </div>
      </div>
      <!-- SEARCH END-->
      <!-- BEGIN: Archive Data List -->
      <div
        class="p-5 text-center text-lg"
        v-if="this.archiveContactData.totalCount == 0"
      >
        No data
      </div>
      <div
        class="intro-y col-span-12 overflow-auto p-4"
        v-if="this.archiveContactData.totalCount > 0"
      >
        <table class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>No</th>
              <th>Customer Name</th>
              <th
                class="whitespace-nowrap"
                v-for="(header, i) in contactHeaders"
                :key="i"
              >
                {{ header.text }}
              </th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in archiveContactItems"
              :key="i"
              class="intro-x"
            >
              <td>{{ i + 1 }}</td>
              <td>
                {{ item.firstName || "Nil" }}
                {{ item.lastName || "Nil" }}
              </td>
              <td v-for="(header, index) in contactHeaders" :key="index">
                {{ item[header.value] || "Nil" }}
              </td>
              <td :style="item.default == true ? getSelectedColor() : ''">
                <div class="flex flex-col space-y-1 w-64">
                  <div>{{ item.address || "Nil" }}</div>
                  <div>{{ item.postcode || "Nil" }}</div>
                  <div>{{ item.state || "Nil" }}</div>
                  <div>{{ item.city || "Nil" }}</div>
                  <div>{{ item.country || "Nil" }}</div>
                </div>
              </td>

              <td class="table-report__action w-56">
                <div class="flex justify-center items-center">
                  <a
                    @click="restoreContactItem(item)"
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
                    @click="deleteContactItem(item)"
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
            :page-count="pageCountContactArchive"
            :page-range="5"
            :margin-pages="2"
            :click-handler="changePageContactArchive"
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
          v-model="pageContactSize"
          class="w-20 form-select box cursor-pointer"
          @change="pageContactSizeChange"
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
  </MoveableModal>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";

import { required, minLength, maxLength, integer } from "@vuelidate/validators";
import axios from "../../../services/http-common";
import Paginate from "vuejs-paginate-next";
import countryJson from "@/assets/json/countryAllData.json";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import router from "../../../router";

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
import { const_txt } from "../../../global-functions/const";

import store from "../../../store";
export default {
  mounted() {
    store.dispatch("menuTitle/setSubMenuTitle", "Customers");
  },
  components: {
    paginate: Paginate,
    Loading,
  },
  data() {
    return {
      const_txt: const_txt,
      isLoading: false,
      basicModalPreview: false,
      countryList: countryJson,
      searchData: "",
      searchActive: false,
      searchDataArchive: "",
      searchActiveArchive: false,
      addCustomer: false,
      archiveConfirmationModal: false,
      archiveModal: false,
      restoreConfirmationModal: false,
      deleteConfirmationModal: false,
      viewItemModal: false,
      titleChange: -1,

      heading: "",
      msg: "",

      formDataDetails: {},
      formDataCustomer: {
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        mobile: "",
        isBlackListed: false,
        isIndividualPersonal: false,
        address: "",
        postcode: "",
        state: "",
        city: "",
        country: "Fiji",
        company: "",
      },
      formDataCustomerDefault: {
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        mobile: "",
        isBlackListed: false,
        isIndividualPersonal: false,
        address: "",
        postcode: "",
        state: "",
        city: "",
        country: "Fiji",
        company: "",
      },

      rules: {
        firstName: {
          required,
          minLength: minLength(2),
        },
        lastName: {
          required,
          minLength: minLength(2),
        },
        email: {
          required,
          maxLength: maxLength(10),
        },
        telephone: {
          required,
          minLength: minLength(2),
        },
        mobile: {
          required,
          minLength: minLength(2),
        },
        address: {
          required,
          maxLength: maxLength(10),
        },
        postcode: {
          required,
          minLength: minLength(2),
        },
        state: {
          required,
          minLength: minLength(2),
        },
        city: {
          required,
          maxLength: maxLength(10),
        },
        country: {
          required,
          minLength: minLength(2),
        },
        company: {
          required,
          minLength: minLength(2),
        },
      },

      headers: [
        { text: "Company", value: "company" },
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
        { text: "Email", value: "email" },
        { text: "Mobile", value: "mobile" },
        { text: "Telephone", value: "telephone" },
        // { text: "On Hold", value: "isBlackListed" },
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

      pageSizeArchive: 5,

      allItems: [],
      allItemsData: [],

      isActive: 0,
      docs: null,

      contactHeaders: [
        // { text: "First Name", value: "firstName" },
        // { text: "Last Name", value: "lastName" },
        { text: "Email", value: "email" },
        { text: "Telephone", value: "telephone" },
        { text: "Mobile", value: "mobile" },
      ],

      formDataContact: [
        {
          customerId: 0,
          firstName: "",
          lastName: "",
          email: "",
          telephone: "",
          mobile: "",
          isBlackListed: false,
          address: "",
          postcode: "",
          state: "",
          city: "",
          country: "fiji",
        },
      ],

      formDataContactDefault: [
        {
          customerId: 0,
          firstName: "",
          lastName: "",
          email: "",
          telephone: "",
          mobile: "",
          isBlackListed: false,
          address: "",
          postcode: "",
          state: "",
          city: "",
          country: "fiji",
        },
      ],

      contactItems: [],

      addContactModal: false,
      titleContactChange: -1,
      addContactInfoModal: false,
      archiveContactConfirmationModal: false,
      restoreContactConfirmationModal: false,
      deleteContactConfirmationModal: false,
      defaultContactConfirmationModal: false,

      archiveContactItems: [],
      archiveContactData: [],
      paginationContactArchive: {
        pageNumber: 1,
        pageSize: 5,
        // sortColumnName: "firstName",
        // sortDirection: "asc",
      },
      pageCountContactArchive: 20,
      archiveContactModal: false,
      searchDataContactArchive: "",
      searchActiveContactArchive: false,
    };
  },
  computed: {
    formTitle() {
      return this.titleChange === -1 ? "Add New Customer" : "Edit Customer";
    },
    btnName() {
      return this.titleChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },
    formContactTitle() {
      return this.titleContactChange === -1
        ? "Add New Customer Contact Person"
        : "Edit Customer Contact Person";
    },
    btnContactName() {
      return this.titleContactChange === -1
        ? const_txt.SAVE_BTN
        : const_txt.UPDATE_BTN;
    },
    sortedContacts() {
      return this.contactItems.sort(({ default: a }, { default: b }) => b - a);
    },
  },
  created() {
    this.getDataFromApi();
  },

  methods: {
    setContactDefault() {
      this.formDataContact = [Object.assign({}, this.formDataContactDefault)];
    },
    addField(value, fieldType) {
      fieldType.push({ value: "" });
    },
    removeField(index, fieldType) {
      fieldType.splice(index, 1);
    },
    addContact() {
      this.addContactModal = true;
      this.titleContactChange = -1;
    },

    closeContact() {
      this.addContactModal = false;
      this.setContactDefault();
    },

    editContact(item) {
      this.titleContactChange = 0;
      this.formDataContact = [Object.assign({}, item)];
      this.addContactModal = true;
    },
    viewContactItemInfo(item) {
      this.formDataCustomer = Object.assign({}, item);
      this.addContactInfoModal = true;
      this.getCustomerContactPersons();
      this.isLoading = true;
    },

    defaultContactItem(item) {
      this.formDataContact = [Object.assign({}, item)];
      this.defaultContactConfirmationModal = true;
    },
    defaultItemContactConfirm() {
      var itemId = this.formDataContact[0].customerContactPersonId;
      this.isLoading = true;
      axios
        .put("CustomerContactPersons/" + itemId + "/UpdateDefaultContactPerson")
        .then((response) => {
          if (response.data.success === true) {
            this.defaultContactConfirmationModal = false;
            this.getCustomerContactPersons();
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

    getCustomerContactPersons() {
      var customerId = this.formDataCustomer.customerId;
      axios
        .get("CustomerContactPersons/" + customerId + "/CustomerContactPersons")
        .then((response) => {
          console.log(response);
          if (response.data.success === true) {
            this.contactItems = response.data.data;
            this.isLoading = false;
          } else {
            warningToast(response.data.message);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          warningToast(response.data.message);
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },

    saveContact() {
      if (
        this.formDataContact.email == "" ||
        this.formDataContact.mobile == ""
      ) {
        if (this.formDataContact.email == "") {
          warningToast("Email Required");
        }
        if (this.formDataContact.mobile == "") {
          warningToast("Mobile Required");
        }
      } else {
        if (this.titleContactChange === -1) {
          this.isLoading = true;
          var listArray = [];
          var defaultCountry;
          for (var i = 0; i < this.formDataContact.length; i++) {
            this.formDataContact[i].customerId =
              this.formDataCustomer.customerId;
            if (
              this.formDataContact[i].country == undefined ||
              this.formDataContact[i].country == null
            ) {
              defaultCountry = "fiji";
            } else {
              defaultCountry = this.formDataContact[i].country;
            }

            var contactObj = {
              customerId: this.formDataContact[i].customerId,
              firstName: this.formDataContact[i].firstName,
              lastName: this.formDataContact[i].lastName,
              email: this.formDataContact[i].email,
              telephone: this.formDataContact[i].telephone,
              mobile: this.formDataContact[i].mobile,
              isBlackListed: this.formDataContact[i].isBlackListed,
              address: this.formDataContact[i].address,
              postcode: this.formDataContact[i].postcode,
              state: this.formDataContact[i].state,
              city: this.formDataContact[i].city,
              country: defaultCountry,
            };

            // listArray.push(contactObj);

            axios
              .post("CustomerContactPersons", contactObj)
              .then((response) => {
                if (response.data.success === true) {
                  this.addContactModal = false;
                  this.isLoading = false;
                  this.getCustomerContactPersons();
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
        } else {
          var listArray = [];
          this.isLoading = true;
          for (var i = 0; i < this.formDataContact.length; i++) {
            this.formDataContact[i].customerId =
              this.formDataCustomer.customerId;

            var contactObj = {
              customerId: this.formDataContact[i].customerId,
              firstName: this.formDataContact[i].firstName,
              lastName: this.formDataContact[i].lastName,
              email: this.formDataContact[i].email,
              telephone: this.formDataContact[i].telephone,
              mobile: this.formDataContact[i].mobile,
              isBlackListed: this.formDataContact[i].isBlackListed,
              address: this.formDataContact[i].address,
              postcode: this.formDataContact[i].postcode,
              state: this.formDataContact[i].state,
              city: this.formDataContact[i].city,
              country: this.formDataContact[i].country,
            };

            // listArray.push(contactObj);
            var customerContactPersonId =
              this.formDataContact[0].customerContactPersonId;

            axios
              .put(
                "CustomerContactPersons/" + customerContactPersonId,
                contactObj
              )
              .then((response) => {
                if (response.data.success === true) {
                  this.isLoading = false;
                  this.addContactModal = false;
                  this.getCustomerContactPersons();
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
      }
    },

    archiveContactItem(item) {
      this.formDataContact = [Object.assign({}, item)];
      this.archiveContactConfirmationModal = true;
    },

    archiveContactItemConfirm() {
      this.isLoading = true;
      var customerContactPersonId =
        this.formDataContact[0].customerContactPersonId;
      axios
        .get("CustomerContactPersons/" + customerContactPersonId + "/Archive")
        .then((response) => {
          if (response.data.success === true) {
            this.archiveContactConfirmationModal = false;
            this.isLoading = false;
            this.getCustomerContactPersons();
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
    closeContactArchive() {
      this.archiveContactConfirmationModal = false;
      // this.setDefault();
    },

    closeContactRestores() {
      this.restoreContactConfirmationModal = false;
      // this.setDefault();
    },

    closeContactDeletes() {
      this.deleteContactConfirmationModal = false;
      // this.setDefault();
    },
    closeContactDefault() {
      this.defaultContactConfirmationModal = false;
    },

    viewContactArchives() {
      this.isLoading = true;
      axios
        .post("CustomerContactPersons/Archived", this.paginationContactArchive)
        .then((response) => {
          if (response.data.success === true) {
            this.archiveContactData = response.data.data;
            this.archiveContactItems = response.data.data.items;
            this.pageCountContactArchive = this.archiveContactData.totalPages;
            this.isLoading = false;
            this.archiveContactModal = true;
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

    searchOnchangeContactArchive() {
      if (this.searchDataContactArchive != "") {
        this.searchActiveContactArchive = true;
        this.searchItemContactArchive();
      } else {
        this.clearSearchContactArchive();
      }
    },
    clearSearchContactArchive() {
      this.searchDataContactArchive = "";
      this.paginationContactArchive.search = this.searchDataContactArchive;
      this.viewContactArchives();
      this.searchActiveContactArchive = false;
    },
    searchItemContactArchive() {
      if (this.searchDataContactArchive != "") {
        this.searchActiveContactArchive = true;
        this.paginationContactArchive.search = this.searchDataContactArchive;
        this.viewContactArchives();
      }
    },

    changePageContactArchive(pageNum) {
      this.paginationContactArchive.pageNumber = pageNum;
      this.viewContactArchives();
    },
    restoreContactItem(item) {
      this.formDataContact = [Object.assign({}, item)];
      this.restoreContactConfirmationModal = true;
    },
    restoreItemContactConfirm() {
      var itemId = this.formDataContact[0].customerContactPersonId;
      this.isLoading = true;
      axios
        .get("CustomerContactPersons/" + itemId + "/Restore")
        .then((response) => {
          if (response.data.success === true) {
            this.restoreContactConfirmationModal = false;
            this.viewContactArchives();
            this.getCustomerContactPersons();
            successToast(response.data.message);
            if (this.archiveContactData.totalCount == 0) {
              this.archiveContactModal = false;
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
    deleteContactItem(item) {
      this.formDataContact = [Object.assign({}, item)];
      this.deleteContactConfirmationModal = true;
    },
    deleteItemContactConfirm() {
      var itemId = this.formDataContact[0].customerContactPersonId;
      this.isLoading = true;
      axios
        .delete("CustomerContactPersons/" + itemId)
        .then((response) => {
          if (response.data.success === true) {
            this.deleteContactConfirmationModal = false;
            this.viewContactArchives();
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

    setReports() {
      if (this.allItems <= 0) {
        warningToast(const_txt.NO_DATA);
        this.isLoading = false;
      } else {
        const columns = [
          { title: "Company", dataKey: "company" },
          { title: "Address", dataKey: "address" },
          { title: "First Name", dataKey: "firstName" },
          { title: "Last Name", dataKey: "lastName" },
          { title: "On Hold", dataKey: "isBlackListed" },
          { title: "Individual", dataKey: "isIndividualPersonal" },
          { title: "Email", dataKey: "email" },
          { title: "Telephone", dataKey: "telephone" },
          { title: "Mobile", dataKey: "mobile" },
          { title: "Postcode", dataKey: "postcode" },
          { title: "State", dataKey: "state" },
          { title: "City", dataKey: "city" },
          { title: "Country", dataKey: "country" },
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
            company: el.company,
            address: el.address,
            firstName: el.firstName,
            lastName: el.lastName,
            isBlackListed: el.isBlackListed,
            isIndividualPersonal: el.isIndividualPersonal,
            email: el.email,
            telephone: el.telephone,
            mobile: el.mobile,
            postcode: el.postcode,
            state: el.state,
            city: el.city,
            country: el.country,
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
      this.docs.save(`${"Customers " + generateDate}.pdf`);
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
        var csvTitle = "Customers " + generateDate;
        var items = this.allItems;
        var csvItems = [];

        var csvHeaders = {
          1: "Company",
          2: "Address",
          3: "First Name",
          4: "Last Name",
          5: "On Hold",
          6: "Individual",
          7: "Email",
          8: "Telephone",
          9: "Mobile",
          10: "Postcode",
          11: "State",
          12: "City",
          13: "Country",
        };

        items.forEach((item) => {
          csvItems.push({
            1: item.company,
            2: item.address,
            3: item.firstName,
            4: item.lastName,
            5: item.isBlackListed,
            6: item.isIndividualPersonal,
            7: item.email,
            8: item.telephone,
            9: item.mobile,
            10: item.postcode,
            11: item.state,
            12: item.city,
            13: item.country,
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
        .post("Customers/Paginated", pagination)
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

    viewItemInfo(item) {
      removeNullValue(item);
      this.formDataCustomer = Object.assign({}, item);
      this.viewItemModal = true;
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
      this.formDataCustomer = Object.assign({}, this.formDataCustomerDefault);
    },
    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("Customers/Paginated", this.pagination)
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
      this.addCustomer = true;
    },
    showDetailsModal() {},
    closeForm() {
      this.addCustomer = false;
    },
    editItem(item) {
      this.titleChange = 0;
      this.formDataCustomer = Object.assign({}, item);
      this.addCustomer = true;
    },

    saveForm() {
      if (
        this.formDataCustomer.firstName == "" ||
        this.formDataCustomer.email == "" ||
        this.formDataCustomer.mobile == "" ||
        this.formDataCustomer.abbreviation == ""
      ) {
        if (this.formDataCustomer.firstName == "") {
          warningToast("Customer Name Required");
        }
        if (this.formDataCustomer.email == "") {
          warningToast("Email Required");
        }
        if (this.formDataCustomer.mobile == "") {
          warningToast("Mobile No Required");
        }
        if (this.formDataCustomer.address == "") {
          warningToast("Address Required");
        }
      } else {
        if (this.titleChange === -1) {
          this.isLoading = true;
          axios
            .post("Customers", this.formDataCustomer)
            .then((response) => {
              if (response.data.success === true) {
                this.itemsData = response.data.data;
                this.items = response.data.data.items;
                this.addCustomer = false;

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
          var itemId = this.formDataCustomer.customerId;
          axios
            .put("Customers/" + itemId, this.formDataCustomer)
            .then((response) => {
              if (response.data.success === true) {
                this.itemsData = response.data.data;
                this.items = response.data.data.items;
                this.addCustomer = false;

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
      this.formDataCustomer = Object.assign({}, item);
      this.archiveConfirmationModal = true;
    },

    closeArchive() {
      this.archiveConfirmationModal = false;
      this.setDefault();
    },
    closeRestore() {
      this.restoreConfirmationModal = false;
      this.setDefault();
    },
    closeDelete() {
      this.deleteConfirmationModal = false;
      this.setDefault();
    },
    archiveItemConfirm() {
      var itemId = this.formDataCustomer.customerId;
      this.isLoading = true;
      axios
        .get("Customers/" + itemId + "/Archive")
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
        .post("Customers/Archived", this.paginationArchive)
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
      this.formDataCustomer = Object.assign({}, item);
      this.restoreConfirmationModal = true;
    },
    restoreItemConfirm() {
      var itemId = this.formDataCustomer.customerId;
      this.isLoading = true;
      axios
        .get("Customers/" + itemId + "/Restore")
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
      this.formDataCustomer = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },
    deleteItemConfirm() {
      this.isLoading = true;
      var itemId = this.formDataCustomer.customerId;
      axios
        .delete("Customers/" + itemId)
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
    getSelectedColor() {
      return "background-color:rgb(13,148,136);color: white";
    },
  },
};
</script>
