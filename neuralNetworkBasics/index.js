// exclusive or 
const neural = require('brain.js')
const net = new neural.NeuralNetwork({hiddenLayers:[3]})
const trainData = [
  {input:[0,0], output:[0]},
  {input:[0,1], output:[1]},
  {input:[1,0], output:[1]},
  {input:[1,1], output:[0]},
]

net.train(trainData)

console.log(net.run([0,0]));