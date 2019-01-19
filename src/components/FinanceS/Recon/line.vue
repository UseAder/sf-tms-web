<template>
  <div class="MagList" >
    <div class="MagListTablist">
      <el-tabs v-model="reconLineCurrentView">
        <el-tab-pane :label="item.title" :name="item.name"  v-for="item in reconLineTabMagList" :key="item.index"></el-tab-pane> 
      </el-tabs>
    </div>
    <div :is="reconLineCurrentView" ></div>
  </div>
</template>

<script>
import customerDuiz from './LineComponent/lineDuiz'
import duizBatch from './LineComponent/duizBatch'
export default {
  name:'f-r-line',
  data() {
    return {
      reconLineCurrentView: "customerDuiz", //Tabs 标签页 基础用法
      reconLineTabMagList:[
          {title:'专线对账',name:'customerDuiz'},
          {title:'对账批次',name:'duizBatch'},
      ]
    }
  },
  components: {    
      customerDuiz, 
      duizBatch
  } 
}
</script>

<style>

</style>
