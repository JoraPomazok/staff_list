var RedactorInstances=[];
var RedactorVersion = 10;
var redactorjs_replaced_arr = {};
var last_redactor_focused = null;
var g_omni_redactor_p = false;
var last_dynamic_autosave = true;
let htmlWithPre = '';
let allowGetFromRedactorHtml = false;
let getFromRedactorHtml = '';
let firstRun = true;
let InitedRedactors = [];

function SetupSyncForm(editor_id) {
    var closest_form = $('#'+editor_id).closest('form');
    if(closest_form) {
        closest_form.attr('rel', editor_id);
        closest_form.on('submit', function() {
            var form_rel = $(this).attr('rel');
            SyncRedactorCode(form_rel);
        })
    }
}

function CreateHtmlEditor(editor_id, height, data, track_changed,b_images,b_mentions,b_no_toolbar,btn, template = false, rating = 1, files = null, lang_id = null, b_ak = false) {
    // b_images=false;
    var b_notify_added = 0;

    var plugins = ['fontsize','fontcolor', 'background_color', 'codemirror', 'omni_pre'];
    let editorAttachBlock = '';

    if(!btn)
    {
        var btn = ['format', 'fontsize', 'fontcolor', 'background_color',
            'bold', 'italic', 'underline', 'ul', 'ol', 'outdent', 'indent', 'link', 'line', 'html'];
        if (b_images)
        {
            btn = ['format', 'fontsize', 'fontcolor', 'background_color',
                'bold', 'italic', 'underline', 'ul', 'ol', 'outdent', 'indent', 'link', 'image', 'line', 'html'];
        }

        // для «Отправить ответ пользователю» и «Добавить заметку» в шаблонах, надо такой же редактор как в обращениях, но его нельзя натянуть под CreateHtmlResponseEditor(), потому замена кнопок и плагинов
        if( template &&
            ($('.add-tmpl-cont').length || $('.acrContent').length)
            &&
            (
                editor_id.match('_email_to_user') !== null
                ||
                editor_id.match('_add_note') !== null
                ||
                editor_id.match('_email_to_staff') !== null
                ||
                editor_id.match('_fwd_case_to_email') !== null
            )
        ) {
            plugins = ['fontcolor','background_color','omni_pre']; //,'smile'
            btn = ['bold', 'italic', 'underline', 'link',  'ol', 'ul', 'file', 'image', 'horizontalrule','fontcolor','background_color','line','omni_pre', 'html'];//,'smile'

            // для fileAttachment
            let ccls = editor_id + '_redactor-upload-block';
            editorAttachBlock = '.' + ccls;
            if(!$('#'+editor_id).closest('.ck_editor-signature').find(editorAttachBlock).length) {
                // $('#'+editor_id).closest('.ck_editor-signature').insertAfter('<div class="' + ccls + ' redactor-upload-block" />')
                $('<div class="' + ccls + ' redactor-upload-block" />').insertAfter($('#'+editor_id).closest('.ck_editor-signature'))
            }
            if(!$('#'+editor_id).closest('.row-ckeditor').find(editorAttachBlock).length) {
                // $('#'+editor_id).closest('.ck_editor-signature').insertAfter('<div class="' + ccls + ' redactor-upload-block" />')
                $('<div class="' + ccls + ' redactor-upload-block" />').insertAfter($('#'+editor_id).closest('.row-ckeditor'))
            }
        }
    }
    var attachFiles = {};
    if(files && lang_id)
    {
      files = JSON.parse(files);

      if(files && files[lang_id])
      {
        for(var i = 0; i < files[lang_id].length; i++)
        {
          let key = 'file-'+i;
          attachFiles[key] = files[lang_id][i];
        }
      }
    }

    var attach_key = $('input[name=attach_key]').val();
    var attach_url = b_ak ? '/admin/channels/macros/attach/' : '/staff/macros/attach/';
    var remove_url = b_ak ? '/admin/channels/macros/RemoveMultipleUploadedFile' : '/staff/macros/RemoveMultipleUploadedFile';
    var data_redactor = {
        source: {
            codemirror: {
                lineNumbers: true,
                mode: "htmlmixed",
                lineWrapping: true,
            }
        },
        linkSize: 300,
        // toolbarFixedTopOffset:0,
        // toolbarFixedTarget:'#anchor-scroll',
        stylesClass: 'redactor-layer redactor-styles js_omni_redactor_container',
        lang: 'ru',
        autoparseVideo: false,
        // emptyHtml: $.browser.mozilla || $.browser.safari ? '<p>&#x200b;</p>' : '',
        plugins: plugins,
        buttons: btn,
        minHeight: height+'px',
        maxHeight: height+'px',
        // linebreaks: true,
        breakline:true,
        toolbar: !b_no_toolbar,
        autoparseImages: false,
        cleanOnPaste: false,
        cleanSpaces: true,
        replaceDivs: false,
        // emptyHtml: '',
        // invisibleSpace: '',

        imageUpload: b_images ? '/php/files.php' : false,
        imageFigure: false,
        imageResizable: true,
        imagePosition: true,

        // todo change fileUpload .php
        fileUpload: template ? attach_url+attach_key : '/php/files.php',
        fileAttachment: editorAttachBlock,
        fileData: {
           rating: rating,
           lang_id: lang_id
        },

        callbacks: {
            upload:
            {
                  error: function(response)
                  {
                        $('.redactor-modal-box .redactor-modal.open .redactor-modal-footer').html(response.message);
                  }
              },
            file: {
              delete: function(file)
              {
                  if(template){
                    var attach_key = $('input[name=attach_key]').val();
                    deleteFiles(file,attach_key, lang_id, remove_url);
                  }
              }
            },
            started: function()
            {
                // console.log('111');
                // С‚РѕР»СЊРєРѕ РґР»СЏ РђРЎ
                if(window.session_id !== undefined)
                {
                    if(window.RedactorNano())
                    {
                        RedactorNano();
                    }
                }

                // если при замене ссылки остался пустой тег от старой - удаляем
                if($('.add-tmpl-cont').length || $('.acrContent').length) {
                    $('.redactor-layer:visible').each(function() {
                        let link_tag = $(this).find('a');

                        if(!link_tag.length) {
                            return false;
                        }

                        link_tag.each(function(){
                            if($(this).text().trim() == '') {
                                $(this).remove();
                            }
                            if($(this).find('a').length) {
                              $(this).find('a').unwrap();
                          }
                        });
                    })
                }
            },
            blur: function(e)
            {
                // this.code.startSync();
            },
            focus: function (obj, event)
            {
                current_email_focus = 'content';

                $(".redactor_nano").nanoScroller({alwaysVisible: true});
            },
            changed: function (obj, event)
            {
                if (track_changed)
                {
                    $('#b_default_' + editor_id).val(0);
                }

                $(".redactor_nano").nanoScroller({alwaysVisible: true});
                if(window.updatePreview)
                {
                    updatePreview()
                }

                if($('.add-tmpl-cont').length) {
                    mainContMinH()
                }

                // если при замене ссылки остался пустой тег от старой - удаляем
                if($('.add-tmpl-cont').length || $('.acrContent').length) {
                    $('.redactor-layer:visible').each(function() {
                        let link_tag = $(this).find('a');

                        if(!link_tag.length) {
                            return false;
                        }

                        link_tag.each(function(){
                            if($(this).text().trim() == '') {
                                $(this).remove();
                            }
                            if($(this).find('a').length) {
                              $(this).find('a').unwrap();
                          }
                        });
                    })
                }
            }
        }
    };
    // $('#'+editor_id+':visible').redactor(data_redactor);return;
    SetupSyncForm(editor_id);
    if(b_mentions)
    {
        data_redactor.callbacks.change = function()
        {
            last_redactor_focused = this;
            if ($.trim(this.editor.getElement().text()).match(/^\@/)
                && $.trim(this.editor.getElement().text()).length <3
                && !$('.notify_note_staff:visible').length
            )
            {
                NotifyNoteStaff('',this.source.getElement());
            }
            if (track_changed && window.activeButt)
            {
                activeButt();
            }
        };
        data_redactor.callbacks.blur = function(e)
        {
            last_redactor_focused = this;
            $('#'+editor_id).parent().find('.redactor-layer notify').removeClass('focus');
        };
        data_redactor.callbacks.keydown = function (e)
        {
            last_redactor_focused = this;
            if(window.getSelection().toString() == this.editor.getElement().text() && this.editor.getElement().text().substring(0,1) == '@' && e.keyCode>46 && !e.ctrlKey && !e.altKey && !e.shiftKey)
            {
                this.editor.getElement().html('')
            }

            if($('.notify_note_staff:visible').length && $('.notify_note_staff:visible .highlight').length && (e.keyCode == 13))
            {
                this.selection.save();
                e.stopPropagation();
                $('.notify_note_staff:visible .highlight a').click();
                b_notify_added = 1;
                return false;
            }

        };
        data_redactor.callbacks.enter = function(e) {

            if($('.notify_note_staff:visible').length && $('.notify_note_staff:visible .highlight').length)
            {
                // this.selection.save();
                // e.stopPropagation();
                $('.notify_note_staff:visible .highlight a').click();
                b_notify_added = 1;
                return false;
            }
        };

        data_redactor.callbacks.keyup = function(e)
        {
                last_redactor_focused = this;
                this.source.getElement().trigger('keyup');
                if($(this.source.getElement()).parents('.modal-cont').attr('id') == 'reopen-modal-2')
                {
                    // $('#reopen-modal-2 .btn_save').addClass('active');
                    // spinAble = 'on';

                }
                if(typeof NotifyNoteStaff != 'function') {
                    return
                }
                $('#'+editor_id).parent().find('.redactor-layer notify').removeClass('focus');
                if (_p = CheckFocusResponseNotify())
                {
                    if (e.keyCode    != 38//keys['up']
                        && e.keyCode != 40//keys['down']
                        && e.keyCode != 37//keys['left']
                        && e.keyCode != 39//keys['right']
                    )
                    {
                        DeleteResponseNotify();
                    }
                    else
                    {
                        $(_p).addClass('focus');
                    }
                }
                if($('.redactor-layer:focus').length && $('.notify_note_staff:visible').length)
                {
                    if (e.keyCode == 38//keys['up']
                    || e.keyCode  == 40//keys['down']
                    || e.keyCode  == 16//keys['enter']
                    )
                    {
                        return false;
                    }
                }
                if (e.keyCode === 8 || e.keyCode === 46)
                {
                    DeleteResponseNotify();
                }
                NotifyNoteStaff(false,this.source.getElement())

                if (!CheckFocusResponseNotify())
                {
                    NotifyNoteStaff(GetResponseNotify(),this.source.getElement())
                }
        }
    }
    else
    {
        data_redactor.callbacks.keydown = function (e) {
            if (track_changed && window.activeButt)
            {
                activeButt();
            }

        }
    }
    var default_val = $('#'+editor_id).val();
    var app = $('#'+editor_id).redactor(data_redactor);
    if(attachFiles)
    {
      app.module.file.insert(attachFiles);
    }

    if(data) {
        if(b_mentions)
        {
            data +=  '<span>&nbsp;</span>';
        }
        $('#'+editor_id).redactor('insertion.insertHtml', FixStrToPasteInRedactor(data));
    }
    else if(b_mentions)
    {
        UpdateRedactorContent('#'+editor_id, default_val,true);
    }
    RedactorInstances.push(editor_id);
}

function CreateHtmlResponseEditor(editor_id, track_changed, data, min_height,b_note_ff,b_not_focus,ph,auto_save_type,template = false, rating = 1, lang_id = null, files = null) {
    var b_notify_added = 0;
    var plugins = ['fontcolor','background_color','omni_pre','omni_autosave'];
    var buttons = ['bold', 'italic', 'underline', 'link',  'ol', 'ul', 'image', 'horizontalrule','line','background_color','omni_pre'];
    if(!window.client_id || client_id != av_client_id)
    {
        // быстрое создание шаблонов в АС
        if($('#'+editor_id).closest('.request-answer-area').length && !$('#email-new-request-box').length) {
            buttons.push('fast_templates');
            plugins.push('fast_templates');
        }

        if($('#'+editor_id).closest('#fast-template-modal').length) {
            // buttons.push('file');
            buttons.splice(6, 0, "file");
        }

        buttons.push('smile');
        plugins.push('smile');
    }

    // для fileAttachment
    let ccls = editor_id + '_redactor-upload-block';
    editorAttachBlock = '.' + ccls;
    if(!$('#'+editor_id).closest('#fast-template-modal form .rlt.select-lbl').parent().find(editorAttachBlock).length) {
        // $('#'+editor_id).closest('.ck_editor-signature').insertAfter('<div class="' + ccls + ' redactor-upload-block" />')
        $('<div class="' + ccls + ' redactor-upload-block" />').insertAfter($('#'+editor_id).closest('#fast-template-modal form .rlt.select-lbl'))
    }

    var attachFiles = {};
    if(files && lang_id != null)
    {
      files = JSON.parse(files);

      if(files && files[lang_id])
      {
        for(var i = 0; i < files[lang_id].length; i++)
        {
          let key = 'file-'+i;
          attachFiles[key] = files[lang_id][i];
        }
      }
    }

    var attach_key = $('input[name=attach_key]').val();

    var remove_url = '/staff/macros/RemoveMultipleUploadedFile';

    var app = $('#'+editor_id).redactor({
        linkSize: 300,
        omni_autosave_uid: !template ? GetUidForAutoSave(auto_save_type?auto_save_type:'case_reply') : false,
        // toolbarFixedTopOffset: 0,
        // toolbarFixedTarget:    $('#anchor-scroll').length ? '#response_answer_area' : null,
        toolbarFixedTopOffset: 14,
        toolbarFixedTarget:    '#anchor-scroll > .nano-content',
        stylesClass: 'redactor-layer redactor-styles js_omni_redactor_container',
        lang: 'ru',
        imageResizable: true,
        imagePosition: true,
        imageFigure: false,
        autoparseVideo: false,
        autoparseImages: false,
        focusEnd: b_not_focus ? false : true,
        // air: true,
        // emptyHtml: b_note_ff ? '<p>&#x200b;</p>' : '',
        invisibleSpace: '',
        plugins: plugins,
        buttons: buttons,
        minHeight: min_height+'px',
// 		paragraphy: false,
        cleanOnPaste: true,
        // linebreaks: true,
        breakline: true,
        replaceDivs: false,

        imageUpload: '/php/files.php',
        placeholder: ph||'',

        // todo change fileUpload .php
        fileUpload: template ? '/staff/macros/attach/'+attach_key : '/php/files.php',
        fileAttachment: editorAttachBlock,
        fileData: {
           rating: rating,
           lang_id: lang_id
        },
        selectionStart: 1,

        callbacks: {
            upload:
            {
                  error: function(response)
                  {
                      $('.redactor-modal-box .redactor-modal.open .redactor-modal-footer').html(response.message);
                  }
              },
            started: function(e)
            {
                // console.log('1');

                var temp_container = $('#response_answer_area').find('.js_omni_redactor_container')
                temp_container.find('table').each( function(id, el) {
                    while($(el).parents('.scroll-wrapper').length) {
                        $(el).unwrap();
                    }
                })
                temp_container.find('.scroll-element').remove();

                // С‚РѕР»СЊРєРѕ РґР»СЏ РђРЎ
                // setTimeout(function() {
                if(window.session_id !== undefined)
                {
                    if(typeof window.TableScrollReset === "function")
                    {
                        if(firstRun) {
                            TableScrollReset();
                            firstRun = false;
                        } else {
                            TableScrollReset($('#'+editor_id).parents('.text-area-box'));
                        }
                    }

                    // перемещение в тулбар иконки для звонка - обращение по звонку
                    if($('.icon_phone_in_redactor:visible').length) {
                        if(!$('.icon_phone_in_redactor:visible').parents('.redactor-toolbar').length) {
                            $('#response_answer_area .redactor-toolbar').append($('.icon_phone_in_redactor'))
                        }
                    }

                    // использование горячих клавиш
                    let edtr = this.editor;
                    InitedRedactors.push([editor_id, $('#'+editor_id).attr('data-redactor-uuid'), edtr])

                    if(!g_key_shortcuts_on) {
                        edtr.endFocus();
                    }

                }
                // }, 1)

                // если больше 20 символов в поле показываем "Быстрые шаблоны"
                let button_t = this.toolbar.getButton('fast_templates');
                if(button_t) {
                    if ($.trim(this.editor.getElement().text()).length >= 20) {
                      button_t.css('display', 'inline-block');
                  } else {
                      button_t.hide();
                    }
                }

                let targetFT = $('.chat_btn_create_t').length ? $('.chat_btn_create_t') : false;
                if(targetFT.length && !template) {
                    if ($.trim(this.editor.getElement().text()).length >= 20) {
                        targetFT.show();
                    } else {
                        targetFT.hide();
                    }
                }

                // для "Быстрые шаблоны"
                if($('#'+editor_id).closest('#fast-template-modal').length) {
                    RedactorNano($('#'+editor_id).closest('#fast-template-modal'));
                }

                this.selectionStart = data.length;
            },
            pasted: function()
            {
                // С‚РѕР»СЊРєРѕ РґР»СЏ РђРЎ
                if(window.session_id !== undefined)
                {
                    if(typeof window.TableScrollReset === "function")
                    {
                        TableScrollReset($('#'+editor_id).parents('.text-area-box'));
                    }
                }

            },
            inputConvertBefore: function(html) {
                var $wrapper = $.parseHTML('<div>' + html+'</div>')[0];
                $($wrapper).find('table').each(function () {
                    $(this).addClass('omni_redactor_table').css({'border-collapse': 'collapse','font-size': '1em','width': '100%;','border':'1px solid #ddd'});
                    $(this).find('td').css({'padding': '5px','border': '1px solid #ddd','vertical-align': 'top'});
                });
                return $($wrapper).html();

            },
            toolbar: {
                beforeFixed : function()
                {
                    $('#response_answer_area,.request-create-area').css('position','initial');
                },
                unfixed: function()
                {
                    $('#response_answer_area,.request-create-area').css('position','relative');
                },
                fixed: function()
                {
                    $(this.toolbar.$toolbar.nodes[0]).css('width',($(this.toolbar.$toolbar.nodes[0]).width()+34)+'px')
                }
            },
            changed: function()
            {
                last_redactor_focused = this;
                if ($.trim(this.editor.getElement().text()).match(/^\@/)
                    && $.trim(this.editor.getElement().text()).length <3
                    && !$('.notify_note_staff:visible').length
                    && (this.editor.getElement().parents('.text-area-box').hasClass('bg-add-note') ||
                        this.editor.getElement().parents('.chat_msg_win_box_wrap').hasClass('chat_orange2_bg')
                    )
                )
                {
                    this.editor.getElement().removeClass('redactor-placeholder')
                    NotifyNoteStaff('');
                    this.editor.getElement().removeClass('redactor-placeholder')
                }

                if (track_changed && window.activeButt)
                {
                    activeButt();
                    activeButt();
                }

                $(".request_create_nano").nanoScroller({alwaysVisible: true});

                if($("#"+ this.rootElement.id).parents('.chat_msg_nano').length) {
                    OrangeScrollInit();
                }

                // если больше 20 символов в поле показываем "Быстрые шаблоны"
                let button_t = this.toolbar.getButton('fast_templates');
                if(button_t) {
                    if ($.trim(this.editor.getElement().text()).length >= 20) {
                      button_t.css('display', 'inline-block');
                  } else {
                      button_t.hide();
                    }
                }

                let targetFT = $('.chat_btn_create_t').length ? $('.chat_btn_create_t') : false;
                if(targetFT.length && !template) {
                    if ($.trim(this.editor.getElement().text()).length >= 20) {
                        targetFT.show();
                    } else {
                        targetFT.hide();
                    }
                }


                if($('#fast-template-modal:visible').length) {
                    let form = $('#fast-template-modal').find('form');
                    let submit_btn = form.find('.btn_save');
                    let fld_name = $('#fast_template_name');
                    let fld_answer = $('.fast-template-red');
                    var b_note = +$('#fast-template-modal form input[name="b_note"]').val();
                    let hasRedactorContent = Array.from(fld_answer).some(function(item) {
                        let id = $(item).attr('id');
                        // console.log(id, GetRedactorCode(id).trim().length, $(item).val().trim().length)
                        if((b_note && id == 'fast-template-red-note') ||  (!b_note && id != 'fast-template-red-note'))
                        {
                          return GetRedactorCode(id) ? GetRedactorCode(id).trim().length : $(item).val().trim().length;
                        }
                        return false;
                    })

                    if ($(this.editor.getElement().nodes).closest('label').find('.list_lang_form').length) {
                        let lang_id = editor_id.replace('fast-template-red-', '');

                        if ($.trim(this.editor.getElement().text()).length) {
                            $(this.editor.getElement().nodes).closest('label').find('.change_fast_template_red[data-lang_id="'+lang_id+'"]').addClass('translated').removeClass('notranslated');
                        } else {
                            $(this.editor.getElement().nodes).closest('label').find('.change_fast_template_red[data-lang_id="'+lang_id+'"]').addClass('notranslated').removeClass('translated');
                        }
                    }

                    // console.log(hasRedactorContent)

                    if(fld_name.val().trim().length && hasRedactorContent) {
                        submit_btn.removeAttr('disabled');
                    } else {
                        submit_btn.prop('disabled', 'disabled');  // console.log(fld_name.val().trim().length, hasRedactorContent);
                    }

                    $('.redactor_nano').nanoScroller({alwaysVisible: true});

                    if(!form.find('.nano-pane').is(':visible')) {
                        form.find('.js_omni_redactor_container').css('padding-right', '0');
                    } else {
                        form.find('.js_omni_redactor_container').css('padding-right', '15px');
                    }


                }
                if(this.offset.get())
                {
                  this.selectionStart = this.offset.get().end;
                }

            },
            imageUpload: function(image, json)
            {
                $('.attach_drag_area').removeClass('active new_height');
            },
            file: {
                appended: function(file, response)
                {
                    setTimeout(function() {
                        if($('#'+editor_id).closest('.fast-template-nano').length) {
                            $('.fast-template-nano').nanoScroller({alwaysVisible: true});
                        }
                    }, 10)
                },
                deleted: function(file)
                {
                    setTimeout(function() {
                        if($('#'+editor_id).closest('.fast-template-nano').length) {
                            $('.fast-template-nano').nanoScroller({alwaysVisible: true});
                        }
                    }, 10)
                },
                delete: function(file)
                {
                    if(template){
                      var attach_key = $('input[name=attach_key]').val();
                        deleteFiles(file,attach_key, lang_id, remove_url);
                    }
                }
            },
            blur: function(e)
            {
                last_redactor_focused = this;
                $('#'+editor_id).parent().find('.redactor-layer notify').removeClass('focus');

            },
            focus: function(e)
            {
                last_redactor_focused = this;
            },
            keydown: function (e)
            {
                last_redactor_focused = this;
                if(window.getSelection().toString() == this.editor.getElement().text() && this.editor.getElement().text().substring(0,1) == '@' && e.keyCode>46 && !e.ctrlKey && !e.altKey && !e.shiftKey)
                {
                    this.editor.getElement().html('')
                }

                // удаление пустых тегов через Backspace, если редактор без текста
                if(
                    (
                        GetRedactorCode(editor_id).match('<blockquote>') !== null
                        ||
                        GetRedactorCode(editor_id).match('<ul>') !== null
                        ||
                        GetRedactorCode(editor_id).match('<ol>') !== null
                    )
                    && this.editor.getElement().text().trim() == ''
                    && e.keyCode == 8
                    )
                {
                    this.editor.getElement().html('');
                }

                if($('.notify_note_staff:visible').length && $('.notify_note_staff:visible .highlight').length && (e.keyCode == 13))
                {
                    // this.selection.save();
                    e.stopPropagation();
                    $('.notify_note_staff:visible .highlight a').click();
                    b_notify_added = 1;
                    return false;
                }
                if(e.keyCode == 46 || e.keyCode == 8)
                {
                    // С‚РѕР»СЊРєРѕ РґР»СЏ РђРЎ
                    if(window.session_id !== undefined)
                    {
                        if(typeof window.TableScrollReset === "function")
                        {
                            TableScrollReset($('#'+editor_id).parents('.text-area-box'));
                        }
                    }
                }
            },
            keyup: function(e)
            {
              if(this.offset.get())
              {
                this.selectionStart = this.offset.get().end;
              }
                if(e.keyCode == 46 || e.keyCode == 8)
                {
                    if(!StripTags(this.editor.getElement().html()).length)
                    {
                        this.editor.getElement().html('')
                    }
                }
                last_redactor_focused = this;
                //  убрал в рамках задачи "Проблемы с редактором на странице обращения" п3 - 8.10.21
                // this.selection.save();
                if((!this.editor.getElement().parents('.text-area-box').hasClass('bg-add-note') &&
                    !this.editor.getElement().parents('.chat_msg_win_box_wrap').hasClass('chat_orange2_bg')) || b_notify_added)
                {
                    b_notify_added = 0;
                    if ($.trim(this.editor.getElement().text()) == '@')
                    {
                        if($('#add_note:visible').length)
                        {
                            $('#add_note').trigger('click',1);

                        }
                    }

                    return;
                }
                if(typeof NotifyNoteStaff != 'function') {
                    return
                }
                $('#'+editor_id).parent().find('.redactor-layer notify').removeClass('focus');
                if (_p = CheckFocusResponseNotify())
                {
                    if (e.keyCode    != 38//keys['up']
                        && e.keyCode != 40//keys['down']
                        && e.keyCode != 37//keys['left']
                        && e.keyCode != 39//keys['right']
                    )
                    {
                        DeleteResponseNotify();
                    }
                    else
                    {
                        $(_p).addClass('focus');
                    }
                }
                if($('.redactor-layer:focus').length && $('.notify_note_staff:visible').length)
                {
                    if (e.keyCode == 38//keys['up']
                     || e.keyCode == 40//keys['down']
                     || e.keyCode == 13//keys['enter']
                     )
                    {
                        return false;
                    }
                }
                if (e.keyCode === 8 || e.keyCode === 46)
                {
                    DeleteResponseNotify();
                }
                NotifyNoteStaff(false)

                if (!CheckFocusResponseNotify())
                {
                    setTimeout(function() {
                        NotifyNoteStaff(GetResponseNotify())
                    }, 100)
                }

            },
            enter:function (event) {
                if($('.notify_note_staff:visible').length && $('.notify_note_staff:visible .highlight').length)
                {
                    return false;
                }

                if(event.keyCode === 13 && location.href.match(/\/cases\/record/) && (event.ctrlKey || event.metaKey) && !window.b_open_modal)
                {
                    return false;
                }
            },
            click: function(e){
              if(this.offset.get())
              {
                this.selectionStart = this.offset.get().end;
              }
            }
        }
    });

    if(data && data == '@') {
        $('#'+editor_id).redactor('source.setCode', FixStrToPasteInRedactor(data));
        NotifyNoteStaff(GetResponseNotify())

        // для фокуса на заметке, при вводе @ в обычном редакторе
        let curTextareaUuid = '';
        if($('#response_answer_area:visible').length) {
            curTextareaUuid = parseInt($('#response_answer_area:visible').find('textarea#response_html:not(.hidden)').attr('data-redactor-uuid'))
        } else {
            curTextareaUuid = parseInt($('.chat_msg_win_box_wrap:visible').find('textarea.chat_msg_win_box:not(.hidden)').attr('data-redactor-uuid'))
        }

        let curRedactor = InitedRedactors.filter(function(item) {
            return parseInt(item[1]) == curTextareaUuid
        })
        curRedactor = curRedactor[0][2];
        setTimeout(function() {
            curRedactor.endFocus();
        }, 50)
    }
    else if(data) {
        $('#'+editor_id).redactor('source.setCode', FixStrToPasteInRedactor(data));
    }

    if(Object.keys(attachFiles).length)
    {
      app.module.file.insert(attachFiles);
    }

    RedactorInstances.push(editor_id);
    return app;
}



function deleteFiles(file,attach_key, lang_id = null, url){

  var files = [];
  if(file.nodes && Array.isArray(file.nodes))
  {
    for(var i=0; i < file.nodes.length;i++)
    {
      if(file.nodes[i].dataset && file.nodes[i].dataset.file)
      {
        files = file.nodes[i].dataset.file;
      }
    }
  } console.log(files);
  if(files.length > 0)
  {
    $.ajax({
      type: 'POST',
      data: {file_name:files, attach_id: attach_key,attach_type:'mc', lang_id:lang_id},
      url: url,
      success:function(){}
    });
  }
}

function CreateKnowledgeArticlesHtmlEditor(editor_id, minHeight, maxHeight) {
    SetupSyncForm(editor_id);

    $('#'+editor_id).redactor({
        linkSize: 300,
        toolbarFixedTopOffset:0,
        stylesClass: 'redactor-layer redactor-styles js_omni_redactor_container',
        lang: 'ru',
        plugins: ['fontsize', 'fontcolor', 'background_color', 'table', 'video','alignment', 'codemirror'],
        buttons: ['format', 'fontsize', 'fontcolor', 'background_color', 'bold', 'italic', 'underline', 'ul', 'ol', 'outdent', 'indent', 'link', 'image','line', 'table', 'video', 'alignment', 'horizontalrule', 'codemirror','html'],
        minHeight: minHeight+'px',
        source: {
            codemirror: {
                lineNumbers: true,
                mode: "htmlmixed",
                lineWrapping: true,
            }
        },
        // maxHeight: maxHeight+'px',
        // emptyHtml: '',
        // invisibleSpace: '',

        imageFigure: true,
        imageResizable: true,
        autoparseImages: false,
        imagePosition: true,
        imageUpload: '/upload_kb_img/'+$('input[name=article_id]').val(), //'/php/files.php',
        callbacks: {
            started: function()
            {
                // console.log('11');

                let startedText = $('#'+editor_id).text();

                if(startedText.match('<pre') !== null || startedText.match('&amp;lt;pre') !== null || startedText.match('&lt;pre') !== null) {
                    $('.article-edit-cont .redactor-layer > *').css('opacity', 0)
                    setTimeout(function() {
                        if(startedText.trim().length > 0) {
                            // console.log(startedText)
                            htmlWithPre = startedText;
                            htmlWithPre = htmlWithPre.replace(/&lt;pre&gt;/g, '').replace(/&lt;\/pre&gt;/g, '')
                            htmlWithPre = htmlWithPre.replace(/&lt;br\s?\/?&gt;/g, '<bar>')

                            InsertRedactorHtml(editor_id, htmlWithPre, true, true);

                            let editorPre = $('#'+editor_id).parent().find('.redactor-layer pre');
                            editorPre.each(function() {
                                $(this).text($(this).text().replace(/<bar>/g, '<br>'))
                            })
                            htmlWithPre = '';
                            $('.article-edit-cont .redactor-layer > *').css('opacity', 1)
                        }
                    }, 1)
                }
            },
            blur: function (e) {
                for ( var el_id in redactorjs_replaced_arr)
                {
                    $(el_id).redactor('module.source.sync');
                    str = $(el_id).val();
                    data = redactorjs_replaced_arr[el_id];
                    for (var from in data)
                    {
                        str = str.replace( new RegExp(regex_escape('http://'+window.location.host+from), "g"),data[from]);
                        str = str.replace( new RegExp(regex_escape('https://'+window.location.host+from), "g"),data[from]);
                        str = str.replace( new RegExp(regex_escape(from), "g"),data[from]);
                    }
                    UpdateRedactorContent(el_id, str);
                    // delete redactorjs_replaced_arr[el_id];

                }
            },
            keyup: function(e)
            {
                // С‚РѕР»СЊРєРѕ РґР»СЏ РђРЎ
                if(window.session_id !== undefined)
                {
                    if(typeof window.mainContMinH === "function")
                    {
                        mainContMinH();
                    }
                }

            },
            pasteBefore: function(html)
            {
                let editorPre = $('#'+editor_id).parent().find('.redactor-layer pre');
                if(editorPre.length > 0) {
                    editorPre.each(function() {
                        $(this).text($(this).text().replace(/<br\s?\/?>/g, '<bar>'))

                        allowGetFromRedactorHtml = true;
                        getFromRedactorHtml = $('#'+editor_id).parent().find('.redactor-layer').html();
                    })
                }
            },
            pasting: function(html)
            {
                if(html.match('<pre>') !== null) {
                    htmlWithPre = html;
                    htmlWithPre = htmlWithPre.replace(/&lt;pre&gt;/g, '').replace(/&lt;\/pre&gt;/g, '')
                    htmlWithPre = htmlWithPre.replace(/&lt;br\s?\/?&gt;/g, '<bar>')
                    // console.log(htmlWithPre)
                }
            },
            pasted: function(nodes)
            {
                // С‚РѕР»СЊРєРѕ РґР»СЏ РђРЎ
                if(window.session_id !== undefined)
                {
                    if(typeof window.mainContMinH === "function")
                    {
                        mainContMinH();
                    }
                }

                if(htmlWithPre.trim().length > 0) {
                    InsertRedactorHtml(editor_id, htmlWithPre, true, false, allowGetFromRedactorHtml);
                    let editorPre = $('#'+editor_id).parent().find('.redactor-layer pre');
                    if(editorPre.length > 0) {
                        editorPre.each(function() {
                            $(this).text($(this).text().replace(/<bar>/g, '<br>'))
                        })
                    }
                    htmlWithPre = '';
                }
            },
            source : {
                // changed: function (html) {
                //     // f = this.source.$source.nodes[0];
                    // f = this.source.$source.nodes[0];
                //     if (!$(f).attr('data-dheight'))
                //     {
                //         $(f).attr('data-dheight', parseInt(f.style.height));
                //     }
                //     AutoExpandField(f, $(f).attr('data-dheight'));
                // },
                opened: function (html) {
                    // f = this.source.$source.nodes[0];
                    // $(f).parent().find('.CodeMirror').css({'height': 'auto'});

                //     if (!$(f).attr('data-dheight'))
                //     {
                //         $(f).attr('data-dheight', parseInt(f.style.height));
                //     }

                //     AutoExpandField(f, $(f).attr('data-dheight'));


                //     // пересмотр высоты редактора
                //     $('.CodeMirror').css('height', $('.CodeMirror-sizer').outerHeight() + 30 + 'px'); // 30 --- additional

                    if(window.session_id !== undefined) {
                        if(typeof window.mainContMinH === "function")
                        {
                            mainContMinH();
                        }
                    }
                },
                close: function (html) {
                    if(html.match('<pre>') !== null){
                        htmlWithPre = $(this.source.$source.nodes).val();
                        htmlWithPre = htmlWithPre.replace(/&lt;br\s?\/?&gt;/g, '<bar>').replace(/<br\s?\/?>/g, '<bar>')
                    }
                },
                closed: function () {
                    if(htmlWithPre.trim().length > 0) {
                        InsertRedactorHtml(editor_id, htmlWithPre, true, true);

                        let editorPre = $('#'+editor_id).parent().find('.redactor-layer pre');
                        if(editorPre.length > 0) {
                            editorPre.each(function() {
                                $(this).text($(this).text().replace(/<bar>/g, '<br>'))
                            })
                        }
                        htmlWithPre = '';
                    }
                }
            }
        }
    });
    RedactorInstances.push(editor_id);
}

function CreateChatReplyHtmlEditor(editor_id, height, data) {
//     SetupSyncForm(editor_id);
//
//     var $textareaElem = $('#' + editor_id);
//
//     var buttons = [];
//     var plugins = [];
//     if(!window.client_id || client_id != av_client_id) {
//         buttons.push('smile');
//         plugins.push('smile');
//     }
//
//     var redactor_data = {
//         lang: 'ru',
//         spellcheck: false,
//         buttons: buttons,
//         plugins: plugins,
//         minHeight: height,
//         maxHeight: height,
//         focusEnd: false,
//
//         pastePlainText: false,
//         pasteImages: true,
//         pasteLinks: false,
//         pasteBlockTags: [],
//         pasteOmniPlainText: true,
//         pasteInlineTags: ['span', 'img'], // user mention layout support
//
//         dragImageUpload: false,
//         multipleImageUpload: false,
//         clipboardImageUpload: false,
//
//         dragFileUpload: false,
//
//         linkTooltip: false,
//         linkify: false,
//
//         imageEditable: false,
//
//         removeNewlines: false,
//
//         toolbar: false,
//         cleanOnPaste: false,
//         replaceDivs: false,
//         emptyHtml: '',
//         invisibleSpace: '',
//         shortcuts: {},
//         callbacks: {
//             focus: function(e)
//             {
//                 last_redactor_focused = this;
//                 $textareaElem.redactor('placeholder.hide');
//             },
//             blur: function(e)
//             {
// //                last_redactor_focused = this;
//                 if ($textareaElem.redactor('code.get').length === 0) {
//                     $textareaElem.redactor('placeholder.show');
//                 }
//                 this.code.startSync();
//             },
//             changed: function (obj, event)
//             {
// //                last_redactor_focused = this;
//                 activeButt();
//             },
//             keyup: function(e) {
//                 last_redactor_focused = this;
//                 if ((!this.editor.getElement().parents('.text-area-box').hasClass('bg-add-note') &&
//                     !this.editor.getElement().parents('.chat_msg_win_box_wrap').hasClass('chat_orange2_bg')) || b_notify_added)
//                 {
//                     if (this.editor.getElement().text() == '@')
//                     {
//                         if ($('.chat_btn_connect_c:visible').length)
//                         {
//                             $('.chat_btn_connect_c').click();
//                         }
//                     }
//
//                     return;
//                 }
//             }
//         }
//     };
//     $textareaElem.redactor(redactor_data);
//     // $textareaElem.before('<div contenteditable="true" class="chat_msg_win_box"></div>');
//     $textareaElem.hide();
//
//     if (data) {
//         $textareaElem.redactor('insert.html', data);
//     }
//
//     RedactorInstances.push(editor_id);
}

function IsSetRedactorInstance(editor_id) {
    var RedactorInstance = GetRedactorInstance(editor_id);
    if(RedactorInstance) {
        return true;
    } else {
        return false;
    }
}

function GetRedactorInstance(editor_id) {
    var RedactorInstance = false;
    for(var i=0; i<RedactorInstances.length; i++) {
        if(editor_id==RedactorInstances[i]) {
            RedactorInstance = true;
            break;
        }
    }
    return RedactorInstance;
}
function DestroyRedactorInstance(editor_id) {
    var RedactorInstance = false;
    for(var i=0; i<RedactorInstances.length; i++) {
        if(editor_id==RedactorInstances[i]) {
            RedactorInstance = true;
            delete  RedactorInstances[i];
            break;
        }
    }
    if(RedactorInstance)
    {
        $('#' + editor_id).redactor('destroy');
        $('#' + editor_id).hide();
    }
}

function SyncRedactorCode(editor_id) {
    editor_id = typeof editor_id == 'string' && !editor_id.match(/^[#\.]/) ? '#'+editor_id : editor_id;
    return (typeof editor_id == 'object') ? $(editor_id).redactor('module.source.sync') : $(editor_id).redactor('module.source.sync');

}

function GetRedactorCode(editor_id, sync) {
    SyncRedactorCode(editor_id);
    SyncRedactorCode(editor_id);
    if(sync) {
    }
    try
    {
        var _str = (typeof editor_id == 'object') ? $(editor_id).redactor('source.getCode') : $('#'+editor_id).redactor('source.getCode');
        return typeof _str === 'string' ? _str.replace(/<\/div> <div/g,'</div><div') : _str;
    }
    catch (e)
    {
        return '';

    }
}

function SetRedactorCode(editor_id, html) {
    $('#'+editor_id).redactor('focusEnd');
    return $('#'+editor_id).redactor('insertion.insertHtml', FixStrToPasteInRedactor(html));
}

function InsertRedactorText(editor_id, html) {
    // if(last_redactor_focused)
    // {
    //     last_redactor_focused.selection.restore();
    // }
    return $('#'+editor_id).redactor('insertion.insertHtml', FixStrToPasteInRedactor(html));
}

function InsertRedactorHtml(editor_id, html, withPre, clearPrevHtml, redactorCode) {
    // var temp_html = GetRedactorCode(editor_id, true);
    var temp_html = '';
    if(redactorCode == true) {
        temp_html = clearPrevHtml == true ? '' : getFromRedactorHtml;
        getFromRedactorHtml = '';
    } else {
        temp_html = clearPrevHtml == true ? '' : GetRedactorCode(editor_id, true);
    }

    // temp_html = temp_html.replace(/<p><\/p>/g,'');
    temp_html = temp_html + (withPre == true ? html : FixStrToPasteInRedactor(html));

    var res = $('#'+editor_id).redactor('source.setCode', temp_html);
//    $('#'+editor_id).redactor('selection.remove');

    if (last_redactor_focused)
    {
        placeCaretAtEnd(last_redactor_focused.editor.$editor.nodes[0]);
    }
    else
    {
        $('#'+editor_id).redactor('focusEnd');
    }
    return res;

}

function ClearRedactorContent(editor_id){
    return $('#'+editor_id).redactor('source.setCode','');
}
function UpdateRedactorContent(editor_id,data,b_focus){
    if(data && data.match(/<notify/))
    {
        data += '<span>&nbsp;</span>';
    }
    // $(editor_id).redactor('selection.save');
    // $(editor_id).redactor('source.setCode',FixStrToPasteInRedactor(data));
    if(data)
    {
        if(data.match('<pre') !== null || data.match('&amp;lt;pre') !== null || data.match('&lt;pre') !== null) {
            data = data.replace(/&lt;br\s?\/?&gt;/g, '<bar>').replace(/&amp;lt;br\s?\/?&amp;gt;/g, '<bar>')
            $(editor_id).redactor('source.setCode', data);

            let editorPre = $(editor_id).parent().find('.redactor-layer pre');
            editorPre.each(function() {
                $(this).text($(this).text().replace(/<bar>/g, '<br>'))
            })
        } else {
            $(editor_id).redactor('source.setCode', FixStrToPasteInRedactor(data));
        }
    }

    // setTimeout(function ()
    // {
    // 	$(editor_id).redactor('selection.restore');
    //
    // },300);
    if(b_focus)
        $(editor_id).redactor('focusEnd');
    if (data)
    {
        PlaceholderInit(editor_id,'');
    }

}
function PlaceholderInit(editor_id,placeholder)
{
    var  t = GetRedactorCode(editor_id)
    if(t && t.length)
    {
        placeholder ='';
    }
    // console.log(editor_id,GetRedactorCode(editor_id).length);
    // console.trace();
    // $(editor_id).redactor('placeholder',placeholder);
    if (!placeholder.length)
    {
        $R.dom(editor_id).parent().find('.redactor-layer').removeClass('redactor-placeholder');
    }
    else
    {
        $R.dom(editor_id).parent().find('.redactor-layer').attr('placeholder',placeholder);
    }
    // if(placeholder)
    // {
    //     $R.dom(editor_id).parent().addClass('redactor-placeholder');
    // }
    // else
    // {
    //     $R.dom(editor_id).parent().attr('placeholder',placeholder);
    //     $R.dom(editor_id).parent().removeClass('redactor-placeholder');
    // }
}
function PlaceholderHide(editor_id)
{
    $R.dom(editor_id).parent().find('.redactor-layer').removeClass('redactor-placeholder');

}
function GetResponseNotify()
{
    if (last_redactor_focused)
    {
        last_redactor_focused.editor.focus();
        // last_redactor_focused.selection.restore();
    }

    if (window.getSelection)
    {
        var selection = window.getSelection();
    }
    else if (document.selection && document.selection.type !== "Control")
    {
        var selection = document.selection;
    }
    else
    {
        return false;
    }
    // selection = last_redactor_focused.selection.get();

    // var selection = $('#'+editor_id).redactor('selection.get');
    if (selection.anchorNode)
    {
        if(selection.anchorNode.innerHTML)
        {
            var t = selection.anchorNode.innerHTML;
        }
        else
        {
            var t = selection.anchorNode.textContent;
        }
        if(!t)
        {
            return false;
        }
        var caret_pos = selection.anchorOffset;
        if(t.match(/^\u200B/))
        {
            caret_pos--;
        }
        var current_pos = 0;
        t = t.replace(/\u200B/g,'');
        var arr = t.split(' ');

        var el = false;
        for (var i = 0; i < arr.length; i++)
        {
            current_pos += arr[i].length;
            if (caret_pos <= current_pos)
            {
                current_pos -= arr[i].length;
                el = arr[i].replace(/\u200B/g,'').trim();
                break;
            }
            caret_pos--;
        }
        if (el)
        {
            if (el.substring(1) == '@')
            {
                var len = caret_pos - current_pos;
                if (len > 0)
                {
                    el = el.substring(2, len);
                }
                if(el == "@") {
                    el = '';
                }
                return el;
            }
            else if (el.substring(0, 1) == '@')
            {
                var len = caret_pos - current_pos;
                if (len > 0)
                {
                    el = el.substring(1, len);
                }
                if(el == "@") {
                    el = '';
                }
                return el;
            }
            // else
            // {
            //     NotifyNoteStaff(false)
            // }
        }
    }
    return false;
}
function ReplaceResponseNotify(notify,replaced)
{
    if (last_redactor_focused)
    {
        last_redactor_focused.editor.focus();
        // last_redactor_focused.selection.restore();
    }

    if (window.getSelection)
    {
        var selection = window.getSelection();
    }
    else if (document.selection && document.selection.type !== "Control")
    {
        var selection = document.selection;
    }
    else
    {
        return false;
    }
    // selection = last_redactor_focused.selection.get();
    //    console.log(selection);
    var b_redactor = true;
    var content = selection.anchorNode.textContent;//root.nodeValue;
    // РџСЂРѕРІРµСЂРёРј РµСЃС‚СЊ Р»Рё СЃРѕРІРїР°РґРµРЅРёСЏ СЃ РїРµСЂРµРґР°РЅРЅС‹Рј С‚РµРєСЃС‚РѕРј
    if (~content.indexOf(notify)) {
        if (document.createRange && selection.rangeCount > 0) {
            var range = selection.getRangeAt(0);
            range.setStart(selection.anchorNode, content.indexOf(notify));
            range.setEnd(selection.anchorNode, content.indexOf(notify) + notify.length);
            range.deleteContents();

            if(b_redactor)
            {
                var el = document.createElement("div");
                el.innerHTML = replaced+'&nbsp;';
                var frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
            }
            else
            {
                var lastNode = document.createTextNode(replaced);
                range.insertNode(lastNode);
            }

            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

        } else {
            // return false;
            // alert( 'Р’РµСЂРѕСЏС‚РЅРѕ, Сѓ РІР°СЃ IE8-, СЃРјРѕС‚СЂРёС‚Рµ СЂРµР°Р»РёР·Р°С†РёСЋ TextRange РЅРёР¶Рµ' );
        }
    }
    NotifyNoteStaff(false);
}

function CheckFocusResponseOnEl(tagName,css_class )
{
    var parentEl = null;
    if (window.getSelection)
    {
        selection = window.getSelection();
        if(selection && selection.rangeCount > 0)
        {
            parentEl = selection.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1)
            {
                parentEl = parentEl.parentNode;
            }
        }
    }
    else if (document.selection && document.selection.type !== "Control")
    {
        var selection = document.selection;
        parentEl = selection.createRange().parentElement();
    }
    if(parentEl && parentEl.tagName == tagName)
    {
        if(!css_class ||
            (css_class && $(parentEl).hasClass(css_class)))
        {
            return parentEl;
        }
    }
    return false;

}
function insertTextAtCursor_(text) {
    var sel, range, html;
    sel = window.getSelection();
    range = sel.getRangeAt(0);

    range.deleteContents();
    var lastNode = document.createTextNode(text);
    range.insertNode(lastNode);


    range = range.cloneRange();
    range.setStartAfter(lastNode);
    range.collapse(true);

    // Chrome fix
    sel.removeAllRanges();
    sel.addRange(range);
}

function CheckFocusResponseNotify()
{
    return CheckFocusResponseOnEl('NOTIFY');
}
function DeleteResponseNotify()
{
    var parentEl = CheckFocusResponseNotify();
    if(parentEl)
    {
        $(parentEl).remove();
    }
}
function GetUidForAutoSave(type)
{
    if(type == 'case_reply')
    {
        return window.CurrentStaffId && CurrentCaseId ? type+'_'+CurrentStaffId+'_'+CurrentCaseId : null;
    }
    if(type == 'case_note')
    {
        return window.CurrentStaffId && CurrentCaseId ? type+'_'+CurrentStaffId+'_'+CurrentCaseId : null;
    }
    return null;
}
function DeleteAutoSaveRedactor(type)
{
    if(!last_dynamic_autosave)
    {
        return false
    }

    var uid = GetUidForAutoSave(type);
    if(CheckLocalStorage() && uid)
    {
        localStorage.removeItem(uid)
    }
    return true;
}

function GetAutoSaveRedactor(type)
{
    var uid = GetUidForAutoSave(type);
    if(CheckLocalStorage() && uid)
    {
        t = localStorage.getItem(uid);
        return t && StripTags(t).replace(/&nbsp;/gi,'').trim().length ? t : '';
    }
    return '';
}
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}
function placeCaretAtRowEnd(el) {
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        var range = document.createRange()
        var sel = window.getSelection()

        if(sel.anchorNode) {
            if($(el).children('p').length && $(sel.anchorNode).closest('li').length && $(sel.anchorNode).closest('.redactor-layer').length) {

                let start = $(el).children('p')[0].childNodes[0];
                let end = $(el).children('p')[0].childNodes[0].textContent.length;

                range.setStart(start, end)
                range.collapse(true)

                sel.removeAllRanges()
                sel.addRange(range)
            }
        } else {
            return true;
        }
    }
}
function isHTML(str) {
    var a = document.createElement('div');
    a.innerHTML = str;

    for (var c = a.childNodes, i = c.length; i--; ) {
        if (c[i].nodeType == 1) return true;
    }

    return false;
}
function FixStrToPasteInRedactor(str)
{
    return isHTML(str) ? str.replace(/\r\n/g,' ').replace(/\n/g,' ') : str;
}
function updateArticleImgs(arr)
{
    for(var lang_id in arr)
    {
        var data = arr[lang_id];
        if(!redactorjs_replaced_arr['textarea.article_key_content_' + lang_id])
        {
            redactorjs_replaced_arr['textarea.article_key_content_' + lang_id] = {};
        }
        for (var from in data)
        {
            redactorjs_replaced_arr['textarea.article_key_content_' + lang_id][from] = data[from];
        }

        // var str  = $('textarea.article_key_content_'+lang_id).val();
        // var str_ = str;
        // for (var from in data)
        // {
        //     str = str.replace( new RegExp(regex_escape('http://'+window.location.host+from), "g"),data[from]);
        //     str = str.replace( new RegExp(regex_escape('https://'+window.location.host+from), "g"),data[from]);
        //     str = str.replace( new RegExp(regex_escape(from), "g"),data[from]);
        // }
        // if(str_ != str)
        // {
        //     redactorjs_replaced_arr['textarea.article_key_content_' + lang_id] = str;
        //     // UpdateRedactorContent('textarea.article_key_content_' + lang_id, str);
        // }
    }
}
