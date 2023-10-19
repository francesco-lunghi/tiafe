
class MQTTWSService {

  constructor(host, port, clientID) {
    this.host = host
    this.port = port
    this.clientID = clientID
    this.client = null
  }


  connect(onMessageArrived) {
    // client = new Paho.MQTT.Client('test.mosquitto.org', 8081, 'clientJS')
    // client = new Paho.MQTT.Client('theseed', 8883, 'clientJS')
    this.client = new Paho.MQTT.Client(this.host, this.port, this.clientID)

    // set callback handlers
    this.client.onConnectionLost = this.onConnectionLost
    this.client.onMessageArrived = onMessageArrived

    // connect the client
    this.client.connect({
      // useSSL: true,
      userName: 'cesco',
      password: 'c3sc0',
      onSuccess: this.onConnect,
      onFailure: this.onFailure,
      invocationContext: this
    })
  }
  onFailure(message) {
    console.log(message)
    alert('MQTT Fail to connect')
    //setTimeout(connect, 2000)
  }
  isConnected() {
    if (this.client)
      return this.client.isConnected()
    else
      return false
  }
  // called when the client connects
  onConnect(context) {
    // Once a connection has been made, make a subscription and send a message.
    console.log('onConnect')
    context.invocationContext.client.subscribe('kv2/+/status')
    context.invocationContext.client.subscribe('kv2/+/snapshot')
    context.invocationContext.client.subscribe('kv2/+/skeletons')
    context.invocationContext.client.subscribe('k4a/+/status')
    context.invocationContext.client.subscribe('k4a/+/snapshot')
    context.invocationContext.client.subscribe('k4a/+/skeletons')
    context.invocationContext.publish('kv2/all/ctrl', 'status')
    context.invocationContext.publish('k4a/all/ctrl', 'status')
    //subscribe('kv2/kinect1/skeletons')
  }


  // called when the client loses its connection
  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      alert('onConnectionLost:' + responseObject.errorMessage)
      console.log('onConnectionLost:' + responseObject.errorMessage)
    }
  }

  // called when a message arrives
  onMessageArrived(message) {
    console.log(message)
  }
  setOnMessageArrived(callback) {
    this.client.onMessageArrived = callback
  }
  setOnConnect(callback) {
    this.client.onConnect = callback
  }
  publish(topic, payload) {
    const message = new Paho.MQTT.Message(payload)
    message.destinationName = topic
    this.client.send(message)
  }

}
export default MQTTWSService
