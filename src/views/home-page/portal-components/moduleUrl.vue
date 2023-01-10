<template>
    <div class="moduleUrl">
        <iframe width="100%" height="100%" style="border:none" :src=url></iframe>
    </div>
</template>

<script>
    export default {
        name: "moduleUrl",
        props:['url'],
        data() {
            return {}
        },
        created() {
        },
        mounted() {

        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {}
    }
</script>

<style lang="less" scoped>
    .moduleUrl {
        width:100%;
        height:100%;
    }
</style>
<style lang="less">

</style>