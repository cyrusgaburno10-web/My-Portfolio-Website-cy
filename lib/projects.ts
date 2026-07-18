export interface WorkflowStep {
  title: string;
  body: string;
}

export interface Project {
  id: string;
  title: string;
  stack: string;
  description: string;
  outcome: string;
  badges: string[];
  challenge: string;
  howItsBuilt: WorkflowStep[];
  image?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'lead-management',
    title: 'Real Estate Lead Enrichment & Pipeline Automation (GHL replicate)',
    stack: 'n8n + Google Gemini',
    description:
      'End-to-end pipeline ingesting leads via webhooks, enriching and scoring with Gemini, then routing through conditional outreach and Slack alerts.',
    outcome: 'Faster lead response and full pipeline visibility.',
    badges: ['AI LEAD SCORING', 'FULL PIPELINE VISIBILITY'],
    challenge:
      "Leads came in from multiple sources with no consistent way to qualify them, so hot prospects sat in a spreadsheet next to dead ends, and follow-up depended on someone remembering to do it.",
    howItsBuilt: [
      { title: 'Webhook Intake', body: 'A form submission triggers the workflow and logs the raw lead straight into Google Sheets.' },
      { title: 'AI Qualification', body: "Gemini scores the lead against budget, company size, and location to judge if it's a real fit." },
      { title: 'CRM Routing', body: 'Qualified leads get tagged HOT, WARM, or COLD and routed to the matching Slack channel.' },
      { title: 'Automated Nurture', body: 'Each tier follows its own timed sequence: immediate outreach for hot leads, scheduled re-engagement for the rest.' },
      { title: 'Deal Tracking', body: 'Closed Won and Closed Lost events update the CRM and notify the team automatically.' },
    ],
    image: '/projects/lead-management-workflow.png',
  },
  {
    id: 'finance-tracker',
    title: 'AI-Powered Personal Finance Tracker',
    stack: 'n8n + Telegram + Gemini',
    description:
      'Telegram-based expense tracker logging transactions from text, receipts, and PDF statements, with Gemini extracting structured data automatically.',
    outcome: 'Effortless expense logging with auto-categorization.',
    badges: ['AUTO-CATEGORIZED', 'RECEIPT + PDF PARSING'],
    challenge:
      'Logging expenses meant manually opening a spreadsheet after every purchase, so receipts piled up and categorization happened in batches, if at all.',
    howItsBuilt: [
      { title: 'Telegram Trigger', body: 'The workflow starts the moment a message, photo, or PDF statement lands in the bot chat.' },
      { title: 'Media Extraction', body: 'Images and PDFs are downloaded and their content pulled out for analysis.' },
      { title: 'AI Parsing', body: 'Gemini reads the extracted content and converts it into structured transaction data: amount, category, date.' },
      { title: 'Validation', body: 'A check step catches incomplete entries before they reach the ledger.' },
      { title: 'Sheet Logging & Reply', body: 'The transaction is appended to Google Sheets and a confirmation summary is sent back through Telegram.' },
    ],
    image: '/projects/finance-tracker-workflow.png',
  },
  {
    id: 'asana-crm',
    title: 'Asana CRM: Lead Engagement Workflow',
    stack: 'Zapier + Asana + Gmail + Drive + AI',
    description:
      'A 24-step live Zap triggered by Asana task updates, splitting into 5 parallel lifecycle paths by status, from first outreach through paid-and-close, each with its own automated email and AI-generated content.',
    outcome:
      'One Asana status change now drives the entire client lifecycle end-to-end, with zero manual follow-up tracking across any stage.',
    badges: ['24/30 STEPS LIVE', '5-STAGE LIFECYCLE', 'ZERO MANUAL FOLLOW-UP'],
    challenge:
      "Every stage of a client's lifecycle, from first contact to final payment, needed its own manual email, and nothing kept those steps consistent as the workload grew.",
    howItsBuilt: [
      { title: 'Status Trigger', body: 'An Asana task status change fires the Zap directly, no separate tool to check or update.' },
      { title: 'Path Routing', body: 'The task splits into one of five paths: Ready to Start, No Response, Quoted, Approved, or Paid and Closed.' },
      { title: 'Ready to Start', body: 'Creates a Drive lead folder and drafts social content automatically.' },
      { title: 'No Response & Quoted', body: 'Each sends a first follow-up, waits, then escalates to a second one if there is still no reply.' },
      { title: 'Approved & Paid and Closed', body: 'AI drafts a personalized welcome or closing message, attaches the right files, and sends it.' },
    ],
    image: '/projects/asana-crm-workflow.png',
  },
  {
    id: 'asana-crm-n8n',
    title: 'Asana Lead Engagement: n8n Rebuild',
    stack: 'n8n + Asana + Gmail + Drive',
    description:
      'The same Asana-triggered lead engagement lifecycle as the Zapier build above, re-engineered natively in n8n: a 22-node workflow routing task updates through 5 conditional paths of Gmail follow-ups, Google Drive folder handling, and quote follow-up sequences, no Zapier required.',
    outcome: 'Proves the same lead lifecycle logic can run entirely on n8n native nodes, matching the Zapier version stage for stage.',
    badges: ['22-NODE WORKFLOW', '5-PATH ROUTING', 'N8N-NATIVE REBUILD'],
    challenge:
      'The Zapier version worked, but it depended on Zapier specifically. The same logic needed to run for clients whose stack does not include it.',
    howItsBuilt: [
      { title: 'Asana Trigger', body: 'Fires on the same task-update event as the Zapier build.' },
      { title: 'Switch Routing', body: "n8n's Switch node splits the task into the same five lifecycle paths natively." },
      { title: 'Ready to Start', body: 'Creates the Drive folder, shares it, and opens a subtask, no Zapier action needed.' },
      { title: 'Follow-up Chains', body: 'No Response and Quotation paths run their own wait-then-escalate email sequences.' },
      { title: 'Approved', body: 'Downloads the quote attachment from Drive and sends it along with the follow-up email.' },
    ],
    image: '/projects/asana-crm-n8n-workflow.png',
  },
  {
    id: 'voice-receptionist',
    title: 'AI Voice Receptionist',
    stack: 'n8n + VAPI',
    description:
      'Voice AI receptionist handling appointment booking, rescheduling, and cancellations over live phone calls, with real-time calendar sync and call logging to Airtable.',
    outcome: '24/7 phone coverage, zero missed calls or scheduling errors.',
    badges: ['24/7 COVERAGE', 'ZERO MISSED CALLS'],
    challenge: 'Calls outside business hours went unanswered, and every missed call was a missed booking.',
    howItsBuilt: [
      { title: 'Get Slots', body: 'Checks real-time calendar availability the moment a caller asks for a time.' },
      { title: 'Book Slots', body: 'Confirms the appointment, creates the calendar event, and logs it to Airtable.' },
      { title: 'Update Slots', body: 'Handles reschedule requests by finding the original booking and moving it.' },
      { title: 'Cancel Slots', body: 'Removes the appointment and records the cancellation.' },
      { title: 'Call Recording', body: 'Saves call details for every interaction, booked or not.' },
    ],
    image: '/projects/voice-receptionist-workflow.png',
  },
  {
    id: 'doc-auto-sorter',
    title: 'Intelligent Document Auto-Sorter',
    stack: 'n8n + Google Drive + AI Agent',
    description:
      "A published, live n8n workflow that analyzes a document's actual content the moment it lands in Drive, then uses a tool-calling AI agent to route it to the correct folder and a second pass to file it into the right sub-folder.",
    outcome: 'New documents are correctly organized within seconds of upload, with zero manual sorting.',
    badges: ['PUBLISHED & LIVE', 'AI-AGENT ROUTING', 'SUB-FOLDER SORTING'],
    challenge:
      'New files landed in Drive with no consistent naming or folder structure, so filing them correctly meant opening each one and deciding by hand.',
    howItsBuilt: [
      { title: 'Drive Trigger', body: 'Fires the moment a new file is created in the watched folder.' },
      { title: 'Content Analysis', body: "An AI agent reads the file's actual content, not just the filename, to understand what it is." },
      { title: 'Top-Level Routing', body: 'The agent searches the existing Drive folder structure and picks the correct top-level destination.' },
      { title: 'File Move', body: 'Relocates the file to that folder.' },
      { title: 'Sub-Folder Routing', body: 'A second AI pass repeats the process one level deeper, filing it into the right sub-folder.' },
    ],
    image: '/projects/drive-auto-sort-workflow.png',
  },
];
