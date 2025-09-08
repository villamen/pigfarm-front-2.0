<template>
  <div class="login-page">
    <div class="login-box">
      <h1 class="title">PigFarm</h1>
      <div class="icon-user"></div>
      <input v-model="email" type="email" placeholder="Correo electrónico" class="input" />
      <input v-model="password" type="password" placeholder="Contraseña" class="input" />
      <!-- <select v-model="rol" class="input">
        <option disabled value="">Selecciona tu rol</option>
        <option value="granjero">Granjero</option>
        <option value="veterinario">Veterinario</option>
        <option value="administrador">Administrador</option>
      </select> -->
      <button @click="iniciarSesion" class="btn-login">Iniciar Sesión</button>
      <!-- <p class="forgot-password">¿Olvidaste tu contraseña?</p> -->
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'; 
export default {
  
  data() {
    
    return {
      email: '',
      password: '',
      rol: ''
    };
  },
  methods: {

  

    async iniciarSesion() {
      try {
        const res = await fetch('https://pigfarm-back-2-0.onrender.com/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            direccion: this.email,
            password: this.password
            // rol: this.rol
          })
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('rol', data.rol); // ← usamos el rol que devuelve el backend
          localStorage.setItem('nombre', data.nombre || '');
          localStorage.setItem('apellido', data.apellido || '');

          // alerta bonita de bienvenida
          await Swal.fire({
            icon: 'success',
            title: `¡Bienvenido, ${data.nombre}!`,
            text: 'Inicio de sesión exitoso',
            confirmButtonColor: '#3085d6'
          });

          // Redirige según el rol detectado
          if (data.rol === 'granjero') {
            this.$router.push('/granjero');
          } else if (data.rol === 'administrador') {
            this.$router.push('/admin');
          } else if (data.rol === 'veterinario') {
            this.$router.push('/veterinario');
          }

        } else {
           //alert(data.error || 'Error al iniciar sesión');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Error al iniciar sesión',
            confirmButtonColor: '#d33'
          });
        }
      } catch (err) {
        console.error(err);
        // alert('No se pudo conectar con el servidor.');
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor.',
          confirmButtonColor: '#d33'
        });
      }
    }


  }
};
</script>



<!-- <template>
  <div class="login-container">
    <h1>PigFarm</h1>
    <input v-model="direccion" placeholder="Usuario (correo)" />
    <input v-model="contrasena" type="password" placeholder="Contraseña" />
    
    <select v-model="rol" required>
      <option disabled value="">Seleccione su rol</option>
      <option value="administrador">Administrador</option>
      <option value="granjero">Granjero</option>
      <option value="veterinario">Veterinario</option>
    </select>

    <button @click="iniciarSesion">Iniciar sesión</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      direccion: '',
      contrasena: '',
      rol: ''
    }
  },
  methods: {
    async iniciarSesion() {
      try {
        const res = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            direccion: this.direccion,
            password: this.contrasena,
            rol: this.rol
          })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          this.$router.push(`/${this.rol}`);  // Redirige a /granjero, /veterinario, etc.
        } else {
          alert(data.error || 'Credenciales inválidas');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error de conexión con el servidor');
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: auto;
  gap: 10px;
}
</style> -->
