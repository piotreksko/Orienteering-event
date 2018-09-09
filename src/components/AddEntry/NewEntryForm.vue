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
  created() {
    // this.generateFakeData();
  },
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
    },
    generateFakeData() {
      const gender = ["M", "W"];
      const maleCategories = [
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
        "M65"
      ];
      const femaleCategories = [
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
      ];
      const firstMaleNames = [
        "Jacob",
        "Michael",
        "Matthew",
        "Joshua",
        "Christopher",
        "Nicholas",
        "Andrew",
        "Joseph",
        "Daniel",
        "Tyler",
        "William",
        "Brandon",
        "Ryan",
        "John",
        "Zachary",
        "David",
        "Anthony",
        "James",
        "Justin",
        "Alexander",
        "Jonathan",
        "Christian",
        "Austin",
        "Max",
        "Andres",
        "Gage",
        "Braden",
        "Damian",
        "Donovan",
        "Ruben",
        "Frank",
        "Pedro",
        "Gerardo",
        "Andy",
        "Chance",
        "Abraham",
        "Calvin",
        "Donald",
        "Derrick",
        "Payton",
        "Darius",
        "Enrique",
        "Keith",
        "Raul",
        "Jaylen",
        "Troy",
        "Jonathon",
        "Roman",
        "Russell",
        "Ramon",
        "Lawrence",
        "Moises",
        "Aiden",
        "Quentin",
        "Tyrese",
        "Jay",
        "Tristen",
        "Emanuel",
        "Salvador",
        "Terry",
        "Morgan",
        "Jeffery",
        "Esteban",
        "Tyson",
        "Braxton",
        "Branden",
        "Brody",
        "Craig"
      ];
      const firstFemaleNames = [
        "Emily",
        "Hannah",
        "Madison",
        "Ashley",
        "Sarah",
        "Alexis",
        "Samantha",
        "Jessica",
        "Elizabeth",
        "Taylor",
        "Lauren",
        "Audrey",
        "Noelle",
        "Carla",
        "Francesca",
        "Tia",
        "Layla",
        "Krista",
        "Zoey",
        "Carley",
        "Janet",
        "Carissa",
        "Iris",
        "Kaleigh",
        "Carlie",
        "Angie",
        "Nora",
        "Kailee",
        "Sylvia",
        "Carrie",
        "Elaina",
        "Sonia",
        "Genevieve",
        "Kenya",
        "Piper",
        "Marilyn",
        "Amari",
        "Macey",
        "Marlene",
        "Barbara",
        "Neha",
        "Beatrice",
        "Blair",
        "Kori",
        "Luisa",
        "Annamarie",
        "Breonna"
      ];
      const lastNames = [
        "Anderson",
        "Andrews",
        "Anthony",
        "Armstrong",
        "Arnold",
        "Ashley",
        "Atkins",
        "Barber",
        "Barker",
        "Barlow",
        "Barnes",
        "Barnett",
        "Bowers",
        "Bowman",
        "Boyd",
        "Boyer",
        "Boyle",
        "Bradford",
        "Bruce",
        "Bryan",
        "Bryant",
        "Buchanan",
        "Buck",
        "Buckley",
        "Burris",
        "Burt",
        "Burton",
        "Bush",
        "Butler",
        "Byers",
        "Byrd",
        "Cabrera",
        "Cain",
        "Calderon",
        "Caldwell",
        "Chapman",
        "Charles",
        "Chase",
        "Chavez",
        "Chen",
        "Cline",
        "Cooley",
        "Cooper",
        "Copeland",
        "Cortez",
        "Cote",
        "Cotton",
        "Cox",
        "Craft",
        "Craig",
        "Crane",
        "Crawford",
        "Crosby",
        "Cross",
        "Cruz",
        "Diaz",
        "Dickerson",
        "Dickson",
        "Dillard",
        "Dillon",
        "Dixon",
        "Dodson",
        "Dominguez",
        "Erickson",
        "Espinoza",
        "Estes",
        "Estrada",
        "Evans",
        "Everett",
        "Ewing",
        "Farley",
        "Farmer",
        "Farrell",
        "Faulkner",
        "Ferguson",
        "Fernandez",
        "Ferrell",
        "Franks",
        "Frazier",
        "Frederick",
        "Guerrero",
        "Guthrie",
        "Gutierrez",
        "Guy",
        "Guzman",
        "Hahn",
        "Hale",
        "Haley",
        "Hall",
        "Hamilton",
        "Hammond",
        "Hampton",
        "Hancock",
        "Haney",
        "Hansen",
        "Hanson",
        "Hardin",
        "Harding",
        "Heath",
        "Hebert",
        "Henderson",
        "Hendricks",
        "Hendrix",
        "Henry",
        "Hensley",
        "Henson",
        "Holman",
        "Holmes",
        "Holt",
        "Hood",
        "Hooper",
        "Hoover",
        "Johnston",
        "Kidd",
        "Kim",
        "King",
        "Kinney",
        "Kirby",
        "Kirk",
        "Leblanc",
        "Lee",
        "Leon",
        "Leonard",
        "Lester",
        "Levine",
        "Levy",
        "Lewis",
        "Lindsay",
        "Lindsey",
        "Little",
        "Mann",
        "Manning",
        "Marks",
        "Marquez",
        "Marsh",
        "Mccullough",
        "Mcdaniel",
        "Mcdonald",
        "Mcdowell",
        "Mcfadden",
        "Mcfarland",
        "Mcgee",
        "Mcgowan",
        "Mcguire",
        "Mcintosh",
        "Meyers",
        "Michael",
        "Middleton",
        "Miles",
        "Miller",
        "Mills",
        "Mullen",
        "Mullins",
        "Munoz",
        "Murphy",
        "Ochoa",
        "Oconnor",
        "Park",
        "Parker",
        "Parks",
        "Peck",
        "Pena",
        "Pennington",
        "Perez",
        "Roberson",
        "Roberts",
        "Robertson",
        "Robinson",
        "Robles",
        "Rocha",
        "Rodgers",
        "Rodriguez",
        "Rodriquez",
        "Sanford",
        "Santana",
        "Sexton",
        "Shaffer",
        "Shannon",
        "Sharp",
        "Sharpe",
        "Shaw",
        "Shelton",
        "Shepard",
        "Shepherd",
        "Sheppard",
        "Sherman",
        "Shields",
        "Snow",
        "Snyder",
        "Solis",
        "Sullivan",
        "Summers",
        "Sutton",
        "Swanson",
        "Sweeney",
        "Sweet",
        "Sykes",
        "Torres",
        "Townsend",
        "Valentine",
        "Valenzuela",
        "Vance",
        "Vang",
        "Vargas",
        "Vasquez",
        "Vaughan",
        "Walter",
        "Walters",
        "Walton",
        "Ward",
        "Wilkinson",
        "William",
        "Williams",
        "Yang",
        "Yates"
      ];
      const clubs = [
        "Linköpings AIK",
        "IFK Göteborg",
        "IF Hallby",
        "Kristiansand OK",
        "Halden SK",
        "IL Tyrving",
        "Nordstrand IF",
        "OLG Thalwil",
        "OLK Argus",
        "LKS Gorzanka Nawojowa Gora",
        "OLC Winterthur"
      ];
      const stagesOptions = [
        ["E1"],
        ["E2"],
        ["E3"],
        ["E1", "E2"],
        ["E2", "E3"],
        ["E1", "E2", "E3"],
        ["E1", "E2", "E3"],
        ["E1", "E2", "E3"],
        ["E1", "E2", "E3"],
        ["E1", "E2", "E3"]
      ];
      for (let i = 0; i < 350; i++) {
        // Fake data generator

        this.editedRunner = {
          name: "",
          club: "",
          si: "",
          category: "",
          stages: ["E1", "E2", "E3"],
          nights: 2,
          fee: 0
        };

        let runnerGender = gender[Math.floor(Math.random() * gender.length)];
        let namesArray;
        runnerGender === "M"
          ? (namesArray = firstMaleNames)
          : (namesArray = firstFemaleNames);

        let randomFirstName =
          namesArray[Math.floor(Math.random() * namesArray.length)];
        let randomLastName =
          lastNames[Math.floor(Math.random() * lastNames.length)];

        this.editedRunner.name = randomFirstName + " " + randomLastName;

        let categoriesArray;
        runnerGender === "M"
          ? (categoriesArray = maleCategories)
          : (categoriesArray = femaleCategories);

        this.editedRunner.category =
          categoriesArray[Math.floor(Math.random() * categoriesArray.length)];
        this.editedRunner.club =
          clubs[Math.floor(Math.random() * clubs.length)];
        this.editedRunner.stages =
          stagesOptions[Math.floor(Math.random() * stagesOptions.length)];

        const numberOfNights = () => {
          if (this.editedRunner.stages.length === 3) return 2;
          else if (this.editedRunner.stages.length === 2) return 1;
          else return 0;
        };

        this.editedRunner.nights = numberOfNights();

        const siBorrowChance = [1, 0, 0, 0, 0, 0, 0, 0];
        const getSiNumber = (borrow) => {
          return borrow ? '' : Math.floor(Math.random() * 8888888) + 1;
        }

        let borrowSi = 
          siBorrowChance[Math.floor(Math.random() * siBorrowChance.length)];

        this.editedRunner.si = getSiNumber(borrowSi);
        this.calculateFee();

        this.$store.commit("addEntry", this.editedRunner);
      }
    }
  }
};
</script>