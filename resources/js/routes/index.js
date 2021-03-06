
import Login from "../pages/auth/Login"
import Home from "../pages/Home"
import Welcome from "../pages/Welcome"
import VueRouter from 'vue-router'
import Vue from 'vue'
import guest from '../middlewares/guest'
import store from '../store/index'
import SignleDiscussion from '../pages/SingleDiscussion.vue'
import Index from '../pages/Index'

import middlewarePipeline from '../routes/middlewarePipeline'
import checkAuth from "../middlewares/auth-check"
import auth from "../middlewares/auth"
import Register from "../pages/auth/Register"



Vue.use(VueRouter)




const router = new VueRouter({
    mode : 'history',
    routes : [
        {
            path : '/',
            component : Welcome ,
            name : 'welcome'
        },
        {
            path : '/login',
            component : Login ,
            name : 'login',
            meta : {
                middleware : [guest]
            }
        },
        {
            path : '/register',
            component : Register ,
            name : 'register',
            meta : {
                middleware : [guest]
            }

        },
        {
            path : '/home',
            component : Home ,
            name : 'home' ,
            meta : {
                middleware : [auth,checkAuth]
            }
            ,
            children: [
              {
                path: "",
                component: Index,
                name: "home",
              },
              {
                path: "discussion/:channel/:discussion",
                component: SignleDiscussion,
                name: "discussion"
              }
            ]
        },

    ]
})

router.beforeEach((to, from, next) => {
    if (!to.meta.middleware) return next();
    const middleware = to.meta.middleware;
    const context = {
        to,
        from,
        next,
        store
    };
    return middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1)
    });
});


export default router ;

