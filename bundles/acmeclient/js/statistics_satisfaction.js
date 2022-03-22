$(document).ready(function(){

    is_already_enable_blocks = false;

    if( typeof no_stat !== "undefined" && no_stat == true ){
        NoInformation('no_stat');
    }
    else{
        if( notes_on_page == 0 ){
            perfect = 0;
            good = 0;
            weak = 0;
            NoInformation('no_info');
        }
        else{
            // $('input [name="perfect"]').iCheck('check');
            // $('input [name="good"]').iCheck('check');
            // $('input [name="weak"]').iCheck('check');
            
            $('input [name="perfect"]').checked = true
            $('input [name="good"]').checked = true
            $('input [name="weak"]').checked = true
            
            ChangeBlocksPercent(json_blocks);

            perfect = 1;
            good = 1;
            weak = 1;

            SetHandlers();
        }
        
        $('.select-box').on('change', function(){
            $('.empty, .empty .no_stat, .empty .no_info').hide();

            perfect = 1;
            good = 1;
            weak = 1;
            var f_period = $('#f_period').val();
            var f_staff = $('#f_staff').val();
            xajax_ChangeStatData(f_period, f_staff);
        });

        $(document).on('click', '.show_more', function(e) {
            e.preventDefault();
            ChangeNotesList('show_more');
        });
    }
    InitNanoScrolls('');
});

function SetHandlers(){
    if( !is_already_enable_blocks ){
        BlockInitialisation();
        is_already_enable_blocks = true;
    }
}

function BlockInitialisation(){
    $(document).on('click', '.rating > div', function(event) {
        $(this).toggleClass('active');
        
        if (event.target.tagName === "INPUT") {
            if ( this.checked == true ) {
                this.checked = false
            } else {
                this.checked = true
            }
        } else {
            if ( this.querySelector('input').checked == true ) {
                this.querySelector('input').checked = false
            } else {
                this.querySelector('input').checked = true
            }
        }
        
        if ($(this).hasClass('perfect')){
            if (perfect == 0) {perfect = 1} else perfect = 0;
        }
        if ($(this).hasClass('good')){
            if (good == 0) {good = 1} else good = 0;
        }
        if ($(this).hasClass('weak')){
            if (weak == 0) {weak = 1} else weak = 0;
        }
        ChangeNotesList('filter_notes');
    });
    
    // $(document).on('click', '.rating input', function() {
    //
    //
    //     $(this).parents('div').toggleClass('active');
    //     if ($(this).parents('div').hasClass('perfect')){
    //         if (perfect == 0) {perfect = 1} else perfect = 0;
    //     }
    //     if ($(this).parents('div').hasClass('good')){
    //         if (good == 0) {good = 1} else good = 0;
    //     }
    //     if ($(this).parents('div').hasClass('weak')){
    //         if (weak == 0) {weak = 1} else weak = 0;
    //     }
    //
    //     // Заменяем START
    //     if ( this.checked == true ) {
    //         this.checked = false
    //     } else {
    //         this.checked = true
    //     }
    //     // Заменяем END
    //
    //     ChangeNotesList('filter_notes');
    // });

    $(document).on('click', '.answer_quality .worker a', function(e) {
        e.preventDefault();
        var staff_id = $(this).parent('.worker').data('staff');
        var staff_code = 'staff_'+staff_id;
        $('#f_staff option').each(function(index, element) {
            if ($(element).val() == staff_code) {
                $(element).attr('checked', 'true');
                $('#f_staff.select-box').val(staff_code);
                $('#f_staff.select-box').trigger('choices');
            }
        });

        var f_period = $('#f_period').val();
        xajax_ChangeStatData(f_period, staff_code);
    });
}

function GetClassIcon( percent ){
    var icon_level = '';
    if( percent == '-' ){
        icon_level = 'no_trend';
    }
    else{
        icon_level = 'no_trend';
        if( percent > 0 ){
            icon_level = 'fas fa-level-up-alt positive_trend';
        }
        if( percent < 0 ){
            icon_level = 'fas fa-level-down-alt negative_trend';
        }
    }
    return icon_level;
}
function GetPercentView( percent ){
    var number_view = '';
    if( percent == '-' ){
        number_view = 0;
    }
    else{
        number_view = Math.abs(percent);
    }
    return number_view;
}

// Отображение изменения общих данных и процентов
function ChangeBlocksPercent( json_data ){
    // $('.rating input').iCheck('enable');
    // $('.rating input').iCheck('check');
    
    let input = document.querySelectorAll(".rating input")
    
    input.forEach(element => {
        element.disabled = false
        element.checked = true
    })
    
    $('.rating > div').addClass('active');
    $('.rating .perfect h2').html('<span class="number">'+json_data.cnt_perfect+'%</span><span class="count">('+json_data.cnt_perfect_num+')</span><span class="icon '+GetClassIcon(json_data.percent_perfect)+'"><i>'+GetPercentView(json_data.percent_perfect)+'%</i></span>');
    $('.rating .good h2').html('<span class="number">'+json_data.cnt_good+'%</span><span class="count">('+json_data.cnt_good_num+')</span><span class="icon '+GetClassIcon(json_data.percent_good)+'"><i>'+GetPercentView(json_data.percent_good)+'%</i></span>');
    $('.rating .weak h2').html('<span class="number">'+json_data.cnt_weak+'%</span><span class="count">('+json_data.cnt_weak_num+')</span><span class="icon '+GetClassIcon(json_data.percent_weak)+'"><i>'+GetPercentView(json_data.percent_weak)+'%</i></span>');
}

function ChangeNotesList( change_type ){
    var check_note = { perfect : perfect, good : good, weak : weak };
    var json_data = JSON.stringify({ check_note: check_note, notes_on_page: notes_on_page });

    var f_period = $('#f_period').val();
    var f_staff = $('#f_staff').val();
    xajax_ChangeNotesList( f_period, f_staff, json_data, change_type );
}

function ClearNotesTableData(){
    notes_on_page = 0;
    $(".answer_quality tbody").html('');
    $(".answer_quality").hide();
    $(".show_more").hide();
}
