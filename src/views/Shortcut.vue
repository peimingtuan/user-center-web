<template>
    <div class="shortcut">
        <div class="empty" v-if="emptyShow&&list.length===0">暂无数据</div>
        <div class="shortcut-module" v-for="(item,index) in list" :key="index" @click="openPage(item.accessUrl)">
            <div><img :src="item.id" /></div>
            <div>{{item.appName}}</div>
        </div>
    </div>
</template>

<script>
    import {getUserSelect,getImg} from "@/api/shortcut-api"
    import getApiUrl from "@/assets/js/getApiUrl"
    export default {
        name: "Shortcut",
        data() {
            return {
                emptyShow:false,
                list:[]
            }
        },
        computed:{
          userId(){
              return this.$store.state.userId
          }
        },
        created() {
            this.getData()
        },
        mounted() {
        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            async getData() {
                let that=this;
                let res = await getUserSelect(this.userId)
                if (res.body instanceof Array && res.body.length > 0) {
                    let arr = res.body;
                    arr.sort(function (a, b) {
                        return (a.sortOrder - b.sortOrder)
                    })
                    this.emptyShow = arr.length > 0 ? false : true
                    this.list = arr;
                    this.list.map((item,index) => {
                       that.getPicture(item.id,index)
                    })
                }
            },
            async getPicture(id,index){
                let res=await getImg(id)
                if (res.byteLength > 0) {
                    this.list[index].id = 'data:image/png;base64,' + btoa(
                        new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                }
            },
            //打开新系统
            openPage(url){
                window.open(url)
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/css/common.less";
    .shortcut {
        padding:10px;
        .fl();
        flex-wrap: wrap;
        .empty{
            color:#2F8DED;
            font-size:20px
        }
        &-module{
            width:100px;
            text-align: center;
            margin-bottom:10px;
            &>div:first-of-type{
                margin:5px auto;
                width:60px;
                height:60px;
                border-radius: 50%;
                overflow: hidden;
                img{
                    width:100%;
                    height:100%;
                }
            }
        }
    }
</style>
<style lang="less">

</style>