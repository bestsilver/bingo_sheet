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

    for (let i = 0; i < size; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const td = document.createElement('td');

            td.addEventListener('click', function() {
                makeEditable(this);
            });

			td.addEventListener('dblclick', function() {
                this.classList.toggle('x-marked'); // "X" 그리기 토글
            });
            
            setupDoubleClick(td);
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
    input.focus(); // 자동으로 입력 필드에 포커스
}

function setupDoubleClick(td) {
    let lastTap = 0;
    td.addEventListener('touchend', function(event) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        clearTimeout(timeout);
        if (tapLength < 500 && tapLength > 0) {
            this.classList.toggle('x-marked'); // 더블 탭 실행 로직
            event.preventDefault();
        } else {
            timeout = setTimeout(function() {
                console.log('Single Tap'); // 단일 탭 로직
                clearTimeout(timeout);
            }, 500);
        }
        lastTap = currentTime;
    });
}