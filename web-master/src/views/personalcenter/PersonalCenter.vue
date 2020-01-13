<template>
  <div>
    <aside-nav></aside-nav>
    <!--<home-footer></home-footer>-->
  </div>

</template>

<script>

  import AsideNav from '../../components/asidenav/AsideNav'
  // import PersonalPage from '../components/personalpage/PersonalPage'
  // import ModifyLoginPwd from '../components/accountmanage/ModifyLoginPwd'
  // import ModifyBindTel from '../components/accountmanage/ModifyBindTel'
  import HomeFooter from "../../components/HomeFooter"
  export default {
    name: "PersonalCenter",
    components:{
      'aside-nav':AsideNav,
      'home-footer':HomeFooter
    },
    data() {
      return {}
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>
