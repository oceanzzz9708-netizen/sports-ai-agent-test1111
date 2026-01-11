from flask import Flask, render_template, request, jsonify
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# DeepSeek API配置
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """调用DeepSeek API"""
    try:
        user_message = request.json.get('message', '')
        
        # 体育相关的系统提示词
        system_prompt = """你是一个专业的体育赛事分析师。请分析用户提到的体育赛事，提供：
        1. 赛事基本信息
        2. 关键数据统计
        3. 胜负分析
        4. 未来预测
        请用中文回复，保持专业且简洁。"""
        
        # 构建请求数据
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "stream": False
        }
        
        # 调用DeepSeek API
        import requests
        response = requests.post(DEEPSEEK_API_URL, json=data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            ai_response = result['choices'][0]['message']['content']
            return jsonify({"success": True, "response": ai_response})
        else:
            return jsonify({
                "success": False, 
                "response": f"API请求失败: {response.status_code}"
            })
            
    except Exception as e:
        return jsonify({"success": False, "response": str(e)})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
