<template>
  <LoadingScreen :isLoading="isLoading" />

  <AddKovilGod
    @modalClose="closeGodModal($event)"
    @refreshData="refreshData($event)"
    :modalStatus="addGodModal"
    :titleChange="godTitleChange"
    :formData="subFormData"
    :kovilId="formData.kovilId"
  />
  <AddKovilArchana
    @modalClose="closeArchanaModal($event)"
    @refreshData="refreshData($event)"
    :modalStatus="addArchanaModal"
    :titleChange="archanaTitleChange"
    :formData="subFormData"
    :kovilId="formData.kovilId"
  />

  <AddKovilPooja
    @modalClose="closePoojaModal($event)"
    @refreshData="refreshData($event)"
    :modalStatus="addPoojaModal"
    :titleChange="poojaTitleChange"
    :formData="subFormData"
    :kovilId="formData.kovilId"
  />
  <AddKovilSpecialPooja
    @modalClose="closeSpecialPoojaModal($event)"
    @refreshData="refreshData($event)"
    :modalStatus="addSpecialPoojaModal"
    :titleChange="specialPoojaTitleChange"
    :formData="subFormData"
    :kovilId="formData.kovilId"
  />

  <AddKovilPoojaTime
    @modalClose="closePoojaTimeModal($event)"
    @refreshData="refreshData($event)"
    :modalStatus="addPoojaTimeModal"
    :titleChange="poojaTimeTitleChange"
    :formData="subFormData"
    :kovilId="formData.kovilId"
  />

  <ArchiveConfirmModal
    :name="confirmName"
    :modalStatus="archiveConfirmationModal"
    :modalConfirm="setControllerWithId"
    :modalClose="closeArchive"
  />
  <RestoreConfirmModal
    :name="confirmName"
    :modalStatus="restoreConfirmationModal"
    :modalConfirm="setControllerWithId"
    :modalClose="closeRestore"
  />
  <DeleteConfirmModal
    :name="confirmName"
    :modalStatus="deleteConfirmationModal"
    :modalConfirm="setControllerWithId"
    :modalClose="closeDelete"
  />

  <Modal
    :show="modalStatus"
    @hidden="modalStatus = false"
    slideOver="true"
    size="modal-sl-80"
  >
    <ModalHeader>
      <h2 class="font-medium text-2xl mr-auto uppercase">
        <InfoIcon
          class="text-primary ml-2 float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6"
        />

        {{ formData.kovilName }}
      </h2>
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="modalClose()"
        />
      </div>
    </ModalHeader>
    <ModalBody class="flex flex-col gap-2">
      <div class="p-2 mt-4">
        <div class="grid grid-cols-4">
          <div
            class="col-span-2 flex flex-nowrap cursor-pointer text-xl font-semibold text-primary"
            @click="viewArchana = !viewArchana"
          >
            Archanas
            <ChevronsDownIcon
              class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1"
              v-if="!viewArchana"
            />
            <ChevronsUpIcon class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1" v-else />
          </div>
          <AddItem
            @parentMethod="addArchana($event)"
            buttonName="Add Archana"
          />
          <ViewArchiveItem @parentMethod="getArchiveArchana($event)" />
        </div>

        <hr class="mb-4 mt-2" />
        <table v-if="viewArchana" class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>Archana Name</th>
              <th>Description</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in mainFormData.kovilArchanaTypes"
              :key="i"
              class="intro-x"
            >
              <!-- <td>{{ item }}</td> -->
              <td>{{ item.archanaType.name }}</td>
              <td>{{ item.archanaType.description }}</td>
              <td>{{ item.cost }}</td>
              <td class="table-report__action w-24">
                <div class="flex justify-end items-end">
                  <EditItem
                    @parentMethod="editArchana($event)"
                    :item="item"
                    name="Edit"
                  />
                  <ArchiveItem
                    @parentMethod="archiveArchana($event)"
                    :item="item"
                    name="Archive"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="grid grid-cols-4">
          <div
            class="col-span-2 flex flex-nowrap cursor-pointer text-xl font-semibold text-primary"
            @click="viewPooja = !viewPooja"
          >
            Poojas
            <ChevronsDownIcon
              class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1"
              v-if="!viewPooja"
            />
            <ChevronsUpIcon class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1" v-else />
          </div>
          <AddItem @parentMethod="addPooja($event)" buttonName="Add Pooja" />
          <ViewArchiveItem @parentMethod="getArchivePooja($event)" />
        </div>

        <hr class="mb-4 mt-2" />
        <table v-if="viewPooja" class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>Pooja Name</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in mainFormData.kovilPoojaTypes"
              :key="i"
              class="intro-x"
            >
              <!-- <td>{{ item }}</td> -->
              <td>{{ item.poojaType.name }}</td>
              <td>{{ item.cost }}</td>
              <td class="table-report__action w-24">
                <div class="flex justify-end items-end">
                  <EditItem
                    @parentMethod="editPooja($event)"
                    :item="item"
                    name="Edit"
                  />
                  <ArchiveItem
                    @parentMethod="archivePooja($event)"
                    :item="item"
                    name="Archive"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="grid grid-cols-4">
          <div
            class="col-span-2 flex flex-nowrap cursor-pointer text-xl font-semibold text-primary"
            @click="viewSpecialPooja = !viewSpecialPooja"
          >
            Special Poojas
            <ChevronsDownIcon
              class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1"
              v-if="!viewSpecialPooja"
            />
            <ChevronsUpIcon class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1" v-else />
          </div>
          <AddItem
            @parentMethod="addSpecialPooja($event)"
            buttonName="Add Special Pooja"
          />
          <ViewArchiveItem @parentMethod="getArchiveSpecialPooja($event)" />
        </div>

        <hr class="mb-4 mt-2" />
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
              v-for="(item, i) in mainFormData.kovilSpecialPoojas"
              :key="i"
              class="intro-x"
            >
              
              <!-- <td>{{ getSpecialPoojaById(item.specialPoojaId) }}</td> -->
              <td>{{ item.specialPooja.name }}</td>
              <td>{{ item.cost }}</td>
              <td>{{ item.poojaTime }}</td>
              <td class="table-report__action w-24">
                <div class="flex justify-end items-end">
                  <EditItem
                    @parentMethod="editSpecialPooja($event)"
                    :item="item"
                    name="Edit"
                  />
                  <ArchiveItem
                    @parentMethod="archiveSpecialPooja($event)"
                    :item="item"
                    name="Archive"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="grid grid-cols-4">
          <div
            class="col-span-2 flex flex-nowrap cursor-pointer text-xl font-semibold text-primary"
            @click="viewPoojaTime = !viewPoojaTime"
          >
            Pooja Times
            <ChevronsDownIcon
              class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1"
              v-if="!viewPoojaTime"
            />
            <ChevronsUpIcon class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1" v-else />
          </div>
          <AddItem
            @parentMethod="addPoojaTime($event)"
            buttonName="Add Pooja Time"
          />
          <ViewArchiveItem @parentMethod="getArchivePoojaTime($event)" />
        </div>

        <hr class="mb-4 mt-2" />
        <table v-if="viewPoojaTime" class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>Pooja Time Name</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in mainFormData.kovilPoojaTime"
              :key="i"
              class="intro-x"
            >
          
              <td>{{ item.poojaTime.name }}</td>
              <td>{{ item.poojaTime.time }}</td>
              <td class="table-report__action w-24">
                <div class="flex justify-end items-end">
                  <EditItem
                    @parentMethod="editPoojaTime($event)"
                    :item="item"
                    name="Edit"
                  />
                  <ArchiveItem
                    @parentMethod="archivePoojaTime($event)"
                    :item="item"
                    name="Archive"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="grid grid-cols-4">
          <div
            class="col-span-2 flex flex-nowrap cursor-pointer text-xl font-semibold text-primary"
            @click="viewGod = !viewGod"
          >
            Gods
            <ChevronsDownIcon
              class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1"
              v-if="!viewGod"
            />
            <ChevronsUpIcon class="lg:w-5 lg:h-5 w-4 h-4 ml-2 mt-1" v-else />
          </div>
          <AddItem @parentMethod="addGod($event)" buttonName="Add God" />
          <ViewArchiveItem @parentMethod="getArchiveGod($event)" />
        </div>

        <hr class="mb-4 mt-2" />
        <table v-if="viewGod" class="table table-report -mt-2 table-auto">
          <thead>
            <tr class="uppercase whitespace-nowrap">
              <th>God Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in mainFormData.kovilGods"
              :key="i"
              class="intro-x"
            >
              <td>{{ item.god.name }}</td>
              <!-- <td>{{ getGodById(item.godId) }}</td> -->

              <td class="table-report__action w-24">
                <div class="flex justify-end items-end">
                  <EditItem
                    @parentMethod="editGod($event)"
                    :item="item"
                    name="Edit"
                  />
                  <ArchiveItem
                    @parentMethod="archiveGod($event)"
                    :item="item"
                    name="Archive"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- <AddItem @parentMethod="addGod($event)" buttonName="Add God" />

      <AddItem @parentMethod="addArchana($event)" buttonName="Add Archana" />

      <AddItem @parentMethod="addPooja($event)" buttonName="Add Pooja" />

      <AddItem
        @parentMethod="addSpecialPooja($event)"
        buttonName="Add Special Pooja"
      /> -->
    </ModalBody>
  </Modal>

  <!-- BEGIN: Archive Modal -->
  <Modal
    slideOver="true"
    :show="archiveModal"
    @hidden="archiveModal = false"
    size="modal-sl-40"
  >
    <ModalBody class="p-0">
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="archiveModal = false"
        />
      </div>

      <div class="p-5 text-center lg:text-lg text-base uppercase font-semibold">
        Archive
      </div>
      <hr />
      <!-- SEARCH -->

      <!-- <SearchBar
        :searchActive="searchDataArchive"
        @searchOnchange="searchOnchangeArchive($event)"
        @searchItem="searchItemArchive($event)"
        @clearSearch="clearSearchArchive($event)"
      /> -->
      <!-- SEARCH END-->
      <!-- BEGIN: Archive Data List -->
      <div class="intro-y col-span-12 overflow-auto px-4">
        <table class="table table-report table-auto">
          <thead
            v-if="archivedData.length > 0"
            class="sticky top-0 z-50 bg-white"
          >
            <tr class="uppercase whitespace-nowrap">
              <th v-if="archiveStatus == 1">Archana</th>
              <th v-if="archiveStatus == 2">Pooja</th>
              <th v-if="archiveStatus == 3">Special Pooja</th>
              <th v-if="archiveStatus == 4">God</th>
            </tr>
          </thead>
          <tbody>
            <NoData :items="archivedData" />
            <tr v-for="(item, i) in archivedData" :key="i" class="intro-x">
              <td v-if="archiveStatus == 1">{{ getGodById(item.godId) }}</td>
              <td v-if="archiveStatus == 2">{{ getGodById(item.godId) }}</td>
              <td v-if="archiveStatus == 3">
                {{ getSpecialPoojaById(item.specialPoojaId) }}
              </td>
              <td v-if="archiveStatus == 4">{{ getGodById(item.godId) }}</td>

              <td class="table-report__action w-24">
                <div class="flex justify-center items-center">
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- BEGIN: Pagination -->
      <!-- <PaginationBarLocal
        @changePage="changePageArchive($event)"
        :itemsCount="archiveItemsCount"
        :pageCount="pageCountArchive"
      /> -->

      <!-- END: Pagination -->
    </ModalBody>
  </Modal>
  <!-- END: Archive Modal -->
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
import { TorusKnotBufferGeometry } from "three";
import AddKovilPoojaTime from "@/simple-components/Add Form Modals/Kovil-Management/AddKovilPoojaTime.vue";

export default {
  props: {
    modalStatus: false,
    formData: {},
    gods: [],
    poojaTypes: [],
    specialPoojaTypes: [],
    archanaTypes: [],
    poojaTimes: [],
  },
  data: () => ({
    archiveModal: false,
    archivedData: [],
    archivedIndex: [],
    isLoading: false,
    const_txt: const_txt,
    mainFormData: {},
    subFormData: {},

    addGodModal: false,
    godTitleChange: false,
    viewGod: false,

    addArchanaModal: false,
    archanaTitleChange: false,
    viewArchana: false,

    addPoojaTimeModal: false,
    poojaTimeTitleChange: false,
    viewPoojaTime: false,

    addPoojaModal: false,
    poojaTitleChange: false,
    viewPooja: false,

    addSpecialPoojaModal: false,
    specialPoojaTitleChange: false,
    viewSpecialPooja: false,

    confirmName: "",
    archiveStatus: 0,
    archiveConfirmationModal: false,
    restoreConfirmationModal: false,
    deleteConfirmationModal: false,
  }),
  watch: {
    modalStatus(val) {
      val || this.modalClose();
    },
    formData() {
      console.log("WORKED");
      this.refreshData();
    },
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    getControllerName() {
      if (this.archiveStatus == 1) {
        return "KovilArchnaType";
      }
      if (this.archiveStatus == 2) {
        return "KovilPoojaType";
      }
      if (this.archiveStatus == 3) {
        return "KovilSpecialPoojas";
      }
      if (this.archiveStatus == 4) {
        return "KovilGod";
      }
      if (this.archiveStatus == 4) {
        return "KovilPoojaTime";
      }
    },
    setControllerWithId() {
      console.log(this.archiveStatus);
      if (this.archiveStatus == 1) {
        var name = "KovilArchnaType";
        var id = this.subFormData.kovilArchanaTypeId;
      }
      if (this.archiveStatus == 2) {
        var name = "KovilPoojaType";
        var id = this.subFormData.kovilPoojaTypeId;
      }
      if (this.archiveStatus == 3) {
        var name = "KovilSpecialPoojas";
        var id = this.subFormData.kovilSpecialPoojasId;
      }
      if (this.archiveStatus == 4) {
        var name = "KovilGod";
        var id = this.subFormData.kovilGodId;
      }
      if (this.archiveStatus == 5) {
        var name = "KovilPoojaTime";
        var id = this.subFormData.kovilPoojaTimeeId;
      }
      if (this.archiveConfirmationModal) {
        this.archiveItemConfirm(name, id);
      }
      if (this.restoreConfirmationModal) {
        this.restoreItemConfirm(name, id);
      }
      if (this.deleteConfirmationModal) {
        this.deleteItemConfirm(name, id);
      }
    },
    deleteItem(item) {
      this.subFormData = Object.assign({}, item);
      this.archivedIndex = this.archivedData.indexOf(item);
      this.confirmName = item;
      this.deleteConfirmationModal = true;
    },
    closeDelete() {
      this.deleteConfirmationModal = false;
    },
    async deleteItemConfirm(name, id) {
      this.isLoading = true;
      await axios
        .delete(`${name}/delete/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.restoreConfirmationModal = false;
            this.archivedData.splice(this.archivedIndex, 1);
            successToast(response.data.message);
          } else {
            failedToast(response.data.message);
          }
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },
    restoreItem(item) {
      this.subFormData = Object.assign({}, item);
      this.archivedIndex = this.archivedData.indexOf(item);
      this.confirmName = item;
      this.restoreConfirmationModal = true;
    },
    closeRestore() {
      this.restoreConfirmationModal = false;
    },
    async restoreItemConfirm(name, id) {
      this.isLoading = true;
      await axios
        .post(`${name}/restore/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.restoreConfirmationModal = false;
            this.archivedData.splice(this.archivedIndex, 1);
            this.refreshData();
            successToast(response.data.message);
          } else {
            failedToast(response.data.message);
          }
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },
    getArchiveArchana() {
      this.archiveStatus = 1;
      var name = this.getControllerName();
      this.getArchiveData(name);
    },
    getArchivePooja() {
      this.archiveStatus = 2;
      var name = this.getControllerName();
      this.getArchiveData(name);
    },
    getArchivePoojaTime() {
      this.archiveStatus = 5;
      var name = this.getControllerName();
      this.getArchiveData(name);
    },
    getArchiveSpecialPooja() {
      this.archiveStatus = 3;
      var name = this.getControllerName();
      this.getArchiveData(name);
    },
    getArchiveGod() {
      this.archiveStatus = 4;
      var name = this.getControllerName();
      this.getArchiveData(name);
    },
    async getArchiveData(name) {
      this.isLoading = true;
      await axios
        .get(`${name}/findAllArchive`)
        .then((response) => {
          if (response.data.success) {
            this.archivedData = response.data.data;
            console.log(response.data.data);
            // successToast(response.data.message);
          } else {
            this.archivedData = [];
            failedToast(response.data.message);
          }
          this.isLoading = false;
        })
        .catch((error) => {
          this.archivedData = [];
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
      this.archiveModal = true;
    },
    async archiveItemConfirm(name, id) {
      this.isLoading = true;
      await axios
        .post(`${name}/archive/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.archiveConfirmationModal = false;
            this.refreshData();
            successToast(response.data.message);
          } else {
            failedToast(response.data.message);
          }
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          warningToast(statusMessage(error.response.status));
        });
    },
    activateArchive(item) {
      this.subFormData = Object.assign({}, item);
      this.archiveConfirmationModal = true;
    },
    closeArchive() {
      this.archiveConfirmationModal = false;
    },
    addArchana() {
      this.subFormData = {};
      this.archanaTitleChange = false;
      this.addArchanaModal = true;
    },
    editArchana(item) {
      this.subFormData = Object.assign({}, item);
      this.archanaTitleChange = true;
      this.addArchanaModal = true;
    },
    closeArchanaModal(status) {
      this.addArchanaModal = status;
    },
    archiveArchana(item) {
      this.confirmName = item;
      this.archiveStatus = 1;
      this.activateArchive(item);
    },

    addPoojaTime() {
      this.subFormData = {};
      this.poojaTitleChange = false;
      this.addPoojaTimeModal = true;
    },
    editPoojaTime(item) {
      this.subFormData = Object.assign({}, item);
      this.poojaTitleChange = true;
      this.addPoojaTimeModal = true;
    },
    closePoojaTimeModal(status) {
      this.addPoojaTimeModal = status;
    },
    archivePoojaTime(item) {
      this.confirmName = item;
      this.archiveStatus = 5;
      this.activateArchive(item);
    },

    addPooja() {
      this.subFormData = {};
      this.poojaTitleChange = false;
      this.addPoojaModal = true;
    },
    editPooja(item) {
      this.subFormData = Object.assign({}, item);
      this.poojaTitleChange = true;
      this.addPoojaModal = true;
    },
    closePoojaModal(status) {
      this.addPoojaModal = status;
    },
    archivePooja(item) {
      this.confirmName = item;
      this.archiveStatus = 2;
      this.activateArchive(item);
    },
    addSpecialPooja() {
      this.subFormData = {};
      this.specialPoojaTitleChange = false;
      this.addSpecialPoojaModal = true;
    },
    editSpecialPooja(item) {
      this.subFormData = Object.assign({}, item);
      this.specialPoojaTitleChange = true;
      this.addSpecialPoojaModal = true;
    },
    closeSpecialPoojaModal(status) {
      this.addSpecialPoojaModal = status;
    },
    archiveSpecialPooja(item) {
      this.confirmName = item;
      this.archiveStatus = 3;
      this.activateArchive(item);
    },
    addGod() {
      this.subFormData = {};
      this.godTitleChange = false;
      this.addGodModal = true;
    },
    editGod(item) {
      this.subFormData = Object.assign({}, item);
      this.godTitleChange = true;
      this.addGodModal = true;
    },
    closeGodModal(status) {
      this.addGodModal = status;
    },
    archiveGod(item) {
      this.confirmName = item;
      this.archiveStatus = 4;
      this.activateArchive(item);
    },
    modalClose() {
      this.$emit("modalClose", false);
    },
    getDataFromApi() {
      this.$emit("getData");
    },
    async refreshData() {
      var id = this.formData.kovilId;
      //  this.isLoading = true;
      await axios
        .post("Kovil/find/" + id)
        .then((response) => {
          console.log("response", response.data);
          this.mainFormData = response.data;
        })
        .catch((error) => {
          // this.isLoading = false;
          console.log("error", error);
          //warningToast(statusMessage(error.response.status));
        });
    },
    getGodById(value) {
      try {
        return this.gods.find((x) => x.godId === parseInt(value)).name;
      } catch {
        return "Nil";
      }
    },
    getPoojaById(value) {
      try {
        return this.poojaTypes.find((x) => x.poojaTypeId === parseInt(value))
          .name;
      } catch {
        return "Nil";
      }
    },
    getSpecialPoojaById(value) {
      try {
        return this.specialPoojaTypes.find(
          (x) => x.specialPoojaId === parseInt(value)
        ).name;
      } catch {
        return "Nil";
      }
    },
    getArchanaById(value) {
      try {
        return this.archanaTypes.find(
          (x) => x.archanaTypeId === parseInt(value)
        ).name;
      } catch {
        return "Nil";
      }
    },
    getPoojaTimeById(value) {
      try {
        return this.poojaTimes.find((x) => x.poojaTimeeId === parseInt(value))
          .name;
      } catch {
        return "Nil";
      }
    },
  },
  components: { AddKovilPoojaTime },
};
</script>
