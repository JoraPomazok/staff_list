var cnt_to_socket = 0;
var log_socket = [];
var b_js_debug = false;
var tstamp_last_send_to_slack = 0;
var b_local_storage = CheckLocalStorage();
var websockets_url = {
    'pusher_socket'    : 'https://ws.omnidesk.ru/wss_pusher',
    'staff_activities' : 'wss://'+window.location.host+'/wss'
};
var websockets_conn = {
    'pusher_socket'    : null,
    'staff_activities' : null
};
var websockets_channels = {
    'pusher_socket'    : {},
};
var global_interval = {};
function InitSocketPusher()
{
    let param_connect = {};
    if(window.location.host.match(/.omnid\.ru/)
    || window.location.host.match(/.omnidesk\.test/))
    {
        pusher_port = 9980;
        // var randomInteger = function (min, max) {
        //     var rand = min - 0.5 + Math.random() * (max - min + 1)
        //     rand = Math.round(rand);
        //     return rand;
        // };
        // pusher_port =  randomInteger(pusher_port,pusher_port+2);
        websockets_url.pusher_socket    = (window.location.protocol.match(/https/) ? 'wss' : 'ws')+'://'+window.location.host+':'+pusher_port+'/wss_pusher';
        websockets_url.staff_activities = (window.location.protocol.match(/https/) ? 'wss' : 'ws')+'://'+window.location.host+':9990';
        param_connect['reconnection'] = false;
    }
    else if(window.location.host.match(/\-dev\.omnidesk\./)
    || window.location.host.match(/\-front[0-9]\.omnidesk./))
    {
        // websockets_url.pusher_socket = 'wss://'+window.location.host+'/wss_pusher';
        var h = window.location.host.split('.');
        delete h[0];
        h =  'ws'+h.join('.')+'/wss_pusher';
        websockets_url.pusher_socket = h;
    }
    else if(window.location.host.match(/\.omnidesk\.pro/))
    {
        websockets_url.pusher_socket = 'https://ws.omnidesk.pro/wss_pusher';
    }
    // else if(window.location.host.match(/dru2\.omnidesk\.ru/))
    // {
    //     websockets_url.pusher_socket = 'wss://'+window.location.host+'/wss_pusher';
    // }
    var _cases_id = (window.GetCaseId ? GetCaseId() : 0);
    if(window.location.href.match(/\/cases\/list/))
    {
        //на стр списка нужно передать все идшники тикетов, которые отображаются у сотрудника на данный момент
        _cases_id = getIdsOnListPage();
    }

    websockets_url.pusher_socket += '?client_id='+(window.client_id ? client_id : 0)
                                   +'&staff_id='+(window.staff_id ? staff_id : 0)
                                   +'&case_id='+_cases_id
                                   +(window.client_chanel ? '&client_chanel='+client_chanel : '')
                                   +(window.b_admin_logged ? '&b_admin=1' : '');
    websockets_conn.pusher_socket = io(websockets_url['pusher_socket'],param_connect);
    var omni_connected = false;

    websockets_conn.pusher_socket.on('connect', function ()
    {
        cnt_to_socket++;
        if(websockets_channels.pusher_socket && omni_connected)
        {
            for (var i in websockets_channels.pusher_socket)
            {
                OmniPusherSubscribe(i,true);
            }
        }

        if(window.client_chanel)
        {
            // websockets_conn.pusher_socket.emit('subscribe', client_chanel);
            OmniPusherSubscribe(client_chanel);
        }
        if(window.staff_chanel)
        {
            // websockets_conn.pusher_socket.emit('subscribe', staff_chanel);
            OmniPusherSubscribe(staff_chanel);

        }
        if(window.current_case_channel &&  current_case_channel.length)
        {
           // websockets_conn.pusher_socket.emit('subscribe', current_case_channel);
            OmniPusherSubscribe(current_case_channel)
        }
        if(window.client_chanel_page &&  client_chanel_page.length)
        {
            // websockets_conn.pusher_socket.emit('subscribe', current_case_channel);
            OmniPusherSubscribe(client_chanel_page)
        }
        if(window.omni_pusher_channels && omni_pusher_channels.length)
        {
            for (var i in omni_pusher_channels)
            {
                // websockets_conn.pusher_socket.emit('subscribe', omni_pusher_channels[i]);
                OmniPusherSubscribe(omni_pusher_channels[i])


            }
        }
        omni_connected = true;
        if(cnt_to_socket>1)
        {
            if(window.IsChatPage && IsChatPage() && window.ChatId && !window.is_archive)
            {
                xajax_ShowChatHistory(ChatId);
                xajax_UpdateLeftPanel(ChatId)
            }
        }
        if(window.staff_chanel)
        {
            OmniPusherSendToChannel(staff_chanel,'OmniPusherConnect',{});
        }

    });
    websockets_conn.pusher_socket.on('message', function (msg)
    {
        if(b_js_debug)
        {
            console.log(msg);
        }
        if(!msg.func)
        {
            return;
        }
        if (log_socket.length>50)
        {
            log_socket = [];
        }
        log_socket.push(msg);
        if(window['op_'+msg.func])
        {
            window['op_'+msg.func](msg.data);
        }
        else if(websockets_channels.pusher_socket[msg.channel]
            && websockets_channels.pusher_socket[msg.channel]['callback'][msg.func]
        )
        {
            websockets_channels.pusher_socket[msg.channel]['callback'][msg.func](msg.data);
            // console.log(websockets_channels.pusher_socket[msg.channel]['callback'],msg.func);
        }

    });
    websockets_conn.pusher_socket.on('connect_error', function (msg)
    {
        // SendToTestSlack(window.location+' ; '+(window.CurrentStaffId?CurrentStaffId:0)+'; connect_error: '+msg.toString()+'; '+websockets_url.pusher_socket)
    });

    websockets_conn.pusher_socket.on('reconnect_error', function (msg)
    {
        // SendToTestSlack(window.location+' ; '+(window.CurrentStaffId?CurrentStaffId:0)+' ; reconnect_error: '+msg.toString()+'; '+websockets_url.pusher_socket)
    });
    websockets_conn.pusher_socket.on('_ping', function(data) {
        websockets_conn.pusher_socket.emit('_pong', 1);
    });


}
function OmniPusherSubscribe(channel,b_reconnect)
{
    if(!websockets_channels.pusher_socket[channel])
    {
        websockets_channels.pusher_socket[channel] = {
            b_subscribe: false,
            callback: {},
            bind: function (name, callback) {
                this.callback[name] = callback;

            }
        };
    }

    var tmp_p_interval = setInterval(function () {
        if (websockets_conn.pusher_socket && websockets_conn.pusher_socket.connected)
        {
            if(!websockets_channels.pusher_socket[channel] ||
                !websockets_channels.pusher_socket[channel].b_subscribe ||
               b_reconnect)
            {
                websockets_conn.pusher_socket.emit('subscribe', channel);
                if (!websockets_channels.pusher_socket[channel]
                && channel.match(/^chat_chanel_/))
                {
                    SubscribeToChatChanel(channel);
                    console.log('re-subscribe');
                }
                else
                {
                    websockets_channels.pusher_socket[channel].b_subscribe = true;
                }
            }
            clearInterval(tmp_p_interval)
        }
    },100);

    return websockets_channels.pusher_socket[channel];
}
function OmniPusherUnSubscribe(channel)
{
    var tmp_p_interval = setInterval(function () {
        if (websockets_conn.pusher_socket && websockets_conn.pusher_socket.connected)
        {
            websockets_conn.pusher_socket.emit('unsubscribe', channel);
            UnsetPusherChanelByChannel(channel);
            delete websockets_channels.pusher_socket[channel];
            clearInterval(tmp_p_interval)
        }
    },500);
}
function OmniPusherSendToChannel(channel,func,data)
{
    if(!channel)
    {
        false;
    }
    OmniPusherSend('send_to_browser', {
        'channel' :channel,
        'func' : func,
        'data' : data
    });
}
function OmniGetListPagesBrowser(channel,func)
{
    if(!channel)
    {
        false;
    }
    OmniPusherSend('get_list_page_staff', {
        'channel' :channel,
        'func' : func
    });
}
function OmniPusherSend(command,data,b_raw)
{
    if(!data)
    {
         data = '';
    }
    if(b_raw)
    {
        if (websockets_conn.pusher_socket && websockets_conn.pusher_socket.connected)
        {
            data['channel_type'] = GetTypeChannelFromChannel(data['channel']||''),
                websockets_conn.pusher_socket.emit(command,data);
            clearInterval(tmp_p_interval)
        }
        return true;
    }
    var tmp_p_interval = setInterval(function () {
        if (websockets_conn.pusher_socket && websockets_conn.pusher_socket.connected)
        {
            data['channel_type'] = GetTypeChannelFromChannel(data['channel']||''),
            websockets_conn.pusher_socket.emit(command,data);
            clearInterval(tmp_p_interval)
        }
    },500);
}
function op_OmniPusherDisconnect(msg)
{
    if(window.location.href.match(/\/cases\/record/)
        || window.location.href.match(/\/cases\/chat/)
        || window.location.href.match(/\/cases\/list/)
    )
    {
        if(msg.staff_id && msg.case_id && staff_collision_data[msg.staff_id] && staff_collision_data[msg.staff_id][msg.case_id])
        {
            delete staff_collision_data[msg.staff_id][msg.case_id];
            tstamp_staff_collision_data = new Date().getTime();
        }
    }
    if(window.CurrentStaffId && msg.staff_id == CurrentStaffId)
    {
        InitStatusList();
    }
}
function op_OmniPusherConnect(msg)
{
     InitStatusList();
}
function op_OmniLeaveChat(msg)
{
    if(window.location.href.match(/\/cases\/record/)
        || window.location.href.match(/\/cases\/chat/)
        || window.location.href.match(/\/cases\/list/)
    )
    {
        if(msg.staff_id && msg.case_id && staff_collision_data[msg.staff_id] && staff_collision_data[msg.staff_id][msg.case_id])
        {
            delete staff_collision_data[msg.staff_id][msg.case_id];
            tstamp_staff_collision_data = new Date().getTime();
        }
    }
}

function xAjaxCall(f,arg,callback,b_abort)
{
    if(b_abort
        && xajax_process['ajax_'+f] )
    {
        xajax.abortRequest(xajax_process['ajax_'+f])
    }
    var params = { parameters: arg };
    if(callback)
    {
        var cb = xajax.callback.create();
        cb.onComplete = callback;

        params['callback'] = cb;
    }
    return xajax.request( { xjxfun: 'ajax_'+f }, params );
}
function BtnLoading(el,key,b_on)
{
    var spin_html = '<button class="processing-button brdrds" id="spin_button_update_'+key+'" style="width: '+$(el).outerWidth()+'px;height: '+$(el).outerHeight()+'px; display: block;" onclick="return false;"><span class="icon icon-spinner icon-spin"></span></button>';
    if(b_on)
    {
        if($('#spin_button_update_'+key).length)
        {
            $('#spin_button_update_'+key).show();
        }
        else
        {
            $(el).after(spin_html);
        }
        $(el).hide();
    }
    else
    {
        $('#spin_button_update_'+key).hide();
        $(el).show();
    }
}
function NotifyNoteStaff(str,el_redactor)
{
    if(el_redactor)
    {
        el_redactor = $(el_redactor.nodes[0])
    }
    var container = '.notify_note_staff';
    //В заметке о переоткрытии можно выбрать себя
    var curr_staff = window.CurrentStaffId && !$(el_redactor).hasClass('reopen_note') ? window.CurrentStaffId : 0;
    if($(el_redactor).attr('id') && $(el_redactor).attr('id').match(/set_reopen/))
    {
        curr_staff = 0
    }
    if(typeof  str == 'string')
    {
        $(container+' li').hide();
        var b_found = true;
        $(container+' h4').hide();
        //search
        var cnt = 0,
            cnt_groups = 0,
            cnt_staffs = 0;
        if(str.length)
        {
            $(container+' li').each(function ()
            {
                var val = $(this).text();
                var rel = $(this).attr('rel');
                if(val.match(new RegExp(str, 'gi')) && rel !== 's'+curr_staff)
                {
                    $(this).show();
                    cnt++;
                    if(rel.substring(0,1) == 'g')
                    {
                        cnt_groups++;
                    }
                    else
                    {
                        cnt_staffs++;
                    }
                }
                else
                {
                    $(this).hide();
                }
            });
            if(!cnt)
            {
                b_found = false;
            }
        }
        else
        {
            var _cnt_groups = 0,
                _cnt_staffs = 0;
            $(container+' li').each(function () {
                var rel = $(this).attr('rel').substring(0,1);
                if(rel == 'g' && _cnt_groups<10)
                {
                    $(this).show();
                    _cnt_groups++;
                }
                if(rel == 's' && $(this).attr('rel') !== 's'+curr_staff && _cnt_staffs<10)
                {
                    $(this).show();
                    _cnt_staffs++;
                }
            });
            $(container+' h4').show();
        }

        //
        if(b_found)
        {
            if (cnt_staffs > 0)
            {
                $(container + ' h4:eq(0)').show();
            }
            if (cnt_groups > 0)
            {
                $(container + ' h4:eq(1)').show();
            }
            var case_response = el_redactor ? el_redactor : GetCaseResponse();
            $(container).show();
            $('.nano').nanoScroller({alwaysVisible: true});
            if (case_response.hasClass('chat_msg_win_box'))
            {
                $(container).css({
                    'left' : ($(case_response).parents('.redactor-box').offset().left-11) + 'px',
                    'top'  : ($(case_response).parents('.redactor-box').offset().top - 2 - $('.notify_note_staff').height() ) + 'px'
                });
            }
            else if ($(case_response).parents('.text-area-box').length)
            {
                $(container).css({
                    'left': ($(case_response).parents('.text-area-box').offset().left) + 'px',
                    'top': ($(case_response).parents('.request-answer-area').offset().top - 1 - $('.notify_note_staff').height() ) + 'px'
                });
            }
            else
            {
                $(container).css({
                    'left' : ($(case_response).parents('.redactor-box').offset().left) + 'px',
                    'top'  : ($(case_response).parents('.redactor-box').offset().top - 1 - $('.notify_note_staff').height() ) + 'px'
                });

            }


            $(container+' li').removeClass('highlight');
            $(container+' li:visible:first').addClass('highlight');

        }
        else
        {
            $(container).hide();
        }
    }
    else
    {
        $(container).hide();
    }
}
function GetMentionStr(id)
{
    var el = $('.notify_note_staff li[rel='+id+']');
    if(el.length)
    {
        var id = el.attr('rel');
        var name = el.clone();


        name.find('div').remove();

        name = name.find('a').html();

        return '<notify rel="' + id + '">' + (id.substring(0, 1) == 'g' ? '@' : '') + $.trim(name) + '</notify>';
    }
    return '';
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            if(successful)
            {
                var audio = new Audio('/bundles/notification_sounds/copy_ticket_1.wav');
                audio.play();
            }
            // console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            // console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        var audio = new Audio('/bundles/notification_sounds/copy_ticket_1.wav');
        audio.play();

        // console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        // console.error('Async: Could not copy text: ', err);
    });

}
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
function GetCaseId()
{
    var CheckCaseId = 0;
    if(window.location.href.match(/staff\/cases\/record/) && window.CurrentCaseId)
    {
        CheckCaseId = window.CurrentCaseId;
    }
    else if(typeof(ChatId) != 'undefined' && ChatId) {
        CheckCaseId = ChatId;
    }
    else if($('#case_id').length) {
        CheckCaseId = $('#case_id').val();
    }
    else if (window.CurrentCaseId )
    {
        CheckCaseId = window.CurrentCaseId;
    }
    return CheckCaseId;
}
function getIdsOnListPage()
{
    var tmp = [];
    $('.req-data-row').each(function(){
        tmp.push(this.id.substr(10));
    });
    return tmp.join(';');

}
function SendToTestSlack(t)
{
    if(tstamp_last_send_to_slack+10>(parseInt(new Date().getTime()/1000)))
    {return}

    tstamp_last_send_to_slack = parseInt(new Date().getTime()/1000);
    $.ajax({
        data: 'payload=' + JSON.stringify({
            "text": t+'; UA: '+(window.navigator?window.navigator.userAgent:'')
        }),
        dataType: 'json',
        processData: false,
        type: 'POST',
        url: 'https://hooks.slack.com/services/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'
    });


}
function CheckLocalStorage()
{
    if (typeof localStorage === 'object') {
        try {
            localStorage.setItem('localStorage', 1);
            localStorage.removeItem('localStorage');
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}

function insertTextAtCursor(el, text, offset) {
    var val = el.value, endIndex, range, doc = el.ownerDocument;
    if (typeof el.selectionStart == "number"
            && typeof el.selectionEnd == "number") {
        endIndex = el.selectionEnd;
        el.value = val.slice(0, endIndex) + text + val.slice(endIndex);
        el.selectionStart = el.selectionEnd = endIndex + text.length+(offset?offset:0);
    } else if (doc.selection != "undefined" && doc.selection.createRange) {
        el.focus();
        range = doc.selection.createRange();
        range.collapse(false);
        range.text = text;
        range.select();
    }
}
function GetTypeChannelFromChannel(channel)
{
    if (channel.match('client_chanel_chat_'))
    {
        return 'client_chats';
    }
    if (channel.match('client_chanel_'))
    {
        return 'client';
    }
    if (channel.match('staff_chanel_'))
    {
        return 'staff';
    }
    if (channel.match('group_chanel_'))
    {
        return 'group';
    }
    if (channel.match('chat_chanel_'))
    {
        return 'chat';
    }
    return 'n/a';
}

var omniLang = {
    lang : {
        'open': [
            'открытое',
            'открытых',
            'открытых'
        ],
        'cases': [
            'обращение',
            'обращения',
            'обращений'
        ],
        'time_min': [
            'минута',
            'минуты',
            'минут'
        ],
        'time_hour': [
            'час',
            'часа',
            'часов'
        ]
    },
    getStaffLangPhrase : function (code,count) {
        return this.getLangPhrase(code,count)

    },
    getLangPhrase : function (code,count)
    {
        var lang_arr = this.lang[code] ? this.lang[code] : null;


        //определяем последнюю цифру количества
        count = count.toString();
        var l = 0, pl = 0;
        if (count) {
            l = count[(count.length)-1];
            pl = (count > 9) ? count[(count.length)-2] : 0;
        }

        var check_count = 0;
        if (l >= 2 && l <= 4 && pl != 1) {
            check_count = 1;
        }
        else if (l >= 5 && l <= 9 || l == 0 || pl == 1) {
            check_count = 2;
        }

        //возвращаем перевод
        return lang_arr[check_count] ? lang_arr[check_count] : 'UNKNOWN PHRASE';
    }
};

//
$(document).ready(function(){
  $('body').on('click', '.notifications .wrapper .noti_wrap.n_yellow .n_close i', function(){

    if($('.notifications .wrapper .noti_wrap.n_yellow .text input[name="wazzup_client_id"]').length)
    {
      var element = $('.notifications .wrapper .noti_wrap.n_yellow .text input[name="wazzup_client_id"]').first();
      var url = element.val();
      $.ajax({
        method: "GET",
        url: url
      });
    }
  })
});
