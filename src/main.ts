import { Vue } from 'vue-property-decorator';
import Routes from './main.routes';
import VueRouter from 'vue-router';
import Index from './Index.vue';

Vue.use(VueRouter);

new Vue({
    el: '#app-content',
    router: Routes,
    render(h) {
        return h(Index);
    }
});