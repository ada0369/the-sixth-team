Page({
  data: {
    inputNameList: "",
    groupCount: "",
    constraintPair: "",
    constraintType: null,
    constraintOptions: ['不分在一组', '分在一组'],
    result: "",
  },

  onInputNameListChange: function (e) {
    this.setData({
      inputNameList: e.detail.value,
    });
  },

  onGroupCountChange: function (e) {
    this.setData({
      groupCount: e.detail.value,
    });
  },

  onConstraintPairChange: function (e) {
    this.setData({
      constraintPair: e.detail.value,
    });
  },

  onConstraintTypeChange: function (e) {
    this.setData({
      constraintType: e.detail.value,
    });
  },

  onRandomGroup: function () {
    const { inputNameList, groupCount, constraintPair, constraintType } = this.data;
    if (!inputNameList || !groupCount) {
      wx.showToast({
        title: "请输入名单和组数",
        icon: "none",
      });
      return;
    }

    let nameList = inputNameList.split(" ").filter(name => name.trim() !== "");
    const totalPeople = nameList.length;

    if (totalPeople < groupCount || totalPeople % groupCount !== 0) {
      wx.showToast({
        title: "组数或名单人数不合适",
        icon: "none",
      });
      return;
    }

    const groupSize = totalPeople / groupCount;
    const groups = Array.from({ length: groupCount }, () => []);

    // 处理约束条件
    if (constraintType !== null && constraintPair.trim() !== "") {
      const [name1, name2] = constraintPair.split(" ").map(name => name.trim());
      if (name1 && name2) {
        const success = this.handleConstraints(nameList, name1, name2, constraintType, groups, groupSize);
        if (!success) {
          wx.showToast({
            title: "无法满足约束条件",
            icon: "none",
          });
          return;
        }
      }
    }

    // 计算剩余人数
    let remainingPeople = nameList.length;
    let remainingGroupSize = groupSize - Math.floor(remainingPeople / groupCount);

    // 平均分配剩余的成员
    this.shuffle(nameList);
    let groupIndex = 0;

    while (remainingPeople > 0) {
      const targetGroup = groups[groupIndex];
      if (targetGroup.length < groupSize) {
        targetGroup.push(nameList.shift());
        remainingPeople--;
      }
      groupIndex = (groupIndex + 1) % groupCount;

      // 当某一组达到了目标人数时，跳过它
      if (targetGroup.length === groupSize - remainingGroupSize) {
        groupIndex = (groupIndex + 1) % groupCount;
      }
    }

    // 生成分组结果
    let result = "";
    groups.forEach((group, index) => {
      result += `第${index + 1}组：${group.join("，")}\n`;
    });

    this.setData({
      result,
    });
  },

  // 处理分组约束逻辑
  handleConstraints(nameList, name1, name2, constraintType, groups, groupSize) {
    if (constraintType === '0') {
      // 不分在一组
      groups[0].push(name1);
      groups[1].push(name2);
      nameList.splice(nameList.indexOf(name1), 1);
      nameList.splice(nameList.indexOf(name2), 1);
    } else if (constraintType === '1') {
      // 分在一组
      const targetGroup = this.findGroupWithSpace(groups, groupSize);
      if (!targetGroup) return false;
      targetGroup.push(name1, name2);
      nameList.splice(nameList.indexOf(name1), 1);
      nameList.splice(nameList.indexOf(name2), 1);
    }
    return true;
  },

  // 查找有空位的组
  findGroupWithSpace(groups, groupSize) {
    return groups.find(group => group.length + 2 <= groupSize);
  },

  // 洗牌算法，用于打乱数组
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
});

