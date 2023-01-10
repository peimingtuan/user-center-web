<template>
    <div class="mainBody">
        <div class="imgStyle">
            <div class="top">
                <img class="img" :src="error_developing"/>
            </div>
            <div class="bottom">
                正在开发中，敬请期待
            </div>
        </div>
        
    </div>
</template>

<script>
    export default {
        data(){
            return{
                error_developing: "data:image/png;base64,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",
            }
        },
        mounted(){
            
        },
        methods:{
            
        }
    }
</script>

<style lang="less" scoped>
    @import url("../assets/css/errorPage.less");
</style>