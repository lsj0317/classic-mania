/** 시대(epoch) 한글 매핑 - 작곡가 시대 표시에 공통 사용 */
export const EPOCH_KO: Record<string, string> = {
    Medieval: '중세',
    Renaissance: '르네상스',
    Baroque: '바로크',
    Classical: '고전주의',
    'Early Romantic': '초기 낭만',
    Romantic: '낭만주의',
    'Late Romantic': '후기 낭만',
    '20th Century': '20세기',
    'Post-War': '전후',
    '21st Century': '21세기',
};

/** 날짜를 YYYYMMDD 형식 문자열로 변환 */
export const toYMD = (d: Date): string =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
