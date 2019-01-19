
<template>
    <div>
        <el-dialog :close-on-click-modal="closeOnClickModal" :title="newModifyTitle" :visible.sync="isDialog" @close="$emit('update:dialog', false)"
             width="1200px" center class="Maglist-HairCar J-dialog-vh">        
            <div class="J-detail  J-inputBorder0 J-dialog-vh-body"> 
                <el-row v-if="this.isContent">
                    <el-form ref="newModifyForm" :rules="newModifyRules" :model="newModifyForm"  label-width="103px" class="demo-ruleForm" style="width:60%;margin:0 auto">
                        <el-form-item label="审核意见：" prop="memo">
                            <el-input type="textarea" v-model="newModifyForm.memo"></el-input>
                        </el-form-item>
                    </el-form>
                    <span class="dialog-footer" style="display: block; text-align: center;">
                    <el-button @click="preservation(false)">不通过</el-button>
                    <el-button @click="preservation(true)" type="primary" >通 过</el-button>
                    </span>
                </el-row>
               <el-row class=" J-dialog-vh-content " >
                    <el-row>
                        <div class="J-detail-title">
                            <div class="J-detail-title-yuan"></div>
                            审核过程
                        </div>
                        <el-table  :max-height="200" :data="wbDetail" border  style="width: 100%">
                            <el-table-column fixed type="index" width="50" label="序号" align='center'> </el-table-column>
                            <el-table-column prop="auditTime" label="审核时间" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="status" label="审核状态" min-width="110" align='center'>
                                <template slot-scope="scope">
                                    <div v-html="statusBackground(auditStatus(scope.row.status))" class="J-statusBackground"></div>     
                                </template>
                            </el-table-column>                        <el-table-column prop="auditEmployeeName" label="审核人" width="180"  align='center' header-align="center"></el-table-column>
                            <el-table-column prop="auditMemo" label="审核意见" align='center' header-align="center"></el-table-column>
                        </el-table>    
                    </el-row> 
                    <el-row>
                        <div class="J-detail-title">
                            <div class="J-detail-title-yuan"></div>
                            变更内容
                        </div>
                        <el-table  :max-height="250"   :data="wbChange" border  style="width: 100%">
                            <el-table-column fixed type="index" width="50" label="序号" align='center'> </el-table-column>
                            <el-table-column prop="contentDes" label="改单内容" align='center' header-align="center"></el-table-column>
                            <el-table-column prop="beforeValueDes" label="改单前的值" align='center' header-align="center"></el-table-column>
                            <el-table-column prop="afterValueDes" label="改单后的值" align='center' header-align="center"></el-table-column>
                        </el-table>     
                    </el-row> 
                </el-row>
                
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
    props: ['dialog','isContent','updateRow'],
    data() {
        return {
            //是否可以通过点击 modal 关闭 Dialog
            closeOnClickModal:false,
            isDialog: this.dialog,
            newModifyTitle:'',
            wbDetail:[],
            wbChange:[],
            newModifyForm:{
                memo:'',
                status:'',
                auditId:''
            },
            newModifyRules:{
                memo:[
                    { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
                ] 
            }
        }
    },

    methods:{
        /**
         * 初始化
         */
        init(){
            if(this.isContent){
                this.newModifyTitle= this.updateRow.waybillNo+'调度变更审核'
                this.closeOnClickModal=false

            }else{
                this.newModifyTitle= this.updateRow.waybillNo+'调度变更审核详情'
                this.closeOnClickModal=true
            }
            this.wbDetailFun()
            this.wbChangeFun()
        },
        status : function (row,column) {
            let param = this.base.detailsTableStatus.find((n) => (n.value == row.status));
            if (param === undefined) {
                return "" 
            }
            return param.code;
        },
        async wbDetailFun(){
            const { code, message,data } =await api.get('/dis/da/detail?auditId='+this.updateRow.id)
            if(code==="200"){
                this.wbDetail = data;
            }
        },
        async wbChangeFun(){
            const { code, message,data } =await api.get('/dis//da/change?auditId='+this.updateRow.id)
            if(code==="200"){
                this.wbChange = data;
            }
        },
        //审核意见确认
        preservation(val){
            this.$refs['newModifyForm'].validate((valid) => {
            if (valid) {
                if(val){
                    this.preservationTitle='确认通过？'
                    this.newModifyForm.status=2
                }else{
                    this.preservationTitle='确认不通过？'
                    this.newModifyForm.status=3
                }
                this.$confirm(this.preservationTitle, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center:true,
                    type: 'warning'
                }).then(_ => {
                    this.newModifyForm.auditId=this.updateRow.id
                    this.auditWbPs()
                })
                .catch(_ => {});
            } else {
                    return false;
                }
            });
        },  
        //审核意见确认提交
        async auditWbPs(){
            const { code, message,data } =await api.post('/dis/da/ps',this.newModifyForm)
            if(code==200){
                this.$message({
                    type: 'success',
                    message: '审核意见已提交!'
                });
                this.isDialog=false
                this.$emit('ischild',true)
            }        
        }
           
    }, 
    created() {
        this.init()
    } 
}                    
</script>

                          
  
                          
  
                        
 
              
                          
  
                        
 
              