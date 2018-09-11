<template>
  <div class="entries">
    <v-toolbar flat color="grey lighten-2">
      <v-toolbar-title>All Entries</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <span v-if="entries.length" class="mx-4 right">Total entries: {{ entries.length }}</span>
      <v-btn @click="groupByCategories" color="primary" dark class="mb-2">By categories</v-btn>
      <v-btn @click="groupByClubs" color="primary" dark class="mb-2">By clubs</v-btn>
    </v-toolbar>
    <div class="new-entry">
      <!-- v-if="showBy.categories" -->
      <!-- <transition name="slide-fade">        </transition> -->

      <div v-if="showBy.categories" v-for="category in uniqueCategories" :key="category" class="mb-5 pb-5">
        <h2>{{ category }} - Entries in this category: {{ entriesByCategory(category).length }}</h2>
        <v-data-table :headers="headers" :items="entriesByCategory(category)" hide-actions class="elevation-1 data-table">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.si }}</td>
            <td>{{ props.item.club }}</td>
            <td>{{ props.item.category }}</td>
            <td>{{ stagesWithoutBrackets(props.item.stages) }}</td>
            <td>{{ props.item.nights }}</td>
            <td>{{ props.item.fee }}€</td>
          </template>
        </v-data-table>
      </div>
      <div v-if="showBy.clubs" v-for="club in uniqueClubs" :key="club" class="mb-5 pb-5">
        <h2>{{ club }} - Entries in this club: {{ entriesByClub(club).length }}</h2>
        <v-data-table :headers="headers" :items="entriesByClub(club)" hide-actions class="elevation-1 data-table">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.si }}</td>
            <td>{{ props.item.club }}</td>
            <td>{{ props.item.club }}</td>
            <td>{{ stagesWithoutBrackets(props.item.stages) }}</td>
            <td>{{ props.item.nights }}</td>
            <td>{{ props.item.fee }}€</td>
          </template>
        </v-data-table>
      </div>

      <!-- <v-content v-if="showBy.clubs">
        <v-data-table :headers="headers" :items="entries" hide-actions class="elevation-1 data-table">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.si }}</td>
            <td>{{ props.item.club }}</td>
            <td>{{ props.item.category }}</td>
            <td>{{ stagesWithoutBrackets(props.item.stages) }}</td>
            <td>{{ props.item.nights }}</td>
            <td>{{ props.item.fee }}€</td>
          </template>
        </v-data-table>
      </v-content> -->

      <div class="text-xs-center">
        <v-progress-circular indeterminate v-if="isLoading" color="light-green darken-1"></v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";

export default {
  name: "Entries",
  data: () => ({
    entries: [],
    sampleNumbers: [1, 2, 3, 4],
    headers: [
      { text: "Name", align: "left", sortable: false, value: "name" },
      { text: "SI number", value: "si", sortable: false },
      { text: "Club", value: "club", sortable: false },
      { text: "Category", value: "category", sortable: false },
      { text: "Stages", value: "stages", sortable: false },
      { text: "Nights", value: "nights", sortable: false },
      { text: "Fee", value: "fee", sortable: false }
    ],
    editedRunner: {
      name: "",
      club: "",
      si: "",
      category: "",
      stages: ["E1", "E2", "E3"],
      nights: 2,
      fee: 0
    },
    defaultRunner: {
      name: "",
      club: "",
      si: "",
      category: "",
      stages: ["E1", "E2", "E3"],
      nights: 2,
      fee: 0
    },
    deleteDialog: false,
    deleteIndex: -1,
    isLoading: true,
    uniqueCategories: [],
    uniqueClubs: [],
    showBy: {
      categories: false,
      clubs: false
    }
  }),

  computed: {
    totalFee() {
      return this.$store.state.totalFee;
    },
    newEntryDialog: {
      get() {
        return this.$store.state.newEntryDialog;
      },
      set(activeDialog) {
        if (!activeDialog) this.$store.commit("changeEditedIndex", -1);
        this.$store.commit("setNewEntryDialog", activeDialog);
      }
    }
  },

  created() {
    this.initialize();

    db
      .collection("entries")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let entry = doc.data();
          entry.id = doc.id;
          this.entries.push(entry);
        });
        this.isLoading = false;
        this.groupByClubs();
        this.groupByCategories();
      });
  },

  watch: {
    runners() {
      this.$store.commit("updateTotalFee");
    }
  },

  methods: {
    initialize() {
      this.runners = this.$store.state.runners;
    },
    stagesWithoutBrackets(stages) {
      stages = stages.join(" ");
      return stages.replace(/[[\]]/g, "");
    },
    entriesByCategory(category) {
      return this[category];
    },
    entriesByClub(club) {
      return this[club];
    },
    editItem(runner) {
      this.$store.commit("changeEditedIndex", this.runners.indexOf(runner));
      // this.editedRunner = Object.assign({}, runner);
      this.$store.commit("setNewEntryDialog", true);
    },

    deleteEntry(runner) {
      this.deleteIndex = this.runners.indexOf(runner);
      this.deleteDialog = true;
    },

    confirmDelete() {
      this.$store.commit("deleteEntry", this.deleteIndex);
      this.$store.commit("updateTotalFee");
      this.deleteDialog = false;
    },

    closeDelete() {
      this.deleteDialog = false;
    },

    groupByClubs() {
      if (!this.uniqueClubs.length) {
        this.uniqueClubs = [
          ...new Set(this.entries.map(runner => runner.club))
        ];
        this.uniqueClubs.sort();
        this.uniqueClubs.forEach(club => {
          this[club] = [];
        });
        this.entries.map(entry => {
          this[entry.club].push(entry);
        });
      }
      this.showBy.categories = false;
      this.showBy.clubs = true;
    },
    groupByCategories() {
      if (!this.uniqueCategories.length) {
        this.uniqueCategories = [
          ...new Set(this.entries.map(runner => runner.category))
        ];
        this.uniqueCategories.sort();
        this.uniqueCategories.forEach(category => {
          this[category] = [];
        });
        this.entries.map(entry => {
          this[entry.category].push(entry);
        });
      }
      this.showBy.categories = true;
      this.showBy.clubs = false;
    }
  }
};
</script>

<style>
.entries .new-entry {
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
}

.entries .data-table {
  border-top: 3px solid #689f38;
  border-bottom: 3px solid #689f38;
}

.entries span {
  font-size: 1.2rem;
}
</style>
