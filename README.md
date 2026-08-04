# Jaehoon Chung — Academic Homepage

계산기하 및 Algorithms for AI 연구를 소개하는 zero-build 정적 홈페이지입니다. 외부 프레임워크나 패키지 없이 GitHub Pages에서 바로 동작합니다.

## 로컬 미리보기

프로젝트 폴더에서 아래 명령을 실행한 뒤 `http://localhost:8000`을 엽니다.

```powershell
python -m http.server 8000
```

또는 `index.html`을 브라우저에서 직접 열어도 기본 화면을 확인할 수 있습니다.

## GitHub Pages 배포

개인 루트 주소 `https://sk7755.github.io/`를 사용하려면 저장소 이름을 정확히 `sk7755.github.io`로 만듭니다.

GitHub에서 README나 라이선스를 추가하지 않은 빈 `sk7755.github.io` 저장소를 만든 뒤, 이 폴더에서 실행합니다.

```powershell
git init
git branch -M main
git add .
git commit -m "Build academic homepage"
git remote add origin https://github.com/sk7755/sk7755.github.io.git
git push -u origin main
```

그다음 GitHub 저장소에서 다음을 설정합니다.

1. **Settings → Pages**로 이동합니다.
2. **Deploy from a branch**, `main`, `/(root)`를 선택합니다.
3. **Save**를 누르고 배포가 완료될 때까지 기다립니다.

프로젝트 저장소 이름을 `jaehoon-homepage`로 유지하면 주소는 보통 `https://sk7755.github.io/jaehoon-homepage/`가 됩니다. 모든 내부 자산은 상대경로라 두 방식 모두 지원합니다.

## 콘텐츠 관리

- 소개·연구·논문·강연: `index.html`
- 색상·레이아웃·반응형 디자인: `styles.css`
- 모바일 메뉴·현재 섹션 표시: `script.js`
- 프로필 사진: `profile.jpg`
- 다운로드 CV: `cv_15.pdf`

## 범위 — 홈페이지에 넣지 않은 것

Har-Peled, Mulzer, Timothy Chan, Da Wei Zheng, Hee-Kap Ahn 등 실제 계산기하 연구자 홈페이지의 공통 관례를 따랐습니다. 홈페이지는 **CV의 축약본이 아니라 진입점**입니다.

| 넣은 것 | 뺀 것 (→ CV / dblp) |
| --- | --- |
| 직위 2줄 + 학위·지도교수 2문장 | 연구 소개 산문, 자기소개 문단 |
| 연구 관심사 불릿 3줄 | 주제별 카드·다이어그램 |
| 논문 (저널/학회 구분, 전체 6편) | — |
| 최근 강연 3건 | 학력 연표, 재직 연표 |
| 이메일·CV·dblp·ORCID·GitHub | 심사 활동, 연구과제 목록, 별도 Contact 섹션 |

기준: **CV에서 검색하면 되는 항목은 홈페이지에 두지 않는다.** 학력·재직 이력은 소개 두 문장에 녹였고(`POSTECH 2025, advised by Hee-Kap Ahn` / `AI Fellow from Sep 2026`), 나머지는 `cv_15.pdf`와 dblp 링크가 대신합니다.

## 디자인 노트

전체가 하나의 그리드입니다 — 왼쪽 좁은 **rail**에 연도·날짜, 오른쪽에 본문. 박스·그림자·배경 패턴 없이 1px 괘선만 씁니다.

`styles.css` 상단 `:root`의 토큰만 바꾸면 전체 톤이 따라옵니다.

| 토큰 | 용도 |
| --- | --- |
| `--paper`, `--surface` | 본문 배경, 사진 프레임 배경 |
| `--ink`, `--ink-2`, `--ink-3` | 제목 / 본문 / 보조 텍스트 |
| `--rule`, `--rule-2` | 얇은 괘선, 진한 괘선 |
| `--accent` | **링크와 강조된 도형에만** 사용. 여기만 바꾸면 색 인상이 통째로 바뀝니다 |
| `--rail-w`, `--rail-gap` | 연도 단 너비와 간격 |

- **서체**: 제목은 Source Serif 4, 본문·메타데이터는 Inter (Google Fonts). 본문 17px, 최소 라벨 11.8px.
- **다크 모드**: `prefers-color-scheme: dark`에서 같은 토큰만 교체합니다.
- **인쇄**: 헤더·사진·도형을 숨기고 흑백으로 조판합니다.
- **프로필 사진**: 폭 150px(모바일 118px). 원본 파일은 그대로 두고 `.portrait img`의 `transform: scale(2.4)` + `transform-origin: 0% 11%`로 얼굴만 잘라냅니다. 더 작게 하려면 `.portrait`의 `width`, 덜 확대하려면 `scale()` 값을 낮추세요. 컬러로 되돌리려면 같은 규칙의 `filter: grayscale(1) …` 줄을 지우면 됩니다.
- **도형**: `#research`의 SVG 하나뿐입니다. 장식이 아니라 계산된 도형입니다 — 질의점 `q = (150,122)`와 18개 점의 &#8467;<sub>1</sub> 거리에서 5번째 최근접이 92, 6번째가 94이므로 반지름 92인 마름모가 **정확히 5개**를 담고 5번째 점 `(76,104)`는 경계 위에 놓입니다. 빼려면 `<figure class="plate">` 블록을 지우면 됩니다.
