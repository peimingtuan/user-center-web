<template>
  <div class="portal-manage">
    <div class="public-tree-box">
      <div v-for="(item,index) in titleList" class="item-box" :class="activeModel===item.id?'active':''" :key="index" @click="choiceModule(item.id)">
        <router-link :to="item.url" tag="div"><i icon="el-icon-s-tools"/>
        <i class="el-icon-s-tools"></i> {{item.name}}
        </router-link>
      </div>
    </div>
    <!-- 右部 -->
    <div class="public-tree-right-content">
      <transition name="slide2-fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PortalManage",
    data() {
      return {
        titleList:[
          {id:0,url:'/indexMain/SystemManagement/PortalManage/PortalSubgroup',name:'portal组件管理'},
          {id:2,url:'/indexMain/SystemManagement/PortalManage/FastWay',name:'应用快捷方式配置'}
        ],
        activeModel:0,
      }
    },
    methods: {
      choiceModule(id){
        this.activeModel = id;
      },
    }
  }
</script>

<style lang="less" scoped>
  .portal-manage {
    .item-box{
      padding:0 10px;
      line-height:40px;
      cursor:pointer;
    }
    .active{
      div{
        color: #5598FF;
      }
    }
  }
</style>
<style lang="less">

</style>