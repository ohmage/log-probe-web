var logprobe = {}
logprobe.payload_id = "omh:ohmage:observer:org.ohmage.LogProbe";
logprobe.version = "1";
logprobe.streams = [
  {
    "name":"log",
    "version":"1"
  },
  {
    "name":"activity",
    "version":"1"
  },
  {
    "name":"service",
    "version":"1"
  },
  {
    "name":"widget",
    "version":"1"
  },
  {
    "name":"network",
    "version":"1"
  }
];

logprobe.getLogs = function() {
  console.log(logprobe.payload_id+":"+logprobe.streams[0].name)
  omh.read({
    owner: omh.owner,
    payload_id: logprobe.payload_id + ":" + logprobe.streams[0].name,
    payload_version: "1",
    success: function(res) {
      if (!res)
        return
      logprobe.render(res.data);
    }
  })
}

logprobe.render = function(data) {
  console.log("done")
  $.each(data, function(i, v) {
    $(".data").append("<pre>"+v.metadata.timestamp + " " + v.data.tag + ": " + v.data.message + "</pre>");
  });
};

$(document).ready(function() {
  omh.init();
  $(".account").text("Account: "+omh.get("omh.owner"));
  $(".logout").click(function() {
    omh.logout();
  });
  logprobe.getLogs();
});