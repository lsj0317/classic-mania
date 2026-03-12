const ko = {
    // Navigation
    nav: {
        home: "홈",
        board: "게시판",
        performance: "공연정보",
        artist: "아티스트",
        ticket: "티켓정보",
        news: "뉴스",
        showAndTicket: "공연관람/예매",
        artistAndNews: "클래식라운지",
        learn: "학습허브",
        column: "칼럼",
        venue: "공연장 가이드",
        album: "음반 리뷰",
        contentHub: "콘텐츠",
        // 네비바 그룹명
        performanceGroup: "공연",
        communityGroup: "커뮤니티",
        artistGroup: "아티스트",
        infoGroup: "정보",
        // 커뮤니티 하위 메뉴
        companion: "동행 구하기",
        meetup: "소모임 & 이벤트",
        ticketTrade: "티켓 중고거래",
        // 공연 하위 메뉴
        calendar: "공연 캘린더",
        ticketInfo: "티켓 정보",
    },

    // Header & Auth
    auth: {
        login: "로그인",
        logout: "로그아웃",
        mypage: "마이페이지",
        welcome: "안녕하세요",
        honorific: "님",
    },

    // Side Menu
    sideMenu: {
        title: "Menu",
    },

    // Home
    home: {
        heroTitle1: "음악으로 하나되는 공간,",
        heroTitle2: "클래식 매니아 커뮤니티",
        getStarted: "시작하기",
        latestNews: "최신 소식",
        popularPosts: "인기 게시글",
        more: "더보기 +",
        views: "조회",
        // Carousel
        carouselEvent: "이벤트",
        carouselPerformance: "공연정보",
        // Tabs
        tabAll: "전체",
        tabPerformance: "공연",
        tabCommunity: "커뮤니티",
        tabArtist: "아티스트",
        // Two-column
        boardPopular: "게시판 인기게시글",
        monthlyPerformance: "이달의 공연정보",
        morePerformance: "공연정보 더보기",
        // Artist of the week
        artistOfTheWeek: "금주의 아티스트",
        moreArtist: "더보기",
        // New posts
        newPosts: "새로운 게시글",
    },

    // Footer
    footer: {
        companyInfo:
            "클래식매니아 (Classic Mania)\n경기도 오산시 원동로 00번길 00\n대표: 이서준 | Tel: 031-000-0000\nEmail: mujuki@classicmania.com",
        latestNews: "최신 소식",
        popularPosts: "인기 게시글",
        newPosts: "새로운 게시글",
        terms: "이용약관",
        privacy: "개인정보처리방침",
    },

    // Bottom Nav
    bottomNav: {
        home: "홈",
        board: "게시판",
        performance: "공연정보",
        my: "마이",
    },

    // Language
    language: {
        label: "언어",
        ko: "한국어",
        en: "English",
    },
};

export type Translations = typeof ko;
export default ko;
