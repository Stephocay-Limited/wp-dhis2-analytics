$(document).ready(function () {
    $('.bxslider').bxSlider({
        mode: 'fade',
        pause: 20000,
        responsive: true,
        captions: true,
        slideSelector: 'div.dhis2-slide',
        pager: false,
        auto: true,
        autoDirection: true,
        autoHover: true,
        keyboardEnabled: true,
        adaptiveHeight: true,
        controls: true
    });
});