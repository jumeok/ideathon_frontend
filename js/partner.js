// 성격 키워드
const KEYWORDS = [
    '다정한', '열정적인', '친절한',
    '감성적인', '차분한', '책임감 있는',
    '논리적인', '배려심 있는', '따뜻한',
    '독립적인', '즉흥적인', '계획적인',
    '창의적인', '현실적인', '수줍은',
    '낙천적인', '비관적인', '외향적인',
    '내향적인', '직설적인', '신중한',
    '호기심 많은', '탐구적인', '분석적인',
    '직관적인', '유머러스한', '진지한',
    '성실한', '게으른', '완벽주의적인',
    '자유로운', '리더형', '협력적인',
    '활발한', '지적인', '책임감 있는',
];

// 선택 키워드 set
const selectedSet = new Set();

// DOM 요소 선택
const keywordGrid = document.getElementById('keywordGrid');
const btnNext = document.querySelector('.btn-next');

// 키워드 칩 렌더링
function renderChips() {
    keywordGrid.innerHTML = '';
    KEYWORDS.forEach((keyword) => {
        // 키워드 칩 생성 및 상태에 따른 변경
        const chip = document.createElement('button');
        chip.className = 'chip' + (selectedSet.has(keyword) ? ' selected' : '');
        chip.innerHTML = `
        <img class="chip-icon" src="../images/${selectedSet.has(keyword) ? 'check.svg' : 'plus.svg'}" alt="" />
        <span>${keyword}</span>
        `;
        // 키워드 칩 이벤트 리스너 
        chip.addEventListener('click', () => toggleKeyword(keyword));
        // 키워드 목록에 키워드 추가
        keywordGrid.appendChild(chip); 
    });
}

// 키워드 선택 및 해제 토글 함수
function toggleKeyword(keyword) {
    if (selectedSet.has(keyword)) { // 키워드 해제하는 경우 
        selectedSet.delete(keyword);
    } else { // 키워드 선택하는 경우
        selectedSet.add(keyword);
    }

    updateButton();
    renderChips(); // 칩 변경 사항 렌더링
}

// 다음 버튼 활성 및 비활성 
function updateButton() {
    // 1개 이상 키워드 선택 시 활성화
    btnNext.disabled = selectedSet.size === 0; 
}

// 다음 버튼 클릭 
btnNext.addEventListener('click', () => {
    if (selectedSet.size === 0) return; 

    const selectedKeywords = Array.from(selectedSet);
    console.log('선택된 키워드: ', selectedKeywords);

    // 다음 화면으로 이동
    window.location.href = '../html/chat.html';
});

// 초기 렌더링 
renderChips();