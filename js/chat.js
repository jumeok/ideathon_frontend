const API_BASE = 'https://ideathon-backend.onrender.com';

let retryCount = 0;
const MAX_RETRY = 20;
const RETRY_INTERVAL = 5000;

let messages = [];
let isLoading = false;

const chatContainer = document.getElementById('chatContainer');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const titleSection = document.getElementById('titleSection');
const errorNotice = document.getElementById('errorNotice');

const btnBack = document.querySelector(".btn-back");

btnBack.addEventListener("click", () => {
  window.location.href = "../html/partner.html";
});

console.log('chat.js 최신 파일 연결됨');

chatInput.addEventListener('input', () => {
    sendBtn.disabled = chatInput.value.trim() === '' || isLoading;
});

chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) {
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
}

function setLoading(val) {
    isLoading = val;
    chatInput.disabled = val;
    sendBtn.disabled = val || chatInput.value.trim() === '';
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showError(msg) {
    errorNotice.textContent = msg;
}

function clearError() {
    errorNotice.textContent = '';
}

function appendAIMessage(text) {
    const div = document.createElement('div');
    div.className = 'message-ai';
    div.innerHTML = `
        <img class="ai-avatar" src="../images/chatbot.svg" alt="AI챗봇" />
        <div class="ai-bubble">${escapeHtml(text)}</div>
    `;
    chatContainer.appendChild(div);
    scrollToBottom();
}

function appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'message-user';
    div.innerHTML = `
        <div class="user-bubble">${escapeHtml(text)}</div>
    `;
    chatContainer.appendChild(div);
    scrollToBottom();
}

function showTyping() {
    hideTyping();

    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = 'typingIndicator';
    div.innerHTML = `
        <img class="ai-avatar" src="../images/chatbot.svg" alt="AI챗봇" />
        <div class="typing-dots">
            <span></span><span></span><span></span>
        </div>
    `;
    chatContainer.appendChild(div);
    scrollToBottom();
}

function hideTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) {
        el.remove();
    }
}

function hideTitleSection() {
    if (titleSection) {
        titleSection.classList.add('hidden');
    }
}

async function startChat() {
    setLoading(true);
    showTyping();

    try {
        const res = await fetch(`${API_BASE}/chat/start`, {
            method: 'POST'
        });

        if (!res.ok) {
            throw new Error(`서버 오류 (${res.status})`);
        }

        const data = await res.json();
        console.log('startChat 응답:', data);

        const aiText = data.reply;

        if (!aiText) {
            throw new Error('AI 응답이 비어있습니다.');
        }

        retryCount = 0;
        clearError();
        hideTyping();
        hideTitleSection();

        messages.push({
            role: 'model',
            content: aiText
        });

        appendAIMessage(aiText);
        setLoading(false);

    } catch (e) {
        console.error('startChat 오류:', e);
        hideTyping();

        if (retryCount < MAX_RETRY) {
            retryCount++;
            showError(`서버 연결 중이에요... (${retryCount}/${MAX_RETRY})`);

            setTimeout(startChat, RETRY_INTERVAL);
            return;
        }

        showError('서버에 연결할 수 없어요. 잠시 후 새로고침 해주세요.');
        setLoading(false);
    }
}

async function sendMessage() {
    const text = chatInput.value.trim();

    if (!text || isLoading) {
        return;
    }

    appendUserMessage(text);

    messages.push({
        role: 'user',
        content: text
    });

    chatInput.value = '';
    sendBtn.disabled = true;

    setLoading(true);
    showTyping();

    try {
        const res = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages })
        });

        if (!res.ok) {
            throw new Error(`서버 오류 (${res.status})`);
        }

        const data = await res.json();
        console.log('sendMessage 응답:', data);

        const aiText = data.reply;

        if (!aiText) {
            throw new Error('AI 응답이 비어있습니다.');
        }

        clearError();
        hideTyping();

        messages.push({
            role: 'model',
            content: aiText
        });

        appendAIMessage(aiText);

    } catch (e) {
        console.error('sendMessage 오류:', e);
        hideTyping();
        showError('메시지 전송에 실패했어요. 다시 시도해주세요.');
    } finally {
        setLoading(false);
    }
}

startChat();