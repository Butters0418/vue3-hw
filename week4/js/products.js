import pagination from './pagination.js';

// modal
let productModal;
let delProductModal;

// vue
const app = Vue.createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      apiPath: 'butters',
      data: [],
      tempImagesUrl: '',
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,
      pagination: {},
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
    getProductsData(page = 1) {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`)
        .then((res) => {
          if (res.data.success) {
            this.data = res.data.products;
            this.pagination = res.data.pagination;
            console.log(res.data);
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // modal(新增、編輯) 送出
    updateProductData(tempProduct) {
      // type 為新增
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let apiType = 'post';

      // type 為編輯
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${tempProduct.id}`;
        apiType = 'put';
      }
      axios[apiType](url, { data: tempProduct }).then((res) => {
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
        console.log(this.tempProduct);
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
  },
});

// [元件] 分頁
app.component('pagination', pagination);

// [元件] 燈箱-產品新增、編輯
app.component('productsModal', {
  data() {
    return {
      tempImagesUrl: '',
    };
  },
  props: ['tempProduct', 'isNew'],
  template: `
  <div id="productModal" href="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span v-if="isNew">新增產品</span>
          <span v-else>編輯產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-1">
              <div class="form-group">
                <label for="imageUrl">輸入主要圖片網址</label>
                <input v-model="tempProduct.imageUrl" type="text" class="form-control" placeholder="請輸入主要圖片連結">
              </div>
              <img class="img-fluid mb-3" :src="tempProduct.imageUrl">

              <div class="form-group">
                <label for="imageUrl">輸入其他圖片網址</label>
                <input v-model="tempImagesUrl" type="text" class="form-control" placeholder="請輸入其他圖片連結">
              </div>
              <img class="img-fluid" :src="tempImagesUrl">
              <div class="mb-4">
                <button class="btn btn-outline-primary btn-sm d-block w-100" type="button" @click="addImg">
                  新增圖片
                </button>
              </div>
              <!-- 圖片 列表 -->
              <div v-for="(item,key) in tempProduct.imagesUrl" class="mb-4">
                <img class="img-fluid" :src="item" :key="key">
                <button class="btn btn-outline-danger btn-sm d-block w-100" type="button" @click="deleteImg(key)">
                  刪除圖片
                </button>
              </div>
            </div>

            <div>

            </div>
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="title">標題</label>
              <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="tempProduct.title">
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input id="category" type="text" class="form-control" placeholder="請輸入分類" v-model="tempProduct.category">
              </div>
              <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="tempProduct.unit">
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model.number="tempProduct.origin_price">
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input id="price" type="number" min="0" class="form-control" placeholder="請輸入售價" v-model.number="tempProduct.price">
              </div>
            </div>
            <div class="form-group">
              <label for="title">評價</label>
              <input id="score" type="number" min="0" max="10" class="form-control" placeholder="請輸入評分" v-model="tempProduct.score">
            </div>
            <hr>

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea id="description" type="text" class="form-control" placeholder="請輸入產品描述" v-model="tempProduct.description">
                </textarea>
            </div>
            <div class="form-group">
              <label for="content">說明內容</label>
              <textarea id="description" type="text" class="form-control" placeholder="請輸入說明內容" v-model="tempProduct.content">
                </textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input id="is_enabled" class="form-check-input" type="checkbox" :true-value="1" :false-value="0" v-model="tempProduct.is_enabled">
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click="$emit('update-product',tempProduct)">
          確認
        </button>
      </div>
    </div>
  </div>
</div>`,
  methods: {
    // 新增圖片
    addImg() {
      if (!this.tempProduct.imagesUrl) this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push(this.tempImagesUrl);
      this.tempImagesUrl = '';
    },
    // 刪除圖片
    deleteImg(key) {
      this.tempProduct.imagesUrl.splice(key, 1);
    },
  },
});

// [元件] 燈箱-刪除產品
app.component('delProductModal', {
  template: `
  <div id="delProductModal" href="delProductModal" class="modal fade" tabindex="-1" aria-labelledby="delProductModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 id="delProductModalLabel" class="modal-title">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="$emit('deleteProduct')">
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
});

app.mount('#app');
