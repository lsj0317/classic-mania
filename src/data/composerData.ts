import type { OpenOpusComposer } from '../types';

/**
 * Open Opus API 폴백용 유명 클래식 작곡가 데이터
 * 모든 12개월을 커버하도록 선정
 */
export const fallbackComposers: OpenOpusComposer[] = [
    // 1월
    { id: '145', name: 'Scriabin', complete_name: 'Alexander Scriabin', birth: '1872-01-06', death: '1915-04-27', epoch: 'Late Romantic', portrait: 'https://assets.openopus.org/portraits/72292206-1568084857.jpg' },
    { id: '196', name: 'Mozart', complete_name: 'Wolfgang Amadeus Mozart', birth: '1756-01-27', death: '1791-12-05', epoch: 'Classical', portrait: 'https://assets.openopus.org/portraits/21459195-1568084925.jpg' },
    { id: '102', name: 'Schubert', complete_name: 'Franz Schubert', birth: '1797-01-31', death: '1828-11-19', epoch: 'Early Romantic', portrait: 'https://assets.openopus.org/portraits/75344238-1568084941.jpg' },
    // 2월
    { id: '87', name: 'Mendelssohn', complete_name: 'Felix Mendelssohn', birth: '1809-02-03', death: '1847-11-04', epoch: 'Early Romantic', portrait: 'https://assets.openopus.org/portraits/32291713-1568084908.jpg' },
    { id: '180', name: 'Chopin', complete_name: 'Frédéric Chopin', birth: '1810-02-22', death: '1849-10-17', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/39300498-1568084863.jpg' },
    { id: '148', name: 'Handel', complete_name: 'George Frideric Handel', birth: '1685-02-23', death: '1759-04-14', epoch: 'Baroque', portrait: 'https://assets.openopus.org/portraits/35865286-1568084885.jpg' },
    { id: '200', name: 'Rossini', complete_name: 'Gioachino Rossini', birth: '1792-02-29', death: '1868-11-13', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/42474510-1568084936.jpg' },
    // 3월
    { id: '2', name: 'Bach', complete_name: 'Johann Sebastian Bach', birth: '1685-03-21', death: '1750-07-28', epoch: 'Baroque', portrait: 'https://assets.openopus.org/portraits/12091269-1568084845.jpg' },
    { id: '183', name: 'Mussorgsky', complete_name: 'Modest Mussorgsky', birth: '1839-03-21', death: '1881-03-28', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/22687476-1568084921.jpg' },
    { id: '210', name: 'Bartók', complete_name: 'Béla Bartók', birth: '1881-03-25', death: '1945-09-26', epoch: '20th Century', portrait: 'https://assets.openopus.org/portraits/85920931-1568084848.jpg' },
    { id: '177', name: 'Ravel', complete_name: 'Maurice Ravel', birth: '1875-03-07', death: '1937-12-28', epoch: '20th Century', portrait: 'https://assets.openopus.org/portraits/67385668-1568084931.jpg' },
    { id: '199', name: 'Vivaldi', complete_name: 'Antonio Vivaldi', birth: '1678-03-04', death: '1741-07-28', epoch: 'Baroque', portrait: 'https://assets.openopus.org/portraits/44570373-1568084961.jpg' },
    { id: '211', name: 'Rimsky-Korsakov', complete_name: 'Nikolai Rimsky-Korsakov', birth: '1844-03-18', death: '1908-06-21', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/76520943-1568084933.jpg' },
    // 4월
    { id: '55', name: 'Prokofiev', complete_name: 'Sergei Prokofiev', birth: '1891-04-23', death: '1953-03-05', epoch: '20th Century', portrait: 'https://assets.openopus.org/portraits/48995566-1568084929.jpg' },
    { id: '176', name: 'Rachmaninoff', complete_name: 'Sergei Rachmaninoff', birth: '1873-04-01', death: '1943-03-28', epoch: 'Late Romantic', portrait: 'https://assets.openopus.org/portraits/80555544-1568084930.jpg' },
    // 5월
    { id: '3', name: 'Brahms', complete_name: 'Johannes Brahms', birth: '1833-05-07', death: '1897-04-03', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/16278809-1568084855.jpg' },
    { id: '186', name: 'Tchaikovsky', complete_name: 'Pyotr Ilyich Tchaikovsky', birth: '1840-05-07', death: '1893-11-06', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/55973545-1568084956.jpg' },
    { id: '187', name: 'Wagner', complete_name: 'Richard Wagner', birth: '1813-05-22', death: '1883-02-13', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/48849484-1568084963.jpg' },
    { id: '203', name: 'Satie', complete_name: 'Erik Satie', birth: '1866-05-17', death: '1925-07-01', epoch: '20th Century', portrait: 'https://assets.openopus.org/portraits/84629567-1568084939.jpg' },
    // 6월
    { id: '143', name: 'Strauss', complete_name: 'Richard Strauss', birth: '1864-06-11', death: '1949-09-08', epoch: 'Late Romantic', portrait: 'https://assets.openopus.org/portraits/80432919-1568084951.jpg' },
    { id: '144', name: 'Stravinsky', complete_name: 'Igor Stravinsky', birth: '1882-06-17', death: '1971-04-06', epoch: '20th Century', portrait: 'https://assets.openopus.org/portraits/28873364-1568084953.jpg' },
    { id: '142', name: 'Schumann', complete_name: 'Robert Schumann', birth: '1810-06-08', death: '1856-07-29', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/47495498-1568084945.jpg' },
    { id: '215', name: 'Elgar', complete_name: 'Edward Elgar', birth: '1857-06-02', death: '1934-02-23', epoch: 'Late Romantic', portrait: 'https://assets.openopus.org/portraits/19583729-1568084873.jpg' },
    // 7월
    { id: '181', name: 'Mahler', complete_name: 'Gustav Mahler', birth: '1860-07-07', death: '1911-05-18', epoch: 'Late Romantic', portrait: 'https://assets.openopus.org/portraits/26617013-1568084903.jpg' },
    { id: '216', name: 'Gluck', complete_name: 'Christoph Willibald Gluck', birth: '1714-07-02', death: '1787-11-15', epoch: 'Classical', portrait: 'https://assets.openopus.org/portraits/62839157-1568084881.jpg' },
    // 8월
    { id: '1', name: 'Debussy', complete_name: 'Claude Debussy', birth: '1862-08-22', death: '1918-03-25', epoch: 'Late Romantic', portrait: 'https://assets.openopus.org/portraits/64403738-1568084869.jpg' },
    { id: '182', name: 'Bruckner', complete_name: 'Anton Bruckner', birth: '1824-08-04', death: '1896-10-11', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/55717868-1568084859.jpg' },
    // 9월
    { id: '4', name: 'Dvořák', complete_name: 'Antonín Dvořák', birth: '1841-09-08', death: '1904-05-01', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/71673994-1568084871.jpg' },
    { id: '204', name: 'Bruch', complete_name: 'Max Bruch', birth: '1838-01-06', death: '1920-10-02', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/85123729-1568084857.jpg' },
    { id: '188', name: 'Holst', complete_name: 'Gustav Holst', birth: '1874-09-21', death: '1934-05-25', epoch: '20th Century', portrait: 'https://assets.openopus.org/portraits/94821573-1568084891.jpg' },
    // 10월
    { id: '5', name: 'Liszt', complete_name: 'Franz Liszt', birth: '1811-10-22', death: '1886-07-31', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/87923134-1568084899.jpg' },
    { id: '178', name: 'Verdi', complete_name: 'Giuseppe Verdi', birth: '1813-10-10', death: '1901-01-27', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/96315798-1568084959.jpg' },
    { id: '206', name: 'Saint-Saëns', complete_name: 'Camille Saint-Saëns', birth: '1835-10-09', death: '1921-12-16', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/54176982-1568084937.jpg' },
    { id: '213', name: 'Paganini', complete_name: 'Niccolò Paganini', birth: '1782-10-27', death: '1840-05-27', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/34819267-1568084927.jpg' },
    // 11월
    { id: '198', name: 'Borodin', complete_name: 'Alexander Borodin', birth: '1833-11-12', death: '1887-02-27', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/38197645-1568084853.jpg' },
    { id: '208', name: 'Copland', complete_name: 'Aaron Copland', birth: '1900-11-14', death: '1990-12-02', epoch: '20th Century', portrait: 'https://assets.openopus.org/portraits/73028561-1568084867.jpg' },
    // 12월
    { id: '6', name: 'Beethoven', complete_name: 'Ludwig van Beethoven', birth: '1770-12-16', death: '1827-03-26', epoch: 'Classical', portrait: 'https://assets.openopus.org/portraits/55910756-1568084849.jpg' },
    { id: '184', name: 'Sibelius', complete_name: 'Jean Sibelius', birth: '1865-12-08', death: '1957-09-20', epoch: 'Late Romantic', portrait: 'https://assets.openopus.org/portraits/56832759-1568084947.jpg' },
    { id: '185', name: 'Puccini', complete_name: 'Giacomo Puccini', birth: '1858-12-22', death: '1924-11-29', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/52907431-1568084929.jpg' },
    { id: '197', name: 'Berlioz', complete_name: 'Hector Berlioz', birth: '1803-12-11', death: '1869-03-08', epoch: 'Romantic', portrait: 'https://assets.openopus.org/portraits/93482615-1568084851.jpg' },
];
