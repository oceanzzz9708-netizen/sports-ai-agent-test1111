// 设置体育查询
function setSportQuery(sport) {
    const input = document.getElementById('user-input');
    input.value = `请分析最近的热门${sport}赛事，包括关键比赛、球员表现和赛事预测`;
    input.focus();
}

// 发送消息
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) {
        alert('请输入问题！');
        return;
    }
    
    // 添加用户消息到聊天框
    addMessage(message, 'user');
    input.value = '';
    
    // 显示加载状态
    const loadingId = showLoading();
    
    try {
        // 调用后端API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        // 移除加载状态
        removeLoading(loadingId);
        
        if (data.success) {
            addMessage(data.response, 'ai');
        } else {
            addMessage('抱歉，AI分析服务暂时不可用。请稍后重试。', 'ai');
        }
    } catch (error) {
        removeLoading(loadingId);
        addMessage('网络连接错误，请检查网络后重试。', 'ai');
    }
}

// 添加消息到聊天框
function addMessage(content, type) {
    const chatBox = document.getElementById('chat-box');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatar = type === 'user' ? '🙋' : '🤖';
    
    messageDiv.innerHTML = `
        <div class="avatar">${avatar}</div>
        <div class="content">${formatContent(content)}</div>
    `;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 格式化内容（简单Markdown转换）
function formatContent(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/- (.*$)/gim, '• $1<br>')
        .replace(/\d\. (.*$)/gim, '$1<br>');
}

// 显示加载动画
function showLoading() {
    const chatBox = document.getElementById('chat-box');
    const loadingDiv = document.createElement('div');
    const loadingId = 'loading-' + Date.now();
    
    loadingDiv.id = loadingId;
    loadingDiv.className = 'message ai-message';
    loadingDiv.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="content">
            <div class="loading-dots">
                <span>分析中</span>
                <span class="dot">.</span>
                <span class="dot">.</span>
                <span class="dot">.</span>
            </div>
        </div>
    `;
    
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    return loadingId;
}

// 移除加载动画
function removeLoading(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

// 快捷问题
function askQuickQuestion(question) {
    document.getElementById('user-input').value = question;
    sendMessage();
}

// 回车键发送
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// 页面加载完成后添加CSS动画
document.addEventListener('DOMContentLoaded', function() {
    // 添加加载点动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dotPulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
        .loading-dots .dot {
            animation: dotPulse 1.5s infinite;
        }
        .loading-dots .dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots .dot:nth-child(3) { animation-delay: 0.4s; }
    `;
    document.head.appendChild(style);
});
