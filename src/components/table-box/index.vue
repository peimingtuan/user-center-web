<template>
    <div class="table-box">
        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                border
                height="100%"
                :max-height="maxHeight"
                @selection-change="handleSelectionChange">
            <el-table-column v-if="selection" type="selection"></el-table-column>
            <!--<el-table-column type="index" label="序号" width="80" :index="indexMethod"></el-table-column>-->
            <template v-for="(item,index) in tableKey">
                <slot v-if="item.slot" :name="item.slot"></slot>
                <el-table-column v-else
                        :key="index"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width?item.width:''"
                        :show-overflow-tooltip="item.tooltip?item.tooltip:false"
                >
                </el-table-column>
            </template>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "tableBox",
        props:{
            pageIndex:{
                type: Number,
                default: 1
            },
            tableData:{
                type:Array,
                default:[]
            },
            tableKey:{
                type:Array,
                default:[{prop:''}],
                required:true
            },
            selection:{
              type:Boolean,
              default:true
            },
            maxHeight:{
                type:[String,Number]
            }
        },
        data() {
            return {}
        },
        created() {
        },
        mounted() {
        },
        methods: {
            handleSelectionChange(v){
                this.$emit('handleSelectionChange',v)
            },
            indexMethod(index){
                return (this.pageIndex-1) * 10+index+1;//当前条数
            },
        },
    }
</script>

<style lang="less">
    .table-box {
        cursor:pointer;
        th,td{
            text-align:center;
            padding:16px 0;
        }
        th{
            background:#f3f7fa;
            div{
                color: #303133;
                /*font-weight:600;*/
            }
        }
        td{
            div{
                span{

                }
            }
            div.isedit span{
                color:#409EFF;
                margin-right:10px;
            }
        }
        /*暂无数据*/
        .el-table__empty-text{
            /*font-size:16px;*/
        }
    }
</style>
<style lang="less">

</style>