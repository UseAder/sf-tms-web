<template>
  <div class="MagList" >
    <div class="MagListTablist">
      <el-tabs v-model="reconShortCurrentView">
        <el-tab-pane :label="item.title" :name="item.name"  v-for="item in reconShortTabMagList" :key="item.index"></el-tab-pane>  
      </el-tabs>
    </div>
    <div :is="reconShortCurrentView" ></div>
  </div>
</template>

<script>
import shortDuiz from './ShortComponent/shortDuiz'
import duizBatch from './ShortComponent/duizBatch'
export default {
  name:'f-r-short',
  data() {
    return {
      reconShortCurrentView: "shortDuiz", //Tabs 标签页 基础用法
      reconShortTabMagList:[
          {title:'短驳对账',name:'shortDuiz'},
          {title:'对账批次',name:'duizBatch'},
      ]
    }
  },
  components: {    
      shortDuiz, 
      duizBatch
  }  
}
</script>

<style>

</style>
