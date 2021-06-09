const app = {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/',
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      const api = `${this.apiUrl}admin/signin`;
      axios
        .post(api, this.user)
        .then((res) => {
          if (res.data.success) {
            const { token, expired } = res.data;
            document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
            location.href = 'products.html';
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {},
};
Vue.createApp(app).mount('#app');
