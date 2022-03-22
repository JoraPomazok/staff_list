$(document).on('mousemove', 'html', function(e) {
   if(!$(e.target).hasClass('omni_custom_tooltip') )
   {
       $('.omni_absolute_tt').remove();
   }
});
$(document).on('mouseenter', '.omni_custom_tooltip', function() {
    tt_attr = $(this).attr('data-tt');
    tt_span = $( this ).find('span.tt');

    if(tt_attr && tt_attr == 'absolute')
    {
        if($(this).attr('tt_uid') && $('span#'+$(this).attr('tt_uid')).length)
        {
            tt_span = $('span#'+$(this).attr('tt_uid'));
        }
        else
        {
            attr_uid = 'omni_tt_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            $(this).attr('tt_uid', attr_uid);
            $('<span>').addClass('omni_absolute_tt').addClass($(this).attr('data-tt-class')).attr('id', attr_uid).css({
                'position':'absolute',
                'z-index':9999,
                'top': $( this ).offset().top,
                'left': $( this ).offset().left
            }).appendTo('body');


            tt_span = $('span#'+attr_uid);
        }

    }
    else if(!$( this ).find('span.tt').length)
    {
        $('<span>').addClass('tt').appendTo(this);
        tt_span = $( this ).find('span.tt');
    }
    tt_span.html($(this).attr('data-title')).show();
    if((obj_wrap =$(this).parents('.omni_custom_tooltip_wrap')).length)
    {
        if($(tt_span).offset().left < $(obj_wrap).offset().left)
        {
            $(tt_span).addClass('left');
        }
    }
});
$(document).on('mouseleave', '.omni_custom_tooltip', function() {
    if($(this).attr('tt_uid') && $('span#'+$(this).attr('tt_uid')))
    {
        $('span#'+$(this).attr('tt_uid')).remove();
    }
    $( this ).find('span.tt').remove();
});
$(document).on('contextmenu copy paste keydown', '.omni_custom_tooltip', function() {
    $( this ).find('span.tt').remove();
});
