<template>
  <div id="app">
    <div class="p-3 h-screen flex flex-col justify-between">
      <div>
        <label
          class="block tracking-wide text-gray-700 text-sm mb-2"
          for="country"
        >
          Default country
        </label>
        <div class="relative">
          <select
            v-model="country"
            :disabled="automaticCountryDetection"
            class="block appearance-none w-full border border-gray-200 text-gray-700 py-1 px-2 rounded leading-tight outline-none focus:shadow-outline"
            id="country"
          >
            <option disabled value="">Disabled</option>
            <option
              v-for="(code, country) in countries"
              :key="country"
              :value="code"
            >
              {{ country }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <div>
          <label class="block text-gray-700">
            <input class="mr-2 leading-tight" type="checkbox" />
            <span class="text-sm">
              Launch at startup
            </span>
          </label>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700">
            <input
              v-model="automaticCountryDetection"
              class="mr-2 leading-tight"
              type="checkbox"
            />
            <span class="text-sm">
              Automatic country detection
            </span>
          </label>
        </div>
      </div>
      <hr />
      <p v-show="settings" class="text-gray-600 text-xs italic">
        Changes saved successfully!
      </p>
      <div class="flex justify-end">
        <button
          @click="saveSettings()"
          class="bg-white hover:bg-gray-100 text-gray-700 tracking-wide text-sm px-2 border border-gray-400 rounded shadow appearance-none outline-none focus:shadow-outline"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "SettingsWindow",

  data() {
    return {
      country: "",
      countries: null,
      automaticCountryDetection: true,
      settings: false
    };
  },

  created() {
    ipcRenderer.send("get-all-countries", this.isOnline());
    ipcRenderer.on("send-all-countries", (event, countries) => {
      this.countries = countries.countries;
    });
  },

  methods: {
    isOnline() {
      return window.navigator.onLine ? true : false;
    },

    saveSettings() {
      this.settings = true;

      if (!this.automaticCountryDetection) {
        ipcRenderer.send("manual-country-selection", this.country, "manual");
      } else {
        ipcRenderer.send("manual-country-selection", this.country, "auto");
      }

      const fade = setTimeout(() => {
        this.settings = false;
        clearTimeout(fade);
      }, 1000);
    }
  }
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
