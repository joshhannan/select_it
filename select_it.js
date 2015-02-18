(function($) {
	$.fn.select_it = function( options ) {
		var choices_array = [];
		var count = 0;
		var key_check;
		$(this).each(function() {
			if( $(this).parent('form') ) {
				var element_count = $(this).parent('form').children().length;
				element_count = '';
			}
			choices_array = [];
			count++;
			var placeholder, selected, select_check, current, onchange, tabindex;
			var settings = $.extend({
				onchange: 'none',
				onchange_url:  'gallery_ajax.php',
				onchange_container: '.gallery .carousel.block',
				returned_div: 'toggled',
				placeholder: '...',
				tabindex: 0
			}, options );
			var option_count = 0;
			$(this).hide();
			var choices = $(this).html();
			if( $(this).attr('tabindex') ) { tabindex = $(this).attr('tabindex'); } else { tabindex = settings.tabindex; }
			if( $(this).data('placeholder') ) { placeholder = $(this).data('placeholder'); } else { placeholder = settings.placeholder; }
			$(this).find('option').each(function() { option_count++; if( option_count != 1 && $(this).is(':selected') ) { placeholder = $(this).text(); } });
			if( $(this).data('onchange') ) { onchange = $(this).data('onchange'); } else { onchange = settings.onchange; }
			$(this).children('option').each(function(index) {
				var choice_value = $(this).val();
				var choice_text = $(this).text();
				choices_array[index] = ['<li rel="'+choice_value+'">'+choice_text+'</li>'];
			});
			choices_array = choices_array.join('\r');
			$(this).after('<div id="select_'+count+'" class="select_it"><div class="select_it_box" tabindex="'+tabindex+'"><span class="displayed">'+placeholder+'</span><span class="tab"></span></div><ul style="display: none;">'+choices_array+'</ul></div><!--/select_it-->');
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
			$('.select_it .select_it_box').keydown(function(e) {
				e.stopImmediatePropagation();
				current = $(this).parents('.select_it').attr('id');
				if( e.keyCode == 40 ) {
					$('#'+current+' .select_it_box').addClass('open');
					//$('#'+current+' ul').show();
					key_check = 0;
					$('.select_it ul li').each(function() {
						if( $(this).hasClass('selected') ) { key_check++; }
					});
					if( key_check === 0 ) {
						$('#'+current+' ul li:first-child').addClass('selected');
					} else {
						$('#'+current+' ul li.selected').next().addClass('selected');
						$('#'+current+' ul li.selected').first().removeClass('selected');
						selected = $('#'+current+' ul li.selected').html();
						$('#'+current+' .select_it_box .displayed').html(selected);
					}
				}
				if( e.keyCode == 38 ) {
					key_check = 0;
					$('.select_it ul li').each(function() {
						if( $(this).hasClass('selected') ) { key_check++; }
					});
					if( key_check === 0 ) {
						$('#'+current+' ul li:first-child').addClass('selected');
					} else {
						$('#'+current+' ul li.selected').prev().addClass('selected');
						$('#'+current+' ul li.selected').last().removeClass('selected');
						selected = $('#'+current+' ul li.selected').html();
						$('#'+current+' .select_it_box .displayed').html(selected);
					}
				}
				current = $(this).parents('.select_it').attr('id');
				if( e.keyCode == 13 ) {
					$('.select_it_box').removeClass('open');
					$('.select_it ul').hide();
					selected = $('#'+current+' ul li.selected').html();
					$('#'+current+' .select_it_box .displayed').html(selected);
				}
				if( e.keyCode == 9 ) {
					$('#'+current).parents('form > .fieldset .block').next().find('input, textarea').focus();
				}
				return false;
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
					$('#'+toggled).show(200);
				}
				if( onchange == 'load' ) {
					$(settings.onchange_container).html('<img class="loading" src="images/loading.gif" />');
					var value = $(this).attr('rel');
					$.ajax({
						url: settings.onchange_url+'?id='+value,
						error: function(data) { console.log('fail'); },
						success: function(data) {
							$(settings.onchange_container).html(data);
							$(settings.onchange_container).data('owlCarousel').reinit({
								itemsCustom: [[0, 3], [400, 4]]
							});
						}
					});
				}
				if( onchange == 'submit' ) {
					var form_submit = $(this).closest('form');
					$(this).closest('form').submit();
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