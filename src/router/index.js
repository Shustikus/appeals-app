import Vue from 'vue';
import Router from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import AppealsList from '../views/AppealsList.vue';
import store from '../store';

Vue.use(Router);

const router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: LoginPage,
        },
        {
            path: '/',
            name: 'Appeals',
            component: AppealsList,
            meta: {requiresAuth: true},
        },
    ],
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated;

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            next({name: 'Login'});
        } else {
            next();
        }
    } else if (to.name === 'Login' && isAuthenticated) {
        next({name: 'Appeals'});
    } else {
        next();
    }
});

export default router;
