<template>
    <div id="mapPoint" class="echarts-resize-box" v-on-echart-resize>
    </div>
</template>

<script>
import { national,provinces,cityMap } from '@/assets/js/echarts/citymap.js'
import axios from 'axios'
let echarts = require('echarts')
export default {
    name:'ModeMap',
    components:{
        
    },
    data(){
        return {
            chart:{},
            option:{},
            //地图数据
            visualMapData:[],
        }
    },
    mounted() {
        // 渲染地图
        this.chart = echarts.init(document.getElementById("mapPoint"));
        this.showNationalMap({name:'中国'})
    },
    destroyed() {
    },
    methods: {
        /**
         * 调取全国地图
         */
        showNationalMap(params) {
            //如果点击的是34个省、市、自治区，绘制选中地区的二级地图
            axios.get("/map/" + national[params.name] + ".json").then(response => {
                this.renderMapData(params, response.data);
            });
        },
        /**
         * 调取省地图
         */
        showProvincesMap(params) {
            //如果点击的是34个省、市、自治区，绘制选中地区的二级地图
            axios.get("/map/province/" + provinces[params.name] + ".json").then(response => {
                this.renderMapData(params, response.data);
            });
        },
        /**
         * 调取市地图
         */
        showCityMap(params) {
            //显示县级地图
            axios.get("/map/city/" + cityMap[params.name] + ".json").then(response => {
                 this.renderMapData(params, response.data);
            });
        },
        /**
         * 绘图数据
         */
        renderMapData(params, data) {
            echarts.registerMap(params.name, data);
            this.mapOption(params.name,data);
        },
        /**
         * 
         * 地图 option
         */
        mapOption(mapName,resData){
            this.visualMapData = [];
            // 图形构建
            this.option = {
                series: [
                    {
                        type: 'map',
                        map: mapName,
                        roam: true,
                        selectedMode: 'single',
                        scaleLimit: { min: 0.5, max: 8 }, //缩放
                        zoom:1,
                        //图形上的文本标签，可用于说明图形的一些数据信息
                        label: {
                            // normal: {
                            //     show: true,
                            //     formatter:(params)=>{
                            //         if(params.color=='rgba(0,0,0,0)'){
                            //             return '';
                            //         }
                            //         return params.name;
                            //     },
                            //     textStyle: {
                            //         color: 'rgba(254,254,254,0.8)'
                            //     }
                            // },
                            // emphasis: {
                            //     show: false,
                            //     textStyle: {
                            //         color: 'rgba(254,254,254,0.8)'
                            //     }
                            // }
                        },
                        //地图区域的多边形 图形样式，有 normal 和 emphasis 两个状态。normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                        // itemStyle: {
                        //     normal: {
                        //         areaColor: 'rgba(0,0,0,0)',
                        //         borderColor: '#396FCE',
                        //         borderWidth:1,
                        //         shadowColor: '#396FCE',
                        //         shadowOffsetY:-1,
                        //         shadowBlur: 1
                        //     },
                        //     emphasis: {
                        //         areaColor: '#2B91B7'
                        //     }
                        // },
                        animation: false,
                        data: this.visualMapData
                    },
                    
                ]
            };
            this.chart.setOption(this.option,true,false,false);

        },
    }
}
</script>

<style scoped lang="less">
    #mapPoint{
        width:100%;
        height: 100%;
        z-index: 5;
    }
</style>
