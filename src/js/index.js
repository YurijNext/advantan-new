$(document).ready(function () {
  /** Masked Input **/
  $('input[name=phone]').mask('+38(099) 999 99 99');

  /** Anchor link **/
  $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function (event) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function () {
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          }
        });
      }
    }

    $('.b-header__nav-link').not(this).removeClass('b-header__nav-link--active');
    $(this).addClass('b-header__nav-link--active');
  });

  /**Mobile menu**/
  let mobileMenu = (function() {
    const openBtn = $('.hamburger'),
          menu = $('.mobile-menu'),
          link = $('.mobile-menu__link');

    function toggleMenu() {
      openBtn.toggleClass('hamburger--collapse is-active header-hamburger--active');
      menu.toggleClass('mobile-menu--active');
    }

    openBtn.on('click', function(e) {
      e.preventDefault();
      toggleMenu();
    });

    link.on('click', function(e) {
      e.preventDefault();
      toggleMenu();
    })
  })();

  /**Modal**/

  $('.b-test__button').on('click', function(e) {
    e.preventDefault();
    $('.test-popup').fadeIn(100);
  });

  $('.test-popup__close').on('click', function(e) {
    e.preventDefault();
    $('.test-popup').fadeOut(100);
  });

  $('.show-video-popup').on('click', function(e) {
    e.preventDefault();
    console.log(123);
    $('.video-popup').fadeIn(100);
  });

  $('.video-popup__close').on('click', function(e) {
    e.preventDefault();

    $('.video-popup').fadeOut(100);
  });



  $('.b-videos__poster').on('click', function() {
    let src = $(this).data('src');
    console.log(src);
    $('.video-popup').fadeIn(100);
    $('.video-popup__video').attr('src', src);
  });

  $('.b-main__link').on('click', function() {
    let src = $(this).data('src');
    console.log(src);
    $('.video-popup').fadeIn(100);
    $('.video-popup__video').attr('src', src);
  });


  (function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('.b-header__nav-link').each(function () {
      var currLink = $(this);
      var refElement = $(currLink.attr("href"));
      if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
        $('.b-header__nav-link').removeClass("b-header__nav-link--active"); //added to remove active class from all a elements
        currLink.addClass("b-header__nav-link--active");
      }
      else{
        currLink.removeClass("b-header__nav-link--active");
      }
    });
  })();



  /**Test**/
  let DOMStrings = {
    dotsList : '.js-dots-list',
    dotsItem : '.js-dot',
    dotsItemActive : '.dot-active',
    questionwrap : '.js-q-wrap',
    contentWrap : '.js-cnt-wrap',
    answerBtn : '.js-ans-btn',
    btn : '.test-popup__reply',
    continue: '.test-popup__continue',
    socials: '.test-socials'
  };

  let currentQuestion = 0;
  let dataLength;
  let answer;
  let allAnswers = 0;

  let title = '';

  function getData(callback) {
    $.getJSON('./test.json', function(data) {
      callback(data);
    });
  }

  getData(initItem);

  function initItem(data) {
    appendDots(data);
    appendQuestion(data);
  }

  function appendDots(dataObj) {
    dataLength = dataObj.length;

    if($(DOMStrings.dotsList).is(':parent')) {
      currentQuestion += 1;
      $(DOMStrings.dotsItem).eq(currentQuestion).addClass('dot-active');
    } else {
      for (let i = 0; i < dataLength; i++) {
        $(DOMStrings.dotsList).append('<li class="test-popup__dot js-dot"></li>');
      }
      $(DOMStrings.dotsItem).eq(0).addClass('dot-active');
    }
  }


  function appendQuestion(dataObj) {
    $(DOMStrings.questionwrap).empty();
    $(DOMStrings.questionwrap).append(dataObj[currentQuestion]['question']);
    $(DOMStrings.contentWrap).empty();
    $(DOMStrings.contentWrap).append(`<img src="${dataObj[currentQuestion]['img']}">`);
  }

  function viewConclusion() {
    $(DOMStrings.dotsItem).addClass('dot-active');
    $(DOMStrings.questionwrap).empty();
    $('.test-popup__header').css('min-height', '3.35714vw');
    $(DOMStrings.contentWrap).empty();
    $(DOMStrings.answerBtn).addClass('btn-hide');
    $(DOMStrings.continue).addClass('btn-hide');
    $(DOMStrings.socials).addClass('show-socials');

    $('.test-popup__content').prepend(`<span class="test-result">Ваш результат:</span>
                                        <span class="test-result-count"><strong>${allAnswers}<strong> правильных ответа из <strong>${dataLength - 1}<strong></span>`);

    function viewresulttext(dataObj) {
      if(allAnswers < 5) {
        $(DOMStrings.contentWrap).append(`<div class="result-text">${dataObj[dataLength-1]['totals'][2]}</div>`);
        title = $('.test-result-count').text();
      } else if (allAnswers >= 5 && allAnswers <= 7) {
        $(DOMStrings.contentWrap).append(`<div class="result-text">${dataObj[dataLength-1]['totals'][1]}</div>`);
        title = $('.test-result-count').text();
      } else if (allAnswers >= 8 && allAnswers <= 10) {
        $(DOMStrings.contentWrap).append(`<div class="result-text">${dataObj[dataLength-1]['totals'][0]}</div>`);
        title = $('.test-result-count').text();
      }
    }

    getData(viewresulttext);
  }

  function checkAnswer(dataObj, btn) {
    let correctTemplate = `
                          <div class="is-correct-wrap">
                            <span class="is-correct-title">Правильно</span>
                            <p class="is-correct-text">${dataObj[currentQuestion]['correctText']}</p>
                          </div>
                        `;

    let errorTemplate = `
                          <div class="is-correct-wrap">
                            <span class="is-error-title">Не верно</span>
                            <p class="is-correct-text">${dataObj[currentQuestion]['wrongText']}</p>
                          </div>
                        `;


    if( dataObj[currentQuestion]['answer'] == true) {
      $('[data-status="true"]').addClass('answer-correct');
      $('[data-status="false"]').addClass('answer-false');
    } else if (dataObj[currentQuestion]['answer'] == false) {
      $('[data-status="false"]').addClass('answer-correct');
      $('[data-status="true"]').addClass('answer-false');
    }

    if(answer == dataObj[currentQuestion]['answer']) {
      allAnswers += 1;
      $(DOMStrings.contentWrap).empty();
      $(DOMStrings.contentWrap).append(correctTemplate);
      $(DOMStrings.btn).addClass('btn-hide');
      $(DOMStrings.continue).addClass('btn-show');
    } else if(answer != dataObj[currentQuestion]['answer'] && answer != null) {
      $(DOMStrings.contentWrap).empty();
      $(DOMStrings.contentWrap).append(errorTemplate);
      $(DOMStrings.btn).addClass('btn-hide');
      $(DOMStrings.continue).addClass('btn-show');
    }






    answer = null;
    // $('[data-status= answer]').addClass('answer-correct');
    // $('[data-status="false"]').addClass('answer-false');
  }

  Share = {
    vkontakte: function(purl, ptitle, pimg, text) {
      url  = 'http://vkontakte.ru/share.php?';
      url += 'url='          + encodeURIComponent(purl);
      url += '&title='       + encodeURIComponent(ptitle);
      url += '&description=' + encodeURIComponent(text);
      url += '&image='       + encodeURIComponent(pimg);
      url += '&noparse=true';
      Share.popup(url);
    },

    facebook: function(ptitle, pimg, text) {
      url  = 'https://www.facebook.com/sharer/sharer.php?u=http%3A//dermatit.little9485.tmweb.ru/#test/?w=';
      url += '&p[title]='     + encodeURIComponent(ptitle);
      url += '&p[summary]='   + encodeURIComponent(text);
      // url += '&p[url]='       + encodeURIComponent(purl);
      url += '&p[images][0]=' + encodeURIComponent(pimg);
      Share.popup(url);
    },



    popup: function(url) {
      window.open(url,'','toolbar=0,status=0,width=626,height=436');
    }
  };

  $('#share-vk').on('click', function(e) {
    e.preventDefault();
    let urlImg;
    if(currentQuestion <= 10 && currentQuestion >= 8) {
      urlImg = 'http://dermatit.little9485.tmweb.ru/img/result1.jpg';
    } else if (currentQuestion <= 7 && currentQuestion >= 5) {
      urlImg = 'http://dermatit.little9485.tmweb.ru/img/result2.jpg';
    }else if (currentQuestion <= 5 && currentQuestion >= 1) {
      urlImg = 'http://dermatit.little9485.tmweb.ru/img/result3.jpg';
    }

    Share.vkontakte('http://dermatit.little9485.tmweb.ru/#test', 'Advantan', urlImg, title);
  });

  $('#share-fb').on('click', function(e) {
    e.preventDefault();
    let urlImg;
    if(currentQuestion <= 10 && currentQuestion >= 8) {
      urlImg = 'http://dermatit.little9485.tmweb.ru/img/result1.jpg';
    } else if (currentQuestion <= 7 && currentQuestion >= 5) {
      urlImg = 'http://dermatit.little9485.tmweb.ru/img/result2.jpg';
    }else if (currentQuestion <= 5 && currentQuestion >= 1) {
      urlImg = 'http://dermatit.little9485.tmweb.ru/img/result3.jpg';
    }

    Share.facebook('Advantan', urlImg,  title);

  });



  $(DOMStrings.answerBtn).on('click', function(e) {
    e.preventDefault();
    $(this).addClass('btn-active');
    $(DOMStrings.answerBtn).not(this).removeClass('btn-active');

    answer = $(this).data('status');
  });

  $(DOMStrings.btn).on('click', function(e) {
    e.preventDefault();
    getData(checkAnswer);
  });

  $(DOMStrings.continue).on('click', function(e) {
    if(currentQuestion + 1 === dataLength - 1) {
      viewConclusion();
      $('[data-status="true"]').removeClass('answer-correct');
      $('[data-status="false"]').removeClass('answer-false');
    } else {
      e.preventDefault();

      console.log($('[data-status="true"]'));
      $(DOMStrings.answerBtn).removeClass('btn-active');
      $(DOMStrings.btn).removeClass('btn-hide');
      $('[data-status="true"]').removeClass('answer-correct answer-false');
      $('[data-status="false"]').removeClass('answer-false answer-correct');
      $(DOMStrings.continue).removeClass('btn-show');
      getData(initItem);
    }

  });

























  var mySwiper = new Swiper ('.slider-popup__container', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,
    swipe: false,
    noSwiping: false,
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },

  });

});
