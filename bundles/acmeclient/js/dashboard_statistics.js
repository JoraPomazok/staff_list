$(document).ready(function(){
    xajax_ViewDashboardStatistics(1);

	$('.s_filter a').click(function(e){
        e.preventDefault();
        $('.s_filter a').removeClass('active');
        $(this).addClass('active');
        $('.s_filter_period').html($(this).html());

        ShowSpinLazy();
        xajax_ViewDashboardStatistics( Number($(this).html().replace(/\D+/g,"")) );
    });
});

function ShowSpinLazy() {
	$('#spin_lazy').show();
}

function HideSpinLazy() {
	$('#spin_lazy').hide();
}