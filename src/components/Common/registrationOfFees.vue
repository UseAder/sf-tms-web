
<template>
    <div>
        <el-dialog  :close-on-click-modal="false" :title="newModifyTitle" :visible.sync="isDialog" @close="$emit('update:dialog', false)"
             width="900px" center class="Maglist-HairCar J-el-dialog__body J-dialog-vh">  

            <span class="ticket-tishi">在修改时如果变更了费用方，保存时将会删除原费用方相关的对账数据</span>
            <el-row class="J-elTable"  id="J-elTable">
                <el-table :max-height="getScreenHeight-jElTableOffsetTop>111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" highlight-current-row style="width: 100%" border >
                    <el-table-column type="index" fixed label="序号" width="50"  align='center'></el-table-column>
                    <el-table-column prop="feeType" label="费用类型" min-width="100" align='center'>
                        <template slot-scope="scope">
                            {{feeTypeFun(scope.row.feeType)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="ioType" label="收支类型" min-width="80" align='center'>
                        <template slot-scope="scope">
                            {{inOutPayType(scope.row.ioType)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="fee" label="费用" min-width="100" align='center'></el-table-column>
                    <el-table-column prop="businessBDataType" label="费用方" min-width="150" align='center'>
                        <template slot-scope="scope">
                            {{businessBDataTypeFormat(scope.row)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="balanceFee" label="已结费用" min-width="100" align='center'></el-table-column>
                    <el-table-column prop="unBalanceFee" label="未结费用" min-width="100" align='center'></el-table-column>
                    <el-table-column prop="unCheckBalanceFee" label="未对账费用" min-width="100" align='center'></el-table-column>
                    <el-table-column prop="memo" label="备注" min-width="200" align='center'></el-table-column>
                    <el-table-column prop="createTime" label="发生时间" width="180" align='center'></el-table-column>
                   
                    <el-table-column fixed="right" label="操作" width="100"  align='center'>
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="modifyFeeFun(scope.row)" >修改</el-button>
                            <el-button type="text" size="small" @click="deleteFeeFun(scope.row)" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>    
            <span style="display: block; text-align: center;margin-top:30px">
                <el-button type="primary" @click='newSignFun'>添 加</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" width="550px" :title="signTitle" :visible.sync="showDialog" v-if="showDialog" center append-to-body>     
            <el-form ref="newModifyForm"  :rules="newModifyRules" :model="newModifyForm" label-width="80px" class="demo-form-inline J-inputWidth J-flexSbc" >    
                <el-form-item label="费用类型" prop="feeType">
                    <el-select v-model="newModifyForm.feeType"  placeholder="请选择">
                    <el-option
                        v-for="item in exceptionFeeType"
                        :key="item.value*1"
                        :label="item.item"
                        :value="item.value*1">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="费用" prop="fee" label-width="52px">
                    <el-input v-model.number="newModifyForm.fee" placeholder="费用"></el-input>
                </el-form-item>
                <div class="J-flex" >
                    <el-form-item label="收支类型" prop="ioType">
                        <el-select v-model="newModifyForm.ioType"  placeholder="请选择">
                        <el-option
                            v-for="item in base.inOutPayType"
                            :key="item.value"
                            :label="item.code"
                            :value="item.value">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="费用方" prop="businessBDataType" label-width="71px">
                        <el-select v-model="newModifyForm.businessBDataType"  placeholder="请选择">
                        <el-option
                            v-for="item in base.businessBDataType"
                            :key="item.value*1"
                            :label="item.code"
                            :value="item.value*1">
                        </el-option>
                        </el-select>
                    </el-form-item>   
                </div>
                
                <el-form-item label="备注" prop="memo" class=" J-width100">

                    <el-input type="textarea"  placeholder="请输入描述" :autosize="{ minRows: 3, maxRows: 4}" v-model="newModifyForm.memo"></el-input>
                </el-form-item>
            </el-form>
            <span style="display: block; text-align: center;">   
                <el-button type="primary" :loading="savingFlag" @click="saveData('newModifyForm')">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template> 
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
    mixins: [Base,List],
    props: ['dialog','waybillNo','waybillId'],
    data() {
        return {
            //费用登记列表
            isDialog: this.dialog,
            //费用登记新增或修改
            showDialog:false,
            newModifyTitle: this. waybillNo + '费用登记',
            tableData:[],
            newModifyForm:{
                id:'',
                waybillId:'',
                feeType:'',
                waybillNo:'',
                ioType:'',
                // businessBDataId:'',
                businessBDataType:'',
                // businessBName:'',
                memo:'',
                // createTime:''
                addBalanceFlag:false
            },
            exceptionFeeType:[],
            newModifyRules: {
                feeType: [
                    { required: true, message: '请选择费用类型', trigger: ['blur', 'change'] },
                ],
                fee: [
                    { required: true, message: '请输入费用', trigger: ['blur', 'change'] },
                     { type: 'number', message: '价格必须为数字值', trigger: ['blur', 'change']}

                ],
                ioType: [
                    { required: true, message: '请选择收支类型' ,trigger: ['blur', 'change'] },
                ],
                businessBDataType:[
                    { required: true, message: '请选择费用方' ,trigger: ['blur', 'change'] },
                ],
                memo: [
                     { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
                ],
            },
        }
    },
    created(){
            this.exceptionFeeTypeFun();
    },
    methods:{
        businessBDataTypeFormat(row) {
             let t = this.businessBDataType(row.businessBDataType);
            if (row.businessBDataType != 4) {
                t += '(' + row.businessBName + ')';
            }
            return t;
        },
        //加载异费类型
        async exceptionFeeTypeFun(){
            const { code, message,data } =await api.get('system/dic/code?code=EXCEPTION_FEE_TYPE')
            if(code == "200"){
                this.exceptionFeeType = data;
            }
        },
        //列表加载
        async createdList(){
            const { code, message,data } =await api.get('/exception/fee/list?waybillId='+this.waybillId)
            if(code == "200"){
                this.tableData = data;
            }
        },
        //新增或修改
        modifyFeeFun(row){
            this.signTitle='修改费用'
            this.newModifyForm.waybillId=this.waybillId;

            this.newModifyForm.id=row.id
            this.newModifyForm.fee=row.fee
            this.newModifyForm.feeType=row.feeType    
            this.newModifyForm.businessBDataType=row.businessBDataType
            this.newModifyForm.memo=row.memo
            this.newModifyForm.ioType=row.ioType
            this.showDialog=true
        },

        deleteFeeFun(row) {

            this.$confirm('确定要删除该异常费用吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true,
                type: 'warning'
            }).then(async () => {
                
                //检查
                let checkForm = {}
                checkForm.exceptionFeeId=row.id
                checkForm.waybillId=row.waybillId
                checkForm.businessType=row.businessBDataType
                checkForm.doType=3

                const { code, message,data } = await api.post('/exception/fee/balance/check', checkForm)
                if(code == "200"){
                    if (data != null) {
                        this.$confirm('异常费用相关的运单已经在对账单['+ data.balanceNo +']，是否要删除并更新对账单？', '提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            center:true,
                            type: 'warning'
                        }).then(() => {
                            this.deleteFeeFunPost(row.id)
                        }).catch(() => {
                        })
                    } else {
                        this.deleteFeeFunPost(row.id)
                    }
                }
            }).catch(() => {});
        },
        async deleteFeeFunPost(id){
            const { code, message,data } = await api.post('/exception/fee/delete?id='+id)
            if(code == "200"){
                this.createdList()
            }
        },
        newSignFun(){
            this.signTitle='新增费用'
            this.newModifyForm={}
            this.newModifyForm.waybillId=this.waybillId;
            this.newModifyForm.waybillNo=this.waybillNo,
            this.showDialog=true
            
        },
        //确认保存？
        saveData(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {

                    this.$confirm('确定要保存该异常费用吗', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        center:true,
                        type: 'warning'
                    }).then(async () => {

                        //检查
                        let checkForm = {}
                        checkForm.waybillId=this.newModifyForm.waybillId
                        checkForm.businessType=this.newModifyForm.businessBDataType
                        if (this.newModifyForm.id) {
                            checkForm.doType=2
                        } else {
                            checkForm.doType=1
                        }

                        const { code, message,data } = await api.post('/exception/fee/balance/check', checkForm)
                        if(code == "200"){
                            if (data != null) {
                                this.$confirm('异常费用相关的运单已经在对账单['+ data.balanceNo +']，是否要直接更新对账单？', '提示', {
                                    confirmButtonText: '是',
                                    cancelButtonText: '否',
                                    center:true,
                                    type: 'warning'
                                }).then(() => {
                                    this.newModifyForm.addBalanceFlag = true
                                    this.saveFun()
                                }).catch(() => {
                                    this.newModifyForm.addBalanceFlag = false
                                    this.saveFun()
                                })
                            } else {
                                this.newModifyForm.addBalanceFlag = false
                                this.saveFun()
                            }
                        }

                    }).catch(() => {});
                } else {
                    return false;
                }
            });
            
        },  
        //确认
        async saveFun(){
            const { code, message,data } = await api.post('/exception/fee/add_modify',this.newModifyForm)
            if(code == "200"){
                this.createdList()
                this.showDialog=false
            }
        },

        feeTypeFun : function(feeType){
             let param = this.exceptionFeeType.find((n) => (n.value == feeType));
            if (param === undefined) {
                return "" 
            }
            return param.item;

        }
    }, 
    mounted() {
        this.createdList()
    }
}                    
</script>

                          
  
                          
  
                        
 
              
                          
  
                        
 