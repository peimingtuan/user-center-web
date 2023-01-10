<template>
    <div class="home-page">
        <!--<edit-dialog ref="EditDialog" @saveInfo="saveInfo"/>-->
        <div class="empty" v-if="emptyShow&&list1.length===0">暂无数据</div>
        <drag-resize-div
                v-else
                ref="dragResizeDiv"
                :list="list1"
                @start="start"
                @end="end"
                @remove="remove"
        />
    </div>
</template>

<script>
    import {MessageBox} from "element-ui"
    import dragResizeDiv from "@/components/drag-resize-div"
    import * as api from "@/api/home-page-api"
    export default {
        name: "HomePage3",
        components: {
            dragResizeDiv,
            dialogShow:()=>import("@/components/dialog"),
            //editDialog:()=>import("./home-page/EditDialog"),
        },
        data() {
            return {
                emptyShow:false,
                list1:[]
            }
        },
        computed:{
          userId(){
              return this.$store.state.userId
          },
            bo(){
              return this.$store.state.updatePortal
            }
        },
        watch:{
            bo(v){
                if(v)this.getPortals()
            }
        },
        created() {
            this.getPortals()
        },
        mounted() {

        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            async getPortals(){
                let {userId}=this
                let res=await api.getPortals({userId})
                this.emptyShow=res.body&&res.body.length>0?false:true
                if(res.body&&res.body.length>0){
                    this.list1=[]
                    //1连接2表格3折线图4柱状图-纵向5柱状图-横向6饼状图7极区图8雷达图9其他
                    let array=[];
                    let arr=res.body.map(item=>{
                        if(item.isDisplay==2)array.push(2)
                        let text=null;
                        switch(item.type){
                            case 1:
                                text='moduleUrl';
                                break;
                            case 2:
                                text='todoList';
                                break;
                            case 3:
                                text='lineSimple';
                                break;
                            case 4:
                                text='barChart';
                                break;
                            case 5:
                                text='barChartY';
                                break;
                            case 6:
                                text='pieChart';
                                break;
                            case 8:
                                text='radarChart';
                                break;
                        }
                        item.text=text
                        return item
                    })
                    arr.sort(function (a, b) {
                        return (a.sortOrder - b.sortOrder)
                    })
                    if(array.length===arr.length)this.emptyShow=true
                    else this.emptyShow=false
                    this.list1=arr
                    this.$store.commit('setPortalList',arr)
                    this.$store.commit('setUpdatePortal',false)
                }else{
                    this.emptyShow=true
                }
            },
            start() {
                console.log('开始拖动')
            },
            async end(list) {
                let arr=list.map((item,index)=>{
                    return {
                        id:item.userPortletId,
                        userId:this.userId,
                        name:item.name,
                        width:item.width,
                        heigh:item.heigh,
                        sortOrder:index+1,
                        valid:item.valid,
                        isDisplay:item.isDisplay
                    }
                })
                await api.editPortal(arr)
                this.getPortals()
            },
            // editDrapitem(item){
            //     item.visible=false;
            //     this.$refs.EditDialog.show(item)
            // },
            remove(element,index){
                MessageBox.confirm(`是否移除区块【${element.name}】?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let arr=this.list1.map((item,i)=>{
                        return {
                            id:item.userPortletId,
                            userId:this.userId,
                            name:item.name,
                            width:item.width,
                            heigh:item.heigh,
                            sortOrder:item.sortOrder,
                            valid:item.valid,
                            isDisplay:element.userPortletId===item.userPortletId?2:item.isDisplay
                        }
                    })
                    await api.editPortal(arr)
                    this.$msgS("移除成功!")
                    this.getPortals()
                }).catch(() => {

                });
            },
            saveInfo(){

            }
        }
    }
</script>

<style lang="less" scoped>
    .home-page{
        height:calc(100vh - 60px);
        .empty{
            height:100%;
            padding:10px;
            color:#2F8DED;
            font-size:20px
        }
    }
</style>