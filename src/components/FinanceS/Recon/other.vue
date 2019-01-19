<template>
  <div class="MagList" >
    <div class="MagListTablist">
      <el-tabs v-model="reconDispatchCurrentView">
        <el-tab-pane :label="item.title" :name="item.name"  v-for="item in reconDispatchTabMagList" :key="item.index"></el-tab-pane>  
      </el-tabs>
    </div>
    <div :is="reconDispatchCurrentView" ></div>
  </div>
</template>

<script>
import otherDuiz from './Other/otherDuiz'
import duizBatch from './Other/duizBatch'
export default {
  name:'f-r-dispatch',
  data() {
    return {
      reconDispatchCurrentView: "otherDuiz", //Tabs 标签页 基础用法
      reconDispatchTabMagList:[
          {title:'其他待对账异费',name:'otherDuiz'},
          {title:'对账批次',name:'duizBatch'},
      ]
    }
  },
  components: {    
      otherDuiz, 
      duizBatch
  }
}
</script>

<style>

</style>
