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
				//cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				StatusBar.styleBlackTranslucent();
				StatusBar.styleLightContent();
				$cordovaStatusbar.overlaysWebView(true);
				// 样式: 无 : 0, 白色不透明: 1, 黑色半透明: 2, 黑色不透明: 3
				$cordovaStatusbar.style(2);
				// 背景颜色名字 : black, darkGray, lightGray, white, gray, red, green,
				// blue, cyan, yellow, magenta, orange, purple, brown 注:需要开启状态栏占用视图.
				$cordovaStatusbar.styleColor('yellow');
				$cordovaStatusbar.styleHex('#333');
				$cordovaStatusbar.hide();
				$cordovaStatusbar.show();
				var isVisible = $cordovaStatusbar.isVisible();
			}
		});

var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener('chcp_updateLoadFailed', this.onUpdateLoadError, false);
  },
  onDeviceReady: function() {
  },
  onUpdateLoadError: function(eventData) {
    var error = eventData.detail.error;
    if (error && error.code == chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
        var dialogMessage = '你的兴动积分商城不是最新版本 是否需要更新';
        chcp.requestApplicationUpdate(dialogMessage, this.userWentToStoreCallback, this.userDeclinedRedirectCallback);
    }
  },
	userWentToStoreCallback: function() { // 用户确认更新
		document.addEventListener('chcp_updateIsReadyToInstall', this.checkForUpdate, false);
	},
	checkForUpdate: function() {
		chcp.fetchUpdate(this.fetchUpdateCallback);
	},
	fetchUpdateCallback: function(error, data) {
		if (error) {
			console.log('Failed to load the update with error code: ' + error.code);
			console.log(error.description);
			$cordovaToast.showLongCenter('跟新失败，'+error.description+'错误码：' + error.code);
		} else {
			$cordovaToast.showLongCenter('应用已更新，谢谢');
		}
	},
	userDeclinedRedirectCallback: function() {// 用户取消更新
		$cordovaToast.showLongCenter('记得更新哦');
	}
};
 document.addEventListener("deviceready", function () {
	
    var device = $cordovaDevice.getDevice();
    var version = $cordovaDevice.getVersion();
    var cordova = $cordovaDevice.getCordova();
    var model = $cordovaDevice.getModel();
    var platform = $cordovaDevice.getPlatform();
    var uuid = $cordovaDevice.getUUID();
	$cordovaToast.showShortBottom("版本号"+version+"设备号"+platform);
	 app.initialize(version,platform);

  }, false);
   //双击退出
        $ionicPlatform.registerBackButtonAction(function (e) {
            //判断处于哪个页面时双击退出
			var urlname=$location.path();
			if(urlname=='/tab/userIndex' || urlname=='/tab/classfy' || urlname=='/tab/mycart' || urlname=='/tab/activityIndex' || urlname=='/tab/home' || urlname=='/tab/login') {
				
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortBottom('再按一次退出系统');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            }
            else if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortBottom('再按一次退出系统');
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
						//console.log("登录成功");
                   		 $cordovaToast.showShortCenter('登录成功');
					}
				} else {

					myService.fLogOut(service, username);
				}
			}, function (data) {  // 处理错误 .reject  
				//console.log("链接失败")
                $cordovaToast.showShortCenter('登录失败');
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

