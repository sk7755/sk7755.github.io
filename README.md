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
