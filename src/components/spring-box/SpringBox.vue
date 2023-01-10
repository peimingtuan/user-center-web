<template>
    <transition name="slide-fade">
        <div class="spring-box alert-window" v-show="alertShow">
            <div class="main-box">
                <head-top
                        :main-text="mainText"
                        :img-logo="imgLogo"
                        :text-info="textInfo"
                        @closePage="closeAlert"
                />
                <slot></slot>
                <foot-box
                        @cancel="closeAlert"
                        @sure="sure"
                />
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "springBox",
        props:['alertShow','imgLogo','mainText','textInfo'],
        components:{
            headTop:()=>import("./HeadTop"),
            footBox:()=>import("./FootBox")
        },
        data() {
            return {

            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            closeAlert(){
                this.$emit('update:alertShow',false)
            },
            sure(){
                this.$emit('sure')
            }
        },
    }
</script>

<style lang="less" scoped>
    .spring-box {
        .main-box{
            width:70vw;
            min-width:500px;
            background:#fff;
            border-radius:5px;
            box-shadow: 0 0 5px rgba(38,78,119,.2);
        }
    }
</style>
<style lang="less">

</style>