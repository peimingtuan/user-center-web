let echarts=require('echarts')
class Chart {
    constructor(){
        this.chart = null
    }
    init(options){
        this.chart = echarts.init(options.el)
        this.chart.setOption(options.option, true, false, false)
        return this.chart
    }
    on(event,params){
        this.chart.on(event, params)
    }
    clear(){
        this.chart.clear();
    }
    off(){
        this.chart.off(event)
    }
}
export default new Chart()