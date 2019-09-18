// originally posted: https://gist.github.com/simon300000/6e5d1e6bcd254d5c16adf4efa2a82e65

// 刚刚说的感觉很有意思
// 我做了个Demo2333
// 不过只能弄很简单的Function（ 可见Functional是未来（ 误）

const testFunction = num => num * 2
const slowFunction = time => {
  const now = Date.now()
  let round = 0
  while (now + time > Date.now()) {
    round++
  }
  return round
}

const makeWorker = f => {
  let pendingJobs = {}

  const worker = new Worker(URL.createObjectURL(new Blob([
    `onmessage = ({ data: { jobId, params } }) => {
     const result = (${f.toString()})(...params)
     postMessage({ jobId, result })
    }`
  ])))

  worker.onmessage = ({ data: { result, jobId } }) => {
    pendingJobs[jobId](result)
    delete pendingJobs[jobId]
  }

  return (...params) => new Promise(resolve => {
    const jobId = String(Math.random())
    pendingJobs[jobId] = resolve
    worker.postMessage({ jobId, params })
  })
}

const testWorker = makeWorker(testFunction)
const slowWorker = makeWorker(slowFunction)

testWorker(122).then(console.log)
slowWorker(1000).then(runs => console.log(`Runs: ${runs}`))
testWorker(233).then(console.log)
slowWorker(1000).then(runs => console.log(`Runs: ${runs}`))
testWorker(233).then(console.log)
