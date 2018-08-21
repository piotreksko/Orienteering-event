<template>
    <div>
        <SubHeading :subHeading="'Bulletin'" />
    </div>
</template>

<script>
import SubHeading from "@/components/Layout/SubHeading";

export default {
  name: "Bulletin",
  components: {
    SubHeading
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
  })
};
</script>

<style>
</style>