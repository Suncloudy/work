<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {

      return {
        // phoneNumber: '',
        // verifyCode: '',
      }

    },
  }
</script>

<style>
  @import '/styles/css/index.scss';

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #F6F6F6;
  }


</style>
