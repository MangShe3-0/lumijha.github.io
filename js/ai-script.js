// 当页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 添加Logo入场动画
    const logo = document.querySelector('.overlay-logo');
    if (logo) {
        setTimeout(() => {
            logo.style.opacity = "1";
            logo.style.transform = "translateY(0)";
        }, 100);
    }
    
    // 添加提示文字入场动画
    const notice = document.querySelector('.api-notice');
    if (notice) {
        setTimeout(() => {
            notice.style.opacity = "1";
            notice.style.transform = "translateY(0)";
        }, 300);
    }
    
    // 添加小字提示入场动画
    const smallNotice = document.querySelector('.small-notice');
    if (smallNotice) {
        setTimeout(() => {
            smallNotice.style.opacity = "1";
            smallNotice.style.transform = "translateY(0)";
        }, 400); // 比api-notice稍晚一点显示
    }
    
    // 添加社交图标入场动画
    const socialIcons = document.querySelector('.social-icons');
    if (socialIcons) {
        // 初始状态
        socialIcons.style.opacity = "0";
        socialIcons.style.transform = "translateX(-50%) translateY(20px)";
        
        setTimeout(() => {
            socialIcons.style.opacity = "1";
            socialIcons.style.transform = "translateX(-50%) translateY(0)";
        }, 500); // 比small-notice稍晚一点显示
    }
    
    // 创建UI元素
    createUIElements();
    
    // 处理用户输入
    function handleUserInput(userText) {
        // 创建显示用户输入的元素
        const userInputDisplay = document.createElement('div');
        userInputDisplay.className = 'user-input-display';
        userInputDisplay.textContent = userText;
        document.body.appendChild(userInputDisplay);
        
        // 显示用户输入
        setTimeout(() => {
            userInputDisplay.classList.add('visible');
        }, 100);
        
        // 获取各元素
        const initialElements = document.querySelectorAll('.overlay-logo, .api-notice, .small-notice, .social-icons, .green-line');
        const aiInput = document.querySelector('.ai-input');
        const chatContainer = document.getElementById('chat-container');
        const userQuestion = document.getElementById('user-question');
        const aiThinking = document.getElementById('ai-thinking');
        const aiResponse = document.getElementById('ai-response');
        
        // 隐藏初始元素
        initialElements.forEach(el => {
            el.style.opacity = "0";
            setTimeout(() => {
                el.style.display = "none";
            }, 300);
        });
        
        // 隐藏输入框
        aiInput.style.opacity = "0";
        setTimeout(() => {
            aiInput.style.display = "none";
        }, 300);
        
        // 显示对话容器
        setTimeout(() => {
            chatContainer.classList.remove('hidden');
            
            // 显示用户问题
            userQuestion.textContent = userText;
            userQuestion.classList.add('visible');
            
            // 显示思考状态
            setTimeout(() => {
                aiThinking.classList.add('visible');
                
                // 显示思考进度条
                const thinkingProgress = document.getElementById('thinking-progress');
                setTimeout(() => {
                    thinkingProgress.classList.add('visible');
                }, 200);
                
                // 调用API获取回答
                callDeepSeekAPI(userText)
                    .then(response => {
                        // 隐藏思考状态和进度条
                        aiThinking.classList.remove('visible');
                        thinkingProgress.classList.remove('visible');
                        
                        // 显示AI回答
                        setTimeout(() => {
                            aiResponse.textContent = response;
                            aiResponse.classList.add('visible');
                            
                            // 显示"问问其他的"按钮
                            const askMoreBtn = document.getElementById('ask-more-btn');
                            setTimeout(() => {
                                askMoreBtn.classList.add('visible');
                            }, 500);
                            
                            // 添加按钮点击事件
                            askMoreBtn.addEventListener('click', resetToInputMode);
                        }, 300);
                    })
                    .catch(error => {
                        console.error('API调用错误:', error);
                        // 显示错误信息
                        aiThinking.classList.remove('visible');
                        thinkingProgress.classList.remove('visible');
                        
                        setTimeout(() => {
                            aiResponse.textContent = "抱歉，我遇到了一点问题，请稍后再试。";
                            aiResponse.classList.add('visible');
                            
                            // 显示"问问其他的"按钮
                            const askMoreBtn = document.getElementById('ask-more-btn');
                            setTimeout(() => {
                                askMoreBtn.classList.add('visible');
                            }, 500);
                            
                            // 添加按钮点击事件
                            askMoreBtn.addEventListener('click', resetToInputMode);
                        }, 300);
                    });
            }, 300);
        }, 400);
    }
    
    // 创建UI元素函数
    function createUIElements() {
        const overlayContent = document.querySelector('.overlay-content');
        
        if (overlayContent) {
            // 创建输入框
            const aiInput = document.createElement('input');
            aiInput.type = 'text';
            aiInput.className = 'ai-input';
            aiInput.placeholder = '在此输入...';
            aiInput.maxLength = 100; // 设置最大字符数，防止过长文本
            aiInput.style.opacity = "0";
            aiInput.style.transform = "translateY(20px)";
            overlayContent.appendChild(aiInput);
            
            // 输入框入场动画
            setTimeout(() => {
                aiInput.style.opacity = "1";
                aiInput.style.transform = "translateY(0)";
            }, 200);
            
            // 创建绿线
            const greenLine = document.createElement('div');
            greenLine.className = 'green-line';
            greenLine.style.opacity = "0";
            greenLine.style.transform = "scaleX(0.8)";
            overlayContent.appendChild(greenLine);
            
            // 绿线入场动画
            setTimeout(() => {
                greenLine.style.opacity = "1";
                greenLine.style.transform = "scaleX(1)";
            }, 250);
            
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
            
            // 自动聚焦输入框
            setTimeout(() => aiInput.focus(), 100);
            
            // 处理回车键事件
            aiInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' && this.value.trim() !== '') {
                    handleUserInput(this.value.trim());
                    this.value = ''; // 清空输入框
                }
            });
        }
    }
    
    // 调用DeepSeek API
    async function callDeepSeekAPI(prompt) {
        try {
            // 这里需要替换成你的API实现
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 返回模拟的响应
            return "这是一个AI响应示例。实际应用中，你需要实现与DeepSeek API的连接。";
        } catch (error) {
            console.error('API调用失败:', error);
            throw error;
        }
    }
    
    // 重置到输入模式的函数
    function resetToInputMode() {
        // 获取各元素
        const initialElements = document.querySelectorAll('.overlay-logo, .api-notice, .small-notice, .social-icons');
        const chatContainer = document.getElementById('chat-container');
        const userQuestion = document.getElementById('user-question');
        const aiThinking = document.getElementById('ai-thinking');
        const aiResponse = document.getElementById('ai-response');
        const askMoreBtn = document.getElementById('ask-more-btn');
        const greenLine = document.querySelector('.green-line');
        const thinkingProgress = document.getElementById('thinking-progress');
        
        // 如果存在旧的输入框和绿线，先移除它们
        const oldAiInput = document.querySelector('.ai-input');
        if(oldAiInput) oldAiInput.remove();
        if(greenLine) greenLine.remove();
        
        // 隐藏对话容器及其内容
        chatContainer.classList.add('hidden');
        userQuestion.classList.remove('visible');
        aiThinking.classList.remove('visible');
        aiResponse.classList.remove('visible');
        askMoreBtn.classList.remove('visible');
        thinkingProgress.classList.remove('visible');
        
        // 重置文本内容
        setTimeout(() => {
            userQuestion.textContent = '';
            aiResponse.textContent = '';
        }, 300);
        
        // 显示初始元素
        initialElements.forEach(el => {
            el.style.display = "";
            setTimeout(() => {
                el.style.opacity = "1";
            }, 100);
        });
        
        // 重新创建UI元素
        setTimeout(() => {
            createUIElements();
        }, 400);
    }
});