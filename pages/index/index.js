// pages/index/index.js
var app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale:16,
    markers:[],   //共享车衣经纬度数组
    latitude:0,   //经度
    longitude:0  //纬度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log("微信已经授权，获取getUserInfo信息");
              console.log(res.userInfo);
              //console.log(getApp().globalData.isAuth);
              // 本地存储用户信息
              getApp().globalData.userInfo = res.userInfo;
              // 设置微信已授权isAuth
              getApp().globalData.isAuth = 1;
              //console.log(getApp().globalData.userInfo);
              
              //调用页面布局start
              wx.getSystemInfo({
                success: function(res) {
                  console.log(res); 
                  console.log("页面展示内容");
                  var isAuth = getApp().globalData.isAuth;
                  console.log(isAuth);
                  if (isAuth == 1) {
                    //map上布局（扫一扫、用户、定位、报修）
                    that.setData({
                      controls: [
                        {
                          id: 1,
                          iconPath: '/static/images/resetlocation.png',
                          position: {
                            left: 20,
                            top: res.windowHeight -60,
                            width: 40,
                            height: 40
                          },
                          clickable: true
                        },
                        {
                          id: 5,
                          iconPath: '/static/images/scan.png',
                          position: {
                            left: res.windowWidth / 2 - 50,
                            top: res.windowHeight - 110,
                            width: 100,
                            height: 100
                            
                          },
                          clickable: true
                        },
                        {
                          id: 3,
                          iconPath: '/static/images/baoxiu.png',
                          position: {
                            left: res.windowWidth - 60,
                            top: res.windowHeight - 60,
                            width: 40,
                            height: 40
                          },
                          clickable: true
                        },
                        {
                          id: 4,
                          iconPath: '/static/images/user.png',
                          position: {
                            left: res.windowWidth - 60,
                            top: res.windowHeight - 120,
                            width: 40,
                            height: 40
                          },
                          clickable: true
                        }
                      ]
                    });
                  }
                },
                fail: function(res) {
                  console.log(err, 'getSystemInfo fail')
                }
              })
              //调用页面布局end
            }
          })
        }
      },
      fail: function(res){
        console.log("微信未授权,显示注册/登录首页面");
      }
    }),

    console.info("开始加载经度纬度");
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        console.log(res);
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude
        }),
        //模拟设置共享车衣经纬度坐标
        that.updateMarkers(res.latitude, res.longitude);
      },
      fail: function (err) {
        console.log(err, 'getLocation fail')
      }
    }),

    //调用页面布局start
    wx.getSystemInfo({
      success: function(res) {
        console.log(res); 
        console.log("页面展示内容");
        var isAuth = getApp().globalData.isAuth;
        console.log(isAuth);
        if (isAuth == 0) {
          //map上布局（登录/注册、用户、定位、报修）
          that.setData({
            controls: [
              {
                id: 1,
                iconPath: '/static/images/resetlocation.png',
                position: {
                  left: 20,
                  top: res.windowHeight -60,
                  width: 40,
                  height: 40
                },
                clickable: true
              },
              {
                id: 2,
                iconPath: '/static/images/register.png',
                position: {
                  left: res.windowWidth / 2 - 50,
                  top: res.windowHeight - 110,
                  width: 100,
                  height: 100
                  
                },
                clickable: true
              },
              {
                id: 3,
                iconPath: '/static/images/baoxiu.png',
                position: {
                  left: res.windowWidth - 60,
                  top: res.windowHeight - 60,
                  width: 40,
                  height: 40
                },
                clickable: true
              },
              {
                id: 4,
                iconPath: '/static/images/user.png',
                position: {
                  left: res.windowWidth - 60,
                  top: res.windowHeight - 120,
                  width: 40,
                  height: 40
                },
                clickable: true
              }
            ]
          });
        }
      },
      fail: function(res) {
        console.log(err, 'getSystemInfo fail')
      }
    })
    //调用页面布局end

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("gxcymap"); // 地图组件的id
    this.movetoPosition()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 这里触发map里bindcontroltap事件
   */
  bindcontroltap: function (e) {
    switch(e.controlId){
      // 点击定位控件
      case 1: this.movetoPosition();break;
      // 点击注册登录
      case 2: this.toRegister();break;
      // 点击故障报修
      case 3: this.toRepair();break;
      // 点击用户信息
      case 4: this.toUser();break;
      // 点击扫码
      case 5: this.toScan();break;
    }
  },

  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  },

  // 点击注册控件，跳转注册
  toRegister: function () {
    wx.navigateTo({
      url: '../register/register'
    })
  },

  // 点击保障控件，跳转到报障页
  toRepair: function () {
    wx.navigateTo({
      url: '../repair/repair'
    })
  },

  // 点击头像控件，跳转到个人中心
  toUser: function () {
    wx.navigateTo({
      url: '../user/user'
    })
  },

  // 点击头像控件，跳转到个人中心
  toScan: function () {
    wx.scanCode({
      success: (res) => {
          console.log(res) ;
          wx.showModal({
              title: "开锁密码",
              content: "123456",
              showCancel: false,
              confirmText: "确定"
          })
      }
    })
  },

  /**
   * 模拟设置共享车衣经纬度坐标
   */
  updateMarkers(latitude, longitude) {
    let markers = [];
    for (let i = 0; i < 5; i++) {
      let marker1 = {
        iconPath: "/static/images/cheyi.png",
        id: i,
        latitude: latitude - Math.random().toFixed(1) / 500,
        longitude: longitude + Math.random().toFixed(1) / 500,
        width: 30,
        height: 30
      };
      markers.push(marker1);
    }
    for (let i = 5; i < 10; i++) {
      let marker2 = {
        iconPath: "/static/images/cheyi.png",
        id: i,
        latitude: latitude + Math.random().toFixed(1) / 500,
        longitude: longitude - Math.random().toFixed(1) / 500,
        width: 30,
        height: 30
      };
      markers.push(marker2);
    }
    for (let i = 10; i < 15; i++) {
      let marker3 = {
        iconPath: "/static/images/cheyi.png",
        id: i,
        latitude: latitude + Math.random().toFixed(1) / 500,
        longitude: longitude + Math.random().toFixed(1) / 500,
        width: 30,
        height: 30
      };
      markers.push(marker3);
    }
    for (let i = 15; i < 20; i++) {
      let marker4 = {
        iconPath: "/static/images/cheyi.png",
        id: i,
        latitude: latitude - Math.random().toFixed(1) / 500,
        longitude: longitude - Math.random().toFixed(1) / 500,
        width: 30,
        height: 30
      };
      markers.push(marker4);
    }
    this.setData({
      markers: markers
    });
  }



})