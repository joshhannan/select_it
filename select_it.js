(function($) {
	$.fn.select_it = function( options ) {
		var choices_array = [];
		var count = 0;
		var placeholder, selected, select_check, current, onchange;
		var settings = $.extend({
			onchange: 'none',
			returned_div: 'toggled',
			placeholder: '...'
		}, options );
		$(this).each(function() {
			choices_array = [];
			count++;
			$(this).hide();
			var choices = $(this).html();
			if( $(this).data('placeholder') ) {
				if( $(this).find('option:selected') ) { placeholder = $(this).find('option:selected').text(); } else { placeholder = $(this).data('placeholder'); }
			} else {
				if( $(this).find('option:selected') ) { placeholder = $(this).find('option:selected').text(); } else { placeholder = settings.placeholder; }
			}
			if( $(this).data('onchange') ) { onchange = $(this).data('onchange'); } else { onchange = settings.onchange; }
			$(this).children('option').each(function(index) {
				var choice_value = $(this).val();
				var choice_text = $(this).text();
				choices_array[index] = ['<li rel="'+choice_value+'">'+choice_text+'</li>'];
			});
			choices_array = choices_array.join('\r');
			$(this).after('<div id="select_'+count+'" class="select_it"><div class="select_it_box"><span class="displayed">'+placeholder+'</span><span class="tab"></span></div><ul style="display: none;">'+choices_array+'</ul></div><!--/select_it-->');
			$('.select_it .select_it_box').click(function(e) {
				e.stopImmediatePropagation();
				current = $(this).parents('.select_it').attr('id');
				if( $('#'+current+' .select_it_box').hasClass('open') ) {
					$('.select_it_box').removeClass('open');
					$('.select_it ul').hide();
				} else {
					$('.select_it_box').removeClass('open');
					$('.select_it ul').hide();
					$('#'+current+' .select_it_box').addClass('open');
					$('#'+current+' ul').show();
				}
			});
			$('.select_it ul li').click(function(e) {
				e.stopImmediatePropagation();
				current = $(this).parents('.select_it').attr('id');
				$('#'+current+' ul li').removeClass('selected');
				$('#'+current+' ul').hide();
				selected = $(this).attr('rel');
				selected_text = $(this).html();
				$(this).addClass('selected');
				$(this).parents('#'+current).prev('select').find('option').each(function() {
					select_check = $(this).val();
					if( select_check == selected ) {
						$(this).parents('select').find('option').removeAttr('selected');
						$(this).attr('selected', 'selected');
					}
				});
				$('#'+current).children('.select_it_box').removeClass('open');
				$('#'+current+' .select_it_box .displayed').html(selected);
				$('#'+current+' .select_it_box .displayed').html(selected_text);
				if( onchange == 'toggle' ) {
					var toggled = $(this).attr('rel');
					$('.'+settings.returned_div).hide();
					$('#'+settings.returned_div+'_'+toggled).show(200);
				}
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