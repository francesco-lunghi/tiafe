<template>
  <q-page>

    <q-toolbar class="bg-grey-3 shadow-2">
      <q-icon name="build_circle" size="2rem" color="blue" />
      <q-item-section>
        <div class="row">
          <div class="q-mx-md">
            <q-toolbar-title>Acquisitions</q-toolbar-title>
          </div>
          <q-separator vertical />
          <div>

          </div>
          <div>

          </div></div
      ></q-item-section>
      <!-- <q-btn flat round dense icon="refresh" @click="pingStatus" /> -->
    </q-toolbar>
    <q-list bordered dense>
      <q-item
        v-for="(kinects, acqId) in acquisitions"
        :key="acqId"
        class="q-my-sm"
      >
        <q-item-section avatar>
          <p>{{acqId}}</p>
          <p v-for="subItem in kinects" :key="subItem">{{subItem.subscriberId}}</p>
        </q-item-section>
      </q-item>
    </q-list>
    {{acquisitions}}
  </q-page>
</template>

<script>
//import example from 'assets/example.json'
import { defineComponent, onMounted, ref, reactive, inject } from 'vue'
import ApiService from 'src/services/ApiService'
import { useRouter } from 'vue-router' // <- import useRouter here

export default defineComponent({
  name: 'DataViewerPage',
  components: {},
  setup() {
    const acquisitions = ref({})
    const router = useRouter()

    onMounted(() => {
      ApiService.get('acquisitions').then((response) => {
            //Object.assign(ponte, response.data)
            // TODO: add error checking!
            acquisitions.value  = response.data
          })
          .catch((e) => {
            router.push('/403')
          })
    })

    return {
      acquisitions
    }
  },
})
</script>

<style></style>
