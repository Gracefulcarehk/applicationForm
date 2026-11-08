import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Section from './landing/Section';
import { brand } from '../theme';
import { faqs } from '../data/recruitment';

// Underlined collapsible rows, like the FAQ on the main site's CCSV page
const FAQSection: React.FC = () => (
  <Section id="faq" bg={brand.greyBg} title="常見問題">
    {faqs.map((item) => (
      <Accordion
        key={item.question}
        disableGutters
        elevation={0}
        square
        sx={{ bgcolor: 'transparent', borderBottom: `1px solid ${brand.outline}`, '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, py: 1 }}>
          <Typography variant="h4" component="h3" sx={{ color: brand.text, fontSize: { xs: '1rem', md: '1.25rem' } }}>
            {item.question}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0, pb: 3 }}>
          <Typography sx={{ color: brand.grey }}>{item.answer}</Typography>
        </AccordionDetails>
      </Accordion>
    ))}
  </Section>
);

export default FAQSection;
