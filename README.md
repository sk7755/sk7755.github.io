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
- Plane sweep: 단순 다각형의 vertical trapezoidal decomposition을 실시간으로 그리는 figure
- 연구 분야: computational geometry, algorithmic primitives for AI, AI-assisted algorithm design
- Upcoming: 향후 발표 일정과 행사 링크
- Selected papers: Largest Unit Rectangles를 첫 번째로 배치한 대표·최근 논문 4편
- Selected publications: 연구 흐름을 보여 주는 논문 6편
- 전체 경력과 출판 목록: `cv_15.pdf`

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

- Plane sweep figure: `script.js`의 `initSweep()`이 `<canvas>`에 직접 그립니다. 다각형은 `POLY` 배열 하나로 정의되며, 각 x에서의 내부 구간은 even-odd 규칙으로 정확히 계산합니다. 마우스를 올리거나 가로로 드래그하면 sweep line을 직접 움직일 수 있고, 손을 떼면 그 위치에서 자동 재생이 이어집니다.
- 스크롤 등장 효과: `data-reveal`이 붙은 요소를 IntersectionObserver가 관찰합니다.

세 가지 안전장치가 있습니다.

- `prefers-reduced-motion: reduce`이면 애니메이션을 멈추고 완성된 분할을 한 장면으로만 그립니다. 등장 효과도 끕니다.
- canvas가 화면 밖이거나 탭이 비활성이면 `requestAnimationFrame`을 멈춥니다.
- 등장 효과 CSS는 `<html class="js">`에서만 적용되므로, `script.js`가 실패해도 내용이 숨겨진 채로 남지 않습니다.

연구 분야 카드는 subgrid를 써서 번호·도형·제목·본문이 세 카드에서 같은 행에 놓입니다. 제목 줄 수가 달라도 어긋나지 않습니다.

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
