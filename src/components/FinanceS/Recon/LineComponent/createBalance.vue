
<template>
    <div>
        <el-dialog :close-on-click-modal='false' :title="newModifyTitle" :visible.sync="showDialog" @close="$emit('update:pVisible', false)"
             width="1200px" center class="Maglist-HairCar J-el-dialog__body J-dialog-vh">            
            <div class="J-detail J-inputBorder0 J-yx-error J-dialog-vh-body" > 
                <el-row >  
                    <div  id="J-dialog-header-offsetHeight">
                        <el-form  :model="searchForm" label-width="84px" class="demo-ruleForm J-flexSbc" >
                            <el-form-item label="调度日期：" >
                                <el-date-picker
                                    v-model="createTime"
                                    type="daterange"
                                    :picker-options="pickerOptions"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right">
                                </el-date-picker>
                                <el-button type="primary" class="J-ml-20" @click="handleSearch">查询</el-button>
                            </el-form-item>  
                        </el-form> 
                        <span class="ticket-tishi">勾选要对账的运单(列表显示的是需要对账的运单；在修改对账单时，未对账金额=本对账单的金额+运单中新的未对账金额)</span>
                    </div>
                    <el-row class="J-elTable" id="J-elTable">
                        <el-table  :max-height="getScreenHeight-jElTableOffsetTop-jdialogFooterOffsetHeight>111?getScreenHeight-jElTableOffsetTop-jdialogFooterOffsetHeight:'none'" show-summary :summary-method="kpAddGetSummaries" ref="multipleTable" :data="tableData" border @selection-change="handleSelectionChange" @select="selectChange"  @select-all="selectAll"  class="table-checkboxLabel">
                            <el-table-column fixed type="selection" width="40" align='center'></el-table-column>
                            <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column> 
                            <el-table-column prop="waybillNo" label="运单号" min-width="120" align='center'>
                                <template slot-scope="scope">
                            <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                            </template>
                            </el-table-column>
                            <el-table-column prop="status" label="运单状态" min-width="100" align='center'>
                                <template slot-scope="scope">
                                    <div v-html="statusBackground(waybillStatus(scope.row.status))" class="J-statusBackground"></div>     
                                </template>
                            </el-table-column>
                            <el-table-column prop="zxWaybillNo" label="专线承运单号"  min-width="120"  align='center'></el-table-column>
                            <!-- <el-table-column prop="receipt" :formatter="receipt" label="回单状态" min-width="150" align='center'></el-table-column> -->
                            <!-- <el-table-column prop="transferName" label="承运方" min-width="110" align='center'></el-table-column> -->
                            <el-table-column prop="ddDfFee" label="到付" min-width="110" align='center' ></el-table-column>
                            <el-table-column prop="ddDfXxFee" label="信息费" min-width="110" align='center'></el-table-column>
                            <el-table-column prop="ddBalanceDfXxFee" label="已结信息费" min-width="110" align='center'></el-table-column>
                            <el-table-column prop="ddUnBalanceDfXxFee" label="未结信息费" min-width="110" align='center' class-name="J-income"></el-table-column>
                            <el-table-column prop="ddUnCheckBalanceDfXxFee" label="信息费未对账" min-width="120" align='center' class-name="J-income"></el-table-column>
                            <el-table-column prop="ddXfFee" label="现付" min-width="110" align='center' ></el-table-column>
                            <el-table-column prop="ddBalanceXfFee" label="已结现付" min-width="110" align='center'></el-table-column>
                            <el-table-column prop="ddUnBalanceXfFee" label="未结现付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
                            <el-table-column prop="ddUnCheckBalanceXfFee" label="现付未对账" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
                            <el-table-column prop="ddHfFee" label="回付" min-width="110" align='center' ></el-table-column>
                            <el-table-column prop="ddBalanceHfFee" label="已结回付" min-width="110" align='center' ></el-table-column>
                            <el-table-column prop="ddUnBalanceHfFee" label="未结回付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
                            <el-table-column prop="ddUnCheckBalanceHfFee" label="回付未对账" min-width="100" align='center' class-name="J-expenditure"></el-table-column>
                            <el-table-column prop="ddYjFee" label="月结" min-width="110" align='center' ></el-table-column>
                            <el-table-column prop="ddBalanceYjFee" label="已结月结" min-width="110" align='center' ></el-table-column>
                            <el-table-column prop="ddUnBalanceYjFee" label="未结月结" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
                            <el-table-column prop="ddUnCheckBalanceYjFee" label="月结未对账"  min-width="100" align='center' class-name="J-expenditure"></el-table-column>
                            <el-table-column prop="ddExceptionFee" label="异常费" min-width="110" align='center' ></el-table-column>
                            <el-table-column prop="ddBalanceExceptionFee" label="已结异常" min-width="110" align='center'></el-table-column>
                            <el-table-column prop="ddUnBalanceExceptionFee" label="未结异常" min-width="110" align='center' class-name="J-income"></el-table-column>
                            <el-table-column prop="ddUnCheckBalanceExceptionFee" label="异常未对账"  min-width="100" align='center' class-name="J-income"></el-table-column>
                            <el-table-column prop="dispatchTime" label="调度时间" min-width="180" align='center'></el-table-column>
                            <el-table-column prop="goodsName" label="货物名称" min-width="100" align='center'></el-table-column>       
                            <el-table-column prop="pack" label="包装" min-width="80" align='center'></el-table-column>
                            <el-table-column prop="goodsNum" label="件数" min-width="80" align='center'></el-table-column>
                            <el-table-column prop="ddGoodsWeight" label="结算体积" min-width="80" align='center'></el-table-column>       
                            <el-table-column prop="ddGoodsBulk" label="结算重量" min-width="80" align='center'></el-table-column>
                            <el-table-column prop="memo" label="调度备注" min-width="200" align='center'></el-table-column>       
                        </el-table>  
                    </el-row>
                </el-row>
                <el-row class="J-marginT "  id="J-dialog-footer-offsetHeight">
                    <el-form ref="newModifyForm"  :rules="newModifyRules"  :model="newModifyForm"  >
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
     * pAuFlag： 0代表新增， 1修改
     * pBalanceId： 修改时必填 对账ID
     */
    props: ['pVisible', 'pAuFlag', 'pTransferId', 'pTransferName', 'pBalanceId',  'pBalanceNo' ],
    components: { 
         "waybillNo-component": waybillNoComponent,
    },
    data() {
        return { 
            showDialog: this.pVisible,
            newModifyTitle:'',
            tableData:[],
            searchForm:{//新增开票 查询
                createTimeBegin:'',
                createTimeEnd:'',
                transferId:this.pTransferId,//新增
                balanceId:this.pBalanceId//修改
            },    
            createTime:[],//时间的搜索控件是一个数组  
            hjfkTotal:0,//合计付款总额
            newModifyForm:{
                balanceId:this.pBalanceId,//修改时
                transferId:this.pTransferId,
                dispatchIds:[],//勾选的运单
                realBalanceName:this.pTransferName,
                memo:''
            },
            multipleSelection: [], //多选
            //运单详情框
            openWaybill: {
                waybillNo: "",
                waybillId: "",
                statusText: "",
                visiable: false
            },
            newModifyRules: {  
                realBalanceName: [
                    { required: true, message: '请输入收款人' ,trigger: ['blur', 'change'] },
                    { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}  
                    ],
                memo:[
                    { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
                ]
            }
        }
    },
    watch: { 
        "createTime": function (val, oldval) {
            if (val !== null) {
                this.searchForm.createTimeBegin = val[0];
                this.searchForm.createTimeEnd = val[1];
            }else{
                this.searchForm.createTimeBegin = null;
                this.searchForm.createTimeEnd = null;
            }
        },  
    },
    methods:{
        showWaybill(row) {
            this.openWaybill.waybillNo = row.waybillNo;
            this.openWaybill.waybillId = row.waybillId;
            this.openWaybill.statusText = this.waybillStatusTxt(row.status);
            this.openWaybill.visiable = true;
        },

        /**
         * 初始化
         */
        init(){
           
            if(this.pAuFlag==0){
                this.newModifyTitle='创建['+this.pTransferName+']专线对账单'
            }else{        
                //加载对账单详情数据
                this.loadBalanceDetail()
            }
            this.loadwaitBalanceWaybillList()
        },

        /**
         * 加载明细数据
         */
        loadBalanceDetail() {
            api.get('/finance/balance/zx/detail?id='+this.pBalanceId).then(data=>{
                if(data.code==="200"){
                    this.newModifyTitle='修改['+data.data.balanceHolderName+']专线对账单-' + data.data.balanceNo
                    
                    this.newModifyForm.realBalanceName = data.data.realBalanceName
                    this.newModifyForm.memo = data.data.memo

                    this.searchForm.transferId=data.data.balance_holder_id
                }
            })
        },
        
        //获取运单列表数据
        loadwaitBalanceWaybillList(){

            this.searchForm.transferId=this.pTransferId
            this.searchForm.balanceId = this.pBalanceId
           api.post('/finance/balance/zx/wait/balance/waybill/list', this.searchForm).then(data=>{
                if(data.code==="200"){
                    this.tableData = data.data;
                    let sData = this.tableData.filter(d=>d.hasBalance == 1);
                    this.$nextTick(function(){//默认选中
                        this.toggleSelection(sData)
                    })
                }
           })
        },

        //费用未对账 勾选时
        toggleSelection(rows,selected ) {    
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row,true);
                });
            } 
            this.hjfkTotalFun()
        },
        
        //新增 或修改 保存时
        saveBalance(formName){
            if (this.multipleSelection.length == 0) {
                this.$message({type: 'error',message: '请选择要对账结算的运单！'});
                return
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.saveDataSubmit()
                } else {
                    return false;
                }
            });
        },   
        saveDataSubmit(){
            this.$confirm('确定要保存该对账单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true,
                type: 'warning'
            }).then(() => {
                this.savingFlag=true
                let dIds = this.multipleSelection.map(d => d.id)
                this.newModifyForm.dispatchIds=dIds
                
                // if (this.pAuFlag==0) {
                //     this.newModifyForm.consignorId=this.pConsignorId
                // } else {
                //     this.newModifyForm.balanceId=this.pBalanceId
                // }

                api.post('finance/balance/zx/balance/addupdate', this.newModifyForm).then(data=>{
                    if(data.code==="200"){
 
                        let msg = '成功创建专线对账单!'
                        if (this.pAuFlag==1) {
                            msg ='成功修改专线对账单!';
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
        //查询时
        handleSearch(){
             this.loadwaitBalanceWaybillList()
        },
        //当用户手动勾选数据行的 Checkbox 时触发的事件
        selectChange(rows, row){     
            this.hjfkTotalFun()
        },
        selectAll(rows){     
            this.hjfkTotalFun()
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
            const arr=['ddDfFee','ddXfFee','ddBalanceXfFee','ddUnBalanceXfFee','ddUnCheckBalanceXfFee'
                        ,'ddDfXxFee','ddBalanceDfXxFee','ddUnBalanceDfXxFee','ddUnCheckBalanceDfXxFee'
                        ,'ddHfFee','ddBalanceHfFee','ddUnBalanceHfFee','ddUnCheckBalanceHfFee'
                        ,'ddYjFee','ddBalanceYjFee','ddUnBalanceYjFee','ddUnCheckBalanceYjFee'
                        ,'ddExceptionFee','ddBalanceExceptionFee','ddUnBalanceExceptionFee','ddUnCheckBalanceExceptionFee']
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
                        }else{
                            temp[k] = item[k];
                        }
                    }
                }
            });
            return temp;
        },
        //合计付款总额
        hjfkTotalFun(){
            
            var sumF=this.summingUp(this.multipleSelection,'ddUnCheckBalanceXfFee','ddUnCheckBalanceHfFee','ddUnCheckBalanceYjFee');
            var numF=0
            for(var i in sumF){
                numF+= sumF[i];
            }

            var sumS=this.summingUp(this.multipleSelection,'ddUnCheckBalanceExceptionFee','ddUnCheckBalanceDfXxFee');
            var numS=0
            for(var i in sumS){
                numS += sumS[i];
            }
            
            this.hjfkTotal= numS - numF 
        }
    }, 
    created() {

        this.init()
    }
}                    
</script>

                          
  
                        
 
              