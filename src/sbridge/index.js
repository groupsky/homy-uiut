#!/usr/bin/env node

const PORT = process.argv[2] || process.env.PORT || '/dev/ttyUSB0'
const BROKER_URL = process.argv[3] || process.env.BROKER_URL || 'mqtt://localhost'
const TOPIC = process.argv[4] || process.env.TOPIC || '/sensors'

const SerialPort = require('serialport')
const mqtt = require('mqtt')
const Readline = SerialPort.parsers.Readline

const port = new SerialPort(PORT)
const client = mqtt.connect(BROKER_URL)

const parser = port.pipe(new Readline())

let data

parser.on('data', line => {
  console.log(line)
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
