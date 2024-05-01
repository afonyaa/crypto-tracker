<template>
  <div
    class="flex justify-center items-center m-1 w-max font-medium py-1 px-2 bg-white rounded-full text-gray-700 bg-gray-100 border border-gray-300"
  >
    <div class="text-xs font-normal leading-none max-w-full flex-initial">{{ text }}</div>
  </div>
</template>
<script>
export default {
  name: 'UIChip',
  props: {
    text: String,
  },
};
</script>
<style scoped></style>
