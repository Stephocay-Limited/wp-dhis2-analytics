/* eslint-disable no-undef */
$(window).on('load', function () {
	$('.analytics-slider').bxSlider({
		mode: 'fade',
		pause: 20000,
		responsive: true,
		captions: true,
		slideSelector: '.dhis2-slide',
		pager: false,
		auto: true,
		autoDirection: true,
		autoHover: true,
		keyboardEnabled: true,
	});
});
