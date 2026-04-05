package com.microinterns.hrplatform.models;
import jakarta.persistence.*;

@Entity
@Table(name = "cases")
public class Case {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Student student;

    @ManyToOne
    private HRUser owner;

    @ManyToOne
    private HRUser reassignedTo; // Nullable

    @Enumerated(EnumType.STRING)
    private CaseStatus status;

    // enterprise-level internship fields
    private String role; // role/title during internship
    private String companyAssignment; // the company/team assignment
    private String mentorName;
    private String startDate; // ISO date
    private String endDate; // ISO date
    private Integer hoursPerWeek;
    private String deliverables; // short description
    private Double evaluationScore; // e.g., 0.0 - 10.0
    private String feedback;

    public enum CaseStatus {
        PENDING, ACTIVE, COMPLETED, VERIFIED
    }
    // getters/setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public HRUser getOwner() {
        return owner;
    }

    public void setOwner(HRUser owner) {
        this.owner = owner;
    }

    public HRUser getReassignedTo() {
        return reassignedTo;
    }

    public void setReassignedTo(HRUser reassignedTo) {
        this.reassignedTo = reassignedTo;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCompanyAssignment() {
        return companyAssignment;
    }

    public void setCompanyAssignment(String companyAssignment) {
        this.companyAssignment = companyAssignment;
    }

    public String getMentorName() {
        return mentorName;
    }

    public void setMentorName(String mentorName) {
        this.mentorName = mentorName;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Integer getHoursPerWeek() {
        return hoursPerWeek;
    }

    public void setHoursPerWeek(Integer hoursPerWeek) {
        this.hoursPerWeek = hoursPerWeek;
    }

    public String getDeliverables() {
        return deliverables;
    }

    public void setDeliverables(String deliverables) {
        this.deliverables = deliverables;
    }

    public Double getEvaluationScore() {
        return evaluationScore;
    }

    public void setEvaluationScore(Double evaluationScore) {
        this.evaluationScore = evaluationScore;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}