<template>
    <div class="J-detail"> 
        <el-row>
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                发货跟踪
            </div>
            <el-table
              :data="sendGoodsTrack"
              border 
              style="width: 100%">
              <el-table-column
                prop="createTime"
                label="操作时间"
                width="180"  align='center' header-align="center">
              </el-table-column>
              
              <el-table-column
                prop="employeeName"
                label="操作人"
                width="180" align='center' header-align="center">
              </el-table-column>
              <el-table-column prop="waybillStatus" label="运单状态" width="180"  align='center' header-align="center">
                 <template slot-scope="scope">
                  <div v-html="statusBackground(waybillStatus(scope.row.waybillStatus))" class="J-statusBackground"></div>     
                </template>
              </el-table-column>

                  <el-table-column prop="visibleFlag" label="客户可见" :formatter="formatTracklistvisibleFlag" width="180"  align='center' header-align="center"></el-table-column>
              <el-table-column
                prop="content"
                label="跟踪内容" align='center' header-align="center">
              </el-table-column>
            </el-table>    
        </el-row> 
        <el-row>
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                退货跟踪
            </div>
            <el-table
              :data="backGoodsTrack"
              border 
              style="width: 100%">
              <el-table-column
                prop="createTime"
                label="操作时间"
                width="180"  align='center' header-align="center">
              </el-table-column>
              
              <el-table-column
                prop="createEmployeeName"
                label="操作人"
                width="180" align='center' header-align="center">
              </el-table-column>
              <el-table-column prop="status" label="运单状态" width="180"  align='center' header-align="center">
                <template slot-scope="scope">
                  <div v-html="statusBackground(backGoodsStatus(scope.row.status))" class="J-statusBackground"></div>     
                </template>
              </el-table-column>
              <el-table-column
                prop="content"
                label="跟踪内容" align='content' header-align="content">
              </el-table-column>
            </el-table>    
        </el-row>
    </div>
</template>
<script>
import Base from "@/utils/base.js";
import api from '@/utils/api.js' 
export default {
  props: ["waybillId"],
  mixins: [Base],
  data() {
    return {
      sendGoodsTrack: [],
      backGoodsTrack: []
    };
  },
    created() {
      api.get('/waybill/track/list?waybillId=' + this.waybillId).then(data=>{
                if (data.code === '200') {
                     this.sendGoodsTrack = data.data.waybillBackGoodsItemOut;
                } 
            })

      api.get('/goods/track/back/goods/item/list?waybillId=' + this.waybillId).then(data=>{
                if (data.code === '200') {
                   this.backGoodsTrack = data.data.waybillBackGoodsItemOut;
                } 
            })
      
  },
  methods:{
    formatTracklistvisibleFlag:function(row, column) {
      return  row.visibleFlag == 0 ? "不可见":"可见"
    }
  }
};
</script>
<style>
.J-height-auto {
  height: auto !important;
}
.J-flex-center {
}
.MagList-labal .labal {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.MagList-labal-basic .labal {
  height: 50% !important;
}
.MagList-labal-carrier .labal:first-child {
  height: 25% !important;
}
.MagList-labal-carrier .labal:nth-child(2) {
  height: 37.5% !important;
}
.MagList-labal-carrier .labal:last-child {
  height: 37.5% !important;
}
</style>
