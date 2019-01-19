<template>
    <div>
        <el-dialog  :close-on-click-modal='false' :title="newModifyTitle" :visible.sync="showDialog" @close="$emit('update:pVisible', false)"
             width="1200px" center class="Maglist-HairCar  J-el-dialog__body J-dialog-vh">         
            <div class="J-detail J-inputBorder0 J-yx-error J-dialog-vh-body" > 
                <el-row >  
                    <div  id="J-dialog-header-offsetHeight">
                        <el-form label-width="84px" class="demo-ruleForm J-flexSbc" >
                            <el-form-item label="短驳日期：" >
                                <el-date-picker
                                    v-model="createTime"
                                    type="daterange"
                                    :picker-options="pickerOptions"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right">
                                </el-date-picker>
                                <el-button type="primary" class="J-ml-20"  v-if="checkHasPermission('dbyfjs:read')" @click="handlesearch">查询</el-button>
                            </el-form-item>  
                        </el-form> 
                        <span class="ticket-tishi">勾选要对账的短驳单</span>
                    </div>
                    <el-row class="J-elTable"  id="J-elTable">
                        <el-table :max-height="getScreenHeight-jElTableOffsetTop-jdialogFooterOffsetHeight>111?getScreenHeight-jElTableOffsetTop-jdialogFooterOffsetHeight:'none'" show-summary :summary-method="kpAddGetSummaries" ref="multipleTable" :data="tableData" border @selection-change="handleSelectionChange" @select-all="selectAll" @select="selectChange" class="table-checkboxLabel">
                            <el-table-column fixed type="selection" width="40" align='center'></el-table-column>
                            <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column> 
                            <el-table-column prop="drayageNo" label="短驳单号" min-width="130" align='center'></el-table-column>
                            <el-table-column prop="fee" label="短驳费" min-width="110" align='center'>></el-table-column>
                            <el-table-column prop="balanceFee" label="已结短驳费" min-width="110" align='center'></el-table-column>
                            <el-table-column prop="unBalanceFee" label="未结短驳费" min-width="110" align='center' class-name="J-expenditure">></el-table-column>
                            <el-table-column prop="unCheckBalanceFee" label="未对账短驳费" min-width="130" align='center' class-name="J-expenditure">></el-table-column>
                            <el-table-column prop="driverName" label="司机姓名" min-width="110" align='center'></el-table-column>
                            <el-table-column prop="driverMobile" label="司机手机" min-width="120" align='center'></el-table-column>
                            <el-table-column prop="waybillNum" label="运单数" min-width="110" align='center'></el-table-column>
                            <el-table-column prop="drayageTime" label="短驳时间" min-width="180" align='center'></el-table-column>
                            <el-table-column prop="memo" label="备注" align='center'></el-table-column>
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
                        <!-- <el-form-item label="利润率：" label-width="70px"> -->
                            <!-- <span>{{kpAddForm.fee?kpAddForm.fee:0}}</span> -->
                        <!-- </el-form-item> -->
                    </el-form>                     
                </el-row>
                <span class="dialog-footer" style="display: block; text-align: center;margin-top:18px">
                    <el-button type="primary" :loading="savingFlag" @click="saveBalance('newModifyForm')">保 存</el-button>
                </span>
                
            </div>
        </el-dialog>
    </div>
</template>
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
    mixins: [Base,List],
     /**
     * pAuFlag： 0代表新增， 1修改
     * pBalanceId： 修改时必填 对账ID
     */
    props: ['pVisible', 'pAuFlag', 'pTruckId', 'pPlateNumber', 'pBalanceId',  'pBalanceNo' ],

    data() {
        return { 
            showDialog: this.pVisible,
            newModifyTitle:'',
            tableData:[],
            searchForm:{//新增开票 查询
                createTimeBegin:'',
                createTimeEnd:'',
                truckId:'',
                balanceId:''//修改需要
            },    
            createTime:[],//时间的搜索控件是一个数组  
            hjfkTotal:0,//合计付款总额
            newModifyForm:{
                balanceId:this.pBalanceId,//修改时
                truckId:this.pTruckId,
                drayageIds:[],//勾选的运单
                realBalanceName:this.pPlateNumber,
                memo:''
            },
            multipleSelection: [], //多选
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
        
        /**
         * 初始化
         */
        init(){
           
            if(this.pAuFlag==0){
                this.newModifyTitle='创建['+this.pPlateNumber+']短驳对账单'
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
            api.get('/finance/balance/drayage/detail?id='+this.pBalanceId).then(data=>{
                if(data.code==="200"){
                    this.newModifyTitle='修改['+data.data.balanceHolderName+']短驳对账单-' + data.data.balanceNo
                    
                    this.newModifyForm.realBalanceName = data.data.realBalanceName
                    this.newModifyForm.memo = data.data.memo

                    this.searchForm.truckId=data.data.balance_holder_id
                }
            })
        },
        
        //获取运单列表数据
        loadwaitBalanceWaybillList(){

            this.searchForm.truckId=this.pTruckId
            this.searchForm.balanceId = this.pBalanceId
           api.post('/finance/balance/drayage/wait/balance/drayage/list', this.searchForm).then(data=>{
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
            }).then( () => {
                this.savingFlag=true
                let dIds = this.multipleSelection.map(d => d.id)
                this.newModifyForm.drayageIds=dIds
                api.post('finance/balance/drayage/balance/addupdate', this.newModifyForm).then(data=>{
                    if(data.code==="200"){
                        let msg = '成功创建短驳对账单!'
                        if (this.pAuFlag==1) {
                            msg ='成功修改短驳对账单!';
                        }
                        this.$message({type: 'success',message: msg});
                        this.$emit('update:pVisible', false) //
                        this.$emit('reloadList',true)//刷新列表
                    }
                }).then(() => { 
                    this.savingFlag=false             
                })     
            }).catch(() => {
            })
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
            const arr=['fee','balanceFee','unBalanceFee','unCheckBalanceFee']
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
            var sum=this.summingUp(this.multipleSelection,'unCheckBalanceFee');
            var num=0
                for(var i in sum){
                    num+= sum[i];
                }
            this.hjfkTotal=num
        }
    }, 
    created() {

        this.init()
    }
}                    
</script>

                          
  
                        
 
              