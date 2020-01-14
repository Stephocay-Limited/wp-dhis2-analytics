$(window).on('load', function(){
    $('.analytics-slider').bxSlider({
        mode: 'fade',
        pause: 20000,
        responsive: true,
        captions: true,
        slideSelector: 'div.dhis2-slide',
        pager: false,
        auto: true,
        autoDirection: true,
        autoHover: true,
        keyboardEnabled: true
    });
});

// $(window).on('load', function() {
//     $('.slider').bxSlider();
//   })

// $(document).ready(function() {
//     // alert("Loaded");
//     $('.analytics-slider').slick({
//         adaptiveHeight: true,
//         slidesToShow: 1,
//         dots: false,
//         prevArrow: false,
//         nextArrow: false,
//         centreMode: true,
//     });
// });