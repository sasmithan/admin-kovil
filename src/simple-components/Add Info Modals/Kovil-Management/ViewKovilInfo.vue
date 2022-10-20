<template>
  <LoadingScreen :isLoading="isLoading" />
  <DeleteConfirmModal
    name="Test"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="deleteItemConfirm"
    :modalClose="closeDelete"
    :formData="subFormData"
  />

  <AddKovilArchana
    @modalClose="closeModal($event)"
    @getData="getDataFromApi($event)"
    :modalStatus="eidtModal"
    titleChange="true"
    :formData="subFormData"
    :kovilId="formData.kovilId"
    @refreshData="refreshData($event)"
  />

  <Modal
    :show="modalStatus"
    @hidden="modalStatus = false"
    slideOver="true"
    size="modal-sl-80"
  >
    <ModalHeader>
      <h2 class="font-medium text-2xl mr-auto uppercase">
        {{ formData.kovilName }} - Informations
      </h2>
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="modalClose()"
        />
      </div>
    </ModalHeader>
    <ModalBody class="">
      <div class="p-2 mt-4">
        <div
          class="flex flex-nowrap cursor-pointer text-xl font-semibold text-primary"
          @click="viewArchana = !viewArchana"
        >
          Archanas
          <ChevronsDownIcon
            class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1"
            v-if="!viewArchana"
          />
          <ChevronsUpIcon class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1" v-else />
        </div>
        <hr class="mb-4" />
        <table v-if="viewArchana" class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>Archana Name</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in formData.kovilArchanaTypes"
              :key="i"
              class="intro-x"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.cost }}</td>
              <td class="table-report__action w-24">
                <div class="flex justify-end items-end">
                  <EditItem
                    @parentMethod="editItem($event)"
                    :item="item"
                    name="Edit"
                  />
                  <DeleteItem
                    @parentMethod="deleteItem($event)"
                    :item="item"
                    name="Archive"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          class="flex flex-nowrap cursor-pointer text-xl font-semibold text-primary"
          @click="viewPooja = !viewPooja"
        >
          Poojas
          <ChevronsDownIcon
            class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1"
            v-if="!viewPooja"
          />
          <ChevronsUpIcon class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1" v-else />
        </div>
        <hr class="mb-4" />
        <table v-if="viewPooja" class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>Pooja Name</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in formData.kovilPoojaTypes"
              :key="i"
              class="intro-x"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.cost }}</td>
              <td class="table-report__action w-24">
                <div class="flex justify-end items-end">
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          class="flex flex-nowrap cursor-pointer text-xl font-semibold text-primary"
          @click="viewSpecialPooja = !viewSpecialPooja"
        >
          Special Poojas
          <ChevronsDownIcon
            class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1"
            v-if="!viewSpecialPooja"
          />
          <ChevronsUpIcon class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1" v-else />
        </div>

        <hr class="mb-4" />
        <table
          v-if="viewSpecialPooja"
          class="table table-report -mt-2 table-auto"
        >
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>Special Pooja Name</th>
              <th>Cost</th>
              <th>Date/Time</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in formData.kovilSpecialPoojaTypes"
              :key="i"
              class="intro-x"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.cost }}</td>
              <td>{{ item.date }}</td>
              <td class="table-report__action w-24">
                <div class="flex justify-end items-end">
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          class="flex flex-nowrap cursor-pointer text-xl font-semibold text-primary"
          @click="viewGod = !viewGod"
        >
          Gods
          <ChevronsDownIcon
            class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1"
            v-if="!viewGod"
          />
          <ChevronsUpIcon class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1" v-else />
        </div>
        <hr class="mb-4" />
        <table v-if="viewGod" class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>God Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in formData.kovilGods"
              :key="i"
              class="intro-x"
            >
              <td>{{ item.name }}</td>

              <td class="table-report__action w-24">
                <div class="flex justify-end items-end">
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ModalBody>
  </Modal>
</template>

<script>
import { const_txt } from "@/global-functions/const";
import axios from "@/services/http-common";
import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "@/global-functions/functions";
import {
  currencyFormat,
  percentageFormat,
  temperatureFormat,
  weightFormat,
  removeNullValue,
} from "@/global-functions/functions";

export default {
  props: {
    modalStatus: false,
    oldFormData: {},
    isLoading: false,
  },
  data: () => ({
    const_txt: const_txt,
    formData: {},
    deleteConfirmationModal: false,

    subFormData: {},
    eidtModal: false,

    viewArchana: false,
    viewPooja: false,
    viewSpecialPooja: false,
    viewGod: false,
  }),
  watch: {
    modalStatus(val) {
      val || this.modalClose();
    },
    oldFormData() {
      this.refreshData();
    },
  },
  computed: {},

  created() {},
  mounted() {},
  methods: {
    sayHello(newVal, oldVal) {
      console.log(newVal);
      console.log(oldVal);
    },

    closeModal(status) {
      this.eidtModal = status;
    },
    editItem(item) {
      removeNullValue(item);
      this.subFormData = Object.assign({}, item);
      this.eidtModal = true;
    },

    deleteItem(item) {
      removeNullValue(item);
      this.subFormData = Object.assign({}, item);
      this.deleteConfirmationModal = true;
    },

    deleteItemConfirm() {
      var id = this.subFormData.kovilArchanaTypeId;
      axios
        .delete("KovilArchnaType/delete/" + id)
        .then((response) => {
          if (response.data.success) {
            this.deleteConfirmationModal = false;
            this.refreshData();
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

    closeDelete() {
      this.deleteConfirmationModal = false;
    },

    modalClose() {
      this.$emit("modalClose", false);
    },

    getDataFromApi() {
      this.$emit("getData");
    },

    async refreshData() {
      var id = this.oldFormData.kovilId;
      //this.isLoading = true;
      await axios
        .post("Kovil/find/" + id)
        .then((response) => {
          console.log(response);
          this.formData = response.data;
          // this.isLoading = false;

          // if (response.data.success) {
          //   successToast(response.data.message);
          // } else {
          //   this.isLoading = false;
          //   failedToast(response.data.message);
          // }
        })
        .catch((error) => {
          // this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },
  },
};
</script>
