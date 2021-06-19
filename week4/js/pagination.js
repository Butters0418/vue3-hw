export default {
  props: ['pages'],
  template: `
  <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item" :class="{'disabled': pages.current_page === 1}">
      <a class="page-link" href="#" aria-label="Previous"
      @click.prevent="$emit('page-btn',pages.current_page -1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item" 
    v-for="(item,key) in pages.total_pages" 
    :key="key" 
    :class="{'active':item === pages.current_page}">
      <a class="page-link" href="#" @click="$emit('page-btn',item)">{{item}}</a>
    </li>
    <li class="page-item" :class="{'disabled': pages.current_page ===  pages.total_pages}">
      <a class="page-link" href="#" aria-label="Next"
      @click.prevent="$emit('page-btn',pages.current_page + 1)">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>
  `,
  created() {
    // setTimeout(() => {
    console.log(this.pages);
    // }, 2000);
  },
};
