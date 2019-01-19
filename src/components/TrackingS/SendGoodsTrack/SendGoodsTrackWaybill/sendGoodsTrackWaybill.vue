<template>
    <div>
        <div class="J-elTable-right-title ">
            运单跟踪
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
        <el-form :rules="sendGoodsTrackRules" :model="sendGoodsTrackForm" ref="sendGoodsTrackForm" label-width="84px" :inline="true" style="padding-top: 6px;" class="demo-form-inline">
            <div class="J-flex ">
                <el-form-item label="操作"  prop="waybillStatus" label-width="55px" class="select-status">
                    <el-select v-model="sendGoodsTrackForm.waybillStatus" placeholder=" " >
                        <el-option
                            v-for="item in base.goodsTrackStatus"
                            :key="item.value"
                            :label="item.code"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="操作时间" prop="trackTime" class="select-time">
                    <el-date-picker
                        v-model="sendGoodsTrackForm.trackTime"
                            type="datetime"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                    </el-date-picker>
                </el-form-item>
            </div>
            <div class="J-flex textarea_checkbox">
                <el-form-item label="跟踪内容" prop="content" class="J-width">
                    <el-input type="textarea" autosize v-model="sendGoodsTrackForm.content"></el-input>
                </el-form-item>
                <el-form-item label="" prop="visibleFlag" style="" >
                    <el-checkbox v-model="sendGoodsTrackForm.visibleFlag">客户可见</el-checkbox>
                </el-form-item>   
            </div>
        </el-form>     

        <span class="dialog-footer">
            <el-button type="primary" v-if="checkHasPermission('send_truck:sms')" @click='sendingSmsFun'>发送短信</el-button>
            <el-button type="primary" v-if="checkHasPermission('send_truck:apply')" @click='registrationOfFeesFun'>费用申请</el-button>
             <el-button type="danger" :loading="savingFlag" v-if="checkHasPermission('send_truck:create')" @click="preservation('sendGoodsTrackForm')">保 存</el-button>
            <el-button type="primary" v-if="checkHasPermission('send_truck:fileup')" @click='uploadFilesFun'>凭证上传</el-button>
            <el-button type="primary" v-if="checkHasPermission('send_truck:sign')" @click='sendSignClick'>签单实收</el-button>
        </span>
        <div class="J-trackMessage" >
            <div class="J-trackMessage-body" :style="'max-height:'+(this.$store.getters.getScreenHeight-jElTableOffsetTop-135)+'px;'">
                <div  class="J-trackMessage-list" v-for="item in tableData" :key="item.index" >
                    <div class="J-trackMessage-bt">
                        <div class="J-trackMessage-bt-left">
                            <div class="J-trackMessage-title-time">
                                {{item.trackTime}}
                            </div>
                            <div class="J-trackMessage-title-name">
                                {{item.employeeName}}
                            </div>
                        
                            <div>  
                                <template v-if="item.waybillStatus">
                                    <div style="height: 30px;line-height: 30px;padding: 6px;">
                                        <div v-html="statusBackgroundTrack(goodsTrackStatusItem(item.waybillStatus))" class="J-statusBackground"></div>     
                                    </div> 
                                </template> 
                            </div>

                            <div>  
                                <div style="height: 30px;line-height: 30px;padding: 6px;">
                                    <div v-html="statusBackgroundTrack(visibleFlag(item.visibleFlag))" class="J-statusBackground"></div>     
                                </div> 
                            </div>
                        </div>
                        <div class="J-trackMessage-bt-left">
                            <el-button type="text" size="small" v-if="checkHasPermission('send_truck:delete')" @click="deleteSignFun(item)" >删除</el-button>   
                        </div>
                    </div>
                    <div class="J-trackMessage-content">
                        {{item.content}}
                    </div>      
                </div>
            </div>
        </div>        
        <v-registrationOfFees :dialog.sync='openRegistrationOfFees.visible' :waybillNo='waybillNo' :waybillId='waybillId' v-if="openRegistrationOfFees.visible"></v-registrationOfFees>
        <v-sendingSms :pVisible.sync='openSendingSms.visible' :pWaybillId='waybillId' :pWaybillNo='waybillNo' v-if="openSendingSms.visible"></v-sendingSms>
        <v-uploadFiles :pVisible.sync='openUploadFiles.visible' pTabName='qdTab' :pWaybillId='waybillId' v-if="openUploadFiles.visible"></v-uploadFiles>
        <v-SendSign :pVisible.sync='sendSign.visible' :waybillId='waybillId'  v-if="sendSign.visible"></v-SendSign>
        <waybillNo-component :showFlag.sync='showWaybill.visible' :waybillNo='showWaybill.waybillNo' :statusText='showWaybill.statusText' :waybillId='showWaybill.waybillId' v-if="showWaybill.visible"></waybillNo-component>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue"
import registrationOfFeesDialog from '@/components/Common/registrationOfFees.vue'
import sendingSmsDialog from '@/components/Common/sendingSms.vue'
import uploadFilesDialog from '@/components/Common/uploadFiles.vue'
import waybillSendSign from '@/components/TrackingS/waybillSendSign.vue'
export default {
    mixins: [Base,List],
    props: ['waybillNo','waybillId','convertWaybillStatus'],
    components: {
        "waybillNo-component": waybillNoComponent,
        'v-registrationOfFees':registrationOfFeesDialog,
        'v-sendingSms':sendingSmsDialog,
        'v-uploadFiles':uploadFilesDialog,
        'v-SendSign' : waybillSendSign
    },
    data() {
        return {
            //定义convert对象 表示需要转换一个属性，因为每当父组件重新呈现时，该值都将被覆盖
            convert:{
                waybillStatus:''   
            },
            sendGoodsTrackForm:{
                waybillId:'',
                waybillNo:'',
                content:'',
                visibleFlag:false,
                waybillStatus:'',
                trackTime:''
            },
            exceptionOccurrForm:{
                showDialog:false,//新增或修改弹框打开
                updateRow:{},//传递数据
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
                waybillId:'',
                statusText:'',
            },
            //签单实收
            sendSign:{
                visible:false,
            },
            orderNo:'',
            sendGoodsTrackRules: {
                
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
                this.onTrackDataCreated()    
                this.$refs['sendGoodsTrackForm'].resetFields();      
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
        
        sendSignClick() {
            this.sendSign.visible = true
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
                    if(this.sendGoodsTrackForm.visibleFlag==false){
                        this.sendGoodsTrackForm.visibleFlag=0
                    }else{
                        this.sendGoodsTrackForm.visibleFlag=1 
                    }
                    this.sendGoodsTrackForm.waybillId=this.waybillId
                    this.sendGoodsTrackForm.waybillNo=this.waybillNo
                    this.savingFlag=true
                    api.post('/goods/track/save', this.sendGoodsTrackForm).then(data=>{
                        this.savingFlag=false
                        if(data.code==200){
                            this.$message({
                                type: 'success',
                                message: '运单跟踪成功!'
                            });
                            this.$refs[formName].resetFields();
                            this.$emit('upData', true)
                            this.onTrackDataCreated()
                        }   
                    })     
                } else {
                    return false;
                }
            })  
        },
        //删除
        deleteSignFun(row){
            this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center:true,
            type: 'warning'
                }).then(async () => {
                    const { code, message,data } =await api.get('/waybill/track/delete?trackId='+row.id)
                    if(code == "200"){
                        this.onTrackDataCreated()            
                    }
                }) 
          
        },    
        async onTrackDataCreated() {//获取页面初始数据    

            const { code, message,data } =await api.get('/waybill/track/list?waybillId='+this.waybillId)
            if(code==="200"){
                this.tableData = data.waybillBackGoodsItemOut;
                 if(data.orderNo !='null'){
                    this.orderNo = data.orderNo
                }else{
                    this.orderNo= ''
                }
            }
        }
    }
    };
</script>


