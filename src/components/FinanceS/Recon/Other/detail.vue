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
                     <el-col :span="6" >
                        <div class="labal">收款人</div>
                        <div class="input">{{detail.createEmployeeName?detail.createEmployeeName:''}}</div>
                    </el-col> 
                    <el-col :span="12">
                        <div class="labal">对账备注</div>
                        <div class="input"> {{detail.memo?detail.memo:''}}</div>
                    </el-col>
                </el-row>
                <el-row  style="margin-top:10px" class="J-elTable"> 
                    <el-tabs type="card">
                        <el-tab-pane label="费用列表" >
                            <el-table   :max-height="getScreenHeight-jElTableOffsetTop-200>80?getScreenHeight-jElTableOffsetTop-200:'none'" show-summary :summary-method="otherjsDetailSummaries"  :data="feeList" border  style="margin-top:15px" >
                                <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column> 
                                <el-table-column prop="waybillNo" label="运单号" width="130" align='center'>
                                    <template slot-scope="scope">
                                        <el-button
                                            @click="showWaybill(scope.row)"
                                            type="text"
                                            size="small"
                                        >{{ scope.row.waybillNo }}</el-button>
                                    </template>   
                                </el-table-column>
                                <el-table-column prop="feeType" label="费用名称"  width="120"  align='center'>
                                    <template slot-scope="scope">
                                    {{ exceptFeeType(scope.row.feeType)}}
                                    </template>
                                </el-table-column>
                                <!--  费用的正负表示了收入还是支出，当收支类型变化时会产生歧义
                                    <el-table-column prop="ioType" label="收入/支出" width="100" align='center'>
                                     <template slot-scope="scope">
                                    {{ exceptIoType(scope.row.ioType)}}
                                    </template>
                                </el-table-column> -->
                                <el-table-column prop="fee" label="费用" width="100" align='center' class-name="J-income"></el-table-column>
                                <el-table-column prop="memo" label="费用备注" min-width="200" align='center'  show-overflow-tooltip></el-table-column>
                                <el-table-column prop="createTime" label="创建时间" width="180" align='center'></el-table-column>
                                <el-table-column prop="createEmployeeName" label="创建人" width="100" align='center'></el-table-column>
                            </el-table>        
                        </el-tab-pane>
                        <el-tab-pane label="审核记录" >
                                <el-table :max-height="getScreenHeight-jElTableOffsetTop-200>80?getScreenHeight-jElTableOffsetTop-200:'none'"   :data="dzList" border   >
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
                            <el-table :max-height="getScreenHeight-jElTableOffsetTop-200>80?getScreenHeight-jElTableOffsetTop-200:'none'"   :data="hxList" border  >
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
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

export default {
      mixins: [Base],
    props: ['pVisible','pBalanceId','pBalanceNo'],
    components: {
        "waybillNo-component": waybillNoComponent,
    },
    data(){
        return{
            showDialog: this.pVisible,
            detailTitle:'对账详情',
            emFlowSequence:[], //员工审核流程
            exceptionFeeType:[],
            detail:{},
            feeList:[],
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
        //加载异费类型
        async loadExceptionFeeType(){
            const {code , message, data } = await  api.get('/system/dic/code?code=EXCEPTION_FEE_TYPE')
            if(code == "200"){
                this.exceptionFeeType = data;
            }
        },
        exceptFeeType: function (type) {
            let param = this.exceptionFeeType.find((n) => (n.value == type));
            if (param === undefined) {
                return ""
            }
            return param.item
        },
        showWaybill(row) {
            this.openWaybill.waybillNo = row.waybillNo;
            this.openWaybill.waybillId = row.waybillId;
            this.openWaybill.statusText = this.waybillStatusTxt(row.status);
            this.openWaybill.visiable = true;
        },
        loadBalanceDetail(){
            api.get('/finance/balance/other/detail?id='+this.pBalanceId).then(data=>{
                if(data.code==='200'){
                    this.detail=data.data
                    this.detailTitle = '['+data.data.realBalanceName+']对账详情-' + data.data.balanceNo
                }
            })
        },
        feeListFun(){//获取信息--运单列表
            api.get('/finance/balance/other/fee/list?id='+this.pBalanceId).then(data=>{
                if(data.code==='200'){
                    this.feeList=data.data
                }
            })
        },
        dzListFun(){//获取信息--对账审核过程
            api.get('finance/balance/other/dz/audit/list?id='+this.pBalanceId).then(data=>{
                if(data.code==='200'){
                    this.dzList=data.data
                }
            })
        },
        hxListFun(){//获取信息--核销记录
            api.get('/finance/balance/other/hx/list?id='+this.pBalanceId).then(data=>{
                if(data.code==='200'){
                    this.hxList=data.data
                }
            })
        },
         ////////////// 合计  //////////////////////////////
        otherjsDetailSummaries(param) {//合计
            const { columns, data } = param; 
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 1) {
                sums[index] = '合计';
                return; 
            }
            const values = data.map(item => Number(item[column.property]));
            const arr=['fee']
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
        this.loadExceptionFeeType()
        this.loadBalanceDetail()
        this.feeListFun()
        this.dzListFun()
        this.hxListFun()
    }
}
</script>

<style>

</style>
