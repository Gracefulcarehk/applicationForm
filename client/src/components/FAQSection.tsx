import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqItems = [
  {
    question: '如何申請成為護理人員？ How to apply as a caregiver?',
    answer: '請填寫網上申請表格，並上傳所需文件。我們會在收到申請後3-5個工作天內完成審核。Please complete the online application form and upload the required documents. We will complete the review within 3-5 working days after receiving your application.'
  },
  {
    question: '需要提交哪些文件？ What documents do I need to submit?',
    answer: '需要提交身份證明文件、專業資格證書、銀行帳戶證明等。Please submit your ID document, professional qualification certificates, and bank account proof.'
  },
  {
    question: '工作時間如何安排？ How are working hours arranged?',
    answer: '你可以根據自己的時間表選擇工作時段，我們提供彈性的工作安排。You can choose your working hours based on your schedule, we offer flexible work arrangements.'
  },
  {
    question: '薪金如何計算？ How is the salary calculated?',
    answer: '薪金根據工作時數和職位計算，並提供夜班津貼和特別節日津貼。Salary is calculated based on working hours and position, with night shift allowance and special holiday allowance provided.'
  },
  {
    question: '是否需要接受培訓？ Do I need to undergo training?',
    answer: '我們會為新入職的護理人員提供必要的培訓，確保服務質素。We provide necessary training for new caregivers to ensure service quality.'
  }
];

const FAQSection: React.FC = () => {
  return (
    <Box sx={{ mt: 6, mb: 4 }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#000000',
          mb: 3,
          textAlign: 'center'
        }}
      >
        常見問題 FAQ
      </Typography>
      {faqItems.map((item, index) => (
        <Accordion 
          key={index} 
          sx={{ 
            mb: 2,
            boxShadow: 'none',
            border: '1px solid #e0e0e0',
            '&:before': {
              display: 'none',
            },
            '&.Mui-expanded': {
              margin: '16px 0',
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              },
              '& .MuiAccordionSummary-content': {
                margin: '12px 0'
              }
            }}
          >
            <Typography 
              sx={{ 
                fontWeight: 600,
                color: '#000000',
                fontSize: '1rem'
              }}
            >
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: '#ffffff',
              padding: '16px 24px 24px'
            }}
          >
            <Typography
              sx={{
                color: '#666666',
                fontSize: '0.95rem',
                lineHeight: 1.6
              }}
            >
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQSection; 