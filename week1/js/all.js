(function () {
  // form dom
  const itemName = document.querySelector('#itemName');
  const oldPrice = document.querySelector('#oldPrice');
  const newPrice = document.querySelector('#newPrice');
  const btnSubmit = document.querySelector('#btnSubmit');
  // table dom
  const myForm = document.querySelector('.form');
  const listsCount = document.querySelector('.listsCount');
  const btnClearAll = document.querySelector('.btnClearAll');
  const tableBody = document.querySelector('.listsBoard tbody');

  // original data
  let data = [
    {
      itemName: '產品1',
      oldPrice: 100,
      newPrice: 50,
      isActive: false,
    },
    {
      itemName: '產品2',
      oldPrice: 100,
      newPrice: 50,
      isActive: true,
    },
  ];

  // render
  function renderData() {
    let str = '';
    if (data.length === 0) {
      str = `<tr>
      <td colspan="5">目前沒有產品</td>
    </tr>`;
      // return;
    }
    data.forEach((item, index) => {
      str += `
      <tr>
      <th scope="row">${item.itemName}</th>
      <td>$${item.oldPrice}</td>
      <td>$${item.newPrice}</td>
      <td>
        <div class="form-group form-check pl-0 mb-0">
          <label class="form-check-label" for="checkActive-${index}">
            <input type="checkbox" class="form-check-input" data-id="${index}" id="checkActive-${index}" 
            ${item.isActive ? 'checked' : ''}>
            <div class="btn">
              <div class="btn-ball"></div>
            </div>
            <span class="checkText">${item.isActive ? '啟用' : '未啟用'}</span>
          </label>
        </div>
      </td>
      <td><button type="button" class="btn btn-danger rounded-0" data-id="${index}">刪除</button></td>
    </tr>
      `;
    });
    tableBody.innerHTML = str;
    listsCount.textContent = data.length;
  }

  renderData();

  function deleteList(id) {
    data.splice(id, 1);
    renderData();
  }

  function toggleCheckBox(id) {
    data[id].isActive = !data[id].isActive;
    renderData();
  }

  // form submit
  btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const itemNameValue = itemName.value;
    const oldPriceValue = oldPrice.value;
    const newPriceValue = newPrice.value;
    if (itemNameValue == '' || oldPriceValue == '' || newPriceValue == '') {
      alert('請填寫產品資料');
      return;
    }
    const itemData = {
      itemName: itemNameValue,
      oldPrice: oldPriceValue * 1,
      newPrice: newPriceValue * 1,
      isActive: false,
    };
    data.push(itemData);
    myForm.reset();
    renderData();
  });

  // button clear all
  btnClearAll.addEventListener('click', (e) => {
    e.preventDefault();
    if (data.length == 0) {
      alert('目前無產品哦');
      return;
    }
    data = [];
    renderData();
    alert('刪除產品成功!');
  });

  // table click events
  tableBody.addEventListener('click', (e) => {
    const target = e.target.nodeName;
    const id = e.target.dataset.id;
    if (target !== 'BUTTON' && target !== 'INPUT') return;
    target === 'BUTTON' && deleteList(id);
    target === 'INPUT' && toggleCheckBox(id);
  });
})();
