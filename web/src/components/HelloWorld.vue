<template>
  <v-container class="fill-height">
    <v-row>
      <v-spacer />
      <v-col>
        <svg id="map">
        </svg>
      </v-col>
      <v-col>
        <svg id="linechart"></svg>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="js">
import * as d3 from 'd3'
import { defineComponent } from 'vue'
import world from '../assets/countries.json'
import test from '../utils/grapahtest'
import createMap from '../utils/map'
import linechart from '../utils/linechartConflict'
export default {
  name: "HelloWorld",
  data() {
    return {
      data: [],
      selectedCountry: [],
    }
  },
  methods: {
    async loadData() {
      this.data = await d3.csv('sample.csv');
      let parseTime = d3.timeParse("%Y%m%d");
      let main_event_class = {
        '1': 'Verbal Cooperation',
        '2': 'Material Cooperation',
        '3': 'Verbal Conflict',
        '4': 'Material Conflict'
      };
      this.data = this.data.map(function (item) {
        return {
          ...item,
          "GLOBALEVENTID": parseInt(item.GLOBALEVENTID),
          "SQLDATE": parseTime(item.SQLDATE),
          "Actor1Geo_Type": parseInt(item.Actor1Geo_Type),
          "Actor2Geo_Type": parseInt(item.Actor2Geo_Type),
          "ActionGeo_Type": parseInt(item.ActionGeo_Type),
          "IsRootEvent": parseInt(item.IsRootEvent),
          "QuadClass": main_event_class[parseInt(item.QuadClass)],
          "GoldsteinScale": parseInt(item.GoldsteinScale),
          "NumMentions": parseInt(item.NumMentions),
          "NumSources": parseInt(item.NumSources),
          "NumArticles": parseInt(item.NumArticles),
          "AvgTone": parseFloat(item.AvgTone),
        }
      });
      this.createMap(this.data, this.selectedCountry)
      this.linechart(this.data, 'FR');
    },
    test,
    createMap,
    linechart,
  },
  created() {
    this.loadData()
  },
}
</script>
