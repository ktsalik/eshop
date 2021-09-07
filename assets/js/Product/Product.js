function Product(props) {
  const [product, setProduct] = useState({
    category: {
      parent: {},
    },
    images: [],
  });

  useEffect(() => {
    window.scroll(0, 0);
    axios.get(`${baseUrl}api/products/${props.match.params.productId}`).then((response) => {
      setProduct(response.data);
      
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
    });
  }, []);
  
  return (
    <div className="Product">
      <div className="page-title">
        <div className="container">
          <div className="column">
            <h1>{product.name}</h1>
          </div>
          <div className="column">
            <ul className="breadcrumbs">
              <li><a href="index.html">Home</a>
              </li>
              <li className="separator">&nbsp;</li>
              <li><Link to={`/categories/${product.category.parent.id}/1`}>{product.category.parent.name}</Link>
              </li>
              <li className="separator">&nbsp;</li>
              <li><Link to={`/categories/${product.category.id}/1`}>{product.category.name}</Link>
              </li>
              <li className="separator">&nbsp;</li>
              <li>{product.name}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container padding-bottom-3x mb-1">
        <div className="row">
          <div className="col-md-6">
            <div className="product-gallery"><span className="product-badge text-danger">30% Off</span>
              <div className="gallery-wrapper">
                <div className="gallery-item video-btn text-center"><a href="#" data-toggle="tooltip" data-type="video" data-video="&lt;div class=&quot;wrapper&quot;&gt;&lt;div class=&quot;video-wrapper&quot;&gt;&lt;iframe class=&quot;pswp__video&quot; width=&quot;960&quot; height=&quot;640&quot; src=&quot;//www.youtube.com/embed/B81qd2v6alw?rel=0&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;&lt;/div&gt;&lt;/div&gt;" title="Watch video"></a></div>
              </div>
              <div className="product-carousel owl-carousel gallery-wrapper">
                {
                  product.images.map((image, i) => {
                    return (
                      <div key={i} className="gallery-item" data-hash="one"><a href={image} data-size="1000x667"><img src={image} alt="Product" /></a></div>
                    );
                  })
                }
              </div>
              <ul className="product-thumbnails">
                {
                  product.images.map((image, i) => {
                    return (
                      <li key={i} className="active"><a href="#"><img src={image} alt="Product" /></a></li>
                    );
                  })
                }
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="padding-top-2x mt-2 hidden-md-up"></div>
              {/* <div className="rating-stars"><i className="icon-star filled"></i><i className="icon-star filled"></i><i className="icon-star filled"></i><i className="icon-star filled"></i><i className="icon-star"></i>
              </div><span className="text-muted align-middle">&nbsp;&nbsp;4.2 | 3 customer reviews</span> */}
            <h2 className="padding-top-1x text-normal">{product.name}</h2><span className="h2 d-block">
              {
                product.discount_price
                  ? <del className="text-muted text-normal">
                      {parseFloat(product.price).toFixed(2)}&nbsp;€
                    </del>
                  : ''
              }
              &nbsp; {parseFloat(product.discount_price || product.price).toFixed(2)}&nbsp;€</span>
            <div className="row margin-top-1x">
              <div className="col-sm-3">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <select className="form-control" id="quantity">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="pt-1 mb-2"><span className="text-medium">SKU:</span> {product.sku}</div>
            <div className="pt-1 mb-2"><span className="text-medium">MPN:</span> {product.mpn}</div>
            <div className="padding-bottom-1x mb-2">
              <span className="text-medium">Categories:&nbsp;</span>
              <Link to={`/categories/${product.category.id}/1`} className="navi-link">{product.category.name}</Link>
            </div>
            <hr className="mb-3" />
            <div className="d-flex flex-wrap justify-content-between">
              <div className="entry-share mt-2 mb-2"><span className="text-muted">Share:</span>
                <div className="share-links"><a className="social-button shape-circle sb-facebook" href="#" data-toggle="tooltip" data-placement="top" title="Facebook"><i className="socicon-facebook"></i></a><a className="social-button shape-circle sb-twitter" href="#" data-toggle="tooltip" data-placement="top" title="Twitter"><i className="socicon-twitter"></i></a><a className="social-button shape-circle sb-instagram" href="#" data-toggle="tooltip" data-placement="top" title="Instagram"><i className="socicon-instagram"></i></a><a className="social-button shape-circle sb-google-plus" href="#" data-toggle="tooltip" data-placement="top" title="Google +"><i className="socicon-googleplus"></i></a></div>
              </div>
              <div className="sp-buttons mt-2 mb-2">
                <button className="btn btn-outline-secondary btn-sm btn-wishlist" data-toggle="tooltip" title="Whishlist"><i className="icon-heart"></i></button>
                <button className="btn btn-primary" data-toast data-toast-type="success" data-toast-position="topRight" data-toast-icon="icon-circle-check" data-toast-title="Product" data-toast-message="successfuly added to cart!"><i className="icon-bag"></i> Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
        <div className="row padding-top-3x mb-3">
          <div className="col-lg-10 offset-lg-1">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item"><a className="nav-link active" href="#description" data-toggle="tab" role="tab">Description</a></li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="description" role="tabpanel">
                <div dangerouslySetInnerHTML={{__html: product.description}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}