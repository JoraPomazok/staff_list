AJS.$(function(){
	AJS.$(".ticket .title").click(function(){
		var displ = AJS.$(this).parent().find(".details").css('display');
		AJS.$(".ticket .details").hide('blind');
		if(displ != 'block')
			AJS.$(this).parent().find(".details").show('blind');
	});


	AJS.$("#notify_btn").click(function() {
		AP.require('dialog', function(dialog){
			dialog.create({
				key: 'dialog-notification',
				width: '730px',
				height: '300px',
				chrome: false
			});
		});
	});

	AJS.$("#subm_notify").click(function(){
		console.log(AJS.$(this).parent().parent().parent().find("textarea#notification").val());
		if(AJS.$(this).parent().parent().parent().find("textarea#notification").val() == '')
		{
			AJS.$("#err_notify").css('visibility','');
			return false;
		}
		AJS.$(this).parent().parent().parent().find("textarea, input").attr('disabled','disabled');
		AJS.$("#err_notify").css('visibility','hidden');
		AJS.$("#loading_notify").show();

		var params = jira_json_get;
		params['text'] = AJS.$(this).parent().parent().parent().find("textarea#notification").val(),
		AJS.$.ajax({
			type: "POST",
			url: "dialog-notification?issue_key="+jira_issue_key,
			data: params,
			success: function()
			{
				AP.require('dialog', function(dialog){dialog.close();});
			},
			dataType: 'text'
		});
	});
	AJS.$(function(){
		AJS.$(".selected-ticket, .comment-type").change(function(){
			var params = jira_json_get;

			params['case_id'] = AJS.$(".selected-ticket").val();
			params['type']    = AJS.$(".comment-type").val();
			params['ajax']    = 1;
			AJS.$.ajax({
				type: "GET",
				url: "issue-tab",
				data: params,
				success: function(result)
				{

					AJS.$('div.comments').html(result);
				},
				dataType: 'html'
			});

		});
	});
});

/*

function SetConfig(form)
{
	var params = jira_json_get;
	$(form).find('input:checkbox').each(function(){
		params[this.name] = this.value;
	})
	params['b_ajax'] = 1;
	AJS.$.ajax({
		type: "POST",
		url: "config",
		data: params,
		success: function(result)
		{
			AJS.$('div.row .alert-success').show();
		},
		dataType: 'html'
	});


	console.log(params);

}*/
