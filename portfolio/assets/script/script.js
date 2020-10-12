$(document).ready(function() {
    
    let $btns = $('.portfolio-area .button-group button');


    $btns.click(function (e) {

        $('.portfolio-area .button-group button').removeClass('active');
        e.target.classList.add('active');

        let selector = $(e.target).attr('data-filter');
        $('.portfolio-area .grid').isotope({
            filter: selector
        });

        return false;
    });

    $('.portfolio-area .button-group #btn1').trigger('click');

    $('.portfolio-area .grid .test-popup-link').magnificPopup({
        type: 'image',
        gallery:{enabled:true}
    });

    // Sticky nav menu

    let nav_offset_top = $('.header-area').height() + 50;

    function navbarFixed() {
        if($('.header-area').lenght){
            $(window).scroll(function(){
                let scroll = $(window).scrollTop();
                if(scroll >= nav_offset_top){
                    $('.header-area .main-menu').addClass('.navbar_fixed');
                } else{
                    $('.header-area .main-menu').removeClass('.navbar_fixed');
                }
            })
        }
    }

    navbarFixed();

    });


    $('.skill-per').each(function(){
    var $this = $(this);
    var per = $this.attr('per');
        $this.css("width",per+'%');
        $({animatedValue: 0}).animate({animatedValue: per},{
            duration: 1000,
            step: function(){
            $this.attr('per', Math.floor(this.animatedValue) + '%');
            },
            complete: function(){
                $this.attr('per', Math.floor(this.animatedValue) + '%');
            }
    });
});

$('.carousel').carousel({
    interval: 1,
    pause: hover,
    touch: true,
});
