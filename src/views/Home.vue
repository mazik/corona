<template>
  <div class="max-w-xs shadow-lg">
    <div class="relative flex justify-center">
      <div class="bg-gray-300 absolute w-3 h-3 transform rotate-45 -mt-1"></div>
    </div>
    <!-- Header -->
    <div class="overflow-hidden rounded bg-white">
      <div class="flex items-center justify-center bg-gray-300 py-1">
        <h2
          class="flex justify-center items-center text-xs text-center text-gray-900"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" title="Corona">
            <path
              d="M12 .5a1.746 1.746 0 00-1 3.18v1.4c-.9.13-1.74.42-2.5.86L7.39 4.35c.19-.52.14-1.12-.2-1.6C6.84 2.26 6.3 2 5.75 2c-.35 0-.7.1-1 .32-.79.55-.99 1.64-.43 2.43.34.49.88.75 1.43.75l1.18 1.68c-.43.43-.77.91-1.06 1.44-.2-.08-.41-.12-.62-.12-.45 0-.9.17-1.25.5-.67.7-.67 1.8 0 2.5.29.27.64.42 1 .5 0 .54.07 1.06.18 1.56l-1.31.35c-.31-.26-.71-.41-1.12-.41-.15 0-.31 0-.46.06a1.752 1.752 0 00-1.23 2.15C1.27 16.5 2 17 2.75 17c.15 0 .3 0 .46-.06.57-.16 1-.58 1.18-1.1l1.51-.41c.45.79 1.05 1.49 1.75 2.07l-1.1 2c-.55.08-1.05.39-1.34.92a1.749 1.749 0 103.08 1.66c.28-.52.27-1.12.02-1.61l1.07-1.97c.81.32 1.69.5 2.62.5h.18c-.13.26-.18.56-.18.88.08.92.84 1.62 1.75 1.62h.13c.97-.08 1.69-.92 1.62-1.88-.04-.5-.29-.94-.65-1.23.47-.21.92-.48 1.34-.79l2.34 2.34c-.1.56.06 1.13.47 1.56.35.33.8.5 1.25.5s.9-.17 1.25-.5c.67-.7.67-1.8 0-2.5-.35-.33-.8-.5-1.25-.5-.1 0-.2 0-.31.03l-2.34-2.34c.49-.65.87-1.39 1.11-2.19h1.11A1.746 1.746 0 0023 13a1.746 1.746 0 00-3.18-1H19c0-1.57-.5-3-1.4-4.19l1.34-1.34c.11.03.21.03.31.03.45 0 .9-.17 1.25-.5.67-.69.67-1.8 0-2.5-.35-.33-.8-.5-1.25-.5s-.9.17-1.25.5c-.41.43-.57 1-.47 1.56L16.19 6.4c-.92-.69-2-1.15-3.19-1.32v-1.4A1.746 1.746 0 0012 .5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m-1.5-8C9.67 9 9 9.67 9 10.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S11.33 9 10.5 9m3.5 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"
            />
          </svg>
          <span class="ml-1">COVID-19</span>
        </h2>
      </div>
      <!-- Main -->
      <div class="px-6 py-4">
        <vc-donut
          :size="150"
          unit="px"
          :thickness="30"
          has-legend
          legend-placement="bottom"
          :sections="sections"
          :total="100"
          :start-angle="0"
          @section-click="handleSectionClick"
        >
          <h2 class="text-gray-900 text-base">163037</h2>
          <h3 class="text-gray-600">Cases reported</h3>
        </vc-donut>

        <h1 class="text-gray-700 text-sm mb-2">Latest global updates</h1>
        <div class="flex flex-col text-gray-700 text-xs bg-gray-100 p-4">
          <div class="flex justify-between w-full">
            <div class="flex items-center text-orange-500">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path
                  d="M15 6h7v3h-4v4h-4v4h-4v4H3v-3h4v-4h4v-4h4V6m-4.83.66l-5.51 5.51-1.83-1.83 5.51-5.51L6.5 3H12v5.5l-1.83-1.84z"
                />
              </svg>
              <p class="ml-1 text-sm">
                <span class="text-xl font-bold">368</span>
                Confirmed
              </p>
            </div>
            <div class="flex items-center text-green-500">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path
                  d="M15 6h7v3h-4v4h-4v4h-4v4H3v-3h4v-4h4v-4h4V6M4.83 8.34l5.51-5.51 1.83 1.83-5.51 5.51L8.5 12H3V6.5l1.83 1.84z"
                />
              </svg>
              <p class="ml-1 text-sm">
                <span class="text-xl font-bold">1510</span>
                Recovered
              </p>
            </div>
          </div>
          <p class="mt-2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum,
            repellendus!
          </p>
          <p class="italic text-right">07 March 2020</p>
        </div>
      </div>
      <!-- Footer -->
      <div class="bg-gray-300 p-1 text-gray-700 flex justify-between">
        <button
          class="appearance-none outline-none focus:shadow-outline"
          title="Settings"
        >
          <svg
            class="w-4 h-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M16.783 10c0-1.049.646-1.875 1.617-2.443a8.932 8.932 0 00-.692-1.672c-1.089.285-1.97-.141-2.711-.883-.741-.74-.968-1.621-.683-2.711a8.732 8.732 0 00-1.672-.691c-.568.97-1.595 1.615-2.642 1.615-1.048 0-2.074-.645-2.643-1.615a8.697 8.697 0 00-1.671.691c.285 1.09.059 1.971-.684 2.711-.74.742-1.621 1.168-2.711.883A8.797 8.797 0 001.6 7.557c.97.568 1.615 1.394 1.615 2.443 0 1.047-.645 2.074-1.615 2.643a8.89 8.89 0 00.691 1.672c1.09-.285 1.971-.059 2.711.682.741.742.969 1.623.684 2.711a8.841 8.841 0 001.672.693c.568-.973 1.595-1.617 2.643-1.617 1.047 0 2.074.645 2.643 1.617a8.963 8.963 0 001.672-.693c-.285-1.088-.059-1.969.683-2.711.741-.74 1.622-1.166 2.711-.883a8.811 8.811 0 00.692-1.672c-.973-.569-1.619-1.395-1.619-2.442zM10 13.652a3.652 3.652 0 110-7.306 3.653 3.653 0 010 7.306z"
            />
          </svg>
        </button>
        <p class="text-xs underline">Bangladesh</p>
        <button
          class="appearance-none outline-none focus:shadow-outline"
          title="Refresh"
        >
          <svg
            class="w-4 h-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M5.516 14.224c-2.262-2.432-2.222-6.244.128-8.611a6.074 6.074 0 013.414-1.736L8.989 1.8a8.112 8.112 0 00-4.797 2.351c-3.149 3.17-3.187 8.289-.123 11.531l-1.741 1.752 5.51.301-.015-5.834-2.307 2.323zm6.647-11.959l.015 5.834 2.307-2.322c2.262 2.434 2.222 6.246-.128 8.611a6.07 6.07 0 01-3.414 1.736l.069 2.076a8.122 8.122 0 004.798-2.35c3.148-3.172 3.186-8.291.122-11.531l1.741-1.754-5.51-.3z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      sections: [
        { label: "Deaths: 3491", value: 25 },
        { label: "Recovered: 57376", value: 25 },
        { label: "Confirmed: 102170", value: 25 }
      ]
    };
  },
  methods: {
    handleSectionClick(section, event) {
      console.log(`${section.label} clicked. ${event}`);
    }
  }
};
</script>
