<template>
    <div class="login-log">
        <!-- 右部 -->
        <div class="public-notree-right-content">
            <head-box
                    class="public-header-option"
                    @search="search"
                    :btnList="btnList"
            >
                <el-input v-model="value" placeholder="用户名" clearable></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            </head-box>
            <table-box
                    class="public-table-box-scroll"
                    :selection="false"
                    :tableKey="tableKey"
                    :tableData="tableData"
            >
            </table-box>
            <!-- 分页 -->
            <paging-box
                    :pageIndex="pageIndex"
                    :pageSize="pageSize"
                    :total="total"
                    @handleCurrentChange="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script>
    import {MessageBox} from "element-ui"
    import {successMsg,warningMsg} from "../../ui"
    import * as api from "../../api/show-api"
    export default {
        name: "LoginLog",
        components: {
            headBox:()=>import("@/components/head-box"),
            tableBox:()=>import('@/components/table-box'),
            pagingBox:()=>import('@/components/paging-box'),
        },
        data() {
            return {
                btnList:[],
                tableKey:[{prop:'name',label:'用户名',tooltip:true},
                    {prop:'name2',label:'登陆时间',tooltip:true},
                    {prop:'name3',label:'登录IP',tooltip:true},
                    {prop:'name4',label:'描述',tooltip:true}],
                tableData:Array(10).fill({name:'管理员',name2:'2020-09-18 15:01:01',name3:'10.50.17.75',name4:'xvcvcv'}),
                pageIndex:1,
                pageSize:10,
                total:0,
                value:''
            }
        },
        created() {
        },
        mounted() {
        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            async search(){
                let res=await api.generateAesKey({})
            },
            handleCurrentChange(page){

            },
        }
    }
</script>

<style lang="less" scoped>
    .login-log {

    }
</style>
<style lang="less">

</style>