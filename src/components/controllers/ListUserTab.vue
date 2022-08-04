<template>

  <div id="users-tab" class="px-5">
    <h2 class="text-white font-medium capitalize pt-4">Danh sách thành viên</h2>

    <ul class="mt-5">
      <li v-for="(user, index) in usersData" :key="index" class="mt-4 first:mt-0">
        <list-user-item :user="user" />
      </li>
    </ul>

  </div>

</template>

<script lang="ts" setup>
import {inject} from "vue";
import ListUserItem from "./ListUserItem.vue";

const { usersData } = inject('ROOM_PROVIDER')!

</script>
