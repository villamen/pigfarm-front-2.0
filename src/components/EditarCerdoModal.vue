<template>
  <div>
    <!-- MODAL OVERLAY -->
    <div class="modal-overlay" v-if="mostrarEditar">
      <div class="editar-modal">
        <!-- IMAGEN AL LADO -->
        <div class="imagen-lateral">
          <img class="imagen" src="/editar-cerdo2.jpg" alt="Editar cerdo" />
        </div>

        <!-- FORMULARIO DE EDICIÓN -->
        <div class="formulario-edicion">
          <h2>Editar Cerdo</h2>
          <form @submit.prevent="guardarCambios">
            <label>Raza:</label>
            <br>
            <input v-model="cerdoEdit.raza"  />
            <br>
            <label>Numero-identificativo:</label>
            <br>
            <input v-model="cerdoEdit.numero_arete"  />
            <br>
            <br>
            <label>Descripción:</label>
            <br>
            <br>
            <textarea v-model="cerdoEdit.descripcion" required rows="3" cols="30"></textarea>
            <br>
            <label>Fecha de ingreso:</label>
            
            <input v-model="cerdoEdit.fecha_ingreso" type="date" />
            <br>
            <label>Fecha de salida:</label>
            <input v-model="cerdoEdit.fecha_salida" type="date" />
            <br>
            <br>
            <label>¿Disponible?</label>
            
            <select v-model="cerdoEdit.disponible">
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
            <br>
            <label>Edad (meses):</label>
            <input v-model.number="cerdoEdit.edad" type="number"  />
            <br>
            <label>Peso (kg):</label>
            <input v-model.number="cerdoEdit.peso" type="float" step="0.01" />

            <div class="botones">
              <button type="submit">💾 Guardar</button>
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
  props: ['mostrarEditar', 'cerdoSeleccionado'],
  data() {
    return {
      cerdoEdit: {}
    }
  },
  watch: {
    cerdoSeleccionado: {
      handler(nuevo) {
        if (nuevo) {
          this.cerdoEdit = { ...nuevo } // Clonar el objeto para no modificar directamente
        }
      },
      immediate: true
    }
  },
  methods: {
    async guardarCambios() {
      const token = localStorage.getItem('token')
      try {
        const res = await fetch(`http://localhost:5000/cerdos/${this.cerdoEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(this.cerdoEdit)
        })

        if (res.ok) {
          // alert('Cerdo actualizado')
          await Swal.fire({
            icon: 'success',
            text: 'Cerdo actualizado',
            confirmButtonColor: '#3085d6'
          });
          this.$emit('actualizado')
          this.cerrarModal()
        } else {
          const err = await res.json()
          // alert(err.error || 'Error al actualizar')
           Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Error al actualizar',
            confirmButtonColor: '#d33'
          });
        }
      } catch (e) {
        // alert('Error de conexión')
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Error de conexión',
            confirmButtonColor: '#d33'
          });
        
      }
    },
    cerrarModal() {
      this.$emit('cerrar')
    }
  }
}
</script>

<style scoped>
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
  /* ajusta según necesites */
  max-height: 720px;
  width: auto;
  height: auto;
  object-fit: contain;
  /* o "cover", dependiendo del efecto deseado */
}

.formulario-edicion {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  margin-left: 4rem;
  /*  */
    border-radius: 10px;
  /* box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); */
  transition: all 0.3s ease-in-out;
  color: #333;
 
}

.formulario-edicion h2 {
  margin-bottom: 1rem;
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
  border: 1px solid #d0d7de;       /* Borde más suave */
  border-radius: 8px;
  margin-top: 0.4rem;
  font-size: 1rem;
  background-color: #f9fafb;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.formulario-edicion input:focus,
.formulario-edicion select:focus,
.formulario-edicion textarea:focus {
  border-color: #60a5fa; /* azul claro */
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3); /* halo azul */
  outline: none;
  background-color: #fff;
}


.botones {
  margin-top: 1.5rem;
  display: flex;
  justify-content:center;  /* Alineados a la derecha */
  gap: 5rem;                  /* Espacio entre botones reducido */
}

.botones button {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #0055aa;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.botones button:hover {
   background-color: #15b1ca;
  color: white;
  transform: scale(1.05); /* Efecto de agrandamiento leve */
}

.botones button:active {
  transform: scale(0.98); /* Simula presión */
}

.botones button[type="button"] {
  background-color: #d1d5db; /* Gris más claro */
  color: #333;
}

.botones button[type="button"]:hover {
  background-color: #9ca3af;
}

/* **** */

/* **** */

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
