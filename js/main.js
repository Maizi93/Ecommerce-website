// JavaScript Document

window.onload = function(){
	mv.app.toTip();
	mv.app.toBanner();
	mv.app.toSel();
	mv.app.toRun();
};

var mv = {};              //命名空间

mv.tools = {};            //一些基本的方法

mv.tools.getByClass = function(oParent,sClass){
	var aEle = oParent.getElementsByTagName('*');    //获取到所有的元素
	var arr = [];

	for(var i=0;i<aEle.length;i++){
		if(aEle[i].className == sClass){
			arr.push(aEle[i]);
		}
	}
	return arr;
};

mv.tools.getStyle = function(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,false)[attr];
	}
};


mv.ui = {};     //一些通用的组件方法

mv.ui.textChange = function(obj,str){
	obj.onfocus = function(){
		if(this.value == str){
			this.value = "";
		}
	};

	obj.onblur = function(){
		if(this.value == ""){
			this.value = str;
		}
	};
};

mv.ui.fadeIn = function(obj){
	var iCur = mv.tools.getStyle(obj,'opacity');
	if(iCur == 1){
		return false;    //如果当前透明度为1，则不执行以下的代码
	}

	var value = 0;
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var iSpeed = 5;
		if(value == 100){
			clearInterval(obj.timer);
		}else{
			value += iSpeed;
			obj.style.opacity = value/100;
			obj.style.filter = 'alpha(opacity='+value+')';
		}
	},30);
};


mv.ui.fadeOut = function(obj){
	var iCur = mv.tools.getStyle(obj,'opacity');
	if(iCur == 0){
		return false;    //如果当前透明度为1，则不执行以下的代码
	}

	var value = 100;
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var iSpeed = -5;
		if(value == 0){
			clearInterval(obj.timer);
		}else{
			value += iSpeed;
			obj.style.opacity = value/100;
			obj.style.filter = 'alpha(opacity='+value+')';
		}
	},30);
};

//向左移动
mv.ui.moveLeft = function(obj,old,now){
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var iSpeed = (now - old)/10;
		iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

		if(now == old){
			clearInterval(obj.timer);
		}else{
			old += iSpeed;
			obj.style.left = old + 'px';
		}
	},30);
};

mv.app = {};       //具体应用


//输入文本框文字的显示
mv.app.toTip = function(){
	var oText1 = document.getElementById('text1');
	var oText2 = document.getElementById('text2');

	mv.ui.textChange(oText1, 'Search website');
	mv.ui.textChange(oText2, 'Search website');
}


//广告栏图片轮换显示
mv.app.toBanner = function(){
	var oAd = document.getElementById('ad');
	var oLi = oAd.getElementsByTagName('li');

	var oPrevBg = mv.tools.getByClass(oAd, 'prev_bg')[0];
	var oNextBg = mv.tools.getByClass(oAd, 'next_bg')[0];

	var oPrev = mv.tools.getByClass(oAd, 'prev')[0];
	var oNext = mv.tools.getByClass(oAd, 'next')[0];

    var iNow = 0;

	var timer = setInterval(auto, 3000);

	//自动播放(顺序)
	function auto(){
		if(iNow == oLi.length-1){
			iNow = 0;
		}else{
			iNow ++;
		}
		//所有的淡出
		for(var i = 0; i < oLi.length; i ++){
			mv.ui.fadeOut(oLi[i]);
		}
		//淡入
		mv.ui.fadeIn(oLi[iNow]);
	}

	//自动播放(逆序)
	function autoPrev(){
		if(iNow == 0){
			iNow = oLi.length-1;
		}else{
			iNow --;
		}
		//所有的淡出
		for(var i = 0; i < oLi.length; i ++){
			mv.ui.fadeOut(oLi[i]);
		}
		//淡入
		mv.ui.fadeIn(oLi[iNow]);
	}

	oPrevBg.onmouseover = oPrev.onmouseover = function(){
		oPrev.style.display = 'block';
		clearInterval(timer);
	};
	oNextBg.onmouseover = oNext.onmouseover = function(){
		oNext.style.display = 'block';
		clearInterval(timer);
	};



	oPrevBg.onmouseout = oPrev.onmouseout = function(){
		oPrev.style.display = 'none';
		timer = setInterval(auto, 3000);
	};
	oNextBg.onmouseout = oNext.onmouseout = function(){
		oNext.style.display = 'none';
		timer = setInterval(auto, 3000);
	};


	oPrev.onclick = function(){
		autoPrev();
	};
	oNext.onclick = function(){
		auto();
	};

};



//下拉菜单的相关操作
mv.app.toSel = function(){
	var oSort = document.getElementById('sel1');
	var oDd = oSort.getElementsByTagName('dd');
	var oUl = oSort.getElementsByTagName('ul');
	var oH2 = oSort.getElementsByTagName('h2');

	for(var i=0;i<oDd.length;i++){
		oDd[i].index = i;

		oDd[i].onclick = function(event){
            var event = event || window.event;
			var This = this;

			//让所有的下拉菜单先隐藏
			for (var i = 0; i < oUl.length; i++) {
				oUl[i].style.display = 'none';
			};
			//让当前点击的下拉菜单显示
			oUl[this.index].style.display = 'block';

            //点击页面任意位置，让显示的下拉菜单隐藏
			document.onclick = function(){
				oUl[This.index].style.display = 'none';
			};

			event.cancelBubble = true;
		};
	}


	for (var i = 0; i < oUl.length; i++) {
		oUl[i].index = i;
		//使用闭包封装函数
		(function(ul){
			var oLi = ul.getElementsByTagName('li');

			for (var i = 0; i < oLi.length; i++) {
				oLi[i].onmouseover = function(){
					this.className = 'active';
				};
				oLi[i].onmouseout = function(){
					this.className = '';
				};
				oLi[i].onclick = function(event){
					event = event || window.event;
                    oH2[this.parentNode.index].innerHTML = this.innerHTML;
                    this.parentNode.style.display = "none";
                    event.cancelBubble = true;
				};
			};
		})(oUl[i]);
	};
};


mv.app.toRun = function(){
	var oRun = document.getElementById('run1');
	var oUl = oRun.getElementsByTagName('ul')[0];
	var oLi = oUl.getElementsByTagName('li');

	var oPrev = mv.tools.getByClass(oRun, 'prev')[0];
	var oNext = mv.tools.getByClass(oRun, 'next')[0];

	var iNow = 0;

	oUl.innerHTML += oUl.innerHTML;

	oUl.style.width = oLi.length * oLi[0].offsetWidth + 'px';

	//给两个按钮添加点击事件
	oPrev.onclick = function(){
		if(iNow == 0){
			iNow = oLi.length/2;
			oUl.style.left = -oUl.offsetWidth/2 + 'px';
		}

		mv.ui.moveLeft(oUl,-iNow*oLi[0].offsetWidth,-(iNow-1)*oLi[0].offsetWidth);
		iNow --;
	};

	oNext.onclick = function(){

		if(iNow == oLi.length/2){
			iNow = 0;
			oUl.style.left = 0;
		}

		mv.ui.moveLeft(oUl,-iNow*oLi[0].offsetWidth,-(iNow+1)*oLi[0].offsetWidth);
		iNow ++;
	};
};