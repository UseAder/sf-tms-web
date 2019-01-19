<template>
    <div class="MagList" >
        <div class="J-employrr-wrap">
          <div class="J-employrr" :style="'max-height:'+(getScreenHeight-102  )+'px'">
              <div class="J-employrr-juese">
                
                <div class='J-employrr-title'>角色</div>

                <div v-for="o in roleList" :key="o.id" class="text item">
                  {{o.roleName}}
                  <div class="item-icon">
                    <i class="el-icon-edit-outline" @click="updateRoleShow(o.id)"></i>
                    <i class="el-icon-close"  @click="deleteRole(o.id)"></i>
                  </div>
                  <!-- <div class="item-xuhao">
                  {{o.id}}
                  </div> -->
                </div>
                
                <div class="J-employrr-juese-bot">
                  <el-button  size="mini" @click="updateRoleShow()">新增角色</el-button>
                </div>
              </div>
          </div>
        </div>
        
        <div class="J-main-body" style="margin-left: 239px;">
          <div class="homeMain-header"> 
            <div class="J-main-search J-flexSbc" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                  <el-form-item label="模糊查询" prop="word">
                    <el-input v-model="searchForm.word" placeholder="模糊查询"></el-input>
                  </el-form-item>
                  <el-form-item class="J-main-search-button">
                    <el-button type="primary"  @click="handlesearch">查询</el-button>
                    <el-button type="warning" @click="resetForm('searchForm')">重置</el-button>
                  </el-form-item>
              </el-form>
              <el-button type="primary" style="margin-right:18px;margin-top:-18px" @click="showAddOrUpdateEmployee()">新增</el-button>
            </div>
          </div>
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="employeeList" border >
              <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
              <el-table-column label="操作"  width="50" align='center' header-align="center" fixed>
                <template slot-scope="scope">
                  <div class="table-menu">
                    <el-menu  :collapse="true">
                      <el-submenu index="1" >
                        <template slot="title" >
                          <i class="el-icon-edit-outline"></i>
                        </template>
                        <el-menu-item-group> 
                          <el-menu-item index="1-1" @click="showAddOrUpdateEmployee(scope.row)">修改</el-menu-item>  
                          <el-menu-item index="1-2" @click="deleteEmployee(scope.row)">删除</el-menu-item> 
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="account" label="账号" align='center'></el-table-column>
              <el-table-column prop="name" label="姓名"  align='center'></el-table-column>
              <el-table-column :formatter="isAdminFlagFun" prop="adminFlag" label="系统管理员" align='center'></el-table-column>
              <el-table-column prop="createEmployeeName" label="登记人" align='center'></el-table-column>
              <el-table-column prop="createTime" label="登记时间" align='center'></el-table-column>     
            </el-table>
            <div class="main-table-page">
              <div class="main-table-page-left"> 
              </div>
              <el-pagination background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="page.pageSizes"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="searchForm.pageNo"
                :total="page.total">
              </el-pagination>
            </div>
          </div>
        </div>



        <el-dialog :close-on-click-modal="false" :title="employeeOpinionTitle" :visible.sync="CompanysOpinionList.Employee.employeeOpinion"  width="699px" center class="Maglist-HairCar J-dialog-vh">
          <div class="J-detail J-dialog-vh-body">
              <!-- <div class="J-dialog-vh-xian" v-if='getScreenHeight-342<=500'>
              </div>   -->
              <el-row class=" J-dialog-vh-content" :style="'max-height:'+(getScreenHeight-342)+'px;'">
                <el-form :rules="employeeAddRules" :model="employee.addForm" ref="employee.addForm"  label-width="82px" class="demo-ruleForm" style=" width: 578px;margin:0 auto">
                  <el-form-item label="姓名：" prop="name" >
                    <el-input v-model="employee.addForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="账号：" prop="account">
                    <el-input  v-model="employee.addForm.account"></el-input>
                  </el-form-item>
                  <el-form-item label="密码：" prop="password">
                    <el-input v-model="employee.addForm.password" ></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码：" prop="checkPassword">
                    <el-input v-model="employee.addForm.checkPassword"></el-input>
                  </el-form-item>
                  <el-form-item prop="id" hidden>
                  </el-form-item>
                  <el-form-item label="角色选择：">
                  <el-transfer v-model="employee.addForm.roleIds" :titles="['未选择角色', '已选择角色']"  
                      :props="{key: 'id', label: 'roleName'}" :data="employee.roleList" >
                  </el-transfer>
                  </el-form-item>
                </el-form>
              </el-row>  
              <!-- <div class="J-dialog-vh-submission" :style="getScreenHeight-342<=500?'box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)':''" > -->
              <div class="J-dialog-vh-submission" > 
                <span class="dialog-footer" >
                  <el-button type="primary" :loading="savingFlag" @click="saveEmployee('employee.addForm')">保 存</el-button>                  
                </span> 
              </div>  
          </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :title="roleAddFormTitle" :visible.sync="CompanysOpinionList.Employee.jueseOpinion" width="699px" center class="Maglist-HairCar J-dialog-vh" 
                  @open="openRoleLoadData"   @close="closeRoleW()" >
          <div class="J-detail J-dialog-vh-body">
              <!-- <div class="J-dialog-vh-xian" v-if='getScreenHeight-342<=500'>
              </div>   -->
              <el-row class=" J-dialog-vh-content-te" :style="'max-height:'+(getScreenHeight-342)+'px;'">
                <el-form :rules="roleAddRules" ref="role.addForm" :model="role.addForm"  label-width="94px" class="demo-ruleForm" style="width: 578px;margin:0 auto">
                  <el-form-item label="角色名称：" prop="roleName" >
                    <el-input v-model="role.addForm.roleName"></el-input>
                  </el-form-item>
                  <el-form-item label="角色昵称：" prop="roleDes">
                    <el-input v-model="role.addForm.roleDes"></el-input>
                  </el-form-item>
                  <el-form-item label="权限分配：" prop="jueseFilterText">
                    <el-input  v-model="role.jueseFilterText" placeholder="输入关键字进行过滤" suffix-icon="el-icon-search"></el-input>
                    <div class="J-employee-tree">
                      <el-tree 
                        :style="'max-height:'+(getScreenHeight-520)+'px;'"
                        :data="role.treePermissionData"
                        show-checkbox
                        node-key="treeId"
                        ref="pTree"
                        highlight-current
                        :filter-node-method="jueseFilterNode"
                        :props="role.treeProps"
                        >
                      </el-tree>
                    </div>
                    
                  </el-form-item>
                </el-form>
              </el-row>
               <!-- <div class="J-dialog-vh-submission" :style="getScreenHeight-342<=500?'box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)':''" > -->
                <div class="J-dialog-vh-submission" >  
                  <span class="dialog-footer" >
                    <el-button type="primary" :loading="savingFlag" @click="saveRole('role.addForm')">保 存</el-button>
                  </span> 
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
  name:'c-employee',
  mixins: [Base,List],
    data() {
      var validateCheckPass = (rule, value, callback) => {
       if (value !== this.employee.addForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {  
        newModifyMessage:false,//判断是新增还是修改
        employeeOpinionTitle:'新增员工',
        roleAddFormTitle:'角色信息',
        roleList: [],
        searchForm: { 
          word:'',
          pageSize: 10,
          pageNo: 1
        },
        employeeList: [], 
        page:{
          pageSizes: [5, 10, 15, 20], //分页
          pageSize: 10, //当前选择分页数
          total: 0
        },
        
        // ----------- 角色新增/修改相关 --------------
        role:{
          jueseFilterText: '',
          treePermissionData: [], 
          treeProps: {
            children: 'subList',
            label: 'name'
          },
          addForm:{
            id:'',
            roleName:'',
            roleDes:'',
            pCode:[]
          }
        },
        // ----------- 角色新增/修改相关 --------------

        //-------------- 用户 ------------
        employee: {
          addForm:{
            roleIds:[],
            account:'',
            password:'',
            checkPassword:'',
            name:'', 
            id:''      
          },
          roleList: [],
        },
        employeeAddRules: {
          name:[
            { required: true, message: '请输入员工姓名' ,trigger: ['blur', 'change'] },
            { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}
          ],
          account:[
            { required: true, message: '请输入员工账号' ,trigger: ['blur', 'change'] },   
            { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'} 
          ],

          checkPassword: [
            { validator: validateCheckPass,trigger: ['blur', 'change'] },
            { min: 1, max: 50, message: '超出长度限制{1~50}' ,trigger: 'blur'}      
          ],
        },
        roleAddRules: {
          roleName:[
            { required: true, message: '请输入角色名称' ,trigger: ['blur', 'change'] },  
            { min: 1, max: 100, message: '超出长度限制{1~100}' ,trigger: 'blur'}   
          ],
          roleDes:[
            { min: 0, max: 100, message: '超出长度限制{0~100}' ,trigger: 'blur'}   
          ],
        }
        //-------------- 用户 ------------
      };
    },
    watch: {
      'role.jueseFilterText': function(val) {   
        this.$refs.pTree.filter(val);
      }
    },
    methods: {
        /**
         * 是否是管理员
         */
       isAdminFlagFun : function (row,column) {
            
            if (row.adminFlag == 1) {
                return "是"
            }else{
                return "否"
            }
             
        },

      /**
       * 删除员工
       */
      deleteEmployee(row){
        this.$confirm('确认要删除员工账号吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(async () => {
          const { code, message,data } =await api.post('/emp/delete',row.id)
          if(code==200){
             this.$message({type: 'success',message: '删除成功!'});
             this.querySpecialList();
          }      
        }).catch(() => {});
      },

      /**
       * 显示新增和修改员工
       */
      async showAddOrUpdateEmployee(row){
        this.closeDialog('employee.addForm')
        this.CompanysOpinionList.Employee.employeeOpinion=true
        this.employee.addForm.roleIds=[]
        this.employee.roleList = []
        this.employee.addForm.id=''
        if(row){
          this.employeeOpinionTitle='员工修改'
          //加载员工信息
          const empData = await api.get('/emp/id?id='+row.id)
          if(empData.code==200){
            this.employee.addForm.account=empData.data.account
            this.employee.addForm.name=empData.data.name
            this.employee.addForm.id=empData.data.id
            this.employee.addForm.password=empData.data.password
          }
          //员工角色信息
          const roleData = await api.get('/permission/user/role?id='+row.id)
          if(roleData.code==='200'){
            this.employee.roleList=roleData.data
            //获取有权限数据ID
            let rd = this.employee.roleList.filter(d=> d.flag==true );
            this.employee.addForm.roleIds = rd.map(function(v){return v.id;});
          }
        }else{
          this.employeeOpinionTitle='员工新增'
          //员工角色信息
          const { code, message,data } = await api.get('/permission/role/list')
          if(code==='200'){
            this.employee.roleList=data
          }
        }     
      },

      /**
       * 保存员工
       */
      saveEmployee(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认要保存该员工吗？, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center:true,
              type: 'warning'
            }).then(() => {
              this.savingFlag=true
              api.post('/emp/addorup', this.employee.addForm).then(data=>{
                if(data.code==200){
                  this.$message({type: 'success',message: '员工保存成功!'});
                  this.querySpecialList()
                  this.CompanysOpinionList.Employee.employeeOpinion=false
                }
              }).then(() => { 
                  this.savingFlag=false             
              })    
            }).catch(() => {});
          } else {
             
            return false;
          }
        });
         
      },

      //----------- 列表页面 ----------------
      async permissionRoleList(){ 
          const { code, message,data } =await api.get('/permission/role/list')
          if(code==200){
            this.roleList=data
          }
      },
      async querySpecialList() {//获取页面初始数据
        const { code, message,data } =await api.post('/emp/list', this.searchForm)
        if (code == 200) {
          this.employeeList = data.records;
          this.page.total = data.total;
        }
      }, 
      //----------- 列表页面 ----------------


      //----------- 角色弹框数据加载 ----------------
      openRoleLoadData() {
        //角色信息
        if (this.role.addForm.id) {
          //权限数据
          api.get('/permission/role?id='+this.role.addForm.id).then(data=>{
            if (data.code === '200') {
                this.role.addForm.roleName = data.data.roleName
                this.role.addForm.roleDes = data.data.roleDes
            } 
          });
        }

        //权限数据
        api.get('/permission/role/permission?id='+this.role.addForm.id).then(data=>{
          if (data.code === '200') {
              this.role.treePermissionData = data.data;
              //获取有权限的数据, 递归
              var hpTreeId=[];
              var findHasPermission = function(arr){
                  arr.forEach((item) => { 
                      if(item.flag==1){        
                          hpTreeId.push(item.treeId);
                      } else if(item.subList!=null && item.subList.length > 0) {
                          findHasPermission(item.subList)        
                      }                   
                  })
              }
              findHasPermission(this.role.treePermissionData)
              this.$refs.pTree.setCheckedKeys(hpTreeId);
               

          } 
        });
      },
      jueseFilterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      //显示角色窗口
      updateRoleShow(id){
        if(id){
          this.role.addForm.id = id;
          this.roleAddFormTitle='角色信息'
        }else{
          this.roleAddFormTitle='修改角色信息'
        }
        this.CompanysOpinionList.Employee.jueseOpinion=true
      },
      //窗口关闭
      closeRoleW(){
        this.role.treePermissionData = []
        this.role.checkPermissionList = []
        this.role.addForm.id = ''
        this.role.addForm.pCode = []
        this.$refs['role.addForm'].resetFields();

      },
      saveRole(formName){

        var pCode = [];
           this.$refs.pTree.getCheckedNodes().forEach(element => {
             pCode.push(element.code)
           });
          
        this.role.addForm.pCode = pCode;

        this.$refs[formName].validate((valid) => {
          if (valid) {
          this.$confirm('确认要保存该角色吗？, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center:true,
            type: 'warning'
          }).then(() => {
            this.savingFlag=true
            api.post('/permission/role/addedit',this.role.addForm).then(data=>{
              if(data.code==200){
                this.$message({type: 'success',message: '角色保存成功!'});
                this.permissionRoleList(); //获取数据
                this.CompanysOpinionList.Employee.jueseOpinion=false 
              }  
            }).then(() => { 
              this.savingFlag=false             
            })     
          }).catch(() => {})
          }
        })
      },
      /**
       * 删除角色
       */
      deleteRole(id){
        this.$confirm('确认要删除该角色吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(async () => {
          const { code, message,data } =await api.post('/permission/role/delete?id='+id)
          if (code == 200) {
              this.$message({type: 'success',message: '角色删除成功!'});
              this.permissionRoleList(); //获取数据
            }      
          }).catch(() => {})
      }
      //-------------角色弹框数据加载----------------
    },

    //
    created() { 
      this.permissionRoleList()
    },
  };
</script>


<style>
.J-employrr-wrap{
  overflow: hidden;
   width: 214px;
    border: 1px solid #ebeef5;
 border-radius: 3px;
    margin-top: 7px;
    width: 231px;
    /* position: absolute; */
        float: left;
    left: 0;   color:#9b9b9b;
}
.J-employrr{
  overflow-y: scroll;
  margin-right: -17px;
 
       
}
.J-employrr-juese .item{
     padding: 12px 20px;
    line-height: 1; 
}    
.J-employrr-title{
  padding: 12px 20px;
}
.J-employrr-juese-bot{
  border-top:  1px solid #ebeef5;text-align: center;margin-top: 20px;padding: 5px 0
}
.J-employrr-juese-bot button{
border-radius:100px;   color:#9b9b9b;
}

.J-employrr .item-icon{
float: right;display: none;    font-size: 19px;cursor: pointer;
}
.J-employrr .item-xuhao{
  float: right;display: block
}
.J-employrr .item:hover .item-xuhao{
 display: none;
}
.J-employrr .item:hover .item-icon{
 display: block;
}
.J-employrr .item .item-icon i:hover{
color:#409EFF
}
.J-employrr .item:hover {
background:#f1f4f5;color:#409EFF

}
</style>
