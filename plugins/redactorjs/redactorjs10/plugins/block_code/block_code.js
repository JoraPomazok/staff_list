(function($)
{
	$.Redactor.prototype.block_code = function()
	{
		return {
			langs: {
				ru: {
    				"block_code": "Вставка кода",
				}
			},
			init: function()
			{
				var button = this.button.add('block_code', this.lang.get('block_code'));
                this.button.setIcon(button, '<i class="fa fa-code"></i>');
                this.button.addCallback(button, this.block_code.toggle);
			},
			toggle: function()
			{
                this.buffer.set();

                var node = null;
                var selection = this.selection.get()

                try
                {
                    node = selection.anchorNode;
                    node = (node.nodeType == 3 ? node.parentNode : node);
                }
                catch(err)
				{

				}
                // console.log(node.tagName, node.textContent,node.textContent.length);
                this.block.format('pre');
                // if(node && node.tagName && node.textContent.length <= 1)
                // {
                //    this.inline.formatCollapsed('code');
                // }
                // else
                // {
                //     var range = selection.getRangeAt(0);
                //     var newNode = document.createElement("code");
                //         range.surroundContents(newNode);
                // }
			}
		};
	};
})(jQuery);