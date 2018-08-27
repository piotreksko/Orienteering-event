<template>
    <div>
        <SubHeading :subHeading="'Getting Here'" />
        <GMap />
    </div>
</template>

<script>
import SubHeading from "@/components/Layout/SubHeading";
import GMap from '@/components/GMap/GMap'

export default {
  name: "GettingHere",
  components: {
    SubHeading,
    GMap
  },
  data: () => ({})
};
</script>

<style>
</style>