<template>
    <div class="system-management">
        <!-- 左侧带单 -->
        <div class="left-nav-box">
            <el-menu
                    :default-active="defaultActive"
                    :unique-opened="true"
                    :router="true"
                    @select="selectmenu"
                    class="sel-element-nav">
                <div v-for="(item,index) in leftMenuList">
                    <el-submenu v-if="item.children && item.children.length !== 0" :key="index" :index="item.moduelId">
                        <template slot="title">
                            <img class="nav-img" v-if="defaultActive.split('-')[0]==item.moduelId" :src="item.selectedImgUrl" />
                            <img class="nav-img" v-else :src="item.imgUrl" />
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item
                                    v-for="(childItem,childIndex) in item.children"
                                    :index="childItem.moduelId"
                                    :key="childIndex"
                                    :route="childItem.url">
                                {{childItem.name}}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item v-else :index="item.moduelId" :key="item.moduelId" :route="item.url">
                        <img class="nav-img" v-if="defaultActive==item.moduelId" :src="item.selectedImgUrl" />
                        <img class="nav-img" v-else :src="item.imgUrl" />
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>
                </div>
            </el-menu>
        </div>
        <!-- 右侧组件区 -->
        <router-view class="system-manage-router-view"></router-view>
    </div>
</template>

<script>
    import {systemLeftMenu} from "@/api/common-api"
    import {mapState,mapMutations} from "vuex"
    export default {
        name: "SystemManagement",
        data() {
            return {

            }
        },
        watch:{

        },
        computed:{
          ...mapState('systemmanagement',[
              "defaultActive"
          ]),
            leftMenuList(){
              return this.$store.state.systemLeftMenuList
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
            ...mapMutations("systemmanagement",["setDefaultActive"]),
            //当前活跃项
            selectmenu(key, keyPath){
                this.setDefaultActive(key);
            },
        }
    }
</script>

<style lang="less" scoped>
    .system-management {
        height:calc(100vh - 60px);
        .left-nav-box{
            float: left;
            width: 200px;
            height: 100%;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
            padding-top: 10px;
            overflow: auto;
            background:#f0f2f5;
        }
        .system-manage-router-view{
            float: left;
            width: calc(100% - 200px);
            height: 100%;
            overflow: auto;
        }
    }
</style>
<style lang="less">

</style>