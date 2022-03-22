// JavaScript Document
var paneIntervalID;
var interval_captcha_js;
var interval_update_captcha_js;
var clickedViewArtFromModal = false; 
var opened_time = 1;

var ajaxFormOption = {
    complete: function (xhr)
    {
        if (xhr.status == 200)
        {
            if(xhr.responseText.match(/^err_captcha\:/))
            {
				$('.widget_modal').show();
                $('div.loading_block').hide();
                $('#g_widget_butt_submit').show();
                $('#g_widget_butt_submit_spin').hide();
                // $('.reg_captha').togglePopup('','#popup_captcha');
                // $('.captcha_img').trigger('click');
                //
                // $('#capcha_code').addClass('error-fld');
                // $('.reg_captha').removeClass('_off')
                // $('#widget_captcha_code').val('');
                $('form input[name=captcha_key]').val('');
                $('.modal_foot').hide();
				$('.modal_foot.with-captcha').show();
				
				// $('.js_sp_widget_captcha_content').html(xhr.responseText.replace(/^err_captcha\:/,''))
				// обновим капчу
				xajax_UpdateCaptchaKey();

                $(".js-trigger_submit_btn").find('i').show();
                $(".js-trigger_submit_btn").find('span').hide();
                $('.modal_foot.with-captcha .captcha_response').val('1');
				


                $('.text_terms').length ? $('.text_terms').addClass('with-captcha') : null;
            }
            else
            {
                window.location = xhr.responseText;
            }
        }
    }
};
$(document).ready(function(){
	InitCfDatepickers(true);
	
	// Internet Explorer 6-11
	var isIE = /*@cc_on!@*/false || !!document.documentMode;

	// Edge 20+
	var isEdge = !isIE && !!window.StyleMedia || navigator.userAgent.indexOf(' Edge/') >= 0;

	// Chrome 1 - 79
	var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

	// Edge (based on chromium) detection
	var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

	if (isIE) {
		$('body').addClass('ie');
	} else if(isEdge || isEdgeChromium) {
		$('body').addClass('edge');
	}
	
});

(function($){

	$(function(){
		if($(document).iCheck)
		{
			$('input[type="checkbox"]').iCheck({
				checkboxClass: 'icheckbox_square-blue',
				increaseArea: '20%'
			});
		}
		if($(document).dotdotdot)
		{
			$('.widget_modal .search_results p').dotdotdot({ellipsis: ' ...'});
			$('.widget_articles .recommended ul li a p').dotdotdot({ellipsis: ' ...'});
			$('.widget_articles .results_search ul li a p').dotdotdot({ellipsis: ' ...'});
		}
		if($(document).nanoScroller)
		{
			$('.show_article_inner.nano').nanoScroller({alwaysVisible: true});
			$('.results_search.nano').nanoScroller({alwaysVisible: true});
			$('.modal_content.nano').nanoScroller({alwaysVisible: true});
			$('.recommended.nano').nanoScroller({alwaysVisible: true});
		}
		//$('.widget_articles .recommended ul li a p').trigger("update");
	});

	$(function(){

		$(window).on('resize', function() {
            refreshWidget();
			if($(this).width() == 0 && $(this).height() == 0)
			{
				return;
			}
            modifyWidgetWindow()
		});

		var intervalID = setInterval (function(){
			if ($('.recommended').is(':visible')) {
				$('.widget_articles .recommended ul li a p').trigger("update");
				clearInterval(intervalID);
			}
		}, 200);
	});


/* Modal window settings */
// generates input & textarea fields
	var fieldPosition = -1, contentInnerHeightWTOld = 0;
	$(function(){
		var intervalID = '';
		if($(document).autosize)
		{
			$('.widget_modal .field textarea').autosize({
				append: '',
				resizeDelay: false
			});
		}
		$(document).on('click', '.widget_modal .field', function(e) {
			$(this).siblings().removeClass('editing');
			if (($(e.target).is('p'))||($(e.target).is('li'))) {
				$(this).addClass('editing');
				if ($(this).children('input').length && !$(this).children('input').is(':focus')) {
					$(this).children('input').show().focus();
					countPosition ($(this).children('input'));

					$(this).find('.form-item').length && $(this).hasClass('active') ? $(this).children('p').show() : $(this).children('p').hide()
				}
				if ($(this).children('textarea').length) {
					$(this).children('textarea').show().focus();
					$(this).find('.form-item').length && $(this).hasClass('active') ? $(this).children('p').show() : $(this).children('p').hide()
					countPosition ($(this).children('textarea'));
				}
			}
			if($(e.target).parents('.field').data('type') == "select" || $(this).parents('.field').data('type') == "select") {
				$(e.target).parents('.field').find(".department").select2('open');
			}
		});
		$(document).on('focusin', '.widget_modal .field input,.widget_modal .field textarea', function(e) {
			li = $(this).parent();
			$(li).siblings().removeClass('editing');
			$(li).addClass('editing');
			if ($(li).children('input').length) {
				// $(li).children('input').show().focus();
				// countPosition ($(li).children('input'));
				$(this).hasClass('form-item') && $(this).parent('.field').hasClass('active') ? $(this).children('p').show() : $(this).children('p').hide()
				$(this).prev('p').removeClass('red_field');
				$(this).css('color', '#000');
			}
			if ($(li).children('textarea').length) {
				// $(li).children('textarea').show().focus();
				$(this).hasClass('form-item') && $(this).parent('.field').hasClass('active') ? $(this).children('p').show() : $(this).children('p').hide()
				// countPosition ($(li).children('textarea'));
				$(this).prev('p').removeClass('red_field');
			}
		});
		$(document).on('click', '.widget_modal .field a', function() {
			var element = $(this).parents('.field').find('input');
			if ($.trim($(element).val()) == ''){
				$(element).hide();
				$(element).prev('p').show();
				if ($(element).parent().hasClass('required')) $(element).prev('p').addClass('red_field').css('opacity', '1');
			}
		});
		$(document).on('click', function(e) {
			if (!$(e.target).closest('.field').length) {
				$('.widget_modal .field').siblings().removeClass('editing');
			}
		});
		$(document).on('click', '#w_link_knowledge_res', function() {
			var str = $('input[name=request]').val();
			$(this).attr('href',domain+'/knowledge_base/?search='+str);

			return true;
		});
		$(document).on('focusout', '.widget_modal .field input', function(e) {
			var element = $(this);
			setTimeout (function(){
				// if ($(element).parents().hasClass('editing')) {
				// 	e.preventDefault();
				// } else {
					if ($.trim($(element).val()) == '') {
						// $(element).hide();
						$(element).prev('p').show();
						// if ($(element).parent().hasClass('required')) $(element).prev('p').addClass('red_field').css('opacity', '1');
					} else {
						// if ($(element).attr('name') == 'field_user_email') validateEmail($(element).val(), $(element));
					}
				// }
			}, 200);
		});
		$(document).on('focusout', '.widget_modal .field textarea', function(e) {
			var element = $(this);
			setTimeout (function(){
				// if ($(element).parents().hasClass('editing')) {
				// 	e.preventDefault();
				// } else {
					if ($.trim($(element).val()) == '') {
						// $(element).hide();
						$(element).prev('p').show();
						// if ($(element).parent().hasClass('required')) $(element).prev('p').addClass('red_field').css('opacity', '1');
					}
				// }
			}, 200);

		});

		// $(document).on('keyup', function(e) {
		// 	if (e.keyCode == 9) {
		// 		if ($('.modal_content_inner input[type=text], .modal_content_inner textarea').eq(fieldPosition + 1).prev('p').is(':hidden')) fieldPosition++;
		// 		if ($('.modal_content_inner input[type=text]:hidden').eq(fieldPosition + 1).attr('name') == 'request') fieldPosition++;
		// 		$('.modal_content_inner input[type=text], .modal_content_inner textarea').eq(fieldPosition + 1).prev('p').hide();
		// 		$('.modal_content_inner input[type=text], .modal_content_inner textarea').eq(fieldPosition + 1).show().focus();
		// 		fieldPosition++;
		// 	}
		// });

		$('#widget_content').resize(function() {
			//setScroll();
			$('.nano').nanoScroller();
		});
        $(document).on('click','#popup_captcha input[type=button]',function () {
            $('.reg_captha').togglePopup('','#popup_captcha');
            $('#capcha_code').removeClass('error-fld');
            $('#widget_captcha_code').val($('#capcha_code').val());
            $('#g_widget_butt_submit').hide();
            $('#g_widget_butt_submit_spin').show();
            // $('#widget_modal_form_id').trigger('submit')
            $('form input[name=captcha_key]').val('');


            if($('#widget_modal_form_id').ajaxForm)
            {
                $('#widget_modal_form_id').ajaxSubmit(ajaxFormOption);
            }
        });
    });

function countPosition(elem) {
	$('.modal_content_inner input[type=text], .modal_content_inner textarea').each(function(index, element) {
        if ($(element).attr('name') == $(elem).attr('name')) {
			fieldPosition = (index);
		}
    });
}

// modal window buttons
	$(function(){
		$(document).on('click', '.widget_modal h4 i', function() {
			refreshWidget();
			closeWidget();
			//window.parent.document.querySelector('iframe[src="win_modal.html"]').style.display='none';
		});
		$(document).on('click', '.win_success h3 i', function() {
			refreshWidget('success');
			closeWidget();
			//window.parent.document.querySelector('iframe[src="win_modal.html"]').style.display='none';
		});
		$(document).on('click', 'body', function(e) {
			e = e || window.event;
			target = e.target || e.srcElement;

	        if (target.tagName == "BODY") {
				if ($('.win_success').is(':visible')) {
					refreshWidget('success');
				} else {
					refreshWidget();
				}
				closeWidget();
				//window.parent.document.querySelector('iframe[src="win_modal.html"]').style.display='none';
	        }
		});
		$(document).on('ifChecked', '.widget_modal input[type="checkbox"]', function() {
			$(this).parents('label').find('span').removeClass('red_field').css('opacity', '1');
		});
		$(document).on('ifUnchecked', '.widget_modal input[type="checkbox"]', function() {
			$(this).parents('label').find('span').css('opacity', '0.5');
		});
		$(document).on('submit', '.widget_modal form[name="widget_modal_form"]', function() {
			var formErrors = 'no';
			$('.modal_content_inner .required input[type=text], .modal_content_inner .required textarea').each(function(index, element) {
				if ($.trim($(element).val()) == '') {
					// $(element).hide();
					$(this).prev('p').addClass('red_field').css('opacity', '1').show();
					if ($(element).attr('name') != 'request') formErrors = 'yes';
				}
				if ($(element).attr('name') == 'field_user_email')
				{
					if(!validateEmail($(element).val(), $(element)))
					{
						formErrors = 'yes';
					}

				}
				if ($(element).attr('name') == 'field_phone')
				{
					if(!validatePhone($(element).val(), $(element)))
					{
						formErrors = 'yes';
					}

				}
			});
			
			$('.modal_content_inner .required:visible select').each(function(index, element) {
				if (!$(element).val()) {
					$(this).parent().find('span.select2-selection__placeholder').addClass('red_field');
					formErrors = 'yes';
				} 
			});


			$('.widget_modal .required input[type="checkbox"]').each(function(index, element) {
				if (!$(element).parent().hasClass('checked')) {
					$(this).parents('label').find('span').addClass('red_field').css('opacity', '1');
					formErrors = 'yes';
				}
			});

			if (formErrors == 'no') {
				let btnW = $("#g_widget_butt_submit").outerWidth()
				
				$('#g_widget_butt_submit').hide();

				// $("#g_widget_butt_submit_spin").css('width', btnW);
                $('#g_widget_butt_submit_spin').show();

                YaTarget('user_sent_request');

                if($('.reg_captha').length && (!$('.reg_captha').hasClass('_off') || !$('form input[name=captcha_key]').val().length) )
                {
                    // $('.reg_captha').togglePopup('', '#popup_captcha');
                    // $('#popup_captcha').find('.captcha_img')[0].src += Date.now();
                    $('.modal_foot').hide();
                    $('.modal_foot.with-captcha').show();
                    $('.modal_foot.with-captcha .captcha_response').val('1');

                    $('.text_terms').length ? $('.text_terms').addClass('with-captcha') : null;
                    return false;
                }
                else
                {
                    if($('#widget_modal_form_id').ajaxForm)
                    {
                        $('#widget_modal_form_id').ajaxSubmit(ajaxFormOption);
                        return false;
                    }

				}
                return true;

			}
			return false;
		});

	});

// validates e-mail field
	function validateEmail(value, element) {
		var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var res = reg.test(value);
		(res == false && value.length) ? $(element).css('color', '#f00') : $(element).css('color', '#000');
		return res;
	}

// validates phone field
	function validatePhone(value, element) {
		var reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im; 
		var res = reg.test(value);
		(res == false && value.length) ? $(element).css('color', '#f00') : $(element).css('color', '#000');
		return res;
	}

// searching field events
	var enterAble = 'off', enterAbleRes = 'off';
	$(function(){
		$(document).on('click', '.widget_modal .kb_search', function(e) {
			e.preventDefault();
			searchFirstState ();
		});

		$(document).on('keyup', '.widget_modal input[name="field_subject"]', function(e) {
			var letters_num = $(this).val().length;
			if (letters_num >= 3 && $(this).val().trim().length) {
				$('.widget_modal .kb_search').show();
				if ($(window).width() <= 1080) {
					$('.widget_modal input[name="field_subject"]').css("width", "50%");
                    $('.search_view input[name="request"]').css("width", "50%");
				}
			} else {
				$('.widget_modal .kb_search').hide();
                if ($(window).width() <= 1080) {
                    $('.widget_modal input[name="field_subject"]').css("width", "360px");
                    $('.search_view input[name="request"]').css("width", "360px");
                }
			}
		});

		function searchFirstState () {
			if ($('.widget_modal .kb_search').prev().val().trim().length) {
				var currentsubject = $('.widget_modal .kb_search').prev().val().trim();
					$('.widget_modal .kb_search').prev().val(currentsubject)
				// if(!$('.widget_modal .kb_search').parent('.field').hasClass('active')) {
					$('.widget_modal .kb_search').parent('.field').children().hide() ;
				// 	$('.widget_modal .kb_search').parent('.field').children('p').show();
				// } else {
				// 	$('.widget_modal .kb_search').parent('.field').children().hide() 
				// }
				$('.widget_modal .kb_search').parent('.field').children('p').show();
				$('.widget_modal .kb_search').next().show();
				$('.widget_modal .kb_search').next().find('input[name="request"]').val(currentsubject);
				xajax_FindArticles(widget_code,currentsubject,'form');
			}
		}

		$(document).on('click', '.widget_modal .search_view .fa-search', function() {
			searchSecondState();
		});

		function searchSecondState() {
			if ($(this).next().val() != '') {
				var currentsubject = $('.widget_modal .search_view input').val();
				$('.widget_modal .search_view').find('.fa-spinner').show();
				$('.widget_modal .search_view').find('.nothing').hide();
				$('.widget_modal .search_view').find('.fa-times').hide();
				$('.widget_modal .search_results').hide();
				//setScroll();
				$('.nano').nanoScroller();
				xajax_FindArticles(widget_code,currentsubject,'form');
			}
		}
		
		$(document).on('click', '.widget_modal .search_view .fa-times', function() {
			var parentHeight = $('.widget_modal .search_results').outerHeight();
			if ($('.widget_modal .search_results').is(':visible')) {
				var oldPosition = $('.modal_content_inner').position().top;
				if ((oldPosition + parentHeight) < 0) {
					$('.modal_content_inner').css('top', (oldPosition + parentHeight)  + 'px');
				} else {
					$('.modal_content_inner').css('top', '0');
				}
			}
			$('.widget_modal .search_view .fa-times').hide();
			$('.widget_modal .search_view .nothing').hide();
			$('.widget_modal .search_view .fa-spinner').css('display', 'inline-block');
			$('.widget_modal .search_results').hide();
			$(this).parents('.field').children().show();
			$(this).parent().hide();
			$(this).parents('.field').children('p').removeClass('red_field');
			$(this).parents('.field').children('input').focus();
			//setScroll();
			$('.nano').nanoScroller();
		});

		$(document).on('keyup keypress', function(e) {
			if (((e.keyCode == 13)&&(enterAble == 'on'))||((e.keyCode == 13)&&(enterAbleRes == 'on'))) {
				e.preventDefault();
			}
		});

		$(document).on('keyup', function(e) {
			if (e.keyCode == 13) {
				if (enterAble == 'on') {
					searchFirstState ();
				}
				if (enterAbleRes == 'on') {
					searchSecondState ();
				}
			}
		});

		$(document).on('focusin', 'input[name=field_subject]', function(e) {
			enterAble = 'on';
		});

		$(document).on('focusout', 'input[name=field_subject]', function(e) {
			enterAble = 'off';
		});

		$(document).on('focusin', 'input[name=request]', function(e) {
			enterAbleRes = 'on';
		});

		$(document).on('focusout', 'input[name=request]', function(e) {
			enterAbleRes = 'off';
		});

	});
	var isYandex = navigator.userAgent.indexOf(' YaBrowser/') >= 0;
// department field events
	$(function(){
		if($(document).select2)
		{
			$(".department").select2({
				minimumResultsForSearch: Infinity,
				//placeholder: "Департамент",
				width: '600px'
			});

			$(".department").on('select2:open', function ()
			{
				var left = $('.widget_modal').offset().left;
				setTimeout(function ()
				{
					if ($('.select2-dropdown--below').length) {
						isYandex ? $('.select2-dropdown').css('left', 0.5) : $('.select2-dropdown').css('left', 0);
					} else if ($('.select2-dropdown--above').length) {
						$('.select2-dropdown').css('left', left + "px");  
					}
				}, 1);

				var oldPosition = $('.select2-container:last').position().top;
				var fieldPosition = $(this).position().top;
				setTimeout(function ()
				{
					var dropHeight = $('.select2-container:last .select2-dropdown').height();
					var diffHeight = (367 - 42 - dropHeight);
					var newPosition = oldPosition - (dropHeight + 42);
					if (fieldPosition > diffHeight)
					{
						$('.select2-container:last').css('top', newPosition + 'px');
					}
					// $('.modal_content .nano-content').css('overflow', 'hidden');  
					// $('.modal_content.nano').nanoScroller({ destroy: true });
					InputSelectNano();
				}, 10);
			});
			$('.department').on('select2:closing', function (e) {
				// $('.modal_content.nano').nanoScroller({alwaysVisible: true});

				// PaneVisibility();
				// $('.modal_content .nano-content').css('overflow-y', 'scroll');    
				// console.log('adasasdasdasda');
			});
			StarSelect();
		}
		setTimeout(function ()
		{
			$('.modal_content_inner .required select').each(function(index, element) {
				if (!$(element).val()) {
					var t = $(this).parent().find('span.select2-selection__placeholder').html();
					if(t.match(/\*$/))
					{
						$(this).parent().find('span.select2-selection__placeholder').html(t.replace(/\*$/,'<span>*</span>'));
					}
				}
			});

		}, 600);
		/*$(document).on('click', '.widget_modal .drop_list', function() {
			var contHeight = $(this).parents('.modal_content').height();
			var position = $(this).position().top + $(this).outerHeight() + $('.modal_content_inner').position().top;
			var dropListHeight = $(this).find('.drop_list_items').height();
			if ((position + dropListHeight) > contHeight) {
				$(this).find('.drop_list_items').css({'bottom': '41px', 'top': 'auto', 'border-bottom': 'none', 'border-top': border}).slideToggle(300);
				$(this).find('i').removeClass('fa-sort-desc').addClass('fa-sort-asc').css('margin-top', '6px');
			} else {
				$(this).find('.drop_list_items').css({'bottom': 'auto', 'top': '41px', 'border-bottom': border, 'border-top': 'none'}).slideToggle(300);
				$(this).find('i').removeClass('fa-sort-asc').addClass('fa-sort-desc').css('margin-top', '0');
			}
		});
		$(document).on('click', '.widget_modal .drop_list_items span', function() {
			var newValue = $(this).text();
			$(this).parents('.field').find('p').text(newValue).css('opacity', '1');
		});
		$(document).on('click', function(e) {
			//if (!($(e.target).closest('.drop_list').length)) $('.drop_list_items').hide(300);
		});*/
	});

// adding files
	$(function(){
		$(document).on('change', 'label.add_files input:not(.jshide)', function() {
			var file = $(this);
            for(var i in file[0].files)
			{
				if(!file[0].files[i]['name'] || i === 'item')
					continue;
				var fileName = file[0].files[i]['name'];

				if ($('.modal_content_inner ul .added_file').length <= 5)
				{
					//$('.modal_content_inner ul').append('<li class="added_file"><p>' + fileName + '<i class="fa fa-times"></i></p></li>');
                    
					var newField = $('.modal_content_inner ul').find('.added_file.hidden_file').clone(true, true);
					$('.modal_content_inner ul').append(newField);
					var newVisField = $('.modal_content_inner ul .added_file.hidden_file:last');
					$(newVisField).find('span').text(fileName);
					$(newVisField).removeClass('hidden_file');
					//setScroll();
					updateContentField();
					$('.nano').nanoScroller();
				}
				else
				{
					$('input[name=deletes_files]').val($('input[name=deletes_files]').val()+';'+fileName)
				}
				setTimeout(function() {
					$('.modal_content.nano').nanoScroller({scroll: 'bottom'});
					updateWidgetModal();
				}, 1);
			}
			$(this).parent().append($(this).clone().val(''));
			$(this).addClass('jshide').hide();
			$(this).parent().parent().append($(this));
			
			// обновим капчу
			xajax_UpdateCaptchaKey();
		});
		$(document).on('click', '.widget_modal .added_file .fa-times', function() {
			var parentHeight = $(this).parents('li').outerHeight();
			var name = $(this).parents('li').find('span').text();
			$('input[name=deletes_files]').val($('input[name=deletes_files]').val()+';'+name);
			
			//var file = $(".add_files input");
			//for(var i in file[0].files)
			//{
			//	if(file[0].files[i]['name'] == name)
			//		delete file[0].files[i];
			//	console.log(i,':',file[0].files[i]);
			//}
            //

			$(this).parents('li').remove();




			// if ($('.scroll_wrap').is(':visible')) {
			// 	var oldPosition = $('.modal_content_inner').position().top;
			// 	$('.modal_content_inner').css('top', (oldPosition + parentHeight)  + 'px');
			// }
			//setScroll();
			updateContentField();
			// updateWidgetModal()
			$('.nano').nanoScroller();
			setTimeout(function() {
				updateWidgetModal();
			}, 1);
		});
	});


/* settings for first part */

	// base settings
	$(function(){
		modal_centering ('.widget_articles');
	});


	// transitions	
	$(function(){
		$('.widget_articles .recommended ul li a').on('click', function() {
		});		

		$('.results_footer .article_back, .modal_foot .back_link a').on('click', function() {
			var back_link = $(this).attr('data-back');

			if (back_link == '.widget_articles .show_article') {
				if($('#w_article_title').html().length < 2) {
                    back_link = '.widget_articles .recommended';
				} else {
					viewArticle('search_form',null)
                }
			}
			if (back_link == '.widget_articles .recommended') {
				$('.widget_modal').hide();
				$('.widget_articles .search_panel .fa-times').trigger('click');
				$('.widget_articles').show();
				$('.widget_articles .search_panel').show();
				$('.widget_articles .recommended').show();
				$('.widget_articles .show_article').hide();
				$('.widget_articles .results_footer').hide();
                $('.widget_articles .results_search').hide();
				modal_centering ('.widget_articles');
			}
			if (back_link == '.widget_articles .results_search') {
				$('.widget_modal').hide();
                $('.widget_articles').show();
				$('.widget_articles .search_panel').show();
				$('.widget_articles .recommended').hide();
				$('.widget_articles .results_search').show();
				$('.widget_articles .show_article').hide();
				clearFooter ();
				if ($('.results_footer').hasClass('free')) {
					$('.results_footer p').show();
				} else {
					$('.results_footer .question').show();
				}
				$('.widget_articles .results_footer').show();
				modal_centering ('.widget_articles');
			}

            if (($('.widget_articles .results_search').is(":visible")) && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
                $('.results_footer button').css("float", "none")
            } else {
                $('.results_footer button').css("float", "right")
			}
			
			if(back_link == '.widget_modal' && $('.social-container').length && clickedViewArtFromModal)
			{
				$('.widget_articles').hide();
				$('.widget_modal').show();
				
				clickedViewArtFromModal = false
			}

			$('.nano').nanoScroller();
			modifyWidgetWindow();
		});

		$('.widget_articles .results_footer button').on('click', function(e) {
			e.preventDefault();
            if ($('.results_search').is(":visible")) {
                $('.results_footer .article_back, .modal_foot .back_link a').attr('data-back', '.widget_articles .results_search');
            }
			$('.widget_articles').hide();
				
			$('.widget_modal').show();

			if ($(document).select2) {
				let select_width = $('.widget_articles').width();
				let notValid = false;
				$(".department").parent().hasClass('required') && $(".department").parent().find('span.select2-selection__placeholder').hasClass('red_field') ? notValid = true : notValid = false;
				$(".department").select2({
					minimumResultsForSearch: Infinity,
					//placeholder: "Департамент",
					width: select_width + 'px',
					dropdownAutoWidth: true
				});
				notValid ? SelectValidation() : null
				StarSelect();
			}

			updateWidgetModal();
			updateContentField();
			setTimeout(function() {
				modifyModalContent()
			}, 800)
		});
        
	});

	// search
	$(function(){
		$('.widget_articles .search_panel .fa-search').on('click', function() {
			var str = $('.widget_articles .search_panel input[type="text"]').val();
			var letters_num = str.length;

			if (letters_num >= 3) {
				$('.widget_articles .search_panel .fa-search').hide();
				$('.widget_articles .search_panel .fa-spinner').show();
				xajax_FindArticles(widget_code,str,'block');
//				showSearchRes ();
			}
		});

		$('.widget_articles .search_panel input[type="text"]').on('keyup', function(e){
			var str = $(this).val();
			var letters_num = str.length;

			if ((e.keyCode == 13)&&(letters_num >= 3)&&($(this).siblings('.fa-times').is(':hidden'))) {
				$(this).blur();
				$('.widget_articles .search_panel .fa-search').hide();
				$('.widget_articles .search_panel .fa-spinner').show();
				xajax_FindArticles(widget_code,str,'block');
			} else {
				$(this).siblings('.fa-times').hide();
				$(this).siblings('.nothing').hide();
				$(this).siblings('.fa-search').show();
			}
		});


		$('.widget_articles .search_panel .fa-times').on('click', function() {
			$('.widget_articles .search_panel input[type="text"]').val('');
			$('.widget_articles .search_panel .fa-times').hide();
			$('.widget_articles .search_panel .nothing').hide();
			$('.widget_articles .search_panel .fa-search').show();
			$('.widget_articles .results_search').hide();
			$('.widget_articles .results_footer').hide();
			clearFooter ();
			$('.widget_articles .recommended').show();
			modifyRecommended()
			modal_centering ('.widget_articles');
			modifyWidgetWindow()
		});
        modifyWidgetWindow()
	});
})(jQuery);
function updateContentField()
{
	$('li#w_form_el_message').css('height','auto');
	// $('li#w_form_el_message').css('min-height','40px');
	var h = $('.modal_content_inner ul').height()-$('li#w_form_el_message').height();
	var n_h = 367-h;

	if(n_h < 0) {
		n_h = 80;
	}
	if($('#widget_content').height()>n_h) {
		$('.modal_content_inner').scrollTop($('.modal_content_inner')[0].scrollHeight);
	} else if(n_h>0) {
		// console.log('asdas');

		updateWidgetModal();

		FixNanoMozilla(); 	
	}
}
function updateWidgetModal(){
	var newVal = 0; 
	var	sumFieldsH = 0; 
	var	areaOffTop = 0; 
	var	ulOffTop = 0;
	var	newTextareaHeight = 0;
	// console.log('!!!!!!!');
	// setTimeout (function(){
		var ulH = $('.widget_modal').height() - $('.widget_modal .modal_foot').height() - $('.widget_modal h4').height();

		if ($('.modal_content_inner .content_area').offset() !== undefined && $('.modal_content_inner ul').offset() !== undefined) {
			if($('.widget_modal').outerHeight() > 500 && $('.modal_content.nano .nano-pane').is(':visible')) {
				ulH/=1.5;
			}
			
			areaOffTop = $('.modal_content_inner .content_area').offset().top;
			ulOffTop = $('.modal_content_inner ul').offset().top;
			newTextareaHeight = ulH - (areaOffTop - ulOffTop) - 1;

			if ($('.widget_modal').find('.added_file span').text().length) {
				var globalH = 0;
				var addedFileCount = $('.widget_modal').find('.added_file span').length;
				$('.widget_modal').find('.added_file').each(function(id, item) {
					globalH += Math.round($(item).height());
				});

				if(addedFileCount >= 3) {
					if($('body').hasClass('mozilla')) {
						addedFileCount = addedFileCount - 2;
					}
				} else {
					addedFileCount = 0;
				}

				if($('body').hasClass('edge')) {
					if(addedFileCount < 2) {
						addedFileCount = addedFileCount + 1;
					}
					if ($('.modal_content').outerHeight() >= $('.modal_content_inner ul').outerHeight()) {
						$('.modal_content_inner').css('overflow-y', 'hidden');
					} else {
						$('.modal_content_inner').css('overflow-y', 'scroll');
					}
				}

				newVal = newTextareaHeight - globalH - addedFileCount;

				if(newVal <= 240 || $('.widget_modal .field[data-type="textarea"]:visible').length > 1) {
					newVal = 240;
				} 
					
				$('.modal_content_inner .content_area').css({
					'min-height': newVal + 'px',
				});

				PaneVisibility(200)
			} else {
				if($('body').hasClass('edge')) {
					if ($('.modal_content').outerHeight() >= $('.modal_content_inner ul').outerHeight()) {
						$('.modal_content_inner').css('overflow-y', 'hidden');
					} else {
						$('.modal_content_inner').css('overflow-y', 'scroll');
					}
					newTextareaHeight -=1; 
					$('.modal_content_inner').height(($('.modal_content').outerHeight() - 1) + 'px');
				}

				if(newTextareaHeight <= 240 || $('.widget_modal .field[data-type="textarea"]:visible').length > 1 || !$('.modal_content_inner .field:visible:last-child').hasClass('content_area')) {
					newTextareaHeight = 240;
				}

				$('.modal_content_inner .content_area').css({
					'min-height': newTextareaHeight + 'px',
				});
			}

			if($('body').hasClass('mozilla')) {
				autosize($('.widget_modal .modal_content_inner ul .field textarea'));
			}
			
			// setTimeout (function(){
			$('.modal_content.nano').nanoScroller({alwaysVisible: true});
				// console.log('1!!!!!!!!!!!!!!!')
			// }, 1500);

			// при автозапонении полей
			setTimeout (function(){
				FormElemActive();
				RefreshSelects();
			}, 300);
		}
	// }, 200);
}

function centerLastAction () {
	var height = $('.win_success').height();
	var offset = Math.round(height/2);
	$('.win_success').css('margin-top', -offset + 'px');
}
function refreshWidget(action) {
	
	if ($('.widget_modal').is(':visible')) {
		// console.log('qwe');

		modifyModalContent();

		updateWidgetModal();

		StarSelect();
		
	}
	/*if ($('.widget_modal').is(':visible')) {
	 $('.widget_articles').hide();
	 $('.widget_modal').hide();
	 }*/

	if ($('.win_success').is(':visible')) {
		closeWidget();
	}
	// $('.win_success').hide();
	if (action == 'success') {
		if(widget_type == 'knowledge_mail')
		{
			$('.widget_articles').css('display', 'block');
			$('.widget_articles .search_panel').css('display', 'block');
			$('.widget_articles .recommended').css('display', 'block');
			$('.widget_articles .results_search').hide();
			$('.widget_articles .show_article').hide();
			$('.widget_articles .results_footer').hide();
		}
		if(widget_type == 'mail')
		{
			$('.widget_modal').show();
			updateContentField();
		}

	}
	CallbackViewArticle();
}
function closeWidget()
{
	parent.window.postMessage('{"act" : "close_widget", "widget_id" : "'+widget_id+'"}', '*');
	
	// console.log(widget_settings.settings.help_close)

	let type = widget_settings.settings.help_close;

	// console.log(opened_time)

	if(widget_type == 'mail') {
		if(type != 'click' && type != 0) {
			if(type > opened_time) {
				opened_time++;
				parent.window.postMessage('{"act" : "show_help","widget_id" : "'+widget_id+'"}', '*');
			} 
		} else if(type == 0) {
			parent.window.postMessage('{"act" : "show_help","widget_id" : "'+widget_id+'"}', '*');
		} 
	} 

    clearInterval(interval_update_captcha_js);
}

function showSearchRes (f_res) {
	$('.widget_articles .search_panel .fa-spinner').hide();
	$('.widget_articles .search_panel .fa-times').css('display','block');
	$('.widget_articles .recommended').hide();
	$('.widget_articles .results_footer').css('display','block');
	clearFooter ();
	if (f_res == 1) {
		$('.widget_articles .results_search').css('display','block');

		setTimeout(function() {
			var results_search_height = $('.results_search .articles_header').outerHeight() + $('.results_search ul').outerHeight();
			if (window.innerHeight > 551) {
				$('.widget_articles .results_search').css({
					'height': results_search_height >= 422 ? '422px' : (results_search_height + 'px'),
					'max-height': '422px',
				});
				
			} else {
				$('.widget_articles .results_search').css({
					'height': '170px',
					'max-height': '170px',
				});
			}

			$('.widget_articles .results_search.nano').nanoScroller({alwaysVisible: true});
		}, 100)

		//setScroll_sr();
		$('.widget_articles .results_search ul li a p').trigger("update");
		if ($('.results_footer').hasClass('free')) {
			$('.results_footer p').css('display','block');
		} else {
			$('.results_footer .question').css('display','block');
		}
	} else {
		$('.widget_articles .search_panel .nothing').css('display','block');
		$('.widget_articles .results_search').hide();
		if ($('.results_footer').hasClass('free')) {
			$('.results_footer p').css('display','block');
		} else {
			$('.results_footer').addClass('tall');
		}
	}
	$('.widget_articles .search_panel input[type="text"]').focus();
	modal_centering ('.widget_articles');
}
function showSearchResForm(f_res){
	if (f_res == 1) {
		$('.widget_modal .search_results').show();
		$('.widget_modal .search_results p').trigger("update");
		$('.widget_modal .kb_search').next().find('.fa-spinner').hide();
		$('.widget_modal .kb_search').next().find('.fa-times').show();
		//setScroll();
		$('.nano').nanoScroller();
	} else {
		$('.widget_modal .kb_search').next().find('.fa-spinner').hide();
		$('.widget_modal .kb_search').next().find('.fa-times').show();
		$('.widget_modal .kb_search').next().find('.nothing').show();
	}
	$('.widget_modal input[name="field_subject"]').focus();
}
// clear footer
function clearFooter () {
	$('.results_footer').removeClass('tall');
	$('.results_footer .article_back').hide();
	$('.results_footer .question').hide();
	$('.results_footer p').hide();
}

function modal_centering (win) {
	if($(window).width() == 0 && $(window).height() == 0)
	{
		return;
	}
// 	var height = $(win).height();
// 	var offset = Math.round(height/2);
// 	if ($('body').height() == 520) {
// 		$(win).css('margin-top', 0);
// 	} else {

// //		$(win).css('margin-top', -offset + 'px');
// 		var h_percent = parseInt($(win).height()*100/$(window).height());
// 		$(win).css({
// 			'top': (h_percent > 0 ? 100-h_percent-parseInt((100-h_percent)/2) : 0) + '%',
// 		});

// 	}
}
function viewArticle(block, id,lang_id)
{
    if(id)
    {
        $('#w_article_title, #w_article_text').html(' ');
        xajax_GetArticle(widget_code, id,lang_id);
    }
	$('.widget_articles .search_panel').hide();
	
	if($('.social-container').length && clickedViewArtFromModal) {
		$('.widget_modal').hide();
        $('.widget_articles .results_search').hide();
        $('.widget_articles').show();
		$('.results_footer .article_back').show().attr('data-back', '.widget_modal');

		$('.widget_articles .show_article').show();
		$('.nano').nanoScroller();
		$('.widget_articles .results_footer').show();
		modal_centering ('.widget_articles');
		return
	} 

    if(block == 'recommended') {
        $('.widget_articles .recommended').hide();
    }
    if(block == 'search_form') {
        $('.widget_modal').hide();
        $('.widget_articles .results_search').hide();
		$('.widget_articles').show();
    }
    else
        $('.widget_articles .results_search').hide();
    $('.widget_articles .show_article').show();
    //setScroll_sa ();
	$('.nano').nanoScroller();

	clearFooter ();

    $('.widget_articles .results_footer').show();
    if(block != 'search_form' || !id) {
        $('.results_footer .article_back').show();
    }
    if(block == 'recommended' || !id) {
        $('.results_footer .article_back').attr('data-back', '.widget_articles .recommended');
    }
    else {
		$('.results_footer .article_back').attr('data-back', '.widget_articles .results_search');
    }

    modal_centering ('.widget_articles');
}
function ModalCentering()
{
    if($(window).height() < 521) {
		// console.log('7');
    } else {
        var h_articles_percent = parseInt($('.widget_articles').height()*100/$(window).height());
		var h_modal_percent = parseInt($('.widget_modal').height()*100/$(window).height());
		// console.log('111');
        // $('.widget_articles').css({
        //     'top': (h_articles_percent > 0 ? 100-h_articles_percent-parseInt((100-h_articles_percent)/2) : 0) + '%',
        // });
        // $('.widget_modal').css({
        //     'top': (h_modal_percent  > 0 ? 100-h_modal_percent-parseInt((100-h_modal_percent)/2) : 0) + '%',
        // });
	}
}
function SetUserSettings(data)
{
    if(data.case_subject)
	{
		for(var i in data.case_subject)
		{
			$("#widget_modal_form_id #w_form_el_subject_select select")
				.append('<option value="'+decodeURIComponent(data.case_subject[i])+'">'+decodeURIComponent(data.case_subject[i])+'</option>');
		}
		var name = $("#w_form_el_subject input").attr('name');

		$("#w_form_el_subject").remove();
		$("#w_form_el_subject_select").attr('id','w_form_el_subject');

		$("#w_form_el_subject select").attr('name',name);

		$("#w_form_el_subject").show();
		$("#w_form_el_subject select").select2({
			minimumResultsForSearch: Infinity,
			width: '600px'
		});
	}
	if(data.user_info)
	{
		//if(navigator.geolocation)
		//{
		//	navigator.geolocation.getCurrentPosition(function(d)
		//	{
		//		$("#widget_modal_form_id")
		//			.append('<input type="hidden" name="ui[lat]" value="'+ d.coords.latitude+'">')
		//			.append('<input type="hidden" name="ui[lng]" value="'+ d.coords.longitude+'">');
		//	});
		//}
		var browser = getBrowser(decodeURIComponent(data.user_info.ua));
		$("#widget_modal_form_id")
			.append('<input type="hidden" name="ui[os]" value="'+ browser[1]+'">')
			.append('<input type="hidden" name="ui[referer]" value="'+ decodeURIComponent(data.user_info.location)+'">')
			.append('<input type="hidden" name="ui[browser]" value="'+browser[0] +'">')
	}
	if(data.identify)
	{
        let b_from_support = false;
        if(data.identify['b_from_support']
        || (data.identify['user_full_name'] && data.identify['user_email']))
        {
            if(data.identify['b_from_support'])
            {
                b_from_support = true;
            }
            data.identify['b_from_support'] = 1
            $('.reg_captha').addClass('_off');

        }

        for(var i in data.identify)
		{

			var el = $('li#w_form_el_'+i);
			var val = decodeURIComponent(data.identify[i]);

			val = $('<div></div>').text(val).text();
			if($(el).length)
			{
				var type = $(el).attr('data-type');
				$(el).find('p').hide();
				if (type == 'text'){
					$(el).find('input').val(val).css('display','block');
					$(el).addClass('active').find('p').show();
				}else if (type == 'textarea'){
					$(el).find('textarea').html(val).show().css('display','block');
					$(el).addClass('active').find('p').show();
				}else if (type == 'checkbox'){
					$(el).find('input').attr('checked','checked').css('display','block');
					$(el).addClass('active').find('p').show();
				}else if (type == 'select') {
					$(el).find('select').css('display','block').val(val).select2({
						minimumResultsForSearch: Infinity,
						width: '600px'
					});
					$(el).addClass('active').find('p').show();
				}
			}
			else {
				$("#widget_modal_form_id")
					.append(
						$('<input>').attr('type','hidden').attr('name','identify['+i+']').attr('value',val)
						//'<input type="hidden" name="identify['+i+']" value="'+ val+'">'
					);
			}
		}
        if(b_from_support )
        {
            $('li#w_form_el_user_full_name').hide();
            $('li#w_form_el_user_email').hide();
        }
	}
	if(data.search_str)
	{
		$('.widget_articles .search_panel input[type="text"]').val(decodeURIComponent(data.search_str));
		$('.widget_articles .search_panel .fa-search').hide();
		$('.widget_articles .search_panel .fa-spinner').show();
		xajax_FindArticles(widget_code,decodeURIComponent(data.search_str),'block');

	}
}

function ResetFormFields() {
	$("#widget_modal_form_id")[0].reset();
	$("#widget_modal_form_id .field").removeClass('active');
}

function getBrowser (ua) {

	var bName = function () {
		if (ua.search(/MSIE/) > -1) return "IE";
		if (ua.search(/Firefox/) > -1) return "Firefox";
		if (ua.search(/Opera/) > -1) return "Opera";
		if (ua.search(/Chrome/) > -1) return "Chrome";
		if (ua.search(/Safari/) > -1) return "Safari";
		if (ua.search(/Konqueror/) > -1) return "Konqueror";
		if (ua.search(/Iceweasel/) > -1) return "Iceweasel";
		if (ua.search(/SeaMonkey/) > -1) return "SeaMonkey";
		return 'n/a'}();
	var version = function (bName) {
		switch (bName) {
			case "ie" : return (ua.split("MSIE ")[1]).split(";")[0];break;
			case "firefox" : return ua.split("Firefox/")[1];break;
			case "opera" : return ua.split("Version/")[1];break;
			case "chrome" : return (ua.split("Chrome/")[1]).split(" ")[0];break;
			case "safari" : return (ua.split("Version/")[1]).split(" ")[0];break;
			case "konqueror" : return (ua.split("KHTML/")[1]).split(" ")[0];break;
			case "iceweasel" : return (ua.split("Iceweasel/")[1]).split(" ")[0];break;
			case "seamonkey" : return ua.split("SeaMonkey/")[1];break;
		}
		return '';}(bName);
	var os = function(){
		if (ua.indexOf ("Windows") != -1) return "Windows";
		if (ua.indexOf ("Linux")!= -1) return "Linux";
		if (ua.indexOf ("Mac")!= -1) return "Mac OS";
		if (ua.indexOf ("SunOS")!= -1) return "SunOS";
		if (ua.indexOf ("FreeBSD")!= -1) return "FreeBSD";
	}();

	return [bName + version.split(".")[0],os];
}

function listener(event) {
    if( event.data == 'render_widget_mail')
    {
        $('.js_container_widget').hide();
        $('.js_container_mail_widget').show();
        return;
    }
    if( event.data == 'render_widget_idea')
    {
        $('.js_container_widget').hide();
        $('.js_container_idea_widget').show();

		let src = $('.sc_frame_idea').attr('data-src');
		$('.sc_frame_idea').attr('src', src).removeAttr('data-src');

		// $('.sc_frame').on('load', function(){
		// 	let d_src = $(this).attr('data-src');
	
		// 	if(typeof d_src == typeof undefined && d_src == false) {
			setTimeout(function() {
				$('.sc_frame_idea').prev('.preload_block').fadeOut();
				$('.sc_frame_idea').css('display', 'block');
			}, 1000)
		
		// }
	// });

        return;
    }
    if( event.data == 'render_widget_knowledge')
    {
        $('.js_container_widget').hide();
        $('.js_container_knowledge_widget').show();

		let src = $('.sc_frame_knowledge').attr('data-src');
		$('.sc_frame_knowledge').attr('src', src).removeAttr('data-src');

		// $('.sc_frame').on('load', function(){
		// 	let d_src = $(this).attr('data-src');
	
		// 	if(typeof d_src == typeof undefined && d_src == false) {
			setTimeout(function() {
				$('.sc_frame_knowledge').prev('.preload_block').fadeOut();
				$('.sc_frame_knowledge').css('display', 'block');
			}, 1000)
		// 	}
		// });

        return;
    }
    if( event.data == 'focus_search')
    {
        $('.widget_articles .search_panel input[type="text"]').focus();
        return;
    }
	if( event.data == 'update_form')
	{
		updateWidgetModal()
		
		return;
	}
	if( event.data == 'update_content_field')
	{
	    InitCaptcha();
        updateContentField();
		return;
	}
	if( event.data.match('set_fields_after') !== null)
	{
        let ndata = {identify : JSON.parse(event.data.replace(/set_fields_after/, '').replace(/["']/g, '"'))};
        SetUserSettings(ndata);
		return;
	}
	if( event.data.match('reset') !== null)
	{
        ResetFormFields();
		return;
	}
	if(event.data == 'offOmniChatra') {
		if($('.social-block').length && $('.social-block .chat').length) {
            $('.social-block .chat').parent().hide()
        }
        return;
    }
	try
    {
        var data = $.parseJSON(event.data);
        if (data)
        {
            SetUserSettings(data);
        }
    }
    catch (err)
	{

    }
} 

if (window.addEventListener) {
	window.addEventListener("message", listener);
} else {
	// IE8
	window.attachEvent("onmessage", listener);
}

function CallbackViewArticle() {
	var device_width = window.innerWidth;
	if(device_width < 1080) {
		$('#w_article_text iframe').css('width', '87%');
        $('#w_article_text iframe').css('height', 'auto');
    }
    modifyWidgetWindow()
}

function modifyWidgetWindow() {

	// $('.modal_content.nano .nano-pane').is(':visible')

	// let exp = $('.widget_modal .field:visible').length  && $('.widget_modal .field[data-type="textarea"]:visible').length > 1;
	let sumFieldsH = 0;
	$('.widget_modal .field:visible').each(function(i,item) {
		sumFieldsH+=$(this).outerHeight();
	})

	let exp = sumFieldsH > $('.modal_content.nano').outerHeight();
	// console.log(exp)

	if(exp && document.body.clientWidth >= 1000 && document.body.clientHeight >= 700 && $('.widget_modal').attr('data-changed') !== 'true') {
		// console.log( $('.widget_modal').attr('data-changed') !== 'true')
		sumFieldsH+=$('.widget_modal .modal_foot').height() + $('.widget_modal h4').height() + 2;
		if(sumFieldsH>=600) {
			sumFieldsH = 600;
		}
		$('.widget_modal').css({
			'height': sumFieldsH + 'px',
		});

		// modifyModalContent();
		// updateWidgetModal();
	} else {
		// $('.widget_modal').css('height', '460px');
		// $('.widget_modal').removeClass('big_window');
	}

	setTimeout(function() {
		modifyModalContent();
		updateWidgetModal();
	}, 100)

	

    if($(this).height() < 521 && 1==2) {
		// console.log('9');
        $('.widget_modal').css({
            'max-height': '320px'
        });

    } else if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        var h_articles_percent = parseInt($('.widget_articles').height()*100/$(window).height());
        var h_modal_percent = parseInt($('.widget_modal').height()*100/$(window).height());
        var desired_width;
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            var window_pixels = Math.abs(window.orientation) === 90 ? screen.height : screen.width;
            desired_width = (window_pixels * 0.9) + 'px';
        } else {
            desired_width = '90%'
        }
		
        // $('.widget_articles').css({
        //     'top': (h_articles_percent > 0 ? 100-h_articles_percent-parseInt((100-h_articles_percent)/2) : 0) + '%'
        // });
        if ($(this).height() < 200) {
            // $('.widget_modal').css({
            //     'top': (h_modal_percent  > 0 ? 100-h_modal_percent-parseInt((100-h_modal_percent)/2) : 0) + '%'
            // });
        } else {
			// console.log('333');
            $('.widget_modal').css({
                'min-height': '40%',
				'max-height': '418px',
				'height': '90vh',
                // 'top': (h_modal_percent  > 0 ? 100-h_modal_percent-parseInt((100-h_modal_percent)/2) : 0) + '%'
			});
			updateWidgetModal()
		}
		
		modifyShowArticle();
        modifyResultSearch();
        modifyRecommended();
		modifyModalContent();
    } 

	modifyRecommended();
	ModalCentering();
	FixNanoMozilla(); 	
}
function YaTarget(target)
{
	parent.window.postMessage('{"act" : "yaReachGoal","widget_id" : "' + widget_id + '", "target":"' + target + '"}', '*');
}
//popup

//additional properties for jQuery object
//align element in the middle of the screen
$.fn.alignCenter = function() {
    //get margin left
    var marginLeft =  - $(this).width()/2 + 'px';
    //get margin top
    var marginTop =  - $(this).height()/2 + 'px';
    //return updated element
    return $(this).css({'margin-left':marginLeft, 'margin-top':marginTop});
};

$.fn.togglePopup = function(status,id){
    if(!id)
    {
        id = '#popup';
    }
    d = '';
    if(typeof status === 'number')
    {
        d = status ? 'd' : 'h';
    }
    if(($(id).hasClass('hidden') && d=='h')
        || (!$(id).hasClass('hidden') && d=='d'))
    {
        return;
    }
    //detect whether popup is visible or not
    if($(id).hasClass('hidden'))
    {
        //hidden - then display

        {
            $('#opaco').height($(document).height()).toggleClass('hidden').fadeTo('slow')
                .click(function(){
					$(this).togglePopup(status,id);
					$('#g_widget_butt_submit').show();
                	$('#g_widget_butt_submit_spin').hide();
				});
        }

        $(id)
            .html($(this).html())
            .alignCenter()
            .toggleClass('hidden');
    }
    else
    {
        //visible - then hide
        $('#opaco').toggleClass('hidden').removeAttr('style').unbind('click');
        $(id).toggleClass('hidden');
    }
    $('.popupClose').click(function(){
		$.fn.togglePopup(status,id);
		$('#g_widget_butt_submit').show();
		$('#g_widget_butt_submit_spin').hide();
	});
};

$(document).ready(function() { 
	FormElemActive();

	$('.form-item').on('focusin', function() {
		const target = $(this);
		target.parent().addClass('active');
		target.attr('placeholder', target.attr('data-placeholder'));
		setTimeout(function() {
			// target.parents('.nano').nanoScroller({ scrollTo: target });
		}, 400)
	})

	$('.form-item').on('focusout', function() {
		const target = $(this);
		if(!target.val().trim().length) {
			target.parent().removeClass('active');
			target.val('');
		}
		if(target.attr('name') == 'field_user_email') {
			let newVal = target.val().trim();
			target.val(newVal)
		} else if(target.attr('name') == 'field_phone') {
			let newVal = target.val().replace(/\s/g,'');
			let newVal2 = newVal.replace(/[()]/g, "");
			var newStr3 = newVal2.replace(/-/g, "");
			target.val(newStr3)
		}
		target.attr('placeholder', '');
	});

	$(document).on("change",".department",function(){
		const target = $(this);
		target.parent().addClass('active');
	});

	setTimeout(function() {
		modifyRecommended()
	}, 800)

	$('.modal_foot').on('change', "input[type=file]" , function(){ 
		updateWidgetModal(30);
	});

	$('.widget_modal .field textarea').on('change paste keyup', function(){
		let target = $(this);
		let tarParent = $(this).parent('.field');

		if (target.height() >= tarParent.height()) {
			tarParent.css({
				'margin-top': '19px'
			})

			tarParent.find('p').css({
				'margin-top': '-15px'
			})
		} else {
			tarParent.css({
				'margin-top': '0'
			})

			tarParent.find('p').css({
				'margin-top': '5px',
			})
		}
		$('.widget_modal').attr('data-changed', 'true');
	});

	var checkSearchBlur = false;
	$(".widget_articles .search_panel input").on('blur', function() {
		checkSearchBlur = true;
		checkSearchBlur ? $(this).focus() : null
	});

    $(document).on('click', ".js-captcha__item", function() {
		$(".js-captcha__item").removeClass('active');
		$(this).addClass('active');
        $(this).closest('.captchaBlock').find('.captcha_response').val($(this).attr('rel'));

    });

	$(document).on('click',".js-trigger_submit_btn", function() {
		// $("#g_widget_butt_submit").trigger('click');
		$(this).find('i').hide();
		$(this).find('span').css('display', 'inline-block');

        if($('#widget_modal_form_id').ajaxForm)
        {
            $('#widget_modal_form_id').ajaxSubmit(ajaxFormOption);
            return false;
        }

    });

});


function FormElemActive() {
	if ($('.form-item').length) {
		$('.form-item').each(function(index, element) {
			let target = $(element);
			if(target.length && target.val() && target.val().length) {
				target.parent().addClass('active');
				target.attr('placeholder', target.attr('data-placeholder'));
				target.parent().find('p').show();
				// setTimeout(function() {
				// 	target.parents('.nano').nanoScroller({ scrollTo: target });
				// }, 400)
			}
		});
		// селекты
		$('.department').each(function(index, element) {
			let target = $(element);
			if(target.length && target.val() && target.val().length) {
				target.parent().addClass('active');
				target.parent().find('p').show();
				// setTimeout(function() {
				// 	target.parents('.nano').nanoScroller({ scrollTo: target });
				// }, 400)
			}
		});
		StarSelect();
	}
}

function modifyShowArticle() {
	if($('.widget_articles .show_article').css('display') == 'block') {
		var h_articles_percent = parseInt($('.widget_articles').height()*100/$(window).height());

		var show_article_height = window.innerHeight - $('.widget_articles .results_footer').height() - (window.innerHeight/(100-h_articles_percent));
		var desired_width;
		if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			var window_pixels = Math.abs(window.orientation) === 90 ? screen.height : screen.width;
			desired_width = (window_pixels * 0.9) + 'px';
		} else {
			desired_width = '90%'
		}
		
		// console.log('444');
		// $('.widget_articles').css({
		// 	'top': (h_articles_percent > 0 ? 100-h_articles_percent-parseInt((100-h_articles_percent)/2) : 0) + '%'
		// });
		
		if (window.innerHeight > 551) {
			$('.widget_articles .show_article').css({
				'height': show_article_height + 'px',
				'max-height': '80vh'
			});
		} else {
			$('.widget_articles .show_article').css({
				'height': '170px',
				'max-height': '170px',
			});
		}

		var nano_content_width = $('.widget_articles .show_article').width() + 30;
		$('.widget_articles .show_article .show_article_inner .nano-content').css({
			'width': nano_content_width + 'px'
		});
		
		$('.results_footer button').css("float", "right")
	}
	if ($('.show_article_inner.nano').length) {
		$('.show_article_inner.nano').nanoScroller({alwaysVisible: true});
	}
}

function modifyResultSearch() {
	if($('.widget_articles .results_search').css('display') == 'block') {
		var h_articles_percent = parseInt($('.widget_articles').height()*100/$(window).height());
		
		var results_search_height = window.innerHeight - $('.widget_articles .results_footer').height() - $('.widget_articles .search_panel').height() - (window.innerHeight/(100-h_articles_percent));
		var desired_width;
		if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			var window_pixels = Math.abs(window.orientation) === 90 ? screen.height : screen.width;
			desired_width = (window_pixels * 0.9) + 'px';
		} else {
			desired_width = '90%'
		}
		if (window.innerHeight > 521) {
			$('.widget_articles .results_search').css({
				'height': results_search_height + 'px',
				'max-height': '367px',
			});
		} else {
			// console.log('10');

			$('.widget_articles .results_search').css({
				'height': '155px',
				'max-height': '160px',
			});
		}
		window.innerWidth >= 480 ? $('.results_footer button').css("float", "right") : $('.results_footer button').css("float", "none")
	}
	if ($('.results_search.nano').length) {
		$('.results_search.nano').nanoScroller({alwaysVisible: true});
	}
}

function modifyRecommended() {
	if($('.widget_articles .recommended').css('display') == 'block') {
		var h_articles_percent = parseInt($('.widget_articles').height()*100/$(window).height());
		// var results_search_height = window.innerHeight - $('.widget_articles .recommended').height() - $('.widget_articles .search_panel').height() - (window.innerHeight/(100-h_articles_percent)) -200;
		var results_search_height = $('.widget_articles .recommended .articles_header').outerHeight() + $('.widget_articles .recommended ul').outerHeight();
		
		var desired_width;
		if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			var window_pixels = Math.abs(window.orientation) === 90 ? screen.height : screen.width;
			desired_width = (window_pixels * 0.9) + 'px';
		} else {
			desired_width = '90%'
		}
        
		if (window.innerHeight > 521) {
			$('.widget_articles .recommended').css({
				// 'height': $('.widget_articles .recommended').outerHeight() >= 509 ? '509px' : (results_search_height + 'px'),
				'height': results_search_height >= 509 ? '509px' : (results_search_height + 'px'),
				'max-height': '509px',
			});
		} else {
			$('.widget_articles .recommended').css({
				'height': '170px',
				'max-height': '170px',
			});
		}
	}
	if ($('.recommended.nano').length) {
		$('.recommended.nano').nanoScroller({alwaysVisible: true});
	}
}

function modifyModalContent() {
	// console.log('1!!!!!!!!!!!!!!!');
	if($('.widget_modal .modal_content').css('display') == 'block') {
		var modal_content_height = $('.widget_modal').height() - $('.widget_modal .modal_foot:visible').height() - $('.widget_modal h4').height();
		
		var desired_width;
		if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			var window_pixels = Math.abs(window.orientation) === 90 ? screen.height : screen.width;
			desired_width = (window_pixels * 0.9) + 'px';
		} else {
			desired_width = '90%'
		}
		if (window.innerHeight > 521) {
			if($('body').hasClass('mozilla')) {
				$('.widget_modal .modal_content').css({
					'height':  modal_content_height + 'px',
					'max-height': modal_content_height + 'px'
				});
			} else {
				$('.widget_modal .modal_content').css({
					'height':  (modal_content_height - 1) + 'px',
					'max-height': (modal_content_height - 1) + 'px'
				});
			}
		} else {
			$('.widget_modal .modal_content').css({
				'height':  modal_content_height + 'px',
				'max-height': modal_content_height + 'px'
			});
		}
	}
	if ($('.modal_content.nano').length) {
		$('.modal_content.nano').nanoScroller({alwaysVisible: true});		
	}
}

function FixNanoMozilla() {
	if($('body').hasClass('mozilla')) {
		
		if ($('.recommended.nano').is(':visible') && $('.recommended.nano').width() !== $('.recommended.nano .articles_header').width()) {
			// console.log('q1');
			if($('body').hasClass('mac')) {
				$('.recommended.nano .nano-content').css({
					'box-sizing': 'border-box'
				})
			}
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				$('.recommended.nano .nano-content').css({
					'margin-right': '-20px',
					'padding-right': '20px'
				})
			} else {
				$('.recommended.nano .nano-content').css({
					'width': 'calc(100% + 90px)',
					'padding-right': '73px',
					'box-sizing': 'border-box'
				})
			}
			$('.recommended.nano').nanoScroller({alwaysVisible: true});
		} else if ($('.widget_modal').is(':visible') && $('.modal_content.nano').width() >= $('.modal_content.nano ul').width()) {
			// console.log('q2');
			let newUlW = $('.modal_content.nano').width();
			$('.modal_content.nano ul').width(newUlW);
			$('.modal_content.nano .nano-content').css({
				'width': 'calc(100% + 90px)',
			})
			$('.modal_content.nano').nanoScroller({alwaysVisible: true});
		} else if ($('.show_article').is(':visible') && $('.show_article_inner.nano').width() >= $('.show_article_inner .nano-content').width()) {
			// console.log('q3');
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {} 
			else {
				$('.show_article_inner .nano-content').css({
					'width': 'calc(100% + 90px)',
					'padding-right': '107px'
				})
				$('.show_article_inner.nano').nanoScroller({alwaysVisible: true});
			}
		}
	} 
}

$(window).on('resize', function(e) {
	// console.log('213123132');
	RefreshSelects();

	PaneVisibility();
});

function RefreshSelects() {
	if ($(document).select2) {
		$(".department").select2('close');

		setTimeout(function() {
			let select_width = $('.modal_content').width();
			let notValid = false;
			$(".department").parent().hasClass('required') && $(".department").parent().find('span.select2-selection__placeholder').hasClass('red_field') ? notValid = true : notValid = false;
			
			$(".department").select2({
				minimumResultsForSearch: Infinity,
				//placeholder: "Департамент",
				width: select_width + 'px',
				dropdownAutoWidth: true
			});
			notValid ? SelectValidation() : null
			StarSelect();
		}, 1)
	}
}

function PaneVisibility(duration) {
    if (!duration)
    {
        duration = 900
	}

	let paneBg = $('.modal_content.nano .nano-pane').css('background-color');
	let paneSliderBg = $('.modal_content.nano .nano-pane .nano-slider').css('background-color');

	$('.modal_content.nano .nano-pane, .modal_content.nano .nano-pane .nano-slider').css('background-color', 'none') 

	clearInterval(paneIntervalID);
	var paneIntervalID = setTimeout (function(){
		if($('.modal_content.nano .nano-pane').is(':visible')) {
			$('.modal_content.nano .nano-pane').css('background-color', paneBg);
			$('.modal_content.nano .nano-pane .nano-slider').css('background-color', paneSliderBg);

			// var position;
			// $('.modal_content.nano').on('update', function (e, data) {
			// 	position = data.position;
			// 	// $('.modal_content.nano').nanoScroller({scrollTop: position});
			// 	// console.log(position)
			// });


			// $('.modal_content.nano').nanoScroller({alwaysVisible: true});
		} 
	}, duration);
}
function InitCaptcha(b_ajax)
{
    if(!b_ajax)
    {
        xajax_UpdateCaptchaKey();
        interval_update_captcha_js = setInterval(function () {
            xajax_UpdateCaptchaKey();
        },118*1000);
    }
    clearInterval(interval_captcha_js)
    interval_captcha_js = setInterval(function () {
        if((GetCurrentTstamp()-start_page_tstamp) > omni_autocaptcha_sec)
        {
            clearInterval(interval_captcha_js);
            $('.reg_captha').addClass('_off');
            return;
        }
    },1000);
}

function SelectValidation() {
	$('.modal_content_inner .required select').each(function(index, element) {
		if (!$(element).val()) {
			$(this).parent().find('span.select2-selection__placeholder').addClass('red_field');
			formErrors = 'yes';
		} 
	});
}

function InputSelectNano() {
	let target = $('.select2-results');

	target.each( function(id, el) {
		let $this = $(el);

		if(!$this.hasClass('nano inp_select_nano')) {
			$this.addClass('nano inp_select_nano').find('.select2-results__options').addClass('nano-content');
		}

		$(".inp_select_nano").nanoScroller({alwaysVisible: true});
	})
}

function StarSelect() {
	if ($('.department').hasClass("select2-hidden-accessible")) {
		// add placeholder for selects with custom title text
		$('.modal_content_inner select').each(function(index, element) {
			if (!$(element).val()) {
				var t = $(this).parent().find('span.select2-selection__placeholder');
				if(!t.length)
				{
					$(this).parent().find('span.select2-selection__rendered').html('<span class="select2-selection__placeholder">'+$(this).parent().find('p').text()+'</span>');
				}
			}
		});

		// add stars required
		if (!$('.select2-container .select2-selection__placeholder').hasClass('star')) {
			$('.select2-container .select2-selection__placeholder').each(function(id, item){
				let target = $(item);
				$(target).addClass('star').html(function(_, html) {
					return  html.replace(/(\*)/g, '<span>$1</span>')
				});
			});
		}
	}
}
