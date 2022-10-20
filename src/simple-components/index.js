import ArchiveConfirmModal from "./Confirmation Modals/ArchiveConfirmModal.vue";
import RestoreConfirmModal from "./Confirmation Modals/RestoreConfirmModal.vue";
import DeleteConfirmModal from "./Confirmation Modals/DeleteConfirmModal.vue";
import DeactiveConfirmModal from "./Confirmation Modals/DeactiveConfirmModal.vue";
import ActiveConfirmModal from "./Confirmation Modals/ActiveConfirmModal.vue";
import DefaultContactConfirmModal from "./Confirmation Modals/DefaultContactConfirmModal.vue";

import QrcodeVue from "qrcode.vue";

import LogoutConfirm from "./Confirmation Modals/LogoutConfirmModal.vue";
import ResetConfirm from "./Confirmation Modals/ResetConfirmModal.vue";
//import InputError from "./InputError.vue";
//import InputError from "./InputError.vue";

import EditItem from "./Action Buttons/EditItem.vue";
import AddItem from "./Action Buttons/AddItem.vue";
import ArchiveItem from "./Action Buttons/ArchiveItem.vue";
import DeleteItem from "./Action Buttons/DeleteItem.vue";
import RestoreItem from "./Action Buttons/RestoreItem.vue";
import InfoItem from "./Action Buttons/InfoItem.vue";
import AddSubItem from "./Action Buttons/AddSubItem.vue";
import ViewArchiveItem from "./Action Buttons/ViewArchiveItem.vue";
import SaveBtn from "./Action Buttons/SaveBtn.vue";
import UpdateBtn from "./Action Buttons/UpdateBtn.vue";
import CancelBtn from "./Action Buttons/CancelBtn.vue";
import UploadFile from "./Action Buttons/UploadFile.vue";
import NoData from "./Other Components/No Data.vue";
import LoadMoreData from "./Other Components/Load More Data.vue";

import QrLarge from "./Other Components/Qr Large.vue";
import QrRow from "./Other Components/Qr Row.vue";
import MoveableModal from "./Other Components/MoveableModal.vue";
import Export from "./Other Components/Export.vue";
import SearchBar from "./Other Components/SearchBar.vue";
import PaginationBar from "./Other Components/PaginationBar.vue";
import PaginationBarLocal from "./Other Components/PaginationBarLocal.vue";
import LoadingScreen from "./Other Components/LoadingScreen.vue";

import AddKovil from "./Add Form Modals/Kovil-Management/AddKovil.vue";
import AddCategory from "./Add Form Modals/Kovil-Management/AddCategory.vue";
import AddGod from "./Add Form Modals/Kovil-Management/AddGod.vue";
import AddPoojaType from "./Add Form Modals/Kovil-Management/AddPoojaType.vue";
import AddPoojaTime from "./Add Form Modals/Kovil-Management/AddPoojaTime.vue";
import AddSpecialPooja from "./Add Form Modals/Kovil-Management/AddSpecialPooja.vue";
import AddArchanaType from "./Add Form Modals/Kovil-Management/AddArchanaType.vue";
import AddNatchaththiram from "./Add Form Modals/Kovil-Management/AddNatchaththiram.vue";
import AddRaasi from "./Add Form Modals/Kovil-Management/AddRaasi.vue";
import AddJothidar from "./Add Form Modals/Jothidar-Management/AddJothidar.vue";
import AddAstrologyCategory from "./Add Form Modals/Jothidar-Management/AddAstrologyCategory.vue";
import AddSchedule from "./Add Form Modals/Jothidar-Management/AddSchedule.vue";

import AddProduct from "./Add Form Modals/Merchandise-Management/AddProduct.vue";
import AddShopType from "./Add Form Modals/Merchandise-Management/AddShopType.vue";
import AddShopCategory from "./Add Form Modals/Merchandise-Management/AddShopCategory.vue";
import AddShop from "./Add Form Modals/Merchandise-Management/AddShop.vue";
import AddShopProductForShop from "./Add Form Modals/Merchandise-Management/AddShopProductForShop.vue";
import AddShopProductForProduct from "./Add Form Modals/Merchandise-Management/AddShopProductForProduct.vue";


import AddKovilInfo from "./Add Info Modals/Kovil-Management/AddKovilInfo.vue";
import ViewKovilInfo from "./Add Info Modals/Kovil-Management/ViewKovilInfo.vue";
import AddShopInfo from "./Add Info Modals/Merchandise-Management/AddShopInfo.vue";
import AddProductInfo from "./Add Info Modals/Merchandise-Management/AddProductInfo.vue";

import AddKovilGod from "./Add Form Modals/Kovil-Management/AddKovilGod.vue";
import AddKovilPooja from "./Add Form Modals/Kovil-Management/AddKovilPooja.vue";

import AddKovilPoojaTime from "./Add Form Modals/Kovil-Management/AddKovilPoojaTime.vue";
import AddKovilSpecialPooja from "./Add Form Modals/Kovil-Management/AddKovilSpecialPooja.vue";
import AddKovilArchana from "./Add Form Modals/Kovil-Management/AddKovilArchana.vue";


import AddPoojaBooking from "./Add Form Modals/Booking-Management/AddPoojaBooking.vue";



import vSelect from "vue-select";

export default (app) => {
  app.component("v-select", vSelect);
  app.component("UploadFile", UploadFile);
  app.component("AddPoojaBooking", AddPoojaBooking);

  app.component("AddShopInfo", AddShopInfo);
  app.component("AddProductInfo", AddProductInfo);

  app.component("AddKovilInfo", AddKovilInfo);
  app.component("ViewKovilInfo", ViewKovilInfo);
  app.component("AddKovilGod", AddKovilGod);
  app.component("AddKovilPooja", AddKovilPooja);
  app.component("AddKovilPoojaTime", AddKovilPoojaTime);
  app.component("AddKovilSpecialPooja", AddKovilSpecialPooja);
  app.component("AddKovilArchana", AddKovilArchana);


  app.component("AddProduct", AddProduct);
  app.component("AddShopType", AddShopType);
  app.component("AddShopCategory", AddShopCategory);
  app.component("AddShop", AddShop);
  app.component("AddShopProductForShop", AddShopProductForShop);
  app.component("AddShopProductForProduct", AddShopProductForProduct);

  app.component("AddJothidar", AddJothidar);
  app.component("AddAstrologyCategory", AddAstrologyCategory);
  app.component("AddSchedule", AddSchedule);

  app.component("AddArchanaType", AddArchanaType);
  app.component("AddSpecialPooja", AddSpecialPooja);
  app.component("AddPoojaType", AddPoojaType);
  app.component("AddPoojaTime", AddPoojaTime); 
  app.component("AddKovil", AddKovil);
  app.component("AddCategory", AddCategory);
  app.component("AddGod", AddGod);
  app.component("AddNatchaththiram", AddNatchaththiram);
  app.component("AddRaasi", AddRaasi);
  
  app.component("CancelBtn", CancelBtn);
  app.component("UpdateBtn", UpdateBtn);
  app.component("SaveBtn", SaveBtn);
  app.component("AddItem", AddItem);
  app.component("EditItem", EditItem);
  app.component("ArchiveItem", ArchiveItem);
  app.component("DeleteItem", DeleteItem);
  app.component("RestoreItem", RestoreItem);
  app.component("InfoItem", InfoItem);
  app.component("AddSubItem", AddSubItem);
  app.component("ViewArchiveItem", ViewArchiveItem);
  app.component("Export", Export);
  app.component("SearchBar", SearchBar);
  app.component("PaginationBar", PaginationBar);

  app.component("PaginationBarLocal", PaginationBarLocal);
  app.component("LoadingScreen", LoadingScreen);
  app.component("ResetConfirm", ResetConfirm);
  app.component("LogoutConfirm", LogoutConfirm);
  app.component("DeleteConfirmModal", DeleteConfirmModal);
  app.component("DeactiveConfirmModal", DeactiveConfirmModal);
  app.component("ActiveConfirmModal", ActiveConfirmModal);
  app.component("RestoreConfirmModal", RestoreConfirmModal);
  app.component("ArchiveConfirmModal", ArchiveConfirmModal);
  app.component("DefaultContactConfirmModal", DefaultContactConfirmModal);
  app.component("QrLarge", QrLarge);
  app.component("QrcodeVue", QrcodeVue);
  app.component("QrRow", QrRow);
  app.component("LoadMoreData", LoadMoreData);
  app.component("NoData", NoData);
  app.component("MoveableModal", MoveableModal);
  // app.component("InputError", InputError);
};
