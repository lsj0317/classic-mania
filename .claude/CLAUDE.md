# Tech Stack (Current)
- **Core:** React 18, TypeScript, Vite
- **Routing:** React Router DOM v6
- **State:** Zustand (Store-based)
- **UI & Icons:** Material Tailwind, Tailwind CSS, Lucide-react, Heroicons
- **Charts:** Recharts (Data viz)
- **Network:** Axios
- **Misc:** React-daum-postcode (Address search)

# Technical Preferences
- Use Tailwind utility classes over inline styles.
- Prefer Lucide-react for iconography.
- Implement responsive design compatible with Material Tailwind.
- Keep Zustand stores modular and typesafe.

# Slash Commands Guide
- `/clear` — 새로운 작업을 시작할 때 사용. 이전 컨텍스트를 초기화하여 토큰 낭비를 방지한다.
- `/compact` — 대화가 길어질 경우 사용. 이전 대화 내용을 요약·압축하여 컨텍스트 윈도우를 확보한다.

> **Tip:** 작업 전환 시 `/clear`, 동일 작업이 길어지면 `/compact`를 습관적으로 사용할 것.

# Rules
- 세부 가이드 및 코딩 룰은 `.claude/rules/` 하위 파일로 분리하여 관리한다.
