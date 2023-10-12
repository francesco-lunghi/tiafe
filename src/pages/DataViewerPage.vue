<template>
  <q-page>
<!--
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

          </div>
        </div>
      </q-item-section>
    </q-toolbar> -->

    <q-table title="Acquisitions" :rows="acquisitions" :columns="columns" row-key="acquisitionId">
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="blue" round dense @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="blue" round dense @click="downloadAcquisition(props.row.acquisitionId)"
              icon="download" />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <q-list bordered separator>
              <q-item v-for="kinect in props.row.kinects" :key="kinect.subscriberId">

                <q-item-section>
                  <q-item-label>{{ kinect.subscriberId }}</q-item-label>
                  <q-item-label caption lines="1">{{ kinect.subscriberInfo }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn @click="downloadKinect(props.row.acquisitionId, kinect.subscriberId)" size="sm" color="green"
                    round dense icon="download">
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
            <div class="text-left">This is expand slot for row above: {{ props.row.acquisitionId }}.</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- <q-list bordered dense>
      <q-item v-for="(kinects, acqId) in acquisitions" :key="acqId" class="q-my-sm">
        <q-item-section avatar>
          <p>{{ acqId }}</p>
          <p v-for="subItem in kinects" :key="subItem">{{ subItem.subscriberId }}</p>
        </q-item-section>
      </q-item>
    </q-list>
    -->{{ acquisitions }}
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
    const acquisitions = ref([])
    const router = useRouter()
    // const formatArray = (row, column) => {
    //   if (Array.isArray(row.kinects)) {
    //     return row.kinects.map((value) => {
    //       //return `<q-btn @click="handleButtonClick(${value})">${value}</q-btn>`;
    //       return `<q-btn>${value}</q-btn>`;
    //     }).join(', ');
    //   }
    //   return row.column;
    // }
    const columns = ref(
      [
        {
          name: 'acquisitionId',
          required: true,
          label: 'acquisitionId',
          align: 'left',
          field: row => row.acquisitionId,
          format: val => `${val}`,
          sortable: true
        },
        // {
        //   name: 'name',
        //   required: true,
        //   label: 'Dessert (100g serving)',
        //   align: 'left',
        //   field: row => row.name,
        //   format: val => `${val}`,
        //   sortable: true
        // },
        // { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'action', label: 'Action', field: 'action' }
      ]
    )
    const onRowClick = (evt, row) => {
      console.log('clicked on', row)
    }
    const btnclick = (id, name) => {
      console.log('Button Click', id, name)
    }
    const downloadAcquisition = (acquisitionId) => {
      console.log("downloading acquisition " + acquisitionId)
    }
    const downloadKinect = (acquisitionId, subscriberId) => {
      console.log("downloading acquisition " + acquisitionId + " kinect: " + subscriberId)
    }
    const handleButtonClick = (value) => {
      // Do something with the clicked value
      console.log(`Button clicked with value: ${value}`);
    }
    onMounted(() => {
      ApiService.get('acquisitions').then((response) => {
        //Object.assign(ponte, response.data)
        // TODO: add error checking!

        const r = response.data
        acquisitions.value = []
        for (let k of Object.keys(r)) {
          const row = { 'acquisitionId': k, 'kinects': r[k] }
          acquisitions.value.push(row)
        }
      })
        .catch((e) => {
          router.push('/403')
        })
    })

    return {
      acquisitions,
      columns,
      onRowClick,
      btnclick,
      handleButtonClick,
      downloadAcquisition,
      downloadKinect


    }
  },
})
</script>

<style></style>
