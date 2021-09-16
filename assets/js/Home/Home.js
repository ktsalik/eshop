const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;

function Home(props) {
  const [t, i18n] = ReactI18next.useTranslation('translations');
  const [sliderProducts, setSliderProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [statisticProducts, setStatisticProducts] = useState({
    top: [],
    new: [],
    best: [],
  });
  const [topCategories, setTopCategories] = useState([]);

  React.useEffect(() => {
    const sliderProductsPromises = [];
    const sliderProductsIds = [1000, 2000, 3000, 4000];
    for (let i = 0; i < sliderProductsIds.length; i++) {
      let productId = sliderProductsIds[i];
      const promise = axios.get(`${baseUrl}api/products/${productId}`).then((response) => {
        return response.data;
      });
      sliderProductsPromises.push(promise);
    }

    const featuredProductsPromise = Promise.all(sliderProductsPromises).then((products) => {
      setSliderProducts(products);
    });

    const featuredProductsPromises = [];
    const featuredProductsIds = [1000, 1500, 2000, 2500, 3000, 3500, 4000];
    for (let i = 0; i < featuredProductsIds.length; i++) {
      let productId = featuredProductsIds[i];
      const promise = axios.get(`${baseUrl}api/products/${productId}`).then((response) => {
        return response.data;
      });
      featuredProductsPromises.push(promise);
    }

    const sliderProductsPromise = Promise.all(featuredProductsPromises).then((products) => {
      setFeaturedProducts(products);
    });

    Promise.all([sliderProductsPromise, featuredProductsPromise]).then(() => {
      initOwlCarousel();
      initToasts();
      initFavouriteButtons();
    });

    axios.get(`${baseUrl}api/statistic-products`).then((response) => {
      setStatisticProducts(response.data);
    });

    let topCategoriesPromises = [];
    [25, 39, 110].forEach((categoryId) => {
      topCategoriesPromises.push(axios.get(`${baseUrl}api/categories/${categoryId}`).then((response) => {
        return response.data;
      }));
    });
    Promise.all(topCategoriesPromises).then((categories) => {
      setTopCategories(categories);
    });
  }, []);

  return (
    <React.Fragment>
      {/* <section className="hero-slider" style={{backgroundImage: 'url(img/hero-slider/main-bg.jpg)'}}> */}
      <section className="hero-slider" style={{backgroundColor: '#FFF'}}>
        <div className="owl-carousel large-controls dots-inside" data-owl-carousel="{ &quot;nav&quot;: true, &quot;dots&quot;: true, &quot;loop&quot;: true, &quot;autoplay&quot;: true, &quot;autoplayTimeout&quot;: 7000 }">
          {
            sliderProducts.map((sliderProduct, i) => {
              return (
                <div
                  className="item"
                  key={i}
                >
                  <div className="container padding-top-3x">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-lg-5 col-md-6 padding-bottom-2x text-md-left text-center">
                        <div className="from-bottom">
                          {/* <img className="d-inline-block w-150 mb-4" src="img/hero-slider/logo02.png" alt="Puma" /> */}
                          <div className="h2 text-body text-normal mb-2 pt-1">{sliderProduct.name}</div>
                          <div className="h2 text-body text-normal mb-4 pb-1">starting at <span className="text-bold">{parseFloat(sliderProduct.discount_price || sliderProduct.price).toFixed(2)}&nbsp;€</span></div>
                        </div><Link to={`/products/${sliderProduct.id}`} className="btn btn-primary scale-up delay-1">Shop Now</Link>
                      </div>
                      <div className="col-md-6 padding-bottom-2x mb-3"><img className="d-block mx-auto" src={sliderProduct.images[0]} alt="Slider Product Image" /></div>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </section>

      <section className="container padding-top-3x">
        <h3 className="text-center mb-30">Top Categories</h3>
        <div className="row">
          {
            topCategories.map((category, i) => {
              return (
                <div
                  className="col-md-4 col-sm-6"
                  key={i}
                >
                  <div className="card mb-30">
                    <Link to={`/categories/${category.id}`} className="card-img-tiles">
                      <div className="inner">
                        <div className="main-img">
                          <img src={category.images[0]} alt="Category" />
                        </div>
                        <div className="thumblist">
                          <img src={category.images[1]} alt="Category" />
                          <img src={category.images[2]} alt="Category" />
                        </div>
                      </div>
                    </Link>
                    <div className="card-body text-center">
                      <h4 className="card-title">{category.name}</h4>
                      <p className="text-muted">Starting from $49.99</p><Link to={`/categories/${category.id}`} className="btn btn-outline-primary btn-sm">View Products</Link>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
        <div className="text-center"><Link className="btn btn-outline-secondary margin-top-none">All Categories</Link></div>
      </section>

      <section className="container padding-top-3x padding-bottom-3x">
        <h3 className="text-center mb-30">Featured Products</h3>
        <div className="owl-carousel" data-owl-carousel="{ &quot;nav&quot;: false, &quot;dots&quot;: true, &quot;margin&quot;: 30, &quot;responsive&quot;: {&quot;0&quot;:{&quot;items&quot;:1},&quot;576&quot;:{&quot;items&quot;:2},&quot;768&quot;:{&quot;items&quot;:3},&quot;991&quot;:{&quot;items&quot;:4},&quot;1200&quot;:{&quot;items&quot;:4}} }">
          {
            featuredProducts.map((featuredProduct, i) => {
              return (
                <div
                  className="grid-item"
                  key={i}
                >
                  <div className="product-card">
                    {/* <div className="product-badge text-danger">22% Off</div> */}
                    <Link to={`/products/${featuredProduct.id}`} className="product-thumb"><img src={featuredProduct.images[0]} alt="Product" /></Link>
                    <h3 className="product-title"><Link to={`/products/${featuredProduct.id}`}>{featuredProduct.name}</Link></h3>
                    <h4 className="product-price">
                      {
                        featuredProduct.discount_price
                          ? <del>{parseFloat(featuredProduct.price).toFixed(2)}&nbsp;€</del>
                          : ''
                      }
                      {parseFloat(featuredProduct.discount_price || featuredProduct.price).toFixed(2)}&nbsp;€
                    </h4>
                    <div className="product-buttons">
                      <button className="btn btn-outline-secondary btn-sm btn-wishlist" data-toggle="tooltip" title="Whishlist"><i className="icon-heart"></i></button>
                      <button className="btn btn-outline-primary btn-sm" data-toast data-toast-type="success" data-toast-position="topRight" data-toast-icon="icon-circle-check" data-toast-title="Product" data-toast-message="successfuly added to cart!">Add to Cart</button>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </section>

      <section className="container padding-bottom-2x">
        <div className="row">
          <div className="col-md-4 col-sm-6">
            <div className="widget widget-featured-products">
              <h3 className="widget-title">Top Sellers</h3>
              {
                statisticProducts.top.map((product, i) => {
                  return (
                    <div
                      className="entry"
                      key={i}
                    >
                      <div className="entry-thumb"><Link to={`/products/${product.id}`}><img src={product.images[0]} alt="Product" /></Link></div>
                      <div className="entry-content">
                        <h4 className="entry-title"><Link to={`/products/${product.id}`}>{product.name}</Link></h4><span className="entry-meta">{parseFloat(product.discount_price || product.price).toFixed(2)}&nbsp;€</span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="widget widget-featured-products">
              <h3 className="widget-title">New Arrivals</h3>
              {
                statisticProducts.new.map((product, i) => {
                  return (
                    <div
                      className="entry"
                      key={i}
                    >
                      <div className="entry-thumb"><Link to={`/products/${product.id}`}><img src={product.images[0]} alt="Product" /></Link></div>
                      <div className="entry-content">
                        <h4 className="entry-title"><Link to={`/products/${product.id}`}>{product.name}</Link></h4><span className="entry-meta">{parseFloat(product.discount_price || product.price).toFixed(2)}&nbsp;€</span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="widget widget-featured-products">
              <h3 className="widget-title">Best Rated</h3>
              {
                statisticProducts.best.map((product, i) => {
                  return (
                    <div
                      className="entry"
                      key={i}
                    >
                      <div className="entry-thumb"><Link to={`/products/${product.id}`}><img src={product.images[0]} alt="Product" /></Link></div>
                      <div className="entry-content">
                        <h4 className="entry-title"><Link to={`/products/${product.id}`}>{product.name}</Link></h4><span className="entry-meta">{parseFloat(product.discount_price || product.price).toFixed(2)}&nbsp;€</span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </section>
      
      <section className="container padding-top-3x padding-bottom-2x">
        <div className="row">
          <div className="col-md-4 col-sm-6 text-center mb-30"><img className="d-block w-90 img-thumbnail rounded-circle mx-auto mb-3" src="img/services/02.png" alt="Money Back" />
            <h6>Money Back Guarantee</h6>
            <p className="text-muted margin-bottom-none">We return money within 30 days</p>
          </div>
          <div className="col-md-4 col-sm-6 text-center mb-30"><img className="d-block w-90 img-thumbnail rounded-circle mx-auto mb-3" src="img/services/03.png" alt="Support" />
            <h6>24/7 Customer Support</h6>
            <p className="text-muted margin-bottom-none">Friendly 24/7 customer support</p>
          </div>
          <div className="col-md-4 col-sm-6 text-center mb-30"><img className="d-block w-90 img-thumbnail rounded-circle mx-auto mb-3" src="img/services/04.png" alt="Payment" />
            <h6>Secure Online Payment</h6>
            <p className="text-muted margin-bottom-none">We posess SSL / Secure Certificate</p>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}