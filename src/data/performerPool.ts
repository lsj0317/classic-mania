export interface PerformerEntry {
    searchName: string;   // AudioDB 검색용 영문 이름
    wikiTitle: string;    // Wikipedia 문서 제목
    nameKo: string;       // 한글 이름
    role: string;         // 역할 (한글)
    roleEn: string;       // 역할 (영문)
    nationality: string;  // 국적 (한글)
}

const PERFORMER_POOL: PerformerEntry[] = [
    // 피아니스트
    { searchName: "Lang Lang", wikiTitle: "Lang_Lang", nameKo: "랑랑", role: "피아니스트", roleEn: "Pianist", nationality: "중국" },
    { searchName: "Yuja Wang", wikiTitle: "Yuja_Wang", nameKo: "유자 왕", role: "피아니스트", roleEn: "Pianist", nationality: "중국" },
    { searchName: "Seong-Jin Cho", wikiTitle: "Cho_Seong-jin", nameKo: "조성진", role: "피아니스트", roleEn: "Pianist", nationality: "대한민국" },
    { searchName: "Yunchan Lim", wikiTitle: "Lim_Yunchan", nameKo: "임윤찬", role: "피아니스트", roleEn: "Pianist", nationality: "대한민국" },
    { searchName: "Daniil Trifonov", wikiTitle: "Daniil_Trifonov", nameKo: "다닐 트리포노프", role: "피아니스트", roleEn: "Pianist", nationality: "러시아" },
    { searchName: "Martha Argerich", wikiTitle: "Martha_Argerich", nameKo: "마르타 아르헤리치", role: "피아니스트", roleEn: "Pianist", nationality: "아르헨티나" },
    { searchName: "Yeol Eum Son", wikiTitle: "Son_Yeol-eum", nameKo: "손열음", role: "피아니스트", roleEn: "Pianist", nationality: "대한민국" },
    // 바이올리니스트
    { searchName: "Hilary Hahn", wikiTitle: "Hilary_Hahn", nameKo: "힐러리 한", role: "바이올리니스트", roleEn: "Violinist", nationality: "미국" },
    { searchName: "Anne-Sophie Mutter", wikiTitle: "Anne-Sophie_Mutter", nameKo: "안네소피 무터", role: "바이올리니스트", roleEn: "Violinist", nationality: "독일" },
    { searchName: "Maxim Vengerov", wikiTitle: "Maxim_Vengerov", nameKo: "막심 벤게로프", role: "바이올리니스트", roleEn: "Violinist", nationality: "러시아" },
    { searchName: "Janine Jansen", wikiTitle: "Janine_Jansen", nameKo: "야닌 얀센", role: "바이올리니스트", roleEn: "Violinist", nationality: "네덜란드" },
    { searchName: "Kyung-Wha Chung", wikiTitle: "Kyung-Wha_Chung", nameKo: "정경화", role: "바이올리니스트", roleEn: "Violinist", nationality: "대한민국" },
    { searchName: "Bomsori Kim", wikiTitle: "Bomsori_Kim", nameKo: "김봄소리", role: "바이올리니스트", roleEn: "Violinist", nationality: "대한민국" },
    // 첼리스트
    { searchName: "Yo-Yo Ma", wikiTitle: "Yo-Yo_Ma", nameKo: "요요 마", role: "첼리스트", roleEn: "Cellist", nationality: "미국" },
    { searchName: "Mischa Maisky", wikiTitle: "Mischa_Maisky", nameKo: "미샤 마이스키", role: "첼리스트", roleEn: "Cellist", nationality: "이스라엘" },
    // 소프라노/성악
    { searchName: "Anna Netrebko", wikiTitle: "Anna_Netrebko", nameKo: "안나 네트렙코", role: "소프라노", roleEn: "Soprano", nationality: "러시아" },
    { searchName: "Placido Domingo", wikiTitle: "Plácido_Domingo", nameKo: "플라시도 도밍고", role: "테너", roleEn: "Tenor", nationality: "스페인" },
    { searchName: "Sunwook Kim", wikiTitle: "Sunwook_Kim", nameKo: "김선욱", role: "피아니스트", roleEn: "Pianist", nationality: "대한민국" },
];

export function getAllPerformers(): PerformerEntry[] {
    return PERFORMER_POOL;
}
