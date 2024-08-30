Page({
  data: {
    formulas: [
      '选择公式',
      '立方体体积', '立方体表面积',
      '球体积', '球表面积',
      '长方体体积', '长方体表面积',
      '圆柱体积', '圆柱体表面积',
      '圆锥体积', '圆锥表面积'
    ],
    selectedFormula: '选择公式',
    length: '0',
    width: '0',
    height: '0',
    baseRadius: '0',
    result: '',
    showLengthInput: false,
    showWidthInput: false,
    showHeightInput: false,
    showBaseRadiusInput: false
  },
  
  onFormulaChange: function(e) {
    const index = e.detail.value;
    const formula = this.data.formulas[index];
    
    this.setData({ 
      selectedFormula: formula,
      showLengthInput: formula.includes('长方体') || formula.includes('立方体') ,
      showWidthInput: formula.includes('长方体') ,
      showHeightInput: formula.includes('长方体') || formula.includes('圆柱体') || formula.includes('圆锥'),
      showBaseRadiusInput: formula.includes('球') || formula.includes('圆柱') || formula.includes('圆锥'),
      result: ''
    });
  },
  
  onLengthInput: function(e) {
    this.setData({ length: e.detail.value });
  },

  onWidthInput: function(e) {
    this.setData({ width: e.detail.value });
  },

  onHeightInput: function(e) {
    this.setData({ height: e.detail.value });
  },

  onBaseRadiusInput: function(e) {
    this.setData({ baseRadius: e.detail.value });
  },
  
  calculateFormula: function() {
    const length = parseFloat(this.data.length);
    const width = parseFloat(this.data.width);
    const height = parseFloat(this.data.height);
    const baseRadius = parseFloat(this.data.baseRadius);
    const baseArea = Math.PI * Math.pow(baseRadius, 2);
    
    if (isNaN(length) || isNaN(width) || isNaN(height) || isNaN(baseRadius)) {
      this.setData({ result: '请输入有效的数值' });
      return;
    }

    let result;
    switch (this.data.selectedFormula) {
      case '立方体体积':
        result = Math.pow(length, 3);
        break;
      case '立方体表面积':
        result = 6 * Math.pow(length, 2);
        break;
      case '球体积':
        result = (4 / 3) * Math.PI * Math.pow(baseRadius, 3);
        break;
      case '球表面积':
        result = 4 * Math.PI * Math.pow(baseRadius, 2);
        break;
      case '长方体体积':
        result = length * width * height;
        break;
      case '长方体表面积':
        result = 2 * (length * width + width * height + height * length);
        break;
      case '圆柱体积':
        result = baseArea * height;
        break;
      case '圆柱体表面积':
        result = 2 * baseArea + 2 * Math.PI * baseRadius * height;
        break;
      case '圆锥体积':
        result = (1 / 3) * baseArea * height;
        break;
      case '圆锥表面积':
        result = baseArea + Math.PI * baseRadius * Math.sqrt(Math.pow(height, 2) + Math.pow(baseRadius, 2));
        break;
      default:
        result = '请选择公式';
    }
    
    this.setData({ result });
  }
});
