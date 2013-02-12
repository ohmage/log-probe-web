if(!omh) var omh = {}

omh.set = function(key,value){
  localStorage.setItem(key, value);
}

omh.get = function(key){
  return localStorage.getItem(key);
}

omh.init = function(baseurl, requester, owner){
  if(baseurl) omh.set("omh.baseurl", baseurl);
  if(requester) omh.set("omh.requester", requester);
  if(owner) omh.set("omh.owner", owner);
  
  omh.baseurl = omh.get("omh.baseurl");
  omh.requester = omh.get("omh.requester");
  omh.owner = omh.get("omh.owner");
}

omh.token = function(tok){
  if(tok)
    localStorage.setItem('omh.token',tok)
  return localStorage.getItem('omh.token')
} 

omh.username = function(tok){
  if(tok)
    localStorage.setItem('omh.username',tok)
  return localStorage.getItem('omh.username')
}

omh.initTest = function(){
  if(!omh.baseurl || !omh.requester){
    window.location= "index.html";
    return false
  }
  return true
}

//callback (optional) can be an object with success and failure functions  
omh.authenticate = function(user, password, callback){
  if(!omh.initTest())return
  omh.username(user)
  var url = omh.baseurl + '/app/omh/v1.0/authenticate'
  $.post(url,{
    user:user,
    password:password,
    requester:omh.requester
  },function(res){
    //res = $.parseJSON(res)
    if(res.auth_token){
      omh.token(res.auth_token)
      if(callback && callback.success)
        callback.success(res)
    }
    else{
      $.each(res.errors,function(){
        console.log(this)
      })
      if(callback && callback.failure)
        callback.failure(res)
    }
  })
}

omh.read = function(params){
  if(!omh.initTest())return
  var url = omh.baseurl + '/app/omh/v1.0/read'
  if(!params || !params.payload_id || !params.payload_version) {
    console.log("you must specify payload_id and payload_version")
  }
  params.auth_token = omh.token()
  params.requester = omh.requester
  $.ajax({
    url: url,
    data:params,
    type:'POST',
    success: function(res) {
      if(params.success)
        params.success(res)
    }
  }).fail(function(jqXHR, textStatus) {
    if(params.failure) {
      params.failure(jqXHR, textStatus);
    }
    console.log(jqXHR)
  });
}