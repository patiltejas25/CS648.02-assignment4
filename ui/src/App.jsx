/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "no-alert": "off" */

// eslint-disable-next-line react/prefer-stateless-function
class ProductTable extends React.Component {
  render() {
    const { products } = this.props;
    const productRows = products.map(product => <ProductRow key={product.id} product={product} />);
    return (
      <div>
        <p> Showing all available products </p>
        {' '}
        <hr />
        <table className="bordered-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {productRows}
          </tbody>
        </table>
      </div>
    );
  }
}

// eslint-disable-next-line react/prefer-stateless-function
class ProductRow extends React.Component {
  render() {
    const { product } = this.props;
    return (
      <tr>
        <td>{product.name}</td>
        <td>
          $
          {product.price}
        </td>
        <td>{product.category}</td>
        <td><a href={product.image}>View</a></td>
      </tr>
    );
  }
}


class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    const { addProduct } = this.props;
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      category: form.category.value,
      price: form.price.value.slice(1),
      name: form.name.value,
      image: form.image.value,
    };
    addProduct(product);
  }

  render() {
    return (
      <section>
        <p>Add a new product to inventory</p>
        <hr />
        <form name="productAdd" onSubmit={this.handleSubmit}>
          <div className="product-inventory">
            <label htmlFor="category">
              Category:
              <select name="category" id="category">
                <option value="Accessories">Accessories</option>
                <option value="Shirts">Shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Jackets">Jackets</option>
                <option value="Sweaters">Sweaters</option>
              </select>
            </label>
          </div>
          <div className="product-inventory">
            <label htmlFor="Price">
              Price:
              <input type="text" id="price" defaultValue="$" />
            </label>
          </div>
          <div className="product-inventory">
            <label htmlFor="name">
              Product Name:
              <input type="text" id="name" />
            </label>
          </div>
          <div className="product-inventory">
            <label htmlFor="image">
              Image URL:
              <input type="text" id="image" />
            </label>
          </div>

          <button type="submit">Add Product</button>
        </form>
      </section>

    );
  }
}


class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.addProduct = this.addProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      productList {
        id name  price category
        image 
      }
    }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    this.setState({ products: result.data.productList });
  }

  async addProduct(product) {
    // product.id = this.state.products.length + 1;
    // const newProductList = this.state.products.slice();
    // newProductList.push(product);
    // this.setState({ products: newProductList });

    // const query = `mutation {
    //   productAdd(product:{
    //     name: "${product.name}",
    //     price: "${product.price}",
    //     category: "${product.category}",
    //     image: "${product.image}",
    //   }) {
    //     id
    //   }
    // }`;

    const query = `mutation productAdd($product: ProductInputs!) {
        productAdd(product: $product) {
          id
        }
      }`;


    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { product } }),
    });

    this.loadData();
  }

  render() {
    const { products } = this.state;
    return (
      <React.Fragment>
        <h1>My Company Inventory</h1>
        <ProductTable products={products} />
        <ProductAdd addProduct={this.addProduct} />
      </React.Fragment>
    );
  }
}

const element = <ProductList />;
ReactDOM.render(element, document.getElementById('contents'));
