#!/usr/bin/env python3
"""Update all HTML files with new taxonomy and authorship classification."""

import os
import re

POSTS_DIR = '/home/user/zaheerza.github.io/posts'
INDEX_FILE = '/home/user/zaheerza.github.io/index.html'

# ── Per-post metadata ─────────────────────────────────────────────────────────
POST_META = {
    'saas-incumbents-dilemma-conversational-ai-vs-web-forms': {
        'category': 'ai-and-machine-learning',
        'label': 'AI &amp; Machine Learning',
        'subcategory': 'AI and Society',
        'authorship': 'assisted',
        'status': 'evergreen',
    },
    'chat-first-crm-with-claude-and-mcp': {
        'category': 'ai-and-machine-learning',
        'label': 'AI &amp; Machine Learning',
        'subcategory': 'Agents and Agentic Systems',
        'authorship': 'assisted',
        'status': 'growing',
    },
    'ai-and-big-data-machine-decision-making-ethics': {
        'category': 'ai-and-machine-learning',
        'label': 'AI &amp; Machine Learning',
        'subcategory': 'AI and Society',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'ai-pattern-recognition-and-algorithmic-diagnosis': {
        'category': 'ai-and-machine-learning',
        'label': 'AI &amp; Machine Learning',
        'subcategory': 'AI Fundamentals',
        'authorship': 'original',
        'status': 'growing',
    },
    'beyond-badge-hunting-real-salesforce-skills-from-trailhead': {
        'category': 'crm-and-salesforce',
        'label': 'CRM &amp; Salesforce',
        'subcategory': 'Salesforce Platform',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'salesforce-einstein-automated-contacts': {
        'category': 'crm-and-salesforce',
        'label': 'CRM &amp; Salesforce',
        'subcategory': 'Salesforce Platform',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'salesforce-pipeline-leak-analysis-opportunity-history-reports': {
        'category': 'crm-and-salesforce',
        'label': 'CRM &amp; Salesforce',
        'subcategory': 'Salesforce Platform',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'salesforce-report-formulas-parentgroupval-vs-prevgroupval': {
        'category': 'crm-and-salesforce',
        'label': 'CRM &amp; Salesforce',
        'subcategory': 'Salesforce Platform',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'nine-questions-for-crm-go-live': {
        'category': 'crm-and-salesforce',
        'label': 'CRM &amp; Salesforce',
        'subcategory': 'CRM Strategy',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'crm-as-a-navigation-system-ten-benefits-for-sales-teams': {
        'category': 'crm-and-salesforce',
        'label': 'CRM &amp; Salesforce',
        'subcategory': 'CRM Strategy',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'crm-implementation-checklist': {
        'category': 'crm-and-salesforce',
        'label': 'CRM &amp; Salesforce',
        'subcategory': 'CRM Strategy',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'crm-platform-showdown-salesforce-dynamics-oracle-sap-sugarcrm': {
        'category': 'crm-and-salesforce',
        'label': 'CRM &amp; Salesforce',
        'subcategory': 'CRM Strategy',
        'authorship': 'assisted',
        'status': 'evergreen',
    },
    'two-decades-of-salesforce-enterprise-crm-product-ownership': {
        'category': 'crm-and-salesforce',
        'label': 'CRM &amp; Salesforce',
        'subcategory': 'Product Ownership',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'change-management-for-saas-rolling-releases': {
        'category': 'crm-and-salesforce',
        'label': 'CRM &amp; Salesforce',
        'subcategory': 'Product Ownership',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'five-questions-before-choosing-a-saas-provider': {
        'category': 'saas-and-product-thinking',
        'label': 'SaaS &amp; Product Thinking',
        'subcategory': 'SaaS Economics',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'gartner-on-cloud-strategy-spotting-cloud-washing': {
        'category': 'saas-and-product-thinking',
        'label': 'SaaS &amp; Product Thinking',
        'subcategory': 'Industry Analysis',
        'authorship': 'original',
        'status': 'growing',
    },
    'saas-adoption-barriers-south-africa': {
        'category': 'saas-and-product-thinking',
        'label': 'SaaS &amp; Product Thinking',
        'subcategory': 'SaaS Economics',
        'authorship': 'original',
        'status': 'growing',
    },
    'saas-vs-on-premise-total-cost-of-ownership': {
        'category': 'saas-and-product-thinking',
        'label': 'SaaS &amp; Product Thinking',
        'subcategory': 'SaaS Economics',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'the-case-against-native-mobile-apps': {
        'category': 'saas-and-product-thinking',
        'label': 'SaaS &amp; Product Thinking',
        'subcategory': 'Platform Strategy',
        'authorship': 'original',
        'status': 'growing',
    },
    'the-race-to-zero-digital-advertising-revenue-collapse': {
        'category': 'saas-and-product-thinking',
        'label': 'SaaS &amp; Product Thinking',
        'subcategory': 'Industry Analysis',
        'authorship': 'original',
        'status': 'growing',
    },
    'the-unicorn-paradox-uber-billion-dollar-business-without-profit': {
        'category': 'saas-and-product-thinking',
        'label': 'SaaS &amp; Product Thinking',
        'subcategory': 'SaaS Economics',
        'authorship': 'original',
        'status': 'growing',
    },
    'when-your-saas-vendor-pulls-the-plug': {
        'category': 'saas-and-product-thinking',
        'label': 'SaaS &amp; Product Thinking',
        'subcategory': 'SaaS Economics',
        'authorship': 'original',
        'status': 'evergreen',
    },
    'why-our-brains-resist-innovation': {
        'category': 'philosophy',
        'label': 'Philosophy',
        'subcategory': 'Epistemology and Truth',
        'authorship': 'original',
        'status': 'growing',
    },
    'popi-act-compliance-for-cloud-computing': {
        'category': 'saas-and-product-thinking',
        'label': 'SaaS &amp; Product Thinking',
        'subcategory': 'Industry Analysis',
        'authorship': 'original',
        'status': 'growing',
    },
    'leadership-aikido-from-command-and-control-to-harmonious-leadership': {
        'category': 'notes',
        'label': 'Notes',
        'subcategory': None,
        'authorship': 'original',
        'status': 'seedling',
    },
    'it-is-what-it-is-on-policy-failure-and-accountability': {
        'category': 'notes',
        'label': 'Notes',
        'subcategory': None,
        'authorship': 'original',
        'status': 'seedling',
    },
    'why-listicles-are-the-fast-food-of-ideas': {
        'category': 'writing-and-craft',
        'label': 'Writing &amp; Craft',
        'subcategory': 'Writing Voice',
        'authorship': 'original',
        'status': 'growing',
    },
}

# ── Category icon SVG paths ───────────────────────────────────────────────────
CAT_ICONS = {
    'ai-and-machine-learning': '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>',
    'crm-and-salesforce': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    'saas-and-product-thinking': '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
    'philosophy': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    'writing-and-craft': '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    'notes': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'islamic-theology': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'canadian-finance': '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    'side-projects': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
}

def make_svg(cat_id):
    path = CAT_ICONS.get(cat_id, '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" '
            f'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" '
            f'stroke-linejoin="round">{path}</svg>')


# ── Shared HTML snippets ──────────────────────────────────────────────────────

def nav_html(prefix='../'):
    """Generate nav-links HTML. prefix is '../' for posts, '' for root."""
    p = prefix
    return f"""<ul class="nav-links">
      <li><a href="{p}index.html">Home</a></li>
      <li class="dropdown"><a href="#">Professional &#9662;</a>
        <ul class="dropdown-menu">
          <li><a href="{p}index.html?cat=ai-and-machine-learning">AI &amp; Machine Learning</a></li>
          <li><a href="{p}index.html?cat=crm-and-salesforce">CRM &amp; Salesforce</a></li>
          <li><a href="{p}index.html?cat=saas-and-product-thinking">SaaS &amp; Product Thinking</a></li>
        </ul></li>
      <li class="dropdown"><a href="#">Ideas &#9662;</a>
        <ul class="dropdown-menu">
          <li><a href="{p}index.html?cat=islamic-theology">Islamic Theology</a></li>
          <li><a href="{p}index.html?cat=philosophy">Philosophy</a></li>
          <li><a href="{p}index.html?cat=writing-and-craft">Writing &amp; Craft</a></li>
        </ul></li>
      <li class="dropdown"><a href="#">Personal &#9662;</a>
        <ul class="dropdown-menu">
          <li><a href="{p}index.html?cat=canadian-finance">Canadian Finance</a></li>
          <li><a href="{p}index.html?cat=side-projects">Side Projects</a></li>
          <li><a href="{p}index.html?cat=notes">Notes</a></li>
        </ul></li>
      <li><a href="{p}categories.html">All Topics</a></li>
      <li><a href="https://insightment.co.za" target="_blank">About</a></li>
      <li><a href="{p}explore.html" style="color:var(--accent);">Explore &#8599;</a></li>
    </ul>"""


CATEGORIES_WITH_COUNTS = [
    ('ai-and-machine-learning',   'AI &amp; Machine Learning',   4),
    ('crm-and-salesforce',        'CRM &amp; Salesforce',        10),
    ('saas-and-product-thinking', 'SaaS &amp; Product Thinking',  9),
    ('philosophy',                'Philosophy',                    1),
    ('writing-and-craft',         'Writing &amp; Craft',           1),
    ('notes',                     'Notes',                         2),
    ('islamic-theology',          'Islamic Theology',              0),
    ('canadian-finance',          'Canadian Finance',              0),
    ('side-projects',             'Side Projects',                 0),
]


def sidebar_cats_html(prefix='../'):
    """Generate sidebar category list for post pages."""
    items = []
    for slug, label, count in CATEGORIES_WITH_COUNTS:
        items.append(
            f"<li><a href='{prefix}index.html?cat={slug}'>"
            f"{label} <span class='count'>{count}</span></a></li>"
        )
    return '<ul class="cat-list">' + ''.join(items) + '</ul>'


def sidebar_cats_html_index():
    """Generate sidebar category list for index.html (no prefix)."""
    items = []
    for slug, label, count in CATEGORIES_WITH_COUNTS:
        items.append(
            f'        <li><a href="index.html?cat={slug}">'
            f'{label} <span class="count">{count}</span></a></li>'
        )
    return '\n'.join(items)


def tag_cloud_html_index():
    """Generate tag cloud for index.html."""
    items = []
    for slug, label, _ in CATEGORIES_WITH_COUNTS:
        items.append(f'<a href="index.html?cat={slug}">{label}</a>')
    return ''.join(items)


def footer_topics_html(prefix='../'):
    """Generate footer topics list."""
    p = prefix
    return f"""<div>
      <h4>Topics</h4>
      <ul>
        <li><a href="{p}index.html?cat=ai-and-machine-learning">AI &amp; Machine Learning</a></li>
        <li><a href="{p}index.html?cat=crm-and-salesforce">CRM &amp; Salesforce</a></li>
        <li><a href="{p}index.html?cat=saas-and-product-thinking">SaaS &amp; Product Thinking</a></li>
        <li><a href="{p}categories.html">All Topics &rarr;</a></li>
      </ul>
    </div>"""


def authorship_badge_html(authorship):
    """Return HTML for the authorship badge (empty string for 'original')."""
    if authorship == 'assisted':
        return '<span class="authorship-badge assisted">AI-assisted editing</span>'
    elif authorship == 'generated':
        return '<span class="authorship-badge generated">AI-generated draft, author-reviewed</span>'
    return ''


def status_badge_html(status):
    """Return HTML for the status badge (empty string for 'evergreen')."""
    if status == 'seedling':
        return '<span class="status-badge seedling">Seedling</span>'
    elif status == 'growing':
        return '<span class="status-badge growing">Growing</span>'
    return ''


# Additional CSS to inject into every file's <style> block
EXTRA_CSS = """
    .authorship-badge { font-size: .7rem; font-weight: 600; letter-spacing: .03em; padding: .15rem .5rem; border-radius: 4px; }
    .authorship-badge.assisted { color: #d97706; background: #fef3c7; border: 1px solid #fde68a; }
    .authorship-badge.generated { color: #7c3aed; background: #ede9fe; border: 1px solid #ddd6fe; }
    .status-badge { font-size: .65rem; font-weight: 600; letter-spacing: .04em; padding: .15rem .45rem; border-radius: 10px; text-transform: uppercase; }
    .status-badge.seedling { color: #065f46; background: #d1fae5; border: 1px solid #a7f3d0; }
    .status-badge.growing { color: #1e40af; background: #dbeafe; border: 1px solid #bfdbfe; }
    html[data-theme="dark"] .authorship-badge.assisted { color: #fbbf24; background: #451a03; border-color: #92400e; }
    html[data-theme="dark"] .authorship-badge.generated { color: #c4b5fd; background: #2e1065; border-color: #4c1d95; }
    html[data-theme="dark"] .status-badge.seedling { color: #6ee7b7; background: #064e3b; border-color: #065f46; }
    html[data-theme="dark"] .status-badge.growing { color: #93c5fd; background: #1e3a5f; border-color: #1e40af; }"""


# ── Post file updater ─────────────────────────────────────────────────────────

def update_post_file(filepath):
    slug = os.path.basename(filepath).replace('.html', '')
    meta = POST_META.get(slug)
    if not meta:
        print(f'  WARNING: no meta for {slug}')
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Replace nav-links block
    nav_old = re.search(
        r'(<ul class="nav-links">.*?</ul>)(?=\s*\n\s*<div class="nav-search">)',
        html, re.DOTALL
    )
    if nav_old:
        html = html[:nav_old.start()] + nav_html('../') + html[nav_old.end():]
    else:
        print(f'  WARNING: nav not found in {slug}')

    # 2. Replace .post-cats block
    cat_id = meta['category']
    cat_label = meta['label']
    subcat = meta['subcategory']
    svg = make_svg(cat_id)
    if subcat:
        new_post_cats = (
            f'<div class="post-cats">'
            f'<span class="post-cat"><a href="../index.html?cat={cat_id}">'
            f'{svg}{cat_label}</a></span>'
            f'<span class="post-cat">{subcat}</span>'
            f'</div>'
        )
    else:
        new_post_cats = (
            f'<div class="post-cats">'
            f'<span class="post-cat"><a href="../index.html?cat={cat_id}">'
            f'{svg}{cat_label}</a></span>'
            f'</div>'
        )
    html = re.sub(
        r'<div class="post-cats">.*?</div>',
        new_post_cats,
        html, count=1, flags=re.DOTALL
    )

    # 3. Add authorship badge + status to post-meta (only if not already added)
    auth_badge = authorship_badge_html(meta['authorship'])
    stat_badge = status_badge_html(meta['status'])
    badges = (stat_badge + ('&ensp;' if stat_badge and auth_badge else '') + auth_badge)

    if badges and 'authorship-badge' not in html and 'status-badge' not in html:
        # Insert badges right before the closing </div> of post-meta
        html = re.sub(
            r'(<div class="post-meta">)(.*?)(</div>)',
            lambda m: m.group(1) + m.group(2) + '<span class="dot"></span>' + badges + m.group(3),
            html, count=1, flags=re.DOTALL
        )

    # 4. Replace sidebar category list
    old_cat_widget = re.search(
        r'<div class="widget">\s*<h3>Categories</h3>\s*<ul class="cat-list">.*?</ul>\s*</div>',
        html, re.DOTALL
    )
    if old_cat_widget:
        new_widget = (
            '<div class="widget">\n      <h3>Categories</h3>\n      '
            + sidebar_cats_html('../')
            + '\n    </div>'
        )
        html = html[:old_cat_widget.start()] + new_widget + html[old_cat_widget.end():]

    # 5. Replace footer topics block
    old_footer_topics = re.search(
        r'<div>\s*<h4>Topics</h4>.*?</div>',
        html, re.DOTALL
    )
    if old_footer_topics:
        html = html[:old_footer_topics.start()] + footer_topics_html('../') + html[old_footer_topics.end():]

    # 6. Inject extra CSS before closing </style>
    if 'authorship-badge' not in html:
        html = html.replace('  </style>', EXTRA_CSS + '\n  </style>', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'  updated: {slug}')


# ── Index.html updater ────────────────────────────────────────────────────────

# Map each post's href to its new category slug for data-cats
POST_HREF_TO_CAT = {slug + '.html': meta['category'] for slug, meta in POST_META.items()}

def update_index(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Replace nav-links block
    nav_old = re.search(
        r'(<ul class="nav-links">.*?</ul>)(?=\s*\n\s*<div class="nav-search">)',
        html, re.DOTALL
    )
    if nav_old:
        html = html[:nav_old.start()] + nav_html('') + html[nav_old.end():]

    # 2. Update each post-row data-cats attribute based on its link href
    def replace_data_cats(m):
        row_html = m.group(0)
        href_match = re.search(r'href="posts/([^"]+)"', row_html)
        if href_match:
            post_file = href_match.group(1)
            new_cat = POST_HREF_TO_CAT.get(post_file)
            if new_cat:
                row_html = re.sub(r'data-cats="[^"]*"', f'data-cats="{new_cat}"', row_html)
        return row_html

    html = re.sub(
        r'<div class="post-row"[^>]*>.*?(?=<div class="post-row"|</div>\s*</main>)',
        replace_data_cats,
        html, flags=re.DOTALL
    )

    # 3. Also update the card-cat labels in featured cards for the two featured posts
    # Featured: saas-incumbents-dilemma → AI & Machine Learning
    html = html.replace(
        'href="posts/saas-incumbents-dilemma-conversational-ai-vs-web-forms.html"',
        'href="posts/saas-incumbents-dilemma-conversational-ai-vs-web-forms.html"'
    )

    # 4. Replace sidebar categories widget
    old_cat_widget = re.search(
        r'(<div class="widget">\s*<h3>Categories</h3>\s*<ul class="cat-list">).*?(</ul>\s*</div>)',
        html, re.DOTALL
    )
    if old_cat_widget:
        new_list = '\n' + sidebar_cats_html_index() + '\n        '
        html = html[:old_cat_widget.start(1)] + old_cat_widget.group(1) + new_list + old_cat_widget.group(2) + html[old_cat_widget.end(2):]

    # 5. Replace tag cloud
    old_tag_cloud = re.search(
        r'(<div class="tag-cloud">).*?(</div>)',
        html, re.DOTALL
    )
    if old_tag_cloud:
        html = html[:old_tag_cloud.start()] + '<div class="tag-cloud">' + tag_cloud_html_index() + '</div>' + html[old_tag_cloud.end():]

    # 6. Replace footer topics block
    old_footer_topics = re.search(
        r'<div>\s*<h4>Topics</h4>.*?</div>',
        html, re.DOTALL
    )
    if old_footer_topics:
        html = html[:old_footer_topics.start()] + footer_topics_html('') + html[old_footer_topics.end():]

    # 7. Inject extra CSS
    if 'authorship-badge' not in html:
        html = html.replace('  </style>', EXTRA_CSS + '\n  </style>', 1)

    # 8. Update title and description
    html = html.replace(
        '<title>INSIGHTMENT &mdash; Salesforce &amp; CRM Strategy</title>',
        '<title>INSIGHTMENT &mdash; Ideas on AI, CRM, SaaS, Philosophy &amp; More</title>'
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print('  updated: index.html')


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print('Updating post files...')
    for fname in sorted(os.listdir(POSTS_DIR)):
        if fname.endswith('.html'):
            update_post_file(os.path.join(POSTS_DIR, fname))

    print('\nUpdating index.html...')
    update_index(INDEX_FILE)

    print('\nDone.')
