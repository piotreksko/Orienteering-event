<template>
  <div class="home">
    <SubHeading :subHeading="'Home'" />
    <div class="top-page">
      <v-layout row>
        <transition name="slide-fade" appear>
          <v-container>
            <h1 class="mt-5">Harold Cup</h1>
            <h2>Eksjö Sweden 2020</h2>
            <h3>14th to 16th of August 2020</h3>
            <h3>3 days of Orienteering</h3>
          </v-container>
        </transition>
      </v-layout>
    </div>
    <CountdownTimer date="August 14, 2020"/>

    <header></header>
  </div>
</template>

<script>
import db from "@/firebase/init";
import SubHeading from "@/components/Layout/SubHeading";
import CountdownTimer from '@/components/CountdownTimer/CountdownTimer'

export default {
  name: "Home",
  components: {
    SubHeading,
    CountdownTimer
  },
  data: () => ({
    headers: [
      { text: "Name", align: "left", sortable: true, value: "name" },
      { text: "SI number", value: "si" },
      { text: "Club", value: "club" },
      { text: "Category", value: "category" },
      { text: "Stages", value: "stages", sortable: false },
      { text: "Nights", value: "nights", sortable: false },
      { text: "Fee", value: "fee" },
      { text: "Actions", align: "left", value: "name", sortable: false }
    ]
  }),

  computed: {
    totalFee() {
      return this.$store.state.totalFee;
    }
  },

  watch: {
    runners() {
      this.$store.commit("updateTotalFee");
    }
  },

  methods: {
    closeDelete() {
      this.deleteDialog = false;
    }
  }
};
</script>

<style>
.home .top-page {
  /* Why 100vh? Using this will keep the image header height in 100% proportion to the viewport height. Using 100% will do the same but is not a good practice. Critical to know!!!   */
  height: 65vh;
  background-image: url("../../content/forest3.jpg");
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
  display: flex;
  flex-flow: column;
  justify-content: center;
  position: relative;
  color: #fff;
}

.home .top-page {
  font-weight: 900;
  text-shadow: 2px 2px 10px #000000;
}

.top-page h1 {
  font-size: 4rem;
}
.top-page h2 {
  font-size: 3rem;
  margin-bottom: 6rem;
}
.top-page h3 {
  font-size: 2rem;
}
</style>
