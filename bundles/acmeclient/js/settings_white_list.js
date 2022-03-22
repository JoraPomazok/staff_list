$(document).ready(function(){
    // white_list textarea
	if(window.autosize) {
		if($('#white_list_content').length) {
			autosize($('#white_list_content'));
		}
	}
	$(document).on('change paste keyup', '#white_list_content', function () {
        WhiteList();
    });

    $(document).on('click', '#button_update:not([disabled])', function(){
        ShowSpinButton('button_update');
        $.ajax({
            url: '/admin/settings/white_list/dynamic_save',
            type: 'POST',
            data: {
                record_id: 'white_list',
                data: $('#white_list_content').val()
            },
            success: function()
            {
                HideSpinButton('button_update');
               
                ShowXajaxNotification('SETTINGS_UPDATED',1);
            },
            cache: false
        });
        $(this).attr('disabled', 'disabled')
  	});
	
})

function WhiteList() {
	let regexLinesBreaker = /[^\n]+/gm;

	let wrap = $('.white_list');
	
	let btnSubmit = wrap.find('.submit');
	let textarea = $('#white_list_content');
	let text = textarea.val().trim().length ? textarea.val().trim() : '';
	let previousVal = textarea[0].defaultValue;
    let allowSubmit = false;
    
    if(!text.length && previousVal.length) {
        btnSubmit.removeAttr('disabled');
	} else {
        if (text !== previousVal && text.length) {
            let textLinesArr = text.match(regexLinesBreaker);

            if(textLinesArr !== null) {
                if(textLinesArr.length > 0) {
                    allowSubmit = textLinesArr.every(function(item, k) {
                        item = item.trim();
                        let res = ValidEmail(item);
                        return res;
                    })
                }
            }
            allowSubmit ? btnSubmit.removeAttr('disabled') : btnSubmit.attr('disabled', 'disabled')
        } else {
            btnSubmit.attr('disabled', 'disabled')
        }
    }
}
