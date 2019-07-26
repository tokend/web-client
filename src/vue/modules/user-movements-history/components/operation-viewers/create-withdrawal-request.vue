<template>
  <tbody>
    <!--TODO: no details info at this moment-->
  </tbody>
</template>

<script>
import { CreateWithdrawRequestOp } from '../../wrappers/operation-details/create-withdrawal-request'

export default {
  props: {
    operationDetails: {
      type: CreateWithdrawRequestOp,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/attributes-viewer';
</style>
