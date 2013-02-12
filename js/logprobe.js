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

logprobe.getLogs = function(owner_id) {
  omh.read({
    owner: owner_id,
    payload_id: logprobe.payload_id + ":" + logprobe.streams[0].name,
    payload_version: "1",
    success: function(res) {
      if (!res)
        return
      logprobe.render(res.data);
    }
  })
}

// Renders the data to the page. Adds the level as a class to each line so visibility can be toggled
logprobe.render = function(data) {
  $(".data").empty();
  $.each(data, function(i, v) {
    pre = $("<pre>"+v.metadata.timestamp + " " + v.data.tag + ": " + v.data.message + "</pre>");
    pre.addClass(v.data.level);
    $(".data").append(pre);
  });
};

$(document).ready(function() {
  omh.init();
  $(".account .username").attr('value', omh.get("omh.owner"));
  logprobe.getLogs(omh.get("omh.owner"));

  // Add a method to watch text for the owner
  $(".account .username")
    .data('timeout', null)
    .keyup(function(){
        clearTimeout($(this).data('timeout'));
        $(this).data('timeout', setTimeout(logprobe.getLogs($(this).attr('value')), 2000));
    });

  // Add a click function to the checkboxes which toggles the visibility of the selected level
  $(".filter :checkbox").click(function() {
    $('.data .'+$(this).attr("name")).toggle($(this).is(':checked'));
  });
});