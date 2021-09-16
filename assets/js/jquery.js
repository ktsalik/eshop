function initCategoriesMenu() {
  // Off-Canvas Menu
  //---------------------------------------------------------
  var menuInitHeight = $( '.offcanvas-menu .menu' ).height(),
  backBtnText = 'Back',
  subMenu = $( '.offcanvas-menu .offcanvas-submenu' );

  subMenu.each( function () {
    $( this ).prepend( '<li class="back-btn"><a href="#">' + backBtnText + '</a></li>' );
  } );

  var hasChildLink = $( '.has-children .sub-menu-toggle' ),
      backBtn = $( '.offcanvas-menu .offcanvas-submenu .back-btn' );

  backBtn.on( 'click', function ( e ) {
    var self = this,
      parent = $( self ).parent(),
      siblingParent = $( self ).parent().parent().siblings().parent(),
      menu = $( self ).parents( '.menu' );
    
    parent.removeClass( 'in-view' );
    siblingParent.removeClass( 'off-view' );
    if ( siblingParent.attr( 'class' ) === 'menu' ) {
      menu.css( 'height', menuInitHeight );
    } else {
      menu.css( 'height', siblingParent.height() );
    }

    e.preventDefault();
  } );

  hasChildLink.on( 'click', function ( e ) {
    var self = this,
      parent = $( self ).parent().parent().parent(),
      menu = $( self ).parents( '.menu' );

    parent.addClass( 'off-view' );
    $( self ).parent().parent().find( '> .offcanvas-submenu' ).addClass( 'in-view' );
    menu.css( 'height', $( self ).parent().parent().find( '> .offcanvas-submenu' ).height() );

    e.preventDefault();
    return false;
  } );
}

function fixCategoriesMenu() {
  $('.categories-menu > a').on('mouseover', function(e) {
    $('.sub-menu.categories').removeAttr('style');
  });
  $('.sub-menu.categories').on('click', function() {
    $('.sub-menu.categories').css('display', 'none');
  });
  $('.categories-menu > a').css({
    cursor: 'pointer',
  });
}

function stickyHeader() {
  var $body = $('body');
  var $navbar = $('.navbar-sticky');
  var $topbarH = $('.topbar').outerHeight();
  var $navbarH = $navbar.outerHeight();
  if($navbar.length) {
    $(window).on('scroll', function() {
      if($(this).scrollTop() > $topbarH) {
        $navbar.addClass('navbar-stuck');
        if(! $navbar.hasClass('navbar-ghost')) {
          $body.css('padding-top', $navbarH);
        }
      } else {
        $navbar.removeClass('navbar-stuck');
        $body.css('padding-top', 0);
      }
    });
  }
}

function initOffCanvas() {
  // Off-Canvas Container
  //---------------------------------------------------------
  function offcanvasOpen(e) {
    var $body = $('body');
    var targetEl = $(e.target).attr('href');
    $(targetEl).addClass('active');
    $body.css('overflow', 'hidden');
    $body.addClass('offcanvas-open');
    e.preventDefault();
  }
  function offcanvasClose() {
    var $body = $('body');
    $body.removeClass('offcanvas-open');
    setTimeout(function() {
      $body.css('overflow', 'visible');
      $('.offcanvas-container').removeClass('active');
    }, 450);
  }
  $('[data-toggle="offcanvas"]').on('click', offcanvasOpen);
  $('.site-backdrop').on('click', offcanvasClose);
}

// Site Search
//---------------------------------------------------------
function searchActions( openTrigger, closeTrigger, clearTrigger, target ) {
  $( openTrigger ).on( 'click', function() {
    $( target ).addClass( 'search-visible' );
    setTimeout( function() {
      $( target + ' > input' ).focus();
    }, 200);
  } );
  $( closeTrigger ).on( 'click', function() {
    $( target ).removeClass( 'search-visible' );
  } );
  $( clearTrigger ).on('click', function(){
    $( target + ' > input' ).val('');
    setTimeout(function() {
      $( target + ' > input' ).focus();
    }, 200);
  });
}

function initScrollToTop() {
  // Animated Scroll to Top Button
  //------------------------------------------------------------------------------
  var $scrollTop = $( '.scroll-to-top-btn' );
  if ( $scrollTop.length > 0 ) {
    $( window ).on( 'scroll', function () {
      if ( $( this ).scrollTop() > 600 ) {
        $scrollTop.addClass( 'visible' );
      } else {
        $scrollTop.removeClass( 'visible' );
      }
    } );
    $scrollTop.on( 'click', function ( e ) {
      e.preventDefault();
      $( 'html' ).velocity( 'scroll', {
        offset: 0,
        duration: 1200,
        easing: 'easeOutExpo',
        mobileHA: false
      } );
    } );
  }
}

function initToasts() {
  // Toast Notifications
  //------------------------------------------------------------------------------
  $('[data-toast]').on('click', function() {
    
    var self = $(this),
        $type = self.data('toast-type'),
        $icon = self.data('toast-icon'),
        $position = self.data('toast-position'),
        $title = self.data('toast-title'),
        $message = self.data('toast-message'),
        toastOptions = '';
    
    switch ($position) {
      case 'topRight':
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'topRight',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInLeft',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      case 'bottomRight':
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'bottomRight',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInLeft',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      case 'topLeft':
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'topLeft',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInRight',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      case 'bottomLeft':
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'bottomLeft',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInRight',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      case 'topCenter':
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'topCenter',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInDown',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      case 'bottomCenter':
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'bottomCenter',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInUp',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      default:
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'topRight',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInLeft',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
    }

    iziToast.show(toastOptions);
  });

  // Launch defaul BS Toasts on click
  $('[data-toggle="toast"]').on('click', function() {
    var target = '#' + $(this).data('toast-id');
    $(target).toast('show');
  });
}

function initProductGallery() {
  // Gallery (Photoswipe)
  //------------------------------------------------------------------------------
  if($('.gallery-wrapper').length) {
    
    var initPhotoSwipeFromDOM = function(gallerySelector) {
    
      // parse slide data (url, title, size ...) from DOM elements
      // (children of gallerySelector)
      var parseThumbnailElements = function(el) {
        var thumbElements = $(el).find('.gallery-item:not(.isotope-hidden)').get(),
          numNodes = thumbElements.length,
          items = [],
          figureEl,
          linkEl,
          size,
          item;
    
        for (var i = 0; i < numNodes; i++) {
    
          figureEl = thumbElements[i]; // <figure> element
    
          // include only element nodes
          if (figureEl.nodeType !== 1) {
            continue;
          }
    
          linkEl = figureEl.children[0]; // <a> element
          
          // create slide object
          if ($(linkEl).data('type') == 'video') {
            item = {
              html: $(linkEl).data('video')
            };
          } else {
            size = linkEl.getAttribute('data-size').split('x');
            item = {
              src: linkEl.getAttribute('href'),
              w: parseInt(size[0], 10),
              h: parseInt(size[1], 10)
            };
          }
    
          if (figureEl.children.length > 1) {
            item.title = $(figureEl).find('.caption').html();
          }
    
          if (linkEl.children.length > 0) {
            item.msrc = linkEl.children[0].getAttribute('src');
          }
    
          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
        }
    
        return items;
      };
    
      // find nearest parent element
      var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
      };
    
      function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
      }
    
      // triggers when user clicks on thumbnail
      var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
    
        var eTarget = e.target || e.srcElement;
    
        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
          return (hasClass(el, 'gallery-item'));
        });
    
        if (!clickedListItem) {
          return;
        }
    
        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.closest('.gallery-wrapper'),
          childNodes = $(clickedListItem.closest('.gallery-wrapper')).find('.gallery-item:not(.isotope-hidden)').get(),
          numChildNodes = childNodes.length,
          nodeIndex = 0,
          index;
    
        for (var i = 0; i < numChildNodes; i++) {
          if (childNodes[i].nodeType !== 1) {
            continue;
          }
    
          if (childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
          }
          nodeIndex++;
        }
    
        if (index >= 0) {
          // open PhotoSwipe if valid index found
          openPhotoSwipe(index, clickedGallery);
        }
        return false;
      };
    
      // parse picture index and gallery index from URL (#&pid=1&gid=2)
      var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
          params = {};
    
        if (hash.length < 5) {
          return params;
        }
    
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
          if (!vars[i]) {
            continue;
          }
          var pair = vars[i].split('=');
          if (pair.length < 2) {
            continue;
          }
          params[pair[0]] = pair[1];
        }
    
        if (params.gid) {
          params.gid = parseInt(params.gid, 10);
        }
    
        return params;
      };
    
      var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
          gallery,
          options,
          items;
    
        items = parseThumbnailElements(galleryElement);
    
        // define options (if needed)
        options = {
          
          closeOnScroll: false,
          
          // define gallery index (for URL)
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),
    
          getThumbBoundsFn: function(index) {
              // See Options -> getThumbBoundsFn section of documentation for more info
              var thumbnail = items[index].el.getElementsByTagName('img')[0]; // find thumbnail
              if($(thumbnail).length > 0) {
                var	pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();
        
                return {
                  x: rect.left,
                  y: rect.top + pageYScroll,
                  w: rect.width
                };
              }
            }
    
        };
    
        // PhotoSwipe opened from URL
        if (fromURL) {
          if (options.galleryPIDs) {
            // parse real index when custom PIDs are used
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for (var j = 0; j < items.length; j++) {
              if (items[j].pid == index) {
                options.index = j;
                break;
              }
            }
          } else {
            // in URL indexes start from 1
            options.index = parseInt(index, 10) - 1;
          }
        } else {
          options.index = parseInt(index, 10);
        }
    
        // exit if index not found
        if (isNaN(options.index)) {
          return;
        }
    
        if (disableAnimation) {
          options.showAnimationDuration = 0;
        }
    
        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    
        gallery.listen('beforeChange', function() {
          var currItem = $(gallery.currItem.container);
          $('.pswp__video').removeClass('active');
          var currItemIframe = currItem.find('.pswp__video').addClass('active');
          $('.pswp__video').each(function() {
            if (!$(this).hasClass('active')) {
              $(this).attr('src', $(this).attr('src'));
            }
          });
        });
    
        gallery.listen('close', function() {
          $('.pswp__video').each(function() {
            $(this).attr('src', $(this).attr('src'));
          });
        });
    
      };
    
      // loop through all gallery elements and bind events
      var galleryElements = document.querySelectorAll(gallerySelector);
    
      for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
      }
    
      // Parse URL and open gallery if it contains #&pid=3&gid=1
      var hashData = photoswipeParseHash();
      if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
      }
    
    };
    
    // execute above function
    initPhotoSwipeFromDOM('.gallery-wrapper');
  }


  // Product Gallery
  //------------------------------------------------------------------------------
  var $productCarousel = $('.product-carousel');
  if($productCarousel.length) {

    // Carousel init
    $productCarousel.owlCarousel({
      items: 1,
      loop: false,
      dots: false,
      URLhashListener: true,
      startPosition: 'URLHash',
      onTranslate: activeHash
    });

    function activeHash(e) {
      var i = e.item.index;
      var $activeHash = $('.owl-item').eq(i).find('[data-hash]').attr('data-hash');
      $('.product-thumbnails li').removeClass('active');
      $('[href="#' + $activeHash + '"]').parent().addClass('active');
      $('.gallery-wrapper .gallery-item').removeClass('active');
      $('[data-hash="' + $activeHash + '"]').parent().addClass('active');
      
    }
  }

  var $emptyLink = $('a[href="#"]');
  $emptyLink.on('click', function(e) {
    e.preventDefault();
  });
}

function initFavouriteButtons() {
  // Wishlist Button
	//------------------------------------------------------------------------------
	$('.btn-wishlist').on('click', function() {
		var iteration = $(this).data('iteration') || 1,
				toastOptions = {
					title: 'Product',
					animateInside: false,
					position: 'topRight',
					progressBar: false,
					timeout: 3200,
					transitionIn: 'fadeInLeft',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};

		switch ( iteration) {
			case 1:
				$(this).addClass('active');
				toastOptions.class = 'iziToast-info';
				toastOptions.message = 'added to your wishlist!';
				toastOptions.icon = 'icon-bell';
				break;
			
			case 2:
				$(this).removeClass('active');
				toastOptions.class = 'iziToast-danger';
				toastOptions.message = 'removed from your wishlist!';
				toastOptions.icon = 'icon-ban';
				break;
		}

		iziToast.show(toastOptions);

		iteration++;
		if (iteration > 2) iteration = 1;
		$(this).data('iteration', iteration);
	});
}

function initOwlCarousel() {
  // owl carousel init
  !function(a,b,c){"use strict";a.fn.siCarousel=function(){return"undefined"==typeof a.fn.owlCarousel?this:this.each(function(){var b=a(this),c=a.extend(!0,{},a.fn.siCarousel.defaults,b.data("owl-carousel"));b.owlCarousel(c)})},a.fn.siCarousel.defaults={items:1,loop:!1,nav:!1,navText:[],dots:!0,slideBy:1,lazyLoad:!1,autoplay:!1,autoplayTimeout:4e3,responsive:{},animateOut:!1,animateIn:!1,smartSpeed:450,navSpeed:450},a(function(){a("[data-owl-carousel]").siCarousel()})}(jQuery,window,document);
}

window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};