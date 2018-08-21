<template>
    <v-container fluid fill-height class="my-1 countdown-timer">
        <v-layout justify-center align-center>
            <v-flex text-xs-center fill-height>
                <div v-if="days <= '0' &&  hours <= '0' && minutes <= '0' && seconds <= '0'">
                    <p>
                        0:0:0:0
                        <span class="label label-danger pull-right"> Due </span>
                    </p>
                </div>
                <div v-else>
                    <span class="display-2 amber--text text--darken-2">Days left</span>
                    <v-layout row wrap justify-center align-center class="display-1 amber--text text--darken-2">
                        <v-flex xs6 sm6 md3>
                            <span>{{ Math.trunc(days) }}</span><br>
                            <span>Days</span>
                        </v-flex>
                        <v-flex xs6 sm6 md3>
                            <span>{{ Math.trunc(hours) }}</span><br>
                            <span>Hours</span>
                        </v-flex>
                        <v-flex xs6 sm6 md3>
                            <span>{{ Math.trunc(minutes) }}</span><br>
                            <span>Minutes</span>
                        </v-flex>
                        <v-flex xs6 sm6 md3>
                            <span>{{ Math.trunc(seconds) }}</span><br>
                            <span>Seconds</span>
                        </v-flex>
                    </v-layout>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  name: "CountdownTimer",
  props: {
    date: {
      type: String
    }
  },
  data() {
    return {
      now: 0,
      count: 0
    };
  },
  methods: {
    timerLoop() {
      this.count++;
      this.now = Math.trunc(new Date().getTime() / 1000);
      this.count < 200 && setTimeout(this.timerLoop, 1000);
    }
  },
  mounted() {
    this.timerLoop();
  },
  computed: {
    seconds() {
      return (this.modifiedDate - this.now) % 60;
    },
    minutes() {
      return ((this.modifiedDate - this.now) / 60) % 60;
    },
    hours() {
      return ((this.modifiedDate - this.now) / 60 / 60) % 24;
    },
    days() {
      return (this.modifiedDate - this.now) / 60 / 60 / 24;
    },
    modifiedDate: function() {
      return Math.trunc(Date.parse(this.date) / 1000);
    }
  }
};
</script>
<style>
.countdown-timer {
  height: 20%;
}
.countdown-timer span{
  font-weight: bold;
}
</style>
