export interface ConductorEntry {
    searchName: string;   // AudioDB 검색용 영문 이름
    wikiTitle: string;    // Wikipedia 문서 제목
    nameKo: string;       // 한글 이름
    nationality: string;  // 국적 (한글)
}

const CONDUCTOR_POOL: ConductorEntry[] = [
    { searchName: "Herbert von Karajan", wikiTitle: "Herbert_von_Karajan", nameKo: "헤르베르트 폰 카라얀", nationality: "오스트리아" },
    { searchName: "Leonard Bernstein", wikiTitle: "Leonard_Bernstein", nameKo: "레너드 번스타인", nationality: "미국" },
    { searchName: "Claudio Abbado", wikiTitle: "Claudio_Abbado", nameKo: "클라우디오 아바도", nationality: "이탈리아" },
    { searchName: "Carlos Kleiber", wikiTitle: "Carlos_Kleiber", nameKo: "카를로스 클라이버", nationality: "오스트리아" },
    { searchName: "Simon Rattle", wikiTitle: "Simon_Rattle", nameKo: "사이먼 래틀", nationality: "영국" },
    { searchName: "Riccardo Muti", wikiTitle: "Riccardo_Muti", nameKo: "리카르도 무티", nationality: "이탈리아" },
    { searchName: "Gustavo Dudamel", wikiTitle: "Gustavo_Dudamel", nameKo: "구스타보 두다멜", nationality: "베네수엘라" },
    { searchName: "Andris Nelsons", wikiTitle: "Andris_Nelsons", nameKo: "안드리스 넬손스", nationality: "라트비아" },
    { searchName: "Myung-Whun Chung", wikiTitle: "Chung_Myung-whun", nameKo: "정명훈", nationality: "대한민국" },
    { searchName: "Valery Gergiev", wikiTitle: "Valery_Gergiev", nameKo: "발레리 게르기예프", nationality: "러시아" },
    { searchName: "Zubin Mehta", wikiTitle: "Zubin_Mehta", nameKo: "주빈 메타", nationality: "인도" },
    { searchName: "Daniel Barenboim", wikiTitle: "Daniel_Barenboim", nameKo: "다니엘 바렌보임", nationality: "아르헨티나" },
    { searchName: "Mariss Jansons", wikiTitle: "Mariss_Jansons", nameKo: "마리스 얀손스", nationality: "라트비아" },
    { searchName: "Christian Thielemann", wikiTitle: "Christian_Thielemann", nameKo: "크리스티안 틸레만", nationality: "독일" },
    { searchName: "Esa-Pekka Salonen", wikiTitle: "Esa-Pekka_Salonen", nameKo: "에사페카 살로넨", nationality: "핀란드" },
    { searchName: "Han-Na Chang", wikiTitle: "Han-Na_Chang", nameKo: "장한나", nationality: "대한민국" },
    { searchName: "Yannick Nezet-Seguin", wikiTitle: "Yannick_Nézet-Séguin", nameKo: "야닉 네제세갱", nationality: "캐나다" },
    { searchName: "Klaus Makela", wikiTitle: "Klaus_Mäkelä", nameKo: "클라우스 마켈라", nationality: "핀란드" },
];

export function getAllConductors(): ConductorEntry[] {
    return CONDUCTOR_POOL;
}
