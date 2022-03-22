(function($R)
{
    $R.add('plugin', 'omni_pre', {
        translations: {
            en: {"title": "My Button"},
            ru: {"title": Translate('redactor_js/omni_plugins_title')}
        },
        init: function(app)
        {
            this.app = app;
            this.lang = app.lang;
            this.toolbar = app.toolbar;
        },
        start: function()
        {
            var buttonData = {
                title: this.lang.get('title'),
                icon: '<i class="fa fa-code"></i>',

                api: 'module.inline.format',
                args: {
                    tag: 'pre'
                }
                // api: 'plugin.mybutton.toggle'
            };
            var $button = this.toolbar.addButtonBefore('html', 'omni_pre', buttonData);
        },
    });
    $R.add('plugin', 'omni_autosave', {
        _saved_content : '',
        init: function(app)
        {
            this.app = app;
            this.opts = app.opts;
            this.$doc = app.$doc;
            this.$body = app.$body;
            this.editor = app.editor;
            this.marker = app.marker;
            this.keycodes = app.keycodes;
            this.container = app.container;
            this.selection = app.selection;
            this.source  = app.source;

        },
        // public
        start: function()
        {
            self = this;
            if (!this._CheckLocalStorage() || !this.opts.omni_autosave_uid)
            {
                return;
            }
            tmp = localStorage.getItem(this.opts.omni_autosave_uid);
            this._saved_content = tmp ? tmp : this._saved_content;
            if(this._StripTags(this._saved_content).length)
            {
                this.source.setCode(this._saved_content);
               setTimeout(function () {
                   // self.source.setCode(self._saved_content);

               },300);
                this.editor.getElement().parent().find('.redactor-layer').attr('placeholder','');
            }

            var $editor = this.editor.getElement();
            // $editor.on('keydown.oas', this._handle.bind(this));
            // $editor.on('keyup.oas', this._handle.bind(this));
           // $editor.on('blur.oas', this._t.bind(this));

        },
        onchanged: function()
        {
            this._handle({})
        },

        onsynced: function(html)
        {
            // console.log('sync');
        },

        stop: function()
        {
            var $editor = this.editor.getElement();
            $editor.off('.oas');
            this.$doc.off('.oas');
            this._saved_content = '';
            this.opts.omni_autosave_uid = false;
        },
        _t:function(e)
        {
            self = this;
            this.app.api('module.source.sync');
            self._handle(e)
            // setTimeout(function () {
            //     if(self._handle)
            //     {
            //     }
            // },200);
        },
        _handle: function(e)
        {
            if (!this._CheckLocalStorage() || !this.opts.omni_autosave_uid)
            {
                return;
            }
            this.app.api('module.source.sync');
            var $editor = this.editor.getElement();
            val = this.source.getCode();
            if(val == this._saved_content)
            {
                return;
            }
            this._saved_content = val;
            localStorage.setItem(this.opts.omni_autosave_uid,this._saved_content);

        },
        _build: function()
        {
        },
        _CheckLocalStorage: function()
        {
            if (typeof localStorage === 'object') {
                try {
                    localStorage.setItem('localStorage', 1);
                    localStorage.removeItem('localStorage');
                    return true;
                } catch (e) {
                    return false;
                }
            }
            return false;
        },
        _StripTags: function(str)
        {
            return str.replace(/<\/?[^>]+>/gi, '').replace(/&#x200b;/gi,'').replace(/&nbsp;/gi,'').trim();
        }
});



})(Redactor);
