var start_page_tstamp = GetCurrentTstamp();
var omni_autocaptcha_sec = 15;
function InitCfDatepickers(b_all,b_set_event)
{
    //DATE//
    $('.input_calendar_ico input'+(!b_all ? ':visible' : '')).each(function () {

        var _self = $(this);
        $(this).attr('readonly','readonly').css('cursor','pointer');
        $(this).attr('data-b_set_event',b_set_event?1:0);
        var val = $(this).val().split('.');
        var dp = $(this).datepicker({
            // minutesStep:5,
            // timepicker: true,
            // dateFormat: 'dd.mm.yyyy',
            // startDate: new Date(val),
            onShow: function (inst) {
                var parent_container = $(inst.el).parents('.sidebar-inner-request-filters');

                if ($(parent_container).length)
                {
                    var dropdown_height = 240;
                    var height = $(parent_container).height();
                    var pos = $(inst.el).offset().top - $($(parent_container)).offset().top;
                    var height_before = pos - dropdown_height;
                    var height_after = height - pos - dropdown_height;
                    if (height_before > height_after && height_after < 0)
                    {
                        inst.update({position: "top left"})
                    }
                    else
                    {
                        inst.update({position: "bottom left"})
                    }
                }
            },
            onSelect: function (formattedDate, date, inst) {
                inst.hide();
                $(_self).parent().find('i.fa-calendar').hide();
                $(_self).parent().find('i.fa-times').show();
                if(window.UpdateCaseParams)
                {
                    setTimeout(function() {
                        UpdateCaseParams();
                    },500)
                }
                else if (window.activeButt)
                {
                    activeButt();
                }

                if($(_self).attr('data-b_set_event'))
                {
                    $(_self).change();
                }
            }
        });
        if(val[1])
        {
            dp.data('datepicker').selectDate(new Date(val[2], val[1] - 1, val[0]));
        }
        else
        {
            dp.data('datepicker').clear();
            $(this).val('');
        }
        if($(this).parent().find('i.fa-calendar').length)
        {
            if(!$(this).parent().find('i.fa-times').length)
            {
                $(this).parent().append('<i class="fa fa-times" style="display: none; color: #a5a5a5;"></i>');
            }
            $(this).parent().find('i.fa-calendar')[0].onclick = function () {
                dp.data('datepicker').show();
            };
            $(this).parent().find('i.fa-times')[0].onclick = function (e) {
                e.preventDefault(); e.stopPropagation();
                _self.val('');
                dp.data('datepicker').clear();
                $(this).parent().find('i.fa-calendar').show();
                $(this).parent().find('i.fa-times').hide();
            };
            if(val[1])
           {
               $(this).parent().find('i.fa-calendar').hide();
               $(this).parent().find('i.fa-times').show();
           }
        }
    });


}
function GenUid(len)
{
    // return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, len);

    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < len; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function StripTags(str)
{

    return str ? str.replace(/<\/?[^>]+>/gi, '').replace(/&#x200b;/gi,'') : '';
}
function StripHtmlComment(str)
{
    return str ? str.replace(/<!--[\s\S]*?-->/g,'').trim() : '';
}
function GetCurrentTstamp()
{
    return parseInt(Date.now()/1000);

}
function AutoExpandField(field,min,max)
{
    var h = field.style.height;
    field.style.height = 'inherit';

    // Get the computed styles for the element
    var computed = window.getComputedStyle(field);

    // Calculate the height
    var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
        + parseInt(computed.getPropertyValue('padding-top'), 10)
        + field.scrollHeight
        + parseInt(computed.getPropertyValue('padding-bottom'), 10)
        + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    if((min && height<min)
        || (max && height>max)
    )
    {
        field.style.height = h
    }
    else
    {
        field.style.height = height + 'px';
    }
    if(window.session_id !== undefined) {
        if(window.mainContMinH())
        {
            mainContMinH();
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

/**
 * Convert HTML code to plain text.
 *
 * This function converts the html into plain text that is usable for marketing purposes,
 * so it supports things like bullet points and numbering.  It also supports a "hide-text" class,
 * which you can use to hide elements from the plain text version.
 */
function html2Text( html )
{
    var tagRegexp;

    // the following tags will be removed, but their contents will be maintained
    var tags_unwrap = [ 'a', 'b', 'span', 'i', 'em', 'u', 'strong', 'sup', 'center', 'font' ];

    // the following tags will be stripped, as well as their contents
    var tags_strip  = [ 'iframe', 'img', 'script', 'style', 'link', 'object', 'embed', 'table','figure','span'];

    // the following tags will include white space below
    var tags_block_level = [ 'p', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

    for( var i in tags_block_level )
    {
        tagRegexp = new RegExp( '\s+(\<'+tags_block_level[i]+'\>)' );
        html = html.replace( tagRegexp, '$1' );
    }

    // strip excess white space
    html = html.replace( /(\r\n|\r|\n)\s+/g, '\n' );

    tagRegexp = new RegExp( '\s*(<\/('+tags_block_level.concat(['div']).join('|')+')\s*>)\s+', 'gi' );
    html = html.replace( tagRegexp, '$1' );

    tagRegexp = new RegExp( '\s*(<('+tags_block_level.concat(['div']).join('|')+')(\s+[^>]+){0,1}>)\s+', 'gi' );
    html = html.replace( tagRegexp, '$1' );

    html = html.replace( /(\r\n|\r|\n)/g, '' );
    html = html.replace( /\s+/g, ' ' );

    // wrap in a div to allow modification
    $element = $( '<div>'+html+'</div>' );

    // we can add things to our html that we may want to exclude from the text
    // like call to action links
    $( '.hide-text', $element ).remove();

    // strip all the following tags, but keep the contents
    $( tags_unwrap.join(', '), $element ).each( function(){
        if(this.tagName == 'A')
        {
            $( this ).replaceWith( $( this ).attr('href') );
        }
        else
        {
            $( this ).replaceWith( $( this ).html() );
        }
    });

    // strip all the following tags, but keep the contents and add line breaks
    $( 'div', $element ).each( function(){
        $( this ).replaceWith( $( this ).html()+'\n' );
    });

    $( tags_block_level.join(', '), $element ).each( function(){
        $( this ).replaceWith( $( this ).html()+'\n\n' );
    });

    // strip the following tags and any contents
    $( tags_strip.join(', ' ), $element ).remove();

    // replace ul and ol tags
    replaceUls( $element );

    $( 'br', $element ).each( function(){
        $( this ).replaceWith( '\n' );
    });

    // fetch the html
    var html = $element.html();

    // strip some excess white space
    //html = html.replace( /\n +/g, '\n' );
    html = html.replace( /&nbsp;/g, ' ');
    html = html.replace( /^ +/g, '' );
    html = html.replace( / +$/g, '' );

    // return the html
    return html;
}

/**
 * Convert ul and ol tags into plain text alternatives
 *
 * This function is recursive and will support nested bullet points
 */
function replaceUls( $element, indent, number )
{
    // our tab character
    var tab = '   ';

    if( ! indent ) indent = 1;
    if( ! number ) number = 0;

    var endcap = indent > 1 ? '' : '\n\n';
    var prefix = indent > 1 ? '\n\n' : '';

    var indentStr = new Array( indent+1 ).join( tab );

    // iterate over OL tags
    $( '> OL', $element ).each( function( index, ol ){

        $( '> li', $( ol ) ).each( function( index, li ){

            // we use numbered strings like '3.2.1' to show numbering nesting
            var olnumber = index+1;
            if( number ) olnumber = number + '.' + olnumber;

            // replace any child tags
            replaceUls( $( this ), indent + 1, olnumber );

            // create the bullet
            var bullet = prefix+indentStr+olnumber+'. '+$( li ).text() + endcap;
            $( li ).replaceWith( bullet );
        });

        $( ol ).replaceWith( $( ol ).html() );
    });

    // iterate over UL tags
    $( '> UL', $element ).each( function( index, ul ){

        $( '> li', $( ul ) ).each( function( index, li ){

            // replace any child tags
            replaceUls( $( this ), indent + 1 );

            var bullet = prefix+indentStr+'-  '+$( li ).text() + endcap;
            $( li ).replaceWith( bullet );
        });

        $( ul ).replaceWith( $( ul ).html() );
    });
}
function dateFormat (date, fstr, utc) {
    utc = utc ? 'getUTC' : 'get';
    return fstr.replace (/%[YymdHMSu]/g, function (m) {
        switch (m) {
            case '%y': return date[utc + 'FullYear'] ().toString().substring(2); // no leading zeros required
            case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
            case '%m': m = 1 + date[utc + 'Month'] (); break;
            case '%d': m = date[utc + 'Date'] (); break;
            case '%H': m = date[utc + 'Hours'] (); break;
            case '%M': m = date[utc + 'Minutes'] (); break;
            case '%S': m = date[utc + 'Seconds'] (); break;
            case '%u': return date[utc + 'Milliseconds'] (); break;
            default: return m.slice (1); // unknown code, remove %
        }
        // add leading zero if required
        return ('0' + m).slice (-2);
    });
}

function helperArrayIntersect(arr1, arr2) {
	let result = [];

	for (let elem of arr1) {
		if (inArray(elem, arr2)) {
			result.push(elem);
		}
	}

	return result;
}

function inArray(elem, arr){
	return arr.indexOf(elem) !== -1;
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
function get_object_len(obj)
{
    var count = 0;
    var i;

    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            count++;
        }
    }
    return count;
}
function object_join(obj,str)
{
    var res = '';
    var i;

    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            res += (res.length ? str : '')+obj[i];
        }
    }
    return res;
}
Cookies = {
    Get : function (name,type) {
        type = type ? type : 'str';
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        var val = matches ? decodeURIComponent(matches[1]) : null;
        if(type == 'int')
        {
            val = parseInt(val);
            return isNaN(val) ? 0 : val;
        }
        return val;
    },
    Set : function(name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    },
    Delete : function(name) {
        this.Set(name, "", {
            expires: -1,
        })
    }
};
function AddNotification(text,type,id)
{
    if(!id)
    {
        id = 'NOTIFICATION_CLIENT'+Math.random().toString(36).substring(7);
    }
    if($('#'+id+':visible').length)
    {
        return;
    }
    var icon      = 'fas fa-check-circle';
    var css_class = 'n_green';
    if(type == 'error')
    {
        icon      = 'fas fa-minus-circle';
        css_class = 'n_red';
    }
    else if(type == 'notice')
    {
        icon      = 'fas fa-info-circle';
        css_class = 'n_blue';
    }
    else if(type == 'warning')
    {
        icon      = 'fas fa-exclamation-circle';
        css_class = 'n_yellow';
    }
    $('div.notifications > .wrapper')
        .append('<div class="noti_wrap '+css_class+'" id="'+id+'" style="display: block; ">' +
            '<div class="text">'+text+'</div>' +
            '<i class="icon '+icon+'"></i><a href="#" class="n_close"><i class="icon fa fa-times"></i></a>' +
            '</div>');
    $('div.notifications').fadeIn();
    $('#'+id+' .n_close').click(function () {
        $(this).parent().remove();
        setTimeout(function() {
            if(window.mainContMinH)
            {
                mainContMinH();
            }
            $(window).trigger('resize');
        }, 450);

    });
    setTimeout(function() {
        if(window.mainContMinH)
        {
            mainContMinH();
        }
        $(window).trigger('resize');
    }, 450);

}
//функция проверяет, если сотрудник сейчас на странице чата
function IsChatPage() {
    return window.b_chat_page ? b_chat_page : false;
}
function IsActiveChatPage() {
    return window.b_chat_page && !window.is_archive ? true : false;
}

// Translation function
function t(code, replace = {}) // code format - 'section/variable'
{
  if(window.LangTranslations)
  {
   let code_arr = code.split('/');
   let section = code_arr[0];
   let variable = code_arr[1];
   if(window.LangTranslations[section] && window.LangTranslations[section][variable])
   {
     return formatlangString(window.LangTranslations[section][variable], replace);
   }
  }
  return 'UNKNOWN('+ code + ')';
}

function formatlangString(string, replace)
{
  var default_replace = {
    "br": "<br />",
    "strong" : "<strong>",
    "/strong" : "</strong>",
    "span" : "<span>",
    "/span" : "</span>",
    "p" : "<p>",
    "/p" : "</p>",
    "i" : "<i>",
    "/i" : "</i>",
    "em" : "<em>",
    "/em" : "</em>",
    "b"  : "<b>",
    "/b" : "</b>"
  };

  var new_replace = Object.assign(default_replace, replace);
  let new_obj = {};
  let keys = [];
  for(let key in new_replace)
  {
    keys.push("\\["+key+'\\]');
    new_obj['['+key+']'] = new_replace[key];
  }
  let replace_key = keys.join('|');
  var re = new RegExp(replace_key,"g");
  return string.replace(re, function (x) {
    return new_obj[x];
  // return decodeHTMLEntities(new_obj[x]);
});
}

function stripslashes (str) {

  return (str + '').replace(/\\(.?)/g, function (s, n1) {
    switch (n1) {
    case '\\':
      return '\\';
    case '0':
      return '\u0000';
    case '':
      return '';
    default:
      return n1;
    }
  });
}

var entities = {
  'amp': '&',
  'apos': '\'',
  '#x27': '\'',
  '#x2F': '/',
  '#39': '\'',
  '#47': '/',
  'lt': '<',
  'gt': '>',
  'nbsp': ' ',
  'quot': '"'
}

function decodeHTMLEntities (text) {
let element = document.createElement("div");
element.innerHTML = text;
str = element.innerText;
return str;
}
var Translate = t;
