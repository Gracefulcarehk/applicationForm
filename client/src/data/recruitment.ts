// All recruitment landing page copy lives here so wording can change without touching layout.
// Items marked "To confirm" are drafts awaiting confirmation from Graceful Care.
import { SupplierType } from '../types/supplier';

export const MAIN_SITE_URL = 'https://www.gracefulcarehk.com';

// To confirm: same WhatsApp number as the main website
export const WHATSAPP_URL = `https://wa.me/85291029310?text=${encodeURIComponent('你好，我想查詢護理人員招聘。')}`;

export const hero = {
  eyebrow: '護理人員招聘',
  title: '成為滿心醫療\n護理人員',
  subtitle: '彈性安排工作時間，以專業照顧長者。', // To confirm
};

export type WhyIcon = 'schedule' | 'home' | 'support' | 'tech';

// To confirm
export const whyJoin: { icon: WhyIcon; title: string; text: string }[] = [
  { icon: 'schedule', title: '彈性工作時間', text: '按你的空檔選擇工作時段，兼顧家庭與生活。' },
  { icon: 'home', title: '一對一到戶照顧', text: '專注照顧一位長者，建立長遠互信關係。' },
  { icon: 'support', title: '團隊全程支援', text: '個案經理跟進每個個案，遇到問題有團隊協助。' },
  { icon: 'tech', title: '科技輔助照顧', text: '運用遠端監測等智能工具，照顧更有效率。' },
];

export type RoleIcon = 'nurse' | 'care' | 'rehab' | 'daily';

export type Role = {
  code: SupplierType;
  name: string;
  englishName: string;
  icon: RoleIcon;
  // Optional photo in public/img/roles/, e.g. 'rn.jpg'; an icon card is shown without one
  image?: string;
  requirements: string[];
  scope: string[];
};

// Same order and codes as the application form; requirements and scope to confirm
export const roles: Role[] = [
  {
    code: 'RN',
    name: '註冊護士',
    englishName: 'Registered Nurse',
    icon: 'nurse',
    requirements: ['香港護士管理局註冊護士（普通科或精神科）', '持有效執業證明書'],
    scope: ['健康評估及病況監測', '藥物管理及注射', '傷口及造口護理', '制定護理計劃及撰寫護理報告', '指導家屬日常照顧技巧'],
  },
  {
    code: 'EN',
    name: '登記護士',
    englishName: 'Enrolled Nurse',
    icon: 'nurse',
    requirements: ['香港護士管理局登記護士（普通科或精神科）', '持有效執業證明書'],
    scope: ['病況及生命表徵監測', '藥物管理', '基本護理程序', '陪同覆診及跟進', '填寫護理記錄'],
  },
  {
    code: 'PCW',
    name: '起居照顧員',
    englishName: 'Personal Care Worker',
    icon: 'daily',
    requirements: ['持起居照顧員或同等認可課程證書'],
    scope: ['個人護理，包括沐浴、更衣及如廁', '餵食及日常起居協助', '陪同覆診、外出及參與社區活動', '陪伴及情緒支援'],
  },
  {
    code: 'HCA',
    name: '健康服務助理',
    englishName: 'Health Care Assistant',
    icon: 'care',
    requirements: ['持保健員或健康服務助理證書', '社會福利署註冊保健員優先'],
    scope: ['量度及記錄生命表徵', '協助藥物管理', '個人護理及起居照顧', '陪診及護送'],
  },
  {
    code: 'PT',
    name: '物理治療師',
    englishName: 'Physiotherapist',
    icon: 'rehab',
    requirements: ['香港物理治療師管理委員會註冊物理治療師', '持有效執業證明書'],
    scope: ['到戶評估長者活動能力', '制定個人化復健計劃', '肌力、平衡及步行訓練', '跌倒預防及家居環境建議', '指導照顧者協助訓練'],
  },
  {
    code: 'OT',
    name: '職業治療師',
    englishName: 'Occupational Therapist',
    icon: 'rehab',
    requirements: ['香港職業治療師管理委員會註冊職業治療師', '持有效執業證明書'],
    scope: ['評估及訓練日常生活能力', '建議輔助器具及家居改裝', '認知及手部功能訓練', '指導照顧者協助長者自理'],
  },
];

// What the application form asks for
export const requirements = [
  '香港身份證',
  '有效的專業資格證書',
  '可合法在香港工作',
  '年滿 18 歲',
  '香港銀行戶口及顯示戶口號碼的銀行文件（用作出糧）',
];

// To confirm: review time and who contacts the applicant
export const steps = [
  { title: '填寫網上申請表', text: '填寫個人資料及申請職位。' },
  { title: '上載文件', text: '上載身份證、專業資格證書及銀行文件。' },
  { title: '資料審核', text: '我們會於 3–5 個工作天內完成審核。' },
  { title: '安排工作', text: '審核通過後，專人會以 WhatsApp 與你聯絡。' },
];

// To provide: benefits section is hidden while this list is empty
export const benefits: { title: string; text: string }[] = [];

export const faqs = [
  {
    question: '如何申請成為護理人員？',
    answer: '按「立即申請」填寫網上申請表並上載所需文件，我們會於 3–5 個工作天內完成審核。',
  },
  {
    question: '需要提交哪些文件？',
    answer: '香港身份證、有效的專業資格證書，以及顯示戶口號碼和持有人姓名的銀行文件，例如月結單或存摺。',
  },
  {
    question: '工作時間如何安排？',
    answer: '你可以按自己的時間選擇工作時段，我們提供彈性的工作安排。',
  },
  {
    // To confirm once benefit details are provided
    question: '薪金如何計算？',
    answer: '薪金按職位及工作時數計算，詳情會於審核後由專人向你講解。',
  },
  {
    question: '是否需要接受培訓？',
    answer: '我們會為新加入的護理人員提供所需培訓，確保服務質素。',
  },
];
