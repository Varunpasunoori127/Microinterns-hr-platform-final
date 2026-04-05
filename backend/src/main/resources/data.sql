-- =========================
-- STUDENTS (NO MANUAL ID)
-- =========================

INSERT INTO student (
  name, email, org, onboarding_status,
  onboarding_token, token_expiry_date,
  onboarding_completed, agreement_accepted
) VALUES
('Alice', 'alice@example.com', 'Acme', 'IN_PROGRESS', 'test-token-alice', DATEADD(DAY, 7, CURRENT_TIMESTAMP), FALSE, FALSE),
('Bob', 'bob@example.com', 'Acme', 'PENDING', 'test-token-bob', DATEADD(DAY, 7, CURRENT_TIMESTAMP), FALSE, FALSE),
('Charlie', 'charlie@example.com', 'AgriCorp', 'PENDING', 'test-token-charlie', DATEADD(DAY, 7, CURRENT_TIMESTAMP), FALSE, FALSE),
('Diana', 'diana@example.com', 'BizGroup', 'PENDING', 'test-token-diana', DATEADD(DAY, 7, CURRENT_TIMESTAMP), FALSE, FALSE);

-- =========================
-- STUDENT SKILLS TABLE
-- =========================

CREATE TABLE IF NOT EXISTS student_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
(2, 'Communication', 'Advanced'),

(3, 'Crop Management', 'Advanced'),
(3, 'Soil Analysis', 'Intermediate'),
(3, 'Agricultural Technology', 'Beginner'),
(3, 'Irrigation Systems', 'Intermediate'),
(3, 'Sustainability Practices', 'Advanced'),

(4, 'Project Management', 'Advanced'),
(4, 'Marketing', 'Intermediate'),
(4, 'Financial Planning', 'Beginner'),
(4, 'Leadership', 'Advanced'),
(4, 'Strategic Thinking', 'Intermediate');

-- =========================
-- MENTORS TABLE (NO MANUAL ID)
-- =========================

CREATE TABLE IF NOT EXISTS mentors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    expertise VARCHAR(100)
);

INSERT INTO mentors (name, expertise) VALUES
('Dr Smith', 'Artificial Intelligence'),
('Dr Lee', 'Backend Development'),
('Dr Patel', 'Data Science'),
('Dr Green', 'Agriculture'),
('Dr Brown', 'Business Strategy');

-- =========================
-- MENTOR SKILLS TABLE
-- =========================

CREATE TABLE IF NOT EXISTS mentor_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mentor_id INT,
    skill VARCHAR(100)
);

INSERT INTO mentor_skills (mentor_id, skill) VALUES
(1, 'Python'),
(1, 'Machine Learning'),
(1, 'Data Analysis'),

(2, 'Java'),
(2, 'Spring Boot'),
(2, 'SQL'),

(3, 'Python'),
(3, 'Data Analysis'),
(3, 'Statistics'),

(4, 'Crop Management'),
(4, 'Soil Analysis'),
(4, 'Sustainability Practices'),

(5, 'Marketing'),
(5, 'Leadership'),
(5, 'Strategic Thinking');