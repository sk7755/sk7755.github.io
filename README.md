# Jaehoon Chung — Academic Homepage

계산기하 연구를 소개하는 GitHub Pages용 정적 홈페이지입니다. 별도 빌드 과정이나 패키지 설치 없이 HTML, CSS, JavaScript만으로 동작합니다.

## 로컬 미리보기

프로젝트 폴더에서 다음 명령을 실행한 뒤 `http://localhost:8000`을 엽니다.

```powershell
python -m http.server 8000
```

서버를 종료할 때는 터미널에서 `Ctrl+C`를 누릅니다.

## 페이지 구성

- 소개: 현재 직위, 연구 분야, 연락처, 큰 프로필 사진
- Largest unit rectangle: 볼록다각형에 내접하는 최대 unit rectangle을 모든 방향에 대해 실시간으로 계산해 보여 주는 figure
- 연구 분야: computational geometry, algorithmic primitives for AI, AI-assisted algorithm design
- Upcoming: 향후 발표 일정과 행사 링크
- Featured papers: Largest Unit Rectangles를 첫 번째로 배치한 대표·최근 논문 4편을 figure와 함께 자세히
- Publications: 연구 흐름을 보여 주는 논문 6편의 목록
- 전체 경력과 출판 목록: `cv_15.pdf`

Featured papers와 Publications는 역할이 다릅니다. 앞쪽은 figure를 곁들인 소개이고, 뒤쪽은 연도순 목록입니다. 두 제목이 모두 "Selected ...”이면 구분이 되지 않으므로 이렇게 나눴습니다.

홈페이지에는 CV 전체를 옮기지 않습니다. 수상, 특허, 교육 이력, 프로젝트 목록 등은 CV에만 유지합니다.

## 디자인

Computational Geometry 2025, SWAT 2026, ISAAC 2025, FSTTCS 2022 논문의 Figure를 원본 비율로 사용합니다. 임의로 재구성한 연구 도식은 넣지 않았습니다.

- 서로 다른 방향의 largest unit rectangles
- vertical trapezoidal decomposition과 strip partition
- windmill polygon의 guillotine / non-guillotine partition
- inscribed / circumscribed histogon의 다섯 변형

색상은 의미에 따라 일관되게 사용합니다.

| 토큰 | 용도 |
| --- | --- |
| `--paper`, `--surface` | 종이색 배경과 figure 패널 |
| `--ink`, `--ink-soft`, `--muted` | 본문 위계 (셋 다 명도 대비 4.5:1 이상) |
| `--teal` | feasible region과 주요 링크 |
| `--blue` | 보조 조각과 방향 정보 |
| `--coral` | cut과 contact point |
| `--ochre` | 선택된 해와 길이 표기 |

강조색은 `--teal`처럼 선·작은 글씨에 쓰는 값과 `--teal-soft`처럼 면·그림자에 쓰는 값이 짝을 이룹니다. 요소에 `accent-teal`, `accent-blue`, `accent-coral`, `accent-ochre` 중 하나를 붙이면 그 짝이 `--accent`, `--accent-soft`로 전달되므로, research card와 paper figure가 같은 방식으로 색을 받습니다.

`--band-*`, `--header-bg`, `--figure-bg`처럼 반투명하게 겹치는 배경은 `color-mix()`로 위 팔레트에서 파생시킵니다. 팔레트 값만 바꾸면 배경 띠도 같이 따라옵니다.

자동 dark mode는 사용하지 않습니다. 사진도 흑백 필터 없이 원본 색상을 사용합니다.

## 움직임

- Largest unit rectangle figure: `script.js`의 `initRectFigure()`가 `<canvas>`에 직접 그립니다. 볼록다각형은 `POLY` 배열 하나로 정의합니다. 방향 θ에 대해 다각형을 −θ만큼 돌리면 직사각형이 축에 나란해지고, 볼록다각형은 네 꼭짓점을 모두 품을 때에만 직사각형을 품으므로, 왼쪽 변이 x에 놓인 폭 1짜리 직사각형의 최대 높이는

  ```
  f(x) = min(hi(x), hi(x+1)) − max(lo(x), lo(x+1))
  ```

  입니다. `hi`는 오목, `lo`는 볼록이므로 `f`는 오목이고 ternary search가 진짜 최적해로 수렴합니다. 폭이 1이므로 이 높이가 곧 넓이입니다. 경계에 닿는 꼭짓점(contact)은 동그라미로 표시합니다. 마우스를 올리거나 가로로 드래그하면 θ를 직접 돌릴 수 있고, 손을 떼면 그 각도에서 자동 재생이 이어집니다. 근거 논문은 Computational Geometry 2025입니다.
- 스크롤 등장 효과: `data-reveal`이 붙은 요소를 IntersectionObserver가 관찰합니다.

세 가지 안전장치가 있습니다.

- `prefers-reduced-motion: reduce`이면 애니메이션을 멈추고 완성된 분할을 한 장면으로만 그립니다. 등장 효과도 끕니다.
- canvas가 화면 밖이거나 탭이 비활성이면 `requestAnimationFrame`을 멈춥니다.
- 등장 효과 CSS는 `<html class="js">`에서만 적용되므로, `script.js`가 실패해도 내용이 숨겨진 채로 남지 않습니다.

연구 분야 카드는 subgrid를 써서 번호·도형·제목·본문이 세 카드에서 같은 행에 놓입니다. 제목 줄 수가 달라도 어긋나지 않습니다.

## 모바일

320px까지 가로 스크롤이 생기지 않도록 맞춰져 있습니다.

작은 mono 링크(EMAIL·CV·GitHub, 논문 목록의 arXiv·article, footer 이메일 등)는 글자 상자가 19px 정도라 손가락으로 누르기에는 작습니다. 크기를 키우면 디자인이 흐트러지므로, `@media (pointer: coarse)`에서 보이지 않는 `::before` 오버레이를 씌워 **레이아웃은 그대로 두고 터치 영역만** 40px 안팎으로 넓혔습니다. 링크 사이 간격보다 오버레이가 넓어지면 서로 겹치므로 `.identity-links`의 gap도 함께 키웠습니다.

figure 상단 라벨은 0.58rem일 때 9.3px로 너무 작아 0.62rem으로 올렸고, 대신 gap을 줄여 320px에서도 두 라벨이 한 줄에 들어갑니다.

`body::after`(청록색 사선 도형)는 한 단 배치에서 본문 문단을 가로지르기 때문에 620px 이하에서는 숨깁니다.

live figure는 좁은 화면에서 그래프를 빼고 다각형만 크게 보여 줍니다. `touch-action: pan-y` 덕분에 세로 스와이프는 스크롤로, 가로 드래그는 회전으로 갑니다. 터치에서는 `pointerdown`이 아니라 `pointermove`부터 반응하므로, 스크롤하려고 화면을 짚었을 때 각도가 튀지 않습니다.

## 파일

- `index.html`: 홈페이지 콘텐츠와 논문 링크
- `styles.css`: 레이아웃, 색상, 반응형 디자인
- `script.js`: 모바일 메뉴와 현재 섹션 표시
- `assets/papers/`: 원 논문에서 추출한 Figure 이미지
- `assets/brand/`: KIAS 공식 워드마크
- `profile.jpg`: 프로필 사진
- `cv_15.pdf`: 다운로드용 CV
- `favicon.svg`: polygon partition 모티프 아이콘

## 내용 수정

- 논문 정보와 링크: `index.html`의 `#publications`
- 대표 논문과 Figure: `index.html`의 `#work`, `assets/papers/`
- 향후 일정: `index.html`의 `#upcoming`
- 색상·글자 크기·여백: `styles.css` 상단의 `:root` 토큰
- 프로필 사진 크롭: `styles.css`의 `.hero-photo img`
- CV 교체: 새 PDF를 `cv_15.pdf`라는 이름으로 덮어쓰기

논문을 추가할 때는 기존 `article.featured-paper` 블록을 복사한 뒤 `accent-*` 클래스만 바꾸면 됩니다. 구분선과 번호는 CSS가 형제 선택자와 counter로 처리하므로 첫 항목을 따로 손볼 필요가 없습니다.

## GitHub Pages 배포

저장소가 이미 `https://github.com/sk7755/sk7755.github.io.git`에 연결되어 있다면 다음 명령으로 반영합니다.

```powershell
git add index.html styles.css favicon.svg README.md assets
git commit -m "Remodel academic homepage"
git push origin main
```

원격 저장소에 로컬에 없는 커밋이 있어 push가 거절되면 먼저 rebase합니다.

```powershell
git pull --rebase origin main
git push origin main
```

GitHub 저장소의 **Settings → Pages**에서 source를 `Deploy from a branch`, branch를 `main`, folder를 `/(root)`로 설정하면 `https://sk7755.github.io/`에 배포됩니다.
