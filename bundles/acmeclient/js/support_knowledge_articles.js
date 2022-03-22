$(document).ready(function(){
    $( ".sections_sortable" ).sortable(
        {connectWith: ".sections_sortable"},
        {handle: ".js-move-item"},
        {axis: "y" },
        {stop: function( event, ui ) {
            section_id = $(this).attr('id');
            section_id = section_id.replace('record_list_','');
            SortSections(true, section_id);
        }},
        {receive: function( event, ui ) {
            section_id = $(this).attr('id');
            section_id = section_id.replace('record_list_','');
            
            record_id = ui.item.attr('id');
            record_id = record_id.replace('record_li_','');

            xajax_UpdateSectionRecord(record_id, section_id);
            SortSections(true, section_id);
        }}
    );

    $(document).on('click', '.actionBlock .lock', function(e){
        e.preventDefault();

        var lw_item = $(this).closest('.lw_item');

        record_id = lw_item.attr('id');
        record_id = record_id.replace('record_li_','');

        lock_off = ChangeLockIcon(lw_item);
        
        xajax_ChangeLock(record_id, lock_off);
    });
})

function SortSections(b_sort_db, section_id) {
    var start = 1;
    var sort_li_arr = Array();
    $('#record_list_'+section_id+' li').each(function() {
        if($(this).hasClass('active')) {
            $(this).find('.span-sort').html(start);
            start++;
            sort_li_arr.push($(this).attr('id'));
        }
    })
    if(sort_li_arr.length>0 && b_sort_db) {
        xajax_SortRecords(section_id,sort_li_arr.join(':'));
    }
}

function onOff(item, enable) {
    enableRecord(item, enable);
    var li_el = $(item).closest('li');

    category_id = $(li_el).parents('div:first').attr('id');
    category_id = category_id.replace('block_section_articles_','');

    elem_id = $(li_el).attr('id');
    elem_id = elem_id.replace('record_li_','');

    if(enable) {
        $('#record_li_'+elem_id+' .title_text').hide();
        $('#record_li_'+elem_id+' .title_link').show();
        $('#record_list_'+category_id).append(li_el);
    }
    else {
        $('#record_li_'+elem_id+' .title_link').hide();
        $('#record_li_'+elem_id+' .title_text').show();
        $('#disabled_record_list_'+category_id).append(li_el);
    }
    SortSections(true, category_id);
}

function DeleteRecordExt(category_id) {
    if( category_id.indexOf("block_section_articles") > -1 ){
        category_id = category_id.replace('block_section_articles_','');
        if( $("#block_section_articles_"+category_id+" li").length < 1 ){
            $('#block_section_title_'+category_id).hide();
            $('#block_section_articles_'+category_id).hide();
        }
    }

	SortSections(false, category_id);
}

function ChangeLockIcon( lw_item ){
    var title = lw_item.find('.lock .icon').attr('title');
    if(lw_item.hasClass('lock_on')) {
        lw_item.addClass('lock_off').removeClass('lock_on');
        lw_item.find('.lock .icon').addClass('fa-unlock').removeClass('fa-lock')
            .attr('title',lw_item.find('.lock .icon').attr('alt_title'));
        lw_item.find('.lock .icon').attr('alt_title',title);

        return 1;
    }
    else {
        lw_item.addClass('lock_on').removeClass('lock_off');
        lw_item.find('.lock .icon').addClass('fa-lock').removeClass('fa-unlock')
            .attr('title',lw_item.find('.lock .icon').attr('alt_title'));
        lw_item.find('.lock .icon').attr('alt_title',title);
        return 0;
    }
}
