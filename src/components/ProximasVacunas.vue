<template>
  <div class="vacunas-container">
    <h2 class="titulo">Próximas vacunas (7 días)</h2>
    
    <div v-if="alertas.length">
      <table>
        <thead>
          <tr>
            <th>Cerdo ID</th>
            <th>Vacuna</th>
            <th>Fecha aplicación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(alerta, index) in alertas" :key="index">
            <td>{{ alerta.cerdo_id }}</td>
            <td>{{ alerta.vacuna }}</td>
            <td>{{ formatearFecha(alerta.fecha_aplicacion) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No hay vacunas programadas para los próximos 7 días.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProximasVacunas',
  data() {
    return {
      alertas: [],
    };
  },
  mounted() {
    const token = localStorage.getItem('token');
    axios.get('https://pigfarm-back-2-0.onrender.com/alertas/proximas-vacunas', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      this.alertas = response.data;
    })
    .catch(error => {
      console.error("Error al cargar próximas vacunas:", error);
    });
  },
  methods: {
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleDateString();
    },
  }
};
</script>

<style scoped>
.vacunas-container {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}
.titulo {
  margin-bottom: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
</style>
