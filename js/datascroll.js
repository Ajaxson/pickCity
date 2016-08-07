/*! pickScroll 1.0.1 - Ajaxson Chan - 2016-08-05 */

// 仿ios下拉效果
(function(window,doc){

	pickScroll = function(boxname,options){
		var that = this;
			//必选，图片容器
			that.obj = typeof boxname == 'object' ? boxname : document.querySelector(boxname);  
			//可选参数
			that.options = {
				ratio : options.ratio || 1.8,	//缓冲系数，就快速拉动时的后劲
				defaultIndex: options.defaultIndex || 0,  //默认第几个索引
				bigBox : document.querySelector(options.bigBox) || document.querySelector(".data-fixed"),  //大容器
				icoSure: document.querySelector(options.icosure) || document.querySelector(".ico_datasure"), //确定按钮
				dataInput : document.querySelector(options.datainput) || document.querySelector(".input_data"),  //输入框
				initCallback: options.initCallback || null, //初始化完回调
				endCallback: options.endCallback || null, //滚动完回调
				sureCallback: options.sureCallback || null, //确认时回调
				setInput : options.setInput || false  //暂时没用
			}

		// 别动
		// 可视区域超出隐藏
		that.obj.style.overflow = 'hidden';	
		// 数据层
		that.view = that.obj.getElementsByTagName("*")[0];  
		// 列表list
		that.item = that.view.querySelectorAll("*");
	
		// 有数据，因为有时多级联动，三级会无数据  ，，比如   省市区里的北京，第三极无数据
		if(that.item.length > 0){
			// 各种高度
			that.objHeight = that.obj.clientHeight; 	//可视高度
			that.viewHeight = that.view.clientHeight;   //文本实际高度
			that.itemHeight = that.item[0].clientHeight;   //行高度
			// 最大和最小位移
			that.minTo = that.objHeight / 2 - that.itemHeight / 2;  //最小到达
			that.maxTo = that.viewHeight - that.objHeight / 2 - that.itemHeight / 2; //最高到达 
			that.defaultTo = that.minTo - that.options.defaultIndex * that.itemHeight; //初始位置
			
			// 变量初始化
			that.startY = 0; //初始化触摸值
			that.moveY = 0; //移动时的y坐标
			that.nowChaY = 0; //移动实时差	
			that.endY = 0; 	//最终y	
			that.startTime = 0 //初次触摸时间
			that.moveTime = 0;  //触摸中时间
			that.endTime = 0;  //最终触摸时间
			that.chaTime = 0;  //间距时间

			// 初始化统筹变量
			that.sumY = that.defaultTo; 	//移动差统计

			// 执行方法
			that._init()	//初始显示位置
			that._start();
			that._move();
			that._end();
		}
		that._boxClick();  //点击关闭
		that._sureClick();
	}


	pickScroll.prototype = {

		// 初始化
		_init: function(){
			var that = this;
			that.item[that.options.defaultIndex].classList.add("picker-item-selected");
			that._Transition(that.sumY);
		},

		//触摸时监听
		_start: function(){
			var that = this;
			that.obj.addEventListener("touchstart",function(e){
				e.preventDefault();
				that.startTime = Date.now();
				that.startY = e.targetTouches[0].pageY;
			},false)
		},

		//移动时监听
		_move: function(){
			var that = this;
			that.obj.addEventListener('touchmove', function(e) {
				e.preventDefault();		
				// 移动实时坐标
				that.moveY = e.targetTouches[0].pageY;
				that.moveTime = Date.now();
				//本次移动差距
				that.nowChaY = that.sumY + (that.moveY - that.startY);
				//执行动画
				if(that.nowChaY < 0){
					// 向上滑
					that.nowChaY = that.nowChaY < -that.maxTo? -that.maxTo : that.nowChaY;
				}else{
					// 向下滑
					that.nowChaY = that.nowChaY > that.minTo? that.minTo : that.nowChaY;
				}
				that.options.defaultIndex = Math.round((that.minTo - that.nowChaY) / that.itemHeight);

				// 删除和添加class,活动类切换
				that._classToggle(that.options.defaultIndex);

				//执行缓冲动画
				that._Transition(that.nowChaY);
				// 测试end

			},false);
		},

		//移动完
		_end: function(){
			var that = this;
			that.obj.addEventListener('touchend', function(e) {
				e.preventDefault();	
				that.newChaY = that.nowChaY - that.sumY;  //这次移动多少
				
				// 有移动过
				if(that.moveTime > 0){
					that.endTime = Date.now();	//放开手时间
					that.chaTime = that.endTime - that.moveTime; 
					that.slowTime = that.options.ratio - that.chaTime; //缓冲时间
					that.slowTime = that.slowTime > 0? that.slowTime : 0;
					that.sumY = that.nowChaY + that.slowTime * that.newChaY; //总移动多少

					if(that.newChaY < 0){
						// 向上滑
						that.sumY = that.sumY < -that.maxTo? -that.maxTo : that.sumY;
					}else{
						// 向下滑
						that.sumY = that.sumY > that.minTo? that.minTo : that.sumY;
					}	
					that.options.defaultIndex = Math.round((that.minTo - that.sumY) / that.itemHeight);
					that.sumY = that.minTo - (that.options.defaultIndex * that.itemHeight)

					// 删除和添加class,活动类切换
					that._classToggle(that.options.defaultIndex);

					//执行缓冲动画
					that._Transition(that.sumY, function(){
						if(that.options.endCallback && typeof(that.options.endCallback) === "function" && Math.abs(that.newChaY) >= that.itemHeight/2 ){
							that.options.endCallback();
						}
					});	
				}
			},false);
		},

		//缓冲动画
		_Transition: function(toY,transCallback){
			var that = this;
			that.view.style.webkitTransform = "translate3d(0,"+ toY +"px,0)"
			if(transCallback && typeof(transCallback) === "function") transCallback();
		},

		// 兄弟类选择器
		_siblings: function(elem,callback){
				var that = this;
				var r = [];
				var n = elem.parentNode.firstChild;
				for ( ; n; n = n.nextSibling ) {
					if ( n.nodeType === 1 && n !== elem) {
						r.push( n );
						if(callback && typeof(callback) === "function") callback(n)
					}
				}
		},

		// 活动类切换
		_classToggle: function(Index){
			var that = this;
			that.item[Index].classList.add("picker-item-selected");
			that._siblings(that.item[Index],function(o){
				o.classList.remove("picker-item-selected")
			})
		},

		// 恢复初始状态
		_reffer: function(){
			var that = this;

			// 列表list
			that.item = that.view.querySelectorAll("*");
			// 有数据
			if(that.item.length > 0){
				// 各种高度
				that.objHeight = that.obj.clientHeight; 	//可视高度
				that.viewHeight = that.view.clientHeight;   //文本实际高度
				that.itemHeight = that.item[0].clientHeight;   //行高度
				// 最大和最小位移
				that.options.defaultIndex = 0; //恢复到第一个
				that.minTo = that.objHeight / 2 - that.itemHeight / 2;  //最小到达
				that.maxTo = that.viewHeight - that.objHeight / 2 - that.itemHeight / 2; //最高到达 
				that.defaultTo = that.minTo - that.options.defaultIndex * that.itemHeight; //初始位置
				//偏移量初始化
				that.sumY = 0; 	//移动差统计

				// 执行方法
				that._init()	//初始显示位置
				that._start();
				that._move();
				that._end();

				// 初始化位置
				that.item[that.options.defaultIndex].classList.add("picker-item-selected");
				that._Transition(that.defaultTo);
			}
		},

		// 点击页面
		_boxClick: function(){
			var that = this;
			that.options.bigBox.onclick = function(e){
				e.stopPropagation();
			}
			that.options.dataInput.onclick = function(e){
				e.stopPropagation();
				that.options.bigBox.classList.add("on");
			}
			document.onclick = function(){
				that.options.bigBox.classList.remove("on");
			}
		},

		_sureClick: function(e){
			var that = this;
			that.options.icoSure.addEventListener('click', function(e) {
				that.options.bigBox.classList.remove("on");
				if(that.options.sureCallback && typeof(that.options.sureCallback) === "function"){
					that.options.sureCallback();
				}
			},false)

		}

	}
	

})(window,document)


			
			