
<template>
    <div>
        <el-dialog :title="newModifyTitle" :visible.sync="isDialog" @close="$emit('update:dialog', false)"
             width="1200px" center class="Maglist-HairCar">          
            <el-form  label-width="82px" class="demo-ruleForm J-flexRc " >
                <el-form-item label="清单备注："   >
                    <div class="J-flex " >
                        <div class="input J-qdmemo">{{pcMemo}}</div>
                    </div>
                </el-form-item>                      
            </el-form>  
            <div class="J-elTable">
                <el-table  :data="tableData" border @selection-change="handleSelectionChange" class="table-checkboxLabel">
                    <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column> 
                    <el-table-column prop="waybillNo" label="运单号" min-width="110" align='center'>
                        <template slot-scope="scope">
                        <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="billTime" label="开单日期" min-width="110" align='center'></el-table-column>
                     <el-table-column prop="consignorName" label="发货单位" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="consignorLinkman" label="发货人" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="transferName" label="承运商" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="receiptStatus" label="回单状态"  min-width="100" align='center'>
                        <template slot-scope="scope">
                            <div v-html="statusBackground(receiptStatus(scope.row.receiptStatus))" class="J-statusBackground"></div>     
                        </template>
                    </el-table-column>
                    <el-table-column prop="receiptNum" label="回单份数" min-width="100" align='center'></el-table-column>
                    <el-table-column prop="memo" label="备注说明" min-width="200" align='center'></el-table-column>
                    <el-table-column prop="goodsName" label="货物名称" min-width="110" align='center'></el-table-column>       
                    <el-table-column prop="goodsNum" label="件数" min-width="100" align='center'></el-table-column>   
                    <el-table-column prop="goodsWeight" label="重量" min-width="100" align='center'></el-table-column>
                    <el-table-column prop="goodsBulk" label="体积" min-width="100" align='center'></el-table-column>       
                </el-table>  
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
import api from '@/utils/api.js';
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
            pcMemo:'',
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
        /**
         * 初始化
         */
        init(){
            this.newModifyTitle='交接清单明细'
            this.newCreated()
            this.pcMemo=this.updateRow.memo
        },
         showWaybill(row) {
            this.openWaybill.waybillNo = row.waybillNo
            this.openWaybill.waybillId = row.waybillId
            this.openWaybill.statusText = this.waybillStatusTxt(row.waybillStatus);
            this.openWaybill.visiable = true;
        }, 
        //新增 table 数据获取
        async newCreated(){
            const { code, message,data } =await api.get('/receipt/pc/detail?pcId='+this.updateRow.id)
            if(code==="200"){
                this.tableData = data;
            }
        }
    },
    created() {
        this.init()
    }
}          
</script>