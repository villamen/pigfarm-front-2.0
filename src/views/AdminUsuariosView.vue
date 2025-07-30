<template>
  <div class="granjero-container">
    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="navbar-left" @click="volverAPrincipal" style="cursor: pointer;">
        <h1><img src="/granjero.png" alt="Usuario" class="usuario-icono-g" />PigFarm</h1>
      </div>
      <div class="navbar-right user-menu">
        <img src="/usuario.png" alt="Usuario" class="usuario-icono" />
        <div class="menu-container" @click="toggleMenu">
          <span class="nombre-usuario">Hola admin, {{ nombreUsuario }}</span>
          <div v-if="mostrarOpciones" class="dropdown-menu">
            <button @click="irAEditarPerfil">Editar perfil</button>
            <button @click="cerrarSesion">Cerrar sesión</button>
            <button class="btn-volver" @click="volverAPrincipal">⏪ Volver</button>
          </div>
        </div>
      </div>
    </nav>
    <main></main>
    <header class="header">
      <h2>Gestión de Usuarios</h2>
    </header>

    <!-- CONTROLES -->
    <div class="controls">
      <div class="search-bar">
        <input v-model="busqueda" placeholder="Buscar por nombre o ID..." />
      </div>
      <div class="action-buttons">
        <button @click="abrirModalRegistrarUsuario">+ Registrar usuario</button>
        <button @click="irAvacunas">+ Consultar vacunas</button>
        <button @click="irAcerdos">+ Consultar cerdos</button>
      </div>
    </div>

    <!-- TABLA DE USUARIOS -->
    <table class="tabla-cerdos">
      <thead>
        <tr>
          <th>ID</th>
          <th>Rol</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
          <td>{{ usuario.id }}</td>
          <td>{{ usuario.rol }}</td>
          <td>{{ usuario.nombre }}</td>
          <td>{{ usuario.apellido }}</td>
          <td>{{ usuario.direccion }}</td>
          <td>{{ usuario.telefono }}</td>
          <td>
            <button class="editar-btn" @click="abrirModalEditarUsuario(usuario)">✏️</button>
            <button class="editar-btn" @click="abrirModalEliminarUsuario(usuario)">🗑️</button>


          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODALES -->
    <RegistrarUsuarioModal :mostrar="mostrarModalRegistrarUsuario" @cerrar="mostrarModalRegistrarUsuario = false" />
    <EditarUsuarioModal :mostrar="mostrarModalEditarUsuario" :usuario="usuarioSeleccionado"
      @cerrar="cerrarModalEditarUsuario" @actualizado="obtenerUsuarios" />

    <!-- MODAL DE CONFIRMACIÓN ELIMINAR USUARIO -->
    <div v-if="mostrarModalEliminarUsuario" class="modal-overlay-eliminar"
      @click.self="cerrarConfirmacionEliminarUsuario">
      <div class="modal-content-eliminar">
        <img src="/icono-cerdo.png" alt="Usuario" style="width: 60px; display: block; margin: auto" />
        <h3 style="text-align: center; margin: 1rem 0">
          ¿Está seguro que desea eliminar a <strong>{{ usuarioSeleccionado?.nombre }} {{ usuarioSeleccionado?.apellido
          }}</strong>?
        </h3>
        <div style="display: flex; justify-content: center; gap: 1rem;">
          <button @click="confirmarEliminacionUsuario"
            style="background-color: #e53935; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px">Sí</button>
          <button @click="cerrarConfirmacionEliminarUsuario"
            style="background-color: #ccc; padding: 0.5rem 1.5rem; border: none; border-radius: 6px">No</button>
        </div>
      </div>
    </div>


    <footer class="footer">
      <p>&copy; 2025 <strong class="nombre">PigFarm.</strong> Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script>
import Swal from 'sweetalert2'; 
import RegistrarUsuarioModal from '@/components/RegistrarUsuarioModal.vue';
import EditarUsuarioModal from '@/components/EditarUsuarioModal.vue';

export default {
  components: { RegistrarUsuarioModal, EditarUsuarioModal },
  data() {
    return {
      usuarios: [],
      busqueda: '',
      mostrarModalRegistrarUsuario: false,
      mostrarModalEditarUsuario: false,
      usuarioSeleccionado: null,
      mostrarOpciones: false,
      mostrarModalEliminarUsuario: false,
      usuarioSeleccionado: null,

      nombreUsuario: ''
    }
  },
  computed: {
    usuariosFiltrados() {
      const term = this.busqueda.toLowerCase();
      return this.usuarios.filter(u =>
        u.nombre.toLowerCase().includes(term) ||
        u.id.toString().includes(term)
      );
    }
  },
  methods: {
    abrirModalEliminarUsuario(usuario) {
      this.usuarioSeleccionado = usuario;
      this.mostrarModalEliminarUsuario = true;
    },
    irAvacunas() {
      this.$router.push('/vacunas');
    },
    irAcerdos() {
      this.$router.push('/granjero');
    },

    cerrarConfirmacionEliminarUsuario() {
      this.mostrarModalEliminarUsuario = false;
    },
    async confirmarEliminacionUsuario() {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:5000/usuarios/${this.usuarioSeleccionado.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          // alert('Usuario eliminado correctamente');
           await Swal.fire({
            icon: 'success',
            text: 'Usuario eliminado exitosamente',
            confirmButtonColor: '#3085d6'
          });
          this.obtenerUsuarios();
        } else {
          // alert(data.error || 'Error al eliminar');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Error al eliminar el usuario',
            confirmButtonColor: '#d33'
          });
        }
      } catch (error) {
        alert('Error de conexión');
      } finally {
        this.mostrarModalEliminarUsuario = false;
        this.usuarioSeleccionado = null;
      }
    },

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
    volverAPrincipal() {
      const rol = localStorage.getItem('rol');
      if (rol === 'veterinario') this.$router.push('/veterinario');
      else if (rol === 'administrador') this.$router.push('/admin');
      else this.$router.push('/granjero');
    },
    abrirModalRegistrarUsuario() {
      this.mostrarModalRegistrarUsuario = true;
    },
    abrirModalEditarUsuario(usuario) {
      this.usuarioSeleccionado = usuario;
      this.mostrarModalEditarUsuario = true;
    },

    cerrarModalEditarUsuario() {
      this.mostrarModalEditarUsuario = false;
    },
    async obtenerUsuarios() {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      // Unificamos granjeros y veterinarios
      this.usuarios = [
        ...data.granjeros.map(g => ({ ...g, rol: 'granjero' })),
        ...data.veterinarios.map(v => ({ ...v, rol: 'veterinario' }))
      ];
    },
    async eliminarUsuario(usuario) {
      if (!confirm(`¿Estás seguro de eliminar a ${usuario.nombre}?`)) return;
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/usuarios/${usuario.rol}/${usuario.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert('Usuario eliminado');
        this.obtenerUsuarios();
      } else {
        alert(data.error || 'Error al eliminar');
      }
    },
    obtenerNombreUsuario() {
      const nombre = localStorage.getItem('nombre');
      this.nombreUsuario = nombre || 'Usuario';
    }
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
    } else {
      this.obtenerUsuarios();
      this.obtenerNombreUsuario();
    }
  }
}
</script>

<style scoped>
/* AGREGO ETO NUEVO EN UN  INTENTO DE QUE SEA VEA MEJOR */


* {
  padding: 0px;
  margin: 0px;

}

main {
  padding-top: 50px;
  /* Ajusta según la altura de tu navbar */
}

/* NAVBAR SUPERIOR */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 2rem;
  background: linear-gradient(90deg, #84fab0 0%, #8fd3f4 100%);
  border-bottom: 3px solid #69c0ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  /* Asegura que se superponga sobre otros elementos */
}


.navbar-left h1 {
  margin-bottom: 12px;
  font-size: 3.2rem;
  color: black;
  font-family: 'Lilita one', sans-serif;
}

.header h2 {
  margin-top: 10px;
  margin: 2;
  font-size: 2.5rem;
  color: black;
  font-family: 'Lilita one', sans-serif;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.usuario-icono {
  width: 36px;
  height: 36px;
  border-radius: 50%;

  margin-right: 0.5rem;
  border: 2px solid #fff;
}

.usuario-icono-g {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 0.5rem;
  margin-top: 20px;
  margin-right: 5px;

  /* border: 2px solid #fff; */
}

.nombre-usuario {
  font-weight: bold;
  color: #003366;
  font-size: 1rem;
}

/* CONTENIDO PRINCIPAL */
.granjero-container {
  padding: 2rem;
  background: #f0f9ff;
  min-height: 100vh;
}

.header h1 {
  font-size: 2.2rem;
  font-weight: bold;
  color: #1d3557;
}

/* CONTROLES */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  padding: 1rem;
  background-color: #e0f7fa;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.search-bar input {
  padding: 0.6rem;
  width: 220px;
  border: 1px solid #90caf9;
  border-radius: 10px;
  outline: none;
  font-size: 1rem;
}

.action-buttons button {
  margin-left: 0.5rem;
  background-color: #1976d2;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.action-buttons button:hover {
  background-color: #1565c0;
  transform: scale(1.05);
}

/* TABLA */
.tabla-cerdos {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.tabla-cerdos th {
  background-color: #f1f8ff;
  color: #333;
  padding: 0.75rem;
  border-bottom: 2px solid #90caf9;
  text-align: left;
  font-weight: 600;
}

.tabla-cerdos td {
  padding: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
}

.editar-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.editar-btn:hover {
  transform: scale(1.2);
  color: #1976d2;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out forwards;

}

.modal-overlay-eliminar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out forwards;

}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 490px;
  height: 490px;
  max-width: 90%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out forwards;
}


.modal-content-eliminar {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  height: 260px;
  max-width: 90%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out forwards;
}

.modal-content h2 {
  text-align: center;
  font-family: 'Lilita one';
  font-size: 35px;
  margin-bottom: 50px;
}

.modal-content p {

  margin: 15px 15px;

}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-actions button {
  margin-top: 1rem;
  margin-right: 0.5rem;
  padding: 0.5rem 1.5rem;
  background-color: #3bd6ef;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 15px;
  margin-right: 20px;
}

.modal-content button {
  margin-top: 1rem;
  margin-right: 0.5rem;
  padding: 0.5rem 1.5rem;
  background-color: #3bd6ef;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 15px;
  margin-right: 20px;
}

.modal-actions button:hover {
  background-color: #15b1ca;
  color: white;
}


/* MODAL DE VACUNAS */

.modal-vacunas-content h2 {
  text-align: center;
  font-family: 'Lilita one';
  font-size: 35px;
  margin-bottom: 50px;
}

.modal-vacunas-content p {

  margin: 15px 15px;

}

.modal-vacunas-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 490px;
  height: 490px;
  max-width: 90%;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out forwards;
}

.modal-vacunas-content button {
  margin-top: 1rem;
  margin-right: 0.5rem;
  padding: 0.5rem 1.5rem;
  background-color: #3bd6ef;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 15px;
  margin-right: 20px;
}

.vacunas-scroll {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
}

/* MODAL AGREGAR */
.modal-content-agregar {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  height: 600px;
  width: 600px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out forwards;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-content-agregar h2 {
  text-align: center;
  font-size: 2.1875rem;
  color: black;
  font-family: 'Lilita one';
}

.modal-content-agregar input,
.modal-content-agregar select,
.modal-content-agregar textarea {
  width: 100%;
  margin-bottom: 20px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.modal-content-agregar input:focus,
.modal-content-agregar select:focus,
.modal-content-agregar textarea:focus {
  border-color: #3bd6ef;
  box-shadow: 0 0 0 3px rgba(59, 214, 239, 0.3);
  outline: none;
}

.modal-content-agregar textarea {
  resize: vertical;
  min-height: 80px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.form-buttons button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.form-buttons button:first-child {
  background-color: #3bd6ef;
  color: white;
}

.form-buttons button:last-child {
  background-color: #ccc;
}

/* MENU DESPLEGABLE */

.user-menu {
  position: relative;
  cursor: pointer;
}

.nombre-usuario {
  font-weight: bold;
  color: #003366;
  font-size: 1rem;
  padding-right: 75px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 40px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 50;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
}

.dropdown-menu button {
  background: none;
  border: none;
  padding: 0.5rem;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
}

.dropdown-menu button:hover {
  background-color: #f0f0f0;
}

/* footer */
.footer {
  display: block;
  background-color: white;
  /* gris oscuro */
  color: black;
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  margin-top: 2rem;
  border-top: 1px solid #ccc;
  position: relative;
  bottom: 0;
  width: 100%;
}

.modal-content-eliminar {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  height: 260px;
  max-width: 90%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out forwards;
}


.footer .nombre {
  font-family: 'Lilita one';
}
</style>
