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

logprobe.data = []

logprobe.getLogs = function() {
  omh.read({
    owner: omh.owner,
    payload_id: logprobe.payload_id + ":" + logprobe.streams[0].name,
    payload_version: "1",
    success: function(res) {
      if (!res)
        return
        console.log(res.data)
      logprobe.data = logprobe.data.concat(res.data)
      logprobe.render();
    }
  })
}

// Renders the data to the page. Adds the level as a class to each line so visibility can be toggled
logprobe.render = function() {
  $(".data").empty();
  $.each(logprobe.data, function(i, v) {
    pre = $("<pre>"+v.metadata.timestamp + " " + v.data.tag + ": " + v.data.message + "</pre>");
    pre.addClass(v.data.level);
    $(".data").append(pre);
  });
};

$(document).ready(function() {
  omh.init();
  $(".account").text("Account: "+omh.get("omh.owner"));
  $(".logout").click(function() {
    omh.logout();
  });
  logprobe.getLogs();

  // Add a click function to the checkboxes which toggles the visibility of the selected level
  $(".filter :checkbox").click(function() {
    $('.data .'+$(this).attr("name")).toggle($(this).is(':checked'));
  });
});