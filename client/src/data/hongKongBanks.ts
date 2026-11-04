export interface HongKongBank {
  name: string;
  nameCn: string;
  code: string;
}

// Clearing codes verified against HKICL "Clearing Code and Branch Code" list, version 2026/048 (2 Nov 2026):
// https://www.hkicl.com.hk/eng/information_centre/clearing_code_and_branch_code_list.php
// Every bank below is a clearing member of the HKD clearing system. Chinese names are not part of the HKICL list.
export const hongKongBanks: HongKongBank[] = [
  { name: 'HSBC (The Hongkong and Shanghai Banking Corporation)', nameCn: '滙豐銀行', code: '004' },
  { name: 'Bank of China (Hong Kong)', nameCn: '中國銀行(香港)', code: '012' },
  { name: 'Standard Chartered Bank (Hong Kong)', nameCn: '渣打銀行(香港)', code: '003' },
  { name: 'Hang Seng Bank', nameCn: '恒生銀行', code: '024' },
  { name: 'The Bank of East Asia', nameCn: '東亞銀行', code: '015' },
  { name: 'DBS Bank (Hong Kong)', nameCn: '星展銀行(香港)', code: '016' },
  { name: 'Citibank (Hong Kong)', nameCn: '花旗銀行(香港)', code: '250' },
  { name: 'Dah Sing Bank', nameCn: '大新銀行', code: '040' },
  { name: 'China Construction Bank (Asia)', nameCn: '中國建設銀行(亞洲)', code: '009' },
  { name: 'Industrial and Commercial Bank of China (Asia)', nameCn: '中國工商銀行(亞洲)', code: '072' },
  { name: 'Bank of Communications (Hong Kong)', nameCn: '交通銀行(香港)', code: '382' },
  { name: 'China CITIC Bank International', nameCn: '中信銀行(國際)', code: '018' },
  { name: 'CMB Wing Lung Bank', nameCn: '招商永隆銀行', code: '020' },
  { name: 'OCBC Bank (Hong Kong)', nameCn: '華僑銀行(香港)', code: '035' },
  { name: 'Nanyang Commercial Bank', nameCn: '南洋商業銀行', code: '043' },
  { name: 'Chiyu Banking Corporation', nameCn: '集友銀行', code: '039' },
  { name: 'Chong Hing Bank', nameCn: '創興銀行', code: '041' },
  { name: 'Shanghai Commercial Bank', nameCn: '上海商業銀行', code: '025' },
  { name: 'Public Bank (Hong Kong)', nameCn: '大眾銀行(香港)', code: '028' },
  { name: 'Fubon Bank (Hong Kong)', nameCn: '富邦銀行(香港)', code: '128' },
  { name: 'Tai Sang Bank', nameCn: '大生銀行', code: '061' },
  { name: 'Tai Yau Bank', nameCn: '大有銀行', code: '038' },
  { name: 'ZA Bank', nameCn: '眾安銀行', code: '387' },
  { name: 'livi bank', nameCn: '理慧銀行', code: '388' },
  { name: 'Mox Bank', nameCn: 'Mox Bank', code: '389' },
  { name: 'WeLab Bank', nameCn: '匯立銀行', code: '390' },
  { name: 'Fusion Bank', nameCn: '富融銀行', code: '391' },
  { name: 'Ping An Digital Bank (International)', nameCn: 'Ping An Digital Bank', code: '392' },
  { name: 'Ant Bank (Hong Kong)', nameCn: '螞蟻銀行(香港)', code: '393' },
  { name: 'ELE Bank', nameCn: 'ELE Bank', code: '395' },
  { name: 'Agricultural Bank of China (Hong Kong Branch)', nameCn: '中國農業銀行(香港分行)', code: '222' },
  { name: 'China Merchants Bank (Hong Kong Branch)', nameCn: '招商銀行(香港分行)', code: '238' },
  { name: 'China Minsheng Bank (Hong Kong Branch)', nameCn: '中國民生銀行(香港分行)', code: '353' },
  { name: 'China Guangfa Bank (Hong Kong Branch)', nameCn: '廣發銀行(香港分行)', code: '359' },
  { name: 'China Bohai Bank (Hong Kong Branch)', nameCn: '渤海銀行(香港分行)', code: '361' },
  { name: 'China Everbright Bank (Hong Kong Branch)', nameCn: '中國光大銀行(香港分行)', code: '368' },
  { name: 'China Zheshang Bank (Hong Kong Branch)', nameCn: '浙商銀行(香港分行)', code: '383' },
];
