<template>
  <tbody>
    <tr
      v-for="index in rows"
      :key="index"
    >
      <td
        v-for="item in cells"
        :key="item"
      >
        <skeleton-loader
          :template="template"
        />
      </td>
    </tr>
  </tbody>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

export default {
  name: 'skeleton-loader-table-body',
  components: {
    SkeletonLoader,
  },
  props: {
    cells: {
      type: Number,
      default: 5,
    },
    rows: {
      type: Number,
      default: 3,
    },
    template: {
      type: String,
      default: 'bigString',
    },
  },
}
</script>

<style scoped lang="scss"></style>
