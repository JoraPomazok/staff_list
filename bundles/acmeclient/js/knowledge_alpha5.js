// JavaScript Document

(function($){

    $(function(){
        $('.formFooter').each(function(index, element) {
            var fieldNum = $(this).prevAll('.fields').length;
            var rows = parseInt(fieldNum / 2);
            if (fieldNum % 2 == 0) {
//                $(this).css('padding-top', (rows * 130 + 15) + 'px');
            } else {
                //$(this).css('padding-top', (rows * 62 + 25) + 'px');
                //$(this).parent('.fieldsBlock').addClass('m0');
            }
            if ($(this).parents('#alpha5_all_lang').length){
                $(this).css('padding-top', '0');
            }
        });
    });

    $(function(){
        $('.alpha5_header').on('click', function(){
            $(this).next().toggle();
            if (($(this).attr('data-cond') == 'enabled')||(!$(this).attr('data-cond'))) {
                $(this).attr('data-cond', 'disabled');
                $(this).children('span').html('<i class="icon fas fa-angle-right"></i>');
                $(this).addClass("-active")
            } else {
                $(this).attr('data-cond', 'enabled');
                $(this).children('span').html('<i class="icon fas fa-angle-down"></i>');
                $(this).removeClass("-active")
            }
        });

        $('.-js-slide_elements').on('click', function(){

            var s=$(this).attr('data_slice');
            $(this).attr('data_slice',s==1?0:1);
            t=$(this).attr('data-alttitle');$(this).attr('data-alttitle',$(this).text());$(this).text(t);

            if (s==0) {
                $('.alpha5_header').next().hide()
                $('.alpha5_header').attr('data-cond', 'disabled');
                $('.alpha5_header').children('span').html('<i class="fas fa-angle-right" style="color:#2d9cdb;"></i>');
                $('.alpha5_header').css('border-bottom', '1px solid #e9ebed');
                $('.alpha5_header').addClass("-active")
            } else {
                $('.alpha5_header').next().show()
                $('.alpha5_header').attr('data-cond', 'enabled');
                $('.alpha5_header').children('span').html('<i class="fas fa-angle-down"></i>');
                $('.alpha5_header').css('border-bottom', 'none');
                $('.alpha5_header').removeClass("-active")
            }
        });

    });

    $(function(){
        $('.alpha5_lang a').on('click', function(){
            $(this).parent().children().removeClass('active');
            $(this).addClass('active');
            var langLink = $(this).attr('href');
            $('#alpha5_all_lang').children().hide();
            $('#alpha5_all_lang ' + langLink).show();
        });
        /*$('.form-element input').on('change', function(){
                var parent = $(this).parents('.article-edit-cont').children('.knowledge-submit-form');
                parent.find('input').val('Опубликовать статью');
        });
        $('.entry .fields .form-it').on('change', function(){
                var parent = $(this).parents('.entry').children('.formFooter');
                parent.find('input').val('Опубликовать статью');
        });*/
    });

})(jQuery)
