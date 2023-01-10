<template>
  <div class="public-tree-box" @mousewheel="mousewheel($event)">
    <el-input
            class="filter-box"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
    </el-input>
    <el-tree
      ref="tree"
      :node-key="nodeKey"
      :highlight-current="true"
      accordion
      :check-strictly="checkStrictly"
      :check-on-click-node="checkOnClickNode"
      :show-checkbox="showCheckbox"
      :data="treeData"
      :props="defaultProps"
      :expand-on-click-node="false"
      :default-expanded-keys="defaultExpandedKeys"
      :current-node-key="currentNodeKey"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick">
    </el-tree>
  </div>
</template>
<script>
  export default{
    name:'ScrollTreeBox',
    props:{
      treeData:{},//array
      nodeKey:'',//string
      defaultProps:{},
      defaultExpandedKeys:{},//默认展开的节点的 key 的数组
      currentNodeKey:{},//当前选中的节点string or number
      showCheckbox:{
        type:Boolean,
        default:false
      },
      checkOnClickNode:{
        type:Boolean,
        default:false
      },
      checkStrictly:{
        type:Boolean,
        default:false
      },
      filterKey:''//过滤key值
    },
    data(){
      return{
        scrollLeft:0,
        filterText:''
      }
    },
    watch:{
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    // 模板编译/挂载之后调用
    mounted() {
      this.$refs.tree.filter('');
    },
    methods:{
      mousewheel(e){
        let dom = document.getElementsByClassName('public-tree-box')[0];
        if(e.deltaY > 0){
          dom.scrollLeft = dom.scrollLeft + 10;
        }else{
          dom.scrollLeft = dom.scrollLeft - 10;
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        if(this.filterKey)return data[this.filterKey].indexOf(value) !== -1;
        else return data.unitName.indexOf(value) !== -1;
      },
      handleNodeClick(val,node){
        this.$emit("treeClick",val,node)
      }
    }
  }
</script>
<style lang="less" scoped>
  .filter-box{
    margin:5px;
  }
</style>
