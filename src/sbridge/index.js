#!/usr/bin/env node

const PORT = process.argv[2] || process.env.PORT || '/dev/ttyUSB0'
const BROKER_URL = process.argv[3] || process.env.BROKER_URL || 'mqtt://localhost'
const TOPIC = process.argv[4] || process.env.TOPIC || '/sensors'

const SerialPort = require('serialport')
const mqtt = require('mqtt')
const Readline = SerialPort.parsers.Readline

const port = new SerialPort(PORT, {
    baudRate: 9600
})
const client = mqtt.connect(BROKER_URL)

const parser = port.pipe(new Readline())

port.on('error', err => console.error(err))
parser.on('error', err => console.error(err))

let data

parser.on('data', line => {
  console.log(new Date(), line)
  try {
    data = JSON.parse(line)
  } catch {
    return
  }
  try {
    data.timestamp = Date.now()
    client.publish(TOPIC, JSON.stringify(data))
  } catch (e) {
    console.error(e)
  }
})

console.log('Starter listening on', PORT, 'sending to', BROKER_URL, TOPIC)
