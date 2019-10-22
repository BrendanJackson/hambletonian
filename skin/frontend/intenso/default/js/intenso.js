/**
 * Intenso Theme Library
 * https://www.getintenso.com
 * Copyright (c) 2014-2017 Intenso (https://www.getintenso.com)
 * http://getintenso.com/license
 */

;(function ($, window, document, undefined) {
    'use strict';

    /**
     * Description:  Parses data-options attribute
     * Arguments:  'el' (jQuery Object): Element to be parsed.
     * Returns:  Options (Javascript Object): Contents of the element's data-options attribute.
     */
    var data_options = function(el) {
        var opts = {}, ii, p, opts_arr,
            data_options = function (el) {
                return el.data('options');
            };

        var cached_options = data_options(el);

        if (typeof cached_options === 'object') {
            return cached_options;
        }

        opts_arr = (cached_options || ':').split(';'),
            ii = opts_arr.length;

        function isNumber (o) {
            return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
        }

        function trim(str) {
            if (typeof str === 'string') return $.trim(str);
            return str;
        }

        while (ii--) {
            p = opts_arr[ii].split(':');

            if (/true/i.test(p[1])) p[1] = true;
            if (/false/i.test(p[1])) p[1] = false;
            if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

            if (p.length === 2 && p[0].length > 0) {
                opts[trim(p[0])] = trim(p[1]);
            }
        }

        return opts;
    };

    var createCookie = function(name, value, days) {
        var expires;

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
    };

    var readCookie = function(name) {
        var nameEQ = escape(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
        }
        return null;
    };

    var eraseCookie = function(name) {
        createCookie(name, "", -1);
    };

    var random_str = function(length) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }
        var str = '';
        while (length--) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    };

    var replace_inline_SVG = function() {
        // handles inline SVG images in case the browser doesnÂ´t support SVG format
        if(!Modernizr.svg) {
            $('img[src*="svg"]').attr('src', function () {
                return $(this).attr('src').replace('.svg', '.png');
            });
        }
    };

    var toggle_input_placeholder = function() {
        // toggle input's placeholder text
        if($(".placeholder").val()!=''){
            $(".placeholder").next("label").hide();
        }
        $(".placeholder").focus(function() {
            $(this).next("label").hide();
        });
        $(".placeholder").focusout(function() {
            if($(this).val()!=''){
                $(this).next("label").hide();
            } else {
                $(this).next("label").show();
            }
        });
    };

    var init_form_select = function() {
        if ($('body').hasClass('mdformfields')) {
            // init Chosen select boxes
            var selectEl,
                selectVal,
                loop;
            if($.fn.chosen){
                $("select").each(function(){
                    if ($(this).hasClass('no-display')) return;
                    $(this).chosen({
                        disable_search_threshold: 10,
                        width: 'auto',
                    });
                    // dismiss validation-advice onchange
                    $(this).on('change', function() {
                        $(this).siblings('.validation-advice').hide(300);
                    });
                    // update original select boxes for configurable products on product's page
                    if ($(this).hasClass('super-attribute-select') || $(this).hasClass('product-custom-option')
                        || this.id == 'limits' || this.id == 'orders' || $(this).hasClass('simulate-change')) {
                        $(this).on('change keyup', function(event, loop) {
                            if ($(selectEl).attr('id') == $(this).attr('id')
                                && JSON.stringify(selectVal) == JSON.stringify($(this).val())) return;
                            selectEl = $(this)[0];
                            selectVal = $(this).val();
                            setTimeout(function(){
                                if (selectEl === event.target) {
                                    selectEl.simulate('change');
                                }
                                $("select").each(function(){
                                    $(this).trigger("chosen:updated");
                                });
                            },0);
                        });
                    }
                });
            };
            $('.input-box').has('select').addClass('input-box-select');
            $('.input-box').has('select').parent().addClass('select-list');
            // temporary fix for issue #1887 (https://github.com/harvesthq/chosen/issues/1887)
            $('.chosen-container .chosen-results').on('touchend', function(event) {
                event.stopPropagation();
                event.preventDefault();
                return;
            });
        }
    };

    var input_focus = function(el) {
        if ($('body').hasClass('mdformfields')) {
            var mainColor,
                top;
            if ($(el).is(":focus")) $(el).parents('.input-box').addClass('focus');
            if ($(el).val().length > 0) {
                if ($(el).parents('.input-box').hasClass('fade-label')) {
                    $(el).parents('.input-box').siblings('label').hide();
                } else {
                    mainColor = $('.main-color').css('color');
                    if (typeof mainColor === 'undefined' || mainColor.length == 0) mainColor = '#999';
                    top = ($(el).is("textarea")) ? 26 : 18;

                    if (!$(el).hasClass('label-animated')) {
                        $(el).addClass('label-animated');
                        $(el).parents('.input-box').siblings('label').animate({
                            top: '-='+top,
                            fontSize: '-=1'
                        }, 150, function() {
                            $(this).css({'font-weight': 'normal', 'color': mainColor});
                        });
                    }
                }
            }
        }
        // dismiss validation-advice onchange
        $(el).on('change keyup', function() {
            $(this).siblings('.validation-advice').hide(300);
        });
    };

    var input_blur = function(el) {
        if ($('body').hasClass('mdformfields')) {
            $(el).parents('.input-box').removeClass('focus');
            if ($(el).val().length == 0) {
                $(el).removeClass('label-animated');
                $(el).parents('.input-box').siblings('label').show();
                $(el).parents('.input-box').siblings('label').css({
                    'top': '',
                    'font-size': '',
                    'font-weight': '',
                    'color': ''
                });
            }
        }
    };

    var fix_label = function() {
        if ($('body').hasClass('mdformfields')) {
            // add class to textarea's label
            fix_textarea();
            // add class to checkbox's label
            fix_checkbox();
            // for ajax generated forms distpaching a custom event is needed for this to work
            $(document).on('new:ajaxform', function() {
                fix_textarea();
                fix_checkbox();
                init_form_select();
            });
        }
    };

    var fix_textarea = function() {
        $('.input-box > textarea').removeClass('input-text');
        $('.input-box').each(function() {
            $(this).has('textarea').addClass('textarea');
            $(this).has('textarea').siblings('label').addClass('textarea');
        });
    };

    var fix_checkbox = function() {
        $('.input-box').each(function() {
            if ($(this).children("input[type='checkbox']").length > 0) {
                $(this).addClass('checkbox');
                $(this).siblings('label').addClass('checkbox');
            }
        });
    };

    var bind_inputbox_focus = function() {
        // apply focus effect to labels in case they are prefilled when page load
        $('.input-text').each(function() {
            input_focus(this);
        });
        // bind focus event to every inputbox
        $(document).on('focus keyup change input', '.input-text', function() {
            input_focus(this);
        });
        $('#newsletter').on('focus keyup change input', function() { input_focus(this); });
        $('#newsletter-popup').on('focus keyup change input', function() { input_focus(this); });
        // for programmatically filled or ajax generated forms
        $(document).on('new:ajaxform', function() {
            $('.input-text').each(function() {
                input_focus(this);
            });
            $("select").each(function(){
                $(this).trigger("chosen:updated");
            });
        });
        $(document).on('focusout', '.input-text', function() {
            input_blur(this);
        });
        $('#newsletter').on('focusout', function() { input_blur(this); });
        $('#newsletter-popup').on('focusout', function() { input_blur(this); });
        // bind focus event to every textarea
        $(document).on('focus keyup change input', 'textarea', function() {
            input_focus(this);
        });
        $(document).on('focusout', 'textarea', function() {
            input_blur(this);
        });
    };

    var toggle_newsletter_inputbox = function() {
        // On click event to open and close newsletter inputbox
        $('.newsletter-subscribe').on('click', function(e) {
            e.preventDefault();
            $('.newsletter-ribbon .newsletter-subscribe-form').slideToggle(50);
        });
    };

    var toggle_tags_inputbox = function() {
        // On click event to open and close tags inputbox
        $('#add-tag').on('click', function(e) {
            e.preventDefault();
            $('#addTagForm').slideToggle(50);
        });
    };

    var toggle_secmenu = function() {
        $('.icon-sec-menu').hover(function(e) {
            $('.sec-menu-dropdown').addClass('show');
        }, function(e) {
            if(e.target.tagName.toLowerCase() != 'select'
                && e.target.tagName.toLowerCase() != 'option') {
                $('.sec-menu-dropdown').removeClass('show');
            }
        });
    };

    var init_mega_menu = function() {
        if ($('.main-nav > .top-bar-section').hasClass('hover')) {
            $(".level0.has-dropdown").hoverIntent({
                over: show_mega_menu,
                out: hide_mega_menu,
                timeout: 300
            });
        } else {
            $('.level0.has-dropdown').click(function (e) {
                if (e.target.className == 'level0 has-children') e.preventDefault();
                if ($(this).hasClass('hover') && e.target.className == 'level0 has-children') {
                    $(this).removeClass('hover');
                    $(this).find('.level0.dropdown').removeClass('display-menu');
                } else {
                    $('.level0.has-dropdown').removeClass('hover');
                    $('.level0.has-dropdown').find('.level0.dropdown').removeClass('display-menu');
                    show_mega_menu(this);
                }
            });
            $(document).click(function (e) {
                if ($(e.target).parents('.level0.has-dropdown').length <= 0) {
                    $('.level0.has-dropdown').removeClass('hover');
                    $('.level0.has-dropdown').find('.level0.dropdown').removeClass('display-menu');
                }
            });
        }
        $('.top-bar-section .right li.has-dropdown').hoverIntent({
            over: show_dropdown,
            out: hide_dropdown,
            timeout: 100
        });
    };

    var show_mega_menu = function(el) {
        el = typeof el.currentTarget === 'undefined' ? el : el.currentTarget;
        var packeryGrid = $(el).find('.level0.dropdown.mm-grid');
        $(el).addClass('hover');
        $(el).find('.level0.dropdown').show();
        $(el).find('.level0.dropdown').addClass('display-menu');
        if (Modernizr.mq('only screen and (min-width: 40em)')) {
            if (packeryGrid.length && !packeryGrid.data('isotope')) {
                adjust_column_width_for_packery(packeryGrid);
                // initialize packery.js to position subcategory blocks
                packeryGrid.isotope({
                    layoutMode: 'packery',
                    itemSelector: '.grid-item',
                    percentPosition: true,
                    transitionDuration: 0,
                    sortBy: 'original-order'
                });
                remove_left_border(packeryGrid);
            } else if (packeryGrid.length && packeryGrid.data('isotope')) {
                adjust_column_width_for_packery(packeryGrid);
                packeryGrid.isotope('layout');
                remove_left_border(packeryGrid);
            }
        } else {
            // remove packery on mobile
            if (packeryGrid.data('isotope')) {
                packeryGrid.isotope('destroy');
                packeryGrid.find('li.level1').css('width', '');
            }
        }
    };

    var adjust_column_width_for_packery = function(packeryGrid) {
        // if mega-menu has right block, adjust the width of list items to solve packery.js issue with padding
        var originalWidth, colNum, diff,
            megaMenuRightPadding = packeryGrid.css('padding-right').replace('%', ''),
            megaMenuWidth = packeryGrid.width(),
            listEl = packeryGrid.find('li.level1');
        if (megaMenuRightPadding.indexOf('px') > -1) { // if padding is expressed in pixels convert px to percentage
            megaMenuRightPadding = megaMenuRightPadding.replace('px', '');
            megaMenuWidth = +megaMenuWidth + +megaMenuRightPadding;
            megaMenuRightPadding = Math.ceil(megaMenuRightPadding / megaMenuWidth * 100);
        }
        listEl.css('width', '');
        originalWidth = listEl.width();
        colNum = Math.round(100 / originalWidth);
        diff = Math.ceil(megaMenuRightPadding / colNum);
        listEl.css('width', originalWidth - diff + '%');
    };

    var remove_left_border = function(packeryGrid) {
        packeryGrid.find('li.level1').each(function() {
            $(this).css({
                'border-left' : '',
                'padding-right' : '1px'
            });
            if ($(this).css('left') === '0px') $(this).css({'border-left':'0','padding-right':'1px'});
        });
    };

    var hide_mega_menu = function() {
        $(this).removeClass('hover');
        $(this).find('.level0.dropdown').hide();
        $(this).find('.level0.dropdown').removeClass('display-menu');
    };

    var show_dropdown = function() {
        $(this).addClass('hover');
        $(this).find('ul.dropdown').show();
    };

    var hide_dropdown = function() {
        $(this).removeClass('hover');
        $(this).find('ul.dropdown').hide();
    };

    var init_vertical_menu = function() {
        $('.vertical ul.left').show();
        if ($('.right-off-canvas-menu.main-nav').hasClass('vertical')) {
            var touchmoved;
            $('.vertical ul.left li:not(:first)').hide();
            $('.vertical-menu-link').on('click','a',function(e){e.preventDefault(); });

            $('.vertical-menu-link').hoverIntent({
                over: function() {
                    $(this).addClass('v-hover');
                    $('.vertical ul.left li:not(:nth-child(2)):not(.js-generated)').show();
                    if ($('.vertical-menu-overlay').length == 0) {
                        $('.inner-wrap').append('<div class="vertical-menu-overlay"></div>');
                    }
                },
                out: function() { return false; },
                timeout: 300
            });
            $('.vertical ul.left').mouseleave(function(e) {
                if (Modernizr.mq('only screen and (min-width: 40.063em)')) {
                    $('.vertical-menu-link').removeClass('v-hover');
                    $('.vertical-menu-link').removeClass('hover');
                    $('.vertical ul.left li:not(:nth-child(2))').hide();
                    $('.vertical-menu-overlay').remove();
                }
            });
            $('.vertical .custom-menu').hoverIntent({
                over: function() {
                    if (Modernizr.mq('only screen and (min-width: 40.063em)')) {
                        $(this).addClass('hover');
                        $(".vertical ul.left li:not(:nth-child(2))").hide();
                        $('.vertical-menu-link').removeClass('v-hover');
                        $('.vertical-menu-link').removeClass('hover');
                        $('.vertical-menu-overlay').remove();
                    }
                },
                out: function() {
                    $(this).removeClass('hover');
                },
                timeout: 300
            });
            $('.vertical-menu-overlay').on('touchend', function(e){
                if(touchmoved != true){
                    $(".vertical ul.left li:not(:nth-child(2))").hide();
                    $('.vertical-menu-overlay').remove();
                }
            }).on('touchmove', function(e){
                touchmoved = true;
            }).on('touchstart', function(){
                touchmoved = false;
            });
            $('.vertical ul.left li.level0:not(.custom-menu):last').addClass('last-vt');
            $(window).on('orientationchange resize', function(e) {
                self.calculateDropdownsWidth();
                if (Modernizr.mq('only screen and (max-width: 40em)')) {
                    $(".vertical ul.left li:not(:nth-child(2))").show();
                    $('.vertical ul.left li:not(:first)').show();
                } else if($('html').hasClass('no-touch')) {
                    $(".vertical ul.left li:not(:nth-child(2))").hide();
                    $('.vertical-menu-overlay').remove();
                } else {
                  $('.vertical ul.left li:not(:first)').hide();
                }
            });
            self.calculateDropdownsWidth();
            if (Modernizr.mq('only screen and (max-width: 40em)')) {
                $(".vertical ul.left li:not(:nth-child(2))").show();
            }
        }
    };

    self.calculateDropdownsWidth = function() {
        // calculates width of divs for vertical menu dropdowns and any custom dropdown
        var dropdown = $('.vertical .top-bar-section ul.left li.mega-menu ul.level0').add('.vertical .top-bar-section ul.left li.mega-menu div.dropdown'),
            screen_width = parseInt($('.off-canvas-wrap').width()),
            menu_width = $('.vertical ul.left').width(),
            margin_left = parseInt($('.vertical ul.left').css('margin-left')),
            dropdown_width = screen_width - menu_width - (margin_left * 2),
            custom_megamenu_width = screen_width - (screen_width*0.07),
            rightblock_width,
            custom_megamenu_offset,
            menu_item_width = $('.vmenu-title').outerWidth() + 50;
        $('.vertical ul.left > li:nth-child(2)').css('width', menu_item_width);
        $('.vertical ul.left li.custom-menu').each(function(index){
            menu_item_width = menu_item_width + 30;
            $(this).css('left', menu_item_width);
            menu_item_width = menu_item_width + $(this).outerWidth();
        });

        dropdown.each(function(){
            var style = $(this).attr('style');
            style = (typeof style === 'undefined') ? '' : style.replace(/width:.+/g, '');

            if (Modernizr.mq('only screen and (max-width: 40em)')) {
                $(this).attr('style', style);
            } else {
                if (!(rightblock_width = $(this).find('.mega-menu-right-block').css('width')) > 0) rightblock_width = 0;
                custom_megamenu_offset = ($(this).parent('.custom-menu').offset()) ? $(this).parent('.custom-menu').offset() : 0;
                custom_megamenu_offset = parseInt(custom_megamenu_offset.left) - screen_width*0.035;
                if (rightblock_width && rightblock_width.indexOf('px') > -1) {
                    if ($(this).hasClass('custom-dropdown')) {
                        $(this).attr('style', 'width: '+custom_megamenu_width+'px !important; padding-right: '+rightblock_width+'; margin-left: -'+custom_megamenu_offset+'px !important;');
                    } else {
                        $(this).attr('style', 'width: '+dropdown_width+'px !important; padding-right: '+rightblock_width+';');
                    }
                } else {
                    if ($(this).hasClass('custom-dropdown')) {
                        $(this).attr('style', 'width: ' + custom_megamenu_width + 'px !important; padding-right: ' +
                            (dropdown_width * $(this).find('.mega-menu-right-block').outerWidth() / 100) + 'px; margin-left: -'+custom_megamenu_offset+'px !important;');
                    } else {
                        $(this).attr('style', 'width: ' + dropdown_width + 'px !important; padding-right: ' +
                            (dropdown_width * $(this).find('.mega-menu-right-block').outerWidth() / 100) + 'px;');
                    }
                }
            }
        });
    };

    var touch_exit_canvas = function() {
        // Allow closing Foundation Off Canvas Menu by swiping on touch devices
        var idx = 0;
        var exit_off_canvas = $('.exit-off-canvas');
        exit_off_canvas.on('touchstart.fndtn.offcanvas', function(e) {
                if (!e.touches) {e = e.originalEvent;}
                var data = {
                    start_page_x: e.touches[0].pageX,
                    start_page_y: e.touches[0].pageY,
                    start_time: (new Date()).getTime(),
                    delta_x: 0,
                    is_scrolling: undefined
                };
                exit_off_canvas.data('swipe-transition', data);
                e.stopPropagation();
            })
            .on('touchmove.fndtn.offcanvas', function(e) {
                if (!e.touches) { e = e.originalEvent; }
                // Ignore pinch/zoom events
                if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

                var data = exit_off_canvas.data('swipe-transition');
                if (typeof data === 'undefined') {data = {};}

                data.delta_x = e.touches[0].pageX - data.start_page_x;

                if ( typeof data.is_scrolling === 'undefined') {
                    data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
                }

                if (!data.is_scrolling && !data.active) {
                    e.preventDefault();
                    var direction = (data.delta_x < 0) ? (idx+1) : (idx-1);
                    data.active = true;
                    if(direction<0) $(".off-canvas-wrap").removeClass("move-left");
                    if(direction>0) $(".off-canvas-wrap").removeClass("move-right");
                }
            })
            .on('touchend.fndtn.orbit', function(e) {
                exit_off_canvas.data('swipe-transition', {});
                e.stopPropagation();
            })
    };

    var show_nav_arrows = function(container, settings) {
        /* Hide/Show arrow navigations on mouse stop/move */
        var slide_selector = (settings.slide_selector == '*') ? '.item' : '.'+settings.slide_selector;
        var slides_count = $(container).find(slide_selector).length;
        if (slides_count > 1) {
            var i = null;
            $(container).mousemove(function() {
                clearTimeout(i);
                $(container).find('.'+settings.prev_class+', .'+settings.next_class).fadeIn(300);
                if($('.'+settings.prev_class).hasClass('is-hover') || $('.'+settings.next_class).hasClass('is-hover')) {
                    clearTimeout(i);
                } else {
                    i = setTimeout(function() { $(container).find('.'+settings.prev_class+', .'+settings.next_class).fadeOut(); }, 1500);
                }
            });
        }
    };

    var minicart_build_markup = function() {
        var slideCount = $('.mini-products-container > ul').length;
        var bullets_container = $('<ul>');
        if (slideCount > 1) {
            $('.mini-products-wrapper').after(bullets_container);
            bullets_container.wrap('<nav class="simple-nav"></nav>');
            for(var i = 0; i < slideCount; i++) {
                var bullet = $('<li>').attr('data-featured-slide', i);
                bullets_container.append(bullet);
            }
        }
    };

    var minicart_toggle_item_attr = function() {
        // Cart dropdown - Expand and hide item attributes
        $(".view-more-attr").click(function(event){
            $(event.target).closest("li").children(".item-options").slideToggle(200, function() {
                $(".view-more-attr").html(($(this).is(':visible') ? Translator.translate('Show less details') : Translator.translate('Show more details')));

            });
        });
    };

    var minicart_slider_control = function(width) {
        // Cart dropdown - Slider control
        if ($('.mini-products-list').length) {
            var slideCount = $('.mini-products-container > ul').length,
                slideWidth = width,
                paddingLeft = $('.mini-products-list').css('padding-left').replace('px', ''),
                paddingRight = $('.mini-products-list').css('padding-right').replace('px', ''),
                listWidth = slideWidth - paddingLeft - paddingRight;
            $('.mini-products-list').width(slideWidth - paddingLeft - paddingRight);
            $('.mini-products-list > li').width(listWidth);
            $('.mini-products-container').width(slideWidth * slideCount);
            $('.cart-dropdown .simple-nav > ul > li:first-child').addClass('active');
            $('.cart-dropdown .simple-nav > ul > li').click(function (event) {
                event.preventDefault();
                $('.mini-products-container').animate({marginLeft: -slideWidth * $(this).index()}, 200);
                $('.cart-dropdown .simple-nav > ul > li.active').removeClass('active');
                $('.cart-dropdown .simple-nav > ul > li').eq($(this).index()).addClass('active');
            });
        }
    };

    var back_to_top = function() {
        if ($('.back-to-top').length) {
            $('.back-to-top').on('click', function() {
                var body = $("html, body");
                body.animate({scrollTop:0}, '1000', 'swing', function() {
                    // callback
                });
            });
        }
    };

    var init_sticky_header = function() {
        var stickyActive = false,
            $header = $('.main-header'),
            $topbar = $('.top-bar.main-nav'),
            topbarLeftHeight,
            headerHeight = $header.outerHeight(),
            topbarHeight = $topbar.outerHeight(),
            offset = headerHeight - topbarHeight;

        var stickyPlaceholder = $('<div>').insertAfter('.main-header .top-bar.main-nav').addClass('sticky-placeholder').hide();
        $(stickyPlaceholder).css('height',topbarHeight+'px');

        $(window).smartresize(function() {
            headerHeight = $header.outerHeight();
            topbarHeight = $topbar.outerHeight();
            offset = headerHeight - topbarHeight;
            $(window).scroll();
            if (Modernizr.mq('only screen and (min-width: 64.063em)')) {
                topbarLeftHeight = $('.main-header nav.top-bar.main-nav .top-bar-section .left').outerHeight();
                $('.magellan-nav.magellan-fixed').css('margin-top',topbarLeftHeight+'px');
            } else {
                $(stickyPlaceholder).css('height','');
            }
        });

        $(window).scroll($.throttle(50, function () {
            if ($(this).scrollTop() > offset && !stickyActive && Modernizr.mq('only screen and (min-width: 64.063em)')) {
                stickyActive = true;
                $header.addClass("sticky-active");
                $(stickyPlaceholder).show();
                var logo = $('<li></li>').append($('.main-header .logo-container > a').clone()).html();
                logo = '<li class="logo-fixed">'+logo+'</li>';
                $('.main-header nav.top-bar.main-nav .top-bar-section .left').prepend(logo);
                if ($('.top-bar-section .main-logo-sticky').length) {
                    $('.top-bar-section .logo-fixed .main-logo').hide();
                }
                topbarLeftHeight = $('.main-header nav.top-bar.main-nav .top-bar-section .left').outerHeight();
            } else if ($(this).scrollTop() < offset && stickyActive) {
                $header.removeClass("sticky-active");
                $('nav.top-bar.main-nav .logo-fixed').remove();
                $(stickyPlaceholder).hide();
                stickyActive = false;
            }
            if ($('body').hasClass('catalog-product-view') && Modernizr.mq('only screen and (min-width: 64.063em)')) {
                setTimeout(function(){
                    $('.magellan-nav.magellan-fixed').css('margin-top',topbarLeftHeight+'px');
                },100);
            }
        }));
        $(window).scroll();
    };

    var OrbitSlider = function(el, settings) {
        var self = this,
            container = el;

        self.orbit_height = function() {
            var headerBorderWidth = parseInt($('.main-header').css('border-bottom-width').replace(/[^-\d\.]/g, ''));
            if ($(container).find('.full-screen').length != 0 &&
                $(container).find('.hero-text').css('position') != 'relative') { // full screen setting enabled
                if ($('.main-header').css('position') == 'absolute' ||
                    $('.orbit-wrapper').index($(container).parent('.orbit-wrapper')) > 0) {
                    var orbit_height = parseInt($(window).height()) + headerBorderWidth;
                } else {
                    var orbit_height = parseInt($(window).height()) - $('.main-header').outerHeight() + (headerBorderWidth*2);
                }
                $(container).find("li.item").each(function(){
                    if ($(this).find('img').attr('src') != 'undefined') {
                        $(this).css('background-image', 'url(' + $(this).find('img').attr('src') + ')');
                    }
                });
            } else {
                $(container).css('margin-top', '-'+headerBorderWidth+'px')
                $(container).find('.hero-text').css('height','');
                if($(container).find('.hero-text').first().css('position') == 'relative') { // adjust hero's text height only on mobile
                    $(container).find('.hero-text').css('height','');
                    var maxHeight = Math.max.apply(null, $(container).find('.hero-text').map(function () {
                        return $(this).outerHeight();
                    }).get());
                    // check if there is only one slide
                    if ($(container).find('.'+settings.bullets_container_class+' > li').length == 1) {
                        maxHeight = maxHeight - 10;
                    } else {
                        maxHeight = (settings.outside_bullets) ? maxHeight + 30 : maxHeight + 15;
                    }
                    $(container).find('.hero-text').css('height', maxHeight);
                }
                var heights = new Array();
                $(container).find("li.item").each(function(){
                    heights.push($(this).outerHeight());
                });
                var orbit_height = Math.max.apply(null, heights);
            }
            return orbit_height;
        };

        self.fix_orbit_height = function(resize) {
            var orbitHeight = self.orbit_height();
            if(resize) {
                if (!isNaN(parseFloat(orbitHeight)) && isFinite(orbitHeight)) {
                    $(container).css("height", orbitHeight);
                    $(container).find('.orbit-container').css("height", orbitHeight);
                }
            } else {
                // This fixes "height: 0" bug in Foundation's Orbit Slider when using in conjunction with Interchange.
                $(container).find("li img").on("load", function () { // waits until Interchange has placed the image
                    if (!isNaN(parseFloat(orbitHeight)) && isFinite(orbitHeight)) {
                        $(container).css("height", orbitHeight); // assign correct height to slider
                        $(container).find('.orbit-container').css("height", orbitHeight);
                        $('.hero-text').css('visibility', 'visible');
                        $('.orbit-wrapper').css('min-height', 'initial');
                        $('.orbit-wrapper').removeClass('spinner');
                        $(document).resize();
                    }
                });
            }
        };

        self.orbit_bullets = function() {
            var orbitBulletsContainer = $(container).find('.orbit-bullets-container'),
                bullets = $(container).find('.'+settings.bullets_container_class+' > li'),
                slides = $(container).find('li.item');
            //check if bullets container already exist and if number of slides has changed
            if (orbitBulletsContainer.length != 0 && bullets.length != slides.length) {
                $(container).find('.orbit-bullets-container').remove();
                var bullets_container = $('<ol>').addClass(settings.bullets_container_class);
                $(container).append(bullets_container);
                bullets_container.wrap('<div class="orbit-bullets-container"></div>');
                slides.each(function(idx, el) {
                    var bullet = $('<li>').attr('data-orbit-slide', idx);
                    bullets_container.append(bullet);
                });
            }

            // Hide bullets container if there is only one slide
            if ($(container).find('.'+settings.bullets_container_class+' > li').length == 1) {
                $(container).find('.orbit-bullets-container').hide(0);
            } else {
                // Adjust hero's bullets for slides with a dark background
                if($(container).find("li:first-child").hasClass("dark")){
                    self.bulletsDark();
                }
                $(container).on('after-slide-change.fndtn.orbit', function(event, orbit) {
                    if($(container).find('li:eq(' + orbit.slide_number + ')').hasClass('dark')){
                        $('.'+settings.bullets_container_class+' > li').addClass('dark');
                    } else {
                        $('.'+settings.bullets_container_class+' > li').removeClass('dark');
                    }
                });
            }
        };

        self.bulletsDark = function(){
            $('.'+settings.bullets_container_class+' > li').addClass("dark");
        };

        self.adjustFontSizeForMobile = function() {
            var ratio = 0.8;
            // adjust slides font-size on medium screens
            if (Modernizr.mq('only screen and (min-width: 40.063em) and (max-width: 48em)')) {
                $(container).find('li .hero-text > h1').each(function(){
                    var headerSize = $(this).data('size') * ratio;
                    if (headerSize > 0) {
                        $(this).css('font-size',headerSize);
                    }
                });
                $(container).find('li .hero-text > h5').each(function(){
                    var textSize = $(this).data('size') * ratio;
                    if (textSize > 0) {
                        $(this).css('font-size',textSize);
                    }
                });
            } else {
                $(container).find('li .hero-text > h1').each(function(){
                    $(this).css('font-size',$(this).data('size'));
                });
                $(container).find('li .hero-text > h5').each(function(){
                    $(this).css('font-size',$(this).data('size'));
                });
            }
        };

        self.init = function(){
            $(container).find('.'+settings.prev_class).hover(function(){ $(this).toggleClass('is-hover'); });
            $(container).find('.'+settings.next_class).hover(function(){ $(this).toggleClass('is-hover'); });
            $(window).resize(function() {
                self.fix_orbit_height(true);
                self.adjustFontSizeForMobile();
            });
            self.fix_orbit_height();
            self.orbit_bullets();
            if (settings.navigation_arrows && $('html').hasClass('no-touch')) {
                show_nav_arrows(container, settings);
            }
            // add active class to first bullet
            var active_class = $('.'+settings.bullets_container_class).children('[data-orbit-slide]').eq(0);
            active_class.addClass(settings.bullets_active_class);
        };

        self.init();
    };

    var Featured = function(el, settings, uuid) {

        var self = this,
            idx = 0,
            container = el,
            count_visible_items = 1,
            featured_items_count = {},
            featured_item_width,
            current = {},
            bullets_container = $('<ul>'),
            pages = {},
            animate;

        self.touch_slide = function() {
            if (settings.navigation_arrows) {
                $(container).append($('<a href="#"><span></span></a>').addClass(settings.prev_class));
                $(container).append($('<a href="#"><span></span></a>').addClass(settings.next_class));
            }
            if (settings.bullets) {
                $(container).append(bullets_container);
                bullets_container.wrap('<nav class="simple-nav"></nav>');
            }
            $(container).on('click', '.'+settings.next_class, {settings: settings}, self.next);
            $(container).on('click', '.'+settings.prev_class, {settings: settings}, self.prev);
            $(container).find('.'+settings.prev_class).hover(function(){ $(this).toggleClass('is-hover'); });
            $(container).find('.'+settings.next_class).hover(function(){ $(this).toggleClass('is-hover'); });
            $(container).on('click', '[data-cat-slide]', self.link_category);
            if (settings.swipe && !$(container).hasClass('grid-type')) {
                $(container).on('touchstart.fndtn.orbit', 'ol', function(e) {
                        if (!e.touches) {e = e.originalEvent;}
                        var data = {
                            start_page_x: e.touches[0].pageX,
                            start_page_y: e.touches[0].pageY,
                            start_time: (new Date()).getTime(),
                            delta_x: 0,
                            is_scrolling: undefined
                        };
                        $(container).data('swipe-transition', data);
                        e.stopPropagation();
                    })
                    .on('touchmove.fndtn.orbit', 'ol', function(e) {
                        if (!e.touches) { e = e.originalEvent; }
                        // Ignore pinch/zoom events
                        if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

                        var data = $(container).data('swipe-transition');
                        if (typeof data === 'undefined') {data = {};}

                        data.delta_x = e.touches[0].pageX - data.start_page_x;

                        if ( typeof data.is_scrolling === 'undefined') {
                            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
                        }

                        if (!data.is_scrolling && !data.active) {
                            e.preventDefault();
                            var direction = (data.delta_x < 0) ? (idx+1) : (idx-1);
                            data.active = true;
                            self._goto(direction);
                        }
                    })
                    .on('touchend.fndtn.orbit', 'ol', function(e) {
                        $(container).data('swipe-transition', {});
                        e.stopPropagation();
                    })
            }
        };

        self.update_nav_arrows = function(container, index) {
            if ($(container).hasClass('grid-type')) return;
            if (settings.navigation_arrows && $('html').hasClass('no-touch')) {
                $(container).find('.'+settings.prev_class+', .'+settings.next_class).css('visibility', 'visible');
                if (idx == 0) {
                    $(container).find('.'+settings.prev_class).css('visibility', 'hidden');
                }
                if (pages[uuid, index]-1 == 0) {
                    $(container).find('.'+settings.next_class).css('visibility', 'hidden');
                }
                if (idx == pages[uuid, index]-1 && idx > 0) {
                    setTimeout(function() {
                        $(container).find('.' + settings.next_class).css('visibility', 'hidden');
                    },100);
                }
            }
        };

        self.link_bullet = function(e) {
            var index = $(this).attr('data-featured-slide');
            if ((typeof index === 'string') && (index = $.trim(index)) != "") {
                if(isNaN(parseInt(index))) {
                    var slide = container.find('[data-orbit-slide='+index+']');
                    if (slide.index() != -1) {self._goto(slide.index() + 1);}
                } else {
                    self._goto(parseInt(index));
                }
            }
        };

        self.sort_by_attr = function(container) {
            container.find('li').sort(function (a, b) {
                return +a.getAttribute('data-cat-slide') - +b.getAttribute('data-cat-slide');
            }).appendTo(container);
        };

        self.link_category = function(e) {
            var index = $(this).attr('data-cat-slide');
            if ((typeof index === 'string') && (index = $.trim(index)) != "") {
                $(container).find('ol:visible').hide();
                $(container).find('ol').eq(parseInt(index)).show();

                idx = current[uuid, index];
                if (current[uuid, index] === undefined) current[uuid, index] = 0;
                self._goto(current[uuid, index], true);
                $(container).find('.category-nav li').removeClass('active');
                $(container).find('[data-cat-slide='+parseInt(index)+']').addClass('active');

                self.init();
                self._goto(idx, true);
                self.update_slide_number(idx);

                self.sort_by_attr($(container).find('.category-nav'));
                if($(container).find('.category-nav li.active').css('display') == 'block') {
                    $(container).find('.category-nav li.active').prependTo($(container).find('.category-nav'));
                    $(container).find('.category-nav li').toggleClass('show-options');
                }
            }
        };

        self.update_slide_number = function(index) {
            bullets_container.children().removeClass(settings.bullets_active_class);
            $(bullets_container.children().get(index)).addClass(settings.bullets_active_class);
        };

        self.next = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            self._goto(idx + 1);
        };

        self.prev = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            self._goto(idx - 1);
        };

        self._goto = function(next_idx, no_animate) {
            var visibleList = $(container).find('ol:visible'),
                index = $(container).find('ol').index(visibleList);
            no_animate = typeof no_animate === 'undefined' ? false : no_animate;
            if (next_idx < 0) {return false;}
            while (next_idx >= Math.ceil(featured_items_count[uuid, index] / count_visible_items)) {
                --next_idx;
            }
            var dir = 'next';
            if (next_idx < idx) {dir = 'prev';}
            idx = next_idx;
            var empty_positions = count_visible_items -(featured_items_count[uuid, index] % count_visible_items);
            if (empty_positions == count_visible_items) empty_positions = 0;
            var adjust_last_page = (idx == pages[uuid, index]-1 && pages[uuid, index]-1 > 0) ? (empty_positions * featured_item_width) : 0;
            self.update_slide_number(idx);
            self.update_nav_arrows(container, index);
            if (dir === 'next') {animate.next(visibleList, uuid, current, idx, adjust_last_page, count_visible_items, featured_item_width, no_animate);}
            if (dir === 'prev') {animate.prev(visibleList, uuid, current, idx, adjust_last_page, count_visible_items, featured_item_width, no_animate);}
        };

        self.cat_nav_build_markup = function() {
            var categories_array = $.map($(container).find('ol'), function(el) {
                return {value: $(el).data('featured-cat-name')}
            });
            var cat_nav_container = $('<ul>').addClass('category-nav');
            if (categories_array.length > 1) { // build menu only if has more than one category
                $(container).append(cat_nav_container);
                for(var i = 0; i < categories_array.length; i++ ) {
                    var nav_option = $('<li>'+categories_array[i].value+'</li>').attr('data-cat-slide', i);
                    cat_nav_container.append(nav_option);
                }
                $(container).find('.category-nav li:first-child').addClass('active');
            };
        };

        self.init = function(){
            featured_item_width = settings.min_item_width;
            var number_of_items = 0,
                available_width,
                padding_left = parseInt($(container).css('padding-left')),
                margin_right = parseInt($(container).find('.'+settings.slide_selector+':first-child').css('margin-right'));

            if (settings.fixed_width) {
                var totalItems = $(container).find('.' + settings.slide_selector).length;
                $(container).css('width', 'auto');
                number_of_items = Math.floor($(container).outerWidth() / featured_item_width);
                available_width = parseInt(number_of_items * (featured_item_width + margin_right));
                if (totalItems <= number_of_items) {
                    var fixedWidth = $(container).find('.' + settings.slide_selector).length * (featured_item_width + margin_right);
                    $(container).css('width', fixedWidth);
                } else {
                    $(container).css('width', available_width);
                }
            } else {
                if ($(container).hasClass('grid-type')) {
                    available_width = parseInt($(container).width() - padding_left + 8);
                } else {
                    available_width = parseInt($(container).outerWidth()) - settings.sneak_peak_width - padding_left;
                }
                while (featured_item_width >= settings.min_item_width) {
                    number_of_items++;
                    featured_item_width = available_width / number_of_items
                }
                if (number_of_items > 1) number_of_items = number_of_items - 1;
            }
            if (Modernizr.mq('only screen and (max-width: 40em)')) {
                number_of_items = settings.number_items_on_mobile;
            }
            count_visible_items = number_of_items;
            featured_item_width = parseInt(available_width / number_of_items);
            $(container).find('.'+settings.slide_selector).css('width', featured_item_width - margin_right);
            $(container).find('ol').each(function(index){
                featured_items_count[uuid, index] = $(this).find('.'+settings.slide_selector).length;
                var container_width = featured_items_count[uuid, index]*(featured_item_width + margin_right + 20);
                if (container_width < available_width) container_width = available_width;
                $(this).css('width', container_width);
            });
            if (settings.bullets) { // update bullets
                var visibleList = $(container).find('ol:visible'),
                    index = $(container).find('ol').index(visibleList);
                pages[uuid, index] = Math.ceil(featured_items_count[uuid, index] / count_visible_items);
                bullets_container.html('');
                if (pages[uuid, index] <= settings.max_bullets_count && pages[uuid, index] > 1) {
                    for(var i = 0; i < pages[uuid, index]; i++ ) {
                        var bullet = $('<li>').attr('data-featured-slide', i);
                        bullets_container.append(bullet);
                    }
                }
                bullets_container.on('click', '[data-featured-slide]', self.link_bullet);
            }
            self.update_nav_arrows(container, 0);
            self.update_slide_number(0);
        };

        self.on_resize = function() {
            self.init();
            self._goto(idx, true);
            if($(container).find('.category-nav li.active').css('display') == 'inline-block') {
                self.sort_by_attr($(container).find('.category-nav'));
            } else {
                $(container).find('.category-nav li.active').prependTo($(container).find('.category-nav'));
            }
        };

        $(container).find('ol').not(':first').hide();
        self.init();
        $(document).on('click', function(e){ // Hides category dropdown when clicked outside of it
            if (!$(e.target).hasClass('show-options')) {
                $(container).find('.category-nav li').removeClass('show-options');
            }
        });
        $(container).each(function() {
            var touch_events = self.touch_slide();
            animate = new SlideAnimation(settings);
            if (settings.navigation_arrows && $('html').hasClass('no-touch') && !$(container).hasClass('grid-type')) {
                show_nav_arrows(this, settings);
            };
            if (settings.category_nav_menu) {
                self.cat_nav_build_markup();
            }
            self.update_nav_arrows(container, 0);
        });
        if ($('html').hasClass('touch')) {
            $(window).on('orientationchange resize', function(e) {
                self.on_resize();
            });
            self.update_slide_number(idx);
        } else {
            $( window ).resize(function() {
                self.on_resize();
            });
        }
    };

    var BrandSlider = function(el, settings, uuid) {
        var self = this,
            idx = 0,
            container = el,
            count_visible_items = 1,
            featured_items_count = {},
            logo_item_width = {},
            current = {},
            bullets_container = $('<ul>'),
            pages = {},
            is_collapsed = true,
            animate;

        self.touch_slide = function() {
            if (settings.navigation_arrows) {
                $(container).append($('<a href="#"><span></span></a>').addClass(settings.prev_class));
                $(container).append($('<a href="#"><span></span></a>').addClass(settings.next_class));
            }
            if (settings.bullets) {
                $(container).append(bullets_container);
                bullets_container.wrap('<nav class="simple-nav"></nav>');
            }
            $(container).on('click', '.'+settings.next_class, {settings: settings}, self.next);
            $(container).on('click', '.'+settings.prev_class, {settings: settings}, self.prev);
            $(container).find('.'+settings.prev_class).hover(function(){ $(this).toggleClass('is-hover'); });
            $(container).find('.'+settings.next_class).hover(function(){ $(this).toggleClass('is-hover'); });
            if (settings.swipe) {
                $(container).on('touchstart.fndtn.orbit', 'ol', function(e) {
                        if (!e.touches) {e = e.originalEvent;}
                        var data = {
                            start_page_x: e.touches[0].pageX,
                            start_page_y: e.touches[0].pageY,
                            start_time: (new Date()).getTime(),
                            delta_x: 0,
                            is_scrolling: undefined
                        };
                        $(container).data('swipe-transition', data);
                        e.stopPropagation();
                    })
                    .on('touchmove.fndtn.orbit', 'ol', function(e) {
                        if (!e.touches) { e = e.originalEvent; }
                        // Ignore pinch/zoom events
                        if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

                        var data = $(container).data('swipe-transition');
                        if (typeof data === 'undefined') {data = {};}

                        data.delta_x = e.touches[0].pageX - data.start_page_x;

                        if ( typeof data.is_scrolling === 'undefined') {
                            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
                        }

                        if (!data.is_scrolling && !data.active) {
                            e.preventDefault();
                            var direction = (data.delta_x < 0) ? (idx+1) : (idx-1);
                            data.active = true;
                            self._goto(direction);
                        }
                    })
                    .on('touchend.fndtn.orbit', 'ol', function(e) {
                        $(container).data('swipe-transition', {});
                        e.stopPropagation();
                    })
            }
        };

        self.update_nav_arrows = function(container, index) {
            if (settings.navigation_arrows && $('html').hasClass('no-touch')) {
                $(container).find('.'+settings.prev_class+', .'+settings.next_class).css('visibility', 'visible');
                if (idx == 0) {
                    $(container).find('.'+settings.prev_class).css('visibility', 'hidden');
                }
                if (pages[uuid]-1 == 0) {
                    $(container).find('.'+settings.next_class).css('visibility', 'hidden');
                }
                if (idx == pages[uuid]-1) {
                    $(container).find('.'+settings.next_class).css('visibility', 'hidden');
                }
            }
        };

        self.link_bullet = function(e) {
            var index = $(this).attr('data-featured-slide');
            if ((typeof index === 'string') && (index = $.trim(index)) != "") {
                if(isNaN(parseInt(index))) {
                    var slide = container.find('[data-orbit-slide='+index+']');
                    if (slide.index() != -1) {self._goto(slide.index() + 1);}
                } else {
                    self._goto(parseInt(index));
                }
            }
        };

        self.update_slide_number = function(index) {
            bullets_container.children().removeClass(settings.bullets_active_class);
            $(bullets_container.children().get(index)).addClass(settings.bullets_active_class);
        };

        self.next = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            self._goto(idx + 1);
        };

        self.prev = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            self._goto(idx - 1);
        };

        self._goto = function(next_idx, no_animate) {
            no_animate = typeof no_animate === 'undefined' ? false : no_animate;
            if (next_idx < 0) {return false;}
            var slides = $(container).find('ol:visible');
            while (next_idx >= Math.ceil(featured_items_count[uuid] / count_visible_items)) {
                --next_idx;
            }
            var dir = 'next';
            if (next_idx < idx) {dir = 'prev';}
            idx = next_idx;
            var empty_positions = count_visible_items -(featured_items_count[uuid] % count_visible_items);
            if (empty_positions == count_visible_items || featured_items_count[uuid] <= count_visible_items) {
                empty_positions = 0;
            }
            var adjust_last_page = (idx == pages[uuid] - 1) ? (empty_positions * (logo_item_width+4)) : 0;
            self.update_slide_number(idx);
            self.update_nav_arrows(container, slides.index()-1);
            if (dir === 'next') {animate.next(slides, uuid, current, idx, adjust_last_page, count_visible_items, logo_item_width+4, no_animate);}
            if (dir === 'prev') {animate.prev(slides, uuid, current, idx, adjust_last_page, count_visible_items, logo_item_width+4, no_animate);}
        };

        self.show_all = function() {
            var expand_all_text = Translator.translate('Show all Brands');
            var collapse_all_text = Translator.translate('Show less Brands');
            // -------------------------------------
            $(container).append($('<div><a href="#" class="arrow-down">'+expand_all_text+'</a></div>').addClass('show-all-brands'));
            $(container).on('click', '.show-all-brands a', function(e){
                e.preventDefault();
                $(this).toggleClass('active');
                if ($(this).hasClass('active')) {
                    is_collapsed = false;
                    $(container).find('.show-all-brands a').html(collapse_all_text).blur();
                    var available_width = $('.off-canvas-wrap').width() - (parseInt($(container).css('padding-left')) * 2) + 120;
                    $(container).find('.simple-nav').hide();
                    $(container).find('.brand-prev,.brand-next').stop(true).css('visibility', 'hidden');
                    $(container).find('ol').stop(true).css({width: available_width, marginLeft : ''});
                    self.adjust_margin();
                    $(window).resize();
                } else {
                    $(container).find('.simple-nav').stop(true).show();
                    $(container).find('.brand-prev,.brand-next').stop(true).css('visibility', 'visible');
                    $(container).find('.'+settings.slide_selector).css('margin-right', '');
                    $(container).find('.show-all-brands a').html(expand_all_text).blur();
                    is_collapsed = true;
                    self.init();
                    self._goto(idx, true);
                    self.update_slide_number(idx);
                }
            });
        };

        self.adjust_margin = function() {
            var current_margin_right = parseInt($(container).find('.'+settings.slide_selector).css('margin-right'));
            var available_width = $('.off-canvas-wrap').width() - (parseInt($(container).css('padding-left')) * 2);
            var item_width = logo_item_width;
            var rows = Math.floor(available_width / item_width);
            var margin_right = (available_width - ((item_width - 46) * rows)) / (rows - 1);
            $(container).find('ol').css('width', available_width + 120);
            $(container).find('.'+settings.slide_selector).css('margin-right', margin_right);
        }

        self.init = function(){
            var available_width,
                margin_right,
                padding_left,
                container_width,
                number_of_items = 0;

            $(container).find('ol').css('padding-left','');
            padding_left = parseInt($(container).css('padding-left'));
            if (is_collapsed) {
                available_width = parseInt($('.off-canvas-wrap').width()) - settings.sneak_peak_width - padding_left;
            } else {
                available_width = $('.off-canvas-wrap').width() - (parseInt($(container).css('padding-left')) * 2);
                $(container).find('.'+settings.slide_selector).css('margin-right', '');
            }
            margin_right = parseInt($(container).find('.'+settings.slide_selector+':first-child').css("margin-right"));

            logo_item_width = settings.min_item_width + margin_right;
            while(logo_item_width >= (settings.min_item_width + margin_right)) {
                number_of_items++;
                logo_item_width = available_width / number_of_items;
            }
            if (number_of_items > 1) number_of_items = number_of_items - 1;
            count_visible_items = number_of_items;

            if (number_of_items == 1) { // center logo container for mobile view
                var centered = (margin_right + settings.sneak_peak_width + padding_left) / 2;
                $(container).find('ol').css('padding-left', centered);
            }
            logo_item_width = parseInt(available_width / number_of_items);
            $(container).find('.'+settings.slide_selector).css("width", logo_item_width - margin_right);

            featured_items_count[uuid] = $(container).find('.'+settings.slide_selector).length;
            logo_item_width = (logo_item_width == available_width) ? available_width : logo_item_width;
            container_width = featured_items_count[uuid]*(logo_item_width + margin_right);
            $(container).find('ol').css("width", container_width);

            if (is_collapsed) {
                pages[uuid] = Math.ceil(featured_items_count[uuid] / count_visible_items);
                bullets_container.html('');
                if (pages[uuid] <= settings.max_bullets_count && pages[uuid] > 1) {
                    for(var i = 0; i < pages[uuid]; i++ ) {
                        var bullet = $('<li>').attr('data-featured-slide', i);
                        if (settings.bullets) bullets_container.append(bullet);
                    }
                }
                if (settings.bullets) { // update bullets
                    bullets_container.on('click', '[data-featured-slide]', self.link_bullet);
                }
                self.update_nav_arrows(container, 0);
            } else {
                available_width = $('.off-canvas-wrap').width() - (parseInt($(container).css('padding-left')) * 2) + 120;
                $(container).find('.'+settings.slide_selector).css('margin-right', '');
                $(container).find('ol').stop(true).css({width: available_width, marginLeft : ''});
                self.adjust_margin();
            }
        };

        self.on_resize = function() {
            self.init();
            if (is_collapsed) {
                self._goto(idx, true);
            }
        };

        self.init();
        $(container).each(function() {
            var touch_events = self.touch_slide();
            animate = new SlideAnimation(settings);
            if (settings.navigation_arrows && $('html').hasClass('no-touch')) {
                show_nav_arrows(this, settings);
            };
        });

        if ($('html').hasClass('touch')) {
            $(window).on('orientationchange resize', function(e) {
                self.on_resize();
            });
            self.update_slide_number(idx);
        } else {
            $(window).smartresize(function() {
                self.on_resize();
            });
        };

        self.show_all();
    };

    var ProductsGrid = function(el, settings) {
        var self = this,
            container = el,
            featured_item_width,
            settings_min_width,
            count_visible_items,
            price_clone,
            $grid = $('.category-products:not(body)');

        self.setItemWidth = function() {
            featured_item_width = settings_min_width = settings.min_item_width;
            if($grid.hasClass('list') || parseInt($grid.css('border-left-width')) == 3) {
                var list_width = parseInt($grid.width());
                featured_item_width = list_width;
            }
            var number_of_items = 0;
            var margin_right = parseInt($grid.find('.'+settings.item_selector+':first-child').css("margin-right"));
            var available_width = parseInt($grid.width());
            while(featured_item_width >= settings_min_width) {
                number_of_items++;
                featured_item_width = available_width / number_of_items
            }
            if (number_of_items > 1) number_of_items--;
            // uncomment the following line to enforce an even number of columns
            //if (Math.abs(number_of_items % 2)) number_of_items--;
            if (Modernizr.mq('only screen and (max-width: 40em)')) {
                number_of_items = settings.number_items_on_mobile;
            }
            if($grid.hasClass('list') || parseInt($grid.css('border-left-width')) == 3) {
                number_of_items = 1;
            }
            count_visible_items = number_of_items;
            featured_item_width = parseInt(available_width / number_of_items);
            $(container).find('.'+settings.item_selector).css("width", featured_item_width - margin_right - 1);
        };

        self.slide_layered_nav = function() {
            if ($('.layered-nav-container').hasClass('open')) {
                $('.layered-nav-toggle').removeClass('active');
                $('.layered-nav-container').animate({ left : -260 }, 300).removeClass('open');
                $grid.animate({ marginLeft : '3.5%' }, 300, function() {
                    $grid.removeClass('list-narrow');
                    self.setItemWidth();
                    if ($grid.data('isotope')) $grid.isotope('layout');
                });
                eraseCookie('mage-layerednavmode');
                if ($('.layered-nav-container').hasClass('remember')) createCookie('mage-layerednavmode', 0, 10);
            } else {
                $('.layered-nav-toggle').addClass('active');
                $('.layered-nav-container').animate({ left : 0 }, 300).addClass('open');
                $grid.animate({ marginLeft : '268' }, 300, function() {
                    if(document.documentElement.clientWidth <= 1024 &&
                        $grid.hasClass('list')) {
                        $grid.addClass('list-narrow');
                    }
                    self.setItemWidth();
                    if ($grid.data('isotope')) $grid.isotope('layout');
                });
                eraseCookie('mage-layerednavmode');
                if ($('.layered-nav-container').hasClass('remember')) createCookie('mage-layerednavmode', 1, 10);
            }
        };

        self.narrow_list_check = function() {
            // if layered nav is open and width < 64rem add narrow-list style
            $grid.removeClass('list-narrow');
            if (document.documentElement.clientWidth <= 1024 &&
                $grid.hasClass('list') &&
                $('.layered-nav-toggle').hasClass('active')) {
                $grid.addClass('list-narrow');
            } else if (document.documentElement.clientWidth <= 641 &&
                $grid.hasClass('list')) {
                $grid.addClass('list-narrow');
            }
        };

        self.list_mode = function() {
            $grid.addClass('list');
            self.narrow_list_check();
            if(document.documentElement.clientWidth <= 641) {
                $grid.addClass('list-narrow');
            }
            self.setItemWidth();
            if ($grid.data('isotope')) $grid.isotope('layout');
            $('.toggle-grid').removeClass('active');
            $('.toggle-list').addClass('active');
            if(readCookie('mage-listmode') == null){
                createCookie('mage-listmode', 1, 10);
            }
        };

        self.grid_mode = function() {
            $grid.removeClass('list');
            $grid.removeClass('list-narrow');
            self.setItemWidth();
            if ($grid.data('isotope')) $grid.isotope('layout');
            $('.toggle-list').removeClass('active');
            $('.toggle-grid').addClass('active');
            eraseCookie('mage-listmode');
        };

        self.init_isotope = function($grid) {
            if ($('#catalog-listing').hasClass('keep-aspect-ratio')) {
                // masonry layout is enabled - check for images to load
                imagesLoaded($grid, function() {
                    $grid.isotope({
                        itemSelector: '.isotope-item'
                    });
                });
                // reload masonry layout when clicking configurable swatch
                $(document).on('catalog:swapListImage', function(e){
                    $grid.isotope('reloadItems');
                    if ($grid.data('isotope')) $grid.isotope('layout');
                });
                self.clone_price();
            } else {
                $grid.isotope({
                    itemSelector: '.isotope-item'
                });
                self.clone_price();
            }
        };

        self.clone_price = function() {
            // clone price box for list mode and remove id (to avoid having duplicate ids)
            $(container).find('.item-content').each(function() {
                if ($(this).find('.actions > .price-box').length == 0) {
                    price_clone = $(this).find('.price-box').clone();
                    price_clone.find('*').removeAttr('id');
                    price_clone.prependTo($(this).find('.actions'));
                }
            });
        };

        self.init = function() {
            if(readCookie('mage-listmode')) {
                self.list_mode();
            }
            if (($('.layered-nav-container').hasClass('open') && readCookie('mage-layerednavmode') != 0) ||
                readCookie('mage-layerednavmode') == 1) {
                $('.layered-nav-container').css({ left : 0, display : 'block' });
                $('.layered-nav-toggle').addClass('active');
                $('.layered-nav-container').addClass('open');
                $grid.css({ marginLeft : '268px' });
                if(document.documentElement.clientWidth <= 641 &&
                    $grid.hasClass('list')) {
                    $grid.addClass('list-narrow');
                }
                self.setItemWidth();
                if ($grid.data('isotope')) $grid.isotope('layout');
            } else if (readCookie('mage-layerednavmode') != 1) {
                $('.layered-nav-container').removeClass('open');
                $('.layered-nav-container').css({ left : -260, display : 'block' });
            }
            self.setItemWidth();
            $(container).on('click', '.layered-nav-toggle', function(e) {
                e.preventDefault();
                self.slide_layered_nav();
            });
            $(container).on('click', '.toggle-list', function(e) {
                e.preventDefault();
                self.list_mode();
            });
            $(container).on('click', '.toggle-grid', function(e) {
                e.preventDefault();
                self.grid_mode();
            });
            self.narrow_list_check();
            if(settings.show_filters_by_default == true || $(location).attr('href').replace(/^.*?(#|$)/,'') == 'layered-nav') {
                self.slide_layered_nav();
            }
            self.init_isotope($grid);
            $('#catalog-listing').on('isotope:update', function(e) {
                // masonry layout is enabled - check for images to load
                if ($('#catalog-listing').hasClass('keep-aspect-ratio')) {
                    imagesLoaded($grid, function() {
                        self.setItemWidth();
                        if ($grid.data('isotope')) $grid.isotope('destroy');
                        self.init_isotope($grid);
                    });
                } else {
                    self.setItemWidth();
                    if ($grid.data('isotope')) $grid.isotope('destroy');
                    self.init_isotope($grid);
                }
                self.clone_price();
                init_form_select();
            });
            $('#catalog-listing').on('item:setWidth', function(e) {
                self.setItemWidth();
            });
            $(document).ready(function() {
                $(document).trigger('product-media-loaded');
            });
        };

        self.init();

        if ($('html').hasClass('touch')) {
            $(window).on('orientationchange resize', function(e) {
                setTimeout(function(){
                    self.narrow_list_check();
                    self.setItemWidth();
                    if ($grid.data('isotope')) $grid.isotope('layout');
                },500);
            });
        } else {
            $(window).resize(function() {
                $grid.removeClass('list-narrow');
                if (document.documentElement.clientWidth <= 1024 &&
                    $grid.hasClass('list') &&
                    $('.layered-nav-toggle').hasClass('active')) {
                    $grid.addClass('list-narrow');
                } else if (document.documentElement.clientWidth <= 641 &&
                    $grid.hasClass('list')) {
                    $grid.addClass('list-narrow');
                }
                self.setItemWidth();
                if ($grid.data('isotope')) $grid.isotope('layout');
            });
        }
    };

    var SlideAnimation = function(settings) {
        var duration;
        var is_rtl = ($('html[dir=rtl]').length === 1);
        var margin = is_rtl ? 'marginRight' : 'marginLeft';
        var animMargin = {};
        var current = this.current;

        this.next = function(slides, uuid, current, next, adjust_last_page, count_visible_items, featured_item_width, no_animate) {
            duration = (no_animate) ? 0 : settings.animation_speed;
            animMargin[margin] = -(next*count_visible_items*featured_item_width) -12 + adjust_last_page;
            slides.animate(animMargin, duration, function() {
                current[uuid, slides.parent().children('ol').index(slides)] = next;
                // force lazy loading plugin to render without scroll
                setTimeout(function(){ echo.render(); },0);
            });
        };

        this.prev = function(slides, uuid, current, prev, empty_positions, count_visible_items, featured_item_width, no_animate) {
            duration = (no_animate) ? 0 : settings.animation_speed;
            animMargin[margin] = -(prev*count_visible_items*featured_item_width)-12;
            slides.animate(animMargin, duration, function() {
                current[uuid, slides.parent().children('ol').index(slides)] = prev;
                // force lazy loading plugin to render without scroll
                setTimeout(function(){ echo.render('render'); },0);
            });
        };
    };

    var init_product_labels = function() {
        var productIds = [],
            productSources = [],
            labelUrl = $('.product-label-placeholder').data('labelurl');
        $('.product-label-placeholder').each(function(){
            productIds.push($(this).data('productid'));
            productSources.push($(this).data('source'))
        });
        if (productIds.length > 0) {
          $.ajax({
              url: labelUrl,
              data: {productIds : productIds, productSources: productSources},
              type: 'POST',
              dataType: 'json',
              success: function(response) {
                  $.each(response, function(index, data) {
                      $('[data-productid="'+index+'"]').replaceWith(data);
                  });
              }
          });
        }
    };

    var close_dropdown_on_touch = function() {
        if ($('html').hasClass('touch')) {
            $j('.level0.dropdown').on('click','.level1.has-children',function() {
                $(this).parent('li').siblings('li').find('.level1.dropdown').hide();
                $(this).parent('li').find('.level1.dropdown').show();
            });
        }
    };

    window.Intenso = {
        name : 'Intenso',

        version : '1.5.0',

        init : function (scope, libraries, method, options, response) {
            var library_arr,
                args = [scope, method, options, response],
                responses = [];

            // set global scope
            this.scope = scope || this.scope;

            if (libraries && typeof libraries === 'string') {
                if (this.libs.hasOwnProperty(libraries)) {
                    responses.push(this.init_lib(libraries, args));
                }
            } else {
                for (var lib in this.libs) {
                    responses.push(this.init_lib(lib, libraries));
                }
            }

            return scope;
        },

        init_lib : function (lib, args) {
            if (this.libs.hasOwnProperty(lib)) {

                if (args && args.hasOwnProperty(lib)) {
                    return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
                }

                args = args instanceof Array ? args : Array(args);    // PATCH: added this line
                return this.libs[lib].init.apply(this.libs[lib], args);
            }

            return function () {};
        },

        libs : {}

    };

    $.fn.intenso = function () {
        var args = Array.prototype.slice.call(arguments, 0);

        return this.each(function () {
            Intenso.init.apply(Intenso, [this].concat(args));
            return this;
        });
    };

    Intenso.libs = Intenso.libs || {};

    // User interface
    Intenso.libs.ui = {
        settings: {
            svg_fallback: true
        },

        init : function(scope, method, options){
            var self = this;
            var settings = $.extend({}, self.settings, (options || method));
            Intenso.libs.ui.setup(settings);
        },

        setup : function(settings){
            if(settings.svg_fallback) replace_inline_SVG();
            touch_exit_canvas();
            // Toggle placeholder´s text on focus/blur
            toggle_input_placeholder();
            // Close offcanvas menu on browser resize
            if ($('html').hasClass('touch')) {
                $(window).on('orientationchange resize', function(e) {
                    if(document.documentElement.clientWidth / parseFloat($("body").css("font-size")) >= 40.063) {
                        $(".off-canvas-wrap").removeClass("move-left");
                        $(".off-canvas-wrap").removeClass("move-right");
                    }
                });
            } else {
                $( window ).resize(function() {
                    if(document.documentElement.clientWidth / parseFloat($("body").css("font-size")) >= 40.063) {
                        $(".off-canvas-wrap").removeClass("move-left");
                        $(".off-canvas-wrap").removeClass("move-right");
                    }
                });
            }
            // add empty span referencing main color to allow querying main color when needed
            $('<span class="main-color"></span>').appendTo('body');
            // open global message (if any)
            $("#reveal-messages").foundation("reveal", "open");

            back_to_top();
            init_form_select(); // Init form selects
            bind_inputbox_focus(); // Change border color on input focus and animate labels
            fix_label(); // Add class to textarea, checkbox and radio labels
            toggle_newsletter_inputbox(); // Toggle newsletter inputbox on click
            toggle_tags_inputbox(); // Toggle tags inputbox on click
            toggle_secmenu(); // prevent menu from losing focus when select-box option is hover
            init_mega_menu();
            init_vertical_menu();
            close_dropdown_on_touch();
            if ($('.main-header').hasClass('sticky-menu') && !$('.main-header nav.top-bar.main-nav').hasClass('vertical')) init_sticky_header();
            echo.init({ // init lazy loading of images
                offset: 300,
                throttle: 250,
                unload: false,
                callback: function(element, op) {
                    if(op === 'load') {
                        $(element).css('background-image', 'none');
                    }
                }
            });
            $(document).on('click', '#allow_gift_messages_for_order, #allow_gift_messages_for_items', function() {
                $('.input-text').each(function() {
                    input_focus(this);
                });
            })
        },
        bindInputboxes : function() {
            bind_inputbox_focus();
        },
        readCookie : function(name) {
            return readCookie(name);
        },
        createCookie : function(name, value, days) {
            createCookie(name, value, days);
        },
        eraseCookie : function(name) {
            eraseCookie(name);
        }
    },

    // Product labels init
    Intenso.libs.productLabel = {
        init : function() {
            init_product_labels();
        }
    },

    // Mini cart dropdown
    Intenso.libs.miniCart = {
        settings: {
            sliderWidth: parseInt($('.cart-dropdown .arrow-box').css('width'), 10)
        },

        init : function(scope, method, options){
            var self = this;
            var settings = $.extend({}, self.settings, (options || method));
            Intenso.libs.miniCart.setup(settings);
        },

        setup : function(settings){
            minicart_build_markup();
            minicart_toggle_item_attr();
            minicart_slider_control(settings.sliderWidth);
        }
    },

    // Featured slider
    Intenso.libs.featured = {
        settings: {
            container_class: 'featured-slider',
            sneak_peak_width: 32,
            min_item_width: 220,
            fixed_width: false,
            animation_speed: 300,
            slide_selector: 'item',
            navigation_arrows: true,
            prev_class: 'featured-prev',
            next_class: 'featured-next',
            bullets: true,
            max_bullets_count: 10,
            bullets_active_class: 'active',
            category_nav_menu: true,
            swipe: true
        },

        uuid : function (separator) {
            var delim = separator || "-",
                self = this;

            function S4() {
                return random_str(5);
            }

            return (S4() + S4() + delim + S4() + delim + S4()
            + delim + S4() + delim + S4() + S4() + S4());
        },

        init : function(scope, method, options){
            var self = this;
            Intenso.libs.featured.setup(self.settings);
        },

        setup : function(settings){
            var self = this,
                data_options_attr;
            $('.'+settings.container_class).each(function(){
                if ($(this).attr('data-uuid') === undefined) {
                    var uuid = self .uuid();
                    $(this).attr('data-uuid', uuid);
                    data_options_attr = data_options($(this));
                    settings = $.extend({}, self.settings, data_options_attr);
                    var featured_instance = new Featured(this, settings, uuid);
                }
            });
        }
    },

    // Orbit slider
    Intenso.libs.orbit = {
        settings: {
            outside_bullets: false
        },

        init : function(){
            var self = this,
                data_options = Foundation.utils.data_options($('.orbit-slides-container')); // get data attr

            var settings = $.extend({}, self.settings, $('.orbit-slides-container').data('orbit-init'), data_options);
            Intenso.libs.orbit.setup(settings);
        },

        setup : function(settings){
            $('.'+settings.container_class).each(function(){
                var orbit_slider_instance = new OrbitSlider($(this).parent('.orbit-container'), settings);
            });
        }
    },

    // Brands slider
    Intenso.libs.brandSlider = {
        settings: {
            container_class: 'brand-slider',
            sneak_peak_width: 62,
            min_item_width: 120,
            animation_speed: 300,
            slide_selector: 'brand',
            navigation_arrows: true,
            prev_class: 'brand-prev',
            next_class: 'brand-next',
            bullets: true,
            max_bullets_count: 10,
            bullets_active_class: 'active',
            swipe: true
        },

        uuid : function (separator) {
            var delim = separator || "-",
                self = this;

            function S4() {
                return random_str(5);
            }

            return (S4() + S4() + delim + S4() + delim + S4()
            + delim + S4() + delim + S4() + S4() + S4());
        },

        init : function(scope, method, options){
            var self = this,
                data_options_attr = data_options($('.brand-slider')); // get data attr
            var settings = $.extend({}, self.settings, data_options_attr);
            Intenso.libs.brandSlider.setup(settings);
        },

        setup : function(settings){
            var self = this;
            $('.'+settings.container_class).each(function(){
                var uuid = self .uuid();
                $(this).attr('data-uuid', uuid);
                var brandSlider_instance = new BrandSlider(this, settings, uuid);
            });
        }
    },

    // Products Grid
    Intenso.libs.productsGrid = {
        settings: {
            container_class: 'products-grid',
            min_item_width: 220,
            item_selector: 'item',
            show_filters_by_default: false
        },

        init : function(scope, method, options){
            var self = this;
            var settings = $.extend({}, self.settings, (options || method));
            Intenso.libs.productsGrid.setup(settings);
        },

        setup : function(settings){
            var self = this;
            var productsGrid_instance = new ProductsGrid($('.'+settings.container_class), settings);
        }
    }

    // Auto dismiss modal popups
    Intenso.libs.revealModalTimer = {
        settings: {
            duration: '5s'
        },

        init : function(scope, method, options){
            var self = this;
            var settings = $.extend({}, self.settings, (options || method));
            Intenso.libs.revealModalTimer.setup(settings);
        },

        setup : function(settings){
            if ($('#dismiss-bar').length > 0) {
                var progressbar = $('#dismiss-bar'),
                    progressbarinner = document.createElement('div'),
                    time = $('#dismiss-bar').data('time') || settings.duration;
                progressbarinner.className = 'inner';
                progressbarinner.style.animationDuration = time;

                $('#reveal-messages').on('animationend', progressbarinner, function() {
                    $('#reveal-messages').foundation('reveal', 'close');
                });

                progressbar.append(progressbarinner);
                progressbarinner.style.animationPlayState = 'running';
            }
        }
    }

    // Catalog AJAX
    Intenso.libs.catalogAjax = {
        processingUrl: '',
        url: '',
        settings: {
            offset: 300,
            catalogListing: $('#catalog-listing'),
            pager: '#pager .next'
        },

        init: function(scope, method, options){
            var self = this,
                settings = $.extend({}, self.settings, (options || method));
            if (!settings.catalogListing.hasClass('ajax')) return;
            if (settings.catalogListing.length && settings.catalogListing.hasClass('infinite-scroll')) {
                $('#pager.toolbar-bottom').hide();
                $(window).scroll($.throttle(500, function () {
                    Intenso.libs.catalogAjax.scrolling(settings);
                }));
            }
            (function(History) {
                if (!History.enabled) {
                    return false;
                }
                $(function() {
                    if(settings.catalogListing.length) {
                        Intenso.libs.catalogAjax.pushState({
                            listing: $('#catalog-listing').html(),
                            layer: $('#layered-navigation').html(),
                            categoryName: $('#category-name').html(),
                            clearLink: $('#filter-reset').html(),
                            amount: $('#amount').html(),
                            pager: $('#pager').html(),
                            orders: $('#orders').html(),
                            limits: $('#limits').html(),
                            breadcrumbs: $('.breadcrumbs-wrapper').html()
                        }, document.location.href, true);
                    }

                    // Bind to StateChange Event
                    History.Adapter.bind(window, 'popstate', function(event) {
                        if (event.type == 'popstate') {
                            var State = History.getState();
                            if ($('#catalog-listing').length) $('#catalog-listing').html(State.data.listing);
                            if ($('#layered-navigation').length) $('#layered-navigation').html(State.data.layer);
                            if ($('#category-name').length) $('#category-name').html(State.data.categoryName);
                            if ($('#filter-reset').length) $('#filter-reset').html(State.data.clearLink);
                            if ($('#amount').length) $('#amount').html(State.data.amount);
                            if ($('#pager').length) $('#pager').html(State.data.pager);
                            if ($('#orders').length) $('#orders').html(State.data.orders);
                            if ($('#limits').length) $('#limits').html(State.data.limits);
                            if ($('.breadcrumbs-wrapper').length) $('.breadcrumbs-wrapper').html(State.data.breadcrumbs);
                            Intenso.libs.catalogAjax.ajaxListener();
                            Intenso.libs.catalogAjax.shorten_list($('.products-grid').data('list-qty'));
                            // trigger jQuery event needed to re-layout grid on intenso.js ?>
                            $('#catalog-listing').trigger('isotope:update');
                            // dispatch event to update chosen.js select boxes ?>
                            $('.layered-nav-select select').each(function(){
                                $(this).trigger('chosen:updated');
                            });
                            // dispatch catalog:update event for others script to hook up with ?>
                            $('#catalog-listing').trigger('catalog:update');
                            // trigger jQuery event needed to bind config swatches ?>
                            setTimeout(function(){
                                $(document).trigger('product-media-loaded');
                                // init lazy loading of images
                                echo.init({ // init lazy loading of images
                                    offset: 100,
                                    throttle: 250,
                                    unload: false
                                });
                                Intenso.libs.catalogAjax.scrolling(settings);
                            },500);
                        }
                    });
                });
            })(window.History);
            Intenso.libs.catalogAjax.ajaxListener();
            Intenso.libs.catalogAjax.shorten_list($('.products-grid').data('list-qty'));
            Intenso.libs.catalogAjax.scrolling(settings);
        },

        scrolling: function(settings) {
            var gridBottomPosition, scrollBottom,
                gridPosition = settings.catalogListing.position(),
                gridHeight = Math.floor(settings.catalogListing.outerHeight()),
                scrollTop = Math.floor($(window).scrollTop()),
                windowHeight = Math.floor(window.innerHeight);
            if ($(settings.pager).length == 0 || !settings.catalogListing.hasClass('infinite-scroll')) return;
            gridBottomPosition = Math.floor(gridPosition.top) + gridHeight;
            scrollBottom = scrollTop + windowHeight;
            if (gridBottomPosition - settings.offset < scrollBottom) {
                if ($(settings.pager).length) {
                    Intenso.libs.catalogAjax.handleEvent($(settings.pager).attr('href'), null, true);
                }
            }
        },

        pushState: function(data, link, replace) {
            var History = window.History;
            if ( !History.enabled ) {
                return false;
            }
            // check sessionStorage size to avoid exceeding storage quota
            if (window.sessionStorage
                && sessionStorage.getItem('History.store')
                && sessionStorage.getItem('History.store').length > 4000000) {
                sessionStorage.clear();
            }
            if (replace) {
                History.replaceState(data, document.title, link);
            } else {
                History.pushState(data, document.title, link);
            }
        },

        handleEvent: function(el, event, appendContent) {
            var url, fullUrl, isInfiniteScroll;
            if (typeof el === 'string') {
                url = el;
            } else if (el.prop('tagName').toLowerCase() === 'a') {
                url = el.attr('href');
            } else if (el.prop('tagName').toLowerCase() === 'select') {
                url = el.val();
            }

            if (Intenso.libs.catalogAjax.processingUrl == url) {
                return;
            } else {
                Intenso.libs.catalogAjax.processingUrl = url;
            }

            // Add this to query string for full page caching systems ?>
            if (url.indexOf('?') != -1) {
                fullUrl = url + '&isLayerAjax=1';
            } else {
                fullUrl = url + '?isLayerAjax=1';
            }

            isInfiniteScroll = (Intenso.libs.catalogAjax.settings.catalogListing.hasClass('infinite-scroll')
            && typeof el === 'string' && appendContent) ? true : false;
            $('#ajax-errors').hide();

            if (isInfiniteScroll) {
                var layeredNavPaneOpenClass = ($('.layered-nav-container').hasClass('open')) ? ' open' : '';
                $('<div class="loading-infinite'+layeredNavPaneOpenClass+'"><span class="button">'+Translator.translate('Loading more products...')+'</span></div>').insertAfter(Intenso.libs.catalogAjax.settings.catalogListing);
            } else {
                $('body').addClass('app-loading');
                Intenso.libs.catalogAjax.settings.catalogListing.addClass('loading');
                // push new state to update URL in case the AJAX call fails
                Intenso.libs.catalogAjax.pushState(null, url, false);
            }

            $.ajax(fullUrl, {
                type: 'GET',
                dataType : 'json',
                success: function(data) {
                    if (data) {
                        $('#catalog-listing *').off(); // unbind all previous events inside catalog listing
                        if (Intenso.libs.catalogAjax.settings.catalogListing.hasClass('infinite-scroll')
                            && typeof el === 'string' && appendContent) {
                            $('.loading-infinite').remove();
                            var newItems = $(data.listing).appendTo('#catalog-listing');
                            Intenso.libs.catalogAjax.settings.catalogListing.trigger('item:setWidth');
                            $('#catalog-listing').isotope('appended', newItems);
                        } else {
                            Intenso.libs.catalogAjax.settings.catalogListing.html(data.listing);
                        }
                        $('#layered-navigation').html(data.layer);
                        $('#category-name').html(data.categoryName);
                        $('#filter-reset').html(data.clearLink);
                        $('#amount').html(data.amount);
                        $('#pager').html(data.pager);
                        $('#orders').html(data.orders);
                        $('#limits').html(data.limits);
                        $('.breadcrumbs-wrapper').html(data.breadcrumbs);

                        if (!isInfiniteScroll) {
                            Intenso.libs.catalogAjax.pushState({
                                listing: data.listing,
                                layer: data.layer,
                                categoryName: data.categoryName,
                                clearLink: data.clearLink,
                                amount: data.amount,
                                pager: data.pager,
                                orders: data.orders,
                                limits: data.limits,
                                breadcrumbs: data.breadcrumbs
                            }, url, true);
                        }
                        Intenso.libs.catalogAjax.ajaxListener(); // attach click and change event handlers
                        Intenso.libs.productLabel.init(); // init product labels

                        Intenso.libs.catalogAjax.shorten_list($('.products-grid').data('list-qty'));
                        echo.init({ // init lazy loading of images
                            offset: 100,
                            throttle: 250,
                            unload: false
                        });

                        // clone price box for list mode and remove id (to avoid having duplicate ids)
                        $('.products-grid').find('.item-content').each(function() {
                            if ($(this).find('.actions > .price-box').length == 0) {
                                var price_clone = $(this).find('.price-box').clone();
                                price_clone.find('*').removeAttr('id');
                                price_clone.prependTo($(this).find('.actions'));
                            }
                        });

                        if (!isInfiniteScroll) {
                            // trigger jQuery event needed to relayout grid
                            Intenso.libs.catalogAjax.settings.catalogListing.trigger('isotope:update');
                            var body = $j('html, body');
                            body.animate({scrollTop: $('.products-grid').position().top - 30}, '3000', 'swing', function () {
                                // callback
                            });
                        }
                    } else {
                        $('#ajax-errors').show();
                        Intenso.libs.catalogAjax.settings.catalogListing.removeClass('loading');
                    }

                    $('body').removeClass('app-loading');
                    Intenso.libs.catalogAjax.settings.catalogListing.removeClass('loading');

                    // dispatch catalog:update event for others script to hook up with
                    Intenso.libs.catalogAjax.settings.catalogListing.trigger('catalog:update');
                    // trigger jQuery event needed to bind config swatches ?>
                    $j(document).ready(function() {
                        setTimeout(function(){
                            $j(document).trigger('product-media-loaded');
                        },500);
                    });
                    Intenso.libs.catalogAjax.scrolling(Intenso.libs.catalogAjax.settings);
                }
            });

            if (event) {
                event.preventDefault();
            }
        },

        ajaxListener: function() {
            var that = this,
                els;
            els = $('div.pager a')
                .add('.layered-nav-select select')
                .add('#narrow-by-list a')
                .add('#pager a')
                .add('#filter-reset a');

            els.each(function() {
                if ($(this).prop('tagName').toLowerCase() === 'a') {
                    $(this).on('click', function(event) {
                        Intenso.libs.catalogAjax.handleEvent($(this), event);
                    });
                } else if ($(this).prop('tagName').toLowerCase() === 'select') {
                    $(this).attr('onchange', '');
                    $(this).on('change', function(event) {
                        Intenso.libs.catalogAjax.handleEvent($(this), event);
                    });
                }
            });
        },

        hide_list_item: function(children, list_items_qty) {
            if(children.length > list_items_qty){
                for(var i = list_items_qty; i < children.length; i++) {
                    $(children[i]).hide();
                }
            }
        },

        shorten_list: function(list_items_qty) {
            list_items_qty = typeof list_items_qty !== 'undefined' ? list_items_qty : 5;
            var show_more = Translator.translate('Show all');
            var show_less = Translator.translate('Show less');
            var link = '<span class="arrow-down show-more">'+show_more+'</span>';
            $('.layered-nav dt').each(function(index) {
                var el = $(this).next('dd').find('ol').first();
                var children = $(el).find('li');
                if(children.length > list_items_qty){
                    Intenso.libs.catalogAjax.hide_list_item(children, list_items_qty);
                    $(this).append(link);
                }
            });
            $('.show-more').each(function(index) {
                $(this).on('click', function(event) {
                    event.preventDefault();
                    $(this).toggleClass('show-all');
                    var ol = $(this).parent().next('dd').find('ol');
                    var children = $(ol).find('li');
                    if($(this).hasClass('show-all')) {
                        children.each(function() {
                            $(this).fadeIn(300);
                        });
                        $(this).html(show_less);
                        $(this).removeClass('arrow-down').addClass('arrow-up');
                    } else {
                        Intenso.libs.catalogAjax.hide_list_item(children, list_items_qty);
                        $(this).html(show_more);
                        $(this).removeClass('arrow-up').addClass('arrow-down');
                    }
                });
            });
        }
    }

}(jQuery, this, this.document));

(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    // smartresize
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

/*!
 * Isotope PACKAGED v3.0.1
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2016 Metafizzy
 */

!function(t,e){"use strict";"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,s,a){function u(t,e,n){var o,s="$()."+i+'("'+e+'")';return t.each(function(t,u){var h=a.data(u,i);if(!h)return void r(i+" not initialized. Cannot call methods, i.e. "+s);var d=h[e];if(!d||"_"==e.charAt(0))return void r(s+" is not a valid method");var l=d.apply(h,n);o=void 0===o?l:o}),void 0!==o?o:t}function h(t,e){t.each(function(t,n){var o=a.data(n,i);o?(o.option(e),o._init()):(o=new s(n,e),a.data(n,i,o))})}a=a||e||t.jQuery,a&&(s.prototype.option||(s.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=o.call(arguments,1);return u(this,t,e)}return h(this,t),this},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var o=Array.prototype.slice,s=t.console,r="undefined"==typeof s?function(){}:function(t){s.error(t)};return n(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,o=i[n];e=e||[];for(var s=this._onceEvents&&this._onceEvents[t];o;){var r=s&&s[o];r&&(this.off(t,o),delete s[o]),o.apply(this,e),n+=r?0:1,o=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("get-size/get-size",[],function(){return e()}):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=-1==t.indexOf("%")&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;h>e;e++){var i=u[e];t[i]=0}return t}function n(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),e}function o(){if(!d){d=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var o=n(e);s.isBoxSizeOuter=r=200==t(o.width),i.removeChild(e)}}function s(e){if(o(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var s=n(e);if("none"==s.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var d=a.isBorderBox="border-box"==s.boxSizing,l=0;h>l;l++){var f=u[l],c=s[f],m=parseFloat(c);a[f]=isNaN(m)?0:m}var p=a.paddingLeft+a.paddingRight,y=a.paddingTop+a.paddingBottom,g=a.marginLeft+a.marginRight,v=a.marginTop+a.marginBottom,_=a.borderLeftWidth+a.borderRightWidth,I=a.borderTopWidth+a.borderBottomWidth,z=d&&r,x=t(s.width);x!==!1&&(a.width=x+(z?0:p+_));var S=t(s.height);return S!==!1&&(a.height=S+(z?0:y+I)),a.innerWidth=a.width-(p+_),a.innerHeight=a.height-(y+I),a.outerWidth=a.width+g,a.outerHeight=a.height+v,a}}var r,a="undefined"==typeof console?e:function(t){console.error(t)},u=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],h=u.length,d=!1;return s}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i],o=n+"MatchesSelector";if(t[o])return o}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e},i.makeArray=function(t){var e=[];if(Array.isArray(t))e=t;else if(t&&"number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e},i.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},i.getParent=function(t,i){for(;t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var o=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void o.push(t);e(t,n)&&o.push(t);for(var i=t.querySelectorAll(n),s=0;s<i.length;s++)o.push(i[s])}}),o},i.debounceMethod=function(t,e,i){var n=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];t&&clearTimeout(t);var e=arguments,s=this;this[o]=setTimeout(function(){n.apply(s,e),delete s[o]},i||100)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?t():document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var n=t.console;return i.htmlInit=function(e,o){i.docReady(function(){var s=i.toDashed(o),r="data-"+s,a=document.querySelectorAll("["+r+"]"),u=document.querySelectorAll(".js-"+s),h=i.makeArray(a).concat(i.makeArray(u)),d=r+"-options",l=t.jQuery;h.forEach(function(t){var i,s=t.getAttribute(r)||t.getAttribute(d);try{i=s&&JSON.parse(s)}catch(a){return void(n&&n.error("Error parsing "+r+" on "+t.className+": "+a))}var u=new e(t,i);l&&l.data(t,o,u)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";function i(t){for(var e in t)return!1;return e=null,!0}function n(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function o(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var s=document.documentElement.style,r="string"==typeof s.transition?"transition":"WebkitTransition",a="string"==typeof s.transform?"transform":"WebkitTransform",u={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[r],h={transform:a,transition:r,transitionDuration:r+"Duration",transitionProperty:r+"Property",transitionDelay:r+"Delay"},d=n.prototype=Object.create(t.prototype);d.constructor=n,d._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},d.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},d.getSize=function(){this.size=e(this.element)},d.css=function(t){var e=this.element.style;for(var i in t){var n=h[i]||i;e[n]=t[i]}},d.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),n=t[e?"left":"right"],o=t[i?"top":"bottom"],s=this.layout.size,r=-1!=n.indexOf("%")?parseFloat(n)/100*s.width:parseInt(n,10),a=-1!=o.indexOf("%")?parseFloat(o)/100*s.height:parseInt(o,10);r=isNaN(r)?0:r,a=isNaN(a)?0:a,r-=e?s.paddingLeft:s.paddingRight,a-=i?s.paddingTop:s.paddingBottom,this.position.x=r,this.position.y=a},d.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop"),o=i?"paddingLeft":"paddingRight",s=i?"left":"right",r=i?"right":"left",a=this.position.x+t[o];e[s]=this.getXValue(a),e[r]="";var u=n?"paddingTop":"paddingBottom",h=n?"top":"bottom",d=n?"bottom":"top",l=this.position.y+t[u];e[h]=this.getYValue(l),e[d]="",this.css(e),this.emitEvent("layout",[this])},d.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},d.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},d._transitionTo=function(t,e){this.getPosition();var i=this.position.x,n=this.position.y,o=parseInt(t,10),s=parseInt(e,10),r=o===this.position.x&&s===this.position.y;if(this.setPosition(t,e),r&&!this.isTransitioning)return void this.layoutPosition();var a=t-i,u=e-n,h={};h.transform=this.getTranslate(a,u),this.transition({to:h,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},d.getTranslate=function(t,e){var i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop");return t=i?t:-t,e=n?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},d.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},d.moveTo=d._transitionTo,d.setPosition=function(t,e){this.position.x=parseInt(t,10),this.position.y=parseInt(e,10)},d._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},d.transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var n=this.element.offsetHeight;n=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var l="opacity,"+o(a);d.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:l,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(u,this,!1)}},d.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},d.onotransitionend=function(t){this.ontransitionend(t)};var f={"-webkit-transform":"transform"};d.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,n=f[t.propertyName]||t.propertyName;if(delete e.ingProperties[n],i(e.ingProperties)&&this.disableTransition(),n in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[n]),n in e.onEnd){var o=e.onEnd[n];o.call(this),delete e.onEnd[n]}this.emitEvent("transitionEnd",[this])}},d.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(u,this,!1),this.isTransitioning=!1},d._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var c={transitionProperty:"",transitionDuration:"",transitionDelay:""};return d.removeTransitionStyles=function(){this.css(c)},d.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},d.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},d.remove=function(){return r&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},d.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},d.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},d.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},d.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},d.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},d.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},n}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,n,o,s){return e(t,i,n,o,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,n,o){"use strict";function s(t,e){var i=n.getQueryElement(t);if(!i)return void(u&&u.error("Bad element for "+this.constructor.namespace+": "+(i||t)));this.element=i,h&&(this.$element=h(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e);var o=++l;this.element.outlayerGUID=o,f[o]=this,this._create();var s=this._getOption("initLayout");s&&this.layout()}function r(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}function a(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),i=e&&e[1],n=e&&e[2];if(!i.length)return 0;i=parseFloat(i);var o=m[n]||1;return i*o}var u=t.console,h=t.jQuery,d=function(){},l=0,f={};s.namespace="outlayer",s.Item=o,s.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var c=s.prototype;n.extend(c,e.prototype),c.option=function(t){n.extend(this.options,t)},c._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},s.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},c._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),n.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},c.reloadItems=function(){this.items=this._itemize(this.element.children)},c._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,n=[],o=0;o<e.length;o++){var s=e[o],r=new i(s,this);n.push(r)}return n},c._filterFindItemElements=function(t){return n.filterFindElements(t,this.options.itemSelector)},c.getItemElements=function(){return this.items.map(function(t){return t.element})},c.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},c._init=c.layout,c._resetLayout=function(){this.getSize()},c.getSize=function(){this.size=i(this.element)},c._getMeasurement=function(t,e){var n,o=this.options[t];o?("string"==typeof o?n=this.element.querySelector(o):o instanceof HTMLElement&&(n=o),this[t]=n?i(n)[e]:o):this[t]=0},c.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},c._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},c._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var n=this._getItemLayoutPosition(t);n.item=t,n.isInstant=e||t.isLayoutInstant,i.push(n)},this),this._processLayoutQueue(i)}},c._getItemLayoutPosition=function(){return{x:0,y:0}},c._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},c.updateStagger=function(){var t=this.options.stagger;return null===t||void 0===t?void(this.stagger=0):(this.stagger=a(t),this.stagger)},c._positionItem=function(t,e,i,n,o){n?t.goTo(e,i):(t.stagger(o*this.stagger),t.moveTo(e,i))},c._postLayout=function(){this.resizeContainer()},c.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},c._getContainerSize=d,c._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},c._emitCompleteOnItems=function(t,e){function i(){o.dispatchEvent(t+"Complete",null,[e])}function n(){r++,r==s&&i()}var o=this,s=e.length;if(!e||!s)return void i();var r=0;e.forEach(function(e){e.once(t,n)})},c.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),h)if(this.$element=this.$element||h(this.element),e){var o=h.Event(e);o.type=t,this.$element.trigger(o,i)}else this.$element.trigger(t,i)},c.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},c.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},c.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},c.unstamp=function(t){t=this._find(t),t&&t.forEach(function(t){n.removeFrom(this.stamps,t),this.unignore(t)},this)},c._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=n.makeArray(t)):void 0},c._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},c._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},c._manageStamp=d,c._getElementOffset=function(t){var e=t.getBoundingClientRect(),n=this._boundingRect,o=i(t),s={left:e.left-n.left-o.marginLeft,top:e.top-n.top-o.marginTop,right:n.right-e.right-o.marginRight,bottom:n.bottom-e.bottom-o.marginBottom};return s},c.handleEvent=n.handleEvent,c.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},c.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},c.onresize=function(){this.resize()},n.debounceMethod(s,"onresize",100),c.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},c.needsResizeLayout=function(){var t=i(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},c.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},c.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},c.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},c.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.reveal()})}},c.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.hide()})}},c.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},c.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},c.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},c.getItems=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},c.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),n.removeFrom(this.items,t)},this)},c.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete f[e],delete this.element.outlayerGUID,h&&h.removeData(this.element,this.constructor.namespace)},s.data=function(t){t=n.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&f[e]},s.create=function(t,e){var i=r(s);return i.defaults=n.extend({},s.defaults),n.extend(i.defaults,e),i.compatOptions=n.extend({},s.compatOptions),i.namespace=t,i.data=s.data,i.Item=r(o),n.htmlInit(i,t),h&&h.bridget&&h.bridget(t,i),i};var m={ms:1,s:1e3};return s.Item=o,s}),function(t,e){"function"==typeof define&&define.amd?define("isotope/js/item",["outlayer/outlayer"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.Item=e(t.Outlayer))}(window,function(t){"use strict";function e(){t.Item.apply(this,arguments)}var i=e.prototype=Object.create(t.Item.prototype),n=i._create;i._create=function(){this.id=this.layout.itemGUID++,n.call(this),this.sortData={}},i.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var t=this.layout.options.getSortData,e=this.layout._sorters;for(var i in t){var n=e[i];this.sortData[i]=n(this.element,this)}}};var o=i.destroy;return i.destroy=function(){o.apply(this,arguments),this.css({display:""})},e}),function(t,e){"function"==typeof define&&define.amd?define("isotope/js/layout-mode",["get-size/get-size","outlayer/outlayer"],e):"object"==typeof module&&module.exports?module.exports=e(require("get-size"),require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.LayoutMode=e(t.getSize,t.Outlayer))}(window,function(t,e){"use strict";function i(t){this.isotope=t,t&&(this.options=t.options[this.namespace],this.element=t.element,this.items=t.filteredItems,this.size=t.size)}var n=i.prototype,o=["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout","_getOption"];return o.forEach(function(t){n[t]=function(){return e.prototype[t].apply(this.isotope,arguments)}}),n.needsVerticalResizeLayout=function(){var e=t(this.isotope.element),i=this.isotope.size&&e;return i&&e.innerHeight!=this.isotope.size.innerHeight},n._getMeasurement=function(){this.isotope._getMeasurement.apply(this,arguments)},n.getColumnWidth=function(){this.getSegmentSize("column","Width")},n.getRowHeight=function(){this.getSegmentSize("row","Height")},n.getSegmentSize=function(t,e){var i=t+e,n="outer"+e;if(this._getMeasurement(i,n),!this[i]){var o=this.getFirstItemSize();this[i]=o&&o[n]||this.isotope.size["inner"+e]}},n.getFirstItemSize=function(){var e=this.isotope.filteredItems[0];return e&&e.element&&t(e.element)},n.layout=function(){this.isotope.layout.apply(this.isotope,arguments)},n.getSize=function(){this.isotope.getSize(),this.size=this.isotope.size},i.modes={},i.create=function(t,e){function o(){i.apply(this,arguments)}return o.prototype=Object.create(n),o.prototype.constructor=o,e&&(o.options=e),o.prototype.namespace=t,i.modes[t]=o,o},i}),function(t,e){"function"==typeof define&&define.amd?define("masonry/masonry",["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");return i.compatOptions.fitWidth="isFitWidth",i.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0},i.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var n=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,s=o/n,r=n-o%n,a=r&&1>r?"round":"floor";s=Math[a](s),this.cols=Math.max(s,1)},i.prototype.getContainerWidth=function(){var t=this._getOption("fitWidth"),i=t?this.element.parentNode:this.element,n=e(i);this.containerWidth=n&&n.innerWidth},i.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=e&&1>e?"round":"ceil",n=Math[i](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var o=this._getColGroup(n),s=Math.min.apply(Math,o),r=o.indexOf(s),a={x:this.columnWidth*r,y:s},u=s+t.size.outerHeight,h=this.cols+1-o.length,d=0;h>d;d++)this.colYs[r+d]=u;return a},i.prototype._getColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,n=0;i>n;n++){var o=this.colYs.slice(n,n+t);e[n]=Math.max.apply(Math,o)}return e},i.prototype._manageStamp=function(t){var i=e(t),n=this._getElementOffset(t),o=this._getOption("originLeft"),s=o?n.left:n.right,r=s+i.outerWidth,a=Math.floor(s/this.columnWidth);a=Math.max(0,a);var u=Math.floor(r/this.columnWidth);u-=r%this.columnWidth?0:1,u=Math.min(this.cols-1,u);for(var h=this._getOption("originTop"),d=(h?n.top:n.bottom)+i.outerHeight,l=a;u>=l;l++)this.colYs[l]=Math.max(d,this.colYs[l])},i.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},i.prototype._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},i.prototype.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i}),function(t,e){"function"==typeof define&&define.amd?define("isotope/js/layout-modes/masonry",["../layout-mode","masonry/masonry"],e):"object"==typeof module&&module.exports?module.exports=e(require("../layout-mode"),require("masonry-layout")):e(t.Isotope.LayoutMode,t.Masonry)}(window,function(t,e){"use strict";var i=t.create("masonry"),n=i.prototype,o={_getElementOffset:!0,layout:!0,_getMeasurement:!0};for(var s in e.prototype)o[s]||(n[s]=e.prototype[s]);var r=n.measureColumns;n.measureColumns=function(){this.items=this.isotope.filteredItems,r.call(this)};var a=n._getOption;return n._getOption=function(t){return"fitWidth"==t?void 0!==this.options.isFitWidth?this.options.isFitWidth:this.options.fitWidth:a.apply(this.isotope,arguments)},i}),function(t,e){"function"==typeof define&&define.amd?define("isotope/js/layout-modes/fit-rows",["../layout-mode"],e):"object"==typeof exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window,function(t){"use strict";var e=t.create("fitRows"),i=e.prototype;return i._resetLayout=function(){this.x=0,this.y=0,this.maxY=0,this._getMeasurement("gutter","outerWidth")},i._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth+this.gutter,i=this.isotope.size.innerWidth+this.gutter;0!==this.x&&e+this.x>i&&(this.x=0,this.y=this.maxY);var n={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+t.size.outerHeight),this.x+=e,n},i._getContainerSize=function(){return{height:this.maxY}},e}),function(t,e){"function"==typeof define&&define.amd?define("isotope/js/layout-modes/vertical",["../layout-mode"],e):"object"==typeof module&&module.exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window,function(t){"use strict";var e=t.create("vertical",{horizontalAlignment:0}),i=e.prototype;return i._resetLayout=function(){this.y=0},i._getItemLayoutPosition=function(t){t.getSize();var e=(this.isotope.size.innerWidth-t.size.outerWidth)*this.options.horizontalAlignment,i=this.y;return this.y+=t.size.outerHeight,{x:e,y:i}},i._getContainerSize=function(){return{height:this.y}},e}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","desandro-matches-selector/matches-selector","fizzy-ui-utils/utils","isotope/js/item","isotope/js/layout-mode","isotope/js/layout-modes/masonry","isotope/js/layout-modes/fit-rows","isotope/js/layout-modes/vertical"],function(i,n,o,s,r,a){return e(t,i,n,o,s,r,a)}):"object"==typeof module&&module.exports?module.exports=e(t,require("outlayer"),require("get-size"),require("desandro-matches-selector"),require("fizzy-ui-utils"),require("isotope/js/item"),require("isotope/js/layout-mode"),require("isotope/js/layout-modes/masonry"),require("isotope/js/layout-modes/fit-rows"),require("isotope/js/layout-modes/vertical")):t.Isotope=e(t,t.Outlayer,t.getSize,t.matchesSelector,t.fizzyUIUtils,t.Isotope.Item,t.Isotope.LayoutMode)}(window,function(t,e,i,n,o,s,r){function a(t,e){return function(i,n){for(var o=0;o<t.length;o++){var s=t[o],r=i.sortData[s],a=n.sortData[s];if(r>a||a>r){var u=void 0!==e[s]?e[s]:e,h=u?1:-1;return(r>a?1:-1)*h}}return 0}}var u=t.jQuery,h=String.prototype.trim?function(t){return t.trim()}:function(t){return t.replace(/^\s+|\s+$/g,"")},d=e.create("isotope",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});d.Item=s,d.LayoutMode=r;var l=d.prototype;l._create=function(){this.itemGUID=0,this._sorters={},this._getSorters(),e.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"];for(var t in r.modes)this._initLayoutMode(t)},l.reloadItems=function(){this.itemGUID=0,e.prototype.reloadItems.call(this)},l._itemize=function(){for(var t=e.prototype._itemize.apply(this,arguments),i=0;i<t.length;i++){var n=t[i];n.id=this.itemGUID++}return this._updateItemsSortData(t),t},l._initLayoutMode=function(t){var e=r.modes[t],i=this.options[t]||{};this.options[t]=e.options?o.extend(e.options,i):i,this.modes[t]=new e(this)},l.layout=function(){return!this._isLayoutInited&&this._getOption("initLayout")?void this.arrange():void this._layout()},l._layout=function(){var t=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,t),this._isLayoutInited=!0},l.arrange=function(t){this.option(t),this._getIsInstant();var e=this._filter(this.items);this.filteredItems=e.matches,this._bindArrangeComplete(),this._isInstant?this._noTransition(this._hideReveal,[e]):this._hideReveal(e),this._sort(),this._layout()},l._init=l.arrange,l._hideReveal=function(t){this.reveal(t.needReveal),this.hide(t.needHide)},l._getIsInstant=function(){var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;return this._isInstant=e,e},l._bindArrangeComplete=function(){function t(){e&&i&&n&&o.dispatchEvent("arrangeComplete",null,[o.filteredItems])}var e,i,n,o=this;this.once("layoutComplete",function(){e=!0,t()}),this.once("hideComplete",function(){i=!0,t()}),this.once("revealComplete",function(){n=!0,t()})},l._filter=function(t){var e=this.options.filter;e=e||"*";for(var i=[],n=[],o=[],s=this._getFilterTest(e),r=0;r<t.length;r++){var a=t[r];if(!a.isIgnored){var u=s(a);u&&i.push(a),u&&a.isHidden?n.push(a):u||a.isHidden||o.push(a)}}return{matches:i,needReveal:n,needHide:o}},l._getFilterTest=function(t){return u&&this.options.isJQueryFiltering?function(e){return u(e.element).is(t)}:"function"==typeof t?function(e){return t(e.element)}:function(e){return n(e.element,t)}},l.updateSortData=function(t){var e;t?(t=o.makeArray(t),e=this.getItems(t)):e=this.items,this._getSorters(),this._updateItemsSortData(e)},l._getSorters=function(){var t=this.options.getSortData;for(var e in t){var i=t[e];this._sorters[e]=f(i)}},l._updateItemsSortData=function(t){for(var e=t&&t.length,i=0;e&&e>i;i++){var n=t[i];n.updateSortData()}};var f=function(){function t(t){if("string"!=typeof t)return t;var i=h(t).split(" "),n=i[0],o=n.match(/^\[(.+)\]$/),s=o&&o[1],r=e(s,n),a=d.sortDataParsers[i[1]];
return t=a?function(t){return t&&a(r(t))}:function(t){return t&&r(t)}}function e(t,e){return t?function(e){return e.getAttribute(t)}:function(t){var i=t.querySelector(e);return i&&i.textContent}}return t}();d.sortDataParsers={parseInt:function(t){return parseInt(t,10)},parseFloat:function(t){return parseFloat(t)}},l._sort=function(){var t=this.options.sortBy;if(t){var e=[].concat.apply(t,this.sortHistory),i=a(e,this.options.sortAscending);this.filteredItems.sort(i),t!=this.sortHistory[0]&&this.sortHistory.unshift(t)}},l._mode=function(){var t=this.options.layoutMode,e=this.modes[t];if(!e)throw new Error("No layout mode: "+t);return e.options=this.options[t],e},l._resetLayout=function(){e.prototype._resetLayout.call(this),this._mode()._resetLayout()},l._getItemLayoutPosition=function(t){return this._mode()._getItemLayoutPosition(t)},l._manageStamp=function(t){this._mode()._manageStamp(t)},l._getContainerSize=function(){return this._mode()._getContainerSize()},l.needsResizeLayout=function(){return this._mode().needsResizeLayout()},l.appended=function(t){var e=this.addItems(t);if(e.length){var i=this._filterRevealAdded(e);this.filteredItems=this.filteredItems.concat(i)}},l.prepended=function(t){var e=this._itemize(t);if(e.length){this._resetLayout(),this._manageStamps();var i=this._filterRevealAdded(e);this.layoutItems(this.filteredItems),this.filteredItems=i.concat(this.filteredItems),this.items=e.concat(this.items)}},l._filterRevealAdded=function(t){var e=this._filter(t);return this.hide(e.needHide),this.reveal(e.matches),this.layoutItems(e.matches,!0),e.matches},l.insert=function(t){var e=this.addItems(t);if(e.length){var i,n,o=e.length;for(i=0;o>i;i++)n=e[i],this.element.appendChild(n.element);var s=this._filter(e).matches;for(i=0;o>i;i++)e[i].isLayoutInstant=!0;for(this.arrange(),i=0;o>i;i++)delete e[i].isLayoutInstant;this.reveal(s)}};var c=l.remove;return l.remove=function(t){t=o.makeArray(t);var e=this.getItems(t);c.call(this,t);for(var i=e&&e.length,n=0;i&&i>n;n++){var s=e[n];o.removeFrom(this.filteredItems,s)}},l.shuffle=function(){for(var t=0;t<this.items.length;t++){var e=this.items[t];e.sortData.random=Math.random()}this.options.sortBy="random",this._sort(),this._layout()},l._noTransition=function(t,e){var i=this.options.transitionDuration;this.options.transitionDuration=0;var n=t.apply(this,e);return this.options.transitionDuration=i,n},l.getFilteredItemElements=function(){return this.filteredItems.map(function(t){return t.element})},d});

/*!
 * Packery layout mode PACKAGED v2.0.0
 * sub-classes Packery
 */

!function(a,b){"function"==typeof define&&define.amd?define("packery/js/rect",b):"object"==typeof module&&module.exports?module.exports=b():(a.Packery=a.Packery||{},a.Packery.Rect=b())}(window,function(){function a(b){for(var c in a.defaults)this[c]=a.defaults[c];for(c in b)this[c]=b[c]}a.defaults={x:0,y:0,width:0,height:0};var b=a.prototype;return b.contains=function(a){var b=a.width||0,c=a.height||0;return this.x<=a.x&&this.y<=a.y&&this.x+this.width>=a.x+b&&this.y+this.height>=a.y+c},b.overlaps=function(a){var b=this.x+this.width,c=this.y+this.height,d=a.x+a.width,e=a.y+a.height;return this.x<d&&b>a.x&&this.y<e&&c>a.y},b.getMaximalFreeRects=function(b){if(!this.overlaps(b))return!1;var c,d=[],e=this.x+this.width,f=this.y+this.height,g=b.x+b.width,h=b.y+b.height;return this.y<b.y&&(c=new a({x:this.x,y:this.y,width:this.width,height:b.y-this.y}),d.push(c)),e>g&&(c=new a({x:g,y:this.y,width:e-g,height:this.height}),d.push(c)),f>h&&(c=new a({x:this.x,y:h,width:this.width,height:f-h}),d.push(c)),this.x<b.x&&(c=new a({x:this.x,y:this.y,width:b.x-this.x,height:this.height}),d.push(c)),d},b.canFit=function(a){return this.width>=a.width&&this.height>=a.height},a}),function(a,b){if("function"==typeof define&&define.amd)define("packery/js/packer",["./rect"],b);else if("object"==typeof module&&module.exports)module.exports=b(require("./rect"));else{var c=a.Packery=a.Packery||{};c.Packer=b(c.Rect)}}(window,function(a){function b(a,b,c){this.width=a||0,this.height=b||0,this.sortDirection=c||"downwardLeftToRight",this.reset()}var c=b.prototype;c.reset=function(){this.spaces=[];var b=new a({x:0,y:0,width:this.width,height:this.height});this.spaces.push(b),this.sorter=d[this.sortDirection]||d.downwardLeftToRight},c.pack=function(a){for(var b=0;b<this.spaces.length;b++){var c=this.spaces[b];if(c.canFit(a)){this.placeInSpace(a,c);break}}},c.columnPack=function(a){for(var b=0;b<this.spaces.length;b++){var c=this.spaces[b],d=c.x<=a.x&&c.x+c.width>=a.x+a.width&&c.height>=a.height-.01;if(d){a.y=c.y,this.placed(a);break}}},c.rowPack=function(a){for(var b=0;b<this.spaces.length;b++){var c=this.spaces[b],d=c.y<=a.y&&c.y+c.height>=a.y+a.height&&c.width>=a.width-.01;if(d){a.x=c.x,this.placed(a);break}}},c.placeInSpace=function(a,b){a.x=b.x,a.y=b.y,this.placed(a)},c.placed=function(a){for(var b=[],c=0;c<this.spaces.length;c++){var d=this.spaces[c],e=d.getMaximalFreeRects(a);e?b.push.apply(b,e):b.push(d)}this.spaces=b,this.mergeSortSpaces()},c.mergeSortSpaces=function(){b.mergeRects(this.spaces),this.spaces.sort(this.sorter)},c.addSpace=function(a){this.spaces.push(a),this.mergeSortSpaces()},b.mergeRects=function(a){var b=0,c=a[b];a:for(;c;){for(var d=0,e=a[b+d];e;){if(e==c)d++;else{if(e.contains(c)){a.splice(b,1),c=a[b];continue a}c.contains(e)?a.splice(b+d,1):d++}e=a[b+d]}b++,c=a[b]}return a};var d={downwardLeftToRight:function(a,b){return a.y-b.y||a.x-b.x},rightwardTopToBottom:function(a,b){return a.x-b.x||a.y-b.y}};return b}),function(a,b){"function"==typeof define&&define.amd?define("packery/js/item",["outlayer/outlayer","./rect"],b):"object"==typeof module&&module.exports?module.exports=b(require("outlayer"),require("./rect")):a.Packery.Item=b(a.Outlayer,a.Packery.Rect)}(window,function(a,b){var c=document.documentElement.style,d="string"==typeof c.transform?"transform":"WebkitTransform",e=function(){a.Item.apply(this,arguments)},f=e.prototype=Object.create(a.Item.prototype),g=f._create;f._create=function(){g.call(this),this.rect=new b};var h=f.moveTo;return f.moveTo=function(a,b){var c=Math.abs(this.position.x-a),d=Math.abs(this.position.y-b),e=this.layout.dragItemCount&&!this.isPlacing&&!this.isTransitioning&&1>c&&1>d;return e?void this.goTo(a,b):void h.apply(this,arguments)},f.enablePlacing=function(){this.removeTransitionStyles(),this.isTransitioning&&d&&(this.element.style[d]="none"),this.isTransitioning=!1,this.getSize(),this.layout._setRectSize(this.element,this.rect),this.isPlacing=!0},f.disablePlacing=function(){this.isPlacing=!1},f.removeElem=function(){this.element.parentNode.removeChild(this.element),this.layout.packer.addSpace(this.rect),this.emitEvent("remove",[this])},f.showDropPlaceholder=function(){var a=this.dropPlaceholder;a||(a=this.dropPlaceholder=document.createElement("div"),a.className="packery-drop-placeholder",a.style.position="absolute"),a.style.width=this.size.width+"px",a.style.height=this.size.height+"px",this.positionDropPlaceholder(),this.layout.element.appendChild(a)},f.positionDropPlaceholder=function(){this.dropPlaceholder.style[d]="translate("+this.rect.x+"px, "+this.rect.y+"px)"},f.hideDropPlaceholder=function(){this.layout.element.removeChild(this.dropPlaceholder)},e}),function(a,b){"function"==typeof define&&define.amd?define("packery/js/packery",["get-size/get-size","outlayer/outlayer","./rect","./packer","./item"],b):"object"==typeof module&&module.exports?module.exports=b(require("get-size"),require("outlayer"),require("./rect"),require("./packer"),require("./item")):a.Packery=b(a.getSize,a.Outlayer,a.Packery.Rect,a.Packery.Packer,a.Packery.Item)}(window,function(a,b,c,d,e){function f(a,b){return a.position.y-b.position.y||a.position.x-b.position.x}function g(a,b){return a.position.x-b.position.x||a.position.y-b.position.y}function h(a,b){var c=b.x-a.x,d=b.y-a.y;return Math.sqrt(c*c+d*d)}c.prototype.canFit=function(a){return this.width>=a.width-1&&this.height>=a.height-1};var i=b.create("packery");i.Item=e;var j=i.prototype;j._create=function(){b.prototype._create.call(this),this.packer=new d,this.shiftPacker=new d,this.isEnabled=!0,this.dragItemCount=0;var a=this;this.handleDraggabilly={dragStart:function(){a.itemDragStart(this.element)},dragMove:function(){a.itemDragMove(this.element,this.position.x,this.position.y)},dragEnd:function(){a.itemDragEnd(this.element)}},this.handleUIDraggable={start:function(b,c){c&&a.itemDragStart(b.currentTarget)},drag:function(b,c){c&&a.itemDragMove(b.currentTarget,c.position.left,c.position.top)},stop:function(b,c){c&&a.itemDragEnd(b.currentTarget)}}},j._resetLayout=function(){this.getSize(),this._getMeasurements();var a,b,c;this._getOption("horizontal")?(a=1/0,b=this.size.innerHeight+this.gutter,c="rightwardTopToBottom"):(a=this.size.innerWidth+this.gutter,b=1/0,c="downwardLeftToRight"),this.packer.width=this.shiftPacker.width=a,this.packer.height=this.shiftPacker.height=b,this.packer.sortDirection=this.shiftPacker.sortDirection=c,this.packer.reset(),this.maxY=0,this.maxX=0},j._getMeasurements=function(){this._getMeasurement("columnWidth","width"),this._getMeasurement("rowHeight","height"),this._getMeasurement("gutter","width")},j._getItemLayoutPosition=function(a){if(this._setRectSize(a.element,a.rect),this.isShifting||this.dragItemCount>0){var b=this._getPackMethod();this.packer[b](a.rect)}else this.packer.pack(a.rect);return this._setMaxXY(a.rect),a.rect},j.shiftLayout=function(){this.isShifting=!0,this.layout(),delete this.isShifting},j._getPackMethod=function(){return this._getOption("horizontal")?"rowPack":"columnPack"},j._setMaxXY=function(a){this.maxX=Math.max(a.x+a.width,this.maxX),this.maxY=Math.max(a.y+a.height,this.maxY)},j._setRectSize=function(b,c){var d=a(b),e=d.outerWidth,f=d.outerHeight;(e||f)&&(e=this._applyGridGutter(e,this.columnWidth),f=this._applyGridGutter(f,this.rowHeight)),c.width=Math.min(e,this.packer.width),c.height=Math.min(f,this.packer.height)},j._applyGridGutter=function(a,b){if(!b)return a+this.gutter;b+=this.gutter;var c=a%b,d=c&&1>c?"round":"ceil";return a=Math[d](a/b)*b},j._getContainerSize=function(){return this._getOption("horizontal")?{width:this.maxX-this.gutter}:{height:this.maxY-this.gutter}},j._manageStamp=function(a){var b,d=this.getItem(a);if(d&&d.isPlacing)b=d.rect;else{var e=this._getElementOffset(a);b=new c({x:this._getOption("originLeft")?e.left:e.right,y:this._getOption("originTop")?e.top:e.bottom})}this._setRectSize(a,b),this.packer.placed(b),this._setMaxXY(b)},j.sortItemsByPosition=function(){var a=this._getOption("horizontal")?g:f;this.items.sort(a)},j.fit=function(a,b,c){var d=this.getItem(a);d&&(this.stamp(d.element),d.enablePlacing(),this.updateShiftTargets(d),b=void 0===b?d.rect.x:b,c=void 0===c?d.rect.y:c,this.shift(d,b,c),this._bindFitEvents(d),d.moveTo(d.rect.x,d.rect.y),this.shiftLayout(),this.unstamp(d.element),this.sortItemsByPosition(),d.disablePlacing())},j._bindFitEvents=function(a){function b(){d++,2==d&&c.dispatchEvent("fitComplete",null,[a])}var c=this,d=0;a.once("layout",b),this.once("layoutComplete",b)},j.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&(this.options.shiftPercentResize?this.resizeShiftPercentLayout():this.layout())},j.needsResizeLayout=function(){var b=a(this.element),c=this._getOption("horizontal")?"innerHeight":"innerWidth";return b[c]!=this.size[c]},j.resizeShiftPercentLayout=function(){var b=this._getItemsForLayout(this.items),c=this._getOption("horizontal"),d=c?"y":"x",e=c?"height":"width",f=c?"rowHeight":"columnWidth",g=c?"innerHeight":"innerWidth",h=this[f];if(h=h&&h+this.gutter){this._getMeasurements();var i=this[f]+this.gutter;b.forEach(function(a){var b=Math.round(a.rect[d]/h);a.rect[d]=b*i})}else{var j=a(this.element)[g]+this.gutter,k=this.packer[e];b.forEach(function(a){a.rect[d]=a.rect[d]/k*j})}this.shiftLayout()},j.itemDragStart=function(a){if(this.isEnabled){this.stamp(a);var b=this.getItem(a);b&&(b.enablePlacing(),b.showDropPlaceholder(),this.dragItemCount++,this.updateShiftTargets(b))}},j.updateShiftTargets=function(a){this.shiftPacker.reset(),this._getBoundingRect();var b=this._getOption("originLeft"),d=this._getOption("originTop");this.stamps.forEach(function(a){var e=this.getItem(a);if(!e||!e.isPlacing){var f=this._getElementOffset(a),g=new c({x:b?f.left:f.right,y:d?f.top:f.bottom});this._setRectSize(a,g),this.shiftPacker.placed(g)}},this);var e=this._getOption("horizontal"),f=e?"rowHeight":"columnWidth",g=e?"height":"width";this.shiftTargetKeys=[],this.shiftTargets=[];var h,i=this[f];if(i=i&&i+this.gutter){var j=Math.ceil(a.rect[g]/i),k=Math.floor((this.shiftPacker[g]+this.gutter)/i);h=(k-j)*i;for(var l=0;k>l;l++)this._addShiftTarget(l*i,0,h)}else h=this.shiftPacker[g]+this.gutter-a.rect[g],this._addShiftTarget(0,0,h);var m=this._getItemsForLayout(this.items),n=this._getPackMethod();m.forEach(function(a){var b=a.rect;this._setRectSize(a.element,b),this.shiftPacker[n](b),this._addShiftTarget(b.x,b.y,h);var c=e?b.x+b.width:b.x,d=e?b.y:b.y+b.height;if(this._addShiftTarget(c,d,h),i)for(var f=Math.round(b[g]/i),j=1;f>j;j++){var k=e?c:b.x+i*j,l=e?b.y+i*j:d;this._addShiftTarget(k,l,h)}},this)},j._addShiftTarget=function(a,b,c){var d=this._getOption("horizontal")?b:a;if(!(0!==d&&d>c)){var e=a+","+b,f=-1!=this.shiftTargetKeys.indexOf(e);f||(this.shiftTargetKeys.push(e),this.shiftTargets.push({x:a,y:b}))}},j.shift=function(a,b,c){var d,e=1/0,f={x:b,y:c};this.shiftTargets.forEach(function(a){var b=h(a,f);e>b&&(d=a,e=b)}),a.rect.x=d.x,a.rect.y=d.y};var k=120;j.itemDragMove=function(a,b,c){function d(){f.shift(e,b,c),e.positionDropPlaceholder(),f.layout()}var e=this.isEnabled&&this.getItem(a);if(e){b-=this.size.paddingLeft,c-=this.size.paddingTop;var f=this,g=new Date;this._itemDragTime&&g-this._itemDragTime<k?(clearTimeout(this.dragTimeout),this.dragTimeout=setTimeout(d,k)):(d(),this._itemDragTime=g)}},j.itemDragEnd=function(a){function b(){d++,2==d&&(c.element.classList.remove("is-positioning-post-drag"),c.hideDropPlaceholder(),e.dispatchEvent("dragItemPositioned",null,[c]))}var c=this.isEnabled&&this.getItem(a);if(c){clearTimeout(this.dragTimeout),c.element.classList.add("is-positioning-post-drag");var d=0,e=this;c.once("layout",b),this.once("layoutComplete",b),c.moveTo(c.rect.x,c.rect.y),this.layout(),this.dragItemCount=Math.max(0,this.dragItemCount-1),this.sortItemsByPosition(),c.disablePlacing(),this.unstamp(c.element)}},j.bindDraggabillyEvents=function(a){this._bindDraggabillyEvents(a,"on")},j.unbindDraggabillyEvents=function(a){this._bindDraggabillyEvents(a,"off")},j._bindDraggabillyEvents=function(a,b){var c=this.handleDraggabilly;a[b]("dragStart",c.dragStart),a[b]("dragMove",c.dragMove),a[b]("dragEnd",c.dragEnd)},j.bindUIDraggableEvents=function(a){this._bindUIDraggableEvents(a,"on")},j.unbindUIDraggableEvents=function(a){this._bindUIDraggableEvents(a,"off")},j._bindUIDraggableEvents=function(a,b){var c=this.handleUIDraggable;a[b]("dragstart",c.start)[b]("drag",c.drag)[b]("dragstop",c.stop)};var l=j.destroy;return j.destroy=function(){l.apply(this,arguments),this.isEnabled=!1},i.Rect=c,i.Packer=d,i}),function(a,b){"function"==typeof define&&define.amd?define(["isotope/js/layout-mode","packery/js/packery"],b):"object"==typeof module&&module.exports?module.exports=b(require("isotope-layout/js/layout-mode"),require("packery")):b(a.Isotope.LayoutMode,a.Packery)}(window,function(a,b){var c=a.create("packery"),d=c.prototype,e={_getElementOffset:!0,_getMeasurement:!0};for(var f in b.prototype)e[f]||(d[f]=b.prototype[f]);var g=d._resetLayout;d._resetLayout=function(){this.packer=this.packer||new b.Packer,this.shiftPacker=this.shiftPacker||new b.Packer,g.apply(this,arguments)};var h=d._getItemLayoutPosition;d._getItemLayoutPosition=function(a){return a.rect=a.rect||new b.Rect,h.call(this,a)};var i=d.needsResizeLayout;d.needsResizeLayout=function(){return this._getOption("horizontal")?this.needsVerticalResizeLayout():i.call(this)};var j=d._getOption;return d._getOption=function(a){return"horizontal"==a?void 0!==this.options.isHorizontal?this.options.isHorizontal:this.options.horizontal:j.apply(this.isotope,arguments)},c});

/**
 * Event.simulate(@element, eventName[, options]) -> Element
 *
 * - @element: element to fire event on
 * - eventName: name of event to fire (only MouseEvents and HTMLEvents interfaces are supported)
 * - options: optional object to fine-tune event properties - pointerX, pointerY, ctrlKey, etc.
 *
 * $('foo').simulate('click'); // => fires "click" event on an element with id=foo
 *
 **/
(function(){

    var eventMatchers = {
        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
        'MouseEvents': /^(?:click|mouse(?:down|up|over|move|out))$/
    }
    var defaultOptions = {
        pointerX: 0,
        pointerY: 0,
        button: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        bubbles: true,
        cancelable: true
    }

    Event.simulate = function(element, eventName) {
        var options = Object.extend(defaultOptions, arguments[2] || { });
        var oEvent, eventType = null;

        element = $(element);

        for (var name in eventMatchers) {
            if (eventMatchers[name].test(eventName)) { eventType = name; break; }
        }

        if (!eventType)
            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

        if (document.createEvent) {
            oEvent = document.createEvent(eventType);
            if (eventType == 'HTMLEvents') {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            }
            else {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                    options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                    options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            }
            element.dispatchEvent(oEvent);
        }
        else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            oEvent = Object.extend(document.createEventObject(), options);
            element.fireEvent('on' + eventName, oEvent);
        }
        return element;
    }

    Element.addMethods({ simulate: Event.simulate });
})();

/*! echo.js v1.7.0 | (c) 2015 @toddmotto | https://github.com/toddmotto/echo */
!function(t,e){"function"==typeof define&&define.amd?define(function(){return e(t)}):"object"==typeof exports?module.exports=e:t.echo=e(t)}(this,function(t){"use strict";var e,n,o,r,c,a={},u=function(){},d=function(t){return null===t.offsetParent},i=function(t,e){if(d(t))return!1;var n=t.getBoundingClientRect();return n.right>=e.l&&n.bottom>=e.t&&n.left<=e.r&&n.top<=e.b},l=function(){(r||!n)&&(clearTimeout(n),n=setTimeout(function(){a.render(),n=null},o))};return a.init=function(n){n=n||{};var d=n.offset||0,i=n.offsetVertical||d,f=n.offsetHorizontal||d,s=function(t,e){return parseInt(t||e,10)};e={t:s(n.offsetTop,i),b:s(n.offsetBottom,i),l:s(n.offsetLeft,f),r:s(n.offsetRight,f)},o=s(n.throttle,250),r=n.debounce!==!1,c=!!n.unload,u=n.callback||u,a.render(),document.addEventListener?(t.addEventListener("scroll",l,!1),t.addEventListener("load",l,!1)):(t.attachEvent("onscroll",l),t.attachEvent("onload",l))},a.render=function(){for(var n,o,r=document.querySelectorAll("img[data-echo], [data-echo-background]"),d=r.length,l={l:0-e.l,t:0-e.t,b:(t.innerHeight||document.documentElement.clientHeight)+e.b,r:(t.innerWidth||document.documentElement.clientWidth)+e.r},f=0;d>f;f++)o=r[f],i(o,l)?(c&&o.setAttribute("data-echo-placeholder",o.src),null!==o.getAttribute("data-echo-background")?o.style.backgroundImage="url("+o.getAttribute("data-echo-background")+")":o.src=o.getAttribute("data-echo"),c||(o.removeAttribute("data-echo"),o.removeAttribute("data-echo-background")),u(o,"load")):c&&(n=o.getAttribute("data-echo-placeholder"))&&(null!==o.getAttribute("data-echo-background")?o.style.backgroundImage="url("+n+")":o.src=n,o.removeAttribute("data-echo-placeholder"),u(o,"unload"));d||a.detach()},a.detach=function(){document.removeEventListener?t.removeEventListener("scroll",l):t.detachEvent("onscroll",l),clearTimeout(n)},a});

/*!
 * imagesLoaded PACKAGED v3.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
(function(){function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,o=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=o,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var o={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",o):e.eventie=o}(this),function(e,t){"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof exports?module.exports=t(e,require("eventEmitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(this,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"===d.call(e)}function o(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0,i=e.length;i>n;n++)t.push(e[n]);else t.push(e);return t}function s(e,t,n){if(!(this instanceof s))return new s(e,t);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=o(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),a&&(this.jqDeferred=new a.Deferred);var r=this;setTimeout(function(){r.check()})}function c(e){this.img=e}function f(e){this.src=e,v[e]=this}var a=e.jQuery,u=e.console,h=u!==void 0,d=Object.prototype.toString;s.prototype=new t,s.prototype.options={},s.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);for(var i=n.querySelectorAll("img"),r=0,o=i.length;o>r;r++){var s=i[r];this.addImage(s)}}},s.prototype.addImage=function(e){var t=new c(e);this.images.push(t)},s.prototype.check=function(){function e(e,r){return t.options.debug&&h&&u.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},s.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify&&t.jqDeferred.notify(t,e)})},s.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},a&&(a.fn.imagesLoaded=function(e,t){var n=new s(this,e,t);return n.jqDeferred.promise(a(this))}),c.prototype=new t,c.prototype.check=function(){var e=v[this.img.src]||new f(this.img.src);if(e.isConfirmed)return this.confirm(e.isLoaded,"cached was confirmed"),void 0;if(this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this;e.on("confirm",function(e,n){return t.confirm(e.isLoaded,n),!0}),e.check()},c.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("confirm",this,t)};var v={};return f.prototype=new t,f.prototype.check=function(){if(!this.isChecked){var e=new Image;n.bind(e,"load",this),n.bind(e,"error",this),e.src=this.src,this.isChecked=!0}},f.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},f.prototype.onload=function(e){this.confirm(!0,"onload"),this.unbindProxyEvents(e)},f.prototype.onerror=function(e){this.confirm(!1,"onerror"),this.unbindProxyEvents(e)},f.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},f.prototype.unbindProxyEvents=function(e){n.unbind(e.target,"load",this),n.unbind(e.target,"error",this)},s});

// Pointer abstraction
/**
 * This class provides an easy and abstracted mechanism to determine the
 * best pointer behavior to use -- that is, is the user currently interacting
 * with their device in a touch manner, or using a mouse.
 *
 * Since devices may use either touch or mouse or both, there is no way to
 * know the user's preferred pointer type until they interact with the site.
 *
 * To accommodate this, this class provides a method and two events
 * to determine the user's preferred pointer type.
 *
 * - getPointer() returns the last used pointer type, or, if the user has
 *   not yet interacted with the site, falls back to a Modernizr test.
 *
 * - The mouse-detected event is triggered on the window object when the user
 *   is using a mouse pointer input, or has switched from touch to mouse input.
 *   It can be observed in this manner: $j(window).on('mouse-detected', function(event) { // custom code });
 *
 * - The touch-detected event is triggered on the window object when the user
 *   is using touch pointer input, or has switched from mouse to touch input.
 *   It can be observed in this manner: $j(window).on('touch-detected', function(event) { // custom code });
 */
var PointerManager = {
    MOUSE_POINTER_TYPE: 'mouse',
    TOUCH_POINTER_TYPE: 'touch',
    POINTER_EVENT_TIMEOUT_MS: 500,
    standardTouch: false,
    touchDetectionEvent: null,
    lastTouchType: null,
    pointerTimeout: null,
    pointerEventLock: false,

    getPointerEventsSupported: function() {
        return this.standardTouch;
    },

    getPointerEventsInputTypes: function() {
        if (window.navigator.pointerEnabled) { //IE 11+
            //return string values from http://msdn.microsoft.com/en-us/library/windows/apps/hh466130.aspx
            return {
                MOUSE: 'mouse',
                TOUCH: 'touch',
                PEN: 'pen'
            };
        } else if (window.navigator.msPointerEnabled) { //IE 10
            //return numeric values from http://msdn.microsoft.com/en-us/library/windows/apps/hh466130.aspx
            return {
                MOUSE:  0x00000004,
                TOUCH:  0x00000002,
                PEN:    0x00000003
            };
        } else { //other browsers don't support pointer events
            return {}; //return empty object
        }
    },

    /**
     * If called before init(), get best guess of input pointer type
     * using Modernizr test.
     * If called after init(), get current pointer in use.
     */
    getPointer: function() {
        // On iOS devices, always default to touch, as this.lastTouchType will intermittently return 'mouse' if
        // multiple touches are triggered in rapid succession in Safari on iOS
        if(Modernizr.ios) {
            return this.TOUCH_POINTER_TYPE;
        }

        if(this.lastTouchType) {
            return this.lastTouchType;
        }

        return Modernizr.touch ? this.TOUCH_POINTER_TYPE : this.MOUSE_POINTER_TYPE;
    },

    setPointerEventLock: function() {
        this.pointerEventLock = true;
    },
    clearPointerEventLock: function() {
        this.pointerEventLock = false;
    },
    setPointerEventLockTimeout: function() {
        var that = this;

        if(this.pointerTimeout) {
            clearTimeout(this.pointerTimeout);
        }

        this.setPointerEventLock();
        this.pointerTimeout = setTimeout(function() { that.clearPointerEventLock(); }, this.POINTER_EVENT_TIMEOUT_MS);
    },

    triggerMouseEvent: function(originalEvent) {
        if(this.lastTouchType == this.MOUSE_POINTER_TYPE) {
            return; //prevent duplicate events
        }

        this.lastTouchType = this.MOUSE_POINTER_TYPE;
        $j(window).trigger('mouse-detected', originalEvent);
    },
    triggerTouchEvent: function(originalEvent) {
        if(this.lastTouchType == this.TOUCH_POINTER_TYPE) {
            return; //prevent duplicate events
        }

        this.lastTouchType = this.TOUCH_POINTER_TYPE;
        $j(window).trigger('touch-detected', originalEvent);
    },

    initEnv: function() {
        if (window.navigator.pointerEnabled) {
            this.standardTouch = true;
            this.touchDetectionEvent = 'pointermove';
        } else if (window.navigator.msPointerEnabled) {
            this.standardTouch = true;
            this.touchDetectionEvent = 'MSPointerMove';
        } else {
            this.touchDetectionEvent = 'touchstart';
        }
    },

    wirePointerDetection: function() {
        var that = this;

        if(this.standardTouch) { //standard-based touch events. Wire only one event.
            //detect pointer event
            $j(window).on(this.touchDetectionEvent, function(e) {
                switch(e.originalEvent.pointerType) {
                    case that.getPointerEventsInputTypes().MOUSE:
                        that.triggerMouseEvent(e);
                        break;
                    case that.getPointerEventsInputTypes().TOUCH:
                    case that.getPointerEventsInputTypes().PEN:
                        // intentionally group pen and touch together
                        that.triggerTouchEvent(e);
                        break;
                }
            });
        } else { //non-standard touch events. Wire touch and mouse competing events.
            //detect first touch
            $j(window).on(this.touchDetectionEvent, function(e) {
                if(that.pointerEventLock) {
                    return;
                }

                that.setPointerEventLockTimeout();
                that.triggerTouchEvent(e);
            });

            //detect mouse usage
            $j(document).on('mouseover', function(e) {
                if(that.pointerEventLock) {
                    return;
                }

                that.setPointerEventLockTimeout();
                that.triggerMouseEvent(e);
            });
        }
    },

    init: function() {
        this.initEnv();
        this.wirePointerDetection();
    }
};

/*!
 * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
(function($){$.fn.hoverIntent=function(handlerIn,handlerOut,selector){var cfg={interval:100,sensitivity:6,timeout:0};if(typeof handlerIn==="object"){cfg=$.extend(cfg,handlerIn)}else{if($.isFunction(handlerOut)){cfg=$.extend(cfg,{over:handlerIn,out:handlerOut,selector:selector})}else{cfg=$.extend(cfg,{over:handlerIn,out:handlerIn,selector:handlerOut})}}var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if(Math.sqrt((pX-cX)*(pX-cX)+(pY-cY)*(pY-cY))<cfg.sensitivity){$(ob).off("mousemove.hoverIntent",track);ob.hoverIntent_s=true;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=false;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=$.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type==="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).on("mousemove.hoverIntent",track);if(!ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).off("mousemove.hoverIntent",track);if(ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.on({"mouseenter.hoverIntent":handleHover,"mouseleave.hoverIntent":handleHover},cfg.selector)}})(jQuery);

/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);
