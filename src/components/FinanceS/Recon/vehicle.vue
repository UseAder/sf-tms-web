<template>
  <div class="MagList" >
    <div class="MagListTablist">
      <el-tabs v-model="reconVehicleCurrentView">
        <el-tab-pane :label="item.title" :name="item.name"  v-for="item in reconVehicleTabMagList" :key="item.index"></el-tab-pane>  
      </el-tabs>
    </div>
    <div :is="reconVehicleCurrentView" ></div>
  </div>
</template>

<script>
import vehicleDuiz from './VehicleComponent/vehicleDuiz'
import duizBatch from './VehicleComponent/duizBatch'
export default {
  name:'f-r-vehicle',
  data() {
    return {
      reconVehicleCurrentView: "vehicleDuiz", //Tabs 标签页 基础用法
      reconVehicleTabMagList:[
          {title:'整车对账',name:'vehicleDuiz'},
          {title:'对账批次',name:'duizBatch'},
      ]
    }
  },
  components: {    
      vehicleDuiz, 
      duizBatch
  } 
}
</script>

<style>

</style>
