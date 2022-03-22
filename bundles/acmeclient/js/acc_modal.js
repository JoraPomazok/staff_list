$(window).on('load',function(){
		$('.mdl_opaco, .mdl_popup').removeClass('hidden');
		$.fn.pp_alignCenter();
	});

$.fn.pp_alignCenter = function() {
    
      var marginLeft =  - $('.mdl_popup').width()/2 + 'px';
    
      var marginTop =  - $('.mdl_popup').height()/2 + 'px';
    
      return $('.mdl_popup').css({'margin-left':marginLeft, 'margin-top':marginTop});
   };


$().ready(function() {
    $('.acc_nav a').on('click', function(){
			if($(this).is(':first-child')){
					$('.acc_nav a').removeClass('active');
					$('.acc_step2').removeClass('acc_open');
					$(this).addClass('active');
					$('.acc_step1').addClass('acc_open');
				}
			else{
					$('.acc_nav a').removeClass('active');
					$('.acc_step1').removeClass('acc_open');
					$(this).addClass('active');
					$('.acc_step2').addClass('acc_open');
				}
			return false;
		});
	
	$('.acc_step1 .btn').click(function(){
			$('.acc_step1').removeClass('acc_open');
			$('.acc_step2').addClass('acc_open');
			$('.acc_nav a').addClass('active');
			$('.acc_nav a').first().removeClass('active');
			
		  	return false;
		});
	
	$('.mdl_popup .popupClose, .acc_step2 .btn').click(function(){$('.mdl_opaco, .mdl_popup').addClass('hidden');return false;})
});