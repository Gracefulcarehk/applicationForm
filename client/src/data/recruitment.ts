// All recruitment landing page copy lives here so wording can change without touching layout.
import { SupplierType } from '../types/supplier';

export const MAIN_SITE_URL = 'https://www.gracefulcarehk.com';

// Recruitment enquiries line
export const WHATSAPP_URL = `https://wa.me/85290367789?text=${encodeURIComponent('你好，我想查詢護理人員招聘。')}`;

// Shown on the landing page, application form and thank-you page
export const REVIEW_TIME = '3 個工作天';

export const hero = {
  eyebrow: '護理人員招聘',
  title: '成為滿心醫療\n護理人員',
  subtitle: '彈性安排工作時間，以專業照顧長者。',
};

export type WhyIcon = 'schedule' | 'support' | 'training';

export const whyJoin: { icon: WhyIcon; title: string }[] = [
  { icon: 'schedule', title: '彈性上班時間' },
  { icon: 'support', title: '客服團隊支援' },
  { icon: 'training', title: '良好培訓機制' },
];

export type RoleIcon = 'housework' | 'care' | 'nurse' | 'rehab';

export type Role = {
  code: SupplierType;
  name: string;
  englishName: string;
  icon: RoleIcon;
  // Optional photo in public/img/roles/, e.g. 'rn.jpg'; an icon card is shown without one
  image?: string;
  qualificationsIntro: string;
  qualifications: string[];
  scope: string[];
};

// Same order and codes as the application form's 申請職位 list
export const roles: Role[] = [
  {
    code: 'HH',
    name: '家務助理',
    englishName: 'Home Helper',
    icon: 'housework',
    qualificationsIntro: '持有以下本地認可資格：',
    qualifications: ['家務助理'],
    scope: ['家居清潔', '備菜', '煮食', '翻熱食物'],
  },
  {
    code: 'PCW',
    name: '起居照顧員',
    englishName: 'Personal Care Worker',
    icon: 'care',
    qualificationsIntro: '持有以下本地認可資格：',
    qualifications: ['保健員', '護理員', '醫護支援人員'],
    scope: ['個人護理', '陪伴護理', '協助日常活動', '護送病人', '陪診', '導管餵食', '監測身體狀態', '緊急支援'],
  },
  {
    code: 'RN',
    name: '註冊護士',
    englishName: 'Registered Nurse',
    icon: 'nurse',
    qualificationsIntro: '持有以下本地認可資格：',
    qualifications: ['註冊護士'],
    scope: ['個人護理', '監測身體狀態', '藥物管理', '急救', '提供緊急支援', '感染控制', '提供營養建議', '進行健康評估', '撰寫護理報告'],
  },
  {
    code: 'AH',
    name: '輔助醫療人員',
    englishName: 'Allied Health Professional',
    icon: 'rehab',
    qualificationsIntro: '持有以下至少一項本地認可資格：',
    qualifications: ['物理治療師', '職業治療師', '言語治療師'],
    scope: ['針對客戶需要和病情，為客戶制定治療計劃', '為客戶和家屬提供護理指導，以便調適生活'],
  },
];

export const requirements = ['香港身份證', '相關醫療專業證書', '同理心價值', '香港銀行戶口證明（用作出糧）'];

export const steps = [
  { title: '填寫網上申請表', text: '填寫個人資料及申請職位。' },
  { title: '上載文件', text: '上載身份證、專業證書及銀行文件。' },
  { title: '資料審核', text: `我們會於 ${REVIEW_TIME}內完成審核。` },
  { title: '安排工作', text: '審核通過後，專人會以 WhatsApp 與你聯絡。' },
];

// To provide: benefits section is hidden while this list is empty
export const benefits: { title: string; text: string }[] = [];

export const faqs = [
  {
    question: '如何申請成為護理人員？',
    answer: `按「立即申請」填寫網上申請表並上載所需文件，我們會於 ${REVIEW_TIME}內完成審核。`,
  },
  {
    question: '需要提交哪些文件？',
    answer: '香港身份證、相關醫療專業證書，以及顯示戶口號碼和持有人姓名的銀行文件，例如月結單或存摺。',
  },
  {
    question: '工作時間如何安排？',
    answer: '你可以按自己的時間選擇工作時段，我們提供彈性的工作安排。',
  },
  {
    // To update once benefit details are provided
    question: '薪金如何計算？',
    answer: '薪金按職位及工作時數計算，詳情會於審核後由專人向你講解。',
  },
  {
    question: '是否需要接受培訓？',
    answer: '我們設有良好的培訓機制，會為新加入的護理人員提供所需培訓，確保服務質素。',
  },
];
