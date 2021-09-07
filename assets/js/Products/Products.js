function Products(props) {
  const [t, i18n] = ReactI18next.useTranslation('translations');

  const [category, setCategory] = useState({
    id: props.match.params.categoryId,
  });
  const [products, setProducts] = useState([]);
  const [pagesCount, setPagesCount] = useState(0);
  const [page, setPage] = useState(1);

  function getProducts(page = 1) {
    axios.get(`${baseUrl}api/categories/${props.match.params.categoryId}/products?page=${page}`).then((response) => {
      setProducts(response.data.products);
      setPagesCount(response.data.pagesCount);
    });
  }

  useEffect(() => {
    axios.get(`${baseUrl}api/categories/${props.match.params.categoryId}`).then((response) => {
      setCategory(response.data);
    });
    $('.site-backdrop').click();
    
    if (props.match.params.page) {
      setPage(props.match.params.page);
      getProducts(props.match.params.page);
    } else {
      getProducts(page);
    }
    window.scroll(0, 0);

    return () => {
    }
  }, [props.match.params.categoryId, props.match.params.page]);

  return (
    <div className="Products">
      <div className="page-title">
        <div className="container">
          <div className="column">
            <h1>{category.parent ? category.parent.name : ''} {category.name}</h1>
          </div>
          <div className="column">
            <ul className="breadcrumbs">
              <li><a href="index.html">Home</a></li>
              <li className="separator">&nbsp;</li>
              {
                category.parent
                  ? <React.Fragment>
                      <li><Link to={`/categories/${category.parent.id}/1`}>{category.parent ? category.parent.name : ''}</Link></li>
                      <li className="separator">&nbsp;</li>
                    </React.Fragment>
                  : ''
              }
              <li>{category.name}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container padding-bottom-3x mb-1">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="shop-toolbar padding-bottom-1x mb-2">
              <div className="column">
                <div className="shop-sorting">
                  {/* <label htmlFor="sorting">Sort by:</label>
                  <select className="form-control" id="sorting">
                    <option>Popularity</option>
                    <option>Low - High Price</option>
                    <option>High - Low Price</option>
                    <option>Avarage Rating</option>
                    <option>A - Z Order</option>
                    <option>Z - A Order</option>
                  </select> */}
                  <span className="text-muted">Showing:&nbsp;</span><span>{((page - 1) * 10) + 1} - {(((page - 1) * 10)) + products.length} items</span>
                </div>
              </div>
            </div>
            {
              products.map((product, i) => {
                return (
                  <div
                    className="product-card product-list"
                    key={i}
                  >
                    <Link to={`/products/${product.id}`} className="product-thumb">
                      {/* <div className="product-badge text-danger">50% Off</div> */}
                      <img src={product.images[0]} alt="Product" />
                    </Link>
                    <div className="product-info">
                      <h3 className="product-title">
                        <Link to={`/products/${product.id}`}>{product.name}</Link>
                      </h3>
                      <h4 className="product-price">
                        {
                          product.discount_price
                            ? <del>{parseFloat(product.price).toFixed(2)}&nbsp;€</del>
                            : ''
                        }
                        {parseFloat(product.discount_price || product.price).toFixed(2)}&nbsp;€
                      </h4>
                      <p className="hidden-xs-down" dangerouslySetInnerHTML={{__html: product.description.substr(0, 100) + '...'}}></p>
                      <div className="product-buttons">
                        <button className="btn btn-outline-secondary btn-sm btn-wishlist" data-toggle="tooltip" title="Whishlist"><i className="icon-heart"></i></button>
                        <button className="btn btn-outline-primary btn-sm" data-toast data-toast-type="success" data-toast-position="topRight" data-toast-icon="icon-circle-check" data-toast-title="Product" data-toast-message="successfuly added to cart!">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                );
              })
            }
            <div className="pt-2">
              <nav className="pagination">
                <div className="column">
                  <ul className="pages">
                  {
                      parseInt(page) > 2
                        ? <li>
                            <Link to={`/categories/${props.match.params.categoryId}/1`}>1</Link>
                          </li>
                        : ''  
                    }
                    {
                      parseInt(page) > 1
                        ? <li>
                            <Link to={`/categories/${props.match.params.categoryId}/${parseInt(page) - 1}`}>{parseInt(page) - 1}</Link>
                          </li>
                        : ''  
                    }
                    <li className="active">  
                      <Link to={`/categories/${props.match.params.categoryId}/${parseInt(page)}`}>{parseInt(page)}</Link>
                    </li>
                    {
                      parseInt(page) + 1 < pagesCount
                        ? <li>
                            <Link to={`/categories/${props.match.params.categoryId}/${parseInt(page) + 1}`}>{parseInt(page) + 1}</Link>
                          </li>
                        : ''
                    }
                    {
                      pagesCount > 1 && parseInt(page) + 1 <= pagesCount
                        ? <li>
                            <Link to={`/categories/${props.match.params.categoryId}/${pagesCount}`}>{pagesCount}</Link>
                          </li>
                        : ''
                    }
                  </ul>
                </div>
                <div className="column text-right hidden-xs-down">
                  {
                    parseInt(props.match.params.page || 1) + 1 <= pagesCount
                      ? <Link className="btn btn-outline-secondary btn-sm" to={`/categories/${props.match.params.categoryId}/${parseInt(props.match.params.page || 1) + 1}`}>
                          Next
                          &nbsp;
                          <i className="icon-arrow-right"></i>
                        </Link>
                      : ''
                  }
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}