(function () {
  const usernameInput = document.querySelector('#username');
  const passwordInput = document.querySelector('#password');
  const submitBtn = document.querySelector('#btnSubmit');
  const api = 'https://vue3-course-api.hexschool.io/';
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // get user value
    let userData = {
      username: usernameInput.value,
      password: passwordInput.value,
    };
    axios
      .post(`${api}admin/signin`, userData)
      .then((res) => {
        // if success save token & expired
        if (res.data.success) {
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
          location.href = 'products.html';
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
})();
