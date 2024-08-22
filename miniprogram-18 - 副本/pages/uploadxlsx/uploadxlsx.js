// 引入 xlsx 库
const XLSX = require('../../libs/xlsx.full.min.js');

Page({
  data: {
    fileList: [],
    groups: [],
    groupcount:[]
  },
  onGroupCountChange: function (e) {
    this.setData({
      groupcount: parseInt(e.detail.value),
    });
  }, 

  chooseFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        this.setData({
          fileList: res.tempFiles
        });
      },
      fail: () => {
        wx.showToast({
          title: '选择文件失败',
          icon: 'none'
        });
      }
    });
  },

  startGrouping() {
    if (this.data.fileList.length === 0) {
      wx.showToast({
        title: '请先选择文件',
        icon: 'none'
      });
      return;
    }

    const filePath = this.data.fileList[0].path;
    wx.getFileSystemManager().readFile({
      filePath: filePath,
      encoding: 'base64', // 读取文件为 Base64 编码
      success: (res) => {
        try {
          // Base64 解码
          const data = wx.base64ToArrayBuffer(res.data);
          const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true });

          // 处理数据
          const names = jsonData.flat().filter(name => name.trim() !== '');
          const groups = this.randomGroup(names, this.data.groupcount); // 分组shu

          this.setData({
            groups: groups
          });

          wx.showToast({
            title: '分组完成',
            icon: 'success'
          });
        } catch (error) {
          wx.showToast({
            title: '处理文件失败',
            icon: 'none'
          });
          console.error(error);
        }
      },
      fail: () => {
        wx.showToast({
          title: '读取文件失败',
          icon: 'none'
        });
      }
    });
  },

  randomGroup(names, groupCount) {
    const shuffled = names.sort(() => 0.5 - Math.random());
    const groups = Array.from({ length: groupCount }, () => []);

    shuffled.forEach((name, index) => {
      groups[index % groupCount].push(name);
    });

    return groups;
  }
});
