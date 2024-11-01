/**
 * tt_slideshow.js 1.0.0
 * Main file for the slider, it includes all the effect and animations for the background images as well as slideshow foreground shapes and images.
 * For slide background, each effect is defined with their effect name and function to execute the backgound effect is  $.fn.TTSlider.slideShow()
 * foreground effects are applied calling the  $.fn.TTSlider.effectForeground() method.
 * @author TemplateToaster
 * GPL Licensed
 */

; (function ($) {
    var _bgStretcherAction = false;
    var _bgStretcherTm = null;
    var element = null;
    var element1 = null;
    var currentSlide = null;
    var transitionEffect = null;
    var v = null;
    var dx = null;
    var mycanvas = null;
    var loop = null;
    var ctx = null;
    var count = 0;
    var length = 0;
    var timeout = 1000;
    img = new Image();
    $.fn.TTSlider = function (settings) {
        element = $(this);
        element1 = $(this).find("ul:first");
        currentSlide = element.find('> ul > li:first');
        transitionEffect = currentSlide.attr("data-slideEffect");
		
        settings = $.extend({}, $.fn.TTSlider.defaults, settings);
        $.fn.TTSlider.settings = settings;
        stopTransition = $.fn.TTSlider.settings.stopTransition;
        prefix = $.fn.TTSlider.settings.cssPrefix;
        timeout = $.fn.TTSlider.settings.begintime;
        if (transitionEffect == 'None' || transitionEffect == 'Blind' || transitionEffect == 'Circlereveal' || transitionEffect == 'Fade' || transitionEffect == 'Pixelate' || transitionEffect == 'RadialBlur' || transitionEffect == 'Ripple' || transitionEffect == 'Wipe' || transitionEffect == 'SlideLeft' || transitionEffect == 'SlideRight' || transitionEffect == 'SlideTop' || transitionEffect == 'SlideBottom') {
            
			var list = currentSlide.find('.' + prefix + 'slideshow_last').children().length;
            if (list != 0) {
                currentSlide.find('.' + prefix + 'slideshow_last').children().hide();
                $.fn.TTSlider.effectForeground(currentSlide);
            }
            
            //$(this.selector + ' > ul > li:gt(0)').hide();
        	var topid = $(this).attr('id');
            $( '#' + topid + ' > ul > li:gt(0)').hide();
        }
        $.fn.TTSlider.pagination();
        $.fn.TTSlider.button();
        if (!stopTransition) {
        _bgStretcherTm = setTimeout('jQuery.fn.TTSlider.slideShow(\'' + jQuery.fn.TTSlider.settings.sequenceMode + '\', -1)', timeout);
		}
    };

    /*  Default Settings  */
    $.fn.TTSlider.defaults = {

        slideShowSpeed: '3000',
        begintime:'1000',
        transitionEffect: 'fade', // none, fade, simpleSlide, superSlide
        slideDirection: 'N', // N, S, W, E, (if superSlide - NW, NE, SW, SE)
        sequenceMode: 'normal', // back, random
        cssPrefix: '~prefix~'

    };
    $.fn.TTSlider.settings = {};
    $.fn.TTSlider.slideShow = function (sequence_mode, index_next) {
        _bgStretcherAction = true;
        var next;
        $(currentSlide).stop(true, true);
        if (index_next == -1) {

            next = currentSlide.next();
            if (!next.length) { next = element.find('> ul li:first'); }
        }
        else if (index_next == -2) {

            next = currentSlide.prev();
            if (!next.length) { next = element.find('> ul li:last'); }
        }
        else {
            next = element.find('#Slide' + index_next);
        }

        var index = currentSlide.attr('id').substring(5);
        var nav = $('.paginationLink').eq(index);
        nav.removeClass('current');

        var index1 = next.attr('id').substring(5);
        var nav1 = $('.paginationLink').eq(index1);
        nav1.addClass('current');
        next.css({ "left": "0px", "top": "0px" });
        currentSlide.css({ "left": "0px", "top": "0px" });
        next.find('.' + prefix + 'slideshow_last').children().css("display", "none");
        transitionEffect = next.attr("data-slideEffect");
        switch (transitionEffect) {

            case 'Fade':
                $.fn.TTSlider.effectFade(currentSlide, next);
                break;
            case 'Circlereveal':
                $.fn.TTSlider.effectCirclereveal(currentSlide, next);
                break;
            case 'RadialBlur':
                $.fn.TTSlider.effectRadialblur(currentSlide, next);
                break;
            case 'Wipe':
                $.fn.TTSlider.effectWipe(currentSlide, next);
                break;
            case 'SlideLeft':
                $.fn.TTSlider.effectSlideLeft(currentSlide, next);
                break;
            case 'SlideRight':
                $.fn.TTSlider.effectSlideRight(currentSlide, next);
                break;
            case 'SlideTop':
                $.fn.TTSlider.effectSlideTop(currentSlide, next);
                break;
            case 'SlideBottom':
                $.fn.TTSlider.effectSlideBottom(currentSlide, next);
                break;
            case 'Blind':
                $.fn.TTSlider.effectBlind(currentSlide, next);
                break;
            case 'Pixelate':
                $.fn.TTSlider.effectPixelate(currentSlide, next);
                break;
            case 'SimpleSlide':
                $.fn.TTSlider.simpleSlide(next);
                break;
            default:
                $.fn.TTSlider.effectNone(currentSlide, next);
                break;
        }
        
        //for video in slideshow-start
        
        /*var slideshowParent = document.getElementById(prefix + "slideshow_inner");
        var slideshowParentChildren = slideshowParent['children'];
        slideshowParentChildren = slideshowParentChildren[0];
        slideshowParentChildren = slideshowParentChildren['children'];
        var i = 0;
        for ( i = 0; i < slideshowParentChildren.length; i++)
        {
        	if (slideshowParentChildren[i].id == currentSlide['0'].id)
        	{
        		var slide_child = slideshowParentChildren[i];
        		slide_child = slide_child['children'];
        		var child_id1 = slide_child[0].id
        		var currentSlide_child1 = slide_child[0];
        		if (child_id1 == prefix + 'slideshow_video')
        		{		
					try 
					{
						currentSlide_child1.play();
					}
					catch(err)
					{
	
					}
					var sorce = currentSlide_child1.src;
					if(sorce.match('youtube'))
					{
						if(!sorce.match('&autoplay=1'))
						{
							currentSlide_child1.src += "&autoplay=1";
						}
					}
        		}
        	}
        	else
        	{
        		var slide_child = slideshowParentChildren[i];
        		slide_child = slide_child['children'];
        		var child_id1 = slide_child[0].id
        		var currentSlide_child1 = slide_child[0];
        		if (child_id1 == prefix + 'slideshow_video')
        		{		
					try 
					{				
        			currentSlide_child1.pause();
					}
					catch(err)
					{
						
					}
					var sorce = currentSlide_child1.src;
					if(sorce.match('youtube'))
					{
						if(sorce.match('&autoplay=1'))
						{
							var splt = sorce.split('&');
							var j = 0;							
							var conSrc = '';
							for (j = 0; j < splt.length-1;j++)
							{
							conSrc += splt[j];
							}
							currentSlide_child1.src = conSrc; 
						}
					}
        		}
        	}
        }*/
        
        //for video in slideshow-end
        currentSlide = next;
    };

    //================= None Effect
    $.fn.TTSlider.effectNone = function (current, next) {
        next.show();
        // next.prependTo(element);
        var slides = $('#' + element.attr('id') + ' > ul li:lt(' + next.index() + ')');
        slides.appendTo(element1);
        current.delay($.fn.TTSlider.settings.slideShowSpeed).hide(10, function () {

            var list = next.find('.' + prefix + 'slideshow_last').children().length;
            if (list != 0) {
                $.fn.TTSlider.effectForeground(next);
            }
            // current.appendTo(element);
            _bgStretcherAction = false;
             if (!stopTransition) {
            _bgStretcherTm = setTimeout('jQuery.fn.TTSlider.slideShow(\'' + jQuery.fn.TTSlider.settings.sequenceMode + '\', -1)', timeout);
            }
        });
    };

    //================= Fade Effect
    $.fn.TTSlider.effectFade = function (current, next) {
        next.show();
        //next.prependTo(element);
        var slides = $('#' + element.attr('id') + ' > ul li:lt(' + next.index() + ')');
        slides.appendTo(element1);
        current.fadeOut($.fn.TTSlider.settings.slideShowSpeed, function () {
            var list = next.find('.' + prefix + 'slideshow_last').children().length;
            if (list != 0) {
                $.fn.TTSlider.effectForeground(next);
            }
            _bgStretcherAction = false;
             if (!stopTransition) {
            _bgStretcherTm = setTimeout('jQuery.fn.TTSlider.slideShow(\'' + jQuery.fn.TTSlider.settings.sequenceMode + '\', -1)', timeout);
            }
        });
    };


    // ================= CircleReveal Effect
    $.fn.TTSlider.effectCirclereveal = function (current, next) {
        next.hide(0);
        next.css({ "border-radius": "50%" });
        next.show("scale", { percent: 100, direction: 'both' }, $.fn.TTSlider.settings.slideShowSpeed, function () {
            //current.appendTo(element);
            var slides = $('#' + element.attr('id') + ' > ul li:lt(' + next.index() + ')');
            slides.appendTo(element1);
            current.hide();
            next.css({ "border-radius": "0%" });
            var list = next.find('.' + prefix + 'slideshow_last').children().length;
            if (list != 0) {
                $.fn.TTSlider.effectForeground(next);
            }
            //current.appendTo(element);
            _bgStretcherAction = false;
             if (!stopTransition) {
            _bgStretcherTm = setTimeout('jQuery.fn.TTSlider.slideShow(\'' + jQuery.fn.TTSlider.settings.sequenceMode + '\', -1)', timeout);
            }
        });
    };

    // ================= RadialBlur Effect
    $.fn.TTSlider.effectRadialblur = function (current, next) {
        next.show();
        var slides = $('#' + element.attr('id') + ' > ul li:lt(' + next.index() + ')');
        slides.appendTo(element1);
        current.hide("puff", { percent: 150 }, $.fn.TTSlider.settings.slideShowSpeed, function () {
            var list = next.find('.' + prefix + 'slideshow_last').children().length;
            if (list != 0) {
                $.fn.TTSlider.effectForeground(next);
            }
            _bgStretcherAction = false;
             if (!stopTransition) {
            _bgStretcherTm = setTimeout('jQuery.fn.TTSlider.slideShow(\'' + jQuery.fn.TTSlider.settings.sequenceMode + '\', -1)', timeout);
            }
        });
    };

    //================= Wipe Effect
    $.fn.TTSlider.effectWipe = function (current, next) {
        next.show();
        var slides = $('#' + element.attr('id') + ' > ul li:lt(' + next.index() + ')');
        slides.appendTo(element1);

        current.hide('drop', { direction: 'right' }, $.fn.TTSlider.settings.slideShowSpeed, function () {
            var list = next.find('.' + prefix + 'slideshow_last').children().length;
            if (list != 0) {
                $.fn.TTSlider.effectForeground(next);
            }
            _bgStretcherAction = false;
             if (!stopTransition) {
            _bgStretcherTm = setTimeout('jQuery.fn.TTSlider.slideShow(\'' + jQuery.fn.TTSlider.settings.sequenceMode + '\', -1)', timeout);
            }
        });
    };

    //================= SlideLeft Effect
    $.fn.TTSlider.effectSlideLeft = function (current, next) {
        next.show();
        var w = element.width();
        next.css("left", "-" + w + "px");
        current.animate({ "left": w + "px" }, $.fn.TTSlider.settings.slideShowSpeed);
        next.animate({ "left": "0px" }, $.fn.TTSlider.settings.slideShowSpeed, function () {
            var list = next.find('.' + prefix + 'slideshow_last').children().length;
            if (list != 0) {
                $.fn.TTSlider.effectForeground(next);
            }
            current.appendTo(element1);
            _bgStretcherAction = false;
             if (!stopTransition) {
            _bgStretcherTm = setTimeout('jQuery.fn.TTSlider.slideShow(\'' + jQuery.fn.TTSlider.settings.sequenceMode + '\', -1)', timeout);
            }
        });
    };

    //================= SlideRight Effect
    $.fn.TTSlider.effectSlideRight = function (current, next) {
        next.show();
        var w = element.width();
        next.css("left", w + "px");
        current.animate({ "left": "-" + w + "px" }, $.fn.TTSlider.settings.slideShowSpeed);
        next.animate({ "left": "0px" }, $.fn.TTSlider.settings.slideShowSpeed, function () {
            var list = next.find('.' + prefix + 'slideshow_last').children().length;
            if (list != 0) {
                $.fn.TTSlider.effectForeground(next);
            }
            current.appendTo(element1);
            _bgStretcherAction = false;
            if (!stopTransition){
            _bgStretcherTm = setTimeout('jQuery.fn.TTSlider.slideShow(\'' + jQuery.fn.TTSlider.settings.sequenceMode + '\', -1)', timeout);
            }
        });
    };

    //================= SlideTop Effect
    $.fn.TTSlider.effectSlideTop = function (current, next) {
        next.show();
        var t = element.height();
        next.css("top", "-" + t + "px");
        current.animate({ "top": t + "px" }, $.fn.TTSlider.settings.slideShowSpeed);
        next.animate({ "top": "0px" }, $.fn.TTSlider.settings.slideShowSpeed, function () {
            var list = next.find('.' + prefix + 'slideshow_last').children().length;
            if (list != 0) {
                $.fn.TTSlider.effectForeground(next);
            }
            current.appendTo(element1);
            _bgStretcherAction = false;
             if (!stopTransition) {
            _bgStretcherTm = setTimeout('jQuery.fn.TTSlider.slideShow(\'' + jQuery.fn.TTSlider.settings.sequenceMode + '\', -1)', timeout);
            }
        });
    };

    //================= SlideBottom Effect
    $.fn.TTSlider.effectSlideBottom = function (current, next) {
        next.show();
        var t = element.height();
        next.css("top", t + "px");
        current.animate({ "top": "-" + t + "px" }, $.fn.TTSlider.settings.slideShowSpeed);
        next.animate({ "top": "0px" }, $.fn.TTSlider.settings.slideShowSpeed, function () {
            var list = next.find('.' + prefix + 'slideshow_last').children().length;
            if (list != 0) {
                $.fn.TTSlider.effectForeground(next);
            }
            current.appendTo(element1);
            _bgStretcherAction = false;
             if (!stopTransition) {
            _bgStretcherTm = setTimeout('jQuery.fn.TTSlider.slideShow(\'' + jQuery.fn.TTSlider.settings.sequenceMode + '\', -1)', timeout);
            }
        });
    };

    // ================= Blind Effect
    $.fn.TTSlider.effectBlind = function (current, next) {
        next.show();
        next.prependTo(element1);
        current.show($.fn.TTSlider.settings.slideShowSpeed, function () {
            var elementWidth = current.width();
            var elementHeight = current.height();
            var duration = $.fn.TTSlider.settings.slideShowSpeed;
            var sliceDelay = 10;
            var numberOfSlices = 5;
            var slice = new Object();
            slice.Name = "my_slice";
            slice.Height = elementHeight / numberOfSlices;
            slice.Width = elementWidth;
            slice.InitialLeft = 0;
            slice.InitialTop = 0.1;
            slice.LeftLimit = null;
            slice.TopLimit = 0.1;
            slice.nextNumber = 1;
            var nextImgSrc = next.css('background-image').replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
            var background_color = next.css('background-color');
            var background_size = next.css('background-size');
            var background_position = next.css('background-position');
            slicesGenerated = createSlices(current, numberOfSlices, slice, nextImgSrc, background_color, background_size, background_position, true);
            animateSlices(slicesGenerated, slice.LeftLimit, slice.TopLimit, duration, sliceDelay, true);
            setTimeout(function () {
                current.hide();
                var list = next.find('.' + prefix + 'slideshow_last').children().length;
                if (list != 0) { $.fn.TTSlider.effectForeground(next); }
                current.appendTo(element1);
                _bgStretcherAction = false;
                 if (!stopTransition) {
                _bgStretcherTm = setTimeout('jQuery.fn.TTSlider.slideShow(\'' + jQuery.fn.TTSlider.settings.sequenceMode + '\', -1)', timeout);
                }
            }, $.fn.TTSlider.settings.slideShowSpeed);
        });
    };


    // blind----------------------------

    function createSlices(parent, no_of_slices, slice, nextImgSrc, background_color, size, position, nextimg) {
        var Left = null;
        var Top = null;
        if (nextimg) {
            Left = null;
            Top = 0.1;
        }

        var slices = new Array(no_of_slices);
        var el = parent.attr('id');
        var w = parent.width();
        var h = parent.height();
        for (var i = 0; i < slices.length; i++) {

            slices[i] = slice.Name + slice.nextNumber;
            var ele = document.createElement('div');
            ele.setAttribute("id", slices[i]);
            ele.style.position = "absolute";
            ele.style.overflow = "hidden";
            ele.style.width = slice.Width + "px";
            ele.style.height = slice.Height + "px";
            ele.style.left = Left + "px";
            ele.style.top = Top + "px";

            var innerDiv = document.createElement('div');
            var innerDivName = "child_" + slice.Name + slice.nextNumber;
            innerDiv.setAttribute("id", innerDivName);
            innerDiv.style.position = "absolute";
            innerDiv.style.overflow = "hidden";
            innerDiv.style.width = w + "px";
            innerDiv.style.height = h + "px";
            innerDiv.style.left = Left + "px";
            innerDiv.style.top = -Top + "px";
            if (nextImgSrc != "none")
            {
                innerDiv.style.backgroundImage = "url(" + nextImgSrc + ")";
            }
            else
            {
            	innerDiv.style.backgroundColor = background_color;
            }
            innerDiv.style.backgroundPosition = position;
            innerDiv.style.backgroundSize = size;
            innerDiv.style.backgroundRepeat = "no-repeat";
            Top = Top + slice.Height;
            ele.appendChild(innerDiv);
            ////el = parent.attr('id');
            document.getElementById(el).appendChild(ele);
            ++(slice.nextNumber);
        }
        return (slices);
    };
    function animateSlices(slices, leftLimit, topLimit, duration, delay, removeSlicesAfterAnimation) {
        var timing = 1;
        var currentElement = null;
        for (var i = 0; i < slices.length; i++) {
            currentElement = $("#" + slices[i]);
            animator.move(currentElement, leftLimit, topLimit, duration, timing, removeSlicesAfterAnimation);
            timing = timing + delay;
        }
    };

    var animator = new Object();
    animator.move = function (ele, leftLimit, topLimit, duration, delay, remove) {
        var w = ele.width();
        var h = ele.height();
        ele.height(topLimit);
        //alert('w and h is '+w+'-'+h);
        setTimeout(function () {
            if (leftLimit == null) {
                if (remove) { ele.animate({ height: h }, duration, function () { ele.remove(); }); }
                else { ele.animate({ height: h }, duration); }
            }
            else {
                if (remove) { ele.animate({ left: leftLimit }, duration, null, function () { ele.remove(); }); }
                else { ele.animate({ left: leftLimit }, duration); }
            }
        }, delay);
    };

    // ================= Pixelalte Effect
    $.fn.TTSlider.effectPixelate = function (current, next) {
        next.prependTo(element);
        next.show(10, function () {
            mycanvas = document.getElementById('mycanvas');
            mycanvas.width = element.width();
            mycanvas.height = element.height();
            ctx = mycanvas.getContext('2d');
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            //img.onload = function(){pixelate;};
            window.img.src = next.css('background-image').replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
            v = Math.min(25, parseInt(25, 10)),
                dx = 0.3;
            anim();
        });

        current.hide(10, function () {
            _bgStretcherAction = false;
            current.appendTo(element);
        });
    };

    function pixelate(v) {
        var size = v * 0.02,
            w = mycanvas.width * size,
            h = mycanvas.height * size;
        ctx.drawImage(img, 0, 0, w, h);
        ctx.drawImage(mycanvas, 0, 0, w, h, 0, 0, mycanvas.width, mycanvas.height);
    }

    function anim() {
        v += dx;
        if (v <= 1 || v > 25) {
            dx = -dx;
            clearInterval(loop);
        }
        pixelate(v);
        loop = setTimeout(anim, 10);
    }

    /*$.fn.TTSlider.effectCirclereveal = function (current, next) {
        next.css({ "border-radius": "50%" });
        next.show("scale",{ percent: 100, direction: 'both' }, $.fn.TTSlider.settings.slideShowSpeed , function () {
                /*next.css({"border-radius":"0%","-moz-transition":"border-radius 1s   linear","transition":"border-radius 1s   linear"});*/
    /*next.animate({
         borderTopLeftRadius: 0,
         borderTopRightRadius: 0,
         borderBottomLeftRadius: 0,
         borderBottomRightRadius: 0
     }, $.fn.TTSlider.settings.slideShowSpeed , function () {
         var list = next.find('.' + prefix + 'slideshow_last').children().length;
         if (list != 0) {
             $.fn.TTSlider.effectForeground(next);
         }
 current.appendTo(element);
 transitionEffect = next.attr("data-slideEffect");
 setTimeout('jQuery.fn.TTSlider.slideShow(\''+jQuery.fn.TTSlider.settings.sequenceMode+'\', -1)',(timeout * 1000));
     });
 });
};*/

    /*$.fn.TTSlider.simpleSlide = function(next){
        var t, l;
        switch ($.fn.TTSlider.settings.slideDirection) {
            case 'N':
            case 'S':
                t = next.index() * next.height()*(-1);
                l = 0;
                break;
            default:
                l = next.index() * next.width()*(-1);
                t = 0;
        }
        element.animate({left: l+'px', top: t+'px'}, $.fn.TTSlider.settings.slideShowSpeed, function(){
            _bgStretcherAction = false;
            transitionEffect = next.attr("data-slideEffect");
        });
    };*/

    $.fn.TTSlider._clearTimeout = function () {
        if (_bgStretcherTm != null) {
            clearTimeout(_bgStretcherTm);
            _bgStretcherTm = null;
        }
    };

    /*  Pagination  */
    $.fn.TTSlider.pagination = function () {
        var slides = $("." + $.fn.TTSlider.settings.cssPrefix + "slide");
        var numberOfSlides = slides.length;
        for (var i = 0; i < numberOfSlides; i++) {
            (function () {
                var closureCount = i;
                var slideLabel = i + 1;
                var className = "paginationLink";
                var x = $('<div class="' + className + '"><a id="pag' + slideLabel + '"href="javascript:void(0);" class="pg">' + slideLabel + '</a></div>');
                x.click(function () {
                    var elem = $('#' + element.attr('id') + '> ul li');
                    var ele = $("." + prefix + 'slideshow_last > div');
                    ele.finish();
                    elem.stop(true, true);
                    $.fn.TTSlider._clearTimeout();
                    $.fn.TTSlider.slideShow($.fn.TTSlider.settings.sequenceMode, closureCount);

                });
                $('#nav').append(x);
            })();
        }
        $('#nav > a:first').addClass('current');
    };
    $.fn.TTSlider.button = function () {
        var x = $('<a id="prev" style="border:none;" href="javascript:void(0);"><span>previous</span></a>');
        var y = $('<a id="next" style="border:none;" href="javascript:void(0);"><span>next</span></a>');
        var slides = $("." + $.fn.TTSlider.settings.cssPrefix + "slide");
        var numberOfSlides = slides.length;
        x.click(function () {
            if (_bgStretcherAction || (numberOfSlides < 2)) return false;
            /*$(element.selector + '> div:gt(0)').stop(true, true);
            $(element.selector + '> div:gt(0) > div > div:gt(0)').stop(true, true);*/
            var elem = $('#' + element.attr('id') + '> ul li');
            var ele = $('.' + prefix + 'slideshow_last > div');
            ele.finish();
            elem.stop(true, true);
            $.fn.TTSlider._clearTimeout();
            $.fn.TTSlider.slideShow($.fn.TTSlider.settings.sequenceMode, -2);

        });
        y.click(function () {
            if (_bgStretcherAction || (numberOfSlides < 2)) return false;
            var elem = $('#' + element.attr('id') + '> ul li');
            var ele = $('.' + prefix + 'slideshow_last > div');
            ele.finish();
            elem.stop(true, true);
            $.fn.TTSlider._clearTimeout();
            $.fn.TTSlider.slideShow($.fn.TTSlider.settings.sequenceMode, -1);
            
            });
        $('.left-button').append(x);
        $('.right-button').append(y);
    };

    /*------------ Foreground Image Effects -----------------*/
    $.fn.TTSlider.effectForeground = function (div1) {
        var listing = div1.find("." + prefix + "slideshow_last ").children();
        var listing1 = div1.find("." + prefix + "slideshow_element_alignment").children();       
       	var combinedarr = $.merge( listing, listing1 );		
       	$(combinedarr).each(function(){    
            effectt = $(this).attr("data-effect");
            time = $(this).attr("data-begintime");
            duration = $(this).attr("data-duration");
            easingg = $(this).attr("data-easing");
            slidedirection = $(this).attr("data-slide");
            w = $('.' + prefix + 'slideshow_last').width();
            h = $('.' + prefix + 'slideshow_last').height();
            f_width = $(this).width();
            f_height = $(this).height();
            
            if (navigator.appVersion.indexOf("MSIE 8.") != -1) {
                left = $(this).css("left");
                right = $(this).css("right");
            }
            else {               
                style = window.getComputedStyle(this),
                left = style.getPropertyValue("left");
                right = $(this).css("right");
            }
            
            if(left == "0px" && right =="0px"){
				margin_border = 0;
				mleft = $(this).css("margin-left").replace("px","");
				if(mleft != "auto" ){
					margin_border = Number(mleft);
				}
				mright = $(this).css('margin-right').replace("px","");
				if(mright != "auto"){
					margin_border = Number(mright);
				}
				bleft = $(this).css("border-left-width").replace("px","");
				if(bleft != "auto"){
					margin_border = Number(bleft);
				}
				bright = $(this).css("border-right-width").replace("px","");
				if(bright != "auto"){
					margin_border = Number(bright);
				}
				
				left = ((w/2 - f_width/2)/( w - margin_border) * 100) +"%";
				if(slidedirection !== undefined)
				{
					if(slidedirection == "None" || slidedirection == "top" || slidedirection == "bottom"){
						$(this).css("right", "0px");
					}
					else{
						$(this).css("right", "auto");
					}	
				}
			 }
			 
             topp = $(this).css("top");
             bottomm = $(this).css("bottom");
            var t = time * 1000;
            var d = duration * 1000;
            timeout1 = Number(t) + Number(d) + 500;
            timeout = (timeout > timeout1) ? timeout : timeout1;
            switch (slidedirection) {
            case 'left':
               if(left == 'auto')
               {
			   	  if (effectt == 'Fade') {
                       $(this).css({ 'right': '100%' }).delay(t).fadeIn(1000).animate({ 'right': right }, d, easingg);
                   }
                   else {
                       $(this).css({ 'right': '100%' }).delay(t).show().animate({ 'right': right }, d, easingg);
                   }
                }
                else if(right == 'auto')
                {
			   	  if (effectt == 'Fade')
			   	  {
                    $(this).css({ 'left': -w + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left }, d, easingg);
                  }
                 else 
                  {
                    $(this).css({ 'left': -w + 'px' }).delay(t).show().animate({ 'left': left }, d, easingg);
                  }
                }
                else
                {
				if (effectt == 'Fade') {
                       $(this).css({ 'left': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left }, d, easingg);
                   }
                   else {
                      $(this).css({ 'left': -f_height + 'px' }).delay(t).show().animate({ 'left': left }, d, easingg);
                   }
				}   
                break;
                case 'right':
                    if (effectt == 'Fade') {
                       if(left == 'auto')
                    	{
							$(this).css({ 'right': -w + 'px' }).delay(t).fadeIn(1000).animate({ 'right': right }, d, easingg);	
						}
						else
						{
							$(this).css({ 'left': w + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left }, d, easingg);
						}
                    }
                    else {
                        if(left == 'auto')
                    	{
							$(this).css({ 'right': -w + 'px' }).delay(t).show().animate({ 'right': right }, d, easingg);	
						}
						else
						{
							$(this).css({ 'left': w + 'px' }).delay(t).show().animate({ 'left': left }, d, easingg);
						}
                    }
                    break;
                case 'top':
                    if(bottomm != 'auto') {
                        let bottom = parseInt(h) - parseInt(f_height);
                    if (effectt == 'Fade') {
                            $(this).css({ 'bottom': bottom + 'px' }).delay(t).fadeIn(1000).animate({ 'bottom': bottomm }, d, easingg);
                    }
                    else {
                            $(this).css({ 'bottom': bottom + 'px' }).delay(t).show().animate({ 'bottom': bottomm }, d, easingg);
                    }
                    }
                    else {
                        if (effectt == 'Fade') {
                            $(this).css({ 'top': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({ 'top': -f_height + 'px' }).delay(t).show().animate({ 'top': topp }, d, easingg);
                        }
                    }
                    break;
                case 'bottom':
                    if(bottomm != 'auto') {
                    if (effectt == 'Fade') {
                            $(this).css({ 'bottom': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'bottom': bottomm }, d, easingg);
                    }
                    else {
                            $(this).css({ 'bottom': -f_height + 'px' }).delay(t).show().animate({ 'bottom': bottomm }, d, easingg);
                    }
                    }
                    else {
                        if (effectt == 'Fade') {
                            $(this).css({ 'top': h + 'px' }).delay(t).fadeIn(1000).animate({ 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({ 'top': h + 'px' }).delay(t).show().animate({ 'top': topp }, d, easingg);
                        }
                    }
                    break;
                case 'left,top':
                if(bottomm != 'auto') {
                    let bottom = parseInt(h) - parseInt(f_height);
                if(left == 'auto')
                {
                    if (effectt == 'Fade') {
                            $(this).css({ 'right': '100%', 'bottom': bottom + 'px' }).delay(t).fadeIn(1000).animate({ 'right': right, 'bottom': bottomm }, d, easingg);
                    }
                    else {
                            $(this).css({ 'right': '100%', 'bottom': bottom + 'px' }).delay(t).show().animate({ 'right': right, 'bottom': bottomm }, d, easingg);
                    }
                }
                else if(right == 'auto')
                {
                    if (effectt == 'Fade') {
                            $(this).css({ 'left': -w + 'px', 'bottom': bottom + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'bottom': bottomm }, d, easingg);
                    }
                    else {
                            $(this).css({ 'left': -w + 'px', 'bottom': bottom + 'px' }).delay(t).show().animate({ 'left': left, 'bottom': bottomm }, d, easingg);
                    }
                }
				else
				{
                    if (effectt == 'Fade') {
                            $(this).css({  'left': -f_height + 'px', 'bottom': bottom + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'bottom': bottomm }, d, easingg);
                    }
                    else {
                            $(this).css({  'left': -f_height + 'px', 'bottom': bottom + 'px' }).delay(t).show().animate({ 'left': left, 'bottom': bottomm }, d, easingg);
                    }
				}   
                }
                else {
                    if(left == 'auto')
                    {
                        if (effectt == 'Fade') {
                            $(this).css({ 'right': '100%', 'top': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'right': right, 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({ 'right': '100%', 'top': -f_height + 'px' }).delay(t).show().animate({ 'right': right, 'top': topp }, d, easingg);
                        }
                    }
                    else if(right == 'auto')
                    {
                        if (effectt == 'Fade') {
                            $(this).css({ 'left': -w + 'px', 'top': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({ 'left': -w + 'px', 'top': -f_height + 'px' }).delay(t).show().animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                    }
                    else
                    {
                        if (effectt == 'Fade') {
                            $(this).css({  'left': -f_height + 'px', 'top': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({  'left': -f_height + 'px', 'top': -f_height + 'px' }).delay(t).show().animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                    }   
                }
				break;
                case 'right,top':
                if(bottomm != 'auto') {
                    let bottom = parseInt(h) - parseInt(f_height);
                   if(left == 'auto')
                {
					 if (effectt == 'Fade') {
                            $(this).css({ 'right': -w + 'px', 'bottom': bottom + 'px' }).delay(t).fadeIn(1000).animate({ 'right': right, 'bottom': bottomm }, d, easingg);
                    }
                    else {
                            $(this).css({ 'right': -w + 'px', 'bottom': bottom + 'px' }).delay(t).show().animate({ 'right': right, 'bottom': bottomm }, d, easingg);
                    }
				}
				else if(right == 'auto')
                {
                    if (effectt == 'Fade') {
                            $(this).css({ 'left': '100%', 'bottom': bottom + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'bottom': bottomm }, d, easingg);
                    }
                    else {
                            $(this).css({ 'left': '100%', 'bottom': bottom + 'px' }).delay(t).show().animate({ 'left': left, 'bottom': bottomm }, d, easingg);
                    }
                }
				else
				{
					if (effectt == 'Fade') {
                        $(this).css({ 'left': w + 'px', 'bottom': bottom + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left }, d, easingg);
                    }
                    else {
                        $(this).css({ 'left': w + 'px', 'bottom': bottom + 'px' }).delay(t).animate({ 'left': left }, d, easingg);
                    }
				}
                }
                else {
                    if(left == 'auto')
                    {
                        if (effectt == 'Fade') {
                            $(this).css({ 'right': -w + 'px', 'top': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'right': right, 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({ 'right': -w + 'px', 'top': -f_height + 'px' }).delay(t).show().animate({ 'right': right, 'top': topp }, d, easingg);
                        }
                    }
                    else if(right == 'auto')
                    {
                        if (effectt == 'Fade') {
                            $(this).css({ 'left': '100%', 'top': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({ 'left': '100%', 'top': -f_height + 'px' }).delay(t).show().animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                    }
                    else
                    {
                        if (effectt == 'Fade') {
                        $(this).css({ 'left': w + 'px', 'top': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left }, d, easingg);
                        }
                        else {
                        $(this).css({ 'left': w + 'px', 'top': -f_height + 'px' }).delay(t).animate({ 'left': left }, d, easingg);
                        }
                    }
                }
                    break;
                case 'left,bottom':
                if(bottomm != 'auto') {
                if(left == 'auto')
                {
                   if (effectt == 'Fade') {
                            $(this).css({ 'right': '100%', 'bottom': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'right': right, 'bottom': bottomm }, d, easingg);
                   }
                   else {
                            $(this).css({ 'right': '100%', 'bottom': -f_height + 'px' }).delay(t).show().animate({ 'right': right, 'bottom': bottomm }, d, easingg);
                   }
                }
                else if(right == 'auto')
                {
                   if (effectt == 'Fade') {
                            $(this).css({ 'left': -w + 'px', 'bottom': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'bottom': bottomm }, d, easingg);
                   }
                   else {
                            $(this).css({ 'left': -w + 'px' , 'bottom': -f_height + 'px' }).delay(t).show().animate({ 'left': left, 'bottom': bottomm }, d, easingg);
                   }
                }
				else
				{
				   if (effectt == 'Fade') {
                            $(this).css({ 'left': -f_height + 'px', 'bottom': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'bottom': bottomm }, d, easingg);
                   }
                   else {
                            $(this).css({ 'left': -f_height + 'px', 'bottom': -f_height + 'px' }).delay(t).show().animate({ 'left': left, 'bottom': bottomm }, d, easingg);
                   }
				}
                }
                else{
                    if(left == 'auto')
                    {
                        if (effectt == 'Fade') {
                            $(this).css({ 'right': '100%', 'top': h + 'px' }).delay(t).fadeIn(1000).animate({ 'right': right, 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({ 'right': '100%', 'top': h + 'px' }).delay(t).show().animate({ 'right': right, 'top': topp }, d, easingg);
                        }
                    }
                    else if(right == 'auto')
                    {
                        if (effectt == 'Fade') {
                            $(this).css({ 'left': -w + 'px', 'top': h + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({ 'left': -w + 'px' , 'top': h + 'px' }).delay(t).show().animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                    }
                    else
                    {
                        if (effectt == 'Fade') {
                            $(this).css({ 'left': -f_height + 'px', 'top': h + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({ 'left': -f_height + 'px', 'top': h + 'px' }).delay(t).show().animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                    }
                }
                 break;
                case 'right,bottom':
                if(bottomm != 'auto') {
                    if(left == 'auto')
	                {
						 if (effectt == 'Fade') {
                            $(this).css({ 'right': -w + 'px', 'bottom': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'right': right, 'bottom': bottomm }, d, easingg);
	                    }
	                    else {
                            $(this).css({ 'right': -w + 'px', 'bottom': -f_height + 'px' }).delay(t).show().animate({ 'right': right, 'bottom': bottomm }, d, easingg);
	                    }
					}
					else if(right == 'auto')
	                {
	                    if (effectt == 'Fade') {
                            $(this).css({ 'left': '100%', 'bottom': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'bottom': bottomm }, d, easingg);
	                    }
	                    else {
                            $(this).css({ 'left': '100%', 'bottom': -f_height + 'px' }).delay(t).show().animate({ 'left': left, 'bottom': bottomm }, d, easingg);
	                    }
	                }
					else
					{
						if (effectt == 'Fade') {
                            $(this).css({ 'left': w + 'px', 'bottom': -f_height + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'bottom': bottomm  }, d, easingg);
	                    }
	                    else {
                            $(this).css({ 'left': w + 'px', 'bottom': -f_height + 'px' }).delay(t).show().animate({ 'left': left, 'bottom': bottomm  }, d, easingg);
	                    }
					}
                }
                else {
                    if(left == 'auto')
                    {
                        if (effectt == 'Fade') {
                            $(this).css({ 'right': -w + 'px', 'top': h + 'px' }).delay(t).fadeIn(1000).animate({ 'right': right, 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({ 'right': -w + 'px', 'top': h + 'px' }).delay(t).show().animate({ 'right': right, 'top': topp }, d, easingg);
                        }
                    }
                    else if(right == 'auto')
                    {
                        if (effectt == 'Fade') {
                            $(this).css({ 'left': '100%', 'top': h + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                        else {
                            $(this).css({ 'left': '100%', 'top': h + 'px' }).delay(t).show().animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                    }
                    else
                    {
                        if (effectt == 'Fade') {
                        $(this).css({ 'left': w + 'px', 'top': h + 'px' }).delay(t).fadeIn(1000).animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                        else {
                        $(this).css({ 'left': w + 'px', 'top': h + 'px' }).delay(t).show().animate({ 'left': left, 'top': topp }, d, easingg);
                        }
                    }
                }
                    break;
                default:
                    if (effectt == 'Fade') {
                        $(this).delay(t).fadeIn(1000);
                    }
                    else {
                        $(this).delay(t).show(0);
                    }
                    break;
            }
        });
    };

})(jQuery);