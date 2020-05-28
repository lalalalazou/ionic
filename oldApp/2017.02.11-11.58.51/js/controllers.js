angular.module('starter.controllers', [])
////////////////////////////////////首页//////////////////////////////////////////////////////////////////////////////
.controller('HomeCtrl', function($rootScope,$scope,$stateParams,myService,$timeout,$state) {
$rootScope.$on('userInfo', function(d,data) {
	$scope.jf=$rootScope.userInfo.jf
});  
	$scope.show=function()
	{
		$scope.imgUrl =myService.imgUrl;
		var data={method:'zj_banner'}
		var promise = myService.zjPost(data); // 同步调用，获得承诺接口  
	    promise.then(function(data) {  // 调用承诺API获取数据 .resolve 
	        $scope.banners=data.value;
	    	$scope.myActiveSlide = 1;
			//$scope.doRefresh();
	    }, function(data) {  // 处理错误 .reject  
	        console.log(data)
	    });
	}
	$scope.show();
	$scope.doRefresh=function(){
		
	  	if($rootScope.userInfo)
		{
			$scope.jf=$rootScope.userInfo.jf;
		}else
		{
			$scope.jf=0;
		}
		var data={method:'zj_class_prodcut',attach:'1'}
		var promise = myService.zjPost(data); // 同步调用，获得承诺接口  
	    promise.then(function(data) {  // 调用承诺API获取数据 .resolve 
	       $scope.products = data.value;
	    }, function(data) {  // 处理错误 .reject  
	        console.log(data)
	    }).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	        
	    });
	  
	}
	$scope.$on('$ionicView.beforeEnter', function (){
	 	
	$scope.doRefresh();
	})
})

//////////////////登录////////////////////////////////
.controller('loginpageMyCtrl', function($rootScope,$scope,$stateParams,myService,$timeout,$state) {
	$scope.user={type:"1",pro:"210000",service:"1",username:"",pass:"",imgCode:""}
//	if($stateParams.username && $stateParams.sid){
//		$scope.user.username=$stateParams.username;
//		$scope.user.service=$stateParams.sid;
//	}
	
	$scope.getCodeImg = function() {
		var timestamp=new Date().getTime();
	    var newImg=myService.ajaxUrlfile+"captcha.php?"+timestamp;
	    $scope.codeImg=newImg;
	}
	$scope.getCodeImg();
	var data={method:'getGameServiceNew'}
	var promise = myService.zjGet(data); 
	promise.then(function(response) {
		//console.log(response);
	  	$scope.gameService = response.value;
	  	$scope.gameServiceType = response.type;
	  	$scope.pros = response.pro;
	  	var userInfo=localStorage.getItem("userInfo");
	  	userInfo=JSON.parse(userInfo);
	  	if($stateParams.username && $stateParams.sid){
			$scope.user.username=$stateParams.username;
	  		if(response.idValue[$stateParams.sid])
	  		{
	  			//console.log(response);
				$scope.user.type=response.idValue[$stateParams.sid].type;
				$scope.user.pro=response.idValue[$stateParams.sid].province;
				$scope.user.service=$stateParams.sid;
	  		}
	  		
		}else if(userInfo)
		{
			if(userInfo.status)
			{
				$scope.user.type=userInfo.type;
				$scope.user.pro=userInfo.province;
				$scope.user.service=userInfo.service;
				$scope.user.username=userInfo.gameId;
			}
		}
		$scope.usernamePlaceholders=[,"游戏ID","代理商账号"]
	}, function(data) {
	    console.log(data)
	});
	$scope.checkErrorTimes=function(user)
	{
		var data={method:'getErrorTimes',username:user.username}
		var promise = myService.zjGet(data); // 同步调用，获得承诺接口  
		promise.then(function(data) {  // 调用承诺API获取数据 .resolve 
		  	$scope.errorTimes = data.loginErrorTimes;
		}, function(data) {  // 处理错误 .reject  
		    console.log(data)
		})
	}
	$scope.checkErrorTimes($scope.user);
	$scope.logWarm=null;
	$scope.pushNotification = { checked: true };
	$scope.isShow = true;
	$scope.changeShow=function(isShow){//显示隐藏眼睛
		if(isShow){
			$scope.isShow = false;
		}else
		{
			$scope.isShow = true;
		}
	}
	$scope.LoginNow=function(user){
		var data=myService.fLogin(user.username,user.pass,user.service,$scope.pushNotification.checked);
		var promise = myService.zjPost(data,'postlogin.php'); // 同步调用，获得承诺接口  
	    promise.then(function(response){  // 调用承诺API获取数据 .resolve
			 $scope.checkErrorTimes(user);
			 //console.log(response)
	      	if(response.status){
		      		if(myService.setUsername(response)){
		      		//	console.log("登录成功");
		      		}
				}else{
					$scope.getCodeImg();
					$scope.user.imgCode="";
					$scope.logWarm=response.smg;
					$timeout(function (){
						$scope.logWarm=""
					}, 3000);
			}
	    }, function(data) {  // 处理错误 .reject  
	     console.log("链接失败")
	    });
	}
	$scope.check=function(user){
		var checkCode=true;
		//console.log($scope.errorTimes)
		if($scope.errorTimes>=3)
		{
			checkCode=false;
			var data={method:'getCodeImg'}
			var promise = myService.zjGet(data); // 同步调用，获得承诺接口  
			promise.then(function(response) {  // 调用承诺API获取数据 .resolve 
				
			  var authnum_session=response.authnum_session;
				if(authnum_session!=user.imgCode)
				{
					alert("验证码错误～")
					
				}else
				{
					$scope.LoginNow(user);
				}
			}, function(data) {  // 处理错误 .reject  
			    console.log(data)
			})
		}else
		{
			$scope.LoginNow(user);
		}
	}
})
///////////////////////////////用户中心//////////////////////////////////////////////////////////
.controller('userindexMyCtrl', function($rootScope,$scope,myService) {
//登录状态END
$rootScope.$on('userInfo', function(d,data) {  
	$scope.jf=$rootScope.userInfo.jf;
});  
	$scope.doRefresh = function() {
		if($rootScope.userInfo)
		{
			$scope.jf=$rootScope.userInfo.jf;
		}else
		{
			$scope.jf=0;
		}
		var data={method:'userinfo'}
		var promise = myService.zjPost(data); // 同步调用，获得承诺接口  
	    promise.then(function(data) {  // 调用承诺API获取数据 .resolve 
	      	$scope.userInfo = data.value;
	    }, function(data) {  // 处理错误 .reject  
	        console.log(data)
	    }).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	     });
	  
	}
	$scope.doRefresh();
	$scope.unbinkwx=function(){
		if(confirm('确定要退出积分商城吗？'))
		{
			myService.fLogOut();
		}
	}	
})
///////////////////////////////查看卡密/////////////////////////////
.controller('couponCodeMyCtrl', function($rootScope,$scope,myService,$stateParams,$state) {
	$scope.cid=$stateParams.cid;
	$scope.imgUrl =myService.ajaxUrlfile;
	$scope.doRefresh = function() {
		var data={method:'couponCode',attach:$scope.cid}
		var promise = myService.zjPost(data); 
		promise.then(function(response) {
		  	$scope.status=response.status;
				if(response.status)
				{
					$scope.c = response.value;	
				}
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	  });
	}
	$scope.doRefresh()		
})
///////////////////////////////活动中心/////////////////////////////

.controller('activityMyCtrl', function($rootScope,$scope, myService,$stateParams,$state) {
	
	$scope.doRefresh = function() {
		var data={method:'getactivity'}
		var promise = myService.zjPost(data); 
		promise.then(function(response) {
		  $scope.imgUrl =myService.imgUrl;
			$scope.status=response.status;
			if(response.status)
			{
				$scope.banners = response.value;
			}
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	 });
	}
	$scope.doRefresh()		
})

///////////////////////////////积分夺宝列表/////////////////////////////
.controller('activityIndianalistMyCtrl', function($rootScope,$scope, myService,$state) {
	$scope.page=0;
	$scope.domore=false;
	$scope.list=[];
	$scope.loadeData = function(){
		var data={method:'activityIndianalist',page:$scope.page}
		var promise = myService.zjPost(data); 
		promise.then(function(response) {
		  $scope.imgUrl =myService.imgUrl;
			$scope.status=response.status;
			if(response.status)
			{
				$scope.banner = response.banner;
				for (v in response.value)
				{
					$scope.list .push(response.value[v]) ;
				}
			}else
			{
				$scope.domore=true;
			}
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.infiniteScrollComplete');  
	      $scope.$broadcast('scroll.refreshComplete');
	 });
	}
	$scope.loadMore = function() {
		$scope.page++;
		$scope.loadeData();
	}
	$scope.doRefresh = function() {
		$scope.domore=false;
		$scope.page=0;
		$scope.list=[];
	  	$scope.loadeData();
	};
	$scope.doRefresh()
})
///////////////////////////////夺宝活动详情/////////////////////////////
.controller('activityIndianaContentMyCtrl', function($rootScope,$scope,myService,$state,$stateParams,$ionicSlideBoxDelegate) {
	$scope.username=$rootScope.username;
	$scope.buy={
		num:0
	}
	$scope.showpay=true;
	$scope.togglepayButton = function() {
		$scope.showpay=!$scope.showpay;
	}
	
	$scope.count = function(buy,num) {
		var buy=buy.num;
		var overplusLimit=($scope.indiana.number_limit-$scope.indiana.number_now);
		//console.log(buy+":"+overplusLimit)
		if(buy<=0 && num<0)
		{
			$scope.buy.num=0;
			return false;
		}
		if(buy>=overplusLimit && num>0)
		{
			$scope.buy.num=overplusLimit;
			return false;
		}
		$scope.buy.num+=num;
		
	}
	$scope.pay = function(buy) {
		var username=$rootScope.username;
		var da={cid:$stateParams.cid,num:buy.num}
		var price=buy.num*$scope.indiana.price;
		var data={method:'payIndiana',value:da}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
			if(response.status){
				//$rootScope['jf'] = response.jf;
			    //$rootScope.$broadcast('jf',$rootScope['jf']);
			    $rootScope.userInfo.jf=response.jf;
		        $rootScope.$broadcast('userInfo',$rootScope.userInfo);
				var msg="支付成功("+price+"积分),\n幸运号为"+response.arrcCode;
				if(response.winner_code)
				{
					msg+="人数已满，<br/>立即开奖\n ";
					alert(msg);
				}else
				{
					msg+="前往【夺宝记录】？";
					if(confirm(msg))
					{
						$state.go("tab.indianaUserList");
						return false;
					}else
					{
						
					}
				}
				//window.location="orderlist.php?status=2"
				$scope.showpay=true;
				$scope.buy.num=0;
				$scope.doRefresh();
			}else{
				alert(response.msg)
			}
		}, function(data) {
		    console.log(data)
		})
	}
	$rootScope.$on('userInfo', function(d,data) {  
		$scope.jf=$rootScope.userInfo.jf;
	});  
	$scope.doRefresh = function() {
		var data={method:'activityIndianaContent',attach:$stateParams.cid}
		var promise = myService.zjPost(data); 
		promise.then(function(response) {
		  $scope.imgUrl =myService.imgUrl;
			$scope.status=response.status;
			if(response.status)
			{
				$scope.indiana = response.value.indiana;
				$scope.products = response.value.productInfo;
				$scope.img = response.value.img;
				if($rootScope.userInfo)
				{
					$scope.jf=$rootScope.userInfo.jf;
				}else
				{
					$scope.jf=0;
				}
				$scope.productimg=[];
				if($scope.img)
				{
					$scope.productimg = $scope.img.split(",");
				}
				if($scope.productimg.length>0)
				{ 
					 $ionicSlideBoxDelegate.update();
				}
			}
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.infiniteScrollComplete');  
	      $scope.$broadcast('scroll.refreshComplete');
	 });
	}
	$scope.doRefresh();
})
///////////////////////////////积分夺宝记录明细/////////////////////////////
.controller('indianaUserListMyCtrl', function($rootScope,$scope, myService,$state) {
	$scope.change = function(attch) {
		$scope.classfy =attch;
		$scope.doRefresh()
	}
	$scope.tiaozhuan = function(cid){
	    $state.go("tab.activityIndianaContent",{cid:cid});
	};
	$scope.classfy =0;//默认显示未使用的卡券
		var data={method:'indianaIsWinning'}
		var promise = myService.zjPost(data); 
		promise.then(function(response) {
			$scope.indianaIsWinning = response.value;	
		}, function(data) {
		    console.log(data)
		})
	$scope.imgUrl =myService.imgUrl;
	$scope.page=0;
	$scope.domore=false;
	$scope.myLlist=[];
	$scope.change = function(attch) {
		$scope.classfy =attch;
		$scope.doRefresh()
	}
	$scope.loadeData= function(){
		var data={method:'indianaUserList',attach:$scope.classfy,page:$scope.page}
		var promise = myService.zjPost(data); 
		promise.then(function(response) {
			if(response.status)
			{
				for (v in response.value)
				{
					$scope.myLlist .push(response.value[v]) ;
				}
			}else
			{
				$scope.domore=true;
			}
			if($scope.myLlist.length>0)
			{
				$scope.status=true;
			}else
			{
				$scope.status=false;
			}
		}, function(data) {
		    console.log(data)
		})
		.finally(function() {
       // 停止广播ion-refresher
      $scope.$broadcast('scroll.infiniteScrollComplete');  
      $scope.$broadcast('scroll.refreshComplete');
    });
	}
	$scope.loadMore = function() {
		$scope.page++;
		$scope.loadeData();
	}
	$scope.doRefresh = function() {
		$scope.status=true;
		$scope.domore=false;
		$scope.page=0;
		$scope.myLlist=[];
	  	$scope.loadeData();
	};
	$scope.doRefresh()
})
///////////////////////////////慈善活动列表/////////////////////////////
.controller('activityCharitablelistMyCtrl', function($rootScope,$scope, myService,$state) {
	$scope.imgUrl =myService.imgUrl;
	$scope.page=0;
	$scope.domore=false;
	$scope.list=[];
	
	$scope.loadeData = function() {
		var data={method:'activityCharitablelist',page:$scope.page}
		var promise = myService.zjPost(data); 
		promise.then(function(response) {
			$scope.status = response.status;
			if(response.status)
			{
				$scope.banner = response.banner;
				for (v in response.value)
				{
					$scope.list .push(response.value[v]) ;
				}
			}else
			{
				$scope.domore=true;
			}
			
		}, function(data) {
		    console.log(data)
		})
		.finally(function() {
       // 停止广播ion-refresher
      $scope.$broadcast('scroll.infiniteScrollComplete');  
      $scope.$broadcast('scroll.refreshComplete');
   });
	}
	$scope.loadMore = function() {
		$scope.page++;
		$scope.loadeData();
	}
	$scope.doRefresh = function() {
		$scope.domore=false;
		$scope.page=0;
		$scope.list=[];
	  	$scope.loadeData();
	};
	$scope.doRefresh()
})
///////////////////////////////慈善活动详情/////////////////////////////
.controller('activityCharitableContentMyCtrl', function($rootScope,$scope,myService,$state,$stateParams,$ionicScrollDelegate,$timeout) {
	
	$scope.classfy=true;
	$scope.page=0;
	$scope.domore=true;
	$scope.users=[];
	$scope.changeClass = function(classfy) {
		$scope.classfy=classfy;
		if(classfy)//true是默认的显示内容
		{
			$scope.domore=true;
		}else
		{
			$scope.domore=false;
			$scope.page=0;
			$scope.users=[];
			$scope.loadeData();
		}
	}
	$scope.loadeData = function() {
		var data={method:'activityCharitableUser',attach:$stateParams.cid,page:$scope.page}
		var promise = myService.zjPost(data); 
		promise.then(function(response) {
			$scope.status = response.status;
			if(response.status)
			{
				for (v in response.value)
				{
					$scope.users .push(response.value[v]) ;
				}
			}else
			{
				$scope.domore=true;
			}
		}, function(data) {
		    console.log(data)
		})
		.finally(function() {
       // 停止广播ion-refresher
      $scope.$broadcast('scroll.infiniteScrollComplete');  
      $scope.$broadcast('scroll.refreshComplete');
  	});
	}
	$scope.loadMore = function() {
		$scope.page++;
		$scope.loadeData();
	}
	$rootScope.$on('userInfo', function(d,data) {  
		$scope.jf=$rootScope.userInfo.jf;
	});
	$scope.jf=$rootScope.userInfo.jf;
	$scope.doRefresh = function() {
		var data={method:'activityCharitableContent',attach:$stateParams.cid}
		var promise = myService.zjPost(data); 
		promise.then(function(response) {
			$scope.status=response.status;
			if(response.status)
			{                                                                                                             
				$scope.imgUrl =myService.imgUrl;
				$scope.l = response.value;
				
			}
		}, function(data) {
		    console.log(data)
		})
		.finally(function() {
       // 停止广播ion-refresher
      $scope.$broadcast('scroll.infiniteScrollComplete');  
      $scope.$broadcast('scroll.refreshComplete');
 	 });
	}
	$scope.doRefresh();
	$scope.user={jfjz:null};
	$scope.isOpen = false;
	$scope.juanzeng = function(user) {
		var nowjf=$scope.jf;
		var jfjz=user.jfjz;
		if(!user.jfjz)
		{
			alert("积分请填写积分");
			$scope.isOpen = true;
			return false;
		}
		var limit_type=$scope.l.limit_type;
		var data_limit=$scope.l.data_limit;
		var today_data_limit=$scope.l.today_data_limit;
		if(data_limit>0 && today_data_limit<jfjz)
		{
			if(confirm("今日最多可捐赠限额为"+today_data_limit+"积分,是否捐赠"))
				{
					$scope.user.jfjz=today_data_limit;
				}else
				{
					return false;
				}
		}
		if(jfjz>nowjf || nowjf<=0)
		{
			alert("积分不足");
			return false;
		}
		if(limit_type=='3')//额度限制
		{
			var kjzjf=$scope.l.all_limit-$scope.l.already_charitable;//可捐赠积分
			if(jfjz>kjzjf)//如果输入的捐赠积分大于可捐赠积分
			{
				if(confirm("该活动现在最多可捐赠"+kjzjf+"积分,是否捐赠"))
				{
					$scope.user.jfjz=kjzjf;
				}else
				{
					return false;
				}
			}
		}
		$scope.pay($scope.user.jfjz);
	}
	$scope.scrollTonlist=function(){//滚动到捐赠者名单那里去
		$timeout(function() {
     		$ionicScrollDelegate.$getByHandle('start').scrollBottom();
		}, 10);
	}
	$scope.pay=function(jf){
		var username=$rootScope.username;
		var da={cid:$stateParams.cid,jf:jf}
		var data={method:'payCharitable',value:da}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
			 //console.log(response)
			if(response.status){
				//window.location="orderlist.php?status=2"
				alert("成功捐赠"+jf+"积分");
				$scope.user.jfjz=null;
				$scope.doRefresh();
				$scope.changeClass(false);
				$scope.scrollTonlist();
				$rootScope.userInfo.jf=response.jf;
		        $rootScope.$broadcast('userInfo',$rootScope.userInfo);
				//$rootScope['jf'] = response.jf;
		        //$rootScope.$broadcast('jf',$rootScope['jf']);
			}else{
				alert(response.msg)
			}
		}, function(data) {
		    console.log(data)
		})
	}
})
///////////////////////////////我的捐助明细/////////////////////////////
.controller('charitableUserListMyCtrl', function($rootScope,$scope, myService,$state) {
	
	$scope.doRefresh = function() {
		var data={method:'getcharitableUsersumPrice'}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  $scope.charitableUsersumPrice =response.value;
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	    });
		var data={method:'charitableUserList',page:$scope.page}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
			//console.log(response)
		  $scope.imgUrl =myService.imgUrl;
			$scope.status = response.status;
			if(response.status)
			{
				$scope.users=response.value;
			}
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	    });
	}
	$scope.doRefresh();
	 $scope.getItemHeight = function(item, index) {
	    //使索引项平均都有10px高，例如
	    return (index % 2) === 0 ? 50 : 100;
	  };
})
///////////////////////////////卡券列表/////////////////////////////
.controller('couponListMyCtrl', function($rootScope,$scope, myService,$stateParams,$state) {
	$scope.classfy =0;//默认显示未使用的卡券
	var data={method:'coupon_invalid'}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  	$scope.coupon_invalid = response.value;	
		}, function(data) {
		    console.log(data)
		})
	$scope.page=0;
	$scope.domore=false;
	$scope.coupons=[];
	$scope.change = function(attch) {
		$scope.classfy =attch;
		$scope.doRefresh()
	}
	$scope.loadeData= function(){
		var data={method:'couponList',attach:$scope.classfy,page:$scope.page}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
			
		  if(response.status)
			{
				
				$scope.imgUrl =myService.imgUrl;
				for (v in response.value)
				{
					$scope.coupons .push(response.value[v]) ;
				}
			}else
			{
				$scope.domore=true;
			}
			if($scope.coupons.length>0)
			{
				$scope.status=true;
			}else
			{
				$scope.status=false;
			}
			
		}, function(data) {
		    console.log(data)
		})
		.finally(function() {
	       // 停止广播ion-refresher
	      $scope.$broadcast('scroll.infiniteScrollComplete');  
	      $scope.$broadcast('scroll.refreshComplete');
	     });
	}
	$scope.loadMore = function() {
		$scope.page++;
		$scope.loadeData();
	}
	$scope.doRefresh = function() {
		$scope.status=true;
		$scope.domore=false;
		$scope.page=0;
		$scope.coupons=[];
	  	$scope.loadeData();
	};
	$scope.doRefresh()
})
.controller('headMyCtrl', function($scope) {
	
})
.controller('footMyCtrl', function($rootScope,$scope,$state) {
	$scope.tiaozhuan = function(url) {
	    $state.go(url) 
	};
})
///////////////////////////////新闻中心//////////////////////////////////////////////////////////
.controller('newsMyCtrl', function($rootScope,$scope, myService,$state) {
	var data={method:'newsClassfy'}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
			$scope.newsclassfy = response.value;
			$scope.classfy=response.value[0].id;
			$scope.page=0;
			$scope.items =[];
			$scope.domore=false;
			$scope.doRefresh();
		}, function(data) {
		    console.log(data)
		})
	$scope.loadeData= function()
	{
		var data={method:'newsContentlist',attach:$scope.classfy,page:$scope.page}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  if(response.status)
			{
				for (v in response.value)
				{
					$scope.items .push(response.value[v]) ;
				}
			}else
			{
				$scope.domore=true;
			}
			
			if($scope.items.length>0)
			{
				$scope.status=true;
			}else
			{
				$scope.status=false;
			}
		}, function(data) {
		    console.log(data)
		})
	 .finally(function() {
	  $scope.$broadcast('scroll.infiniteScrollComplete');  
	  $scope.$broadcast('scroll.refreshComplete');
	 });
	}
	$scope.change = function(attch) {
		$scope.classfy =attch;
		$scope.doRefresh()
	}
	$scope.loadMore = function() {
		$scope.page++;
		$scope.loadeData();
	}
	$scope.doRefresh = function() {
		$scope.status=true;
		$scope.domore=false;
		$scope.page=0;
		$scope.items=[];
	  	$scope.loadeData();
	}
})
///////////////////////////////新闻中心//////////////////////////////////////////////////////////
.controller('newsContentMyCtrl', function($rootScope,$scope, myService, $stateParams) {
	$scope.imgUrl =myService.imgUrl;
	$scope.doRefresh = function() {
		var data={method:'newsContent',attach:$stateParams.nid}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  	$scope.info = response.value;
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	     });
	}
	$scope.doRefresh()
	
})

.directive("headmenu", function ($state) {
	var htm="";
	htm+="		<div class='col col-10'>";
	htm+="			<a class='sit' href='#'><span>全国 <i class='icon ion-ios-arrow-down'></i></span></a>";
	htm+="		</div>";
	htm+="		<div class='col col-80'>";
	htm+="			<label class='item-input-wrapper'>";
	htm+="				<i class='icon ion-ios-search placeholder-icon'></i>";
	htm+="				<form ng-submit='searchProduct(search)'><input type='search' ng-model='search' ng-blur='searchProduct(search)' placeholder='搜索商家、商品'></form>";
	htm+="			</label>";
	htm+="		</div>";
	htm+="		<div class='col col-10'>";
	htm+="			<a class='news' href='#/tab/news' title='新闻'></a>";
	htm+="		</div>";
	htm+="	";
    return {
		restrict: "E",
        template: htm,
        link:function(scope, element, attrs){
        	scope.searchProduct=function(search){
        		$state.go("tab.productList",{meth:'search',val:search})
        	}
//      	element.find("input").bind("change", function() {
//      		console.log(scope.search)
//      		var v=scope.search
//      		
//          });  
        	
        }
    }
})
//////////////////////////////产品分类列表////////////////////////////////////////////////////////////
.controller('classlistMyCtrl', function($rootScope,$scope,  $state,myService) {
	$scope.doRefresh = function() {
		var data={method:'getclasslist',attach:$scope.classfyid}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  $scope.status=response.status;
			$scope.productInfo = response.value;
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	     });
	}
	var data={method:'getclasslistMain'}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  if(response.status)
			{
				$scope.imgUrl =myService.imgUrl;
				$scope.classfy = response.value;
				$scope.classfyid=response.value[0].classid;
				$scope.doRefresh();
			}
		}, function(data) {
		    console.log(data)
		})
	
	$scope.show=function(id)
	{
		$scope.classfyid=id;
		$scope.doRefresh();
	}
		
})
.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
})
//////////////////////////////产品列表////////////////////////////////////////////////////////////
.controller('productlistMyCtrl', function($rootScope,$scope, $state, $stateParams,myService) {
	var val = $stateParams.val;
	var meth = $stateParams.meth; 
	$scope.imgUrl =myService.imgUrl;
	$scope.page=0;
	$scope.domore=false;
	$scope.products=[];
	
	$scope.loadeData = function() {
		var data={method:'getproductlist',page:$scope.page,attach:val,meth:meth,}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
			 //console.log(response)
		  $scope.status = response.status;
			if(response.status)
			{
				for (v in response.value)
				{
					$scope.products .push(response.value[v]) ;
				}
			}else
			{
				$scope.domore=true;
			}
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.infiniteScrollComplete');  
	      $scope.$broadcast('scroll.refreshComplete');
	    });
	}
	$scope.loadMore = function() {
		$scope.page++;
		$scope.loadeData();
	}
	$scope.doRefresh = function() {
		$scope.domore=false;
		$scope.page=0;
		$scope.products=[];
	  	$scope.loadeData();
	};
	$scope.doRefresh()
	
})
//////////////////////////////卡券提货////////////////////////////////////////////////////////////
.controller('getGoodsMyCtrl', function($rootScope,$scope, myService,$state,$stateParams) {
	myService.getUserSit();
	$rootScope.$on('selectsit', function(d,data){
		if($rootScope.selectsit)
		{
			$scope.addessesstatus=true;
			$scope.addesses=$rootScope.selectsit;
			$scope.sit=$scope.addesses.id;//用户地址ID
			//console.log($scope.sit)
		}else
		{
			 $scope.addessesstatus=false;
		}
	});
	var meth = $stateParams.meth; 
	var productId = $stateParams.pid; 
	var couponId = $stateParams.cid; 
	$scope.doRefresh = function() {
		var data={method:'pcontent',attach:productId}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
			
		  	if(response.status){
				$scope.products = response.value;
				$scope.productssn = response.value.sn;
				$scope.imgUrl =myService.imgUrl;
				//$scope.data.clientSide=
				for(var i in $scope.productssn){//用javascript的for/in循环遍历对象的属性 
					//console.log($scope.productssn)
					//console.log(i)
					$scope.data = {
				        clientSide:i
				   	}
				}
				 
			}else
			{
				 alert(response.msg);
				 history.go('-1');
			}
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	   });
	}
	
	$scope.doRefresh();
	$scope.selectsit=function(){//选择地址
		var data={cid:couponId,pid:productId,meth:meth};
		var obj={
			name:"getGoods",
			value:data
		}
		$rootScope['isNeedSelectSit'] = obj;
		$rootScope.$broadcast('isNeedSelectSit', $rootScope['isNeedSelectSit']); 
		//obj = JSON.stringify(obj);
		//sessionStorage.setItem("isNeedSelectSit", obj);
		$state.go("tab.receivelist");
	}
	$scope.tijiao=function(){
		if(!$scope.addessesstatus)
		{
			alert("请选择收货地址...")
		}
		var sitid = $scope.sit;
		var username=$rootScope.username
		var xd=sessionStorage.getItem("xd")
		xd = JSON.parse(xd);
		//console.log(xd)
		if(meth=="1")
		{
			var method="makeOrderFromeCoupon"
		}else
		{
			var method="makeOrderFromeIndiana"
		}
		//console.log( $scope.data.clientSide)
		var data={method:method,value: $scope.data.clientSide,val:couponId,sitid:sitid}
		
		var promise = myService.zjPost(data);
		promise.then(function(response){
		  if(response.status)
			{
				$state.go("tab.orderlist",{sid:"2"})
			}else
			{
				alert("无效领取")
			}
		}, function(data) {
		    console.log(data)
		})
	}
})
//////////////////////////////产品详情////////////////////////////////////////////////////////////
.controller('pcontentMyCtrl', function($rootScope,$scope,myService,$state,$stateParams,$ionicSlideBoxDelegate) {
	var pid = $stateParams.pid;  
	$scope.imgUrl =myService.imgUrl;
	$rootScope.$on('ss', function(d,data) {  
		$scope.mycarts=$rootScope.ss;
		$scope.doRefresh();
	});
	$scope.doRefresh = function() {
	 	
		$scope.mycarts=$rootScope.ss;
		var data={method:'pcontent',attach:$stateParams.pid}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
			$scope.status = response.status;
		  	if(response.status){
		  		
				$scope.products = response.value;
				if($scope.products.img.length>0)
				{ 
					 $ionicSlideBoxDelegate.update();
				}
				  
				if($scope.mycarts && $scope.mycarts.value){//查找有没有本地缓存产品
		      	if($scope.mycarts.value[response.value.shop]){//查找该店有没有本地缓存产品
			      	if($scope.mycarts.value[response.value.shop][$stateParams.pid]){//查找该店该产品有没有被本地缓存
			      		for( snid in response.value.sn)
			      		{
			      			if($scope.mycarts.value[response.value.shop][$stateParams.pid].sn[snid])
			      			{
			      			}else
			      			{
			      				$scope.mycarts.value[response.value.shop][$stateParams.pid].sn[snid]=response.local.value[response.value.shop][$stateParams.pid].sn[snid]
			      			}
			      		}
			      	}else
				      {
				      	$scope.mycarts.value[response.value.shop][$stateParams.pid]=response.local.value[response.value.shop][$stateParams.pid];
				      }
			      }else
			      {
			      	$scope.mycarts.value[response.value.shop]=response.local.value[response.value.shop];
			      }
		      }else
		      {
		      	$scope.mycarts=response.local;
		      	
		      
		      }
			}
		}, function(data) {
		   
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	     });
	}
	
	$scope.doRefresh();
	$scope.fjisuan=function(sn,num){
		
		var nowLocalNum=parseInt(sn.localNum);//现有数量
		var nowNum=parseInt(sn.num);//现有库存
		if(num>0)
		{
		 	if(nowLocalNum>(nowNum-num))
		 	{
		 		num=0;
		 	}
		}else
		{
			if(nowLocalNum<=0)
		 	{
		 		num=0;
		 	}
		}
		
	 	if($scope.mycarts.value[$scope.products.shop][$stateParams.pid].sn[sn.id].localNum<=0)
		{
			$scope.mycarts.value[$scope.products.shop][$stateParams.pid].sn[sn.id].localNum=0;
		}
		$scope.mycarts.value[$scope.products.shop][$stateParams.pid].sn[sn.id].localNum+=num;
		if($scope.mycarts.value[$scope.products.shop][$stateParams.pid].localNum<=0)
		{
			$scope.mycarts.value[$scope.products.shop][$stateParams.pid].localNum=0;
		}
		$scope.mycarts.value[$scope.products.shop][$stateParams.pid].localNum+=num;
		// console.log(num)
	 	//$scope.selectPoducts+=num;
	}
	 $scope.tiaozhuan=function(meth){
	 	
		
	 	myService.jisuantotal($scope.mycarts.value,'ss')//计算并生成本地数据
	 	var isPay=false;
		
	 	if($scope.mycarts.value[$scope.products.shop][$stateParams.pid])
	 	{
	 		if($scope.mycarts.value[$scope.products.shop][$stateParams.pid].localNum>0)
			{
				isPay=true;
			}
	 	}
		if(!isPay)
		{
			alert("您还没有选哦~")
			return false;
		}
		if(meth=='buy')
		{
			var xd={}
			xd[$scope.products.shop]={}
			xd[$scope.products.shop][$stateParams.pid]=$scope.mycarts.value[$scope.products.shop][$stateParams.pid]
			myService.jisuantotal(xd,'xd')//计算并生成本地数据
			var url="addorder";
		}else
		{
			var url="mycart";
		}
			$state.go("tab."+url)
	 }
	
	 
})
//////////////////////////////购物车列表////////////////////////////////////////////////////////////
.controller('mycartlistMyCtrl', function($rootScope,$scope, $state,myService,$ionicListDelegate) {
	$rootScope.$on('ss', function(d,data) {  
		$scope.mycarts=$rootScope.ss;
	});
	$scope.doRefresh = function() {
		$scope.data = {
		    showDelete: false,
		    showReorder: false,
		};
		$scope.mycarts=$rootScope.ss;
		$scope.imgUrl =myService.imgUrl;
	}
	$scope.$on('$ionicView.beforeEnter', function (){
	 	$scope.doRefresh();
	})
	$scope.toPage = function(name,data) {
		$state.go(name,data)
	}
	$scope.fjisuan=function(shop,pid,sn,num){
		
		var nowLocalNum=parseInt(sn.localNum);//现有数量
		var nowNum=parseInt(sn.num);//现有库存
		if(num>0)
		{
		 	if(nowLocalNum>(nowNum-num))
		 	{
		 		num=0;
		 	}
		}else
		{
			if(nowLocalNum<=0)
		 	{
		 		num=0;
		 	}
		}
		$scope.mycarts.value[shop][pid].sn[sn.id].localNum+=num;
		$scope.mycarts.value[shop][pid].localNum+=num;
	 	myService.jisuantotal($scope.mycarts.value,'ss')//计算总价
	}
	
	
	$scope.doCheckRefresh=function(i)
	{
	 	myService.jisuantotal($scope.mycarts.value,'ss')//计算总价
	}
	$scope.doAllChecked=function(i)
	{
	 	myService.jisuantotal($scope.mycarts.value,'ss','doCheck',$scope.mycarts.allChecked)//计算总价
	}
	
	$scope.showHide = function() {
			$scope.data.showDelete=!$scope.data.showDelete;
			$scope.data.showReorder=!$scope.data.showReorder;
	}
	//$ionicListDelegate.closeOptionButtons();
	$scope.deleteseesion=function(){
		if($scope.mycarts.checkTotalPrice>0)
		{
			myService.jisuantotal($scope.mycarts.value,'ss','deletCheck')//计算总价
		}else
		{
			alert("您还没有选哦~")
			return false;
		}
	}
	$scope.deletePid=function(pid){
		myService.jisuantotal($scope.mycarts.value,'ss','deletePid',pid)//计算总价
	}
	$scope.tijiao=function(){
		if($scope.mycarts.checkTotalPrice>0)
		{
			myService.jisuantotal($scope.mycarts.value,'xd','creatCheck','ss')//计算总价
			$state.go("tab.addorder")
		}else
		{
			alert("您还没有选哦~")
			return false;
		}
	}
})
//////////////////////////////下单页面///////////////////////////////////////////////////////
.controller('addorderMyCtrl', function($rootScope,$scope, myService, $state) {
	$scope.imgUrl =myService.imgUrl;
	myService.getUserSit();
	$rootScope.$on('selectsit', function(d,data){
		if($rootScope.selectsit)
		{
			$scope.addessesstatus=true;
			$scope.addesses=$rootScope.selectsit;
			$scope.sit=$scope.addesses.id;//用户地址ID
			//console.log($scope.sit)
		}else
		{
			 $scope.addessesstatus=false;
		}
	});
	$scope.selectsit=function(){//选择地址
		var obj={
			name:"addorder",
			value:{}
		}
		$rootScope['isNeedSelectSit'] = obj;
		$rootScope.$broadcast('isNeedSelectSit', $rootScope['isNeedSelectSit']);
		//obj = JSON.stringify(obj);
		//sessionStorage.setItem("isNeedSelectSit", obj);
		$state.go("tab.receivelist");
	}
	$scope.checkXd=function()
	{
		var isLocation=true;
		if($scope.mycarts)
		{
			if($scope.mycarts.totalPrice>0)
			{
				isLocation=false;
			}
		}
		if(isLocation){
			$state.go("tab.mycart")
		}
	}
	$scope.mycarts=$rootScope.xd;
	$scope.checkXd();
	$rootScope.$on('xd', function(d,data){
		$scope.mycarts=$rootScope.xd;
		$scope.checkXd();
	}); 
	$scope.fjisuan=function(shop,pid,sn,num){
		var nowLocalNum=parseInt(sn.localNum);//现有数量
		var nowNum=parseInt(sn.num);//现有库存
		if(num>0)
		{
		 	if(nowLocalNum>(nowNum-num))
		 	{
		 		num=0;
		 	}
		}else
		{
			if(nowLocalNum<=0)
		 	{
		 		num=0;
		 	}
		}
		$scope.mycarts.value[shop][pid].sn[sn.id].localNum+=num;
		$scope.mycarts.value[shop][pid].localNum+=num;
	 	myService.jisuantotal($scope.mycarts.value,'xd')//计算总价
	}
	//console.log($scope.mycarts)
	$scope.tijiao=function(){
		if(!$scope.addessesstatus)
		{
			alert("请选择收货地址...")
		}
		var data={method:'makeOrder',attach:$scope.mycarts,sitid:$scope.sit}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		var xdObj=$rootScope.xd.value;
		var ssObj=$rootScope.ss.value;
		  	if(response.status){
			  	var re={
				  	checkTotalPrice:0,
				  	checkTotalNum:0,
				  	totalPrice:0,
				  	totalNum:0,
				  	allChecked:true,
				  	value:$rootScope.ss.value
				};
			  	if(ssObj)
				{
				  	 for(a in ssObj)
				  	 {
				  	 	for(b in ssObj[a])
						  {
						  	for(c in ssObj[a][b].sn)
						  	{
						  		if(ssObj[a][b] && xdObj[a][b])
						  		{
						  			if(xdObj[a][b].sn[c].localNum>0)
						  			{
								  		re.value[a][b].localNum-=re.value[a][b].sn[c].localNum;
								  		re.value[a][b].sn[c].localNum=0;
						  			}
							  	}
						  		if(re.value[a][b].localNum>0)
						  		{
							  		re.totalNum+=re.value[a][b].sn[c].localNum;
							  		re.totalPrice+=((re.value[a][b].integral)*(re.value[a][b].sn[c].localNum));
					  		
							  		
							  		if(!re.value[a][b].sn[c].checked)
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
				var obj = JSON.stringify(re);
				sessionStorage.setItem('ss', obj);
				sessionStorage.setItem('xd', null);
				$rootScope['xd'] = null;
		        $rootScope.$broadcast('xd', $rootScope['xd']);
				$rootScope['ss'] = re;
		        $rootScope.$broadcast('ss', $rootScope['ss']);
				$state.go("tab.pay",{type:"ordermain",oid:response.order})
			}
		}, function(data) {
		    console.log(data)
		})
	}
})
//////////////////////////////用户地址列表////////////////////////////////////////////////////////////
.controller('receivelistMyCtrl', function($rootScope,$scope, myService,$state,$ionicListDelegate,$timeout){
	
//	$scope.doSomething = function(a) {
//		$timeout(function() {
//   		$ionicListDelegate.$getByHandle('start').showReorder(true);
//		}, 10);
//	}
	$scope.showHide = function() {
		$scope.data.showDelete=!$scope.data.showDelete;
		$scope.data.showReorder=!$scope.data.showReorder;
	}
	$scope.doRefresh = function() {
		$scope.data = {
		    showDelete: false,
		    showReorder: false,
		};
		var data={method:'receivelist'}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  $scope.addesses = response.value;
			$scope.status = response.status;
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	     });
	}
	$scope.$on('$ionicView.beforeEnter', function (){
	 	$scope.doRefresh();
	})
	$rootScope.$on('isNeedSelectSit', function(d,data){
		$scope.isNeedSelectSit=$rootScope.isNeedSelectSit;
		//console.log($rootScope.isNeedSelectSit)
		//$scope.data.showReorder=!$scope.isNeedSelectSit;
		
	});
	$scope.selectsit=function (val){
		//var isNeedSelectSit=sessionStorage.getItem("isNeedSelectSit");
		if($scope.isNeedSelectSit)
		{
			//console.log($rootScope.isNeedSelectSit)
			var name=$rootScope.isNeedSelectSit.name;
			var value=$rootScope.isNeedSelectSit.value;
			myService.getUserSit(val);
			$rootScope['isNeedSelectSit'] = null;
			$rootScope.$broadcast('isNeedSelectSit', $rootScope['isNeedSelectSit']);
			$state.go("tab."+name,value)
		}else
		{
			
			//console.log($rootScope)
			//return false;
		}
		return false;
	}
	$scope.tiaozhuan=function () {
		$state.go("tab.addreceiver")
	}
	$scope.deleSit=function (sit) {
		var username=$rootScope.username
		var da={sitid:sit.id}
		var data={method:'delesit',value:da}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  	$scope.doRefresh();
		}, function(data) {
		    console.log(data)
		})
		return false;
	}
	$scope.editSit=function (sit) {
		$state.go("tab.editreceiver",{rid:sit.id});
		return false;
	}
})

//////////////////////////////用户地址增加////////////////////////////////////////////////////////////
.controller('addreceivelistMyCtrl', function($rootScope,$scope, myService,$state) {
	var data={method:'province'}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  $scope.provinces = response.value;
			$scope.status = response.status;
		}, function(data) {
		    console.log(data)
		})
	$scope.pushNotificationChange = function() {
	};
	$scope.user = { 
		name:'',
		tel:'',
		pro:'',
		cit:'',
		are:'',
		address:'',
		checked:false
	};
	$scope.getsit = function (m,v) {//m方法1是获取市2是获取区//s是需要改变的那个select
		 var data={method:m,attach:v,}
			var promise = myService.zjPost(data);
			promise.then(function(response) {
			  if(m=='city')
				{
					$scope.citys = response.value;
					
				}else
				{
					$scope.areas = response.value;
					
				}
			}, function(data) {
			    console.log(data)
			})
	}
	$scope.check = function (user) {//m方法1是获取市2是获取区//s是需要改变的那个select
		var name=user.name
		var tel=user.tel
		var province=user.pro
		var city=user.cit
		var marea=user.are
		var address=user.address
		var type=user.checked?1:0;
		var da={name:name,tel:tel,province:province,city:city,marea:marea,address:address,type:type}
		var data={method:'addreceiver',value:da}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  if(response.status){
				$state.go("tab.receivelist");
			}
		}, function(data) {
		    console.log(data)
		})
	}
})

//////////////////////////////用户地址编辑////////////////////////////////////////////////////////////
.controller('editreceiverMyCtrl', function($rootScope,$scope, myService, $stateParams,$state) {
	var r = $stateParams.rid;
	
	$scope.doRefresh = function() {
		var data={method:'province'}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  $scope.provinces = response.value;
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	    });
	  var data={method:'getonesit',attach:r}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
			$scope.oneSitInfo = response.value;
			var isDeafault=$scope.oneSitInfo.type>0?true:false
			$scope.user = { 
				name:response.value.name,
				tel:parseInt(response.value.tel),
				pro:response.value.province,
				cit:response.value.city,
				are:response.value.area,
				address:response.value.address,
				checked:isDeafault
			};
			$scope.getsit('city',response.value.province)
			$scope.getsit('area',response.value.city)
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	     });
	}
	$scope.$on('$ionicView.beforeEnter', function (){
	 	$scope.doRefresh();
		//console.log($rootScope)
	})
	$scope.getsit = function (m,v) {//m方法1是获取市2是获取区//s是需要改变的那个select
		var data={method:m,attach:v}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  if(m=='city')
			{
				$scope.citys = response.value;
			}else
			{
				$scope.areas = response.value;
			}
		}, function(data) {
		    console.log(data)
		})
	}
	$scope.check = function (user) {//m方法1是获取市2是获取区//s是需要改变的那个select
		var name=user.name
		var tel=user.tel
		var province=user.pro
		var city=user.cit
		var marea=user.are
		var address=user.address
		var type=user.checked?1:0
		var username=$rootScope.username
		var da={rid:r,name:name,tel:tel,province:province,city:city,marea:marea,address:address,type:type}
			var data={method:'editreceiver',value:da}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  if(response.status){
				$state.go("tab.receivelist");
			}
		}, function(data) {
		    console.log(data)
		})
	}
})
///////////////////////////////订单详情//////////////////////////////////////////////////////////
.controller('orderContentMyCtrl', function($rootScope,$scope, myService, $stateParams,$state,$timeout) {
	$scope.doRefresh = function() {
	  var data={method:'orderContent',orderId:$stateParams.oid}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  $scope.ostatus=response.status;
			if(response.status){
			 	$scope.orderlist=response.value;
			 	$scope.imgUrl =myService.imgUrl;
			}
		}, function(data) {
		    console.log(data)
		})
	    .finally(function() {
	       // 停止广播ion-refresher
	      //$scope.$broadcast('scroll.infiniteScrollComplete');  
	      $scope.$broadcast('scroll.refreshComplete');
	     });
	}
	$scope.receiveOrder=function(orderid)
	{
		myService.receiveOrder(orderid,function(response){
			if(response.status){
				$scope.doRefresh()
			}
		})
	}
	$scope.deleteOrder=function(orderid)
	{
		myService.deleteOrder(orderid,function(response){
			if(response.status){
				$scope.doRefresh()
			}
		})
	}
	$scope.doRefresh()
})
///////////////////////////////订单中心//////////////////////////////////////////////////////////
.controller('orderlistMyCtrl', function($rootScope,$scope, myService, $stateParams,$state) {
	$stateParams.sid? $scope.orderstatus = $stateParams.sid: $scope.orderstatus = 2;
	$scope.imgUrl =myService.imgUrl;
	$scope.page=0;
	$scope.domore=false;
	$scope.orderlistInfo=[];

	$scope.loadeData = function()
	{
		var data={method:'orderlist',page:$scope.page,status:$scope.orderstatus}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
		  $scope.ostatus=response.status;
			if(response.status)
			{
				for (v in response.value)
				{
					$scope.orderlistInfo .push(response.value[v]) ;
				}
			}else
			{
				$scope.domore=true;
			}
			if($scope.orderlistInfo.length>0)
			{
				$scope.status=true;
			}else
			{
				$scope.status=false;
			}
		}, function(data) {
		    console.log(data)
		})
	    .finally(function() {
	       // 停止广播ion-refresher
	      $scope.$broadcast('scroll.infiniteScrollComplete');  
	      $scope.$broadcast('scroll.refreshComplete');
	    }); 
	}
	$scope.getOrderList = function(attch) {
		$scope.orderstatus =attch;
		$scope.doRefresh()
	}
	$scope.loadMore = function() {
		$scope.page++;
		$scope.loadeData();
	}
	$scope.doRefresh = function() {
		$scope.status=true;
		$scope.domore=false;
		$scope.page=0;
		$scope.orderlistInfo=[];
	  	$scope.loadeData();
	};
	$scope.doRefresh()
	$scope.tiaozhuan=function(urlName,data){
		$state.go(urlName,data)
	}
	$scope.deleteOrder=function(orderid)
	{
		myService.deleteOrder(orderid,function(response){
			if(response.status){
				$scope.doRefresh()
			}
		})
	}
	$scope.receiveOrder=function(orderid)
	{
		myService.receiveOrder(orderid,function(response){
			if(response.status){
				$scope.doRefresh()
			}
		})
	}
})
////////////////////////订单支付页面//////////////////////////////////
.controller('payMyCtrl', function($rootScope,$scope, $state,$stateParams,myService) {
	$rootScope.$on('userInfo', function(d,data) {  
		$scope.jf=$rootScope.userInfo.jf;
	});
	
	$scope.doRefresh = function() {
		if($rootScope.userInfo)
		{
			$scope.jf=$rootScope.userInfo.jf;
		}else
		{
			$scope.jf=0;
		}
		var data={method:'orderlist',meth:$stateParams.type,attach:$stateParams.oid}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
			$scope.imgUrl =myService.imgUrl;
			$scope.orderlist = response.value;
			$scope.status=response.status;
			$scope.alltotal=response.alltotal;
			$scope.orderstatus=response.orderstatus;
		}, function(data) {
		    console.log(data)
		}).finally(function() {
	      $scope.$broadcast('scroll.refreshComplete');
	    });
	}
	$scope.doRefresh();
	$scope.pay=function(){
		var value={orderId:$stateParams.oid,type:$stateParams.type};
		var data={method:'pay',value:value}
		var promise = myService.zjPost(data);
		promise.then(function(response) {
			if(response.status){
				//window.location="orderlist.php?status=2"
				alert("支付成功！");
				if(response.locationUrl)
				{
					var vkey=response.locationUrl.vkey;
					var vid=response.locationUrl.id;
					if(vkey=='2')
					{
						$state.go("tab.orderContent",{oid:vid});
					}else
					{
						$state.go("tab.couponCode",{cid:vid});
					}
			       	//$rootScope['jf'] = response.jf;
			        //$rootScope.$broadcast('jf',$rootScope['jf']);
			        $rootScope.userInfo.jf=response.jf;
		        	$rootScope.$broadcast('userInfo',$rootScope.userInfo);
				}
				
			}else{
				alert(response.msg)
			}
			//console.log(response);
		}, function(data) {
		    console.log(data)
		})
	}
})
.directive('myfocus', function($timeout, $parse) {
　　return {
　　　　link: function(scope, element, attrs) {
　　　　var model = $parse(attrs.myfocus);
　　　　scope.$watch(model, function(value) {
　　　　　　if(value === true) {
　　　　　　　　$timeout(function() {
　　　　　　　　　　element[0].focus();
　　　　　　　　});
　　　　　　}else if(value === false){
　　　　　　　　$timeout(function() {
　　　　　　　　　　element[0].blur();
　　　　　　　　});
　　　　　　}
　　　　});
　　　}
　　};
});