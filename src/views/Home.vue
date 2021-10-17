<template>
  <div class="home">
    <Editor />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Editor from "@/components/Editor.vue"; // @ is an alias to /src

@Component({
  components: {
    Editor,
  },
})
export default class Home extends Vue {}
</script>
