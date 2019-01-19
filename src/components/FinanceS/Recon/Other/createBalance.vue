<template>
    <div>
        <el-dialog :close-on-click-modal='false' title="其他异费对账结算" :visible.sync="showDialog" @close="$emit('update:pVisible', false)"
             width="1200px" center class="Maglist-HairCar J-el-dialog__body J-dialog-vh">                            
            <div class="J-detail J-inputBorder0 J-yx-error J-dialog-vh-body" > 
                <el-row>  
                    <span class="ticket-tishi J-margin0">选择的对账费用</span>
                    <el-row class="J-elTable"  id="J-elTable">
                        <el-table :max-height="getScreenHeight-jElTableOffsetTop-jdialogFooterOffsetHeight>111?getScreenHeight-jElTableOffsetTop-jdialogFooterOffsetHeight:'none'"  show-summary :summary-method="kpAddGetSummaries" ref="multipleTable" :data="tableData" border class="table-checkboxLabel">
                            <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column> 
                            <el-table-column prop="waybillNo" label="运单号" width="150" align='center'>
                                <template slot-scope="scope">
                                    <el-button
                                        @click="showWaybill(scope.row)"
                                        type="text"
                                        size="small"
                                    >{{ scope.row.waybillNo }}</el-button>
                                </template>     
                            </el-table-column>
                            <el-table-column prop="consignorName" label="发货单位" width="150" align='center'></el-table-column>
                            <el-table-column prop="transferName" label="承运方" width="150" align='center'></el-table-column>
                            <el-table-column prop="feeType" label="费用名称" min-width="100" align='center'>
                                <template slot-scope="scope">
                                {{ exceptFeeType(scope.row.feeType)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="ioType" label="收入/支出" min-width="100" align='center'>
                                <template slot-scope="scope">
                                {{ exceptIoType(scope.row.ioType)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="fee" label="费用" min-width="100" align='center'></el-table-column>
                            <el-table-column prop="balanceFee" label="已结费用" width="100" align='center' ></el-table-column>
                            <el-table-column prop="unBalanceFee" label="未结费用" width="100" align='center' class-name="J-income"></el-table-column>
                            <el-table-column prop="unCheckBalanceFee" label="未对账费用" width="100" align='center' class-name="J-income"></el-table-column>
                            <el-table-column prop="memo" label="费用备注" width="200" align='center'  show-overflow-tooltip></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" width="180" align='center'></el-table-column>
                            <el-table-column prop="createEmployeeName" label="创建人" width="100" align='center'></el-table-column>
                        </el-table>  
                    </el-row>
                </el-row>
                <el-row class="J-marginT "  id="J-dialog-footer-offsetHeight">
                    <el-form ref="newModifyForm"  :rules="newModifyRules" :model="newModifyForm" >
                        <el-col :span="6">
                            <div class="labal">合计付款总额</div>
                            <div class="input J-borderBot">{{hjfkTotal}}</div>                      
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">收款人</div>
                            <div class="input J-borderBot">
                                <el-form-item prop="realBalanceName">
                                    <el-input type="text" placeholder="收款人" v-model="newModifyForm.realBalanceName">
                                    </el-input> 
                                </el-form-item>
                            </div> 
                        </el-col>
                        <el-col :span="6">
                            <div class="labal"></div>
                            <div class="input J-borderBot"></div>                      
                        </el-col>
                        <el-col :span="6">
                            <div class="labal"></div>
                            <div class="input J-borderBot"></div>                      
                        </el-col>
                        <el-col :span="24">
                            <div class="labal">对账备注</div>
                            <div class="input ">
                                <el-form-item prop="memo">
                                    <el-input type="text" placeholder="对账备注" v-model="newModifyForm.memo">
                                    </el-input>
                                </el-form-item>
                            </div>    
                        </el-col>
                    </el-form>                     
                </el-row>
             
                <span class="dialog-footer" style="display: block; text-align: center;margin-top:18px">
                    <el-button type="primary" :loading="savingFlag" @click="saveBalance('newModifyForm')">保 存</el-button>
                </span>
            </div>
        </el-dialog>

        <waybillNo-component :showFlag.sync="openWaybill.visiable"
            :waybillNo="openWaybill.waybillNo" :statusText="openWaybill.statusText" 
            :waybillId="openWaybill.waybillId" v-if="openWaybill.visiable"></waybillNo-component>
    </div>
</template>
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

export default {
    mixins: [Base,List],
    /**
     * pBalanceId： 修改时必填 对账ID
     * pFeeIds:  新增是的选择的费用ID
     */
    props: ['pVisible','pFeeIds','pBalanceId',  'pBalanceNo' ],
    components: {    
        "waybillNo-component": waybillNoComponent,
    },
    data() {
        return { 
            showDialog: this.pVisible,
            tableData:[],
            hjfkTotal:0,//合计付款总额
            newModifyForm:{
                feeIds:this.pFeeIds,
                realBalanceName:'',
                memo:''
            },
            searchForm:{
                feeIds:this.pFeeIds
            },
            //运单详情框
            openWaybill: {
                waybillNo: "",
                waybillId: "",
                statusText: "",
                visiable: false
            },
            exceptionFeeType:[],
            newModifyRules: {  
                realBalanceName: [
                    { required: true, message: '请输入收款人' ,trigger: ['blur', 'change'] },
                ],
                memo:[
                    { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
                ]
            }
        }
    },
    
    methods:{
        
         //加载异费类型
        loadExceptionFeeType(){
            api.get('/system/dic/code?code=EXCEPTION_FEE_TYPE').then(data=>{
            if(data.code == "200"){
                this.exceptionFeeType = data.data;
            }
            })
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
        //获取运单列表数据
        loadwaitBalanceFeeList(){
            
           api.post('/finance/balance/other/wait/balance/fee/list', this.searchForm).then(data=>{
                if(data.code==="200"){
                    this.tableData = data.data;
                    this.$nextTick(function(){//默认选中
                        this.saveBalancehjfkTotalFun()
                    })
                }
           })
        },
        //新增 或修改 保存时
        saveBalance(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.saveDataSubmit()
                } else {
                    return false;
                }
            });
        },   
        //新增 或修改 保存时
        saveDataSubmit(){
            this.$confirm('确定要保存该对账单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true,
                type: 'warning'
            }).then( () => {
                this.savingFlag=true
                api.post('finance/balance/other/balance/add', this.newModifyForm).then(data=>{
                    if(data.code==="200"){
                        let msg = '成功创建其他异费对账单!'
                        if (this.pAuFlag==1) {
                            msg ='成功修改其他异费对账单!';
                        }
                        this.$message({type: 'success',message: msg});
                        this.$emit('update:pVisible', false) //
                        this.$emit('reloadList',true)//刷新列表
                    }
                }).then(() => { 
                    this.savingFlag=false             
                })    
            }).catch(() => {});
        },
        kpAddGetSummaries(param) {//合计
            const { columns, data } = param; 
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 1) {
                sums[index] = '合计';
                return; 
            }
            const values = data.map(item => Number(item[column.property]));
            const arr=['fee','balanceFee','unBalanceFee','unCheckBalanceFee',]
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
        // 第一个参数是要求和的数组对象，后面是要求和的字段（不定项），如果要求和的字段值是字符串也做了相应转换
        summingUp(arr, ...param) {
            var temp = {};
            arr.forEach(function(item, index) {
                for(var k in item) {
                    if(param.indexOf(k) >= 0) {//找得到
                        if((typeof item[k]) == 'string'){//强转数字
                            item[k] = item[k]*1
                        }
                        if(temp[k]) {                        
                            temp[k] += item[k];       
                        } else {
                            temp[k] = item[k];
                        }
                    }
                }
            });
            return temp;
        },
        //合计付款总额
        saveBalancehjfkTotalFun(){
            var sum=this.summingUp(this.tableData,'unCheckBalanceFee');
            var num=0
                for(var i in sum){
                    num+= sum[i];
                }
            this.hjfkTotal=num
        }
    }, 
    created() {
        this.loadExceptionFeeType()
        this.loadwaitBalanceFeeList()
    }
}                    
</script>

                          
  
                        
 
              