// 공구 목록 참여율/진행도 라이브 갱신 (폴링).
// 목록 페이지는 Thymeleaf 서버렌더라 페이지 로드 시 스냅샷 1회만 그려진다.
// 다른 사용자의 참여/취소가 반영되도록, N초마다 REST(GET /api/group-buys)로 최신 집계를 받아
// 서버렌더된 카드를 data-gb-seq로 찾아 "지금 N% 참여중!" 문구와 진행도 바 너비만 갱신한다.
(function () {
    var POLL_MS = 5000; // 갱신 주기(ms)

    async function refresh() {
        try {
            var res = await fetch('/api/group-buys', { headers: { Accept: 'application/json' } });
            if (!res.ok) return;
            var list = await res.json();
            list.forEach(function (g) {
                var card = document.querySelector('[data-gb-seq="' + g.seq + '"]');
                if (!card) return;
                var textEl = card.querySelector('.js-gb-progress-text');
                if (textEl) textEl.textContent = '지금 ' + g.progress + '% 참여중!';
                var barEl = card.querySelector('.js-gb-bar');
                if (barEl) barEl.style.width = g.progress + '%';
            });
        } catch (e) {
            // 일시적 네트워크 오류는 무시하고 다음 주기에 재시도
        }
    }

    setInterval(refresh, POLL_MS);
})();
