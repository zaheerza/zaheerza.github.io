/**
 * Central taxonomy definition.
 *
 * Category slugs are the canonical identifiers used in ?cat= URL params,
 * data-cats HTML attributes, and post metadata throughout the site.
 *
 * Authorship tiers:
 *   original  - author's own ideas, voice, and structure; AI used only for light copyediting
 *   assisted  - author's substance; LLM used for structural editing, rewriting, or flow
 *   generated - LLM-drafted from author's prompt/outline; author reviewed and approved
 *
 * Status (digital garden):
 *   seedling  - early, rough, possibly incomplete
 *   growing   - developed but still being revised
 *   evergreen - considered stable
 */

const TAXONOMY = {
  groups: [
    {
      label: 'Professional',
      categories: [
        {
          slug: 'ai-and-machine-learning',
          label: 'AI & Machine Learning',
          description: 'Conceptual, practical, and critical writing on artificial intelligence: how it works, what it means, and where it is going.',
          subcategories: [
            'AI Fundamentals',
            'Large Language Models',
            'Agents and Agentic Systems',
            'AI Product Management',
            'AI and Society',
            'Tools and Workflows',
          ],
        },
        {
          slug: 'crm-and-salesforce',
          label: 'CRM & Salesforce',
          description: 'Enterprise CRM strategy, Salesforce platform specifics, and the intersection of AI with relationship management in financial services.',
          subcategories: [
            'CRM Strategy',
            'Salesforce Platform',
            'Financial Services CRM',
            'Product Ownership',
            'CRM Futures',
          ],
        },
        {
          slug: 'saas-and-product-thinking',
          label: 'SaaS & Product Thinking',
          description: 'The software industry at large, product management craft, and the structural forces reshaping how software is built and sold.',
          subcategories: [
            'SaaS Economics',
            'Product Management',
            'Platform Strategy',
            'Industry Analysis',
          ],
        },
      ],
    },
    {
      label: 'Ideas',
      categories: [
        {
          slug: 'islamic-theology',
          label: 'Islamic Theology & Intellectual History',
          description: 'Engagement with Islamic scripture, classical scholarship, and the intersection of Islamic thought with philosophy, modernity, and comparative religion.',
          subcategories: [
            'Quranic Study',
            'Comparative Religion',
            'Islamic Intellectual Tradition',
            'Islam and Modernity',
          ],
        },
        {
          slug: 'philosophy',
          label: 'Philosophy & Intellectual History',
          description: 'Ideas from the Western and broader philosophical canon, the history of thought, and the intellectual frameworks that shape how we interpret the present.',
          subcategories: [
            'Philosophy of Technology',
            'Epistemology and Truth',
            'Philosophy of Mind',
            'Intellectual History',
          ],
        },
        {
          slug: 'writing-and-craft',
          label: 'Writing, Language & Craft',
          description: 'The practice of writing, the mechanics of language, literary technique, and the development of a personal voice.',
          subcategories: [
            'Writing Voice',
            'Grammar and Rhetoric',
            'Vocabulary',
            'Reading and Influences',
          ],
        },
      ],
    },
    {
      label: 'Personal',
      categories: [
        {
          slug: 'canadian-finance',
          label: 'Canadian Finance & Personal Finance',
          description: 'Financial concepts grounded in the Canadian context: investment, tax-advantaged accounts, mortgage strategy, and the financial services industry.',
          subcategories: [
            'Investment Strategy',
            'Mortgage and Real Estate',
            'TFSA / RRSP / FHSA',
            'Industry and Regulation',
          ],
        },
        {
          slug: 'side-projects',
          label: 'Side Projects & Building',
          description: 'Documentation of, and reflection on, building things: directories, tools, pipelines, apps. Building in public.',
          subcategories: [
            'Halal Directory',
            'Python and Data',
            'Building in Public',
            'Business and Entrepreneurship',
          ],
        },
        {
          slug: 'notes',
          label: 'Miscellaneous & Atomic Notes',
          description: 'Short-form fragments, observations, and notes that are intentionally brief or not yet fully formed. The digital garden layer.',
          subcategories: [],
        },
      ],
    },
  ],

  authorship: {
    original:  { label: '',                              display: null },
    assisted:  { label: 'AI-assisted editing',           display: 'assisted' },
    generated: { label: 'AI-generated draft, author-reviewed', display: 'generated' },
  },

  status: {
    seedling: { label: 'Seedling', description: 'Early, rough, possibly incomplete' },
    growing:  { label: 'Growing',  description: 'Developed but still being revised' },
    evergreen:{ label: 'Evergreen',description: 'Considered stable' },
  },
};

// Post metadata registry
const POSTS = [
  { slug: 'saas-incumbents-dilemma-conversational-ai-vs-web-forms',   category: 'ai-and-machine-learning',   subcategory: 'AI and Society',          authorship: 'assisted',  status: 'evergreen', date: '2026-02-24' },
  { slug: 'chat-first-crm-with-claude-and-mcp',                       category: 'ai-and-machine-learning',   subcategory: 'Agents and Agentic Systems', authorship: 'assisted', status: 'growing',   date: '2025-06-19' },
  { slug: 'ai-and-big-data-machine-decision-making-ethics',            category: 'ai-and-machine-learning',   subcategory: 'AI and Society',          authorship: 'original',  status: 'evergreen', date: '2021-07-31' },
  { slug: 'ai-pattern-recognition-and-algorithmic-diagnosis',          category: 'ai-and-machine-learning',   subcategory: 'AI Fundamentals',         authorship: 'original',  status: 'growing',   date: '2018-09-26' },
  { slug: 'beyond-badge-hunting-real-salesforce-skills-from-trailhead', category: 'crm-and-salesforce',       subcategory: 'Salesforce Platform',     authorship: 'original',  status: 'evergreen', date: '2022-10-16' },
  { slug: 'salesforce-einstein-automated-contacts',                    category: 'crm-and-salesforce',        subcategory: 'Salesforce Platform',     authorship: 'original',  status: 'evergreen', date: '2017-06-28' },
  { slug: 'salesforce-pipeline-leak-analysis-opportunity-history-reports', category: 'crm-and-salesforce',   subcategory: 'Salesforce Platform',     authorship: 'original',  status: 'evergreen', date: '2022-02-25' },
  { slug: 'salesforce-report-formulas-parentgroupval-vs-prevgroupval', category: 'crm-and-salesforce',        subcategory: 'Salesforce Platform',     authorship: 'original',  status: 'evergreen', date: '2024-06-29' },
  { slug: 'nine-questions-for-crm-go-live',                            category: 'crm-and-salesforce',        subcategory: 'CRM Strategy',            authorship: 'original',  status: 'evergreen', date: '2015-01-11' },
  { slug: 'crm-as-a-navigation-system-ten-benefits-for-sales-teams',   category: 'crm-and-salesforce',        subcategory: 'CRM Strategy',            authorship: 'original',  status: 'evergreen', date: '2011-10-08' },
  { slug: 'crm-implementation-checklist',                              category: 'crm-and-salesforce',        subcategory: 'CRM Strategy',            authorship: 'original',  status: 'evergreen', date: '2018-03-26' },
  { slug: 'crm-platform-showdown-salesforce-dynamics-oracle-sap-sugarcrm', category: 'crm-and-salesforce',   subcategory: 'CRM Strategy',            authorship: 'assisted',  status: 'evergreen', date: '2012-06-01' },
  { slug: 'two-decades-of-salesforce-enterprise-crm-product-ownership', category: 'crm-and-salesforce',      subcategory: 'Product Ownership',       authorship: 'original',  status: 'evergreen', date: '2022-11-07' },
  { slug: 'change-management-for-saas-rolling-releases',               category: 'crm-and-salesforce',        subcategory: 'Product Ownership',       authorship: 'original',  status: 'evergreen', date: '2010-04-20' },
  { slug: 'five-questions-before-choosing-a-saas-provider',            category: 'saas-and-product-thinking', subcategory: 'SaaS Economics',          authorship: 'original',  status: 'evergreen', date: '2009-04-26' },
  { slug: 'gartner-on-cloud-strategy-spotting-cloud-washing',          category: 'saas-and-product-thinking', subcategory: 'Industry Analysis',       authorship: 'original',  status: 'growing',   date: '2011-10-18' },
  { slug: 'saas-adoption-barriers-south-africa',                       category: 'saas-and-product-thinking', subcategory: 'SaaS Economics',          authorship: 'original',  status: 'growing',   date: '2011-08-24' },
  { slug: 'saas-vs-on-premise-total-cost-of-ownership',                category: 'saas-and-product-thinking', subcategory: 'SaaS Economics',          authorship: 'original',  status: 'evergreen', date: '2009-04-15' },
  { slug: 'the-case-against-native-mobile-apps',                       category: 'saas-and-product-thinking', subcategory: 'Platform Strategy',       authorship: 'original',  status: 'growing',   date: '2011-08-12' },
  { slug: 'the-race-to-zero-digital-advertising-revenue-collapse',     category: 'saas-and-product-thinking', subcategory: 'Industry Analysis',       authorship: 'original',  status: 'growing',   date: '2016-04-25' },
  { slug: 'the-unicorn-paradox-uber-billion-dollar-business-without-profit', category: 'saas-and-product-thinking', subcategory: 'SaaS Economics',    authorship: 'original',  status: 'growing',   date: '2019-01-14' },
  { slug: 'when-your-saas-vendor-pulls-the-plug',                      category: 'saas-and-product-thinking', subcategory: 'SaaS Economics',          authorship: 'original',  status: 'evergreen', date: '2013-11-11' },
  { slug: 'why-our-brains-resist-innovation',                          category: 'philosophy',                subcategory: 'Epistemology and Truth',  authorship: 'original',  status: 'growing',   date: '2015-06-11' },
  { slug: 'popi-act-compliance-for-cloud-computing',                   category: 'saas-and-product-thinking', subcategory: 'Industry Analysis',       authorship: 'original',  status: 'growing',   date: '2011-12-19' },
  { slug: 'leadership-aikido-from-command-and-control-to-harmonious-leadership', category: 'notes',           subcategory: null,                      authorship: 'original',  status: 'seedling',  date: '2017-11-08' },
  { slug: 'it-is-what-it-is-on-policy-failure-and-accountability',     category: 'notes',                     subcategory: null,                      authorship: 'original',  status: 'seedling',  date: '2022-01-18' },
  { slug: 'why-listicles-are-the-fast-food-of-ideas',                  category: 'writing-and-craft',         subcategory: 'Writing Voice',           authorship: 'original',  status: 'growing',   date: '2022-01-11' },
  { slug: 'culture-eats-strategy-organisation-change',                  category: 'crm-and-salesforce',        subcategory: 'CRM Strategy',            authorship: 'original',  status: 'growing',   date: '2017-03-04' },
];
