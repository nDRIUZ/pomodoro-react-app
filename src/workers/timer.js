const workercode = () => {
  var self = this;
  self.onmessage = function (e) {
    clearInterval(e.data.intervalId);
    if (e.data.status) {
      var intervalId = setInterval(() => {
        self.postMessage({
          timer: e.data.finishTime - Date.now(),
          intervalId: intervalId,
        });
      }, 1000);
    }
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;
