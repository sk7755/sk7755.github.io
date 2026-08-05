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
- 연구 분야: polygon partitioning, geometric approximation, geometric data structures
- Selected papers: 원 논문의 Figure를 사용한 대표 논문 3편
- Selected publications: 연구 흐름을 보여 주는 논문 6편
- 전체 경력과 출판 목록: `cv_15.pdf`와 DBLP 링크

홈페이지에는 CV 전체를 옮기지 않습니다. 수상, 특허, 교육 이력, 프로젝트 목록 등은 CV에만 유지합니다.

## 디자인

SWAT 2026, ISAAC 2025, FSTTCS 2022 논문의 Figure를 원본 비율로 사용합니다. 임의로 재구성한 연구 도식은 넣지 않았습니다.

- vertical trapezoidal decomposition과 strip partition
- windmill polygon의 guillotine / non-guillotine partition
- inscribed / circumscribed histogon의 다섯 변형

색상은 의미에 따라 일관되게 사용합니다.

| 토큰 | 용도 |
| --- | --- |
| `--paper`, `--surface` | 종이색 배경과 figure 패널 |
| `--ink` | 다각형 경계와 본문 |
| `--teal` | feasible region과 주요 링크 |
| `--blue` | 보조 조각과 방향 정보 |
| `--coral` | cut과 contact point |
| `--ochre` | 선택된 해와 길이 표기 |

자동 dark mode는 사용하지 않습니다. 사진도 흑백 필터 없이 원본 색상을 사용합니다.

## 파일

- `index.html`: 홈페이지 콘텐츠와 논문 링크
- `styles.css`: 레이아웃, 색상, 반응형 디자인
- `script.js`: 모바일 메뉴와 현재 섹션 표시
- `assets/papers/`: 원 논문에서 추출한 Figure 이미지
- `profile.jpg`: 프로필 사진
- `cv_15.pdf`: 다운로드용 CV
- `favicon.svg`: polygon partition 모티프 아이콘

## 내용 수정

- 논문 정보와 링크: `index.html`의 `#publications`
- 대표 논문과 Figure: `index.html`의 `#work`, `assets/papers/`
- 색상과 크기: `styles.css` 상단의 `:root`
- 프로필 사진 크롭: `styles.css`의 `.hero-photo img`
- CV 교체: 새 PDF를 `cv_15.pdf`라는 이름으로 덮어쓰기

## GitHub Pages 배포

저장소가 이미 `https://github.com/sk7755/sk7755.github.io.git`에 연결되어 있다면 다음 명령으로 반영합니다.

```powershell
git add index.html styles.css favicon.svg README.md assets/papers
git commit -m "Remodel academic homepage"
git push origin main
```

원격 저장소에 로컬에 없는 커밋이 있어 push가 거절되면 먼저 rebase합니다.

```powershell
git pull --rebase origin main
git push origin main
```

GitHub 저장소의 **Settings → Pages**에서 source를 `Deploy from a branch`, branch를 `main`, folder를 `/(root)`로 설정하면 `https://sk7755.github.io/`에 배포됩니다.
