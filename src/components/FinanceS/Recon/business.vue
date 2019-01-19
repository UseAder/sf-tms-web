<template>
  <div class="MagList" >
    <div class="MagListTablist">
      <el-tabs v-model="reconBusinessCurrentView">
        <el-tab-pane :label="item.title" :name="item.name"  v-for="item in reconBusinessTabMagList" :key="item.index"></el-tab-pane>  
        
      </el-tabs>
    </div>
    <div :is="reconBusinessCurrentView" ></div>
  </div>
</template>

<script>
import businessDuiz from './BusinessComponent/businessDuiz'
import duizBatch from './BusinessComponent/duizBatch'
export default {
  name:'f-r-business',
  data() {
    return {
      reconBusinessCurrentView: "businessDuiz", 
      reconBusinessTabMagList:[
          {title:'回扣对账',name:'businessDuiz'},
          {title:'对账批次',name:'duizBatch'},
      ]
    }
  },
  components: {    
      businessDuiz, 
      duizBatch
  }
}
</script>