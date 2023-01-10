<template>
    <div class="head-box">
        <div v-for="(item,index) in btnList" :key="index" @click="pointTrag(item.event)">
            <img v-if="item.png" :style="{width:item.width?item.width:''}" :src="item.png"/>
            <el-button v-else type="primary" :icon="item.icon">{{item.name}}</el-button>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "headBox",
        props:{
            btnList:{
                type:Array
            }
        },
        data() {
            return {}
        },
        created() {
        },
        mounted() {
        },
        methods: {
            pointTrag(n){
                this.$emit(n)
            }
        },
    }
</script>

<style lang="less" scoped>
    .head-box {
        display:flex;
        justify-content: flex-start;
        /*margin-bottom:10px;*/
        &>div{
            cursor:pointer;
            margin-right:10px;
            img{

            }
        }
    }
</style>
<style lang="less">
    .head-box{
        .el-button {
            line-height:35px;
            padding:0 20px;
            /*background:#edf5ff;*/
            /*border:1px solid #bedeff;*/
            i{
                /*font-size:16px;*/
                /*color:#409eff;*/
                color:#fff;
            }
            span {
                /*font-size:16px;*/
                /*color:#409eff;*/
            }
        }
        .el-input{
            margin-left:5px;
            width:300px;
            line-height:35px;
            i{
                color:#C0C4CC;
            }
        }
    }
</style>