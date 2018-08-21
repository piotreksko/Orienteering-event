<template>
    <v-toolbar flat color="grey lighten-2">
        <v-toolbar-title>{{ subHeading }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
    </v-toolbar>
</template>
<script>
export default {
  name: "SubHeading",
  props: ["subHeading"]
};
</script>
