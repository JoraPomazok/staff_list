$(document).ready(function(){

    $('#btn_form_user_pic').click(function () {
        $('#form_thumbnail').click();
        return false
    })

    if( $('#profile_submit').length > 0 ){
        $('#profile_submit').click(function(){
            $error = 0;
            if( $("#form_full_name").val() == '' ){
                $("#form_full_name").addClass("error");
                $("#warning_form_full_name").css("display","block");
                $("#warninfo_form_full_name").html(Translate('profile_c/enter_first_last_name'));
                $error = 1;
            }
            else{
                $("#form_full_name").removeClass("error");
                $("#warning_form_full_name").css("display","none");
            }

            if( $error == 1 ){
                return false;
            }
            else{
                return true;
            }
        });

        $('#form_thumbnail').change(function(){

            // Причешем имя файла
            var file_name = $('#form_thumbnail').val();
            file_name = file_name.split('\\');
            file_name = file_name[file_name.length-1];
            if( file_name.length > 16 ){
                file_name = file_name.substring(0,16)+'...';
            }

            // Выведем название
            $('#uploaded_file').text(file_name);

            $("#div_user_photo").removeClass("error");
        });
    }

    if( $('#pass_submit').length > 0 ){
        $('#pass_submit').click(function(){
            $error = 0;

            if( $("#form_pass_new_first").val() != $("#form_pass_new_second").val() ){
                $("#form_pass_new_first").addClass("error");
                $("#warning_form_pass_new_first").css("display","block");
                $("#warninfo_form_pass_new_first").html(Translate('profile_c/password_mismatch'));
                $error = 1;
            }
            else{
                $("#form_pass_new_first").removeClass("error");
                $("#warning_form_pass_new_first").css("display","none");
            }

            if( $error == 1 ){
                return false;
            }
            else{
                return true;
            }
        });
    }
});

function ResetFormData() {
    $("#form_profile").trigger('reset');
    if( $('#uploaded_file').length > 0 ){
        $('#uploaded_file').text('');
    }
    $("#form_profile > *").removeClass("error");
    $("#form_pass_new_first").removeClass("error");

    return false;
}
