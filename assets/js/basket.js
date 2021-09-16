class Basket {
  products = [];
  onProductAddFns = [];
  onProductRemoveFns = [];

  onAddProduct(fn) {
    this.onProductAddFns.push(fn);
  }

  onRemoveProduct(fn) {
    this.onProductRemoveFns.push(fn);
  }
  
  addProduct(product) {
    const productIndex = this.products.findIndex((p) => p.id === product.id);
    if (productIndex > -1) {
      this.products[productIndex].quantity++;
    } else {
      this.products.push(product);
    }
    this.onProductAddFns.forEach((fn) => {
      fn();
    });
    this.store();
  }

  removeProduct(productId) {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    this.products.splice(productIndex, 1);
    this.onProductRemoveFns.forEach((fn) => {
      fn();
    });
    this.store();
  }

  store() {
    const storageBasket = {};
    this.products.forEach((product) => {
      storageBasket[product.id] = product.quantity;
    });
    localStorage.setItem('basket', JSON.stringify(storageBasket));
  }
}

const basket = new Basket();
window.basket = basket;