let last_row_selected = 0;
$(document).ready(function(){
	$( ".records_sortable" ).sortable(
        {connectWith: ".records_sortable"},
		{handle: ".js-move-item"},
		{axis: "y" },
		{stop: function( event, ui ) {
			SortRecords(true);
        }},
        {receive: function( event, ui ) {
            section_id = $(this).attr('id');

            record_id = ui.item.attr('id');
            record_id = record_id.replace('record_li_','');
            SortRecords(true);
        }}
	);

	// должно быть больше чем в #disable_focus_
    $(document).on('input', 'input.js_valid_integer[id^=employee_participates_]', function(){
        this.value = this.value.replace(/\D|^[0]{1}([0-9]{1,2})?/g, '').substr(0, 2);

		let dis_foc_field = $(this).closest('form').find('input.js_valid_integer[id^=disable_focus_]');

		if(this.value == 1 || !this.value) {
			dis_foc_field.val('').attr('disabled', 'disabled');
		} else {
			dis_foc_field.removeAttr('disabled');
		}

		if(dis_foc_field.val() && this.value) {
			if(parseInt(dis_foc_field.val()) >= parseInt(this.value)) {
				dis_foc_field.val(this.value - 1)
			}
		}
    });

	// должно быть меньше чем в #employee_participates_
	$(document).on('input', 'input.js_valid_integer[id^=disable_focus_]', function(){
        this.value = this.value.replace(/\D|^[0]{1}([0-9]{1,2})?/g, '').substr(0, 2);

		let em_part_field = $(this).closest('form').find('input.js_valid_integer[id^=employee_participates_]');

		if(em_part_field.val() && this.value) {
			if(parseInt(em_part_field.val()) <= parseInt(this.value)) {
				this.value = em_part_field.val() - 1;
			}
		}
    });


    $(document).on('click','.create-record',function(e) {
		e.preventDefault();
		update_record($(this).attr('id'));
	})

    $('.addingCancel').on('click',function(e) {
        e.preventDefault();
        closeRow($(this));
    });



	$(document).on("change", '.fieldsBlock_focus .js-fields-multiple .row:not(.sub-row) select.mySelect_select2', function (e,b_init) {
		resetOptions($(this).closest('.fieldsBlock_focus'));

		let select = $(this);
		let sub_select = select.closest('.fieldsBlock_focus').find('.js-fields-multiple .sub-row select.mySelect_select2');
		let sub_selectVal = sub_select.val();
		let selectedVal = select.val();

		// console.log(selectedVal)

		// берём в расчет только первый выбранный элемент для фильтрации всего списка(по сути нужно когда только один выбранный), но первый может меняться в зависимости от автосортировки группы выбранных опшинов в val(потому надо доп условия)
		let val = selectedVal[0];

		// hide selected in .sub-row and convert selected val for group and status
		if(selectedVal) {
			let optSelect2 = select.parent().find('.select2-search-choice');

			selectedVal.forEach(function(value, i){

				// convert selected
				let item_selected_text = select.children('option[value="'+value+'"]').text().trim();
				let prevText = '';

				if(value.indexOf('status:') !== -1) {
					prevText = Translate('team_focus_js/status');
				} else if(value.indexOf('g:') !== -1) {
					prevText = Translate('team_focus_js/the_group');
				} else {
					return false;
				}

				optSelect2.each(function() {
					let tareEl = $(this).children('div');
					if(tareEl.text().indexOf(item_selected_text) !== -1) {
						let tx = $('<textarea />').html(`${prevText} ${Translate('cases_rules_edit_js/quotes', {title: item_selected_text})}`).text();
						tareEl.text(tx);// Трабли дле деколирования htmlentity
					}
				})

				// hide selected
				sub_select.children('option[value="x:'+value+'"]').addClass('hidden');
			});
		}

		if(val) {
			let isAll = selectedVal.some(function(item) {
				return !isNaN(item) && (item == '-1' || item == '-2');
			})

			let isGrOrStat = selectedVal.every(function(item) {
				return isNaN(item);
			})

			let isStat = selectedVal.every(function(item) {
				return isNaN(item) && item.indexOf('status:') !== -1;
			})

			let isMember = selectedVal.some(function(item) {
				return !isNaN(item) && item !== '-1' && item !== '-2';
			})

			if ( (val == '-1' || val == '-2') || isAll ) {
				select.children('option').addClass('hidden');
				select.children('option[value="disabled_3"]').removeClass('hidden');
				select.children('option[value^="status:"]').removeClass('hidden');

				// filter sub-row
				sub_select.children('option[value="x:-1"]').addClass('hidden');
				sub_select.children('option[value="x:-2"]').addClass('hidden');

				// show .sub-row
				select.closest('.fields').find('.sub-row').removeClass('hidden');
			} else
			if ( (val.indexOf('g:') !== -1  || val.indexOf('status:') !== -1) && isGrOrStat ) {
				select.children('option').addClass('hidden');
				select.children('option[value="disabled_1"]').removeClass('hidden');
				select.children('option[value^="g:"]').removeClass('hidden');

				select.children('option[value="disabled_3"]').removeClass('hidden');
				select.children('option[value^="status:"]').removeClass('hidden');

				// filter sub-row
				sub_select.children('option[value="x:-1"]').addClass('hidden');
				sub_select.children('option[value="x:-2"]').addClass('hidden');

				if(val.indexOf('status:') !== -1 && isStat) {
					sub_select.children('option[value="x:disabled_3"]').addClass('hidden');
					sub_select.children('option[value^="x:status:"]').addClass('hidden');

					// сбрасываем выбранные
					sub_select.children('option[value^="x:status:"]').prop("selected", false);
					sub_select.trigger("change");
				}

				// show .sub-row
				select.closest('.fields').find('.sub-row').removeClass('hidden');
			} else
			if ( (!isNaN(val) && val !== '-1' && val !== '-2') || isMember ) {
				select.children('option[value="-1"]').addClass('hidden');
				select.children('option[value="-2"]').addClass('hidden');

				select.children('option[value="disabled_1"]').addClass('hidden');
				select.children('option[value^="g:"]').addClass('hidden');

				// сбрасываем выбранные в sub_select
                if(!b_init)
                {
                    sub_select.val(null).trigger("change");
                }

				// hide .sub-row
				select.closest('.fields').find('.sub-row').addClass('hidden');
			}
		} else {
			// сбрасываем выбранные
            if(!b_init)
            {
                sub_select.val(null).trigger("change");
            }

			// hide .sub-row
			select.closest('.fields').find('.sub-row').addClass('hidden');
		}

		// hide selected options from .sub-row in this select
		if(sub_selectVal) {

			sub_selectVal.forEach(function(value, i){

				value = value.substr(2, value.length)
				select.children('option[value="'+value+'"]').addClass('hidden');
			});
		}

		// скрываем категорию, если выбраны все эл
		let commonSelVals = [];

		if(selectedVal && Array.isArray(selectedVal)) {
			Array.prototype.push.apply(commonSelVals, selectedVal);
		}
		if(sub_selectVal && Array.isArray(sub_selectVal)) {
			Array.prototype.push.apply(commonSelVals, sub_selectVal);
		}

		// console.log(selectedVal, sub_selectVal, commonSelVals)

		if(commonSelVals && Array.isArray(commonSelVals)) {
			let groupLength = select.children('option[value^="g:"]').length;
			let statusLength = select.children('option[value^="status:"]').length;
			let memberLength = 0;
			select.children('option').each(function() {let val = $(this).attr('value'); !isNaN(val) && val !== '-1' && val !== '-2' ? ++memberLength : null;});

			// console.log(groupLength, statusLength, memberLength)

			let selectedGroupLength = 0;
			let selectedStatusLength = 0;
			let selectedMemberLength = 0;

			commonSelVals.forEach(function(value, i){
				// поправка для элементов из второго селекта
				if(value.substr(0, 2) == "x:") {
					value = value.substr(2, value.length)
				}

				let selectedGroup = value.match('g:') !== null;
				let selectedStatus = value.match('status:') !== null;
				let selectedMember = !isNaN(value) && value !== '-1' && value !== '-2';

				if(selectedGroup) {
					++selectedGroupLength;
				}
				if(selectedStatus) {
					++selectedStatusLength;
				}
				if(selectedMember) {
					++selectedMemberLength;
				}
			});

			// console.log(selectedGroupLength, selectedStatusLength, selectedMemberLength)

			if(selectedGroupLength == groupLength) {
				select.children('option[value="disabled_1"]').addClass('hidden');
				sub_select.children('option[value="x:disabled_1"]').addClass('hidden');
			}

			if(selectedStatusLength == statusLength) {
				select.children('option[value="disabled_3"]').addClass('hidden');
				sub_select.children('option[value="x:disabled_3"]').addClass('hidden');
			}

			if(selectedMemberLength == memberLength) {
				select.children('option[value="disabled_2"]').addClass('hidden');
				sub_select.children('option[value="x:disabled_2"]').addClass('hidden');
			}
		}

		// ??обновляем селект

		// обновляем скролл
	// 	init_nice_elements();
	});


	$(document).on("change", '.fieldsBlock_focus .js-fields-multiple .row.sub-row select.mySelect_select2', function (e,b_init) {
		let select = $(this);
		let selectedVal = select.val();

		// convert selected val for group and status
		if(selectedVal) {
			let optSelect2 = select.parent().find('.select2-search-choice');

			selectedVal.forEach(function(value, i){

				let item_selected_text = select.children('option[value="'+value+'"]').text().trim();
				let prevText = '';

				if(value.indexOf('x:status:') !== -1) {
					prevText = Translate('team_focus_js/status');
				} else if(value.indexOf('x:g:') !== -1) {
					prevText = Translate('team_focus_js/the_group');
				} else {
					return false;
				}

				optSelect2.each(function() {
					let tareEl = $(this).children('div');
					if(tareEl.text().indexOf(item_selected_text) !== -1) {
						let tx = $('<textarea />').html(`${prevText} ${Translate('cases_rules_edit_js/quotes', {title: item_selected_text})}`).text();
						tareEl.text(tx); // Трабли дле деколирования htmlentity
					}
				})

			});
		}

	});

	//  не change потому что будет превышение вызовов
	$(document).on('select2-removed', '.fieldsBlock_focus .js-fields-multiple .row.sub-row select.mySelect_select2', function(){
		let select = $(this);

		let main_select = select.closest('.fieldsBlock_focus').find('.js-fields-multiple .row:not(.sub-row) select.mySelect_select2');

		// обновляем главный селект
		main_select.trigger('change', 1);
	});

	$(document).on('select2-selecting', '.fieldsBlock_focus .js-fields-multiple .row.sub-row select.mySelect_select2', function(){
		let select = $(this);

		let main_select = select.closest('.fieldsBlock_focus').find('.js-fields-multiple .row:not(.sub-row) select.mySelect_select2');

		// обновляем главный селект
		setTimeout(function() {
			main_select.trigger('change', 1);
		}, 400)

	});

});

function resetOptions(from){
    from.find('.js-fields-multiple select.mySelect_select2').each(function(){
        $(this).children("option").removeClass('hidden');
    });
}

function closeRow(el) {
    $(el).closest('.w_settings').slideUp();
    $(el).closest('.lw_item').find('.edit').removeClass('active');
}

function update_record(button_id) {
	var record_id = button_id.match(/button_update_(\d+)/)[1];
	let form = $('#button_update_'+record_id).parents('form')[0];


    let title            = $.trim(form['focus_name'].value);
    let max_open_ticket  = $.trim(form['max_open_ticket'].value);
    let min_open_ticket  = $.trim(form['min_open_ticket'].value);
    let limit_days       = $.trim(form['limit_days'].value);
    let staff_exclude    = $.trim($(form['staff_exclude']).val());
    let staff_access     = $.trim($(form['staff_access']).val());

    var errors = [];
    var errors_fields = [];

    if(!title.length)
	{
		errors.push('EMPTY_TITLE');
		errors_fields.push('title_'+record_id);
	}
	ShowNotification(errors, errors_fields);
    console.log(errors);
    if(errors.length>0) {
		return false;
	}

	ShowSpinButton('button_update_'+record_id);
	xajax_UpdateRecord(record_id,title, max_open_ticket,min_open_ticket,limit_days,staff_access,staff_exclude);
}

function SortRecords(b_sort_db) {
	var start = 1;
	var sort_li_arr = Array();
	$('#record_list li').each(function() {
		if($(this).hasClass('active')) {
			$(this).find('.span-sort').html(start);
			start++;
			sort_li_arr.push($(this).attr('id'));
		}
	});

    if(sort_li_arr.length>0 && b_sort_db) {
		xajax_SortRecords(sort_li_arr.join(':'));
	}
}
function OnEdit(el)
{
    let li = $(el).parents('li');
    $(li).find('.js-fields-multiple .row:not(.sub-row) select.mySelect_select2').trigger("change",1);
    $(li).find('.js-fields-multiple .row.sub-row select.mySelect_select2').trigger("change");
}
