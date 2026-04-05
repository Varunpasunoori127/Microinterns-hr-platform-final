-- SQL seed script for local H2 testing (manual run via H2 console or tools)

-- Students
INSERT INTO student (id, name, email, org, onboarding_status) VALUES (1, 'Alice', 'alice@example.com', 'Acme', 'IN_PROGRESS');
INSERT INTO student (id, name, email, org, onboarding_status) VALUES (2, 'Bob', 'bob@example.com', 'Acme', 'PENDING');

-- HR users
INSERT INTO hr_user (id, email, name, role) VALUES (1, 'hr1@example.com', 'HR1', 'HR');
INSERT INTO hr_user (id, email, name, role) VALUES (2, 'admin@example.com', 'AdminUser', 'Admin');

-- Cases
INSERT INTO cases (id, student_id, owner_id, status) VALUES (1, 1, 1, 'ACTIVE');
INSERT INTO cases (id, student_id, owner_id, status) VALUES (2, 2, 1, 'PENDING');
