<template>
  <v-container class="fill-height">
    <v-row>
      <v-spacer />
      <v-col>
        <svg>
        </svg>
      </v-col>
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script lang="js">
import * as d3 from 'd3'
import { defineComponent } from 'vue'
import world from '../assets/countries.json'
import test from '../utils/grapahtest'
import createMap from '../utils/map'
export default {
  name: "HelloWorld",
  data() {
    return {
      name: 'jhon'
    }
  },
  methods: {
    test,
    createMap
  },
  mounted() {
    createMap()
  },
}
</script>
