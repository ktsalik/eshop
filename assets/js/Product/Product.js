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

      initToasts();
      initFavouriteButtons();
      initProductGallery();
    });
  }, []);

  function addToBasket(product) {
    basket.addProduct({
      ...product,
      quantity: 1,
    });
  }
  
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
            <div className="product-gallery">
              {/* <span className="product-badge text-danger">30% Off</span> */}
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
              <div className="sp-buttons mt-2 mb-2">
                <button className="btn btn-outline-secondary btn-sm btn-wishlist" data-toggle="tooltip" title="Whishlist"><i className="icon-heart"></i></button>
                <button className="btn btn-primary"
                  data-toast
                  data-toast-type="success"
                  data-toast-position="topRight"
                  data-toast-icon="icon-circle-check"
                  data-toast-title={product.name}
                  data-toast-message="Το προϊόν προστέθηκε στο καλάθι σας!"
                  onClick={() => addToBasket(product)}
                >
                  <i className="icon-bag"></i> Add to Cart
                </button>
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