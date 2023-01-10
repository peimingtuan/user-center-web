/**
 * echarts 图形 响应式， 只要在应用的div后面写上 v-on-echart-resize  即可
 * eg：<div id="echartBar" v-on-echart-resize></div>
 *  */

let echarts = require('echarts')
import Vue from 'vue';

let HANDLER = "_vue_echarts_resize_handler"

function bind(el, binding) {
    unbind(el);
    el[HANDLER] = function() {
        let chart = echarts.getInstanceByDom(el);
        if (!chart) {
            return;
        }
        chart.resize();
    }
    window.addEventListener("resize", el[HANDLER])
}

function unbind(el) {
    window.removeEventListener("resize", el[HANDLER]);
    delete el[HANDLER];
}
let directive = {
    bind: bind,
    unbind: unbind
};
const onEchartResize = Vue.directive("onEchartResize", directive)
export { onEchartResize };