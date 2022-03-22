(function($R)
{
    $R.add('plugin', 'smile',
    {
		init: function(app) {
            this.app = app;
            this.opts = app.opts;
            this.lang = app.lang;
            this.inline = app.inline;
            this.toolbar = app.toolbar;
            this.selection = app.selection;
        },
        start:function()
		{
            this.$button = this.toolbar.addButton('smile', {
            	'title' : Translate('redactor_js/smile_title'),
                api: 'plugin.smile.showSmileBlock'
			});
            // var button = this.$button.add('smile', 'Smile');
			var self = this;
			var template = '' +
			'<a href="#" class="wdt-emoji-popup-mobile-closer"> &times; </a>' +
			'<div class="wdt-emoji-menu-content">' +
			'<div id="wdt-emoji-menu-header">' +
			'<a class="wdt-emoji-tab active" data-group-name="Recent" data-name-rus="'+Translate('redactor_js/smile_recent')+'"></a>' +
			'<a class="wdt-emoji-tab" data-group-name="People" data-name-rus="'+Translate('redactor_js/smile_people')+'"></a>' +
			'<a class="wdt-emoji-tab" data-group-name="Nature" data-name-rus="'+Translate('redactor_js/smile_nature')+'"></a>' +
			'<a class="wdt-emoji-tab" data-group-name="Foods" data-name-rus="'+Translate('redactor_js/smile_foods')+'"></a>' +
			'<a class="wdt-emoji-tab" data-group-name="Activity" data-name-rus="'+Translate('redactor_js/smile_activity')+'"></a>' +
			'<a class="wdt-emoji-tab" data-group-name="Places" data-name-rus="'+Translate('redactor_js/smile_places')+'"></a>' +
			'<a class="wdt-emoji-tab" data-group-name="Objects" data-name-rus="'+Translate('redactor_js/smile_objects')+'"></a>' +
			'<a class="wdt-emoji-tab" data-group-name="Symbols" data-name-rus="'+Translate('redactor_js/smile_symbols')+'"></a>' +
			'<a class="wdt-emoji-tab" data-group-name="Flags" data-name-rus="'+Translate('redactor_js/smile_flags')+'"></a>' +
			'</div>' +
			'<div class="wdt-emoji-scroll-wrapper">' +
			'<div id="wdt-emoji-menu-items">' +
			'<div class="wdt-emoji-sections"></div>' +
			'</div>' +
			'</div>' +
			'<div id="wdt-emoji-footer">' +
				'<div id="wdt-emoji-preview">' +
					'<span id="wdt-emoji-preview-img"></span>' +
					'<div id="wdt-emoji-preview-text">' +
						'<span id="wdt-emoji-preview-name"></span><br>' +
						'<span id="wdt-emoji-preview-aliases"></span>' +
					'</div>' +
				'</div>' +
				'<div id="wdt-emoji-preview-bundle"><span></span></div>' +
			'</div>' +
			'</div>';

			if(!$('.wdt-emoji-popup').length && !$('.wdt-emoji-popup-bg').length) {
				$('<div>')
					.addClass('wdt-emoji-popup')
					.html(template)
					.appendTo('body');
				$('<div>')
					.addClass('wdt-emoji-popup-bg')
					.css('display','none')
					.appendTo('body');
			}

			wdtEmojiBundle.b_off_picker_event = true;
			wdtEmojiBundle.closePickers();

			wdtEmojiBundle.init('.redactor-styles');

            this.toolbar.getWrapper().find('.re-smile')
				.addClass('li_smile')
				.html('<span class="ico_smile">&nbsp;</span>');
            this.checkLoadSmileBlock()


			$('.wdt-emoji-picker').hover(
				function(e) { $(this).parent().addClass('hover')},
				function(e) { $(this).parent().removeClass('hover')}
			);

		},
		showSmileBlock: function(e)
		{
			wdtEmojiBundle.closePickers();

			if( $('#fast-template-modal').is(':visible') && $('#comment').length ) {
				wdtEmojiBundle.init('.redactor-styles', $('.redactor-styles')[0], {top: 0});
			} else {
				wdtEmojiBundle.init('.redactor-styles');
			}

            this.app.api('selection.save');
            wdtEmojiBundle.openPicker({'target' : this.toolbar.getWrapper().find('a.li_smile .wdt-emoji-picker').nodes[0],'noevent':true});
		},
		checkLoadSmileBlock : function ()
		{
			var self = this;
            if(!this.app.container.$container.find('.wdt-emoji-picker').length)
			{
				setTimeout(function ()
				{
					self.checkLoadSmileBlock();
				},500);
				return;
			}
			// fill with emoji
			wdtEmojiBundle.fillPickerPopup();
            // console.log(this.toolbar.getWrapper().find('a.li_smile'));
      //       $(this.toolbar.getWrapper().find('a.li_smile').nodes[0]).html('').click(function (event)
			// {
      //           if(!$(event.target).hasClass('wdt-emoji-picker'))
			// 	{
			// 		self.showSmileBlock('');
			// 	}
      //
			// });
            this.toolbar.getWrapper().find('.li_smile').html('');
            this.toolbar.getWrapper().find('.li_smile').append(this.app.container.$container.find('.wdt-emoji-picker'))


        }
	});
})(Redactor);
