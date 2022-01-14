<template>
 <div id="div1">
  <p>欢迎使用 <b>wangEditor</b> 富文本编辑器</p>
 </div>
</template>

<script>
    import SideMenu from "./inc/SideMenu";
    import E from 'wangeditor';
    export default {
        name: "Index",
        components: {
            SideMenu
        },
     mounted () {
      // wangeditor
      var elementById = document.getElementById("div1");
      console.log('1`1222',elementById)
      var editor = new E('#div1')
      // 配置 server 接口地址
      editor.config.uploadImgServer = 'https://testapi.socialmarketings.com/web/ueditor/uploadimagenew';
      editor.config.uploadFileName = 'upfile'
      editor.create()
     },
    }
</script>

<style scoped>



</style>