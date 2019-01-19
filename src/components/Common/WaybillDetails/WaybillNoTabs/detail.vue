<template>
    <div class="J-detail"> 
        <el-row>
             <div class="J-detail-title J-flexSbc">
                <div class="J-flexCc">
                    <div class="J-detail-title-yuan"></div>
                    运单信息         
                     <el-button  type="text" size="small" @click="fileUploadFun()"  style="padding-left:30px">凭证上传</el-button>
                </div>
                <div style="margin-right:10px">业务员({{detailWay.buEmployeeName?detailWay.buEmployeeName:''}})</div>
            </div>
            <el-col :span="48">
                <div class="labal">开单日期</div>
                <div class="input">{{detailWay.billTime?detailWay.billTime:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">运单号</div>
                <div class="input">{{detailWay.waybillNo?detailWay.waybillNo:''}}</div>
            </el-col>
            <el-col :span="48" >
                <div class="labal">发站</div>
                <div class="input">{{detailWay.beginSiteName?detailWay.beginSiteName:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">到站</div>
                <div class="input">{{detailWay.endSiteName?detailWay.endSiteName:''}}</div>
            </el-col>
           <el-col :span="48">
                <div class="labal">电商仓库</div>
                <div class="input">{{detailWay.warehouseName?detailWay.warehouseName:''}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="12" >
                <div style="width:100%">
                    <div class="J-detail-title">
                        <div class="J-detail-title-yuan"></div>
                        发货方信息
                    </div>
                    <div class="J-flex">
                        <div class="labal">发货单位</div>
                        <div class="input">{{detailWay.consignorName?detailWay.consignorName:''}}</div>    
                    </div>
                    <div class="J-flex">
                        <div class="labal">发货人</div>
                        <div class="input J-borderTop">{{detailWay.consignorLinkman?detailWay.consignorLinkman:''}}</div>    
                    </div>
                    <div class="J-flex">
                        <div class="labal">发货方手机</div>
                        <div class="input J-borderBot J-borderTop" >{{detailWay.consignorLinkmanMobile?detailWay.consignorLinkmanMobile:''}} </div>    
                    </div>
                    <div class="J-flex">
                        <div class="labal">发货地址</div>
                        <div class="input">{{ (detailWay.consigneeCountyName?(detailWay.consignorProvinceName+"/"+
                            detailWay.consignorCityName+"/" +
                            detailWay.consignorCountyName+"/"):'') +detailWay.consignorAddress}}</div>    
                    </div>
                </div>
            </el-col>
            <el-col :span="12" >
                <div style="width:100%">
                    <div class="J-detail-title">
                        <div class="J-detail-title-yuan"></div>
                        收货方信息
                    </div>
                <div class="J-flex">
                    <div class="labal">收货单位</div>
                    <div class="input">{{detailWay.consigneeName?detailWay.consigneeName:''}}</div>    
                </div>
                 <div class="J-flex">
                    <div class="labal">收货人</div>
                    <div class="input J-borderTop">{{detailWay.consigneeLinkman?detailWay.consigneeLinkman:''}}</div>    
                </div>
                <div class="J-flex">
                    <div class="labal">收货人手机</div>
                    <div class="input J-borderBot J-borderTop" >{{detailWay.consigneeLinkmanMobile?detailWay.consigneeLinkmanMobile:''}} </div>    
                </div>
                <div class="J-flex">
                    <div class="labal">收货地址</div>
                    <div class="input">{{(detailWay.consigneeCountyName? (detailWay.consigneeProvinceName+"/"+
                            detailWay.consigneeCityName+"/" +
                            detailWay.consigneeCountyName+"/"):'')+detailWay.consigneeAddress}}</div>    
                </div>
                </div>
            </el-col>
        </el-row>
        <el-row >
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                货物信息  
                <el-button  type="text" size="small" @click="showWaybillGoodsDetail()"  style="padding-left:30px">查看货物清单 </el-button>
            </div>
            <el-col :span="48">
                <div class="labal">货物名称</div>
                <div class="input">{{detailWay.goodsName?detailWay.goodsName:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">包装方式</div>
                <div class="input">{{detailWay.pack?detailWay.pack:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">件数</div>
                <div class="input">{{detailWay.goodsNum?detailWay.goodsNum:''}}件{{detailWay.productNum?',单品数('+detailWay.productNum+')':''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">重量(KG)</div>
                <div class="input">{{detailWay.goodsWeight?detailWay.goodsWeight:''}}</div>
            </el-col>
           <el-col :span="48">
                <div class="labal">体积(方)</div>
                <div class="input">{{detailWay.goodsBulk?detailWay.goodsBulk:''}}</div>
            </el-col>
        </el-row>
        <el-row ><!-- 运费-->
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                运费
            </div>
           <el-col :span="48">
                <div class="labal">运费</div>
                <div class="input  J-borderBot">{{detailWay.specialFee?detailWay.specialFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">提货费</div>
                <div class="input  J-borderBot">{{detailWay.pickFee?detailWay.pickFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">送货费</div>
                <div class="input J-borderBot">{{detailWay.deliverFee?detailWay.deliverFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">装货费</div>
                <div class="input J-borderBot">{{detailWay.loadFee?detailWay.loadFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">卸货费</div>
                <div class="input  J-borderBot">{{detailWay.unloadFee?detailWay.unloadFee:''}}</div>
            </el-col>
             <el-col :span="48">
                <div class="labal">上楼费</div>
                <div class="input ">{{detailWay.upFee?detailWay.upFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">进仓费</div>
                <div class="input">{{detailWay.instoreFee?detailWay.instoreFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">仓储费</div>
                <div class="input">{{detailWay.storeFee?detailWay.storeFee:''}}</div>
            </el-col>
             <el-col :span="48">
                <div class="labal">申明价值</div>
                <div class="input">{{detailWay.goodsValue?detailWay.goodsValue:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">保价费</div>
               <div class="input">{{detailWay.insuranceFee?detailWay.insuranceFee:''}}</div>
            </el-col>
        </el-row>
        <el-row ><!-- 付款方式-->
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                付款方式
            </div>
            <el-col :span="48">
                <div class="labal">付款方式</div>
                <div class="input J-borderBot">
                    {{ payType(detailWay.payType) }}
                </div>
            </el-col>
            <el-col :span="48">
                <div class="labal">现付</div>
                <div class="input J-borderBot">{{detailWay.xfFee?detailWay.xfFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">到付</div>
                <div class="input  J-borderBot">{{detailWay.dfFee?detailWay.dfFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">回付</div>
                <div class="input J-borderBot">{{detailWay.hfFee?detailWay.hfFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">月结</div>
                <div class="input J-borderBot">{{detailWay.yjFee?detailWay.yjFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">回扣</div>
                <div class="input">{{detailWay.hkFee?detailWay.hkFee:''}}</div>
            </el-col>
             <el-col :span="48">
                <div class="labal">代收货款</div>
                <div class="input">{{detailWay.goodsFee?detailWay.goodsFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">手续费</div>
                <div class="input">{{detailWay.goodsServiceFee?detailWay.goodsServiceFee:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal"></div>
               <div class="input input-kong"></div>
            </el-col>
            <el-col :span="48"> 
                <div class="labal"></div>
                <div class="input input-kong"></div>
            </el-col>
        </el-row>
        <el-row ><!-- 其他-->
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                其他
            </div>
            <el-col :span="48">
                <div class="labal">上门提货</div>
                <div class="input">{{pickFlag(detailWay.pickFlag)}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">交接方式</div>
                <div class="input">{{deliveryType(detailWay.deliveryType)}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">回单</div>
                <div class="input">{{receiptType(detailWay.receipt)}}，{{detailWay.receiptNum?detailWay.receiptNum:0}}份</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">要求发货日期</div>
                <div class="input">{{detailWay.requireSendTime?detailWay.requireSendTime:''}}</div>
            </el-col>
            <el-col :span="48">
                <div class="labal">要求到货日期</div>
                <div class="input">{{detailWay.requireArriveTime?detailWay.requireArriveTime:''}}</div>
            </el-col>
            <el-col :span="24">
                <div class="labal">备注</div>
                <div class="input J-borderTop">{{detailWay.memo?detailWay.memo:''}} </div>
            </el-col>
        </el-row>
         
    <v-waybillGoodsDetail :showDetailDialog.sync='dialog.showDetailDialog' :waybillId='dialog.waybillId' v-if="dialog.showDetailDialog"> </v-waybillGoodsDetail>
    <v-uploadFilesDialog :pVisible.sync='dialog.pVisible' :pWaybillId='dialog.pWaybillId' v-if="dialog.pVisible"> </v-uploadFilesDialog>
    </div>
  
</template>
 
<script>
import api from '@/utils/api.js'
import Base from "@/utils/base.js";
import waybillGoodsDetailDialog from '@/components/Common/waybillGoodsDetail.vue'
import uploadFilesDialog from '@/components/Common/uploadFiles.vue'
export default {
  mixins: [Base],
  components: { 
    'v-waybillGoodsDetail' : waybillGoodsDetailDialog,
    'v-uploadFilesDialog' :uploadFilesDialog
  },
  props: ["waybillId"],
  data() {
    return {
      detailWay: {},
      waybillGoodsDetail:{},

      dialog:{ 
         showDetailDialog:false,
         waybillId:'',
         pWaybillId:'',
         pVisible:false,
         
      }
    };
  },

  methods:{

        //查看货物清单
       showWaybillGoodsDetail(){
         this.dialog.showDetailDialog = true;
         this.dialog.waybillId = this.waybillId; 
      } ,
    //   凭证上传
      fileUploadFun(){
         this.dialog.pVisible = true;
         this.dialog.pWaybillId = this.waybillId; 
      }     

  },
  async created() {
    const  { code, message,data} =await api.get('/waybill/detail?waybillId=' + this.waybillId)
    if(code==="200"){this.detailWay = data;}
  }
};
</script>

