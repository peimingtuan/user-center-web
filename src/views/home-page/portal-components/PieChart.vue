<template>
    <div id="pieChart"
         ref="pieChart"
         class="echarts-resize-box"
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         v-on-echart-resize>
    </div>
</template>

<script>
    import Chart from "@/assets/js/echarts/chart"
    //import {pieOption} from "@/assets/js/echarts/options"
    import {getModuleBody} from "@/api/home-page-api"
    export default {
        //饼状图
        name: "PieChart",
        props:['portletId'],
        data() {
            return {
                loading:false
            }
        },
        created() {
        },
        mounted() {
            this.getEchartsData()
        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            async getEchartsData(){
                this.loading=true
                let res=await getModuleBody(this.portletId)
                this.loading=false
                Chart.init({el:this.$refs.pieChart,option:res.body.body})
            }
        }
    }
</script>

<style lang="less" scoped>
    #pieChart {
        width:100%;
        height:100%;
    }
</style>
<style lang="less">

</style>