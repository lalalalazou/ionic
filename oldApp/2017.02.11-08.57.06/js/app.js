var httpPost = function ($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	var param = function (obj) {
		var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
		for (name in obj) {
			value = obj[name];
			if (value instanceof Array) {
				for (i = 0; i < value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value instanceof Object) {
				for (subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value !== undefined && value !== null)
				query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		}
		return query.length ? query.substr(0, query.length - 1) : query;
	};
	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [
		function (data) {
			return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
		}
	];
};
angular.module('starter', ['ionic','ngCordova', 'starter.controllers', 'starter.services','ngIOS9UIWebViewPatch'], httpPost)

.run(function ($ionicPlatform,$ionicHistory,$rootScope, $state, $location, $ionicTabsDelegate, myService, $cordovaToast,$timeout,$cordovaStatusbar,$ionicActionSheet,$cordovaAppVersion, $ionicPopup, $ionicLoading, $cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2,$cordovaDevice) {
	
		$ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
			 //检测更新
        }
        if (window.StatusBar) {
			StatusBar.styleBlackTranslucent();
            // org.apache.cordova.statusbar required
           // StatusBar.styleLightContent();
			$cordovaStatusbar.overlaysWebView(true);
		// 样式: 无 : 0, 白色不透明: 1, 黑色半透明: 2, 黑色不透明: 3
		$cordovaStatusbar.style(2);
		// 背景颜色名字 : black, darkGray, lightGray, white, gray, red, green,
		// blue, cyan, yellow, magenta, orange, purple, brown 注:需要开启状态栏占用视图.
		$cordovaStatusbar.styleColor('yellow');
		//$cordovaStatusbar.styleHex('#eee');
		$cordovaStatusbar.hide();
		$cordovaStatusbar.show();
		//var isVisible = $cordovaStatusbar.isVisible();
        }
		
    });
var app = {

  // Application Constructor
  initialize: function() {
    this.bindEvents();
	 $cordovaToast.showShortTop('1');
  },

  // Bind any events that are required.
  // Usually you should subscribe on 'deviceready' event to know, when you can start calling cordova modules
  bindEvents: function() {
	 $cordovaToast.showShortTop('2');
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },

  // deviceready Event Handler
  onDeviceReady: function() {
	 $cordovaToast.showShortTop('3');
    // Add click event listener for our update button.
    // We do this here, because at this point Cordova modules are initialized.
    // Before that chcp is undefined.
    document.getElementById('myFetchBtn').addEventListener('click', app.checkForUpdate);
  },

  checkForUpdate: function() {
	 $cordovaToast.showShortTop('4');
    chcp.fetchUpdate(this.fetchUpdateCallback);
  },

  fetchUpdateCallback: function(error, data) {
    if (error) {
     $cordovaToast.showShortTop('5Failed to load the update with error code: ' + error.code);
      $cordovaToast.showShortTop(error.description);
    } else {
     $cordovaToast.showShortTop('6Update is loaded');
    }
  }
};


 document.addEventListener("deviceready", function () {
	 app.initialize();
    var device = $cordovaDevice.getDevice();
    var version = $cordovaDevice.getVersion();
    var cordova = $cordovaDevice.getCordova();
    var model = $cordovaDevice.getModel();
    var platform = $cordovaDevice.getPlatform();
    var uuid = $cordovaDevice.getUUID();
	$cordovaToast.showShortTop("版本号"+version|+"设备号"+platform);
	checkUpdate(version,platform);
  }, false);
        // 检查更新
        function checkUpdate(version,platform){
			//如果本地于服务端的APP版本不符合
			var data={method:'getVersion',type:platform,sysType:'ionic',version:version}
			var promise = myService.zjGet(data);
			promise.then(function(response) {
				$cordovaToast.showShortTop(response.value.msg);
				if (response.isNeedUpdate) {
					var serverAppVersion=response.value.val;
					var newurl=response.value.url;
					showUpdateConfirm(newurl,serverAppVersion);
				}
			}, function(data) {
					$cordovaToast.showShortTop(data);
					console.log(data)
			})
		}

        // 显示是否更新对话框
        function showUpdateConfirm(newurl,serverAppVersion) {
            var confirmPopup = $ionicPopup.confirm({
                title: '版本升级',
                template: '您将更新的版本是：'+serverAppVersion, //从服务端获取更新的内容
                cancelText: '取消',
                okText: '升级'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $ionicLoading.show({
                        template: "已经下载：0%"
                    });
                    var url = newurl; //可以从服务端获取更新APP的路径
                    var targetPath = "file:///storage/sdcard0/Download/1.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
                    var trustHosts = true
                    var options = {};
                    $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                        // 打开下载下来的APP
                        $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                        ).then(function () {
                                // 成功
                            }, function (err) {
                                // 错误
                            });
                        $ionicLoading.hide();
                    }, function (err) {
                        alert('下载失败');
                    }, function (progress) {
                        //进度，这里使用文字显示下载百分比
                        $timeout(function () {
                            var downloadProgress = (progress.loaded / progress.total) * 100;
                            $ionicLoading.show({
                                template: "已经下载：" + Math.floor(downloadProgress) + "%"
                            });
                            if (downloadProgress > 99) {
                                $ionicLoading.hide();
                            }
                        })
                    });
                } else {
                    // 取消更新
                }
            });
        }
   //双击退出
        $ionicPlatform.registerBackButtonAction(function (e) {
            //判断处于哪个页面时双击退出
			var urlname=$location.path();
			if(urlname=='/tab/userIndex' || urlname=='/tab/classfy' || urlname=='/tab/mycart' || urlname=='/tab/activityIndex' || urlname=='/tab/home' || urlname=='/tab/login') {
				
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortTop('再按一次退出系统1'+$location.path());
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            }
            else if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortTop('再按一次退出系统'+$location.path());
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            e.preventDefault();
            return false;
        }, 101);
		//console.log("第一次进入");//外页快速登录
		$rootScope.quickLogon = false;
		$rootScope.isNeedSelectSit = false;//默认不需要选择地址
		var canshu = $location.path();
		canshu = canshu.split("/");
		function funFLogin(username, pass, service, isRemember) {

			var data = myService.fLogin(username, pass, service, isRemember);
			var promise = myService.zjPost(data, 'postlogin.php'); // 同步调用，获得承诺接口  
			promise.then(function (response) {  // 调用承诺API获取数据 .resolve
				$rootScope.quickLogon = false;
				if (response.status) {
					if (myService.setUsername(response)) {
						//console.log(response);
						console.log("登录成功");
					}
				} else {

					myService.fLogOut(service, username);
				}
			}, function (data) {  // 处理错误 .reject  
				console.log("链接失败")
			});
		}
		if (canshu[1] == 'home' && canshu[2] > 0) {
			$rootScope.quickLogon = true;
			var username = canshu[3];
			var pass = canshu[4];
			var sid = canshu[2];
			funFLogin(username, pass, sid, false);
		}
		
		var islogin = sessionStorage.getItem("islogin") || localStorage.getItem("islogin");
		var userInfo = localStorage.getItem("userInfo");
		userInfo = JSON.parse(userInfo);
		//console.log(localStorage.getItem("islogin"));
		if (islogin && userInfo) {
			if (userInfo.status) {
				$rootScope.userInfo = userInfo;
				$rootScope.islogin = 1;
				$rootScope.$broadcast('islogin', $rootScope.islogin);
				$rootScope.$broadcast('userInfo', $rootScope.userInfo);
				var ss = sessionStorage.getItem("ss");
				$rootScope.ss = JSON.parse(ss);
				var xd = sessionStorage.getItem("xd");
				$rootScope.xd = JSON.parse(xd);

			}
		}

		var needLoginView = ["home", "news", "newsContent", "classfy", "productList", "pContent", "activityIndex", "activityIndianalist", "activityCharitablelist", "activityCharitableContent", "charitableUserList", "activityIndianaContent", "indianaUserList", "mycart", "addorder", "pay", "orderlist", "orderContent", "receivelist", "addreceiver", "editreceiver", "returnGoods", "returngoodscontent", "couponList", "couponCode", "getGoods", "userIndex"];//需要登录的页面state

		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
			//console.log("跳转前没判断");
			//内页的快速登录
			var urlname = toState.name;
			urlname = urlname.replace("tab.", "")

			//  if(urlname=='home' && toParams.sid>0)
			//		{
			//			console.log("快捷登录判断");
			//			$rootScope.quickLogon=true;
			//			var username = toParams.username;
			//			var pass = toParams.pass;
			//			var sid = toParams.sid;
			//			funFLogin(username,pass,sid,true);
			//			
			//		}
			if ($rootScope.quickLogon) {
				event.preventDefault(); //阻止默认事件，即原本页面的加载
			}
			if (needLoginView.indexOf(urlname) >= 0 && !$rootScope.islogin) {//判断当前是否登录
				//console.log("如果是去登录页面");
				$state.go("tab.login");//跳转到登录页
				event.preventDefault(); //阻止默认事件，即原本页面的加载
			}
		})

		$rootScope.$on('$ionicView.beforeEnter', function () {
			var urlname = $state.current.name;
			urlname = urlname.replace("tab.", "")
			// 如果正将进入的状态的名字是“detail”，则隐藏选项卡的标题栏 ，否则显示
			var isShow = false;
			var needTabBarView = ["userIndex", "classfy", "mycart", "activityIndex", "home"];//需要登录的页面state
			if (needTabBarView.indexOf(urlname) >= 0) {
				if (urlname != 'login') {
					isShow = true;
				}
			} else {
			}
			$ionicTabsDelegate.showBar(isShow);
		})
	})

	.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

		$ionicConfigProvider.platform.ios.tabs.style('standard');
		$ionicConfigProvider.platform.ios.tabs.position('bottom');
		$ionicConfigProvider.platform.android.tabs.style('standard');
		$ionicConfigProvider.platform.android.tabs.position('bottom');

		$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
		$ionicConfigProvider.platform.android.navBar.alignTitle('center');
		//$ionicConfigProvider.scrolling.jsScrolling(false);
		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		// Each state's controller can be found in controllers.js
		$stateProvider

			// setup an abstract state for the tabs directive
			.state('tab', {
				url: '/tab',
				abstract: true,
				templateUrl: 'templates/tabs.html'
			})

			// Each tab has its own nav history stack:


			.state('tab.home', {
				url: '/home',
				views: {
					home: {
						templateUrl: "templates/home.html",
						prefetchTemplate: false,
						controller: 'HomeCtrl',
					}
				}
			})
			.state('tab.login', {
				url: '/login',
				views: {
					home: {
						templateUrl: "templates/login.html",
						prefetchTemplate: false,
						controller: 'loginpageMyCtrl'
					}
				}
			})
			.state('tab.news', {
				url: '/news',
				views: {
					home: {
						templateUrl: "templates/news.html",
						prefetchTemplate: false,
						controller: 'newsMyCtrl'
					}
				}
			})
			.state('tab.newsContent', {
				url: '/newsContent/:nid',
				views: {
					home: {
						templateUrl: "templates/newsContent.html",
						prefetchTemplate: false,
						controller: 'newsContentMyCtrl'
					}
				}
			})
			.state('tab.classfy', {
				url: '/classfy',
				cache: true,
				views: {
					goods: {
						templateUrl: "templates/classfy.html",
						prefetchTemplate: false,
						controller: 'classlistMyCtrl'
					}
				}
			})
			.state('tab.productList', {
				url: '/productList/:val/:meth',
				cache: true,
				views: {
					goods: {
						templateUrl: "templates/productList.html",
						prefetchTemplate: false,
						controller: 'productlistMyCtrl'
					}
				}
			})
			.state('tab.pContent', {
				url: '/pContent/:pid',
				views: {
					goods: {
						templateUrl: "templates/pContent.html",
						prefetchTemplate: false,
						controller: 'pcontentMyCtrl'
					}
				}
			})
			.state('tab.activityIndex', {
				url: '/activityIndex',
				views: {
					activity: {
						templateUrl: "templates/activityIndex.html",
						prefetchTemplate: false,
						controller: 'activityMyCtrl'
					}
				}
			})
			.state('tab.activityIndianalist', {
				url: '/activityIndianalist',
				views: {
					activity: {
						templateUrl: "templates/activityIndianalist.html",
						prefetchTemplate: false,
						controller: 'activityIndianalistMyCtrl'
					}
				}
			})
			.state('tab.activityCharitablelist', {
				url: '/activityCharitablelist',
				views: {
					activity: {
						templateUrl: "templates/activityCharitablelist.html",
						prefetchTemplate: false,
						controller: 'activityCharitablelistMyCtrl'
					}
				}
			})
			.state('tab.activityCharitableContent', {
				url: '/activityCharitableContent/:cid',
				views: {
					activity: {
						templateUrl: "templates/activityCharitableContent.html",
						prefetchTemplate: false,
						controller: 'activityCharitableContentMyCtrl'
					}
				}
			})
			.state('tab.charitableUserList', {
				url: '/charitableUserList',
				views: {
					user: {
						templateUrl: "templates/charitableUserList.html",
						prefetchTemplate: false,
						controller: 'charitableUserListMyCtrl'
					}
				}
			})
			.state('tab.activityIndianaContent', {
				url: '/activityIndianaContent/:cid',
				views: {
					activity: {
						templateUrl: "templates/activityIndianaContent.html",
						prefetchTemplate: false,
						controller: 'activityIndianaContentMyCtrl'
					}
				}
			})
			.state('tab.indianaUserList', {
				url: '/indianaUserList',
				views: {
					user: {
						templateUrl: "templates/indianaUserList.html",
						prefetchTemplate: false,
						controller: 'indianaUserListMyCtrl'
					}
				}
			})
			.state('tab.mycart', {
				url: '/mycart',
				views: {
					carts: {
						templateUrl: "templates/mycart.html",
						prefetchTemplate: false,
						controller: 'mycartlistMyCtrl'
					}
				}
			})
			.state('tab.addorder', {
				url: '/addorder',
				views: {
					carts: {
						templateUrl: "templates/addorder.html",
						prefetchTemplate: false,
						controller: 'addorderMyCtrl'
					}
				}
			})
			.state('tab.pay', {
				url: '/pay/:type/:oid',
				views: {
					carts: {
						templateUrl: "templates/pay.html",
						prefetchTemplate: false,
						controller: 'payMyCtrl'
					}
				}
			})
			.state('tab.orderlist', {
				url: '/orderlist/:sid',
				views: {
					user: {
						templateUrl: "templates/orderlist.html",
						prefetchTemplate: false,
						controller: 'orderlistMyCtrl'
					}
				}
			})
			.state('tab.orderContent', {
				url: '/orderContent/:oid',
				views: {
					user: {
						templateUrl: "templates/orderContent.html",
						prefetchTemplate: false,
						controller: 'orderContentMyCtrl'
					}
				}
			})
			.state('tab.receivelist', {
				url: '/receivelist',
				views: {
					user: {
						templateUrl: "templates/receivelist.html",
						prefetchTemplate: false,
						controller: 'receivelistMyCtrl'
					}
				}
			})
			.state('tab.addreceiver', {
				url: '/addreceiver',
				views: {
					user: {
						templateUrl: "templates/addreceiver.html",
						prefetchTemplate: false,
						controller: 'addreceivelistMyCtrl'
					}
				}
			})
			.state('tab.editreceiver', {
				url: '/editreceiver/:rid',
				views: {
					user: {
						templateUrl: "templates/editreceiver.html",
						prefetchTemplate: false,
						controller: 'editreceiverMyCtrl'
					}
				}
			})
			.state('tab.couponList', {
				url: '/couponList',
				views: {
					user: {
						templateUrl: "templates/couponList.html",
						prefetchTemplate: false,
						controller: 'couponListMyCtrl'
					}
				}
			})
			.state('tab.couponCode', {
				url: '/couponCode/:cid',
				views: {
					user: {
						templateUrl: "templates/couponCode.html",
						prefetchTemplate: false,
						controller: 'couponCodeMyCtrl'
					}
				}
			})
			.state('tab.getGoods', {
				url: '/getGoods/:meth/:cid/:pid',
				views: {
					user: {
						templateUrl: "templates/getGoods.html",
						prefetchTemplate: false,
						controller: 'getGoodsMyCtrl'
					}
				}
			})
			.state('tab.userIndex', {
				url: '/userIndex',
				views: {
					user: {
						templateUrl: "templates/userIndex.html",
						prefetchTemplate: false,
						controller: 'userindexMyCtrl'
					}
				}
			});
		$urlRouterProvider.otherwise('/tab/home');

	})

