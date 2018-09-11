<template>
  <div class="invitation">
    <SubHeading :subHeading="'Invitation'" />
    <v-container class="main-content">
      <h2>Invitation to</h2>
      <span>Harold Cup 2020</span>
      <h2>Preliminary information</h2>
      <span class="bold-text">Event Director:</span>
      <span>Harold</span><br>
      <span class="bold-text">Date:</span>
      <span>14-16th of August</span><br>
      <span class="bold-text">Venue:</span>
      <span>Eksjö, Sweden</span><br>
      <h2>Preliminary programme</h2>
      <v-data-table :items="programme" :headers="headers" class="elevation-1 stages" hide-actions>
        <template slot="items" slot-scope="props">
          <td class="text-xs-right">{{ props.item.date }}</td>
          <td class="text-xs-right">{{ props.item.distance }}</td>
          <td class="text-xs-right">{{ props.item.map }}</td>
        </template>
      </v-data-table>
      <h2>Categories</h2>
      M/W10, M/W12, M/W14, M/W16, M/W18, M/W20, M/W21, M/W35, M/W40, M/W45, M/W55, M/W60, M/W65
      <h2>Accomodation</h2>
      We will offer a campground with soft grass underfoot for about 1000 caravans/tents.
      <h2>Entry fees</h2>
      <span>
        <span class="bold-text">One camp night - 5€</span><br>
        <span class="bold-text">M/W10-18</span>
        <br> 1 run - 10€<br> 3 runs - 24€<br>
        <span class="bold-text">M/W20+</span>
        <br> 1 run - 12€<br> 3 runs - 30€<br>
      </span>
    </v-container>
    <v-layout justify-center mb-5>
      <v-flex xs12 sm6>

        <v-card>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex v-for="card in cards" v-bind="{ [`xs${card.flex}`]: true }" :key="card.title">
                <v-card>
                  <v-img :src="card.src" height="200px"></v-img>
                  <v-card-actions>
                    <h4>{{card.title}}</h4>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import SubHeading from "@/components/Layout/SubHeading";

export default {
  name: "Invitation",
  components: {
    SubHeading
  },
  data: () => ({
    headers: [
      {
        text: "Date",
        align: "left",
        sortable: false,
        value: "name",
        align: "right"
      },
      { text: "Distance", value: "si", sortable: false, align: "right" },
      { text: "Map", value: "club", sortable: false, align: "right" }
    ],
    programme: [
      {
        date: 14.08,
        distance: "Middle",
        map: "Ormaryd"
      },
      {
        date: 15.08,
        distance: "Long",
        map: "Garnisonen"
      },
      {
        date: 16.08,
        distance: "Shortened Long (Handicap)",
        map: "Skurugata"
      }
    ],
    cards: [
      {
        title: "Ormaryd",
        src: require("@/content/ormaryd.png"),
        flex: 4
      },
      {
        title: "Garnisonen",
        src: require("@/content/garnisonen.png"),
        flex: 4
      },
      {
        title: "Skurugata",
        src: require("@/content/skurugata.png"),
        flex: 4
      }
    ]
  })
};
</script>

<style>
/* .cont {
  position:relative; margin:0 auto;
} */
.main-content {
  max-width: 1000px;
}
.invitation h2 {
  margin-top: 1.2rem;
}
.invitation .bold-text {
  font-weight: bold;
}
.invitation .stages {
  max-width: 500px;
}
tbody tr:nth-child(odd) {
  background: #eee;
}
</style>