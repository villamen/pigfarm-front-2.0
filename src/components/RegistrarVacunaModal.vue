<template>
  <div>
    <!-- MODAL OVERLAY -->
    <div class="modal-overlay" v-if="mostrar">
      <div class="editar-modal">
        <!-- IMAGEN AL LADO -->
        <div class="imagen-lateral">
          <img class="imagen" src="/editar-cerdo2.jpg" alt="Registrar vacuna" />
        </div>

        <!-- FORMULARIO DE REGISTRO DE VACUNA -->
        <div class="formulario-edicion">
          <h2>Registrar Vacuna</h2>
          <form @submit.prevent="guardarVacuna">
            <label>Nombre de la vacuna:</label>
            <br>
            <input v-model="nuevaVacuna.nombre" required />
            <br>
            <br>
            <label>Descripción:</label>
            <textarea v-model="nuevaVacuna.descripcion" rows="3" cols="30"></textarea>
            <!-- <br>
            <label>Fecha de vencimiento:</label>
            <input v-model="nuevaVacuna.fecha_vencimiento" type="date" required /> -->
            <br>
            <div class="botones">
              <button type="submit">Guardar</button>
              <button type="button" @click="cerrarModal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'; 
export default {
  props: ['mostrar'],
  data() {
    return {
      nuevaVacuna: {
        nombre: '',
        descripcion: '',
        fecha_vencimiento: ''
      }
    }
  },
  methods: {
    async guardarVacuna() {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/vacunas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(this.nuevaVacuna)
        });

        if (res.ok) {
          await Swal.fire({
            icon: 'success',
            text: 'Vacuna registrada exitosamente',
            confirmButtonColor: '#3085d6'
          });
          this.$emit('cerrar');
        } else {
          const err = await res.json();
          // alert(err.error || 'Error al registrar la vacuna');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Error al registrar la vacuna',
            confirmButtonColor: '#d33'
          });
        }
      } catch (error) {
        alert('Error de conexión');
      }
    },
    cerrarModal() {
      this.$emit('cerrar');
    }
  }
}
</script>

<style scoped>
/* Reutiliza los estilos ya proporcionados sin cambios */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.editar-modal {
  display: flex;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  max-width: 800px;
  width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
}

.imagen-lateral {
  background-color: #f0f0f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.imagen {
  max-width: 650px;
  max-height: 650px;
  width: auto;
  height: auto;
  object-fit: contain;
}

.formulario-edicion {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  margin-left: 4rem;
  border-radius: 10px;
  color: #333;
}

.formulario-edicion h2 {
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
  font-family: 'Lilita one';
  color: black;
}

.formulario-edicion label {
  margin-top: 2rem;
  font-weight: bold;
}

.formulario-edicion input,
.formulario-edicion select,
.formulario-edicion textarea {
  padding: 0.5rem 1rem;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  margin-top: 2rem;
  font-size: 1rem;
  background-color: #f9fafb;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.formulario-edicion input:focus,
.formulario-edicion select:focus,
.formulario-edicion textarea:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
  outline: none;
  background-color: #fff;
}

.botones {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 5rem;
}

.botones button {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.botones button:hover {
  background-color: #2563eb;
  transform: scale(1.05);
}

.botones button:active {
  transform: scale(0.98);
}

.botones button[type="button"] {
  background-color: #d1d5db;
  color: #333;
}

.botones button[type="button"]:hover {
  background-color: #9ca3af;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>