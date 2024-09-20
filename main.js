document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('bingo-select');
    selectElement.addEventListener('change', function() {
        updateTable(this.value);
    });
    updateTable(selectElement.value); // 초기 테이블 설정
});

function updateTable(size) {
    const table = document.getElementById('bingo-table');
	table.style.setProperty('--size', size);
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // 테이블 내용을 지웁니다.
    let tdIndex = 0;

    for (let i = 0; i < size; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const td = document.createElement('td');
            td.setAttribute('tabindex', '0'); // 포커스 가능하도록 설정
            td.setAttribute('data-index', tdIndex++);

            td.addEventListener('click', handleClickTd);

            td.addEventListener('keydown', function(event) {
                if (event.key === "Enter") {
                    event.preventDefault(); // 기본 Enter 키 동작 방지

                    setTimeout(() => {
                        let currentIndex = parseInt(this.getAttribute('data-index'), 0); // 현재 td의 인덱스

                        let nextIndex = currentIndex + 1; // 다음 td의 인덱스
                        if (nextIndex >= size*size) {
                            nextIndex = 0
                        }
    
                        let nextTd = document.querySelector(`#bingo-table td[data-index="${nextIndex}"]`); // 다음 td 선택
                        if (nextTd) {
                            makeEditable(nextTd);
                        } else {
                            // 다음 td가 없는 경우 처리, 예를 들면 포커스 초기화
                            document.querySelector('#bingo-table td[data-index="0"]').focus();
                        }
                    }, 300);
 
                }
            });

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

function makeEditable(td) {
	if (td.classList.contains('x-marked')) {
        td.classList.remove('x-marked'); // "X" 마크 제거
    }

	if (td.querySelector('input')) {
        return; // 이미 입력 필드가 있는 경우 추가하지 않음
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.value = td.textContent.trim(); // 현재 셀 텍스트를 기본값으로 설정

    input.onblur = function() {
        td.textContent = this.value; // 입력 완료 후 셀에 텍스트 저장
    };

    td.innerHTML = ''; // 기존 셀 내용 삭제
    td.appendChild(input); // 입력 필드 삽입
    //input.focus(); // 자동으로 입력 필드에 포커스
}

function clearTable() {
    const table = document.getElementById('bingo-table');
    const style = getComputedStyle(table);
    const size = style.getPropertyValue('--size').trim(); 
    updateTable(size)
}

function handleClickTd(event) {
    let isEditMode = document.getElementById('edit-mode');
    if (isEditMode.checked) {
        makeEditable(this); // 편집 모드가 활성화된 경우, 편집 가능하게 변경
    } else {
        this.classList.toggle('x-marked'); // "X" 그리기 토글
    }
}