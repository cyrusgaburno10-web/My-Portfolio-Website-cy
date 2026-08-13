export interface Credential {
  id: string;
  title: string;
  program: string;
  issuer: string;
  date: string;
  file: string;
  /** True for credentials added through /admin, as opposed to the hardcoded seed list below. */
  isCustom?: boolean;
}

export const CREDENTIALS: Credential[] = [
  {
    id: 'zapier',
    title: 'Zapier Certified',
    program: 'No Code Automation with Zapier',
    issuer: 'Technical Virtual Assistants PH',
    date: 'April 14, 2026',
    file: '/credentials/zapier-certificate.png',
  },
  {
    id: 'n8n',
    title: 'n8n Workflow Professional',
    program: 'AI Automation with n8n',
    issuer: 'Technical Virtual Assistants PH',
    date: 'May 6, 2026',
    file: '/credentials/n8n-certificate.png',
  },
  {
    id: 'make',
    title: 'Make Advanced Scenarios',
    program: 'No Code Automation with Make.com',
    issuer: 'Technical Virtual Assistants PH',
    date: 'April 16, 2026',
    file: '/credentials/make-certificate.png',
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering & AI Automation',
    program: 'Prompt Engineering',
    issuer: 'Technical Virtual Assistants PH',
    date: 'May 6, 2026',
    file: '/credentials/prompt-engineering-certificate.png',
  },
  {
    id: 'gohighlevel',
    title: 'GoHighLevel CRM Training',
    program: 'HighLevel CRM',
    issuer: 'Technical Virtual Assistants PH',
    date: 'May 13, 2026',
    file: '/credentials/gohighlevel-certificate.png',
  },
];
