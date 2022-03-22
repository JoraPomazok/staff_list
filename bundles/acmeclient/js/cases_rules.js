var sorting_selected_group_id = 0;
$(document).ready(function () {

  //  Change name by lang
   $(document).on('click', '.rule_group_titles .change_form', function(e){
     e.preventDefault();
     $(this).parents('.rule_group_titles').find('.change_form').removeClass('active');
     $(this).addClass('active');
     let lang_id  = $(this).data('lang_id');
     $(this).parents('.rule_group_titles').find('.rule_group_title').hide();
     $(this).parents('.rule_group_titles').find('#title_'+lang_id).show();
   });

  RecountInGroup();
  $(document).on('click', '.coWorkerTemplates a', function (e) {
    e.preventDefault();
    if ($(this).hasClass('active')) {
      return;
    }
    $(this).siblings().removeClass('active');
    $(this).addClass('active');


    if (!$(this).hasClass('fields_list')) {
      $('div.listWorker:visible .js_list_groups').show();
      $('div.listWorker:visible .js_list_rules').hide();

      $('div.heading:visible .link_add_rule_group').show();
      $('div.heading:visible .link_add_rule').hide();
    } else {
      $('div.listWorker:visible .js_list_groups').hide();
      $('div.listWorker:visible .js_list_rules').show();

      $('div.heading:visible .link_add_rule_group').hide();
      $('div.heading:visible .link_add_rule').show();
    }
  });
  $(document).on('click', '.lw_group_title  .t2, .lw_group_title .arrow', function (e) {
    li_parent = $(this).parents('li');
    id = li_parent[0].id.replace('record_li_-', '');


    li_parent.siblings('li.lw_group[data-group_id=' + id + ']').toggle();
    li_parent.find('.js-move-item').parent().toggle();
    if (li_parent.siblings('li.lw_group[data-group_id=' + id + ']:visible').length) {
      li_parent.find('.arrow i').removeClass('fa-chevron-right').addClass('fa-chevron-down')
    } else {
      li_parent.find('.arrow i').addClass('fa-chevron-right').removeClass('fa-chevron-down')
    }
    if ($(li_parent).hasClass('fllw_off')) {
      li_parent.find('.js-move-item').parent().hide();

    }

    return false;
  });

  $('.switch-tab').click(function () {
    $('.switch-tab').removeClass('active');
    $(this).addClass('active');
    $('.rules-block').hide();
    $('.rules-' + $(this).attr('rel')).show();
    return false;
  });
  $(document).on('mouseover', ".paste_area", function (e) {
    e.preventDefault();

    li_parent = $(this).parent().parent().parent();
    id = li_parent[0].id.replace('record_li_-', '');
    $(this).addClass('active');
    sorting_selected_group_id = id;
  });
  $(document).on('mouseout', ".paste_area", function () {
    $('li.lw_group_title').find('.paste_area').removeClass('active');
    sorting_selected_group_id = 0;
  });
  $(".sort-rules").sortable({
    items: ".able_sort",
    handle: ".js-move-item",
    axis: "y",

    stop: function (event, ui) {
      el = ui['item'];
      $('li.lw_group_title').find('.js-move-item').parent().show();
      $('li.lw_group_title').each(function () {
        id = $(this).attr('data-group_id');
        if ($('li.lw_group[data-group_id=' + id + ']:visible').length) {
          $(this).find('.js-move-item').parent().hide();

        }
      });
      $('li.lw_group_title').find('.paste_area').hide();
      id = $(el).attr('data-group_id');
      if ($(el).hasClass('lw_group_title')) {
        var t = $('li.lw_group[data-group_id=' + id + ']').clone(true, true);
        $('li.lw_group[data-group_id=' + id + ']').remove();
        $(el).after(t);
      } else if (sorting_selected_group_id) {
        $(el).attr('data-group_id', sorting_selected_group_id);
        id = $(el).attr('data-group_id');

        _clone = $(el).clone(true, true);
        li_parent = $(el).parent();
        if ($(li_parent).find('li[data-group_id=' + id + '].active:last').length) {
          $(_clone).addClass('lw_group');
          $(el).remove();
          $(li_parent).find('li[data-group_id=' + id + '].active:last').after(_clone);
        }
      } else if ($(el).attr('data-group_id') == 0 && $(el).prev().hasClass('lw_group_title')) {
        li_parent = $(el).parent();
        _clone = $(el).clone(true, true);
        id = $(el).prev().attr('data-group_id');
        $(el).remove();
        $(li_parent).find('li[data-group_id=' + id + ']:last').after(_clone);

      }
      RecountInGroup();
      SortRules(el, true);
    },
    start: function (event, ui) {
      el = ui['item'];
      id = $(el).attr('data-group_id');
      if ($(el).hasClass('lw_group_title')) {
        $('li.lw_group_title').each(function () {
          id = $(this).attr('data-group_id');
          if ($('li.lw_group[data-group_id=' + id + ']:visible').length) {
            $(this).siblings('li.lw_group[data-group_id=' + id + ']').hide();
            $(this).find('.js-move-item').parent().show();
            $(this).find('.arrow i').addClass('fa-angle-down').addClass('fa-chevron-right')
          }
        });
        return;
      }
      $(el).css('width', ($(el).width() - 160) + 'px');
      $('li.lw_group_title').find('.js-move-item').parent().hide();
      $('li.lw_group_title').find('.paste_area').removeClass('active');
      $('li.lw_group_title').find('.paste_area').css('display', 'block');
      if (id) {
        $('li.lw_group_title[data-group_id=' + id + ']').find('.js-move-item').parent().show();
        $('li.lw_group_title[data-group_id=' + id + ']').find('.paste_area').hide();

      }
      sorting_selected_group_id = 0;
    },
    sort: function (event, ui) {
      el = ui['item'];
      if ($(el).hasClass('lw_group_title')) {
        return;
      }
      ph = ui['placeholder'];
      prev_el = $(ph).prev();
      next_el = $(ph).next();
      var i = 1;
      // if(($(next_el).hasClass('lw_group_title') || $(next_el).hasClass('lw_group')))
      // {
      //     prev_el = next_el;
      //     i = -1;
      // }
      if ($(prev_el).is(':visible') && $(prev_el).hasClass('lw_group') || ($(next_el).is(':visible') && $(next_el).hasClass('lw_group'))) {
        group_id = $(prev_el).attr('data-group_id');
        li_top_min = $(prev_el).offset().top;
        li_top_max = li_top_min + $(prev_el).height();
        ph_top_min = $(ph).offset().top;
        ph_top_max = ph_top_min + $(ph).height();
        if (ui['offset'].top > (ph_top_max) && !$(next_el).hasClass('lw_group')) {
          //послд запись в группе но если фокус пропал, нужно вытащить из группы
          $(el).attr('data-group_id', 0).removeClass('lw_group');
          $(ph).removeClass('lw_group');
          // sorting_selected_group_id=0;
        } else if ((ui['offset'].top > li_top_min && ui['offset'].top < li_top_max) || ($(next_el).is(':visible') && $(next_el).hasClass('lw_group')) || ($(prev_el).is(':visible') && $(prev_el).hasClass('lw_group_title'))) {
          // $('li.lw_group_title[data-group_id='+group_id+']').find('.js-move-item').parent().hide();
          // $('li.lw_group_title[data-group_id='+group_id+']').find('.paste_area').show();
          //                             top_min = $('li.lw_group_title[data-group_id='+group_id+']').find('.paste_area').offset().top;
          //                             top_max = top_min-$('li.lw_group_title[data-group_id='+group_id+']') .find('.paste_area').height();
          //                             left_min = $(prev_el).find('.paste_area').offset().left-$('.wrapper').offset().left ;
          //                             left_max = left_min+$(prev_el).find('.paste_area').width();

          //                             if(ui['offset'].top > top_min && ui['offset'].top < top_max
          //                                 &&ui['offset'].left > left_min && ui['offset'].left < left_max)
          //                             {
          //                                 console.log('yes');
          //                             }


          // if(i==1)
          // {
          $(el).attr('data-group_id', group_id).addClass('lw_group');
          $(ph).addClass('lw_group');
          // }
          // else
          // {
          //     $(el).attr('data-group_id',0).removeClass('lw_group');
          //     $(ph).removeClass('lw_group');
          // }

        }
      } else {
        $(el).attr('data-group_id', 0).removeClass('lw_group');
        $(ph).removeClass('lw_group');
        // sorting_selected_group_id=0;
      }

      RecountInGroup();

    }
  });
  checkTabs();
});

// Нумеровка элементов. Отправляем на сервер новые правила и их позицию.
function SortRules(el, b_sort_db, rule_type) {
  if (!rule_type) {
    var rule_type = el.attr('rel');
  }
  var rules_class = 'rules-' + rule_type;
  if (!rule_type) {
    return false;
  }
  var start = 1;
  var sort_li_arr = Array();
  $('.' + rules_class).each(function () {
    if ($(this).hasClass('active')) {
      $(this).find('.span-sort').html(start);
      start++;
      sort_li_arr.push({
        'id': $(this).attr('id'),
        'group_id': $(this).attr('data-group_id'),
      });
    }
  });
  if (sort_li_arr.length > 0 && b_sort_db) {
    xajax_sort_rules(sort_li_arr, rule_type);
  }
}

function PostDeleteRecord() {
  var li_el_exist = $('li.rules-exist').first();
  var li_el_new = $('li.rules-new').first();
  var li_el_changed = $('li.rules-changed').first();
  SortRules(li_el_exist, false);
  SortRules(li_el_new, false);
  SortRules(li_el_changed, false);
  RecountInGroup();
}

function onOff(item, enable) {
  var g // группа правил
  var li_el = $(item).closest('li');
  var rule_type = li_el.attr('rel');
  var group_id = li_el.attr('data-group_id');

  var b_category = $('.js_list_groups:visible').length || $(li_el).hasClass('lw_group_title');

  if (b_category) {
    // Группы правил. b_category - 1
    if (enable) {
      // enable - 1. Правило включили
      $(li_el).addClass('able_sort');
      $('.js_list_groups:visible .js_groups_enable').append(li_el);

      if (group_id && $('#rules-' + rule_type + '-disable li[data-group_id=' + group_id + ']').length) {
        // console.log('Включили группу');
        t = $('#rules-' + rule_type + '-disable li[data-group_id=' + group_id + ']').clone(true, true);
        $('#rules-' + rule_type + '-disable li[data-group_id=' + group_id + ']').remove();
        $('#rules-' + rule_type + '-enable').append(t);
        markOffOn($('#rules-' + rule_type + '-enable li.lw_group_title[data-group_id=' + group_id + ']'), enable);
      }
    } else {
      // enable - 0. Правило выключили
      $('.js_list_groups:visible .js_groups_disable').append(li_el);
      if (group_id && $('#rules-' + rule_type + '-enable li[data-group_id=' + group_id + ']').length) {
        console.log('Отключили группу');

        endableDisableGroup(rule_type, group_id, enable) // Если мы вкл/выкл группу правил в "Правила для текущих обращений", то она вкл/выкл в "Группы правил"

        t = $('#rules-' + rule_type + '-enable li[data-group_id=' + group_id + ']').clone(true, true);

        /** t = t.get().reverse() реверс массива. Где-то сдесь нужно расположить для фикса бага 58 */

        $('#rules-' + rule_type + '-enable li[data-group_id=' + group_id + ']').remove();

        $('#rules-' + rule_type + '-disable').append(t);
        markOffOn($('#rules-' + rule_type + '-disable li.lw_group_title[data-group_id=' + group_id + ']'), enable);
      }
    }
    if (group_id && $('#rules-' + rule_type + '-enable li[data-group_id=' + group_id + ']').length) {
      console.log('Включили группу');
      // Правило включили. Перемещает группы. Правила для входящих обращений (только группы). Группа включена

      endableDisableGroup(rule_type, group_id, enable) // Если мы вкл/выкл группу правил в "Правила для текущих обращений", то она вкл/выкл в "Группы правил"

      t = $('#rules-' + rule_type + '-enable li[data-group_id=' + group_id + ']').clone(true, true);
      $('#rules-' + rule_type + '-enable li[data-group_id=' + group_id + ']').remove();
      $('#rules-' + rule_type + '-enable').append(t);
      markOffOn($('#rules-' + rule_type + '-enable li.lw_group_title[data-group_id=' + group_id + ']'), enable);
      if (enable) {
        // enable - 1
        $(li_el).addClass('able_sort');
        $('#rules-' + rule_type + '-enable li.lw_group[data-group_id=' + group_id + ']').removeClass('b_appraise').removeClass('no_sort');
      } else {
        $('#rules-' + rule_type + '-enable li.lw_group[data-group_id=' + group_id + ']').addClass('b_appraise').addClass('no_sort');
      }
    }
  } else {
    // Правила для входящих обращений. Одиночные правила (не группа). b_category - false
    if (group_id > 0 && $('#rules-' + rule_type + '-enable li[data-group_id=' + group_id + ']:last').length) {
      $(li_el).addClass('able_sort');
      $('#rules-' + rule_type + '-enable li[data-group_id=' + group_id + '].active:last').after(li_el);
    } else if (group_id > 0 && $('#rules-' + rule_type + '-disable li[data-group_id=' + group_id + ']:last').length) {
      $(li_el).addClass('able_sort');
      $('#rules-' + rule_type + '-disable li[data-group_id=' + group_id + '].active:last').after(li_el);
    } else if (enable) {
      $(li_el).addClass('able_sort');
      $('#rules-' + rule_type + '-enable').append(li_el);
    } else {
      li_el.removeClass('able_sort');
      $('#rules-' + rule_type + '-disable').append(li_el);
    }
  }
  if (b_category) {
    enableRecord(item, enable, enable_group_record_url);
  } else {
    enableRecord(item, enable);
  }
  if ($(li_el).hasClass('lw_group_title')) {
    SortRules(li_el, true, rule_type);
  } else {
    SortRules(li_el, enable);
  }
}


function DeleteRecord(remove_id) {
  var b_category = $('.js_list_groups:visible').length;
  if (b_category) {
    AjaxDeleteRecord(remove_id, remove_group_record_url);
    category_id = remove_id.split('_')[1];
    $('.lw_group_title[data-group_id=' + category_id + ']').remove();
    $('.lw_group[data-group_id=' + category_id + ']').each(function () {
      $(this).attr('data-group_id', 0).removeClass('lw_group');
      if ($(this).hasClass('active')) {
        $(this).attr('data-group_id', 0).removeClass('lw_group').removeClass('b_appraise').removeClass('no_sort').show();
        SortRules(false, true, $(this).attr('rel'));

      } else {
        $('#rules-' + $(this).attr('rel') + '-disable').append($(this));

      }

    })

  } else {
    AjaxDeleteRecord(remove_id)
  }
}

function init_create_record() {
  $('.create-record').off('click').on('click', function (e) {
    e.preventDefault();
    update_record('button_update_0', this);
  })
}

function init_update_record(start) {
  $(start + ' .update-record').off('click').on('click', function (e) {
    console.log( $(this) )
    e.preventDefault();
    update_record($(this).attr('id'), this);
  })
}

function update_record(button_id, el) {
  if (request_sent) {
    return;
  }

  record_id = button_id.match(/button_update_(\d+)/)[1];
  var errors = [];
  var errors_fields = [];
  var type = $(".switch-tab.active").attr('data-type');
  var type_str = '';
  if (type == 1) type_str = 'new';
  else if (type == 2) type_str = 'changed';
  else if (type == 3) type_str = 'exist';

  var titles = {};
  $.each($('#form_'+record_id +' input.rule_group_title'), function(i, input) {
          if($(input).val())  titles[input.id.replace('title_', '')] = $(input).val().trim();
        });
        
  if(!Object.keys(titles).length)
  {
  	errors.push('EMPTY_TITLE');
  	errors_fields.push('title_'+record_id);
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id == 0) {
    ShowSpinButton('button_create_' + type_str);
  } else {
    ShowSpinButton('button_update_' + record_id);
  }

  xajax_SaveGroup(record_id, type, titles);
}

function RecountInGroup() {
  $('.lw_group_title').each(function () {
    gid = $(this).attr('data-group_id');
    type = $(this).attr('rel');
    if (type == 'new') type = 1;
    else if (type == 'changed') type = 2;
    else if (type == 'exist') type = 3;
    b_display = $(this).find('a.arrow .fa-angle-downn').length;
    cnt = $('.lw_group[data-group_id=' + gid + ']').length;
    $(this).find('.t2 span').text(cnt);
    $('#record_li_' + type + '_' + gid + ' .t2 span').text(cnt);
    $(this).find('.t1').text($('#record_li_' + type + '_' + gid + ' .t1').text());

    if (b_display) {
      $('.lw_group[data-group_id=' + gid + ']').show();
    }
  })

}

/** Если мы вкл/выкл группу правил в "Правила для текущих обращений", то она вкл/выкл в "Группы правил" */
function endableDisableGroup(rule_type, group_id, enable) {
  const PARENT_GROUP_ID = $('#rules-' + rule_type + '-enable li.lw_group_title[data-group_id=' + group_id + ']').closest("ul").attr("id")
  if (PARENT_GROUP_ID === "rules-new-enable" || PARENT_GROUP_ID === "rules-new-disable") {
    const group = $('.-js-input-enquiries_enable li[data-group_id=' + group_id + ']').clone(true, true);
    $('.-js-input-enquiries_enable li[data-group_id=' + group_id + ']').remove()
    $('.-js-input-enquiries_disable').append(group);
    markOffOn($('.-js-input-enquiries_disable li[data-group_id=' + group_id + ']'), enable);

  } else if (PARENT_GROUP_ID === "rules-changed-enable" || PARENT_GROUP_ID === "rules-changed-disable") {
    const group = $('.-js-edited-enquiries_enable li[data-group_id=' + group_id + ']').clone(true, true);
    $('.-js-edited-enquiries_enable li[data-group_id=' + group_id + ']').remove()
    $('.-js-edited-enquiries_disable').append(group);
    markOffOn($('.-js-edited-enquiries_disable li[data-group_id=' + group_id + ']'), enable);

  } else if (PARENT_GROUP_ID === "rules-exist-disable" || PARENT_GROUP_ID === "rules-exist-enable") {
    const group = $('.-js-current-enquiries_enable li[data-group_id=' + group_id + ']').clone(true, true);
    $('.-js-current-enquiries_enable li[data-group_id=' + group_id + ']').remove()
    $('.-js-current-enquiries_disable').append(group);
    markOffOn($('.-js-current-enquiries_disable li[data-group_id=' + group_id + ']'), enable);
  }
}
