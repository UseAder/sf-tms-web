
<template>
    <div>
        <div class="J-elTable-right-title ">
            退货跟踪
            </div>
        <div class="J-inputBorder0 " style="padding:0 15px;border-bottom:1px solid #ebeef5;"> 
            <el-row>
                <el-col :span="24" class="J-flex" style="height:25px; line-height: 25px;">
                    <div style="width:80px">电商订单号</div>
                    <div style="  width:280px; overflow: hidden;">{{orderNo}}</div>
                    <el-button style="margin-top: -4px;" type="text" size="small" @click="showWaybillDetail()">查看清单</el-button>
                </el-col>
            </el-row>
        </div>   
        <el-form :rules="anomalyTrackRules"  :model="backGoodsTrackForm" ref="backGoodsTrackForm" label-width="84px" :inline="true" style="padding-top:6px" class="demo-form-inline"> 
            <div class="J-flex">
                <el-form-item label="操作" prop="status" label-width="55px" class="select-status">
                    <el-select v-model="backGoodsTrackForm.status" placeholder=" ">
                        <el-option
                            v-for="item in base.backGoodsStatus"
                            :key="item.value"
                            :label="item.code"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="操作时间" prop="trackTime" class="select-time">
                    <el-date-picker
                        v-model="backGoodsTrackForm.trackTime"
                            type="datetime"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                    </el-date-picker>
                </el-form-item>
            </div>
            <div class="J-flex textarea_checkbox">
                <el-form-item label="跟踪内容" prop="content">
                    <el-input style="width:355px" type="textarea" autosize v-model="backGoodsTrackForm.content"></el-input>
                </el-form-item> 
            </div>
        </el-form>     

        <span class="dialog-footer" >
            <el-button type="primary" v-if="checkHasPermission('back_truck:sms')" @click='sendingSmsFun'>发送短信</el-button>
            <el-button type="primary" v-if="checkHasPermission('back_truck:apply')" @click='registrationOfFeesFun'>费用申请</el-button>
            <el-button type="danger" :loading="savingFlag" v-if="checkHasPermission('back_truck:create')" @click="preservation('backGoodsTrackForm')">保 存</el-button>
            <el-button type="primary" v-if="checkHasPermission('back_truck:fileup')" @click='uploadFilesFun'>凭证上传</el-button>
            <el-button type="primary" v-if="checkHasPermission('back_truck:sign')" @click='backSignClick'>签单实收</el-button>
        </span>
        <div class="J-trackMessage">
            <div class="J-trackMessage-body" :style="'max-height:'+(this.$store.getters.getScreenHeight-jElTableOffsetTop-138)+'px;'">
                <div  class="J-trackMessage-list" v-for="item in tableData" :key="item.index" >
                    <div class="J-trackMessage-bt">
                        <div class="J-trackMessage-bt-left">
                            <div class="J-trackMessage-title-time">
                                {{item.trackTime}}
                            </div>
                            <div class="J-trackMessage-title-name">
                                {{item.createEmployeeName}}
                            </div>
                        
                            <div class="J-trackMessage-title-name">  
                                <template v-if="item.status">
                                    <div style="height: 30px;line-height: 30px;padding: 6px;">
                                        <div v-html="statusBackgroundTrack(backGoodsStatus(item.status))" class="J-statusBackground"></div>     
                                    </div> 
                                </template>
                            </div>
                        </div>
                        <div class="J-trackMessage-bt-left">
                            <el-button type="text" size="small" v-if="checkHasPermission('back_truck:delete')" @click="deleteSignFun(item)" >删除</el-button>   
                        </div>
                    </div>
                    <div class="J-trackMessage-contentt">
                        {{item.content}}
                    </div>      
                </div>
            </div>
        </div>
        <v-registrationOfFees :dialog.sync='openRegistrationOfFees.visible' :waybillNo='waybillNo' :waybillId='waybillId' v-if="openRegistrationOfFees.visible"></v-registrationOfFees>
        <v-sendingSms :pVisible.sync='openSendingSms.visible' :pWaybillId='waybillId' :pWaybillNo='waybillNo' v-if="openSendingSms.visible"></v-sendingSms>
        <v-uploadFiles :pVisible.sync='openUploadFiles.visible' pTabName='qdTab' :pWaybillId='waybillId' v-if="openUploadFiles.visible"></v-uploadFiles>
        
        <v-BackSign :pVisible.sync='backSign.visible' :waybillId='waybillId' v-if="backSign.visible"></v-BackSign>
        <waybillNo-component :showFlag.sync='showWaybill.visible' :waybillNo='showWaybill.waybillNo' :statusText='showWaybill.statusText' :waybillId='showWaybill.waybillId' v-if="showWaybill.visible"></waybillNo-component>
    </div>
</template>

<script>
    import List from "@/utils/list.js";
    import Base from "@/utils/base.js";
    import api from '@/utils/api.js'
    import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue"
    import waybillBackSign from '@/components/TrackingS/waybillBackSign.vue'
    import registrationOfFeesDialog from '@/components/Common/registrationOfFees.vue'
    import sendingSmsDialog from '@/components/Common/sendingSms.vue'
    import uploadFilesDialog from '@/components/Common/uploadFiles.vue'
    export default {
    mixins: [Base,List],
    props: ['waybillNo','waybillId','backId','convertWaybillStatus'],
    components: {
        "waybillNo-component": waybillNoComponent,
        'v-BackSign' : waybillBackSign,
        'v-registrationOfFees':registrationOfFeesDialog,
        'v-sendingSms':sendingSmsDialog,
        'v-uploadFiles':uploadFilesDialog
    },
    data() {
        return {
            //定义convert对象 表示需要转换一个属性，因为每当父组件重新呈现时，该值都将被覆盖
            convert:{
                waybillStatus:''   
            },
            backGoodsTrackForm:{
                waybillId:'',
                waybillNo:'',
                content:'',
                status:'',
                trackTime:'',
                backId:''
            },
            tableData: [], //专线对账 表格
            //费用申请
            openRegistrationOfFees:{
                visible:false,
            },
            //发送短信
            openSendingSms:{
                visible:false,
            },
            //上传文件
            openUploadFiles:{
                visible:false,
            },
            //查看清单
            showWaybill:{
                visible:false,
                waybillNo:'',
                statusText:'',
                waybillId:'',

            },
            //签单实收
            backSign:{
                visible:false,
            },
            //orderNo
            orderNo:'',
            anomalyTrackRules: {
            
                content: [
                    { required: true, message: '请输入跟踪内容' ,trigger: ['blur', 'change'] },
                     { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
                ],
            }
        }
    },
    watch:{
        //当传递过来的数据变化时
        waybillNo () {
            if (this.waybillNo) {
                this.ycTrackDataCreated()  
                this.$refs['backGoodsTrackForm'].resetFields();    
                this.convert.waybillStatus=this.convertWaybillStatus
            }
        }
    },
    methods: {
        showWaybillDetail() {
            this.showWaybill.waybillId = this.waybillId
            this.showWaybill.waybillNo = this.waybillNo
            this.showWaybill.statusText = this.waybillStatusTxt(this.convert.waybillStatus);
            this.showWaybill.visible = true
        },     

        //费用申请
        registrationOfFeesFun(){
            this.openRegistrationOfFees.visible=true
        },
        //发送短信
        sendingSmsFun(){
            this.openSendingSms.visible=true
        },
        //上传文件
        uploadFilesFun(){
            this.openUploadFiles.visible=true
        },
        
        backSignClick() {
            this.backSign.visible = true
        },
        preservation(formName){
            if (!this.waybillNo) {
                this.$message({
                    type: 'error',
                    message: '暂无运单数据!'
                });
                return
            }
            this.$refs[formName].validate( async(valid) => {
                if (valid) {
                    this.backGoodsTrackForm.waybillId=this.waybillId
                    this.backGoodsTrackForm.waybillNo=this.waybillNo
                    this.backGoodsTrackForm.backId=this.backId
                    this.savingFlag=true
                    const { code, message,data } =await api.post('/goods/track/back/goods/add', this.backGoodsTrackForm)
                    this.savingFlag=false
                    if(code==200){
                        this.$message({
                            type: 'success',
                            message: '运单跟踪成功!'
                        });
                        this.$refs[formName].resetFields();
                        this.$emit('upData', true)
                        this.ycTrackDataCreated()
                    }         
                } else {
                    return false;
                }
            });
                
        },
        //删除
        deleteSignFun(row){
            this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center:true,
            type: 'warning'
                }).then(async () => {
                    const { code, message,data } =await api.post('/goods/track/back/goods/delete',row.id)
                    if(code == "200"){
                        this.ycTrackDataCreated()            
                    }
                }) 
        },    
        async ycTrackDataCreated() {//获取页面初始数据    
            const { code, message,data } =await api.get('/goods/track/back/goods/item/list?waybillId='+this.waybillId)
            if(code==="200"){
                this.tableData = data.waybillBackGoodsItemOut;
                if(data.orderNo !='null'){
                    this.orderNo = data.orderNo
                }else{
                    this.orderNo= ''
                }

                
            }
        }
    },
};
</script>


