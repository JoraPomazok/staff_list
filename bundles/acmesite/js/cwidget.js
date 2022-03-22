 /**
 * Created by drux on 25.12.2015.
 */
window.ODW = {
    g_url: 'https://omnidesk.ru',
    g_iframe_button_id: 'omni_widget_iframe',
    g_iframe_widget_id: 'omni_widget_iframe_widget',
    g_config: null,
    config_widget : null,
    email_widget: null,
    g_iframe_button: null,
    g_iframe_widget: null,
    type_widget : null,
    b_send : false,

    PreLoad: function () {
        this.g_config['diplay_button'] = true; this.g_config['user_info'] = false;
        if (!this.g_config.widget_id) {
            console.log('err; not found widget_id');
            return false;
        }
        if(this.g_config.user)
        {
            for (var j in this.g_config.user) {this.g_config[j] = this.g_config.user[j];}
            delete(this.g_config.user);
        }
        if(this.email_widget)
        {
            this.type_widget = 'email';
        }

        var body = document.getElementsByTagName("body")[0];
        var tmp_interval = setInterval(function () {
            if (typeof jQuery === 'undefined') {
                var s= document.createElement("script");
                s.type="text/javascript";
                s.async=!0;
                s.src = ODW.g_url+"/bundles/js_vendor/jquery-1.10.2.min.js";
                body.parentNode.appendChild(s,body);
            }
            else {
                ODW.LoadWidgetData();
                clearInterval(tmp_interval);
            }
        }, 1000)
    },
    Ready : function()
    {
        if(this.email_widget.readyQueue[0])
            this.email_widget.readyQueue[0]();
        if(document.getElementsByClassName('omni-email-widget')[0]) {
            document.getElementsByClassName('omni-email-widget')[0].onclick = function () {
                ODW.RenderWidget();
                return false;
            }
        }
        setTimeout(function()
        {
            if (ODW.g_config.diplay_button)
                ODW.RenderButton();
        },500);

    },
    LoadWidgetData: function()
    {
        var body = document.getElementsByTagName("body")[0];
        //в будущем смотреть this.type_widget и уже от типа загружать нужный контент
        if(this.g_config.diplay_button) {
            this.g_iframe_button = document.createElement('iframe');
            this.g_iframe_button.id = this.g_iframe_button_id;
            this.g_iframe_button.name = this.g_iframe_button_id + '_name';
            this.g_iframe_button.scrolling="no";
            this.g_iframe_button.style.position = 'absolute';
            this.g_iframe_button.style.top = '-1000px';
            this.g_iframe_button.style.width = '1000px';
            this.g_iframe_button.style.height = '100px';

            this.g_iframe_button.src = this.g_url+'/client_widgets/init/' + this.g_config.widget_id;
            body.appendChild(this.g_iframe_button, body);
        }
        this.g_iframe_widget = document.createElement('iframe');
        this.g_iframe_widget.id   = this.g_iframe_widget_id;
        this.g_iframe_widget.name = this.g_iframe_widget_id + '_name';
        this.g_iframe_widget.style.display = 'none';


        this.g_iframe_widget.src = this.g_url+'/client_widgets/widget/' + this.g_config.widget_id;

        body.appendChild(this.g_iframe_widget,body);
    },
    RenderButton : function()
    {
        if(!this.config_widget)
            return false;
        var settings = this.config_widget.settings;
        var css = {
            'background': 'transparent',
            'border': 'none',
            'position': 'fixed',
            'z-index': '2000',
            'top' : 'auto'
        };

        if( settings.button_type == 'square')
        {
            css[settings.button_position]  = '20px';
            css['bottom'] = '20px';
            css['width']  = settings.ico_size_pixels+'px';
            css['height'] = settings.ico_size_pixels+'px';
        }
        else if( settings.button_type == 'line' && (settings.button_position == 'bottom_left' || settings.button_position == 'bottom_right'))
        {
            css[settings.button_position.substr(7)]  = '20px';
            css['bottom'] = '0px';
            if (this.g_config.width_button)
            {
                css['width'] = this.g_config.width_button;
            }
            else
            {
                css['min-width'] = '300px';
                css['max-width'] = '380px';
            }


            css['height'] = '36px';
        }
        else if(  settings.button_type == 'line' && (settings.button_position == 'left' || settings.button_position == 'right'))
        {

            css[settings.button_position]  = '0px';
            css['top'] = '50%';
            css['width']  = '36px';
            css['height'] = this.g_config.width_button ? this.g_config.width_button+'px' : '180px';
            css['margin-top'] = this.g_config.width_button ? '-'+(this.g_config.width_button/2)+'px' : '-90px'; //-половина высоты
        }

        jQuery(this.g_iframe_button).css(css).show();
    },
    RenderWidget : function()
    {
        jQuery(this.g_iframe_widget).css({
            'background': 'transparent',
            'border': 'none',
            'position': 'fixed',
            'z-index': '2000',
            'width':'100%',
            'height' : '100%',
            'top' : '0px',
            'bottom' : '0px',
            'left' : '0px',
            'right' : '0px',
            'margin_top' : '0px'
        }).show();

        setTimeout(function()
        {
            ODW.g_iframe_widget.contentWindow.focus();
            ODW.g_iframe_widget.focus()
        },1000);


    },
    CloseWidget : function() {
        jQuery(this.g_iframe_widget).hide();
        if(this.b_send)
        {
            this.g_iframe_widget.src = this.g_url + '/client_widgets/widget/' + this.g_config.widget_id;
            this.b_send = false;
        }

    },
    listen_iframe: function (e) {
        if(e.data && e.origin == this.g_url)
        {
            data = e.data;
            data = data.replace(/\n/g,' ');
            data = jQuery.parseJSON(data);
//            console.log(data);
            if(data['act'] && data['act'] == 'init_widget')
            {
                this.RenderWidget();
                if(this.config_widget['type'] == "knowledge_mail" && this.config_widget['settings']['knowledge_type'] == "search")
                {
                    window.frames[this.g_iframe_widget_id + '_name'].postMessage('focus_search', this.g_url);
                }
                if(this.config_widget['type'] == "mail")
                {
                    window.frames[this.g_iframe_widget_id + '_name'].postMessage('update_form', this.g_url);
                }


            }
            else if(data['act'] && data['act'] == 'resize_button')
            {
                this.g_config.width_button = data['value'];
            }

            else if(data['act'] && data['act'] == 'close_widget')
            {
                return this.CloseWidget();
            }
            else if(data['act'] && data['act'] == 'success_send')
            {
                this.b_send = true;
            }
            else if(data['act'] && data['act'] == 'loaded_widget')
            {
                if(this.type_widget == 'email')
                {
                    var params = {
                        'user_info' : this.g_config.user_info ? {'location':window.location.href,'ua': navigator.userAgent } :false,
                        'identify' : this.email_widget.identify||null,
                        'case_subject' : this.email_widget.case_subject||null,
                        'search_str' : this.email_widget.search||null,
                    };
                    window.frames[this.g_iframe_widget_id + '_name'].postMessage(this.ObjToStr( params ),this.g_url);
                }

            }
            else if(data.widget_id && !this.config_widget)
            {
                this.config_widget = data;
                this.Ready();
            }
        }
    },
    ObjToStr : function(o,quotes){
    quotes = quotes ? quotes : '"';

    var parse = function(_o,_quotes){
        var a = [], t;

        for(var p in _o){

            if(_o.hasOwnProperty(p)){

                t = _o[p];

                if(t && typeof t == "object")
                {
                    a[a.length]= _quotes+p+_quotes + ":{ " + arguments.callee(t,_quotes).join(", ") + "}";
                }
                else// if (t)
                {
//                    console.log(p+":"+t);

                    if(typeof t == "string"){
//                        a[a.length] = [ '"'+p+'"'+ ": \"" + encodeURI(t.toString().replace(/\"/g,'\\"').replace(/\n/g,"\\n")) + "\"" ];
                        a[a.length] = [ _quotes+p+_quotes+ ": "+_quotes  + encodeURIComponent(t.toString()) + _quotes ];
                    }
                    else if(t){
                        a[a.length] = [ _quotes+p+_quotes+ ": " + t.toString()];
                    }

                }
            }
        }

        return a;
    };

    return "{" + parse(o,quotes).join(", ") + "}";
}

};
!function(){
    for (var j in omni) {ODW[j] = omni[j];} ODW.PreLoad();
    if (typeof window.addEventListener != 'undefined')
        window.addEventListener('message', function(e){ODW.listen_iframe(e)}, false);
    else if (typeof window.attachEvent != 'undefined')
        window.attachEvent('onmessage', function(e){ODW.listen_iframe(e)});
}();
