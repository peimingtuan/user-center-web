<template>
    <div class="foot-box">
        <div class="sure" @click="sure">
            <img src="../../assets/imgs/alert/sure.png" />{{sureText}}
        </div>

        <div class="cancel" @click="cancel">
            <img src="../../assets/imgs/alert/cancel.png" />取消
        </div>
    </div>
</template>

<script>
    export default {
        name: "footBox",
        inject:{
            sureText:{
                type:String,
                default:'确定'
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
            cancel(){
                this.$emit('cancel')
            },
            sure(){
                this.$emit('sure')
            }
        },
    }
</script>

<style lang="less" scoped>
    @import url("../../assets/css/common.less");
    .foot-box {
        margin:20px 0;
        &>div{
            .f20();
            line-height:30px;
            cursor:pointer;
        }
        img{
            width:20px;
            margin-right:5px;
        }
        .fc();
        .sure{
            color: #45A1D1;
            margin-right:50px;
        }
    }
</style>