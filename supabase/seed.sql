-- EMPOWERRURAL Supabase PostgreSQL Seed Script
-- Location: supabase/seed.sql

-- ==========================================
-- 1. SEED STATES & DISTRICTS
-- ==========================================
INSERT INTO states (id, name) VALUES
(1, 'Andhra Pradesh'),
(2, 'Telangana'),
(3, 'Maharashtra'),
(4, 'Uttar Pradesh'),
(5, 'Bihar'),
(6, 'Rajasthan')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO districts (state_id, name) VALUES
(1, 'Visakhapatnam'), (1, 'Guntur'), (1, 'Kurnool'), (1, 'Anantapur'),
(2, 'Hyderabad'), (2, 'Warangal'), (2, 'Nizamabad'), (2, 'Khammam'),
(3, 'Pune'), (3, 'Nagpur'), (3, 'Nashik'), (3, 'Aurangabad'),
(4, 'Lucknow'), (4, 'Kanpur'), (4, 'Varanasi'), (4, 'Gorakhpur'),
(5, 'Patna'), (5, 'Gaya'), (5, 'Muzaffarpur'), (5, 'Bhagalpur'),
(6, 'Jaipur'), (6, 'Jodhpur'), (6, 'Kota'), (6, 'Udaipur')
ON CONFLICT (state_id, name) DO NOTHING;

-- ==========================================
-- 2. SEED SKILLS
-- ==========================================
INSERT INTO skills (name, category) VALUES
('Python Programming', 'Technical'),
('Web Development (HTML/CSS/JS)', 'Technical'),
('Data Entry & Office Excel', 'Technical'),
('Digital Marketing & Social Media', 'Technical'),
('House Wiring & Electrician', 'Manual'),
('Basic Plumbing', 'Manual'),
('Tailoring & Pattern Designing', 'Manual'),
('Spoken English & Communication', 'Soft Skill'),
('Customer Relationship Management', 'Soft Skill'),
('Organic Farming & Crop Management', 'Agriculture')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category;

-- ==========================================
-- 3. SEED QUIZ QUESTIONS
-- ==========================================
INSERT INTO quiz_questions (question, options) VALUES
('What kind of work environment sounds most exciting to you?', '[
  {"text": "Designing websites and writing code on a computer", "scoreMap": {"engineering": 3, "private": 2}},
  {"text": "Working in a local school teaching children", "scoreMap": {"teaching": 3}},
  {"text": "Consulting farmers on improving crop yields using technology", "scoreMap": {"agriculture": 3, "skill_based": 1}},
  {"text": "Serving in public administration or gram panchayat offices", "scoreMap": {"government": 3}},
  {"text": "Setting up an independent tailoring or electrical workshop", "scoreMap": {"skill_based": 3}}
]'),
('When you face a problem, how do you prefer to solve it?', '[
  {"text": "Analyze the math or logic behind it systematically", "scoreMap": {"engineering": 3}},
  {"text": "Discuss and work with others to find a community solution", "scoreMap": {"teaching": 2, "government": 3}},
  {"text": "Use hands-on tools to fix or build physical objects", "scoreMap": {"skill_based": 3}},
  {"text": "Observe nature, soil, or weather patterns to adapt", "scoreMap": {"agriculture": 3}}
]'),
('Which of these subjects did you enjoy or find interesting during school?', '[
  {"text": "Mathematics and Computers", "scoreMap": {"engineering": 3, "private": 2}},
  {"text": "Social Studies and Public Administration", "scoreMap": {"government": 3, "teaching": 1}},
  {"text": "Biology and Environmental Sciences", "scoreMap": {"agriculture": 3}},
  {"text": "Crafts, Drawing, and Vocational Workshops", "scoreMap": {"skill_based": 3}}
]')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 4. SEED INTERVIEW QUESTIONS
-- ==========================================
INSERT INTO interview_questions (category, sub_category, question, hints, sample_answer) VALUES
('hr', 'General', 'Tell me about yourself and your background.', ARRAY['Mention your hometown, school/college education.', 'Talk about your skills and why you applied.'], 'I am a degree graduate from Anantapur district. I have completed a digital marketing certification through Skill India and have strong basic computer skills. I am looking to utilize my communication skills to help local companies expand their digital reach.'),
('hr', 'Behavioral', 'Why do you want to work in your village/district rather than moving to a major metro city?', ARRAY['Emphasize community connection.', 'Discuss local growth opportunities.'], 'I believe rural areas hold immense potential. By staying in my district, I can support local businesses and help bridge the digital gap in our community while remaining close to my family.'),
('technical', 'Data Entry', 'How do you ensure data accuracy when typing large volumes of information in MS Excel?', ARRAY['Mention validation features.', 'Talk about regular audit checks.'], 'I ensure accuracy by using built-in Excel features like Data Validation to restrict inputs. Additionally, I double-check data blocks periodically using formula sum tallies and format checks.'),
('technical', 'Agriculture Tech', 'What is organic farming and what are some common natural fertilizers?', ARRAY['Explain the basic definition.', 'Give examples like compost, vermicompost.'], 'Organic farming is a method that avoids synthetic fertilizers and chemical pesticides. We use natural organic inputs like compost, cow dung manure, vermicompost, and bio-fertilizers to sustain soil health and ecology.')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 5. SEED GOVERNMENT SCHEMES
-- ==========================================
INSERT INTO schemes (name, sponsor, state, category, description, benefits, eligibility, apply_steps, link, is_featured) VALUES
(
  'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
  'central',
  NULL,
  'Skill Development',
  'A flagship skill training initiative providing free vocational courses with industry-standard certification to help youth secure better livelihood opportunities.',
  '100% sponsored course training fees, assessment coverage, transport allowance, and startup kits for selected courses.',
  '{"min_age": 15, "max_age": 45, "qualifications": ["10th Pass", "12th Pass", "ITI Certificate"], "states": []}',
  ARRAY['Visit PMKVY portal', 'Register using Aadhaar card details', 'Select nearest training partner center', 'Enroll in desired course track'],
  'https://www.pmkvyofficial.org/',
  true
),
(
  'Rythu Bandhu Scheme',
  'state',
  'Telangana',
  'Farming Support',
  'Telangana state financial support model assisting farmers with seed, fertilizer, and farm maintenance expenses twice every year.',
  '₹5,000 per acre per season (Kharif and Rabi) deposited directly into farmers bank accounts.',
  '{"min_age": 18, "max_age": 100, "max_income": 1000000, "states": ["Telangana"]}',
  ARRAY['Submit Pattadar Passbook copies to local agricultural officer', 'Submit bank account details', 'Aadhaar verification verification'],
  'http://rythubandhu.telangana.gov.in/',
  false
),
(
  'Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)',
  'central',
  NULL,
  'Skill Development',
  'Placement linked skill training program for rural poor youth to diversify income source for rural families.',
  'Free residential skill coaching, uniforms, books, tablet computers, and guaranteed job interviews.',
  '{"min_age": 15, "max_age": 35, "qualifications": ["10th Pass", "12th Pass"], "states": []}',
  ARRAY['Apply online via Kaushal Bharat portal', 'Meet village volunteer at Gram Panchayat office', 'Verify income cert and Aadhaar card'],
  'http://ddugky.gov.in/',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 6. SEED COURSES
-- ==========================================
INSERT INTO courses (title, provider, category, type, price_type, price, duration, url, description, image_url, certified, syllabus, is_trending) VALUES
(
  'Digital Literacy & Basic Office Suite',
  'Skill India',
  'Digital Marketing',
  'online',
  'free',
  0,
  '4 weeks',
  'https://www.skillindia.gov.in/',
  'Learn basic operations of computers, sending emails, using spreadsheets (MS Excel), creating presentations, and navigating internet banking safely.',
  'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=400&q=80',
  true,
  ARRAY['Introduction to OS', 'MS Word & Text Processing', 'MS Excel Data Structuring', 'Internet and Safe Online Payments'],
  true
),
(
  'Domestic Electrician & House Wiring',
  'PMKVY',
  'Electrician',
  'offline',
  'free',
  0,
  '12 weeks',
  'https://pmkvyofficial.org',
  'Complete hands-on vocational program teaching household wiring, phase lines, transformers, electrical safety protocols, and generator operations.',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
  true,
  ARRAY['Electrical Theory', 'House Circuit Connections', 'Appliance Diagnostics', 'Safety Auditing'],
  false
),
(
  'Introduction to AI and Prompt Engineering',
  'SWAYAM',
  'AI',
  'online',
  'free',
  0,
  '8 weeks',
  'https://swayam.gov.in',
  'Basic introduction to Artificial Intelligence tools like ChatGPT, Claude, and Gemini, explaining how prompt engineering can boost productivity.',
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=400&q=80',
  true,
  ARRAY['AI Fundamentals', 'Large Language Models Overview', 'Structuring Prompts', 'AI for Writing and Analysis'],
  true
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 7. SEED JOBS
-- ==========================================
INSERT INTO jobs (title, company, description, requirements, benefits, salary_range, location_type, type, state, district, qualification, category, apply_url, is_featured) VALUES
(
  'Data Entry Operator',
  'District Collectorate Office',
  'We are hiring an administrative data entry assistant to record regional land records and citizen feedback registries in our district office.',
  ARRAY['Typing speed > 35 WPM', 'Basic understanding of MS Excel', 'High attention to detail'],
  ARRAY['Government employee health benefits', 'Paid holiday calendar', 'PF contribution'],
  '₹18,000 - ₹22,000 / Month',
  'on_site',
  'government',
  'Andhra Pradesh',
  'Visakhapatnam',
  '12th Pass',
  'Data Entry',
  'https://visakhapatnam.ap.gov.in/',
  true
),
(
  'Remote Customer Support Assistant',
  'RuralTech Solutions',
  'Assist rural customers in troubleshooting smartphone applications, e-commerce orders, and banking queries. Fully work-from-home.',
  ARRAY['Excellent spoken Telugu and basic English', 'Must have a working smartphone and broadband connection', 'Patience and polite phone manner'],
  ARRAY['Monthly internet bill allowance', 'Flexible shifting options', 'Skill bonus structures'],
  '₹12,000 - ₹15,000 / Month',
  'remote',
  'remote',
  'Telangana',
  'Hyderabad',
  'Graduate (B.A. / B.Sc. / B.Com.)',
  'Communication',
  'https://ruraltech.co.in/careers',
  true
),
(
  'Apprentice Field Electrician',
  'District Power Supply Corp',
  'Maintain distribution grid networks, residential lines, and fuse systems across selected Gram Panchayats.',
  ARRAY['ITI Electrician trade completion certificate', 'Must own a two-wheeler with valid license', 'Familiar with safety gears'],
  ARRAY['Health and accidental insurance coverage', 'Fuel conveyance benefits'],
  '₹15,000 - ₹18,000 / Month',
  'on_site',
  'private',
  'Maharashtra',
  'Pune',
  'ITI Certificate',
  'Electrician',
  'https://mahadiscom.in/',
  false
)
ON CONFLICT (id) DO NOTHING;
