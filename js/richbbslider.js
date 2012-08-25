/* *
* Author: Richard Shen
* Date:   12/31/2011
* Usage:  Andy div element with name "richbb_slider#" will be picked up by this initializer and treated as slider
*         Slider information are in a seperate file richbbslidercfg.js
* */

var richbbSlider = {
	sliderArray: [], 
	isMouseDownOnNob: false,
	
	installSliders : function() {
		richbbSlider.addEvent(window, 'load', richbbSlider.initSliders);
	},
	
	addEvent : function(el, evnt, func) {
		if(el.addEventListener) {
			el.addEventListener(evnt, func, false);
		} else if(el.attachEvent) {
			el.attachEvent('on'+evnt, func);
		}
	},
	

	getSliderFromEvent: function (e) {
		if (!e && window.event) e=window.event;
		if (!e) return false;
	
		var el;
		if (e.target) el=e.target;
		if (e.srcElement) el=e.srcElement;
	
		if (!el.id || !el.id.match(/richbb_slider_nob\d+/)) el=el.parentNode;
		if (!el) return false;
		if (!el.id || !el.id.match(/richbb_slider_nob\d+/)) return false;
	
		return el;
	},
	
	moveSlider: function(e){
		if (!isMouseDownOnNob) return;
		var nob = richbbSlider.getSliderFromEvent(e);
		if (!nob) return;
		var sliderBar = richbbSlider.sliderArray[nob.sliderNum];
		var drawOffset = e.clientX - sliderBar.offsetLeft;
		alert(sliderBar.offsetLeft);
		nob.style.left = drawOffset+"px";
	},
	
	
	initSliders: function () {
		var divs = document.getElementsByTagName('div');
		var sliderNum;
		for (var i=0; i<divs.length; i++) {
			if( sliderNum = divs[i].id.match(/\brichbb_slider(\d+)\b/) ){
				var slider = divs[i];				
				sliderNum = parseInt(sliderNum[1]);
				richbbSlider.sliderArray[sliderNum] = slider;				
				slider.style.width = sliders[sliderNum].width;
				slider.style.height = sliders[sliderNum].height;
				slider.style.background = 'url(\''+sliders[sliderNum].sliderBase+'\')';
			}
			if( sliderNum = divs[i].id.match(/\brichbb_slider_nob(\d+)\b/) ){
				var sliderNob = divs[i];
				sliderNum = parseInt(sliderNum[1]);
				sliderNob.sliderNum = sliderNum;
				sliderNob.style.position = 'relative';
				sliderNob.style.left = '100px';
				sliderNob.style.width = sliders[sliderNum].widthNob;
				sliderNob.style.height = sliders[sliderNum].heightNob;
				sliderNob.style.background = 'url(\''+sliders[sliderNum].sliderNob+'\')';
				sliderNob.onmousedown = function (){ isMouseDownOnNob = true; };
				sliderNob.onmouseup = function (){ isMouseDownOnNob = false; };
				sliderNob.onmousemove = richbbSlider.moveSlider;
			}
			
		}
	}
};

richbbSlider.installSliders();
