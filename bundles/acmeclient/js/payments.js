var payment_month = 0;
var payment_amount = 0;
var selected_purse = 'purse_e';
var zero_price_staff = 0;
var min_basic_staff_number = 0;
var min_light_staff_number = 0;
var payment_basic_staff = 0;
var payment_light_staff = 0;
var payment_per_month;

const paymentData = {
  user: null, // физ/юр лицо                                             individual/entity
  payment_type: null, // способ оплаты                                   card/bill_foreign/bill_rus/online_pay
  residance: null, // резиденство компании                               rus/sng/other
  payment_info: {
    person_count: null, // количество обычных сотрудников
    light_person_count: null, // количество легких сотрудников
    total_sum: null, // стоимость
    discount: null, // %
    period: null, // период оплаты
  },
  props: { // реквизиты компании
    type: null, // file/form
    fields: {},
    file: '',
    filename: '',
  },
  email: null, // email для получения договора и счета на оплату
  webmoney: null, // тип кошелька webmoney(WMZ/WME)
  case_id: 0,
};

$(document).ready(function () {
  if($('.lw_payment_card_save').length) {
    if($('.lw_payment_card_save').hasClass('active')) {
      $('.processBody').hide();
    } else {
      $('.processBody').slideDown();
    }
  }

  // для заполнения при загрузке success от stripe на послденем шаге
  if($('#finish_step').length) {
    GetDataFromStorage();
    $('.processBody').show();
    return false;
  }
    if(window.default_file && default_file.length)
    {
        paymentData.props.type = 'props-file'
        paymentData.props.file = default_file;
        paymentData.props.filename = $('.input_custom_file_block p').text();
    }

    if ('undefined' != typeof (staff_price_1)) {
    if (staff_price_1 == 0) {
      zero_price_staff = price1_limit;
    }
    var min_staff_number = Math.max((zero_price_staff + 1), active_staff_nr);

    min_light_staff_number = light_staff_nr;
    min_basic_staff_number = Math.max((min_staff_number - light_staff_nr), 1);

    payment_basic_staff = min_basic_staff_number;
    payment_light_staff = min_light_staff_number;

    var qty_basic = min_basic_staff_number;
    var qty_basic_title = basic_staff_nr_titles[qty_basic];
    $('.n_qty .qty_basic').text(qty_basic);
    $('.n_qty .qty_basic_title').text(qty_basic_title);

    if (light_staff_nr) {
      var qty_light = light_staff_nr;
      var qty_light_title = light_staff_nr_titles[qty_light];
      $('.n_qty .qty_light').text(qty_light);
      $('.n_qty .qty_light_title').text(qty_light_title);

      $('.wn').text(min_basic_staff_number + ' + ' + light_staff_nr);
    } else {
      $('.wn').text(min_basic_staff_number);
    }
  }


  //payment process
  $('.processBody li:first-child').addClass('active');
  $('.processBody li:first-child').find('.pr_details').slideDown();

  $('.processRow .twoBlock a, .processRow .threeBlock a').click(function (e) {
    e.preventDefault();

    SetTypePerson($(this));
    SetTypeResidance($(this));
    SetTypePayment($(this));
    SetTypeProps($(this));

    OpenProcessRow($(this));

    return false;
  });


  $('.processRow .price a').click(function (e) {
    e.preventDefault();

    OpenProcessRow($(this));

    RecountTotalAmount();

    SetTypePaymentInfo($(this));
    return false;
  });

  $('#four_step_next_btn').click(function (e) {
    e.preventDefault();

    OpenProcessRow($(this));

    SetTypePaymentInfo($(this).closest('.processRow').find('.price > a.single'));

    RecountTotalAmount();

    return false;
  });


  $('.js_link_edit').click(function (e) {
    e.preventDefault();

    $(this).hide();

    $(this).closest('.processRow').removeClass('done').addClass('active').find('.pr_details').slideDown();

    SetRowDefaultOnEdit($(this).closest('.processRow'));
    // console.log(paymentData)

    return false;
  });

  $('.currency a').click(function (e) {
    e.preventDefault();

    $('.currency a.wm_pmnt_new').removeClass('active');
    $(this).addClass('active');

    var webmoney_purse = '';
    var purse_rel = $(this).attr('rel');
    if (purse_rel == 'purse_z') {
      webmoney_purse = purse_z;
      selected_purse = purse_rel;
    } else if (purse_rel == 'purse_r') {
      webmoney_purse = purse_r;
      selected_purse = purse_rel;
    } else if (purse_rel == 'purse_e') {
      webmoney_purse = purse_e;
      selected_purse = purse_rel;
    }
    $('#webmoney_purse').val(webmoney_purse);

    SetWebmoneyType();
    RecountTotalAmount();
    return false;
  });

  if ('undefined' != typeof (staff_price_1)) {
    ControlMinusButton();
    RecountTotalAmount();

    $('.w_qty .plus').on('click', function (e) {
      e.preventDefault();

      var type_rel = $(this).attr('rel');
      incrementValue(1, type_rel);
    });

    $('.w_qty .minus').on('click', function (e) {
      e.preventDefault();

      if($(this).hasClass('disabled-minus-btn')) {
        return
      }
      var type_rel = $(this).attr('rel');
      incrementValue(-1, type_rel);

      var total_payment_staff = payment_basic_staff + payment_light_staff;
      if(total_payment_staff == 4 && paymentData.payment_type == "bill_rus") {
        $('.w_nmbr .staff_minus_btn').addClass('disabled-minus-btn');
      } else {
        ControlMinusButton();
      }
    })
  }

  $('.method a').click(function () {
    var webmoney_purse = '';
    if (client_currency == 2) {
      webmoney_purse = purse_e;
      selected_purse = 'purse_e';
    }
    if (client_currency == 1) {
      selected_purse = 'purse_z';
      webmoney_purse = purse_z;
    }
    $('a.wm_pmnt_new').removeClass('active');
    $('a.wm_pmnt_new[rel=' + selected_purse + ']').addClass('active');
    $('#webmoney_purse').val(webmoney_purse);

    RecountTotalAmount();
  });

  $('li.cp_protect input').on('change', function (e) {

    if ($(this).is(':checked')) {
      $(this).closest(".cp_protect").addClass('checked');
      $('.cardpayments_btn,.yakassapayments_btn,.stripepayments_btn').removeClass('disabled')
    } else {
      $(this).closest(".cp_protect").removeClass('checked');
      $('.cardpayments_btn,.yakassapayments_btn,.stripepayments_btn').addClass('disabled')
    }
  });

  $('li.b_recciring_pay input').on('change', function (e) {

    if ($(this).is(':checked')) {
      $(this).closest(".ep_block").addClass('checked');
    } else {
      $(this).closest(".ep_block").removeClass('checked');
    }
  });

  $('.yakassapayments_btn').click(function (e) {
    if ($(this).hasClass('disabled')) {
      return false;
    }

    // скрываем Переключатель автопродления
    if($('.lw_payment_card_save').length) {
      $('.lw_payment_card_save').hide();
    }

    var self = this;

    const width = this.offsetWidth //153
    $(this).html('<i class="fa fa-spinner fa-spin" style="height: min-content;"></i>').addClass('disabled');
    this.setAttribute("style", `
        width:${width}px;
        padding:0;
        display: flex;
        justify-content: center;
        align-items: center;
      `)
    e.preventDefault();
    if (payment_light_staff) {
      var payment_staff = payment_basic_staff + ' + ' + payment_light_staff;
    } else {
      var payment_staff = payment_basic_staff;
    }
      if(paymentData.user != 'individual')
      {
          // xajax_CreateCaseRequest(paymentData);
      }

    $.ajax({

      type: "POST",
      url: ya_get_link_url,
      data: { // options
        description: description_arr[payment_month],
        amount: payment_amount,
        payment_staff: payment_staff,
        payment_month: payment_month,
        b_epayment_wallet: $(this).parent().parent().attr('id') == 'pmnt_tab-6' ? 1 : 0,
        b_save_card: $(this).parent().parent().find('.b_recciring_pay input:checked').length ? 1 : 0,
        data: paymentData
      },
      success: function (res) {
        if (!res.url) {
          return;
        }
        let url = res.url;
        // if(!window.location.host.match(/omnidesk'.ru/))
        // {
        //     var h = window.location.host.split('.');
        //     delete h[0];
        //     url = 'https://omnidesk.ru/sys_redirect?u=' + url;
        // }


        window.open(url, Translate('payments_js/yandex_kassa'), 'menubar=no,location=yes,resizable=no,scrollbars=no,status=yes,width=800px,height=800px');
        $(self).parent().hide();
        // $(self).parent().parent().find('.iframe_result').html('<iframe class="'+(res.gatewayId == 2 ? 'epayment' : '')+'" src="'+res.url+'"/>').show();
        // if(res.integrationType == 'redirect')
        // {
        //     // window.open(res.url, 'ePayments', 'menubar=no,location=yes,resizable=no,scrollbars=no,status=yes,width=800px,height=800px');
        //     //            window.location = res.url;
        // }
        // else if(res.integrationType == 'iframe')
        // {
        //     $(self).parent().hide();
        //     $(self).parent().parent().find('.iframe_result').html('<iframe class="'+(res.gatewayId == 2 ? 'epayment' : '')+'" src="'+res.url+'"/>').show();
        //
        // }


      },
    });
  })

  $('.stripepayments_btn').click(function (e) {
      if ($(this).hasClass('disabled')) {
          return false;
      }
      var self = this;

      const width = this.offsetWidth //153
      $(this).html('<i class="fa fa-spinner fa-spin" style="height: min-content;"></i>').addClass('disabled');
      this.setAttribute("style", `
      width:${width}px;
      padding:0;
      display: flex;
      justify-content: center;
      align-items: center;
    `)
      e.preventDefault();
      if (payment_light_staff) {
          var payment_staff = payment_basic_staff + ' + ' + payment_light_staff;
      } else {
          var payment_staff = payment_basic_staff;
      }
      if(paymentData.user != 'individual')
      {
          // xajax_CreateCaseRequest(paymentData);
      }

      setTimeout(function () {
          $.ajax({

              type: "POST",
              url: stripe_get_link_url,
              data: { // options
                  description: description_arr[payment_month],
                  amount: payment_amount,
                  payment_staff: payment_staff,
                  payment_month: payment_month,

                  b_save_card: $(self).parent().parent().find('.b_recciring_pay input:checked').length ? 1 : 0,

                  data: paymentData
              },
              success: function (res) {
                  if (!res.id) {
                      return;
                  }

                  var stripe = Stripe(res.pkey);

                  SetDataToStorage();

                  stripe.redirectToCheckout({sessionId: res.id});
              },
          });
      },1000)
  })

  $('#webmoney').click(function (e) {
    const width = this.offsetWidth //153
    $(this).html('<i class="fa fa-spinner fa-spin" style="height: min-content;"></i>').addClass('disabled');
    this.setAttribute("style", `
        width:${width}px;
        padding:0;
        display: flex;
        justify-content: center;
        align-items: center;
      `)

    $('#webmoney_amount').val(payment_amount);
    $('#webmoney_month_nr').val(payment_month);
    if (payment_light_staff) {
      $('#webmoney_staff_nr').val(payment_basic_staff + ' + ' + payment_light_staff);
    } else {
      $('#webmoney_staff_nr').val(payment_basic_staff);
    }
    $('#webmoney_desc').val(description_base64_arr[payment_month]);

    $('#webmoney_form').trigger('submit');
    e.preventDefault();
  })

  $('#input_custom_file').change(function() {
		NewShowSpinButton('input_custom_file_span');

    // это временное решение, потом удалить
    // $('.input_custom_file_block p').text($(this).val());

		$('#upload_custom_file_form').submit();
	});

	if(!$('.paymentHistory').length) {
    $('#upload_custom_file_form').ajaxForm({
      complete: function(xhr) {
        response = xhr.responseText;
        if(response) {
          response = JSON.parse(response);

          if(response.status == 'ok') {
            import_file = response.filename;

            $('.input_custom_file_block p').text(import_file);
              default_file = '';
              paymentData.props.file = response.import_file ;
              paymentData.props.filename = import_file ;

          }  else {
            NewHideSpinButton('input_custom_file_span');
            if(response.message_code) {
              ShowXajaxNotification(response.message_code);
            }
          }

        } else {
          ShowXajaxNotification('UPLOAD_ERROR');
          NewHideSpinButton('input_custom_file_span');
        }

        $('#input_custom_file').val('');
        NewHideSpinButton('input_custom_file_span');
      }
    });
  }

  $('.js_num_only').on('input', function() {
    this.value = this.value.replace(/\D/g, '');
  })

  $('form input').on('input', function() {
    let form = $(this).closest('form');

    if( !(form && form.length) ) {
      return
    }

    let button = form.find('button[type="submit"]');

    if($(this).hasClass('js_mail')){
      $(this).val($(this).val().trim())

      if(ValidEmail($(this).val())) {
        $(this).removeClass('error')
      } else {
        $(this).addClass('error');
        button.addClass('disabled');
        return false;
      }
    }

    CheckFieldsNotEmpty(form);
  })

  $('#props_edit_form button[type="submit"]').on('click', function() {
    let form = $(this).closest('form');

    if(!CheckFieldsNotEmpty(form)) {
      return false;
    }

    paymentData.email = form.find('.js_mail').val();
    paymentData.props.fields.email = form.find('.js_mail').val();
    paymentData.props.fields = form.serializeJSON();

    ActivationFinishStep($(this).closest('.processRow'))

    return false;
  })

  $('#upload_custom_file_form button[type="submit"]').on('click', function() {
    let form = $(this).closest('form');

    if(!CheckFieldsNotEmpty(form)) {
      return false;
    }

    paymentData.email = form.find('.js_mail').val();
    paymentData.props.fields["file-invoice-email"] = form.find('.js_mail').val();
    // paymentData.props.file = [{ name: "input_custom_file", value: form.find('#input_custom_file').val() }];


    ActivationFinishStep($(this).closest('.processRow'))

    return false;
  })

  $('#upload_indiv_form button[type="submit"]').on('click', function() {
    let form = $(this).closest('form');

    if(!CheckFieldsNotEmpty(form)) {
      return false;
    }

    paymentData.props.fields = form.serializeJSON();


    ActivationFinishStep($(this).closest('.processRow'))

    return false;
  })

  $('.js-final-invoice-email').on('input', function() {
    let val = $(this).val();
    let btn = $(this).closest('form').find('.submit_payment');

    $(this).val($(this).val().trim())

    if(val && val.length) {
      if(val !== paymentData.email && ValidEmail(val) ) {
        btn.removeClass('cancel_payment').addClass('save_payment').text(Translate('payments_js/save_changes_in_email'));
          paymentData.email = val;
      } else {
        btn.removeClass('save_payment').addClass('cancel_payment').text(Translate('payment/undo_request'));
      }
    } else {
      btn.removeClass('save_payment').addClass('cancel_payment').text(Translate('payment/undo_request'));
    }

    return false;
  });

  $(document).on('click','.submit_payment.save_payment',function () {
      xajax_CreateCaseRequest(paymentData);
      $(this).removeClass('save_payment').addClass('cancel_payment').text(Translate('payment/undo_request'));
      return false
  });

  $(document).on('click','.submit_payment.cancel_payment',function () {
      xajax_CreateCaseRequest(paymentData,true);
      $(this).removeClass('save_payment').removeClass('cancel_payment').html('<i class="fa fa-spinner fa-spin" style="height: min-content;"></i>');
      setTimeout(function () { window.location.reload()},1000);
      return false
  });

  $('a.onoff-settings').click(function () {
    var visibility;
    if ($(this).attr('rel') == 'on') {
      $('.payment-recount-off').hide();
      $('.payment-recount-on').show();
      visibility = 1;
    } else {
      $('.payment-recount-off').show();
      $('.payment-recount-on').hide();
      visibility = 0;
    }
    xajax_UpdateHistoryVisibility(visibility);
    return false;
  });

});


// ok
function incrementValue(increment, type_rel) {
  var valueElement = $('.n_qty .qty_' + type_rel);

  if (type_rel == 'basic') {
    var new_staff_nr = Math.max(parseInt(valueElement.text()) + increment, min_basic_staff_number);
    payment_basic_staff = new_staff_nr;
    var qty_title = basic_staff_nr_titles[new_staff_nr];
  } else {
    var new_staff_nr = Math.max(parseInt(valueElement.text()) + increment, min_light_staff_number);
    payment_light_staff = new_staff_nr;
    var qty_title = light_staff_nr_titles[new_staff_nr];
  }

  var w_value = $('.wn');

  valueElement.text(new_staff_nr);
  $('.n_qty .qty_' + type_rel + '_title').text(qty_title);
  if(payment_light_staff) {
    w_value.text(payment_basic_staff + ' + ' + payment_light_staff);
  } else {
    w_value.text(payment_basic_staff);
  }

  RecountTotalAmount();
  ControlMinusButton();

  return false;
}

// ok
function ControlMinusButton() {
  var basic_minus = $('.qty_basic').parents('.qty_small').find('.staff_minus_btn');

  if (payment_basic_staff <= min_basic_staff_number) {
    basic_minus.addClass('disabled-minus-btn');
  } else {
    basic_minus.removeClass('disabled-minus-btn');
  }

  if (light_staff_nr) {
    var light_minus = $('.qty_light').parents('.qty_small').find('.staff_minus_btn');

    if (payment_light_staff <= min_light_staff_number) {
      light_minus.addClass('disabled-minus-btn');
    } else {
      light_minus.removeClass('disabled-minus-btn');
    }
  }

  var total_payment_staff = payment_basic_staff + payment_light_staff;
  if(total_payment_staff == 4 && paymentData.payment_type == "bill_rus") {
    $('.w_nmbr .staff_minus_btn').addClass('disabled-minus-btn');
  }
}

// ok
function RoundPrice(price, ignore_currency) {
  if (ignore_currency) {
    price = Math.round(price * 100) / 100;
  } else {
    price = Math.round(price * 100) / 100 + currency_symbol;
  }

  return price;
}

// ok
function GetDiscount(month_nr) {
  if (month_nr >= 12) {
    $discount = discount;
  } else if (month_nr > 1) {
    $discount = month_nr * discount / 12;
  } else {
    $discount = 0;
  }
  // console.log($discount,parseInt($discount / 100) / 100);
  return parseInt($discount * 100) / 100;
}

// ok
function GetPriceByMonth(price, month_nr,commision_perc,b_nds,sale) {

    if(typeof sale == 'undefined')
    {
        if (month_nr > 1)
        {
            sale = month_nr * discount / 12;
        }
        else
        {
            sale = 0;
        }
    }
  var cost = price * month_nr * (1 - sale / 100);
  if(commision_perc)
  {
      cost *= (1 + commision_perc / 100)
  }
  if(b_nds)
  {
      cost = RoundPrice(cost,true)
      cost *= rus_nds;
  }
  return cost;
}

function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

// ok
function RecountTotalAmount() {
  var total_payment_staff = payment_basic_staff + payment_light_staff;
  var checkout_basic_staff = payment_basic_staff;
  var checkout_light_staff = payment_light_staff;
  var basic_price = 0;
  let rub_payment_per_month = null;

  if (zero_price_staff) {
    if (zero_price_staff > payment_basic_staff) {
      checkout_basic_staff = 0;
      checkout_light_staff = checkout_light_staff - (zero_price_staff - payment_basic_staff);
    } else {
      checkout_basic_staff = payment_basic_staff - zero_price_staff;
    }

    basic_price = staff_price_2;
  } else {
    if (total_payment_staff > price1_limit) {
      basic_price = staff_price_2;
    } else {
      basic_price = staff_price_1;
    }

  }

  // console.log(total_payment_staff)

  payment_per_month = checkout_basic_staff * basic_price + checkout_light_staff * staff_light_price;

  //   if(paymentData.user == "entity") {
  //
  //   if(paymentData.residance == 'rus') { // + НДС
  //     if(paymentData.payment_type == "bill_foreign") {
  //       payment_per_month *= 1.2;
  //
  //       rub_payment_per_month = payment_per_month * rate_rub;
  //       $('#price_1_rub').html( numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 1) * 1.060981, true)) + '₽' );
  //       $('#price_3_rub').html( numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 3) * 1.060981, true)) + '₽' );
  //       $('#price_6_rub').html( numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 6) * 1.0722697, true)) + '₽' );
  //       $('#price_12_rub').html( numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 12) * 1.077862, true)) + '₽' );
  //     } else
  //     if(paymentData.payment_type == "bill_rus") {
  //       rub_payment_per_month = payment_per_month * rate_rub;
  //       $('#price_12_single').html(  numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 12) * 1.390946, true)) + '₽' );
  //     }
  //   }
  //
  // }

    if(currency_symbol == '$') {
        payment_per_month *= rate_doll;
    }

    $('#price_1').html( numberWithSpaces( RoundPrice(GetPriceByMonth(payment_per_month, 1)) ) );
    $('#price_3').html( numberWithSpaces( RoundPrice(GetPriceByMonth(payment_per_month, 3)) ) );
    $('#price_6').html( numberWithSpaces( RoundPrice(GetPriceByMonth(payment_per_month, 6)) ) );
    $('#price_12').html( numberWithSpaces( RoundPrice(GetPriceByMonth(payment_per_month, 12)) ) );


    if((paymentData.residance == 'rus' &&  paymentData.payment_type == "card")
    || (paymentData.residance == 'rus' &&  paymentData.payment_type == "bill_foreign")
    || (paymentData.residance == 'rus' &&  paymentData.payment_type == "bill_rus")
    ) {
        // payment_per_month *= rus_nds;
        // payment_per_month *= 1.1982902;

        rub_payment_per_month = payment_per_month * rate_rub;
        if (paymentData.payment_type == "bill_rus")
        {
            $('#price_12_single').html(  numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 12,0,true,5), true)) + '₽' );
        }
        else if(paymentData.payment_type == "bill_foreign")
        {
            $('#price_1').html( numberWithSpaces( RoundPrice(GetPriceByMonth(payment_per_month, 1,0,true)) ) );
            $('#price_3').html( numberWithSpaces( RoundPrice(GetPriceByMonth(payment_per_month, 3,0,true)) ) );
            $('#price_6').html( numberWithSpaces( RoundPrice(GetPriceByMonth(payment_per_month, 6,0,true)) ) );
            $('#price_12').html( numberWithSpaces( RoundPrice(GetPriceByMonth(payment_per_month, 12,0,true)) ) );

            $('#price_1_rub').html(numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 1,0, true,-5), true)) + '₽');
            $('#price_3_rub').html(numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 3,0, true,0), true)) + '₽');
            $('#price_6_rub').html(numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 6,0, true,3.33), true)) + '₽');
            $('#price_12_rub').html(numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 12,0, true,11.66), true)) + '₽');

        }
        else
        {
            $('#price_1').html(numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 1,2, true), true)) + '₽');
            $('#price_3').html(numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 3,2, true), true)) + '₽');
            $('#price_6').html(numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 6,2, true), true)) + '₽');
            $('#price_12').html(numberWithSpaces(RoundPrice(GetPriceByMonth(rub_payment_per_month, 12,2, true), true)) + '₽');
        }
    }

  if(total_payment_staff <= 3) {
    $('.step-three-payment_type .twin[rel="bill_rus"]').addClass('hidden');
  }  else {
    $('.step-three-payment_type .twin[rel="bill_rus"]').removeClass('hidden');
  }

  if(paymentData.user == "individual") {
    $('.price a:not(.single)').show();
    $('.price a.single').hide();
  } else
  if(paymentData.user == "entity") {
    $('.price a:not(.single)').show();
    $('.price a.single').hide();

    if(paymentData.residance == 'rus') {

      if (paymentData.payment_type == 'card') {
        $('.price a:not(.single)').show();
        if(total_payment_staff <= 3) {
          $('.price a[rel="price_1"]').hide();
        }
      } else
      if(paymentData.payment_type == "bill_foreign") {
        if(total_payment_staff <= 3) {
          $('.price a').hide();
          $('.price a[rel="price_12"]:not(.single)').show();
        } else
        if(total_payment_staff >= 4 && total_payment_staff <= 9) {
          $('.price a').hide();
          $('.price a[rel="price_6"]').show();
          $('.price a[rel="price_12"]:not(.single)').show();
        } else
        if(total_payment_staff >= 10 && total_payment_staff <= 19) {
          $('.price a').hide();
          $('.price a[rel="price_3"]').show();
          $('.price a[rel="price_6"]').show();
          $('.price a[rel="price_12"]:not(.single)').show();
        } else
        if(total_payment_staff >= 20) {
          $('.price a:not(.single)').show();
        }
      } else
      if(paymentData.payment_type == "bill_rus") {
        if(total_payment_staff >= 4) {
          $('.price a').hide();
          $('.price a.single[rel="price_12"]').css('display', 'flex');
        }
      }

    } else {

      if(paymentData.payment_type == "card") {
        $('.price a:not(.single)').show();
        if(total_payment_staff <= 3) {
          $('.price a[rel="price_1"]').hide();
        }
      } else
      if(paymentData.payment_type == "online_pay") {
        if(total_payment_staff <= 3) {
          $('.price a').hide();
          $('.price a[rel="price_12"]:not(.single)').show();
        } else
        if(total_payment_staff >= 4 && total_payment_staff <= 9) {
          $('.price a').hide();
          $('.price a[rel="price_6"]').show();
          $('.price a[rel="price_12"]:not(.single)').show();
        } else
        if(total_payment_staff >= 10 && total_payment_staff <= 19) {
          $('.price a').hide();
          $('.price a[rel="price_3"]').show();
          $('.price a[rel="price_6"]').show();
          $('.price a[rel="price_12"]:not(.single)').show();
        } else
        if(total_payment_staff >= 20) {
          $('.price a:not(.single)').show();
        }
      }

    }

  }

  var month_nr = 0;

  var selected_price_row = $('.processRow .price a.selected').length ? $('.processRow .price a.selected') : $('.price a.single[rel="price_12"]');
  var selected_price_rel = selected_price_row.attr('rel');
  if (selected_price_rel) {
    month_nr = selected_price_rel.replace('price_', '');
  }

  if(paymentData.payment_type !== 'webmoney') {
    selected_purse = null
  }

  if (month_nr > 0) {
    var result_price = GetPriceByMonth(payment_per_month, month_nr);
    if (selected_purse == 'purse_e' && client_currency == 2) {
      result_price = result_price;
    } else if (selected_purse == 'purse_z' && client_currency == 2) {
      result_price = result_price * exchange_e / exchange_z;
    } else if (selected_purse == 'purse_e' && client_currency == 1) {
      result_price = result_price * exchange_z / exchange_e;
    }
    //
    // else if(selected_purse=='purse_e') {
    //     result_price = result_price*exchange_e;
    // }
    // else if(selected_purse=='purse_r') {
    //     result_price = result_price*exchange_r;
    // }

    result_price = RoundPrice(result_price, 1);
  } else {
    result_price = 0;
  }

  if (month_nr > 0)
  {
      var regex = new RegExp(Translate('payment/discount')+' .*', 'gm');
      var pay_amount = selected_price_row.find('strong').text().replace(regex, '').replace(/—/gm, '');
      var pay_time = selected_price_row.find('span').last().text();
      result_price =parseFloat(pay_amount.replace(' ',''))
      $('.res_pmnt').text(pay_amount + ' '+Translate('payment_c/for')+' ' + pay_time).fadeIn();
      $('.res_pmnt').parent().find('.text_nds').text('');
      if ((paymentData.residance == 'rus' && paymentData.payment_type == "card")
          || (paymentData.residance == 'rus' && paymentData.payment_type == "bill_foreign")
          || (paymentData.residance == 'rus' && paymentData.payment_type == "bill_rus")
      )
      {
          let s = currency_symbol;
          if(pay_amount.match(/₽/))
          {
              s = '₽';
          }
          $('.res_pmnt').parent().find('.text_nds').html(', '+Translate('payments_js/include_tva')+' '+numberWithSpaces(RoundPrice(result_price-(result_price/rus_nds),true))+s);
      }
  }

  // тк итоговая сумма пересчитывается выше и чтоб не повторяться, сумму берем из текста завершенного шага стоимости услуг
  result_price = pay_amount.match(/\d.*/g)[0]

    //ТОЛЬКО ДЛЯ ВМ
    if(paymentData.payment_type === 'webmoney' && month_nr > 0) {
            var result_price = GetPriceByMonth(payment_per_month, month_nr);
            if (selected_purse == 'purse_e' && client_currency == 2) {
                result_price = result_price;
            } else if (selected_purse == 'purse_z' && client_currency == 2) {
                result_price = result_price * exchange_e / exchange_z;
            } else if (selected_purse == 'purse_e' && client_currency == 1) {
                result_price = result_price * exchange_z / exchange_e;
            }
        console.log(result_price)
            //
            // else if(selected_purse=='purse_e') {
            //     result_price = result_price*exchange_e;
            // }
            // else if(selected_purse=='purse_r') {
            //     result_price = result_price*exchange_r;
            // }

            result_price = RoundPrice(result_price, 1);
    }



  payment_amount = result_price;
  payment_month = month_nr;

  if(paymentData.payment_type !== 'webmoney')
  {
      var cd = $('.paymentDay .ai_nmbr:first').text().split('.');
      var str = 'err';
      if (cd.length == 3)
      {
          cd[0] = $.trim(cd[0].split(',')[1]);
          // console.log(cd);
          var d = new Date(parseInt(cd[2]), parseInt(cd[1]) - 1 + parseInt(month_nr), parseInt(cd[0]) - 1);
          str = ((d.getDate() + 1) < 10 ? '0' : '') + d.getDate() + '.' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1) + '.' + d.getFullYear() + ', ' + payment_basic_staff + ' '+Translate('payment/ordinary') + (payment_light_staff ? ' '+Translate('common/and')+' ' + payment_light_staff + ' '+Translate('payment/light') : '') + ' '+Translate('payment/staffs')+', ' + (result_price.slice(-1) == '₽' ? (Translate('payment/aprox')+' ' + result_price) : result_price) + (GetDiscount(month_nr) ? ' '+Translate('payment/with_discount')+' ' + GetDiscount(month_nr) + '% ' : ' ');
      }

      $('.ep_reccuring_pay_label').html(str);

      if ($('#pmnt_tab-yav').length)
      {
          if ($('#pmnt_tab-yav .ep_reccuring_pay_label').next('span').length)
          {
              $('#pmnt_tab-yav .ep_reccuring_pay_label').next('span').remove();
          }

          $('#pmnt_tab-yav .ep_reccuring_pay_label').after(Translate('payments_js/exactly_summ', {'summ': str.slice(0, 10)}))
      }
  }
}

function ePsuccess() {
  _parent = $('.m_description:not(:hidden)').parent();
  $('.m_description:not(:hidden)').hide();
  $('.js_link_edit').hide();
  $('.iframe_result').hide();
  $('.btn_footer:not(:hidden)').hide();
  // $(_parent).find('.paymentDoneNew').removeClass('hidden')
  $('#pmnt_tab-success').removeClass('hidden')
}

function ePfailed() {
  _parent = $('.m_description:not(:hidden)').parent();
  $('.m_description:not(:hidden)').hide();
  $('.btn_footer:not(:hidden)').hide();
  $('.js_link_edit').hide();
  $('.iframe_result').hide();
  // $(_parent).find('.paymentFailedNew').removeClass('hidden')
  $('#pmnt_tab-failed').removeClass('hidden')
}

function SetTypePerson(target) {
  if(target.closest('.step-one').length) {
      paymentData.user = target.attr('rel');
  }
}

function SetTypePayment(target) {
  if(target.closest('.step-two').length || target.closest('.step-three-payment_type').length) {
    paymentData.payment_type = target.attr('rel');
  }
}

function SetTypeResidance(target) {
  if(target.closest('.step-two-country').length) {
    paymentData.residance = target.attr('rel');
  }
}

function SetTypeProps(target, val) {
  if(target.closest('.step-five').length) {
    paymentData.props.type = val ? val : target.attr('rel');
  }
}

function SetWebmoneyType() {
    paymentData.webmoney = $('.currency a.wm_pmnt_new.active').attr('rel');
}

function SetTypePaymentInfo(target) {
  if(target.closest('.step-three').length) {

    let processRow = target.closest('.processRow');
    let selectedBlock = processRow.find('.price a.selected').length ? processRow.find('.price a.selected') : processRow.find('.price a.single');
    let person_count = Number( processRow.find('.w_qty').eq(0).find('.qty_number').text() )
    let light_person_count = Number( processRow.find('.w_qty').eq(1).find('.qty_number').text() )
    let total_sum = selectedBlock.children('strong').text();//.match(/\d+/g)[0]
    let discount = selectedBlock.find('.payment-discount strong').text()
    let period = selectedBlock.find('.payment-discount').next().text()

    paymentData.payment_info = {
      person_count,
      light_person_count,
      total_sum,
      discount,
      period,
    }
  }
}

function OpenProcessRow(target) {
  let currentStepObj = {
    'one': target.closest('.step-one').length,
    'two': target.closest('.step-two-country').length,
    'two2': target.closest('.step-two').length,
    'three_ind': target.closest('.step-three').length,
    'three_ent': target.closest('.step-three-payment_type').length,
    'four_ind': target.closest('.step-five-creds').length,
    'four_ent': target.closest('.step-three').length,
    'five_ent': target.closest('.step-four').length,
  }

  let processRow = target.closest('.processRow');
  let t_str = target.find('.t_twin').text()

  if(
    t_str == Translate('payment_c/individual')
    ||
    t_str == Translate('payment_c/entity')
    ||
    t_str == Translate('payment_c/rf_partners_invoice')
    ||
    t_str == Translate('payment_c/foreign_entity_invoice')
    ||
    t_str == Translate('payment_c/cashless_payment')
    )
  {
    t_str = t_str.charAt(0).toLowerCase() + t_str.slice(1);
  }

  processRow.find('.selected').removeClass('selected');
  target.addClass('selected');

  if(!target.closest('.props-main').length) {
    target.closest('.pr_details').slideUp();

    processRow.removeClass('active').addClass('done');
    processRow.find('.pr_text .frst_title').hide();
    processRow.find('em').fadeIn();
    processRow.find('.pr_text strong:not(.price_head_info)').html(t_str);
    processRow.find('.pr_text strong').fadeIn();
    processRow.find('.pr_title a').fadeIn();
  } else { // для шага с реквизитами
    let propsRel = target.attr('rel');

    if(!$(`.${propsRel}`).is(':visible')) {
      $('.props-file, .props-form').slideUp().addClass('hidden');

      $(`.${propsRel}`).slideDown().removeClass('hidden');
        if(propsRel == 'props-form')
        {
            paymentData.props.file = '';
        }
        else if(default_file.length)
        {
            paymentData.props.file = default_file;
            paymentData.props.filename = $('.input_custom_file_block p').text();

        }
    }
  }

  if(paymentData.user == "individual") {

    if(currentStepObj['one']) {
      let stepTwo = target.closest('.processBody').find('.step-two-country');

      stepTwo.find('.pr_text .frst_title').text(Translate('payments_js/your_residence'));
      stepTwo.find('.pr_text em').text(Translate('payments_js/residance')+':');

      helperOpenNextRow(stepTwo);
    } else
    if(currentStepObj['two']) {
      let stepTwo2 = target.closest('.processBody').find('.step-two');

      helperOpenNextRow(stepTwo2);
    } else
    if(currentStepObj['two2']) {
      let stepThree = target.closest('.processBody').find('.step-three');
      let t_arrt = target.attr("title");

      processRow.find('.pr_text strong').html(t_arrt);
      // stepThree.find('.pr_nmbr span').text('3');

      stepThree.find('.frst_title').text(Translate('payment/select_staff_count_and_period'));

      if(paymentData.residance == 'rus') {
        if (paymentData.payment_type == 'card') {
          stepThree.find('#noteAlert_0').removeClass('hidden');
        }
      }

      ControlMinusButton();
      RecountTotalAmount();

      helperOpenNextRow(stepThree);
    } else
    if(currentStepObj['three_ind']) {
      let stepFour;

      $('.processRow .price a').removeClass('selected');
      target.addClass('selected');

      if(paymentData.residance == "rus" && paymentData.payment_type == 'card') {
        stepFour = target.closest('.processBody').find('.step-five-creds');
      } else {
        stepFour = target.closest('.processBody').find('.step-four');
        stepFour.find('.pr_nmbr').text('5');

        // if(paymentData.residance == "rus" && paymentData.payment_type == 'card') {
        //   $('#pmnt_tab-yav').removeClass('hidden');
        // } else
        if(paymentData.payment_type == 'webmoney') {
          $('#pmnt_tab-wm').removeClass('hidden');

          SetWebmoneyType();
        } else {
          $('#pmnt_tab-card').removeClass('hidden');
        }

      }

      helperOpenNextRow(stepFour);
    }

  } else
  if(paymentData.user == "entity") {

    if(currentStepObj['one']) {
      let stepTwo = target.closest('.processBody').find('.step-two-country');

      stepTwo.find('.pr_text .frst_title').text(Translate('payment/select_company_residence'));
      stepTwo.find('.pr_text em').text(Translate('payment/company_residence')+':');

      helperOpenNextRow(stepTwo);
    } else
    if(currentStepObj['two']) {
      let stepThree = target.closest('.processBody').find('.step-three-payment_type');
      let t_arrt = target.attr("title");

      processRow.find('.pr_text strong').html(t_arrt);

      stepThree.find('.twin').hide();
      if(paymentData.residance !== 'rus') {
        stepThree.find('.twin_pay_1').show();
        stepThree.find('.twin_pay_4').show();
      } else {
        stepThree.find('.twin_pay_1').show();
        stepThree.find('.twin_pay_2').show();
        stepThree.find('.twin_pay_3').show();
      }

      helperOpenNextRow(stepThree);
    } else
    if(currentStepObj['three_ent']) {
      let stepFour = target.closest('.processBody').find('.step-three');

      // stepFour.find('.pr_nmbr span').text('4');

      stepFour.find('.frst_title').text(Translate('payment/select_staff_count_and_period'));

      if(paymentData.residance == 'rus') {

        if (paymentData.payment_type == 'card') {
          stepFour.find('#noteAlert_1').removeClass('hidden');
        } else
        if(paymentData.payment_type == "bill_foreign") {
          stepFour.find('.without_w_block').removeClass('hidden');
          stepFour.find('#noteAlert_1').removeClass('hidden');

          stepFour.find('.frst_title').text(Translate('payments_js/select_staff_count_currensy_period'));
        } else
        if(paymentData.payment_type == "bill_rus") {
          stepFour.find('#noteAlert_3').removeClass('hidden');
          $('#four_step_next_btn').removeClass('hidden');

          stepFour.find('.frst_title').text(Translate('payments_js/select_staff_count'));
        }

      }

      ControlMinusButton();
      RecountTotalAmount();

      helperOpenNextRow(stepFour);
    } else
    if(currentStepObj['four_ent']) {
      let stepFive = target.closest('.processBody').find('.step-five');

      let fileForm = $('#upload_custom_file_form');
      let fileFormBtn = fileForm.find('button.actionButton');
      let fileFormRow1 = fileForm.find('.row').eq(0);
      let fileFormRow2 = fileForm.find('.row').eq(1);

      let editForm = $('#props_edit_form');
      let editFormBtn = editForm.find('button.actionButton');
      let editFormMailLabel = editForm.find('.js_mail').closest('.row').find('h5');

      if(paymentData.residance == 'rus') {

        if(paymentData.payment_type == "card") {
          // file
          fileFormBtn.text(Translate('payment/go_to_payment'));
          fileFormRow2.find('h5').html(Translate('payment/file_invoice_email')+' <span class="star">*</span>');

          // form
          editFormBtn.text(Translate('payment/go_to_payment'));
          editFormMailLabel.html(Translate('payment/file_invoice_email')+' <span class="star">*</span>');
        } else
        if(paymentData.payment_type == "bill_foreign" || paymentData.payment_type == "bill_rus") {
          // file
          fileFormBtn.text(Translate('payments_js/request_contract_invoice'));
          fileFormRow2.find('h5').html(Translate('payments_js/file_invoice_contract_email')+' <span class="star">*</span>');

          // form
          editFormBtn.text(Translate('payments_js/request_contract_invoice'));
          editFormMailLabel.html(Translate('payments_js/file_invoice_contract_email')+' <span class="star">*</span>');
        }

      } else {
        if(paymentData.payment_type == "online_pay") {
          fileFormBtn.text(Translate('payments_js/request_contract_invoice'));
          fileFormRow2.find('h5').html(Translate('payments_js/file_invoice_contract_email')+' <span class="star">*</span>');
        } else {
          fileFormBtn.text(Translate('payment/go_to_payment'));
          fileFormRow2.find('h5').html(Translate('payment/file_invoice_email')+' <span class="star">*</span>');
        }
      }

      if(paymentData.residance == 'rus') {
        if(LangShortCode && LangShortCode == 'en')
        {
          fileFormRow1.find('h5 a').attr('href', '../../files/payment/company_details_rus_en.pdf');
        } else {
          fileFormRow1.find('h5 a').attr('href', '../../files/payment/company_details_rus.pdf');
        }
      } else
      if(paymentData.residance == 'sng') {
        if(LangShortCode && LangShortCode == 'en')
        {
          fileFormRow1.find('h5 a').attr('href', '../../files/payment/company_details_cis_en.pdf');
        } else {
        fileFormRow1.find('h5 a').attr('href', '../../files/payment/company_details_cis.pdf');
        }
      } else
      if(paymentData.residance == 'other') {
        if(LangShortCode && LangShortCode == 'en')
        {
          fileFormRow1.find('h5 a').attr('href', '../../files/payment/company_details_world_en.pdf');
        } else {
        fileFormRow1.find('h5 a').attr('href', '../../files/payment/company_details_world.pdf');
        }
      }

      helperOpenNextRow(stepFive);
    }

  }


  function helperOpenNextRow(target) {
    target.addClass('active').removeClass('hidden');

    if(target.hasClass('step-five')) {

      if(paymentData.residance == 'rus') {
        target.find('.pr_details').removeClass('hidden').slideDown();
      } else {
        target.find('.props-main, .props-form').addClass('hidden').hide();
        target.find('.props-file').removeClass('hidden').slideDown();
        SetTypeProps(target, "props-file")
      }

    } else {
      target.find('.pr_details').removeClass('hidden').slideDown();
    }

    let form = target.find('form');
    if(form.length) {
      form.each(function() {
        CheckFieldsNotEmpty($(this))
      })
    }

  }

}

function SetRowDefaultOnEdit(row) {
  let currentProcessRow = $(row);
  let allProcessRows = $('.processRow');

  let current_i_count = currentProcessRow.attr('data-i-count') ?? null;
  let current_e_count = currentProcessRow.attr('data-e-count') ?? null;

  current_i_count ? current_i_count = Number(current_i_count) : null;
  current_e_count ? current_e_count = Number(current_e_count) : null;


  if( (current_i_count && (current_i_count == 1)) || (current_e_count && (current_e_count == 1)) ) {
    ClearData();
  } else

  if( (current_i_count && (current_i_count == 2)) || (current_e_count && (current_e_count == 2)) ) {
    ClearData(['user']);
  } else

  if( (current_i_count && (current_i_count == 3)) || (current_e_count && (current_e_count == 3)) ) {
    ClearData(['user', 'residance']);
  } else

  if( (current_i_count && (current_i_count == 4)) || (current_e_count && (current_e_count == 4)) ) {
    ClearData(['user', 'residance', 'payment_type']);
  } else

  if( current_i_count && (current_i_count == 4.3) ) {
    ClearData(['user', 'residance', 'payment_type']);
  } else

  if( (current_i_count && (current_i_count == 5)) || (current_e_count && (current_e_count == 5)) ) {
    ClearData(['user', 'residance', 'payment_type', 'payment_info']);
  }

  allProcessRows.each( (i, item) => {
    let i_count = $(item).attr('data-i-count') ?? null;
    let e_count = $(item).attr('data-e-count') ?? null;

    i_count ? i_count = Number(i_count) : null;
    e_count ? e_count = Number(e_count) : null;

    if( i_count && current_i_count && (i_count > current_i_count) ) {
      ClearRow( $(item) )
    }

    if( e_count && current_e_count && (e_count > current_e_count) ) {
      ClearRow( $(item) )
    }

  })

  let propsMain = currentProcessRow.find('.props-main');
  if(propsMain.length) {

    if(paymentData.residance !== 'rus') {
      currentProcessRow.find('.props-main, .props-form').addClass('hidden').hide();
      currentProcessRow.find('.props-file').removeClass('hidden').slideDown();
      SetTypeProps(currentProcessRow, "props-file");
    } else {
      propsMain.removeClass('hidden').show();
      currentProcessRow.find('.props-file, .props-form').addClass('hidden').slideUp();
    }

  }
}

function ClearRow(processRow) {
  processRow.removeClass('done active').addClass('hidden');
  processRow.find('.pr_text .frst_title').fadeIn();
  processRow.find('em').hide();
  processRow.find('.pr_text strong').hide();
  processRow.find('.pr_details').hide();
  processRow.find('.pr_title a').hide();

  let form = processRow.find('form');
  if(form.length) {
    form.each( (i, item) => {
      item.reset();

      let b_submit = $(item).find('button[type="submit"]');
      if(b_submit.length) {
        b_submit.addClass('disabled');
      }
    })
    $('.input_custom_file_block p').text('');
  }

  processRow.find('.selected').removeClass('selected');

  let propsMain = processRow.find('.props-main');
  if(propsMain.length) {
      propsMain.removeClass('hidden').show();
      processRow.find('.props-file, .props-form').addClass('hidden').slideUp();
  }

  let pmntTab = processRow.find('.pmnt-tab-content');
  if(pmntTab.length) {
    pmntTab.addClass('hidden');
  }

  let noteAlert = processRow.find('.noteAlert');
  if(noteAlert.length) {
    noteAlert.addClass('hidden');
  }

  let priceItem = processRow.find('.price a');
  if(priceItem.length) {
    $('.price a:not(.single)').show();
    $('.price a.single').hide();
  }

  let without_w_block = processRow.find('.without_w_block');
  if(without_w_block.length) {
    without_w_block.addClass('hidden');
    $('#four_step_next_btn').addClass('hidden');
  }

  let checkbox = processRow.find('.input--checkbox');
  if(checkbox.length) {
    checkbox.prop('checked', false).trigger('change');
  }

}

function ClearData(exeptionArr) {
  for(let item in paymentData) {
    let noExeptions = true;

    if(exeptionArr && exeptionArr.length) {
      noExeptions = exeptionArr.every( (el) => el !== item)
    }

    if(noExeptions) {
      if(item !== 'payment_info' && item !== 'props') {
        paymentData[item] = null
      } else
      if(item == 'payment_info') {
        paymentData[item] = {
          person_count: null,
          light_person_count: null,
          total_sum: null,
          discount: null,
          period: null,
        }
      } else
      if(item == 'props') {
        paymentData[item] = {
          type: null,
          fields: [],
          file: '',
        }
        if(default_file.length)
        {
            paymentData.props.type = 'props-file'
            paymentData.props.file = default_file;
            paymentData.props.filename = $('.input_custom_file_block p').text();
        }
      }
    }

  }

}

function ActivationFinishStep(target) {
  let curProcessRow = target;
  let t_str = '';

  if(paymentData.user == "individual") {
    t_str = curProcessRow.find('input[name="indiv-name"]').val().trim();

    curProcessRow.find('.pr_details').slideUp();

    curProcessRow.removeClass('active').addClass('done');
    curProcessRow.find('.pr_text .frst_title').hide();
    curProcessRow.find('em').fadeIn();
    curProcessRow.find('.pr_text strong').html(t_str).fadeIn();
    curProcessRow.find('.pr_title a').fadeIn();


    helperOpenFinishStepIndiv_6();

  } else
  if(paymentData.user == "entity") {

    if(paymentData.props.type == "props-file") {
      t_str = Translate('payment_c/document_attached');
    } else
    if(paymentData.props.type == "props-form") {
      t_str = Translate('payment_c/completed_form');
    }

    curProcessRow.find('[class*="props-"]').addClass('hidden').slideUp();

    curProcessRow.removeClass('active').addClass('done');
    curProcessRow.find('.pr_text .frst_title').hide();
    curProcessRow.find('em').fadeIn();
    curProcessRow.find('.pr_text strong').html(t_str).fadeIn();
    curProcessRow.find('.pr_title a').fadeIn();


    if(paymentData.residance == "rus") {

      if(paymentData.payment_type == 'card') {
        helperOpenFinishStep_5();
      } else
      if(paymentData.payment_type == 'bill_foreign') {
        helperOpenFinishStep_6('1-2');
      } else
      if(paymentData.payment_type == 'bill_rus') {
        helperOpenFinishStep_6('2-3');
      }

    } else
    if(paymentData.residance == "sng" || paymentData.residance == "other") {

      if(paymentData.payment_type == 'card') {
        helperOpenFinishStep_5();
      } else
      if(paymentData.payment_type == 'online_pay') {
        helperOpenFinishStep_6('1-2');
      }

    }

  }

  function helperOpenFinishStepIndiv_6() {
    let finishStep = target.parent().find('.step-four');

    finishStep.addClass('active').removeClass('hidden');
    finishStep.find('.pr_details').slideDown();

    finishStep.find('.pr_nmbr').text('6');

    if(paymentData.residance == "rus" && paymentData.payment_type == 'card') {
      $('#pmnt_tab-yav').removeClass('hidden');
    } else {
      $('#pmnt_tab-card').removeClass('hidden');
    }
  }

  function helperOpenFinishStep_5() {
    let finishStep = target.parent().find('.step-four');

    finishStep.addClass('active').removeClass('hidden');
    finishStep.find('.pr_details').slideDown();

    if(paymentData.residance == "rus" && paymentData.payment_type == 'card') {
      $('#pmnt_tab-yav').removeClass('hidden');
    } else {
      $('#pmnt_tab-card').removeClass('hidden');
    }
  }

  function helperOpenFinishStep_6(day_type) {
    let finishStep = target.parent().find('.step-six');

    finishStep.find('.js-final-invoice-email').val(paymentData.email);

    if(day_type) {
      if(day_type == '1-2') {
        finishStep.find('p strong').text(Translate('payment_c/one_two_days'));
      } else
      if(day_type == '2-3') {

      }
    }

    finishStep.addClass('active').removeClass('hidden');
    finishStep.find('.pr_details').slideDown();

    $('.js_link_edit, .pr_details:hidden, [class*="props-"]').remove();

    xajax_CreateCaseRequest(paymentData);
  }

}

function CheckFieldsNotEmpty(form) {
  let retVal = true;
  let fields = form.find('input:not(.not-required)');
  let button = form.find('button[type="submit"]');
  let mail = form.find('.js_mail');

  let allWithText = Array.from(fields).every(function(item) {
      if(item.name == '_csrf_token')
      {
          return true;
      }
      if(item.id == 'input_custom_file'
      && paymentData.props.file.length)
      {
          return true;
      }

      return $(item).val() && $(item).val().trim().length
  })

  if(mail.length && mail.val().length){
    if(ValidEmail(mail.val())) {
      mail.removeClass('error')
    } else {
      mail.addClass('error');
      return false;
    }
  }

  if( allWithText && !( form.find('.error') && form.find('.error').length ) ) {
    button.removeClass('disabled')
  } else {
    button.addClass('disabled');
    retVal = false;
  }

  return retVal;
}

function NewShowSpinButton(element_class) {
	element = typeof element_class == 'string' ? $('.'+element_class) : element_class;
	$(element).parent().width($(element).parent().width());
	$(element).hide();
	$(element).next('span').hide();
	$(element).nextAll('.icon').show().css('display', 'inline-block');
}

function NewHideSpinButton(element_class) {
  element = typeof element_class == 'string' ? $('.'+element_class) : element_class;
	$(element).show();
	$(element).next('span').show();
	$(element).nextAll('.icon').hide();
}

function SuccessPayment() {
    $('.processRow.step-four').removeClass('active').addClass('done');
    $('.pmnt-tab-content').addClass('hidden');
    $('#pmnt_tab-success').removeClass('hidden');
    $('.js_link_edit, .pr_details:hidden, [class*="props-"]').remove();
}

function SetDataToStorage() {
  let doneRow = $('.processRow.done:visible');
  let doneRowObject = {};

  doneRow.each(function(i) {
    let type = $(this).find('.pr_text > em')[0].innerText;
    let typeRes = $(this).find('.pr_text > strong')[0].innerText;
    doneRowObject['step_' + i] = [type, typeRes];
  })

  localStorage.setItem('stepDataStored', JSON.stringify(doneRowObject));
}

function GetDataFromStorage() {
  let storedRowData = JSON.parse(localStorage.getItem('stepDataStored')) || [];
  let html = '';

  if(storedRowData && Object.keys(storedRowData).length === 0 && storedRowData.constructor === Object) {
    return false
  }

  $('#finish_step').removeClass('active');

  let arrayValues = Object.values(storedRowData);

  for(let i = 0; i<arrayValues.length; i++) {
      html += `<li class="processRow done">
                <div class="pr_title">
                  <span class="pr_nmbr">
                    <i class="fas fa-check"></i>
                  </span>
                  <span class="pr_text">
                    <em style="display: inline;">${arrayValues[i][0]}</em>
                    <strong style="display: inline;">${arrayValues[i][1]}</strong>
                  </span>
                </div>
              </li>`;
  }

  $('.processBody').prepend(html);
}

function listener(e) {
  var data = e.data;
  if (data == 'omni_pmkey_ePSuccess') {
    ePsuccess();
  } else if (data == 'omni_pmkey_ePFailed') {
    ePfailed();
  }
}

if (window.addEventListener) {
  window.addEventListener("message", listener);
  SuccessPayment();
} else {
  // IE8
  window.attachEvent("onmessage", listener);
}
