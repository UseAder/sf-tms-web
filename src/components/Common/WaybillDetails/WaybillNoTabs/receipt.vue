<template>
    <div class="J-detail"> 
        <el-row>
          <div class="J-detail-title">
            <div class="J-detail-title-yuan"></div>
            基本信息
          </div>
            <el-col :span="48">
                <div class="labal">回单类型</div>
                <div class="input">{{receiptType(receiptInfo.receipt)}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">回单数量</div>
                <div class="input">{{receiptInfo.receiptNum}}</div>
            </el-col>
            <el-col :span="48" >
                <div class="labal">当前状态</div>
                <div class="input">{{receiptStatus(receiptInfo.receiptStatus).code}}</div>
            </el-col>
            <el-row>
          </el-row> 
          <div class="J-detail-title">
            <div class="J-detail-title-yuan"></div>
            回单记录
          </div>
          <el-table :data="receiptWay" border  style="width: 100%">
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
            <el-table-column
              prop="handType"
              label="回单状态"
              width="180" align='center' header-align="center">
              <template slot-scope="scope">
                  <div v-html="statusBackground(receiptHandType(scope.row.handType))" class="J-statusBackground"></div>     
              </template>
            </el-table-column>
            <el-table-column
              prop="memo"
              label="备注" align='center' header-align="center">
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
        receiptWay: [],
        receiptInfo:{
          receipt:'',
          receiptNum:'',
          receiptStatus:''
        }
      }
    },
    async created() {
      const  { code, message,data} =await api.get('/waybill/receipt?waybillId=' + this.waybillId)
      if(code==="200"){
        this.receiptWay = data.receiptList;
        
        if(data.receiptInfo){
          this.receiptInfo = data.receiptInfo;
        }
        }
      //photoList
    } 
  }
</script>
<style>

.MagList-labal .labal{
box-sizing: border-box;display: flex;   
  align-items: center;justify-content: center;flex-wrap: wrap;
}
.MagList-labal-basic .labal{
    height:50%!important; 
}
.MagList-labal-carrier .labal:first-child{
  height:25%!important; 
}
.MagList-labal-carrier .labal:nth-child(2){
  height:37.5%!important; 
}
.MagList-labal-carrier .labal:last-child{
  height:37.5%!important; 
}





</style>
