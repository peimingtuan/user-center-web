<template>
  <span>{{ secretKey }}</span>
</template>

<script>
import * as systemManagementApi from "../../../api/system-management-api.js"

export default {
  name: "DialogBody",
  data() {
    return {
      secretKey: ''
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async show(data) {
      if (data) {
        this.row = data
        let result = await systemManagementApi.getSecretKey(data.iUserId)
        if (result.success){
          this.secretKey = result.body.secretKey
        }
      }
    },
    async generateKey() {
      if (this.secretKey == null || this.secretKey === '') {
        let result = await systemManagementApi.generateKey(this.row.iUserId)
        if (result.success){
          this.secretKey = result.body.secretKey
        }
      }
    }
  },
}
</script>

<style lang="less" scoped>
</style>
<style lang="less">

</style>