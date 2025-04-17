// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 控制台欢迎信息
    console.log('欢迎访问设计师·路的个人博客！');
    
    // 页面状态变量 
    let isScrolling = false;
    let pageSequence = [1, 2, 3, 4]; // 页面序列
    let currentPageIndex = 0; // 当前页面在序列中的索引位置
    
    // 初始化fullPage.js
    new fullpage('#fullpage', {
        // 基本配置
        autoScrolling: true,
        scrollBar: false,
        navigation: true,
        navigationPosition: 'right',
        showActiveTooltip: true,
        anchors: ['page1', 'page2', 'page3', 'page4'],
        scrollingSpeed: 800, // 滚动动画时间
        
        // 禁用默认键盘滚动，我们将手动处理
        keyboardScrolling: false,
        
        // 禁用默认的滚动行为，完全由我们控制
        scrollOverflow: true,
        normalScrollElements: '.works',
        touchSensitivity: 15,
        
        // 完全接管页面滚动
        onLeave: function(origin, destination, direction) {
            console.log(`尝试从第${origin.index+1}页滚动到第${destination.index+1}页, 方向:${direction}`);
            
            // 如果正在滚动中，阻止所有滚动事件
            if (isScrolling) {
                return false;
            }
            
            // 计算目标页面在序列中的索引位置
            const originIndex = pageSequence.indexOf(origin.index+1);
            const destinationIndex = pageSequence.indexOf(destination.index+1);
            
            // 如果目标页面不是序列中的下一个或上一个页面，阻止滚动
            if (Math.abs(destinationIndex - originIndex) > 1) {
                console.log('尝试跳过页面，阻止！');
                
                // 设置滚动状态为正在滚动
                isScrolling = true;
                
                // 根据滚动方向决定下一个目标页面
                let nextPageIndex = (direction === 'down') ? 
                    originIndex + 1 : originIndex - 1;
                
                // 确保索引在合法范围内
                nextPageIndex = Math.max(0, Math.min(nextPageIndex, pageSequence.length - 1));
                
                // 滚动到下一个页面
                const nextPage = pageSequence[nextPageIndex];
                console.log(`改为滚动到第${nextPage}页`);
                
                // 延迟执行，以确保当前滚动动画已完成
                setTimeout(() => {
                    fullpage_api.moveTo(nextPage);
                    
                    // 延迟更新当前页面索引和滚动状态
                    setTimeout(() => {
                        currentPageIndex = nextPageIndex;
                        isScrolling = false;
                    }, 800); // 与滚动动画时间一致
                }, 50);
                
                return false;
            }
            
            // 正常顺序滚动，允许并更新当前页面索引
            currentPageIndex = destinationIndex;
            return true;
        }
    });
    

    
    // 添加渐变曲线效果
    const gradientBox = document.querySelector('.gradient-box');
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        // 根据鼠标位置系数调整渐变效果
        const gradientStyle = `
            background: linear-gradient(
                ${135 + mouseY * 30}deg, 
                hsl(${mouseX * 360}, 100%, 50%), 
                hsl(${(mouseX * 360 + 180) % 360}, 100%, 50%)
            );
            background-size: 200%;
            animation: g 8s ease infinite;
        `;
        
        gradientBox.style = gradientStyle;
    });
});
