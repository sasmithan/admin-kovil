import { defineStore } from "pinia";
import { getCurrentInstance } from "vue";
import store from "../store";
export const useSideMenuStore = defineStore("sideMenu", {
  state: () => ({
    menu: [
      {
        icon: "HomeIcon",
        pageName: "Home",
        title: "Home",
        viewPermission: true,
      },    
      {
        icon: "BuildingIcon",
        pageName: "products-management",
        title: "Booking Menu",
        viewPermission: true,
        subMenu: [
          {
            icon: "MoreHorizontalIcon",
            pageName: "ArchanaBooking",
            title: "Archana Booking ",
            status: true,
            viewPermission: true,
          },
          {
            icon: "MoreHorizontalIcon",
            pageName: "PoojaBooking",
            title: "Pooja Booking ",
            status: true,
            viewPermission: true,
          },
          {
            icon: "MoreHorizontalIcon",
            pageName: "SpecialPoojaBooking",
            title: "Special Pooja Booking ",
            status: true,
            viewPermission: true,
          },
 
      
     
          
        ],
      },

      {
        icon: "BuildingIcon",
        pageName: "products-management",
        title: "Kovil Menu",
        viewPermission: true,
        subMenu: [
          {
            icon: "MoreHorizontalIcon",
            pageName: "Kovils",
            title: "Kovils ",
            status: true,
            viewPermission: true,
          },

        
         
          {
            icon: "MoreHorizontalIcon",
            pageName: "PoojaTypes",
            title: "Pooja Types",
            status: true,
            viewPermission: true,
          },
          {
            icon: "MoreHorizontalIcon",
            pageName: "SpecialPooja",
            title: "Special Poojas",
            status: true,
            viewPermission: true,
          },

          {
            icon: "MoreHorizontalIcon",
            pageName: "PoojaTimes",
            title: "Pooja Times",
            status: true,
            viewPermission: true,
          },

          {
            icon: "MoreHorizontalIcon",
            pageName: "Gods",
            title: "Gods",
            status: true,
            viewPermission: true,
          },
          {
            icon: "MoreHorizontalIcon",
            pageName: "ArchanaType",
            title: "Archana Types",
            status: true,
            viewPermission: true,
          },
          {
            icon: "MoreHorizontalIcon",
            pageName: "KovilCategories",
            title: "Kovil Catgories",
            status: true,
            viewPermission: true,
          },
         
        ],
      },
      
      {
        icon: "HomeIcon",
        pageName: "jothidar-management",
        title: "Jothidar Menu",
        viewPermission: true,
        subMenu: [
          {
            icon: "MoreHorizontalIcon",
            pageName: "Jothidar",
            title: "Jothidar ",
            status: true,
            viewPermission: true,
          },
        
          {
            icon: "MoreHorizontalIcon",
            pageName: "AstrologyCategory",
            title: "Astrology Category",
            status: true,
            viewPermission: true,
          },
          {
            icon: "MoreHorizontalIcon",
            pageName: "Schedules",
            title: "Schedule Times",
            status: true,
            viewPermission: true,
          },
          {
            icon: "MoreHorizontalIcon",
            pageName: "Raasi",
            title: "Raasi",
            status: true,
            viewPermission: true,
          },
          {
            icon: "MoreHorizontalIcon",
            pageName: "Natchaththiram",
            title: "Natchaththiram",
            status: true,
            viewPermission: true,
          },
           
        ],
      },
    
      {
        icon: "HomeIcon",
        pageName: "merchant-management",
        title: "Shops Menu",
        viewPermission: true,
        subMenu: [
          {
            icon: "MoreHorizontalIcon",
            pageName: "Shops",
            title: "Shops ",
            status: true,
            viewPermission: true,
          },
          // {
          //   icon: "MoreHorizontalIcon",
          //   pageName: "ShopProduct",
          //   title: "Shop Product",
          //   status: true,
          //   viewPermission: true,
          // },
        
          {
            icon: "MoreHorizontalIcon",
            pageName: "ShopCategory",
            title: "Shop Category",
            status: true,
            viewPermission: true,
          },
          {
            icon: "MoreHorizontalIcon",
            pageName: "ShopType",
            title: "Shop Type",
            status: true,
            viewPermission: true,
          },
          {
            icon: "MoreHorizontalIcon",
            pageName: "Products",
            title: "Products",
            status: true,
            viewPermission: true,
          },
        
           
        ],
      },
    ],
  }),
});
