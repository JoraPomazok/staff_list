var last_el_del_id;

$(document).ready(function () {
  $(document).on('click', '.coWorkerTemplates a', function (e) {
    e.preventDefault();
    if ($(this).hasClass('active')) {
      return;
    }
    $(this).siblings().removeClass('active');
    $(this).addClass('active');


    if ($(this).hasClass('fields_list')) {
      $('#common_templates_list').show();
      $('#common_categories_list').hide();

      $('.coC_cnt').hide();
      $('.coT_cnt').show();

      $('#link_add_common_template').show();
      $('#link_add_common_category').hide();
    } else {
      $('#common_templates_list').hide();
      $('#common_categories_list').show();

      $('.coC_cnt').show();
      $('.coT_cnt').hide();

      $('#link_add_common_template').hide();
      $('#link_add_common_category').show();
    }
  });
  $('.switch-tab').click(function () {
    $('.switch-tab').removeClass('active');
    $(this).addClass('active');
    $('.tab-block').hide();
    $('.tab-' + $(this).attr('rel')).show();
    if ($(this).attr('rel') == 'common') {
      $('#common_templates_list').show();
      $('#common_categories_list').hide();

      $('.coC_cnt').hide();
      $('.coT_cnt').show();

      $('#link_add_common_template').show();
      $('#link_add_common_category').hide();

      $('.coWorkerTemplates a').removeClass('active');
      $('.coWorkerTemplates a.fields_list').addClass('active');
    }

  });

  //  Change name by lang
   $(document).on('click', '.categories_titles .change_form', function(e){
     e.preventDefault();
     $(this).parents('.categories_titles').find('.change_form').removeClass('active');
     $(this).addClass('active');
     let lang_id  = $(this).data('lang_id');
     $(this).parents('.categories_titles').find('.category_title').hide();
     $(this).parents('.categories_titles').find('#title_'+lang_id).show();
   });

  $("#common_templates_list .sort-elements").sortable(
    {items: ".able_sort"},
    {handle: ".js-move-item"},
    {axis: "y"},
    {
      stop: function (event, ui) {
        el = ui['item'];
        var tmpl_type = el.attr('rel');
        category_id = $(this).attr('id');
        category_id = category_id.replace('tmpl-' + tmpl_type + '-enable-', '');
        SortTemplates(tmpl_type, true, 0, category_id);
      }
    }
  );
  $("#person_templates_list .sort-elements").sortable(
    {items: ".able_sort"},
    {handle: ".js-move-item"},
    {axis: "y"},
    {
      stop: function (event, ui) {
        el = ui['item'];
        var tmpl_type = el.attr('rel');
        category_id = $(this).attr('id');
        category_id = category_id.replace('tmpl-' + tmpl_type + '-enable-', '');
        SortTemplates(tmpl_type, true, category_id, 0);
      }
    }
  );
  $("#common_categories_list .sort-elements").sortable(
    {items: ".able_sort"},
    {handle: ".js-move-item"},
    {axis: "y"},
    {
      stop: function (event, ui) {
        el = ui['item'];
        var tmpl_type = el.attr('rel');
        SortCategories(tmpl_type, true);
      }
    }
  );
  $(document).on('click', '.sort_field_header', effectForHeader);

  function effectForHeader() {
    $(this).nextUntil('.sort_field_header').toggle();
    if (($(this).attr('data-cond') == 'enabled') || (!$(this).attr('data-cond'))) {
      $(this).attr('data-cond', 'disabled');
      $(this).children('span').removeClass('fa-angle-down');
      $(this).children('span').addClass('fa-angle-right');
      // $(this).css('border-bottom', '1px solid #e9ebed');
      $(this).addClass("-active")
    } else {
      $(this).attr('data-cond', 'enabled');
      $(this).children('span').removeClass('fa-angle-right');
      $(this).children('span').addClass('fa-angle-down');
      // $(this).css('border-bottom', 'none');
      $(this).removeClass("-active")
    }
  }

  $('input[name=templates_type]').on('change', function (e) {
    console.log(e)
    $.ajax({
      url: '/admin/channels/macros/dynamic_save',
      type: 'POST',
      data: {
        record_id: 'pos_person_template',
        enable: $(this).is(':checked') ? 1 : 0
      },
      cache: false
    });

  });

  checkTabs();
});

function SortCategories(li_elem_type, b_sort_db) {
  if (!li_elem_type) {
    return false;
  }
  var start = 1;
  var sort_li_arr = Array();
  $('#categories-' + li_elem_type + '-enable li').each(function () {
    if ($(this).hasClass('active')) {
      $(this).find('.span-sort').html(start);
      start++;
      sort_li_arr.push($(this).attr('id'));
    }
  });
  if (sort_li_arr.length > 0 && b_sort_db) {
    xajax_SortCategories(li_elem_type, sort_li_arr.join(':'));
  }
}

function SortTemplates(li_elem_type, b_sort_db, staff_id, category_id) {
  if (!li_elem_type) {
    return false;
  }

  var start = 1;
  var sort_li_arr = Array();
  if (category_id) {
    $('#tmpl-' + li_elem_type + '-enable-' + category_id + ' .template-' + li_elem_type).each(function () {
      if ($(this).hasClass('active')) {
        $(this).find('.span-sort').html(start);
        start++;
        sort_li_arr.push($(this).attr('id'));
      }
    })

  } else {
    $('#tmpl-' + li_elem_type + '-enable-' + staff_id + ' .template-' + li_elem_type).each(function () {
      if ($(this).hasClass('active')) {
        $(this).find('.span-sort').html(start);
        start++;
        sort_li_arr.push($(this).attr('id'));
      }
    })
  }
  if (sort_li_arr.length > 0 && b_sort_db) {
    xajax_SortTemplates(sort_li_arr.join(':'), li_elem_type, staff_id, category_id);
  }
}

function onOff(item, enable) {
  var li_el = $(item).closest('li');
  var ul_id = $(item).closest('ul').attr('id');
  var tmpl_type = li_el.attr('rel');

  var b_category = $(li_el).parent().parent().parent()[0].id.match(/_categories_/);

  var staff_id = ul_id.replace('tmpl-' + tmpl_type + '-enable-', '');
  staff_id = staff_id.replace('tmpl-' + tmpl_type + '-disable-', '');

  if (enable) {
    const enable = $(li_el).closest(".tempale__unit").find("[id*='enable']").append(li_el);
  } else {
    const disable = $(li_el).closest(".tempale__unit").find("[id*='disable']").prepend(li_el);
  }
  if (b_category) {

    enableRecord(item, enable, enable_category_record_url);
    SortCategories(tmpl_type, true);
  } else {
    enableRecord(item, enable);
    SortTemplates(tmpl_type, true, staff_id);
  }
}

function ClickDeleteRecord(el) {
  var li_el = $(el).closest('li');
  remove_id = get_closes_li_id(el);
  if (remove_id) {
    $('#removeRow').val(li_el[0].id);
    $('#deleteRow').togglePopup();
  }
}

function DeleteRecord(remove_id) {
  last_el_del_id = remove_id;
  var b_category = $('#' + remove_id).parent().parent()[0].id.match(/_categories_/);
  remove_id = get_closes_li_id(null, remove_id);

  if (b_category) {
    AjaxDeleteRecord(remove_id, remove_category_record_url);
  } else {
    AjaxDeleteRecord(remove_id)
  }
}

function MyHideRecordRow(record_id) {

  var t_id = '#' + last_el_del_id;
  var b_category = $(t_id).parent().parent()[0].id.match(/_categories_/);
  category_id = $(t_id).parents('div:first').attr('id');
  //скрываем строку, которую удалили
  $(t_id).fadeOut(500);
  setTimeout(function () {
    //уменьшаем счетчик элементов на 1
    var record_list = $(t_id).closest('.listWorker');

    var heading = record_list.prevAll('.heading').first();
    if (b_category) {
      var count_span = heading.find('.coC_cnt .span_cnt');
    } else {
      var count_span = heading.find('.coT_cnt .span_cnt');
    }
    count_span.html(count_span.html() - 1);
    $(t_id).remove();

    if (b_category) {
      SortCategories('common', false);
    } else if (category_id == undefined) {
      SortTemplates('common', false, 0);
    } else {
      if (category_id.indexOf("block_category_sections") > -1) {
        category_id = category_id.replace('block_category_sections_', '');
        if ($("#block_category_sections_" + category_id + " li").length < 1) {
          $('#block_category_title_' + category_id).hide();
          $('#block_category_sections_' + category_id).hide();
        }
        SortTemplates('personal', false, category_id);
      }
    }

    last_el_del_id = null;

  }, 550);
}

function init_create_record() {
  $('.create-record').off('click').on('click', function (e) {
    e.preventDefault();
    update_record('button_update_0');
  })
}

function init_update_record(start) {
  $(start + ' .update-record').off('click').on('click', function (e) {
    e.preventDefault();
    update_record($(this).attr('id'));
  })
}

function update_record(button_id) {
  if (request_sent) {
    return;
  }

  record_id = button_id.match(/button_update_(\d+)/)[1];
  var errors = [];
  var errors_fields = [];

  var titles = {};
  $.each($('#form_'+record_id +' input.category_title'), function(i, input) {
          if($(input).val())  titles[input.id.replace('title_', '')] = $(input).val().trim();
        });
console.log(titles);
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
    ShowSpinButton('button_create');
    xajax_SaveCategory(record_id, titles);
  } else {
    ShowSpinButton('button_update_' + record_id);
    xajax_SaveCategory(record_id, titles);
  }
}
