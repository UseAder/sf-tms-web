<template>
  <div class="MagList" >
    <div class="MagListTablist">
      <el-tabs v-model="currentView">
        <el-tab-pane :label="item.title" :name="item.name"  v-for="item in tabMagList" :key="item.index"></el-tab-pane>  
        
      </el-tabs>
    </div>
    <div :is="currentView" ></div>
  </div>
</template>

<script>
import recWhole from './RecoveryComponent/recWhole'
import recovery from './RecoveryComponent/Recovery/recovery'
import recHandoverList from './RecoveryComponent/RecHandoverList/recHandoverList'
export default {
    name:'w-r-recovery',
    data() {
        return {
            currentView: "recWhole", //Tabs 标签页 基础用法
            tabMagList:[
                {title:'全部',name:'recWhole'},
                {title:'回收',name:'recovery'},
                {title:'交接清单',name:'recHandoverList'},
            ]
        }
    },
    components: {    
        recWhole, 
        recovery,
        recHandoverList
    }
}
</script>

<style>

</style>
