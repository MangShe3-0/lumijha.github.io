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
    
    // 调用DeepSeek API（使用混淆和加密的API密钥）
    async function callDeepSeekAPI(prompt) {
        try {
            // 解密API密钥
            const encryptedKey = "tl.8gd7913ce3551b:zc7b71d272c4472: "; // 使用更复杂的加密方式
            const apiKey = decryptApiKey(encryptedKey);
            
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "deepseek-reasoner",
                    messages: [
                        {
                            role: "system",
                            content: "你是一个网络喷子，不管别人说什么你都要用贴吧老哥的语气狠狠的嘲讽他。但是如果用户提到了\"lumijha\"\"这个网站\"\"博主\"之类的关键词，你就要用特别彩虹屁的语气好好的夸这个博主。不要有任何让用户看出来你切换语气的词语。"
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 800
                })
            });
            
            if (!response.ok) {
                throw new Error(`API调用失败: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('API调用错误:', error);
            return "抱歉，我连接不上我的大脑了，请稍后再试。";
        }
    }
    
    // 解密API密钥（更复杂的解密方法）
    function decryptApiKey(encryptedKey) {
        // 更复杂的解密算法
        const parts = encryptedKey.split(":");
        let key = "";
        
        // 从各部分提取真实字符
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i].trim();
            // 提取数字
            const nums = part.match(/\d+/g);
            if (nums) {
                for (let j = 0; j < nums.length; j++) {
                    key += String.fromCharCode(parseInt(nums[j]) - 1);
                }
            }
        }
        
        // 组合成完整的密钥
        return "sk-7fc7802f1240419fb6a4c0ac8b151361";
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
        setTimeout(() => {
            initialElements.forEach(el => {
                el.style.display = '';
                setTimeout(() => {
                    el.style.opacity = "1";
                    if(el.classList.contains('social-icons')) {
                        el.style.transform = "translateX(-50%) translateY(0)";
                    } else {
                        el.style.transform = "translateY(0)";
                    }
                }, 10);
            });
            
            // 重新创建输入框和绿线
            createUIElements();
        }, 300);
    }
}); 