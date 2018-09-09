<template>
  <div class="map">
    <div class="google-map" id="map"></div>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
  name: 'GMap',
  data(){
    return{
      lat: 57.701930,
      lng: 14.972871
    }
  },
  methods: {
    renderMap(){
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: this.lat, lng: this.lng },
        zoom: 6,
        maxZoom: 15,
        minZoom: 3,
        streetViewControl: false
      })

      db.collection('event-locations').get().then(event => {
        users.docs.forEach(doc => {
          let data = doc.data()
          if(data.geolocation){
            let marker = new google.maps.Marker({
              position: {
                lat: data.geolocation.lat,
                lng: data.geolocation.lng
              },
              map
            })
            // add click even to marker
            marker.addListener('click', () => {
              this.$router.push({ name: 'ViewProfile', params: { id: doc.id }})
            })
          }
        })
      })
    }
  },
  mounted(){
    // get user geolocation
    // if(navigator.geolocation){
    //   navigator.geolocation.getCurrentPosition(pos => {
    //     this.lat = pos.coords.latitude
    //     this.lng = pos.coords.longitude

    //     // find the user record then update
    //     console.log(user);
    //     db.collection('event-locations').get()
    //     .then(snapshot => {
    //       snapshot.forEach((doc) => {
    //         db.collection('event-locations').doc(doc.id).update({
    //           geolocation: {
    //             lat: pos.coordinates.latitude,
    //             lng: pos.coordinates.longitude
    //           }
    //         })
    //       })
    //     }).then(() => {
    //       this.renderMap()
    //     })
    //   }, (err) => {
    //     console.log(err)
    //     this.renderMap()
    //   }, { maximumAge: 60000, timeout: 3000 })
    // } else {
      // position center by default values
      this.renderMap()
    // }
  }
}
</script>

<style>
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>