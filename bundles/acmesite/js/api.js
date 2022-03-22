$(document).ready(function(){
	// Bind to State Change
	if(undefined!=History&&History.enabled) {
		History.Adapter.bind(window,'statechange', function(){
			var State=History.getState();
			var active_menu = State.data.active_menu;
			if(active_menu!=api_active_menu) {
				api_active_menu = active_menu;
				DisplayApiPage();
			}
		});
	}
	
	// Первончачальное состояние
	DisplayApiPage(api_active_menu);
	
	// Плагин для отображения кода
	$("pre.curl").snippet("xml",{menu:false, showNum:false, style:""});
	$("pre.request").snippet("javascript",{menu:false, showNum:false, style:"bright"});
	$("pre.reply").snippet("javascript",{menu:false, showNum:false, style:"bright"});

	// Поведения
	$(document).on('click', '.menu h2', function(){
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
			$(this).find('i').removeClass('fa-angle-right').addClass('fa-angle-down');
			$(this).siblings('h2').removeClass('active');
			$(this).siblings('h2').find('i').removeClass('fa-angle-down').addClass('fa-angle-right');
			$(this).siblings('ul').slideUp(400);
			$(this).next().slideDown(400);
		}
	});
	$(document).on('click', '.menu ul li a', function(e){
		e.preventDefault();
		if($(this).attr('data-target')!=api_active_menu) {
			api_active_menu = $(this).attr('data-target');
			DisplayApiPage();
		}
	});
	$(function(){
		var maxMenuHeight = 0, maxListHeight = 0;
		$(window).on('load', function(){
			$('.menu h2').each(function(index, element) {
				var height = $(element).outerHeight(true);
				maxMenuHeight += height;
			});
			$('.menu ul').each(function(index, element) {
				var height = $(element).outerHeight(true);
				if (height > maxListHeight) maxListHeight = height;
			});
			maxMenuHeight += maxListHeight - 1;
			$('#content_inner').css('min-height', maxMenuHeight);
		});
	});
})

function DisplayApiPage() {
	var active_li_a = $("[data-target='"+api_active_menu+"']");
	if(active_li_a.length==0) {
		active_li_a = $("[data-target='introduction_intro']");
		api_active_menu = 'introduction_intro';
	}
	$(".article").hide();
	$(".menu ul").hide();
	$('.menu ul li a').removeClass('active');
	$('.menu h2').removeClass('active');
	$('.menu h2 i.fa').removeClass('fa-angle-down').addClass('fa-angle-right');
	
	active_li_a.addClass('active');
	
	var active_ul = active_li_a.closest('ul');
	active_ul.show();
	var active_h2 = active_ul.prev('h2');
	active_h2.addClass('active');
	active_h2.find('i').addClass('fa-angle-down');
	$(".article[data-id='"+api_active_menu+"']").show();
	
	//проверяем, если браузер поддерживает html5
	var test_canvas = document.createElement("canvas") //try and create sample canvas element
	if (test_canvas.getContext) {
		var href = active_li_a.attr('href');
		var stateObj = { active_menu: api_active_menu };
		var state_title = 'Omnidesk - '+active_li_a.text();
		History.pushState(stateObj, state_title, href);
	}
}