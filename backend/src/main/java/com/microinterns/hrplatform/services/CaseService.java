package com.microinterns.hrplatform.services;

import com.microinterns.hrplatform.models.Case;
import com.microinterns.hrplatform.repositories.CaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CaseService {
    @Autowired
    private CaseRepository caseRepository;

    public Case reassignCase(Long caseId, Long newOwnerId) {
        // TODO: implement reassignment logic
        return null;
    }
}