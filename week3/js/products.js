(function () {
  // modal
  let productModal;
  let delProductModal;
  // vue
  const app = {
    data() {
      return {
        apiUrl: 'https://vue3-course-api.hexschool.io',
        apiPath: 'butters',
        data: [],
        tempProduct: {
          imagesUrl: [],
        },
        isNew: false,
      };
    },
    mounted() {
      // 元件掛載完成才綁定燈箱
      productModal = new bootstrap.Modal(document.getElementById('productModal'), {
        keyboard: false,
      });

      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
        keyboard: false,
      });

      // token 判斷
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      if (token === '') {
        alert('您沒有登入哦，請重新登入');
        location.href = 'login.html';
      }
      axios.defaults.headers.common.Authorization = token;
      // 取得資料
      this.getProductsData();
    },
    methods: {
      // 取得資料
      getProductsData() {
        axios
          .get(`${this.apiUrl}/api/${this.apiPath}/admin/products?page=1`)
          .then((res) => {
            if (res.data.success) {
              this.data = res.data.products;
              console.log(this.data);
            } else {
              alert(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      // modal(新增、編輯) 送出
      updateProductData() {
        this.tempProduct.imageUrl = '';
        // type 為新增
        let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        let apiType = 'post';

        // type 為編輯
        if (!this.isNew) {
          url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
          apiType = 'put';
        }
        axios[apiType](url, { data: this.tempProduct }).then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            productModal.hide();
            this.getProductsData();
          } else {
            alert(res.data.message);
          }
        });
      },
      // modal 判斷何種類型
      openModal(btnType, item) {
        if (btnType === 'new') {
          this.tempProduct = {
            imagesUrl: [],
          };
          this.isNew = true;
          productModal.show();
        } else if (btnType === 'edit') {
          this.tempProduct = { ...item };
          this.isNew = false;
          productModal.show();
        } else if (btnType === 'delete') {
          this.tempProduct = { ...item };
          delProductModal.show();
        }
      },

      // modal 刪除商品
      deleteProduct() {
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        axios
          .delete(url)
          .then((res) => {
            if (res.data.success) {
              alert(res.data.message);
              delProductModal.hide();
              this.getProductsData();
            } else {
              alert(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },

      // 新增圖片
      addImg() {
        this.tempProduct.imagesUrl.push(this.tempProduct.imageUrl);
        this.tempProduct.imageUrl = '';
      },

      // 刪除圖片
      deleteImg(key) {
        this.tempProduct.imagesUrl.splice(key, 1);
      },
    },
  };
  Vue.createApp(app).mount('#app');
})();
