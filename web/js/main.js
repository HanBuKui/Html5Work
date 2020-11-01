var app = new Vue({
    el:"#app",
    data:{
        wd:'',//搜索的关键词
        arr:[],//用于储存关键词的搜索词条
        listIndex:-1, //设置初始索引，数组从0开始，因此初始成-1
        nowTime:'',    // 当前时间
        searchOpt: 'baidu'  //搜索类型（baidu，biying，goole）
    },
    methods:{
        //这个函数我们在input标签输入关键词的时候不断的给百度服务器发送请求获取搜索词条，并且不断的复制给data中的数组arr
        keyup(event){
            //如果我按的是上下键，那么就不发送请求了
            console.log(event);
            if(event.keyCode==38||event.keyCode==40||event.keyCode==13) return ;
            var url= "http://suggestion.baidu.com/su"
            this.$http.jsonp(url,{
                params:{
                    wd:this.wd
                },
                jsonp:'cb'
            }).then(res=>{
                console.log(res);
                this.arr=res.data.s;//把百度服务器返回的数据传给arr数组
            })

            //解决删除文字后仍有提示符的问题
            if(this.wd==""){
                this.arr = []
            }

        },
        //监听鼠标的点击事件
        //如果鼠标点击某一行的文字，则点击事件中的event.target.data代表关键词
        //如果点击某一行的空白处，则点击事件中的event.target.innerText代表关键词
        //大家可以通过console.log(event)来查看关键词所在的位置
        click(event){
            console.log(event);

            if(event.target.data!=undefined){
                this.wd=event.target.data;
                if(this.searchOpt == "baidu"){
                    window.open("https://www.baidu.com/s?wd="+this.wd);
                }else if(this.searchOpt == "biying"){
                    window.open("https://cn.bing.com/search?q="+this.wd);
                }else{  // goole
                    window.open("https://www.google.com/search?q="+this.wd);
                }

            }else if(event.target.innerText!=undefined){

                this.wd=event.target.innerText;
                if(this.searchOpt == "baidu"){
                    window.open("https://www.baidu.com/s?wd="+this.wd);
                }else if(this.searchOpt == "biying"){
                    window.open("https://cn.bing.com/search?q="+this.wd);
                }else{  // goole
                    window.open("https://www.google.com/search?q="+this.wd);
                }

            }
        },
        //监听键盘的事件
        //如果按down，则增加当前listIndex+1，因此arr[this.listIndex]就能代表当前的词条
        //我们通过对listIndex的修改来得到当前词条在arr中的索引，然后就可以得到词条的具体信息，然后发送请求了
        keydown(event){
            console.log(event);
            //下键：40 上键：38
            if(event.keyCode==38){
                //按的上键
                this.listIndex--;
                if(this.listIndex<0){
                    this.listIndex=this.arr.length-1;
                }
                this.wd=this.arr[this.listIndex];
            }
            else if(event.keyCode==40){
                //说明你按的是下键
                this.listIndex++;
                if(this.listIndex>this.arr.length-1){
                    this.listIndex=0;
                }
                this.wd=this.arr[this.listIndex];
            }else if(event.keyCode==13){
                //如果你按的是enter，那么就跳转到百度搜索结果
                if(this.searchOpt == "baidu"){
                    window.open("https://www.baidu.com/s?wd="+this.wd);
                }else if(this.searchOpt == "biying"){
                    window.open("https://cn.bing.com/search?q="+this.wd);
                }else{  // goole
                    window.open("https://www.google.com/search?q="+this.wd);
                }

            }

        },

        currentTime() {
            setInterval(this.getDate, 500);
        },
        getDate: function() {
            var _this = this;
            let hh = new Date().getHours();
            let mf =
                new Date().getMinutes() < 10
                    ? "0" + new Date().getMinutes()
                    : new Date().getMinutes();
            _this.nowTime = hh + ":" + mf;
        },
        showOpt(event){
            this.searchOpt = event.target.value;
            console.log(this.searchOpt);
        }
    },

    mounted() {
        this.currentTime();
    },
    // 销毁定时器
    beforeDestroy: function() {
        if (this.getDate) {
            console.log("销毁定时器")
            clearInterval(this.getDate); // 在Vue实例销毁前，清除时间定时器
        }
    }

});
