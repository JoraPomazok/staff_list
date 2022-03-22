var import_file='';
var imports_arr = ['zendesk','freshdesk','okdesk'];
$(document).ready(function(){
	$('#import_help').click(function() {
		$('.pp_help').togglePopup();
		$('.main-support-request[name="support_request_subject"]').val(Translate('settings_import_js/adding_other_import_service'));
		return false;
	})

	/*
	$('.chosen-select').chosen({
		disable_search: true,
		//inherit_select_classes: true,
		width: "100%"
	});
	setIgnore();
	*/


   $('.common_import_win form input').on('blur', function() {
       let forms = $('.common_import_win form:visible');
       if(forms[0].id && ['zendesk_form','freshdesk_form'].indexOf(forms[0].id) != -1)
       {
           return;
       }

       forms.each(function() {
           let form = $(this);
           let el = form.find('input[type="text"][id]:visible:not(:disabled), input[type="password"]:visible');
           let submitBtn = form.find('a[class*="_import"]');

           let allSettedArr = [];
           let allSetted = false;

           el.each(function() {
               allSettedArr.push($(this).val().trim().length > 0);
           })
           allSetted = allSettedArr.every(function(item) {
               return item == true;
           })

           if(allSetted) {
               submitBtn.removeClass('helpdesk_import_disabled');
           } else {
               submitBtn.addClass('helpdesk_import_disabled');
           }
       })
   })

    $('#import_period, #yandex_set_closed, .js_only_num').on('keypress', function(e) {
        if(isNaN(this.value+""+String.fromCharCode(e.charCode))) return false;
    })
    .on("cut copy paste",function(e){
        e.preventDefault();
    });

	$(document).on('click', '.migration > div', function() {
        if($(this).hasClass('helpdesk') && client_has_helpdesk) {
            ShowXajaxNotification('CLIENT_HAS_HELPDESK');
            return false;
        }
        if($(this).hasClass('import_mail') && client_has_email) {
            ShowXajaxNotification('CLIENT_HAS_EMAIL');
            return false;
        }
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		$('.settings-import__wrapper .ckeditor').hide();
		$('.migration_selector p').removeClass('active');
		$('.helpdesk_container').hide();
		$('.import_mail_container').hide();
		$('.csv_file_container').hide();

		if ($(this).hasClass('helpdesk')){
			$('.ckeditor1').show();
            $('.migration_selector').show();
            $('.migration_selector .helpdesk_selector').addClass('active')
			$('.helpdesk_container').show();
            $('.common_import_win').hide();
            $('.migration_selector .helpdesk_selector a').removeClass('migration_active')

            $('.zendesk_win').show();
            $('.migration_selector a.zendesk').addClass('migration_active');
		} else if ($(this).hasClass('import_mail')) {
			$('.ckeditor2').show();
            $('.migration_selector').show();
			$('.migration_selector .import_mail_selector').addClass('active');
			$('.import_mail_container').show();

			$('.yandex_win').show();
            // $('.migration_selector a.yandex').addClass('migration_active')
		} else if ($(this).hasClass('csv_file')) {
			$('.ckeditor3').show();
			$('.common_import_win').hide();
            $('.migration_selector').hide();

			$('.csv_file_container').show();

			if(import_file) {
				$('.csv_step1').show();
				$('.csv_step2').show();
				SelectNano( `.csv_step2` )
			} else {
				$('.csv_step1').show();
				$('.csv_step2').hide();
			}
		}
	});

    $(document).on('click', '.migration_selector .helpdesk_selector a', function() {
        $(this).addClass('migration_active');
        $(this).siblings().removeClass('migration_active');
        for (var i in imports_arr)
        {
            if ($(this).hasClass(imports_arr[i])) {
                $('.common_import_win').hide();
                $('.'+imports_arr[i]+'_win').show();
            }
        }
    });
    $(document).on('click', '.migration_selector .import_mail_selector a', function() {
        $(this).addClass('migration_active');
        $(this).siblings().removeClass('migration_active');
        $('#import_email_type').val($(this).attr('rel'))
    });


	if(client_has_helpdesk) {
		$('.csv_file').trigger('click');
	} else {
		$('.helpdesk').trigger('click');
	}

	$('#start_import').click(function(e) {
		e.preventDefault();
		NewShowSpinButton('start_import');
		$('#cancel_link').hide();

		var email_found = false;
		var phone_found = false;
		var fields_found = false;
		var import_fields = [];

		$('#data_table select').each(function() {
			var current_val = $(this).val();
			if(current_val=='emailaddress') {
				email_found = true;
				fields_found = true;
			} else if(current_val=='phone') {
				phone_found = true;
				fields_found = true;
			} else if(current_val=='full_name' || current_val=='company_name' || current_val=='company_position') {
				fields_found = true;
			}
			import_fields.push(current_val);
		});

		if(!import_file || !fields_found || (!email_found && !phone_found)) {
			NewHideSpinButton('start_import');
			if(!import_file) {
				ShowXajaxNotification('IMPORT_ERROR');
			} else if(!fields_found) {
				ShowXajaxNotification('EMPTY_FIELDS');
			} else {
				ShowXajaxNotification('NO_EMAIL');
			}
		} else {
			xajax_ImportCsv(import_file, JSON.stringify(import_fields));
		}
	});

	$('#cancel_link').click(function() {
		ResetUploadForm();
	});

	$('#csv_file').change(function() {
		NewShowSpinButton('csv_file_span');
		$('#upload_csv_form').submit();
	});

	$('#upload_csv_form').ajaxForm({
		complete: function(xhr) {
			response = xhr.responseText;
			if(response) {
				response = JSON.parse(response);
				img_id = response.img_id;

				HideSpinButton('button_update');
				if(response.status=='success') {
					import_file = response.import_file;
					var column_num = response.column_num;
					var row_nr = 0;
					$('#data_table').empty();
					for(var i=0; i<column_num; i++) {
						var default_row = $('#default_row').clone();
						$(default_row).attr('id', 'row_'+i);
						$('#data_table').append(default_row);

						var cell_1 = $(default_row).find('td').first();
						var cell_2 = cell_1.next();

						cell_1.text(response['cell_'+i+'_0']);
						cell_2.text(response['cell_'+i+'_1']);

						var row_select = $('#row_'+i+' select').first();
						row_select.attr('name', 'select_'+i);

						const choices = new Choices(row_select[0], {
							searchResultLimit: 99,
							searchEnabled: true,
							searchChoices: true,
							shouldSort: false,
							itemSelectText: ''
						})

						choices.passedElement.element.addEventListener("change", (choices) => highlightChoice(choices))
						choices.passedElement.element.addEventListener("highlightItem", (choices) => highlightChoice(choices))
						choices.passedElement.element.addEventListener("showDropdown", (choices) => highlightChoice(choices))

						function highlightChoice(choices) {
							const special = choices.target.closest(".choices").querySelectorAll(`[data-value="ignore"]`) // специальный option - "проигнорировать"

							// Выделяем особый айтем
							special.forEach(element => element.classList.add("-tomato"))

							// Блокируем эл-ты. при выборе "проигнорировать"
							if(event.type !== "change") {return}

							// Навешиваем класс на родитель селекта, чтобы не менять его фон
							choices.target.closest("td").classList.add("-js-select")
							let element = choices.target.closest("tr").querySelectorAll("td:not(-js-select)")

							if(event.detail.value === "ignore") {
								element.forEach(element => { element.classList.add("-js-is-highlighted-td") })
							} else {
								element.forEach(element => { element.classList.remove("-js-is-highlighted-td") })
							}
						}
					}

					$('.example__csv').hide();
					$('.csv_file_block').next().hide();
					$('.csv_file_block p').text(response.import_file);

					// console.log(response)

					$('.csv_step2').show();

					SelectNano( `.csv_step2` )
				}  else {
					NewHideSpinButton('csv_file_span');
					if(response.message_code) {
						ShowXajaxNotification(response.message_code);
					}
				}

			} else {
				ShowXajaxNotification('UPLOAD_ERROR');
				NewHideSpinButton('csv_file_span');
			}

			$('#csv_file').val('');
			NewHideSpinButton('csv_file_span');
		}
	});

    $(document).on('click', 'a.zendesk_import', function(e) {
        if (($(this).hasClass('helpdesk_import_disabled'))) {
        	return false;
        }
        e.preventDefault();

		var subdomain = $.trim($('#zendesk_subdomain').val());
		var login = $.trim($('#zendesk_login').val());
		var token = $.trim($('#zendesk_token').val());

		var errors = new Array;
		var errors_fields = new Array;

		if(!subdomain) {
			errors.push('EMPTY_ZENDESK_SUBDOMAIN');
			errors_fields.push('zendesk_subdomain');
		}

		if(!login) {
			errors.push('EMPTY_ZENDESK_LOGIN');
			errors_fields.push('zendesk_login');
		}

		if(!token) {
			errors.push('EMPTY_ZENDESK_TOKEN');
			errors_fields.push('zendesk_token');
		}

		ShowNotification(errors, errors_fields);
		if(errors.length>0) {
			return false;
		}

		var import_cases = $('#zendesk_cases').prop('checked');
		var import_knowledge = $('#zendesk_knowledge').prop('checked');

		NewShowSpinButton($('.js_zendesk_import'));

        var name;
        var val;
        var langs = {};

        $('#zendesk_import_langs').find('.mySelect_chosen').each(function () {
            name = $(this).prop('name');
            val = $(this).chosen().val();
            console.log(val);
            langs[name] = val;
        })

		langs = JSON.stringify(langs);
        if (!($(this).hasClass('helpdesk_import_disabled'))) {
        	xajax_ImportZendesk(subdomain, login, token, import_cases, import_knowledge, langs);
        }
	})

    $(document).on('click', 'a.freshdesk_import', function(e) {
        if (($(this).hasClass('helpdesk_import_disabled'))) {
            return false;
        }
        e.preventDefault();

        var subdomain = $.trim($('#freshdesk_subdomain').val());
        var login = $.trim($('#freshdesk_login').val());
        var token = $.trim($('#freshdesk_token').val());

        var errors = new Array;
        var errors_fields = new Array;

        if(!subdomain) {
            errors.push('EMPTY_FRESHDESK_SUBDOMAIN');
            errors_fields.push('freshdesk_subdomain');
        }

        if(!login) {
            errors.push('EMPTY_FRESHDESK_LOGIN');
            errors_fields.push('freshdesk_login');
        }

        if(!token) {
            errors.push('EMPTY_FRESHDESK_TOKEN');
            errors_fields.push('freshdesk_token');
        }

        ShowNotification(errors, errors_fields);
        if(errors.length>0) {
            return false;
        }

        var import_cases = $('#freshdesk_cases').prop('checked');
        var import_knowledge = $('#freshdesk_knowledge').prop('checked');

        NewShowSpinButton($('.js_freshdesk_import'));

        var name;
        var val;
        var langs = {};

        $('#freshdesk_import_langs').find('.mySelect_chosen').each(function () {
						name = $(this).chosen().prop('name');
            val = $(this).chosen().val();
            langs[name] = val;
        })
		if (!($(this).hasClass('helpdesk_import_disabled'))) {
        	xajax_ImportFreshdesk(subdomain, login, token, import_cases, import_knowledge, JSON.stringify(langs));
        }
    })
    $(document).on('click', 'a.okdesk_import', function(e) {
        if (($(this).hasClass('helpdesk_import_disabled'))) {
            return false;
        }
        e.preventDefault();

        var subdomain = $.trim($('#okdesk_subdomain').val());
        var login = $.trim($('#okdesk_login').val());
        var token = $.trim($('#okdesk_token').val());

        var errors = new Array;
        var errors_fields = new Array;

        if(!subdomain) {
            errors.push('EMPTY_OKDESK_SUBDOMAIN');
            errors_fields.push('okdesk_subdomain');
        }

        if(!login) {
            errors.push('EMPTY_OKDESK_LOGIN');
            errors_fields.push('okdesk_login');
        }

        if(!token) {
            errors.push('EMPTY_OKDESK_TOKEN');
            errors_fields.push('okdesk_token');
        }

        ShowNotification(errors, errors_fields);
        if(errors.length>0) {
            return false;
        }

        var import_cases     = $('#okdesk_cases').prop('checked');
        var import_knowledge = $('#okdesk_knowledge').prop('checked');

        NewShowSpinButton($('.js_okdesk_import'));

        var langs = {};

        // $('#freshdesk_import_langs').find('.mySelect_chosen').each(function () {
        //     langs[$(this).chosen().prop('name')] = $(this).chosen().val();
        // })
        if (!($(this).hasClass('helpdesk_import_disabled'))) {
            xajax_ImportOkdesk(subdomain, login, token, import_cases, import_knowledge, JSON.stringify(langs));
        }
    })
    $(document).on('click', 'a.yandex_import', function(e) {
        if(client_has_email) {
            ShowXajaxNotification('CLIENT_HAS_EMAIL');
            return false;
        }
        if (($(this).hasClass('helpdesk_import_disabled'))) {
            return false;
        }
        e.preventDefault();
        let form = $(this).parents('form');

        // let type = 1;
        // var login  = $.trim($('#okdesk_subdomain').val());
        // var passwd = $.trim($('#okdesk_login').val());
        // var token = $.trim($('#okdesk_token').val());
        //
        // var errors = new Array;
        // var errors_fields = new Array;
        //
        // if(!subdomain) {
        //     errors.push('EMPTY_OKDESK_SUBDOMAIN');
        //     errors_fields.push('okdesk_subdomain');
        // }
        //
        // if(!login) {
        //     errors.push('EMPTY_OKDESK_LOGIN');
        //     errors_fields.push('okdesk_login');
        // }
        //
        // if(!token) {
        //     errors.push('EMPTY_OKDESK_TOKEN');
        //     errors_fields.push('okdesk_token');
        // }
        //
        // ShowNotification(errors, errors_fields);
        // if(errors.length>0) {
        //     return false;
        // }
        //
        // var import_cases     = $('#okdesk_cases').prop('checked');
        // var import_knowledge = $('#okdesk_knowledge').prop('checked');
        //
        // NewShowSpinButton($('.js_okdesk_import'));
        //
        // var langs = {};
        //
        // // $('#freshdesk_import_langs').find('.mySelect_chosen').each(function () {
        // //     langs[$(this).chosen().prop('name')] = $(this).chosen().val();
        // // })
        var formData = form.serializeJSON();
        if (!($(this).hasClass('helpdesk_import_disabled'))) {
            xajax_ImportEmail(formData);
        }
    })

    $(document).on('change','#zendesk_subdomain, #zendesk_login, #zendesk_token',function (e) {
        target_id = e.target.id;

        var subdomain  = $.trim($(this).parent().find('#zendesk_subdomain').val());
        var login = $.trim($(this).parent().find('#zendesk_login').val());
		var token = $.trim($(this).parent().find('#zendesk_token').val());

        if(subdomain.length && login.length && token.length)
        {
            __self = this;
            xAjaxCall('GetZendeskLangsToImport',[subdomain,login,token],function () {});
        }
    });
    $(document).on('change','#freshdesk_subdomain, #freshdesk_login, #freshdesk_token',function (e) {
        target_id = e.target.id;

        var subdomain  = $.trim($(this).parent().find('#freshdesk_subdomain').val());
        var login = $.trim($(this).parent().find('#freshdesk_login').val());
        var token = $.trim($(this).parent().find('#freshdesk_token').val());

        if(subdomain.length && login.length && token.length)
        {
            __self = this;
            xAjaxCall('GetFreshdeskLangsToImport',[subdomain,login,token],function () {});
        }

    });
    $(document).on('change', '#freshdesk_import_langs, #zendesk_import_langs', function() {
    	var select_vals = [];
        $(this).find('.mySelect_chosen').each(function () {
					select_vals.push($(this).chosen().val());
        });

		if (!(select_vals.includes('0'))) {
			$('.helpdesk_import').removeClass('helpdesk_import_disabled');
		} else {
        	$('.helpdesk_import').addClass('helpdesk_import_disabled');
		}
	})

	$(document).on('click', '.text_type_hours_select a', function(e){
		e.preventDefault();
        if ($(this).parent().hasClass('disabled'))
        {
            return false;
        }
        $(this).parent().find('a').removeClass('active');
        $(this).addClass('active');
        $(this).closest('div.row').find('input[type=hidden]').val($(this).attr('rel'));
		if($(this).attr('rel') == 0) {
			$(this).closest('div.row').find('input[type=text]').prop("disabled", true);
		} else {
			$(this).closest('div.row').find('input[type=text]').removeAttr('disabled');
		}
        $(this).closest('div.row').find('input').trigger('blur')
        return false;
    });
})

function ResetUploadForm() {
	NewHideSpinButton('csv_file_span');
	NewHideSpinButton('start_import');

	$('.example__csv').show();
	$('.csv_file_block').next().show();
	$('.csv_file_block p').text('');

	$('.csv_step2').hide();
	$('#cancel_link').show();
	import_file = '';
}

function ResetZendeskForm() {
	NewHideSpinButton($('.js_zendesk_import'));
}
function ResetFreshdeskForm() {
    NewHideSpinButton($('.js_freshdesk_import'));
}
function ResetOkdeskForm() {
    NewHideSpinButton($('.js_okdesk_import'));
}
function ResetEmailForm() {
    $('#yandex_form').trigger('reset');
    NewHideSpinButton($('.js_yandex_import'));
}

function ResetImport() {
	ResetUploadForm();
	ResetZendeskForm();
	ResetFreshdeskForm();

	// $('#zendesk_cases').iCheck('check');
	// $('#zendesk_knowledge').iCheck('check');
	$('#zendesk_form').trigger('reset');
	// $('#freshdesk_cases').iCheck('check');
	// $('#freshdesk_knowledge').iCheck('check');
	$('#freshdesk_form').trigger('reset');
    $('#yandex_form').trigger('reset');
	$('.csv_step1').hide();
	$('.csv_step2').hide();
	$('.freshdesk_import_langs').hide();
	$('.zendesk_import_langs').hide();
	// $('.zendesk_win').hide();
	$('.common_import_win').hide();
    $('.migration > div:not(.helpdesk)').eq(0).click();
	// $('.migration > div').removeClass('active');
	// $('.settings-import__wrapper form').reset();
}

function setIgnore(el) {
	if ($(el).val() == 'ignore') {
		$(el).next('.chosen-container').find('.chosen-single span').css('color', '#f05252');
		$(el).parents('td').siblings().css('background', '#f6f6f6');
	} else {
		$(el).next('.chosen-container').find('.chosen-single span').css('color', '#000');
		$(el).parents('td').siblings().css('background', '#fff');
	}
}

function NewShowSpinButton(element_id) {
	element = typeof element_id == 'string' ? $('#'+element_id) : element_id;
	$(element).parent().width($(element).parent().width());
	$(element).hide();
	$(element).next('span').hide();
	$(element).nextAll('.icon').show().css('display', 'inline-block');
}

function NewHideSpinButton(element_id) {
    element = typeof element_id == 'string' ? $('#'+element_id) : element_id;
	$(element).show();
	$(element).next('span').show();
	$(element).nextAll('.icon').hide();
}
