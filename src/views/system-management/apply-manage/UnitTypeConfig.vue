<template>
    <div class="unit-type-config">
        <dialog-show
                ref="dialogShow"
                @saveInfo="saveInfo">
            <dialog-inner-body ref="dialogInnerBody" slot="main-body" />
        </dialog-show>
        <head-box
                class="public-header-option"
                @add="add"
                :btnList="btnList"
        >
        </head-box>
        <table-box
                class="public-table-box-scroll"
                :selection="false"
                :tableKey="tableKey"
                :tableData="tableData"
        >
            <el-table-column slot="enableAes" label="是否使用">
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
</template>

<script>
    import {MessageBox} from "element-ui"
    import {successMsg,warningMsg} from "../../../ui"
    import {treeList} from "@/assets/js/tree-data.js"
    import * as api from "../../../api/show-api"
    export default {
        name: "UnitTypeConfig",
        components: {
            headBox:()=>import("@/components/head-box"),
            tableBox:()=>import('@/components/table-box'),
            pagingBox:()=>import('@/components/paging-box'),
            dialogShow:()=>import("../../../components/dialog"),
            dialogInnerBody:()=>import("../DialogInnerBody"),
        },
        data() {
            return {
                btnList:[{name:'添加',event:'add',icon:'el-icon-plus'}],
                tableKey:[{prop:'name',label:'单位类型',tooltip:true},
                    {slot: 'enableAes'},
                    {prop:'name2',label:'说明',tooltip:true},
                    {slot: 'operate'}],
                tableData:Array(10).fill({name:'法院',name2:'xvcvcv'}),
                pageIndex:1,
                pageSize:12,
                total:0,
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
            treeClick(val){
                this.unitCode = val.unitCode;
                this.pageIndex = 1;
            },
            add(){
                this.$refs.dialogShow.dialogFormVisible=true
                this.$nextTick(()=>{
                    this.$refs.dialogInnerBody.show()
                })
            },
            async search(){
                let res=await api.generateAesKey({})
            },
            edit(){
                this.$refs.dialogShow.dialogFormVisible=true
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
    .unit-type-config {

    }
</style>
<style lang="less">

</style>