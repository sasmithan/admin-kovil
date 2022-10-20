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

  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2"
    >
      <!-- <a
        href="javascript:;"
        @click="showModal()"
        class="btn btn-primary shadow-md mr-2"
      >
        Add New Variant
      </a>
      <Dropdown>
        <DropdownToggle class="btn px-2 box">
          <span class="w-5 h-5 flex items-center justify-center">
            <PlusIcon class="w-4 h-4" />
          </span>
        </DropdownToggle>
        <DropdownMenu class="w-40">
          <DropdownContent>
            <DropdownItem>
              <PrinterIcon class="w-4 h-4 mr-2" /> Print
            </DropdownItem>
            <DropdownItem>
              <FileTextIcon class="w-4 h-4 mr-2" /> Export to Excel
            </DropdownItem>
            <DropdownItem>
              <FileTextIcon class="w-4 h-4 mr-2" /> Export to PDF
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
        <div
         
        class="btn btn-primary shadow-md ml-2"
      >
       <span class="w-5 h-5 flex items-center justify-center">
            <Trash2Icon class="w-4 h-4" />
          </span>
      </div>
      <div class="hidden md:block mx-auto text-slate-500">
  
      </div>
      <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
        <div class="w-56 relative text-slate-500">
          <input
            type="text"
            class="form-control w-56 box pr-10"
            placeholder="Search..."
          />
          <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
        </div>
      </div> -->

      <TabGroup>
        <TabList class="">
          <Tab
            v-for="(item, i) in tabName"
            :key="i"
            for
            class="w-full py-2"
            tag="button"
          >
            {{ item }}</Tab
          >
          <!-- <Tab class="w-full py-2" tag="button">Example Tab 2</Tab> -->
        </TabList>
        <TabPanels class="border-l border-r border-b">
          <TabPanel class="leading-relaxed p-5">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </TabPanel>
          <TabPanel class="leading-relaxed p-5">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page editors now use Lorem Ipsum as their default
            model text, and a search for 'lorem ipsum' will uncover many web
            sites still in their infancy. Various versions have evolved over the
            years, sometimes by accident, sometimes on purpose (injected humour
            and the like).
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>

    <Modal :show="addVariant" @hidden="addVariant = false">
      <ModalHeader>
        <h2 class="font-medium text-base mr-auto">{{ formTitle }}</h2>
      </ModalHeader>
      <ModalBody class="px-8 py-12 flex justify-center space-y-4">
        <div class="flex flex-col space-y-4 w-full">
          <div>
            <label for="regular-form-1" class="form-label">Variant Name</label>

            <div class="flex flex-col space-y-1">
              <input
                id="vertical-form-1"
                v-model="formDataVariant.name"
                type="text"
                class="form-control"
                name="name"
                placeholder="Variant Name"
              />
            </div>
          </div>

          <div>
            <label for="regular-form-1" class="form-label"
              >Variant Description</label
            >

            <div class="flex flex-col space-y-1">
              <textarea
                id="vertical-form-1"
                v-model="formDataVariant.description"
                type="text"
                class="form-control"
                name="description"
                placeholder="Type here about Variant..."
              ></textarea>
            </div>

            <div class="mt-3 flex">
              <label>Active Status</label>
              <div class="form-switch ml-3">
                <input
                  type="checkbox"
                  v-model="formDataVariant.available"
                  class="form-check-input"
                />
              </div>
            </div>
          </div>

          <div>
            <label for="regular-form-1" class="form-label">Variant Info</label>
            <div class="flex justify-center space-x-4">
              <div class="flex flex-col space-y-1 w-full">
                <div class="mt-0.5 text-slate-400 text-xs">Quantity</div>
                <input
                  id="vertical-form-1"
                  v-model="formDataVariant.qty"
                  type="number"
                  class="form-control"
                  name="qty"
                  placeholder="10"
                />
              </div>

              <div class="flex flex-col space-y-1 w-full">
                <div class="mt-0.5 text-slate-400 text-xs">Product</div>

                <TomSelect
                  v-model="formDataVariant.productId"
                  class="form-control"
                  :options="{
                    placeholder: 'Product',
                  }"
                >
                  <option value="0">--SELECT--</option>
                  <option value="1">Product1</option>
                  <option value="2">Product2</option>
                  <option value="3">Product3</option>
                  <option value="4">Product4</option>
                </TomSelect>
              </div>
            </div>
            <div class="flex justify-center space-x-4 pt-4">
              <div class="flex flex-col space-y-1 w-full">
                <div class="mt-0.5 text-slate-400 text-xs">Scale</div>

                <TomSelect
                  v-model="formDataVariant.scaleId"
                  :options="{
                    placeholder: 'Scale',
                  }"
                  class="form-control"
                >
                  <option value="0">--SELECT--</option>
                  <option value="1">Scale1</option>
                  <option value="2">Scale2</option>
                  <option value="3">Scale3</option>
                  <option value="4">Scale4</option>
                </TomSelect>
              </div>

              <div class="flex flex-col space-y-1 w-full">
                <div class="mt-0.5 text-slate-400 text-xs">Color Code</div>
                <TomSelect
                  v-model="formDataVariant.colorCode"
                  :options="{
                    placeholder: 'ColorCode',
                  }"
                  class="form-control"
                >
                  <option value="0">--SELECT--</option>
                  <option value="1">ColorCode1</option>
                  <option value="2">ColorCode2</option>
                  <option value="3">ColorCode3</option>
                  <option value="4">ColorCode4</option>
                </TomSelect>
              </div>
            </div>
          </div>

          <button
            @click="saveForm()"
            type="submit"
            class="btn btn-primary mt-5"
          >
            Done
          </button>
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
      </ModalFooter>
    </Modal>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto">
      <table class="table table-report -mt-2">
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
            <!-- <template v-if="item.available">
              <div>
                <v-chip
                  label
                  style="color: green; width: 50%"
                  v-if="item.available === true"
                >
                  Active
                </v-chip>
                <v-chip
                  label
                  style="color: red; width: 50%"
                  v-if="item.available === false"
                >
                  In Active
                </v-chip>
              </div>
            </template> -->
            <td class="table-report__action w-56">
              <div class="flex justify-center items-center">
                <a
                  @Click="editItem(item)"
                  class="flex items-center mr-3"
                  href="javascript:;"
                >
                  <EditIcon class="w-4 h-4 mr-1" /> Edit
                </a>
                <a
                  class="flex items-center text-danger"
                  href="javascript:;"
                  @click="trashConfirmationModal = true"
                >
                  <Trash2Icon class="w-4 h-4 mr-1" /> Delete
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- END: Data List -->
    <!-- BEGIN: Pagination -->
    <!-- <v-pagination
      v-model="page"
      :length="pageCount"
      @click="changePage"
      circle
      color="black"
    >
    </v-pagination> -->

    <!-- END: Pagination -->
  </div>
  <!-- BEGIN: Delete Confirmation Modal -->
  <Modal
    :show="trashConfirmationModal"
    @hidden="trashConfirmationModal = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-slate-500 mt-2">
          Do you really want to delete these records? <br />This process cannot
          be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="trashConfirmationModal = false"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          Cancel
        </button>
        <button type="button" class="btn btn-danger w-24">Delete</button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Delete Confirmation Modal -->
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
//import axios from "../services/http-common";
import { useVuelidate } from "@vuelidate/core";
import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";

import { required, minLength, maxLength, integer } from "@vuelidate/validators";
import axios from "../../../services/http-common";
// import axios from "axios";
import Paginate from "vuejs-paginate-next";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import router from "../../../router";

//var addVariant = ref(false);
import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../../global-functions/functions";

export default {
  components: {
    Loading,
    paginate: Paginate,
    // ToastNotification,
  },
  data() {
    return {
      isLoading: false,
      tabName: ["ljhj", "ghg"],
      addVariant: false,
      trashConfirmationModal: false,
      titleChange: -1,
      formDataVariant: {
        name: "",
        BrandDescription: "",
        code: "",
        available: true,
        qty: "",
        productId: "",
        scaleId: "",
        colorCode: "",
      },
      formDataVariantDefault: {
        name: "",
        BrandDescription: "",
        code: "",
        available: true,
        qty: "",
        productId: "",
        scaleId: "",
        colorCode: "",
      },

      rules: {
        name: {
          required,
          minLength: minLength(2),
        },
        BrandDescription: {
          required,
          minLength: minLength(2),
        },
        code: {
          required,
          maxLength: maxLength(10),
        },
        qty: {
          required,
          minLength: minLength(2),
        },
        productId: {
          required,
          minLength: minLength(2),
        },
        scaleId: {
          required,
          minLength: minLength(2),
        },
        colorCode: {
          required,
          minLength: minLength(2),
        },
      },

      headers: [
        { text: "Name", value: "name" },
        { text: "Code", value: "code" },
        { text: "Description", value: "description" },
        { text: "Available", value: "available" },
      ],
      pagination: {
        pageNumber: 1,
        pageSize: 100,
      },
      items: [],
      itemsData: [],
    };
  },
  computed: {
    formTitle() {
      return this.titleChange === -1 ? "Add New Brand" : "Edit Brand";
    },
  },
  created() {
    this.getDataFromApi();
  },
  methods: {
    setDefault() {
      this.formDataVariant = Object.assign({}, this.formDataVariantDefault);
    },
    getDataFromApi() {
      this.isLoading = true;
      axios
        .post("Variant/Paginated", this.pagination)
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
      this.addVariant = true;
    },
    closeForm() {
      this.addVariant = false;
    },
    editItem(item) {
      this.titleChange = 0;
      this.formDataVariant = Object.assign({}, item);
      this.addVariant = true;
    },

    saveForm() {
      if (this.titleChange === -1) {
        this.isLoading = true;
        axios
          .post("Variant", this.formDataVariant)
          .then((response) => {
            if (response.data.success === true) {
              this.itemsData = response.data.data;
              this.items = response.data.data.items;
              this.addVariant = false;
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
        axios
          .put("Variant", this.formDataVariant)
          .then((response) => {
            if (response.data.success === true) {
              this.itemsData = response.data.data;
              this.items = response.data.data.items;
              this.addVariant = false;
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
  },
};
</script>
