// 文件名为main.js
function work () {
    onmessage = ({data: {message}}) => {
      console.log ('i am worker, receive:' + message);
      postMessage ({result: 'message from worker'});
    };
  }
  
  const runWorker = f => {
    const worker = new Worker (
      URL.createObjectURL (new Blob ([`(${f.toString ()})()`]))
    );
  
    worker.onmessage = ({data: {result}}) => {
      console.log ('i am main thread, receive:' + result);
    };
  
    worker.postMessage ({message: 'message from main thread'});
  };
  
  const testWorker = runWorker (work);