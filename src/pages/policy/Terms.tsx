import { Typography, Card } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";
import {useEffect} from "react";

const PolicyDetail = ({ title }: { title: string }) => {
    const { pathname } = useLocation();

    // 페이지 이동 시 항상 최상단으로 스크롤
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <div className="container mx-auto max-w-screen-md px-4 py-20">
            <Typography variant="h3" color="blue-gray" className="mb-2 font-bold text-center">
                {title}
            </Typography>
            <Typography color="gray" className="mb-12 text-center font-normal">
                Classic Mania 커뮤니티의 관련 규정을 안내해 드립니다.
            </Typography>

            <Card className="p-10 shadow-none border border-gray-100 rounded-none bg-white">
                <div className="space-y-10 text-sm leading-relaxed text-gray-700">
                    <section>
                        <Typography variant="h6" color="black" className="mb-4 font-bold">
                            제 1 조 (목적)
                        </Typography>
                        <p>
                            본 약관은 (주)뮤주키 파이어웍스가 운영하는 'Classic Mania' 커뮤니티 서비스의 이용조건 및 절차, 이용자와 당사 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                        </p>
                    </section>

                    <section>
                        <Typography variant="h6" color="black" className="mb-4 font-bold">
                            제 2 조 (용어의 정의)
                        </Typography>
                        <p>
                            1. "서비스"란 Classic Mania 사이트를 통해 제공되는 모든 게시판 및 커뮤니티 기능을 의미합니다.<br />
                            2. "회원"이란 본 약관에 동의하고 계정을 생성하여 서비스를 이용하는 사용자를 말합니다.
                        </p>
                    </section>

                    <section>
                        <Typography variant="h6" color="black" className="mb-4 font-bold">
                            제 3 조 (개인정보의 보호)
                        </Typography>
                        <p>
                            당사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 상세한 내용은 별도의 '개인정보처리방침'에 따릅니다.
                        </p>
                    </section>

                    <div className="pt-10 border-t border-gray-50 text-gray-400 text-xs">
                        공고일자: 2026년 1월 1일<br />
                        시행일자: 2026년 1월 1일
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PolicyDetail;