import productModal from './productModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'butters';

const app = Vue.createApp({
  data() {
    return {
      // loading
      loadingStatus: {
        loadingItem: '',
        loadingCart: false,
        loadingOrder: false,
      },
      // 產品列表
      products: [],
      // 產品暫存
      product: {},
      // 表單
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
    };
  },
  methods: {
    // 取得產品列表
    getProductsData() {
      const url = `${apiUrl}/api/${apiPath}/products`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
          console.log(this.products);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    // 燈箱
    openModal(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/product/${item.id}`;
      axios
        .get(api)
        .then((res) => {
          this.product = res.data.product;
          this.$refs.userProductModal.openModal();
          this.loadingStatus.loadingItem = '';
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    // 加入購物車(兩顆按鈕)
    addToCart(id, qty = 1) {
      this.loadingStatus.loadingItem = id;
      console.log(id, qty);
      const cartData = {
        product_id: id,
        qty,
      };
      const api = `${apiUrl}/api/${apiPath}/cart`;
      axios
        .post(api, { data: cartData })
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    // 取得購物車列表
    getCart() {
      const api = `${apiUrl}/api/${apiPath}/cart`;
      axios
        .get(api)
        .then((res) => {
          // console.log(res);
          this.cart = res.data.data;
          console.log(this.cart);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    // 更新購物車
    updateCart(item) {
      this.loadingStatus.loadingItem = item.id;
      const cartData = {
        product_id: item.product.id,
        qty: item.qty,
      };
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      axios
        .put(api, { data: cartData })
        .then((res) => {
          this.getCart();
          this.loadingStatus.loadingItem = '';
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    // 刪除購物車單一產品
    delProduct(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      axios
        .delete(api)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
          this.loadingStatus.loadingItem = '';
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    // 刪除購物車
    delCart() {
      if (this.cart.carts.length === 0) {
        alert('購物車沒有東西哦');
        return;
      }
      this.loadingStatus.loadingCart = true;
      const api = `${apiUrl}/api/${apiPath}/carts`;
      axios
        .delete(api)
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          this.getCart();
          this.loadingStatus.loadingCart = false;
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    // 送出表單
    onSubmit() {
      if (this.cart.carts.length === 0) {
        alert('購物車沒有東西哦');
        return;
      }
      this.loadingStatus.loadingOrder = true;
      const api = `${apiUrl}/api/${apiPath}/order`;
      axios
        .post(api, { data: this.form })
        .then((res) => {
          alert(res.data.message);
          this.getCart();
          this.loadingStatus.loadingOrder = false;
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
  created() {
    this.getProductsData();
    this.getCart();
  },
});

// form validate
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.component('userProductModal', productModal);
app.mount('#app');
