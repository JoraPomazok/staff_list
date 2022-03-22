$(document).ready(function() {
   $(document).on('click', '.btn-mark', function() {
    	var btn_that = $(this);
		var lw_item = btn_that.closest('.lw_item');
		if(!lw_item.hasClass("fllw_off")){
			if(btn_that.hasClass("btn-activated")){
				//удаляет звезду если она уже есть
				if(!btn_that.hasClass("no-remove")) {
					btn_that.removeClass('btn-activated');
					StarRecord(btn_that, 0);
				}
			} else {
				var allow_add_star = true;
				
				var t1 = lw_item.find('.t1').first();
				if(t1 && t1.hasClass('empty-email-data')) {
					allow_add_star = false;
				}
				if(allow_add_star) {
					//выставляет звезду другому элементу
					$('.btn-mark').removeClass('btn-activated');
					btn_that.addClass('btn-activated');
					StarRecord(btn_that, 1);
					// Не нужно навешивать класс во "ВКонтакте"
					if (this.closest('.vklist')) { return }
					if(btn_that.hasClass("no-remove")) {
						$('.lw_item').removeClass('b_star');
						btn_that.closest('.lw_item').addClass('b_star');
					}
				}
			}
		}
		return false;
	});
});
