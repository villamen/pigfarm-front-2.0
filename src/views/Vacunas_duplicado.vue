<template>
  <div class="granjero-container">
    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="navbar-left">
        <h1>PigFarm</h1>
      </div>
      <div class="navbar-right user-menu">
        <img src="/usuario.png" alt="Usuario" class="usuario-icono" />
        <div class="menu-container" @click="toggleMenu">
          <span class="nombre-usuario">Hola, {{ nombreUsuario }}</span>
          <div v-if="mostrarOpciones" class="dropdown-menu">
            <button @click="irAEditarPerfil">Editar perfil</button>
            <button @click="cerrarSesion">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- ENCABEZADO -->
    <header class="header">
      <h2>Gestión de Vacunas</h2>
    </header>

    <!-- CONTROLES -->
    <div class="controls">
      <div class="search-bar">
        <input v-model="busqueda" placeholder="Buscar vacuna por nombre o ID..." />
      </div>
      <div class="action-buttons">
        <button @click="abrirModalRegistrarVacuna">+ Registrar vacuna</button>
      </div>
    </div>

    <!-- TABLA DE VACUNAS -->
    <table class="tabla-cerdos">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Fecha vencimiento</th>
          <th>Creación</th>
          <th>Modificación</th>
          <th>Accionesj</th>
          <th>Lucho</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vacuna in vacunasFiltradas" :key="vacuna.id_vacuna">
          <td>{{ vacuna.id_vacuna }}</td>
          <td>{{ vacuna.nombre }}</td>
          <td>{{ vacuna.descripcion }}</td>
          <td>{{ vacuna.fecha_vencimiento }}</td>
          <td>{{ vacuna.fecha_creacion }}</td>
          <td>{{ vacuna.fecha_modificacion || '-' }}</td>
          <td>
            <button class="editar-btn" @click="editarVacuna(vacuna)">✏️</button>
            <button class="editar-btn" @click="eliminarVacuna(vacuna.id_vacuna)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODAL REGISTRAR VACUNA -->
    <RegistrarVacunaModal :mostrar="mostrarModalRegistrarVacuna" @cerrar="mostrarModalRegistrarVacuna = false" />

    <!-- MODAL EDITAR VACUNA (se puede crear un componente reutilizable si deseas) -->
  </div>
</template>

<script>
import Swal from 'sweetalert2'; 
import RegistrarVacunaModal from '@/components/RegistrarVacunaModal.vue';

export default {
  components: { RegistrarVacunaModal },
  data() {
    return {
      vacunas: [],
      busqueda: '',
      mostrarModalRegistrarVacuna: false,
      mostrarOpciones: false,
      nombreUsuario: ''
    }
  },
  computed: {
    vacunasFiltradas() {
      const term = this.busqueda.toLowerCase();
      return this.vacunas.filter(v =>
        v.nombre.toLowerCase().includes(term) ||
        v.id_vacuna.toString().includes(term)
      );
    }
  },
  methods: {
    toggleMenu() {
      this.mostrarOpciones = !this.mostrarOpciones;
    },
    cerrarSesion() {
      localStorage.clear();
      this.$router.push('/login');
    },
    irAEditarPerfil() {
      this.$router.push('/editar-perfil');
    },
    abrirModalRegistrarVacuna() {
      this.mostrarModalRegistrarVacuna = true;
    },
    async obtenerVacunas() {
      const token = localStorage.getItem('token');
      const res = await fetch('https://pigfarm-back-2-0.onrender.com/vacunas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      this.vacunas = data;
    },
    async eliminarVacuna(id) {
      if (!confirm('¿Estás seguro de eliminar esta vacuna?')) return;
      const token = localStorage.getItem('token');
      const res = await fetch(`https://pigfarm-back-2-0.onrender.com/vacunas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // alert('Vacuna eliminada');
        await Swal.fire({
            icon: 'success',
            text: 'Vacuna eliminada',
            confirmButtonColor: '#3085d6'
          });
        this.obtenerVacunas();
      } else {
        // alert(data.error || 'Error al eliminar');
           Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Error al eliminar',
            confirmButtonColor: '#d33'
          });
      }
    },
    obtenerNombreUsuario() {
      const nombre = localStorage.getItem('nombre')
      this.nombreUsuario = nombre || 'Usuario'
    },
    editarVacuna(vacuna) {
      // Aquí podrías abrir un modal de edición
      alert('Funcionalidad de edición aún no implementada');
    }
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
    } else {
      this.obtenerVacunas();
      this.obtenerNombreUsuario();
    }
  }
}
</script>

<style scoped>
/* Puedes reutilizar los estilos existentes del componente de cerdo o aplicar tus propios estilos */
</style>