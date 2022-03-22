function init_update_record(start) {
	if(start) {
		start = start + ' ';
	} else {
		start = '';
	}
	$(start + '.update-record').click(function(e){
		e.preventDefault();
		update_record($(this).attr('id'));
	})
}

function update_record(button_id) {
	if(request_sent) {
		return;
	}
	
	record_id = button_id.match(/button_update_(\d+)/)[1];
	
	var group_id = $('#group_id_'+record_id).val();
	var convert_mentions = $('#convert_mentions_'+record_id).prop('checked');
	var convert_dm = $('#convert_dm_'+record_id).prop('checked');
	
	ShowSpinButton('button_update_'+record_id);
	xajax_UpdateRecord(record_id, group_id, convert_mentions, convert_dm);
}

function onOff(el, enable) {
	if($(el).attr('rel')=='account_used' && enable==0) {
		ShowXajaxNotification('ACCOUNT_USED');
	}
	enableRecord(el, enable);
}

function DeleteRecord(remove_id) {
	if($('#record_'+remove_id).attr('rel')=='account_used') {
		ShowXajaxNotification('ACCOUNT_USED');
	}
	AjaxDeleteRecord(remove_id);
}