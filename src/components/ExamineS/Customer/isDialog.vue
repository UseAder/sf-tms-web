
<template>
    <div>
        <el-dialog :close-on-click-modal="closeOnClickModal"  :title="newModifyTitle" :visible.sync="isDialog" @close="$emit('update:dialog', false)"
             width="1200px" center class="Maglist-HairCar">          
            <div class="J-detail  J-inputBorder0"> 
                <el-row v-if="this.isContent">
                    <el-form :model="newModifyForm"  label-width="103px" class="demo-ruleForm" style="width:60%;margin:0 auto">
                    <el-form-item label="审核意见：">
                        <el-input type="textarea" v-model="newModifyForm.memo"></el-input>
                    </el-form-item>
                    </el-form>
                    <span class="dialog-footer" style="display: block; text-align: center;">
                    <el-button @click="preservation(false)">不通过</el-button>
                    <el-button @click="preservation(true)" type="primary" >通 过</el-button>
                    </span>
                </el-row>
                <el-row>
                    <div class="J-detail-title">
                        <div class="J-detail-title-yuan"></div>
                        审核过程
                    </div>
                    <el-table :max-height="250" :data="wbDetail" border  style="width: 100%">
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
            </div>
        </el-dialog>  
    </div>
</template>
<script>
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
    mixins: [Base],
    props: ['dialog','isContent','updateRow'],
    data() {
        return {
            //是否可以通过点击 modal 关闭 Dialog
            closeOnClickModal:false,
            isDialog: this.dialog,
            newModifyTitle:'',
            wbDetail:[],
            newModifyForm:{
                memo:'',
                status:'',
                auditId:''
            }
        }
    },

    methods:{
        /**
         * 初始化
         */
        init(){
            if(this.isContent){
                this.newModifyTitle= this.updateRow.invoiceTitle+'调度变更审核'
                this.closeOnClickModal=false
            }else{
                this.newModifyTitle= this.updateRow.invoiceTitle+' 审核详情'
                this.closeOnClickModal=true
            }
            this.wbDetailFun()
        },
        status : function (row,column) {
            let param = this.base.detailsTableStatus.find((n) => (n.value == row.status));
            if (param === undefined) {
                return "" 
            }
            return param.code;
        },
        async wbDetailFun(){
            const { code, message,data } =await api.get('/cus/wb/detail?auditId='+this.updateRow.id)
            if(code==="200"){
                this.wbDetail = data;
            }
        },
        //审核意见确认
        preservation(val){
            if(val){
                this.preservationTitle='确认通过？'
                this.newModifyForm.status=2
            }else{
                 this.preservationTitle='确认不通过？'
                 this.newModifyForm.status=3
            }
            this.$confirm(this.preservationTitle)
            .then(_ => {
                this.newModifyForm.auditId=this.updateRow.id
                this.auditWbPs()
            })
            .catch(_ => {
            });
        },  
        //审核意见确认提交
        async auditWbPs(){
            const { code, message,data } =await api.post('/cus//wb/ps',this.newModifyForm)
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

                          
  
                          
  
                        
 
              
                          
  
                        
 
              