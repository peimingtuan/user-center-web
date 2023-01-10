import Mock from 'mockjs'
let arr=[
    {appName:"calendar",name:'日程提醒',visible: false},
    {appName:"modeMap",name:'地图',visible: false,},
    {appName:"todoList",name:'表格数据',visible: false},
    {appName:"lineSimple",name:'折线图',visible: false},
    {appName:"barChart",name:'柱状图',visible: false},
    {appName:"pieChart",name:'饼状图',visible: false},
    {appName:"radarChart",name:'雷达图',visible: false}
]
const users=Mock.mock('/api/v1/portals/user','post',(options)=>{
        const { newsList } = Mock.mock({
            'newsList|7': [
                {
                    appId: '@increment(1)',
                    'width|30-90':10,
                    'height|200-400':10
                }
            ]
        })
        arr.map((item,index)=>{
            let param={
                appId:newsList[index].appId,
                sortOrder:newsList[index].appId,
                width:newsList[index].width+'%',
                height:newsList[index].height+'px',
            }
            return Object.assign(item,param)
        })
        return{
            code: 200,
            message: '成功',
            body: arr,
        }
    })
export{
    users
}

