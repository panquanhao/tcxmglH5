<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    // let that=this
    // // history.pushState(null, null, document.URL);
    // window.addEventListener('popstate', function() {
    //   let a=document.URL.split('#')
    //   console.log(a)
    //   // let b
    //   // if(that.$store.state.tcxmglIndex.length!=0){          
    //   //   b=a[0]+'#'+that.$store.state.tcxmglIndex[that.$store.state.tcxmglIndex.length-1].path
    //   // }else{
    //   //   b=a[0]
    //   // }
    //   history.pushState(null, null, document.URL); 
    // });  
  }
}
</script>

<style lang="stylus">
#app
  width: 100vw;
  height: 100vh;
  color:#202020
</style>
