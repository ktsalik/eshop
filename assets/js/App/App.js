const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
const useState = React.useState;
const useEffect = React.useEffect;
const useLocation = React.useLocation;

function App(props) {
  const [t, i18n] = ReactI18next.useTranslation('translations');
  const [categories, setCategories] = useState([]);
  const [basketProducts, setBasketProducts] = useState([]);
  const [basketTotal, setBasketTotal] = useState(0);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    axios.get(`${baseUrl}api/categories`).then((response) => {
      const c = response.data;

      c.forEach((category) => {
        if (category.parent) {
          const parent = c.find((_category) => _category.id == category.parent);
          parent.subcategories = parent.subcategories || [];
          parent.subcategories.push(category);
        }
      });

      setCategories(c);

      setTimeout(() => {
        initCategoriesMenu();
      });
    });

    fixCategoriesMenu();
    stickyHeader();
    initOffCanvas();
    searchActions( '.toolbar .tools .search', '.close-search', '.clear-search', '.site-search' );
    initScrollToTop();

    let storageBasket = localStorage.basket;
    if (storageBasket) {
      storageBasket = JSON.parse(storageBasket);
    } else {
      storageBasket = {};
    }

    const getBasketProductsFns = [];
    
    for (let productId in storageBasket) {
      let promise = new Promise((resolve, reject) => {
        axios.get(`${baseUrl}api/products/${productId}`).then((response) => {
          resolve({
            ...response.data,
            quantity: storageBasket[productId],
          });
        });
      });
      getBasketProductsFns.push(promise);
    }

    basket.onAddProduct(() => {
      setBasketProducts(basket.products);
      forceUpdate();
    });

    basket.onRemoveProduct(() => {
      setBasketProducts(basket.products);
      forceUpdate();
    });

    Promise.all(getBasketProductsFns).then((products) => {
      basket.products = products;
      setBasketProducts(products);
    });

    return () => {
      
    };
  }, []);

  React.useEffect(() => {
    let total = 0;
    basketProducts.forEach((product) => {
      total += (product.discount_price || product.price) * product.quantity;
    });
    setBasketTotal(total);
  }, [basketProducts.length]);

  function removeFromBasket(productId) {
    basket.removeProduct(productId);
  }
  
  return (
    <ReactRouterDOM.HashRouter>
      <div className="App">
        <div className="offcanvas-container" id="shop-categories">
          <div className="offcanvas-header">
            <h3 className="offcanvas-title">Shop Categories</h3>
          </div>
          <nav className="offcanvas-menu">
            <ul className="menu">
              {
                categories.filter((c) => c.subcategories).map((category, i) => {
                  return(
                    <li
                      className="has-children"
                      key={i}
                    >
                      <span>
                        <Link to={`/categories/${category.id}`}><span>{category.name}</span></Link>
                        <span className="sub-menu-toggle"></span>
                      </span>
                      <ul className="offcanvas-submenu">
                        {
                          category.subcategories.map((subcategory, j) => {
                            return (
                              <li
                                key={j}
                              >
                                <Link to={`/categories/${subcategory.id}`}>{subcategory.name}</Link>
                              </li>
                            );
                          })
                        }
                      </ul>
                    </li>
                  );
                })
              }
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
                  {
                    categories.filter((c) => c.subcategories).map((category, i) => {
                      return (
                        <li 
                          className="has-children"
                          key={i}
                        >
                          <span>
                            <Link to={`/categories/${category.id}`}><span>{category.name}</span></Link>
                            <span className="sub-menu-toggle"></span>
                          </span>
                          <ul className="offcanvas-submenu">
                            {
                              category.subcategories.map((subcategory, j) => {
                                return (
                                  <li
                                    key={j}
                                  >
                                    <Link to={`/categories/${subcategory.id}`}>{subcategory.name}</Link>
                                  </li>
                                );
                              })
                            }
                          </ul>
                        </li>
                      );
                    })
                  }
                </ul>
              </li>
              <li className="">
                <span><a href="#"><span>Favourites</span></a></span>
              </li>
              <li className="">
                <span><Link to="/basket"><span>Basket</span></Link></span>
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
              <Link to="/" className="site-logo"><img src="img/logo/logo.png" alt="Unishop" /></Link>
            </div>
          </div>
          <nav className="site-menu">
            <ul>
              <li className=""><Link to="/"><span>Home</span></Link></li>
              <li className="categories-menu">
                <a><span>Categories</span></a>
                <ul className="sub-menu categories">
                  {
                    categories.filter((c) => c.subcategories).map((category, i) => {
                      return (
                        <li
                          className="has-children"
                          key={i}
                        >
                          <Link to={`/categories/${category.id}`}><span>{category.name}</span></Link>
                          <ul className="sub-menu">
                            {
                              category.subcategories.map((subcategory, j) => {
                                return (
                                  <li
                                    key={j}
                                  >
                                    <Link to={`/categories/${subcategory.id}`}>{subcategory.name}</Link>
                                  </li>
                                );
                              })
                            }
                          </ul>
                        </li>
                      );
                    })
                  }
                </ul>
              </li>
              <li className=""><a href="#"><span>Favourites</span></a></li>
              <li className=""><Link to="/basket"><span>Basket</span></Link></li>
              <li className=""><a href="#"><span>Contact</span></a></li>
            </ul>
          </nav>

          <div className="toolbar">
            <div className="inner">
              <div className="tools">
                <div className="search"><i className="icon-search"></i></div>
                <div className="cart">
                  <Link to="/basket"></Link>
                  <i className="icon-bag"></i>
                  <span className="count">{basketProducts.length}</span>
                  <span className="subtotal">{parseFloat(basketTotal).toFixed(2)}&nbsp;€</span>
                  <div className="toolbar-dropdown">
                    {
                      basketProducts.length === 0
                        ? <div className="fs-12 my-1">Δεν έχετε προϊόντα στο καλάθι σας</div>
                        : ''
                    }
                    {
                      basketProducts.map((product, i) => {
                        return (
                          <div
                            className="dropdown-product-item"
                            key={i}
                          >
                            <span
                              className="dropdown-product-remove"
                              onClick={() => removeFromBasket(product.id)}
                            >
                              <i className="icon-cross"></i>
                            </span>
                            <a className="dropdown-product-thumb" href="shop-single.html">
                              <img src={product.images[0]} alt="Product" />
                            </a>
                            <div className="dropdown-product-info">
                              <Link className="dropdown-product-title" to={`/products/${product.id}/${product.name}`}>
                                {product.name}
                              </Link>
                              <span className="dropdown-product-details">{product.quantity} x {parseFloat(product.discount_price || product.price).toFixed(2)}&nbsp;€</span>
                            </div>
                          </div>
                        );
                      })
                    }
                    <div className="toolbar-dropdown-group">
                      <div className="column"><span className="text-lg">Total:</span></div>
                      <div className="column text-right"><span className="text-lg text-medium">{parseFloat(basketTotal).toFixed(2)}&nbsp;€</span></div>
                    </div>
                    <div className="toolbar-dropdown-group">
                      <div className="column"><a className="btn btn-sm btn-block btn-secondary" href="#">View Cart</a></div>
                      <div className="column"><a className="btn btn-sm btn-block btn-success" href="#">Checkout</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="offcanvas-wrapper">
          <Route path="/" exact component={Home} />
          <Route path="/categories/:categoryId" exact component={Products} />
          <Route path="/categories/:categoryId/:page" exact component={Products} />
          <Route path="/products/:productId" exact component={Product} />
          <Route path="/products/:productId/:productName" exact component={Product} />
          <Route path="/basket" exact component={BasketPage} />

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
                      <li><Link to="/basket">Basket</Link></li>
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