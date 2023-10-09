<template>
  <router-view />
</template>

<script>
import { defineComponent, provide } from 'vue'
import mqtt from 'src/services/MQTTWSService'
import MQTTWSService from 'src/services/MQTTWSService'
export default defineComponent({
  name: 'App',
  setup() {
    // const mqtt = new MQTTWSService('localhost', 9001, 'clientJS')
    const mqtt = new MQTTWSService('localhost', 8883, 'clientJS')
    mqtt.connect()
    provide('mqtt', mqtt)
  },
})
</script>
