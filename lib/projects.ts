export interface WorkflowStep {
  title: string;
  body: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
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
  metric: ProjectMetric;
  image?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'sales-to-cash-automation',
    title: 'AI-Powered Sales-to-Cash Automation (Lead → Contract → Invoice → Payment)',
    stack: 'n8n + HubSpot + Calendly + Invoice Ninja',
    description:
      'Three merged n8n workflows carrying one HubSpot deal from AI-scored lead intake through discovery-call booking, negotiated proposal, and invoice-to-payment.',
    outcome: 'One deal record tracks every stage from first contact to paid invoice, with zero duplicate CRM entries between sales and finance.',
    badges: ['AI LEAD SCORING', 'DEAL-UPSERT LOGIC', 'INVOICE-TO-CASH'],
    metric: { value: '~15 min', label: 'of manual CRM and invoice re-entry eliminated per deal (estimated)' },
    challenge:
      'Sales, scheduling, and invoicing lived in three disconnected tools, so a single lead could end up as three unlinked records with no shared thread from first contact to payment.',
    howItsBuilt: [
      { title: 'AI Lead Scoring', body: 'A new CRM lead is scored Hot, Warm, or Cold by Gemini, then upserted into HubSpot as a contact and deal, no duplicate records if the contact already exists.' },
      { title: 'Discovery Call Booking', body: "A raw contact gets a self-service Calendly link. Since Calendly's free tier has no webhooks, n8n polls the connected Google Calendar every 10 minutes and opens a matching HubSpot deal at Appointment Scheduled." },
      { title: 'Negotiated Proposal', body: 'After the call, the rep triggers a proposal request that finds that same deal, moves it to Proposal Sent at the real negotiated price, and emails the customer a one-click confirmation link.' },
      { title: 'Order Confirmation', body: "The customer's click re-enters the same contact and deal, skipping AI scoring entirely since the lead is already human-qualified, and advances the deal to Contract Sent." },
      { title: 'Invoice & Closed Won', body: 'Invoice Ninja generates the invoice at the confirmed amount, with PayPal wired in as its payment gateway. The deal only flips to Closed Won once the invoice is actually created, not on submission.' },
      { title: 'Ops Visibility', body: 'Every stage logs to a Google Sheets dashboard and notifies Slack or Gmail, so sales and finance can see deal movement without opening HubSpot.' },
    ],
    image: '/projects/sales-to-cash-automation-workflow.png',
  },
  {
    id: 'hire-to-onboard-automation',
    title: 'AI-Powered Employee Onboarding Automation (Hire to Day-One Ready)',
    stack: 'n8n + BambooHR + Trello',
    description:
      "A manager's new-hire form creates the BambooHR employee record, builds a Trello onboarding checklist due the day before start, and routes IT and manager notifications separately.",
    outcome: 'New hires arrive to a fully staged BambooHR record, checklist, and department notifications, with duplicate-request protection built in.',
    badges: ['DUPLICATE-SAFE', 'DEPT-ROUTED ALERTS', 'DAY-ONE READY'],
    metric: { value: '~20 min', label: 'of manual HR and IT setup eliminated per new hire (estimated)' },
    challenge:
      'New-hire setup meant HR, IT, and the hiring manager each doing their own manual steps in different tools, with no safeguard against a resubmitted request creating a second employee record.',
    howItsBuilt: [
      { title: 'New Hire Intake', body: "A manager's new-hire form triggers the workflow and normalizes the submitted data." },
      { title: 'Duplicate Check', body: 'BambooHR is checked by email before creating anything. An existing match notifies HR instead of creating a second employee record.' },
      { title: 'Employee Record', body: 'A fresh employee record is created in BambooHR the moment the duplicate check clears.' },
      { title: 'Onboarding Checklist', body: 'A Trello card and checklist are built for the new hire automatically, due the day before their start date.' },
      { title: 'Department Routing', body: 'IT provisioning and the hiring manager each get their own distinct Slack notification instead of one combined ping.' },
      { title: 'Dashboard & Welcome', body: 'The hire is logged to the ops dashboard in Google Sheets and sent a welcome email to close the loop.' },
    ],
    image: '/projects/hire-to-onboard-workflow.png',
  },
  {
    id: 'resume-screening-automation',
    title: 'AI Resume Screening with Human-Approved Candidate Routing',
    stack: 'n8n + Groq + Trello + Slack',
    description:
      'Screens inbound applications by resume content, logs every applicant for audit purposes, and only sends a candidate a scheduling link after a recruiter approves them in Slack.',
    outcome: 'Every application is parsed, tracked, and routed to the right hiring manager, with no auto-rejection ever happening without a human sign-off.',
    badges: ['HUMAN-APPROVED ROUTING', 'FULL AUDIT TRAIL', 'COST-CONTROLLED AI'],
    metric: { value: '100%', label: 'of applications logged for audit, regardless of outcome' },
    challenge:
      'Incoming applications had no consistent screening or tracking, so resumes were read ad hoc, valid candidates could be missed, and there was no record of who was screened out or why.',
    howItsBuilt: [
      { title: 'Application Intake', body: 'A Gmail trigger catches new applications. Emails with no resume attachment skip the AI step entirely to control cost.' },
      { title: 'AI Resume Parsing', body: "A Groq-backed model extracts the candidate's details and role fit from the resume, returned as structured data." },
      { title: 'Audit Logging', body: 'Every parsed application is logged to a Candidates sheet regardless of outcome, valid or not.' },
      { title: 'Pipeline Card & Routing', body: "Valid resumes get a card on a Trello recruiting board and route to the right hiring manager's Slack channel by role." },
      { title: 'Human Approval Gate', body: 'A recruiter is asked to Approve or hold each candidate directly in Slack. Nothing moves forward, or gets rejected, without that human decision.' },
      { title: 'Scheduling & Decision Log', body: 'Approved candidates receive an interview scheduling email and move to Interview Scheduled on the Trello board; declined candidates are logged and moved to Not Moving Forward.' },
    ],
    image: '/projects/resume-screening-workflow.png',
  },
  {
    id: 'lead-management',
    title: 'Real Estate Lead Enrichment & Pipeline Automation (GHL replicate)',
    stack: 'n8n + Google Gemini',
    description:
      'End-to-end pipeline ingesting leads via webhooks, enriching and scoring with Gemini, then routing through conditional outreach and Slack alerts.',
    outcome: 'Faster lead response and full pipeline visibility.',
    badges: ['AI LEAD SCORING', 'FULL PIPELINE VISIBILITY'],
    metric: { value: 'Hours → minutes', label: 'estimated lead response time once a lead is AI-scored' },
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
    metric: { value: '~1 min', label: 'estimated logging time per expense, down from a manual spreadsheet entry' },
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
    metric: { value: '5 stages', label: 'of the client lifecycle automated end-to-end from one status change' },
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
    metric: { value: '22 nodes', label: 'replicating the same 5-stage lifecycle with zero Zapier dependency' },
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
    metric: { value: '24/7', label: 'phone coverage, including after-hours calls that used to go unanswered' },
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
    metric: { value: 'Seconds', label: 'to correctly file a new document, down from manual, ad hoc sorting' },
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
