<template>
    <div class="portal-authorize-body">
        <el-transfer
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            filterable
            filter-placeholder="请输入应用名称"
            target-order="unshift"
            :titles="['未授权', '已授权']"
            :button-texts="['删除', '添加']"
            :filter-method="filterMethod"
            :props="{
                  key: 'id',
                  label: 'appName'
                }"
            v-model="value"
            :data="appNameList"
            @change="valueChange">
        </el-transfer>
    </div>
</template>

<script>
    import {MessageBox} from "element-ui"
    export default {
        name: "PortalAuthorizeBody",
        props:{
            appNameList: {
                type: Array
            }
        },
        data() {
            return {
                loading: false,
                value: [],
                authorizedInfo: {},
                filterMethod(query, item) {
                    return item.appName.indexOf(query) > -1;
                }
            }
        },
        methods: {
            valueChange(value, direction, valueArr) {
              if (direction === "right") {
                this.$emit("saveInfo", valueArr);
              } else {
                let rolePortletIds = [];
                for (let id of valueArr) {
                  for (let item of this.authorizedInfo) {
                    if (item.id == id) {
                      rolePortletIds.push(item.rolePortletId);
                    }
                  }
                }
                this.$emit("delInfo", rolePortletIds);
              }
            }
        }
    }
</script>

<style lang="less" scoped>
    .portal-authorize-body {
        width:100%;
        height:450px;
        padding-left: 12%;
        padding-top: 5%;
    }
</style>
<style lang="less">
    .portal-authorize-body {
        .el-transfer-panel {
           margin: 0 auto;
           width: 300px !important;
        }
    }
</style>