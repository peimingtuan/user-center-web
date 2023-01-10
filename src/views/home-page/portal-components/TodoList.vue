<template>
    <div class="todo-list">
        <table-box
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :selection="false"
                :tableKey="tableKey"
                :tableData="tableData"
        >
        </table-box>
    </div>
</template>

<script>
    import {getModuleBody} from "@/api/home-page-api"
    export default {
        name: "TodoList",
        props:['portletId'],
        components:{
            tableBox:()=>import('@/components/table-box'),
        },
        data() {
            return {
                loading:false,
                tableKey:[],
                tableData:[],
            }
        },
        created() {
        },
        mounted() {
            this.getTableData()
        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            async getTableData(){
                this.loading=true
                let res=await getModuleBody(this.portletId)
                this.loading=false
                res.body.body.columns.map(item=>{
                    this.tableKey.push({prop:item.name,label:item.value,tooltip:true})
                })
                this.tableData=res.body.body.data;
            }
        }
    }
</script>

<style lang="less" scoped>
    .todo-list {
        padding:20px;
        height:100%;
        &>div{
            height:100%;
        }
    }
</style>
<style lang="less">

</style>