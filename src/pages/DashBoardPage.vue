<template>
  <q-page>
    <q-toolbar class="bg-grey-3 shadow-2">
      <q-icon name="build_circle" size="3rem" color="blue" />
      <q-item-section>
        <div class="row" style="align-items: center;">
          <div class="q-mx-md">
            <q-toolbar-title style="font-size: 24px;">Available kinects</q-toolbar-title>
          </div>
          <q-separator vertical />
          <div>
            <q-btn size="lg" flat round dense icon="play_arrow" @click="startAll()"
              :disable="Object.keys(kinects).length === 0">
            </q-btn>
          </div>
          <div>
            <q-btn flat size="lg" round dense icon="stop" :disable="Object.keys(kinects).length === 0" @click="stopAll()">
            </q-btn>
          </div>
        </div>
      </q-item-section>
      <q-btn flat round dense size="lg" icon="refresh" @click="pingStatus" />
    </q-toolbar>
    <q-list bordered dense>
      <q-item v-for="(k, StationId) in kinects" :key="StationId" class="q-my-sm">
        <q-item-section avatar>
          <q-btn size="md" round :color="getColorFromStatus(k.Available)" :icon="getIconFromStatus(k.Available)"
            @click="disconnectStation(k)" />
          <!-- <q-avatar :color="getColorFromStatus(k.available)" text-color="white">
            {{ k.stationId }}
          </q-avatar> -->
        </q-item-section>

        <q-separator class="q-mr-md" vertical />
        <q-item-section>
          <div class="row" style="align-items: center;">
            <div class="q-mr-md">
              <div>
                <q-spinner-radio class="q-mx-md" v-if="k.Reader === 'running'" color="primary" size="2em" />
                <q-spinner-puff class="q-mx-md" v-if="k.Reader === 'running' && k.SaveAVIStream" color="red" size="3em" />
              </div>
              <q-item-label><span class="text-h6">{{ k.StationId }}</span></q-item-label>
              <q-separator class="q-my-sm" />
              <div class="column" style="width:200px;max-width:200px;">
                <q-item-label caption lines="1">{{
                  k.TopicPrefix + " ver (" + k.Version + ")"
                }}</q-item-label>
                <!-- <q-item-label caption lines="1">{{
                k.version
                }}</q-item-label> -->
                <q-separator class="q-my-sm" />
                <q-item-label caption lines="3">{{
                  k.StationInfo
                }}</q-item-label>
                <!-- <div class="row"><q-input class="q-mr-md" style="flex:1" type="number" min="1" max="30" dense round
                    v-model="k.SamplingRate" label="Sampling Rate [Hz]"></q-input><q-btn
                    @click="setSamplingRate(k)">set</q-btn>
                </div> -->

              </div>
            </div>
            <!-- <q-separator class="q-ml-md" vertical /> -->
            <div>
              <q-img style="max-width: 250px; height: 150px; min-width: 250px" fit="scale-down" no-transition
                :src="previews[k.StationId]">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center" style="background-color: rgb(184, 50, 50)">
                    Preview not available
                  </div>
                </template>
              </q-img>
            </div>


            <div class="column" v-for="i in getSkeletonCount(k)" :key="i">
              <img style="max-width: 60px; height: 50px" src="~assets/stickman.png" />
            </div>
          </div>
        </q-item-section>

        <q-item-section side>
          <div class="row">
            <q-btn flat round :icon="getIconFromActivity(k.Reader)" @click="toggle(k)" size="1.5em">
              <q-tooltip>Start/Stop</q-tooltip>
            </q-btn>
            <!--:color="getColorFromPreview(k)"-->
            <q-btn flat round icon="photo_camera" @click="takeSnapshot(k)" size="1.5em">
              <q-tooltip>Snapshot</q-tooltip></q-btn>
            <!-- <q-toggle :disable="k.reader == 'running'" :modelValue="getSaveAvi(k)" @update:modelValue="toggleSaveAvi(k)"
              label="AVI" /> -->
            <q-btn flat icon="settings" @click="getConfig(k)" size="1.5em"><q-tooltip>Config</q-tooltip></q-btn>
            <q-btn flat icon="view_in_ar" @click="getCalibration(k)"
              size="1.5em"><q-tooltip>Calibration</q-tooltip></q-btn>

          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
  <q-dialog v-model="config_dialog_kv2" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Configuration Kv2</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input label="Station ID" v-model="configuration['config']['stationId']" autofocus />
        <q-input label="Station INFO" v-model="configuration['config']['stationInfo']" />
        <q-input label="Chunk Size (samples)" v-model.number="configuration['config']['chunkSize']" />
        <q-input label="Sampling Rate [Hz]" v-model.number="configuration['config']['desiredSamplingRate']" type="number"
          min="1" />
        <q-toggle label="Interpolate" v-model="configuration['config']['isInterpolated']" />
        <q-input label="Maximum Interpolation Interval [ms]"
          v-model.number="configuration['config']['maxInterpolationIntervalMS']" min="0" />
        <q-toggle label="Save AVI Stream" v-model="configuration['config']['saveAVIStream']" />
        <q-input label="Streaming Interval [ms]" v-model.number="configuration['config']['streamingIntervalMS']"
          min="100" />
        <q-input label="Thumbnails Percentage" v-model.number="configuration['config']['thumbnailsPercent']" min="5"
          step="5" max="100" type="number" />
        <!-- @keyup.enter="config_dialog = false" /> -->
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Upload" @click="uploadConfiguration()" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="config_dialog_k4a" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Configuration K4A</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input label="Station ID" v-model="configuration['config']['STATION_ID']" autofocus />
        <q-input label="Station INFO" v-model="configuration['config']['STATION_INFO']" />
        <q-input label="Device Index" v-model.number="configuration['config']['K4A_INDEX']" />
        <q-input label="Send Interval [s]" v-model.number="configuration['config']['MQTT_SEND_INTERVAL']" type="number"
          min="0.5" />
        <q-input label="Sampling Rate [Hz]" v-model.number="configuration['config']['SAMPLING_RATE']" type="number"
          min="1" max="30" />
        <q-select label="Color Resolution" v-model.number="configuration['config']['COLOR_RESOLUTION']"
          :options="deviceColorResolution" />
        <q-select label="Depth Mode" v-model="configuration['config']['DEPTH_MODE']" :options="depthModeOptions" />
        <q-input label="Remote Output Folder" v-model="configuration['config']['OUTPUT_FOLDER']" />
        <q-select label="Device FPS" v-model="configuration['config']['K4A_FPS']" :options="deviceFPSOptions" />

        <q-toggle label="Save AVI Stream" v-model="configuration['config']['SAVE_AVI_STREAM']" />
        <q-input label="Streaming Interval [ms]" v-model.number="configuration['config']['STREAMING_INTERVAL_MS']"
          min="100" />
        <q-input label="Thumbnails Percentage" v-model.number="configuration['config']['THUMBNAIL_PERCENT']" min="5"
          step="5" max="100" />
        <q-toggle label="Send All Frames" v-model="configuration['config']['SEND_ALL_FRAMES']" />



      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Upload" @click="uploadConfiguration()" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="calibration_dialog" persistent>
    <q-card style="min-width: 650px">
      <q-card-section>
        <div class="text-h6">Calibration</div>
      </q-card-section>
      <q-card-section class="q-pt-md q-pb-md">
        <!-- <q-input
          v-for=""
          :key="rowIndex"
          v-model="calibration['calibration']['R'][rowIndex]"
          :label="'Row ' + (rowIndex + 1)"
        > -->
        <div class="text-h7">R</div>
        <table>
          <tr v-for="(row, rowIndex) in calibration['calibration']['R']" :key="rowIndex">
            <td v-for="(value, colIndex) in row" :key="colIndex">
              <q-input dense filled v-model.number="calibration['calibration']['R'][rowIndex][colIndex]" type="number" />
            </td>
          </tr>
        </table>

        <div class="text-h7">T</div>
        <table>
          <tr>
            <td v-for="(value, colIndex) in calibration['calibration']['t']" :key="colIndex">
              <q-input dense filled v-model.number="calibration['calibration']['t'][colIndex]" type="number" />
            </td>
          </tr>
        </table>
        <div class="q-mt-md text-h7">Rg</div>
        <table>
          <tr v-for="(row, rowIndex) in calibration['calibration']['Rg']" :key="rowIndex">
            <td v-for="(value, colIndex) in row" :key="colIndex">
              <q-input dense filled v-model.number="calibration['calibration']['Rg'][rowIndex][colIndex]" type="number" />
            </td>
          </tr>
        </table>

        <div class="text-h7">Tg</div>
        <table>
          <tr>
            <td v-for="(value, colIndex) in calibration['calibration']['tg']" :key="colIndex">
              <q-input dense filled v-model.number="calibration['calibration']['tg'][colIndex]" type="number" />
            </td>
          </tr>
        </table>
        <div class="q-mt-md text-h7">Additional info</div>
        <q-input dense filled v-model="calibration['calibration']['AdditionalInfo']" />
        <!-- </q-input> -->
        <!-- @keyup.enter="config_dialog = false" /> -->

      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <input type="file" @change="handleFileChange" />
        <q-btn flat label="Save" @click="saveData" />
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Upload" @click="uploadCalibration()" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
//import example from 'assets/example.json'
import { defineComponent, onMounted, onBeforeUnmount, ref, reactive, inject } from 'vue'
import { v4 as uuidv4 } from 'uuid'


export default defineComponent({
  name: 'DashBoardPage',
  components: {},
  setup() {
    const mqtt = inject('mqtt')
    const kinects = reactive({})
    const config_dialog_kv2 = ref(false);
    const config_dialog_k4a = ref(false);
    const calibration_dialog = ref(false);
    const configuration = reactive({})
    const calibration = reactive({})
    const previews = reactive({})
    const refreshIntervalId = ref(null);
    const separator = "|"
    const depthModeOptions = ["NFOV_2X2BINNED", "NFOV_UNBINNED", "WFOV_2X2BINNED", "WFOV_UNBINNED", "PASSIVE_IR"]
    const deviceFPSOptions = [5, 15, 30]
    const deviceColorResolution = [720, 1080]

    onMounted(() => {
      if (!mqtt.isConnected())
        mqtt.connect(onMessageArrived)
      else {
        subscribe()
        pingStatus()
      }
      refreshIntervalId.value = setInterval(updateSkeletons, 2000);
    })
    onBeforeUnmount(() => {
      clearInterval(refreshIntervalId.value);
    })
    function updateSkeletons() {
      //console.log('resetting skeletons')
      for (const [key, value] of Object.entries(kinects)) {
        kinects[key].skeletons = 0
      }
    }
    function subscribe() {
      mqtt.setOnMessageArrived(onMessageArrived)
    }
    function getColorFromStatus(status) {
      if (status) return 'green'
      else return 'grey'
    }
    const saveData = () => {
      const jsonData = JSON.stringify(calibration['calibration']);
      const blob = new Blob([jsonData], { type: 'application/json' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'calibration.json';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    function handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        readJsonFromFile(file);
      }
    }
    async function readJsonFromFile(file) {
      try {
        const content = await readFileContent(file);
        calibration['calibration'] = JSON.parse(content);
      } catch (error) {
        alert('Error reading file:', error);
      }
    }
    function readFileContent(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsText(file);
      });
    }
    function getColorFromActivity(activity) {
      if (activity === 'running') return 'primary'
      else if (activity === 'paused') return 'grey'
    }
    function getSaveAvi(kinect) {
      if (kinect.StreamingInterval == 1000)
        return true
      else return false
    }
    function toggleSaveAvi(kinect) {
      // if (kinect.streamingInterval == 1000)
      //   kinect.streamingInterval = -1
      // else
      //   kinect.streamingInterval = 1000
      let command = "stream" + separator
      if (kinect.StreamingInterval != -1)
        command += "-1"
      else
        command += "1000"
      mqtt.publish(kinect.TopicPrefix + '/' + kinect.StationId + '/ctrl', command)

    }
    function getColorFromPreview(kinect) {
      // if (kinect.preview) return 'primary'
      // else return 'grey'
      if (kinect.StreamingInterval >= 0) return 'primary'
      else return 'grey'

    }
    function getIconFromStatus(status) {
      if (status) return 'power'
      else return 'power_off'
    }
    function getIconFromActivity(activity) {
      if (activity === 'running') return 'stop'
      else if (activity === 'paused') return 'play_arrow'
    }
    function correctJSON(message) {
      let isoRegex = /ISODate\((".+?")\)/g
      let jsonMessage = message.replace(isoRegex, function (match, parenGroup) {
        return parenGroup
      })
      isoRegex = /NumberLong\((".+?")\)/g
      jsonMessage = jsonMessage.replace(isoRegex, function (match, parenGroup) {
        return parenGroup
      })
      return jsonMessage
    }
    function getSecondsDiff(startDate, endDate) {
      const msInSecond = 1000
      return Math.round(Math.abs(endDate - startDate) / msInSecond)
    }
    // called when a message arrives
    function onMessageArrived(message) {
      // console.log(message)
      // we are receiving topics in this form:
      // kv2/kinect1/snapshot
      // where the type is snapshot
      // and the publisher is kinect1
      const topic = message.destinationName.split('/')
      const type = topic.pop()
      const publisher = topic.pop()
      const version = topic.pop()
      switch (type) {
        case 'config':
          // ignore my own message
          configuration["config"] = JSON.parse(message.payloadString)
          configuration["topicPrefix"] = version
          configuration["stationId"] = publisher
          if (version == 'kv2')
            config_dialog_kv2.value = true
          else if (version == 'k4a')
            config_dialog_k4a.value = true
          break
        case 'calibration':
          // ignore my own message
          calibration["calibration"] = JSON.parse(message.payloadString)
          calibration["topicPrefix"] = version
          calibration["stationId"] = publisher
          calibration_dialog.value = true
          break
        case 'status':
          // ignore my own message
          const payload = JSON.parse(message.payloadString)
          kinects[payload.StationId] = payload
          break
        case 'snapshot':
          let base64String = ''
          if (version == 'k4a') {
            base64String = message.payloadString
          }
          else {
            base64String = window.btoa(
              new Uint8Array(message.payloadBytes).reduce(function (data, byte) {
                return data + String.fromCharCode(byte)
              }, '')
            )
          }
          previews[publisher] = 'data:image/jpg;base64,' + base64String
          break
        case 'skeletons':
          //if (publisher in viewSkeleton && viewSkeleton[publisher]) {

          kinects[publisher].skeletons = 0
          const jsonMessage = correctJSON(message.payloadString)
          const ooo = JSON.parse(jsonMessage)
          // console.log(ooo.  quanti scheletri e poi fare disegnetto
          // THIS GIVES AN ERROR WITH K4A sensors
          kinects[publisher].skeletons = Math.max(
            ...ooo.map((x) => x['S'].length)
          )
          //console.log('skeletons in sample: ', kinects[publisher].skeletons)
          // kinects[publisher].lastSampleTime = Date.now(); //Date.parse(ooo[ooo.length - 1].ST)
          // setTimeout(() => {
          //   console.log(getSecondsDiff(Date.now(), kinects[publisher].lastSampleTime ))
          //   if (getSecondsDiff(Date.now(), kinects[publisher].lastSampleTime )> 1) {
          //     console.log('too late, resetting')
          //     kinects[publisher].skeletons = 0
          //   }
          // }, 3000)
          //}
          break
      }
    }
    function pingStatus() {
      Object.keys(kinects).forEach((key) => delete kinects[key])
      mqtt.publish('kv2/all/ctrl', 'status')
      mqtt.publish('k4a/all/ctrl', 'status')
    }
    function uploadConfiguration() {

      mqtt.publish(configuration["topicPrefix"] + '/' + configuration["stationId"] + '/ctrl', 'setconfig' + separator + JSON.stringify(configuration["config"]))
    }
    function uploadCalibration() {

      mqtt.publish(calibration["topicPrefix"] + '/' + calibration["stationId"] + '/ctrl', 'setcalibration' + separator + JSON.stringify(calibration["calibration"]))
    }
    function toggle(kinect) {
      let command = 'stop'
      if (kinect.Reader !== 'running')
        command = 'start' + separator + new Date().toISOString().replaceAll(':', '.') //+ uuidv4()
      mqtt.publish(kinect.TopicPrefix + '/' + kinect.StationId + '/ctrl', command)
    }
    /*
          // togglePreview(kinect)
      let command = "stream:"
      if (kinect.streamingInterval != -1)
        command += "-1"
      else
        command += "1000"
      mqtt.publish('kv2/' + kinect.stationId + '/ctrl', command)

    */
    function takeSnapshot(kinect) {

      // if (kinect.preview) {
      let command = 'snapshot'
      mqtt.publish(kinect.TopicPrefix + '/' + kinect.StationId + '/ctrl', command)
      //   //if (kinect.reader === 'running')
      //   kinect.previewInterval = setInterval(()=>{
      //     mqtt.publish('kv2/' + kinect.stationId + '/ctrl', command)}, 1000)
      // } else {
      //   clearInterval(kinect.previewInterval)
      // }

    }
    function setSamplingRate(kinect) {
      let command = 'samplingrate' + separator + kinect.SamplingRate
      mqtt.publish(kinect.TopicPrefix + '/' + kinect.StationId + '/ctrl', command)
    }
    function getConfig(kinect) {
      let command = 'getconfig'// + kinect.SamplingRate
      mqtt.publish(kinect.TopicPrefix + '/' + kinect.StationId + '/ctrl', command)
    }
    function getCalibration(kinect) {
      let command = 'getcalibration'// + kinect.SamplingRate
      mqtt.publish(kinect.TopicPrefix + '/' + kinect.StationId + '/ctrl', command)
    }
    function disconnectStation(kinect) {
      // if (kinect.version == 'k4a')

      mqtt.publish(kinect.TopicPrefix + '/' + kinect.StationId + '/ctrl', 'quit')
      setTimeout(pingStatus, 3000)
    }
    function startAll() {
      const acqId = new Date().toISOString().replaceAll(':', '.')
      mqtt.publish(
        'kv2/all/ctrl',
        'start' + separator + acqId
      )
      mqtt.publish(
        'k4a/all/ctrl',
        'start' + separator + acqId
      )
    }
    function stopAll() {
      mqtt.publish('kv2/all/ctrl', 'stop')
      mqtt.publish('k4a/all/ctrl', 'stop')
    }
    function getPreview(kinect) {

      if (kinect in previews) return previews[kinect]
      else return 'preview_not_available' //"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg=="
    }
    function getSkeletonCount(kinect) {
      if ('skeletons' in kinect) return kinect.skeletons
      else return 0
    }

    return {
      kinects,
      previews,
      pingStatus,
      getColorFromStatus,
      getIconFromStatus,
      getIconFromActivity,
      getColorFromPreview,
      getColorFromActivity,
      toggle,
      takeSnapshot,
      getPreview,
      startAll,
      stopAll,
      getSkeletonCount,
      getSaveAvi,
      setSamplingRate,
      getConfig,
      getCalibration,
      toggleSaveAvi,
      disconnectStation,
      config_dialog_k4a,
      config_dialog_kv2,
      calibration_dialog,
      configuration,
      calibration,
      depthModeOptions,
      deviceFPSOptions,
      deviceColorResolution,
      uploadConfiguration,
      uploadCalibration,
      handleFileChange,
      saveData
    }
  },
})
</script>

<style>
table {
  border-collapse: collapse;
  border-spacing: 0;
}

td {
  border: 1px solid #ccc;
}
</style>
