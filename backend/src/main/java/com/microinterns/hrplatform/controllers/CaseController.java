package com.microinterns.hrplatform.controllers;

import com.microinterns.hrplatform.models.Case;
import com.microinterns.hrplatform.services.CaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cases")
public class CaseController {

    @Autowired
    private CaseService caseService;

    @PostMapping("/{caseId}/reassign")
    public Case reassignCase(@PathVariable Long caseId, @RequestParam Long hrUserId) {
        return caseService.reassignCase(caseId, hrUserId);
    }
}