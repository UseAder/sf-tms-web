<template>
  <div class="MagList" >
    <div class="MagListTablist">
      <el-tabs v-model="reconCustormerCurrentView">
        <el-tab-pane :label="item.title" :name="item.name"  v-for="item in reconCustormerTabMagList" :key="item.index"></el-tab-pane>  
        
      </el-tabs>
    </div>
    <div :is="reconCustormerCurrentView" ></div>
  </div>
</template>

<script>
import customerDuiz from './CustomerComponent/customerDuiz'
import duizBatch from './CustomerComponent/duizBatch'
export default {
  name:'f-r-customer',
  data() {
    return {
      reconCustormerCurrentView: "customerDuiz", //Tabs 标签页 基础用法
      reconCustormerTabMagList:[
          {title:'客户对账',name:'customerDuiz'},
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
