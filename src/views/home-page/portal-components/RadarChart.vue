<template>
    <div id="radarChart" ref="radarChart" class="echarts-resize-box" v-on-echart-resize></div>
</template>

<script>
    import Chart from "@/assets/js/echarts/chart"
    //import {radarOption} from "@/assets/js/echarts/options"
    import {getModuleBody} from "@/api/home-page-api"
    export default {
        //雷达图
        name: "RadarChart",
        props:['portletId'],
        data() {
            return {

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
                Chart.init({el:this.$refs.radarChart,option:res.body.body})
                this.loading=false
            }
        }
    }
</script>

<style lang="less" scoped>
    #radarChart {
        width:100%;
        height:100%;
    }
</style>
<style lang="less">

</style>