
<template>
    <div>
        <el-dialog  :title="'运单详情-'+waybillNo+'-'+statusText" :visible.sync="showDialog"  class="J-dialog-vh" custom-class="J-custom-dialog-d "   @close="$emit('update:showFlag', false)" center>
            <el-tabs stretch v-model="currentView" type="card"  >
                <el-tab-pane :label="item.title" :name="item.name"  v-for="item in operateList" :key="item.index"></el-tab-pane>  
                <div class="J-detail J-dialog-vh-body">
                    <!-- <div class="J-dialog-vh-submission" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding: 1px 0;" >
                        <span class="dialog-footer">
                        
                        </span> 
                    </div> -->
                    <el-row class=" J-dialog-vh-content" :style="'max-height:'+(getScreenHeight-342)+'px;'">
                        <div :is="currentView" :waybillId=waybillId ></div>
                    </el-row >
                    <!-- <div class="J-dialog-vh-submission" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)" > -->
                    <div class="J-dialog-vh-submission" > 
                        <span class="dialog-footer">
                        <el-button type="primary" ></el-button>
                        </span> 
                    </div>
                </div>
            </el-tabs>
        </el-dialog>
   </div>
</template>
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import waybillNoDetail from './WaybillNoTabs/detail.vue'
import waybillNoDispatch from './WaybillNoTabs/dispatch.vue'
import waybillNoTracklist from './WaybillNoTabs/tracklist.vue'
import waybillNoReceipt from './WaybillNoTabs/receipt.vue'
import waybillNoException from './WaybillNoTabs/exception.vue'
import waybillNoCost from './WaybillNoTabs/cost.vue'
import waybillNoChange from './WaybillNoTabs/change.vue'
export default {
    props: ['waybillId','waybillNo','showFlag','statusText'],
    mixins:[Base,List],
    data() {
        return {
            showDialog: this.showFlag,
            currentView: 'waybillNoDetail', // 默认选中第一项
            operateList:[
                {title:'运单信息',name:'waybillNoDetail'},
                {title:'调度信息',name:'waybillNoDispatch'},
                {title:'货物跟踪',name:'waybillNoTracklist'},
                {title:'异常信息',name:'waybillNoException'},
                {title:'回单信息',name:'waybillNoReceipt'},
                {title:'费用结算',name:'waybillNoCost'},
                {title:'运单调度变更',name:'waybillNoChange'}
                ], 
        }
    },
    components: {    
        waybillNoDetail, 
        waybillNoDispatch, 
        waybillNoTracklist,
        waybillNoReceipt,
        waybillNoException,
        waybillNoCost,
        waybillNoChange
    }
}
</script>
