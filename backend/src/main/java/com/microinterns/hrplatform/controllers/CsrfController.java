package com.microinterns.hrplatform.controllers;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class CsrfController {

    @GetMapping("/csrf-token")
    public Map<String, String> csrf(HttpServletRequest request) {
        CsrfToken token = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        Map<String, String> m = new HashMap<>();
        if (token != null) {
            m.put("token", token.getToken());
            m.put("headerName", token.getHeaderName());
            m.put("parameterName", token.getParameterName());
        }
        return m;
    }
}
