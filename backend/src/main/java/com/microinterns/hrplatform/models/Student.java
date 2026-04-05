package com.microinterns.hrplatform.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.UUID;

// 🔥 IMPORTANT IMPORT
import com.microinterns.hrplatform.models.Mentor;

@Entity
@Table(name = "student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    private String org;
    private String phone;
    private String address;
    private String dob;
    private Boolean agreementAccepted = false;
    private String resumeFilename;
    private String onboardingStatus;

    // Onboarding token
    @Column(unique = true)
    private String onboardingToken;
    private LocalDateTime tokenExpiryDate;
    private Boolean onboardingCompleted = false;

    // Education details
    @Lob
    @Column(columnDefinition = "TEXT")
    private String educationDetails;

    // Work experience
    @Lob
    @Column(columnDefinition = "TEXT")
    private String workExperience;

    // Documents
    @Lob
    @Column(columnDefinition = "TEXT")
    private String documents;

    // Emergency contact
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;

    // Government IDs
    private String nationalIdNumber;
    private String passportNumber;

    // Bank details
    private String bankAccountNumber;
    private String bankName;
    private String ifscCode;

    // 🔥 NEW: Mentor Assignment
    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private Mentor mentor;

    // ================= GETTERS & SETTERS =================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOrg() { return org; }
    public void setOrg(String org) { this.org = org; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public Boolean getAgreementAccepted() { return agreementAccepted; }
    public void setAgreementAccepted(Boolean agreementAccepted) { this.agreementAccepted = agreementAccepted; }

    public String getResumeFilename() { return resumeFilename; }
    public void setResumeFilename(String resumeFilename) { this.resumeFilename = resumeFilename; }

    public String getOnboardingStatus() { return onboardingStatus; }
    public void setOnboardingStatus(String onboardingStatus) { this.onboardingStatus = onboardingStatus; }

    public String getOnboardingToken() { return onboardingToken; }
    public void setOnboardingToken(String onboardingToken) { this.onboardingToken = onboardingToken; }

    public LocalDateTime getTokenExpiryDate() { return tokenExpiryDate; }
    public void setTokenExpiryDate(LocalDateTime tokenExpiryDate) { this.tokenExpiryDate = tokenExpiryDate; }

    public Boolean getOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(Boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }

    public String getEducationDetails() { return educationDetails; }
    public void setEducationDetails(String educationDetails) { this.educationDetails = educationDetails; }

    public String getWorkExperience() { return workExperience; }
    public void setWorkExperience(String workExperience) { this.workExperience = workExperience; }

    public String getDocuments() { return documents; }
    public void setDocuments(String documents) { this.documents = documents; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }

    public String getEmergencyContactRelation() { return emergencyContactRelation; }
    public void setEmergencyContactRelation(String emergencyContactRelation) { this.emergencyContactRelation = emergencyContactRelation; }

    public String getNationalIdNumber() { return nationalIdNumber; }
    public void setNationalIdNumber(String nationalIdNumber) { this.nationalIdNumber = nationalIdNumber; }

    public String getPassportNumber() { return passportNumber; }
    public void setPassportNumber(String passportNumber) { this.passportNumber = passportNumber; }

    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    // 🔥 NEW: Mentor Getter/Setter
    public Mentor getMentor() { return mentor; }
    public void setMentor(Mentor mentor) { this.mentor = mentor; }

    // ================= UTILITY METHODS =================

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