// JavaScript Document

(function($){

	$(function(){
		/*$(document).on('click', '.a19_code', function() {
			var insCode = $(this).attr('data-code');
			$('.a19_script_win').show();
			$('.a19_script_win_wrap textarea').text(insCode);
			selectText();
		});

		$(document).on('click', '.a19_script_win_wrap .fa-times', function() {
			$('.a19_script_win').hide();
		});

		$(document).on('click', '.a19_script_win', function(e) {
			e = e || window.event;
			target = e.target || e.srcElement;
	        if (target.className == "a19_script_win") {
				$('.a19_script_win').hide();
	        }
		});*/

		$(document).on('click', '.a19_code', function() {
			var widget_id = $(this).parents('li').attr('id').substr(10);
			var uid = $(this).parents('li').attr('data-uid');


			//var insCode = $(this).attr('data-code');
			var insCode = '<!-- Start of Omnidesk Widget script {literal}-->' +"\n"+
			"<script>\n"+
			'!function(e,o){!window.omni?window.omni=[]:\'\';window.omni.push(o);o.g_config={widget_id:"'+widget_id+'-'+uid+'"}; o.email_widget=o.email_widget||{};var w=o.email_widget;w.readyQueue=[];o.config=function(e){ this.g_config.user=e};w.ready=function(e){this.readyQueue.push(e)};var r=e.getElementsByTagName("script")[0];c=e.createElement("script");c.type="text/javascript",c.async=!0;c.src="https://omnidesk.ru/bundles/acmesite/js/cwidget0.2.min.js";r.parentNode.insertBefore(c,r)}(document,[]);'+"\n"+
			'</script>'+"\n"+
			'<!-- End of Omnidesk Widget script {/literal}-->';
			$('#showScript textarea').text(insCode);
			$('#showScript').togglePopup();
			selectText();
		});

		$(document).on('click', '.a19_copy', function() {
			var parent = $(this).parents('li');

			var widget_copy = $(parent).clone();
			var oldText = $(parent).find('.t1').text();
			widget_copy.find('.t1').text(oldText + ' (копия)');
			$('.span_cnt').html((parseInt($('.span_cnt').html())+1));
			widget_copy.appendTo('ul.lw_body');


			xajax_CopyWidget($(parent).attr('id').substr(10));
		});
		$(document).on('click', '.edit_widget', function() {
			var widget_id = $(this).parents('li').attr('id').substr(10);
			window.location = edit_record_url.replace('/0','/'+widget_id);
		});

		function selectText(){
			var oTextBox = $('textarea');
			oTextBox.focus();
			oTextBox.select();
		}
	});

})(jQuery);