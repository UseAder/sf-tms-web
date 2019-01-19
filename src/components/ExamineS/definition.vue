<template>
  <div class="MagList" >
    <div class="J-main-body">
      <el-button type="primary" style="margin:7px 0" v-if="checkHasPermission('audit_custom:create')" @click="ExaminesOpinionList.Definition.examineOpinion=true">新建流程</el-button>
      <div class="J-elTable" id="J-elTable" >
        <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border >
          <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
          <el-table-column prop="flowName" label="流程名称" width="180" align='center'></el-table-column>
          <el-table-column prop="employeeName" label="审核流程"  align='center'>
            <template slot-scope="scope">
              <div class="ticket-select-auditor J-flexCc" >
                <div v-for="tag in scope.row.employeeName" :key="tag.index" class=" ticket-select-auditor-jt">
                  <el-tag>{{tag}}</el-tag>
                  <i class="iconfont icon-right" ></i>
                </div>
              </div>
            </template> 
           </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"  align='center'></el-table-column>
        </el-table>
      </div>
    </div>


    <el-dialog :close-on-click-modal="false"  title="审核流程" :visible.sync="ExaminesOpinionList.Definition.examineOpinion"  @close="closeDialog('newModifyForm')" width="699px" center class="Maglist-HairCar">
      <div class="J-detail "> 
        <el-row>
          <el-form ref="newModifyForm"  :rules="newModifyRules" :model="newModifyForm"  label-width="93px" class="demo-ruleForm" style="    width: 90%;margin:0 auto">
            <el-form-item label="流程名称:" prop="flowName">
              <el-input v-model="newModifyForm.flowName" placeholder="请输入流程名称"></el-input>
            </el-form-item>
            <el-form-item label="审核流程:" prop="employeeIdSequences">
              <div style="margin-left:5px">
                <v-auditorSelect :wipedata='wipedata' @auditorSelect='sequenceTagsChild'></v-auditorSelect> 
                <div class="el-form-item__error" v-show="sequenceTags==''&&errorShow">
                  请至少选择一个审核人员
                </div>
              </div>
            </el-form-item>
          </el-form>
          <span class="dialog-footer" style="display: block; text-align: center;">
            <el-button type="primary" :loading="savingFlag" @click="preservation('newModifyForm')">保 存</el-button>
          </span>
        </el-row>  
      </div>
    </el-dialog>
  </div>
</template>
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import auditorSelect from '@/widget/auditorSelect'
export default {
  name:'e-definition',
  mixins: [Base,List],
  components: {    
    'v-auditorSelect':auditorSelect
  },
  data() {
    return {
        wipedata:true,//用来清空组件数据
        errorShow:false,//错误提示出不出现
        tableData: [], 
        newModifyForm: { //需要保存的信息   
          employeeIdSequences:[],//审核人员id 
          flowName:''
        },
        sequenceTags:[],//审核人员Tags
        newModifyRules: {
          flowName: [
            { required: true, message: '请输入流程名称', trigger: ['blur','change']},
            { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}  
           ],
        }
      }
    },
    methods: {
      //弹框关闭时components组件清空数据 components组件使用watch监听
      closeDialog(formName){
        this.wipedata=!this.wipedata  
        this.errorShow=false
        this.$refs[formName].resetFields();
      },
      //接受组件传递过来的审核人员数据 
      sequenceTagsChild(data){
          this.sequenceTags=data
      },
      //保存
      preservation(formName){

        var flowIdSequenceArray=[]
        for (const item of this.sequenceTags) {
        flowIdSequenceArray.push(item.id);
        }
        this.newModifyForm.employeeIdSequences= flowIdSequenceArray
        this.$refs[formName].validate((valid) => {
          if(this.sequenceTags==''){
            this.errorShow=true
            return
          }
          if (valid) {
            this.savingFlag=true
            api.post('/ac/add',this.newModifyForm).then(data=>{
              if(data.code==200){
                this.$message({
                    type: 'success',
                    message: '恭喜您，已新建审核流程!'
                });
                this.ExaminesOpinionList.Definition.examineOpinion=false
                this.querySpecialList() 
              }   
            }).then(() => { 
                this.savingFlag=false             
            })         
          } 
        });
      },
      //获取页面初始数据
      async querySpecialList() {
        const { code, message,data } =await api.get('/ac/get',)
        if(code==="200"){
          this.tableData = data;
        }
      }
    }
  };
</script>
