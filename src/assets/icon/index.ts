/*
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-10-19 10:35:47
 * @LastEditors: ycyun
 * @LastEditTime: 2025-10-19 10:44:03
 */
// 1. 动态导入所有SVG文件
const svgModules = import.meta.glob('./svg/*.svg', { 
    as: 'raw',  // 导入文件内容为字符串
    eager: true // 立即加载
  });
   
  // 2. 创建SVG Sprite并添加到DOM
  function createSvgSprite() {
    const svgSprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgSprite.style.display = 'none';
    svgSprite.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // 遍历所有SVG模块
    Object.entries(svgModules).forEach(([path, svgContent]) => {
      // 提取图标名称
      const iconName = path.replace(/^\.\/svg\/(.*)\.svg$/, '$1');
      
      // 创建symbol元素
      const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
      symbol.id = `icon-${iconName}`;
      
      // 提取SVG内容（移除svg标签本身）
      const div = document.createElement('div');
      div.innerHTML = svgContent;
      const svgElement:any = div.querySelector('svg');
      
      if (svgElement) {
        // 复制 viewBox 属性
        if (svgElement.hasAttribute('viewBox')) {
          symbol.setAttribute('viewBox', svgElement.getAttribute('viewBox'));
        }
        
        // 复制所有子元素
        while (svgElement.firstChild) {
          symbol.appendChild(svgElement.firstChild);
        }
        
        // 添加到sprite
        svgSprite.appendChild(symbol);
      }
    });
    
    // 添加到页面
    document.body.appendChild(svgSprite);
  }
   
  // 执行创建
  createSvgSprite();
   
  // 导出图标名称列表
   const iconNames = Object.keys(svgModules).map(path => 
    path.replace(/^\.\/svg\/(.*)\.svg$/, '$1')
  );
  export default iconNames