import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import GranjeroView from '../views/GranjeroView.vue'
import EditarPerfil from '../views/EditarPerfil.vue'
import VeterinarioView from '../views/VeterinarioView.vue'
import VeterinarioVacunasView from '../views/VeterinarioVacunasView.vue'
import AdminUsuariosView from '../views/AdminUsuariosView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/editar-perfil',
    name: 'EditarPerfil',
    component: EditarPerfil
  },
  
   {
    path: '/veterinario',
    name: 'veterinario',
    component: VeterinarioView
  },
  {
    path: '/vacunas',
    name: 'Vacunas',
    component: VeterinarioVacunasView
  },
  {
    path: '/admin',
    name: 'administrador',
    component: AdminUsuariosView
  },


  {
    path: '/granjero',
    name: 'granjero',
    component: GranjeroView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/* 🔐 Protección de rutas privadas */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const rutasProtegidas = ['/granjero', '/editar-perfil']; // añade más si hace falta

  if (rutasProtegidas.includes(to.path) && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;














































// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue'),
//     },
//   ],
// })

// export default router
