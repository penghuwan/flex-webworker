function work () {
  onmessage = ({data: {jobId, message}}) => {
    console.log ('i am worker, receive:-----' + message);
    postMessage ({jobId, result: 'message from worker'});
  };
}

const makeWorker = f => {
  let pendingJobs = {};

  const worker = new Worker (
    URL.createObjectURL (new Blob ([`(${f.toString ()})()`]))
  );

  worker.onmessage = ({data: {result, jobId}}) => {
    // 调用resolve，改变Promise状态
    pendingJobs[jobId] (result);
    // 删掉，防止key冲突
    delete pendingJobs[jobId];
  };

  return (...message) =>
    new Promise (resolve => {
      const jobId = String (Math.random ());
      pendingJobs[jobId] = resolve;
      worker.postMessage ({jobId, message});
    });
};

const testWorker = makeWorker (work);

testWorker ('message from main thread').then (message => {
  console.log ('i am main thread, i receive:-----' + message);
});
