(function($) {
	$.fn.select_it = function( options ) {
		var choices_array = [];
		var count = 0;
		$(this).each(function() {
			choices_array = [];
			count++;
			var placeholder, selected, select_check, current, onchange, tabindex;
			var settings = $.extend({
				onchange: 'none',
				onchange_url:  'gallery-ajax.php',
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
					$('#'+current).parents('.third').next().find('input, textarea').focus();
					/*$('#'+current).parents('form > .third').next('.block').find('input, textarea').focus();*/
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
					$(settings.onchange_container).html('<img class="loading" src="http://centerforautism.aycdemo.com/wp-content/themes/cfa_theme/images/loading.gif" />');
					var value = $(this).attr('rel');
					$.ajax({
						type: 'POST',
						url:  ajax_call.ajaxurl,
						data: { action: 'gallery_loader', id: value },
						error: function(data) { console.log('fail'); },
						success: function(data) {
							console.log('is ' . data);
							$(settings.onchange_container).html(data);
							if( $('.gallery' ).hasClass('photos_videos') ) {
								$(settings.onchange_container).data('owlCarousel').reinit({
									itemsCustom: [[0, 1], [400, 2]]
								});
							} else {
								$(settings.onchange_container).data('owlCarousel').reinit({
									itemsCustom: [[0, 1], [480, 2], [850, 3], [1000, 4]]
								});
							}
						}
					});
				}
				if( onchange == 'change_url' ) {
					$('.gallery .videos .video_container .video iframe').hide();
					var new_url = $(this).attr('rel');
					$('.gallery .videos .video_container .video iframe').after('<img class="loading" src="http://localhost/~webdesigner/cfa_site/wp-content/themes/cfa_theme/images/loading.gif" />');
					$('.gallery .videos .video_container .video iframe').attr('src', new_url).fadeIn(200);
					$('.video .loading').remove();
				}
				if( onchange == 'submit' ) {
					$(this).parents('form').submit();
				}
			});
		});
		var i_count = 0;
		$('.select_it').each(function(){
			i_count++;
			$(this).attr('id', 'select_'+i_count);
		});
		$(document).click(function() {
			$('.select_it .select_it_box').removeClass('open');
			$('.select_it ul').hide();
		});
		return this;
	}; //  END SELECT_IT FUNCTION
}(jQuery));