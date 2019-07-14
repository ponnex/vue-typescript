import VueRouter from 'vue-router';

const Home = () => import('./pages/home/home.component');

const MainRoutes = new VueRouter({
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});


export default MainRoutes;