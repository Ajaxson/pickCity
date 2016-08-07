/*! pickScroll test 1.0.1 - Ajaxson Chan - 2016-08-05 */

// 仿ios下拉效果
(function(window,doc){

	cityTest = function(inputdata,options){
		var that = this;
			that.inputData = typeof inputData == 'object' ? inputData : document.querySelector(inputdata); 
			that.options = {
				Cut : options.cut || " ",	//数据分割符
			}

			// 会改变的值

			that.defaultValue = that.inputData.getAttribute("value");
			that.valueArray = that.defaultValue.split(that.options.Cut);
			// 初始化列表内容
			that.province = "",
			that.city = "",
			that.county = "";
			// 初始化所在所以
		 	that.proIndex = 0,
		    that.cityIndex = 0,
		    that.countyIndex = 0;

			if(that.defaultValue){
				// 如果有值，按里面的值做条件 来渲染
				that._itemAppend(that.valueArray[0], that.valueArray[1], that.valueArray[2])
			}else{
				// 无值，取json第一条
				that._oneAppend();
				that._twoAppend(0);
				that._threeAppend(0,0);
			}

		that.inputData.addEventListener("touchstart",function(e){
			// that._refffer();
		},false)
	}


	cityTest.prototype = {

		// 第一阶梯赋值
		_oneAppend: function(){
			// 获得城市
			var that = this;
			that.province = "";
			for(var p in country_Json){
				that.province = that.province + "<div class=\"picker-item\" attr-value=\""+ country_Json[p].name +"\">"+ country_Json[p].name +"</div>"
			}
			document.querySelector(".col-province .picker-view").innerHTML = that.province;
		},

		// 第二阶梯赋值
		_twoAppend: function(p){
			// 获得城市
			var that = this;
			that.city = "";
			for(var c in country_Json[p].sub){
				that.city = that.city + "<div class=\"picker-item\" attr-value=\""+ country_Json[p].sub[c].name +"\">"+ country_Json[p].sub[c].name +"</div>"
			}
			document.querySelector(".col-city .picker-view").innerHTML = that.city;
		},

		// 第三阶梯赋值
		_threeAppend: function(p,c){
			// 获得区县
			var that = this;
			that.county = "";
			for(var o in country_Json[p].sub[c].sub){
				that.county = that.county + "<div class=\"picker-item\" attr-value=\""+ country_Json[p].sub[c].sub[o].name +"\">"+ country_Json[p].sub[c].sub[o].name +"</div>"
			}
			document.querySelector(".col-county .picker-view").innerHTML = that.county;
		},


		_itemAppend: function(valueOne, valueTwo, valueThree){
			var that = this;
			// 获得省份
			for(var p in country_Json){
				that.province = that.province + "<div class=\"picker-item\" attr-value=\""+ country_Json[p].name +"\">"+ country_Json[p].name +"</div>"
				if(country_Json[p].name == valueOne){
					that.proIndex = p;
				}
			}
			document.querySelector(".col-province .picker-view").innerHTML = that.province;
			// 获得城市
			for(var c in country_Json[that.proIndex].sub){
				that.city = that.city + "<div class=\"picker-item\" attr-value=\""+ country_Json[that.proIndex].sub[c].name +"\">"+ country_Json[that.proIndex].sub[c].name +"</div>"
				if(country_Json[that.proIndex].sub[c].name == valueTwo){
					that.cityIndex = c;
				}
			}
			document.querySelector(".col-city .picker-view").innerHTML = that.city;
			// 获得区县
			for(var o in country_Json[that.proIndex].sub[that.cityIndex].sub){
				that.county = that.county + "<div class=\"picker-item\" attr-value=\""+ country_Json[that.proIndex].sub[that.cityIndex].sub[o].name +"\">"+ country_Json[that.proIndex].sub[that.cityIndex].sub[o].name +"</div>"
				if(country_Json[that.proIndex].sub[that.cityIndex].sub[o].name == valueThree){
					that.countyIndex = o;
				}
			}
			document.querySelector(".col-county .picker-view").innerHTML = that.county;
		},

		_refffer: function(){
			var that = this;

			that.defaultValue = that.inputData.getAttribute("value");
			that.valueArray = that.defaultValue.split(that.options.Cut);
			// 初始化列表内容
			that.province = "",
			that.city = "",
			that.county = "";
			// 初始化所在所以
		 	that.proIndex = 0,
		    that.cityIndex = 0,
		    that.countyIndex = 0;

			if(that.defaultValue){
				// 如果有值，按里面的值做条件 来渲染
				that._itemAppend(that.valueArray[0], that.valueArray[1], that.valueArray[2])
			}else{
				// 无值，取json第一条
				that._oneAppend();
				that._twoAppend(0);
				that._threeAppend(0,0);
			}

		} 

	}
	

})(window,document)


			
			