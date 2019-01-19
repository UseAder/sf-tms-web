<template>
    <div class="J-detail"> 
          <el-row>
             <div class="J-detail-title"> 
                 <div class="J-detail-title-yuan"></div>
                 发货异常
            </div>
            <el-col :span="4">
                <div class="labal">异常类型</div>
                <div class="input"> {{sendExceptionTypeText}}</div>
            </el-col>
            <el-col :span="4">
                <div class="labal">登记人</div>
                <div class="input"> {{sendGoodsExceptionInfo.createEmployeeName?sendGoodsExceptionInfo.createEmployeeName:''}}</div>
            </el-col>
            <el-col :span="5">
                <div class="labal">登记时间</div>
                <div class="input"> {{sendGoodsExceptionInfo.createTime?sendGoodsExceptionInfo.createTime:''}}</div>
            </el-col>
            <el-col :span="7">
                <div class="labal">描述</div>
                <div class="input"> {{sendGoodsExceptionInfo.content?sendGoodsExceptionInfo.content:''}}</div>
            </el-col>
        </el-row>
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                发货订单信息
           </div>
          <el-table :data="waybillSendGoodsListOuts" highlight-current-row style="width: 100%" border >
            <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
            <el-table-column prop="customerOrderNo" label="订单号" min-width="110" align='center'></el-table-column>
            <el-table-column prop="productName" label="品名" min-width="110" align='center'></el-table-column>
            <el-table-column prop="skuNo" label="编码型号"  min-width='110' align='center'></el-table-column>
            <el-table-column prop="num" label="实发" min-width="80" align='center'></el-table-column>
            <el-table-column prop="signNum" label="实收" min-width="80" align='center'></el-table-column>
            <el-table-column prop="backNum" label="退货" min-width="80" align='center'></el-table-column>
            <el-table-column prop="rejectNum" label="拒收" min-width="80" align='center'></el-table-column>
            <el-table-column prop="lessNum" label="少收" min-width="80" align='center'></el-table-column>
            <el-table-column prop="errorNum" label="错货" min-width="80" align='center'></el-table-column>
            <el-table-column prop="moreNum" label="多货" min-width="80" align='center'></el-table-column>
            <el-table-column prop="exceptionReason" label="拒收原因" width="180" align='center'></el-table-column>
            <el-table-column prop="dutyPersonType" label="责任方" min-width="110" align='center'>
                    <template slot-scope="scope">
                        {{dutyPersonType(scope.row.dutyPersonType)}}
                    </template>
            </el-table-column>
            <el-table-column prop="dealWay" label="去向" min-width="110" align='center'>
                    <template slot-scope="scope">
                        {{dealWay(scope.row.dealWay)}}
                    </template>
                </el-table-column>                        
        </el-table>
        <el-row>
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                发货异常跟踪 
            </div>
      <el-table
    :data="waybillSendExceptionTrackOuts"
    border 
    style="width: 100%">
    <el-table-column
      type="index"
      width="50"  align='center' header-align="center"  label="序号">
    </el-table-column>
      <el-table-column
      prop="employeeName"
      label="登记人" align='center' header-align="center">
    </el-table-column>
      <el-table-column
      prop="createTime"
      label="发生时间"  min-width="180" align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="content"
      label="备注" align='center' header-align="center">
    </el-table-column>

  </el-table>    
        </el-row> 

      <el-row>
             <div class="J-detail-title"> 
                 <div class="J-detail-title-yuan"></div>
                退货异常
            </div>
            <el-col :span="4">
                <div class="labal">异常类型</div>
                <div class="input"> {{backExceptionTypeText}}</div>
            </el-col>
            <el-col :span="4">
                <div class="labal">登记人</div>
                <div class="input"> {{backGoodsExceptionInfo.createEmployeeName?backGoodsExceptionInfo.createEmployeeName:''}}</div>
            </el-col>
            <el-col :span="5">
                <div class="labal">登记时间</div>
                <div class="input"> {{backGoodsExceptionInfo.createTime?backGoodsExceptionInfo.createTime:''}}</div>
            </el-col>
            <el-col :span="7">
                <div class="labal">描述</div>
                <div class="input"> {{backGoodsExceptionInfo.content?backGoodsExceptionInfo.content:''}}</div>
            </el-col>
        </el-row>

        <div class="J-detail-title">
            <div class="J-detail-title-yuan"></div>
                退货订单信息
           </div>
           <el-table :data="waybillBackGoodsListOuts" highlight-current-row style="width: 100%" border >
                    <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                    <el-table-column prop="customerOrderNo" label="订单号" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="productName" label="品名" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="skuNo" label="编码型号"  min-width='110' align='center'></el-table-column>
                    <el-table-column prop="num" label="原实发" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="signNum" label="原实收" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="backNum" label="退货实发" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="signBackNum" label="退货实收" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="hasException" label="退货异常" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="backExceptionReason" label="退货原因" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="backDutyPersonType" label="责任方" min-width="110" align='center'>
                        <template slot-scope="scope">
                            {{dutyPersonType(scope.row.backDutyPersonType)}}
                        </template>
                    </el-table-column>              
            </el-table>
    <el-row>
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                退货异常跟踪
            </div>
      <el-table
    :data="waybillBackExceptionTrackOuts"
    border 
    style="width: 100%">
    <el-table-column
      type="index"
      width="50"  align='center' header-align="center"  label="序号">
    </el-table-column>
      <el-table-column
      prop="employeeName"
      label="登记人" align='center' header-align="center">
    </el-table-column>
      <el-table-column
      prop="createTime"
      label="发生时间" align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="content"
      label="备注" align='center' header-align="center">
    </el-table-column>

  </el-table>    
        </el-row> 


         <!-- <el-row>
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                异常照片
            </div>
            </el-row>  -->
    </div>

 

</template>
<script>
import api from '@/utils/api.js'
import Base from "@/utils/base.js";

export default {
  props: ["waybillId"],
  mixins: [Base],
    data() {
      return {
        //发货异常信息
       sendGoodsExceptionInfo:{
         type:'',
         createEmployeeName:'',
         createTime:'',
         content:''
       },
        //发货异常订单列表信息
       waybillSendGoodsListOuts:[],
        //发货异常跟踪信息
       waybillSendExceptionTrackOuts:[],

        //退货异常信息
       backGoodsExceptionInfo:{
         type:'',
         createEmployeeName:'',
         createTime:'',
         content:''
       },
        //退货异常订单列表信息
       waybillBackGoodsListOuts:[],
        //退货异常跟踪信息
       waybillBackExceptionTrackOuts:[],

       sendExceptionTypeText:'',
       backExceptionTypeText:''
      }
    },
  async created() {
    const  { code, message,data} =await api.get('/waybill/detail/exception?waybillId=' + this.waybillId)
    if(code==="200"){
         //发货异常信息
     if(data.sendGoodsExceptionInfo){
          this.sendGoodsExceptionInfo = data.sendGoodsExceptionInfo; 
      }
     if(data.waybillSendGoodsListOuts){
          this.waybillSendGoodsListOuts=data.waybillSendGoodsListOuts;
     }
     if(data.waybillSendExceptionTrackOuts){
          this.waybillSendExceptionTrackOuts=data.waybillSendExceptionTrackOuts;

     }
   
        //退货异常信息
      if(data.backGoodsExceptionInfo){
          this.backGoodsExceptionInfo = data.backGoodsExceptionInfo; 
      }
      if(data.waybillBackGoodsListOuts){
          this.waybillBackGoodsListOuts=data.waybillBackGoodsListOuts;
      }
      if(data.waybillBackExceptionTrackOuts){
          this.waybillBackExceptionTrackOuts=data.waybillBackExceptionTrackOuts;
      } 
      }
        //发货异常
        let sendExceptionParam = this.base.exceptType.find((n) => (n.value == this.sendGoodsExceptionInfo.type));
        if (sendExceptionParam == undefined) {
            this.sendExceptionTypeText = "";
        }else{
            this.sendExceptionTypeText =sendExceptionParam.code;
        }
        //退货异常
         let backExceptionParam = this.base.exceptType.find((n) => (n.value == this.backGoodsExceptionInfo.type));
        if (backExceptionParam == undefined) {
            this.backExceptionTypeText = "";
        }else{
            this.backExceptionTypeText =backExceptionParam.code;
        }
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
