(function($) {
	$.fn.select_it = function( options ) {
		var choices_array = [];
		var count = 0;
		var placeholder, selected, select_check, current, onchange;
		var settings = $.extend({
			onchange: 'none',
			placeholder: '...'
		}, options );
		$(this).each(function() {
			choices_array = [];
			count++;
			$(this).hide();
			var choices = $(this).html();
			if( $(this).data('placeholder') ) { placeholder = $(this).data('placeholder'); } else { placeholder = settings.placeholder; }
			if( $(this).data('onchange') ) { onchange = $(this).data('onchange'); } else { onchange = settings.onchange; }
			$(this).children('option').each(function(index) {
				var choice_value = $(this).val();
				var choice_text = $(this).text();
				choices_array[index] = ['<li rel="'+choice_value+'">'+choice_text+'</li>'];
			});
			choices_array = choices_array.join('\r');
			$(this).after('<div id="select_'+count+'" class="select_it"><div class="select_it_box"><span class="displayed">'+placeholder+'</span><span class="tab"></span></div><ul style="display: none;">'+choices_array+'</ul></div><!--/select_it-->');
			$('.select_it .select_it_box').click(function(e) {
				e.stopPropagation();
				if( $(this).hasClass('open') ) {
					$(this).removeClass('open');
					current = $(this).parents('.select_it').attr('id');
					$('#'+current+' ul').hide();
				} else {
					$(this).addClass('open');
					current = $(this).parents('.select_it').attr('id');
					$('#'+current+' ul').show();
				}
			});
			$('.select_it ul li').click(function(e) {
				e.stopPropagation();
				current = $(this).parents('.select_it').attr('id');
				$('#'+current+' ul li').removeClass('selected');
				$('#'+current+' ul').hide();
				selected = $(this).attr('rel');
				selected_text = $(this).html();
				$(this).addClass('selected');
				$(this).parents('.select_it').prev('select').find('option').each(function() {
					select_check = $(this).val();
					if( select_check == selected ) {
						console.log(select_check);
						$('select').find('option').removeAttr('selected');
						$(this).attr('selected', 'selected');
					}
				});
				$('#'+current).children('.select_it_box').removeClass('open');
				$('#'+current+' .select_it_box .displayed').html(selected);
				$('#'+current+' .select_it_box .displayed').html(selected_text);
				if( onchange == 'submit' ) {
					$(this).parents('form').submit();
				}
			});
		});
		$(document).click(function() {
			$('.select_it .select_it_box').removeClass('open');
			$('.select_it ul').hide();
		});
		return this;
	}; //  END SELECT_IT FUNCTION
}(jQuery));