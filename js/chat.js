const API_BASE = 'https://ideathon-backend.onrender.com';

let retryCount = 0;
const MAX_RETRY = 20;
const RETRY_INTERVAL = 5000;

// 대화 히스토리 (POST /chat에 통째로 전달)
let messages = [];
let isLoading = false;

// DOM 참조
const chatContainer = document.getElementById('chatContainer');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const titleSection = document.getElementById('titleSection');
const errorNotice = document.getElementById('errorNotice');

/* ── 이벤트 리스너 ── */
chatInput.addEventListener('input', () => {
    // 입력창이 비어있거나 로딩 중일 때는 보내기 버튼 비활성화
    sendBtn.disabled = chatInput.value.trim() === '' || isLoading;
});

// 입력창 입력 후 키보드 엔터 클릭 시 메세지 보내기
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) sendMessage();
});

sendBtn.addEventListener('click', sendMessage);

/* ── 유틸 ── */
function escapeHtml(str) {
    return str
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
    // setTimeout(() => { errorNotice.textContent = ''; }, 4000);
}

function clearError() {
    errorNotice.textContent = '';
}

/* ── UI 렌더링 ── */
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
    div.innerHTML = `<div class="user-bubble">${escapeHtml(text)}</div>`;
    chatContainer.appendChild(div);
    scrollToBottom();
}

function showTyping() {
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
    if (el) el.remove();
}

function hideTitleSection() {
    titleSection.classList.add('hidden');
}

/* ── API 호출 ── */

// 1) 채팅 시작 - AI 첫 인사 받아오기
async function startChat() {
    setLoading(true);
    showTyping();

    try {
        const res = await fetch(`${API_BASE}/chat/start`, { method: 'POST' });
        if (!res.ok) throw new Error(`서버 오류 (${res.status})`);

        const data = await res.json();

        const aiText = data.reply;

        clearError();

        hideTyping();
        hideTitleSection();

        messages.push({ role: 'model', content: aiText });
        appendAIMessage(aiText);

    } catch (e) {
        hideTyping();
        if (retryCount < MAX_RETRY) {
            retryCount++;

            errorNotice.textContent = `서버 연결 중이에요... (${retryCount}/${MAX_RETRY})`;
            setTimeout(startChat, RETRY_INTERVAL);
            // showError(`서버 연결 중이에요. 잠시 후 다시 시도할게요. (${retryCount}/${MAX_RETRY})`);
            // setTimeout(startChat, 5000);
        } else {
            showError('서버에 연결할 수 없어요. 잠시 후 새로고침 해주세요.');
        }
    } finally {
        setLoading(false);
    }
}

// 2) 사용자 메시지 전송
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isLoading) return;

    // 화면에 먼저 표시
    appendUserMessage(text);
    messages.push({ role: 'user', content: text });

    chatInput.value = '';
    sendBtn.disabled = true;

    setLoading(true);
    showTyping();

    try {
        const res = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages }),
        });
        if (!res.ok) throw new Error(`서버 오류 (${res.status})`);

        const data = await res.json();

        const aiText = data.reply;

        hideTyping();
        messages.push({ role: 'model', content: aiText });
        appendAIMessage(aiText);

    } catch (e) {
        hideTyping();
        showError('메시지 전송에 실패했어요. 다시 시도해주세요.');
    } finally {
        setLoading(false);
    }
}

/* ── 진입점 ── */
startChat();