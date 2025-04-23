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

    // --- AI Overlay Logic --- //
    console.log("正在初始化AI遮罩层逻辑...");
    const aiTrigger = document.getElementById('ai-trigger');
    const aiOverlay = document.getElementById('ai-overlay');
    
    console.log("AI触发器:", aiTrigger);
    console.log("AI遮罩层:", aiOverlay);

    if (aiTrigger && aiOverlay) {
        console.log("找到AI触发器和遮罩层，正在添加事件监听器...");
        
        // 创建绿线和输入框
        const overlayContent = aiOverlay.querySelector('.overlay-content');
        if (overlayContent) {
            // 创建绿线
            const greenLine = document.createElement('div');
            greenLine.className = 'green-line';
            overlayContent.appendChild(greenLine);
            
            // 创建输入框
            const aiInput = document.createElement('input');
            aiInput.type = 'text';
            aiInput.className = 'ai-input';
            aiInput.placeholder = '在此输入...';
            aiInput.maxLength = 100; // 设置最大字符数，防止过长文本
            overlayContent.appendChild(aiInput);
            
            // 输入文本监听器
            aiInput.addEventListener('input', function() {
                // 创建临时span来测量文本宽度
                const tempSpan = document.createElement('span');
                tempSpan.style.font = '100px "Noto Sans SC", sans-serif'; // 与输入框相同字体
                tempSpan.style.position = 'absolute';
                tempSpan.style.visibility = 'hidden';
                tempSpan.style.whiteSpace = 'nowrap';
                tempSpan.textContent = aiInput.value;
                document.body.appendChild(tempSpan);
                
                // 获取当前文本宽度
                const textWidth = tempSpan.offsetWidth;
                
                // 获取输入框宽度（与绿线相同）
                const inputWidth = aiInput.offsetWidth;
                
                // 删除临时span
                document.body.removeChild(tempSpan);
                
                // 根据文本宽度调整显示
                if (textWidth > inputWidth) {
                    // 文本宽度超过输入框，缩小字体
                    aiInput.classList.add('medium-font');
                    
                    // 创建一个新的临时span来测量减小字体后的宽度
                    const tempSpan2 = document.createElement('span');
                    tempSpan2.style.font = '50px "Noto Sans SC", sans-serif'; // 减半字体
                    tempSpan2.style.position = 'absolute';
                    tempSpan2.style.visibility = 'hidden';
                    tempSpan2.style.whiteSpace = 'nowrap';
                    tempSpan2.textContent = aiInput.value;
                    document.body.appendChild(tempSpan2);
                    
                    // 获取减小字体后的宽度
                    const reducedTextWidth = tempSpan2.offsetWidth;
                    
                    // 删除第二个临时span
                    document.body.removeChild(tempSpan2);
                    
                    // 如果减小字体后宽度仍然超过输入框，则设置为两行显示
                    if (reducedTextWidth > inputWidth) {
                        aiInput.classList.add('two-lines');
                    } else {
                        aiInput.classList.remove('two-lines');
                    }
                } else {
                    // 文本宽度未超过输入框，恢复默认字体大小和单行显示
                    aiInput.classList.remove('medium-font');
                    aiInput.classList.remove('two-lines');
                }
            });
        }
        
        // 为触发器添加点击事件
        aiTrigger.addEventListener('click', function(event) {
            console.log("AI触发器被点击!");
            event.preventDefault(); // 阻止默认行为
            
            // 确保遮罩层可见
            aiOverlay.style.display = 'block'; // 先设置display，再设置opacity
            // 使用setTimeout确保display更改后再添加类
            setTimeout(function() {
                aiOverlay.classList.add('overlay-visible');
                
                // 遮罩层显示后聚焦到输入框
                const aiInput = aiOverlay.querySelector('.ai-input');
                if (aiInput) {
                    setTimeout(() => aiInput.focus(), 100);
                }
            }, 10);
            
            console.log("已添加overlay-visible类，当前类列表:", aiOverlay.classList);
            
            // 禁用fullPage滚动
            if (typeof fullpage_api !== 'undefined') {
                console.log("禁用fullPage滚动");
                fullpage_api.setAllowScrolling(false);
                fullpage_api.setKeyboardScrolling(false);
            } else {
                console.log("警告：fullpage_api未定义");
            }
            
            // 隐藏导航点
            const fpNav = document.getElementById('fp-nav');
            if (fpNav) {
                fpNav.style.display = 'none';
                console.log("隐藏了导航点");
            }
        });
        
        // 为关闭按钮添加点击事件
        const overlayCloseButton = aiOverlay.querySelector('.overlay-close');
        console.log("关闭按钮:", overlayCloseButton);
        
        if (overlayCloseButton) {
            overlayCloseButton.addEventListener('click', function(event) {
                console.log("关闭按钮被点击!");
                event.stopPropagation(); // 阻止事件冒泡
                
                // 隐藏遮罩层（使用淡出效果）
                aiOverlay.classList.remove('overlay-visible');
                
                // 清空输入框
                const aiInput = aiOverlay.querySelector('.ai-input');
                if (aiInput) {
                    aiInput.value = '';
                    aiInput.classList.remove('medium-font');
                    aiInput.classList.remove('two-lines');
                }
                
                // 等待过渡完成后设置display: none
                setTimeout(function() {
                    if (!aiOverlay.classList.contains('overlay-visible')) {
                        aiOverlay.style.display = 'none';
                    }
                }, 300); // 等待300ms（与CSS过渡时间相同）
                
                // 恢复fullPage滚动
                if (typeof fullpage_api !== 'undefined') {
                    fullpage_api.setAllowScrolling(true);
                    fullpage_api.setKeyboardScrolling(true);
                }
                
                // 显示导航点
                const fpNav = document.getElementById('fp-nav');
                if (fpNav) fpNav.style.display = 'block';
            });
        } else {
            console.error("错误：未找到关闭按钮!");
        }
        
        // 点击背景关闭遮罩层
        aiOverlay.addEventListener('click', function(event) {
            // 仅当点击的是遮罩层本身（非内容）时关闭
            if (event.target === aiOverlay) {
                console.log("点击了遮罩层背景");
                if (overlayCloseButton) {
                    overlayCloseButton.click();
                } else {
                    aiOverlay.classList.remove('overlay-visible');
                }
            }
        });
    } else {
        console.error("错误：未找到AI触发器或遮罩层!");
        console.log("AI触发器ID:", 'ai-trigger');
        console.log("AI遮罩层ID:", 'ai-overlay');
    }

});
