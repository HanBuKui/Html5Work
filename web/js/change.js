/*改变原始宽度*/
function openNav() {
	document.getElementById("mySidenav").style.width = "250px";
}
/*恢复原始宽度*/
function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
}

/*切换壁纸，读取上次保存数据*/
window.onload = function() {

	document.getElementById('baiduOpt').style.backgroundColor ="#999999";

	var imgs = document.getElementsByClassName("changeImages");
	var lastimg = localStorage.getItem("img");
	document.getElementById('bgimg').style.background = "url(" + lastimg + ") no-repeat"; //通过js控制改变行内样式
	document.getElementById('bgimg').style.backgroundSize = "100%";
	for (var i = 0; i < imgs.length; i++) {

		imgs[i].onclick = function() {
			localStorage.setItem("img", this.src);
			document.getElementById('bgimg').style.background = "url(" + this.src + ") no-repeat"; //通过js控制改变行内样式
		//	console.log(this.src)
			document.getElementById('bgimg').style.backgroundSize = "100%";
		}
	}
}

