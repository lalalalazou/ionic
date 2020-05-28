angular.module('starter.services', [])
.service('myService', ['$http', '$q','$rootScope','$state', function ($http, $q,$rootScope,$state) {
	this.appHost='http://zelar.yhbz.net/xd/';
	this.ajaxUrlfile=this.appHost+"data2/";
	var ajaxUrl=this.ajaxUrlfile+"postInfoAll.php"
	this.imgUrl=this.appHost+"upload/";
	this.isRemember=false;
	var _this=this;
	this.getJf=function(){
		var data={method:'get_jf'};
	
		if(arguments[0]){
			data.username=arguments[0];
		}
		var promise = _this.zjPost(data); // 同步调用，获得承诺接口  
	    promise.then(function(data) {  // 调用承诺API获取数据 .resolve
	        $rootScope.userInfo.jf=data.jf;
	       $rootScope.$broadcast('userInfo', $rootScope.userInfo);
	    }, function(data) {  // 处理错误 .reject  
	        $rootScope.userInfo.jf = 0;
	       $rootScope.$broadcast('userInfo', $rootScope.userInfo); 
	    });
	}
	this.getUserSit=function(){
		
		if(!$rootScope.selectsit || arguments[0])
		{
			var data={method:'receivelist',attach:'moren'}
			if(arguments[0]){
				data={method:'receivelist',attach:arguments[0]}
			}
			var promise = _this.zjPost(data);
			promise.then(function(response) {
				//console.log(response)
				if(response.status){
					$rootScope.selectsit = response.value[0];
					$rootScope.$broadcast('selectsit', response.value[0]); 
				}
			}, function(data) {
			    console.log(data)
			})
		}
	}
	
	this.setUsername=function(){
		var re=false;
		if (typeof localStorage === 'object') {
			try {
				localStorage.setItem('localStorage', 1);
				localStorage.removeItem('localStorage');
			} catch (e) {
				Storage.prototype._setItem = Storage.prototype.setItem;
				Storage.prototype.setItem = function() {};
				alert('请勿禁止缓存～');
			}
		}
		if(arguments[0])//第一个是用户名称
		{
			
			var response=arguments[0];
			if(response.status){
				re=true;
				$rootScope.userInfo=response;
				$rootScope.islogin=1;
				var isRemember=_this.isRemember;//一次性记住登录状态用sessionStorage
				if(arguments[1])
				{
					isRemember=arguments[1];//默认长时间记住登录状态用localStorage
				}
				var obj = JSON.stringify(response);
				
				
				localStorage.setItem('userInfo', obj);
				if(isRemember)
				{
					localStorage.setItem('islogin', 1);
				}else
				{
					sessionStorage.setItem('islogin', 1);
				}
		       	$rootScope.$broadcast('islogin', $rootScope.islogin);
		        $rootScope.$broadcast('userInfo', $rootScope.userInfo);
		        $state.go("tab.home");
			}
		}
		return re;
	}
	this.zjGet=function(d){
		
		var myUrl=ajaxUrl+"?m=get";
		if(arguments[1])
		{
				myUrl=_this.ajaxUrlfile+(arguments[1]);
		}
	
      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
      $http({
			  method: 'POST',
			  url: myUrl,
			  data: d//作为消息体参数
			}).  
          success(function(data, status, headers, config) {
            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了  
          }).  
          error(function(data, status, headers, config) {
            deferred.reject(data);   // 声明执行失败，即服务器返回错误  
          });  
          return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API   
    }
	
	this.zjPost=function(d){
		//console.log(d)
		if(!d.username)
		{
			if($rootScope.userInfo)
			{
				d.username=$rootScope.userInfo.username;
				d.shopToken=$rootScope.userInfo.shopToken;
				d.service=$rootScope.userInfo.service;
			}
			
		}
		var myUrl=ajaxUrl+"?m=post";
		if(arguments[1])
		{
				myUrl=_this.ajaxUrlfile+(arguments[1]);
		}
	
      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
      $http({
			  method: 'POST',
			  url: myUrl,
			  data: d//作为消息体参数
			}).  
          success(function(data, status, headers, config) {
          	if(!data.safeStatus)
          	{
          		//console.log(d)
          		//console.log(data.status)
          		_this.fLogOut();
          	}
            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了  
          }).  
          error(function(data, status, headers, config) {
          	
            deferred.reject(data);   // 声明执行失败，即服务器返回错误  
          });  
          return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API   
    }
	this.winready=function(plusReady){
		if(window.plus){
	        plusReady();
	    }else{
	        document.addEventListener('plusready',plusReady,false);
	    }
	}
	this.toast=function(msg){
		_this.winready(function(){
		 	plus.nativeUI.toast(msg ,{duration:"long"});
		});
	}
	this.fLogOut=function(){
		sessionStorage.removeItem("islogin");
		localStorage.removeItem("islogin");
		$rootScope.userInfo=null;
		$rootScope.quickLogon=false;
		if (arguments[0] && arguments[1])
		{
			var service=arguments[0];
			var username=arguments[1];
			//console.log(username);
			$state.go("tab.login",{sid:service,username:username});
		}else
		{
			$state.go("tab.login",{sid:null,username:null})
		}
		
	}
	this.fLogin=function(username,pass,service,isRemember){//checked  true代表本地local储存 false代表session储存
		
		var token="0";
		var clientid="0";
		var appid="0";
		var appkey="0";
		_this.winready(function(){
			var info = plus.push.getClientInfo();
			token=info.token;
			clientid=info.clientid;
			appid=info.appid;
			appkey=info.appkey; 
		})
		var data={username:username,pwd:pass,service:service,token:token,clientid:clientid,appid:appid,appkey:appkey};
		return data;
		
		
	}
	this.jisuantotal=function(){//计算数据，并且保存数据
		 
		if(arguments[0] && arguments[1] )
		{
			var data= arguments[0];//要计算的数据
			var name= arguments[1];//要储存的名字
		  	var re={
			  	checkTotalPrice:0,
			  	checkTotalNum:0,
			  	totalPrice:0,
			  	totalNum:0,
			  	allChecked:true,
			  	value:data
			};
			if(re.value)
			{
			  	 for(a in re.value)
			  	 {
			  	 	for(b in re.value[a])
					  {
					  	
						  	for(c in re.value[a][b].sn)
						  	{
						  		
						  		if(re.value[a][b])
						  		{
							  		if(arguments[2]=='doCheck')//第三个参数是方法： doCheck全选
							  		{
							  			var isCheck= arguments[3];//是否全选
							  			if(isCheck)
							  			{
							  				re.value[a][b].sn[c].checked=true;
							  			}else
							  			{
							  				re.value[a][b].sn[c].checked=false;
							  			}
							  			
							  		}else if(arguments[2]=='deletCheck')//删除选中
							  		{
							  			if(re.value[a][b].sn[c].checked){
								  			re.value[a][b].localNum-=re.value[a][b].sn[c].localNum;
								  			re.value[a][b].sn[c].localNum=0;
							  			}
							  		}else if(arguments[2]=='creatCheck')//生成选中的为新的
							  		{
							  			if(!re.value[a][b].sn[c].checked){
								  			re.value[a][b].localNum-=re.value[a][b].sn[c].localNum;
								  			re.value[a][b].sn[c].localNum=0;
							  			}
							  		}else if(arguments[2]=='deletePid')//删除选中产品sn
									{
										var pid= arguments[3];//产品id
										if(pid==c)
										{
											re.value[a][b].localNum-=re.value[a][b].sn[c].localNum;
								  			re.value[a][b].sn[c].localNum=0;
										}
									}
						  		
							  		if(re.value[a][b].localNum<=0)
							  		{
							  			//delete re.value[a][b];
							  		}else
							  		{
								  		re.totalNum+=re.value[a][b].sn[c].localNum;
								  		re.totalPrice+=((re.value[a][b].integral)*(re.value[a][b].sn[c].localNum));
								  		if(re.value[a][b].sn[c].checked)
								  		{
								  			re.checkTotalNum+=re.value[a][b].sn[c].localNum;
								  			re.checkTotalPrice+=((re.value[a][b].integral)*(re.value[a][b].sn[c].localNum));
								  		}else
								  		{
								  			re.allChecked=false;//只要有一次没有选择，就不属于全选
								  		}
							  		}
						  		}
					  	}
					  }
			  	 }
			}
			var obj = JSON.stringify(re);
			sessionStorage.setItem(name, obj);
			$rootScope[name] = re;
	        $rootScope.$broadcast(name, re); 
	       if(arguments[2]=='creatCheck'){
	       		var oldName= arguments[3];//旧的数据不变
	       		var oldObj=sessionStorage.getItem(oldName);
	       		oldObj=JSON.parse(oldObj);
				$rootScope[oldName] = oldObj
				$rootScope.$broadcast(oldName, oldObj); 
	       }
	       
		
	        //console.log(re);
			//return re;
		}
	}
	this.receiveOrder=function(orderid,fun){//订单收货
		var username=this.username
		var da={orderid:orderid}
		var data={method:'receiveOrder',value:da,username:username}
		var promise = _this.zjPost(data);
		promise.then(function(response) {
			fun(response);
		}, function(data) {
		    console.log(data)
		})
	}
	this.deleteOrder=function(orderid,fun){//未支付时删除订单
		var da={orderid:orderid}
		var data={method:'deleteOrder',value:da,username:this.username}
		var promise = _this.zjPost(data);
		promise.then(function(response) {
			fun(response);
		}, function(data) {
		    console.log(data)
		})
	}
}])

.factory('Chats', function(){
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
