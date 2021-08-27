const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
const useState = React.useState;

function App(props) {
  const [t, i18n] = ReactI18next.useTranslation('translations');

  const [basket, setBasket] = useState({
    products: [
      {
        id: 1,
        name: 'foo',
      },
      {
        id: 2,
        name: 'bar',
      },
      {
        id: 3,
        name: 'baz',
      },
    ],
  });

  function removeFromBasket(productId) {
    const products = basket.products.slice(0);
    products.splice(products.findIndex((p) => p.id === productId), 1);
    setBasket({
      ...basket,
      products: products,
    });
  }

  React.useEffect(() => {
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
    stickyHeader();

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
    searchActions( '.toolbar .tools .search', '.close-search', '.clear-search', '.site-search' );

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
  }, []);

  window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

  return (
    <ReactRouterDOM.HashRouter>
      <div className="App">
        <div className="offcanvas-container" id="shop-categories">
          <div className="offcanvas-header">
            <h3 className="offcanvas-title">Shop Categories</h3>
          </div>
          <nav className="offcanvas-menu">
            <ul className="menu">
              <li className="has-children"><span><a href="#">Men's Shoes</a><span className="sub-menu-toggle"></span></span>
                <ul className="offcanvas-submenu">
                  <li><a href="#">Sneakers</a></li>
                  <li><a href="#">Loafers</a></li>
                  <li><a href="#">Boat Shoes</a></li>
                  <li><a href="#">Sandals</a></li>
                  <li><a href="#">View All</a></li>
                </ul>
              </li>
              <li className="has-children"><span><a href="#">Women's Shoes</a><span className="sub-menu-toggle"></span></span>
                <ul className="offcanvas-submenu">
                  <li><a href="#">Sandals</a></li>
                  <li><a href="#">Flats</a></li>
                  <li><a href="#">Sneakers</a></li>
                  <li><a href="#">Heels</a></li>
                  <li><a href="#">View All</a></li>
                </ul>
              </li>
              <li className="has-children"><span><a href="#">Men's Clothing</a><span className="sub-menu-toggle"></span></span>
                <ul className="offcanvas-submenu">
                  <li><a href="#">Shirts &amp; Tops</a></li>
                  <li><a href="#">Pants</a></li>
                  <li><a href="#">Jackets</a></li>
                  <li><a href="#">View All</a></li>
                </ul>
              </li>
              <li className="has-children"><span><a href="#">Women's Clothing</a><span className="sub-menu-toggle"></span></span>
                <ul className="offcanvas-submenu">
                  <li><a href="#">Dresses</a></li>
                  <li><a href="#">Shirts &amp; Tops</a></li>
                  <li><a href="#">Shorts</a></li>
                  <li><a href="#">Swimwear</a></li>
                  <li><a href="#">View All</a></li>
                </ul>
              </li>
              <li className="has-children"><span><a href="#">Kid's Shoes</a><span className="sub-menu-toggle"></span></span>
                <ul className="offcanvas-submenu">
                  <li><a href="#">Boots</a></li>
                  <li><a href="#">Sandals</a></li>
                  <li><a href="#">Crib Shoes</a></li>
                  <li><a href="#">Loafers</a></li>
                  <li><a href="#">View All</a></li>
                </ul>
              </li>
              <li className="has-children"><span><a href="#">Bags</a><span className="sub-menu-toggle"></span></span>
                <ul className="offcanvas-submenu">
                  <li><a href="#">Handbags</a></li>
                  <li><a href="#">Backpacks</a></li>
                  <li><a href="#">Luggage</a></li>
                  <li><a href="#">Wallets</a></li>
                  <li><a href="#">View All</a></li>
                </ul>
              </li>
              <li className="has-children"><span><a href="#">Accessories</a><span className="sub-menu-toggle"></span></span>
                <ul className="offcanvas-submenu">
                  <li><a href="#">Sunglasses</a></li>
                  <li><a href="#">Hats</a></li>
                  <li><a href="#">Watches</a></li>
                  <li><a href="#">Jewelry</a></li>
                  <li><a href="#">Belts</a></li>
                  <li><a href="#">View All</a></li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>

        <div className="offcanvas-container" id="mobile-menu">
          <nav className="offcanvas-menu">
            <ul className="menu">
              <li className="">
                <span><a href="#"><span>Home</span></a></span>
              </li>
              <li className="has-children"><span><a href="#"><span>Categories</span></a><span className="sub-menu-toggle"></span></span>
                <ul className="offcanvas-submenu">
                  <li className="has-children"><span><a href="#"><span>Shop Grid</span></a><span className="sub-menu-toggle"></span></span>
                    <ul className="offcanvas-submenu">
                      <li><a href="#">Grid Left Sidebar</a></li>
                      <li><a href="#">Grid Right Sidebar</a></li>
                      <li><a href="#">Grid No Sidebar</a></li>
                    </ul>
                  </li>
                  <li className="has-children"><span><a href="shop-list-ls.html"><span>Shop List</span></a><span className="sub-menu-toggle"></span></span>
                    <ul className="offcanvas-submenu">
                      <li><a href="#">List Left Sidebar</a></li>
                      <li><a href="#">List Right Sidebar</a></li>
                      <li><a href="#">List No Sidebar</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="">
                <span><a href="#"><span>Favourites</span></a></span>
              </li>
              <li className="">
                <span><a href="#"><span>Basket</span></a></span>
              </li>
              <li className="">
                <span><a href="#"><span>Contact</span></a></span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="topbar">
          <div className="topbar-column">
            <a className="hidden-md-down" href="mailto:support@eshop.com">
              <i className="icon-mail"></i>&nbsp; support@eshop.com
            </a>
            <a className="hidden-md-down" href="tel:00112223333">
              <i className="icon-bell"></i>&nbsp; 00 11 222 3333
            </a>
            <a className="social-button sb-facebook shape-none sb-dark" href="#" target="_blank">
              <i className="socicon-facebook"></i>
            </a>
          </div>
        </div>

        <header className="navbar navbar-sticky">
          <form className="site-search" method="get">
            <input type="text" name="site_search" placeholder="Type to search..." />
            <div className="search-tools"><span className="clear-search">Clear</span><span className="close-search"><i className="icon-cross"></i></span></div>
          </form>
          <div className="site-branding">
            <div className="inner">
              <a className="offcanvas-toggle cats-toggle" href="#shop-categories" data-toggle="offcanvas"></a>
              <a className="offcanvas-toggle menu-toggle" href="#mobile-menu" data-toggle="offcanvas"></a>
              <a className="site-logo" href="index.html"><img src="img/logo/logo.png" alt="Unishop" /></a>
            </div>
          </div>
          <nav className="site-menu">
            <ul>
              <li className=""><a href="index.html"><span>Home</span></a></li>
              <li>
                <a href="shop-grid-ls.html"><span>Categories</span></a>
                <ul className="sub-menu">
                    <li><a href="shop-categories.html">Shop Categories</a></li>
                  <li className="has-children"><a href="shop-grid-ls.html"><span>Shop Grid</span></a>
                    <ul className="sub-menu">
                        <li><a href="shop-grid-ls.html">Grid Left Sidebar</a></li>
                        <li><a href="shop-grid-rs.html">Grid Right Sidebar</a></li>
                        <li><a href="shop-grid-ns.html">Grid No Sidebar</a></li>
                    </ul>
                  </li>
                  <li className="has-children"><a href="shop-list-ls.html"><span>Shop List</span></a>
                    <ul className="sub-menu">
                        <li><a href="shop-list-ls.html">List Left Sidebar</a></li>
                        <li><a href="shop-list-rs.html">List Right Sidebar</a></li>
                        <li><a href="shop-list-ns.html">List No Sidebar</a></li>
                    </ul>
                  </li>
                    <li><a href="shop-single.html">Single Product</a></li>
                    <li><a href="cart.html">Cart</a></li>
                  <li className="has-children"><a href="checkout-address.html"><span>Checkout</span></a>
                    <ul className="sub-menu">             
                        <li><a href="checkout-address.html">Address</a></li>
                        <li><a href="checkout-shipping.html">Shipping</a></li>
                        <li><a href="checkout-payment.html">Payment</a></li>
                        <li><a href="checkout-review.html">Review</a></li>
                        <li><a href="checkout-complete.html">Complete</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className=""><a href="#"><span>Favourites</span></a></li>
              <li className=""><a href="#"><span>Basket</span></a></li>
              <li className=""><a href="#"><span>Contact</span></a></li>
            </ul>
          </nav>

          <div className="toolbar">
            <div className="inner">
              <div className="tools">
                <div className="search"><i className="icon-search"></i></div>
                <div className="cart">
                  <a href="cart.html"></a>
                  <i className="icon-bag"></i>
                  <span className="count">3</span>
                  <span className="subtotal">$289.68</span>
                  <div className="toolbar-dropdown">
                    {
                      basket.products.map((product, i) => {
                        return (
                          <div
                            className="dropdown-product-item"
                            key={i}
                          >
                            <span
                              className="dropdown-product-remove"
                              onClick={removeFromBasket.bind(this, product.id)}
                            >
                              <i className="icon-cross"></i>
                            </span>
                            <a className="dropdown-product-thumb" href="shop-single.html">
                              <img src="img/cart-dropdown/01.jpg" alt="Product" />
                            </a>
                            <div className="dropdown-product-info">
                              <a className="dropdown-product-title" href="shop-single.html">
                                {product.name}
                              </a>
                              <span className="dropdown-product-details">1 x $43.90</span>
                            </div>
                          </div>
                        );
                      })
                    }
                    {/* <div className="dropdown-product-item"><span className="dropdown-product-remove"><i className="icon-cross"></i></span><a className="dropdown-product-thumb" href="shop-single.html"><img src="img/cart-dropdown/01.jpg" alt="Product" /></a>
                      <div className="dropdown-product-info"><a className="dropdown-product-title" href="shop-single.html">Unionbay Park</a><span className="dropdown-product-details">1 x $43.90</span></div>
                    </div>
                    <div className="dropdown-product-item"><span className="dropdown-product-remove"><i className="icon-cross"></i></span><a className="dropdown-product-thumb" href="shop-single.html"><img src="img/cart-dropdown/02.jpg" alt="Product" /></a>
                      <div className="dropdown-product-info"><a className="dropdown-product-title" href="shop-single.html">Daily Fabric Cap</a><span className="dropdown-product-details">2 x $24.89</span></div>
                    </div>
                    <div className="dropdown-product-item"><span className="dropdown-product-remove"><i className="icon-cross"></i></span><a className="dropdown-product-thumb" href="shop-single.html"><img src="img/cart-dropdown/03.jpg" alt="Product" /></a>
                      <div className="dropdown-product-info"><a className="dropdown-product-title" href="shop-single.html">Haan Crossbody</a><span className="dropdown-product-details">1 x $200.00</span></div>
                    </div> */}
                    <div className="toolbar-dropdown-group">
                      <div className="column"><span className="text-lg">Total:</span></div>
                      <div className="column text-right"><span className="text-lg text-medium">$289.68&nbsp;</span></div>
                    </div>
                    <div className="toolbar-dropdown-group">
                      <div className="column"><a className="btn btn-sm btn-block btn-secondary" href="cart.html">View Cart</a></div>
                      <div className="column"><a className="btn btn-sm btn-block btn-success" href="checkout-address.html">Checkout</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="offcanvas-wrapper">
          <Route path="/" exact component={Home} />

          <footer className="site-footer">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-md-6">
                  <section className="widget widget-light-skin">
                    <h3 className="widget-title">Get In Touch With Us</h3>
                    <p className="text-white">Phone: 11 22 333 4444</p>
                    <ul className="list-unstyled text-sm text-white">
                      <li><span className="opacity-50">Monday-Friday:</span>9.00 am - 8.00 pm</li>
                      <li><span className="opacity-50">Saturday:</span>10.00 am - 6.00 pm</li>
                    </ul>
                    <p><a className="navi-link-light" href="#">support@eshop.com</a></p><a className="social-button shape-circle sb-facebook sb-light-skin" href="#"><i className="socicon-facebook"></i></a><a className="social-button shape-circle sb-twitter sb-light-skin" href="#"><i className="socicon-twitter"></i></a><a className="social-button shape-circle sb-instagram sb-light-skin" href="#"><i className="socicon-instagram"></i></a><a className="social-button shape-circle sb-google-plus sb-light-skin" href="#"><i className="socicon-googleplus"></i></a>
                  </section>
                </div>
                {/* <div className="col-lg-3 col-md-6">
                  <section className="widget widget-light-skin">
                    <h3 className="widget-title">Our Mobile App</h3><a className="market-button apple-button mb-light-skin" href="#"><span className="mb-subtitle">Download on the</span><span className="mb-title">App Store</span></a><a className="market-button google-button mb-light-skin" href="#"><span className="mb-subtitle">Download on the</span><span className="mb-title">Google Play</span></a><a className="market-button windows-button mb-light-skin" href="#"><span className="mb-subtitle">Download on the</span><span className="mb-title">Windows Store</span></a>
                  </section>
                </div> */}
                <div className="col-lg-4 col-md-6">
                  <section className="widget widget-links widget-light-skin">
                    <h3 className="widget-title">About Us</h3>
                    <ul>
                      <li><a href="#">Home</a></li>
                      <li><a href="#">Categories</a></li>
                      <li><a href="#">Favourites</a></li>
                      <li><a href="#">Basket</a></li>
                      <li><a href="#">Contact</a></li>
                    </ul>
                  </section>
                </div>
                <div className="col-lg-4 col-md-6">
                  <section className="widget widget-links widget-light-skin">
                    <h3 className="widget-title">Account &amp; Shipping Info</h3>
                    <ul>
                      <li><a href="#">Shipping Rates & Policies</a></li>
                      <li><a href="#">Refunds & Replacements</a></li>
                      <li><a href="#">Taxes</a></li>
                      <li><a href="#">Delivery Info</a></li>
                      <li><a href="#">Affiliate Program</a></li>
                    </ul>
                  </section>
                </div>
              </div>
              <hr className="hr-light mt-2 margin-bottom-2x" />
              <div className="row">
                <div className="col-md-7 padding-bottom-1x">
                  <div className="margin-bottom-1x" style={{maxWidth: '615px'}}><img src="img/payment_methods.png" alt="Payment Methods" />
                  </div>
                </div>
                <div className="col-md-5 padding-bottom-1x">
                  <div className="margin-top-1x hidden-md-up"></div>
                  <form className="subscribe-form" action={`${baseUrl}subscribe`} method="post" target="_blank" noValidate>
                    <div className="clearfix">
                      <div className="input-group input-light">
                        <input className="form-control" type="email" name="EMAIL" placeholder="Your e-mail" /><span className="input-group-addon"><i className="icon-mail"></i></span>
                      </div>
                      <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
                        <input type="text" name="b_c7103e2c981361a6639545bd5_1194bb7544" tabIndex="-1" />
                      </div>
                      <button className="btn btn-primary" type="submit"><i className="icon-check"></i></button>
                    </div><span className="form-text text-sm text-white opacity-50">Subscribe to our Newsletter to receive early discount offers, latest news, sales and promo information.</span>
                  </form>
                </div>
              </div>
              <p className="footer-copyright">© All rights reserved. Made with &nbsp;<i className="icon-heart text-danger"></i><a href="https://tsalikidis.dev/" target="_blank"> &nbsp;by tsalik</a></p>
            </div>
          </footer>
        </div>

        <a className="scroll-to-top-btn" href="#" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}><i className="icon-arrow-up"></i></a>
        <div className="site-backdrop"></div>
      </div>
    </ReactRouterDOM.HashRouter>
  );
}