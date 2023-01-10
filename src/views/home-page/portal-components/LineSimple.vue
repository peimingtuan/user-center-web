<template>
    <div id="lineSimple" ref="lineSimple" class="echarts-resize-box" v-on-echart-resize></div>
</template>

<script>
    import Chart from "@/assets/js/echarts/chart"
    //import {lineOption} from "@/assets/js/echarts/options"
    import {getModuleBody} from "@/api/home-page-api"
    export default {
        //折线图
        name: "LineSimple",
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
                Chart.init({el:this.$refs.lineSimple,option:res.body.body})
                this.loading=false
            }
        }
    }
</script>

<style lang="less" scoped>
    #lineSimple {
        width:100%;
        height:100%;
    }
</style>
<style lang="less">

</style>