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
        <div id="test"><svg id="map" class="bg-white">
          </svg></div>

      </v-col>
      <v-col>
        <svg id="stackedchart"></svg>
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
import linechart from '../utils/linechartConflict';
import stackedBarChart from '@/utils/stackedBarChart';
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
      this.createMap(this.data, this.selectedCountry);
      this.linechart(this.data, 'FR');
      this.stackedBarChart(this.data, 'USA', 500, 300);
    },
    test,
    createMap,
    linechart,
    stackedBarChart
  },
  created() {
    this.loadData()
  },
}
</script>
