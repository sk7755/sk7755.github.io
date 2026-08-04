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

- 기본 소개·연구·경력·논문: `index.html`
- 색상·레이아웃·반응형 디자인: `styles.css`
- 모바일 메뉴·현재 섹션 표시: `script.js`
- 프로필 사진: `profile.jpg`
- 다운로드 CV: `cv_15.pdf`

직책은 날짜가 지나도 의미가 유지되도록 `Research Fellow 2025–2026`과 `AI Fellow from Sep 2026`으로 표기했습니다.

## 디자인 노트

논문 조판을 참조한 구조입니다. 페이지 전체가 하나의 그리드를 씁니다 — 왼쪽의 좁은 **rail**에 § 번호·연도·기간 같은 방주(marginalia)를 두고, 오른쪽 넓은 단에 본문을 둡니다. 박스·그림자·배경 패턴 대신 1px 괘선과 여백으로만 구분합니다.

`styles.css` 상단 `:root`의 토큰만 바꾸면 전체 톤이 따라옵니다.

| 토큰 | 용도 |
| --- | --- |
| `--paper`, `--paper-2` | 본문 배경, 띠 구간(논문·활동) 배경 |
| `--ink`, `--ink-2`, `--ink-3` | 제목 / 본문 / 보조 텍스트 |
| `--rule`, `--rule-2` | 얇은 괘선, 진한 괘선 |
| `--accent` | **링크와 강조된 도형에만** 사용. 여기만 바꾸면 색 인상이 통째로 바뀝니다 |
| `--rail-w`, `--rail-gap` | 방주 단 너비와 간격 |

- **서체**: 제목·산문은 Source Serif 4, UI·메타데이터는 Inter (Google Fonts). 본문 17px, 최소 라벨 12.8px으로 크기 대비를 좁혔습니다.
- **다크 모드**: `prefers-color-scheme: dark`에서 같은 토큰만 교체합니다.
- **인쇄**: 헤더·사진·푸터를 숨기고 흑백으로 조판합니다.
- **프로필 사진**: 원본을 자르지 않고 `.portrait img`의 `transform: scale()` + `transform-origin`으로 얼굴을 크롭합니다. 컬러로 되돌리려면 같은 규칙의 `filter: grayscale(1) …` 한 줄을 지우면 됩니다.

### 그림

장식이 아니라 실제로 계산한 도형입니다. 수치를 바꾸려면 다시 계산해야 합니다.

- **Fig. 1** — 직각다각형(reflex 정점 13개)을 서로 다른 모든 변 높이에서 잘라 얻은 **15개의 최대 수평 스트립**. skyline 높이 `[80,140,110,200,140,170,110,170,80,140,200,110,50,80]`에서 유도했습니다.
- **Fig. 2** — 질의점 `q = (150,122)`와 18개 점에 대한 &#8467;<sub>1</sub> 거리. 5번째 최근접 거리가 92, 6번째가 94이므로 반지름 92인 마름모가 **정확히 5개**를 담고 5번째 점 `(76,104)`는 경계 위에 놓입니다.
