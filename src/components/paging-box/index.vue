<template>
    <div class="paging-box">
        <el-pagination
                class="sel-element-page"
                background
                @current-change="handleCurrentChange"
                :current-page='pageIndex'
                :page-size='pageSize'
                layout="total, prev, pager, next, jumper"
                :total='total'>
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "pagingBox",
        props:['pageIndex','pageSize','total'],
        data() {
            return {}
        },
        created() {
        },
        mounted() {
        },
        methods: {
            handleCurrentChange(page){
                this.$emit('handleCurrentChange',page)
            }
        },
    }
</script>

<style lang="less" scoped>
    .paging-box {
        /*分页*/
        .sel-element-page{
            margin-top:10px;
            margin-bottom:10px;
            text-align: center;
            width: 100%;
        }
    }
</style>
<style lang="less">

</style>