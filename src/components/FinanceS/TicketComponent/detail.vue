<template>
    <div>
        <el-dialog :title="detailTitle" :visible.sync="showDialog" @close="$emit('update:pVisible', false)" width="1200px" center class="Maglist-HairCar J-dialog-vh">     
            <div class="J-detail J-inputBorder0 J-dialog-vh-body" >
                <el-row>
                    <el-col :span="24" >
                        <div class="labal">审核流程</div>
                        <div class="input J-borderBot J-heightAuto J-flexSbc" >
                            <div class="ticket-select-auditor J-flexSbc" style="padding:0 10px">
                                <div v-for="tag in detail.auditFlowSequence" :key="tag.index" class=" ticket-select-auditor-jt J-flexCc" style="padding-bottom: 0px;">
                                <el-tag>{{tag.name}}</el-tag>
                                <i class="iconfont icon-right" ></i>
                                </div>
                            </div>
                        </div>
                    </el-col>    
                    <el-col :span="6" >
                        <div class="labal">开票金额</div>
                        <div class="input  J-borderBot">{{detail.fee?detail.fee:0}}</div>
                    </el-col>
                    <el-col :span="6" >
                        <div class="labal">运单数</div>
                        <div class="input   J-borderBot">{{detail.waybillNum?detail.waybillNum:''}}</div>
                    </el-col> 
                    <el-col :span="6">
                        <div class="labal">申请人</div>
                        <div class="input  J-borderBot"> {{detail.createEmployeeName?detail.createEmployeeName:''}}</div>
                    </el-col>
                     <el-col :span="6">
                        <div class="labal">申请时间</div>
                        <div class="input  J-borderBot"> {{detail.createTime?detail.createTime:''}}</div>
                    </el-col>
                    <el-col :span="24">
                        <div class="labal">开票申请备注 </div>
                        <div class="input  J-borderBot"> {{detail.memo?detail.memo:''}}</div>
                    </el-col>
                    
                    <el-col :span="6" >
                        <div class="labal">开票人</div>
                        <div class="input ">{{detail.finishEmployeeName?detail.finishEmployeeName:''}}</div>
                    </el-col>
                    <el-col :span="6" >
                        <div class="labal">开票时间</div>
                        <div class="input  ">{{detail.finishTime?detail.finishTime:''}}</div>
                    </el-col> 
                    <el-col :span="12">
                        <div class="labal">开票备注：</div>
                        <div class="input "> {{getScreenHeight-jElTableOffsetTop-200}}{{detail.finishMemo?detail.finishMemo:''}}</div>
                    </el-col>
                </el-row>

              <el-row  style="margin-top:10px" id="J-table"> 
                <el-tabs type="card">
                    <el-tab-pane label="运单清单" >
                        <el-table   :max-height="getScreenHeight-jElTableOffsetTop-200>80?getScreenHeight-jElTableOffsetTop-200:'none'" :data="waybillList" border  >
                            <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column> 
                            <el-table-column prop="waybillNo" label="运单号" min-width="100" align='center'>
                                <template slot-scope="scope">
                                <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="consignorName" label="发货单位" min-width="100" align='center'></el-table-column>
                            <el-table-column prop="consignorLinkman" label="发货方" min-width="100" align='center'></el-table-column>
                            <el-table-column prop="totalFee" label="总运费" min-width="100" align='center'></el-table-column>
                            <el-table-column prop="xfFee" label="现付" min-width="100" align='center'></el-table-column>
                            <el-table-column prop="dfFee" label="到付" min-width="100" align='center'></el-table-column>
                            <el-table-column prop="hfFee" label="回付" min-width="100" align='center'></el-table-column>       
                            <el-table-column prop="yjFee" label="月结" min-width="100" align='center'></el-table-column>       
                            <el-table-column prop="exceptionFee" label="异常费用" min-width="110" align='center'></el-table-column>             
                            <el-table-column prop="goodsName" label="货物名称" min-width="100" align='center'></el-table-column>       
                            <el-table-column prop="pack" label="包装" min-width="100" align='center'></el-table-column>       
                            <el-table-column prop="goodsNum" label="件数" min-width="100" align='center'></el-table-column>       
                            <el-table-column prop="goodsWeight" label="重量" min-width="100" align='center'></el-table-column>       
                            <el-table-column prop="goodsBulk" label="体积" min-width="100" align='center'></el-table-column>       
                            <el-table-column prop="memo" label="运单备注" min-width="200" align='center'></el-table-column>         
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="审核记录" >
                        <el-table :max-height="getScreenHeight-jElTableOffsetTop-200>80?getScreenHeight-jElTableOffsetTop-200:'none'"  :data="dzList" border   >
                            <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                            <el-table-column prop="auditTime"  label="处理时间" align='center' width="180"></el-table-column>
                            <el-table-column prop="status" label="处理状态"  align='center'  width="100">
                                <template slot-scope="scope">
                                    <div v-html="statusBackground(auditStatus(scope.row.status))" class="J-statusBackground"></div>   
                                </template>
                            </el-table-column>
                            <el-table-column prop="auditEmployeeName" label="审核人" align='center'  width="100"></el-table-column>
                            <el-table-column prop="auditMemo" label="审核意见" min-width="200" align='center'></el-table-column>
                        </el-table>  
                    </el-tab-pane>
                </el-tabs>
                </el-row> 
            </div> 
        </el-dialog>
        <waybillNo-component
        :showFlag.sync="openWaybill.visiable"
        :waybillNo="openWaybill.waybillNo"
        :statusText="openWaybill.statusText"
        :waybillId="openWaybill.waybillId"
        v-if="openWaybill.visiable"
      ></waybillNo-component>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js';
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

export default {
    mixins: [Base,List],
    props: ['pVisible','pInvoiceId','pInvoiceTitle'],
     components: { 
         "waybillNo-component": waybillNoComponent,
    },
    data(){
        return{
            showDialog: this.pVisible,
            detailTitle:'开票详情',
            emFlowSequence:[], 

            detail:{},
            waybillList:[],
            dzList:[],
             //运单详情框
            openWaybill: {
            waybillNo: "",
            waybillId: "",
            statusText: "",
            visiable: false
      },
        }
    },
    methods:{
        //运单详情跳转
         showWaybill(row) {
            this.openWaybill.waybillNo = row.waybillNo
            this.openWaybill.waybillId = row.id
            this.openWaybill.statusText = this.waybillStatusTxt(row.status);
            this.openWaybill.visiable = true;
    },
         loadInvoiceDetail(){
            api.get('/kp/detail?id='+this.pInvoiceId).then(data=>{
                if(data.code==='200'){
                    this.detail=data.data
                    this.detailTitle = '['+data.data.invoiceTitle+']开票详情'
                }
            })
            
        },
         waybillListFun(){
            const { code, message,data } = api.get('/kp/waybill/list?id='+this.pInvoiceId).then(data=>{
                if(data.code==='200'){
                    this.waybillList=data.data
                }
             })
        },
         dzListFun(){
            api.get('/kp/audit/list?id='+this.pInvoiceId).then(data=>{
                if(data.code==='200'){
                    this.dzList=data.data
                }
             })
        }
    },
    created() {
        this.loadInvoiceDetail()
        this.waybillListFun()
        this.dzListFun()
    }
}
</script>