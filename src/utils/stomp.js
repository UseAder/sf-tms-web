import SockJS from  'sockjs-client'
import Stomp from "stompjs"
import { ColorPicker } from 'element-ui';

export default {
    data() {
      return {
        stompClient: null,
        timer:null,
      }
    },
    methods: {
        
        connect() {
            const ms_server_url = process.env.MS_SERVER_URL;
            // let socket = new SockJS("http://127.0.0.1:8605/stomp_server")
            // let socket = new SockJS("https://tms.56linker.com/api/stomp_server")
            let socket = new SockJS(ms_server_url);
            this.stompClient = Stomp.over(socket);
            var headers = {
                "sf-app-token": sessionStorage.getItem('token')
            };
            this.stompClient.connect(headers, this.onConnected, this.onFailed);
        },
        onConnected(frame) {

            if (this.timer != null) {
                clearInterval(this.timer);
                this.timer = null;
            }

            this.$message.success({message: '消息服务链接成功！'});
            
            // console.log("Connected: " + frame);
            this.stompClient.subscribe('/topic/notify', (msg)=>{
                this.$message({showClose: true, message: 'topic得到的消息 msg=>' + msg.body, type: 'success'});
            });
            this.stompClient.subscribe('/user/' + sessionStorage.getItem('token') + '/message',(msg)=>{
                let data = JSON.parse(msg.body);
                switch(data.type) {
                    case 1: {
                        let title, content, type;
                        if (data.code == '200') {
                            type = 'success';
                            title = '导出成功';
                            content = data.message + "<a style='color: blue' href='" + data.data + "?tt=" + sessionStorage.getItem('token') + "' target='_blank'>点击下载</a>";
                        } else {
                            type = 'error';
                            title = '导出失败';
                            content = data.message ;
                        }
                        this.$notify({title: title ,dangerouslyUseHTMLString: true,type: type, message: content, duration: 0});
                    }break;
                    default:
                }
            });
        },
        onFailed() {
            if (this.timer == null) {
                this.$message.error({message: '消息服务断开，正在重新建立连接！'});
                this.timer = setInterval(() => {
                    this.connect();
                }, 5000);
            }
        },

        disconnect() {
          if (this.stompClient != null) {
           this.stompClient.disconnect();
          }
        },
        initWebSocket() {
          this.connect();
      },
    },
    created() {
        this.initWebSocket()
    },
    beforeDestroy: function () {
        // 页面离开时断开连接,清除定时器
        this.disconnect();
        clearInterval(this.timer);
    }
}