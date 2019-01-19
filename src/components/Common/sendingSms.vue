<template>
    <div>
        <el-dialog :title="dialog.title" :visible.sync="dialog.visible" @close="$emit('update:pVisible', false)"
             width="800px" center class="Maglist-HairCar J-el-dialog__body J-dialog-vh">         
            <div class="J-detail J-inputBorder0 J-yx-error J-dialog-vh-body" > 
                <el-row>
                    <el-form :model="smsForm" ref="smsForm" :rules="smsRules" > 
                        <el-col :span="10">
                            <div class="labal">短信模板</div>
                            <div class="input J-borderBot ">
                                <el-form-item prop="type">
                                    <el-select v-model="smsForm.type" @change="loadSmsTypeContent" placeholder="请选择">
                                        <el-option-group
                                            v-for="group in base.smsTemplateType"
                                            :key="group.label"
                                            :label="group.label">
                                            <el-option
                                                v-for="item in  group.options"
                                                :key="item.value"
                                                :label="item.code"
                                                :value="item.value">
                                            </el-option>
                                        </el-option-group>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="11">
                            <div class="labal">手机号码</div>
                            <div class="input J-borderBot" id="J-yz-error">
                                <el-form-item prop="mobile">
                                    <el-input type="text" placeholder="手机号码" v-model="smsForm.mobile">
                                    </el-input> 
                                </el-form-item>
                            </div> 
                        </el-col>
                        <el-col :span="2">
                            <el-button style=" margin-left: 4px;" type="primary"    @click="sendSms('smsForm')" >发送短信</el-button>
                        </el-col>
                        <el-col :span="24">
                            <div class="labal">短信内容</div>
                            <div class="input ">{{smsInfo}}</div>                      
                        </el-col>
                    </el-form>
                </el-row>
       
                <span class="ticket-tishi">您的短信只剩下 {{ smsNum }} 条，请尽快充值 
                    <el-popover
                        placement="top"
                        title="充值提示"
                        width="200"
                        trigger="click"
                        content="短信充值暂未开通线上充值，充值请联系 18005717202 李经理 ">
                        <el-button type="text" slot="reference">充值</el-button>
                    </el-popover>
                </span>
                <div class="J-elTable"  id="J-elTable">
                    <el-table :max-height="299"  :data="smsList" highlight-current-row style="width: 100%" border >
                        <el-table-column type="index" width="30"></el-table-column>
                        <el-table-column prop="content" label="短信内容" min-width="200" align='center'></el-table-column>
                        <el-table-column prop="mobile" label="短信号码" min-width="100" align='center'></el-table-column>
                        <el-table-column prop="sendTime" label="发送时间" min-width="180" align='center'></el-table-column>
                        <el-table-column prop="status" label="发送结果" min-width="100" align='center'>
                            <template slot-scope="scope">
                                {{smsSendStatus(scope.row.status)}}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-dialog>
    </div>
</template> 
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
    mixins: [Base,List],
    props: ['pVisible', 'pWaybillNo', 'pWaybillId'],
    data() {
        return {

            dialog:{
                title:'',
                visible:this.pVisible
            },
            smsList:[],
            smsForm:{
                waybillId:this.pWaybillId,
                type:'',
                mobile:''
            },
            //对应短信模板的短信内容展示
            smsInfo:'',
            smsRules: {
                mobile: [
                    { required: true, message: '请输入手机号码' ,trigger: 'blur'},
                    { validator: this.linkmanMobileRules, trigger:'blur'}
                ],

            },
            smsNum:0
        }
    },
    //弹框出现  
    watch: { 
        pVisible () {
            this.dialog.visible = this.pVisible
        }, 
    },
    methods:{
        //加载短信列表
        loadList(){
            this.smsList = []
            api.get('/sms/waybill/list?id=' + this.pWaybillId).then(data=>{
                if(data.code == "200"){
                    this.smsList = data.data;
                }
            })
        },
        loadSmsNum() {
            api.get('/sms/num/remain').then(data=>{
                if(data.code == "200"){
                    this.smsNum = data.data;
                }
            })
        },
        //加载短信类型对应的短信内容和潜在的手机号
        loadSmsTypeContent(){
            this.smsInfo = ''
            api.get('/sms/type/content?id=' + this.pWaybillId + '&type='+this.smsForm.type).then(data=>{
                if(data.code == "200"){
                    this.smsInfo = data.data.content;
                    this.smsForm.mobile = data.data.mobile;
                }
            })
        },

        //发送短信
        sendSms(formName){
            this.$refs[formName].validate((valid) => {
            if (valid) {
                api.post('/sms/send', this.smsForm).then(data=>{
                    if(data.code == "200"){

                        this.$message.success({message: '短信发送成功!'});
                        this.loadList()
                    }
                })
            } else {

                return false;
            }
            });
            
        },
    }, 
    created() {
        this.smsForm.waybillId = this.pWaybillId
        this.dialog.title = '短信发送-' + this.pWaybillNo
        this.loadList()
        this.loadSmsNum()
    }
}                    
</script>

                          
  
                          
  
                        
 
              
                          
  
                        
 