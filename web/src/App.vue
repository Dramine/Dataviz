<template>
  <v-app>
    <v-main class="main">
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  components: { HelloWorld },
}
</script>

<style>

.main {
  background-color: #212326;
  color:white;
}

</style>
