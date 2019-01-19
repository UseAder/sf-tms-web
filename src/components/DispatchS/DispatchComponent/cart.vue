<template>
    <div class="J-detail"> 
        <el-dialog :title="newModifyTitle" :close-on-click-modal=false :visible.sync="showDialog" @close="$emit('update:showFlag', false)" 
             width="1200px" center class="Maglist-HairCar J-el-dialog__body J-dialog-vh"> 
            <div class="J-detail J-inputBorder0 J-yx-error J-dialog-vh-body" >
                <el-row class=" J-dialog-vh-content" :style="'max-height:'+(getScreenHeight-342)+'px;'">
                    <el-form ref="newModifyForm"  :rules="cartRules" :model="newModifyForm" > 
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
                                <div class="labal">车牌号</div>
                                <div class="input J-elSelect J-borderBot">
                                    <el-form-item prop="transferName">
                                        <el-autocomplete
                                        placeholder="车牌号"
                                        ref="transferName"
                                        value-key="plateNumber"
                                        select-when-unmatched
                                        v-model="newModifyForm.transferName"
                                        @select="handlePlateNumberSelect"
                                        :fetch-suggestions="queryPlateNumberSearch">
                                            <template slot-scope="{ item }">
                                                <span style="float: left;">{{ item.plateNumber }}</span>
                                                <span style="float: right; color: #8492a6; font-size: 13px;text-align: right;">{{ item.driverName }}</span>
                                            </template>
                                        </el-autocomplete>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">司机名称</div>
                                <div class="input J-borderBot">
                                    <el-form-item prop="linkman">
                                        <el-input placeholder="司机名称" v-model="newModifyForm.linkman"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">联系手机</div>
                                <div class="input J-borderBot">
                                    <el-form-item prop="linkmanMobile">
                                        <el-input placeholder="联系手机" v-model="newModifyForm.linkmanMobile"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">车型</div>
                                <div class="input J-borderBot">
                                    <el-select ref="truckType"
                                                v-model="newModifyForm.truckType" automatic-dropdown placeholder="">
                                        <el-option
                                                v-for="item in base.truckTypeOptions"
                                                :key="item.value"
                                                :label="item.item"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
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
                            <el-col :span="6" >
                                <div class="labal"></div>
                                <div class="input J-borderBot"></div>
                            </el-col>
                            <el-col :span="24"> 
                            <div class="labal">备注</div>
                                <div class="input ">
                                    <el-form-item prop="memo">
                                    <el-input v-model="newModifyForm.memo" type="text" placeholder="备注"></el-input>
                                    </el-form-item>
                               </div>
                            </el-col>
                        </el-row>
                    
                        <el-row class="J-inputBorder0">
                            <div class="J-detail-title">
                                <div class="J-detail-title-yuan"></div>
                                大车费—合计：<span class="jinse-color"> {{ totalFee }} 元</span>
                            </div>
                            <div class="carT-content">
                                <div class="carT-xf">
                                    <div class="labal">现付</div>
                                    <div class="input J-flex ">
                                        <span class="carT-xf-label">现金</span>
                                        <span class="jinse-color"> <el-form-item prop="ddXfXjFee"><el-input  v-model="newModifyForm.ddXfXjFee" type="text" clearable  placeholder="输入"></el-input>元  </el-form-item></span>
                                        <span class="carT-xf-xian">/</span>
                                        <span class="carT-xf-label">油卡</span>
                                        <span class="jinse-color"> <el-form-item prop="ddXfYkFee"><el-input v-model="newModifyForm.ddXfYkFee" type="text" clearable  placeholder="输入"></el-input> 元</el-form-item></span> 
                                    </div>
                                </div>
                                 <el-col :span="8">
                                    <div class="labal">到付</div>
                                    <div class="input"> <el-form-item prop="ddDfFee"><el-input v-model="newModifyForm.ddDfFee" type="text" clearable  placeholder="输入金额"></el-input> </el-form-item></div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="labal">回付</div>
                                    <div class="input"><el-form-item prop="ddHfFee"><el-input v-model="newModifyForm.ddHfFee" type="text" clearable  placeholder="输入金额"></el-input> </el-form-item></div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="labal">押金</div>
                                    <div class="input"><el-form-item prop="ddYajFee"><el-input v-model="newModifyForm.ddYajFee" type="text" clearable  placeholder="输入金额"></el-input> </el-form-item></div>
                                </el-col>
                            </div>
                            
                        </el-row>
                        <el-row class="J-inputBorder0">
                            <div class="J-detail-title">
                                <div class="J-detail-title-yuan"></div>
                                整车投保
                            </div>
                            <el-col :span="6">
                                <div class="labal">货物价值</div>
                                <div class="input "><el-form-item prop="tbGoodsValue"><el-input v-model="newModifyForm.tbGoodsValue" type="text" placeholder="货物价值"></el-input></el-form-item></div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">保价费</div>
                                <div class="input "><el-form-item prop="tbPremiumFee"><el-input v-model="newModifyForm.tbPremiumFee" type="text" placeholder="保价费"></el-input></el-form-item></div>
                            </el-col>
                            <el-col :span="6" >
                                <div class="labal">保险公司</div>
                                <div class="input J-elSelect ">
                                <el-select v-model="newModifyForm.tbCompany" placeholder="请选择">
                                <el-option
                                    v-for="item in base.bxgsOption"
                                    :key="item.value"
                                    :label="item.code"
                                    :value="item.value">
                                </el-option>
                                </el-select>
                            </div>
                            </el-col>
                        </el-row>
                        <el-row class="J-inputBorder0">
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
                <!-- <div class="J-dialog-vh-submission" :style="getScreenHeight-342<=334?'box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)':''" > -->
                <div class="J-dialog-vh-submission" >     
                    <el-button type="primary" class="J-ml-30" @click="submitDispatch('newModifyForm')" >保存</el-button>
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
import auditorSelect from '@/widget/auditorSelect'
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

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
            newModifyTitle:'整车调度',
            newModifyForm:{ 
                waybillId: this.waybillId,
                transferName:'',
                linkman:'',
                linkmanMobile:'',
                truckType:'',
                expectSendTime:'',
                expectArriveTime:'',
                tbGoodsValue:'',
                tbPremiumFee:'',
                tbCompany:'',
                memo:'',

                ddXfXjFee:'',
                ddXfYkFee:'',
                ddDfFee:'',
                ddHfFee:'',
                ddYajFee:'',
                auditEmployeeIds:[]
            },
            base: {
                carList:[],
                truckTypeOptions:[]
            },
            dialog:{
                dispatchModifyVisible:false
            },
            //运单信息
            waybillDetail:{},
            cartRules:{
                transferName: [
                    { required: true, message: '请选择车牌号' ,trigger: ['blur', 'change']},
                    { validator: this.plateNumberRules,trigger: ['blur', 'change'] }     
                ],
                linkman: [
                    { required: true, message: '请输入司机名称' ,trigger: ['blur', 'change']}
                ],
                linkmanMobile: [
                    { required: true, message: '请输入联系手机' ,trigger: ['blur', 'change']},
                    { validator: this.linkmanMobileRules,trigger: ['blur', 'change'] }     
                ],
               ddXfXjFee:[
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                ddXfYkFee:[
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                  ddDfFee:[
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                  ddHfFee:[
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                  ddYajFee:[
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],

                tbGoodsValue:[
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                tbPremiumFee:[
                    { validator: this.numberRules, trigger: ['blur', 'change']},
                ],
                memo:[
                    { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
                ]
 
            },
            //运单详情框
            openWaybill: {
                waybillNo: "",
                waybillId: "",
                statusText: "",
                visiable: false
            },
        };
    },
    computed: {
        //大车运费
        totalFee: function () {
            return(Number(this.newModifyForm.ddXfXjFee ? this.newModifyForm.ddXfXjFee : 0) 
                + Number(this.newModifyForm.ddXfYkFee ? this.newModifyForm.ddXfYkFee : 0) 
                + Number(this.newModifyForm.ddDfFee ? this.newModifyForm.ddDfFee : 0) 
                + Number(this.newModifyForm.ddHfFee ? this.newModifyForm.ddHfFee : 0) 
                + Number(this.newModifyForm.ddYajFee ? this.newModifyForm.ddYajFee : 0))
        },
        //毛利
        profitFee: function() {
            return this.waybillDetail.totalFee - Number(this.waybillDetail.hkFee ? this.waybillDetail.hkFee : 0)  - this.totalFee
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
    watch: {

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
            // const { code, data, message } = await api.post('/waybill/edit/check?id='+this.addForm.id)
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
        async submitDispatch(formName){
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
        async addDispatch() {

            const { code, message,data } =await api.post('/dp/add/truck', this.newModifyForm)
            if(code==="200"){
                this.showDialog = false
                //关闭弹窗
                this.$message({type: 'success',message: '整车调度保存成功!'});
                this.$emit('reloadData',true)
            }
        },
        //修改
        editDispatch() {

            if (this.savingFlag) {
                return;
            }

            this.$confirm('确定要【保存】修改, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(async() => {
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
                    const { code, data, message } = await api.post('/dp/edit/truck', this.newModifyForm)
                    if(code =='200'){
                        //关闭弹窗
                        this.dialog.dispatchModifyVisible = false
                        this.showDialog = false
                        //关闭运单修改界面
                        this.$emit('reloadData',true)
                        this.$message({type: 'success',message: '整车调度保存成功!'});
                    }
                }

                this.savingFlag=false   

            }).catch(() => {
            })
        },
        handlePlateNumberSelect(item) {
            //在未选择建议项时，item的内容为输入的数据，而不是列表内容
            if (item.plateNumber)  {
                this.newModifyForm.linkman = item.driverName
                this.newModifyForm.linkmanMobile = item.driverMobile
                if(item.truckType) {
                    this.newModifyForm.truckType = item.truckType.toString()
                }
            }
        },
        queryPlateNumberSearch(queryString, cb) {
            api.get('/car/list/ddl?word=' + queryString).then(data=>{
                if (data.code === '200') {
                    this.base.carList = data.data;
                } else {
                    this.base.carList = [];
                }
                cb(this.base.carList);
            })
        },
        loadData() {

            
            //加载车型数据
            api.get('/system/dic/code?code=TRUCK_TYPE').then(data=>{
                if (data.code === '200') {
                    this.base.truckTypeOptions = data.data;
                } 
            })
            //加载运单信息+调度信息
            api.get('/dp/detail?waybillId=' + this.waybillId).then(data=>{
                if (data.code === '200') {
                    this.waybillDetail = data.data;

                    this.newModifyForm.transferName=data.data.transferName
                    this.newModifyForm.linkman=data.data.linkman
                    this.newModifyForm.linkmanMobile=data.data.linkmanMobile
                    this.newModifyForm.truckType=data.data.truckType?data.data.truckType.toString() : ''
                    this.newModifyForm.expectSendTime=data.data.expectSendTime
                    this.newModifyForm.expectArriveTime=data.data.expectArriveTime
                    this.newModifyForm.tbGoodsValue=data.data.tbGoodsValue
                    this.newModifyForm.tbPremiumFee=data.data.tbPremiumFee
                    this.newModifyForm.tbCompany=data.data.tbCompany
                    this.newModifyForm.memo=data.data.memo

                    this.newModifyForm.ddXfXjFee=data.data.ddXfXjFee
                    this.newModifyForm.ddXfYkFee=data.data.ddXfYkFee
                    this.newModifyForm.ddDfFee=data.data.ddDfFee
                    this.newModifyForm.ddHfFee=data.data.ddHfFee
                    this.newModifyForm.ddYajFee=data.data.ddYajFee

                    if(this.addFlag){
                        this.newModifyTitle='整车调度-' + this.waybillDetail.waybillNo
                    }else{
                        this.newModifyTitle='整车调度-修改' + this.waybillDetail.waybillNo
                    }
                }
            })
        },
        showWaybill() {
            this.openWaybill.waybillNo = this.waybillDetail.waybillNo;
            this.openWaybill.waybillId =  this.waybillDetail.waybillId;
            this.openWaybill.statusText = this.waybillStatusTxt( this.waybillDetail.status);
            this.openWaybill.visiable = true;
        }, 
    },
    created(){
        this.loadData()
    },
};
</script>
