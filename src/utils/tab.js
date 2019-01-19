import api from '@/utils/api.js'
export default {
  data() {
    return {
      editableTabsValue: "首页", //当前激活的标签页
      activeIndex: '0', //当前激活菜单的 index
      accessUrl: "", //当前激活菜单的 路径
      //tab导航存在的
      editableTabs: [
        {
          //Tabs 标签页
          accessUrl: "",
          name: "首页",
          id: "0",
          keepAliveName:""
        }
      ],
      storageElAsideList:[]//存储到addTab 需要的对象{id，name，accessUrl，vueModelName}
    }
  },
  methods: {
        /**
     * 广度优先遍历查找菜单
     */
    // breadthQueryMenu(menuTree, menuName) {
    //   console.log(menuTree);
    //   console.log(this.storageElAsideList);
    //   let param = this.storageElAsideList.find((n) => (n.name == menuName));  
    //   if (param) {
    //     console.log(param);
        
    //     return param;
    //   }
    //   var stark = [];
    //   stark = stark.concat(menuTree);
    //   while (stark.length) {
    //     var temp = stark.shift();
    //     // console.log(temp);
        
    //     if (temp.subList) {
    //       stark = stark.concat(temp.subList);
    //     }
    //     //如果子菜单跟父级菜单name相同同  需要进行判断
    //     if (temp.name === menuName) {
    //       if (temp.subList) {
    //           let tempChild=temp.subList
    //           let param = tempChild.find((n) => (n.name == menuName));  
    //           if (param) {
    //              return param;
    //           }
    //       }
    //       return temp;
    //     }
    //   }
    // },
    //对先菜单数据进行遍历
    storageElAsideListFun(menuTree){      
      var stark = [];
      stark = stark.concat(menuTree);
      while (stark.length) {
        var temp = stark.shift();
        if (temp.subList) {
          stark = stark.concat(temp.subList);
        } 
        if(temp.accessUrl){
          this.storageElAsideList.push({
            name: temp.name,
            id: temp.id,
            accessUrl: temp.accessUrl,
            vueModelName:temp.vueModelName
          });
        }
      } 
      
      sessionStorage.setItem("storageElAsideList", JSON.stringify( this.storageElAsideList))
    },
    /**
     * //菜单栏增加tabs标签
     */
    addTab(accessUrl,targetName,vueModelName) {
      this.editableTabs = JSON.parse(sessionStorage.getItem("editableTabs"))
      // this.editableTabsValue="运单变更审核"

      // let tabExist = this.editableTabs.find(n => n.name === targetName);
      // if (tabExist) {
      //   console.log(tabExist);
        
       
        // this.activeIndex=tabExist.id
      // }
      this.storageElAsideList=JSON.parse(sessionStorage.getItem("storageElAsideList"))
      // this.activeIndex=JSON.parse(sessionStorage.getItem("editableTabsValue"))
      // console.log(targetName);
      // console.log(this.editableTabs);
      let storageTabExist = this.storageElAsideList.find(n => n.accessUrl === accessUrl);
      // console.log(storageTabExist);
      
      if (storageTabExist) {
        let tabExist = this.editableTabs.find(n => n.accessUrl === accessUrl);
        if (!tabExist) {
            // this.editableTabs.push(storageTabExist)
            if(storageTabExist.vueModelName){
                this.$store.commit('addKeepAliveRoute',storageTabExist.vueModelName)
            }
          }
        //******************************************************************************************** */
        // else{
        //   //需要一个id 用作tab切换
        //   this.editableTabs.push({
        //     name: targetName,
        //     id: vueModelName,
        //     accessUrl: accessUrl,
        //     keepName:vueModelName
        //   })
        //   this.$store.commit('addKeepAliveRoute',storageTabExist.vueModelName)
        // }
        this.switchTab(storageTabExist.name);
        // console.log(storageTabExist);
        
      }
      
    },
    /**
     * 删除Tab页
     */
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      let param = tabs.find((n) => (n.name == targetName));  
      // 删除store中的aliveRote
      if(param.vueModelName){
        this.$store.commit('deleteKeepAliveRoute',param.vueModelName)
      }
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name == targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.switchTab(activeName);
            }
          }
        });
      }
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      sessionStorage.setItem(
        "editableTabs",
        JSON.stringify(this.editableTabs)
      );
      var obj = this.editableTabs
      for (var i in obj) {
        if (obj[i].name == this.editableTabsValue) {
          this.activeIndex = obj[i].id+''
          this.accessUrl = obj[i].accessUrl;
        }
      }
    },
    //Tabs 标签页 切换
    activeTabClick(tab) {
      this.switchTab(tab.label);
    },
        /**
     * url router变化 地址栏事件
     * 1.
     */
    urlRouter(Router) {
      if (Router=='/') {
        this.$router.push("/Home");
      }else{
        this.editableTabsValue ='首页';
        this.activeIndex ='0';  
      }
      let tabExist = this.editableTabs.find(n => n.accessUrl === Router);   
      if (!tabExist) {
        let arr = JSON.parse(sessionStorage.getItem("storageElAsideList"))
        let storageTabExist = arr.find(n => n.accessUrl === Router);
        if (storageTabExist) {
          this.editableTabs.push(storageTabExist)
          sessionStorage.setItem("editableTabs", JSON.stringify( this.editableTabs))
          this.switchTab(storageTabExist.name);
          if(storageTabExist.vueModelName){
            this.$store.commit('addKeepAliveRoute',storageTabExist.vueModelName)
          }
        }
      }else{
        this.editableTabsValue =tabExist.name;
        this.activeIndex =tabExist.id+'';
      }
    },
    /**
     * //tab切换
     */
    switchTab(tabName) {
      // console.log(tabName);
      
      if (tabName === "首页") {
        this.$router.push("/Home");
      } else {
        this.storageElAsideList=JSON.parse(sessionStorage.getItem("storageElAsideList"))
        let menu = this.storageElAsideList.find((n) => (n.name == tabName));  
        // console.log(menu);
        if (menu) {          
          this.$router.push(menu.accessUrl);
          this.activeIndex =menu.id+''
        } else {
          this.$message.error({
            showClose: true,
            message: tabName + "Tab页不存在"
          });
        }
      }
      
      
      this.editableTabsValue = tabName;
      // console.log(this.editableTabsValue);
    },

  }
}
 
 
 
 
 
 
 
 
 
 
 