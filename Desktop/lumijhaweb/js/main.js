// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 控制台欢迎信息
    console.log('欢迎访问设计师·路的个人博客！');
    
    // 页面状态变量 
    let isScrolling = false;
    let pageSequence = [1, 2, 3, 4]; // 页面序列
    let currentPageIndex = 0; // 当前页面在序列中的索引位置
    
    // GIF状态跟踪
    let gifPlayed = false; // 标记GIF是否已经播放过
    let originalGifSrc = './image/font-animation.gif'; // 原始GIF源
    let lastFrameSrc = './image/font-animation-last-frame.png'; // 最后一帧源
    
    // 初始化fullPage.js
    new fullpage('#fullpage', {
        // 基本配置
        autoScrolling: true,
        scrollBar: false,
        navigation: true,
        navigationPosition: 'right',
        showActiveTooltip: false,
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5'],
        navigationTooltips: ['Home', 'Fonts', 'Typography', 'Contact'],
        scrollingSpeed: 800, // 滚动动画时间
        scrollingBar: false,
        verticalCentered: true,
        credits: { enabled: false }, // 禁用底部水印
        
        // 禁用默认键盘滚动，我们将手动处理
        keyboardScrolling: false,
        
        // 禁用默认的滚动行为，完全由我们控制
        scrollOverflow: false,
        scrollOverflowOptions: {
            scrollbars: false
        },
        normalScrollElements: '.works',
        touchSensitivity: 15,
        
        // 完全接管页面滚动
        onLeave: function(origin, destination, direction) {
            console.log(`尝试从第${origin.index+1}页滚动到第${destination.index+1}页, 方向:${direction}`);
            
            // 添加滚动中的类，用于扩大导航点
            document.body.classList.add('is-scrolling');
            
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
        },
        
        // 滚动到新节点完成后
        afterLoad: function(origin, destination, direction) {
            // 移除滚动中的类，导航点恢复原来大小
            setTimeout(() => {
                document.body.classList.remove('is-scrolling');
            }, 400);
            
            // 当第二页（字体页面）显示时设置GIF只播放一次
            if(destination.index === 1) { // 第二页索引为1
                const gifContainer = document.querySelector('.gif-container');
                if (!gifContainer) return;
                
                // 获取GIF图像元素
                let gifImage = document.getElementById('font-animation');
                
                // 如果GIF图像不存在，创建一个
                if (!gifImage) {
                    gifImage = document.createElement('img');
                    gifImage.id = 'font-animation';
                    gifImage.alt = '字体动画';
                    gifImage.style.width = '900px';
                    gifImage.style.display = 'block';
                    gifContainer.appendChild(gifImage);
                }
                
                // 如果GIF尚未播放过，则播放GIF
                if (!gifPlayed) {
                    // 显示GIF动画
                    gifImage.src = originalGifSrc;
                    
                    // 设置计时器替换为静态图像
                    setTimeout(function() {
                        // 创建静态图像元素
                        const staticImage = document.createElement('img');
                        staticImage.id = 'font-animation';
                        staticImage.style.width = '900px';
                        staticImage.style.display = 'block';
                        staticImage.alt = '字体动画';
                        staticImage.src = lastFrameSrc;
                        
                        // 替换GIF为静态图
                        gifContainer.replaceChild(staticImage, gifImage);
                        
                        // 标记GIF已播放过
                        gifPlayed = true;
                    }, 3200); // GIF播放时间，根据实际调整
                } else {
                    // 如果GIF已播放过，直接显示静态图像
                    gifImage.src = lastFrameSrc;
                }
            }
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
