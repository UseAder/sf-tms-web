<template>
    <div class="J-detail"> 
        <template v-if="trackDispatchWay.status==2">
            <el-row>
                <div class="J-detail-title">
                    <div class="J-detail-title-yuan"></div>
                    基本信息
                </div>
                <div class="J-flex">
                    <div class="laball  MagList-labal MagList-labal-basic ">
                        <div class="labal">基本信息</div>
                            <div  class="labal">其他信息</div>
                    </div>
                    <div>
                        <el-col :span="6">
                        <div class="labal">车辆信息</div>
                        <div class="input  J-borderBot"> {{trackDispatchWay.transferName?trackDispatchWay.transferName:''}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">联系人</div>
                            <div class="input  J-borderBot"> {{trackDispatchWay.linkman?trackDispatchWay.linkman:''}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">联系电话</div>
                            <div class="input  J-borderBot"> {{trackDispatchWay.linkmanMobile?trackDispatchWay.linkmanMobile:''}}</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">车型</div>
                            <div class="input  J-borderBot"> {{truckTypeText}}</div>
                        </el-col>
                   
                        <el-col :span="6">
                        <div class="labal">现付</div>
                        <div class="input  J-borderBot"> {{trackDispatchWay.ddXfFee}}</div>
                        </el-col>
                        
                        <el-col :span="6" >
                        <div class="labal">到付</div>
                        <div class="input J-borderBot"> {{trackDispatchWay.ddDfFee}}</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">回付</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.ddHfFee}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">押金</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.ddYajFee}}</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">合计运费</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.ddTotalFee}}</div>
                        </el-col>
                        
                        <el-col :span="6" class="input-kong">
                            <div class="labal">投保价值</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.tbGoodsValue}}</div>
                        </el-col>
                        <el-col :span="6" class="input-kong">
                            <div class="labal">保费</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.tbPremiumFee}}</div>
                        </el-col>
                        <el-col :span="6" class="input-kong">
                            <div class="labal">调度毛利</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.dProfitFee}}</div>
                        </el-col>
                         
                        <el-col :span="6" class="input-kong">
                            <div class="labal">保险公司</div>
                            <div class="input J-borderBot">{{trackDispatchWay.tbCompany?trackDispatchWay.tbCompany:''}}</div>
                        </el-col>
                        <el-col :span="6">
                        
                        <div class="labal">预计发货时间</div>
                        <div class="input  J-borderBot"> {{trackDispatchWay.expectSendTime?trackDispatchWay.expectSendTime:''}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">预计到达时间</div>
                            <div class="input  J-borderBot"> {{trackDispatchWay.expectArriveTime?trackDispatchWay.expectArriveTime:''}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">调度人</div>
                            <div class="input J-borderBot "> {{trackDispatchWay.createEmployeeName?trackDispatchWay.createEmployeeName:''}}</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">调度时间</div>
                            <div class="input"> {{trackDispatchWay.createTime?trackDispatchWay.createTime:''}}</div>
                        </el-col> 
                        
                            <el-col :span="18" >
                            <div class="labal">备注</div>
                            <div class="input"> {{trackDispatchWay.memo?trackDispatchWay.memo:'无'}}</div>
                        </el-col>
                    </div>
                </div>
            </el-row>
        </template>
        <template  v-else>
            <el-row>
                <div class="J-detail-title">
                    <div class="J-detail-title-yuan"></div>
                    承运信息
                </div>
                <div class="J-flex">
                    <div class="laball MagList-labal MagList-labal-carrier">
                        <div class="labal">基本信息</div>
                        <div  class="labal">费用信息</div>
                        <div  class="labal">其他信息</div>
                    </div>
                    <div>
                        <el-col :span="6">
                        <div class="labal">承运商</div>
                        <div class="input  J-borderBot"> {{trackDispatchWay.transferName?trackDispatchWay.transferName:''}}</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">司机手机</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.driverMobile?trackDispatchWay.driverMobile:''}}</div>
                        </el-col>
                        <el-col :span="6" >
                        <div class="labal">专线结算重量</div>
                        <div class="input J-borderBot"> {{trackDispatchWay.ddGoodsWeight}}千克</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">专线结算体积</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.ddGoodsBulk}}立方</div>
                        </el-col> 
                        <el-col :span="6">
                            <div class="labal">现付运费</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.ddXfFee}}</div>
                        </el-col>
                         <el-col :span="6">
                        <div class="labal">到付</div>
                        <div class="input  J-borderBot">{{trackDispatchWay.ddDfFee}}</div>
                        </el-col>
                        <el-col :span="6">
                        <div class="labal">回付</div>
                        <div class="input  J-borderBot">{{trackDispatchWay.ddHfFee}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">月结</div>
                            <div class="input  J-borderBot">{{trackDispatchWay.ddYjFee}}</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">提货费</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.ddZxPickFee}}</div>
                        </el-col>
                        
                        <el-col :span="6">
                            <div class="labal">送货费</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.ddZxDeliverFee}}</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">上楼费</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.ddZxUpFee}}</div>
                        </el-col> 
                        <el-col :span="6" >
                            <div class="labal">装货费</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.ddZxLoadFee}}</div>
                        </el-col>
                          <el-col :span="6">
                        <div class="labal">卸货费</div>
                        <div class="input  J-borderBot"> {{trackDispatchWay.ddZxUnloadFee}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">进仓费</div>
                            <div class="input  J-borderBot"> {{trackDispatchWay.ddZxInstoreFee}}</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">合计费用</div>
                            <div class="input  J-borderBot"> {{trackDispatchWay.ddTotalFee}}</div>
                        </el-col>
                            
                        
                           <el-col :span="6" >
                            <div class="labal">干线运费</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.ddZxSpecialFee}}</div>
                        </el-col> 
                        <el-col :span="6" >
                            <div class="labal">调度毛利</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.dProfitFee}}</div>
                        </el-col> 
                          <el-col :span="6" >
                            <div class="labal"></div>
                            <div class="input J-borderBot"> </div>
                        </el-col>
                        
                           <el-col :span="6" >
                            <div class="labal"></div>
                            <div class="input J-borderBot"></div>
                        </el-col> 
                           <el-col :span="6" >
                            <div class="labal"></div>
                            <div class="input J-borderBot"></div>
                        </el-col> 
                          
                         <el-col :span="6" >
                        <div class="labal">预计发货时间</div>
                        <div class="input J-borderBot"> {{trackDispatchWay.expectSendTime?trackDispatchWay.expectSendTime:''}}</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">预计到达时间</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.expectArriveTime?trackDispatchWay.expectArriveTime:''}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">调度人</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.createEmployeeName?trackDispatchWay.createEmployeeName:''}}</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">调度时间</div>
                            <div class="input J-borderBot"> {{trackDispatchWay.createTime?trackDispatchWay.createTime:''}}</div>
                        </el-col>
                        <el-col :span="6" >
                            <div class="labal">专线查单单号</div>
                            <div class="input"> {{trackDispatchWay.zxWaybillNo?trackDispatchWay.zxWaybillNo:''}}</div>
                        </el-col>
                        <el-col :span="18" >
                            <div class="labal">备注</div>
                            <div class="input"> {{trackDispatchWay.memo?trackDispatchWay.memo:''}}</div>
                        </el-col>
                    </div>
                </div>
            </el-row>
        </template>
        <el-row ><!-- 提货信息-->
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                提货信息
            </div>
            <el-col :span="6" >
            <div class="labal">车辆信息</div>
            <div class="input J-borderBot"> {{trackPickWay.plateNumber?trackPickWay.plateNumber:''}}</div>
            </el-col>
            <el-col :span="6" >
                <div class="labal">联系人</div>
                <div class="input J-borderBot"> {{trackPickWay.driverName?trackPickWay.driverName:''}}</div>
            </el-col>
            <el-col :span="6">
                <div class="labal">联系电话</div>
                <div class="input J-borderBot"> {{trackPickWay.driverMobile?trackPickWay.driverMobile:''}}</div>
            </el-col>
            
             <el-col :span="6" >
                <div class="labal">车型</div>
                <div class="input  J-borderBot"> {{pickTruckTypeText}}</div>
            </el-col> 
            <el-col :span="6">
                <div class="labal">操作人</div>
                <div class="input "> {{trackPickWay.createEmployeeName?trackPickWay.createEmployeeName:''}}</div>
            </el-col>
            <el-col :span="6" >
                <div class="labal">操作时间</div>
                <div class="input "> {{trackPickWay.createTime?trackPickWay.createTime:''}}</div>
            </el-col>
            
            <el-col :span="6" class="input-kong">
                <div class="labal">提货分摊成本</div>
                <div class="input "> {{trackDispatchWay.cbPickFee}}</div>
            </el-col>
            <el-col :span="6" class="input-kong">
                <div class="labal"></div>
                <div class="input "> </div>
            </el-col>
            <el-col :span="24" >
                <div class="labal">备注</div>
                <div class="input J-borderTop">{{trackPickWay.memo?trackPickWay.memo:''}}</div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
  props: ["waybillId"],
   mixins:[Base],
    data() {
        return {
            trackDispatchWay:{
                truckType:''
            },
            trackPickWay:{},
            //调度车辆车型
            truckTypeText:'',
            //提货车型
            pickTruckTypeText:''
        } 
    },
    created() {
        api.get('/system/dic/code?code=TRUCK_TYPE').then(data=>{
          if (data.code === '200') {
            this.base.truckTypeOptions = data.data;
                api.get('/waybill/track/dispatch?waybillId='+ this.waybillId).then(data=>{
                if(data.code==="200"){
                    if( data.data){
                        this.trackDispatchWay = data.data;
                        this.truckTypeText =  this.vehicleType(this.trackDispatchWay.truckType)
                    }
                }     
            })
            this.trackPick()
          } 
        })
       
    },
    methods:{
        async trackPick(){
            const { code, message,data} =await api.get('waybill/track/pick?waybillId='+ this.waybillId)
            if(code==="200"){
                if(data){
                    this.trackPickWay = data
                     this.pickTruckTypeText =  this.vehicleType(this.trackPickWay.truckType)
                }
            }
        }
    }
}
</script>
  
<style>

.J-height-auto{
    height: auto!important;
}

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
