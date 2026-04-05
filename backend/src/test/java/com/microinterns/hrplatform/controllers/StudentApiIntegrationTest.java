package com.microinterns.hrplatform.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microinterns.hrplatform.models.Student;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class StudentApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // default admin credentials from SecurityConfig
    private final String adminUser = "admin";
    private final String adminPass = "adminpass";

    @Test
    public void getStudents_initiallyEmpty_returnsOkAndArray() throws Exception {
        mockMvc.perform(get("/students").with(httpBasic(adminUser, adminPass)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)));
    }

    @Test
    public void postStudent_thenGet_studentsPersisted() throws Exception {
        Student s = new Student();
        s.setName("Test Student");
        s.setEmail("test@example.com");
        s.setOrg("Acme");
        s.setOnboardingStatus("pending");

        String payload = objectMapper.writeValueAsString(s);

        // POST with CSRF and basic auth
        mockMvc.perform(post("/students")
                        .with(httpBasic(adminUser, adminPass))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Test Student"));

        // GET should return at least one student and include the created one
        mockMvc.perform(get("/students").with(httpBasic(adminUser, adminPass)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[?(@.email=='test@example.com')]").exists());
    }
}
