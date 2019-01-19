<template>
    <div class="ticket-select"> 
        <div class="ticket-select-auditor J-flexRc "  style="align-items:flex-start;">
            <div v-for="tag in sequenceTags" :key="tag.index"  class=" ticket-select-auditor-jt">
                <el-tag closable :disable-transitions="false" @close="newAuditorClose(tag)">
                    {{tag.name}}         
                </el-tag>
                <i class="iconfont icon-right" ></i>
            </div>
            <div style="margin-top: 2px;">
                <el-popover
                    width="190"
                    v-model="newAuditor.visible"
                    placement="top" popper-class="kpAdd-popover"
                    trigger="click" >
                    <div class="kpAdd-popover-table">
                        <el-table :data="newAuditor.tableData" @row-click="newAuditorSelect">
                            <el-table-column  property="name" label="姓名"></el-table-column>
                        </el-table>
                    </div>
                    <div  slot="reference"  @click="newAuditorFun" class='J-auditorduo' >
                        <img src="../assets/auditordan.png" class='J-width100'/>
                    </div>
                </el-popover>     
                <el-popover
                    width="190"
                    v-model="usageFlow.visible" 
                    placement="top" popper-class="kpAdd-popover"
                    trigger="click" >
                    <div class="kpAdd-popover-table">
                        <el-table :data="usageFlow.tableData" @row-click="usageFlowSelect">
                            <el-table-column  property="flowName" label="流程名称"></el-table-column>
                        </el-table>
                    </div>
                    <div  slot="reference" class='J-auditorduo' @click="usageFlowFun">
                        <img src="../assets/auditorduo.png" class='J-width100'/>
                    </div>
                </el-popover>
            </div>
            
        </div>
    </div>
</template>
<script>
import api from '@/utils/api.js'
export default {
    /**
     * 修改时获取审核人员IDs
     */
    props:['auditorList'],
    data() {
        return {
            //保存数据用于在删除时候获取完成的审核人员数据
            saveAuditorlistData:[],
            sequenceTags:[],//审核人员Tags
            newAuditor:{
                tableData:[],//客户管理列表
                visible:false
            },
            usageFlow:{
                tableData:[],//流程列表
                visible:false
            }

        }
    },
    created(){
        this.newAuditorlist()
    },
    methods: {           
        //1选择审核人员 数据获取
        async newAuditorlist(){
            const { code, message,data } =await api.get('emp/ddl/list')
            if(code==='200'){
                this.newAuditor.tableData=data
                this.saveAuditorlistData=data
                if (this.auditorList&&this.auditorList!='') {
                    this.auditorList.forEach(val => {
                         let newAuditor = this.newAuditor.tableData.find(n => n.id === val);
                        if (newAuditor) {
                             this.sequenceTags.push(newAuditor);
                        }
                    })
                }
            }
        },
        //2选择审核人员 数据过滤
          newAuditorFun(){
           for (let i = 0; i < this.sequenceTags.length; i++) {
             this.newAuditor.tableData = this.newAuditor.tableData.filter(tab => tab.id !== this.sequenceTags[i].id);
           }    
        },
        //3选择审核人员 增加
        newAuditorSelect(row, event, column){
               this.sequenceTags.push(row);
               this.newAuditor.visible=false
            this.$emit('auditorSelect',this.sequenceTags)
        },
        //1使用流程列表 数据获取
        async usageFlowFun(){
            const { code, message,data } =await api.get('/ac/get',)
                if(code==="200"){
                this.usageFlow.tableData = data;
            }  
        },
        //2使用流程列表 选择
        usageFlowSelect(row, event, column){
            this.usageFlow.visible=false
            this.sequenceTags=[]
            for (let i = 0; i < row.employeeName.length; i++) {
                 let wm = JSON.parse(row.employeeIdSequence)
                 let obj={
                    id: wm[i],
                    name:row.employeeName[i],
                }
                this.sequenceTags.push(obj);
            }
            this.$emit('auditorSelect',this.sequenceTags)
        },
        //删除开票审核人员
        newAuditorClose(tag) {
            this.newAuditor.visible=false
            this.sequenceTags.splice(this.sequenceTags.indexOf(tag), 1);
            //将保存的数据重新赋值给审核人员数据 
            this.newAuditor.tableData=this.saveAuditorlistData
            this.newAuditorFun()
            this.$emit('auditorSelect',this.sequenceTags)
        }
    }
}
</script>

