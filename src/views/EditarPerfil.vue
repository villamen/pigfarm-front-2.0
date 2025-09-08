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
          <span class="nombre-usuario">Hola, {{ nombreUsuario }}</span>
          <div v-if="mostrarOpciones" class="dropdown-menu">
            <button @click="cerrarSesion">Cerrar sesión</button>
            <button class="btn-volver" @click="volverAPrincipal">⏪ Volver</button>
          </div>
        </div>
      </div>
    </nav>
<main></main>

    <!-- ENCABEZADO -->
    <header class="header">
      <h2>Editar perfil</h2>
    </header>

    <div class="formulario-perfil">
      <form class="formulario-perfil-form" @submit.prevent="guardarCambios">
        <label>Nombre:</label>
        <input v-model="usuario.nombre" required />
        <br>
        <label>Apellido:</label>
        <input v-model="usuario.apellido" required />
        <br>
        <label>Dirección (email):</label>
        <input type="email" v-model="usuario.direccion" required />
        <br>

        <label>Teléfono:</label>
        <input type="tel" v-model="usuario.telefono" required />
        <br>

        <label>Rol:</label>
        <input :value="usuario.rol" disabled />
        <br>

        <label>Nueva contraseña:</label>
        <input type="password" v-model="usuario.password" placeholder="Dejar en blanco si no desea cambiarla" />

        <div class="botones">
          <button type="submit">Guardar</button>
          <button type="button" @click="cancelar">Cancelar</button>
        </div>
      </form>
    </div>
    <footer class="footer">
  <p>&copy; 2025 <strong class="nombre">PigFarm.</strong> Todos los derechos reservados.</p>
</footer>
  </div>
</template>

<script>
import Swal from 'sweetalert2'; 
export default {
  data() {
    return {
      nombreUsuario: '',
      mostrarOpciones: false,
      usuario: {
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        rol: '',
        password: ''
      }
    }
  },
  methods: {
    volverAPrincipal() {
      const rol = localStorage.getItem('rol');

      if (rol === 'veterinario') {
        this.$router.push('/veterinario');
      } else if (rol === 'administrador') {
        this.$router.push('/admin');
      } else {
        this.$router.push('/granjero'); // Por defecto
      }
    }
    ,
    toggleMenu() {
      this.mostrarOpciones = !this.mostrarOpciones
    },
    irAEditarPerfil() {
      this.$router.push('/editar-perfil')
    },
    cerrarSesion() {
      localStorage.clear()
      this.$router.push('/login')
    },
    cancelar() {
      this.$router.go(-1)
    },
    async obtenerDatos() {
      const token = localStorage.getItem('token')
      const res = await fetch('https://pigfarm-back-2-0.onrender.com/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      this.usuario = { ...data, password: '' }
      this.nombreUsuario = data.nombre
    },
    async guardarCambios() {
      const token = localStorage.getItem('token')
      const datos = { ...this.usuario }
      if (!datos.password) delete datos.password

      const res = await fetch('https://pigfarm-back-2-0.onrender.com/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      })
      const result = await res.json()
      if (res.ok) {
        // alert('Perfil actualizado exitosamente')
        await Swal.fire({
            icon: 'success',
            text: 'Perfil actualizado exitosamente',
            confirmButtonColor: '#3085d6'
          });
        this.$router.go(-1)
      } else {
        // alert(result.error || 'Error al actualizar perfil')
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Error al actualizar perfil',
            confirmButtonColor: '#d33'
          });
      }
    }
  },
  mounted() {
    this.obtenerDatos()
  }
}

</script>

<style scoped>

main {
  padding-top: 50px; /* Ajusta según la altura de tu navbar */
}
.formulario-perfil {
  /* max-width: 600px; */
  width: 800px;
  height: 600px !important;
  /* Se adapta a pantallas más pequeñas */
  margin: 2rem auto;
  background: white;
  padding: 2rem;
  height: auto;
  /* opcional si prefieres que el contenido defina la altura */
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* .formulario-perfil form {
  width: 100% !important;
  padding: 0 !important;
  max-width: none !important;
} */


.formulario-perfil label {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;

}

.formulario-perfil input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  margin-top: 40px;
  border-radius: 8px;
  font-size: 1rem;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.formulario-perfil input:focus {
  border-color: #1976d2;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.4);
  outline: none;
}

.botones {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.botones button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.botones button:first-child {
  background-color: #1976d2;
  color: white;
}

.botones button:last-child {
  background-color: #ccc;
  color: #333;
}

.usuario-icono {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 0.5rem;
  border: 2px solid #fff;
}

/*  */

/* NAVBAR SUPERIOR */
main {
  padding-top: 50px; /* Ajusta según la altura de tu navbar */
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
  z-index: 1000; /* Asegura que se superponga sobre otros elementos */
}


.navbar-left h1 {
  margin-bottom: 60px;
  font-size: 3.2rem;
  color: black;
  font-family: 'Lilita one', sans-serif;
}

.header h2 {
  margin: 2;
  font-size: 4rem;
  color: black;
  font-family: 'Lilita one', sans-serif;
  text-align: center;
}

.navbar-right {
  display: flex;
  align-items: center;
}


.nombre-usuario {
  font-weight: bold;
  color: #003366;
  font-size: 1rem;
  padding-right: 75px;
}

/* MENU DESPLEGABLE */

.user-menu {
  position: relative;
  cursor: pointer;
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

.usuario-icono-g {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 0.5rem;
  margin-top: 20px;
  margin-right: 5px;

  border: 2px solid #fff;
}
/* footer */
.footer {
  display:block;
  background-color: white; /* gris oscuro */
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

.footer .nombre{
  font-family: 'Lilita one';
}
</style>
