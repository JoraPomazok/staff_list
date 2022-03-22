(function($R)
{
    $R.add('plugin', 'fast_templates', {
        translations: {
            en: {
                "fast_templates": "Create template"
            },
      			ru: {
                      "fast_templates": Translate('redactor_js/fast_templates')
                  }
        },
        init: function(app)
        {
            this.app = app;
            this.lang = app.lang;
            this.toolbar = app.toolbar;
        },
        start: function()
        {
            // create the button data
            var buttonData = {
                title: this.lang.get('fast_templates'),
				icon: '<i class="fas fa-save"></i>',
                api: 'plugin.fast_templates.toggle'
            };

            // create the button
            var $button = this.toolbar.addButton('fast_templates', buttonData);

			this.toolbar.getWrapper().find('.re-button.re-fast_templates').addClass('modal-trigger').attr('href', '#fast-template-modal')

			// скрываем по дефолту, для этого: если больше 20 символов в поле показываем "Быстрые шаблоны"
			$button.hide();
        },
        toggle: function()
        {
            // alert('My Button is toggled!');
			// CreateHtmlResponseEditor('fast-template-red', true, '', 177, false, false, false);
        }
    });
})(Redactor);
