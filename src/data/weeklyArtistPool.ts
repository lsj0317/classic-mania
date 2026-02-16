export interface WeeklyArtistEntry {
    searchName: string;   // AudioDB 검색용 영문 이름
    wikiTitle: string;    // Wikipedia 문서 제목
    nameKo: string;       // 한글 이름
    role: string;         // 역할 (한글)
    roleEn: string;       // 역할 (영문)
    nationality: string;  // 국적 (한글)
}

const ARTIST_POOL: WeeklyArtistEntry[] = [
    // 국내
    { searchName: "Seong-Jin Cho", wikiTitle: "Cho_Seong-jin", nameKo: "조성진", role: "피아니스트", roleEn: "Pianist", nationality: "대한민국" },
    { searchName: "Yunchan Lim", wikiTitle: "Lim_Yunchan", nameKo: "임윤찬", role: "피아니스트", roleEn: "Pianist", nationality: "대한민국" },
    { searchName: "Yeol Eum Son", wikiTitle: "Son_Yeol-eum", nameKo: "손열음", role: "피아니스트", roleEn: "Pianist", nationality: "대한민국" },
    { searchName: "Myung-Whun Chung", wikiTitle: "Chung_Myung-whun", nameKo: "정명훈", role: "지휘자", roleEn: "Conductor", nationality: "대한민국" },
    { searchName: "Kyung-Wha Chung", wikiTitle: "Kyung-Wha_Chung", nameKo: "정경화", role: "바이올리니스트", roleEn: "Violinist", nationality: "대한민국" },
    { searchName: "Han-Na Chang", wikiTitle: "Han-Na_Chang", nameKo: "장한나", role: "첼리스트 / 지휘자", roleEn: "Cellist / Conductor", nationality: "대한민국" },
    { searchName: "Sunwook Kim", wikiTitle: "Sunwook_Kim", nameKo: "김선욱", role: "피아니스트", roleEn: "Pianist", nationality: "대한민국" },
    { searchName: "Bomsori Kim", wikiTitle: "Bomsori_Kim", nameKo: "김봄소리", role: "바이올리니스트", roleEn: "Violinist", nationality: "대한민국" },
    { searchName: "InMo Yang", wikiTitle: "", nameKo: "양인모", role: "바이올리니스트", roleEn: "Violinist", nationality: "대한민국" },
    // 해외
    { searchName: "Lang Lang", wikiTitle: "Lang_Lang", nameKo: "랑랑", role: "피아니스트", roleEn: "Pianist", nationality: "중국" },
    { searchName: "Yuja Wang", wikiTitle: "Yuja_Wang", nameKo: "유자 왕", role: "피아니스트", roleEn: "Pianist", nationality: "중국" },
    { searchName: "Hilary Hahn", wikiTitle: "Hilary_Hahn", nameKo: "힐러리 한", role: "바이올리니스트", roleEn: "Violinist", nationality: "미국" },
    { searchName: "Gustavo Dudamel", wikiTitle: "Gustavo_Dudamel", nameKo: "두다멜", role: "지휘자", roleEn: "Conductor", nationality: "베네수엘라" },
    { searchName: "Anne-Sophie Mutter", wikiTitle: "Anne-Sophie_Mutter", nameKo: "무터", role: "바이올리니스트", roleEn: "Violinist", nationality: "독일" },
    { searchName: "Daniil Trifonov", wikiTitle: "Daniil_Trifonov", nameKo: "트리포노프", role: "피아니스트", roleEn: "Pianist", nationality: "러시아" },
    { searchName: "Yo-Yo Ma", wikiTitle: "Yo-Yo_Ma", nameKo: "요요 마", role: "첼리스트", roleEn: "Cellist", nationality: "미국" },
    { searchName: "Andris Nelsons", wikiTitle: "Andris_Nelsons", nameKo: "넬손스", role: "지휘자", roleEn: "Conductor", nationality: "라트비아" },
    { searchName: "Martha Argerich", wikiTitle: "Martha_Argerich", nameKo: "아르헤리치", role: "피아니스트", roleEn: "Pianist", nationality: "아르헨티나" },
    { searchName: "Janine Jansen", wikiTitle: "Janine_Jansen", nameKo: "얀센", role: "바이올리니스트", roleEn: "Violinist", nationality: "네덜란드" },
    { searchName: "Maxim Vengerov", wikiTitle: "Maxim_Vengerov", nameKo: "벤게로프", role: "바이올리니스트", roleEn: "Violinist", nationality: "러시아" },
];

/**
 * 주차 번호 기반으로 결정론적으로 4명의 아티스트를 선택한다.
 * 매주 월요일 00:00 UTC 기준으로 로테이션된다.
 */
export function getWeeklyArtists(now = new Date()): WeeklyArtistEntry[] {
    // 2026-01-05 (월요일) 기준 epoch
    const epoch = new Date('2026-01-05T00:00:00Z').getTime();
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weekNumber = Math.floor((now.getTime() - epoch) / msPerWeek);

    const poolSize = ARTIST_POOL.length;
    const startIndex = (weekNumber * 4) % poolSize;

    const selected: WeeklyArtistEntry[] = [];
    for (let i = 0; i < 4; i++) {
        selected.push(ARTIST_POOL[(startIndex + i) % poolSize]);
    }
    return selected;
}
