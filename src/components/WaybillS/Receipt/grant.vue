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
import graWhole from './grantComponent/graWhole'
import grant from './grantComponent/Grant/grant'
import graHandoverList from './grantComponent/GraHandoverList/graHandoverList'
export default {
    name:'w-r-grant',
    data() {
        return {
            currentView: "graWhole", //Tabs 标签页 基础用法
            tabMagList:[
                {title:'全部',name:'graWhole'},
                {title:'发放',name:'grant'},
                {title:'交接清单',name:'graHandoverList'},
            ]
        }
    },
    components: {    
        graWhole, 
        grant,
        graHandoverList
    }
}
</script>
