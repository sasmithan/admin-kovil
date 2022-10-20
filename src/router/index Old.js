import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/side-menu/Main.vue";
import SimpleMenu from "../layouts/simple-menu/Main.vue";
import TopMenu from "../layouts/top-menu/Main.vue";
import DashboardOverview1 from "../views/Components/dashboard-overview-1/Main.vue";
import DashboardOverview2 from "../views/Components/dashboard-overview-2/Main.vue";
import DashboardOverview3 from "../views/Components/dashboard-overview-3/Main.vue";
import DashboardOverview4 from "../views/Components/dashboard-overview-4/Main.vue";
import Inbox from "../views/Components/inbox/Main.vue";
import FileManager from "../views/Components/file-manager/Main.vue";
import PointOfSale from "../views/Components/point-of-sale/Main.vue";
import Chat from "../views/Components/chat/Main.vue";
import Post from "../views/Components/post/Main.vue";
import Calendar from "../views/Components/calendar/Main.vue";
import CrudDataList from "../views/Components/crud-data-list/Main.vue";
import CrudForm from "../views/Components/crud-form/Main.vue";
import UsersLayout1 from "../views/Components/users-layout-1/Main.vue";
import UsersLayout2 from "../views/Components/users-layout-2/Main.vue";
import UsersLayout3 from "../views/Components/users-layout-3/Main.vue";
import ProfileOverview1 from "../views/Components/profile-overview-1/Main.vue";
import ProfileOverview2 from "../views/Components/profile-overview-2/Main.vue";
import ProfileOverview3 from "../views/Components/profile-overview-3/Main.vue";
import WizardLayout1 from "../views/Components/wizard-layout-1/Main.vue";
import WizardLayout2 from "../views/Components/wizard-layout-2/Main.vue";
import WizardLayout3 from "../views/Components/wizard-layout-3/Main.vue";
import BlogLayout1 from "../views/Components/blog-layout-1/Main.vue";
import BlogLayout2 from "../views/Components/blog-layout-2/Main.vue";
import BlogLayout3 from "../views/Components/blog-layout-3/Main.vue";
import PricingLayout1 from "../views/Components/pricing-layout-1/Main.vue";
import PricingLayout2 from "../views/Components/pricing-layout-2/Main.vue";
import InvoiceLayout1 from "../views/Components/invoice-layout-1/Main.vue";
import InvoiceLayout2 from "../views/Components/invoice-layout-2/Main.vue";
import FaqLayout1 from "../views/Components/faq-layout-1/Main.vue";
import FaqLayout2 from "../views/Components/faq-layout-2/Main.vue";
import FaqLayout3 from "../views/Components/faq-layout-3/Main.vue";
import SignIn from "../views/Components/login/Main.vue";
import Register from "../views/Components/register/Main.vue";
import ErrorPage from "../views/Components/error-page/Main.vue";
import UpdateProfile from "../views/Components/update-profile/Main.vue";
import ChangePasswordOld from "../views/Components/change-password/Main.vue";
import RegularTable from "../views/Components/regular-table/Main.vue";
import Tabulator from "../views/Components/tabulator/Main.vue";
import Modal from "../views/Components/modal/Main.vue";
import SlideOver from "../views/Components/slide-over/Main.vue";
import Notification from "../views/Components/notification/Main.vue";
import Tab from "../views/Components/tab/Main.vue";
import Accordion from "../views/Components/accordion/Main.vue";
import Button from "../views/Components/button/Main.vue";
import Alert from "../views/Components/alert/Main.vue";
import ProgressBar from "../views/Components/progress-bar/Main.vue";
import Tooltip from "../views/Components/tooltip/Main.vue";
import Dropdown from "../views/Components/dropdown/Main.vue";
import Typography from "../views/Components/typography/Main.vue";
import Icon from "../views/Components/icon/Main.vue";
import LoadingIcon from "../views/Components/loading-icon/Main.vue";
import RegularForm from "../views/Components/regular-form/Main.vue";
import Datepicker from "../views/Components/datepicker/Main.vue";
import TomSelect from "../views/Components/tom-select/Main.vue";
import FileUpload from "../views/Components/file-upload/Main.vue";
import WysiwygEditor from "../views/Components/wysiwg-editor/Main.vue";
import Validation from "../views/Components/validation/Main.vue";
import Chart from "../views/Components/chart/Main.vue";
import Slider from "../views/Components/slider/Main.vue";
import ImageZoom from "../views/Components/image-zoom/Main.vue";

import Warehouses from "../views/Components-New/warehouse-management/Warehouses.vue";
import StorageSections from "../views/Components-New/warehouse-management/Storage Sections.vue";
import StorageBins from "../views/Components-New/warehouse-management/Storage Bins.vue";
import StorageTypes from "../views/Components-New/warehouse-management/Storage Types.vue";
import PalletTypes from "../views/Components-New/warehouse-management/Pallet Types.vue";
import PalletSizes from "../views/Components-New/warehouse-management/Pallet Sizes.vue";
import ContainerTypes from "../views/Components-New/warehouse-management/Container Types.vue";
import ContainerSizes from "../views/Components-New/warehouse-management/Container Sizes.vue";
import Locations from "../views/Components-New/warehouse-management/Locations.vue";

import Departments from "../views/Components-New/stock-management/Departments.vue";
import Brands from "../views/Components-New/product-management/Brands.vue";
import Categories from "../views/Components-New/product-management/Categories.vue";
import Variants from "../views/Components-New/product-management/Variants.vue";
import VariantsType from "../views/Components-New/product-management/Variants Type.vue";
import Units from "../views/Components-New/product-management/Units.vue";
import Sku from "../views/Components-New/product-management/Sku.vue";
import Products from "../views/Components-New/product-management/Products.vue";
import Supplier from "../views/Components-New/stock-management/Supplier.vue";
import PurchaseInvoices from "../views/Components-New/stock-management/SupplierInvoices.vue";
import PurchaseStocks from "../views/Components-New/stock-management/Reorder.vue";
import PurchaseOrders from "../views/Components-New/stock-management/PurchaseOrders.vue";
import SortingOrders from "../views/Components-New/stock-management/Sorting Orders.vue";
import checkStock from "../views/Components-New/stock-management/Check Stocks.vue";

import Customer from "../views/Components-New/sale-management/Customer.vue";
import preparePicking from "../views/Components-New/sale-management/Picking Prepare.vue";
import Orders from "../views/Components-New/sale-management/CustomerOrders.vue";
import customerInvoice from "../views/Components-New/sale-management/CustomerInvoices.vue";

import queueOrders from "../views/Components-New/sale-management/QueueOrders.vue";
import activeOrders from "../views/Components-New/sale-management/ActiveOrders.vue";

import Despatch from "../views/Components-New/outbound/Despatch.vue";
import Receival from "../views/Components-New/inbound/Receival.vue";
import Replenish from "../views/Components-New/inbound/Replenish.vue";

import Lots from "../views/Components-New/inbound/Lots.vue";
import Lpns from "../views/Components-New/outbound/Lpns.vue";
import droppedOrders from "../views/Components-New/outbound/DroppedOrders.vue";

import ServerDown from "../views/Components-New/error-page/Server Down.vue";

import Report from "../views/Components-New/reports/Report.vue";
import CustomerOrders from "../views/Components-New/reports/Customer Sales.vue";
import ProductSales from "../views/Components-New/reports/Product Sales.vue";
import SupplierInvoices from "../views/Components-New/reports/Supplier Invoices.vue";
import Revenue from "../views/Components-New/reports/Revenue.vue";
import ProductSkuLocation from "../views/Components-New/reports/Product Sku Location.vue";
import ProductSectionLocation from "../views/Components-New/reports/Product Section Location.vue";
import Users from "../views/Components-New/user-management/Users.vue";
import Pickers from "../views/Components-New/user-management/Pickers.vue";
import UserPermission from "../views/Components-New/user-management/UserPermission.vue";

import Dashboard from "../views/Components-New/dashboard/Dashboard.vue";

import Login from "../views/Auth/Sign In.vue";
import ResetPassword from "../views/Auth/Reset Password.vue";

import ChangePassword from "../views/Auth/Change Password.vue";

import store from "../store";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";

const routes = [
  {
    path: "/",
    name: "",
    redirect: (to) => {
      return { path: "/admin/storage-bins" };
    },
  },

  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/reset-password",
    name: "reset",
    component: ResetPassword,
    meta: { requiresAuth: true },
  },
  {
    path: "/change-password",
    name: "change-password",
    component: ChangePassword,
    meta: { requiresAuth: true },
  },

  {
    path: "/admin",
    component: SideMenu,
    meta: { requiresAuth: true },
    children: [
      {
        path: "users",
        name: "users",
        component: Users,
      },
      {
        path: "pickers",
        name: "pickers",
        component: Pickers,
      },

      {
        path: "warehouses",
        name: "warehouses",
        component: Warehouses,
      },
      {
        path: "storage-types",
        name: "storage-types",
        component: StorageTypes,
      },
      {
        path: "storage-sections",
        name: "storage-sections",
        component: StorageSections,
      },
      {
        path: "storage-bins",
        name: "storage-bins",
        component: StorageBins,
      },
      {
        path: "container-sizes",
        name: "container-sizes",
        component: ContainerSizes,
      },
      {
        path: "locations",
        name: "locations",
        component: Locations,
      },
      {
        path: "container-types",
        name: "container-types",
        component: ContainerTypes,
      },
      {
        path: "pallet-sizes",
        name: "pallet-sizes",
        component: PalletSizes,
      },
      {
        path: "pallet-types",
        name: "pallet-types",
        component: PalletTypes,
      },
      {
        path: "category",
        name: "category",
        component: Categories,
      },
      {
        path: "brand",
        name: "brand",
        component: Brands,
      },
      {
        path: "variants-type/",
        name: "variants-type",
        component: VariantsType,
      },
      {
        path: "variant/:id",
        name: "variant",
        component: Variants,
      },
      {
        path: "unit",
        name: "unit",
        component: Units,
      },
      {
        path: "sku",
        name: "sku",
        component: Sku,
      },
      {
        path: "products",
        name: "products",
        component: Products,
      },
      {
        path: "suppliers",
        name: "suppliers",
        component: Supplier,
      },
      {
        path: "supplier-invoices",
        name: "supplier-invoices",
        component: PurchaseInvoices,
      },
      {
        path: "purchase-orders",
        name: "purchase-orders",
        component: PurchaseOrders,
      },
      {
        path: "reorder-stock",
        name: "reorder-stock",
        component: PurchaseStocks,
      },
      {
        path: "department",
        name: "department",
        component: Departments,
      },

      {
        path: "orders",
        name: "orders",
        component: Orders,
      },

      {
        path: "check-stocks",
        name: "check-stocks",
        component: checkStock,
      },
      {
        path: "sorting-orders",
        name: "sorting-orders",
        component: SortingOrders,
      },
      {
        path: "prepare-picking",
        name: "prepare-picking",
        component: preparePicking,
      },

      {
        path: "despatch",
        name: "despatch",
        component: Despatch,
      },
      {
        path: "receival",
        name: "receival",
        component: Receival,
      },
      {
        path: "replenish",
        name: "replenish",
        component: Replenish,
      },
      {
        path: "lots",
        name: "lots",
        component: Lots,
      },
      {
        path: "lpns",
        name: "lpns",
        component: Lpns,
      },
      {
        path: "droppedOrders",
        name: "droppedOrders",
        component: droppedOrders,
      },
      {
        path: "customer",
        name: "customer",
        component: Customer,
      },
      {
        path: "activeOrders",
        name: "activeOrders",
        component: activeOrders,
      },

      {
        path: "customerInvoice",
        name: "customerInvoice",
        component: customerInvoice,
      },

      {
        path: "product-sales-report",
        name: "product-sales-report",
        component: Report,
      },
      {
        path: "revenue-report",
        name: "revenue-report",
        component: Revenue,
      },

      {
        path: "product-sku-report",
        name: "product-sku-report",
        component: ProductSkuLocation,
      },

      {
        path: "product-section-report",
        name: "product-section-report",
        component: ProductSectionLocation,
      },

      {
        path: "product-sales-report",
        name: "product-sales-report",
        component: ProductSales,
      },
      {
        path: "customer-sales-report",
        name: "customer-sales-report",
        component: CustomerOrders,
      },
      {
        path: "supplier-invoice-report",
        name: "supplier-invoice-report",
        component: SupplierInvoices,
      },
      {
        path: "queueOrders",
        name: "queueOrders",
        component: queueOrders,
      },
      {
        path: "UserPermission",
        name: "UserPermission",
        component: UserPermission,
      },

      // {
      //   path: "/",
      //   name: "side-menu-dashboard",
      //   component: Locations,
      // },
    ],
  },

  {
    path: "/page-down",
    name: "page-down",
    component: ServerDown,
  },

  {
    path: "/app/simple-menu",
    component: SimpleMenu,
    children: [
      {
        path: "dashboard-overview-1",
        name: "simple-menu-dashboard-overview-1",
        component: DashboardOverview1,
      },
      {
        path: "dashboard-overview-2",
        name: "simple-menu-dashboard-overview-2",
        component: DashboardOverview2,
      },
      {
        path: "dashboard-overview-3",
        name: "simple-menu-dashboard-overview-3",
        component: DashboardOverview3,
      },
      {
        path: "dashboard-overview-4",
        name: "simple-menu-dashboard-overview-4",
        component: DashboardOverview4,
      },
      {
        path: "inbox",
        name: "simple-menu-inbox",
        component: Inbox,
      },
      {
        path: "file-manager",
        name: "simple-menu-file-manager",
        component: FileManager,
      },
      {
        path: "point-of-sale",
        name: "simple-menu-point-of-sale",
        component: PointOfSale,
      },
      {
        path: "chat",
        name: "simple-menu-chat",
        component: Chat,
      },
      {
        path: "post",
        name: "simple-menu-post",
        component: Post,
      },
      {
        path: "calendar",
        name: "simple-menu-calendar",
        component: Calendar,
      },
      {
        path: "crud-data-list",
        name: "simple-menu-crud-data-list",
        component: CrudDataList,
      },
      {
        path: "crud-form",
        name: "simple-menu-crud-form",
        component: CrudForm,
      },
      {
        path: "users-layout-1",
        name: "simple-menu-users-layout-1",
        component: UsersLayout1,
      },
      {
        path: "users-layout-2",
        name: "simple-menu-users-layout-2",
        component: UsersLayout2,
      },
      {
        path: "users-layout-3",
        name: "simple-menu-users-layout-3",
        component: UsersLayout3,
      },
      {
        path: "profile-overview-1",
        name: "simple-menu-profile-overview-1",
        component: ProfileOverview1,
      },
      {
        path: "profile-overview-2",
        name: "simple-menu-profile-overview-2",
        component: ProfileOverview2,
      },
      {
        path: "profile-overview-3",
        name: "simple-menu-profile-overview-3",
        component: ProfileOverview3,
      },
      {
        path: "wizard-layout-1",
        name: "simple-menu-wizard-layout-1",
        component: WizardLayout1,
      },
      {
        path: "wizard-layout-2",
        name: "simple-menu-wizard-layout-2",
        component: WizardLayout2,
      },
      {
        path: "wizard-layout-3",
        name: "simple-menu-wizard-layout-3",
        component: WizardLayout3,
      },
      {
        path: "blog-layout-1",
        name: "simple-menu-blog-layout-1",
        component: BlogLayout1,
      },
      {
        path: "blog-layout-2",
        name: "simple-menu-blog-layout-2",
        component: BlogLayout2,
      },
      {
        path: "blog-layout-3",
        name: "simple-menu-blog-layout-3",
        component: BlogLayout3,
      },
      {
        path: "pricing-layout-1",
        name: "simple-menu-pricing-layout-1",
        component: PricingLayout1,
      },
      {
        path: "pricing-layout-2",
        name: "simple-menu-pricing-layout-2",
        component: PricingLayout2,
      },
      {
        path: "invoice-layout-1",
        name: "simple-menu-invoice-layout-1",
        component: InvoiceLayout1,
      },
      {
        path: "invoice-layout-2",
        name: "simple-menu-invoice-layout-2",
        component: InvoiceLayout2,
      },
      {
        path: "faq-layout-1",
        name: "simple-menu-faq-layout-1",
        component: FaqLayout1,
      },
      {
        path: "faq-layout-2",
        name: "simple-menu-faq-layout-2",
        component: FaqLayout2,
      },
      {
        path: "faq-layout-3",
        name: "simple-menu-faq-layout-3",
        component: FaqLayout3,
      },
      {
        path: "update-profile",
        name: "simple-menu-update-profile",
        component: UpdateProfile,
      },
      {
        path: "change-password-old",
        name: "simple-menu-change-password",
        component: ChangePasswordOld,
      },
      {
        path: "regular-table",
        name: "simple-menu-regular-table",
        component: RegularTable,
      },
      {
        path: "tabulator",
        name: "simple-menu-tabulator",
        component: Tabulator,
      },
      {
        path: "modal",
        name: "simple-menu-modal",
        component: Modal,
      },
      {
        path: "slide-over",
        name: "simple-menu-slide-over",
        component: SlideOver,
      },
      {
        path: "notification",
        name: "simple-menu-notification",
        component: Notification,
      },
      {
        path: "tab",
        name: "simple-menu-tab",
        component: Tab,
      },
      {
        path: "accordion",
        name: "simple-menu-accordion",
        component: Accordion,
      },
      {
        path: "button",
        name: "simple-menu-button",
        component: Button,
      },
      {
        path: "alert",
        name: "simple-menu-alert",
        component: Alert,
      },
      {
        path: "progress-bar",
        name: "simple-menu-progress-bar",
        component: ProgressBar,
      },
      {
        path: "tooltip",
        name: "simple-menu-tooltip",
        component: Tooltip,
      },
      {
        path: "dropdown",
        name: "simple-menu-dropdown",
        component: Dropdown,
      },
      {
        path: "typography",
        name: "simple-menu-typography",
        component: Typography,
      },
      {
        path: "icon",
        name: "simple-menu-icon",
        component: Icon,
      },
      {
        path: "loading-icon",
        name: "simple-menu-loading-icon",
        component: LoadingIcon,
      },
      {
        path: "regular-form",
        name: "simple-menu-regular-form",
        component: RegularForm,
      },
      {
        path: "datepicker",
        name: "simple-menu-datepicker",
        component: Datepicker,
      },
      {
        path: "tom-select",
        name: "simple-menu-tom-select",
        component: TomSelect,
      },
      {
        path: "file-upload",
        name: "simple-menu-file-upload",
        component: FileUpload,
      },
      {
        path: "wysiwyg-editor",
        name: "simple-menu-wysiwyg-editor",
        component: WysiwygEditor,
      },
      {
        path: "validation",
        name: "simple-menu-validation",
        component: Validation,
      },
      {
        path: "chart",
        name: "simple-menu-chart",
        component: Chart,
      },
      {
        path: "slider",
        name: "simple-menu-slider",
        component: Slider,
      },
      {
        path: "image-zoom",
        name: "simple-menu-image-zoom",
        component: ImageZoom,
      },
    ],
  },
  {
    path: "/app/top-menu",
    component: TopMenu,
    children: [
      {
        path: "dashboard-overview-1",
        name: "top-menu-dashboard-overview-1",
        component: DashboardOverview1,
      },
      {
        path: "dashboard-overview-2",
        name: "top-menu-dashboard-overview-2",
        component: DashboardOverview2,
      },
      {
        path: "dashboard-overview-3",
        name: "top-menu-dashboard-overview-3",
        component: DashboardOverview3,
      },
      {
        path: "dashboard-overview-4",
        name: "top-menu-dashboard-overview-4",
        component: DashboardOverview4,
      },
      {
        path: "inbox",
        name: "top-menu-inbox",
        component: Inbox,
      },
      {
        path: "file-manager",
        name: "top-menu-file-manager",
        component: FileManager,
      },
      {
        path: "point-of-sale",
        name: "top-menu-point-of-sale",
        component: PointOfSale,
      },
      {
        path: "chat",
        name: "top-menu-chat",
        component: Chat,
      },
      {
        path: "post",
        name: "top-menu-post",
        component: Post,
      },
      {
        path: "calendar",
        name: "top-menu-calendar",
        component: Calendar,
      },
      {
        path: "crud-data-list",
        name: "top-menu-crud-data-list",
        component: CrudDataList,
      },
      {
        path: "crud-form",
        name: "top-menu-crud-form",
        component: CrudForm,
      },
      {
        path: "users-layout-1",
        name: "top-menu-users-layout-1",
        component: UsersLayout1,
      },
      {
        path: "users-layout-2",
        name: "top-menu-users-layout-2",
        component: UsersLayout2,
      },
      {
        path: "users-layout-3",
        name: "top-menu-users-layout-3",
        component: UsersLayout3,
      },
      {
        path: "profile-overview-1",
        name: "top-menu-profile-overview-1",
        component: ProfileOverview1,
      },
      {
        path: "profile-overview-2",
        name: "top-menu-profile-overview-2",
        component: ProfileOverview2,
      },
      {
        path: "profile-overview-3",
        name: "top-menu-profile-overview-3",
        component: ProfileOverview3,
      },
      {
        path: "wizard-layout-1",
        name: "top-menu-wizard-layout-1",
        component: WizardLayout1,
      },
      {
        path: "wizard-layout-2",
        name: "top-menu-wizard-layout-2",
        component: WizardLayout2,
      },
      {
        path: "wizard-layout-3",
        name: "top-menu-wizard-layout-3",
        component: WizardLayout3,
      },
      {
        path: "blog-layout-1",
        name: "top-menu-blog-layout-1",
        component: BlogLayout1,
      },
      {
        path: "blog-layout-2",
        name: "top-menu-blog-layout-2",
        component: BlogLayout2,
      },
      {
        path: "blog-layout-3",
        name: "top-menu-blog-layout-3",
        component: BlogLayout3,
      },
      {
        path: "pricing-layout-1",
        name: "top-menu-pricing-layout-1",
        component: PricingLayout1,
      },
      {
        path: "pricing-layout-2",
        name: "top-menu-pricing-layout-2",
        component: PricingLayout2,
      },
      {
        path: "invoice-layout-1",
        name: "top-menu-invoice-layout-1",
        component: InvoiceLayout1,
      },
      {
        path: "invoice-layout-2",
        name: "top-menu-invoice-layout-2",
        component: InvoiceLayout2,
      },
      {
        path: "faq-layout-1",
        name: "top-menu-faq-layout-1",
        component: FaqLayout1,
      },
      {
        path: "faq-layout-2",
        name: "top-menu-faq-layout-2",
        component: FaqLayout2,
      },
      {
        path: "faq-layout-3",
        name: "top-menu-faq-layout-3",
        component: FaqLayout3,
      },
      {
        path: "update-profile",
        name: "top-menu-update-profile",
        component: UpdateProfile,
      },
      {
        path: "change-password-old",
        name: "top-menu-change-password",
        component: ChangePasswordOld,
      },
      {
        path: "regular-table",
        name: "top-menu-regular-table",
        component: RegularTable,
      },
      {
        path: "tabulator",
        name: "top-menu-tabulator",
        component: Tabulator,
      },
      {
        path: "modal",
        name: "top-menu-modal",
        component: Modal,
      },
      {
        path: "slide-over",
        name: "top-menu-slide-over",
        component: SlideOver,
      },
      {
        path: "notification",
        name: "top-menu-notification",
        component: Notification,
      },
      {
        path: "tab",
        name: "top-menu-tab",
        component: Tab,
      },
      {
        path: "accordion",
        name: "top-menu-accordion",
        component: Accordion,
      },
      {
        path: "button",
        name: "top-menu-button",
        component: Button,
      },
      {
        path: "alert",
        name: "top-menu-alert",
        component: Alert,
      },
      {
        path: "progress-bar",
        name: "top-menu-progress-bar",
        component: ProgressBar,
      },
      {
        path: "tooltip",
        name: "top-menu-tooltip",
        component: Tooltip,
      },
      {
        path: "dropdown",
        name: "top-menu-dropdown",
        component: Dropdown,
      },
      {
        path: "typography",
        name: "top-menu-typography",
        component: Typography,
      },
      {
        path: "icon",
        name: "top-menu-icon",
        component: Icon,
      },
      {
        path: "loading-icon",
        name: "top-menu-loading-icon",
        component: LoadingIcon,
      },
      {
        path: "regular-form",
        name: "top-menu-regular-form",
        component: RegularForm,
      },
      {
        path: "datepicker",
        name: "top-menu-datepicker",
        component: Datepicker,
      },
      {
        path: "tom-select",
        name: "top-menu-tom-select",
        component: TomSelect,
      },
      {
        path: "file-upload",
        name: "top-menu-file-upload",
        component: FileUpload,
      },
      {
        path: "wysiwyg-editor",
        name: "top-menu-wysiwyg-editor",
        component: WysiwygEditor,
      },
      {
        path: "validation",
        name: "top-menu-validation",
        component: Validation,
      },
      {
        path: "chart",
        name: "top-menu-chart",
        component: Chart,
      },
      {
        path: "slider",
        name: "top-menu-slider",
        component: Slider,
      },
      {
        path: "image-zoom",
        name: "top-menu-image-zoom",
        component: ImageZoom,
      },
    ],
  },

  {
    path: "/app/login",
    name: "signin",
    component: SignIn,
  },
  {
    path: "/app/register",
    name: "register",
    component: Register,
  },
  {
    path: "/app/error-page",
    name: "error-page",
    component: ErrorPage,
  },
  {
    path: "/:pathMatch(.*)*",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

if (store.getters["authUser/isLoggedIn"]) {
  console.log("Logged In");
}

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !store.getters["authUser/isLoggedIn"]) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
