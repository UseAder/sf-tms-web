<template>
    <div>
        <el-dialog :title="detailsTitle+'短驳详情'" :visible.sync="isdetailsDialog" @close="$emit('update:isdetailsOpinion', false)" width="1200px" center class="Maglist-HairCar J-el-dialog__body J-dialog-vh">   
            <div class="J-detail  J-inputBorder0 J-dialog-vh-body">
                <div class=" J-dialog-vh-content"  :style="'max-height:'+(getScreenHeight-342)+'px;'">
                    <el-row >
                        <div class="J-detail-title">
                            <div class="J-detail-title-yuan"></div>
                            基本信息
                        </div>
                        <el-col :span="6">
                            <div class="labal">短驳车辆</div>
                            <div class="input J-borderBot">{{newModifyForm.plateNumber}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">司机名称</div>
                            <div class="input J-borderBot">{{newModifyForm.driverName}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">联系手机</div>
                            <div class="input J-borderBot">{{newModifyForm.driverMobile}}</div>
                        </el-col>                                                       
                        <el-col :span="6">
                            <div class="labal">短驳车型</div>
                            <div class="input J-borderBot">{{newModifyForm.truckTypeText }}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">短驳时间</div>
                            <div class="input J-borderBot">{{newModifyForm.drayageTime}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">短驳运费</div>
                            <div class="input J-borderBot">{{newModifyForm.fee}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">创建时间</div>
                            <div class="input J-borderBot">{{newModifyForm.createTime}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal"></div>
                            <div class="input J-borderBot"></div>
                        </el-col>
                        
                        <el-col :span="24">
                            <div class="labal">备注</div>
                            <div class="input J-textLeft J-paddingL20">{{newModifyForm.memo}}</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <div class="J-detail-title">
                            <div class="J-detail-title-yuan"></div>
                            短驳运单列表
                        </div>
                            <el-table :data="newModifyForm.detailPickDrayages" border @selection-change="handleSelectionChange"  class="table-checkboxLabel">
                            <el-table-column fixed type="index" width="50" label="序号" align='center'> </el-table-column>
                            <el-table-column prop="waybillNo" label="运单号" width="110"  align='center' header-align="center">
                                <template slot-scope="scope">
                                <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column :formatter="status" prop="status" label="运单状态" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="billTime" label="开单日期" width="110"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="transferName" label="承运商名称" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="linkman" label="联系人" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="linkmanMobile" label="联系手机电话" width="120"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="receiptNum" label="回单" width="110"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="consignorName" label="发货单位" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="consignorLinkman" label="发货人" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="consignorLinkmanMobile" label="发货人手机" width="120"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="consignorAddress" label="发货地址" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="consigneeName" label="收货单位" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="consigneeLinkman" label="收货人" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="consigneeLinkmanMobile" label="收货人手机" width="120"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="consigneeAddress" label="收货地址" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="goodsName" label="货物名称" width="110"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="pack" label="包装" width="110"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="goodsNum" label="件数" width="110"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="goodsWeight" label="重量" width="110"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="goodsBulk" label="体积" width="110"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="memo" label="备注" width="180"  align='center' header-align="center"></el-table-column>
                        </el-table>
                    </el-row>   
                </div>
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
    props: ['detailsId','detailsTitle','isdetailsOpinion'],
     components: { 
         "waybillNo-component": waybillNoComponent,
    },
    data(){
        return{
            isdetailsDialog: this.isdetailsOpinion,
            newModifyForm:{},
            // truckTypeText:'',
            //运单详情框
            openWaybill: {
            waybillNo: "",
            waybillId: "",
            statusText: "",
            visiable: false
      },
        }
    },
    watch: {
        async isdetailsOpinion () {
            this.isdetailsDialog =this.isdetailsOpinion
            this.newModifyForm={}
            if (this.isdetailsDialog) {
                //调用车型接口
                this.vehicleTypeInterface();
                const { code, message,data } =await api.post('dra/detail',{drayageId:this.detailsId})
                if(code==="200"){
                   this.newModifyForm=data
                }
                this.newModifyForm.truckTypeText =  this.vehicleType(data.truckType)     
            //调用base.js加载车型
            }
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
         status : function (row,column) {
            let param = this.base.statusMagListgl.find((n) => (n.value == row.status));
            if (param === undefined) {
                return "" 
            }
            return param.code;
        },
       
    }
}
</script>
