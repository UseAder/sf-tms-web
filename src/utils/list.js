import {mapGetters} from 'vuex'
export default {
    computed:{
        //获取stroe 中 state的方法 相当于this.$store.getters.xx
        ...mapGetters([
            'getScreenHeight',
            'getScreenWidth'
        ])
    },
    data() {
        return {
            //获取页面中table距离浏览器的offsetTop值
            jElTableOffsetTop:'',
            //弹框 header的div的高度
            jdialogHeaderOffsetHeight:'',
            //弹框 footer的div的高度
            jdialogFooterOffsetHeight:'',

            //控制开关 防止多次渲染
            updatedTable:true
        }
    },

    // 监听浏览器宽度的变化 决定获取jElTableOffsetTop
    watch: {
        $route(to, from) {
            this.getOffsetTop()
        },
        'getScreenWidth':function(){
            this.getOffsetTop()
        },
    },
    methods: {   
        getOffsetTop(){
            //判断网页id元素是否存在
            if (document.getElementById("J-elTable")) {     
                // 获取元素           
                var box=document.getElementById('J-elTable')
                // 元素上边距离页面上边的距离          
                this.jElTableOffsetTop=box.getBoundingClientRect().top+50 
            }  
        }   
    },
    updated() {
        if (this.updatedTable) {
            this.getOffsetTop()
            //判断网页id元素是否存在
            if (document.getElementById("J-dialog-header-offsetHeight")) {     
                // 获取元素           
                var box=document.getElementById('J-dialog-header-offsetHeight')                
                //弹框 header的div的高度 
                if (box.offsetHeight) {
                    this.jdialogFooterOffsetHeight=box.offsetHeight
                }
            }  
            // 判断网页id元素是否存在
            if (document.getElementById("J-dialog-header-offsetHeight")) {     
                // 获取元素           
                var box=document.getElementById('J-dialog-footer-offsetHeight')
                //弹框 footer的div的高度
                if (box.offsetHeight) {
                    this.jdialogFooterOffsetHeight=box.offsetHeight
                }
            } 
        }
        this.updatedTable=false 
    },
}
 
 