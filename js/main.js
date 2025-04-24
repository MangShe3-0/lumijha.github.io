// AI页面控制函数 - 移到全局作用域
function openAiOverlay() {
    const aiFrame = document.getElementById('ai-frame');
    aiFrame.src = "ai.html";
    aiFrame.style.display = "block";
    
    // 强制重排以确保过渡效果生效
    aiFrame.offsetHeight;
    
    // 淡入显示
    aiFrame.style.opacity = "1";
    
    // 禁用fullPage滚动
    if (typeof fullpage_api !== 'undefined') {
        fullpage_api.setAllowScrolling(false);
        fullpage_api.setKeyboardScrolling(false);
    }
    
    // 隐藏导航点
    const fpNav = document.getElementById('fp-nav');
    if (fpNav) {
        fpNav.style.display = 'none';
    }
}

function closeAiOverlay() {
    const aiFrame = document.getElementById('ai-frame');
    
    // 淡出效果
    aiFrame.style.opacity = "0";
    
    // 等待过渡效果完成后隐藏
    setTimeout(function() {
        aiFrame.style.display = "none";
        aiFrame.src = "about:blank";
    }, 300); // 等待时间与过渡时间一致
    
    // 恢复fullPage滚动
    if (typeof fullpage_api !== 'undefined') {
        fullpage_api.setAllowScrolling(true);
        fullpage_api.setKeyboardScrolling(true);
    }
    
    // 显示导航点
    const fpNav = document.getElementById('fp-nav');
    if (fpNav) fpNav.style.display = 'block';
}

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
    var myFullpage = new fullpage('#fullpage', {
        // 基本配置
        autoScrolling: true,
        scrollBar: false,
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: [], // 移除文字提示
        showActiveTooltip: false, // 禁用提示显示
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5'],
        scrollingSpeed: 800, // 滚动动画时间
        scrollingBar: false,
        verticalCentered: true,
        credits: { enabled: false }, // 禁用底部水印
        
        // 启用键盘滚动
        keyboardScrolling: true,
        
        // 允许跨页导航
        scrollOverflow: false,
        scrollOverflowOptions: {
            scrollbars: false
        },
        normalScrollElements: '.works',
        touchSensitivity: 15,
        
        // 添加响应式选项
        responsiveHeight: 500, // 当高度小于500px时禁用自动滚动功能
        
        // 页面滚动管理
        onLeave: function(origin, destination, direction) {
            console.log(`从第${origin.index+1}页滚动到第${destination.index+1}页, 方向:${direction}`);
            
            // 添加滚动中的类，用于扩大导航点
            document.body.classList.add('is-scrolling');

            // 在开始离开第一页时立即隐藏链接
            if (origin.index === 0) {
                const section1Links = document.querySelector('.section1-links');
                if (section1Links) {
                    section1Links.classList.remove('visible');
                    console.log("滚动开始，隐藏第一页底部链接");
                }
            }
            
            // 如果正在滚动中，阻止所有滚动事件
            if (isScrolling) {
                return false;
            }
            
            // 更新当前页面索引
            const destinationIndex = pageSequence.indexOf(destination.index+1);
            if (destinationIndex !== -1) {
                currentPageIndex = destinationIndex;
            }
            
            // 处理页面离开时的响应式调整
            if (window.innerHeight < 600) {
                // 对于小屏幕高度，调整过渡效果
                const content = document.querySelectorAll('.section');
                content.forEach(section => {
                    section.style.overflow = 'auto';
                });
                
                // 为page5添加特殊处理，确保作品标题在小屏幕上依然可见
                if (destination.index === 4) { // page5索引为4
                    const worksTitle = document.querySelector('.works-title');
                    if (worksTitle) {
                        worksTitle.style.fontSize = '32px'; // 减小字体大小
                    }
                }
            }
            
            return true;
        },
        
        // 滚动到新节点完成后
        afterLoad: function(origin, destination, direction) {
            // 移除滚动中的类，导航点恢复原来大小
            setTimeout(() => {
                document.body.classList.remove('is-scrolling');
            }, 400);

            // 控制固定在底部的链接的可见性 - 只处理显示
            const section1Links = document.querySelector('.section1-links');
            if (section1Links) {
                if (destination.index === 0) { // 如果滚动到第一页
                    section1Links.classList.add('visible');
                    console.log("滚动结束，显示第一页底部链接");
                } 
                // Hide logic moved to onLeave
            }
            
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

    // 绑定AI触发器事件
    const aiTrigger = document.getElementById('ai-trigger');
    if (aiTrigger) {
        aiTrigger.addEventListener('click', function(event) {
            event.preventDefault();
            openAiOverlay();
        });
    }
});
