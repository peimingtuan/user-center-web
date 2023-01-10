<template>
    <div id="barChartY"
         ref="barChartY"
         class="echarts-resize-box"
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         v-on-echart-resize>
    </div>
</template>

<script>
    import Chart from "@/assets/js/echarts/chart"
    //import {barOptionY} from "@/assets/js/echarts/options"
    import {getModuleBody} from "@/api/home-page-api"
    export default {
        name: "BarChart",
        //柱状图-Y
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
                Chart.init({el:this.$refs.barChartY,option:res.body.body})
                this.loading=false
            }
        }
    }
</script>

<style lang="less" scoped>
    #barChart {
        width:100%;
        height:100%;
    }
</style>
<style lang="less">

</style>