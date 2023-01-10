<template>
    <div class="head-top">
        <img class="img-logo" :src='imgLogo' />
        <div>
            {{mainText}}<br/>
            <span>{{textInfo}}</span>
        </div>
        <img class="alert-close" @click="closePage" src="../../assets/imgs/alert/alert-close.png"/>
    </div>
</template>

<script>
    export default {
        name: "headTop",
        props:{
            imgLogo:{
                type:String,
                default:require("../../assets/imgs/avataradd.png")
            },
            mainText:{
                type:String,
                default:'请填写详细信息'
            },
            textInfo:{
                type:String,
                default:'请填写详细信息'
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
            closePage(){
                this.$emit('closePage')
            }
        },
        updated() {
        },
        beforeDestroy() {
        }
    }
</script>

<style lang="less" scoped>
    @import url("../../assets/css/common.less");
    .head-top {
        position:relative;
        img.img-logo{
            position:absolute;
            top:20px;
            left:20px;
            width:40px;
        }
        /*关闭弹框*/
        img.alert-close{
            position:absolute;
            width:18px;
            top:25px;
            right:35px;
            cursor: pointer;
            z-index:102;
        }
        &>div{
            height:60px;
            margin-bottom:15px;
            padding:15px 80px;
            .f20();
            span{
                color: rgba(0,0,0,.54);
            }
        }
    }
</style>
<style lang="less">

</style>