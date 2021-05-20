const app = {
  data: {
    apiUrl: 'https://vue3-course-api.hexschool.io',
    apiPath: 'butters',
    data: [],
  },

  getProductsData() {
    axios
      .get(`${this.data.apiUrl}/api/${this.data.apiPath}/admin/products?page=1`)
      .then((res) => {
        if (res.data.success) {
          this.data.data = res.data.products;
          this.renderData();
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },

  renderData() {
    const listsCount = document.querySelector('.listsCount');
    const tableBody = document.querySelector('.listsBoard tbody');
    let str = '';
    if (this.data.data.length === 0) {
      str = `<tr>
      <td colspan="5">目前沒有產品</td>
    </tr>`;
      // return;
    }
    this.data.data.forEach((item, index) => {
      str += `
      <tr>
      <th scope="row">${item.title}</th>
      <td>$${item['origin_price']}</td>
      <td>$${item.price}</td>
      <td>
        <div class="form-group form-check pl-0 mb-0">
          <label class="form-check-label" for="checkActive-${index}">
            <input type="checkbox" class="form-check-input" data-id="${index}" id="checkActive-${index}" 
            ${item['is_enabled'] ? 'checked' : ''}>
            <div class="btn">
              <div class="btn-ball"></div>
            </div>
            <span class="checkText">${item['is_enabled'] ? '啟用' : '未啟用'}</span>
          </label>
        </div>
      </td>
      <td><button type="button" class="btn btn-danger rounded-0" data-id="${
        item.id
      }">刪除</button></td>
    </tr>
      `;
    });
    tableBody.innerHTML = str;
    listsCount.textContent = this.data.data.length;

    // products list delete event
    tableBody.addEventListener('click', (e) => {
      const target = e.target.nodeName;
      const id = e.target.dataset.id;
      if (target !== 'BUTTON') return;
      this.deleteList(id);
    });
  },

  deleteList(id) {
    axios.delete(`${this.data.apiUrl}/api/${this.data.apiPath}/admin/product/${id}`).then((res) => {
      if (res.data.success) {
        alert(res.data.message);
        this.getProductsData();
      } else {
        alert(res.data.message);
      }
    });
  },

  checkLogin() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    axios
      .post(`${this.data.apiUrl}/api/user/check`)
      .then((res) => {
        if (res.data.success) {
          // alert('登入成功!');
          this.getProductsData();
        } else {
          alert(res.data.message);
          location.href = 'login.html';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },

  init() {
    this.checkLogin();
  },
};
app.init();
