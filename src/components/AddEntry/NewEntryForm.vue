<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ formTitle }}</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-form @submit.prevent ref="form" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              <v-text-field ref="name" :rules="[() => !!editedRunner.name || 'This field is required']" required v-model="editedRunner.name" label="Runner name"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field ref="club" :rules="[() => !!editedRunner.club || 'This field is required']" required v-model="editedRunner.club" label="Club"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field ref="si" type="number" v-model="editedRunner.si" @change="calculateFee" label="SI number"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-select ref="category" :rules="[() => !!editedRunner.category || 'This field is required']" required v-model="editedRunner.category" :items="categories" @change="calculateFee" label="Category"></v-select>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-select ref="stages" :rules="[() => !!editedRunner.stages.length || 'This field is required']" required v-model="editedRunner.stages" :items="stages" @change="calculateFee" label="Stages" multiple persistent-hint></v-select>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-select ref="nights" v-model="editedRunner.nights" :items="nights" @change="calculateFee" label="Camp nights"></v-select>
            </v-flex>
            <p>*Empty SI number means SI rent - additional cost of 2€ per stage</p>
            <v-flex xs0 sm6 md8>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-card v-if="this.editedRunner.fee" class="right amber darken-2">
                <v-card-text>Fee: {{ this.editedRunner.fee }}€</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
      <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "NewEntryForm",
  data: () => ({
    categories: [
      "M10",
      "M12",
      "M14",
      "M16",
      "M20",
      "M21",
      "M35",
      "M40",
      "M45",
      "M55",
      "M65",
      "W10",
      "W12",
      "W14",
      "W16",
      "W20",
      "W21",
      "W35",
      "W40",
      "W45",
      "W55",
      "W65"
    ],
    stages: ["E1", "E2", "E3"],
    nights: [0, 1, 2],
    formHasErrors: false,
    runners: [],
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
    }
  }),
  computed: {
    ...mapGetters({
      isDialogOpened: "isDialogOpened"
    }),
    formTitle() {
      return this.$store.state.editedIndex === -1 ? "New Entry" : "Edit Entry";
    },
    indexChange() {
      return this.$store.state.editedIndex;
    }
  },
  watch: {
    isDialogOpened(val) {
      val || this.close();
    },
    indexChange() {
      this.editedRunner = Object.assign({}, this.defaultRunner);
      if (this.$store.state.editedIndex > -1)
        this.editedRunner = Object.assign(
          {},
          this.$store.state.runners[this.$store.state.editedIndex]
        );
    }
  },
  methods: {
    calculateFee() {
      //one camp night - 5€
      // age upto 18 - 1st range
      //1 run - 10€
      //3 runs - 24€
      // age 20 and higher - 2nd range
      //1 run - 12€
      //3 runs - 30€

      const calculatedFee = (category, stages, nights, si) => {
        const firstRangePrices = [10, 24];
        const secondRangePrices = [12, 30];
        const campPrice = 5;
        const siRentPrice = 2;

        const definePriceRange = category =>
          category.substr(1) < 19 ? firstRangePrices : secondRangePrices;

        const priceRange = definePriceRange(category);

        // If a runner starts on all stages use the 2nd price in array, otherwise 1st
        let stagesFee;
        stages === 3
          ? (stagesFee = priceRange[1])
          : (stagesFee = priceRange[0] * stages);

        const getSiFee = () =>
          !si ? (siFee = siRentPrice * stages) : (siFee = 0);

        let siFee = getSiFee();
        const campFee = campPrice * nights;
        const result = stagesFee + campFee + siFee;

        return result;
      };

      if (this.editedRunner.category && this.editedRunner.stages.length) {
        this.editedRunner.fee = calculatedFee(
          this.editedRunner.category,
          this.editedRunner.stages.length,
          this.editedRunner.nights,
          this.editedRunner.si
        );
      } else {
        this.editedRunner.fee = null;
      }
    },

    close() {
      this.setNewEntryDialog(false);
      setTimeout(() => {
        this.$refs.form.resetValidation();
        this.editedRunner = Object.assign({}, this.defaultRunner);
        this.$store.commit("changeEditedIndex", -1);
      }, 100);
    },

    setNewEntryDialog(activeDialog) {
      this.$store.commit("setNewEntryDialog", activeDialog);
    },

    save() {
      this.formHasErrors = false;
      debugger;
      Object.keys(this.editedRunner).forEach(f => {
        if (!this.editedRunner[f]) this.formHasErrors = true;
        if (f !== "fee") {
          this.$refs[f].validate(true);
        }
      });
      if (!this.formHasErrors) {
        if (this.$store.state.editedIndex > -1) {
          this.$store.commit("editEntry", this.editedRunner);
        } else {
          this.$store.commit("addEntry", this.editedRunner);
        }

        this.$store.commit("setNewEntryDialog", false);
      }
    }
  }
};
</script>