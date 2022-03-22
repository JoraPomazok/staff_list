function onOff() {
    var lw_item = $('li.lw_item').first();
    if(lw_item.hasClass('active')) {
        enable = 0;
    }
    else{
        enable = 1;
    }
    markOffOn(lw_item, enable);
    $.ajax({
        url: 'update',
        type: 'POST',
        data: {
            enable: enable
        },
        cache: false
    });
}

function SaveChatGroup(){
    var chat_group_id = $('#chat_group_id').val();
    $.ajax({
        url: 'update_group',
        type: 'POST',
        data: {
            chat_group_id: chat_group_id
        },
        cache: false
    });
}

$(document).ready(function(){
    $('#chat_group_id').change(function() {
        SaveChatGroup();
    });
})