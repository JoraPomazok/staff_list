(function($)
{
    $.Redactor.prototype.smile = function()
	{
		return {
			init: function()
			{
                var _is_chat_page = window.IsChatPage ? IsChatPage() : false;
                if($('.wdt-emoji-popup').length && _is_chat_page)
                {
                    wdtEmojiBundle.init(this.$editor,this.$editor[0],false,true);
                    return;
                }
                var button = this.button.add('smile', 'Smile');
				var self = this;
				var template = '' +
				'<a href="#" class="wdt-emoji-popup-mobile-closer"> &times; </a>' +
				'<div class="wdt-emoji-menu-content">' +
				'<div id="wdt-emoji-menu-header">' +
				'<a class="wdt-emoji-tab active" data-group-name="Recent" data-name-rus="Недавно использованные"></a>' +
				'<a class="wdt-emoji-tab" data-group-name="People" data-name-rus="Смайлы и люди"></a>' +
				'<a class="wdt-emoji-tab" data-group-name="Nature" data-name-rus="Животные и природа"></a>' +
				'<a class="wdt-emoji-tab" data-group-name="Foods" data-name-rus="Еда и напитки"></a>' +
				'<a class="wdt-emoji-tab" data-group-name="Activity" data-name-rus="Спорт и развлечения"></a>' +
				'<a class="wdt-emoji-tab" data-group-name="Places" data-name-rus="Транспорт и путешествия"></a>' +
				'<a class="wdt-emoji-tab" data-group-name="Objects" data-name-rus="Объекты"></a>' +
				'<a class="wdt-emoji-tab" data-group-name="Symbols" data-name-rus="Символы"></a>' +
				'<a class="wdt-emoji-tab" data-group-name="Flags" data-name-rus="Флаги"></a>' +
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
				if(!$('.wdt-emoji-popup').length)
                {
                    $('<div>')
                        .addClass('wdt-emoji-popup')
                        .html(template)
                        .appendTo('body');
                }
                if(!$('.wdt-emoji-popup-bg').length)
                {
                    $('<div>')
                        .addClass('wdt-emoji-popup-bg')
                        .css('display', 'none')
                        .appendTo('body');
                }
                wdtEmojiBundle.init(this.$editor,_is_chat_page ? this.$editor[0] : false);
				this.button.addCallback(button, this.smile.showSmileBlock);

                this.$toolbar.find('.re-smile').parent()
					.addClass('li_smile')
					.html('<span class="ico_smile">&nbsp;</span>');

				this.smile.checkLoadSmileBlock()


				$('.wdt-emoji-picker').hover(
					function(e) { $(this).parent().addClass('hover')},
					function(e) { $(this).parent().removeClass('hover')}
				);

			},
			showSmileBlock: function(buttonName)
			{
				wdtEmojiBundle.openPicker({'target' : this.$toolbar.find('li.li_smile .wdt-emoji-picker')[[0]],'noevent':true});
			},
			checkLoadSmileBlock : function ()
			{
				var self = this;
				if(!this.$box.find('.wdt-emoji-picker'))
				{
					setTimeout(function ()
					{
						self.smile.checkLoadSmileBlock();
					},500);
					return;
				}
				// fill with emoji
				wdtEmojiBundle.fillPickerPopup();

                this.$toolbar.find('li.li_smile').html('').click(function (event)
				{
					if(!$(event.target).hasClass('wdt-emoji-picker'))
					{
						self.smile.showSmileBlock('');
					}
				});
 				this.$box.find('.wdt-emoji-picker').appendTo(this.$toolbar.find('.li_smile'));

			}
		};
	};
})(jQuery);