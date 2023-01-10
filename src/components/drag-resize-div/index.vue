<template>
    <div class="drag-resize-div">
        <draggable
                class="list-complete-drap"
                v-bind="dragOptions"
                :list="list"
                @start="start"
                @end="end">
            <div v-for="(element, index) in list"
                 :key="element.id"
                 v-if="element.isDisplay===1"
                 class="list-complete-item drap-item"
                 :style="'width:'+(element.width>98?98:element.width)+'%;height:'+element.heigh+'px'"
                 :class="'left'+element.id">
                <div class="resize resize-w" :setid="element.userPortletId"></div>
                <div class="resize resize-h" :setid="element.userPortletId"></div>
                <div class="drag-handle">
                    <div class="drag-handle-left">{{element.name}}({{element.appName}})</div>
                    <div class="drag-handle-right">
                        <el-popover
                                placement="bottom"
                                width="60"
                                v-model="element.flag"
                                trigger="click">
                            <div class="handle-edit-box">
                                <!--<div @click="editDrapitem(element)"><i class="el-icon-edit-outline"></i>编辑</div>-->
                                <div @click="remove(element,index)"><i class="el-icon-remove-outline"></i>移除</div>
                            </div>
                            <i class="el-icon-more" slot="reference"></i>
                        </el-popover>
                    </div>
                </div>
                <div class="component-box" v-if="element.type===1">
                    <module-url :url="element.accessUrl" />
                </div>
                <div class="component-box" v-else>
                    <component :is="element.text" :portletId="element.id"/>
                </div>
            </div>
        </draggable>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import {moduleUrl,calendar,todoList,modeMap,lineSimple,barChart,barChartY,pieChart,radarChart} from "@/views/home-page/portal-components"
    import dragControllerDiv from '@/assets/js/drag-controller-div'
    export default {
        name: "dragResizeDiv",
        components: {draggable,moduleUrl,calendar,todoList,modeMap,lineSimple,barChart,barChartY,pieChart,radarChart},
        props:{
            list:{
                type:Array,
                default:[]
            }
        },
        data() {
            return {}
        },
        computed: {
            dragOptions() {
                return {
                    group: "description",//定义组名
                    animation: 30,
                    handle: ".drag-handle",
                    disabled:false,
                    filter:'',//设置类名,排除元素禁止拖动
                    ghostClass: "",//定义影子
                    chosenClass: "chosenClass",//当选中列表单元时会给该单元增加一个class
                    forceFallback:false
                }
            }
        },
        watch:{
            list(v){
                this.$nextTick(()=>{
                    dragControllerDiv.init()
                })
            }
        },
        created() {
        },
        mounted() {

        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            editDrapitem(element){
                this.$emit('editDrapitem',element)
            },
            remove(element,index){
                this.$emit('remove',element,index)
            },
            start() {
                this.$emit('start')
            },
            end() {
                this.list.map((item,index)=>{
                    return item.sortOrder=index+1;
                })
                this.$emit('end',this.list)
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/common.less";
    .drag-resize-div {
        height:100%;
        .list-complete-drap {
            width: 100%;
            height: 100%;
            overflow: auto;
            div.drap-item{
                float: left;
                position:relative;
                margin:0 10px 20px;
                border: 1px solid #DEE3E7;
                /*拖拽区div样式*/
                .resize{
                    opacity:0;
                    position:absolute;
                    bottom: 0;
                    border-radius: 5px;
                    z-index: 99;
                    color: #444444;
                    background-color: rgba(26,79,133,.12);
                }
                /*拖拽区鼠标悬停样式*/
                .resize:hover {
                    opacity:.6;
                }
                .resize-w {
                    cursor: col-resize;
                    right:0;
                    width: 10px;
                    height:100%;
                    margin-right:-5px;
                }
                .resize-h{
                    cursor: row-resize;
                    left:0;
                    width:100%;
                    height: 10px;
                    margin-bottom: -5px;
                }
                .drag-handle{
                    cursor: move;
                    padding:0 10px;
                    height:50px;
                    border-bottom: 1px solid #DEE3E7;
                    .fb();
                    &-left{
                        border-left:3px solid #1890FF;
                        padding-left:5px;
                    }
                    &-right{

                    }
                }
                .component-box{
                    height:calc(100% - 50px);
                    overflow: auto;
                }
            }
        }
    }
</style>
<style lang="less">
    .drag-resize-div{
        .list-complete-drap{
            .el-icon-more{
                transform:rotate(90deg);
                cursor:pointer;
            }
        }
        .chosenClass{
            opacity: .8;
            background:#f1f1f1;
        }
    }
    .el-popover{
        min-width:80px;
        .handle-edit-box{
            cursor:pointer;
            line-height:30px;
            i{
                margin-right:3px;
            }
            &>div:hover{
                color:#1890FF;
                i{
                    color:#1890FF;
                }
            }
        }
    }
</style>