/*variables*/
var b_init_hover = false;
var help_w = 0;
var help_h = 0;
var theme_css = 0;
var hint_text = '';
var help_h = 0;
var b_full_screen = false;
var animation_speed = 50;
var first_bug_shown = false;
var timerId;
var showClear;

$(document).ready(function () {
    var MESSENGERS_TYPE = widget_type.indexOf('messengers') !== -1;

    // #############-------   INIT   -------#############
    setTimeout(function () {
        parent.window.postMessage('{"act" : "loaded_btn","widget_id" : "' + widget_id + '"}', '*');
    }, 500);

    parent.window.postMessage(JSON.stringify(widget_settings), '*');

    // #############-------   Общее   -------#############
    $(document).on('click', '.widget_init_button', function () {
        b_open_widget = true;
        b_hover = true;
        b_help = false;

        clearInterval(showClear)
        parent.window.postMessage('{"act" : "hide_help_now","widget_id" : "' + widget_id + '"}', '*');
        parent.window.postMessage('{"act" : "action_tip", "widget_id" : "' + widget_id + '", "action_type" : "hide"}', '*');
        first_bug_shown = true;

        if (MESSENGERS_TYPE) {
            setTimeout(function() {
                $('.widget_init_button').hide('fade', {}, animation_speed, function () {
                    CloseHelp(function () {
                        parent.window.postMessage('{"act" : "init_widget","widget_id" : "' + widget_id + '"}', '*');
                        $('.messengers_containers').show('fade', {});
                    });
                });
            }, 100)
        } else {
            setTimeout(function() {
                CloseHelp(function () {
                    parent.window.postMessage('{"act" : "init_widget","widget_id" : "' + widget_id + '"}', '*');
                });
                b_help = true;
            }, 100)
        }
    });

    /********INIT************************/
    if (button_type == 'line') {
        $('<span>').attr('id', 'tmp_count').css({
            'position': 'absolute',
            'visibility': 'hidden',
            'height': 'auto',
            'width': 'auto',
            'white-space': 'nowrap',
            'font-size': '15px',
            'padding': '0 21px 0 52px'
        }).html($('.widget_button p').text()).appendTo('body');
        var w = $('#tmp_count').get(0).clientWidth + 2;
        w = w > 180 ? w : 180;
        w = w < 400 ? w : 400;
        $('#tmp_count').remove();
        $('.widget_button').css('width', w + 'px');
        parent.window.postMessage('{"act" : "resize_button", "value" : "' + $('.widget_button').width() + '", "widget_id" : "' + widget_id + '"}', '*');
    }
    if(b_help)
    {
        // !!! стили темы для подсказки 06,01,2021
        theme_css = $('#widget_help_container').cssGet(['borderColor', 'backgroundColor', 'color']);
        theme_css = JSON.stringify(theme_css).replace(/["']/g, "'");
        // console.log(theme_css)
        hint_text = $('#widget_help_container').text().trim();

        parent.window.postMessage('{"act" : "update_help", "widget_id" : "' + widget_id + '", "theme_css" : "' + theme_css + '", "hint_text" : "' + hint_text + '"}', '*');

        ShowHelp();
    }
    if (button_type !== 'line' && widget_type !== 'mail') {
        // @@@ наполнение для tip
        let arr_tip_info = [];

        // let tip_css = $( ".widget_button_tip" ).css( "cssText" );
        // tip_css = tip_css.toString().replace(/["']/g, "'");

        let tip_css = $( ".widget_button_tip" ).cssGet(['backgroundColor', 'color']);
        tip_css = JSON.stringify(tip_css).replace(/["']/g, "'");

        // console.log(tip_css)

        $('.widget_button_tip').each(function() { arr_tip_info.push({text: $(this).text().trim(), type: tip_type($(this).parent()).toString().replace('messenger_', '') }) })

        let tip_info = JSON.stringify(arr_tip_info).replace(/["']/g, "'");
        // console.log( tip_info )

        parent.window.postMessage('{"act" : "update_tip", "widget_id" : "' + widget_id + '", "tip_css" : "' + tip_css + '", "tip_info" : "' + tip_info + '"}', '*');
    }

    $(".widget_button.messenger_link a").hover(
        function () {
            let container = $(this).parent();
            let type = tip_type(container).toString().replace('messenger_', '');

            let first_type = tip_type($(".widget_button.messenger_link").first()).toString().replace('messenger_', '');
            if (first_bug_shown && (type == first_type)) { // фикс бага отображения подсказки канала при первом раскрытии messengers_containers
                first_bug_shown = false;
                return
            }
            first_bug_shown = false;

            clearInterval(timerId);
            
            parent.window.postMessage('{"act" : "action_tip", "widget_id" : "' + widget_id + '", "action_type" : "show", "btn_type" : "' + type + '"}', '*');
        },
        function () {
            timerId = setTimeout(function () {
                parent.window.postMessage('{"act" : "action_tip", "widget_id" : "' + widget_id + '", "action_type" : "hide"}', '*');
            }, 1);
        }
    );
});

function FullScreen(state) {
    if (state) {
        b_full_screen = true;
        parent.window.postMessage('{"act" : "btn_resize","widget_id" : "' + widget_id + '","b_full_screen":1}', '*');
        $('body').addClass('full_screen');
    } else if (b_full_screen) {
        b_full_screen = false;
        parent.window.postMessage('{"act" : "btn_resize","widget_id" : "' + widget_id + '","b_exit_full_screen":1}', '*');
        $('body').removeClass('full_screen');
    }
}

function ShowHelp_(b_ignore) {
    // console.log(cnt_show_help, cnt_showed_help)
    if (!$('.messengers_containers:visible').length) {
        if(cnt_show_help > cnt_showed_help) {
            b_help = true;
        }
    } 
    
    if (!b_help)
        return false;
    if (cnt_show_help != 'click' && cnt_show_help != 0) {
        var tmp = parseInt(cnt_show_help);

        if (cnt_showed_help >= tmp) {
            // parent.window.postMessage('{"act" : "update_size_btn","widget_id" : "' + widget_id + '"}', '*');
            b_help = false;
            return;
        }
    } 
        
    parent.window.postMessage('{"act" : "show_help","widget_id" : "' + widget_id + '", "help_w" : "' + help_w + '", "help_h" : "' + help_h + '"}', '*');
    

    // Internet Explorer 6-11
    // var isIE = /*@cc_on!@*/ false || !!document.documentMode;

    // setTimeout переопределение help_h
    // if ($(window)[0].screen.width <= 480 && !isIE) {
    //     setTimeout(function () {
    //         CloseHelp();
    //         help_h = $('#widget_help_tmp').outerHeight();
    //         parent.window.postMessage('{"act" : "show_help","widget_id" : "' + widget_id + '", "help_w" : "' + help_w + '", "help_h" : "' + help_h + '"}', '*');
    //         $('.widget_help').show('fade');
    //     }, 500)
    // } else {
        // $('.widget_help').show('fade');
    // }

    // if (!b_ignore) {
        // cnt_showed_help++;
    // }
}

function CloseHelp(callback, duration) {
    if (!duration) {
        duration = animation_speed;
    }
    if (!callback) {
        callback = function () {}
    }

    if (!b_help) {
        if (duration <= 1) {
            return callback();
        } else {
            return setTimeout(function () {
                callback()
            }, duration);
        }
    }
    parent.window.postMessage('{"act" : "hide_help","widget_id" : "' + widget_id + '"}', '*');

    // $('.widget_help').hide('fade', {}, duration, callback);
}

function ShowHelp() {
    if (!b_help)
        return;
    if (b_help_type == 'now') {
        ShowHelp_();
    } else if (b_help_type == 'time') {
        setTimeout(function () {
            if (b_open_widget)
                return;
            ShowHelp_();
        }, help_time * 1000);
    } else if (b_help_type == 'hover' && !b_init_hover) {
        var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if ((isSafari && iOS) || navigator.userAgent.match(/Android/i)) {
            return;
        }
        b_init_hover = true;

        var b_hover = false;
        // fixed 10.07.20
        $(".widget_init_button").hover(
            function () {
                if (b_hover) {
                    return;
                }

                showClear = setTimeout(function () {
                    ShowHelp_(true);
                }, 200);
            },
            function () {
                clearInterval(showClear)
                // console.log('123456', b_hover, !b_help)
                if (b_hover) {
                    return;
                }
                if (!b_help)
                    return;

                CloseHelp()
                // parent.window.postMessage('{"act" : "hide_help", "widget_id" : "' + widget_id + '", "theme_css" : "' + theme_css + '", "hint_text" : "' + hint_text + '"}', '*');
                
        //         $('.widget_help').hide('fade');
        //         if (!b_open_widget) {
        //             parent.window.postMessage('{"act" : "update_size_btn","widget_id" : "' + widget_id + '"}', '*');
        //         }
            }
        );
    }
}

// get css rules
$.fn.cssGet = function (propertyArray) {
    //create an output variable and limit this function to finding info for only the first element passed into the function
    var output = {},
        self   = this.eq(0);

    //iterate through the properties passed into the function and add them to the output variable
    for (var i = 0, len = propertyArray.length; i < len; i++) {
        output[propertyArray[i]] = this.css(propertyArray[i]);
    }
    return output;
};

function tip_type(btn) {
    let tempArr = $(btn).attr('class').split(' ')
    return tempArr.filter(function(el) {
        if(el.indexOf('messenger_') !== -1 && el.indexOf('messenger_link') == -1) {
            return el
        } 
    })
}

function listener(event) {
    if (event.data == 'gOmniListShow') {
        $('.widget_init_button').click();
        return;
    } else if (event.data == 'gOmniListHide') {
        $('.messenger_close').click();
        return;
    } else if (event.data == 'show_help') {
        b_open_widget = false;
        if (!b_help)
            return false;
        if (b_help_type != 'hover')
            ShowHelp();
        return;
    } else if (event.data == 'show_widget') {
        b_open_widget = true;
        
        //  фикс переоткрытия для кастом кнопки виджета
        b_help = false;

        if ($('.messengers_containers:visible').length) {
            $('.messengers_containers').hide('fade', {}, animation_speed, function () {
                parent.window.postMessage('{"act" : "messenger_close","widget_id" : "' + widget_id + '"}', '*');
                
                $('.widget_init_button').show('fade');
                
                if (b_help) {
                    ShowHelp();
                }
            });
            
            b_open_widget = false;
        } else {
            CloseHelp(function () {
                parent.window.postMessage('{"act" : "init_widget","widget_id" : "' + widget_id + '"}', '*');
                $('.messengers_containers').show('fade', {});
            }, -1);
        }
        return
    } else if (event.data == 'offOmniChatra') {
        if($('.messengers_containers').length && $('.messengers_containers .widget_button.messenger_chat').length) {
            $('.messengers_containers .widget_button.messenger_chat').hide()
        }
        return;
    }
}

if (window.addEventListener) {
    window.addEventListener("message", listener);
} else {
    // IE8
    window.attachEvent("onmessage", listener);
}