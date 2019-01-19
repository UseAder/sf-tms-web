
<template>
    <div>
        <el-dialog :close-on-click-modal="false" :title="newModifyTitle" :visible.sync="showDialog" @close="$emit('update:pVisible', false)"
             width="800px" center class="Maglist-HairCar">          
            <div class="J-detail  J-inputBorder0"> 
                <el-row>
                    <el-form ref="newModifyForm" :rules="newModifyRules" :model="newModifyForm"  label-width="103px" class="demo-ruleForm" style="width:60%;margin:0 auto">
                        <el-form-item label="审核意见：" prop="memo">
                            <el-input type="textarea" v-model="newModifyForm.memo"></el-input>
                        </el-form-item>
                    </el-form>
                    <span class="dialog-footer" style="display: block; text-align: center;">
                    <el-button @click="saveAudit(false)">不通过</el-button>
                    <el-button @click="saveAudit(true)" type="primary" >通 过</el-button>
                    </span>
                </el-row>
                <el-row>
                    <div class="J-detail-title">
                        <div class="J-detail-title-yuan"></div>
                        审核过程
                    </div>
                    <div class="J-elTable" id="J-elTable" >
                        <el-table :max-height="250"  :data="flowList" border  style="width: 100%">
                            <el-table-column fixed type="index" width="50" label="序号" align='center'> </el-table-column>
                            <el-table-column prop="auditTime" label="审核时间" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="status" label="审核状态" width="110" align='center'>
                                <template slot-scope="scope">
                                    <div v-html="statusBackground(auditStatus(scope.row.status))" class="J-statusBackground"></div>     
                                </template>
                            </el-table-column> 
                            <el-table-column prop="auditEmployeeName" label="审核人" width="100"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="auditMemo" label="审核意见" align='center' header-align="center"></el-table-column>
                        </el-table> 
                    </div>   
                </el-row> 
               
            </div>
        </el-dialog>  
    </div>
</template>
<script>
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
    mixins: [Base],
    props: ['pVisible','pAuditId', 'pBalanceNo'],
    data() {
        return {
            showDialog: this.pVisible,
            newModifyTitle:'',
            flowList:[],
            newModifyForm:{
                memo:'',
                status:'',
                auditId:this.pAuditId
            },
            newModifyRules:{
                memo:[
                    { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
                ] 
            }
        }
    },
    methods:{
       
        //审核意见确认
        saveAudit(val){
            this.$refs['newModifyForm'].validate((valid) => {
            if (valid) {
                    let msg;
                    if(val){
                        msg='确认通过？'
                        this.newModifyForm.status=2
                    }else{
                        msg='确认不通过？'
                        this.newModifyForm.status=3
                    }
                    this.$confirm(msg, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    })
                    .then(async _ => {
                        const { code, message,data } = await api.post('finance/wb/ps',this.newModifyForm)
                        if(code==200){
                            this.$message({
                                type: 'success',
                                message: '审核意见已提交!'
                            });
                            this.$emit('update:pVisible', false) //
                            this.$emit('reloadList',true)//刷新列表
                        } 
                    }).catch(_ => {});
                } else {
                    return false;
                }
            });
        },  
    
        init() {
            this.newModifyTitle= '对账单审核' + this.pBalanceNo
            api.get('/finance/wb/flow/list?auditId='+this.pAuditId).then(data=>{
                if(data.code==="200"){
                    this.flowList = data.data;
                }
            })
        }
    }, 
    created(){
        this.init()
    }, 
}                    
</script>

                          
  
                        
 
              
                          
  
                        
 
              