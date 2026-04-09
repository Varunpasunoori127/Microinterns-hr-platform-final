package com.microinterns.hrplatform.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= BASIC =================
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    // ================= PERSONAL =================
    private String phone;
    private String dob;
    private String nationality;
    private String gender;

    // ================= ADDRESS =================
    private String address;
    private String city;
    private String postcode;

    // ================= EDUCATION =================
    private String university;
    private String course;
    private String year;
    private String educationDetails;

    // ================= WORK =================
    private String rightToWork;
    private String workExperience;

    // ================= EMERGENCY =================
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;

    // ================= BANK =================
    private String bankName;
    private String bankAccountNumber;
    private String sortCode;
    private String ifscCode;

    // ================= SYSTEM =================
    @Column(unique = true)
    private String onboardingToken;

    private LocalDateTime tokenExpiryDate;

    private Boolean onboardingCompleted = false;

    private String onboardingStatus;

    // ================= MENTOR =================
    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private Mentor mentor;

    // ================= GETTERS & SETTERS =================

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostcode() { return postcode; }
    public void setPostcode(String postcode) { this.postcode = postcode; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getEducationDetails() { return educationDetails; }
    public void setEducationDetails(String educationDetails) { this.educationDetails = educationDetails; }

    public String getRightToWork() { return rightToWork; }
    public void setRightToWork(String rightToWork) { this.rightToWork = rightToWork; }

    public String getWorkExperience() { return workExperience; }
    public void setWorkExperience(String workExperience) { this.workExperience = workExperience; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }

    public String getEmergencyContactRelation() { return emergencyContactRelation; }
    public void setEmergencyContactRelation(String emergencyContactRelation) { this.emergencyContactRelation = emergencyContactRelation; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }

    public String getSortCode() { return sortCode; }
    public void setSortCode(String sortCode) { this.sortCode = sortCode; }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    public String getOnboardingToken() { return onboardingToken; }

    public Boolean getOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(Boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }

    public String getOnboardingStatus() { return onboardingStatus; }
    public void setOnboardingStatus(String onboardingStatus) { this.onboardingStatus = onboardingStatus; }

    public Mentor getMentor() { return mentor; }
    public void setMentor(Mentor mentor) { this.mentor = mentor; }

    // ================= TOKEN =================

    public void generateOnboardingToken() {
        this.onboardingToken = UUID.randomUUID().toString();
        this.tokenExpiryDate = LocalDateTime.now().plusDays(7);
    }

    public boolean isTokenValid() {
        return onboardingToken != null &&
               tokenExpiryDate != null &&
               LocalDateTime.now().isBefore(tokenExpiryDate) &&
               !Boolean.TRUE.equals(onboardingCompleted);
    }
}