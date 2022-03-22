$(document).ready(function () {
    $(".sections_sortable").sortable(
        {connectWith: ".sections_sortable"},
        {handle: ".-js-move-item"},
        {axis: "y"},
        {
            stop: function (event, ui) {
                category_id = $(this).attr('id');
                category_id = category_id.replace('record_list_', '');

                if ($("#block_category_sections_" + category_id + " li").length == 0) {
                    $('#block_category_title_' + category_id).hide();
                    $('#block_category_sections_' + category_id).hide();
                }
                SortSections(true, category_id);
            }
        },
        {
            receive: function (event, ui) {
                category_id = $(this).attr('id');
                category_id = category_id.replace('record_list_', '');

                record_id = ui.item.attr('id');
                record_id = record_id.replace('record_li_', '');

                xajax_UpdateCategoryRecord(record_id, category_id);
                SortSections(true, category_id);
            }
        }
    );

    const bStar = Array.from(document.querySelectorAll("select.b_star"));

    bStar.forEach(element => {
        const select = element.closest("form").querySelectorAll("select")
        const init = choicesInit(select, {searchEnabled: false, shouldSort: false, itemSelectText: ''});
        addRemoveOption(init)
    })


    function addRemoveOption(init) {
        init[0].passedElement.element.addEventListener('removeItem', function (event) {
            init.map(element => element.removeActiveItemsByValue(event.detail.value))
        })

        init[0].passedElement.element.addEventListener('addItem', function (event) {
            init.map(element => element.setChoiceByValue(event.detail.value))
            makeTranslate(event)
        })
    }

    function makeTranslate(event) {
        const select = Array.from(event.target.closest("form").querySelectorAll("select:not(b_star)"))
        translateCategoryVisible(select)
    }

    $("select.no_lang").each(function () {
        $(this).parent().find('div.chosen-container').hide();
        $(this).parent().find('div.no_lang_text').show();
    });
});

function SortSections(b_sort_db, category_id) {
    var start = 1;
    var sort_li_arr = Array();
    $('#record_list_' + category_id + ' li').each(function () {
        if ($(this).hasClass('active')) {
            $(this).find('.span-sort').html(start);
            start++;
            sort_li_arr.push($(this).attr('id'));
        }
    });
    if (sort_li_arr.length > 0 && b_sort_db) {
        xajax_SortRecords(sort_li_arr.join(':'));
    }
}

function onOff(item, enable) {
    enableRecord(item, enable);
    var li_el = $(item).closest('li');

    category_id = $(li_el).parents('div:first').attr('id');
    category_id = category_id.replace('block_category_sections_', '');

    elem_id = $(li_el).attr('id');
    elem_id = elem_id.replace('record_li_', '');

    if (enable) {
        $('#record_li_' + elem_id + ' .title_text').hide();
        $('#record_li_' + elem_id + ' .title_link').show();
        $('#record_list_' + category_id).append(li_el);
    } else {
        $('#record_li_' + elem_id + ' .title_link').hide();
        $('#record_li_' + elem_id + ' .title_text').show();
        $('#disabled_record_list_' + category_id).append(li_el);
    }
    SortSections(true, category_id);
}

function ClickDeleteRecord(el) {
    if ($(el).closest('.lw_item').find('.onOff').first().attr('rel') == 'b_used') {
        $('#section_used').togglePopup();
    } else {
        StartDeleteRecord(el);
    }
}

function DeleteRecordExt(category_id) {
    if (category_id.indexOf("block_category_sections") > -1) {
        category_id = category_id.replace('block_category_sections_', '');
        if ($("#block_category_sections_" + category_id + " li").length < 1) {
            $('#block_category_title_' + category_id).hide();
            $('#block_category_sections_' + category_id).hide();
        }
    }

    SortSections(false, category_id);
}

function init_create_record() {
    $('.create-record').off('click').on('click', function (e) {
        e.preventDefault();
        update_record('button_update_0');

        $(this).parents('.formFooter').find('.form_item_icon_wrap').removeAttr('data-default data-defaultclass');
        $(this).parents('.formFooter').find('.form_item_icon_content').hide();
    })
}

function init_update_record(start) {
    $(start + ' .update-record').off('click').on('click', function (e) {
        e.preventDefault();
        update_record($(this).attr('id'));

        $(this).parents('.formFooter').find('.form_item_icon_wrap').removeAttr('data-default data-defaultclass');
        $(this).parents('.formFooter').find('.form_item_icon_content').hide();
    })
}

function init_select_box() {
    choicesInit('.select-box', {searchEnabled: false, shouldSort: false, itemSelectText: ''})
}

function update_record(button_id) {
    record_id = button_id.match(/button_update_(\d+)/)[1];

    var data = {};
    var errors = [];
    var errors_fields = [];

    $('input[id^=title_' + record_id + ']').each(function () {
        var lang_id = this.id.substr(('title_' + record_id + '_').length);
        var b_star = $(this).attr('data-star');
        var title = $.trim(this.value);
        if (!title.length && b_star == 1) {
            errors.push('EMPTY_TITLE');
            errors_fields.push('title_' + record_id + '_' + lang_id);
        }
        data[lang_id] = {'title': title, 'description': ''};
    });
    $('textarea[id^=description_' + record_id + ']').each(function () {
        var lang_id = this.id.substr(('description_' + record_id + '_').length);
        data[lang_id]['description'] = $.trim(this.value);
    });
    var category = $('select[name^=category_' + record_id + '].b_star').length ? $('select[name^=category_' + record_id + '].b_star').val() : 0;

    ShowNotification(errors, errors_fields);
    if (errors.length > 0) {
        return false;
    }

    if (record_id == 0) {
        ShowSpinButton('button_create');
        xajax_CreateRecord(category, $('#section_icon_' + record_id).val(), data);
    } else {
        ShowSpinButton('button_update_' + record_id);
        xajax_UpdateRecord(record_id, category, $('#section_icon_' + record_id).val(), data);
    }
}

function AddSectionRecord(record_html, category_id, record_id) {
    $('#block_category_title_' + category_id).show();
    $('#block_category_sections_' + category_id).show();

    $('#record_list_' + category_id).append(record_html);
    $('.span_cnt').html((parseInt($('.span_cnt').html()) + 1));
    closeCreateBlock();
    ReloadRecord(record_id);
}

function TransferSectionRecord(record_html, section_id, category_id, b_active) {
    category_old = $('#record_li_' + section_id).parents('div:first').attr('id');
    category_old = category_old.replace('block_category_sections_', '');

    if ($("#block_category_sections_" + category_old + " li").length == 0) {
        $('#block_category_title_' + category_old).hide();
        $('#block_category_sections_' + category_old).hide();
    }

    $('#record_li_' + section_id).remove();

    $('#block_category_title_' + category_id).show();
    $('#block_category_sections_' + category_id).show();

    if (b_active) {
        $('#record_list_' + category_id).append(record_html);
        SortSections(true, category_old);
    } else {
        $('#disabled_record_list_' + category_id).append(record_html);
    }
}

function ChangeIconAngleToDown(category_id) {
    $('#block_category_title_' + category_id + '').children('span').html('<i class="fas fa-angle-down"></i>');
    $('#block_category_title_' + category_id + '').css('border-bottom', 'none');
}

function OnEdit(item) {
    const element = item.closest("li")
    const select = Array.from( element.querySelectorAll("select:not(b_star)") )
    translateCategoryVisible(select)
}

// если категория не переведена, то select скрываем, а отображаем div с предложением перевести категорию
function translateCategoryVisible(select) {
    select.forEach(element => {
        const choices = element.closest(".choices")
        const makeTranslate = element.closest(".fields").querySelector(".no_lang_text")

        if (element.value === element.textContent ) {
            choices.classList.add("-none")
            makeTranslate.classList.add("-block-important")
        } else {
            choices.classList.remove("-none")
            makeTranslate.classList.remove("-block-important")
        }
    })
}