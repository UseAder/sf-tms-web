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
                    <div class="labal">合计付款总额</div>
                    <div class="input ">{{detail.fee?detail.fee:0}}元</div>
                    </el-col>
                    <!-- <el-col :span="6">
                        <div class="labal">利润率</div>
                        <div class="input  "></div>
                    </el-col> -->
                    <el-col :span="6" >
                        <div class="labal">结算方</div>
                        <div class="input  ">{{detail.realBalanceName?detail.realBalanceName:''}}</div>
                    </el-col> 
                    
                    <el-col :span="12">
                        <div class="labal">对账备注</div>
                        <div class="input "> {{detail.memo?detail.memo:''}}</div>
                    </el-col>
                </el-row>
                <el-row  style="margin-top:10px"  class="J-elTable">                
                    <el-tabs type="card">
                        <el-tab-pane label="运单清单" >
                            <el-table  :max-height="getScreenHeight-jElTableOffsetTop-200>80?getScreenHeight-jElTableOffsetTop-200:'none'" show-summary :summary-method="zxjsDetailSummaries"  :data="dispatchList" border  style="margin-top:15px" >
                                <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column> 
                                <el-table-column prop="waybillNo" label="运单号" min-width="100" align='center'>
                                    <template slot-scope="scope">
                                    <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="consignorName" label="发货单位" min-width="100" align='center'></el-table-column>
                                <el-table-column prop="zxWaybillNo" label="专线承运单号"  min-width="120"  align='center'></el-table-column>
                                <el-table-column prop="waybillDfFee" label="运单到付" min-width="100" align='center'></el-table-column>
                                <el-table-column prop="dfXxFee" label="信息费" min-width="100" align='center' class-name="J-income"></el-table-column>
                                <el-table-column prop="xfFee" label="现付" min-width="100" align='center' class-name="J-expenditure"></el-table-column>
                                <el-table-column prop="hfFee" label="回付" min-width="100" align='center' class-name="J-expenditure"></el-table-column>
                                <el-table-column prop="yjFee" label="月结" min-width="100" align='center' class-name="J-expenditure"></el-table-column>
                                <el-table-column prop="exceptionFee" label="异常费" min-width="100" align='center' class-name="J-expenditure"></el-table-column>       
                                <el-table-column prop="goodsName" label="货物名称" min-width="100" align='center'></el-table-column>       
                                <el-table-column prop="pack" label="包装" min-width="80" align='center'></el-table-column>
                                <el-table-column prop="goodsNum" label="件数" min-width="80" align='center'></el-table-column>
                                <el-table-column prop="ddGoodsWeight" label="结算重量" min-width="80" align='center'></el-table-column>
                                <el-table-column prop="ddGoodsBulk" label="结算体积" min-width="80" align='center'></el-table-column>
                                <el-table-column prop="memo" label="调度备注" min-width="200" align='center'></el-table-column>  
                            </el-table>        
                        </el-tab-pane>
                        <el-tab-pane label="审核记录" >
                                <el-table  :max-height="getScreenHeight-jElTableOffsetTop-200>80?getScreenHeight-jElTableOffsetTop-200:'none'"  :data="dzList" border   >
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
                        <el-tab-pane label="核销记录" >
                            <el-table  :max-height="getScreenHeight-jElTableOffsetTop-200>80?getScreenHeight-jElTableOffsetTop-200:'none'"  :data="hxList" border  >
                                <el-table-column type="index" width="50" label="序号" align='center'></el-table-column>
                                <el-table-column prop="createTime"  label="支付时间" align='center' width="180"></el-table-column>
                                <el-table-column prop="lastRemainFee"  label="上次结余" align='center' width="100"></el-table-column>
                                <el-table-column prop="fee"  label="收款金额" align='center' width="100"></el-table-column>
                                <el-table-column prop="remainFee"  label="本次余额" align='center' width="100"></el-table-column>
                                <el-table-column prop="createEmployeeName" label="操作人" align='center'  width="100"></el-table-column>
                                <el-table-column prop="memo" label="备注" min-width="200" align='center'></el-table-column>
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
import api from '@/utils/api.js'
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

export default {
    mixins: [Base,List],
    props: ['pVisible','pBalanceId','pBalanceNo'],
     components: { 
         "waybillNo-component": waybillNoComponent,
    },
    data(){
        return{
            showDialog: this.pVisible,
            detailTitle:'对账详情',
            emFlowSequence:[], //员工审核流程

            detail:{},
            dispatchList:[],
            dzList:[],
            hxList:[],
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
            this.openWaybill.waybillId = row.waybillId
            this.openWaybill.statusText = this.waybillStatusTxt(row.waybillStatus);
            this.openWaybill.visiable = true;
    },
        async loadBalanceDetail(){
            const { code, message,data } =await api.get('/finance/balance/zx/detail?id='+this.pBalanceId)
            if(code==='200'){
                this.detail=data
                this.detailTitle = '['+data.balanceHolderName+']对账详情-' + data.balanceNo

            }
        },
        async dispatchListFun(){//获取信息--运单列表
            const { code, message,data } =await api.get('/finance/balance/zx/waybill/list?id='+this.pBalanceId)
            if(code==='200'){
                this.dispatchList=data
            }
        },
        async dzListFun(){//获取信息--对账审核过程
            const { code, message,data } =await api.get('finance/balance/zx/dz/audit/list?id='+this.pBalanceId)
            if(code==='200'){
                this.dzList=data
            }
        },
        async hxListFun(){//获取信息--核销记录
            const { code, message,data } =await api.get('/finance/balance/zx/hx/list?id='+this.pBalanceId)
            if(code==='200'){
                this.hxList=data
            }
        },
         ////////////// 合计  //////////////////////////////
        zxjsDetailSummaries(param) {//合计
            const { columns, data } = param; 
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 1) {
                sums[index] = '合计';
                return; 
            }
            const values = data.map(item => Number(item[column.property]));
            const arr=['waybillDfFee','dfXxFee','xfFee','hfFee','yjFee','exceptionFee']
            if(arr.indexOf(column.property) > -1){//则包含该元素}
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                        return prev + curr;
                        } else {
                        return prev;
                        }
                    }, 0);
                    // sums[index] += ' 元'; 
                    } else {
                    sums[index] = 'N/A';
                    }
                }  
            });
            return sums;
        },
    },
    created() {
        this.loadBalanceDetail()
        this.dispatchListFun()
        this.dzListFun()
        this.hxListFun()
    }
}
</script>

<style>

</style>
