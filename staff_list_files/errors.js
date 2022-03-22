$(document).ready(function(){
	$('input,select,textarea').each(function() {
		error_string = '';
		for(var i=0; i<10 ;i++) {
			if($(this).attr('error_'+i)) {
				error_string = error_string+'<span id="warning_'+ $(this).attr('errorid_'+i)+ '" class="errorTip" style="display:none">';
				error_string = error_string+'<span id="warninfo_'+ $(this).attr('errorid_'+i)+ '" class="error_text">'+ $(this).attr('error_'+i)+ '</span>';
				error_string = error_string+'<span class="icon icon-sort-down"></span>';
				error_string = error_string+'<span class="closeError far fa-times"></span>';
				error_string = error_string+'</span>';
				$(this).removeAttr('error_'+i);
				$(this).removeAttr('errorid_'+i);
			} else {
				break;
			}
		}
		$(this).after(error_string);
	});
	
	$('.show-error-on-load').each(function() {
		var errorid = $(this).attr('id');
		$('#warning_'+errorid).show();
		$('#warninfo_'+errorid).show();
	});
	
	$('.closeError').click(function() {
	   $(this).parent().hide();
	   $(this).parent().siblings('.error').removeClass('error');
   });
});
/*
<span class="errorTip"><span class="error_text">не менее 5 символов</span> <span class="icon icon-sort-down"></span><span class="closeError far fa-times"></span></span>
*/
