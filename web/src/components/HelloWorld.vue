<template>
  <v-container class="fill-height pa-0 ma-0" fluid>
    <v-row>
      <v-col>
        <v-img src="logo.svg" width=100vw height=10vh />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col class="text-center v-col-6">
        <h2>Présentation</h2>
        Le terrarium est une plateforme vous permettant de visualiser les evenements du monde interpays de facon
        innovante et encore jamais vu.
        Grace au terrarium vous pourrez établir des corrélations entre les évenements du monde entier, et démeller le
        vrai du faux dans ce monde de désinformation.
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col class="text-center v-col-6">
        <h2>Origine des données</h2>
        Les données proviennent d'un projet open source appelé <a href="https://www.gdeltproject.org/">gdelt</a> (Global
        Database of Events, Language and Tone).
        Ce projet supervise toute les émissions, images, et article en ligne dans le monde entier de tout les pays dans
        plus de 100 languages différents et identifie les personnes, lieu, organisations, emotions, citations, and event
        existant dans le monde a chaque seconde.
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col class="text-center v-col-6">
        <h2>Visualisation global des données</h2>
        Nos données étant trop volumineuse, il est impossible de charger la totalité des données directement, nous
        utiliserons donc une api pour requeter uniqument les données dont nous avons besoin, quand nous en avons besoin.
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col class="text-center v-col-6">
        <h2>Zoom sur nos données</h2>
        GoldsteinScale (float) [-10, 10] indice théorique de l'impact d'un evenement sur la stabilité d'un pays (Le
        score se base sur le type d'evenement, et pas sur le contenue des evenements. Donc si deux evenement sont des
        manifestations, quelle implique 10 ou 10000 personne le meme score sera données) <br />
        IsRootEvent : Les evenement étant tirés d'article, isRootEvent indique si l'évènement apparait dans le
        titre/premier paragraphe -> (l'importance de l'evenement)
        NumMentions Le nombre de fois que l'évènement est mentionnée dans les 15 minutes après sa premières mention.
        <br />
        - NumSource Le nombre de source dans lequel l'évènement est mentionné dans les 15 minutes <br />
        - NumArticle Le nombre d'article dans lequel l'évènement apparait dans les 15 minutes <br />
        - AvgTone [-100, 100] 0 neutral, en géneral entre [-10, 10] Le sentiment moyen des documents au moins une
        mention de l'evenement dans les 15 minutes
      </v-col>
      <v-spacer />
    </v-row>
    <v-row class="mb-0">
      <v-col>
        <v-select v-if="date && date.length > 0 && selectedDate != ''" :items="date" v-model="selectedDate" />
        <div id="test"><svg id="map" class="bg-white"></svg></div>
      </v-col>
      <v-col>
        <div id="test">
          <svg id="stackedchart"></svg>
        </div>
        <svg id="linechart"></svg>
        <svg id="messagechart"></svg>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="js">
import * as d3 from 'd3'
import test from '../utils/grapahtest'
import createMap from '../utils/map'
import linechart from '../utils/linechartConflict';
import messagechart from '../utils/messageChart';
import stackedBarChart from '@/utils/stackedBarChart';
import { getRoute, getDate } from '../utils/api';
export default {
  name: "HelloWorld",
  data() {
    return {
      selectedDate: '',
      data: [],
      selectedCountry: [],
      date: [],
    }
  },
  watch: {
    // selectedDate: async function (newValue, oldValue) {
    //   console.log(newValue)
    //   this.data = await getRoute('/api/event/byday/' + newValue)
    //   this.createMap(this.data, this.selectedCountry);
    // }
  },
  methods: {
    async loadData() {
      let res = await getDate();
      // console.log(res[0].sqldate.toString())
      this.date = res.map(function (item) { return { 'title': item.sqldate.toString().split('00:00:00')[0], 'value': item.sqldate.toString().split('T')[0] } });
      this.selectedDate = this.date[this.date.length - 1];
      this.data = await getRoute('/api/event/byday/' + '2021-12-28');

      this.createMap(this.data, this.selectedCountry);
      this.linechart(this.data, 'FR');
      this.stackedBarChart(this.data, 'USA', 500, 300);
      this.messagechart(this.data, 'USA', 'FR', 500, 300);
    },
    test,
    createMap,
    linechart,
    stackedBarChart,
    messagechart
  },
  created() {
    this.loadData()
  },
}
</script>
