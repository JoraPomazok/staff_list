var payment_month = 0;
var payment_amount = 0;
var selected_purse = 'purse_e';
var zero_price_staff = 0;
var min_basic_staff_number = 0;
var min_light_staff_number = 0;
var payment_basic_staff = 0;
var payment_light_staff = 0;

$(document).ready(function () {
  if ('undefined' != typeof (staff_price_1)) {
    if (staff_price_1 == 0) {
      zero_price_staff = price1_limit;
    }
    var min_staff_number = Math.max((zero_price_staff + 1), active_staff_nr);
    
    min_light_staff_number = light_staff_nr;
    min_basic_staff_number = Math.max((min_staff_number - light_staff_nr), 1);
    
    payment_basic_staff = min_basic_staff_number;
    payment_light_staff = min_light_staff_number;
    
    if (light_staff_nr) {
      var qty_basic = min_basic_staff_number;
      var qty_basic_title = basic_staff_nr_titles[qty_basic];
      $('.n_qty .qty_basic').text(qty_basic);
      $('.n_qty .qty_basic_title').text(qty_basic_title);
      
      var qty_light = light_staff_nr;
      var qty_light_title = light_staff_nr_titles[qty_light];
      $('.n_qty .qty_light').text(qty_light);
      $('.n_qty .qty_light_title').text(qty_light_title);
      $('.wn').text(min_basic_staff_number + ' + ' + light_staff_nr);
    } else {
      $('.n_qty').text(min_basic_staff_number);
      $('.wn').text(min_basic_staff_number);
    }
  }
  
  //payment process
  $('.processBody li:first-child').addClass('active');
  $('.processBody li:first-child').find('.pr_details').slideDown();
  $('.processRow .twoBlock a').click(function () {
    var t_str = $(this).find('.t_twin').text();
    $('.processRow .twoBlock a').removeClass('selected');
    $(this).addClass('selected');
    $(this).closest('.processRow').next().addClass('active');
    $(this).closest('.processRow').removeClass('active').addClass('done');
    $(this).closest('.pr_details').slideUp();
    $(this).closest('.processRow').next().find('.pr_details').slideDown();
    $(this).closest('.processRow').find('.pr_text .frst_title').hide();
    $(this).closest('.processRow').find('em').fadeIn();
    $(this).closest('.processRow').find('.pr_text strong').html(t_str).fadeIn();
    $(this).closest('.processRow').find('.pr_title a').fadeIn();
    return false;
  });
  
  $('.pr_title a').click(function () {
    $('.pr_details').slideUp();
    $(this).closest('.processRow').removeClass('done').addClass('active').find('.pr_details').slideDown();
    $('.paymentDone').slideUp();
    return false;
  });
  
  if ('undefined' != typeof (staff_price_1)) {
    ControlMinusButton();
    RecountTotalAmount();
  }
  
  if ('undefined' != typeof (staff_price_1)) {
    $('.w_qty .plus').on('click', function () {
      var type_rel = $(this).attr('rel');
      incrementValue(1, type_rel);
    });
    
    $('.w_qty .minus').on('click', function () {
      var type_rel = $(this).attr('rel');
      incrementValue(-1, type_rel);
    })
  }
  
  $('.processRow .price a').click(function () {
    $('.processRow .price a').removeClass('selected');
    $(this).addClass('selected');
    $(this).closest('.processRow').next().addClass('active');
    $(this).closest('.processRow').removeClass('active').addClass('done');
    $(this).closest('.pr_details').slideUp();
    $(this).closest('.processRow').next().find('.pr_details').slideDown();
    $(this).closest('.processRow').find('.pr_title a').fadeIn();
    $(this).closest('.processRow').find('.pr_text .frst_title').hide();
    $(this).closest('.processRow').find('em').fadeIn();
    $(this).closest('.processRow').find('.pr_text strong').fadeIn();
    
    RecountTotalAmount();
    return false;
  });
  
  $('.method li a').click(function () {
    var t_arrt = $(this).attr("title");
    $(this).closest('.processRow').next().addClass('active');
    $(this).closest('.processRow').removeClass('active').addClass('done');
    $(this).closest('.pr_details').slideUp();
    $(this).closest('.processRow').next().find('.pr_details').slideDown();
    $(this).closest('.processRow').find('.pr_text .frst_title').hide();
    $(this).closest('.processRow').find('em').fadeIn();
    $(this).closest('.processRow').find('.pr_text strong').fadeIn().html(t_arrt);
    $(this).closest('.processRow').find('.pr_title a').fadeIn();
    return false;
  });
  
  $('.processRow .actionButton').click(function () {
    var selected_method_rel = $('.method li.selected').attr('rel');
    
    if (selected_method_rel == 'webmoney') {
      $('#webmoney_amount').val(payment_amount);
      $('#webmoney_month_nr').val(payment_month);
      if (payment_light_staff) {
        $('#webmoney_staff_nr').val(payment_basic_staff + ' + ' + payment_light_staff);
      } else {
        $('#webmoney_staff_nr').val(payment_basic_staff);
      }
      $('#webmoney_desc').val(description_base64_arr[payment_month]);
      
      $('#webmoney_form').trigger('submit');
    }
    /*
    var getPaymentPic = $(this).closest('.pmnt-tab-content').find('.methodChoice').html();
    $('.paymentDone').show();
    $('.pmnt-tab-content').hide();
    $('.paymentDone .methodChoice').html(getPaymentPic);
    $(this).closest('.processRow').removeClass('active').addClass('done');
    $(this).closest('.processRow').find('.pr_text .frst_title').hide();
    $(this).closest('.processRow').find('em').fadeIn();
    */
    return false;
  });
  
  $('.wm_pmnt').click(function () {
    $('.wm_pmnt').removeClass('active');
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
    RecountTotalAmount();
    
    return false;
  });
  
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
    $('a.wm_pmnt').removeClass('active');
    $('a.wm_pmnt[rel=' + selected_purse + ']').addClass('active');
    $('#webmoney_purse').val(webmoney_purse);
    
    RecountTotalAmount();
    
    
    switch_tabs($(this));
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
  // $('.cardpayments_btn').click(function(e) {
  //     if($(this).hasClass('disabled'))
  //     {
  //         return false;
  //     }
  //     var self = this;
  //     $(this).html('<i class="fa fa-spinner fa-spin"></i>').addClass('disabled');
  // 	e.preventDefault();
  //     if(payment_light_staff) {
  //         var payment_staff = payment_basic_staff+' + '+payment_light_staff;
  //     }
  //     else {
  //         var payment_staff = payment_basic_staff;
  //     }
  //
  //     $.ajax({
  //
  //         type: "POST",
  //         url: ep_get_link_url,
  //         data: { // options
  //             description: description_arr[payment_month],
  //             amount: payment_amount,
  //             payment_staff: payment_staff,
  //             payment_month: payment_month,
  //             b_epayment_wallet : $(this).parent().parent().attr('id') == 'pmnt_tab-6' ? 1 : 0,
  //             b_save_card       : $(this).parent().parent().find('.b_recciring_pay input:checked').length ? 1 : 0
  //         },
  //         success: function (res) {
  //             if(res.integrationType == 'redirect')
  //             {
  //                 window.open(res.url, 'ePayments', 'menubar=no,location=yes,resizable=no,scrollbars=no,status=yes,width=800px,height=800px');
  //     //            window.location = res.url;
  //             }
  //             else if(res.integrationType == 'iframe')
  //             {
  //                 $(self).parent().hide();
  //                 $(self).parent().parent().find('.iframe_result').html('<iframe class="'+(res.gatewayId == 2 ? 'epayment' : '')+'" src="'+res.url+'"/>').show();
  //
  //             }
  //
  //
  //         },
  //     });
  // })
  $('.yakassapayments_btn').click(function (e) {
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
    
    $.ajax({
      
      type: "POST",
      url: ya_get_link_url,
      data: { // options
        description: description_arr[payment_month],
        amount: payment_amount,
        payment_staff: payment_staff,
        payment_month: payment_month,
        b_epayment_wallet: $(this).parent().parent().attr('id') == 'pmnt_tab-6' ? 1 : 0,
        b_save_card: $(this).parent().parent().find('.b_recciring_pay input:checked').length ? 1 : 0
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
        
        
        window.open(url, 'Яндекс.Касса', 'menubar=no,location=yes,resizable=no,scrollbars=no,status=yes,width=800px,height=800px');
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

        $.ajax({

            type: "POST",
            url: stripe_get_link_url,
            data: { // options
                description: description_arr[payment_month],
                amount: payment_amount,
                payment_staff: payment_staff,
                payment_month: payment_month,

                b_save_card: $(this).parent().parent().find('.b_recciring_pay input:checked').length ? 1 : 0
            },
            success: function (res) {
                console.log(res);
                if (!res.id) {
                    return;
                }

                var stripe = Stripe(res.pkey);
                stripe.redirectToCheckout({sessionId: res.id});



            },
        });
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
    e.preventDefault();
  })
  // $('#cardpayments_btn').click(function(e) {
  //     if($(this).hasClass('disabled'))
  //     {
  //         return false;
  //     }
  // 	e.preventDefault();
  // 	var payments = new cp.CloudPayments();
  //     if(payment_light_staff) {
  //         var payment_staff = payment_basic_staff+' + '+payment_light_staff;
  //     }
  //     else {
  //         var payment_staff = payment_basic_staff;
  //     }
  // 	payments.charge(
  // 		{ // options
  // 			publicId: 'pk_5bea9b7005ccf2220f671359286d7',
  // 			description: description_arr[payment_month],
  // 			amount: payment_amount,
  // 			currency: 'USD',
  // 			invoiceId: ClientId,
  // 			data: {
  // 				payment_staff: payment_staff,
  // 				payment_month: payment_month,
  // 				client_id: ClientId
  // 			}
  // 		},
  // 		cp_success_url,
  // 		function (reason, options) { // fail
  // 			ShowXajaxNotification('PAYMENT_FAILED');
  // 		}
  // 	);
  // })
});

function switch_tabs(obj) {
  $('.pmnt-tab-content').hide();
  $('.method li').removeClass("selected");
  var id = obj.attr("rel");
  
  $('#' + id).show();
  obj.parent().addClass("selected");
}

function incrementValue(increment, type_rel) {
  if (type_rel) {
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
    w_value.text(payment_basic_staff + ' + ' + payment_light_staff);
  } else {
    var valueElement = $('.n_qty');
    var w_value = $('.wn');
    var new_staff_nr = Math.max(parseInt(valueElement.text()) + increment, min_basic_staff_number);
    
    valueElement.text(new_staff_nr);
    w_value.text(new_staff_nr);
    
    payment_basic_staff = new_staff_nr;
  }
  RecountTotalAmount();
  ControlMinusButton();
  return false;
}

function ControlMinusButton() {
  if (light_staff_nr) {
    var basic_minus = $('.qty_basic').parents('.qty_small').find('.staff_minus_btn');
    var light_minus = $('.qty_light').parents('.qty_small').find('.staff_minus_btn');
    
    if (payment_basic_staff <= min_basic_staff_number) {
      basic_minus.addClass('disabled-minus-btn');
    } else {
      basic_minus.removeClass('disabled-minus-btn');
    }
    
    if (payment_light_staff <= min_light_staff_number) {
      light_minus.addClass('disabled-minus-btn');
    } else {
      light_minus.removeClass('disabled-minus-btn');
    }
  } else {
    if (payment_basic_staff <= min_basic_staff_number) {
      $('#staff_minus_btn').addClass('disabled-minus-btn');
    } else {
      $('#staff_minus_btn').removeClass('disabled-minus-btn');
    }
  }
}

function RoundPrice(price, ignore_currency) {
  if (ignore_currency) {
    price = Math.round(price * 10) / 10;
  } else {
    price = currency_symbol + Math.round(price * 10) / 10;
  }
  
  return price;
}

function GetPriceByMonth(price, month_nr) {
  if (month_nr > 1) {
    var sale = month_nr * discount / 12;
  } else {
    var sale = 0;
  }
  var cost = price * month_nr * (1 - sale / 100);
  return cost;
}

function RecountTotalAmount() {
  var total_payment_staff = payment_basic_staff + payment_light_staff;
  var checkout_basic_staff = payment_basic_staff;
  var checkout_light_staff = payment_light_staff;
  if (zero_price_staff) {
    if (zero_price_staff > payment_basic_staff) {
      checkout_basic_staff = 0;
      checkout_light_staff = checkout_light_staff - (zero_price_staff - payment_basic_staff);
    } else {
      checkout_basic_staff = payment_basic_staff - zero_price_staff;
    }
    var basic_price = staff_price_2;
  } else {
    if (total_payment_staff > price1_limit) {
      var basic_price = staff_price_2;
    } else {
      var basic_price = staff_price_1;
    }
    
  }
  
  var payment_per_month = checkout_basic_staff * basic_price + checkout_light_staff * staff_light_price;
  
  $('#price_1').html(RoundPrice(GetPriceByMonth(payment_per_month, 1)));
  $('#price_3').html(RoundPrice(GetPriceByMonth(payment_per_month, 3)));
  $('#price_6').html(RoundPrice(GetPriceByMonth(payment_per_month, 6)));
  $('#price_12').html(RoundPrice(GetPriceByMonth(payment_per_month, 12)));
  
  var month_nr = 0;
  
  var selected_price_row = $('.processRow .price a.selected');
  var selected_price_rel = selected_price_row.attr('rel');
  if (selected_price_rel) {
    month_nr = selected_price_rel.replace('price_', '');
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
  
  if (month_nr > 0) {
    var pay_amount = selected_price_row.find('strong').text();
    var pay_time = selected_price_row.find('span').last().text();
    $('.res_pmnt').text(pay_amount + ' за ' + pay_time).fadeIn();
  }
  
  payment_amount = result_price;
  payment_month = month_nr;
  var cd = $('.paymentDay .ai_nmbr:first').text().split('.');
  var str = 'err';
  if (cd.length == 3) {
    var d = new Date(parseInt(cd[2]), parseInt(cd[1]) - 1 + parseInt(month_nr), parseInt(cd[0]) - 1);
    str = ((d.getDate() + 1) < 10 ? '0' : '') + d.getDate() + '.' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1) + '.' + d.getFullYear() + ', ' + payment_basic_staff + ' обычных' + (payment_light_staff ? ' и ' + payment_light_staff + ' легких' : '') + ' сотрудников, ' + result_price + currency_symbol + (GetDiscount(month_nr) ? ' с учетом скидки ' + GetDiscount(month_nr) + '%' : '');
  }
  
  $('#ep_reccuring_pay_label').html(str);
}

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

function ePdefault() {

}

function ePsuccess() {
  _parent = $('.m_description:not(:hidden)').parent();
  $('.m_description:not(:hidden)').hide();
  $('.js_link_edit').hide();
  $('.iframe_result').hide();
  $('.btn_footer:not(:hidden)').hide();
  // $(_parent).find('.paymentDoneNew').removeClass('hidden')
  $('.paymentDoneNew').removeClass('hidden')
}

function ePfailed() {
  _parent = $('.m_description:not(:hidden)').parent();
  $('.m_description:not(:hidden)').hide();
  $('.btn_footer:not(:hidden)').hide();
  $('.js_link_edit').hide();
  $('.iframe_result').hide();
  // $(_parent).find('.paymentFailedNew').removeClass('hidden')
  $('.paymentFailedNew').removeClass('hidden')
  
}

function OnOffExt(el, b_enable) {
  if (b_enable) {
    $('.processBody').addClass('hidden');
  } else {
    $('.processBody').removeClass('hidden');
  }
  
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
} else {
  // IE8
  window.attachEvent("onmessage", listener);
}
