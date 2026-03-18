import type { OpenOpusComposer, OpenOpusWork } from '../types';

/**
 * OpenOpus API 중단으로 인한 로컬 더미 데이터
 * 모든 12개월, 주요 시대(epoch)를 커버하도록 선정
 * portrait URL은 OpenOpus 서버 중단으로 빈 문자열 처리
 */
export const fallbackComposers: OpenOpusComposer[] = [
    // 1월
    { id: '145', name: 'Scriabin', complete_name: 'Alexander Scriabin', birth: '1872-01-06', death: '1915-04-27', epoch: 'Late Romantic', portrait: '' },
    { id: '196', name: 'Mozart', complete_name: 'Wolfgang Amadeus Mozart', birth: '1756-01-27', death: '1791-12-05', epoch: 'Classical', portrait: '' },
    { id: '102', name: 'Schubert', complete_name: 'Franz Schubert', birth: '1797-01-31', death: '1828-11-19', epoch: 'Early Romantic', portrait: '' },
    // 2월
    { id: '87', name: 'Mendelssohn', complete_name: 'Felix Mendelssohn', birth: '1809-02-03', death: '1847-11-04', epoch: 'Early Romantic', portrait: '' },
    { id: '180', name: 'Chopin', complete_name: 'Frédéric Chopin', birth: '1810-02-22', death: '1849-10-17', epoch: 'Romantic', portrait: '' },
    { id: '148', name: 'Handel', complete_name: 'George Frideric Handel', birth: '1685-02-23', death: '1759-04-14', epoch: 'Baroque', portrait: '' },
    { id: '200', name: 'Rossini', complete_name: 'Gioachino Rossini', birth: '1792-02-29', death: '1868-11-13', epoch: 'Romantic', portrait: '' },
    // 3월
    { id: '2', name: 'Bach', complete_name: 'Johann Sebastian Bach', birth: '1685-03-21', death: '1750-07-28', epoch: 'Baroque', portrait: '' },
    { id: '183', name: 'Mussorgsky', complete_name: 'Modest Mussorgsky', birth: '1839-03-21', death: '1881-03-28', epoch: 'Romantic', portrait: '' },
    { id: '210', name: 'Bartók', complete_name: 'Béla Bartók', birth: '1881-03-25', death: '1945-09-26', epoch: '20th Century', portrait: '' },
    { id: '177', name: 'Ravel', complete_name: 'Maurice Ravel', birth: '1875-03-07', death: '1937-12-28', epoch: '20th Century', portrait: '' },
    { id: '199', name: 'Vivaldi', complete_name: 'Antonio Vivaldi', birth: '1678-03-04', death: '1741-07-28', epoch: 'Baroque', portrait: '' },
    { id: '211', name: 'Rimsky-Korsakov', complete_name: 'Nikolai Rimsky-Korsakov', birth: '1844-03-18', death: '1908-06-21', epoch: 'Romantic', portrait: '' },
    // 4월
    { id: '55', name: 'Prokofiev', complete_name: 'Sergei Prokofiev', birth: '1891-04-23', death: '1953-03-05', epoch: '20th Century', portrait: '' },
    { id: '176', name: 'Rachmaninoff', complete_name: 'Sergei Rachmaninoff', birth: '1873-04-01', death: '1943-03-28', epoch: 'Late Romantic', portrait: '' },
    // 5월
    { id: '3', name: 'Brahms', complete_name: 'Johannes Brahms', birth: '1833-05-07', death: '1897-04-03', epoch: 'Romantic', portrait: '' },
    { id: '186', name: 'Tchaikovsky', complete_name: 'Pyotr Ilyich Tchaikovsky', birth: '1840-05-07', death: '1893-11-06', epoch: 'Romantic', portrait: '' },
    { id: '187', name: 'Wagner', complete_name: 'Richard Wagner', birth: '1813-05-22', death: '1883-02-13', epoch: 'Romantic', portrait: '' },
    { id: '203', name: 'Satie', complete_name: 'Erik Satie', birth: '1866-05-17', death: '1925-07-01', epoch: '20th Century', portrait: '' },
    // 6월
    { id: '143', name: 'Strauss', complete_name: 'Richard Strauss', birth: '1864-06-11', death: '1949-09-08', epoch: 'Late Romantic', portrait: '' },
    { id: '144', name: 'Stravinsky', complete_name: 'Igor Stravinsky', birth: '1882-06-17', death: '1971-04-06', epoch: '20th Century', portrait: '' },
    { id: '142', name: 'Schumann', complete_name: 'Robert Schumann', birth: '1810-06-08', death: '1856-07-29', epoch: 'Romantic', portrait: '' },
    { id: '215', name: 'Elgar', complete_name: 'Edward Elgar', birth: '1857-06-02', death: '1934-02-23', epoch: 'Late Romantic', portrait: '' },
    // 7월
    { id: '181', name: 'Mahler', complete_name: 'Gustav Mahler', birth: '1860-07-07', death: '1911-05-18', epoch: 'Late Romantic', portrait: '' },
    { id: '216', name: 'Gluck', complete_name: 'Christoph Willibald Gluck', birth: '1714-07-02', death: '1787-11-15', epoch: 'Classical', portrait: '' },
    // 8월
    { id: '1', name: 'Debussy', complete_name: 'Claude Debussy', birth: '1862-08-22', death: '1918-03-25', epoch: 'Late Romantic', portrait: '' },
    { id: '182', name: 'Bruckner', complete_name: 'Anton Bruckner', birth: '1824-08-04', death: '1896-10-11', epoch: 'Romantic', portrait: '' },
    // 9월
    { id: '4', name: 'Dvořák', complete_name: 'Antonín Dvořák', birth: '1841-09-08', death: '1904-05-01', epoch: 'Romantic', portrait: '' },
    { id: '204', name: 'Bruch', complete_name: 'Max Bruch', birth: '1838-01-06', death: '1920-10-02', epoch: 'Romantic', portrait: '' },
    { id: '188', name: 'Holst', complete_name: 'Gustav Holst', birth: '1874-09-21', death: '1934-05-25', epoch: '20th Century', portrait: '' },
    // 10월
    { id: '5', name: 'Liszt', complete_name: 'Franz Liszt', birth: '1811-10-22', death: '1886-07-31', epoch: 'Romantic', portrait: '' },
    { id: '178', name: 'Verdi', complete_name: 'Giuseppe Verdi', birth: '1813-10-10', death: '1901-01-27', epoch: 'Romantic', portrait: '' },
    { id: '206', name: 'Saint-Saëns', complete_name: 'Camille Saint-Saëns', birth: '1835-10-09', death: '1921-12-16', epoch: 'Romantic', portrait: '' },
    { id: '213', name: 'Paganini', complete_name: 'Niccolò Paganini', birth: '1782-10-27', death: '1840-05-27', epoch: 'Romantic', portrait: '' },
    // 11월
    { id: '198', name: 'Borodin', complete_name: 'Alexander Borodin', birth: '1833-11-12', death: '1887-02-27', epoch: 'Romantic', portrait: '' },
    { id: '208', name: 'Copland', complete_name: 'Aaron Copland', birth: '1900-11-14', death: '1990-12-02', epoch: '20th Century', portrait: '' },
    // 12월
    { id: '6', name: 'Beethoven', complete_name: 'Ludwig van Beethoven', birth: '1770-12-16', death: '1827-03-26', epoch: 'Classical', portrait: '' },
    { id: '184', name: 'Sibelius', complete_name: 'Jean Sibelius', birth: '1865-12-08', death: '1957-09-20', epoch: 'Late Romantic', portrait: '' },
    { id: '185', name: 'Puccini', complete_name: 'Giacomo Puccini', birth: '1858-12-22', death: '1924-11-29', epoch: 'Romantic', portrait: '' },
    { id: '197', name: 'Berlioz', complete_name: 'Hector Berlioz', birth: '1803-12-11', death: '1869-03-08', epoch: 'Romantic', portrait: '' },

    // 추가 작곡가 (시대별 커버리지 확대)
    // Baroque
    { id: '220', name: 'Telemann', complete_name: 'Georg Philipp Telemann', birth: '1681-03-14', death: '1767-06-25', epoch: 'Baroque', portrait: '' },
    { id: '221', name: 'Purcell', complete_name: 'Henry Purcell', birth: '1659-09-10', death: '1695-11-21', epoch: 'Baroque', portrait: '' },
    { id: '222', name: 'Corelli', complete_name: 'Arcangelo Corelli', birth: '1653-02-17', death: '1713-01-08', epoch: 'Baroque', portrait: '' },
    { id: '223', name: 'Scarlatti', complete_name: 'Domenico Scarlatti', birth: '1685-10-26', death: '1757-07-23', epoch: 'Baroque', portrait: '' },
    { id: '224', name: 'Monteverdi', complete_name: 'Claudio Monteverdi', birth: '1567-05-15', death: '1643-11-29', epoch: 'Baroque', portrait: '' },
    // Classical
    { id: '225', name: 'Haydn', complete_name: 'Joseph Haydn', birth: '1732-03-31', death: '1809-05-31', epoch: 'Classical', portrait: '' },
    // Early Romantic
    { id: '226', name: 'Weber', complete_name: 'Carl Maria von Weber', birth: '1786-11-18', death: '1826-06-05', epoch: 'Early Romantic', portrait: '' },
    // Late Romantic
    { id: '227', name: 'Grieg', complete_name: 'Edvard Grieg', birth: '1843-06-15', death: '1907-09-04', epoch: 'Late Romantic', portrait: '' },
    { id: '228', name: 'Fauré', complete_name: 'Gabriel Fauré', birth: '1845-05-12', death: '1924-11-04', epoch: 'Late Romantic', portrait: '' },
    // Post-War
    { id: '229', name: 'Cage', complete_name: 'John Cage', birth: '1912-09-05', death: '1992-08-12', epoch: 'Post-War', portrait: '' },
    { id: '230', name: 'Ligeti', complete_name: 'György Ligeti', birth: '1923-05-28', death: '2006-06-12', epoch: 'Post-War', portrait: '' },
    { id: '231', name: 'Boulez', complete_name: 'Pierre Boulez', birth: '1925-03-26', death: '2016-01-05', epoch: 'Post-War', portrait: '' },
    { id: '232', name: 'Stockhausen', complete_name: 'Karlheinz Stockhausen', birth: '1928-08-22', death: '2007-12-05', epoch: 'Post-War', portrait: '' },
    // 21st Century
    { id: '233', name: 'Glass', complete_name: 'Philip Glass', birth: '1937-01-31', death: '', epoch: '21st Century', portrait: '' },
    { id: '234', name: 'Pärt', complete_name: 'Arvo Pärt', birth: '1935-09-11', death: '', epoch: '21st Century', portrait: '' },
    { id: '235', name: 'Adams', complete_name: 'John Adams', birth: '1947-02-15', death: '', epoch: '21st Century', portrait: '' },
    { id: '236', name: 'Reich', complete_name: 'Steve Reich', birth: '1936-10-03', death: '', epoch: '21st Century', portrait: '' },
];

/** 인기 작곡가 ID 목록 (상위 23명) */
const POPULAR_IDS = new Set([
    '6', '196', '2', '180', '3', '186', '1', '4', '5', '87',
    '102', '199', '148', '176', '55', '144', '181', '187',
    '142', '143', '177', '185', '210',
]);

/** 추천 작곡가 ID 목록 */
const ESSENTIAL_IDS = new Set([
    ...POPULAR_IDS,
    '145', '200', '183', '211', '203', '215', '216', '182',
    '204', '188', '178', '206', '213', '198', '208', '184',
    '197', '220', '221', '222', '223', '224', '225', '226',
    '227', '228',
]);

/** 인기 작곡가 목록 */
export const getPopularComposers = (): OpenOpusComposer[] =>
    fallbackComposers.filter(c => POPULAR_IDS.has(c.id));

/** 추천 작곡가 목록 */
export const getEssentialComposers = (): OpenOpusComposer[] =>
    fallbackComposers.filter(c => ESSENTIAL_IDS.has(c.id));

/** 시대별 작곡가 목록 */
export const getComposersByEpoch = (epoch: string): OpenOpusComposer[] =>
    fallbackComposers.filter(c => c.epoch === epoch);

/** 작곡가 이름 검색 */
export const searchComposersLocal = (query: string): OpenOpusComposer[] => {
    const q = query.toLowerCase();
    return fallbackComposers.filter(c =>
        c.complete_name.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
};

/** ID로 작곡가 조회 */
export const getComposersByIds = (ids: string[]): OpenOpusComposer[] => {
    const idSet = new Set(ids);
    return fallbackComposers.filter(c => idSet.has(c.id));
};

/** 이름 첫 글자별 작곡가 */
export const getComposersByLetter = (letter: string): OpenOpusComposer[] =>
    fallbackComposers.filter(c => c.name.charAt(0).toUpperCase() === letter.toUpperCase());

/** 전체 작곡가 목록 (A-Z) */
export const getAllComposers = (): OpenOpusComposer[] =>
    [...fallbackComposers].sort((a, b) => a.complete_name.localeCompare(b.complete_name));

/** 더미 작품 데이터 (작곡가별) */
const DUMMY_WORKS: Record<string, OpenOpusWork[]> = {
    '6': [ // Beethoven
        { id: 'w1', title: 'Symphony No. 5 in C minor', subtitle: 'Op. 67', searchterms: '', popular: '1', recommended: '1', genre: 'Orchestral' },
        { id: 'w2', title: 'Symphony No. 9 in D minor', subtitle: 'Op. 125 "Choral"', searchterms: '', popular: '1', recommended: '1', genre: 'Orchestral' },
        { id: 'w3', title: 'Piano Sonata No. 14', subtitle: 'Op. 27 No. 2 "Moonlight"', searchterms: '', popular: '1', recommended: '1', genre: 'Keyboard' },
        { id: 'w4', title: 'Piano Concerto No. 5', subtitle: 'Op. 73 "Emperor"', searchterms: '', popular: '1', recommended: '1', genre: 'Concerto' },
        { id: 'w5', title: 'Violin Concerto in D major', subtitle: 'Op. 61', searchterms: '', popular: '1', recommended: '0', genre: 'Concerto' },
    ],
    '196': [ // Mozart
        { id: 'w6', title: 'Symphony No. 40 in G minor', subtitle: 'K. 550', searchterms: '', popular: '1', recommended: '1', genre: 'Orchestral' },
        { id: 'w7', title: 'Piano Concerto No. 21', subtitle: 'K. 467', searchterms: '', popular: '1', recommended: '1', genre: 'Concerto' },
        { id: 'w8', title: 'Requiem in D minor', subtitle: 'K. 626', searchterms: '', popular: '1', recommended: '1', genre: 'Vocal' },
        { id: 'w9', title: 'The Magic Flute', subtitle: 'K. 620', searchterms: '', popular: '1', recommended: '1', genre: 'Stage' },
        { id: 'w10', title: 'Eine kleine Nachtmusik', subtitle: 'K. 525', searchterms: '', popular: '1', recommended: '0', genre: 'Orchestral' },
    ],
    '2': [ // Bach
        { id: 'w11', title: 'The Well-Tempered Clavier', subtitle: 'BWV 846-893', searchterms: '', popular: '1', recommended: '1', genre: 'Keyboard' },
        { id: 'w12', title: 'Brandenburg Concertos', subtitle: 'BWV 1046-1051', searchterms: '', popular: '1', recommended: '1', genre: 'Orchestral' },
        { id: 'w13', title: 'Mass in B minor', subtitle: 'BWV 232', searchterms: '', popular: '1', recommended: '1', genre: 'Vocal' },
        { id: 'w14', title: 'Cello Suites', subtitle: 'BWV 1007-1012', searchterms: '', popular: '1', recommended: '0', genre: 'Chamber' },
    ],
    '180': [ // Chopin
        { id: 'w15', title: 'Ballade No. 1 in G minor', subtitle: 'Op. 23', searchterms: '', popular: '1', recommended: '1', genre: 'Keyboard' },
        { id: 'w16', title: 'Nocturne in E-flat major', subtitle: 'Op. 9 No. 2', searchterms: '', popular: '1', recommended: '1', genre: 'Keyboard' },
        { id: 'w17', title: 'Piano Concerto No. 1', subtitle: 'Op. 11', searchterms: '', popular: '1', recommended: '0', genre: 'Concerto' },
    ],
    '186': [ // Tchaikovsky
        { id: 'w18', title: 'Swan Lake', subtitle: 'Op. 20', searchterms: '', popular: '1', recommended: '1', genre: 'Stage' },
        { id: 'w19', title: 'Piano Concerto No. 1', subtitle: 'Op. 23', searchterms: '', popular: '1', recommended: '1', genre: 'Concerto' },
        { id: 'w20', title: 'Symphony No. 6 "Pathétique"', subtitle: 'Op. 74', searchterms: '', popular: '1', recommended: '1', genre: 'Orchestral' },
    ],
};

/** 작곡가의 작품 목록 조회 */
export const getWorksByComposer = (
    composerId: string,
    genre: string = 'Popular'
): { composer: OpenOpusComposer | null; works: OpenOpusWork[] } => {
    const composer = fallbackComposers.find(c => c.id === composerId) || null;
    const allWorks = DUMMY_WORKS[composerId] || [];
    if (genre === 'Popular') {
        return { composer, works: allWorks.filter(w => w.popular === '1') };
    }
    if (genre === 'Recommended') {
        return { composer, works: allWorks.filter(w => w.recommended === '1') };
    }
    const filtered = allWorks.filter(w => w.genre === genre);
    return { composer, works: filtered.length > 0 ? filtered : allWorks };
};

/** 작곡가의 장르 목록 */
export const getComposerGenres = (composerId: string): string[] => {
    const works = DUMMY_WORKS[composerId] || [];
    return [...new Set(works.map(w => w.genre))];
};
