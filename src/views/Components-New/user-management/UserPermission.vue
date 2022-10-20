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
      class="
        intro-y
        lg:flex lg:flex-row lg:items-center lg:space-x-2 lg:justify-between
        md:flex md:flex-row md:items-center md:space-x-1 md:justify-between
        flex flex-wrap flex-col
        justify-end
        items-end
        mt-2
        w-full
      "
    >
      <div class="flex space-x-1">
        <div class="w-56">
          <div class="relative text-slate-500">
            <input
              type="text"
              class="form-control box pr-10"
              placeholder="Search Role Name..."
              v-model="searchData"
              @change="searchOnchange"
            />
            <SearchIcon
              @click="searchItem"
              v-if="!searchActive"
              class="
                lg:w-6 lg:h-6
                w-4
                h-4
                absolute
                my-auto
                inset-y-0
                mr-3
                right-0
                cursor-pointer
              "
            />
            <XIcon
              @click="clearSearch"
              v-if="searchActive"
              class="
                lg:w-6 lg:h-6
                w-4
                h-4
                absolute
                my-auto
                inset-y-0
                mr-3
                right-0
                cursor-pointer
              "
            />
          </div>
        </div>

        <div class="hidden md:block mx-auto text-slate-500">
          <!-- Showing 1 to 10 of 150 entries -->
        </div>
      </div>
    </div>

    <!-- BEGIN: Data List -->
    <!-- <div class="intro-y overflow-auto pt-8">
      <table class="table table-bordered table-auto">
        <thead>
          <tr class="whitespace-nowrap">
            <th class="border border-black">ROLE</th>
            <th class="border border-black">PERMISSION</th>
          </tr>
        </thead>
        <tbody>
          <tr class="intro-x">
            <td class="border border-black">Super User</td>
            <td class="border border-black">
              <div class="grid grid-cols-3 gap-4 p-2">
                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Select All</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Read</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Write</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Create</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Edit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Delete</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Submit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Cancel</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Amend</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Print</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Email</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Report</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Import</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Export</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Share</span>
                </div>
              </div>
            </td>
          </tr>
          <tr class="intro-x">
            <td class="border border-black">Admin</td>
            <td class="border border-black">
              <div class="grid grid-cols-3 gap-4 p-2">
                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Select All</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Read</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Write</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Create</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Edit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Delete</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Submit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Cancel</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Amend</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Print</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Email</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Report</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Import</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Export</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Share</span>
                </div>
              </div>
            </td>
          </tr>
          <tr class="intro-x">
            <td class="border border-black">Supervisor</td>
            <td class="border border-black">
              <div class="grid grid-cols-3 gap-4 p-2">
                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Select All</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Read</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Write</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Create</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Edit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Delete</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Submit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Cancel</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Amend</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Print</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Email</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Report</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Import</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Export</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Share</span>
                </div>
              </div>
            </td>
          </tr>
          <tr class="intro-x">
            <td class="border border-black">Help Desk</td>
            <td class="border border-black">
              <div class="grid grid-cols-3 gap-4 p-2">
                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Select All</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Read</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Write</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Create</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Edit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Delete</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Submit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Cancel</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Amend</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Print</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Email</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Report</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Import</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Export</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Share</span>
                </div>
              </div>
            </td>
          </tr>
          <tr class="intro-x">
            <td class="border border-black">Web User</td>
            <td class="border border-black">
              <div class="grid grid-cols-3 gap-4 p-2">
                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Select All</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Read</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Write</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Create</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Edit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Delete</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Submit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Cancel</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Amend</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Print</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Email</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Report</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Import</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Export</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Share</span>
                </div>
              </div>
            </td>
          </tr>
          <tr class="intro-x">
            <td class="border border-black">Picker</td>
            <td class="border border-black">
              <div class="grid grid-cols-3 gap-4 p-2">
                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Select All</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Read</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Write</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Create</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Edit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Delete</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Submit</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Cancel</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Amend</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Print</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Email</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Report</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Import</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Export</span>
                </div>

                <div class="flex space-x-2">
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                  <span class="font-medium">Share</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->

    <div class="flex space-x-4 pt-10 w-full">
      <div class="w-full">
        <h2 class="text-lg font-medium">Access</h2>

        <TabGroup class="flex pl-4 w-full pt-10">
          <TabList class="nav-boxed-tabs flex flex-col w-64">
            <Tab
              class="w-full py-2 flex justify-start items-start"
              tag="button"
            >
              <div class="flex items-center justify-center">
                <UserIcon class="w-6 h-6 mr-1" />
                <span class="">User Management</span>
              </div>
            </Tab>
            <Tab
              class="w-full py-2 flex justify-start items-start"
              tag="button"
            >
              <div class="flex items-center justify-center">
                <StarIcon class="w-6 h-6 mr-1" />
                <span class="">Demo Access</span>
              </div>
            </Tab>
            <Tab
              class="w-full py-2 flex justify-start items-start"
              tag="button"
            >
              <div class="flex items-center justify-center">
                <StarIcon class="w-6 h-6 mr-1" />
                <span class="">Demo Access</span>
              </div>
            </Tab>
          </TabList>
          <TabPanels class="border w-full">
            <TabPanel
              class="leading-relaxed p-5 flex flex-col space-y-4 flex-1 "
            >
            <div class="flex justify-between items-center">

<h2 class="text-lg font-medium">Permission</h2>
 <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
            </div>
            
              <div class="flex justify-between items-center space-x-4">
                <div class="flex justify-start items-start space-x-4">
                  <EyeIcon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">View</span>
                    <span class="">View User Info</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center space-x-4" >
                <div class="flex justify-start items-start space-x-4">
                  <PlusCircleIcon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">Add</span>
                    <span class="">Add New User</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  
                  />
                </div>
              </div>

              <div class="flex justify-between items-center space-x-4">
                <div class="flex justify-start items-start space-x-4">
                  <EditIcon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">Edit</span>
                    <span class="">Edit User Info</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center space-x-4">
                <div class="flex justify-start items-start space-x-4">
                  <Trash2Icon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">Delete</span>
                    <span class="">Delete User Info</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
              </div>
            </TabPanel>
            <TabPanel class="leading-relaxed p-5 flex flex-col space-y-4">
              <div class="flex justify-between items-center">

<h2 class="text-lg font-medium">Permission</h2>
 <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
            </div>
                <div class="flex justify-between items-center space-x-4">
                <div class="flex justify-start items-start space-x-4">
                  <EyeIcon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">View</span>
                    <span class="">View User Info</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3 "
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center space-x-4">
                <div class="flex justify-start items-start space-x-4">
                  <PlusCircleIcon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">Add</span>
                    <span class="">Add New User</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center space-x-4">
                <div class="flex justify-start items-start space-x-4">
                  <EditIcon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">Edit</span>
                    <span class="">Edit User Info</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center space-x-4">
                <div class="flex justify-start items-start space-x-4">
                  <Trash2Icon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">Delete</span>
                    <span class="">Delete User Info</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
              </div>
            </TabPanel>
            <TabPanel class="leading-relaxed p-5 flex flex-col space-y-4">
             <div class="flex justify-between items-center">

<h2 class="text-lg font-medium">Permission</h2>
 <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
            </div>
                <div class="flex justify-between items-center space-x-4">
                <div class="flex justify-start items-start space-x-4">
                  <EyeIcon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">View</span>
                    <span class="">View User Info</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center space-x-4">
                <div class="flex justify-start items-start space-x-4">
                  <PlusCircleIcon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">Add</span>
                    <span class="">Add New User</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center space-x-4">
                <div class="flex justify-start items-start space-x-4">
                  <EditIcon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">Edit</span>
                    <span class="">Edit User Info</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center space-x-4">
                <div class="flex justify-start items-start space-x-4">
                  <Trash2Icon class="w-10 h-10" />
                  <div class="flex flex-col items-start justify-center">
                    <span class="">Delete</span>
                    <span class="">Delete User Info</span>
                  </div>
                </div>

                <div>
                  <input
                    id="vertical-form-3"
                    class="form-check-input w-5 h-5 mr-1 bg-slate-100 ml-2"
                    type="checkbox"
                  />
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  </div>
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
    store.dispatch("menuTitle/setSubMenuTitle", "User Permission");
  },
  components: {
    paginate: Paginate,
    Loading,
  },
  data() {
    return {};
  },
  computed: {},
  created() {},

  methods: {},
};
</script>
<style>
.flex-1 {
  flex: 0 0 0% !important;
}
</style>
