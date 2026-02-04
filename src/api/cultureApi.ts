import axios from 'axios';
import { parseStringPromise } from "xml2js";

const API_KEY = import.meta.env.VITE_CULTURE_API_KEY;
const BASE_URL = 'http://www.culture.go.kr/openapi/rest/publicperformancedisplays/realm';

export const fetchCulturePerformances = async (pageNo = 1, rows = 20) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                serviceKey: API_KEY,
                realmCode: 'A000', // 클래식/오페라 영역 코드 [cite: 2026-02-04]
                cPage: pageNo,
                rows: rows,
            },
        });

        // XML 데이터를 JSON으로 변환합니다. [cite: 2026-02-04]
        const result = await parseStringPromise(response.data);
        const items = result.response.msgBody[0].perforList;

        // 우리 프로젝트의 Performance 타입에 맞게 매핑합니다. [cite: 2026-01-21]
        return items.map((item: any) => ({
            id: Number(item.seq[0]),
            title: item.title[0],
            place: item.place[0],
            period: `${item.startDate[0]} ~ ${item.endDate[0]}`,
            area: item.area[0],
            poster: item.thumbnail[0],
            status: "예매중", // API 응답에 따라 가공 가능 [cite: 2026-02-04]
            lat: 37.5665, // 목록 API에는 좌표가 없으므로 상세조회 시 추가 필요 [cite: 2026-01-25]
            lng: 126.9780,
        }));
    } catch (error) {
        console.error("API 호출 중 에러 발생:", error);
        return [];
    }
};