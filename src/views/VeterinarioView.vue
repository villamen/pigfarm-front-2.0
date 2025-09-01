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
            <button @click="irAEditarPerfil">Editar perfil</button>
            <button @click="cerrarSesion">Cerrar sesión</button>

          </div>
        </div>
      </div>
    </nav>

    <main></main>
    <!-- ENCABEZADO -->
    <header class="header">
      <br>
      <h2>Bienvenido, {{ rol }} </h2>
    </header>

    <!-- CONTROLES -->
    <div class="controls">
      <div class="search-bar">
        <input v-model="busquedaId" @input="filtrarPorId" placeholder="Numero identificativo" />
      </div>
      <div class="action-buttons">
        <button @click="irAvacunas">+ Consultar vacunas</button>
        <!-- <button v-if="rol !== 'granjero'" @click="irAAgregarCerdo">+ Añadir</button> -->
      </div>
    </div>

    <!-- TABLA -->
    <table class="tabla-cerdos">
      <thead>
        <tr>
        <th>Numero-identificativo</th>
          <th>Descripción</th>
          <th>Disponible</th>
          <th>Edad (meses)</th>
          <th>Peso</th>
          <th>Raza</th>
          <!-- <th>Fecha creación</th> -->
          <th>Ingreso</th>
          <th>Modificación</th>
          <th>Salida</th>
          <th>Modificado por</th>
        </tr>
      </thead>
   <tbody>
        <tr v-for="cerdo in cerdosFiltrados" :key="cerdo.id" @click="mostrarModal(cerdo)">
          <!-- <td>{{ cerdo.id }}</td> -->
          <td>{{ cerdo.numero_arete }}</td>
          <td>{{ cerdo.descripcion }}</td>
          <td>{{ cerdo.disponible ? 'Sí' : 'No' }}</td>
          <td>{{ cerdo.edad }}</td>
          <td>{{ cerdo.peso }}</td>
          <td>{{ cerdo.raza }}</td>
          <!-- <td>{{ cerdo.fecha_creacion }}</td> -->
          <td>{{ cerdo.fecha_ingreso }}</td>
          <td>{{ cerdo.fecha_modificacion || '-' }}</td>
          <td>{{ cerdo.fecha_salida || '-' }}</td>
          <td>{{ cerdo.modificado_por || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <!-- MODAL DETALLES -->
    <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <h2>Detalles del Cerdo 🐷</h2>
        <p><strong>ID:</strong> {{ cerdoSeleccionado.id }}</p>
        <p><strong>Descripción:</strong> {{ cerdoSeleccionado.descripcion }}</p>
        <p><strong>Edad:</strong> {{ cerdoSeleccionado.edad }} meses</p>
        <p><strong>Peso:</strong> {{ cerdoSeleccionado.peso }} kg</p>
        <p><strong>Raza:</strong> {{ cerdoSeleccionado.raza }}</p>
        <p><strong>Ingreso:</strong> {{ cerdoSeleccionado.fecha_ingreso }}</p>
        <p><strong>Creación:</strong> {{ cerdoSeleccionado.fecha_creacion }}</p>
        <p><strong>Modificado por:</strong> {{ cerdoSeleccionado.modificado_por || '-' }}</p>

        <div class="modal-actions">
          <button class="editar-btn" @click="mostrarVacunas(cerdoSeleccionado.id)">💉 Ver vacunas</button>
          <button class="editar-btn" @click="abrirModalVacunar">💊 Aplicar vacuna</button>

          <button class="editar-btn" @click="cerrarModal">❌ Cerrar</button>
        </div>
      </div>
    </div>
    <!-- MODAL REGISTRAR VACUNAS -->






    <!-- MODAL APLICAR VACUNA -->
    <div v-if="modalVacunarVisible" class="modal-overlay" @click.self="cerrarModalVacunar">
      <div class="modal-content-agregar">
        <h2>Aplicar Vacuna 💉</h2>
        <form @submit.prevent="aplicarVacuna">
          <!-- <label>ID de la vacuna:</label>
          <input type="number" v-model.number="nuevaVacuna.id_vacuna" required /> -->
          <label>Vacuna:</label>
          
          <select v-model="nuevaVacuna.id_vacuna" required>
            <option disabled value="">-- Selecciona una vacuna --</option>
            <option v-for="vacuna in vacunasDisponibles" :key="vacuna.id_vacuna" :value="vacuna.id_vacuna">
              {{ vacuna.nombre }}
            </option>
          </select>


          <label>Fecha de aplicación:</label>
          <input type="date" v-model="nuevaVacuna.fecha_aplicacion" required />

          <label>Descripción:</label>
          <textarea v-model="nuevaVacuna.descripcion" required></textarea>

          <div class="form-buttons">
            <button type="submit">Aplicar</button>
            <button type="button" @click="cerrarModalVacunar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL VACUNAS -->
    <div v-if="modalVacunasVisible" class="modal-overlay" @click.self="cerrarModalVacunas">
      <div class="modal-vacunas-content">
        <h2>Historial de Vacunas ⏳</h2>
        <div v-if="vacunas.length > 0" class="vacunas-scroll">
          <ul>
            <li v-for="vacuna in vacunas" :key="vacuna.id_aplicacion">
              <strong>Nombre:{{ vacuna.nombre_vacuna }}</strong> - <p><Strong>Fecha de aplicacion:</Strong> {{
                vacuna.fecha_aplicacion }} </p>
              <Strong>Descripcion:</Strong>
              <p>{{ vacuna.descripcion }}</p>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>El animal no tiene vacunas aplicadas.</p>
        </div>
        <button class="editar-btn" @click="cerrarModalVacunas">❌ Cerrar</button>
      </div>
    </div>


    <footer class="footer">
      <p>&copy; 2025 <strong class="nombre">PigFarm.</strong> Todos los derechos reservados.</p>
    </footer>



  </div>
</template>
<script>
import Swal from 'sweetalert2';
import RegistrarVacunaModal from '@/components/RegistrarVacunaModal.vue';

export default {
  components: {

    RegistrarVacunaModal
  },

  data() {
    return {
      cerdos: [],
      busquedaId: '',
      rol: 'veterinario',
      nombreUsuario: '',
      modalVisible: false,
      mostrarOpciones: false,
      modalVacunasVisible: false,
      mostrarModalRegistrarVacuna: false,

      cerdoSeleccionado: {},
      vacunas: [],
      //vacunasDisponibles: [],
      modalVacunarVisible: false,
      listaVacunas: [],
      nuevaVacuna: {
        id_vacuna: '',
        fecha_aplicacion: '',
        descripcion: ''
      },
      vacunasDisponibles: []

    }
  },
  computed: {
    cerdosFiltrados() {
      if (this.busquedaId) {
        return this.cerdos.filter(c => c.id.toString().includes(this.busquedaId))
      }
      return this.cerdos
    }
  },
  methods: {
    toggleMenu() {
      this.mostrarOpciones = true;
    },
    volverAPrincipal() {
      const rol = localStorage.getItem('rol');

      if (rol === 'veterinario') {
        this.$router.push('/veterinario');
      } else if (rol === 'administrador') {
        this.$router.push('/administrador');
      } else {
        this.$router.push('/granjero'); // Por defecto
      }
    },


    cerrarSesion() {
      localStorage.clear()
      this.$router.push('/login')
    },
    irAEditarPerfil() {
      this.$router.push('/editar-perfil')
    },

    irAvacunas() {
      this.$router.push('/vacunas');
    },
    async obtenerCerdos() {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/cerdos', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      this.cerdos = data
    },
    obtenerNombreUsuario() {
      const nombre = localStorage.getItem('nombre')
      this.nombreUsuario = nombre || 'Usuario'
    },
    mostrarModal(cerdo) {
      this.cerdoSeleccionado = cerdo
      this.modalVisible = true
    },
    cerrarModal() {
      this.modalVisible = false
    },

    abrirModalVacunar() {
      this.nuevaVacuna = {
        id_vacuna: '',
        fecha_aplicacion: '',
        descripcion: ''
      };
      this.modalVisible = false;
      this.modalVacunarVisible = true;
      this.obtenerVacunasDisponibles();
    },
    abrirModalRegistrarVacuna() {
      this.mostrarModalRegistrarVacuna = true;
    },
    cerrarModalRegistrarVacuna() {
      this.mostrarModalRegistrarVacuna = false;
    },



    async mostrarVacunas(id) {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/cerdos/${id}/historial`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      this.vacunas = data
      this.modalVisible = false
      this.modalVacunasVisible = true
    },
    cerrarModalVacunas() {
      this.modalVacunasVisible = false
    },

    async obtenerVacunasDisponibles() {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/vacunas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        this.vacunasDisponibles = data;
      } catch {
        alert('Error al obtener vacunas');
      }
    },

    async aplicarVacuna() {
      const token = localStorage.getItem('token');
      try {
        this.obtenerVacunasDisponibles();
        const res = await fetch('http://localhost:5000/aplicaciones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            id_cerdo: this.cerdoSeleccionado.id,
            id_vacuna: this.nuevaVacuna.id_vacuna,
            fecha_aplicacion: this.nuevaVacuna.fecha_aplicacion,
            descripcion: this.nuevaVacuna.descripcion
          })
        });

        const data = await res.json();
        if (res.ok) {
          // alert('Vacuna aplicada correctamente');
          await Swal.fire({
            icon: 'success',
            text: 'Vacuna aplicada correctamente',
            confirmButtonColor: '#3085d6'
          });
          this.cerrarModalVacunar();
        } else {
          // alert(data.error || 'Error al aplicar vacuna');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Error al aplicar vacuna',
            confirmButtonColor: '#d33'
          });
        }
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Error de conexión',
          confirmButtonColor: '#d33'
        });
      }
    },


    // NUEVO: Abrir modal para aplicar vacuna


    // NUEVO: Enviar vacuna al backend


    cerrarModalVacunar() {
      this.modalVacunarVisible = false
    }
  },


  mounted() {
    const token = localStorage.getItem('token')
    if (!token) {
      this.$router.push('/login')
    } else {
      this.obtenerCerdos()
      this.obtenerNombreUsuario()
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
  padding-right: 75px;
}

.nombre-usuario:hover {
  color: #0055aa;
  text-shadow: 0 0 5px rgba(0, 85, 170, 0.5);
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

.tabla-cerdos tbody tr {
  cursor: pointer; /* Hace que aparezca la manito */
}

.tabla-cerdos tbody tr:hover {
  background-color: #f5f5f5; /* Opcional: resalta la fila al pasar el mouse */
}


.editar-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s;
  background-color: #0055aa;
}

.editar-btn:hover {
  transform: scale(1.2);
  background-color: #1976d2;
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
.modal-content p {
  padding: 0.1rem 0.75rem;
  border: 0.5px solid #ccc;
  border-radius: 6px;
  margin: 0rem 0;
  background-color: #fafafa; /* opcional, resalta */
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
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 15px;
  margin-right: 20px;
}

.modal-content h2{
 
  font-weight: 100;
}

.modal-content button {
  margin-top: 1rem;
  margin-right: 0.5rem;
  padding: 0.5rem 1.5rem;
  background-color: #1976d2;
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
  font-weight: 100;
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
  background-color: #0055aa;
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
  font-weight: 100;
}
.modal-content-agregar button{
  background-color: #0055aa;
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
  border-color: #0055aa;
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
   transition: background-color 0.2s;
}

.form-buttons button:first-child {
  background-color: #0055aa;
  color: white;
}

.form-buttons button:hover {
  background-color: #15b1ca;
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

.footer .nombre {
  font-family: 'Lilita one';
}
</style>
