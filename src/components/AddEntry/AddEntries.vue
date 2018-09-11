<template>
  <div>
    <v-toolbar flat color="grey lighten-2">
      <v-toolbar-title>Add Entries</v-toolbar-title>
      <v-divider class="mx-2" dark inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="newEntryDialog" max-width="1000px">
        <v-btn slot="activator" color="primary" class="mb-2">New Entry</v-btn>
        <NewEntryForm />
      </v-dialog>
      <v-dialog v-model="deleteDialog" max-width="300px">
        <v-card>
          <v-card-title>
            <span class="headline">Delete entry</span>
          </v-card-title>
          <v-card-text>
            <p>Are you sure you want to delete this entry?</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="closeDelete">No</v-btn>
            <v-btn color="blue darken-1" flat @click.native="confirmDelete">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <div class="new-entry">
      <v-data-table :headers="headers" :items="newEntries" hide-actions class="elevation-1 data-table">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.si }}</td>
          <td>{{ props.item.club }}</td>
          <td>{{ props.item.category }}</td>
          <td>{{ stagesWithoutBrackets(props.item.stages) }}</td>
          <td>{{ props.item.nights }}</td>
          <td>{{ props.item.fee }}€</td>
          <td class="layout px-0">
            <v-icon small class="mr-2" style="padding-left: 24px" @click="editItem(props.item)">
              edit
            </v-icon>
            <v-icon small @click="deleteEntry(props.item)">
              delete
            </v-icon>
          </td>
        </template>
      </v-data-table>
      <v-footer dark height="auto">
        <v-card class="flex" flat>
          <v-card-title class="light-green">
            <strong class="subheading" v-if="totalFee">Total fee: {{ totalFee }}€</strong>

            <v-spacer></v-spacer>

            <v-btn slot="activator" color="primary" dark class="mb-2 right" @click="sendEntries">Send entries</v-btn>
          </v-card-title>
        </v-card>
      </v-footer>
      <v-alert :value="successAlert" type="success" transition="slide-x-reverse-transition" color="primary" class="alert">
        Your entries have been sent successfully
      </v-alert>
      <v-alert :value="errorAlert" type="error" transition="slide-x-reverse-transition" class="alert">
        An error occurred while sending requests
      </v-alert>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import NewEntryForm from "./NewEntryForm";

export default {
  name: "AddEntries",
  components: { NewEntryForm },
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
    ],
    newEntries: [],
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
    successAlert: false,
    errorAlert: false
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
  },

  watch: {
    newEntries() {
      this.$store.commit("updateTotalFee");
    },
    successAlert() {
      window.setTimeout(() => (this.successAlert = false), 3000);
    },
    errorAlert() {
      window.setTimeout(() => (this.errorAlert = false), 3000);
    }
  },

  methods: {
    initialize() {
      this.newEntries = this.$store.state.newEntries;
    },

    stagesWithoutBrackets(stages) {
      stages = stages.join(" ");
      return stages.replace(/[[\]]/g, "");
    },
    editItem(runner) {
      this.$store.commit("changeEditedIndex", this.newEntries.indexOf(runner));
      // this.editedRunner = Object.assign({}, runner);
      this.$store.commit("setNewEntryDialog", true);
    },

    deleteEntry(runner) {
      this.deleteIndex = this.newEntries.indexOf(runner);
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

    sendEntries() {
      if (this.newEntries.length) {
        let colRef = db.collection("entries");

        var batch = db.batch();

        this.newEntries.forEach(entry => {
          let ref = colRef.doc();
          batch.set(ref, {
            name: entry.name,
            club: entry.club,
            si: entry.si,
            category: entry.category,
            stages: entry.stages,
            nights: entry.nights,
            fee: entry.fee
          });
        });

        return batch
          .commit()
          .then(data => {
            this.successAlert = true;
          })
          .catch(error => {
            this.errorAlert = true;
            console.log("there is an error");
            console.log(error);
          });
      }
    }
  }
};
</script>

<style>
.new-entry {
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
}

.data-table {
  border-top: 3px solid #689f38;
  border-bottom: 3px solid #689f38;
}

.alert {
  position: fixed;
  bottom: 150px;
  right: 50px;
  border-radius: 10px;
}
</style>
