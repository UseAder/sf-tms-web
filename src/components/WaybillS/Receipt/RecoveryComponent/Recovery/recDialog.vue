
<template>
    <div>
        <el-dialog :title="newModifyTitle" :visible.sync="isDialog" @close="$emit('update:dialog', false)"
             width="1200px" center class="Maglist-HairCar">          
            <div class="J-detail "> 
                <el-form label-width="84px" class="demo-ruleForm J-flexSbc" >
                    <el-form-item label="开单日期：" >
                        <el-date-picker
                            v-model="createTime"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                        </el-date-picker>
                        <el-button type="primary" class="J-ml-20" @click="handlesearch">查询</el-button>
                    </el-form-item>  
                </el-form> 
                <div class="J-elTable">
                    <el-table  :data="tableData" border @selection-change="handleSelectionChange" class="table-checkboxLabel">
                        <el-table-column fixed type="selection" width="40" align='center'></el-table-column>
                        <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column> 
                        <el-table-column prop="waybillNo" label="运单号" min-width="110" align='center'>
                            <template slot-scope="scope">
                        <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                        </template>
                        </el-table-column>
                        <el-table-column prop="billTime" label="开单日期" width="110" align='center'></el-table-column>
                        <el-table-column prop="consignorName" label="发货单位" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="consignorLinkman" label="发货人" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="transferName" label="承运商" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="receiptStatus" label="回单状态"  min-width="100" align='center'>
                            <template slot-scope="scope">
                                <div v-html="statusBackground(receiptStatus(scope.row.receiptStatus))" class="J-statusBackground"></div>     
                            </template>
                        </el-table-column>
                        <el-table-column prop="receiptNum" label="回单份数" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="memo" label="备注说明" min-width="200" align='center'></el-table-column>
                        <el-table-column prop="goodsName" label="货物名称" min-width="110" align='center'></el-table-column>       
                        <el-table-column prop="goodsNum" label="件数" min-width="110" align='center'></el-table-column>   
                        <el-table-column prop="goodsWeight" label="重量" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="goodsBulk" label="体积" min-width="110" align='center'></el-table-column>       
                    </el-table>  
                </div>
                <el-form :model="searchForm"  label-width="82px" class="demo-ruleForm J-flexRc " >
                    <el-form-item label="清单备注：" style="margin-top:20px">
                        <div class="J-flex">
                            <el-input autosize v-model="newModifyForm.memo" placeholder="清单备注" type="textarea" style="min-width: 400px;margin-right: 25px;"></el-input>
                            <el-button type="pr imary" @click='preservation' style="height:31px;line-height:0px">保存清单</el-button>
                        </div>
                    </el-form-item>                      
                </el-form> 
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
    props: ['dialog','isContent','updateRow'],
    components: { 
         "waybillNo-component": waybillNoComponent,
    },
    data() {
        return { 
            isDialog: this.dialog,
            newModifyTitle:'',
            tableData:[],
            searchForm:{//新增开票 查询
                startReceiptBillTime:'',
                endReceiptBillTime:'',
                transferId:'',//承运方id
            },    
             //运单详情框
            openWaybill: {
            waybillNo: "",
            waybillId: "",
            statusText: "",
            visiable: false
      },
            createTime:[],//时间的搜索控件是一个数组  
            newModifyForm:{
                transferId:'',
                transferName:'',
                receiptIds:'',//勾选的运单
                memo:''
            },
            multipleSelection: [], //多选
        }
    },
    watch: { 
        "createTime": function (val, oldval) {
            if (val !== null) {
            this.searchForm.startReceiptBillTime = val[0];
            this.searchForm.endReceiptBillTime = val[1];
            }else{
            this.searchForm.startReceiptBillTime = null;
            this.searchForm.endReceiptBillTime = null;
            }
        }
    },
    methods:{
        /**
         * 初始化
         */
        init(){
             this.newModifyTitle='创建交接清单'
            this.newCreated() 
        },
        showWaybill(row) {
            this.openWaybill.waybillNo = row.waybillNo
            this.openWaybill.waybillId = row.waybillId
            this.openWaybill.statusText = this.waybillStatusTxt(row.waybillStatus);
            this.openWaybill.visiable = true;
        }, 
        //新增 table 数据获取
        async newCreated(){
            this.searchForm.transferId=this.updateRow.transferId
            const { code, message,data } =await api.post('/receipt/wait/detail/list', this.searchForm)
            if(code==="200"){
                this.tableData = data;
            }
        },
        async preservation(){
            var receiptIdsArray=[]
            this.multipleSelection.forEach(val => {receiptIdsArray.push(val.id);});  
            this.newModifyForm.receiptIds=receiptIdsArray
            if(this.newModifyForm.receiptIds==''){
                this.$message({
                    type: 'error',
                    message: '提交失败，请至少选择一个运单!'
                });
                return false;
            }            
            this.newModifyForm.transferId=this.updateRow.transferId
            this.newModifyForm.transferName=this.updateRow.transferName
            const { code, message,data } =await api.post('/receipt/create/pc', this.newModifyForm)
            if(code==="200"){
                this.$message({
                    type: 'success',
                    message: '恭喜您，交接清单创建成功!'
                });
                this.newModifyForm={}
                this.isDialog=false
                 //关闭清单创建
                this.$emit('closeDialog',true)
            }
        },    
        //查询时
        handlesearch(){
            this.newCreated()
        }
    }, 
    created() {
        this.init()
    }
}                    
</script>