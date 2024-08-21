Page({
  data: {
    inputNameList: "",
    groupCount: 0,
    result: "",
  },

  // 获取用户输入的名单
  onInputNameListChange: function (e) {
    this.setData({
      inputNameList: e.detail.value,
    });
  },

  // 获取用户输入的组数
  onGroupCountChange: function (e) {
    this.setData({
      groupCount: parseInt(e.detail.value),
    });
  },

  // 随机平均分组
  onRandomGroup: function () {
    const { inputNameList, groupCount } = this.data;
    if (!inputNameList || groupCount <= 0) {
      wx.showToast({
        title: "请输入有效的名单和组数",
        icon: "none",
      });
      return;
    }

    // 根据空格分割名字列表
    const nameList = inputNameList.split(" ").filter(name => name.trim());
    if (nameList.length < groupCount) {
      wx.showToast({
        title: "组数不能大于名单数量",
        icon: "none",
      });
      return;
    }

    // 打乱名字列表顺序
    const shuffledNames = this.shuffle(nameList);

    // 初始化分组数组
    const groups = Array.from({ length: groupCount }, () => []);

    // 将名字均匀分配到每个组
    shuffledNames.forEach((name, index) => {
      groups[index % groupCount].push(name);
    });

    // 构建结果字符串
    let result = "";
    groups.forEach((group, index) => {
      result += `第${index + 1}组：${group.join("，")}\n`;
    });

    this.setData({
      result,
    });
  },

  // 洗牌算法：打乱数组顺序
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
});