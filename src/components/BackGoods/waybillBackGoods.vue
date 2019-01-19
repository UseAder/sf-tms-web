<template>
    <div class="MagList">
        <div class="J-main-body ">
            <div class="homeMain-header"> 
                <div class="J-main-search" >
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                        <el-form-item label="开单日期" prop="createTime">
                            <el-date-picker
                                v-model="searchForm.createTime"
                                type="daterange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="运单状态"   prop="status">
                            <el-select v-model="searchForm.status" multiple collapse-tags clearable placeholder="请选择" class="J-width100">
                                <el-option
                                    v-for="item in base.statusMagListgl"
                                    :key="item.value"
                                    :label="item.code"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="退货状态"   prop="backGoodsStatus">
                            <el-select v-model="searchForm.backGoodsStatus" multiple collapse-tags clearable placeholder="请选择" class="J-width100">
                                <el-option
                                    v-for="item in base.backGoodsStatus"
                                    :key="item.value"
                                    :label="item.code"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="运单号" prop="waybillNo">
                            <el-input v-model="searchForm.waybillNo" placeholder="运单号"></el-input>
                        </el-form-item>
                        <el-form-item label="发货单位" prop="consignorName">
                            <el-input v-model="searchForm.consignorName" placeholder="发货单位"></el-input>
                        </el-form-item>
                        <el-form-item class="J-main-search-button">
                            <el-button type="primary" v-if="checkHasPermission('back_send:read')" @click='handlesearch'>查询</el-button>
                            <el-button type="warning" v-if="checkHasPermission('back_send:read')" @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="J-elTable" id="J-elTable" >
                <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border >
                <!-- <el-table :max-height="this.$store.getters.getScreenHeight-227"  ref="defaultChoiceData" highlight-current-row :data="tableData" border > -->
                    <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                    <el-table-column label="操作"  width="50" align='center' header-align="center" fixed>
                        <template slot-scope="scope">
                        <div class="table-menu">
                                    
                            <el-menu  :collapse="true" >
                                <el-submenu index="1" >
                                    <template slot="title" >
                                    <i class="el-icon-edit-outline"></i>
                                    </template>
                                    <!-- <el-menu-item-group v-if="scope.row.status != '-1'">  -->
                                    <el-menu-item-group >     
                                    <el-menu-item index="1-2" v-if="checkHasPermission('back_send:send')" @click="baleGoodsSend(scope.row)">打包发货</el-menu-item>
                                    </el-menu-item-group>
                                </el-submenu> 
                            </el-menu>
                        </div>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="backStatus" label="退货状态" min-width="110" align='center'>
                        <template slot-scope="scope">
                         <div v-html="statusBackground(backGoodsStatus(scope.row.backStatus))" class="J-statusBackground"></div>     

                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="运单状态" min-width="110" align='center'>
                        <template slot-scope="scope">
                        <div v-html="statusBackground(waybillStatus(scope.row.status))" class="J-statusBackground"></div>     
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderTimes" label="预约时段" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="waybillNo" label="运单号"  min-width='110' align='center'>
                        <template slot-scope="scope">
                        <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="billTime" label="开单日期" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="consignorName" label="发货单位" width="150" align='center'></el-table-column>
                    <el-table-column prop="beginSiteName" label="发站" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="endSitName" label="到站" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="consigneeName" label="收货单位" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="consigneeLinkman" label="收货人" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="goodsNum" label="单品数" min-width="110" align='center'>
                        <template slot-scope="scope">
                                {{ showProductNumFun(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="packNum" label="打包数" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="goodsName" label="货物名称" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="backProductNum" label="件数" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="packWeight" label="重量" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="packBulk" label="体积" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="memo" label="备注" min-width="110" align='center'></el-table-column>
                </el-table>
                <div class="main-table-page">
                    <div class="main-table-page-left"> 
                    
                    </div>
                    <el-pagination background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="page.pageSizes"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="searchForm.pageNo"
                        :total="page.total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 打包发货弹框 -->
        <el-dialog :close-on-click-modal="false"  :title="detailsTitle" :visible.sync="baleGoodsSendDialog" width="1200px"  center class="Maglist-HairCar J-el-dialog__body J-dialog-vh">   
            <div class="J-detail J-inputBorder0 J-yx-error J-dialog-vh-body"> 
                <el-row class=" J-dialog-vh-content" :style="'max-height:'+(getScreenHeight-342)+'px;'">
                    <el-row>
                        <div class="J-detail-title">
                            <div class="J-detail-title-yuan"></div>
                            运单信息
                        </div>
                        <el-col :span="6">
                            <div class="labal">开单日期</div>
                            <div class="input J-borderBot">{{this.dialogData.billTime}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">运单号</div>
                            <div class="input J-borderBot">{{this.dialogData.waybillNo}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">发站</div>
                            <div class="input J-borderBot">{{this.dialogData.beginSiteName}}</div>
                        </el-col>                                                       
                        <el-col :span="6">
                            <div class="labal">到站</div>
                            <div class="input J-borderBot">{{this.dialogData.endSiteName}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">发货单位</div>
                            <div class="input J-borderBot">{{this.dialogData.consignorName}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">到货单位</div>
                            <div class="input J-borderBot">{{this.dialogData.consigneeName}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">货物名称</div>
                            <div class="input J-borderBot">{{this.dialogData.goodsName}}</div>
                        </el-col>
                            <el-col :span="6">
                            <div class="labal">退货数量</div>
                            <div class="input J-borderBot">{{this.dialogData.backProductNum}}</div>
                        </el-col>
                        <el-col :span="24">
                            <div class="labal">运单备注</div>
                            <div class="input J-textLeft J-paddingL20">{{this.dialogData.memo}}</div>
                        </el-col>
                    </el-row>
                    <el-form ref="baleGoodsSendForm"  :rules="baleGoodsSendRules"  :model="baleGoodsSendForm"  class="demo-ruleForm" style="overflow: hidden;">
                        <div class="J-detail-title">
                            <div class="J-detail-title-yuan"></div>
                            打包信息 
                        </div>
                        <el-col :span="6">
                            <div class="labal">打包件数</div>
                            <div class="input J-borderBot">
                            <el-form-item prop="packNum">
                                <el-input placeholder="打包件数" v-model="baleGoodsSendForm.packNum" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>                      
                            </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">打包重量</div>
                            <div class="input J-borderBot">
                            <el-form-item prop="packWeight">
                                <el-input placeholder="打包重量" v-model.number="baleGoodsSendForm.packWeight"></el-input>                      
                            </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">打包体积</div>
                            <div class="input J-borderBot">
                            <el-form-item prop="packBulk">
                                <el-input placeholder="打包体积" v-model.number="baleGoodsSendForm.packBulk"></el-input>                      
                            </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">承运商</div>
                            <div class="input J-borderBot">
                            <el-form-item prop="transferName">
                                <el-input placeholder="承运商" v-model="baleGoodsSendForm.transferName"></el-input>                      
                            </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">承运单号</div>
                            <div class="input J-borderBot">
                            <el-form-item prop="transitNo">
                                <el-input placeholder="承运单号" v-model.number="baleGoodsSendForm.transitNo"></el-input>                      
                            </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">联系人</div>
                            <div class="input J-borderBot">
                            <el-form-item prop="linkman">
                                <el-input placeholder="联系人" v-model="baleGoodsSendForm.linkman"></el-input>                      
                            </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">联系电话</div>
                            <div class="input J-borderBot">
                            <el-form-item prop="linkmanPhone">
                                <el-input placeholder="联系电话" v-model.number="baleGoodsSendForm.linkmanPhone"></el-input>                      
                            </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="labal">发货日期</div>
                            <div class="input J-borderBot">
                            <el-form-item prop="sendDate">
                                <el-date-picker
                                    v-model="baleGoodsSendForm.sendDate"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>                            
                            </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <div class="labal">备注</div>
                            <div class="input">
                            <el-form-item prop="memo">
                                <el-input placeholder="备注" v-model="baleGoodsSendForm.memo"></el-input>                      
                            </el-form-item>
                            </div>
                        </el-col>
                    </el-form> 
                </el-row>    
                <!-- <div class="J-dialog-vh-submission" :style="getScreenHeight-342<=334?'box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)':''" > -->
                <div class="J-dialog-vh-submission" > 
                    <span class="dialog-footer">
                        <el-button :loading="savingFlag" type="primary" @click="preservation('baleGoodsSendForm')">保 存</el-button>
                    </span>
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
import api from '@/utils/api.js'
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

export default {
    name:'b-waybillBackGoods',
    mixins: [Base,List],
    components: { 
         "waybillNo-component": waybillNoComponent,
    },
    data() {
        return {
            
            detailsTitle:'',
            //标记的颜色列表
            signList:[],
            searchForm: { //客户对账 查询   
                createTime:[],
                startBillTime:'',
                endBillTime:'',
                status:'',
                backGoodsStatus:'',
                waybillNo:'',
                consignorName:'',
                pageSize: 10,
                pageNo: 1
            },
             //运单详情框
            openWaybill: {
            waybillNo: "",
            waybillId: "",
            statusText: "",
            visiable: false
      },
            tableData: [],
            baleGoodsSendDialog:false,
            dialogData:{},
            baleGoodsSendForm:{
                id:'',
                packNum:'',
                packWeight:'',
                packBulk:'',
                transferName:'',
                transitNo:'',
                linkman:'',
                linkmanPhone:'',
                sendDate:'',
                memo:''
            },
            //退货id
            backId :"",
            baleGoodsSendRules: {
                packNum: [
                    { required: true ,message: '请输入打包件数',trigger: ['blur', 'change']} ,
                    { min: 0, max: 3, message: '注意，打包件数不允许超过999' ,trigger: ['blur', 'change']} ,
                ],
                packWeight: [
                    { validator: this.numberRules, trigger: ['blur', 'change']}
                ],
                packBulk: [
                    { validator: this.numberRules, trigger: ['blur', 'change']}
                ],
                memo:[
                    { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
                ],
                linkmanPhone: [
                    { validator: this.linkmanMobileRules, trigger: ['blur', 'change']}
                ],
             
            },
        };
    },
    watch:{
        "searchForm.createTime": function (val, oldval) {
            if (val !== null) {
                this.searchForm.startBillTime = val[0];
                this.searchForm.endBillTime = val[1];
            }else{
                this.searchForm.startBillTime = null;
                this.searchForm.endBillTime = null;
            }
        },
         
    }, 
    methods: {
          showWaybill(row) {
            this.openWaybill.waybillNo = row.waybillNo
            this.openWaybill.waybillId = row.waybillId
            this.openWaybill.statusText = this.waybillStatusTxt(row.status);
            this.openWaybill.visiable = true;
    }, 
        async querySpecialList() {//获取页面初始数据    
            const { code, message,data } =await api.post('/waybill/back/list', this.searchForm)
            if(code==="200"){
                
                this.tableData = data.records;
                this.page.total = data.total;  
            }
        },

        // 打包发货弹框
       baleGoodsSend(row){
            this.closeDialog('baleGoodsSendForm')
            this.backId = row.id
            this.baleGoodsSendDialog = true
            this.detailsTitle='打包发货'
            api.get('/waybill/back/find?id='+row.id).then(data=>{
                if(data.code==="200"){
                    this.dialogData = data.data
                }
            })
        
        },
        //保存打包发货
        preservation(formName){
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.baleGoodsSendForm.id = this.backId
                this.savingFlag=true
                api.post('/waybill/back/add', this.baleGoodsSendForm).then(data=>{
                    if(data.code==200){
                        this.$message({
                            type: 'success',
                            message: '打包发货成功!'
                            
                        });
                        this.baleGoodsSendDialog = false;
                        this.baleGoodsSendForm ={};
                        this.querySpecialList();
                    }
                }).then(() => { 
                    this.savingFlag=false
                })     
            } else {
                return false;
            }
            });
        },
        //显示单品数量.如果没有单品数.显示货物数量
        showProductNumFun(row){
            if(row.productNum != 0 && row.productNum != null){
                return row.productNum;
            }else{
                return row.goodsNum;
            }
        }
    }
    };
</script>


