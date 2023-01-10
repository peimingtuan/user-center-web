<template>
    <div class="user-log">
        <!-- 右部 -->
        <div class="public-notree-right-content">
            <head-box
                    class="public-header-option"
                    :btnList="btnList"
            >
                <el-input v-model="value" placeholder="用户名" clearable></el-input>
                <el-input v-model="value" placeholder="操作模块" clearable></el-input>
                <el-input v-model="value" placeholder="日志描述" clearable></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            </head-box>
            <table-box
                    class="public-table-box-scroll"
                    :selection="false"
                    :tableKey="tableKey"
                    :tableData="tableData"
            >
                <el-table-column slot="enableAes" label="是否有效">
                    <template slot-scope="scope">
                        <div>{{scope.row.enableAes?'是':'否'}}</div>
                    </template>
                </el-table-column>
                <el-table-column slot="operate" label="操作" width="150">
                    <template slot-scope="scope">
                        <div class="isedit">
                            <span  @click="edit(scope.$index, scope.row)">修改</span>
                            <span  @click="delInfo(scope.$index, scope.row)">删除</span>
                        </div>
                    </template>
                </el-table-column>
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
        name: "UserLog",
        components: {
            headBox:()=>import("@/components/head-box"),
            tableBox:()=>import('@/components/table-box'),
            pagingBox:()=>import('@/components/paging-box'),
        },
        data() {
            return {
                btnList:[],
                tableKey:[{prop:'name',label:'用户名',tooltip:true},
                    {prop:'name2',label:'操作时间',tooltip:true},
                    {prop:'name3',label:'操作模块',tooltip:true},
                    {prop:'name4',label:'描述',tooltip:true}],
                tableData:Array(10).fill({name:'管理员',name2:'2020-09-18 15:08:48',name3:'用户管理',name4:'xvcvcv'}),
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
    .user-log {

    }
</style>
<style lang="less">

</style>