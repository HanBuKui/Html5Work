var app = new Vue({
    el:"#app",
    data:{
        wd:'',//搜索的关键词
        arr:[],//用于储存关键词的搜索词条
        listIndex:-1, //设置初始索引，数组从0开始，因此初始成-1
        nowTime:'',    // 当前时间
        searchOpt: 'baidu',  //搜索类型（baidu，bing，google）
        locationProvince:"正在定位所在省",
        locationCity:"正在定位所在市",
        weatherList:[],  //天气情况
        showWeather: false,   //是否显示天气情况
        OptBox: false   //是否显示搜索引擎选项
    },
    methods:{
        //这个函数我们在input标签输入关键词的时候不断的给百度服务器发送请求获取搜索词条，并且不断的复制给data中的数组arr
        keyup(event){
            //如果我按的是上下键，那么就不发送请求了
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
            event.preventDefault();
            if(event.target.data!=undefined){
                this.wd=event.target.data;
            }else if(event.target.innerText!=undefined){
                this.wd=event.target.innerText;
            }
        },
        //监听键盘的事件
        //如果按down，则增加当前listIndex+1，因此arr[this.listIndex]就能代表当前的词条
        //我们通过对listIndex的修改来得到当前词条在arr中的索引，然后就可以得到词条的具体信息，然后发送请求了
        keydown(event){
            //下键：40 上键：38
            if(event.keyCode==38){
                //按的上键
                this.listIndex--;
                if(this.listIndex<0){
                    this.listIndex=this.arr.length-1;
                }
                this.wd=this.arr[this.listIndex];

                /*let ls = document.getElementsByClassName("list-group-item");
                for (let index in ls){
                    ls[index].style.fontSize = "15px";
                }

                //将选中区域改变样式进行选定
                var listNum = "list-group-item"+this.listIndex
                document.getElementById(listNum).style.fontSize="20px";*/

            }
            else if(event.keyCode==40){
                //说明你按的是下键
                this.listIndex++;
                if(this.listIndex>this.arr.length-1){
                    this.listIndex=0;
                }
                this.wd=this.arr[this.listIndex];


                /*let ls = document.getElementsByClassName("list-group-item");
                for (let index in ls){
                    ls[index].style.fontSize = "15px";
                }

                //将选中区域改变样式进行选定
                var listNum = "list-group-item"+this.listIndex
                document.getElementById(listNum).style.fontSize="20px";*/

            }else if(event.keyCode==13){
                //如果你按的是enter，那么就跳转到百度搜索结果
                if(this.searchOpt == "baidu"){
                    window.open("https://www.baidu.com/s?wd="+this.wd);
                }else if(this.searchOpt == "bing"){
                    window.open("https://cn.bing.com/search?q="+this.wd);
                }else{  // goole
                    window.open("https://www.google.com/search?q="+this.wd);
                }

            }

        },

        currentTime() {
            setInterval(this.getDate, 500);
        },
        getDate() {
            var _this = this;
            let hh = new Date().getHours();
            let mf =
                new Date().getMinutes() < 10
                    ? "0" + new Date().getMinutes()
                    : new Date().getMinutes();
            _this.nowTime = hh + ":" + mf;
        },
        //选择搜索引擎
        showOpt(type){
            console.log(type);
            this.searchOpt = type;
            // 按钮样式改变
            let a1= document.getElementById('baiduOpt');
            let a2= document.getElementById('bingOpt');
            let a3= document.getElementById('googleOpt');
            a1.style.backgroundColor = "#99999950";
            a2.style.backgroundColor = "#99999950";
            a3.style.backgroundColor = "#99999950";
            if(this.searchOpt == "baidu"){
                a1.style.backgroundColor ="#999999";
            }else if(this.searchOpt == "bing"){
                a2.style.backgroundColor = "#999999";
            }else{  // goole
                a3.style.backgroundColor = "#999999";
            }
        },
        //获取当前城市
        getLocation(){
            const geolocation = new BMap.Geolocation();
            var _this = this;
            geolocation.getCurrentPosition(function getinfo(position) {
                _this.locationCity = position.address.city;
                _this.locationProvince = position.address.province;
            },function (e) {
                _this.locationCity = "定位失败"
            },{provider: 'baidu'});
        },
        //显示天气信息
        lookWeather(){
            this.showWeather = true;
        },
        //隐藏天气信息
        hideWeather(){
            this.showWeather = false;
        },
        //点击search框时
        showOptBox(){
            this.OptBox = true;
        },
        hideOptBox(){
            this.OptBox = false;
        },
        // 解决点击搜索引擎按钮input(text)失去focus的问题
        preventBlur(event){
            event.preventDefault();
        }


    },
    //methods结束--------------------------------------------

    mounted() {
        this.getLocation();  //触发获取城市的方法
        this.currentTime();
    },
    // 销毁定时器
    beforeDestroy: function() {
        if (this.getDate) {
            clearInterval(this.getDate); // 在Vue实例销毁前，清除时间定时器
        }
    },
    //定位改变时调用查询天气函数
    /*因为若获取地址后就去查询天气提交的是“正在查询天气”*/
    watch:{
        //搜索天气 监听locationCity变量(变化就执行)
        locationCity(){
            var that=this;
            axios.get("http://wthrcdn.etouch.cn/weather_mini?city="+this.locationCity).then(
                function(response){
                    that.weatherList=response.data.data.forecast;
                }
            ).catch(function(err){

            })
        }
    }

});
