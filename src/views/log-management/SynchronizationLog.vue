<template>
    <div class="synchronization-log">
        <!-- 右部 -->
        <div class="public-notree-right-content">
            <head-box
                    class="public-header-option"
                    :btnList="btnList"
            >
                <el-input v-model="value" placeholder="日志ID" clearable></el-input>
                <el-date-picker
                        v-model="value1"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            </head-box>
            <table-box
                    class="public-table-box-scroll"
                    :selection="false"
                    :tableKey="tableKey"
                    :tableData="tableData"
            >
                <el-table-column slot="operate" label="操作">
                    <template slot-scope="scope">
                        <div class="isedit">
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
        name: "SynchronizationLog",
        components: {
            headBox:()=>import("@/components/head-box"),
            tableBox:()=>import('@/components/table-box'),
            pagingBox:()=>import('@/components/paging-box'),
        },
        data() {
            return {
                btnList:[],
                tableKey:[{prop:'name',label:'创建时间',tooltip:true},
                    {prop:'name2',label:'操作时间',tooltip:true},
                    {prop:'name3',label:'错误描述',tooltip:true},
                    {slot: 'operate'}],
                tableData:Array(10).fill({name:'2019-09-04 04:32:00',name2:'2019-09-04 05:11:02',name3:'xvcvcv'}),
                pageIndex:1,
                pageSize:10,
                total:0,
                value:'',
                value1:''
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
            delInfo(){
                MessageBox.confirm('确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    successMsg("删除成功!")
                }).catch(() => {

                });
            },
            handleCurrentChange(page){

            },
            saveInfo(){

            }
        }
    }
</script>

<style lang="less" scoped>
    .synchronization-log {

    }
</style>
<style lang="less">

</style>