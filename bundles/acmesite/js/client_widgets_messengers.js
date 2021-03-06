// #############-------   variables   -------#############
var chat_checker_interval = false;
var chat_checker_interval_ = false;
var vk_trigger_click;
var vk_widget_err = false;
var identify_arr = {};
// var MESSENGERS_TYPE = window.cClass.config_widget.type.indexOf('messengers') !== -1;
// var KB_TYPE = window.cClass.config_widget.type == 'knowledge_mail';


$(document).ready(function () {
    var MESSENGERS_TYPE = widget_type.indexOf('messengers') !== -1;
    var KB_TYPE = widget_type == 'knowledge_mail';

    if (chat_type == 'chatra' && chat_key) {
        setTimeout(function () {
            var chatra_i_data = {
                'omni_group_id': widget_settings['settings']['group_id'],
                // 'omni_real_location':g_page_location
            };
            if (identify_arr.user_full_name) {
                chatra_i_data['name'] = decodeURIComponent(identify_arr.user_full_name);
            }
            if (identify_arr.user_email) {
                chatra_i_data['email'] = decodeURIComponent(identify_arr.user_email);
            }
            if (identify_arr.user_phone) {
                chatra_i_data['phone'] = decodeURIComponent(identify_arr.user_phone);
            }
            parent.window.postMessage(JSON.stringify({
                "act": "init_chatra_chat",
                "widget_id": widget_id,
                "chat_key": chat_key,
                "chatra_group": widget_settings.settings.channels_list.chat.chatra_group || null,
                'chatra_i_data': chatra_i_data
            }), '*');
        }, 1000);

        // window.ChatraSetup = {
        // 	startHidden: true,
        //    onAnalyticEvent: function(eventName) {
        //        if(eventName.match(/Targeted chat shown/))
        // 		{
        // 			$('.widget_init_button').hide('fade', {}, animation_speed, function () {
        // 				$('.messenger_chat').trigger('click');
        // 			});
        // 		}
        //    }
        // };
        // if(widget_settings.settings.channels_list.chat.chatra_group)
        // {
        //    window.ChatraSetup['groupId'] = widget_settings.settings.channels_list.chat.chatra_group;
        // }
        //
        // (function (d, w, c)
        // {
        // 	w.ChatraID = chat_key;
        // 	var s = d.createElement('script');
        // 	w[c] = w[c] || function ()
        // 		{
        // 			(w[c].q = w[c].q || []).push(arguments);
        // 		};
        // 	s.async = true;
        // 	s.src = (d.location.protocol === 'https:' ? 'https:' : 'http:')
        // 		+ '//call.chatra.io/chatra.js';
        // 	if (d.head) d.head.appendChild(s);
        // })(document, window, 'Chatra');
    }

    if (chat_vk) {
        setTimeout(function () {
            parent.window.postMessage(JSON.stringify({
                "act": "init_vk_chat",
                "widget_id": widget_id,
                "chat_key": chat_vk,
                // "chatra_group": widget_settings.settings.channels_list.chat.chatra_group || null,
                // 'chatra_i_data': chatra_i_data
            }), '*');
        }, 1000);
    }

    if (chat_fb) {
        // var s = document.createElement('script');
        // s.async = true;
        // s.src = (document.location.protocol === 'https:' ? 'https:' : 'http:')
        //    + '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9';
        // // + '//connect.facebook.net/en_US/sdk/debug.js';
        // if (document.head) document.head.appendChild(s);
        // var tmp_i_fb=0;
        // var fb_interval =setInterval(function ()
        // {
        //
        //     if($('div#fb_community_messages iframe').length)
        //     {
        //         $('div#fb_community_messages iframe').css('display', 'none');
        //
        //         if (tmp_i_fb>20)
        //         {
        //             clearInterval(fb_interval);
        //         }
        //         tmp_i_fb++;
        //     }
        // },100);
        parent.window.postMessage('{"act" : "init_fb_chat","widget_id" : "' + widget_id + '", "fb_page_id":"' + chat_fb + '"}', '*');

    }

    $(document).on('click', '.messenger_vk', vk_trigger_click = function () {
        if (chat_vk) {
            if (MESSENGERS_TYPE) {
                $('.messengers_containers').hide('fade', {}, animation_speed, function () {
                    parent.window.postMessage('{"act" : "update_size_btn","widget_id" : "' + widget_id + '"}', '*');

                    $('.widget_init_button').show('fade');

                    parent.window.postMessage('{"act" : "vk_chat_open","widget_id" : "' + widget_id + '"}', '*');
                });
            } else if (KB_TYPE) {
                parent.window.postMessage('{"act" : "vk_chat_open","widget_id" : "' + widget_id + '"}', '*');

                closeWidget();
            }
        }

        return false;
    });

    $(document).on('click', '.messenger_fb', function () {
        if (chat_fb) {
            if (MESSENGERS_TYPE) {
                $('.messengers_containers').hide('fade', {}, animation_speed, function () {
                    parent.window.postMessage('{"act" : "update_size_btn","widget_id" : "' + widget_id + '"}', '*');

                    $('.widget_init_button').show('fade');

                    parent.window.postMessage('{"act" : "fb_chat_open","widget_id" : "' + widget_id + '"}', '*');
                });
            } else if (KB_TYPE) {
                parent.window.postMessage('{"act" : "fb_chat_open","widget_id" : "' + widget_id + '"}', '*');

                closeWidget();
            }
        }
        return false;
    });

    $(document).on('click', '.messenger_chat', function () {
        if (MESSENGERS_TYPE) {
            $('.messengers_containers').hide('fade', {}, animation_speed, function () {
                parent.window.postMessage('{"act" : "messenger_close","widget_id" : "' + widget_id + '"}', '*');

                $('.widget_init_button').show('fade');

                b_help = true;
                // if (b_help) {
                    ShowHelp();
                // }
            });
        } else if (KB_TYPE) {
             closeWidget();
        }

        // b_open_widget = false;

        parent.window.postMessage(JSON.stringify({
            "act": "chatra_chat_open",
            "widget_id": widget_id,
        }), '*');

        // if(window.Chatra)
        // {
        // 	$('.messengers_containers').hide('fade', {}, animation_speed, function ()
        // 	{
        // 		if(chat_checker_interval_)
        // 		{
        // 			clearInterval(chat_checker_interval_);
        // 		}
        //        if(Chatra._isMobile)
        // 		{
        //            FullScreen(true);
        // 		}
        // 		else
        //        {
        //            parent.window.postMessage('{"act" : "btn_resize","widget_id" : "' + widget_id + '", "nw":"340","nh":"480","bottom":"0px"}', '*');
        //        }
        // 		Chatra('openChat',window)
        // 		$('div#chatra').show();
        // 		Chatra('show');
        // 		setTimeout(function ()
        // 		{
        // 			chat_checker_interval = setInterval(function ()
        // 			{
        // 				if (!Chatra._chatExpanded)
        // 				{
        // 					clearInterval(chat_checker_interval);
        // 					$('div#chatra').hide();//Chatra('hide');
        // 					parent.window.postMessage('{"act" : "update_size_btn","widget_id" : "' + widget_id + '"}', '*');
        //                    FullScreen(false);
        // 					$('.widget_init_button').show('fade');
        // 					if (b_help)
        // 					{
        // 						ShowHelp();
        // 					}
        // 					checkChatraReply();
        // 				}
        // 			}, 100);
        // 		},500);
        // 	});
        // }

        return false;

    });
    // checkChatraReply();

    // #############-------   MESSENGERS_TYPE   -------#############
    if (MESSENGERS_TYPE) {
        if ($('.messengers_containers').length) {
            $(document).on('click', '.messenger_close', function () {
                if(cnt_show_help != 'click' && cnt_show_help != 0) {
                    if(cnt_show_help > cnt_showed_help) {
                        cnt_showed_help++;
                    } 
                } 
                
                $('.messengers_containers').hide('fade', {}, animation_speed, function () {
                    parent.window.postMessage('{"act" : "messenger_close","widget_id" : "' + widget_id + '"}', '*');
                    $('.widget_init_button').show('fade');

                    b_help = true;
                    // if (b_help) {
                        ShowHelp();
                    // }
                });
                b_open_widget = false;
            });


            $(document).on('click', 'div.link_channel_', function () {
                if(cnt_show_help == 0) {
                    b_help = true;
                } else {cnt_show_help = 1;cnt_showed_help = 2;CloseHelp();}

                if ($(this).hasClass('messenger_emails')) {
                    return LinkChannelClicked('mail');
                } else if ($(this).hasClass('messenger_idea')) {
                    return LinkChannelClicked('idea');
                } else if ($(this).hasClass('messenger_knowledge')) {
                    return LinkChannelClicked('knowledge');
                }

                if ($(this).hasClass('messenger_chat') ||
                    ($(this).hasClass('messenger_vk') && chat_vk && !vk_widget_err) ||
                    ($(this).hasClass('messenger_fb') && chat_fb)
                ) {
                    return false
                }

                if ($(this).find('a').attr('data-ya-target')) {
                    YaTarget($(this).find('a').attr('data-ya-target'));
                }

                parent.window.postMessage('{"act" : "link_click","widget_id" : "' + widget_id + '", "href":"' + $(this).find('a').attr('href') + '"}', '*');

                return false;
            });
        }
    }

    // #############-------   KB_TYPE   -------#############
    if (KB_TYPE) {
        $('.social-block a').on('click', function (e) {
            e.preventDefault

            if ($(this).find('a').attr('data-ya-target')) {
                YaTarget($(this).find('a').attr('data-ya-target'));
            }

            if ($(this).hasClass('messenger_emails')) {
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
                        //placeholder: "??????????????????????",
                        width: select_width + 'px',
                        dropdownAutoWidth: true
                    });
                    notValid ? SelectValidation() : null
                    StarSelect();
                }

                updateWidgetModal();
                updateContentField();
                setTimeout(function () {
                    modifyModalContent()
                }, 800)
                return false

            } else if ($(this).hasClass('messenger_chat') ||
                ($(this).hasClass('messenger_vk') && chat_vk && !vk_widget_err) ||
                ($(this).hasClass('messenger_fb') && chat_fb)
            ) {
                // return false
            } else {
                parent.window.postMessage('{"act" : "link_click","widget_id" : "' + widget_id + '", "href":"' + $(this).attr('href') + '"}', '*');

                closeWidget();

                return false;
            }

        });
    }
});

function LinkChannelClicked(message_type) {
    if (message_type) {
        $('.messengers_containers').hide('fade', {}, animation_speed, function () {
            $('.widget_init_button').show('fade');
            parent.window.postMessage('{"act" : "action_tip", "widget_id" : "' + widget_id + '", "action_type" : "hide"}', '*');
            parent.window.postMessage('{"act" : "init_widget","b_open_widget" : "1","widget_id" : "' + widget_id + '","type":"' + message_type + '"}', '*');
        });
        return false;
    }
}

function checkChatraReply() {
    chat_checker_interval_ = setInterval(function () {
        // console.log(Chatra._chatExpanded,$('#chatra').hasClass('chatra--expanded'));
        if (Chatra._chatExpanded || $('#chatra').hasClass('chatra--expanded')) {
            clearInterval(chat_checker_interval_);
            $('.widget_init_button').hide('fade', {}, animation_speed, function () {
                $('.messenger_chat').trigger('click');

            });
        }
    }, 100);
}

function listener(event) {
    //    console.log(event);
    
    //vk widget
    if (typeof event.data == 'string' && event.data.match(/\:\["fatalError",/) && event.origin.match(/vk\.com/)) {
        vk_widget_err = true;
        FullScreen(true);
    } else if (typeof event.data == 'string' && event.data.match(/\:\["showBox",/) && event.origin.match(/vk\.com/)) {
        b_full_screen = true;
        parent.window.postMessage('{"act" : "btn_resize","widget_id" : "' + widget_id + '","b_full_screen":1}', '*');
        $('body').addClass('full_screen');
    } else if (typeof event.data == 'string' && event.data.match(/\:\["destroy",/) && event.origin.match(/vk\.com/) && b_full_screen) {
        FullScreen(false);
    } else if (typeof event.data == 'string' && event.data.match(/\:\["minimize",\[\]\]/)) {
        $('div#vk_community_messages').hide(); //Chatra('hide');
        parent.window.postMessage('{"act" : "update_size_btn","widget_id" : "' + widget_id + '"}', '*');

        $('.widget_init_button').show('fade');
        if (b_help) {
            ShowHelp();
        }
    } else if (typeof event.data == 'string' && event.data.match(/\:\["newMessage",\[\]\]/)) {
        $('.widget_init_button').hide('fade', {}, animation_speed, function () {
            vk_trigger_click();
            // $('.messenger_vk').trigger('click');
        });
    }
    
    //fb widget
    if (typeof event.data == 'string' && event.data.match(/liveChatPluginHideDialogIframe/)) {
        $('div#fb_community_messages iframe').hide();
        parent.window.postMessage('{"act" : "update_size_btn","widget_id" : "' + widget_id + '"}', '*');

        $('.widget_init_button').show('fade');
        if (b_help) {
            ShowHelp();
        }
    }

    // //chatra
    // if(typeof event.data == 'string' && event.data.match(/"type"\:"expandWindow",/) && event.origin.match(/chatra\.io/))
    // {
    //     // console.log();
    //     // if(!$('#chatra').hasClass('chatra--expanded'))
    //     // {
    //     //     $('.widget_init_button').hide('fade', {}, animation_speed, function () {
    //     //         $('.messenger_chat').trigger('click');
    //     //
    //     //     });
    //     // }
    // }
    // if(typeof event.data == 'string' && event.data.match(/"type"\:"hideChat",/) && event.origin.match(/chatra\.io/))
    // {
    // 	if($('#chatra').hasClass('chatra--expanded'))
    //     {
    //         Chatra('hide');
    //         parent.window.postMessage('{"act" : "update_size_btn","widget_id" : "' + widget_id + '"}', '*');
    //
    //         $('.widget_init_button').show('fade');
    //         if (b_help)
    //         {
    //             ShowHelp();
    //         }
    //     }
    // }
    if (event.data == 'chatra_hide') {
        $('div.messenger_chat').addClass('hide').hide();
        parent.window.postMessage('{"act" : "change_channels_cnt","widget_id" : "' + widget_id + '","channels_cnt":' + ($('div.messengers_containers .widget_button:not(.hide)').length - 1) + '}', '*');
        return;
    } else if (event.data == 'chatra_show') {
        $('div.messenger_chat').removeClass('hide').show();
        parent.window.postMessage('{"act" : "change_channels_cnt","widget_id" : "' + widget_id + '","channels_cnt":' + ($('div.messengers_containers .widget_button:not(.hide)').length - 1) + '}', '*');
        return;
    } 
    try {
        var data = $.parseJSON(event.data);
        if (data.identify) {
            identify_arr = data.identify;

        } else if (data.act && data.act == 'set_location') {
            g_page_location = decodeURIComponent(data.location);
        }
    } catch (err) {

    }
}

function YaTarget(target) {
    parent.window.postMessage('{"act" : "yaReachGoal","widget_id" : "' + widget_id + '", "target":"' + target + '"}', '*');
}

if (window.addEventListener) {
    window.addEventListener("message", listener);
} else {
    // IE8
    window.attachEvent("onmessage", listener);
}
