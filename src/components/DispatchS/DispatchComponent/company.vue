<template>
    <div class="J-detail "> 
         <el-dialog :title="newModifyTitle" :close-on-click-modal=false :visible.sync="showDialog" @close="$emit('update:showFlag', false)" 
             width="1200px" center class="Maglist-HairCar J-el-dialog__body J-dialog-vh">  
            <div class="J-detail J-inputBorder0 J-yx-error J-dialog-vh-body" > 
                <el-row class=" J-dialog-vh-content" :style="'max-height:'+(getScreenHeight-342)+'px;'">
                    <el-form ref="newModifyForm"  :rules="companyRules" :model="newModifyForm" >    
                        <el-row class="J-inputBorder0">
                            <div class="J-detail-title">
                                <div class="J-detail-title-yuan"></div>
                                运单信息    
                                <el-button  type="text" size="small" @click="showWaybill()"  style="padding-left:30px">查看更多信息 </el-button>
                            </div>
                            <el-col :span="6" >
                                <div class="labal">发货方</div>
                                 <div class="input J-borderBot">{{waybillDetail.consignorName}}</div>
                            </el-col>
                            <el-col :span="6" >
                                <div class="labal">收货方</div>
                                 <div class="input J-borderBot">{{waybillDetail.consigneeName}}</div>
                            </el-col>
                            <el-col :span="12" >
                                <div class="labal">收货地址</div>
                                 <div class="input J-borderBot">{{waybillDetail.consigneeProvinceName + waybillDetail.consigneeCityName  + waybillDetail.consigneeCountyName + waybillDetail.consigneeAddress}}</div>
                            </el-col>
                            <el-col :span="12" >
                                <div class="labal">费用</div>
                                <div class="input">{{waybillDetail.xfFee?'现付:' + waybillDetail.xfFee :''}}
                                    {{waybillDetail.dfFee?' 到付:' + waybillDetail.dfFee :''}}
                                    {{waybillDetail.hfFee?' 回付:' + waybillDetail.hfFee :''}}
                                    {{waybillDetail.yjFee?' 月结:' + waybillDetail.yjFee :''}}
                                    {{waybillDetail.hkFee?' 回扣:' + waybillDetail.hkFee :''}}
                                    {{waybillDetail.goodsFee?' 代收货款:' + waybillDetail.goodsFee :''}}
                                </div>
                            </el-col>
                            <el-col :span="12" >
                                <div class="labal">货物信息</div>
                                <div class="input">{{waybillDetail.goodsName}}，{{waybillDetail.pack}}，{{waybillDetail.goodsNum}}件，{{waybillDetail.goodsWeight? waybillDetail.goodsWeight + '公斤，' : ''}}{{waybillDetail.goodsBulk? waybillDetail.goodsBulk + '方' : '' }}</div>
                            </el-col>
                        </el-row>
                        <el-row class="J-inputBorder0">
                            <div class="J-detail-title">
                                <div class="J-detail-title-yuan"></div>
                                承运信息
                            </div>
                            <el-col :span="6" >
                                <div class="labal">承运方</div>
                                <div class="input J-elSelect J-borderBot">
                                    <el-form-item prop="transferName">
                                        <el-autocomplete
                                            placeholder="可通过名称、手机号查询"
                                            ref="transferName"
                                            value-key="name"
                                            select-when-unmatched
                                            v-model="newModifyForm.transferName"
                                            @select="handleTransferSelect"
                                            :fetch-suggestions="queryTransferSearch">
                                            <template slot-scope="{ item }">
                                                <span style="float: left;">{{ item.name }}</span>
                                                <span style="float: right; color: #8492a6; font-size: 13px;text-align: right;">{{ item.linkman }}</span>
                                            </template>
                                        </el-autocomplete>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">随车电话</div>
                                <div class="input J-borderBot"><el-form-item prop="driverMobile"> <el-input v-model="newModifyForm.driverMobile" type="text" placeholder="随车电话"></el-input></el-form-item></div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">结算重量(KG)</div>
                                <div class="input J-borderBot">
                                    <el-form-item prop="ddGoodsWeight">
                                    <el-input v-model="newModifyForm.ddGoodsWeight" type="text" placeholder="结算重量"></el-input>
                                     </el-form-item>
                                    </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">结算体积(方)</div>
                                <div class="input J-borderBot">
                                    <el-form-item prop="ddGoodsBulk">
                                        <el-input v-model="newModifyForm.ddGoodsBulk" type="text" placeholder="结算体积"></el-input>
                                  </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">专线查单号</div>
                                <div class="input J-borderBot"><el-input v-model="newModifyForm.zxWaybillNo" type="text" placeholder="专线查单号"></el-input></div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">预计发车时间</div>
                                <div class="input J-borderBot">
                                    <el-date-picker
                                    v-model="newModifyForm.expectSendTime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                    </el-date-picker>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">预计到达时间</div>
                                <div class="input J-borderBot">
                                    <el-date-picker
                                    v-model="newModifyForm.expectArriveTime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                    </el-date-picker>
                                </div>
                            </el-col>
                            <el-col :span="6" >
                                <div class="labal"></div>
                                <div class="input J-borderBot"></div>
                            </el-col>
                            <el-col :span="24">
                                <div class="labal">备注</div>
                                <div class="input ">
                                    <el-form-item prop="memo">
                                    <el-input v-model="newModifyForm.memo" type="text" placeholder=""></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row class=" J-inputBorder0">
                            <div class="J-detail-title">
                                <div class="J-detail-title-yuan"></div>
                                费用—合计：<span class="jinse-color"> {{ totalFee }} 元</span> 
                            </div>
                            <div class="J-detail-title-fl">
                                <div class="title-fl-sanj"></div><span>费用明细</span>
                            </div>
                            <el-col :span="6">
                                <div class="labal">运费</div>
                                <div class="input J-borderBot" ><el-form-item prop="ddZxSpecialFee"><el-input v-model="newModifyForm.ddZxSpecialFee" type="text"  clearable placeholder="运费"></el-input> </el-form-item></div>
                               
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">提货费</div>
                                <div class="input J-borderBot"><el-form-item prop="ddZxPickFee"><el-input v-model="newModifyForm.ddZxPickFee" type="text"  clearable placeholder="提货费"></el-input></el-form-item></div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">送货费</div>
                                <div class="input J-borderBot"><el-form-item prop="ddZxDeliverFee"><el-input v-model="newModifyForm.ddZxDeliverFee" type="text" clearable  placeholder="送货费"></el-input></el-form-item></div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">上楼费</div>
                                <div class="input J-borderBot">  <el-form-item prop="ddZxUpFee"><el-input v-model="newModifyForm.ddZxUpFee" type="text" clearable  placeholder="上楼费"></el-input></el-form-item></div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">装货费</div>
                                <div class="input "> <el-form-item prop="ddZxLoadFee"><el-input type="text" clearable  v-model="newModifyForm.ddZxLoadFee" placeholder="装货费"></el-input></el-form-item></div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">卸货费</div>
                                <div class="input "> <el-form-item prop="ddZxUnloadFee"><el-input type="text" clearable  v-model="newModifyForm.ddZxUnloadFee" placeholder="卸货费"></el-input></el-form-item></div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">进仓费</div>
                                <div class="input "> <el-form-item prop="ddZxInstoreFee"><el-input type="text" clearable  v-model="newModifyForm.ddZxInstoreFee" placeholder="进仓费"></el-input></el-form-item></div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal"></div>
                                <div class="input"></div>
                            </el-col>
                            <div class="J-detail-title-fl">
                                <div class="title-fl-sanj"></div><span>结算方式</span>
                                <span class="jinse-color" v-show="showXxFee"> 信息费 {{ xxFee }} 元</span> 
                            </div>
                            <el-col :span="6">
                                <div class="labal" >
                                    <el-button type="text" size="small" @click="payTypeSelect(1)">现付 </el-button>
                                </div>
                                <div class="input "> <el-form-item prop="ddXfFee"><el-input type="text" clearable  v-model="newModifyForm.ddXfFee" placeholder="现付"></el-input></el-form-item></div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">
                                    <el-button type="text" size="small" @click="payTypeSelect(2)">到付 </el-button>
                                </div>
                                <div class="input"> <el-form-item prop="ddDfFee"><el-input type="text" clearable  v-model="newModifyForm.ddDfFee" placeholder="到付"></el-input></el-form-item></div>                              
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">
                                    <el-button type="text"  size="small" @click="payTypeSelect(3)">回付 </el-button>
                                </div>
                                <div class="input"><el-form-item prop="ddHfFee"><el-input type="text" clearable  v-model="newModifyForm.ddHfFee" placeholder="回付"></el-input></el-form-item></div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">
                                    <el-button type="text" size="small" @click="payTypeSelect(4)">月结 </el-button>
                                </div>
                                <div class="input"><el-form-item prop="ddYjFee"><el-input type="text" clearable v-model="newModifyForm.ddYjFee" placeholder="月结"></el-input></el-form-item></div>
                            </el-col>
                        </el-row>
                        <el-row class=" J-inputBorder0">
                            <div class="J-detail-title">
                                运单运费：<span class="jinse-color"> {{ waybillDetail.totalFee }} 元</span>
                                ， 回扣：<span class="jinse-color"> {{ this.waybillDetail.hkFee ? this.waybillDetail.hkFee : 0 }} 元</span>
                                ， 短驳成本：<span class="jinse-color"> {{ this.waybillDetail.cbPickFee ? this.waybillDetail.cbPickFee : 0 }} 元</span>
                                ， 调度毛利：<span class="jinse-color"> {{ profitFee }} 元</span>
                                ， 利润率：<span class="jinse-color"> {{ profitFeeRate }}%</span>
                            </div>
                        </el-row>
                    </el-form>
                </el-row>
                <div class="J-dialog-vh-submission" > 
                <!-- <div class="J-dialog-vh-submission" :style="getScreenHeight-342<=334?'box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)':''" > -->
                    <el-button type="primary" class="J-ml-30" :loading="savingFlag" @click="submitDispatch('newModifyForm')">保存</el-button>
                </div>  
            </div>
        </el-dialog>
        <!-- 修改提示框 -->
        <el-dialog title="修改原因/审核"
            :visible.sync="dialog.dispatchModifyVisible"
            width="40%"
            center
            :modal=false
            :close-on-click-modal=false
            @open="openEventDispatchModifyDialog"
            @close="closeEventDispatchModifyDialog">
            <el-form label-width="90px">
                <el-form-item label="修改原因：">
                    <el-input ref="reason" v-model="newModifyForm.reason" ></el-input>
                </el-form-item>
                <el-form-item label="审核人：" v-if="dialog.dispatchModifyVisible" >
                    <v-auditorSelect @auditorSelect='selectAuditEmployee'></v-auditorSelect> 
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.dispatchModifyVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDispatch" :loading="savingFlag">确 定</el-button>
            </span>
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
import auditorSelect from '@/widget/auditorSelect'
export default {
    props: ["waybillId","addFlag"],
    mixins:[Base,List],
    components: {    
        'v-auditorSelect':auditorSelect,
        "waybillNo-component": waybillNoComponent,
    },
    data() {
        return {
            showDialog:true,
            newModifyTitle:'专线调度',
            newModifyForm:{
                waybillId: this.waybillId,
                transferName:'',
                zxWaybillNo:'',
                driverMobile:'',
                ddGoodsWeight:'',
                ddGoodsBulk:'',

                ddZxSpecialFee:'',
                ddZxPickFee:'',
                ddZxDeliverFee:'',
                ddZxLoadFee:'',
                ddZxUnloadFee:'',
                ddZxInstoreFee:'',
                ddZxUpFee:'',

                ddXfFee:'',
                ddDfFee:'',
                ddHfFee:'',
                ddYjFee:'',
                
                expectSendTime:'',
                expectArriveTime:'',
                memo:'',
                reason:'',
                auditEmployeeIds:[]//审核人员Tags
            },
            base: {
                zxList:[]
            },
            dialog:{
                dispatchModifyVisible:false
            },
            savingFlag:false,
            //运单信息
            waybillDetail:{},
            companyRules:{
                transferName: [
                    { required: true, message: '请选择承运方' ,trigger: ['blur', 'change']}
                ], 
                ddGoodsWeight: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddGoodsBulk: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddZxSpecialFee: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddZxPickFee: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddZxDeliverFee: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddZxLoadFee: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddZxUnloadFee: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddZxInstoreFee: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddZxUpFee: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddXfFee: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddDfFee: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddHfFee: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                 ddYjFee: [
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                memo: [
                    { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
                ],
                driverMobile:[
                    { validator: this.linkmanMobileRules,trigger: ['blur', 'change'] }    
                ]
                
            },
            //运单详情框
            openWaybill: {
                waybillNo: "",
                waybillId: "",
                statusText: "",
                visiable: false
            },

            showXxFee:false
        };
    },
    computed: {
        //运费
        totalFee: function () {
            return (
                  Number(this.newModifyForm.ddZxSpecialFee ? this.newModifyForm.ddZxSpecialFee : 0) 
                + Number(this.newModifyForm.ddZxPickFee ? this.newModifyForm.ddZxPickFee : 0) 
                + Number(this.newModifyForm.ddZxDeliverFee ? this.newModifyForm.ddZxDeliverFee : 0) 
                + Number(this.newModifyForm.ddZxLoadFee ? this.newModifyForm.ddZxLoadFee : 0) 
                + Number(this.newModifyForm.ddZxUnloadFee ? this.newModifyForm.ddZxUnloadFee : 0) 
                + Number(this.newModifyForm.ddZxInstoreFee ? this.newModifyForm.ddZxInstoreFee : 0) 
                + Number(this.newModifyForm.ddZxUpFee ? this.newModifyForm.ddZxUpFee : 0) )
        },
        //信息费
        xxFee: function () {
            return (
                  Number(this.waybillDetail.dfFee ? this.waybillDetail.dfFee : 0) 
                - Number(this.newModifyForm.ddDfFee ? this.newModifyForm.ddDfFee : 0) )
        },
        //毛利
        profitFee: function() {
            return this.waybillDetail.totalFee 
                - Number(this.waybillDetail.cbPickFee ? this.waybillDetail.cbPickFee : 0) 
                - Number(this.waybillDetail.hkFee ? this.waybillDetail.hkFee : 0) 
                - this.totalFee
        },
        //利润率
        profitFeeRate(){

             if (this.waybillDetail.totalFee == 0) {
                return 0
            } else {
                return ((this.profitFee / this.waybillDetail.totalFee) *100).toFixed(2);
            }
        }
    },
    methods:{
        /**
         * 审核人员选择回调事件
         */
        selectAuditEmployee(employeeList) {
            var eIds = employeeList.map( (v,i) => v.id)
            this.newModifyForm.auditEmployeeIds = eIds
        },
                /**
         * 修改运单审核窗口打开事件
         */
        async openEventDispatchModifyDialog() {
            //修改, 修改前检测是否需要介入审核选项-先不考虑这个判断
            // const { code, data, message } = await api.post('/dp/edit/check?id='+this.addForm.id)
            // if (code === '200') {
            //     if (data == true) {
            //         //需要审核，显示选择审核流程选择
            //         //TODO:: 显示选择审核流程选择
            //     }
            // }
        },
        closeEventDispatchModifyDialog(){
            this.newModifyForm.reason = ''
        },
        //新增 或修改 保存时
        submitDispatch(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.addFlag){
                        this.addDispatch()
                    } else {
                        this.dialog.dispatchModifyVisible = true
                    }
                } else {
                    return false;
                }
            });
            
        }, 
        addDispatch() {
            this.savingFlag=true
            api.post('/dp/add/zx', this.newModifyForm).then(data=>{
                if(data.code==="200"){
                    this.showDialog = false
                    this.$message({type: 'success',message: '专线调度保存成功!'});
                    this.$emit('reloadData',true)
                }
            }).then(() => { 
                this.savingFlag=false             
            })    

        },
        //修改
        async editDispatch() {

            if (this.savingFlag) {
                return;
            }

            this.$confirm('确定要【保存】修改, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then( async() => {

                this.savingFlag = true

                let nextFlag = false;
                //检测是否需要强制进行审核
                const result = await api.post('/dp/edit/check?id='+this.waybillId)
                if (result.code === '200') {
                    if (result.data == true) {
                        //需要审核，
                        if (this.newModifyForm.auditEmployeeIds.length == 0 ) {
                            this.$message.error({message: '调度修改时需要审核，请选择审核人员！'});
                        } else {
                            nextFlag = true;
                        }
                    } 
                }

                if (nextFlag) {
                    const { code, data, message } = await api.post('/dp/edit/zx', this.newModifyForm)
                    if(code==='200'){
                        //关闭弹窗
                        this.dialog.dispatchModifyVisible = false
                        this.showDialog = false
                        //关闭运单修改界面
                        this.$emit('reloadData',true)
                        this.$message({type: 'success',message: '专线调度保存成功!'});
                    }
                }

                this.savingFlag=false      
                  
            }).catch(() => {
            })
        },
        handleTransferSelect(item) {
            //在未选择建议项时，item的内容为输入的数据，而不是列表内容
            if (item.name)  {
                this.newModifyForm.transferName = item.name
                this.newModifyForm.transferId = item.id
            }
        },
        queryTransferSearch(queryString, cb) {
            api.get('/zx/list/ddl?word=' + queryString).then(data=>{
                if (data.code === '200') {
                    this.base.zxList = data.data;
                } else {
                    this.base.zxList = [];
                }
                cb(this.base.zxList);
            })
        },
        loadData() {

            //加载运单信息 + 调度信息
            api.get('/dp/detail?waybillId=' + this.waybillId).then(data=>{
                if (data.code === '200') {
                    this.waybillDetail = data.data;
                    
                    this.newModifyForm.transferName=data.data.transferName
                    this.newModifyForm.zxWaybillNo=data.data.zxWaybillNo
                    this.newModifyForm.linkman=data.data.linkman
                    this.newModifyForm.linkmanMobile=data.data.linkmanMobile
                    this.newModifyForm.driverMobile=data.data.driverMobile

                    this.newModifyForm.ddGoodsWeight=data.data.ddGoodsWeight
                    this.newModifyForm.ddGoodsBulk=data.data.ddGoodsBulk
                    
                    this.newModifyForm.ddZxSpecialFee=data.data.ddZxSpecialFee
                    this.newModifyForm.ddZxPickFee=data.data.ddZxPickFee
                    this.newModifyForm.ddZxDeliverFee=data.data.ddZxDeliverFee
                    this.newModifyForm.ddZxLoadFee=data.data.ddZxLoadFee
                    this.newModifyForm.ddZxUnloadFee=data.data.ddZxUnloadFee
                    this.newModifyForm.ddZxInstoreFee=data.data.ddZxInstoreFee
                    this.newModifyForm.ddZxUpFee=data.data.ddZxUpFee

                    this.newModifyForm.ddXfFee=data.data.ddXfFee
                    this.newModifyForm.ddDfFee=data.data.ddDfFee
                    this.newModifyForm.ddHfFee=data.data.ddHfFee
                    this.newModifyForm.ddYjFee=data.data.ddYjFee
                    
                    this.newModifyForm.expectSendTime=data.data.expectSendTime
                    this.newModifyForm.expectArriveTime=data.data.expectArriveTime
                    this.newModifyForm.memo=data.data.memo

                    if(this.addFlag){

                        this.newModifyForm.ddGoodsWeight=data.data.goodsWeight
                        this.newModifyForm.ddGoodsBulk=data.data.goodsBulk
                        this.newModifyForm.ddDfFee=data.data.dfFee
                        this.newModifyForm.ddZxSpecialFee=data.data.dfFee

                        this.newModifyTitle='专线调度-' + this.waybillDetail.waybillNo
                    } else {

                        this.newModifyTitle='专线调度-修改' + this.waybillDetail.waybillNo
                    }

                    //运单到付
                    this.showXxFee = this.waybillDetail.payType == 2
                }
            })
        },
        showWaybill() {
            this.openWaybill.waybillNo = this.waybillDetail.waybillNo;
            this.openWaybill.waybillId =  this.waybillDetail.waybillId;
            this.openWaybill.statusText = this.waybillStatusTxt( this.waybillDetail.status);
            this.openWaybill.visiable = true;
        }, 
        payTypeSelect(type) {
            this.newModifyForm.ddXfFee=''
            this.newModifyForm.ddDfFee=''
            this.newModifyForm.ddHfFee=''
            this.newModifyForm.ddYjFee=''

            switch (type) {
                case 1: {
                    this.newModifyForm.ddXfFee=this.totalFee
                }break;
                case 2: {
                    this.newModifyForm.ddDfFee=this.totalFee
                }break;
                case 3: {
                    this.newModifyForm.ddHfFee=this.totalFee
                }break;
                case 4: {
                    this.newModifyForm.ddYjFee=this.totalFee
                }break;
                default:
                    break;
            }
        }
    },
    created(){
        this.loadData()
    }
};
</script>
