<template>
    <div>
        <div class="J-elTable-right-title ">异常跟踪</div>
        <el-table :max-height="200" :data="waybillGoodsListData" highlight-current-row style="width: 100%" border >
            <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
            <el-table-column prop="customerOrderNo" label="订单号" min-width="110" align='center'></el-table-column>
            <el-table-column prop="productName" label="品名" min-width="110" align='center'></el-table-column>
            <el-table-column prop="skuNo" label="编码型号"  min-width='110' align='center'></el-table-column>
            <el-table-column prop="num" label="实发" min-width="110" align='center'></el-table-column>
            <el-table-column prop="signNum" label="实收" min-width="110" align='center'></el-table-column>
            <el-table-column prop="backNum" label="退货" min-width="110" align='center'></el-table-column>
            <el-table-column prop="rejectNum" label="拒收" min-width="110" align='center'></el-table-column>
            <el-table-column prop="lessNum" label="少收" min-width="110" align='center'></el-table-column>
            <el-table-column prop="errorNum" label="错货" min-width="110" align='center'></el-table-column>
            <el-table-column prop="moreNum" label="多货" min-width="110" align='center'></el-table-column>
            <el-table-column prop="exceptionReason" label="拒收原因" width="180" align='center'></el-table-column>
            <el-table-column prop="dutyPersonType" label="责任方"  min-width="110" align='center'>
                 <template slot-scope="scope">
                            {{dutyPersonType(scope.row.dutyPersonType)}}
                        </template>
            </el-table-column>
            <el-table-column prop="dealWay" label="去向" min-width="110" align='center'>
                 <template slot-scope="scope">
                            {{dealWay(scope.row.dealWay)}}
                        </template>
                </el-table-column>                        
        </el-table>
        <el-form :model="sendGoodsExceptionTrackForm" :rules="sendGoodsExceptionTrackRules" ref="sendGoodsExceptionTrackForm" label-width="84px" :inline="true" style="padding-top: 6px;" class="demo-form-inline">
            <div class="J-flex ">
                <el-form-item label="操作"   prop="status"  label-width="55px" class="select-status">
                    <el-select v-model="sendGoodsExceptionTrackForm.status" placeholder=" " >
                    <el-option
                        v-for="item in base.anomalyTrackStatus"
                        :key="item.value"
                        :label="item.code"
                        :value="item.value">
                    </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="操作时间" prop="trackTime" class="select-time">
                    <el-date-picker
                        v-model="sendGoodsExceptionTrackForm.trackTime"
                            type="datetime"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                    </el-date-picker>
                </el-form-item>
            </div>
            <div class="J-flex textarea_checkbox">    
                <el-form-item label="跟踪内容" prop="content" >
                    <el-input style="width:355px" autosize type="textarea" v-model="sendGoodsExceptionTrackForm.content"></el-input>
                </el-form-item>
            </div>
        </el-form>     
        <span class="dialog-footer">
            <el-button type="primary" v-if="checkHasPermission('send_exception:sms')" @click='sendingSmsFun'>发送短信</el-button>
            <el-button type="danger" :loading="savingFlag" v-if="checkHasPermission('send_exception:create')" @click="preservation('sendGoodsExceptionTrackForm')">保 存</el-button>
            <el-button type="primary"  v-if="checkHasPermission('send_exception:apply')" @click='registrationOfFeesFun'>费用申请</el-button>
            <el-button type="primary" v-if="checkHasPermission('send_exception:fileup')" @click='uploadFilesFun'>凭证上传</el-button>
        </span>
        <div class="J-trackMessage">
            <div class="J-trackMessage-body" :style="'max-height:'+(this.$store.getters.getScreenHeight-jElTableOffsetTop-207)+'px;'">
                <div  class="J-trackMessage-list" v-for="item in waybillExceptionData" :key="item.index" >
                    <div class="J-trackMessage-bt">
                        <div class="J-trackMessage-bt-left">
                            <div class="J-trackMessage-title-time">
                                {{item.createTime}}
                            </div>
                            <div class="J-trackMessage-title-name">
                                {{item.employeeName}}
                            </div>
                            <div class="J-trackMessage-title-name">  
                                <template v-if="item.status">
                                    <div style="height: 30px;line-height: 30px;padding: 6px;">
                                        <div v-html="statusBackgroundTrack(anomalyTrackStatus(item.status))" class="J-statusBackground"></div>     
                                    </div> 
                                </template>
                            </div>
                        </div>
                        <div class="J-trackMessage-bt-left">
                            <el-button type="text" size="small" v-if="checkHasPermission('send_exception:delete')" @click="deleteSignFun(item)" >删除</el-button>   
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
        <v-uploadFiles :pVisible.sync='openUploadFiles.visible' pTabName='fhycTab' :pWaybillId.sync='waybillId' v-if="openUploadFiles.visible"></v-uploadFiles>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import registrationOfFeesDialog from '@/components/Common/registrationOfFees.vue'
import sendingSmsDialog from '@/components/Common/sendingSms.vue'
import uploadFilesDialog from '@/components/Common/uploadFiles.vue'
export default {
    mixins: [Base,List],
    props: ['waybillNo','waybillId','id'],
    components: {
        'v-registrationOfFees':registrationOfFeesDialog,
        'v-sendingSms':sendingSmsDialog,
        'v-uploadFiles':uploadFilesDialog
    },
    data() {
        return {
            sendGoodsExceptionTrackForm:{
                waybillId:'',
                waybillNo:'',
                waybillExceptionId:'',
                content:'',
                status:'',
                trackTime:''
            },
            waybillExceptionData: [], 
            //运单下的订单列表
            waybillGoodsListData:[],

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
            sendGoodsExceptionTrackRules: {
              
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
                this.$refs['sendGoodsExceptionTrackForm'].resetFields();      
            }
        }
    },
    methods: {
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
        preservation(formName){
            if (!this.waybillNo) {
                this.$message({
                    type: 'error',
                    message: '暂无运单数据!'
                });
                return
            }
            this.$refs[formName].validate(async(valid) => {
            if (valid) {
                this.sendGoodsExceptionTrackForm.waybillId=this.waybillId
                this.sendGoodsExceptionTrackForm.waybillNo=this.waybillNo
                this.sendGoodsExceptionTrackForm.waybillExceptionId=this.id
                this.savingFlag=true
                api.post('/goods/track/exception/save', this.sendGoodsExceptionTrackForm).then(data=>{
                    if(data.code==200){
                        this.$message({
                            type: 'success',
                            message: '运单跟踪成功!'
                        });
                    this.$refs[formName].resetFields();
                    this.ycTrackDataCreated()
                    this.$emit('upData', true)
                    }     
                }).then(() => { 
                    this.savingFlag=false
                })       
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
                    const { code, message,data } =await api.post('goods/track/track/delete',row.id)
                    if(code == "200"){
                        this.$emit('upData', true)
                        this.ycTrackDataCreated()            
                    }
                }) 
        },    
        async ycTrackDataCreated() {//获取页面初始数据    
            const { code, message,data } =await api.get('/goods/track/send/list?waybillExceptionId='+this.id +'&waybillId='+this.waybillId)
            if(code==="200"){
                this.waybillExceptionData = data.waybillExceptionFeeOuts;
                this.waybillGoodsListData = data.waybillSendGoodsListOuts;
            }
        }
    },
};
</script>


