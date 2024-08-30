Page({
  // ...
  gotoc: function () {
    wx.navigateTo({
      url:'/pages/calculator/calculator' ,
    })
  },
  gotof: function () {
    wx.navigateTo({
      url: '/pages/formula/formula',
    })
  }
})