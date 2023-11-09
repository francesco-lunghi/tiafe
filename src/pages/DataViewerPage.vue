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

    <q-table title="Acquisitions" :rows="acquisitions" :columns="columns" row-key="AcquisitionId" :filter="filter">
      <template v-slot:top-left>
        <q-btn icon="refresh" size="md"  round dense @click="refreshAcquisitions"/>
        <!-- <q-btn class="q-ml-md">Acquisitions</q-btn> -->
      </template>
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
            <q-btn size="md" color="blue" round dense @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props" @click="props.expand = !props.expand">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn class="q-mr-md" size="md" color="red" round dense @click="deleteAcquisition(props.row.AcquisitionId)"
              icon="delete"> <q-tooltip>
                delete the acquisition
              </q-tooltip>
            </q-btn>
            <q-btn class="q-mr-md" size="md" color="blue" round dense
              @click="downloadAcquisition(props.row.AcquisitionId, true)" icon="download"> <q-badge color="orange" rounded
                floating>c</q-badge><q-tooltip>
                donwload acquisition<br>(calibrated)
              </q-tooltip>
            </q-btn>
            <q-btn size="md" color="blue" round dense @click="downloadAcquisition(props.row.AcquisitionId, false)"
              icon="download"><q-tooltip>
                donwload acquisition<br>(raw)
              </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <q-list bordered separator>
              <q-item v-for="kinect in props.row.kinects" :key="kinect.StationId">

                <q-item-section>
                  <q-item-label>{{ kinect.StationId }}</q-item-label>
                  <q-item-label caption lines="1">{{ kinect.StationInfo }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn @click="downloadKinect(props.row.AcquisitionId, kinect.StationId, true)" size="md" color="green"
                    round dense icon="download"> <q-badge color="orange" rounded floating>c</q-badge><q-tooltip>
                      donwload station data<br>(calibrated)
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
                <q-item-section side>
                  <q-btn @click="downloadKinect(props.row.AcquisitionId, kinect.StationId, false)" size="md" color="green"
                    round dense icon="download"><q-tooltip>
                      donwload station data<br>(raw)
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
            <!-- <div class="text-left">This is expand slot for row above: {{ props.row.AcquisitionId }}.</div> -->
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- <q-list bordered dense>
      <q-item v-for="(kinects, acqId) in acquisitions" :key="acqId" class="q-my-sm">
        <q-item-section avatar>
          <p>{{ acqId }}</p>
          <p v-for="subItem in kinects" :key="subItem">{{ subItem.stationId }}</p>
        </q-item-section>
      </q-item>
    </q-list>
    {{ acquisitions }}-->
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
          name: 'AcquisitionId',
          required: true,
          label: 'AcquisitionId',
          align: 'left',
          field: row => row.AcquisitionId,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'action', label: 'Action', field: 'action', align: 'right', },
      ]
    )
    const onRowClick = (evt, row) => {
      console.log('clicked on', row)
    }
    const btnclick = (id, name) => {
      console.log('Button Click', id, name)
    }
    // function getFileNameFromResponseHeaders(headers) {
    //   const contentDisposition = headers['content-disposition'];
    //   if (contentDisposition) {
    //     const matches = contentDisposition.match(/filename=([^;]+)/);
    //     if (matches) {
    //       return matches[1];
    //     }
    //   }
    //   // Se l'intestazione Content-Disposition non è presente o non contiene un nome file, puoi restituire un nome predefinito o gestire la situazione in modo appropriato.
    //   return 'file';
    // }
    const downloadAcquisition = (AcquisitionId, calibrated) => {
      console.log("downloading acquisition " + AcquisitionId)
      // ApiService.get('acquisitions/' + AcquisitionId + '/download_skeletons/')
      ApiService.get('acquisitions/' + AcquisitionId + '/download_skeletons?calibrated=' + calibrated, {
        responseType: 'blob',
      }).then((response) => {
        //  const filename = getFileNameFromResponseHeaders(response.headers);

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', AcquisitionId + ".zip") //or any other extension
        document.body.appendChild(link)
        link.click()
      })
      //window.location.href = 'http://localhost:8000/api/v1/acquisitions/' + AcquisitionId + '/download_skeletons/'
    }
    const deleteAcquisition = (AcquisitionId) => {
      if (window.confirm("Do you really want to delete this acquisition?")) {
        ApiService.delete('acquisitions/' + AcquisitionId).then((response) => {
          console.log("Acquisition deleted")

        }).finally(()=>{
          refreshAcquisitions()})

      }

    }

    const downloadKinect = (AcquisitionId, StationId, calibrated) => {
      console.log("downloading acquisition " + AcquisitionId + " kinect: " + StationId)
      ApiService.get('acquisitions/' + AcquisitionId + '/download_skeletons/' + StationId + '?calibrated=' + calibrated, {
        responseType: 'blob',
      }).then((response) => {
        //  const filename = getFileNameFromResponseHeaders(response.headers);

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', AcquisitionId + "_" + StationId + ".zip") //or any other extension
        document.body.appendChild(link)
        link.click()
      })
      // window.location.href = 'http://localhost:8000/api/v1/acquisitions/' + AcquisitionId + '/download_skeletons/' + StationId
    }
    const handleButtonClick = (value) => {
      // Do something with the clicked value
      console.log(`Button clicked with value: ${value}`);
    }
    onMounted(() => {
      refreshAcquisitions()
    })
    function refreshAcquisitions() {

      console.log("refreshing acquisitions")
      ApiService.get('acquisitions').then((response) => {
        //Object.assign(ponte, response.data)
        // TODO: add error checking!
        const r = response.data
        acquisitions.value = []
        for (let k of Object.keys(r)) {
          const row = { 'AcquisitionId': k, 'kinects': r[k] }
          acquisitions.value.push(row)
        }
      })
        .catch((e) => {
          router.push('/403')
        })
    }

    return {
      acquisitions,
      columns,
      onRowClick,
      btnclick,
      handleButtonClick,
      downloadAcquisition,refreshAcquisitions,
      deleteAcquisition,
      downloadKinect,
      filter: ref('')


    }
  },
})
</script>

<style></style>
