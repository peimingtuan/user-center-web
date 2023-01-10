<template>
    <div class="compose-subgroup">
        <dialog-show
                ref="dialogShow"
                @saveInfo="saveInfo">
            <dialog-compose-body ref="DialogComposeBody" slot="main-body" />
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
    import {successMsg,warningMsg} from "@/ui"
    import * as api from "@/api/show-api"
    export default {
        name: "PortalSubgroup",
        components: {
            headBox:()=>import("@/components/head-box"),
            tableBox:()=>import('@/components/table-box'),
            pagingBox:()=>import('@/components/paging-box'),
            dialogShow:()=>import("@/components/dialog"),
            DialogComposeBody:()=>import("./dialog/DialogComposeBody"),
        },
        data() {
            return {
                btnList:[{name:'添加',event:'add',icon:'el-icon-plus'}],
                tableKey:[{prop:'name',label:'名称',tooltip:true},
                    {prop:'name2',label:'描述',tooltip:true},
                    {slot: 'operate'}],
                tableData:Array(10).fill({name:'慧审待办事项',name2:'dsfsdf'}),
                pageIndex:1,
                pageSize:10,
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
            add(){
                this.$refs.dialogShow.dialogFormVisible=true
                this.$nextTick(()=>{
                    this.$refs.DialogComposeBody.show()
                })
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
    .compose-subgroup {
        height:100%;
    }
</style>
<style lang="less">

</style>