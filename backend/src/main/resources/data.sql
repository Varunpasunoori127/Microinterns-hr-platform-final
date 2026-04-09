-- =========================
-- STUDENTS (POSTGRESQL CLEAN)
-- =========================

INSERT INTO student (
  name,
  email,
  phone,
  dob,
  nationality,
  gender,
  address,
  city,
  postcode,
  university,
  course,
  year,
  education_details,
  right_to_work,
  work_experience,
  emergency_contact_name,
  emergency_contact_phone,
  emergency_contact_relation,
  bank_name,
  bank_account_number,
  sort_code,
  ifsc_code,
  onboarding_status,
  onboarding_token,
  token_expiry_date,
  onboarding_completed
) VALUES
(
  'Alice',
  'alice@example.com',
  '07123456789',
  '2000-01-01',
  'UK',
  'Female',
  '123 Street',
  'London',
  'E1 6AN',
  'Oxford University',
  'Computer Science',
  '3',
  'Final year student',
  'Yes',
  'Internship experience',
  'John Doe',
  '07111111111',
  'Father',
  'HSBC',
  '12345678',
  '12-34-56',
  'IFSC001',
  'IN_PROGRESS',
  'test-token-alice',
  NOW() + INTERVAL '7 days',
  FALSE
),
(
  'Bob',
  'bob@example.com',
  '07234567890',
  '1999-05-10',
  'India',
  'Male',
  '456 Avenue',
  'Manchester',
  'M1 2AB',
  'Manchester University',
  'Data Science',
  '2',
  'Interested in AI',
  'Yes',
  'None',
  'Jane Doe',
  '07222222222',
  'Mother',
  'Barclays',
  '87654321',
  '65-43-21',
  'IFSC002',
  'PENDING',
  'test-token-bob',
  NOW() + INTERVAL '7 days',
  FALSE
);

-- =========================
-- STUDENT SKILLS TABLE
-- =========================

CREATE TABLE IF NOT EXISTS student_skills (
    id SERIAL PRIMARY KEY,
    student_id INT,
    skill VARCHAR(100),
    level VARCHAR(50)
);

-- =========================
-- STUDENT SKILLS DATA
-- =========================

INSERT INTO student_skills (student_id, skill, level) VALUES
(1, 'Java', 'Advanced'),
(1, 'React', 'Intermediate'),
(1, 'SQL', 'Intermediate'),
(1, 'Spring Boot', 'Beginner'),
(1, 'Git', 'Advanced'),

(2, 'Python', 'Intermediate'),
(2, 'Data Analysis', 'Intermediate'),
(2, 'Excel', 'Advanced'),
(2, 'Business Analysis', 'Beginner'),
(2, 'Communication', 'Advanced');

CREATE TABLE IF NOT EXISTS mentors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    expertise VARCHAR(100)
);

INSERT INTO mentors (name, expertise) VALUES
('Dr Smith', 'Artificial Intelligence'),
('Dr Lee', 'Backend Development'),
('Dr Patel', 'Data Science'),
('Dr Green', 'Agriculture'),
('Dr Brown', 'Business Strategy');

CREATE TABLE IF NOT EXISTS mentor_skills (
    id SERIAL PRIMARY KEY,
    mentor_id INT,
    skill VARCHAR(100)
);

INSERT INTO mentor_skills (mentor_id, skill) VALUES
-- Dr Smith (AI)
(1, 'Python'),
(1, 'Machine Learning'),
(1, 'Data Analysis'),

-- Dr Lee (Backend)
(2, 'Java'),
(2, 'Spring Boot'),
(2, 'SQL'),

-- Dr Patel (Data Science)
(3, 'Python'),
(3, 'Data Analysis'),
(3, 'Statistics'),

-- Dr Green (Agriculture)
(4, 'Crop Management'),
(4, 'Soil Analysis'),
(4, 'Sustainability Practices'),

-- Dr Brown (Business)
(5, 'Marketing'),
(5, 'Leadership'),
(5, 'Strategic Thinking');